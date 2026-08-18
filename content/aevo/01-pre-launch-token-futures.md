# **Pre-launch token futures: trade a token before it lists**

**Aevo's pre-launch markets let you take a position on an unlisted token, with 2x leverage, no funding rate and a hard cap on size. Here's exactly how they behave, and what changes the day the token goes live.**

**TL;DR**

**•**  Pre-launch token futures are markets on tokens that haven't launched yet. You trade the price, not the token, and you never take delivery.

**•**  Leverage is capped at 2x. Initial margin is 0.5x, so half the notional sits behind every position.

**•**  Maintenance margin is 48%, an order of magnitude wider than the 3% on a standard perp. This is deliberate.

**•**  There is no index price. Nothing external exists to price against, so mark price comes off the order book itself.

**•**  There is no funding rate. Funding needs an index to pull the contract towards, so until one exists there's nothing to pay or receive.

**•**  Maximum position size is capped at 50,000 USDC. Everyone is on the same cap.

**•**  When a reliable index appears, usually a tier 1 CEX listing or a deep DEX pool, the market converts into a standard perpetual future.

**•**  Conversion doesn't touch your position. Your size and entry carry over. What changes is that maintenance margin drops from 48% to 3%, and funding starts.

**•**  Pre-launch volume is excluded from the 10M qualifying volume for the year-end Mega Reward distribution. Perps and options count; pre-launch does not.

Pre-launch markets are the strangest instrument Aevo lists, and the one most often traded without reading the specification first. That's an expensive habit. The margin rules are not the rules you're used to, and the day the underlying token lists, the rules change underneath you while you hold the position.

Everything below is the mechanics. Nothing here is a view on any particular token.

## **What is a pre-launch token future?**

A perpetual future on a token that does not yet trade anywhere.

A project has announced a token. There's a ticker, a supply schedule, maybe a points programme. There is no spot market, no exchange listing, and no price. Aevo lists a market anyway, and the price is whatever buyers and sellers agree it is.

You're trading a claim on where that token opens, settled in USDC. Long if you think the market is under-pricing it, short if you think the airdrop farmers are about to hit the bid on day one. You never hold the token, and you never need a wallet that can receive it.

The contract is perpetual, so there's no expiry to trade around. It runs until the token lists and the market converts, which is covered further down.

## **How is a pre-launch future priced without an index?**

It isn't. That's the whole point, and it's the source of every other difference in the specification.

A standard perp on Aevo has an index price assembled from external spot venues. Mark price is anchored to that index, funding pulls the contract back towards it, and liquidations reference it. The index is the gravity in the system.

A pre-launch market has no external spot venue to build an index from, because the token doesn't trade anywhere. So mark price comes off the order book itself, and the contract prices purely on what participants will pay.

Two consequences worth internalising before you size a position:

  - **Price discovery is thin and it moves.** There's no arbitrage channel to a spot market, because there's no spot market. A large order moves the price and nothing external drags it back.
  - **There is no "wrong" price to arbitrage against.** On a BTC perp, a contract trading 3% above spot is a trade. Here, there is no spot. The order book is the price.

## **What leverage can I use on pre-launch markets?**

2x, and only 2x.

| | |
|:-:|:-:|
| **Parameter** | **Pre-launch value** |
| Initial margin | 0.5x (50% of notional) |
| Maximum leverage | 2x |
| Maintenance margin | 0.48 (48%) |
| Index price | None |
| Funding payments | None |
| Max position size | 50,000 USDC |

Initial margin of 0.5x means opening a 10,000 USDC position requires 5,000 USDC of margin. Compare that with a BTC perpetual future on Aevo, where 5% initial margin gets you up to 20x.

The 48% maintenance margin is the number people miss. On a BTC perp, maintenance margin is 3%, so there's a wide corridor between the margin you post and the level where you get liquidated. Here the corridor is 2%. You post 50% and you're liquidated at 48%.

That is not a mistake in the specification. With no index and no external reference, the exchange has no way to price the risk of a gap. So it doesn't try. It holds enough margin against the position that a gap can't leave the book with bad debt, and it accepts that the trade-off is a very tight liquidation band.

Trade pre-launch markets as a cash-backed directional bet, not a leveraged one. The leverage is nearly notional.

## **Why is my position size capped at 50,000 USDC?**

Same reason as the margin: no index, no depth, no way to unwind a large position cleanly if it goes wrong.

