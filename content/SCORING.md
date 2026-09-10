# Commodity vs Non-Commodity Grading

## What Google means by commodity content

Commodity content is content whose substance exists identically on dozens of other pages. It is
**restatement**. It passes every surface quality check — accurate, well written, correctly structured —
and still gets suppressed, because it adds nothing the index does not already hold.

The relevant concept in Google's own language is **information gain**: the marginal new information a
document contributes over documents the user has already seen. Google's helpful content guidance asks
whether a page provides "substantial value when compared to other pages in search results" and warns
against content that "mainly summarises what others have to say without adding much value."

Practical translation, and this is the test to actually use:

> **If a competent writer with no special access could produce your page from the top 10 results in
> two hours, it is commodity content.**

Every article in this working set currently fails that test in the same specific way, and passes it in
the same specific way. See the grades.

---

## The rubric

Seven dimensions, scored 0–10, weighted to 100.

| # | Dimension | Weight | What earns a 10 |
|---|---|---:|---|
| 1 | **Information gain** | 25 | Contains facts, figures or analysis found on no other indexed page |
| 2 | **Primary source access** | 20 | Built from the original document, first-hand testing, or direct access nobody else has |
| 3 | **Original measurement** | 15 | Publishes data the author generated: tests, queries, scrapes, benchmarks |
| 4 | **Entity & number specificity** | 10 | Named entities, exact figures, exact dates throughout; nothing vague |
| 5 | **Query coverage** | 10 | Answers the head term plus the long tail people actually search |
| 6 | **Extractability (AUF)** | 10 | Every section's first sentence stands alone as an answer |
| 7 | **Expertise & stance** | 10 | Takes positions, names trade-offs, says what the source omitted |

**Bands**
- **0–39 Commodity.** Restatement. Will not rank without unrelated domain authority.
- **40–59 Weak commodity.** Better structured than competitors, same substance.
- **60–74 Borderline.** Real analytical value, no proprietary substrate. Ranks with links, decays without.
- **75–89 Non-commodity.** Contains something unavailable elsewhere. Ranks on merit.
- **90–100 Category-defining.** Becomes the cited source others rewrite.

---

## Grades

| Article | 1. Info gain | 2. Primary access | 3. Measurement | 4. Specificity | 5. Coverage | 6. AUF | 7. Stance | **Total** | Band |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 01 — Aevo MCP | 6 | 4 | 0 | 9 | 8 | 9 | 8 | **66** | Borderline |
| 02 — Tokenomics | 7 | 3 | 0 | 10 | 9 | 9 | 9 | **68** | Borderline |
| 03 — PERPS+ | 6 | 2 | 0 | 8 | 9 | 9 | 9 | **64** | Borderline |
| 04 — Tokenized equities | 6 | 2 | 0 | 9 | 9 | 9 | 8 | **62** | Borderline |

### Verdict

**All four are borderline. None is yet non-commodity.** Google would currently class these as
well-executed secondary sources — better organised and more honest than the competing coverage, but
assembled from the same public material.

They score above the commodity line because each does analytical work no competitor did:

- **01** argues *why* the 45-tool count is the real headline (tools = verbs = agency, not just data access), and connects the off-chain matching architecture to why an agent integration is coherent on Aevo specifically.
- **02** divides $2.8M by 69M tokens to derive an implied burn price of ~$0.041, then sets it against the ~$0.018–$0.026 August range. No source in the result set did that arithmetic. It also reads the 70/30 Epoch 20 split as evidence that an options-origin venue now sees its volume in perps.
- **03** names the cost that every launch write-up omitted — that "Get Paid to Hold" almost certainly sells optionality and caps upside — and identifies the options book as a structural moat competitors cannot copy quickly.
- **04** flags that the $30.7B and $141.84B figures measure different scopes and are not a clean before/after, and anchors both against $1.1T daily US equity turnover.

They score below the non-commodity line for one reason, identical across all four: **zero original
data, and near-zero primary source access.**

The primary-access scores are the floor of the whole exercise. `x.com` is blocked by this
environment's egress policy, so the four source posts could not be read. Article 01 scores 4 because
search returned its exact status ID with a title and a corroborating third-party description.
Articles 03 and 04 score 2 because they are built entirely on secondary reporting about a nearby
announcement, with the post-to-topic mapping inferred rather than confirmed.

---

## What is required to make them non-commodity

Ranked by points per unit of effort.

### 1. Publish original measurement — worth up to +15, and it is the only route to 75+

Nothing else moves the ceiling. Concretely, for these four:

- **01:** Connect an MCP client to Aevo and enumerate the actual tool list. Publish the table. "45+" is Aevo's marketing count; a verified inventory with names, parameters and what each returns exists nowhere and would be cited by everyone writing about agentic trading.
- **02:** Pull the burn transaction hashes on-chain. Chart realised burn value per month against AEVO price. Compute what stakers actually earned per epoch versus the advertised APR. The gap between advertised and realised APR is a publishable finding.
- **03:** Open a PERPS+ position in each of the three modes at a small size. Record the premium paid, the strike selected, and the payoff at exit. Nobody has published what protection actually costs as a percentage of position value.
- **04:** Track the six Ondo perps' funding rates for 30 days. Publish the realised return on the delta-neutral trade. The article asserts the trade exists; measurement proves whether it pays.

### 2. Get the actual source posts — worth up to +12 on dimension 2

Paste the real text of the four posts into `content/sources/` and re-run, or have `x.com` allowlisted
in the environment's egress policy. This converts three articles from inferred-topic to source-grounded
and removes the largest correctness risk in the set.

### 3. Add first-hand operator experience — worth up to +6 on dimensions 1 and 7

Screenshots of the real interface. What broke. What the fee actually was. Where the UI misleads.
Experience is the cheapest information gain available and the hardest for a competitor to fabricate.

### 4. Interview or quote a named practitioner — worth up to +5

One quote from a trader running these positions, attributed by name, is unavailable to every scraper
rewriting the same press release.

### 5. Keep the disagreement-reconciliation habit — already earning, do more of it

Article 04's flagging of incompatible volume figures is the highest-value paragraph in the set. Public
numbers conflict constantly in crypto reporting. Reconciling them is genuine information gain at almost
no cost.

---

## What the competing pages look like

Search for these topics and the results are almost entirely one of four types:

1. **Syndicated press releases.** The PERPS+ mobile launch appears near-verbatim across Chainwire, Investing.com, DailyCoin and CryptoDaily. Identical substance, four domains. Pure commodity.
2. **Exchange SEO pages.** Bitget, Gate, WEEX, Bybit and MEXC all host "What is Aevo" and AEVO price pages. Template content, updated by feed.
3. **Price prediction filler.** Changelly, LongForecast and similar. Algorithmically generated, no information gain, ranks on domain strength alone.
4. **A small number of genuine analyses.** Tiger Research's tokenized stock report and CoinGecko's price-discovery piece do original work. These are the real competitors.

The implication for positioning: the first three categories are beatable on substance immediately,
which is why these drafts already sit at 62–68. Beating category four requires original data. There is
no way around item 1 above.

---

## Iteration log

| Run | Date | Change | Best score |
|---|---|---|---|
| 1 | 2026-09-10 | Initial build. Four articles drafted from search-verified material after `x.com` fetch was blocked by egress policy. Rubric established. | 68 (article 02) |
