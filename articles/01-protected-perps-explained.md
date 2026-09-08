---
title: "Protected Perps: How Options Cap the Downside on a Perpetual Futures Position"
slug: protected-perps-explained
primary_query: "protected perps"
secondary_queries:
  - "perpetual futures downside protection"
  - "hedge a perp with options"
  - "perp protect vs perps+"
source_post: https://x.com/aevoxyz/status/2029965683056930907 (2026-03-06, content not retrievable — see source ledger)
version: 1
last_reviewed: 2026-09-08
---

# Protected Perps: How Options Cap the Downside on a Perpetual Futures Position

**A protected perp is a perpetual futures position with an option attached at entry, so
the maximum loss is fixed before the trade moves. The option is bought in the same action
as the perp, and the venue prices and executes both legs together. It removes liquidation
as the primary risk and replaces it with a known, upfront cost. Two venues currently ship
this as a single product: Bybit, as Perp Protect, and Aevo, as PERPS+.**

## The problem a protected perp is built for

Perpetual futures have no expiry. That is the feature. It is also why a perp position can
be closed by the exchange rather than by the trader.

Liquidation is not a rare event at market scale. On 10 October 2025, more than $19 billion
of leveraged perpetual positions were force-liquidated in a single day — the largest such
event on record. On 5 February 2026, Bitcoin positions saw roughly $1 billion of
liquidations in 24 hours. Those numbers sit against a market where the top ten perpetuals
venues processed $92.9 trillion of volume in 2025, up 64.6% year on year.

A stop-loss does not solve this. A stop is an instruction to sell, and it needs a bid to
sell into. In the kind of move that produces a $19 billion liquidation day, that bid
moves faster than the order does.

An option solves it differently. A put is a contract, not an instruction. It pays out
whether or not the book is liquid.

## How a protected perp is constructed

Three structures cover almost every protected perp product on the market. All three are
standard options positions. The product is the packaging, not the maths.

### Protective put — capped loss, open upside

Buy a put alongside a long perp. Below the strike, the put gains what the perp loses. The
maximum loss is fixed at entry. Upside is untouched.

The cost is the put premium. It is paid whether or not the market falls. This is
insurance, and it prices like insurance.

Aevo ships this as **Limit My Loss**, which the company describes as defining the maximum
loss at entry, with the downside capped and the upside remaining fully open.

### Covered call — premium now, ceiling later

Sell a call against a long perp. The premium arrives immediately. In exchange, gains above
the strike belong to the call buyer.

This does not protect against a crash. It offsets a small part of one. It is a yield
structure that people frequently mistake for a hedge.

Aevo ships this as **Get Paid to Hold**: an upfront premium in exchange for a defined
profit ceiling.

### Collar — floor and ceiling, near-zero net cost

Buy the put and sell the call together. The call premium pays for the put. Set the strikes
correctly and the net cost approaches zero.

The trade-off is explicit and often misdescribed. As dYdX's own explainer puts it, the
cleanest way to understand a zero-cost collar is to stop thinking about it as free
protection. It is not free. You are swapping one type of exposure for another — giving up
part of the upside in exchange for downside insurance.

Aevo ships this as **Lock My Range**: a floor and a ceiling for approximately zero net
cost.

## What the packaging actually changes

Nothing in the three structures above is new. A trader could build any of them manually on
Deribit in 2020.

What changes is the number of decisions. Building a collar by hand requires selecting an
expiry, two strikes, two sizes, and a venue, then managing margin across two positions.
That is five decisions plus ongoing maintenance, before the directional view is expressed.

Variant Fund's research on onchain options markets identifies this directly: options
provide more granularity through long/short, time and strike components, and that
granularity requires more decisions than retail users will make. The same research points
to 0DTE options in traditional finance as the counter-example — their success is largely
explained by improved UX, specifically removing or simplifying the time dimension.

A protected perp applies the same compression. The trader picks a direction and a
protection level. The venue picks the strike, the expiry, the size and the pricing.

## Comparing the two live implementations

| | Bybit Perp Protect | Aevo PERPS+ |
|---|---|---|
| Venue type | Centralised | Decentralised, custom OP Stack L2 |
| Mechanism | Programmatically acquires a put against longs, a call against shorts | Structures, prices and executes the combined position at entry |
| Structures offered | Protection plans driven by algorithm | Three named modes: Limit My Loss, Get Paid to Hold, Lock My Range |
| Stated cost | Starts near 2% of initial margin | Varies by mode; Lock My Range targets approximately zero net cost |
| Markets | Selected perpetual contracts | BTC and ETH perpetual futures |
| Availability | Per Bybit's jurisdiction rules | Aevo states the app is not available to U.S. or U.K. persons |

