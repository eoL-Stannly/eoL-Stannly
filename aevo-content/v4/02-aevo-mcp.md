# **The Aevo MCP: give your AI agent a trading desk**

**45+ structured tools for market data, positions, execution, risk and options strategies, exposed to Claude Code, Claude Desktop, Cursor, Windsurf and OpenClaw. Here's what it actually does, how to connect it in about five minutes, what it can't do, and where the boundaries need to be.**

**TL;DR**

**•**  The Aevo MCP is a Model Context Protocol server that connects an AI client directly to Aevo's markets and to your account.

**•**  It ships with more than 45 structured tools across five groups: market analysis, portfolio management, order execution, options strategies and risk management.

**•**  It's open source. The server is [aevo-mcp](https://github.com/ribbon-finance/aevo-mcp); the companion skill definitions are [aevo-trading-skills](https://github.com/ribbon-finance/aevo-trading-skills).

**•**  **There's a hosted endpoint at `https://mcp.aevo.xyz/mcp`.** Point a client at it, pass two headers, done. No install, no Docker, no local server.

**•**  Self-hosting with Docker is the recommended route for anyone trading real size, for one reason: your signing key never leaves your machine.

**•**  Credentials come in two tiers. `api_key` + `api_secret` is read-only. Adding `wallet_address` + `signing_key_private_key` unlocks execution. Start on the first.

**•**  Beyond tools it exposes **Prompts** (`trade_plan`, `risk_checklist`, `cancel_plan`, `onboarding_plan`) and **Resources** (`aevo://status`, `aevo://markets/summary`, `aevo://account/overview`) — structured workflows rather than free-form chat.

**•**  Structured tools, not screen-scraping. The agent calls a defined function with typed arguments and gets typed data back, which is why it can be trusted with orders at all.

**•**  Options strategy tooling is the part that doesn't exist elsewhere. Most trading MCPs can buy and sell a token. This one prices an iron condor.

**•**  There's a full testnet stack — app, API and MCP — so every prompt you plan to use in anger can be proved without real funds.

**•**  It is not a low-latency execution path. Anything that needs deterministic timing belongs on the WebSocket API instead.

**•**  An AI agent with order permissions is an agent that can lose money. Scope its access deliberately, at the account level, and prove the workflow on testnet first.

Most "AI trading" integrations are a chat box bolted onto a buy button. You type "buy 10 ETH", something parses it, an order goes out. Useful, narrow, and not really what a derivatives account needs.

The Aevo MCP is a different shape. It exposes the exchange as a set of structured tools an agent can compose, which means the interesting question stops being "can it place an order" and becomes "can it work out which order to place".

## **What is MCP, and why does it matter for a perps dex?**

The Model Context Protocol is an open standard for exposing tools and data to a large language model through a defined interface.

Instead of the model guessing at an API from documentation, or a developer hard-coding a handful of natural-language intents, the server publishes a list of tools. Each one has a name, a description, typed parameters and a typed return. The model picks the tool, fills the parameters, gets structured data back, and decides what to do next.

That structure is the entire reason this works on a derivatives exchange. On a spot exchange, "buy 10 shares of AAPL" is a complete instruction. On a perps and options venue it isn't close. Which market. What leverage. Cross or isolated. What does that do to your margin. Is there a cheaper expiry. Is funding about to flip against you.

Answering that means chaining a dozen lookups before anything gets submitted. A tool interface can chain. A parsed sentence can't.

## **What can the Aevo MCP actually do?**

More than 45 tools, in five groups.

|  |  |  |
| :-: | :-: | :-: |
| **Group** | **What it reaches** | **Typical use** |
| Market analysis | Real-time prices, funding rates, volatility snapshots, market regime classification | Scanning the venue for a setup |
| Portfolio management | Positions, risk metrics, Greeks, margin monitoring | "Where do I actually stand" |
| Order execution | Limit orders, bracket orders (entry + stop-loss + take-profit), batch operations | Acting on a decision |
| Options strategies | Straddles, strangles, spreads, iron condors, butterflies, with live pricing | Pricing a collar or a condor |
| Risk management | Pre-trade validation, portfolio risk scoring, liquidation distance monitoring | Stress testing before you commit |

