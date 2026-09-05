# Contract Address Fetcher

Polls https://www.an0n.ai/token looking for the token's EVM contract address
(a `0x` + 40 hex character string) and pushes it to your phone the moment it
appears.

## Detection

The page renders the CA in a dedicated element:

```html
<div class="ca-box"><span class="ca-label">CONTRACT</span><span class="ca-value tba">TBA</span></div>
```

The script reads that `.ca-value` element directly and treats it as the CA
once it stops saying `TBA` and holds a valid 40-hex-char address. If the
markup ever changes, it falls back to scanning the page for a `0x...` string
appearing near a "contract" / "CA" / "token address" label.

It will **never** report an arbitrary hex string as the confirmed CA — an
unlabelled `0x...` match is recorded as an *unconfirmed candidate* for you to
eyeball instead. On a launch page, guessing wrong is worse than waiting.

## Speed

Detection latency is set by the poll interval, not by the fetching tool — a
conditional GET is already only ~50–200ms round-trip.

GitHub Actions can't trigger a scheduled workflow more often than every 5
minutes, so the cron is only what *(re)starts* the job. The actual polling
happens in a loop **inside** each run: it re-checks every ~5 seconds (with
jitter) for ~4.5 minutes, until the next trigger takes over. Net effect:
continuous ~5s polling, roughly **2.5s mean detection latency** — not one
check every 5 minutes.

Going below ~5s buys very little (the remaining latency is a single HTTP
round-trip) while sharply raising the odds of a hard block, which would make
detection slower, not faster.

## Not getting rate-limited or blocked

Frequent polling only gets throttled when it's expensive for the origin, so
each poll is kept as cheap as possible:

- **Conditional GETs** — the previous response's `ETag` / `Last-Modified` are
  sent back as `If-None-Match` / `If-Modified-Since`. An unchanged page
  answers `304 Not Modified` with no body, costing the origin almost nothing
  and needing no parsing here. This is the single biggest reason a ~5s poller
  doesn't get rate-limited. (Verified in testing: most polls come back 304.)
- **Keep-alive session** — polls reuse one TLS connection instead of
  re-handshaking every time.
- **gzip/deflate** compression, and a configurable `USER_AGENT`.
- **`Retry-After` is honoured**, and `429`/`403`/`503` or network errors
  trigger capped exponential backoff with jitter — a soft throttle is never
  escalated into a hard ban.
- Once an address is confirmed, it drops to a single check per run.

Deliberately **not** done: proxy/IP rotation or anti-bot circumvention. That
evades a block rather than avoiding one, and generally just earns a harder
block.

## Notifications

When a CA is confirmed, every configured channel fires **in parallel**,
immediately — before any state-writing or git work, so nothing delays the
alert. Each message leads with the bare address for copy-paste, followed by
Etherscan / Basescan / DexScreener / Dextools links.

Configure any subset as repository secrets (Settings → Secrets and variables
→ Actions). All are optional:

| Secret | Purpose |
| --- | --- |
| `NTFY_TOPIC` | [ntfy.sh](https://ntfy.sh) topic — usually the fastest route to a phone lock screen. Sent at `urgent` priority. Install the app, subscribe to the topic. |
| `NTFY_SERVER` | Self-hosted ntfy server (defaults to `https://ntfy.sh`). |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Telegram push (both required). |
| `DISCORD_WEBHOOK_URL` | Discord channel webhook. |
| `DISCORD_MENTION` | e.g. `<@your-user-id>` or `@everyone`, so it actually pushes to your phone instead of sitting silently in the channel. |

With none configured, results still land in
[`data/contract-address.json`](../data/contract-address.json) and in each
run's job summary.

## State

Results are stored in `data/contract-address.json`. The workflow only commits
when something actually changed (address found, address changed, or a new
unconfirmed candidate appeared), so the history doesn't fill up with no-op
commits.

## Running it manually

From the Actions tab, run the "Contract Address Fetcher" workflow via
"Run workflow" (`workflow_dispatch`). You can optionally override the URL for
that one run.

Locally:

```sh
pip install requests
NTFY_TOPIC=my-ca-alerts python3 scripts/fetch_contract_address.py
```

Tunable via env vars: `TARGET_URL`, `POLL_INTERVAL_SECONDS`,
`LOOP_DURATION_SECONDS`, `MAX_BACKOFF_SECONDS`, `REQUEST_TIMEOUT`,
`USER_AGENT`.

## Important: enabling the schedule

GitHub only fires `schedule` triggers from the repository's **default
branch**. Until `.github/workflows/contract-address-fetcher.yml` is merged
into the default branch it will only run via manual `workflow_dispatch`.

Note also that GitHub's scheduler is best-effort and can be delayed under
load, and scheduled workflows are disabled automatically after 60 days of
repository inactivity. For a launch you care about, the most reliable setup
is to also keep a copy of this script running somewhere always-on (any box
with Python) using the same env vars — it's a single self-contained file.
