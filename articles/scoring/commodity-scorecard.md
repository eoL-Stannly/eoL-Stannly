# Commodity vs Non-Commodity Scorecard

**Scope:** the four rewritten Aevo articles in `articles/`.
**Question answered:** would Google's ranking systems classify this content as commodity (interchangeable, adds nothing) or non-commodity (uniquely useful, worth ranking)?

---

## Answer up front

Three of the four rewrites clear the non-commodity threshold. One is borderline.

| # | Article | Baseline coverage | This rewrite | Verdict |
|---|---|---|---|---|
| 01 | [Aevo MCP](../01-aevo-mcp-ai-trading.md) | 31 | **71** | Non-commodity, conditional |
| 02 | [PERPS+ mechanics](../02-aevo-perps-plus.md) | 28 | **74** | Non-commodity |
| 03 | [PERPS+ mobile](../03-aevo-perps-plus-mobile.md) | 22 | **64** | Borderline |
| 04 | [Ondo tokenized equities](../04-aevo-ondo-tokenized-equities.md) | 34 | **76** | Non-commodity |

The single change that produced most of the lift was **not** structure, headings or FAQs. It was adding analysis that does not exist anywhere else on the SERP: the options-structure equivalence table, the stop-loss vs option-floor distinction, the key-custody section, and the open questions the press releases avoid.

Structure and FAQs are hygiene. They stop content being penalised. They do not, on their own, make it rank.

**The ceiling without owner input is roughly 76.** Crossing 85 requires things only the site owner can supply: screenshots of the product in use, actual fill and premium data, a named author with verifiable derivatives credentials, and original testing of the MCP server. Those are listed per article below.

---

## The rubric

Seven dimensions, 100 points. Weighted toward what Google's helpful-content and E-E-A-T signals actually reward, not toward on-page checkbox SEO.

| # | Dimension | Points | What earns the points |
|---|---|---:|---|
| 1 | **Information gain** | 25 | Facts, analysis or synthesis absent from the current top-ranking results |
| 2 | **First-hand experience** | 20 | Evidence the author used the product: screenshots, fills, settings, failures |
| 3 | **Primary-source verification** | 15 | Claims traced to documentation, repositories, filings — not to other articles |
| 4 | **Differentiated data or analysis** | 15 | Original tables, comparisons, models, timelines built rather than copied |
| 5 | **Structural answerability** | 10 | AUF opening, clear H-structure, FAQ, entity clarity, extractable answers |
| 6 | **Author accountability** | 10 | Named author, verifiable expertise, stated method, corrections policy |
| 7 | **Freshness and maintenance** | 5 | Dated facts, review cadence, willingness to mark what is unverified |

**Bands:** 0–39 commodity · 40–54 thin · 55–69 borderline · 70–84 non-commodity · 85+ authority-grade.

### Why this rubric and not a keyword checklist

Google's stated position since the 2022 helpful content update is that scaled, low-value content — content that summarises what others said without adding value — is the target. Three of the four source topics are **press-release-originated**. Chainwire syndication puts an identical article on Investing.com, DailyCoin, CryptoDaily and a dozen aggregators within 48 hours. A rewrite of that press release is, by construction, the definition of commodity content: it is the same information in different words, competing against a dozen copies with more domain authority.

The only escape is information gain. Everything in this rubric above dimension 5 is a way of measuring it.

---

## SERP reality check

What actually ranks for each topic, verified by search.

### Topic 01 — Aevo MCP / AI agent trading

**Who ranks:** `awesome-mcp-servers` GitHub lists, `ccxt-mcp` repo, mcpmarket.com and mcpserverfinder.com directory pages, Bitget Academy's "Best Official Crypto Exchange MCP Servers 2026", CoinAPI blog, Nexo blog, Cryptohopper blog, a Medium tutorial.

**Pattern:** directory listings and generic "what is MCP" explainers. Almost none discuss operational risk, and none compare derivatives-specific MCP tooling.

