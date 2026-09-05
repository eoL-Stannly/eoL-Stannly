#!/usr/bin/env python3
"""Poll a target page for an EVM contract address (0x + 40 hex chars).

Designed to run on a schedule (see .github/workflows/contract-address-fetcher.yml).

Polling frequency
-----------------
GitHub Actions cannot trigger a scheduled workflow more often than every five
minutes, so a single cron trigger isn't "high frequency" by itself. Instead,
each triggered job loops *internally*: while no confirmed address exists yet,
it re-checks the page every POLL_INTERVAL_SECONDS (default 5s, with jitter)
for up to LOOP_DURATION_SECONDS (default ~4.5min), i.e. comfortably inside the
5-minute gap before the next cron trigger takes over. Net effect: the page is
actually hit every ~5 seconds, continuously, for a mean detection latency of
about 2.5 seconds.

Staying un-blocked
------------------
Frequent polling only gets rate-limited when it's expensive for the server, so
this keeps each poll as cheap as possible:

* Conditional GETs -- the ETag / Last-Modified from the previous response are
  sent back as If-None-Match / If-Modified-Since. An unchanged page answers
  with a bodyless "304 Not Modified", which costs the origin almost nothing
  and needs no parsing on our side. This is what makes a ~10s interval
  reasonable rather than abusive.
* A keep-alive session, so polls reuse one TLS connection instead of
  re-handshaking every time.
* gzip/deflate compression.
* Retry-After is honoured, and 429/403/503 or network errors trigger capped
  exponential backoff with jitter -- a soft throttle is never escalated into
  a hard ban.

Deliberately NOT done: proxy/IP rotation or anti-bot circumvention. That
evades a block rather than avoiding one, and generally earns a harder block.

Notifications
-------------
When a confirmed address is found, every configured channel (ntfy, Telegram,
Discord) is pinged *in parallel*, immediately, before any state/commit work,
so the CA reaches your phone as fast as possible.
"""
from __future__ import annotations

import json
import os
import random
import re
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:  # pragma: no cover
    sys.exit("This script needs `requests`. Install it with: pip install requests")

TARGET_URL = os.environ.get("TARGET_URL") or "https://www.an0n.ai/token"
STATE_PATH = Path(__file__).resolve().parent.parent / "data" / "contract-address.json"

# 5s means ~2.5s average detection latency. Going lower buys very little
# (the remaining latency is one HTTP round-trip) while sharply raising the
# odds of a hard block -- which would make detection slower, not faster.
POLL_INTERVAL_SECONDS = float(os.environ.get("POLL_INTERVAL_SECONDS", "5"))
# Kept comfortably under the 5-minute cron cadence so a run always finishes
# before the next scheduled trigger would start overlapping.
LOOP_DURATION_SECONDS = float(os.environ.get("LOOP_DURATION_SECONDS", "270"))
MAX_BACKOFF_SECONDS = float(os.environ.get("MAX_BACKOFF_SECONDS", "120"))
REQUEST_TIMEOUT = float(os.environ.get("REQUEST_TIMEOUT", "10"))

USER_AGENT = os.environ.get(
    "USER_AGENT",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/125.0.0.0 Safari/537.36",
)

EVM_ADDRESS_RE = re.compile(r"\b0x[a-fA-F0-9]{40}\b")

# The page renders the CA in a dedicated element, e.g.:
#   <div class="ca-box"><span class="ca-label">CONTRACT</span>
#     <span class="ca-value tba">TBA</span></div>
# While it isn't live the value is the literal placeholder "TBA"; once live
# it's expected to be swapped for the real 0x address (with the "tba" class
# presumably dropped). Checking this element directly is far more reliable
# than scanning the whole page for any 0x-looking string.
CA_VALUE_RE = re.compile(r'class="ca-value[^"]*"[^>]*>\s*([^<]*?)\s*<')

# Fallback heuristic if that markup ever changes: text near a candidate
# address that raises our confidence it's really *the* contract address
# rather than an unrelated hex string.
CONTEXT_KEYWORDS = (
    "contract",
    "ca:",
    "ca —",
    "ca -",
    "token address",
    "token contract",
    "address:",
)

CONTEXT_WINDOW = 120  # characters of surrounding text inspected for keywords


# --------------------------------------------------------------------------
# Fetching
# --------------------------------------------------------------------------


class FetchResult:
    __slots__ = ("html", "not_modified", "rate_limited", "retry_after", "error")

    def __init__(
        self,
        html: str | None = None,
        not_modified: bool = False,
        rate_limited: bool = False,
        retry_after: float | None = None,
        error: str | None = None,
    ):
        self.html = html
        self.not_modified = not_modified
        self.rate_limited = rate_limited
        self.retry_after = retry_after
        self.error = error


