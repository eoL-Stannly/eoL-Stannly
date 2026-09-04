# Aevo's MCP Server and Telegram Trading Bot: What Actually Shipped, and What It Costs You

> **Source post:** [@aevoxyz, 6 March 2026, 17:01 UTC](https://x.com/aevoxyz/status/2029965683056930907)
> **NCS: 62/100** — non-commodity, weak moat. Scoring detail at the foot of this page.

---

## Answer up front

Aevo shipped two things in early March 2026: an MCP server and a Telegram trading bot. The MCP server exposes roughly 45 tools covering market data, portfolio management, order execution, risk analysis and options strategies. It works with Claude Desktop and Cursor today. It lets an AI agent read Aevo's entire order book — spreads, fees, funding rates, relative strength against BTC — and act on it.

That is the feature. The part the announcement does not cover is the risk, and the risk is the reason this matters. Connecting an autonomous agent to an exchange account creates an attack surface that cost the wider market more than $45 million in 2026. Read the security section before you connect anything.

---

## What is MCP, in one paragraph

The Model Context Protocol is an open standard for connecting AI models to external tools and data. Anthropic released it in November 2024. By March 2026 it had passed 97 million monthly SDK downloads and 81,000 GitHub stars, and was supported by Anthropic, OpenAI, Google, Microsoft and AWS.

The practical effect: an exchange writes one MCP server, and every MCP-compatible AI client can trade on it. No bespoke integration per model.

## What Aevo shipped

### The MCP server

Around 45 tools, grouped by function:

- **Market data** — order books, spreads, funding rates, implied volatility
- **Portfolio management** — positions, margin, PnL
- **Order execution** — placing, modifying and cancelling orders
- **Risk analysis** — exposure and margin health
- **Options strategies** — multi-leg construction

Confirmed client compatibility at launch: Claude Desktop and Cursor. The supporting skill definitions are published publicly at [github.com/ribbon-finance/aevo-trading-skills](https://github.com/ribbon-finance/aevo-trading-skills).

The point of exchange-wide access is comparative. An agent that can see every market at once can answer questions a single-market view cannot: which perp has the cheapest funding right now, which option is mispriced against its neighbours, what a position's beta to BTC actually is.

### The Telegram bot

Launched alongside the MCP server. It puts order entry and position management into a chat interface, which lowers the floor for traders who will not install a desktop AI client.

## Why Aevo built this when it did

Aevo was not early and was not late. It landed in the middle of an industry-wide move.

By June 2026, Bybit, Coinbase, Binance and Interactive Brokers had all shipped agent-access layers built on MCP, typically with segregated accounts, API-only permissions and user-set risk caps. Exchanges concluded that agents were going to trade with or without official support, and that an official surface with permission controls beat an unofficial one built on screen-scraping.

Aevo's specific angle is its product mix. It is a derivatives L2 running perps, options and structured products on unified margin. Options are where agents have the most to add, because options are where the analysis is hardest and where retail participation is lowest — options were still just 2.4% of total crypto derivatives volume in the first half of 2026.

## The security picture nobody puts in the launch post

This is the section that will not appear in competing coverage, so read it carefully.

**2026 was the year AI trading agents got attacked.** Protocol-level weaknesses triggered over $45 million in security incidents involving AI trading agents. The attacks did not target the exchanges. They targeted the agents: their long-term memory, and the protocols connecting them to trading tools.

**The failure mode has a name.** Security researchers call it the *lethal trifecta*: untrusted input, plus sensitive data access, plus agent autonomy. Remove any one and the risk collapses. Keep all three and a malicious instruction hidden in market data, a Telegram message or a scraped webpage can reach your account.

**The ecosystem is not clean.** Trend Micro identified 492 MCP servers exposed to the internet with zero authentication. Antiy CERT confirmed 1,184 malicious skills on ClawHub, the marketplace for the OpenClaw agent framework.

**MCP adoption outpaced permission modelling.** That is the honest summary of the gap: teams shipped tool access faster than they built the controls around it.

### What that means for you, concretely

1. **Start read-only.** Use the market-data and portfolio tools before enabling execution. The consensus guidance for exchange MCP is to begin with read-only workflows and add execution only after you understand the permission model.
2. **Segregate the account.** Fund a separate account with what you can afford to lose. Do not point an agent at your main balance.
3. **Cap the risk in the exchange, not the prompt.** A prompt instruction to "never exceed $1,000" is not a control. An exchange-side limit is.
4. **Treat market data as untrusted input.** Token names, market metadata and chat messages are attacker-controllable text that your agent will read.
5. **Log every call.** If something goes wrong, the tool-call log is the only forensic record you will have.

## The thing to watch

The interesting question is not whether agents can trade. It is whether they trade *better*. As of this writing there is no published, independently verified performance data comparing agent-executed and human-executed trades on any exchange MCP, Aevo's included. Anyone claiming otherwise is selling something.

---

## FAQ

**What is the Aevo MCP server?**
An interface that lets MCP-compatible AI clients read Aevo market data and place trades. It exposes roughly 45 tools spanning market data, portfolio management, order execution, risk analysis and options strategies.

**Which AI clients work with it?**
Claude Desktop and Cursor were confirmed compatible at launch. MCP is an open standard, so any client implementing it can connect in principle.

**Can the AI place trades, or only read data?**
Both. Order execution tools are included. That is precisely why you should start with read-only workflows and enable execution deliberately.

**Do I need to write code?**
No for the Telegram bot. For the MCP server you need to add a server entry to your AI client's configuration and supply API credentials. That is configuration, not programming.

**What is the difference between the MCP server and the Telegram bot?**
The MCP server gives an AI agent programmatic access to the exchange. The Telegram bot gives you a chat interface for trading. One is infrastructure for agents; the other is a front end for humans.

**Is it safe to connect an AI agent to my exchange account?**
Not by default. AI trading agent vulnerabilities were linked to more than $45 million in losses in 2026, and researchers found 492 MCP servers running with no authentication at all. Use a segregated account, exchange-side risk limits, and read-only access until you have tested the permission model.

**Can I use it with ChatGPT?**
MCP is supported across major AI vendors including OpenAI, so client support is broadly available. Confirm current compatibility in Aevo's documentation before relying on it — the two clients explicitly named at launch were Claude Desktop and Cursor.

**What can an agent do on Aevo that it cannot do elsewhere?**
Trade options and perps against a single unified margin account. Most exchange MCP servers expose spot and perps only. Options strategy construction is the differentiator here.

**Is this the same as a trading bot?**
No. A conventional trading bot executes a rule you wrote. An MCP agent decides what to do from context. That flexibility is the feature and the risk, in equal measure.

**Does using the MCP affect trading rewards?**
Trades placed through the MCP are ordinary exchange trades and count toward volume like any other. Aevo's reward epochs distribute 1,000,000 AEVO to traders weekly, split across perps and a featured market type.

---

## Sources

- Post ID 2029965683056930907, timestamp decoded from Twitter snowflake epoch → 6 March 2026, 17:01:48 UTC
- [ribbon-finance/aevo-trading-skills](https://github.com/ribbon-finance/aevo-trading-skills) — published skill definitions
- [Complete Guide to MCP in 2026](https://dev.to/x4nent/complete-guide-to-mcp-model-context-protocol-in-2026-architecture-implementation-and-4a11) — adoption figures
- [AI Trading Agent Vulnerability 2026 — KuCoin](https://www.kucoin.com/blog/en-ai-trading-agent-vulnerability-2026-how-a-45m-crypto-security-breach-exposed-protocol-risks) — $45M incident total
- [AI Agent Security Risks 2026: MCP, OpenClaw & Supply Chain](https://blog.cyberdesserts.com/ai-agent-security-risks/) — Trend Micro and Antiy CERT findings
- [Is MCP Safe for AI Agents?](https://hermes-agent.ai/blog/mcp-security-risks-ai-agents) — lethal trifecta framing
- [Best Official Crypto Exchange MCP Servers for AI Agents 2026 — Bitget](https://www.bitget.com/asia/amp/academy/best-official-crypto-exchange-mcp-servers-ai-agents-2026-introduction-to-bitget-mcp) — exchange adoption
- [Crypto Options — Crypto.com Research](https://crypto.com/en/research/crypto-options-may-2025) and [Bybit options release](https://www.prnewswire.com/apac/news-releases/deeper-insights-better-analytics-bybit-options-close-the-data-gap-between-retail-and-institutional-traders-302851859.html) — options share of derivatives volume

---

## Scoring

| Dimension | Score | Note |
|---|---|---|
| Information gain | 17/25 | Security context and the "does it trade better" gap are absent from competing coverage |
| Proprietary data | 8/20 | All figures cited, none measured here |
| Verifiability | 13/15 | Named sources and dates throughout; uncertainty flagged on ChatGPT compatibility |
| Experience signals | 4/15 | Server not run by the author |
| Query coverage | 9/10 | Ten FAQs covering the observed question space |
| Structure / AUF | 9/10 | |
| Irreplaceability | 2/5 | |
| **Total** | **62/100** | Non-commodity, weak moat |

**To reach 80+:** run the server, publish the actual tool list and names, measure per-call latency, and document what the permission model refuses when given a deliberately unsafe instruction. That last item is a genuine security finding and would make this page a cited source rather than a citing one.
