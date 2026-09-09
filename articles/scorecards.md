# Non-commodity scorecards — all four Aevo articles

**Verdict up front:** all four articles clear the commodity threshold. None reach
reference-grade. The blocker is the same in every case — first-hand evidence. Every other
dimension is scoring 60–100% of its maximum; first-hand evidence is scoring 30–40%.

---

## Will Google class this as commodity content?

**No — but only just, and only because of what was added in the second pass.**

The honest position on each article:

| Article | v1 verdict | v2 verdict | What flipped it |
|---------|-----------|-----------|-----------------|
| 1 — March 2026 reveal | Near-commodity (58) | Non-commodity (71) | Linking the reveal to the Epoch 17 incentive reallocation. That connection exists nowhere else. |
| 2 — PERPS+ explained | Non-commodity (66) | Non-commodity (78) | Worked payoff tables and the mapping to protective put / covered call / collar. |
| 3 — PERPS+ on mobile | Near-commodity (61) | Non-commodity (74) | The US/UK geo-restriction and the perp DEX volume context. |
| 4 — Leaderboard and USDC | Near-commodity (63) | Non-commodity (76) | Assembling the full funding chain from staking to LP NFT to treasury fee income. |

The v1 drafts of articles 1, 3 and 4 were *restatements*. They said what the press-wire
cluster says, in better prose, with headings. Better prose is not information gain. Google
does not reward formatting.

## Why the framing matters

Google's March 2024 core update folded the helpful content system into core ranking and
introduced a **scaled content abuse** policy. That policy deliberately moved the test from
*how* content was produced to *why* and *how useful* it is. Google said it expected the
combined changes to reduce low-quality, unoriginal content in results by around 40%, later
revised to 45%.

Separately, Google LLC holds patent **US11354342B2, "Contextual estimation of link
information gain"** (inventors Victor Carbune and Pedro Gonnet Anders). It describes
scoring a document by the new information it contributes relative to documents a user has
already seen. The patent is framed around ranking within an assistant or chatbot interface
rather than organic results, so it should not be cited as a description of organic ranking.
It is still the clearest public articulation of the principle: **redundancy is a
penalty-shaped signal.**

The practical translation for these four articles: if a reader has already read the
Chainwire release, what does this page add?

---

## Full per-dimension breakdown (v2)

| Dimension | Max | Art 1 | Art 2 | Art 3 | Art 4 |
|-----------|-----|-------|-------|-------|-------|
| Information gain | 25 | 20 | 21 | 18 | 20 |
| First-hand evidence | 20 | 6 | 7 | 8 | 7 |
| Verifiable specificity | 15 | 14 | 14 | 13 | 14 |
| Decision utility | 15 | 11 | 15 | 13 | 15 |
| Entity and topical authority | 10 | 9 | 10 | 9 | 9 |
| Freshness and date anchoring | 10 | 9 | 9 | 9 | 9 |
| Distinct thesis | 5 | 2 | 2 | 4 | 2 |
| **Total** | **100** | **71** | **78** | **74** | **76** |

**Bands:** 0–44 commodity · 45–64 near-commodity · 65–79 non-commodity · 80–100
reference-grade.

---

## The one thing standing between these and reference-grade

First-hand evidence averages **7 out of 20** across the set. That is the entire gap.

Everything in these four articles was assembled from public sources. That makes them
*well-researched* — it does not make them *unreplicable*. A competent competitor with the
same sources can rebuild them.

What cannot be rebuilt is what only an Aevo user has.

### The capture list, in priority order

Roughly two hours of screen time would move all four articles above 85.

**1. Screenshot the PERPS+ order ticket.** (Lifts article 2 and article 3.)
Capture the mode selector, the level input, and the quoted premium. Do it for all three
modes. The entire competing SERP has zero screenshots.

**2. Record real premiums.** (Lifts article 2 hardest.)
Quote a $90,000 floor on 1 BTC. Write down the exact cost and the timestamp. Repeat in a
different volatility regime a week later. Replace the illustrative payoff tables with real
ones. This alone is worth roughly 8 points on article 2.

**3. Screenshot the leaderboard.** (Lifts article 4.)
Live volume, staking tier, projected year-end USDC. One image answers the question every
competing page dodges.

**4. Price the same structure on Deribit.** (Lifts article 2 to reference-grade.)
Publish the spread between a PERPS+ collar and the equivalent Deribit collar. That table
would get cited by other people, which is the definition of reference-grade.

**5. Query the Uniswap V3 AEVO/USDC positions on-chain.** (Lifts article 4.)
The treasury LP positions are public. Pull actual accrued fees and check the 808,800 USDC
projection against the chain. Nobody has done this.

**6. Time the mobile flow.** (Lifts article 3.)
Seconds from app-open to protected position, mobile versus desktop. A measured number
beats an asserted claim.

**7. Hold a position through a real move.** (Lifts article 2 and 3.)
Open one of each mode. Publish the P&L against an unprotected control. This is the
strongest possible evidence and the only one that takes real time.

---

## Pre-publication checklist

Do not publish until these are resolved.

- [ ] **Confirm the topic mapping.** Open all four source posts and verify each article
      matches its post. The mapping is inferred from timestamp decoding plus dated
      corroboration, not from reading the posts.
- [ ] **Re-verify every `[S]` figure** against its primary source. Aggregator numbers drift
      and get restated incorrectly.
- [ ] **Confirm the US/UK app restriction** is current, and date the claim.
- [ ] **Confirm Android availability** for the Aevo app, either way.
- [ ] **Find the exact year-end distribution date.** "Year-end" is not publishable as a
      date.
- [ ] **Confirm the PERPS+ tenor** — what expiry the protection leg is priced against and
      how it rolls. This is the biggest unanswered question in the topic cluster.
- [ ] **Check whether PERPS+ has expanded beyond BTC and ETH** since March 2026.
- [ ] **Re-check the perp DEX share figures.** Two sources give ~36% and ~44% for
      Hyperliquid on different methodologies. Both are quoted; pick one and explain the
      methodology, or keep both and say why they differ.
- [ ] **Add a disclosure line** if any position is opened to produce first-hand evidence.
- [ ] **Add author byline and credentials.** Experience is a scored dimension and an
      unattributed page cannot claim it.

---

## Structural recommendations for the cluster

**Internally link all four.** They form a genuine topic cluster: reveal → product →
distribution → economics. Article 2 is the pillar; the other three should link up to it.

**Article 2 should carry the primary commercial intent.** It answers the highest-volume
question in the set ("what is PERPS+ / how does it work"), it scores highest, and its SERP
is the shallowest relative to its search demand.

**Article 1 is the easiest ranking win.** The March 2026 reveal had no press-wire
distribution, so competing coverage is thin and aggregator-generated. Low competition, real
entity news demand.

**Article 3 has the hardest SERP and the weakest unique claim.** Six or more domains carry
near-identical syndicated copy. Screenshots and timings are not optional there — without
them it is a differentiation problem no amount of prose solves.

**Article 4 ages fastest.** The 808,800 USDC figure is a projection. Date-stamp it
prominently, and plan a revision once the actual distribution lands. If the monthly
projection series in the capture list gets built, this article becomes the durable
reference for the topic.