class Poller:
    """Polls the target URL, reusing a connection and validating with ETags."""

    def __init__(self, url: str):
        self.url = url
        self.etag: str | None = None
        self.last_modified: str | None = None
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate",
                # Explicitly keep the TCP/TLS connection open between polls.
                "Connection": "keep-alive",
            }
        )

    def fetch(self) -> FetchResult:
        headers = {}
        # Conditional request: if nothing changed the origin can answer 304
        # with no body at all, which is what keeps frequent polling cheap
        # enough not to get us throttled.
        if self.etag:
            headers["If-None-Match"] = self.etag
        if self.last_modified:
            headers["If-Modified-Since"] = self.last_modified

        try:
            response = self.session.get(self.url, headers=headers, timeout=REQUEST_TIMEOUT)
        except requests.RequestException as exc:
            return FetchResult(error=str(exc))

        if response.status_code in (429, 403, 503):
            return FetchResult(
                rate_limited=True,
                retry_after=_parse_retry_after(response.headers.get("Retry-After")),
                error=f"HTTP {response.status_code}",
            )

        if response.status_code == 304:
            return FetchResult(not_modified=True)

        if response.status_code >= 400:
            return FetchResult(error=f"HTTP {response.status_code}")

        # Remember the validators for the next poll.
        self.etag = response.headers.get("ETag") or self.etag
        self.last_modified = response.headers.get("Last-Modified") or self.last_modified
        return FetchResult(html=response.text)


def _parse_retry_after(value: str | None) -> float | None:
    if not value:
        return None
    try:
        return float(value)
    except ValueError:
        return None  # HTTP-date form; fall back to normal backoff


# --------------------------------------------------------------------------
# Parsing
# --------------------------------------------------------------------------


def find_ca_box_value(html: str) -> str | None:
    """Return the raw text of the .ca-value element, if present."""
    match = CA_VALUE_RE.search(html)
    if not match:
        return None
    return match.group(1).strip()


def find_candidates(html: str) -> list[dict]:
    """Return unique 0x-address candidates in document order, with context."""
    seen: dict[str, dict] = {}
    for match in EVM_ADDRESS_RE.finditer(html):
        address = match.group(0)
        if address in seen:
            continue
        start = max(0, match.start() - CONTEXT_WINDOW)
        end = min(len(html), match.end() + CONTEXT_WINDOW)
        context = re.sub(r"\s+", " ", html[start:end]).strip()
        confident = any(kw in context.lower() for kw in CONTEXT_KEYWORDS)
        seen[address] = {"address": address, "context": context, "confident": confident}
    return list(seen.values())


# --------------------------------------------------------------------------
# State
# --------------------------------------------------------------------------


def default_state() -> dict:
    return {"target_url": TARGET_URL, "address": None, "found_at": None, "candidates": []}


def load_state() -> dict:
    if STATE_PATH.exists():
        try:
            return json.loads(STATE_PATH.read_text())
        except json.JSONDecodeError:
            pass
    return default_state()


def save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n")


# --------------------------------------------------------------------------
# Notifications
# --------------------------------------------------------------------------


def explorer_links(address: str) -> str:
    return (
        f"Etherscan:   https://etherscan.io/address/{address}\n"
        f"Basescan:    https://basescan.org/address/{address}\n"
        f"DexScreener: https://dexscreener.com/search?q={address}\n"
        f"Dextools:    https://www.dextools.io/app/en/token/{address}"
    )


def _notify_ntfy(address: str, headline: str) -> None:
    """ntfy.sh push -- typically the fastest route to a phone lock screen."""
    topic = os.environ.get("NTFY_TOPIC")
    if not topic:
        return
    server = os.environ.get("NTFY_SERVER", "https://ntfy.sh").rstrip("/")
    url = topic if topic.startswith("http") else f"{server}/{topic}"
    requests.post(
        url,
        data=f"{address}\n\n{explorer_links(address)}".encode("utf-8"),
        headers={
            "Title": headline,
            "Priority": "urgent",
            "Tags": "rotating_light",
            "Click": TARGET_URL,
        },
        timeout=REQUEST_TIMEOUT,
    )


def _notify_telegram(address: str, headline: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not (token and chat_id):
        return
    text = f"*{headline}*\n\n`{address}`\n\n{explorer_links(address)}"
    requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        json={
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "Markdown",
            "disable_web_page_preview": True,
        },
        timeout=REQUEST_TIMEOUT,
    )


def _notify_discord(address: str, headline: str) -> None:
    webhook = os.environ.get("DISCORD_WEBHOOK_URL")
    if not webhook:
        return
    # Optional mention (e.g. "<@1234567890>" or "@everyone") so it actually
    # pushes to your phone rather than sitting silently in the channel.
    mention = os.environ.get("DISCORD_MENTION", "")
    content = (
        f"{mention} **{headline}**\n"
        f"```\n{address}\n```\n"
        f"{explorer_links(address)}\n<{TARGET_URL}>"
    ).strip()
    requests.post(
        webhook,
        json={"content": content, "allowed_mentions": {"parse": ["everyone", "users", "roles"]}},
        timeout=REQUEST_TIMEOUT,
    )


