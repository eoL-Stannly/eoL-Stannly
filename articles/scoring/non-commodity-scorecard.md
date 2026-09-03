# Non-Commodity Content Scorecard — Iteration 1

**Assessed:** 3 September 2026
**Assessor note:** scores are self-assessed against the rubric below and are deliberately conservative. A rewrite built from secondary sources has a hard ceiling. That ceiling is the most important finding in this document.

---

## Answer up front

**All four articles currently grade as *Marginal* — better than commodity, not yet reliably non-commodity.** Scores land between 29 and 34 out of 50.

None of them would be classed as thin or spam. All of them are, at present, *restatements of publicly available facts arranged well*. Google's helpful-content systems reward **information gain** — material a reader cannot get from the twenty pages already ranking. Arrangement is not information gain.

**The single change that moves all four articles from Marginal to Non-commodity is first-hand execution.** Run the MCP server. Stake the tokens. Vote on a proposal. Record what happened, with numbers and screenshots. Everything else in this document is secondary to that.

---

## What "commodity content" means here

Commodity content is text whose every factual claim exists, already indexed, on pages that outrank you. It can be accurate, well-written, well-structured, and still commodity. Structure is table stakes, not a differentiator.

Google's relevant public signals:

- **Helpful Content / "information gain"** — does the page add anything to the corpus?
- **E-E-A-T**, where the first E is **Experience** — evidence of first-hand use.
- **"Who, How and Why"** guidance — is there an identifiable author with a reason to know?

Non-commodity content passes a simple test: **could a competitor write this page without doing what you did?** If yes, it is commodity.

---

## The rubric

Five dimensions, 0–10 each, 50 total.

| # | Dimension | What earns a high score |
|---|---|---|
| 1 | **Information gain** | Facts, figures or synthesis not present in the source announcement or the top-ranking pages |
| 2 | **Experience evidence** | Proof the author used the thing: screenshots, outputs, timings, errors hit, transaction hashes |
| 3 | **Data density & verifiability** | Named, dated, sourced numbers; primary sources over aggregators |
| 4 | **Query coverage** | FAQs that answer real long-tail questions the SERP leaves unanswered |
| 5 | **Structure & entity clarity** | AUF, scannable headings, tables, schema-ready Q&A, clear entity relationships |

**Bands**

| Score | Grade | Google classification (predicted) |
|---|---|---|
| 0–24 | **Commodity** | Redundant. Filtered or ranked below the source. |
| 25–34 | **Marginal** | Ranks on long-tail only. Vulnerable to any core update. |
| 35–42 | **Non-commodity** | Defensible. Can outrank aggregators on specifics. |
| 43–50 | **Strongly non-commodity** | Becomes a cited source. Earns links. |

---

## Scores

### Article 1 — Aevo MCP: How to Connect Claude, Cursor or ChatGPT to a Derivatives Exchange

| Dimension | Score | Reasoning |
|---|---|---|
| Information gain | 7 | Situates the launch in MCP adoption data (97M monthly downloads, Linux Foundation donation, 41% enterprise production). Makes the read-only-vs-execution distinction no other page makes. |
| Experience evidence | **2** | Install commands are transcribed from the repository, not run. No output, no timings, no errors encountered. |
| Data density | 8 | 45 tools, 11 named primitives, MIT licence, named env vars, three install routes, exchange size data. |
| Query coverage | 7 | Eight FAQs including the genuine "11 or 45 tools?" contradiction. |
| Structure | 8 | Strong AUF. Tool table. Explicit limitations section. |
| **Total** | **32 / 50** | **Marginal** |

**Verdict:** the strongest of the four, and the one with the largest gap between potential and current state. This topic has almost no competition (see the SERP analysis) and a first-hand test would take it straight to the top band.

---

### Article 2 — AEVO Staking, Buybacks and the 69 Million Token Burn

| Dimension | Score | Reasoning |
|---|---|---|
| Information gain | 6 | The 30/70 stake-versus-volume insight and the Uniswap V3 double-yield explanation are genuinely under-covered. The burn itself is on hundreds of pages. |
| Experience evidence | **1** | No staking performed. No tier reached. No wallet, no transaction. |
| Data density | 9 | 69M / 6.9%, 100k AEVO weekly, 30/70 weighting, 5x and 2x multipliers, 271.6% APR, Epoch 20 splits, $16.29M market cap — all dated. |
| Query coverage | 7 | Eight FAQs, including the honest "are the 271.6% APRs real?" answer. |
| Structure | 8 | Clear AUF. Buyback flow diagram. Multiplier table. |
| **Total** | **31 / 50** | **Marginal** |

**Verdict:** the most competitive SERP of the four and the weakest experience evidence. Highest risk of being classed commodity.

---

### Article 3 — The Aevo Governance Portal: How AGP Voting Actually Works

| Dimension | Score | Reasoning |
|---|---|---|
| Information gain | 8 | The quorum-equivalence table (2.5M AEVO = 1.25M sAEVO = same voting power) is original synthesis. Setting quorum against a $16.29M market cap is analysis no ranking page performs. |
| Experience evidence | **1** | No vote cast. No proposal read in the portal. No participation-rate data pulled. |
| Data density | 7 | Quorum figures, 2x multiplier, one-week window, AGP-2 and AGP-3 outcomes. Fewer hard numbers available than the other topics. |
| Query coverage | 7 | Eight FAQs; the gasless-Snapshot answer resolves a common misconception. |
| Structure | 8 | Numbered process. Two-reading tension section avoids false certainty. |
| **Total** | **31 / 50** | **Marginal** |

