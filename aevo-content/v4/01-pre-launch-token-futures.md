# **Pre-launch token futures: trade a token before it lists**

**Aevo's pre-launch markets let you take a position on an unlisted token, with 2x leverage, no funding rate and a hard cap on size. Here's exactly how they behave, what the liquidation maths actually looks like, what they cost to trade, what happens if the token launches at a different supply, and what changes the day it goes live.**

**TL;DR**

**•**  Pre-launch token futures are markets on tokens that haven't launched yet. You trade the price, not the token, and you never take delivery.

**•**  Leverage is capped at 2x. Initial margin is 50% of notional, so half the position sits behind it in cash. Everything is collateralised in USDC.

**•**  Maintenance margin is 48%, an order of magnitude wider than the 3% on a standard perpetual future. This is deliberate.

**•**  In price terms that leaves a liquidation corridor in the low single digits of percent, not the 20–30% you're used to on BTC perps. The worked numbers are below.

**•**  Aevo's own documentation carries a blunt warning: use your entire balance as margin and you may be liquidated shortly after opening. Take it literally.

**•**  Fees are 25 bps taker, and the maker side is a **10 bps rebate** — you're paid to post, not merely discounted. The liquidation fee is 5%, versus 0.5% on Aevo OTC.

**•**  **You cannot post market orders from the Aevo website on a pre-launch market**, and the Close Position button is unavailable. Both are deliberate. You exit with a limit order.

**•**  There is no index price. Nothing external exists to price against, so mark price comes off the order book itself.

**•**  There is no funding rate. Funding needs an index to pull the contract towards, so until one exists there's nothing to pay or receive.

**•**  Maximum position size is capped at 50,000 USDC. Everyone is on the same cap, and no tier or stake lifts it.

**•**  **If the token launches at a different total supply than the market assumed, Aevo rebases the market.** Your notional is unchanged, but your contract count and the quoted price both change. The worked example is below.

**•**  When a reliable index appears, usually a tier 1 CEX listing or a deep DEX pool, the market converts into a standard perpetual future. Positions stay open and resting orders stay valid.

**•**  Conversion doesn't touch your position. What changes is that maintenance margin drops from 48% to 3%, and funding starts.

**•**  Pre-launch volume is excluded from the 10M qualifying volume for the year-end Mega Reward distribution. Perps and options count; pre-launch does not.

Pre-launch markets are the strangest instrument on the Aevo perps dex, and the one most often traded without reading the specification first. That's an expensive habit. The margin rules are not the rules you're used to from ETH perps or BTC perps, and the day the underlying token lists, the rules change underneath you while you hold the position.

There is also a mechanic most traders never encounter until it happens to them — a supply rebase — which can change the number on your screen by a factor of ten without changing your position at all. It has its own section below, because seeing it for the first time mid-position is not the moment to work out what it means.

Everything below is the mechanics. Nothing here is a view on any particular token.

## **What is a pre-launch token future?**

A perpetual future on a token that does not yet trade anywhere.

A project has announced a token. There's a ticker, a supply schedule, maybe a points programme. There is no spot market, no exchange listing, and no price. Aevo lists a market anyway, and the price is whatever buyers and sellers agree it is.

You're trading a claim on where that token opens, settled in USDC. Long if you think the market is under-pricing it, short if you think the airdrop farmers are about to hit the bid on day one. You never hold the token, and you never need a wallet that can receive it.

The contract is perpetual, so there's no expiry to trade around. It runs until the token lists and the market converts, which is covered further down.

Aevo has been listing these markets since the last cycle and has run some of the largest pre-launch books in the market, which is worth knowing for one practical reason: the conversion and rebase processes described later aren't theoretical. They have happened repeatedly, and they behave the same way each time.

## **How is a pre-launch future priced without an index?**

It isn't. That's the whole point, and it's the source of every other difference in the specification.

A standard perpetual future on Aevo has an index price assembled from external spot venues. Mark price is anchored to that index, funding pulls the contract back towards it, and liquidations reference it. The index is the gravity in the system.

A pre-launch market has no external spot venue to build an index from, because the token doesn't trade anywhere. So mark price comes off the order book itself, and the contract prices purely on what participants will pay.

