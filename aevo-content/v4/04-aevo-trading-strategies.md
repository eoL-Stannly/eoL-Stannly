# **Aevo trading strategies: from one-tap protection to multi-leg structures**

**PERPS+, cross margin hedging, spreads and carry, all in one margin account. The strategies Aevo is actually built for, the parameters you can set on each, and the numbers behind them.**

**TL;DR**

**•**  Perps, options, pre-launch futures and OTC all sit in one cross-margin account. That's what makes multi-leg strategies practical rather than theoretical.

**•**  PERPS+ is built-in hedging: options protection attached to a perp at entry, in one tap, with no options knowledge needed.

**•**  Three PERPS+ modes. Limit My Loss caps the downside, upside uncapped. Get Paid to Hold takes a premium now for a profit ceiling. Lock My Range defines both ends at close to zero net cost.

**•**  **Every enhancer has a duration: 1 week, 2 weeks, 1 month or 2 months** — and the range you can set on the slider widens with it, from 5–8% at a week to 5–20% at two months.

**•**  **One active enhancer per asset.** To swap protection modes you close the existing PERPS+ option position first.

**•**  Sizing is automatic. PERPS+ matches the options leg to your perp's notional and direction; you choose the mode, the level and the duration, nothing else.

**•**  PERPS+ runs on BTC and ETH perpetual futures, on mobile as well as desktop. Everything else you hedge manually or through OTC.

**•**  Beyond PERPS+, the standard structures are all available directly: protective puts, covered calls, collars, spreads, straddles.

**•**  Cross margin hedging means a hedge reduces your margin requirement instead of doubling it. Under isolated margin, most of these strategies don't pay for themselves.

**•**  **Aevo Strategies runs an automated delta-neutral Basis Trade** — long spot, short perp, collecting funding — executed algorithmically rather than by you.

**•**  Off-chain matching with on-chain settlement means no gas per trade, which matters when a strategy has three legs and needs adjusting.