50,000 USDC is the ceiling per position, and it applies to everyone. There is no tier that lifts it, no amount of staking that raises it, and no OTC route around it inside the pre-launch market itself. If you want size on an unlisted asset, the pre-launch book is not the instrument.

For most traders the cap is not the constraint. It's the 2x leverage that limits what the position can actually do.

## **Is there funding on pre-launch futures?**

No.

Funding exists to tether a perpetual contract to spot. Longs pay shorts when the contract trades above the index, shorts pay longs when it trades below, and the payment pressures the price back into line.

With no index, there's nothing to tether to, so funding is switched off entirely. You pay nothing to hold a pre-launch position overnight, in either direction, for as long as the market stays pre-launch.

This changes the shape of the trade. On a normal perp, a long held through a heavy positive-funding stretch bleeds. Here it doesn't. A pre-launch short and a pre-launch long cost exactly the same to carry, which is nothing. The only cost is trading fees and the opportunity cost of the margin you've locked up.

That "as long as it stays pre-launch" is doing real work in that sentence. See the next section.

## **What happens when the token actually launches?**

The market converts into a standard perpetual future, and three things change at once.

Conversion happens when a reliable source for the index price can be anchored. In practice that means a tier 1 centralised exchange listing, or a decentralised pool deep enough to price against. Aevo has run this process before, converting pre-launch markets like SEI into standard perpetual futures once the spot market existed.

What happens to your position:

  - **Your position is untouched.** Same size, same entry, same direction. Nothing is force-closed and nothing is re-priced at conversion.
  - **Maintenance margin drops from 48% to 3%.** Your liquidation price moves a long way further from you. If you were sitting close to liquidation, you're suddenly not.
  - **An index price starts applying.** Mark price stops being purely book-driven and starts anchoring to external spot.
  - **Funding starts.** From listing onwards you pay or receive funding every interval, like any other perp.

The margin change is the pleasant surprise. The funding change is the one to plan for. A position that cost nothing to carry for weeks can start costing meaningfully the moment the token lists, and a new listing is exactly when funding tends to run hot in one direction.

If you're holding into a listing, decide in advance whether you want the position after conversion. It becomes a different trade with a different cost structure on the same day.

## **Does pre-launch volume count towards rewards?**

Towards the weekly trading epoch, yes. Towards the year-end Mega Reward distribution, no.

The 10M qualifying volume requirement for the year-end USDC distribution counts perps and options, with pre-launch markets explicitly excluded. If you're working towards that threshold, volume done on pre-launch books doesn't move you closer to it.

The 2x leverage cap makes this a practical point rather than a technical one. Building qualifying volume needs turnover, and turnover needs leverage. Pre-launch markets are the wrong tool for that job twice over.

Full rules on qualifying volume are in the [Treasury LP Revenue Distribution docs](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution), and your running total is on the [Mega Reward leaderboard](https://app.aevo.xyz/leaderboard).

## **Pre-launch futures against standard perps**

Side by side, so the gap is obvious:

| | | |
|:-:|:-:|:-:|
| | **Pre-launch future** | **BTC / ETH perpetual future** |
| Max leverage | 2x | Up to 20x |
| Initial margin | 50% | 5% |
| Maintenance margin | 48% | 3% |
| Index price | None | External spot index |
| Funding | None | Charged each interval |
| Max position | 50,000 USDC | Standard limits |
| Counts to Mega Reward volume | No | Yes |

The two instruments share a name and almost nothing else. Treat a pre-launch market as a fully-funded directional position on an unlisted asset, and the specification stops looking strange.

## **Before you open a pre-launch position**

Four things, all of which take less time than the trade will.

  - **Size it as cash, not as leverage.** 2x with a 2% liquidation corridor is a cash position wearing a perp's clothing.
  - **Know the listing timeline if there is one.** Conversion changes your funding costs and your liquidation price on the same day.
  - **Don't count on the 50,000 cap moving.** If the trade only works at larger size, it doesn't work here.
  - **Check what the book actually looks like.** With no index and no arbitrage channel, the depth on screen is the whole story.

Pre-launch markets are at [app.aevo.xyz](https://app.aevo.xyz), and the full specification lives in the [pre-launch token futures docs](https://docs.aevo.xyz/aevo-products/aevo-exchange/trading-on-aevo/pre-launch-token-futures).