Two consequences worth internalising before you size a position:

  - **Price discovery is thin and it moves.** There's no arbitrage channel to a spot market, because there's no spot market. A large order moves the price and nothing external drags it back.
  - **There is no "wrong" price to arbitrage against.** On BTC perpetual futures, a contract trading 3% above spot is a trade. Here, there is no spot. The order book is the price.

There's a third consequence that only becomes obvious later. Because there's no index, the market isn't really pricing a token — it's pricing a **valuation**. A pre-launch contract at 1.00 on an assumed 1 billion supply and a pre-launch contract at 0.10 on an assumed 10 billion supply are the same opinion about the project. That equivalence is what makes the rebase mechanic below necessary, and it's why the quoted price on its own tells you less than you think.

## **What leverage can I use on pre-launch markets?**

2x, and only 2x.

|  |  |
| :-: | :-: |
| **Parameter** | **Pre-launch value** |
| Initial margin | 50% of notional |
| Maximum leverage | 2x |
| Maintenance margin | 48% |
| Collateral | USDC |
| Index price | None |
| Funding payments | None |
| Max position size | 50,000 USDC |
| Taker fee | 25 bps |
| Maker fee | −10 bps (rebate) |
| Liquidation fee | 5% |

Initial margin of 50% means opening a 10,000 USDC position requires 5,000 USDC of margin. Compare that with BTC perpetual futures on Aevo, where 5% initial margin gets you up to 20x.

The 48% maintenance margin is the number people miss. On BTC perps, maintenance margin is 3%, so there's a wide corridor between the margin you post and the level where you get liquidated. Here you post 50% and you're liquidated at 48%. The corridor is two percentage points of margin ratio — and that is a much smaller price move than it sounds like.

## **How far can price move before I'm liquidated?**

Single-digit percent. Here is the arithmetic, so you can check it rather than take it on trust.

Take a 10,000 USDC long at an entry price of 1.00, funded with 5,000 USDC of initial margin. Your equity is the margin you posted plus your unrealised PnL. You are liquidated when equity falls to the maintenance requirement, which is 48% of the position's notional.

Assess maintenance against your entry notional and you get:

*5,000 + 10,000 × (P − 1.00) = 0.48 × 10,000* → *P = 0.98*

A 2% adverse move. Assess maintenance against the position's current notional instead, which is how most margin engines mark risk, and the long stretches slightly:

*5,000 + 10,000 × (P − 1.00) = 0.48 × 10,000 × P* → *P ≈ 0.962*

A 3.8% adverse move. The same calculation on the short side is tighter still, because an adverse move on a short *increases* the notional you have to margin: the corridor works out around 1.4%.

Two things to take from that. First, the exact number depends on how maintenance is assessed and it is not worth guessing — **read the liquidation price the interface shows you before you confirm the order.** Second, whichever convention applies, you are working with a few percent of room, not the twenty or thirty percent a 5x position on ETH perps would give you.

That is not a mistake in the specification. With no index and no external reference, the exchange has no way to price the risk of a gap. So it doesn't try. It holds enough margin against the position that a gap can't leave the book with bad debt, and it accepts that the trade-off is a very tight liquidation band.

Aevo's documentation states the practical consequence in one line: if you attempt to use your entire balance as margin, you may be liquidated soon after opening the position. That isn't boilerplate. At 50% initial and 48% maintenance, a fully-committed account has no buffer at all, and the first tick against you starts eating the two points of room you have.

Trade pre-launch markets as a cash-backed directional bet, not a leveraged one. The leverage is nearly notional.

## **What does it cost to trade a pre-launch market?**

