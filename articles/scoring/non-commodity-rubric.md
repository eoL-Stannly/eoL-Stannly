# Non-Commodity Content Rubric (v1)

**Answer up front:** Content is "commodity" when a search engine can find the same
substance on a dozen other pages. It is "non-commodity" when at least one thing on the
page exists nowhere else and a reader would have to come here to get it. This rubric
scores that difference out of 100 across six weighted dimensions.

## Why this rubric exists

Google has never used the word "commodity" in a public policy document. Three published
things do describe the same idea, and this rubric is built on them:

1. **The information gain patent.** Google holds US patent **US11354342B2, "Contextual
   estimation of link information gain"** — filed 2018, granted June 2022, inventors
   Victor Carbune and Pedro Gonnet Anders. It defines an information gain score as being
   "indicative of additional information that is included in the document beyond
   information contained in documents that were previously viewed by the user." A page
   that repeats what the reader already saw scores near zero by that definition.
   ([Google Patents](https://patents.google.com/patent/US11354342B2/en),
   [Search Engine Journal](https://www.searchenginejournal.com/googles-information-gain-patent-for-ranking-web-pages/524464/))
2. **The helpful-content self-assessment questions.** The first question in Google's own
   list is: *"Does the content provide original information, reporting, research, or
   analysis?"*
3. **The scaled content abuse spam policy.** It targets pages produced mainly to rank
   rather than to help. The test Google describes is the *primary purpose* of the page,
   not the page count.

A patent is not a confirmed ranking system. Treat information gain as a useful model of
what "original" means, not as a leaked algorithm.

## The six dimensions

| # | Dimension | Weight | What earns the points |
|---|---|---|---|
| 1 | Information gain | 25 | Facts, numbers or framings absent from the current top 10 for the target query |
| 2 | Primary evidence | 20 | First-party data, original testing, screenshots, a calculation you performed |
| 3 | Expertise and entity signals | 15 | Named author with verifiable credentials, named publisher, disclosed relationship to the subject |
| 4 | Unanswered-question coverage | 15 | Answers questions the ranking set leaves open (the FAQ gap) |
| 5 | Verifiability | 15 | Every material claim traceable to a named, dated, linkable source |
| 6 | Structural extractability | 10 | Answer-up-front opening, short declarative sentences, quotable standalone passages, schema |

## Scoring bands

| Score | Band | Practical meaning |
|---|---|---|
| 0–39 | **Commodity** | Reproducible by anyone with the same brief. Expect no durable ranking. |
| 40–59 | **Near-commodity** | Better written than the average result, but substantively the same. Ranks only on domain strength. |
| 60–74 | **Differentiated** | Carries one genuine advantage. Ranks, but is copyable within a quarter. |
| 75–89 | **Non-commodity** | Contains material that cannot be sourced elsewhere. Attracts citations. |
| 90–100 | **Reference asset** | Becomes the thing other pages cite. Very hard to displace. |

## The hard rule about dimension 2

**Primary evidence is the only dimension that cannot be faked by better writing.** A page
can be restructured, sharpened, and fully cited and still cap out around 70. Crossing 75
requires something first-party: a number the publisher measured, a test the publisher ran,
a screenshot of the publisher's own screen, or a person the publisher spoke to.

Every scorecard in this repository therefore states its **ceiling without new evidence**
alongside its current score.

## The AUF (answer-up-front) requirement

Each article opens with a bolded answer of 2–4 sentences that resolves the title question
before any context. Rules applied:

- Short declarative sentences. One claim per sentence.
- Every number carries a date and a source.
- No throat-clearing ("In today's fast-moving crypto landscape…").
- The opening must survive being lifted out of the page and quoted alone.

## Source-reliability tiering

Facts in these articles are tagged in the [source ledger](../research/source-ledger.md):

- **Tier A** — primary documents: patents, protocol docs, governance proposals, filings.
- **Tier B** — established outlets and named research: CoinDesk, The Block, MIT Sloan,
  Variant Fund, academic PDFs.
- **Tier C** — aggregators, vendor blogs, syndicated PR. Usable for attribution of a
  company's own claims about itself. Never usable as independent verification.

A claim sourced only to Tier C is written as an attributed claim ("Aevo says…"), never as
a bare fact.