**Verdict:** best original *analysis* of the four. The quorum-versus-float argument is the kind of thing that earns citations — if backed with real participation data.

---

### Article 4 — Aevo's 674k USDC Staker Payout Became 808k

| Dimension | Score | Reasoning |
|---|---|---|
| Information gain | 8 | Leads with a change most coverage has not updated for: 674k → 808.8k, August → December. Explains *why* the number grew (four extra months of LP accrual). That causal link appears nowhere in the sources. |
| Experience evidence | **1** | No stake, no tier, no eligibility check performed. |
| Data density | 9 | 674k, 808.8k, +20%, 10M volume threshold, dated eligibility window, tier names, mechanism comparison table. |
| Query coverage | 8 | Eight FAQs, all mapping to real decisions a staker faces. The three "traps" section pre-empts the questions before they are asked. |
| Structure | 9 | Strongest AUF of the set — the headline *is* the news. Flow diagram. Comparison table. |
| **Total** | **35 / 50** | **Non-commodity (lower bound)** |

**Verdict:** the only article that crosses the line, and it does so on one property: **it is more current than the pages ranking above it.** Recency is real information gain. It is also the most perishable — this advantage decays as other publishers update.

---

## Summary

| Article | Score | Grade | Biggest deficit |
|---|---|---|---|
| 04 — Treasury LP distribution | **35** | Non-commodity (lower bound) | Experience (1/10) |
| 01 — Aevo MCP | **32** | Marginal | Experience (2/10) |
| 02 — Staking & burn | **31** | Marginal | Experience (1/10) |
| 03 — Governance portal | **31** | Marginal | Experience (1/10) |

**Mean: 32.25 / 50.**

The pattern is unmistakable. Structure scores 8–9. Data density scores 7–9. **Experience scores 1–2 across the board and is single-handedly holding every article out of the top band.**

---

## What is required to make these non-commodity

Ordered by points gained per hour of work.

### Tier 1 — first-hand execution (+8 to +12 points each)

This is the whole game. Nothing else comes close.

**Article 1 — actually run the MCP server.**
- Install it. Record the command output.
- Screenshot Claude Desktop calling `markets` and returning a real order book.
- Time it. How long does `portfolio` take to respond? Publish the latency.
- Enumerate all 45 tools yourself and publish the list. **Nobody has done this.** It becomes the reference page.
- Break it deliberately. Ask for an instrument that does not exist. Publish the error.
- Place one testnet order end to end. Screenshot every step.

**Article 2 — stake real AEVO.**
- Stake, screenshot the sAEVO status, publish the transaction hash.
- Publish the actual tier thresholds you observe, with your stake and volume.
- Record your realised APR over 30 days against the headline 271.6%. **The gap between advertised and realised APR is the single most valuable fact in this topic.**

**Article 3 — participate in governance.**
- Screenshot a live AGP in the portal.
- Cast a vote. Publish the Snapshot link.
- Pull historical turnout for AGP-2 and AGP-3 from Snapshot and answer: has quorum ever failed? That single data point would be genuinely new.

**Article 4 — check eligibility for real.**
- Screenshot the tier interface and where volume is tracked.
- Publish where and how a user verifies their own 10M progress.

### Tier 2 — original data work (+4 to +6 points each)

- Pull Aevo's fee and volume history from DefiLlama or Dune and chart buyback capacity against actual volume. Answer the question no one asks: **is the buyback programme large enough to matter at $16.29M market cap?**
- Compare the 45-tool MCP surface against Coinbase's, CoinGecko's and BitGo's MCP servers. A comparison table is defensible content nobody has built.
- Model the December distribution: at current LP fee run-rate, does 808,800 USDC hold? Show the arithmetic.
- Track the monthly burn. Publish a running total with on-chain evidence.

### Tier 3 — authority and structure (+2 to +3 points each)

- **Named author with a stated reason to know.** "Who, How and Why" is explicit Google guidance. An anonymous crypto explainer starts at a disadvantage that no amount of good writing repairs.
- Disclose method: what was tested, on what date, on testnet or mainnet, with how much capital.
- Add `FAQPage` and `Article` schema with `datePublished` and `dateModified`.
- Link to primary sources — `docs.aevo.xyz`, `agp.aevo.xyz`, GitHub — over aggregators. Article 2 currently leans on aggregators more than it should.
- Add a visible "last verified" date. These figures move.

### What will NOT help

Stated plainly, because these are the usual instincts:

- **More words.** All four articles are already longer than most ranking pages. Length is not the constraint.
- **More FAQs.** Eight per article already exceeds the SERP. Adding a ninth restates the eighth.
- **More keyword variants.** The entity coverage is fine.
- **Rewriting the prose.** The prose is not the problem. The absence of first-hand evidence is the problem.

---

## The ceiling, stated honestly

**A rewrite from secondary sources cannot exceed roughly 35/50.** That is the structural limit of the format, and iteration 1 has effectively reached it.

Iteration 2 must involve doing something, not writing something.

The cheapest single action with the largest return: **install Aevo MCP, connect it to a client, enumerate all 45 tools, and publish the list with screenshots.** It is a few hours of work. It would take Article 1 from 32 to approximately 44, and it would create the only page on the internet that documents that tool surface.