**•**  For size or non-standard strikes, [Aevo OTC](https://otc.aevo.xyz/trade) handles what the order book can't — including downside protection on altcoin perps, where PERPS+ doesn't reach.

**•**  Every strategy here is one you could build manually. The point is that Aevo makes them cheap enough in effort and margin to actually use.

Most crypto traders run exactly one strategy: buy a perp, set a stop, hope. It works until a wick takes the stop out and the market immediately reverses, or until a gap opens through it.

Options fix that, and almost nobody uses them, because the interface has traditionally demanded you understand Greeks before you can place a trade. Aevo's product line is essentially one long argument with that assumption: simple hedging first, complexity available underneath if you want it. The team has been running crypto options venues since 2020 and has cleared more than $10 billion in options volume across that time, which is worth knowing mainly because it explains the design priority. The hard part was never the pricing engine. It was the interface.

## **Why does one margin account change what's possible?**

Because the cost of a hedge is mostly a margin problem, not a premium problem.

Aevo runs perps, options, pre-launch futures and OTC positions inside a single cross-margin account. Your collateral backs all of it, and the margin engine looks at your net exposure.

Under isolated margin, a long ETH perp and a protective ETH put are two positions, each requiring its own margin. You've spent premium on the put and locked up capital twice, and the strategy has to overcome both before it makes sense.

Under cross margin, the put reduces the risk of the combined position, so the margin requirement reflects that. The hedge frees capital rather than consuming it. That single difference is what moves hedging from something traders know they should do to something they actually do.

Add zero gas per trade, from Aevo's off-chain matching and on-chain settlement, and adjusting a three-leg position stops carrying a cost that discourages you from adjusting it.

One caveat to hold onto, because it cuts the other way. Cross margin means one pool of collateral. A loss anywhere draws on the capital supporting everything else, including your hedged positions. The netting is a benefit on correlated exposure and a transmission channel on uncorrelated exposure. A pre-launch position going wrong can pull margin away from a perfectly well-constructed collar.

## **PERPS+: protection without learning options**

PERPS+ is the strategy layer for people who trade perps and have never touched an option.

You open a perp position as normal. Before you confirm, you pick a protection mode, a level and a duration. Aevo constructs and executes the combined perp-plus-options position in one action. No options chain, no Greeks, no separate order.

The three modes, and when each one is right:

|  |  |  |  |
| :-: | :-: | :-: | :-: |
| **Mode** | **Downside** | **Upside** | **Net cost** |
| Limit My Loss | Capped at your chosen level | Uncapped | You pay a premium |
| Get Paid to Hold | Unprotected below | Capped at a ceiling | You receive a premium |
| Lock My Range | Capped at your floor | Capped at your ceiling | Close to zero |

**Limit My Loss.** You choose the worst outcome you'll accept, and that's the worst outcome available. Upside stays completely open. This is a protective put in structure, and unlike a stop-loss it cannot be wicked out of and it doesn't gap through. You pay for it, in premium.

**Get Paid to Hold.** You accept a ceiling on profit and receive a premium immediately. A covered call, built into the perp. Right when you're holding a position you think will grind sideways rather than run, and you'd rather be paid to wait.

**Lock My Range.** Both ends defined before you enter, at close to zero net cost, because the premium you receive for the ceiling funds the premium you pay for the floor. A collar. This is the one to reach for when you want a position on but need to know your exposure exactly, and you're willing to trade away the tail to get it.

Each mode works on both long and short perp positions, with the underlying options mechanics mirrored accordingly. PERPS+ also runs on mobile at full parity with desktop, which matters more than it sounds. Positions rarely need protecting while you're sitting at a desk.

## **What can I actually set on a PERPS+ enhancer?**

Three things: the mode, the level, and the duration. Everything else is handled.

**Duration.** Every enhancer offers four expiry windows: 1 week, 2 weeks, 1 month or 2 months. Longer durations generally cost more on Limit My Loss and pay more on Get Paid to Hold, for the obvious reason — you're buying or selling more time.

**Range limits by duration.** The percentage you can set on the slider depends on the duration you chose. Shorter expiries carry tighter ranges, so that the options underneath trade into liquid strikes:

|  |  |
| :-: | :-: |
| **Duration** | **Range** |
| 1 week | 5–8% |
| 2 weeks | 5–10% |
| 1 month | 5–15% |
| 2 months | 5–20% |

This table is the most practically useful thing on the page and the least discussed. It means **your desired protection level and your desired timeframe are not independent choices.** If you want a floor 15% below spot, you cannot have it on a one-week enhancer — the slider does not go there. You either accept a tighter floor or you extend the duration.

Traders hit this constraint and read it as a limitation. It's closer to the opposite: a 15% floor on a one-week option would sit on a strike with no meaningful liquidity, and the price you'd pay for it would reflect that. The range limits are keeping you inside the part of the chain that actually trades.

**Sizing.** PERPS+ automatically sizes the options leg to match your perp's notional value and direction. There is no separate size field, and no way to over- or under-hedge by accident. If you want a partial hedge, you size the perp accordingly.

**One active enhancer per asset.** You can only have one PERPS+ enhancer attached to a given perp position at a time. To attach a different one, close the existing PERPS+ option position first.

That last rule catches people mid-trade. If you opened with Get Paid to Hold and the market has started running, you cannot simply layer Limit My Loss on top — you close the first enhancer, then apply the second. Worth knowing before you need to switch quickly, because the sequence takes two actions rather than one.

## **What PERPS+ doesn't cover**

Worth stating plainly, because it's the boundary that decides whether you build the structure yourself.

  - **It runs on BTC and ETH perpetual futures.** If you're long an altcoin perp, there is no one-tap floor to reach for.
  - **It attaches at entry.** Protecting a position you already have means adding the options leg yourself, which the next sections cover.
  - **It uses fixed shapes.** Three modes with a level you set. If you want a specific strike, a specific expiry, or a structure that isn't one of those three, you're building it manually.
  - **It tops out at two months.** Hedging a six-month view means rolling, or going to OTC for a longer maturity.
  - **It's one at a time.** No stacking two enhancers on the same asset.

None of that is a limitation of the exchange, only of the one-tap layer. The manual route reaches everything, and for size or non-standard strikes, [Aevo OTC](https://otc.aevo.xyz/trade) reaches further still — an RFQ on an altcoin put gets you the downside protection PERPS+ can't offer on that underlying.

## **What the three modes look like in numbers**

Take a 10,000 USDC long on ETH perps with ETH at 3,000, and follow the same position through each mode. Premiums below are illustrative — the live quote is what you'll actually pay — but the *shape* is exactly right, and the shape is the part people get wrong.

**Unprotected.** ETH at 2,400 and you're down 2,000. ETH at 2,000 and you're down 3,333, or liquidated first depending on leverage. There is no floor except the one your collateral imposes.

**Limit My Loss, floor at 2,700.** That's a 10% floor, so it needs a one-month duration or longer under the range table above. Say the protection costs 250. ETH at 2,400: the perp is down 2,000, the put is worth roughly 1,000, and your loss is capped near 1,000 plus the 250 you paid. ETH at 4,000: you make 3,333 on the perp, minus the 250. You gave up 250 to convert an open-ended loss into a known one, and kept the whole upside.

**Get Paid to Hold, ceiling at 3,300.** Say you receive 200. ETH flat at 3,000: you keep the 200, which is the entire point of the trade. ETH at 3,300: you make 1,000 plus the 200. ETH at 4,000: you still make 1,000 plus the 200, because the ceiling is the ceiling. ETH at 2,400: you're down 2,000, cushioned by 200. The premium is not protection, it's income.

**Lock My Range, floor 2,700 and ceiling 3,300.** The 200 you receive for the ceiling roughly funds the 250 you pay for the floor, so the net cost is near zero. Your outcome is now bounded at roughly −1,000 and +1,000 whatever ETH does. That is a narrower band than most traders realise they're agreeing to, and it's the reason to set the ceiling with as much thought as the floor.

The pattern across all three: you are always paying for one side with the other, or with cash. Nothing here is free, and the modes that feel free are the ones where you've sold something.

There's a fourth comparison worth making explicitly, because it's the one that actually changes behaviour. **Limit My Loss versus a stop-loss at the same level.** The stop costs nothing up front and the put costs 250. But the stop can be wicked out by a thirty-second move that immediately reverses, it can gap straight through in a fast market and fill materially below where you set it, and once it triggers you're out of the position entirely. The put does none of those things: it doesn't trigger, it doesn't fill anywhere, and you still hold the perp on the other side of the move. The 250 is what you're paying to remove three failure modes, not one.

And a fifth, on duration. The same 10% floor bought for two months costs more than for one, but it is not twice the price — options premium does not scale linearly with time. If you're genuinely uncertain how long a thesis needs, pricing both and comparing the cost per week is a two-minute exercise that frequently makes the longer duration look cheap.

## **Hedging perps positions with options, manually**

PERPS+ covers the common cases with fixed shapes. Building the legs yourself gives you full control over strikes and expiries — and it's the only route on underlyings PERPS+ doesn't carry.

**Protective put.** Long perp, long put. Same structure as Limit My Loss, but you pick the strike and expiry rather than a level and a default. Use it when you want protection to a specific date, such as an unlock or a macro print, or when you want a floor outside the PERPS+ range limits.

**Covered call.** Long perp, short call. Same as Get Paid to Hold. Selling further out of the money collects less premium and gives up less upside. That trade-off is yours to make when you build it manually.

**Collar.** Long perp, long put, short call. Lock My Range with strikes you choose. Widening the range costs premium, narrowing it can put you net positive.

**Call and put spreads.** Long one strike, short another. Defined risk and defined reward for a directional view, with the short leg cutting the cost of the long. When you have a target rather than just a direction, a spread is usually cheaper than an outright.

**Straddles and strangles.** Long a call and a put. A position on movement rather than direction, for when you expect a violent reaction to an event but genuinely don't know which way. Straddles cost more and pay from any move. Strangles cost less and need a bigger one.

**Cash-and-carry.** When funding is persistently positive, short the perp and hold the spot exposure. You collect funding while flat on direction. Watch the funding rate rather than the price, and be aware that funding can flip.

**Calendar spreads.** Same strike, different expiries. A position on the shape of the volatility curve. Not a beginner's trade, but the cross-margin account makes it manageable when it's right.

## **What if I want the strategy run for me?**

That's what Aevo Strategies is for.

Aevo Strategies are automated trading strategies executed algorithmically inside the exchange, using the same Layer 2 architecture as everything else. You deposit; the strategy trades.

The flagship is the **Aevo Basis Trade**, and it's the cash-and-carry above turned into a product. The vault simultaneously buys spot and sells a perpetual future on the same asset against it, collecting funding payments. Because every long spot position is balanced by a short perp, the vault takes no directional exposure — it is **delta-neutral** — and it performs positively as long as the funding rate is positive.

The rationale is the basis itself. Spot and futures prices diverge on supply and demand, and funding payments exist to pull them back together:

  - **Positive funding rate:** long position holders pay short position holders.
  - **Negative funding rate:** short position holders pay long position holders.

Hold the short perp leg while funding is positive and you are on the receiving end of that payment, with the spot leg neutralising the price risk.

Execution is fully algorithmic and continuously monitored by Aevo's risk team, which is the actual argument for using it over running the trade yourself. Cash-and-carry is not a difficult idea; it's a difficult thing to maintain. Rebalancing as prices move, managing the margin on the short leg, and being awake when funding flips are all jobs, and doing them badly turns a delta-neutral position into a directional one.

Two things to be clear-eyed about. The vault is **not risk-free** — delta-neutral means no directional exposure, not no exposure, and a sustained negative funding regime turns the income stream into a cost. And it is a different shape of return from everything else on this page: no view, no timing, no upside beyond the carry.

## **Which strategy for which situation?**

|  |  |
| :-: | :-: |
| **You want to...** | **Use** |
| Hold a long but not risk a liquidation | Limit My Loss, or a protective put |
| Get paid while a position goes nowhere | Get Paid to Hold, or a covered call |
| Know both ends before you enter | Lock My Range, or a collar |
| Set a floor wider than 20%, or beyond 2 months | Manual put, or [Aevo OTC](https://otc.aevo.xyz/trade) |
| Express a view with a price target | Call or put spread |
| Position for a move without a direction | Straddle or strangle |
| Earn from funding without direction | Cash-and-carry, or the Aevo Basis Trade |
| Have the carry trade run and monitored for you | Aevo Basis Trade |
| Protect against a specific date | Manual put at that expiry |
| Protect an altcoin perp | Manual put, or [Aevo OTC](https://otc.aevo.xyz/trade) |
| Trade size, or a strike that isn't listed | [Aevo OTC](https://otc.aevo.xyz/trade) |

## **What about hedging an existing position?**

You don't need to close and reopen.

Options positions can be added to an existing perp at any time. The cross-margin account nets the exposure straight away, so buying a put against an open long reduces your margin requirement rather than adding to it. If the position is already offside and you want to stop the bleeding without capitulating, this is the move: a put sets a floor and keeps you in the trade, where closing sets your loss permanently.

Note that this is the manual route by necessity. PERPS+ attaches at entry, so a position you already hold gets its protection through the options market rather than the one-tap layer.

The counterpoint, stated plainly: protection costs money. Buying a put every time you open a long will erode returns, and traders who over-hedge underperform traders who don't hedge at all. Hedge the positions where a bad outcome genuinely matters. Size the rest so it doesn't.

A rough test for whether a hedge is worth its premium: if the position going wrong would change what you can do next — force you to cut something else, or take the account below a level you need — hedge it. If it would just be annoying, size it smaller instead. Premium spent on positions that were never going to hurt you is the single most common way a hedging habit turns into a losing one.

One timing note. Protection is cheapest when you don't feel you need it. Buying a put after a position has already moved against you means paying elevated implied volatility for a floor that's now further from your entry — you get less protection for more money, precisely because the market has already reacted. The decision to hedge belongs at entry, or at least on a calm day.

## **Things that go wrong**

Six failure modes worth knowing before they cost you.

  - **Hedging everything.** Premium compounds. Protection is for positions that could hurt you, not for every trade you place.
  - **Expiry and thesis mismatch.** A one-week put doesn't protect a one-month view. Match the expiry to the risk you're actually hedging, and remember the range limits tie the two together on PERPS+.
  - **Forgetting the ceiling exists.** Get Paid to Hold and Lock My Range cap your upside. That's the deal. If the market runs, you don't get all of it.
  - **Assuming you can switch enhancers mid-trade.** One active enhancer per asset. Changing mode means closing the first position, and that's two actions at a moment when you probably wanted one.
  - **Treating cross margin as free leverage.** Cross margin reduces the requirement on hedged exposure. It doesn't reduce the risk on unhedged exposure, and a loss in one position draws on collateral supporting the others.
  - **Ignoring funding on multi-week holds.** Carry costs accumulate quietly. Check funding on anything you plan to hold, in either direction — it's the same number the Basis Trade is built to harvest, working against you instead.

## **Where to start**

If you trade perps and have never used options, start with Limit My Loss on a BTC or ETH position you were going to take anyway. Set the floor where you'd have put your stop, pick the shortest duration whose range reaches it, and compare what you paid in premium against what a stop-out on a wick has cost you before.

If you're already comfortable with options, the cross-margin account and zero per-trade gas are the reasons to build structures here rather than somewhere they cost margin twice and gas per leg.

If you don't want a view at all, the Basis Trade is the strategy that doesn't need one.

And if you want the arithmetic done before you commit, the [Aevo MCP](https://docs.aevo.xyz/aevo-products/aevo-mcp) exposes the options tooling to an AI client, so you can price a structure and see its margin impact on your actual account before placing a single leg.

Trade at [app.aevo.xyz](https://app.aevo.xyz), take size at [otc.aevo.xyz/trade](https://otc.aevo.xyz/trade), and the full product documentation is at [docs.aevo.xyz](https://docs.aevo.xyz/).

## **Related reading**

  - *Aevo OTC: trade altcoin options on-chain, at size* — strikes and expiries the listed grid doesn't carry
  - *The Aevo MCP: give your AI agent a trading desk* — pricing a multi-leg structure before you place it
  - *Aevo staking explained: tiers, epochs, the lottery and every reward* — what your strategy volume earns alongside the PnL
  - *Pre-launch token futures: trade a token before it lists* — the one market where none of this applies
