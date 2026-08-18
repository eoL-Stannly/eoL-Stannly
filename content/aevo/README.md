# Aevo core pages — batch 1

Five core pages drafted in the house style established by *Aevo Rewards | The Mega Reward Leaderboard is Live | Aevo | Stratosphere SEO*: bold H1, bold deck line, TL;DR bullet block, question-led H2s, comparison tables, direct second person, UK spelling, no hype.

| # | Page | File |
|---|---|---|
| 1 | Pre-launch token futures | `01-pre-launch-token-futures.md` |
| 2 | The Aevo MCP | `02-aevo-mcp.md` |
| 3 | Aevo's OTC desk | `03-aevo-otc-desk.md` |
| 4 | Aevo trading strategies | `04-aevo-trading-strategies.md` |
| 5 | Aevo staking (incl. the lottery) | `05-aevo-staking.md` |

## Verify before publishing

Direct fetching of `aevo.xyz`, `docs.aevo.xyz` and `otc.aevo.xyz` is blocked by this environment's network egress policy, so every fact below was sourced from search-result summaries of those pages rather than read on the page itself. Confirm against the live docs before these go out:

**High priority — numbers that would be wrong in public if they've moved**

- **Pre-launch:** initial margin 0.5x / max leverage 2x, maintenance margin 48%, max position 50,000 USDC, no index price, no funding. Confirm the 50,000 cap is still current and still per-position.
- **Pre-launch → perp conversion:** maintenance margin moving 48% → 3%. Confirm 3% is the standard perp MM across all markets, not just BTC/ETH.
- **MCP:** "45+ tools" is from Aevo's own launch messaging. Confirm the current count and, more importantly, get the actual connection/config details — the endpoint URL and client setup steps were not retrievable and the article deliberately points at the docs instead of inventing them.
- **Staking lottery:** this is the weakest section in the batch. A "Lottery System" exists in the staking docs but its mechanics, draw cadence and prize structure could not be retrieved. The article describes it at the level that is safely known and sends the reader to the docs. **It needs a proper rewrite once someone can read that page.**
- **Staking APR:** 271.6% at Epoch 20 launch (20 April 2026), high 260s/low 270s mid-May. Time-sensitive by nature; refresh or drop.

**Conflict to resolve**

- Duration tier on consolidation. The Mega Reward article (client-approved) says duration tier follows *the longest remaining lock*. One third-party source says it follows *your latest stake*. The drafts follow the client-approved wording. Worth confirming which is correct, because the "top-up shortens your tier" warning in article 5 depends on it.
- Amount tiers. Older third-party sources describe Bronze/Silver/Gold/Diamond. The drafts use LUNAR / MARTIAN / STELLARIS / CELESTIAL, per the client-approved article. Assumed the former is the retired system.

**Lower priority**

- OTC: zero exchange fees, any expiry to 3 months, early unwind at mark price, "~25% of altcoin options volume goes through exchanges".
- Strategies: the three PERPS+ mode names and their exact behaviour (Limit My Loss / Get Paid to Hold / Lock My Range).
- Weekly epoch at 1,000,000 AEVO and the LP NFT vesting ladder (7 / 5 / 3 / 1 weeks).

## Not done this run

Item 1 of the to-do list — the one-off keyword audit of the existing perps, hedging and options articles — **could not be started.** Those three articles are not in this repo, are not in the connected Google Drive, and the live site can't be fetched from here. Point the session at wherever they live (Drive file IDs, a doc folder, or the CMS) and the audit can run next cycle.
