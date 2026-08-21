# **Aevo OTC: trade altcoin options on-chain, at size**

**A decentralized options desk with institutional liquidity providers on the other side. Any asset listed on Aevo, any strike, maturities out to three months, and zero exchange fees.**

**TL;DR**

**•**  Aevo OTC is an on-chain over-the-counter desk for crypto options, running on the Aevo L2.

**•**  It's an RFQ market. You describe the trade you want, institutional liquidity providers quote it, you take the best price or walk.

**•**  Zero exchange fees. Your cost is the spread in the quote, not a fee on top of it.

**•**  Around 13 assets are quotable, including memecoins and newer tokens. The list moves with demand.

**•**  Any strike you specify. Maturities run weekly, biweekly and monthly, out to three months. Any size.

**•**  On-chain dynamic margin, so the position is margined properly rather than fully collateralised by default.

**•**  Market makers post 30% initial margin in USDC plus variation margin against mark-to-market, all locked on-chain. Their obligation to you is collateral, not a promise.

**•**  Settlement is instant on L2. No T+1, no bilateral credit, no waiting on a desk in a different timezone.

**•**  Early unwind at mark price — the headline addition in OTC V2. You're not stuck holding to expiry because there's no bid.

**•**  Liquidation fee is 0.5%, an order of magnitude below the 5% on pre-launch futures.

**•**  **Only around 25% of altcoin options volume clears on exchanges.** The other three-quarters is negotiated OTC. This is that market, on-chain.

**•**  Listed altcoin options spreads frequently run 5–10% or wider. That's the number an RFQ is competing against, and it's why the comparison isn't close as size grows.

**•**  It's at [otc.aevo.xyz/trade](https://otc.aevo.xyz/trade), separate from the main exchange.

The exchange order book solves one problem well: liquid BTC options and ETH options, traded in normal size. The moment you step outside that, it stops helping. A 400,000 USDC position in an altcoin option isn't a trade the screen can absorb, and the strike you actually want probably isn't listed.

That's the gap Aevo OTC fills, and it's a bigger gap than it looks. Only around a quarter of altcoin options volume clears on exchanges at all. Everything else is negotiated privately, over chat, with settlement risk attached and no price you can verify.

Worth sitting with that number for a moment, because it's usually read as a statement about traders and it's actually a statement about infrastructure. Three-quarters of a market doesn't move off-exchange because participants prefer chat windows. It moves because the exchange can't do the job.

## **What is an on-chain OTC desk?**

A venue where trades are privately negotiated between you and a liquidity provider, but cleared and settled on-chain rather than bilaterally.

Traditional crypto OTC works over messaging apps. You tell a desk what you want, they come back with a price, you agree, and then you're both trusting each other and a settlement process to finish the job. It works, it's how most large trades happen, and it carries counterparty risk that never fully goes away. It also carries an onboarding tax: to get competitive pricing you need relationships with several market makers, and each one is its own paperwork, its own credit line, its own chat window.

Aevo OTC keeps the negotiation and removes both problems. Quotes come from institutional market makers you never have to onboard with individually, you compare them, and execution settles on the Aevo L2 immediately. The counterparty risk that defines conventional OTC isn't managed, it's designed out.

The result is institutional pricing and mechanics available to accounts that would never get a desk to pick up the phone. It works in the other direction too: CoinFund's first on-chain crypto options trade with Galaxy went through Aevo OTC, for the margin treatment and the on-chain payoff enforcement rather than for the convenience. The plumbing is the product.

## **Why is the listed market so bad at altcoin options?**

Three structural problems, and none of them is a criticism of any particular exchange. They're what a central limit order book does when it meets an asset class it wasn't shaped for.

**Thin order books.** Most altcoin options carry inadequate market depth. That's not an inconvenience, it's a price-impact tax: executing anything beyond a small clip moves the market against you as it fills. Sophisticated strategies become impossible to implement not because the strategy is wrong but because putting it on costs more than it can make.

