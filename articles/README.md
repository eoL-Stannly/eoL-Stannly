# Aevo article rewrites — index, method and scoring

Four Aevo (@aevoxyz) posts were supplied as source material. Each has been rewritten
as a structured, AUF (answer-up-front) article with headings, embedded FAQ answers,
and a non-commodity scorecard.

## What is in here

| # | File | Topic | Source post date (UTC) | NCS v2 | Class |
|---|------|-------|------------------------|--------|-------|
| 1 | [`01-aevo-march-2026-reveal.md`](01-aevo-march-2026-reveal.md) | The 16 March 2026 product reveal and AMA | 2026-03-06 17:01 | 71 | Non-commodity |
| 2 | [`02-aevo-perps-plus-explained.md`](02-aevo-perps-plus-explained.md) | PERPS+ launch on BTC and ETH | 2026-03-23 11:00 | 78 | Non-commodity |
| 3 | [`03-aevo-perps-plus-mobile.md`](03-aevo-perps-plus-mobile.md) | PERPS+ on mobile, desktop parity | 2026-07-31 14:02 | 74 | Non-commodity |
| 4 | [`04-aevo-leaderboard-year-end-usdc.md`](04-aevo-leaderboard-year-end-usdc.md) | Permanent leaderboard and year-end USDC distribution | 2026-08-21 16:45 | 76 | Non-commodity |

Full grading detail, per-dimension breakdown and the gap-to-reference-grade list is in
[`scorecards.md`](scorecards.md).

## How the source posts were identified

`x.com`, `t.co`, `aevo.mirror.xyz` and every news mirror are blocked by this
environment's egress policy, so the four post bodies could not be read directly.
The topics were reconstructed two ways:

1. **Snowflake decoding.** A Twitter/X status ID encodes its own creation time:
   `timestamp_ms = (id >> 22) + 1288834974657`. That is deterministic, not inferred.

   | Status ID | Decoded UTC timestamp |
   |-----------|----------------------|
   | 2029965683056930907 | 2026-03-06T17:01:48Z |
   | 2036035408430084283 | 2026-03-23T11:00:43Z |
   | 2083191674344255953 | 2026-07-31T14:02:53Z |
   | 2090842637179691210 | 2026-08-21T16:45:05Z |

2. **Dated corroboration by search.** Aevo announcements matching each timestamp were
   located through web search — the 5 March 2026 "new product on March 16" notice, the
   third-party confirmation of the PERPS+ BTC/ETH launch dated 24 March 2026, the July
   2026 mobile-parity press cycle, and the August 2026 leaderboard and year-end USDC
   distribution announcement.

**Read this before publishing:** the topic mapping is high-confidence but inferred.
Open each source post and confirm the angle before the article goes live.

## Fact-verification status

Every figure in these articles carries a source. Figures were gathered through search
result summaries; the underlying pages could not be opened from this environment.

- Claims marked **[P]** trace to Aevo's own documentation, governance portal or
  announcements — primary, but still worth re-checking for current values.
- Claims marked **[S]** come from third-party press or analytics aggregators —
  re-verify against the primary source before publication.

Aggregator figures for perp DEX volume and options market share vary by methodology
(reported vs. adjusted volume, spot-equivalent vs. notional). Where two sources
disagree, both numbers are given rather than averaged.

## The AUF writing rules applied

1. The answer to the headline question appears in the first 40 words. No preamble.
2. Sentences stay short. One claim per sentence.
3. Every number is attached to a date and a source.
4. Hedges ("could", "may", "some say") are removed unless the uncertainty is the point.
5. FAQ answers are inline and lead with the answer, then the reason.
6. Nothing is asserted that a reader cannot check.

## The non-commodity scoring rubric

"Commodity content" is content that restates what the top-ranking set already says.
Google's March 2024 core update folded the helpful content system into core ranking and
added a scaled content abuse policy that judges content by usefulness rather than by how
it was produced. Google said it expected the combined changes to cut low-quality,
unoriginal results by around 40%, a figure later revised to 45%. Google LLC also holds
patent **US11354342B2, "Contextual estimation of link information gain"** (inventors
Victor Carbune and Pedro Gonnet Anders), which scores a document by how much *new*
information it adds relative to documents the user has already seen.

The rubric below operationalises that idea.

