# Aevo core pages — Stratosphere SEO

Version-controlled source of truth for the Aevo core-page articles. The delivered
artefacts are Google Docs; the markdown in `articles/` is what gets revised.

Maintained by the **Aevo Content Writing** routine. Read `ROUTINE.md` before editing
anything here programmatically.

## Layout

```
aevo-content/
  README.md      this file — article index and conventions
  ROUTINE.md     the working agreement the routine follows on every run
  CHANGELOG.md   one entry per routine run, newest first
  articles/      the live articles — edited in place, never duplicated
```

There are no `v1/`, `v2/`, `v3/` directories. Revision history is git history.
Each run edits the files in `articles/` in place and records what it changed in
`CHANGELOG.md`.

## Articles

| # | File | Title | Google Doc |
| - | ---- | ----- | ---------- |
| 1 | `articles/01-pre-launch-token-futures.md` | Pre-launch token futures: trade a token before it lists | [doc](https://docs.google.com/document/d/1QQb_Ofd0ExmZS1IBjmB2HUrZfRpn1UA_idJsM_dhwRs/edit) |
| 2 | `articles/02-aevo-mcp.md` | The Aevo MCP: give your AI agent a trading desk | [doc](https://docs.google.com/document/d/10DyRs4sXcr0I1FwKPIkyjcWP-2YXWfrido03eI7UtHc/edit) |
| 3 | `articles/03-aevo-otc-desk.md` | Aevo OTC: trade altcoin options on-chain, at size | [doc](https://docs.google.com/document/d/1mYfyOYSwpi0AsEIrDWIbWoz0YMEbsIVeJQMyAnrCVYs/edit) |
| 4 | `articles/04-aevo-trading-strategies.md` | Aevo trading strategies: from one-tap protection to multi-leg structures | [doc](https://docs.google.com/document/d/1CbmIT6TeOrtfEc2UcHwJs9JoC2It9Ns_dTka1Bw67XQ/edit) |
| 5 | `articles/05-aevo-staking.md` | Aevo staking explained: tiers, epochs, the lottery and every reward | [doc](https://docs.google.com/document/d/16lTMFsaqT8ECbGsF3ZSp4fjhqAL4xuEjGrY0FV6fI6k/edit) |

## Target keywords

Coverage follows the perps / hedging / options pillar methodology.

- **Perps** — `perpetual futures`, `perps dex`, `perps trading`, `eth perps`, `btc perps`,
  `ethereum perps`, `bitcoin perps`, `eth perpetual futures`, `eth futures`,
  `btc perpetual futures`, `btc futures`
- **Hedging** — `simple hedging`, `built in hedging`, `hedging perps positions with options`,
  `hedging cross margin`, `cross margin hedging`, `downside protection`
- **Options** — `crypto options`, `btc options`, `eth options`, `options dex`,
  `decentralized options`, `simple options`, `options easy mode`, `learn options trading`,
  `how to trade options`, `how do options work`, `options principles`, `options basics`,
  `options 101`

## Conventions

- H1 carries the primary keyword. Section headings are questions, for featured-snippet and
  FAQ-schema eligibility.
- Bold lede paragraph, then a bulleted TL;DR, then question-led sections.
- Comparison tables where two things are genuinely being weighed.
- Every claim that can go stale points the reader at the live source.
- "Related reading" block on every article, cross-linking the set. Titles given in full so the
  publisher can hyperlink them to live URLs.

## Prior history

The first drafts of these five articles were pushed to a separate, unrelated branch before this
layout existed: `claude/relaxed-ritchie-gawjyi` (2026-08-18, under `content/aevo/`). Superseded by
what is in `articles/` today; kept only for reference. The corresponding v1 Google Docs are
retained in Drive, retitled with a `[v1 ARCHIVED 2026-08-19]` prefix. Nothing was deleted.
