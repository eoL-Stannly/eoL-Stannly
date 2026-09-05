#!/usr/bin/env python3
"""Poll a target page for an EVM contract address (0x + 40 hex chars).

Designed to run on a schedule (see .github/workflows/contract-address-fetcher.yml).
State is persisted to data/contract-address.json so the workflow only needs to
commit when something actually changed (a confirmed address was found, or a
new unconfirmed candidate showed up) rather than on every poll.

GitHub Actions cannot trigger a scheduled workflow more often than every five
minutes, so a single cron trigger isn't "high frequency" by itself. Instead,
each triggered job loops *internally*: while no confirmed address exists yet,
it re-checks the page every POLL_INTERVAL_SECONDS (default 20s, with jitter)
for up to LOOP_DURATION_SECONDS (default ~4.5min), i.e. comfortably inside the
5-minute gap before the next cron trigger takes over. Net effect: the page is
actually hit roughly every 20 seconds, continuously, even though the trigger
itself only fires every 5 minutes.

On a rate-limit/blocked response (429/403) or a network error, the interval
backs off exponentially (capped) instead of hammering the page — the goal is
sustained frequent polling without tripping basic abuse protection, not
evading any deliberate access control.
"""
from __future__ import annotations

import json
import os
import random
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

TARGET_URL = os.environ.get("TARGET_URL") or "https://www.an0n.ai/token"
STATE_PATH = Path(__file__).resolve().parent.parent / "data" / "contract-address.json"

POLL_INTERVAL_SECONDS = float(os.environ.get("POLL_INTERVAL_SECONDS", "20"))
# Kept comfortably under the 5-minute cron cadence so a run always finishes
# before the next scheduled trigger would start overlapping.
LOOP_DURATION_SECONDS = float(os.environ.get("LOOP_DURATION_SECONDS", "270"))
MAX_BACKOFF_SECONDS = float(os.environ.get("MAX_BACKOFF_SECONDS", "300"))

EVM_ADDRESS_RE = re.compile(r"\b0x[a-fA-F0-9]{40}\b")

# The page is known to render the CA in a dedicated element, e.g.:
#   <div class="ca-box"><span class="ca-label">CONTRACT</span>
#     <span class="ca-value tba">TBA</span></div>
# When it's not live yet the value is the literal placeholder "TBA"; once
# live it's expected to be swapped for the real 0x address (with the "tba"
# class presumably dropped). Checking this element directly is far more
# reliable than scanning the whole page for any 0x-looking string.
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


def find_ca_box_value(html: str) -> str | None:
    """Return the raw text of the .ca-value element, if present."""
    match = CA_VALUE_RE.search(html)
    if not match:
        return None
    return match.group(1).strip()


class FetchResult:
    __slots__ = ("html", "rate_limited", "error")

    def __init__(self, html: str | None = None, rate_limited: bool = False, error: str | None = None):
        self.html = html
        self.rate_limited = rate_limited
        self.error = error


def fetch(url: str) -> FetchResult:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (compatible; contract-address-fetcher/1.0; "
                "+https://github.com/eoL-Stannly/eoL-Stannly)"
            ),
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            charset = response.headers.get_content_charset() or "utf-8"
            return FetchResult(html=response.read().decode(charset, errors="replace"))
    except urllib.error.HTTPError as exc:
        rate_limited = exc.code in (429, 403, 503)
        return FetchResult(rate_limited=rate_limited, error=f"HTTP {exc.code}: {exc.reason}")
    except (urllib.error.URLError, OSError) as exc:
        return FetchResult(error=str(exc))


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


def default_state() -> dict:
    return {
        "target_url": TARGET_URL,
        "address": None,
        "found_at": None,
        "candidates": [],
    }


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


