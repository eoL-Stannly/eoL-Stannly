# Non-Commodity Content Score (NCS) — Grading Framework v1

**Answer up front:** This framework grades an article 0–100 on how hard it would be for a competitor to replicate. Anything under 40 is commodity content that Google's 2026 systems demote. Anything over 75 is defensible. The four Aevo articles in this repo currently score **58, 61, 66 and 69** — all short of the 75 threshold, and all short for the same reason: no first-party data.

---

## Why this framework exists

Google's March 2026 core update re-weighted content quality around what the industry calls **information gain** — how much genuinely new knowledge a page adds relative to what already ranks for the same query.

Danny Sullivan, speaking at Google's Toronto Search Central event in April 2026, drew the line explicitly. On one side sits **commodity content**: generic, replicable material — basic event summaries, listicles, surface-level overviews that anyone could produce. On the other sits **non-commodity content**: unique, experience-driven, proprietary or deeply insightful material that competitors cannot easily duplicate.

The measured effect on visibility, per post-update analyses:

| Content type | Reported visibility change |
|---|---|
| Pages with proprietary data or first-hand case studies | +15% to +25% |
| Templated or rewritten content | −30% to −50% |
| Generic AI content farms | −60% to −80% |

The operative test is no longer "is this helpful?" It is: **would anything be irrevocably lost if this page disappeared tomorrow?**

An article rewritten from an announcement fails that test by default. The announcement still exists. That is the trap every article in this repo starts in, and the framework below is how we measure the climb out.

---

## The seven scoring dimensions

### 1. Information Gain — 25 points

How much of this page cannot be found on page one of the SERP already?

| Score | Standard |
|---|---|
| 21–25 | Majority of claims appear nowhere else in the top 10 results |
| 15–20 | Meaningful new synthesis, comparison or context; facts individually available elsewhere |
| 8–14 | Reorganised public information with light added context |
| 0–7 | Restatement of a press release or announcement |

### 2. Proprietary Data — 20 points

Data the publisher generated, not data the publisher cited.

| Score | Standard |
|---|---|
| 17–20 | Original dataset, on-chain query, survey, or measured benchmark run by the author |
| 11–16 | Original calculation or model built on top of public inputs, method disclosed |
| 5–10 | Third-party data cited and interpreted, no original computation |
| 0–4 | Numbers lifted from the announcement being covered |

### 3. Verifiability — 15 points

Every factual claim should be checkable by a reader without trusting the author.

| Score | Standard |
|---|---|
| 13–15 | Named source, date and figure on essentially every claim; uncertainty flagged |
| 9–12 | Most claims sourced; a few float |
| 4–8 | Sources present but sparse or vague ("reports suggest") |
| 0–3 | Unsourced assertion |

### 4. Experience Signals (the first E in E-E-A-T) — 15 points

| Score | Standard |
|---|---|
| 13–15 | Author used the product, with screenshots, transaction hashes, fills, or failure modes |
| 8–12 | Author demonstrates operational familiarity — costs, edge cases, what breaks |
| 3–7 | Competent explanation, no evidence of hands-on use |
| 0–2 | Describes the product from marketing copy |

### 5. Query Coverage — 10 points

Does the page resolve the follow-up questions, not just the headline one? Measured against People Also Ask, forum threads and the FAQ block.

### 6. Structure and AUF Discipline — 10 points

Answer-up-front: the direct answer sits in the first two sentences under each heading. Sentences are short. Facts are provable. No throat-clearing.

### 7. Irreplaceability — 5 points

The disappearance test. Score 5 only if removing the page destroys information that exists nowhere else.

---

## Grade bands

| NCS | Band | Expected treatment |
|---|---|---|
| 90–100 | Category-defining | Cited as a primary source by others |
| 75–89 | Non-commodity, strong | Defensible; survives core updates |
| 60–74 | Non-commodity, weak moat | Ranks, but replicable within a quarter |
| 40–59 | Borderline | Vulnerable to demotion |
| 0–39 | Commodity | Actively demoted by 2026 systems |

---

## Current scores

| # | Article | Info gain /25 | Proprietary /20 | Verifiability /15 | Experience /15 | Coverage /10 | Structure /10 | Irreplace. /5 | **NCS** | Band |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aevo MCP and the AI trading agent | 17 | 8 | 13 | 4 | 9 | 9 | 2 | **62** | Weak moat |
| 2 | PERPS+ launch | 15 | 7 | 12 | 4 | 9 | 9 | 2 | **58** | Borderline |
| 3 | PERPS+ on mobile | 16 | 9 | 13 | 5 | 9 | 9 | 2 | **63** | Weak moat |
| 4 | Leaderboard and year-end USDC | 18 | 11 | 13 | 5 | 9 | 9 | 3 | **68** | Weak moat |

Scores are deliberately conservative. Every article was written from public sources only.

---

## What is required to cross 75

The gap is the same for all four pieces, and it is not a writing problem. Ranked by points recoverable per unit of effort:

**1. Open an account and trade the product (+8 to +11 across dimensions 2, 4 and 7).**
Place one PERPS+ trade in each of the three modes on BTC. Record the premium quoted, the strike offered, the slippage, the fill time, and the exact fee. Screenshot the confirmation. Publish the numbers. No competitor rewriting the announcement has these, and they cannot be inferred.

**2. Run the MCP server and log what it does (+8 to +10).**
Connect it to a client, enumerate the tool list, and publish the actual tool names and counts. Record latency per call. Attempt a deliberately unsafe instruction and document what the permission model refuses. That is a security finding, and security findings get cited.

**3. Query the chain (+6 to +9).**
Aevo settles to Ethereum. Pull PERPS+ contract activity, count distinct addresses, chart adoption week by week since launch. Publish the query. An adoption curve is proprietary data even when the chain is public, because nobody else ran it.

**4. Model the economics (+4 to +6).**
Compute what "Get Paid to Hold" pays against measured funding rates over the same period. Show whether the premium beats the funding it replaces. Disclose the method.

**5. Ask the team three questions others have not (+3 to +5).**
One quote nobody else has moves a page out of the replicable tier.

**6. Track outcomes over time (+3 to +4).**
Revisit the year-end USDC distribution in January 2027 with the actual figure against the 808,800 projection. Accuracy tracking is durable, compounding, non-commodity content.

Applying items 1–3 alone moves every article in this set into the 75–85 band.

---

## Known limitations of this iteration

Recorded so the next pass does not repeat the work:

- The four source posts on X could not be retrieved. This session's network policy blocks x.com and all mirrors, so article subjects were reconstructed from secondary coverage and cross-referenced against timestamps decoded from the post IDs. Article 2's subject is inferred, not confirmed — see `SOURCES.md`.
- No figure in these articles was measured by the author. All are cited.
- Aevo's own documentation could not be read directly for the same reason; documentation claims come via search summaries and are marked accordingly.
