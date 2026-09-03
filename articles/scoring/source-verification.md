# Source Verification and Known Limitations — Iteration 1

**Compiled:** 3 September 2026

---

## Answer up front

**The four source X posts could not be read.** `x.com` is blocked by this environment's network egress proxy, as are every mirror tried (`xcancel.com`, `r.jina.ai`, `api.fxtwitter.com`, `t.me`) and Aevo's own site (`www.aevo.xyz`). WebFetch reaches only a developer allowlist — `github.com` worked; `en.wikipedia.org` and `coinmarketcap.com` did not.

Topics were therefore reconstructed from web search plus the tweet timestamps decoded from the status IDs.

**One mapping is solid. Three need confirmation before publication.**

---

## Post-to-topic mapping

Timestamps decoded from Twitter snowflake IDs — `(id >> 22) + 1288834974657` milliseconds — which is arithmetic on the ID itself and is reliable independent of any network access.

| # | Status ID | Decoded timestamp (UTC) | Assigned topic | Confidence |
|---|---|---|---|---|
| 1 | 2029965683056930907 | 2026-03-06 17:01 | Aevo MCP + AI trading bot | **High** |
| 2 | 2036035408430084283 | 2026-03-23 11:00 | AEVO staking, buybacks, 69M burn | **Low** |
| 3 | 2083191674344255953 | 2026-07-31 14:02 | Governance Portal / AGP voting | **Medium** |
| 4 | 2090842637179691210 | 2026-08-21 16:45 | Treasury LP revenue distribution | **Medium-high** |

### Basis for each

**Post 1 — High.** A search for the literal status ID returned a result stating the ID links to a post about "Introducing Aevo MCP and AI Trading Bot." Independently corroborated by two dated third-party X posts in the same week: `@aixbt_agent` (ID 2030460650707923141, ~8 March 2026) describing "45+ tools for market analysis and execution" with Claude Desktop and Cursor compatibility, and `@RiddlerDeFi` (ID 2031734347657883861, ~11 March 2026) confirming both the MCP launch and the Telegram trading bot. Two live GitHub repositories corroborate the technical detail.

**Post 2 — Low. This is the weak link.** Search surfaced the post's title as bare link text — `"https://t.co/y02Nt3MoT4"` — meaning the post is a URL with no accompanying copy. The destination could not be resolved. Nothing dated 23 March 2026 was found. Adjacent context: Aevo announced a product launch plus AMA for 16 March 2026, one week earlier; the AGP-3 staking, buyback and burn programme was the dominant Aevo story through Q1 2026. The staking/burn topic was chosen as the best-supported subject in the window. **It may well be wrong.**

**Post 3 — Medium.** No result matched the exact date. Multiple sources describe Aevo having "recently launched a new Governance Portal" in July 2026 context, with portal enhancements listed among ongoing initiatives. Best available fit, not a confirmed match.

**Post 4 — Medium-high.** Multiple sources place the Treasury LP Revenue Distribution of 674,000 USDC at "late August 2026." A post on 21 August 2026 fits that window closely. Not confirmed verbatim.

---

## Fact verification status

### Verified against primary sources

Retrieved directly from `github.com`, which was reachable:

- Aevo MCP repository exists at `ribbon-finance/aevo-mcp`; MIT licence.
- Tools named in the README: `markets`, `account`, `portfolio`, `positions`, `orderbook`, `build_order`, `create_order`, `cancel_order`, `register_account`.
- Prompts `trade_plan`, `risk_checklist`; resources `aevo://status`, `aevo://markets/summary`.
- Install routes: Docker + HTTP transport, pip + stdio, Claude Desktop config.
- Environment variables: `AEVO_API_KEY`, `AEVO_API_SECRET`, `AEVO_WALLET_ADDRESS`, `AEVO_SIGNING_KEY_PRIVATE_KEY`.
- `ribbon-finance/aevo-trading-skills` repository confirms **45 tools**, testnet availability, and client support for Claude Desktop, OpenClaw, Cursor and Windsurf.

### Corroborated across two or more independent sources

- 69,000,000 AEVO burned January 2026 = 6.9% of total supply.
- sAEVO = staked status of AEVO, not a separate or receipt token.
- sAEVO carries 2x voting power.
- Default quorum 2,500,000 AEVO or 1,250,000 sAEVO.
- Snapshot voting, up to one calendar week.
- Buyback split 50% burned / 50% to DAO Treasury.
- Rewards Epoch 20, 20 April 2026: 1,000,000 AEVO over 7 days, 700k perps / 300k options.
- Treasury LP distribution revised from ~674,000 USDC (August) to ~808,800 USDC (end of December), +20%.
- Eligibility: active COMMANDER or LEGEND tier on the distribution date, plus 10M global volume from 1 January 2026 while at tier.
- Six Ondo tokenized stocks (NVDAon, TSLAon, SPYon, QQQon, HOODon, GOOGLon) live on Aevo 7 August 2026.

### Single-source — flag before publishing

These appear in one search result each. Each is marked in-article where used, but confirm against `docs.aevo.xyz` before publication:

| Claim | Where used |
|---|---|
| Staking rewards of 100,000 AEVO per week | Article 2 |
| Tier formula weighting stake 30% / volume 70% | Articles 2, 4 |
| Staking APRs "up to 271.6%" | Articles 2, 4 |
| 5x max airdrop base boost, 2x max lucky boost | Article 2 |
| LP fee sharing beginning June 2026 | Article 2 |
| Monthly LP NFT minting on the 15th | Articles 2, 4 |
| Market capitalisation $16.29M on 27 July 2026 | Articles 2, 3, 4 |
| Aevo L2 throughput "over 5,000 TPS" | Article 1 context |
| Cumulative trading volume "over $30 billion" | Not used — unverified |

### Deliberately excluded

- **Philippines SEC action (21 April 2026).** A search result stated Aevo was named in a crackdown on seven unlicensed crypto platforms. Single source, legally sensitive, and unrelated to the four post topics. **Do not publish without primary confirmation from the regulator.**
- **Live price and market data.** Volume, open interest and market cap figures move daily. Where used, they are dated in-text. Re-verify at publication.
- **"Over $30 billion in cumulative volume."** Promotional framing from a single source; no independent confirmation found.

---

## Numbers that will go stale

Re-verify these before publishing and on each iteration:

| Figure | Nature | Recheck |
|---|---|---|
| ~808,800 USDC December distribution | Projection, depends on realised LP fees | Before publication, and December |
| $16.29M market cap | Daily | Every use |
| 24h volume, open interest, pair count | Daily | Every use |
| 271.6% APR | Per-epoch snapshot | Every epoch |
| Current rewards epoch number | Rolling | Monthly |
| MCP tool count (45) | Repo may add tools | Per iteration |

---

## What to do about the gaps

1. **Open the four X posts manually** and confirm or correct the topic mapping in the table above. This is a two-minute task with a browser and it removes the largest risk in the deliverable.
2. **Resolve `t.co/y02Nt3MoT4`** — the destination of post 2. It determines whether Article 2 is on-topic at all.
3. **Cross-check every single-source claim** against `docs.aevo.xyz`, which was unreachable here but is publicly accessible.
4. If post 2 or post 3 turns out to cover a different subject, the affected article should be rewritten, not patched. The structure and FAQ method carry over; the facts would not.