| Dimension | Max | What earns the points |
|-----------|-----|-----------------------|
| Information gain | 25 | Facts, framings or numbers absent from the current top 10 |
| First-hand evidence | 20 | Screenshots, fills, API pulls, positions held, things only a user could know |
| Verifiable specificity | 15 | Named figures, exact dates, cited primaries |
| Decision utility | 15 | Tables, payoff math, thresholds and rules a reader can act on |
| Entity and topical authority | 10 | Correct entity relationships, depth of the surrounding topic map |
| Freshness and date anchoring | 10 | Explicit as-of dates; content that ages legibly |
| Distinct thesis | 5 | An argument the rest of the SERP is not making |

**Bands**

| Score | Class | Practical reading |
|-------|-------|-------------------|
| 0–44 | Commodity | Google has this already. Will not rank without link support. |
| 45–64 | Near-commodity | Differentiated in form only. Vulnerable to a core update. |
| 65–79 | Non-commodity | Adds genuinely new information. Rankable on merit. |
| 80–100 | Reference-grade | Becomes the thing other pages cite. |

## Iteration log

Both passes were performed in this session. The second pass was not a polish — it added
the material the v1 scoring identified as missing.

| Article | NCS v1 | NCS v2 | What the second pass added |
|---------|--------|--------|----------------------------|
| 1 | 58 | 71 | Reveal-to-ship timeline table; the "why a teaser needs a payoff post" thesis; the AMA-follow-up FAQ block; competitor SERP gap analysis |
| 2 | 66 | 78 | Worked payoff math for all three modes; the traditional-options mapping table; the on-chain options vs perps 0.2% ratio; the 70–97% loss-rate framing |
| 3 | 61 | 74 | Feature-parity checklist; the iOS geo-restriction fact; why mobile parity matters against a $21B/day perp market; three added FAQs |
| 4 | 63 | 76 | Full qualification-threshold math; the 674k → 808.8k delta explained; comparison against GMX and Hyperliquid fee-share models; the "three stacked reward streams" table |

## Honest limitation on all four scores

None of the four articles scores above 79. The reason is identical in each case: the
**first-hand evidence** dimension is scoring 4–8 out of 20. No screenshots, no real
fills, no API pulls, no positions held. That single dimension is the gap between
non-commodity and reference-grade. `scorecards.md` lists exactly what to capture.

## Sources

- Aevo documentation — https://docs.aevo.xyz/
- Aevo governance proposals (AGP-3, Aevonomics) — https://agp.aevo.xyz/
- Aevo — https://www.aevo.xyz/
- CryptoSlate, on-chain options vs the perp market — https://cryptoslate.com/on-chain-options-close-in-on-cryptos-21b-a-day-perp-market-to-deepen-liquidity-everywhere/
- CoinLaw, crypto options market statistics 2026 — https://coinlaw.io/options-market-in-crypto-statistics/
- The Cryptonomist, Deribit and Bybit options split — https://en.cryptonomist.ch/2026/08/04/crypto-options-market-dynamics/
- 21Shares, the perpetual DEX wars — https://www.21shares.com/en-eu/insights/the-perpetual-dex-wars-hyperliquid-aster-and-lighter-in-focus
- BlockEden, perp DEX wars of 2026 — https://blockeden.xyz/blog/2026/01/29/perp-dex-wars-2026-hyperliquid-lighter-aster-edgex-paradex-decentralized-derivatives/
- Crypto Briefing, US day traders and perpetual futures — https://cryptobriefing.com/us-day-traders-crypto-perpetual-futures/
- Coindoo, Aevo leaderboard and 808,800 USDC — https://coindoo.com/aevo-launches-leaderboard-with-an-808800-usdc-projected-reward/
- CryptoDaily, PERPS+ mobile parity — https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity
- FinanceFeeds, Ondo tokenized stocks on Aevo — https://financefeeds.com/ondo-finance-lands-on-aevo/
- Fidelity, collar strategy reference — https://www.fidelity.com/learning-center/investment-products/options/options-strategy-guide/collar
- Google Search Central, March 2024 core update and new spam policies — https://developers.google.com/search/blog/2024/03/core-update-spam-policies
- Google Patents, US11354342B2 — https://patents.google.com/patent/US11354342B2
