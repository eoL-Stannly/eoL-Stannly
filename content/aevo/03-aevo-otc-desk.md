# **Aevo OTC: trade altcoin options on-chain, at size**

**An on-chain OTC desk with institutional liquidity providers on the other side. Any asset listed on Aevo, any strike, any expiry up to three months, and zero exchange fees.**

**TL;DR**

**•**  Aevo OTC is an on-chain over-the-counter desk for crypto options, running on the Aevo L2.

**•**  It's an RFQ market. You describe the trade you want, institutional liquidity providers quote it, you take the best price or walk.

**•**  Zero exchange fees. Your cost is the spread in the quote, not a fee on top of it.

**•**  Any asset listed on Aevo, including memecoins and newer tokens. The list moves with demand.

**•**  Any strike. Any expiry out to three months. Any size. You're not picking from a chain of listed contracts.

**•**  On-chain dynamic margin, so the position is margined properly rather than fully collateralised by default.

**•**  Settlement is instant on L2. No T+1, no bilateral credit, no waiting on a desk in a different timezone.

**•**  Early unwind at mark price. You're not stuck holding to expiry because there's no bid.

**•**  Roughly 25% of altcoin options volume goes through exchanges. The other 75% is OTC. This is that market, on-chain.

**•**  It's at [otc.aevo.xyz/trade](https://otc.aevo.xyz/trade), separate from the main exchange.

The exchange order book solves one problem well: liquid contracts on major assets, traded in normal size. The moment you step outside that, it stops helping. A 400,000 USDC position in an altcoin option isn't a trade the screen can absorb, and the strike you actually want probably isn't listed.

That's the gap Aevo OTC fills, and it's a bigger gap than it looks. Only about a quarter of altcoin options volume clears on exchanges. Everything else is negotiated privately, over chat, with settlement risk attached and no price you can verify.

## **What is an on-chain OTC desk?**

A venue where trades are privately negotiated between you and a liquidity provider, but cleared and settled on-chain rather than bilaterally.

Traditional crypto OTC works over messaging apps. You tell a desk what you want, they come back with a price, you agree, and then you're both trusting each other and a settlement process to finish the job. It works, it's how most large trades happen, and it carries counterparty risk that never fully goes away.

Aevo OTC keeps the negotiation and removes the trust. Quotes come from institutional market makers, you compare them, and execution settles on the Aevo L2 immediately. The counterparty risk that defines conventional OTC isn't managed, it's designed out.

The result is institutional pricing and mechanics available to accounts that would never get a desk to pick up the phone.

## **How does the RFQ model work?**

Request for quote. Four steps.

  1. **You define the trade.** Asset, call or put, strike, expiry, size, direction. This is the part the order book can't offer, because you're specifying the contract rather than selecting one.
  2. **Liquidity providers quote.** Institutional market makers price your specific request and respond.
  3. **You compare and choose.** Multiple quotes on the same request, competing on price. Or you decline all of them, which costs nothing.
  4. **Settlement is instant on L2.** No bilateral settlement leg, no waiting.

The competitive dynamic is the point. In a chat-based OTC negotiation you're usually talking to one desk and have no way to know whether the price is good. Here several market makers quote the same request and you can see what the market actually thinks.

Because you're only ever quoted your exact request, nothing about your interest is broadcast to the market before it's filled. The information leakage that makes large orders expensive on a public book doesn't apply.

## **Why not just use the exchange order book?**

For a standard-size ETH or BTC option, use the order book. It's tighter and faster.

The OTC desk earns its place in three situations.

**Size.** A large order on a public book moves the price against you as it fills, and everyone watching sees it happen. That's slippage plus information leakage, and it compounds. RFQ prices the whole clip at once.

**Strike and expiry.** Listed contracts sit on a fixed grid. If you want protection at a specific level, or an expiry that lines up with an unlock, the grid rarely has it. OTC has no grid. Any strike, any expiry out to three months.

