# Aevo Trading Bot & Exchange MCP: Introducing Agentic Trading on Aevo

**TL;DR:** Aevo has shipped an **exchange MCP server** and an **Aevo Trading Bot**. Together they give AI agents native access to perpetuals and options trading on Aevo, including multi-leg strategies, portfolio Greeks, and pre-trade risk checks. Connect any MCP-compatible AI agent directly to the Aevo exchange, or skip setup entirely and trade from a chat window on Telegram.

## Why an exchange MCP server, and why now

MCP servers for trading are proliferating. In crypto, integrations from CoinGecko, 0x-based aggregators, and Uniswap already give AI agents access to market data and spot swaps. TradFi platforms have shipped MCP servers with broader capabilities, including options. Across DeFi, though, none of these integrations can construct a multi-leg position, calculate portfolio Greeks, or run pre-trade risk validation. They stop where the complexity starts.

That's where Aevo has always operated. Our mission, since day one, has been to make sophisticated instruments accessible to a wider audience. AI agents are the next step in that: traders can say "build me a delta-neutral position on ETH" or "set up an iron condor with defined risk," and an agent can reason through the strategy, validate the risk, and execute it, all through Aevo's exchange MCP integration. You get to delegate the complexity and stay focused on the outcome you want.

Today we're launching two new products:

