# **The Aevo MCP: give your AI agent a trading desk**

**45+ structured tools for market data, positions, execution, risk and options strategies, exposed to Claude, Cursor and any other MCP client. Here's what it actually does, what it can't do, and where the boundaries need to be.**

**TL;DR**

**•**  The Aevo MCP is a Model Context Protocol server that connects an AI client directly to Aevo's markets and to your account.

**•**  It ships with more than 45 structured tools, spanning market data, portfolio management, order execution, risk analysis and options strategies.

**•**  Compatibility with Claude Desktop and Cursor is live. MCP is an open standard, so any compliant client works.

**•**  Structured tools, not screen-scraping. The agent calls a defined function with typed arguments and gets typed data back, which is why it can be trusted with orders at all.

**•**  It reads the whole exchange, not just your positions: spreads, fees, funding, relative strength against BTC.

**•**  Options strategy tooling is the part that doesn't exist elsewhere. Most trading MCPs can buy and sell a token. This one can reason about a spread.

**•**  There's a machine-readable index of the API docs at [api-docs.aevo.xyz/llms.txt](https://api-docs.aevo.xyz/llms.txt), which agents can read directly.

**•**  It is not a low-latency execution path. Anything that needs deterministic timing belongs on the WebSocket API instead.

**•**  If you'd rather write the integration yourself, the REST and WebSocket APIs and the Python SDK are still there. The MCP sits alongside them, not instead of them.

**•**  An AI agent with order permissions is an agent that can lose money. Scope its access deliberately, at the account level.

Most "AI trading" integrations are a chat box bolted onto a buy button. You type "buy 10 ETH", something parses it, an order goes out. Useful, narrow, and not really what a derivatives account needs.

The Aevo MCP is a different shape. It exposes the exchange as a set of structured tools an agent can compose, which means the interesting question stops being "can it place an order" and becomes "can it work out which order to place".

## **What is MCP, and why does it matter for a perps dex?**

The Model Context Protocol is an open standard for exposing tools and data to a large language model through a defined interface.

Instead of the model guessing at an API from documentation, or a developer hard-coding a handful of natural-language intents, the server publishes a list of tools. Each one has a name, a description, typed parameters and a typed return. The model picks the tool, fills the parameters, gets structured data back, and decides what to do next.

That structure is the entire reason this works on a derivatives exchange. On a spot exchange, "buy 10 shares of AAPL" is a complete instruction. On a perps and options venue it isn't close. Which market. What leverage. Cross or isolated. What does that do to your margin. Is there a cheaper expiry. Is funding about to flip against you.

Answering that means chaining a dozen lookups before anything gets submitted. A tool interface can chain. A parsed sentence can't.

## **What can the Aevo MCP actually do?**

More than 45 tools, in five broad groups.

  - **Market data.** Order books, marks, funding, spreads, fees, historical prices. Across the whole exchange, not just markets you have positions in.
  - **Portfolio management.** Balances, open positions, margin usage, PnL, order history.
  - **Order execution.** Placing, amending and cancelling orders on perpetual futures and crypto options.
  - **Risk analysis.** What a position does to your margin, where liquidation sits, what happens under a move.
  - **Options strategies.** Constructing and evaluating multi-leg structures rather than single-leg orders.

The market data reach is worth calling out, because it changes the type of question you can ask. The agent can pull spreads, fees, funding and relative strength against BTC across the venue. So "which of the altcoin perps has funding running hardest against shorts right now, and what's the spread like on the top three" is a question with an answer, reached by composing tools rather than by you opening twelve tabs.

## **What does a useful session actually look like?**

The gap between "impressive demo" and "worth having" is the type of question you ask. These are the shapes that pay off, roughly in order of how much they benefit from tool composition:

  - **Scanning.** *"Across every perp listed, which have funding above 20% annualised against shorts, and what's the top-of-book spread on each?"* One question, many lookups, an answer you'd otherwise assemble by hand.
  - **Stress testing.** *"If ETH drops 8% overnight, what happens to my margin and which position liquidates first?"* This is the one that changes behaviour, because it reaches an answer people rarely calculate for themselves.
  - **Pricing a structure before you commit.** *"What does a one-month collar on my ETH long cost, and what's my range if I set the floor 10% below spot?"* Numbers, not a description of what a collar is.
  - **Post-trade review.** *"Summarise my fills this week by market, and tell me what I paid in fees and funding."*

The pattern: questions where the work is in gathering and combining, not in the final judgement. Those are the ones an agent with structured tools does better than you do with a browser.

## **What makes the options tooling different?**

Every trading MCP can place a market order. Very few can reason about an options position, because crypto options require the model to hold several things at once: strike, expiry, implied volatility, the Greeks, and what the combination does at each price level.

Aevo's server exposes tools at that level, which is what makes an agent useful rather than decorative. You can ask what a structure costs, what it pays at expiry, and what it does to your margin, and get numbers rather than a description of what a call spread is in general.

