# Aevo MCP: How to Connect Claude, Cursor or ChatGPT to a Derivatives Exchange

**Source post:** https://x.com/aevoxyz/status/2029965683056930907 — 6 March 2026, 17:01 UTC
**Topic confidence:** High (status ID independently tied to the Aevo MCP / AI trading bot launch)
**Last revised:** 3 September 2026 · Iteration 1

---

## Answer up front

Aevo MCP is an open-source Model Context Protocol server that lets an AI assistant trade on Aevo. It exposes 45 tools covering market data, portfolio management, order execution, risk analysis and options strategies. It works with Claude Desktop, Claude Code, Cursor, Windsurf and OpenClaw. The code is MIT-licensed and published at `github.com/ribbon-finance/aevo-mcp`. You can run it locally over stdio, in Docker over HTTP, or point at Aevo's hosted endpoint. A testnet mode exists, so you can test without real funds.

Aevo shipped a Telegram trading bot in the same announcement.

---

## What Aevo MCP actually is

MCP stands for Model Context Protocol. It is a standard interface between an AI model and an external system. The model calls named tools; the server executes them.

Aevo MCP is the server half of that contract for Aevo's exchange. It does not contain a trading strategy. It gives a model structured, authenticated access to the exchange so the model can build one.

That distinction matters. The intelligence sits in the client. The exchange access sits in the server.

### The 45 tools, grouped

The public repository documents tools including `markets`, `account`, `portfolio`, `positions`, `orderbook`, `build_order`, `create_order`, `cancel_order` and `register_account`. Reference documentation for all 45 ships in the companion `aevo-trading-skills` repository.

They fall into five groups:

| Group | What the agent can do |
|---|---|
| Market data | Read prices, spreads, funding rates, order books, implied volatility |
| Portfolio | Track positions, monitor options Greeks, read account state |
| Execution | Place limit orders and bracket orders with stop-loss and take-profit |
| Options strategies | Construct straddles, strangles, spreads and iron condors |
| Risk | Pre-trade validation, liquidation monitoring, guardrail checks |

The server also ships two prompts — `trade_plan` and `risk_checklist` — and two resources, `aevo://status` and `aevo://markets/summary`.

Prompts and resources are the under-discussed part. A prompt is a reusable template the client can invoke. `risk_checklist` means the guardrails travel with the server, not with whichever model happens to be driving.

### The data the agent sees

Aevo describes the server as surfacing exchange-wide context: spreads, fees, funding, and relative strength against BTC. That is the raw material for a cross-market screen — the kind of comparison that takes a human several minutes and several tabs.

---

## How to install it

Three routes. Pick by how much you want to run yourself.

### Route 1 — Docker plus Claude Code (the documented recommendation)

```bash
git clone https://github.com/ribbon-finance/aevo-mcp
cd aevo-mcp
cp .env.example .env
# add AEVO_API_KEY, AEVO_API_SECRET, AEVO_SIGNING_KEY_PRIVATE_KEY
docker compose up --build -d
claude mcp add --transport http aevo-trading http://localhost:8080/mcp
```

### Route 2 — local install over stdio

Install with pip, then run `aevo-mcp --transport stdio`. Configure Claude Desktop by editing `claude_desktop_config.json` and supplying `AEVO_API_KEY`, `AEVO_API_SECRET`, `AEVO_WALLET_ADDRESS` and `AEVO_SIGNING_KEY_PRIVATE_KEY` as environment variables.

### Route 3 — Aevo's hosted endpoint

Point your client at Aevo's hosted MCP URL and authenticate with `AEVO-KEY` and `AEVO-SECRET` headers. No local runtime.

Credentials come from your Aevo account settings.

> **Security note.** `AEVO_SIGNING_KEY_PRIVATE_KEY` signs orders. Route 3 is the convenient option and also the one where the key handling is not on your machine. Start on testnet.

---

## Why this landed in March 2026

Context that the announcement itself does not give you.