def notify_discord(message: str) -> None:
    webhook = os.environ.get("DISCORD_WEBHOOK_URL")
    if not webhook:
        return
    payload = json.dumps({"content": message}).encode("utf-8")
    request = urllib.request.Request(
        webhook,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(request, timeout=10)
    except (urllib.error.URLError, OSError) as exc:
        print(f"::warning::Failed to notify Discord: {exc}", file=sys.stderr)


def write_summary(text: str) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        print(text)
        return
    with open(summary_path, "a", encoding="utf-8") as fh:
        fh.write(text + "\n")


def check_once(state: dict) -> tuple[bool, bool]:
    """Run a single check against the target page.

    Returns (confirmed_found, healthy) where `healthy` is False on a network
    error or rate-limit response (signal to back off before retrying).
    """
    now = datetime.now(timezone.utc).isoformat()
    result = fetch(TARGET_URL)

    if result.html is None:
        kind = "rate-limited/blocked" if result.rate_limited else "failed"
        print(f"Fetch {kind} at {now}: {result.error}", file=sys.stderr)
        return False, False

    ca_box_value = find_ca_box_value(result.html)
    candidates = find_candidates(result.html)
    confident = [c for c in candidates if c["confident"]]

    # Prefer the dedicated .ca-value element when present: it's an exact
    # signal from the page's own markup, not a heuristic guess.
    box_address = None
    if ca_box_value and ca_box_value.upper() != "TBA":
        match = EVM_ADDRESS_RE.fullmatch(ca_box_value)
        if match:
            box_address = ca_box_value
        elif confident:
            # .ca-value has *something* non-placeholder in it but it isn't a
            # clean 0x address by itself (e.g. extra whitespace/markup) --
            # fall through to the generic confident-candidate match.
            box_address = confident[0]["address"]

    best = box_address or (confident[0]["address"] if confident else None)
    best_context = next((c["context"] for c in candidates if c["address"] == best), "(from .ca-value element)")

    if state.get("address"):
        if best and best != state["address"]:
            state["address"] = best
            state["found_at"] = now
            save_state(state)
            message = f"\U0001f6a8 Contract address on {TARGET_URL} changed!\nNew: `{best}`\nContext: {best_context}"
            notify_discord(message)
            write_summary(f"### ⚠️ Contract address changed\n\n`{best}`\n\nContext: {best_context}")
        else:
            write_summary(f"Already recorded: `{state['address']}` (checked {now}, no change).")
        return True, True

    if best:
        state["address"] = best
        state["found_at"] = now
        save_state(state)
        message = f"\U0001f6a8 Contract address found on {TARGET_URL}:\n`{best}`\nContext: {best_context}"
        notify_discord(message)
        write_summary(f"### ✅ Contract address found!\n\n`{best}`\n\nContext: {best_context}")
        print(message)
        return True, True

    known = {c["address"] for c in state.get("candidates", [])}
    new_candidates = [c for c in candidates if c["address"] not in known]
    if new_candidates:
        state["candidates"] = sorted(candidates, key=lambda c: c["address"])
        save_state(state)
        for c in new_candidates:
            write_summary(f"\U0001f440 Unconfirmed hex candidate spotted: `{c['address']}`\n\nContext: {c['context']}")

    return False, True


def main() -> int:
    state = load_state()

    if state.get("address"):
        # Already confirmed previously: a single lightweight check per run is
        # enough, no need to keep bursting a page whose value shouldn't change.
        check_once(state)
        return 0

    # Not yet found: burst-poll at high frequency for this job's time budget.
    deadline = time.monotonic() + LOOP_DURATION_SECONDS
    interval = POLL_INTERVAL_SECONDS
    checks = 0
    while True:
        found, healthy = check_once(state)
        checks += 1
        if found:
            break
        interval = POLL_INTERVAL_SECONDS if healthy else min(interval * 2, MAX_BACKOFF_SECONDS)
        sleep_for = interval + random.uniform(0, interval * 0.3)
        if time.monotonic() + sleep_for >= deadline:
            break
        time.sleep(sleep_for)

    if not state.get("address"):
        write_summary(
            f"No contract address on `{TARGET_URL}` yet "
            f"(still `TBA`) — {checks} check(s) this run, ~{POLL_INTERVAL_SECONDS:.0f}s apart."
        )

    print(f"Ran {checks} check(s) this job.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