- **[Aevo MCP Server](https://github.com/ribbon-finance/aevo-mcp)**, an open-source exchange MCP integration that gives any AI agent full access to the Aevo exchange through 45+ structured tools, covering everything from market analysis to multi-leg options execution.
- **[Aevo Trading Bot](https://t.me/Aevo_Trading_Bot)** on Telegram, the same capability in a chat window, powered by Claude, ChatGPT, and other LLM backends, for traders who want AI-assisted trading without any setup.

## What is MCP?

The Model Context Protocol (MCP) has become the standard way AI agents connect to external tools and data. Thousands of MCP servers exist today for databases, developer tools, enterprise software, and financial services.

The Aevo MCP Server is the first DeFi-native exchange MCP built for derivatives complexity, perpetuals and options included, rather than spot trading alone.

## 45+ tools for the full trading lifecycle

The server exposes over 45 tools organized across five categories that cover what a trading agent needs:

- **Market Analysis.** Real-time prices, funding rates, volatility snapshots, and market regime classification. Your agent can ask "what's the current funding rate on ETH-PERP?" and get a structured answer it can reason about.
- **Portfolio Management.** Positions, risk metrics, Greeks exposure, and margin monitoring, so your agent always knows where it stands.
- **Order Execution.** Limit orders, bracket orders with entry, stop-loss, and take-profit, plus batch operations. Not just single-shot trades, but structured execution plans.
- **Options Strategies.** Straddles, strangles, spreads, iron condors, and butterflies with live pricing. Multi-leg strategies can be constructed and validated in seconds.
- **Risk Management.** Pre-trade validation, portfolio risk scoring, and liquidation distance monitoring.

The server also ships with built-in prompts, including `trade_plan`, `risk_checklist`, and `onboarding_plan`, that give your agent structured workflows instead of leaving it to figure out sequencing on its own.

## Works everywhere, deploys anywhere

We built the Aevo exchange MCP server to meet developers where they are:

- **Hosted endpoint.** Point any MCP client to [`https://mcp.aevo.xyz/mcp`](https://mcp.aevo.xyz/mcp) and start trading. No local setup: authenticate with your API key and you're live.
- **Self-hosted via Docker.** Clone the [repo](https://github.com/ribbon-finance/aevo-mcp), add your credentials, and run `docker compose up`.
- **Local install.** `pip install` and run via stdio for the tightest integration loop.

It works with Claude Desktop, Claude Code, Cursor, Windsurf, OpenClaw, and any other MCP-compatible client. The server is fully open-source on [GitHub](https://github.com/ribbon-finance/aevo-mcp).

There's also a companion [Aevo Trading Skills repo](https://github.com/ribbon-finance/aevo-trading-skills) with structured guidance for agents: instrument naming conventions, risk guardrails, workflow recipes, and an options strategy reference that the AI can draw on.

## Bringing it to Telegram: the Aevo Trading Bot

Not everyone works from a code editor. Millions of crypto traders spend their days in Telegram, watching channels, discussing positions, reacting to news. So we built a Trading Bot that brings agentic trading directly into that environment.

The [Aevo Trading Bot](https://t.me/Aevo_Trading_Bot) connects to the same Aevo exchange MCP infrastructure and supports multiple LLM backends, including Claude, ChatGPT, and others. You can interact with it in natural language: ask it to analyze a market, check your positions, or walk you through a trade plan. It carries the same 45+ tool capability set as the MCP server, accessible from a chat window with no code required.

## Get started

The Aevo MCP Server is live now. Here's how to try it:

1. Get your API credentials from your [Aevo account](https://app.aevo.xyz/settings/api-keys).
2. Connect to the hosted endpoint at [`https://mcp.aevo.xyz/mcp`](https://mcp.aevo.xyz/mcp), or clone the [repo](https://github.com/ribbon-finance/aevo-mcp) and self-host.
3. For risk-free testing, use the testnet at [`https://mcp-testnet.aevo.xyz/mcp`](https://mcp-testnet.aevo.xyz/mcp).

Or skip the setup entirely and open the [Aevo Trading Bot](https://t.me/Aevo_Trading_Bot) on Telegram.

## FAQ

**What is the Aevo MCP Server?**
It's an open-source exchange MCP implementation that connects AI agents to the Aevo exchange, exposing 45+ tools for market analysis, portfolio management, order execution, options strategies, and risk management. Learn more in the [Aevo MCP official docs](https://docs.aevo.xyz/aevo-products/aevo-mcp).

**What is the Aevo Trading Bot?**
The [Aevo Trading Bot](https://t.me/Aevo_Trading_Bot) is a Telegram bot built on the same Aevo MCP infrastructure. It lets you trade and analyze markets on Aevo using natural language, with support for Claude, ChatGPT, and other LLM backends, and no local setup required.

**Do I need to know how to code to use the Trading Bot?**
No. The Telegram Trading Bot works entirely through chat. The self-hosted or hosted MCP server is aimed at developers who want to wire an agent (Claude Desktop, Claude Code, Cursor, Windsurf, OpenClaw, and others) directly into Aevo.

**Which AI models work with the Aevo exchange MCP?**
Any MCP-compatible client works, including Claude Desktop and Claude Code. The Aevo Trading Bot on Telegram additionally supports ChatGPT and other LLM backends.

**Can the MCP server execute multi-leg options strategies?**
Yes. The Options Strategies toolset supports straddles, strangles, spreads, iron condors, and butterflies with live pricing, so multi-leg positions can be constructed and validated in seconds.

**Does the Aevo MCP Server include risk management?**
Yes. It includes pre-trade validation, portfolio risk scoring, and liquidation distance monitoring, so agents can check a trade against your risk parameters before it executes.

**How do I test the Aevo MCP Server without risking real funds?**
Use the testnet endpoint at [`https://mcp-testnet.aevo.xyz/mcp`](https://mcp-testnet.aevo.xyz/mcp) to try the full tool set risk-free before connecting to mainnet.

**Where can I find the source code and documentation?**
- [Aevo MCP Server on GitHub](https://github.com/ribbon-finance/aevo-mcp)
- [Aevo Trading Skills on GitHub](https://github.com/ribbon-finance/aevo-trading-skills)
- [Aevo API Documentation](https://api-docs.aevo.xyz/)
- [Aevo MCP Official Docs](https://docs.aevo.xyz/aevo-products/aevo-mcp)
- [Aevo Trading Bot on Telegram](https://t.me/Aevo_Trading_Bot)