MCP was recording roughly **97 million monthly SDK downloads as of March 2026** — the same month Aevo shipped. In December 2025, Anthropic donated MCP to the newly formed Agentic AI Foundation under the Linux Foundation, co-founded with Block and OpenAI and backed by AWS, Google, Microsoft, Salesforce and Snowflake. Downloads had gone from about 100,000 in November 2024 to over 8 million by April 2025.

The ecosystem now carries 5,800+ MCP servers and 300+ clients. Stacklok's 2026 software report put **41% of surveyed software organisations in limited or broad production** with MCP servers.

Crypto was not first to this. BitGo, Coinbase, Crypto.com, CoinGecko and deBridge had each already released official MCP servers.

So Aevo was not inventing a category in March 2026. It was doing something narrower and more interesting: most crypto MCP servers at that point were **read-only data servers**. Aevo's includes `create_order` and `cancel_order`. It executes.

---

## The honest limitations

Three, stated plainly.

**Aevo is a small venue.** CoinGecko lists 128 trading pairs. Reported 24-hour volume has been in the single-digit millions of dollars, with aggregate perpetual open interest around $8.5M across 13 venues. An agent that sizes positions as if this were Binance will move the book against itself.

**Agents are not deterministic.** A language model deciding to call `create_order` is a probabilistic system with an execution primitive. `risk_checklist` and pre-trade validation exist for exactly this reason. Use them.

**Options are the hard part.** Straddles and iron condors have multiple legs, and partial fills on multi-leg structures leave you with a position you did not intend. Check fills leg by leg.

---

## Frequently asked questions

### Is Aevo MCP free?
The server is MIT-licensed and free to run. You still pay Aevo's normal trading fees on any order it places.

### Does it work with ChatGPT?
It works with any MCP-compliant client. Claude Desktop, Claude Code, Cursor, Windsurf and OpenClaw are the named-compatible clients. ChatGPT connectivity depends on your client's MCP support, not on Aevo.

### Can I test without risking money?
Yes. A testnet environment is available and is the correct first step.

### Does the AI trade on its own while I sleep?
Only if you build that. The MCP server responds to tool calls; it has no scheduler of its own. Autonomous operation requires a client or wrapper that keeps calling it — which is what the OpenClaw integration provides.

### How many tools are there — 11 or 45?
Both numbers are accurate at different scopes. The core repository README enumerates roughly 11 primary tools. The full documented surface, described in the `aevo-trading-skills` repository, is 45 tools.

### What is the difference between the MCP server and the Telegram bot?
The MCP server is infrastructure for AI clients you configure yourself. The Telegram bot is a finished consumer product you talk to in a chat window. Same exchange underneath, different audience.

### Do I need to run Docker?
No. Docker is the recommended path, but stdio and the hosted endpoint both avoid it.

### What happens if the model hallucinates a market?
The tool call fails against the exchange's instrument list. Aevo's skills documentation includes instrument naming conventions specifically to reduce this.

---

## Sources

- [ribbon-finance/aevo-mcp — GitHub](https://github.com/ribbon-finance/aevo-mcp)
- [ribbon-finance/aevo-trading-skills — GitHub](https://github.com/ribbon-finance/aevo-trading-skills)
- [Aevo-MCP on Glama](https://glama.ai/mcp/servers/@ribbon-finance/aevo-mcp)
- [MCP in 2026: 97 Million Downloads — Bitcoin.com News](https://news.bitcoin.com/mcp-in-2026-97-million-downloads-and-growing-crypto-infrastructure-from-bitgo-to-coingecko/)
- [MCP Adoption Statistics 2026 — Digital Applied](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)
- [Aevo Statistics — CoinGecko](https://www.coingecko.com/en/exchanges/aevo)
- [Aevo perpetual futures data — Loris Tools](https://loris.tools/markets/perps/aevo)
- [Can I trade with a bot? — Aevo Help Center](https://help.aevo.xyz/en/articles/9490817-can-i-trade-with-a-bot)
