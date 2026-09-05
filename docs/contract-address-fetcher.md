# Contract Address Fetcher

Polls https://www.an0n.ai/token looking for the token's EVM contract address
(a `0x` + 40 hex character string) and records it as soon as it appears.

## How it works

- **Target markup**: the page renders the CA in a dedicated element:
  `<span class="ca-value">...</span>` (currently showing the placeholder
  `TBA` inside `<span class="ca-value tba">`). The script reads that element
  directly. If the markup ever changes, it falls back to scanning the whole
  page for any `0x...` string that appears near a label like "contract",
  "CA", or "token address" -- it will never blindly report an arbitrary hex
  string as the real CA.
- **Polling frequency**: GitHub Actions can't trigger a scheduled workflow
  more often than every 5 minutes. To get effectively continuous polling
  anyway, each triggered run loops internally, re-checking the page roughly
  every 20 seconds (with jitter) for about 4.5 minutes -- comfortably inside
  the gap before the next scheduled trigger takes over. On a rate-limited or
  errored response the interval backs off exponentially instead of hammering
  the page.
- **State**: results are stored in [`data/contract-address.json`](../data/contract-address.json).
  The workflow only commits when something actually changed (address found,
  address changed, or a new unconfirmed hex candidate appeared), so the repo
  history doesn't fill up with no-op commits.
- **Notifications**: set a repository secret named `DISCORD_WEBHOOK_URL`
  (Settings -> Secrets and variables -> Actions) to get a Discord ping the
  moment a confirmed address is found or changes. This is optional -- without
  it, results still land in `data/contract-address.json` and in each run's
  job summary.

## Running it manually

From the Actions tab, run the "Contract Address Fetcher" workflow via
"Run workflow" (`workflow_dispatch`). You can optionally override the URL to
check for that one run.

Locally:

```sh
TARGET_URL="https://www.an0n.ai/token" python3 scripts/fetch_contract_address.py
```

## Important: enabling the schedule

GitHub only fires `schedule` triggers from the repository's **default
branch**. Until `.github/workflows/contract-address-fetcher.yml` is merged
into the default branch, it will only run via manual `workflow_dispatch`.