**Assets that aren't liquid on-screen.** Altcoin and memecoin options simply don't have deep listed books. Institutional liquidity providers will still price them. The available list adjusts with demand, so trending assets tend to appear.

## **What does it cost?**

Zero exchange fees on Aevo OTC.

That's more meaningful in options than in perps. On a multi-leg options structure, taker fees compound across every leg, and on smaller premiums the fee can be a sizeable share of what you're paying for the position. Removing the fee layer entirely removes that.

Your real cost is the spread inside the quote, which is exactly the number the RFQ process is designed to compress. Multiple providers pricing the same request compete that spread down. You see the all-in price before you commit, and there's nothing added afterwards.

## **How is margin handled?**

On-chain dynamic margin, which is the part that separates this from most on-chain options venues.

The common approach is full collateralisation: to sell a call, lock the entire underlying. Safe, simple, and capital-destroying. A structure with defined, limited risk still ties up collateral as though the risk were unlimited.

Dynamic margin instead assesses what the position can actually lose and requires margin against that. If your risk is bounded, your margin reflects it. Capital that would otherwise sit idle stays available.

For anyone running several positions at once, this is usually the difference between the strategy being viable and not.

## **Can I get out before expiry?**

Yes. Early unwind at mark price.

This is the question that decides whether an OTC position is usable, and it's where conventional crypto OTC is weakest. A bilaterally negotiated option is typically something you hold to expiry, because getting out means going back to the same desk and accepting whatever they feel like quoting.

Aevo OTC lets you unwind early at mark price, so the position is manageable rather than terminal. If your thesis changes at week two of a twelve-week option, you act on it.

Combined with the strike and expiry flexibility, that changes what OTC is for. It stops being a one-shot bet you're locked into and becomes a position you can run.

## **Aevo OTC against the alternatives**

| | | | |
|:-:|:-:|:-:|:-:|
| | **Aevo OTC** | **Aevo order book** | **Chat-based OTC desk** |
| Strike / expiry | Any strike, any expiry to 3 months | Listed contracts only | Negotiable |
| Size | Institutional, quoted as one clip | Limited by book depth | Institutional |
| Exchange fees | Zero | Standard taker/maker | Varies, often embedded |
| Counterparty risk | Settled on-chain | Settled on-chain | Bilateral |
| Settlement | Instant, on L2 | Instant, on L2 | Manual, often delayed |
| Price competition | Multiple LPs quote | Public book | Usually one desk |
| Early exit | Unwind at mark | Trade out on book | Renegotiate with desk |
| Altcoin coverage | Broad, demand-driven | Liquid assets | Broad |
| Information leakage | None pre-fill | Visible in book | None pre-fill |

## **Who is this for?**

Three profiles, honestly assessed.

  - **Traders sizing beyond the book.** If your order would visibly move the market you're trading in, RFQ is not a preference, it's the correct instrument.
  - **Anyone wanting a specific strike or date.** Hedging a token unlock, an unwind schedule or a vesting cliff means matching a date the listed grid won't have.
  - **Traders working in altcoins and memecoins.** There is no deep listed options book for most of these. There are market makers willing to price them.

If you're buying a standard ETH call in normal size, the order book is the better venue. Aevo OTC is for the trades the screen can't do.

## **Getting started**

The desk is at [otc.aevo.xyz/trade](https://otc.aevo.xyz/trade). It's a separate interface from the main exchange at [app.aevo.xyz](https://app.aevo.xyz).

Worth doing on your first request: submit one you're prepared to decline. Quotes cost nothing and commit you to nothing, and seeing what institutional pricing on your asset and strike actually looks like tells you more than any amount of reading. Compare it against what the listed book would have cost you in slippage on the same size, and the decision usually makes itself.

Full documentation is in the [Aevo OTC docs](https://docs.aevo.xyz/aevo-products/aevo-otc) and the [trading guide](https://docs.aevo.xyz/aevo-products/aevo-otc/trading-on-aevo-otc).
