# AUF writing standard

AUF is answer-up-front. The answer comes first, then the evidence, then the
context. Every heading in every article follows the same shape.

## The rule

**Under each heading, the first sentence answers the heading. The second sentence
makes it verifiable. Context follows or is cut.**

A heading is a question, even when phrased as a noun. "Fee structure" asks what
the fees are. The reader gets that in sentence one, not after three sentences of
setup.

## Sentence construction

- One claim per sentence. Two claims joined by "and" become two sentences.
- Target 15 to 20 words. Over 30 words, split it.
- Active voice with a named actor. "Aevo settles trades on-chain" beats "trades
  are settled on-chain" — the second hides who does the settling.
- Numbers, dates, and named entities in the sentence that makes the claim, not in
  a footnote.
- No hedge stacking. "May potentially help improve" asserts nothing. State what is
  true, or state the uncertainty precisely: "unconfirmed as of 2026-09-06".

## Banned openings

These delay the answer and cost points under the rubric's risk deduction:

- "In today's fast-moving..." / "As the landscape evolves..."
- Restating the heading as the first sentence.
- Defining a term the target reader already knows.
- "Before we dive in, let's understand..."

## Provable facts only

Every material claim must be one of:

1. **Directly verifiable** — a figure, date, address, or version the reader can
   check against a named primary source.
2. **Attributed** — stated by a named party on a given date, presented as their
   statement rather than as fact.
3. **Explicitly marked uncertain** — with what would resolve it.

If a claim is none of the three, cut it. A fluent unverifiable sentence is worse
than no sentence: it is the exact texture that gets a page classed as commodity.

## Article structure

```
H1  — the topic as the reader would search it
      Two-to-three sentence answer to the whole article. Standalone.
      Reader who stops here has the answer.

H2  — What changed / what it is
H2  — How it works
H2  — Why it matters / who it affects
H2  — Numbers                     (dated, sourced, in a table)
H2  — Limitations and open questions
H2  — FAQ
      H3 per question, phrased as asked, answered in the first sentence
H2  — Sources                     (primary sources first)

Footer: last reviewed date, update log
```

## FAQ rules

- Each question phrased the way a person asks it, not the way a brand words it.
- Each answer standalone — no "as mentioned above". Answer engines lift these
  individually.
- First sentence is the complete answer. Anything after it is elaboration.
- 40 to 60 words per answer. Longer means the question needed splitting.
- Include the awkward questions. "What are the risks" and "what does it cost"
  are the ones competitors skip, and skipping them is why they rank as commodity.

## Before shipping

- [ ] Every H2's first sentence answers its heading
- [ ] Every number carries a source and an as-of date
- [ ] No sentence over 30 words
- [ ] No unattributed statistic anywhere
- [ ] FAQ answers work when read in isolation
- [ ] Scorecard completed, total ≥ 65
- [ ] At least three entries in `information_gain_claims`
