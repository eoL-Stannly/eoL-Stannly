# Iteration log

This task is scheduled to run repeatedly and improve the set each pass. This file is the
handover between passes. **Read it before starting work.**

---

## v1 — 2026-09-08

### What was done

- Established the [non-commodity rubric](scoring/non-commodity-rubric.md): 100 points
  across six weighted dimensions, grounded in Google's information gain patent
  (US11354342B2), the helpful-content self-assessment questions, and the scaled content
  abuse policy.
- Wrote four articles from scratch with AUF openings, sectioned structure, comparison
  tables and FAQ blocks.
- Ran competitor searches for each target query and recorded findings in the
  [scorecard](scoring/scorecard-v1.md#ranking-set-findings-what-else-ranks).
- Built a [source ledger](research/source-ledger.md) tiering every claim by reliability.
- Graded each article and specified what would lift it past 75.

### Scores

| Article | Score | Band |
|---|---|---|
| 01 Protected Perps Explained | 61 | Differentiated |
| 02 The Options Interface Problem | 66 | Differentiated |
| 03 PERPS+ Mobile Launch | 52 | Near-commodity |
| 04 What the Plus Means | 61 | Differentiated |
| **Average** | **60** | |

### Blockers hit

**Network egress was blocked for every external domain.** WebSearch worked; direct page
fetching did not. Confirmed blocked: `x.com`, `api.fxtwitter.com`, `docs.aevo.xyz`,
`investing.com`, `cryptodaily.co.uk`, `dailycoin.com`, `thebittimes.com`,
`captainaltcoin.com`, `cryptodirectories.com`, `coinmarketcap.com`, `en.wikipedia.org`.

Consequences:

1. The four source posts were never read. Topics were reconstructed from adjacent
   coverage. **The post-to-article mapping is inferred.**
2. All facts come from search-result summaries, not from the pages themselves. Every entry
   in the source ledger marked "unverified against primary source" is exactly that.

### Original contributions made in v1

Worth preserving through future rewrites — these are what the information gain scores rest
on:

- The Bybit Perp Protect vs Aevo PERPS+ comparison table (article 01). No competing page
  compares them.
- The funding-cost argument: protection caps the price leg, not the funding leg (01, 03,
  04). Absent from all competing coverage.
- The 2018 Robinhood complex-options fee change connected to crypto options adoption (02).
  Not made anywhere in the ranking set.
- The nine-decision count for opening a hedged long manually (02).
- "An options chain does not fit on a phone" as the actual significance of the mobile
  launch (03).
- The mode-to-structure decoding table, and the explicit warning that Get Paid to Hold is
  not a hedge (04).

---

## Next pass — do these, in this order

### 1. Retry the blocked fetches first

Egress policy may differ between runs. Try `x.com/aevoxyz/status/<id>` for all four IDs
before anything else. If any resolve:

- Correct the post-to-article mapping in
  [the source ledger](research/source-ledger.md#a-the-four-source-posts).
- Rewrite whichever articles are mis-mapped.
- Remove the limitation notice from [README](README.md#important-limitation-on-v1).

### 2. Clear the verification queue

Listed in the [source ledger](research/source-ledger.md#verification-queue-for-the-next-run).
Priority order: Bybit's 2%-of-initial-margin figure; the U.S./U.K. availability
restriction; the 73% retail options loss rate; the $19B October 2025 liquidation day; the
equity futures and HYPE options claim (drop it if it cannot be confirmed).

### 3. Take the cheap points

Add a named author with verifiable derivatives credentials to all four articles. Fifteen
minutes, roughly 40 points across the set, and it is the single highest return available.

Add FAQPage and Article schema to each file.

### 4. Produce first-party evidence

This is the only work that lifts the set past 75. Ranked by points per hour in the
[scorecard](scoring/scorecard-v1.md#priority-actions-ranked-by-points-per-hour). Highest
value:

- Nine real quoted premiums: three PERPS+ modes at three protection levels, timestamped,
  with the BTC price recorded. Feeds articles 01, 03 and 04.
- Full screenshot sequence of the PERPS+ mobile flow. Article 03 is a mobile-launch piece
  with no images of the mobile product.
- Three payoff diagrams as SVG, one per mode. Article 04. No competing page has these.
- Funding break-even table at live funding rates. Articles 01 and 04.

Some of this needs a funded Aevo account. **If an account is not available, say so in the
next log entry rather than substituting more prose — the scores will not move and the
reason should be recorded, not hidden.**

### 5. Re-run the competitor searches

The ranking set moves. Re-check each target query and update
[the scorecard](scoring/scorecard-v1.md#ranking-set-findings-what-else-ranks). Watch
specifically for anyone else claiming the "protected perps" category term, which is
currently unowned.

### 6. Then re-score

Write `scoring/scorecard-v2.md`. Keep v1 for comparison. Update the article-level grade
blocks. Add a v2 entry here.

---

## Standing rules for every pass

- **Never raise a score without new evidence.** Rewriting prose does not increase
  information gain or primary evidence. If nothing first-party was added, the score does
  not move, and the log says why.
- **Never promote a Tier C claim to a bare fact.** Company statements stay attributed
  ("Aevo states…") until independently verified.
- **Preserve the original contributions listed above.** They are the differentiators. A
  rewrite that smooths them out lowers the score.
- **Keep the AUF openings quotable in isolation.** If the first paragraph stops making
  sense when lifted out of the page, it has been broken.
- **Record blockers honestly.** A pass that could not do the work is a useful data point.
  A pass that pretends otherwise is not.
