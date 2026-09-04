# Aevo Article Set — Iteration 1

Four articles rewritten from Aevo (@aevoxyz) announcements, restructured with headings, answer-up-front openings and FAQ blocks, then graded against a non-commodity content rubric.

## The articles

| # | Article | Source post | Date | NCS | Band |
|---|---|---|---|---|---|
| 1 | [Aevo's MCP Server and Telegram Trading Bot](01-aevo-mcp-ai-trading-agent.md) | [2029965683056930907](https://x.com/aevoxyz/status/2029965683056930907) | 6 Mar 2026 | 62 | Weak moat |
| 2 | [Aevo PERPS+: Options Protection in One Click](02-aevo-perps-plus-launch.md) | [2036035408430084283](https://x.com/aevoxyz/status/2036035408430084283) | 23 Mar 2026 | 58 | Borderline |
| 3 | [PERPS+ Reaches Mobile](03-aevo-perps-plus-mobile.md) | [2083191674344255953](https://x.com/aevoxyz/status/2083191674344255953) | 31 Jul 2026 | 63 | Weak moat |
| 4 | [Aevo's Leaderboard and the 808,800 USDC Question](04-aevo-leaderboard-year-end-usdc.md) | [2090842637179691210](https://x.com/aevoxyz/status/2090842637179691210) | 21 Aug 2026 | 68 | Weak moat |

Grading rubric and band definitions: [SCORING-FRAMEWORK.md](SCORING-FRAMEWORK.md)
Source retrieval notes and known gaps: [SOURCES.md](SOURCES.md)

## The verdict, up front

**All four articles currently sit below the 75-point non-commodity threshold.** They will rank. They are not defensible.

The reason is identical across all four and it is not a writing problem. Every figure in this set is cited rather than measured. Under Google's post-March-2026 weighting of information gain, a well-structured synthesis of public sources is still a synthesis of public sources — templated and rewritten content lost 30–50% visibility in that update, while pages carrying proprietary data or first-hand case studies gained 15–25%.

The benchmark that matters: *would anything be irrevocably lost if this page disappeared tomorrow?* For three of these four, the honest answer is no. Article 4 scrapes past it on the strength of one original derivation.

## What each article adds beyond its source

Written into every piece deliberately, since restatement alone scores near zero:

- **Article 1** — the security dimension the launch post omits: $45M in AI trading agent incidents in 2026, 492 unauthenticated MCP servers found by Trend Micro, the lethal-trifecta failure mode, and a five-step hardening checklist.
- **Article 2** — a side-by-side against Bybit Perp Protect, the explicit trade-off in each PERPS+ mode, and a stated-evidence attribution chain for a post whose content could not be read.
- **Article 3** — the 70%-of-retail-trades-are-mobile statistic that reframes a routine parity release as a distribution unlock.
- **Article 4** — an original derivation of Aevo's implied Uniswap V3 LP fee run-rate (~404,000 USDC/year) from the two published distribution figures, with assumptions disclosed, plus the duration-lock reading of the deferral that no coverage makes.

## Iteration 2 — the work that moves the numbers

Ranked by points recoverable per unit of effort. Full detail in [SCORING-FRAMEWORK.md](SCORING-FRAMEWORK.md).

1. **Trade the product.** One PERPS+ trade in each of the three modes on BTC. Publish the premium quoted, strike offered, slippage, fill time and fee. Then build the same position manually on the options book and publish the price difference. Nobody has answered *what does the convenience cost?* — Articles 2 and 3, +15 to +20 combined.
2. **Run the MCP server.** Publish the real tool list and count, measure per-call latency, and document what the permission model refuses when handed a deliberately unsafe instruction. That last item is a citable security finding — Article 1, +8 to +10.
3. **Query the chain.** Aevo settles to Ethereum. Chart PERPS+ leg volume as a share of BTC/ETH perp volume, weekly, from the March web launch through the August mobile release. Publish the query. Tests Article 3's central claim — +6 to +9 across Articles 2 and 3.
4. **Measure the treasury LP position.** Replace Article 4's estimated 404,000 USDC/year with the actual figure — Article 4, +5 to +7.
5. **Get one quote nobody else has.** Three questions to the team, on expiry mechanics, PERPS+ adoption, and the MCP permission model.
6. **Track the outcome.** January 2027: publish the actual year-end distribution against the 808,800 projection. Accuracy tracking compounds.

Items 1–3 alone move every article into the 75–85 band.

## Method notes

- **Answer up front** throughout: the direct answer sits in the first two sentences under each heading, before context.
- **Short sentences carrying verifiable facts.** Figures are attributed to a named source with a date, or explicitly marked as derived with assumptions stated.
- **Gaps are published, not hidden.** Each article names what could not be verified. A page that marks its unknowns is more useful than one that papers over them, and the list doubles as the research brief for the next iteration.