Two of those deserve a second look.

**Bracket orders** matter more than they sound. An entry with a stop-loss and a take-profit attached is a complete trade rather than an intention, and it's the difference between an agent that opens a position and an agent that opens a *managed* position. If you take one thing from the execution group, make it this.

**Market regime classification** is the market analysis tool that changes the questions you can ask. Rather than pulling raw numbers and reasoning over them yourself, you can ask what kind of market you're in and have the agent answer from the venue's own data. That's a different starting point from a price feed.

## **What are Prompts and Resources, and why should I care?**

They're the parts of the server that stop a session being improvised.

**Prompts** are pre-built workflows the server publishes and the client can invoke by name:

  - **`trade_plan`** — work a trade idea through to a specific, sized, risk-checked plan.
  - **`risk_checklist`** — run the account against a structured set of risk questions before you act.
  - **`cancel_plan`** — wind a session down cleanly rather than leaving orders resting.
  - **`onboarding_plan`** — the guided first session.

**Resources** are addressable reads the agent can pull without being told how:

  - **`aevo://status`** — is the venue up and is your connection authenticated.
  - **`aevo://markets/summary`** — the state of the board in one call.
  - **`aevo://account/overview`** — where you stand, without six separate lookups.

The practical value is repeatability. A free-form question gets a free-form chain of tool calls, and the same question tomorrow gets a different one. `risk_checklist` asks the same things in the same order every time. On the analysis side, variation is fine. On the risk side, it isn't — and this is how you get one without the other.

## **How do I actually connect it?**

Three routes. Pick by how much you care about where your signing key lives.

### **1. Hosted endpoint — no local server**

The fastest route. Aevo runs the server; you point a client at it.

  - **Mainnet**: `https://mcp.aevo.xyz/mcp`
  - **Testnet**: `https://mcp-testnet.aevo.xyz/mcp`

Authenticate with `AEVO-KEY` and `AEVO-SECRET` headers, or connect first and call the `aevo_authenticate` tool. A Claude Desktop entry looks like this:

*"mcpServers": { "aevo": { "url": "https://mcp.aevo.xyz/mcp", "headers": { "AEVO-KEY": "your-api-key", "AEVO-SECRET": "your-api-secret" } } }*

Right for read-only analysis and for finding out whether this is useful to you at all. Five minutes, no dependencies.

### **2. Self-hosted with Docker — recommended**

