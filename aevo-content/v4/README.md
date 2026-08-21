# Aevo content — v4 pass (2026-08-21)

Opus 5 improvement pass over the five live v3 Aevo articles. Source of truth is Google
Drive; these files are the working drafts kept under version control.

## Versioning convention

Old doc is renamed with a `[vN ARCHIVED YYYY-MM-DD]` prefix, and a fresh doc is created
with the clean title `[Category] | [Title Case Title] | Aevo | Stratosphere SEO`.

## v4 documents (live)

| Article | Drive ID | v3 → v4 size |
| --- | --- | --- |
| Pre-Launch Token Futures | `1LZFkhNKUyOU8knYtFiA2mSgktmspkbSv_rTckmpDtcI` | 11,293 → 15,392 |
| The Aevo MCP | `1_xI06VB6NghTAvjvI3gFf7g3L1akuPLkjBIpYxWjP6E` | 10,154 → 15,870 |
| Aevo OTC | `1iaLoQoLa20hFKRL7e_LiLgRKXkNSUnXDUKbZIbyrTaI` | 9,362 → 12,800 |
| Aevo Trading Strategies | `13LaWRXrHDOxJvXnfos09YWY7sG7b12uOQTM--x8tMUs` | 9,528 → 13,700 |
| Aevo Staking | `1LS_oLvIZfZGpGKjPAKeAUALsYaWqZHhmwJs8rX2UwJ8` | 10,169 → 13,560 |

## What v4 added

Every addition is sourced from official Aevo documentation, not padding.

**Pre-launch token futures**
- The **supply rebase mechanic** — absent from v3 entirely. New H2 with the full four-step
  process and the `$COIN` worked example (1bn → 10bn supply, 10 contracts → 100 contracts,
  $1.00 → $0.10, notional unchanged), plus a practical "what to do about it" section.
- New H2 on **why market orders are unavailable on the website** and why the Close Position
  button is missing — with the consequence that posting is the default execution style.
- **Corrected the maker fee**: it is a −10 bps *rebate*, not a 10 bps discount. v3 had this
  wrong in both the TL;DR and the spec table.
- Conversion now notes resting orders remain valid (contrast with rebase, which cancels them).
- Comparison table extended with taker/maker fees, web market orders, rebase possibility and
  staking fee discount applicability.

**The Aevo MCP** — the largest gap; v3 deferred setup detail to "see the docs"
- **Hosted endpoint** (`mcp.aevo.xyz/mcp`, `mcp-testnet.aevo.xyz/mcp`) with header auth.
- Three connection routes: hosted, self-hosted Docker (recommended, key locality), local pip;
  plus OpenClaw via `clawhub install aevo`.
- **Credential tiers table** and the full **environment variables table**.
- New H2 on **Prompts** (`trade_plan`, `risk_checklist`, `cancel_plan`, `onboarding_plan`) and
  **Resources** (`aevo://status`, `aevo://markets/summary`, `aevo://account/overview`).
- New H2 on the **Aevo Trading Skill** repo and why it differs from the tool list.
- Verification steps (`ping` → expected JSON, then balance) and a full **testnet stack table**.
- Open-source repo links; client list corrected to Claude Code, Claude Desktop, Cursor,
  Windsurf, OpenClaw; tool groups aligned to the five official categories.

**Aevo OTC**
- Sharpened the market-structure stat to **~25% on-exchange / 75% OTC** and explained it as an
  infrastructure statement rather than a preference statement.
- New H2 **"Why is the listed market so bad at altcoin options?"** — thin books as a
  price-impact tax, **5–10%+ spreads** as a hidden fee, rigid strike/expiry grids.
- New H2 **"What makes altcoins specifically hard?"** — rapid market rotation, customisation
  requirements (founder vs trader vs holder), and the failure of standard pricing models on
  altcoin volatility.
- Added token founders / treasuries as a fourth user profile, and a duration paragraph
  covering the PERPS+ two-month ceiling vs OTC's three-month maturities.

**Aevo trading strategies**
- New H2 **"What can I actually set on a PERPS+ enhancer?"** with the **range-limits-by-duration
  table** (1wk 5–8%, 2wk 5–10%, 1mo 5–15%, 2mo 5–20%), the **one-active-enhancer-per-asset**
  rule, and automatic notional-matched sizing.
- New H2 **"What if I want the strategy run for me?"** covering **Aevo Strategies** and the
  **Basis Trade** — delta-neutral long spot / short perp, funding capture, fully algorithmic,
  risk-team monitored — with an honest note that it is not risk-free.
- Worked examples now reference the duration constraint; added a fifth comparison on
  non-linear premium scaling across durations.

**Aevo staking**
- New H2 **"The fee discount nobody mentions"** with the full **4×4 discount matrix** (up to
  20%). This was missing entirely from an article claiming to cover "every reward". Includes
  the LUNAR CADET 0% floor and the **exclusion of options and pre-launch fees**.
- New H2 **"How is qualifying volume actually measured?"** with the volume formulas and the
  key point that **options volume is delta-weighted**, not notional.
- LP NFT mint mechanic: **15th of each month**, accrued AEVO paired with equal USDC into a
  Uniswap V3 position that earns while it vests.
- Cap **redistribution waterfall**: excess → uncapped in same tier → other tier → rolls forward.
- Entity aggregation and wash-trading exclusion; treasury LP fees ~977,000 USDC to date;
  LUNAR LEGEND / CELESTIAL CADET vesting equivalence illustrating the duration weighting.

## Open gaps (not actioned this run — see notification)

- **No standalone hedging article.** The material lives inside Trading Strategies, which owns
  the exact string "hedging perps positions with options".
- **No options-education article.** Zero coverage of "options 101", "options basics", "how do
  options work", "how to trade options", "learn options trading", "options principles",
  "options easy mode", "options dex" (the last is now covered in OTC v4). This is the largest
  keyword gap in the cluster.
- **Perps keywords still missing** from `perpetual-futures.html`: "ethereum perps",
  "bitcoin perps", "eth futures", "btc futures". That page is a designed HTML landing page,
  not a Doc, so it needs editing in its own format.
