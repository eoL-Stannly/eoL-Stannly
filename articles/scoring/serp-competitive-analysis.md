# What Else Ranks — SERP Analysis, Iteration 1

**Method:** 14 web searches run 3 September 2026 against the four chosen topics and their variants. Direct SERP scraping was unavailable (see `source-verification.md`), so this reflects results surfaced by search rather than a rank-tracked position report. Treat ordering as indicative.

---

## Answer up front

**Three of the four topics are contested by aggregators. One is effectively uncontested.**

The uncontested one is Aevo MCP. Nothing in the results comprehensively documents Aevo's MCP server. The competition is generic "AI trading agents" content that never mentions Aevo, plus two GitHub repositories and a Glama directory listing. **That is the topic to attack.**

The competition everywhere else is a recognisable set: CoinMarketCap's AI-generated pages, Messari, Gate Learn, OKX Learn, CoinGecko, CoinLaunch, and a cluster of low-differentiation crypto news sites.

---

## Topic 1 — Aevo MCP / AI trading bot

**Competition level: LOW. This is the opportunity.**

| Ranking page | Type | Weakness |
|---|---|---|
| `github.com/ribbon-finance/aevo-mcp` | Primary repo | README only. No walkthrough, no screenshots, no tool list. |
| `github.com/ribbon-finance/aevo-trading-skills` | Primary repo | 5 commits. Reference docs, not a guide. |
| Glama MCP directory listing | Directory | Auto-generated stub. |
| Two X posts (`@RiddlerDeFi`, `@aixbt_agent`) | Social | A few hundred characters each. |
| TraderEvolution, Babypips, XBTFX, Robinhood | Generic AI-trading content | **Do not mention Aevo at all.** |
| `help.aevo.xyz` "Can I trade with a bot?" | Support doc | Predates MCP; answers a different question. |

**Gap:** there is no complete guide to Aevo MCP anywhere. The two social posts contain the only substantive third-party description, and they disagree on tool count (45+ vs the ~11 in the repo README).

**Facts found only in the tail, incorporated into Article 1:**
- 45 tools total versus ~11 primary tools in the core README — the contradiction itself is content.
- OpenClaw integration for automated trading operations (from `@aixbt_agent`).
- Prompts `trade_plan` / `risk_checklist` and resources `aevo://status`, `aevo://markets/summary` — in the repo, in no article.
- MIT licence; testnet available.

**Recommendation:** publish the definitive Aevo MCP guide with a full enumerated tool list and screenshots. Estimated effort: one afternoon. There is no incumbent to displace.

---

## Topic 2 — AEVO staking, buybacks, burn

**Competition level: HIGH. The most crowded of the four.**

| Ranking page | Type | Strength |
|---|---|---|
| `docs.aevo.xyz/trading-and-staking-rewards/staking` | Primary | Authoritative. Hard to beat on facts. |
| `agp.aevo.xyz` AGP-3 proposal | Primary | The source document. |
| CoinMarketCap `cmc-ai/aevo/latest-updates` | AI aggregator | High domain authority, constantly refreshed. |
| Messari project page | Data | Paywalled depth, strong authority. |
| Gate Learn, OKX Learn, Binance Square | Exchange education | High authority, generic treatment. |
| BitcoinEthereumNews, BitcoinWorld, KuCoin News | Crypto news | Thin, single-event coverage. |
| CryptoNewsNavigator "Aevo Stakers Captured A Burn That Sellers Walked Past" | Editorial | **The closest direct competitor — an actual angle, not a restatement.** |

**Gap:** almost everything covers *what happened* (69M burned). Very little covers *how the mechanism composes* — that rewards route through a Uniswap V3 LP NFT minted on the 15th of each month, and that tiers weight volume at 70% against stake at 30%.

**Facts found only in the tail, incorporated into Article 2:**
- 30% stake / 70% volume tier weighting.
- Buyback split: 50% burned immediately, 50% to DAO Treasury, evenly split between staking and trading rewards.
- 5x max airdrop base boost; 2x max trading-rewards lucky boost.
- Epoch 20: 700k AEVO to perps, 300k to options; APRs to 271.6%.
- Market cap $16.29M on 27 July 2026 — the denominator almost no burn article supplies.