**Wide spreads.** Bid-ask spreads on altcoin options frequently reach 5–10% or more. Read that as a fee, because that's what it is — a hidden one, charged on entry and again on exit, and large enough to make plenty of otherwise-sound trades economically unfeasible before you've taken any market risk at all.

**Rigid strikes and expiries.** Exchanges list a fixed grid. It's a one-size-fits-all approach to a set of traders whose needs are anything but: someone hedging a vesting cliff on a specific date and someone expressing a two-week directional view are not served by the same four strikes and three expiries.

Stack the three and the outcome is the 75% figure. The volume didn't disappear, it relocated.

## **What makes altcoins specifically hard?**

Three things that don't apply to BTC options or ETH options in the same way.

**Rapid market rotation.** The altcoin market moves attention and liquidity quickly. New assets capture both, and exchange infrastructure struggles to keep pace — so listed options are frequently unavailable on precisely the assets that matter most, at precisely the moment they matter. A listing process that takes weeks is structurally behind a market that rotates in days.

**Customisation requirements.** Altcoin holders have genuinely divergent needs. A token founder sitting on a large allocation has fundamentally different hedging requirements from a speculative trader, who has different requirements again from a long-term holder. The founder needs a specific strike on a specific unlock date in size. The trader needs a cheap two-week directional structure. A fixed grid serves neither well and pretends they're the same customer.

**Traditional pricing models don't fit.** Standard options pricing models often fail to capture the volatility characteristics of altcoins, which creates persistent mispricing in exchange environments that rely on them. An RFQ market sidesteps this: market makers price the specific risk in front of them rather than deriving a quote from a model that was never built for the asset.

That last point is the quiet reason RFQ works better here than a book does. On BTC, the model and the market broadly agree. On a memecoin three weeks after launch, they don't, and you want a price from someone who is actually willing to warehouse the risk.

## **How does the RFQ model work?**

Request for quote. Four steps.

1.  **You define the trade.** Asset, call or put, strike, expiry, size, direction. This is the part the order book can't offer, because you're specifying the contract rather than selecting one.
2.  **Liquidity providers quote.** Institutional market makers price your specific request and respond with a price and a signature — a committed, executable quote rather than an indication.
3.  **You compare and choose.** Multiple quotes on the same request, competing on price. Or you decline all of them, which costs nothing.
4.  **Settlement is instant on L2.** No bilateral settlement leg, no waiting.

The competitive dynamic is the point. In a chat-based OTC negotiation you're usually talking to one desk and have no way to know whether the price is good. Here several market makers quote the same request and you can see what the market actually thinks.

Because you're only ever quoted your exact request, nothing about your interest is broadcast to the market before it's filled. The information leakage that makes large orders expensive on a public book doesn't apply.

Quotes are live for a limited window rather than indefinitely, which is the normal behaviour of any market maker pricing risk. Treat a quote as something to accept or decline while you're looking at it, not something to think about overnight.

## **Why not just use the exchange order book?**

For standard-size ETH options or BTC options, use the order book. It's tighter and faster.

The OTC desk earns its place in three situations.

**Size.** A large order on a public book moves the price against you as it fills, and everyone watching sees it happen. That's slippage plus information leakage, and it compounds. RFQ prices the whole clip at once.

The arithmetic is worth doing once. Suppose you want 500 contracts and the book shows 80 at the touch, with each successive level a little worse. You don't pay the screen price — you pay the average of everything you sweep, and by the time you're through, the last portion of the order is filling at a level set partly by your own buying. On an illiquid altcoin book where the spread was already 5–10% before you started, that average can land a long way from where the option was quoted. An RFQ prices all 500 as one number, and you see it before you commit.

**Strike and expiry.** Listed contracts sit on a fixed grid. If you want protection at a specific level, or an expiry that lines up with an unlock, the grid rarely has it. On OTC you name the strike, and maturities run weekly, biweekly and monthly out to three months — enough granularity to land on the date that matters rather than the nearest one available.

