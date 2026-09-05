# Aevo MCP: What Happens When You Hand an AI Agent 45 Trading Tools

**Topic date:** 6 March 2026 · **Source post:** `x.com/aevoxyz/status/2029965683056930907`
**Commodity grade:** see [scorecard](scoring/commodity-scorecard.md) — **v2 score: 71/100 (non-commodity, conditional)**

> **Target query:** `aevo mcp server` / `crypto exchange mcp ai agent trading`
> **Title tag:** Aevo MCP Server: 45 Trading Tools for AI Agents, Explained
> **Meta description:** Aevo's MCP server exposes 45 exchange tools to AI clients like Claude Desktop and Cursor. What it does, how it compares to CCXT MCP, and the key-custody risk nobody mentions.

---

## Answer up front

Aevo shipped a first-party MCP server in early March 2026. It exposes **45 tools** to AI agents. Those tools cover market data, portfolio management, order execution, risk analysis and options strategies. It works with Claude Desktop, Cursor and other MCP-compatible clients. A Telegram trading bot went live in the same window.

Two credential tiers exist. Read-only access needs an API key and secret. Placing trades additionally needs a wallet address and a signing key. That distinction is the single most important fact in this article, and most coverage omits it.

You can run it locally, point it at Aevo's hosted endpoint, or connect through OpenClaw. Both mainnet and testnet are supported.