**Recommendation:** do not compete on the burn. Compete on realised versus advertised APR, which requires actually staking.

---

## Topic 3 — Aevo governance portal / AGP

**Competition level: MEDIUM.**

| Ranking page | Type | Weakness |
|---|---|---|
| `docs.aevo.xyz/aevo-governance/...` | Primary | Reference documentation. Explains rules, not consequences. |
| `agp.aevo.xyz` | Primary | Proposal list. No commentary. |
| CoinMarketCap AI pages | Aggregator | One-line mentions of "governance portal enhancements." |
| BitcoinEthereumNews "69 Million AEVO Burned Amid Governance Shift" | News | Covers the burn, treats governance as background. |
| BYDFI Aave governance article | Adjacent | Different protocol; competes on the generic query only. |

**Gap:** no page analyses whether Aevo's quorum is achievable. The rules are documented everywhere; their implications are documented nowhere.

**Facts found only in the tail, incorporated into Article 3:**
- Default quorum: 2,500,000 AEVO or 1,250,000 sAEVO — **this number is largely absent from secondary coverage.**
- sAEVO carries 2x voting power.
- Snapshot, up to one calendar week.

**Recommendation:** the differentiator is turnout data. Pull historical participation from Snapshot and answer whether quorum has ever failed. That is a genuinely new fact and it is publicly obtainable.

---

## Topic 4 — Treasury LP revenue distribution

**Competition level: MEDIUM, and stale.**

| Ranking page | Type | Weakness |
|---|---|---|
| `docs.aevo.xyz/.../treasury-lp-revenue-distribution` | Primary | Authoritative but reference-style. |
| CoinMarketCap AI updates | Aggregator | **Still reports 674k USDC / late August.** |
| Tokenomist, CoinLaunch, CoinCarp | Data | Tokenomics tables; no distribution detail. |
| Various price-prediction pages | SEO filler | Irrelevant to the query. |

**Gap:** the ranking pages are out of date. Several still carry 674,000 USDC in August. The current position is approximately 808,800 USDC at end of December — a 20% increase.

**Facts found only in the tail, incorporated into Article 4:**
- The revision from 674k/August to ~808.8k/December, and the +20% delta.
- Full eligibility rules: COMMANDER or LEGEND tier on the distribution date, plus 10M cumulative global volume from 1 January 2026 while at that tier.
- The Uniswap V3 LP NFT funding chain.

**Recommendation:** publish fast. This advantage is recency-based and will erode as aggregators refresh. Being first to correct 674k → 808k is worth more this month than next.

---

## Cross-cutting observations

**1. CoinMarketCap's AI-generated pages are the dominant competitor on every Aevo topic.** They are fast, broad and high-authority. They are also shallow and prone to lag on revisions — Topic 4 proves it. Beat them on specificity and currency, never on breadth.

**2. Aevo's own documentation ranks well and deserves to.** Do not try to out-document the docs. Cover what documentation structurally cannot: what it is like to use, what the numbers mean, what actually happened.

**3. The most valuable facts consistently sit in the tail** — GitHub READMEs, the AGP portal, individual X posts from traders. The 30/70 tier weighting, the 2.5M quorum, the 808.8k revision: each appeared in exactly one or two results.

**4. Nobody is doing first-hand testing on any of these four topics.** Not one ranking page shows a screenshot of the product working. That is the open field.

---

## Priority order for iteration 2

| Priority | Topic | Why |
|---|---|---|
| **1** | Aevo MCP guide (Article 1) | No competition. Highest ceiling. One afternoon of work. |
| **2** | Treasury LP distribution (Article 4) | Recency advantage is real and decaying. Publish now. |
| **3** | Governance turnout data (Article 3) | Snapshot data is free and nobody has pulled it. |
| **4** | Staking realised APR (Article 2) | Highest competition. Requires 30 days of real staking to differentiate. |