**Assets that aren't liquid on-screen.** Altcoin and memecoin options simply don't have deep listed books. Institutional liquidity providers will still price them, across roughly 13 assets at any given time, with the available list adjusting as demand moves. Trending assets tend to appear — which is the direct answer to the rotation problem above.

## **What does it cost?**

Zero exchange fees on Aevo OTC.

That's more meaningful in options than in perps. On a multi-leg options structure, taker fees compound across every leg, and on smaller premiums the fee can be a sizeable share of what you're paying for the position. Removing the fee layer entirely removes that.

Your real cost is the spread inside the quote, which is exactly the number the RFQ process is designed to compress. Multiple providers pricing the same request compete that spread down. You see the all-in price before you commit, and there's nothing added afterwards.

Set that against the 5–10% spreads common on listed altcoin options and the comparison stops being about fees at all. Zero fees on a competed spread versus standard fees on an uncompeted one is not a marginal difference, and it widens with every leg you add.

If a position is liquidated, the fee is 0.5% of the transaction amount. Worth holding in mind alongside the rest of the venue: the same event on a pre-launch token future costs 5%, ten times as much. Aevo prices liquidation risk according to how hard the position is to unwind, and a margined options position on a desk with committed market makers is a great deal easier to unwind than a 2x position on a token that doesn't trade anywhere.

One habit that pays for itself: price the same trade both ways before you send it. Get the RFQ, then work out what sweeping the listed book would have cost you in slippage on the same size. On liquid majors in small size the book usually wins. Past a certain size, on a certain asset, it stops winning — and knowing roughly where that line sits for the things you trade is worth more than any general rule.

## **How is margin handled?**

On-chain dynamic margin, which is the part that separates this from most decentralized options venues.

The common approach on an options dex is full collateralisation: to sell a call, lock the entire underlying. Safe, simple, and capital-destroying. A structure with defined, limited risk still ties up collateral as though the risk were unlimited.

Dynamic margin instead assesses what the position can actually lose and requires margin against that. If your risk is bounded, your margin reflects it. Capital that would otherwise sit idle stays available.

The same logic runs on the other side of the trade, and it's the reason the counterparty risk genuinely goes away rather than being politely ignored. Liquidity providers post 30% initial margin in USDC when they take the other side, and a variation margin system prompts them to top up as the position moves mark-to-market against them. All of it is locked on-chain. In a chat-based OTC trade, the desk's obligation to you is its reputation. Here it's collateral you can verify.

For anyone running several positions at once, the capital efficiency is usually the difference between the strategy being viable and not.

## **Can I get out before expiry?**

Yes. Early unwind at mark price.

This is the question that decides whether an OTC position is usable, and it's where conventional crypto OTC is weakest. A bilaterally negotiated option is typically something you hold to expiry, because getting out means going back to the same desk and accepting whatever they feel like quoting.

Early unwind was the headline change in OTC V2, and it works the same way as entry: you submit an unwind request to the institutional market makers and take a price, capturing whatever the position has made on spot moves or on implied volatility. If your thesis changes at week two of a twelve-week option, you act on it.

Combined with the strike and expiry flexibility, that changes what OTC is for. It stops being a one-shot bet you're locked into and becomes a position you can run — and a position you can run is a position you can hedge with, which is a different proposition entirely.

## **Aevo OTC against the alternatives**

