# Aevo core pages — Stratosphere SEO

Working copies of the five Aevo core-page articles. The delivered artefacts are Google Docs;
these markdown files are the version-controlled source of truth for each revision.

## Current articles (v2 — Opus 5 improvement pass, 2026-08-19)

| # | Article | Google Doc |
| - | ------- | ---------- |
| 1 | Pre-launch token futures: trade a token before it lists | [doc](https://docs.google.com/document/d/1QQb_Ofd0ExmZS1IBjmB2HUrZfRpn1UA_idJsM_dhwRs/edit) |
| 2 | The Aevo MCP: give your AI agent a trading desk | [doc](https://docs.google.com/document/d/10DyRs4sXcr0I1FwKPIkyjcWP-2YXWfrido03eI7UtHc/edit) |
| 3 | Aevo OTC: trade altcoin options on-chain, at size | [doc](https://docs.google.com/document/d/1mYfyOYSwpi0AsEIrDWIbWoz0YMEbsIVeJQMyAnrCVYs/edit) |
| 4 | Aevo trading strategies: from one-tap protection to multi-leg structures | [doc](https://docs.google.com/document/d/1CbmIT6TeOrtfEc2UcHwJs9JoC2It9Ns_dTka1Bw67XQ/edit) |
| 5 | Aevo staking explained: tiers, epochs, the lottery and every reward | [doc](https://docs.google.com/document/d/16lTMFsaqT8ECbGsF3ZSp4fjhqAL4xuEjGrY0FV6fI6k/edit) |

v1 Docs from 2026-08-18 are retained in Drive, retitled with a `[v1 ARCHIVED 2026-08-19]` prefix.
Nothing was deleted.

## What changed in the v2 pass

**Accuracy fixes**

- *Pre-launch futures* — v1 claimed the liquidation corridor was "2%", conflating margin-ratio
  percentage points with price movement. v2 shows the arithmetic under both maintenance-margin
  conventions (≈2% on entry notional, ≈3.8% on current notional for a long, ≈1.4% for a short) and
  tells the reader to trust the liquidation price in the UI rather than infer one. Also corrects
  "initial margin 0.5x" to the clearer "50% of notional".
- *Staking* — v1 quoted the reward cap as "15% of that pool" in one place and "4.50% / 10.5%" in
  another without reconciling them. v2 states both and shows they are the same rule measured
  against the tier pool vs the total distribution.
- *Staking* — April/May 2026 APR figures were presented as near-current. v2 labels them explicitly
  as historical and several months stale.
- *OTC* — the 25%/75% exchange-vs-OTC split is now framed as an industry estimate rather than a
  hard figure.

**New sections**

- Pre-launch: "How far can price move before I'm liquidated?", "How should I size a pre-launch
  position?", "Can I hedge a pre-launch position?"
- MCP: "What does a useful session actually look like?", "What can't it do?" (latency,
  non-determinism, unattended use, exchange limits), plus a stale-reads risk item.
- OTC: worked slippage-vs-RFQ comparison, quote-window behaviour, "Does an OTC position hedge my
  perps?"
- Strategies: "What the three modes look like in numbers" — the same 10,000 USDC ETH long carried
  through all three PERPS+ modes; plus a premium-worth-it test in the hedging section.
- Staking: "How is my year-end share actually calculated?" — worked score example, and the
  observation that tier scores sum to 1 so your score *is* your share of the tier pool.

**SEO / structure**

- Target-keyword coverage brought in line with the perps / hedging / options pillar methodology:
  "perpetual futures", "perps dex", "eth perps", "btc perps" (article 1); "crypto options",
  "btc options", "eth options", "options dex", "decentralized options" (articles 2, 3);
  "simple hedging", "built-in hedging", "hedging perps positions with options", "cross margin
  hedging", "downside protection" (articles 3, 4).
- "Related reading" block added to every article, cross-linking the set. Titles are given in full
  so the publisher can hyperlink them to the live URLs.

## Conventions

- H1 carries the primary keyword. Section headings are questions, for featured-snippet and
  FAQ-schema eligibility.
- Bold lede paragraph, then a bulleted TL;DR, then question-led sections.
- Comparison tables where two things are genuinely being weighed.
- Every claim that can go stale points the reader at the live source.