**The gap:** nobody covers the credential-tier distinction or the hot-key implications of putting a signing key in an agent config. That is a real, unserved question for anyone who would actually install this.

### Topic 02/03 — PERPS+

**Who ranks:** Chainwire syndication (Investing.com ×2, DailyCoin, CryptoDaily, coindesk.cc, Pluang), plus CaptainAltcoin and cryptodirectories rewrites of the same release.

**Pattern:** near-identical text. The three mode names and the same two sentences of description appear in every result.

**The gap:** not one of them says what a protective put, covered call or collar is, or explains that Limit My Loss behaves differently from the stop-loss the reader is already using. That comparison is the question a real trader has, and the SERP does not answer it.

**Adjacent competition:** generic perps explainers from Kraken, Drift, Trust Wallet, Backpack, FIA and CoinDesk, plus Bybit's Perp Protect — an established competing product that no Aevo coverage mentions.

### Topic 04 — Tokenized equities on Aevo

**Who ranks:** FinanceFeeds, plus heavy coverage of Ondo Perps itself (Yahoo Finance, TheStreet, PRNewswire, Crypto Briefing, globalfintechseries) and competing launches (Crypto.com, eToro, Arbital).

**Pattern:** launch announcements. Asset lists and leverage numbers.

**The gap:** nobody explains why simultaneous spot-and-perp listing changes the position set, and nobody raises corporate actions, trading-hours mismatch or redemption mechanics — the three things that decide whether a tokenized share is economically equivalent to a share.

**Note on all four SERPs:** price pages (CoinGecko, CoinMarketCap, Kraken, Crypto.com, Forbes, MetaMask) crowd out every brand-name query. Any article whose title is just the brand name competes with those and loses. Titles must target the *question*, not the entity.

---

## Per-article scoring

### 01 — Aevo MCP · 71/100

| Dimension | Score | Note |
|---|---:|---|
| Information gain | 18/25 | Credential tiers, hot-key risk, CCXT/Bitget/Hyperliquid comparison — none on the SERP |
| First-hand experience | 6/20 | **Weakest area.** No install, no screenshots, no tool output |
| Primary-source verification | 14/15 | Sourced to Aevo's own public repository, not to secondary coverage |
| Differentiated analysis | 13/15 | Tool-group table, competitor comparison, distribution-channel argument |
| Structural answerability | 10/10 | AUF, clean H2s, 9-question FAQ |
| Author accountability | 5/10 | Method and limitations stated; no named author or credentials |
| Freshness | 5/5 | Dated, with an explicit unverified-claims note |

**To reach 85+:** install the server against testnet and publish the transcript. Show what the 45 tools return. Document one failure. Screenshot the Claude Desktop config with keys redacted. Name the author.

### 02 — PERPS+ mechanics · 74/100

| Dimension | Score | Note |
|---|---:|---|
| Information gain | 22/25 | Options-equivalence table and the stop-loss distinction are unique on this SERP |
| First-hand experience | 5/20 | No screenshots, no live premium quotes, no executed trade |
| Primary-source verification | 11/15 | Product facts sourced; Aevo's own docs not reachable from this environment |
| Differentiated analysis | 14/15 | Structure mapping, cost-of-each-mode section, Bybit comparison |
| Structural answerability | 10/10 | AUF, tables, 9-question FAQ |
| Author accountability | 7/10 | Analysis is explicitly labelled as analysis, not as Aevo's claim |
| Freshness | 5/5 | Dated; jurisdictional restrictions current |

**To reach 85+:** one screenshot of the PERPS+ entry panel with a live premium quote at a stated BTC price and date. A worked example with real numbers — entry, floor, premium paid, outcome at three price points. That single addition is worth more than another thousand words.

### 03 — PERPS+ mobile · 64/100 (borderline)