|  |  |  |  |
| :-: | :-: | :-: | :-: |
|  | **Aevo OTC** | **Aevo order book** | **Chat-based OTC desk** |
| Strike / expiry | Any strike; weekly, biweekly, monthly to 3 months | Listed contracts only | Negotiable |
| Size | Institutional, quoted as one clip | Limited by book depth | Institutional |
| Typical altcoin spread | Competed across LPs | Frequently 5–10%+ | One desk's number |
| Exchange fees | Zero | Standard taker/maker | Varies, often embedded |
| Counterparty risk | On-chain collateral, 30% LP initial margin | Settled on-chain | Bilateral, reputational |
| Settlement | Instant, on L2 | Instant, on L2 | Manual, often delayed |
| Price competition | Multiple LPs quote | Public book | Usually one desk |
| Early exit | Unwind at mark | Trade out on book | Renegotiate with desk |
| Onboarding | One venue | One venue | Per desk |
| Altcoin coverage | ~13 assets, demand-driven | Liquid assets | Broad |
| Information leakage | None pre-fill | Visible in book | None pre-fill |

## **Who is this for?**

Three profiles, honestly assessed.

  - **Traders sizing beyond the book.** If your order would visibly move the market you're trading in, RFQ is not a preference, it's the correct instrument.
  - **Anyone wanting a specific strike or date.** Hedging a token unlock, an unwind schedule or a vesting cliff means matching a date the listed grid won't have.
  - **Traders working in altcoins and memecoins.** There is no deep listed options book for most of these. There are market makers willing to price them.

And a fourth that the customisation point above makes explicit: **token founders and treasuries.** A large allocation with a known unlock schedule is the single clearest case for a bespoke strike on a bespoke date, in size, without signalling it to the market first. That's a trade the listed grid cannot do at any price.

If you're buying a standard ETH call in normal size, the order book is the better venue. Aevo OTC is for the trades the screen can't do.

## **Does an OTC position hedge my perps?**

Yes, and that's one of the better reasons to use it.

An OTC option is a position on the Aevo L2 like any other, so it sits in the same account as your perpetual futures. If you're long ETH perps and you buy downside protection through OTC at a strike and expiry the listed grid doesn't offer, that protection nets against the perp for margin purposes in the normal way. Cross margin hedging doesn't stop applying because the option was negotiated rather than lifted off a book.

The case where this matters most is the one PERPS+ deliberately doesn't cover. The built-in one-tap protection modes run on BTC and ETH perpetual futures. If you're long an altcoin perp in size, there is no one-tap floor to reach for — but there are market makers who will quote you a put on it. That's the same downside protection logic as the built-in modes, applied where the exchange's own grid runs out.

The second case is dates. A put that expires the Friday before a vesting cliff is worth considerably more than a put that expires the Friday after, and the listed grid has no obligation to carry either.

The third is duration. PERPS+ tops out at a two-month enhancer. If you're hedging a six-month view, OTC's three-month maturities and the ability to roll are the route, and hedging cross margin positions through the desk rather than the grid is how that gets done without doubling your margin requirement.

## **Getting started**

The desk is at [otc.aevo.xyz/trade](https://otc.aevo.xyz/trade). It's a separate interface from the main exchange at [app.aevo.xyz](https://app.aevo.xyz).

Worth doing on your first request: submit one you're prepared to decline. Quotes cost nothing and commit you to nothing, and seeing what institutional pricing on your asset and strike actually looks like tells you more than any amount of reading. Compare it against what the listed book would have cost you in slippage on the same size, and the decision usually makes itself.

A second habit worth building early: request the same structure at two or three different strikes at once. The shape of how premium changes across strikes tells you where the market makers think the risk actually is, and that's information you can't get from a single quote.

Full documentation is in the [Aevo OTC docs](https://docs.aevo.xyz/aevo-products/aevo-otc) and the [trading guide](https://docs.aevo.xyz/aevo-products/aevo-otc/trading-on-aevo-otc).

## **Related reading**

  - *Aevo trading strategies: from one-tap protection to multi-leg structures* — the structures you'd bring to an RFQ
  - *The Aevo MCP: give your AI agent a trading desk* — pricing and evaluating a structure before you request a quote
  - *Aevo staking explained: tiers, epochs, the lottery and every reward* — options volume counts towards the year-end distribution, delta-weighted
  - *Pre-launch token futures: trade a token before it lists* — the one market OTC can't hedge, and why