def notify_all(address: str, headline: str) -> None:
    """Fire every configured channel in parallel, so none blocks the others."""

    def run(fn) -> None:
        try:
            fn(address, headline)
        except Exception as exc:  # never let a notifier failure lose the CA
            print(f"::warning::{fn.__name__} failed: {exc}", file=sys.stderr)

    threads = [
        threading.Thread(target=run, args=(fn,), daemon=True)
        for fn in (_notify_ntfy, _notify_telegram, _notify_discord)
    ]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=REQUEST_TIMEOUT + 2)


def write_summary(text: str) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        print(text)
        return
    with open(summary_path, "a", encoding="utf-8") as fh:
        fh.write(text + "\n")


# --------------------------------------------------------------------------
# Main loop
# --------------------------------------------------------------------------


def check_once(state: dict, poller: Poller) -> tuple[bool, bool, float | None]:
    """Run a single check.

    Returns (confirmed_found, healthy, retry_after). `healthy` is False on a
    network error or throttle response, signalling the caller to back off.
    """
    now = datetime.now(timezone.utc).isoformat()
    result = poller.fetch()

    if result.not_modified:
        # 304: the page is byte-for-byte what we already parsed. Nothing to do.
        return bool(state.get("address")), True, None

    if result.html is None:
        kind = "throttled" if result.rate_limited else "failed"
        print(f"Fetch {kind} at {now}: {result.error}", file=sys.stderr)
        return False, False, result.retry_after

    ca_box_value = find_ca_box_value(result.html)
    candidates = find_candidates(result.html)
    confident = [c for c in candidates if c["confident"]]

    # Prefer the dedicated .ca-value element when present: it's an exact
    # signal from the page's own markup, not a heuristic guess.
    box_address = None
    if ca_box_value and ca_box_value.upper() != "TBA":
        if EVM_ADDRESS_RE.fullmatch(ca_box_value):
            box_address = ca_box_value
        elif confident:
            # .ca-value holds something non-placeholder that isn't a clean
            # address on its own -- fall back to the labelled candidate.
            box_address = confident[0]["address"]

    best = box_address or (confident[0]["address"] if confident else None)
    best_context = next(
        (c["context"] for c in candidates if c["address"] == best), "(from .ca-value element)"
    )

    if state.get("address"):
        if best and best != state["address"]:
            notify_all(best, "Contract address CHANGED")
            state["address"] = best
            state["found_at"] = now
            save_state(state)
            write_summary(f"### ⚠️ Contract address changed\n\n`{best}`\n\nContext: {best_context}")
        else:
            write_summary(f"Already recorded: `{state['address']}` (checked {now}, no change).")
        return True, True, None

    if best:
        # Notify FIRST -- state/commit work must never delay the alert.
        notify_all(best, "CONTRACT ADDRESS IS LIVE")
        print(f"\U0001f6a8 CA FOUND: {best}")
        state["address"] = best
        state["found_at"] = now
        save_state(state)
        write_summary(f"### ✅ Contract address found!\n\n`{best}`\n\nContext: {best_context}")
        return True, True, None

    known = {c["address"] for c in state.get("candidates", [])}
    new_candidates = [c for c in candidates if c["address"] not in known]
    if new_candidates:
        state["candidates"] = sorted(candidates, key=lambda c: c["address"])
        save_state(state)
        for c in new_candidates:
            write_summary(
                f"\U0001f440 Unconfirmed hex candidate spotted: `{c['address']}`\n\nContext: {c['context']}"
            )

    return False, True, None


def main() -> int:
    state = load_state()
    poller = Poller(TARGET_URL)

    if state.get("address"):
        # Already confirmed: one lightweight check per run is plenty, no
        # reason to keep bursting a page whose value shouldn't change.
        check_once(state, poller)
        return 0

    deadline = time.monotonic() + LOOP_DURATION_SECONDS
    interval = POLL_INTERVAL_SECONDS
    checks = 0
    while True:
        found, healthy, retry_after = check_once(state, poller)
        checks += 1
        if found:
            break

        if healthy:
            interval = POLL_INTERVAL_SECONDS
        else:
            interval = retry_after or min(max(interval, 1.0) * 2, MAX_BACKOFF_SECONDS)
            interval = min(interval, MAX_BACKOFF_SECONDS)

        sleep_for = interval + random.uniform(0, interval * 0.3)
        if time.monotonic() + sleep_for >= deadline:
            break
        time.sleep(sleep_for)

    if not state.get("address"):
        write_summary(
            f"No contract address on `{TARGET_URL}` yet (still `TBA`) — "
            f"{checks} check(s) this run, ~{POLL_INTERVAL_SECONDS:.0f}s apart."
        )

    print(f"Ran {checks} check(s) this job.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