| Dimension | Score | Note |
|---|---:|---|
| Information gain | 14/25 | Geo-restriction and regulatory context are genuinely additive; the core release is thin |
| First-hand experience | 4/20 | No app screenshots — for a mobile-release article this is the decisive miss |
| Primary-source verification | 10/15 | Three independent outlets, all downstream of one press release |
| Differentiated analysis | 12/15 | 2026 timeline table and the "protection is time-sensitive" argument |
| Structural answerability | 10/10 | AUF, comparison table, 8-question FAQ |
| Freshness | 5/5 | Dated, with a candid low-confidence mapping note |
| Author accountability | 9/10 | Weak source-mapping is flagged rather than concealed |

**Honest verdict:** a mobile-availability announcement has a low information ceiling. There is only so much to say.

**To reach 80+:** screenshots of the actual mobile flow — the three modes, the tap, the confirmation. This is the one article where first-hand evidence is not optional. Without it, the article is a better-written version of a press release, and Google has no reason to prefer it over Investing.com's copy.

**Alternative:** merge into article 02 as a section. One strong page beats two thin ones.

### 04 — Ondo tokenized equities · 76/100

| Dimension | Score | Note |
|---|---:|---|
| Information gain | 21/25 | Position-set table and the three open questions are absent from all coverage |
| First-hand experience | 6/20 | No trades, no observed spreads, no funding-rate data |
| Primary-source verification | 13/15 | Ondo's own blog and PRNewswire release used directly |
| Differentiated analysis | 15/15 | Position-set table, competitive read on Ondo's strategy, token timeline |
| Structural answerability | 10/10 | AUF, tables, 9-question FAQ |
| Author accountability | 6/10 | Open questions marked open — a strong honesty signal, still unnamed author |
| Freshness | 5/5 | Dated to the day |

**To reach 85+:** record observed funding rates on the six equity perps across one weekend and one U.S. market open. Nobody has published that. It would be the only source for it, it is genuinely useful, and it directly answers the trading-hours question this article can only raise.

---

## What "non-commodity" requires, generally

Ranked by return on effort for this set.

1. **First-hand evidence.** Screenshots, fills, premiums, failures. This is the largest single gap across all four articles and the one Google's experience signal weighs most heavily. Costs an afternoon.
2. **Data nobody else has.** Observed funding rates. Actual premium costs at stated spot prices. Latency of an MCP tool call. A weekend gap measured, not theorised.
3. **Analysis that requires expertise.** The options-equivalence table is an example: it takes derivatives knowledge to write and cannot be produced by paraphrasing a press release.
4. **The questions the vendor avoids.** Corporate actions. Redemption. Jurisdiction. Key custody. Every omission in a press release is an information-gain opportunity.
5. **A named, credentialed author.** Free. Immediate E-E-A-T lift. Currently costing every article in this set 3–5 points.
6. **Titles that target questions, not entities.** Brand-name queries lose to price pages. "Is Limit My Loss better than a stop-loss?" is winnable. "Aevo PERPS+" is not.

## What does *not* make content non-commodity

Stated plainly, because these consume most SEO effort for near-zero ranking return:

- Adding headings to a press release rewrite.
- Bolting on an FAQ made of questions the article already answered.
- Length. A 3,000-word rewrite of a 400-word press release is a longer commodity.
- FAQ schema markup on content with no information gain — valid markup on a worthless page.
- Synonym-swapping and "rewriting in your own words." This is the exact behaviour the helpful content system targets.

---

## Method note

Baseline scores were assigned by applying the same rubric to the currently ranking coverage for each topic, identified by live search in September 2026. Rewrite scores are self-assessed against the same rubric and should be treated as directional. Dimension 2 (first-hand experience) is capped low across all four articles because the original X posts and Aevo's own product surface were **not reachable from this environment** — `x.com`, `docs.aevo.xyz`, `t.me` and the major crypto data sites are blocked by the network egress proxy. That constraint is the binding limit on every score in this document, and it is a constraint the site owner does not have.