The 2% figure is the most useful benchmark in this table, because it converts an abstract
product into a hurdle rate. If protection costs 2% of initial margin, the position needs
to move enough to clear 2% before protection is free. Anyone evaluating a protected perp
should price the alternative — buying the put directly — against it.

## The cost that the marketing usually omits

A protected perp has two costs, not one.

The first is the option premium. It is visible, quoted at entry, and easy to reason about.

The second is funding. Perpetual funding is exchanged roughly every eight hours, and it
accrues for as long as the perp is open. Over a multi-day hold, cumulative funding
frequently exceeds the option premium. Kraken's own hedging guide makes the point that
funding determines whether a multi-day hedge is economically sensible at all, or whether
carry exceeds the drawdown being protected against.

Protection caps the loss on the price leg. It does not cap the funding leg.

## Who this is and is not for

It suits a trader who already intends to open a perp and wants the downside bounded
without learning options. It suits a holder who wants defined-outcome exposure without
committing to a fixed vault term.

It does not suit someone whose real objective is the option itself. If the view is on
volatility rather than direction, buying the option outright gives more control and
usually costs less.

## FAQs

### Is a protected perp the same as a stop-loss?

No. A stop-loss is an order to sell at a price and requires liquidity to fill. An option
is a contract that pays out regardless of book depth. In a gap-down move, the stop fills
below its trigger and the option does not.

### Can a protected perp still be liquidated?

The option caps the loss on the position, but margin rules still apply, and funding still
accrues. Treat the maximum loss quoted at entry as applying to the price leg. Read the
venue's margin documentation for how the option leg is treated as collateral before
assuming liquidation is impossible.

### What does protection cost?

Bybit states Perp Protect plans start near 2% of initial margin. Aevo does not publish a
single figure, because cost varies by mode — Limit My Loss is paid for, Get Paid to Hold
pays the trader, and Lock My Range targets approximately zero net cost by financing the
put with a sold call.

### Is "zero-cost" protection actually free?

No. In a zero-cost collar the premium received from the sold call offsets the premium paid
for the put. Cash outlay approaches zero. The cost is the upside above the call strike,
which is surrendered.

### Which assets support protected perps on Aevo?

Aevo states PERPS+ is available on BTC and ETH perpetual futures.

### Why is this only appearing now?

Because the constraint was interface, not infrastructure. Crypto options trade roughly $2
billion per day, about 0.06% of a ~$3 trillion market — around ten times lower than
equities on a relative basis. Variant Fund describes retail adoption of crypto options as
"effectively zero." The instruments have existed for years. Products that let someone use
one without understanding it have not.

### Do I need to understand options to use one?

Not to place the trade — that is the explicit design goal. You do need to understand two
things to evaluate it: that a capped upside is a real cost, and that funding accrues
separately from the premium.

---

## Content grade

**Classification: Differentiated. Google would not class this as commodity content, but it
is copyable.**

| Dimension | Weight | Score | Reasoning |
|---|---|---|---|
| Information gain | 25 | 19 | The Bybit-vs-Aevo comparison table does not exist in the ranking set. Nothing currently ranking for "protected perps" compares the two implementations. The funding-cost section is absent from every competing page. |
| Primary evidence | 20 | 4 | No first-party data. No original testing. All figures are second-hand. This is the binding constraint. |
| Expertise and entity signals | 15 | 5 | No named author, no credentials, no disclosed relationship to Aevo. |
| Unanswered-question coverage | 15 | 13 | "Can a protected perp still be liquidated" and "is zero-cost actually free" are unanswered across the current SERP. |
| Verifiability | 15 | 11 | Every claim is traceable. Points deducted because several load-bearing figures sit at Tier C. |
| Structural extractability | 10 | 9 | AUF opening survives extraction. FAQ answers are self-contained. |
| **Total** | **100** | **61** | |

**Ceiling without new evidence: ~70.** Sharper writing and better sourcing cannot lift
dimension 2.

### What is required to make this non-commodity (75+)

1. **Price the trade.** Open a $1,000 BTC long on Aevo, apply each of the three modes,
   screenshot the quoted premium and the resulting payoff diagram, and publish the actual
   numbers. This single act is worth roughly 15 points and cannot be replicated by a
   competitor without an account.
2. **Compute the funding break-even.** Take the current BTC perp funding rate, compute
   how many days of carry equal the Limit My Loss premium, and publish the table. Nobody
   has done this.
3. **Verify the Bybit 2% figure** against Bybit's own documentation and, if it holds,
   quote it as a direct citation rather than an aggregator paraphrase.
4. **Attach a named author** with a verifiable trading or derivatives background.
5. **Add FAQPage and Article schema** so the FAQ block is machine-extractable.

Items 1 and 2 together move this from 61 to roughly 85. Items 3–5 are hygiene.