Clone [aevo-mcp](https://github.com/ribbon-finance/aevo-mcp), copy `.env.example` to `.env`, fill in `AEVO_API_KEY`, `AEVO_API_SECRET` and `AEVO_SIGNING_KEY_PRIVATE_KEY`, then `docker compose up --build -d`. Connect a client to `http://localhost:8080/mcp`.

This is the recommended configuration, and the reason is specific rather than general: **your signing key stays on your own machine.** The key that authorises orders never transits to a hosted service. If you're going to give an agent execution permissions at all, this is the version to give them on.

### **3. Local install — no Docker**

`pip install -e .`, fill in `.env`, run `aevo-mcp --transport stdio`, and add it to your client as a stdio server. Same key-locality benefit as Docker, fewer moving parts, more of your own environment to manage.

**OpenClaw** users have a fourth route: `clawhub install aevo`, then add credentials as environment variables in your OpenClaw config.

## **What credentials does it need?**

Two tiers, and the gap between them is the whole safety story.

|  |  |  |
| :-: | :-: | :-: |
| **Tier** | **Credentials** | **What it can reach** |
| Read-only | `api_key` + `api_secret` | Account data, positions, trade history |
| Trading | + `wallet_address` + `signing_key_private_key` | Orders, cancellations, strategies |

Create keys at [app.aevo.xyz/settings](https://app.aevo.xyz/settings/api-keys). If you don't have them yet, you can set `AEVO_WALLET_ADDRESS` and `AEVO_WALLET_PRIVATE_KEY` and use the `register_account` tool to generate them — though creating an account first and generating keys through the Aevo wallet is the cleaner path.

The environment variables in full:

|  |  |  |
| :-: | :-: | :-: |
| **Variable** | **Required** | **Description** |
| `AEVO_API_KEY` | Yes\* | API key from account settings |
| `AEVO_API_SECRET` | Yes\* | API secret from account settings |
| `AEVO_SIGNING_KEY_PRIVATE_KEY` | Yes | Required to submit orders |
| `AEVO_ENVIRONMENT` | No | `testnet` or `mainnet` (default `mainnet`) |
| `AEVO_WALLET_ADDRESS` | No | Used with `register_account` |
| `AEVO_WALLET_PRIVATE_KEY` | No | Used with `register_account` |
| `AEVO_AUTO_REGISTER` | No | Register signing key on startup |

\* Not required if you're using the wallet variables with `register_account` to generate keys.

Worth stating plainly, because it's the single decision that matters most here: **omitting `AEVO_SIGNING_KEY_PRIVATE_KEY` is a real security control, not a lesser setup.** An agent without it can read everything and change nothing. That is the correct first configuration for everyone, and the correct permanent configuration for a lot of people.

## **How do I know it's working?**

Two commands.

Open a new session in your client and ask it to *call the ping tool*. You should get back `{"ok": true, "result": {"status": "ok"}}`. Then ask it to *check my account balance*. If credentials are wired correctly, it returns your actual balance and equity.

If the ping works and the balance doesn't, your keys are wrong or absent. If neither works, the client isn't reaching the server. Diagnosing in that order saves a lot of time.

## **What does a chain of tool calls actually look like?**

Worth walking through once, because it's the difference between this and a chat wrapper.

You ask: *"I'm long 5 ETH perps. What does a one-month collar cost me, and where does it put my liquidation?"*

An agent with these tools has to do roughly this, in order, and none of it is guesswork:

1.  **Read your position.** Size, entry, leverage, current margin usage. Portfolio tools.
2.  **Read the market.** ETH spot, mark, the listed options chain for the relevant expiry. Market analysis tools.
3.  **Construct the structure.** A put at your chosen floor, a call at a ceiling that roughly funds it. Options strategy tools.
4.  **Price it.** What the two legs cost together, net. Not a description of a collar — a number.
5.  **Re-run the risk.** What the combined perp-plus-options position does to your margin requirement and where liquidation sits afterwards. Risk management tools.
6.  **Report back, without executing.** You decide.

Six tool calls, one question, and the answer is specific to your account rather than generic. That sequence is what a structured interface buys you, and it's why the options tooling matters more than the execution tooling.

## **What does a useful session actually look like?**

The gap between "impressive demo" and "worth having" is the type of question you ask. These are the shapes that pay off, roughly in order of how much they benefit from tool composition:

  - **Scanning.** *"Across every perp listed, which have funding above 20% annualised against shorts, and what's the top-of-book spread on each?"* One question, many lookups, an answer you'd otherwise assemble by hand.
  - **Stress testing.** *"If ETH drops 8% overnight, what happens to my margin and which position liquidates first?"* This is the one that changes behaviour, because it reaches an answer people rarely calculate for themselves.
  - **Pricing a structure before you commit.** *"What does a one-month collar on my ETH long cost, and what's my range if I set the floor 10% below spot?"* Numbers, not a description of what a collar is.
  - **Post-trade review.** *"Summarise my fills this week by market, and tell me what I paid in fees and funding."*
  - **Reward accounting.** *"How much qualifying volume have I done this year, and how much of it doesn't count?"* Pre-launch volume is excluded from the year-end distribution and options volume is delta-weighted, so the number on your fill history is not the number that qualifies. An agent can separate them faster than you can.

The pattern: questions where the work is in gathering and combining, not in the final judgement. Those are the ones an agent with structured tools does better than you do with a browser.

## **What makes the options tooling different?**

Every trading MCP can place a market order. Very few can reason about an options position, because crypto options require the model to hold several things at once: strike, expiry, implied volatility, the Greeks, and what the combination does at each price level.

Aevo's server exposes tools at that level — straddles, strangles, spreads, iron condors and butterflies, with live pricing rather than textbook payoff diagrams. You can ask what a structure costs, what it pays at expiry, and what it does to your margin, and get numbers back.

This lines up with how Aevo works everywhere else. The exchange's whole design premise is that options should be usable by people who trade perps, and the [PERPS+ modes](https://app.aevo.xyz) exist to make hedging a one-tap decision rather than a research project. The MCP is the same idea pointed at an agent instead of a UI: the complexity is in the tools, not in the user.

There's a specific gap the agent fills that PERPS+ deliberately doesn't. PERPS+ covers BTC and ETH perpetual futures with three fixed shapes and a bounded set of durations. If you're hedging an altcoin perp, or you want a strike and expiry the listed grid doesn't carry, you're building the structure yourself — and that's exactly the work an agent with options tooling can do the arithmetic for before you take it to the order book or to an [Aevo OTC](https://otc.aevo.xyz/trade) request for quote.

## **What is the Aevo Trading Skill?**

The instructions an agent needs to use the tools well, as opposed to merely correctly.

[aevo-trading-skills](https://github.com/ribbon-finance/aevo-trading-skills) is a separate repository of skill definitions covering all 45 tools, instrument naming conventions, risk guardrails, step-by-step workflow recipes and an options strategy reference. It installs alongside the MCP server for clients that support skill definitions, such as Claude Code and OpenClaw.

The distinction is worth being precise about, because it's the difference between the two repos. A tool list tells an agent **what it can call**. The skill tells it **when, in what order, and why not**. An agent with tools and no skill will happily construct a technically valid iron condor in a market where nobody sensible would want one. Instrument naming alone justifies it: get a symbol convention wrong and the agent doesn't fail loudly, it prices the wrong contract.

If you're running execution permissions, install the skill. It's the cheapest risk control available here.

## **Which clients does it work with?**

Claude Code, Claude Desktop, Cursor, Windsurf and OpenClaw are all supported.

Because MCP is an open standard rather than a vendor integration, any compliant client should connect. Configuration lives in a per-client config file, and a server entry written for one is normally portable to another with minor changes.

## **Can I test without real money?**

Yes, and you should. There's a full testnet stack rather than a sandbox endpoint bolted on.

|  |  |
| :-: | :-: |
| **Resource** | **URL** |
| Testnet app | [testnet.aevo.xyz](https://testnet.aevo.xyz/) |
| Testnet API | `https://api-testnet.aevo.xyz` |
| Testnet MCP | `https://mcp-testnet.aevo.xyz/mcp` |

Set `AEVO_ENVIRONMENT=testnet` when self-hosting, or point at the testnet MCP URL when using the hosted endpoint.

The thing worth testing there isn't whether orders go through — they will. It's whether the agent's *reasoning* is sound on your prompts, with your account shape, on the markets you actually trade. That takes a few sessions, and it costs nothing to find out on testnet rather than in production.

## **What can't it do?**

Worth knowing before you build a workflow around it, because these are structural rather than temporary.

  - **It isn't a low-latency path.** Every action routes through a model deciding what to call next. That is seconds, not microseconds. Anything that needs to react faster than you can read belongs on the WebSocket API.
  - **It isn't deterministic.** The same question asked twice can produce a different chain of tool calls. Fine for analysis, wrong for anything that must behave identically every time. The Prompts narrow this; they don't remove it.
  - **It doesn't run unattended well.** The value is a human reading the reasoning and approving the action. Take the human out and you've built a trading bot with a language model where the strategy should be.
  - **It doesn't override exchange limits.** Margin requirements, position caps and liquidation rules apply exactly as they do in the UI. The agent can hit a limit; it can't lift one.
  - **It doesn't know what it hasn't read.** Pre-launch markets run on a completely different specification — 50% initial, 48% maintenance, no funding, no index, no web market orders, and a supply rebase mechanic that changes your contract count. An agent reasoning about one using standard perp assumptions will be confidently wrong about your liquidation price. Tell it the specification, or have it read the docs page first.

## **What about building directly against the API?**

Still fully supported, and still the right answer for a lot of use cases.

  - **REST API** for account management, orders, positions and market data, on mainnet and testnet.
  - **WebSocket API** for low-latency streams: order books, trades, fills, position updates.
  - **Python SDK** ([aevo-sdk](https://github.com/aevoxyz/aevo-sdk)) which handles the signing and order construction that's tedious to get right by hand.
  - [**api-docs.aevo.xyz/llms.txt**](https://api-docs.aevo.xyz/llms.txt), a machine-readable index of every documentation page in Markdown plus the endpoints in OpenAPI. If you're pointing a coding agent at Aevo, start there. The product docs carry an equivalent index at [docs.aevo.xyz/llms.txt](https://docs.aevo.xyz/llms.txt).

The split is roughly this. If you're building a system that runs unattended and needs deterministic behaviour and microsecond-scale latency, write it against the WebSocket API. If you want a human in the loop asking questions and approving actions, use the MCP. A market-making bot is not an MCP use case. "Walk me through what my book looks like if ETH drops 8% overnight" very much is.

There's a third pattern that works well and gets overlooked: use the MCP to design the thing, then write the deterministic version against the API. Have the agent scan, price and stress-test the structure interactively until you know what you want, and only then hard-code it. The MCP is a research tool that happens to be able to execute, and it's usually strongest when used that way round.

Full reference is at [api-docs.aevo.xyz](https://api-docs.aevo.xyz/reference/overview).

## **What can go wrong?**

An agent with execution permissions can submit orders you didn't intend. That's not a hypothetical risk, it's the definition of the feature.

Worth being deliberate about:

  - **Scope the credentials.** If the agent only needs to analyse, don't give it the signing key. Read-only is a real configuration, not a lesser one.
  - **Keep the signing key local.** Self-hosted Docker or a local install is the reason the recommendation exists.
  - **Test on testnet first.** Every prompt you plan to use in anger should run there first, against the testnet MCP endpoint.
  - **Watch the size limits.** Whatever position and leverage limits you'd set for yourself, set them at the account level, not in the prompt. A limit in a prompt is a suggestion.
  - **Models are confident when they're wrong.** A structured tool returns real data, but the reasoning between tool calls is still a language model's. Treat its conclusions as a well-informed second opinion, not as a risk system.
  - **Verify before you commit size.** If the agent says a structure caps your loss at a level, check the numbers on the position before you accept them.
  - **Watch for stale reads.** A quote the agent pulled thirty seconds ago is not the price you'll fill at. On anything time-sensitive, have it re-read immediately before it acts.
  - **Remember cross margin is global.** The account is one pool. An agent sizing a new position on its own merits can still push an existing hedged position closer to liquidation. Ask it what the whole book looks like afterwards, not just the trade.
  - **Use `cancel_plan` to end a session.** An agent that stops mid-workflow can leave resting orders behind. Winding down is a step, not an absence of steps.

None of this is an argument against using it. It's an argument for setting it up once, properly, rather than handing an agent your account and finding out later what it decided to do at 3am.

## **Where to start**

Three steps, in order.

  - **Connect the hosted endpoint read-only and ask it questions.** Two headers, no install. Funding across the board, spreads on the markets you trade, what your current book looks like under a move. You'll learn what the tools can reach faster than by reading the list.
  - **Move to testnet with execution on.** Point at `mcp-testnet.aevo.xyz/mcp`, install the trading skill, and run the workflows you actually want. See where the agent's judgement is good and where it isn't.
  - **Go live self-hosted, with scoped permissions and real limits.** Docker, signing key local, limits at the account level rather than in the prompt.

A good first question, once it's connected: *"What's in my account right now, what's my worst position under a 10% move against me, and what would it cost to put a floor under it?"* If the answer is specific, numerate and account-aware, the setup is working. If it's a general explanation of hedging, the tools aren't wired up properly.

Docs are at [docs.aevo.xyz](https://docs.aevo.xyz/), the MCP page is at [docs.aevo.xyz/aevo-products/aevo-mcp](https://docs.aevo.xyz/aevo-products/aevo-mcp), the API reference is at [api-docs.aevo.xyz](https://api-docs.aevo.xyz/reference/overview), and the exchange is at [app.aevo.xyz](https://app.aevo.xyz).

## **Related reading**

  - *Aevo trading strategies: from one-tap protection to multi-leg structures* — the structures the options tooling is built to evaluate
  - *Aevo OTC: trade altcoin options on-chain, at size* — where the order book stops being the right venue
  - *Pre-launch token futures: trade a token before it lists* — the one market with a specification an agent should be told about explicitly
  - *Aevo staking explained: tiers, epochs, the lottery and every reward* — the volume accounting an agent can do for you