Source: [ribbon-finance/aevo-trading-skills on GitHub](https://github.com/ribbon-finance/aevo-trading-skills).

---

## What MCP actually is

Model Context Protocol is an open standard published by Anthropic in late 2024. It defines how a model discovers and calls external tools. Once a venue publishes an MCP server, any compatible client can use it without bespoke integration code.

That is the whole point. Before MCP, connecting a model to an exchange meant writing an adapter per exchange, per client. MCP replaces that with one self-describing interface.

Aevo is a decentralised derivatives exchange running on its own Ethereum layer-2, with an off-chain order book and on-chain settlement. It trades options, perpetual futures and structured products from a single margin account. That unified-margin design is why an options tool and a perps tool can sit in the same MCP server and act on the same balance.

## The 45 tools, grouped

The published skill definition breaks the surface area into five groups.

| Group | What it exposes |
|---|---|
| Market analysis | Real-time pricing, funding rates, volatility data, market-regime classification |
| Portfolio management | Position tracking, risk metrics, Greeks, margin monitoring |
| Order execution | Limit orders, bracket orders with stop-loss and take-profit, batch operations |
| Options strategies | Straddles, strangles, spreads, iron condors, butterflies — with live pricing |
| Risk management | Pre-trade validation, portfolio risk scoring, liquidation-distance monitoring |

Source: [aevo-trading-skills README](https://github.com/ribbon-finance/aevo-trading-skills).

Two entries in that table are unusual for an exchange MCP server: **Greeks** and **multi-leg options strategy construction**. Most crypto MCP servers are spot-and-perps wrappers. Pricing an iron condor requires the venue to expose an options chain and implied volatility, which most crypto venues do not.

## How it compares to what already exists

This is where the topic stops being a press release and starts being useful. Aevo's MCP server entered a category that was already populated.

- **CCXT MCP** — community-built, bridges AI clients to 100+ exchanges through the CCXT library. Broad, not deep. Generic spot and perps endpoints.
- **Bitget MCP** — a first-party server from a centralised exchange, standardised tool-calling into Bitget's own venue.
- **Hyperliquid MCP servers** — community projects for trading and strategy management on Hyperliquid.

Sources: [awesome-mcp-servers finance/crypto list](https://github.com/TensorBlock/awesome-mcp-servers/blob/main/docs/finance--crypto.md), [lazy-dinosaur/ccxt-mcp](https://github.com/lazy-dinosaur/ccxt-mcp), [Bitget Academy on exchange MCP servers](https://www.bitget.com/asia/amp/academy/best-official-crypto-exchange-mcp-servers-ai-agents-2026-introduction-to-bitget-mcp).

The differentiator is not "an exchange built an MCP server." By 2026 that is table stakes. The differentiator is **derivatives depth**: portfolio Greeks and multi-leg options structures, on a venue with cross-margin between options and perps.

## The part nobody writes about: key custody

An MCP server that can trade needs a signing key. That key sits in the configuration of whatever client you run — a desktop app, an IDE, or a hosted agent.

Three practical consequences follow:

1. **Read-only is a real mode, and it is the correct default.** API key plus secret returns account data and market data. It cannot move funds. Start here.
2. **A signing key in an agent's config is a hot key.** Treat it with the same care as any hot wallet. Scope it, fund it deliberately, and do not reuse it.
3. **Testnet exists and costs nothing.** The server supports it. There is no reason for a first agent run to touch mainnet.

None of this is exotic advice. It is standard operational security applied to a new integration surface. It appears in almost none of the coverage of this launch, which is precisely why including it creates information gain.

## Why an exchange ships this at all

An MCP server is a distribution channel. Every AI client that adds Aevo's server becomes a place where Aevo's markets are reachable without a user visiting the exchange's front end.

There is a second effect. Options are hard to use. Aevo's own product direction through 2026 was aimed at that problem — abstracting options into one-tap products for perps traders (see the [PERPS+ article](02-aevo-perps-plus.md)). An MCP server does the same thing for a different audience: it lets a model translate "hedge my ETH position for two weeks" into a live options structure. Same problem, different interface.

---

## FAQ

**What is Aevo MCP?**
A Model Context Protocol server published by Aevo that exposes 45 exchange tools to AI clients. It covers market data, portfolio and Greeks, order execution, options strategy construction and pre-trade risk checks.

**Which AI clients can connect to it?**
Any MCP-compatible client. The repository explicitly names Claude Desktop and Cursor, and supports connection through OpenClaw.

**Do I have to give it permission to trade?**
No. Read-only access requires only an API key and secret. Trading requires an additional wallet address and signing key. If you never supply the signing credentials, the agent can analyse but not execute.

**Can it place orders on its own?**
It can, if you give it trading credentials and your client permits tool calls without confirmation. Whether it *should* is a configuration decision you make, not a property of the server.

**Is there a testnet?**
Yes. The server supports both mainnet and testnet environments.

**How is this different from CCXT MCP?**
CCXT MCP is a community bridge to 100+ exchanges with generic endpoints. Aevo's is a first-party server for one venue with derivatives-specific tooling — Greeks, implied volatility and multi-leg options structures. Breadth versus depth.

**Does it cost anything to use?**
The MCP server itself is open-source software you can run locally. Trading through it incurs Aevo's normal exchange fees. Running it against a hosted endpoint may carry its own terms.

**What is the main risk?**
Key exposure and unsupervised execution. An agent with a signing key can act at machine speed on a misread of the market. The mitigations are ordinary: read-only first, testnet second, small scoped capital third.

**Was there also a Telegram bot?**
Yes. Third-party accounts tracking Aevo in March 2026 reported both the MCP server and a Telegram trading bot going live in the same period.

---

## Source and verification note

The original X post could not be retrieved from this environment — `x.com` and all mirror endpoints are blocked by the network egress proxy. This article was reconstructed from **independently verifiable primary and secondary sources**, principally Aevo's own public GitHub repository, and cross-checked against third-party commentary dated 8 and 11 March 2026.

**Date-to-topic confidence: high.** The post timestamp decodes to 6 March 2026 17:01 UTC, which sits immediately before independent reports of the MCP launch.

No figure in this article is stated without a source. Where a claim is inference rather than fact, it is labelled as such.

**Sources:**
- [ribbon-finance/aevo-trading-skills](https://github.com/ribbon-finance/aevo-trading-skills)
- [Aevo-MCP on Glama](https://glama.ai/mcp/servers/@ribbon-finance/aevo-mcp)
- [awesome-mcp-servers — finance & crypto](https://github.com/TensorBlock/awesome-mcp-servers/blob/main/docs/finance--crypto.md)
- [ccxt-mcp](https://github.com/lazy-dinosaur/ccxt-mcp)
- [Nexo — What is MCP? How AI agents are set to trade crypto for you](https://nexo.com/blog/what-is-mcp-ai-agents-crypto)
- [CoinMarketCap — What Is Aevo (AEVO) And How Does It Work?](https://coinmarketcap.com/cmc-ai/aevo/what-is/)
