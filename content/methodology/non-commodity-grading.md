# Non-commodity content grading rubric

Every article in `content/articles/` carries a completed scorecard. An article
below 65 does not ship; it goes back for another iteration.

## The short answer

Google does not publish a "commodity content" label. What it publishes are the
systems that behave like one: the helpful content signals folded into core
ranking since the March 2024 core update, the spam policy on **scaled content
abuse**, and the **E-E-A-T** framing in the Search Quality Rater Guidelines.
Commodity content is what those systems demote — text that restates what is
already indexed and adds nothing a searcher could not get from the results above
it. Non-commodity content carries **information gain**: at least one claim,
number, comparison, or observation that does not already exist on the ranking
pages for that query.

So the operative test is not "is this well written". It is: **if this page
vanished, what would the searcher lose?** If the honest answer is "nothing", the
page is commodity regardless of length, headings, or polish.

## Scoring

100 points across eight dimensions, minus a risk deduction.

| # | Dimension | Max | What earns the points |
|---|-----------|-----|-----------------------|
| 1 | Information gain | 25 | Claims not present on the current top-10 for the target query. Primary sources read directly — docs, contracts, filings, the announcement itself — not coverage of them. |
| 2 | Experience and expertise | 15 | Demonstrated first-hand use: screenshots, transaction hashes, config that was actually run, a number the author measured. Credentials without evidence score 0 here. |
| 3 | Verifiable specificity | 15 | Named entities, dated figures, version numbers, contract addresses, exact quantities. Every material number carries a source and an as-of date. |
| 4 | Answer-up-front structure | 10 | The answer sits in the first two sentences under each heading, before context. Query-to-answer distance measured in sentences, not scrolls. |
| 5 | Question coverage | 10 | FAQ block answers the questions actually asked around this topic, including the ones competitors leave unanswered. Each answer standalone and self-contained. |
| 6 | Independent framing | 10 | A synthesis, comparison, or judgement the source material does not itself make. Paraphrase of one press release scores 0 here no matter how fluent. |
| 7 | Freshness and maintainability | 5 | Dated claims, a visible last-reviewed date, an update log, and no assertion that silently rots. |
| 8 | Machine readability | 5 | Clean heading hierarchy, one idea per section, claims phrased so they can be quoted intact by an answer engine, appropriate schema. |
| — | **Risk deduction** | **−15** | See below. |

### Risk deductions

Subtract for each, cumulative to −15:

- **−5** Unattributed statistic. A number with no traceable source is a liability,
  not evidence, and is the single most common way an otherwise good article
  becomes uncitable.
- **−5** Passage that reads as generated-at-scale: hedged throughout, no specific
  actor, no date, true of any competitor if you swapped the brand name. This is
  the pattern the scaled content abuse policy targets.
- **−5** Padding that delays the answer — definitional preamble, "in today's
  fast-moving landscape", restating the H2 as the first sentence beneath it.

### Bands

| Score | Band | Verdict |
|-------|------|---------|
| 80–100 | Non-commodity | Ship. Carries information the SERP does not have. |
| 65–79 | Differentiated | Ship. Better than the SERP consensus but not yet a primary reference. |
| 40–64 | Commodity-plus | Do not ship. Competent restatement. Needs original input. |
| 0–39 | Commodity | Do not ship. Rewrite from primary sources. |

## Turning a commodity draft into a non-commodity one

Polish does not move the score. Only new input does. In rough order of leverage:

1. **Read the primary source instead of the coverage.** The docs, the contract,
   the announcement, the filing. Most ranking pages are paraphrasing a paraphrase;
   going one level up is often the whole differentiator.
2. **Measure something.** Run the thing. Record the number, the date, the
   environment. One measured figure outranks a page of accurate description.
3. **Find the gap in the SERP.** Read the top ten. List the questions every one of
   them leaves unanswered. Answer those, prominently.
4. **Make the comparison nobody made.** Two sourced facts placed side by side is
   original analysis, and it is the cheapest information gain available.
5. **Date and attribute every number.** This converts assertions into citable
   claims and removes the risk deduction at the same time.
6. **Delete the parts a reader already knows.** Cutting the commodity half raises
   the density of the rest.

## Scorecard template

Copy into the front matter of each article.

```yaml
graded: YYYY-MM-DD
target_query: ""
serp_reviewed: []          # URLs of the top-10 read before drafting
scores:
  information_gain: 0      # /25
  experience_expertise: 0  # /15
  verifiable_specificity: 0 # /15
  answer_up_front: 0       # /10
  question_coverage: 0     # /10
  independent_framing: 0   # /10
  freshness: 0             # /5
  machine_readability: 0   # /5
  risk_deduction: 0        # 0 to -15
total: 0
band: ""
information_gain_claims: []  # the specific claims absent from the SERP
required_to_reach_non_commodity: ""
```

`information_gain_claims` is the honest test. If you cannot list at least three
concrete entries, the article is commodity and the score should say so.
