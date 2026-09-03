# Iteration Log

The brief is to iterate and improve each run. This file carries state between runs so each iteration starts from the last one rather than from scratch.

---

## Iteration 1 — 3 September 2026

**Scope:** initial build. Four articles, FAQ sections, non-commodity rubric and scoring, SERP analysis, source verification.

**Research performed:** 14 web searches; 4 successful WebFetch calls (both GitHub repositories reachable; all other domains blocked).

**Scores**

| Article | Info gain | Experience | Data | Query cov. | Structure | Total | Grade |
|---|---|---|---|---|---|---|---|
| 01 — Aevo MCP | 7 | 2 | 8 | 7 | 8 | **32** | Marginal |
| 02 — Staking & burn | 6 | 1 | 9 | 7 | 8 | **31** | Marginal |
| 03 — Governance portal | 8 | 1 | 7 | 7 | 8 | **31** | Marginal |
| 04 — Treasury LP | 8 | 1 | 9 | 8 | 9 | **35** | Non-commodity (lower bound) |

**Mean: 32.25 / 50**

**What worked**
- AUF openings are tight. Article 4's headline carries the news itself.
- Data density is strong — 30/70 tier weighting, 2.5M/1.25M quorum, 674k→808.8k revision are each near-absent from ranking pages.
- Article 4 crossed the line purely on currency: several ranking pages still report the superseded 674k/August figure.
- The SERP analysis found a genuine open field. Nothing comprehensively documents Aevo MCP.

**What did not**
- Experience evidence is 1–2 out of 10 everywhere. This is the binding constraint.
- Article 2's topic assignment is low-confidence; the source post is a bare link that could not be resolved.
- Several load-bearing figures rest on a single source because `docs.aevo.xyz` was unreachable.

**Blocker hit:** `x.com` and all mirrors blocked by the network egress proxy. Source posts never read. Topics inferred from decoded timestamps plus search.

---

## Open actions, in priority order

### Must do before publishing

- [ ] **Open the four X posts manually.** Confirm or correct the topic mapping. Largest single risk in the deliverable.
- [ ] **Resolve `t.co/y02Nt3MoT4`** — the destination of post 2. Determines whether Article 2 is on-topic at all.
- [ ] **Cross-check single-source claims** against `docs.aevo.xyz` (see the table in `scoring/source-verification.md`).
- [ ] **Re-verify the stale-figure table.** Market cap, volume, open interest and the 808.8k projection all move.

### Iteration 2 — first-hand execution (the scores depend on this)

- [ ] **Install Aevo MCP on testnet.** Screenshot the install, a `markets` call returning a live order book, and one end-to-end testnet order. Publish response latencies. *Estimated +12 on Article 1.*
- [ ] **Enumerate all 45 MCP tools** and publish the list. No such page exists anywhere. *This alone is the highest-value asset in the set.*
- [ ] **Break it deliberately** — request a non-existent instrument, publish the error and what it teaches about instrument naming.
- [ ] **Pull AGP-2 and AGP-3 turnout from Snapshot.** Answer: has quorum ever failed? Free data, nobody has published it. *Estimated +6 on Article 3.*
- [ ] **Stake AEVO and record realised APR over 30 days** against the headline 271.6%. The advertised-versus-realised gap is the most valuable unpublished fact in topic 2. *Estimated +10 on Article 2.*
- [ ] **Screenshot the tier interface** and document where a user checks their own progress toward the 10M volume threshold. *Estimated +6 on Article 4.*

### Iteration 3 — original data work

- [ ] Chart buyback capacity against actual protocol volume from DefiLlama or Dune. Answer whether the buyback programme is large enough to matter at a ~$16M market cap.
- [ ] Build a comparison table of Aevo's MCP server against Coinbase's, CoinGecko's and BitGo's. Nobody has built one.
- [ ] Model whether 808,800 USDC holds at current LP fee run-rate. Show the arithmetic.
- [ ] Track monthly burns with on-chain evidence and publish a running total.

### Structural, any iteration

- [ ] Attach a named author with a stated reason to know — explicit Google "Who, How and Why" guidance.
- [ ] Add a method disclosure: what was tested, when, testnet or mainnet, with how much capital.
- [ ] Add `FAQPage` and `Article` schema with `datePublished` and `dateModified`.
- [ ] Add visible "last verified" dates.
- [ ] Shift Article 2's citations from aggregators toward `docs.aevo.xyz` and `agp.aevo.xyz`.

---

## Do not do

Recorded because these are the instincts that will surface and none of them will move the scores.

- **Add words.** All four articles already exceed most ranking pages. Length is not the constraint.
- **Add FAQs.** Eight per article already exceeds the SERP. A ninth restates the eighth.
- **Add keyword variants.** Entity coverage is adequate.
- **Rewrite the prose.** The prose is not the problem. The absence of first-hand evidence is.

---

## Score targets

| Iteration | Target mean | Route |
|---|---|---|
| 1 (done) | 32.25 | Secondary-source rewrite — ceiling reached |
| 2 | 42+ | First-hand execution: run it, stake it, vote with it |
| 3 | 45+ | Original data: charts, comparisons, on-chain tracking |
