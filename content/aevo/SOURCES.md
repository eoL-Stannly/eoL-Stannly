# Source Retrieval Notes and Known Gaps

Recorded so the next iteration does not repeat this work, and so any reader can judge how much weight the articles carry.

## The four source posts could not be read

**This session's network egress policy blocks x.com.** Every route was attempted and refused at the proxy:

| Host | Result |
|---|---|
| `x.com` | `EGRESS_BLOCKED` |
| `api.fxtwitter.com` | `EGRESS_BLOCKED` |
| `xcancel.com` | `EGRESS_BLOCKED` |
| `nitter.net` | `EGRESS_BLOCKED` |
| `t.co` | `EGRESS_BLOCKED` |
| `t.me` (Aevo Updates mirror) | `EGRESS_BLOCKED` |
| `aevo.xyz`, `docs.aevo.xyz`, `aevo.mirror.xyz` | `EGRESS_BLOCKED` |

Direct page fetching is unavailable session-wide, not just for X — `en.wikipedia.org` returns the same block. Web *search* still works, so all research was conducted through search result summaries.

**Consequence:** no article in this set was rewritten from its source text. Each was reconstructed from secondary coverage and cross-referenced. To lift these articles properly, someone with unrestricted network access should re-read the four posts and the linked articles behind them.

## How post dates were established

Post IDs are Twitter snowflake identifiers. The timestamp is recoverable arithmetically:

```
timestamp_ms = (post_id >> 22) + 1288834974657
```

| Post ID | Decoded UTC timestamp |
|---|---|
| 2029965683056930907 | 2026-03-06 17:01:48 |
| 2036035408430084283 | 2026-03-23 11:00:43 |
| 2083191674344255953 | 2026-07-31 14:02:53 |
| 2090842637179691210 | 2026-08-21 16:45:05 |

These dates are **high confidence** — they are derived from the IDs themselves, not from any third-party report.

## Subject attribution confidence, per article

| # | Subject | Confidence | Basis |
|---|---|---|---|
| 1 | Aevo MCP server + Telegram bot | **High** | Third-party posts dated 7 and 9 March 2026 describe both launching in that window, with matching detail (≈45 tools, Claude Desktop and Cursor). Public repo `ribbon-finance/aevo-trading-skills` corroborates. |
| 2 | PERPS+ web launch | **Inferred** | The post's visible text is a bare `t.co` link. PERPS+ is confirmed live by 28 March 2026 (Epoch 17 allocated 300,000 AEVO to PERPS+ users), and Aevo states PERPS+ launched on web before mobile. Reasoning is set out in the article body. |
| 3 | PERPS+ mobile launch | **High** | Multiple wire and outlet articles dated July 2026 cover the mobile launch with consistent detail. |
| 4 | Leaderboard + year-end USDC distribution | **High** | Coindoo coverage and Aevo documentation both describe the permanent leaderboard, the 808,800 USDC projection and the move from the August 674,000 USDC schedule. |

Article 2 is the weak link. If a later session can read the post, verify the subject before relying on that article.

## Figures used, and their provenance

All figures in the articles are cited to a named source with a date. None were measured by the author. The one exception is flagged in place:

- **Article 4** derives an implied Uniswap V3 LP fee run-rate of ~404,000 USDC/year from the published 674,000 → 808,800 USDC change over ~4 months. The arithmetic and its assumptions are stated inline. It is an estimate, not an Aevo figure.

## Documentation not read directly

Aevo's own documentation (`docs.aevo.xyz`, `aevo.xyz/docs`) is blocked. Claims sourced to it reach these articles through search summaries. Anything attributed to Aevo documentation should be re-checked against the primary page before publication.

Specifically unverified against primary docs:

- PERPS+ option tenor and expiry mechanics
- Whether a PERPS+ options leg can be closed early or partially
- Fee treatment of the options leg versus a standalone options trade
- Margin and liquidation treatment of a PERPS+ position
- Current MCP client compatibility beyond Claude Desktop and Cursor
- Exact staking tier thresholds in AEVO terms (lock durations are confirmed; minimum stake sizes are not)

## Secondary sources consulted

Aevo and product coverage: Chainwire releases via Investing.com, DailyCoin, CryptoDaily, Pluang, CaptainAltcoin, CryptoDirectories, Coindoo, CoinMarketCap, Bitget News, Blockworks, Conduit, OKX Learn.

Market data: CoinLaw (crypto options and derivatives statistics), FalconX (Derive options), BlockEden (perp DEX market share), CryptoBriefing (Hyperliquid share), Crypto.com Research, Phemex (mobile trading share).

Security: KuCoin (AI trading agent incidents), Cyberdesserts (Trend Micro and Antiy CERT findings), Hermes Agent (MCP risk framing), Bitget Academy (exchange MCP adoption).

Academic: Bogousslavsky & Muravyev, *An Anatomy of Retail Option Trading*.

SEO framework: Hobo-web on commodity and non-commodity content, Evertune on the March 2026 core update, DigitalApplied on information gain.