This lines up with how Aevo works everywhere else. The exchange's whole design premise is that options should be usable by people who trade perps, and the [PERPS+ modes](https://app.aevo.xyz) exist to make hedging a one-tap decision rather than a research project. The MCP is the same idea pointed at an agent instead of a UI: the complexity is in the tools, not in the user.

## **Which clients does it work with?**

Claude Desktop and Cursor are live and confirmed working.

Because MCP is an open standard rather than a vendor integration, any compliant client should connect. The protocol is the same one used across the wider ecosystem, and servers are broadly portable between clients.

Two practical notes on setup:

  - MCP client configuration lives in a config file per client. Claude Desktop and Cursor each have their own, and a server entry written for one is normally portable to the other.
  - The server needs credentials to touch your account. Read-only market data is one permission level. Placing orders is another. Configure them separately if your setup allows it.

Current connection details and configuration are in the [Aevo documentation](https://docs.aevo.xyz/).

## **What can't it do?**

Worth knowing before you build a workflow around it, because these are structural rather than temporary.

  - **It isn't a low-latency path.** Every action routes through a model deciding what to call next. That is seconds, not microseconds. Anything that needs to react faster than you can read belongs on the WebSocket API.
  - **It isn't deterministic.** The same question asked twice can produce a different chain of tool calls. Fine for analysis, wrong for anything that must behave identically every time.
  - **It doesn't run unattended well.** The value is a human reading the reasoning and approving the action. Take the human out and you've built a trading bot with a language model where the strategy should be.
  - **It doesn't override exchange limits.** Margin requirements, position caps and liquidation rules apply exactly as they do in the UI. The agent can hit a limit; it can't lift one.

## **What about building directly against the API?**

Still fully supported, and still the right answer for a lot of use cases.

  - **REST API** for account management, orders, positions and market data, on mainnet and testnet.
  - **WebSocket API** for low-latency streams: order books, trades, fills, position updates.
  - **Python SDK** ([aevo-sdk](https://github.com/aevoxyz/aevo-sdk)) which handles the signing and order construction that's tedious to get right by hand.
  - [**api-docs.aevo.xyz/llms.txt**](https://api-docs.aevo.xyz/llms.txt), a machine-readable index of every documentation page in Markdown plus the endpoints in OpenAPI. If you're pointing a coding agent at Aevo, start there.

The split is roughly this. If you're building a system that runs unattended and needs deterministic behaviour and microsecond-scale latency, write it against the WebSocket API. If you want a human in the loop asking questions and approving actions, use the MCP. A market-making bot is not an MCP use case. "Walk me through what my book looks like if ETH drops 8% overnight" very much is.

Full reference is at [api-docs.aevo.xyz](https://api-docs.aevo.xyz/reference/overview).

## **What can go wrong?**

An agent with execution permissions can submit orders you didn't intend. That's not a hypothetical risk, it's the definition of the feature.

Worth being deliberate about:

  - **Scope the credentials.** If the agent only needs to analyse, don't give it keys that can trade. Read-only is a real configuration, not a lesser one.
  - **Test on testnet first.** Aevo runs a testnet with the same endpoints. Every prompt you plan to use in anger should run there first.
  - **Watch the size limits.** Whatever position and leverage limits you'd set for yourself, set them at the account level, not in the prompt. A limit in a prompt is a suggestion.
  - **Models are confident when they're wrong.** A structured tool returns real data, but the reasoning between tool calls is still a language model's. Treat its conclusions as a well-informed second opinion, not as a risk system.
  - **Verify before you commit size.** If the agent says a structure caps your loss at a level, check the numbers on the position before you accept them.
  - **Watch for stale reads.** A quote the agent pulled thirty seconds ago is not the price you'll fill at. On anything time-sensitive, have it re-read immediately before it acts.

None of this is an argument against using it. It's an argument for setting it up once, properly, rather than handing an agent your account and finding out later what it decided to do at 3am.

## **Where to start**

Three steps, in order.

  - **Connect it read-only and ask it questions.** Funding across the board, spreads on the markets you trade, what your current book looks like under a move. You'll learn what the tools can reach faster than by reading the list.
  - **Move to testnet with execution on.** Run the workflows you actually want, and see where the agent's judgement is good and where it isn't.
  - **Go live with scoped permissions and real limits.** Account-level, not prompt-level.

Docs are at [docs.aevo.xyz](https://docs.aevo.xyz/), the API reference is at [api-docs.aevo.xyz](https://api-docs.aevo.xyz/reference/overview), and the exchange is at [app.aevo.xyz](https://app.aevo.xyz).

## **Related reading**

  - *Aevo trading strategies: from one-tap protection to multi-leg structures* — the structures the options tooling is built to evaluate
  - *Aevo OTC: trade altcoin options on-chain, at size* — where the order book stops being the right venue
  - *Pre-launch token futures: trade a token before it lists* — the one market with a specification an agent should be told about explicitly
