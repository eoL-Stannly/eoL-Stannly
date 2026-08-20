# Aevo site content — Stratosphere SEO

Version-controlled source of truth for the Aevo site pages. The delivered artefacts are Google
Docs; the markdown under `pages/` is what gets revised.

Maintained by the **Aevo Content Writing** routine, which runs each morning. Read `ROUTINE.md`
before editing anything here programmatically.

## Layout

```
aevo-content/
  README.md            this file — conventions and delivery index
  SITEMAP.md           the page inventory, keywords and internal link map — the work queue
  ROUTINE.md           the working agreement each run follows
  ROUTINE-PROMPT.md    the settings to apply to the routine in the web UI
  CHANGELOG.md         one entry per run, newest first
  pages/
    homepage.md
    core-products/     perpetual futures, options, options hedging, OTC, automated strategies, unified margin
    markets/           index, BTC, ETH, SOL, PUMP
    learn/             perpetual futures, options trading, leverage and margin, hedging, DEX education, fees and risk
    guides/            standalone pages outside the three hub columns
```

There are no `v1/`, `v2/`, `v3/` directories. Revision history is git history. Each run edits pages
in place and records what it changed in `CHANGELOG.md`.

**`SITEMAP.md` is the authority on which pages exist, what each targets, and how they link.**
This README covers conventions and delivery; it does not duplicate the inventory.

## Delivered Google Docs

| Page | Google Doc |
| ---- | ---------- |
| `pages/guides/pre-launch-token-futures.md` | [doc](https://docs.google.com/document/d/1QQb_Ofd0ExmZS1IBjmB2HUrZfRpn1UA_idJsM_dhwRs/edit) |
| `pages/guides/aevo-mcp.md` | [doc](https://docs.google.com/document/d/10DyRs4sXcr0I1FwKPIkyjcWP-2YXWfrido03eI7UtHc/edit) |
| `pages/core-products/otc-trading.md` | [doc](https://docs.google.com/document/d/1mYfyOYSwpi0AsEIrDWIbWoz0YMEbsIVeJQMyAnrCVYs/edit) |
| `pages/core-products/automated-strategies.md` | [doc](https://docs.google.com/document/d/1CbmIT6TeOrtfEc2UcHwJs9JoC2It9Ns_dTka1Bw67XQ/edit) |
| `pages/guides/staking.md` | [doc](https://docs.google.com/document/d/16lTMFsaqT8ECbGsF3ZSp4fjhqAL4xuEjGrY0FV6fI6k/edit) |

Pages written after this table was made get a doc on first delivery; add the row then. Prior doc
versions are archived by retitling with a `[vN ARCHIVED <date>]` prefix, never deleted.

## Keyword universe

Per-page targets live in `SITEMAP.md`. These are the pillar lists they are drawn from:

- **Perps** — `perpetual futures`, `perps dex`, `perps trading`, `eth perps`, `btc perps`,
  `ethereum perps`, `bitcoin perps`, `eth perpetual futures`, `eth futures`,
  `btc perpetual futures`, `btc futures`
- **Hedging** — `simple hedging`, `built in hedging`, `hedging perps positions with options`,
  `hedging cross margin`, `cross margin hedging`, `downside protection`
- **Options** — `crypto options`, `btc options`, `eth options`, `options dex`,
  `decentralized options`, `simple options`, `options easy mode`, `learn options trading`,
  `how to trade options`, `how do options work`, `options principles`, `options basics`,
  `options 101`

No two pages chase the same primary keyword. Where a subject appears in both `core-products/` and
`learn/`, the keywords split by intent — see `SITEMAP.md`.

## Conventions

- H1 carries the primary keyword. Section headings are questions, for featured-snippet and
  FAQ-schema eligibility.
- Bold lede paragraph, then a bulleted TL;DR, then question-led sections.
- Comparison tables where two things are genuinely being weighed.
- Every claim that can go stale points the reader at the live source, with an as-of date.
- Related reading block cross-linking the set, then a **Trade on Aevo** call to action as the last
  block on every page. Titles given in full so the publisher can hyperlink them to live URLs.

## Prior history

The first drafts of the five original articles were pushed to a separate, unrelated branch before
this layout existed: `claude/relaxed-ritchie-gawjyi` (2026-08-18, under `content/aevo/`). Superseded
by what is under `pages/` today; kept only for reference. The corresponding v1 Google Docs are
retained in Drive with a `[v1 ARCHIVED 2026-08-19]` prefix. Nothing was deleted.
