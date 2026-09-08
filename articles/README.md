# Aevo / PERPS+ article set

Rewritten, structured, FAQ-bearing versions of four Aevo articles, each graded against a
commodity / non-commodity rubric.

## Contents

| File | Article | Target query | Score | Band |
|---|---|---|---|---|
| [01](01-protected-perps-explained.md) | Protected Perps: How Options Cap the Downside on a Perpetual Futures Position | "protected perps" | 61 | Differentiated |
| [02](02-the-options-interface-problem.md) | The Interface Problem: Why Retail Crypto Traders Still Do Not Use Options | "why don't retail traders use crypto options" | 66 | Differentiated |
| [03](03-perps-plus-mobile-launch.md) | Aevo Brings PERPS+ to Mobile | "Aevo PERPS+ mobile" | 52 | Near-commodity |
| [04](04-what-the-plus-in-perps-plus-means.md) | What the Plus in PERPS+ Means | "what is PERPS+" | 61 | Differentiated |

Supporting documents:

- **[Non-commodity rubric](scoring/non-commodity-rubric.md)** — the 100-point scale, its
  basis in Google's information gain patent and published policies, and the scoring bands.
- **[Scorecard v1](scoring/scorecard-v1.md)** — all four scores, competitor findings per
  query, and priority actions ranked by points per hour.
- **[Source ledger](research/source-ledger.md)** — every material claim with its source,
  reliability tier and verification status.
- **[Iteration log](ITERATION-LOG.md)** — what changed each pass and what the next pass
  should do.

## Method applied

**AUF — answer up front.** Each article opens with a bolded 2–4 sentence answer that
resolves the title question before any context. Short declarative sentences. One claim per
sentence. Every number carries a date and a source. The opening is written to survive
being quoted in isolation.

**Structure.** H2 sections that each stand alone. Comparison tables where a comparison
exists. No section depends on having read the one before it.

**FAQs.** Six to nine questions per article, drawn from what the current ranking set
leaves unanswered rather than from keyword tools. Each answer is self-contained.

**Grading.** Every article ends with a scored breakdown across six dimensions, its
classification, its ceiling without new evidence, and a numbered list of what would move
it into non-commodity territory.

## The headline finding

All four articles score between 52 and 66. None reaches the non-commodity threshold of 75.

The cause is the same in every case: **primary evidence averages 3.8 out of 20.** Nothing
in the set was measured, screenshotted, timed or calculated first-hand. Information gain
averages 18.3/25 and FAQ coverage 13/15, so the research and structure are working. The
missing 81% of the primary-evidence points cannot be recovered by writing.

Roughly three hours of first-party work — screenshots of the PERPS+ flow, nine real quoted
premiums, three payoff diagrams, a funding break-even table, and a named byline — would
take the set average from 60 to about 82. That work is listed in the
[scorecard](scoring/scorecard-v1.md#priority-actions-ranked-by-points-per-hour).

## Important limitation on v1

**The four source posts could not be read.** This environment's network egress proxy
blocked every attempted fetch, including `x.com` itself and all coverage domains. Post
timestamps were derived arithmetically from the X snowflake IDs; the article topics were
reconstructed from the cluster of Aevo coverage in the matching date ranges.

**The mapping of each article to each source post is inferred, not confirmed.** Confirm it
against the actual posts before publishing anything presented as a rewrite of a specific
post. Details are in the [source ledger](research/source-ledger.md#a-the-four-source-posts).