Three costs, and the third is the one that matters most.

  - **Taker fee: 25 bps.** Charged on notional when you cross the spread. That is five times the taker fee on a standard perp, on a book that is thinner to begin with.
  - **Maker fee: −10 bps.** Not a discount, a rebate. Post a resting order that gets filled and you are paid 10 bps for it. On a wide, thin book this is the difference between a 25 bps cost and a 10 bps credit — a 35 bps swing on every fill, decided purely by whether you cross the spread or wait.
  - **Liquidation fee: 5%.** This is the number to sit with. It is ten times the 0.5% liquidation fee on [Aevo OTC](https://otc.aevo.xyz/trade), and it applies to a market where the liquidation corridor is a few percent wide.

Put those two facts side by side. Liquidation is unusually easy to trigger here, and unusually expensive when it triggers. That combination is the single strongest argument for the sizing approach in the next section: getting liquidated on a pre-launch position doesn't just close the trade, it takes a further bite on the way out.

There is no funding cost, which is covered below, so a position held for weeks costs you nothing to carry beyond the fees on entry and exit.

## **Why can't I use a market order?**

Because Aevo has removed the fastest way to lose money on a thin book.

**Market orders cannot be posted on pre-launch futures from the Aevo website.** They can be submitted via the API, but the 25 bps taker fee applies and you should think hard before doing it. For the same reason, **the "Close Position" button is unavailable** on pre-launch positions.

This catches people, usually at the worst moment. You want out, you reach for the button you use on every other market, and it isn't there. The exit is a limit order on the opposite side, and you need to know that before you need it rather than during.

Read the restriction as information rather than an obstacle. On a market with no index price and a book that can be a few orders deep, a market order doesn't get you the price on screen — it gets you the average of everything it sweeps, plus 25 bps. The interface is telling you that crossing the spread here is a decision worth making deliberately, not a reflex.

The corollary is that **posting is the default execution style on these markets**, not the sophisticated one. You are paid 10 bps to do it, the spread is wide enough that patience is usually rewarded, and there is no funding clock forcing you to hurry.

## **How should I size a pre-launch position?**

Backwards from the liquidation price, not forwards from the leverage.

Worked example on a 20,000 USDC account:

  - You want exposure to an unlisted token and you're willing to lose 2,000 USDC on the idea.
  - At 2x, a 4,000 USDC position needs 2,000 USDC of initial margin — and a few percent against you takes all of it.
  - So the position that risks 2,000 USDC is not a 4,000 USDC position sized to your loss tolerance. It is a 4,000 USDC position you should expect to lose in full on a modest adverse move, because there is no room to be wrong and recover.

The practical version: assume any pre-launch position can go to zero on a move that would barely register on BTC perps, size it as though it will, and don't post margin you would need for anything else. Adding margin after entry widens the corridor, and on these markets that is a normal thing to do rather than a sign you've made a mistake.

A useful discipline is to decide your top-up in advance. If you know before entry that you'll add 1,000 USDC of margin if the position moves 2% against you, you're making that decision calmly rather than at the moment the liquidation warning appears. On a market this tight, the difference between a planned top-up and a panicked one is most of the outcome.

## **Why is my position size capped at 50,000 USDC?**

Same reason as the margin: no index, no depth, no way to unwind a large position cleanly if it goes wrong.

50,000 USDC is the ceiling per position, and it applies to everyone. There is no tier that lifts it, no amount of staking that raises it, and no OTC route around it inside the pre-launch market itself. The value is subject to change, but not on request. If you want size on an unlisted asset, the pre-launch book is not the instrument.

For most traders the cap is not the constraint. It's the 2x leverage that limits what the position can actually do.

## **What happens if the token launches at a different supply?**

The market is rebased, and your position size and the quoted price both change while your exposure stays exactly the same.

This is the mechanic most traders don't know exists until they see it. It follows directly from what a pre-launch market actually prices — a valuation, not a unit price.

A pre-launch market opens with an **expected total supply**. Traders bid the contract on that basis: a price of 1.00 against an expected 1 billion supply is the market saying it expects a 1 billion FDV. Occasionally a team then launches at an **actual total supply** that differs from what everyone assumed. Without intervention, the pre-launch price and the real launch price would be wildly apart — not because anyone was wrong about the project, but because the denominator changed.

Aevo's answer is to rebase the market to match the actual launch supply.

### **The worked example**

Take an imaginary $COIN. Its pre-launch market lists with an expected 1 billion total supply, and it trades at $1.00 on Aevo. Traders are pricing a 1 billion FDV.

$COIN's team then launches at 10 billion total supply instead. Aevo rebases. The steps:

1.  **Aevo announces the rebase date in advance**, with a banner in the app and on social media. This is not a surprise event.
2.  **The market pauses trading for 30 minutes.** Users' resting limit orders are cancelled. If you rely on standing orders, they will not be there afterwards.
3.  **The market is rebased.** Alice holds 10 contracts of $COIN worth $10 at $1.00 each. Her position becomes **100 contracts** and the mark price is divided by ten, to **$0.10**. Her notional position is unchanged at $10.
4.  **Trading resumes.**

The rebase is notional-neutral. It changes the denomination, not your exposure, not your PnL, and not your risk.

### **What to actually do about it**

Three practical points.

  - **Don't panic at the price.** A mark price that has fallen 90% overnight after an announced rebase has not moved against you. Check your notional, not the number on the chart.
  - **Your resting orders are gone.** They're cancelled as part of the process, and your old price levels are meaningless at the new denomination anyway. Re-place them deliberately, at levels recalculated for the new supply.
  - **Anything keyed to a price level needs rewriting.** A mental stop at 0.85 on the old denomination is 0.085 on the new one. If you think in price levels rather than in percentage moves, a rebase is the moment that habit costs you.

Worth stating plainly, because it's the one thing a rebase genuinely does change: your **entry price in unit terms is now a different number**, and any thesis you built on "I'm in at a dollar" has to be restated as a valuation. That was always what you were trading. The rebase just makes it explicit.

## **Is there funding on pre-launch futures?**

No.

Funding exists to tether a perpetual contract to spot. Longs pay shorts when the contract trades above the index, shorts pay longs when it trades below, and the payment pressures the price back into line.

With no index, there's nothing to tether to, so funding is switched off entirely. You pay nothing to hold a pre-launch position overnight, in either direction, for as long as the market stays pre-launch.

This changes the shape of the trade. On ETH perpetual futures, a long held through a heavy positive-funding stretch bleeds. Here it doesn't. A pre-launch short and a pre-launch long cost exactly the same to carry, which is nothing. The only cost is trading fees and the opportunity cost of the margin you've locked up.

That opportunity cost is real, and worth pricing. 5,000 USDC of margin held against a pre-launch position for two months is 5,000 USDC not backing a hedged perps position, not counting towards a staking tier, and not earning anything. On a zero-funding market the carry is not zero, it's just not charged as funding.

That "as long as it stays pre-launch" is doing real work in the sentence above. See the next section.

## **What happens when the token actually launches?**

The market converts into a standard perpetual future, and several things change at once.

Conversion happens when a reliable source for the index price can be anchored. In practice that means a tier 1 centralised exchange listing, or a decentralised pool deep enough to price against. Aevo has run this process before, converting pre-launch markets into standard perpetual futures once the spot market existed.

What happens to your position:

  - **Your position is untouched.** Same size, same entry, same direction. Nothing is force-closed and nothing is re-priced at conversion.
  - **Your resting orders remain valid.** Unlike a rebase, a conversion doesn't cancel your book. Anything you have working stays working.
  - **Maintenance margin drops from 48% to 3%.** Your liquidation price moves a long way further from you. If you were sitting close to liquidation, you're suddenly not.
  - **An index price starts applying.** Mark price stops being purely book-driven and starts anchoring to external spot.
  - **Funding starts.** From listing onwards you pay or receive funding every interval, like any other perp, so that mark converges on index.

The margin change is the pleasant surprise. The funding change is the one to plan for. A position that cost nothing to carry for weeks can start costing meaningfully the moment the token lists, and a new listing is exactly when funding tends to run hot in one direction.

There's a second-order effect worth anticipating. Before conversion, the book price is the only price. After conversion, an external index appears and mark price starts anchoring to it — and the two are not guaranteed to be close. If the pre-launch book has drifted away from where the token actually opens, the reconciliation happens on the day, on your position. Being right about direction and wrong about the gap is a real way to lose money on a conversion.

Conversion timing follows the listing rather than a published schedule, so treat it as something that happens *to* your position rather than something you can diary. If you're holding into a listing, decide in advance whether you want the position after conversion. It becomes a different trade with a different cost structure on the same day.

## **Does pre-launch volume count towards rewards?**

Towards the weekly trading epoch, yes. Towards the year-end Mega Reward distribution, no.

The 10M qualifying volume requirement for the year-end USDC distribution counts perps and options, with pre-launch markets explicitly excluded. If you're working towards that threshold, volume done on pre-launch books doesn't move you closer to it.

The 2x leverage cap makes this a practical point rather than a technical one. Building qualifying volume needs turnover, and turnover needs leverage. Pre-launch markets are the wrong tool for that job twice over.

Staking-based trading fee discounts don't reach these markets either. Stakers get up to 20% off trading fees by tier, but the discount explicitly excludes options and pre-launch market fees. The 25 bps taker fee is the 25 bps taker fee whatever your tier — which makes the 10 bps maker rebate the only fee lever you actually have here.

Full rules on qualifying volume are in the [Treasury LP Revenue Distribution docs](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution), and your running total is on the [Mega Reward leaderboard](https://app.aevo.xyz/leaderboard).

## **Pre-launch futures against standard perps**

Side by side, so the gap is obvious:

|  |  |  |
| :-: | :-: | :-: |
|   | **Pre-launch future** | **BTC / ETH perpetual futures** |
| Max leverage | 2x | Up to 20x |
| Initial margin | 50% | 5% |
| Maintenance margin | 48% | 3% |
| Liquidation corridor | Low single-digit % | Tens of % at moderate leverage |
| Taker fee | 25 bps | 0.08% |
| Maker fee | −10 bps rebate | 0.05% |
| Liquidation fee | 5% | Standard |
| Index price | None | External spot index |
| Funding | None | Charged each interval |
| Market orders on web | Not available | Available |
| Supply rebase possible | Yes | No |
| Max position | 50,000 USDC | Standard limits |
| Options hedge available | No | Yes, including one-tap PERPS+ |
| Staking fee discount applies | No | Yes |
| Counts to Mega Reward volume | No | Yes |

The two instruments share a name and almost nothing else. Treat a pre-launch market as a fully-funded directional position on an unlisted asset, and the specification stops looking strange.

## **Can I hedge a pre-launch position?**

Not directly, and it's worth being clear about why.

Hedging a perp with an option needs an options market on the same underlying. There isn't one, because the token doesn't exist yet. The one-tap downside protection available on ETH and BTC perps has nothing to attach to here.

What you can do is manage the rest of the book around it. Pre-launch positions sit in the same cross-margin account as your perps and options, so an unrealised loss on a pre-launch market draws on the collateral supporting everything else. If you're running hedged positions elsewhere and a pre-launch trade goes against you, the damage is not contained to that market. Size accordingly.

The inverse is also true and easier to miss: a bad day on your ETH perps can pull collateral away from a pre-launch position that was fine on its own, and on a two-point margin corridor that's enough to liquidate it. Cross margin hedging works in your favour on correlated positions. On a pre-launch market, which correlates with nothing, it mostly just shares the pain.

## **Before you open a pre-launch position**

Seven things, all of which take less time than the trade will.

  - **Size it as cash, not as leverage.** 2x with a low single-digit liquidation corridor is a cash position wearing a perp's clothing.
  - **Never commit the whole balance.** The documentation warns about this explicitly, and the warning is arithmetic rather than caution.
  - **Read the liquidation price on screen.** Don't infer it from the margin percentages. The interface has the number.
  - **Plan your exit before you need it.** There's no Close Position button and no web market order. You leave with a limit order, and you should know that in advance.
  - **Post, don't cross.** The maker side pays 10 bps. On a wide book with no funding clock, patience is the highest-return habit available on these markets.
  - **Know the listing timeline if there is one.** Conversion changes your funding costs and your liquidation price on the same day, and a rebase can change your contract count before that.
  - **Check what the book actually looks like.** With no index and no arbitrage channel, the depth on screen is the whole story.

Pre-launch markets are at [app.aevo.xyz](https://app.aevo.xyz), and the full specification lives in the [pre-launch token futures docs](https://docs.aevo.xyz/aevo-products/aevo-exchange/trading-on-aevo/pre-launch-token-futures).

## **Related reading**

  - *Aevo trading strategies: from one-tap protection to multi-leg structures* — how perps, options and cross margin combine in one account
  - *Aevo staking explained: tiers, epochs, the lottery and every reward* — including which volume qualifies for the year-end distribution
  - *Aevo OTC: trade altcoin options on-chain, at size* — for positions the order book can't absorb
  - *The Aevo MCP: give your AI agent a trading desk* — the market whose specification an agent needs told explicitly
