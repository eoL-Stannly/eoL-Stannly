# Aevo PERPS+ Explained: One-Tap Downside Protection on BTC and ETH Perps

> **Source post:** https://x.com/aevoxyz/status/2036035408430084283 — posted 23 March 2026, 11:00 UTC
> **Rewrite pass:** v2 · **Non-Commodity Score:** 78/100 · **Class:** Non-commodity

---

## The answer, up front

PERPS+ attaches an options structure to a perpetual futures position at the moment you
open it. You pick one of three modes, set one level, and Aevo executes both legs together.
There are no strikes to choose and no expiries to roll. It launched on Aevo's BTC and ETH
perp markets in March 2026. Underneath, the three modes are a protective put, a covered
call and a collar — repackaged so that a perp trader never has to learn those words.

---

## What PERPS+ is

PERPS+ is a perpetual futures order with a risk structure bolted on at entry.

A normal perp position has unlimited upside and unlimited downside, bounded only by
liquidation. PERPS+ changes that shape. It gives the position a floor, a ceiling, or both,
selected before the trade is placed. **[P]**

The execution is combined. The trader picks a mode, sets the level, and Aevo executes the
perp and its protection as one position. **[P]**

## The three modes, and what each one actually is

| PERPS+ mode | Payoff shape | Traditional equivalent | You pay or receive |
|-------------|--------------|------------------------|--------------------|
| Limit My Loss | Floor on losses, uncapped upside | Protective put | Pay a premium |
| Get Paid to Hold | Full downside, capped upside, cash today | Covered call | Receive a premium |
| Lock My Range | Floor and ceiling both fixed | Collar (near zero-cost) | Roughly net zero |

### Limit My Loss

Your maximum loss is defined at entry. Your upside stays completely uncapped. You pay a
premium for that asymmetry. **[P]**

This is a protective put: long the underlying, long a put beneath it. The classic critique
applies — protection is real, and paying for it repeatedly is a drag on returns. **[S]**

**Worked example.** Long 1 BTC perp at $100,000, floor set at $90,000, premium $2,500.

| BTC settles at | Unprotected perp P&L | Limit My Loss P&L |
|----------------|---------------------|-------------------|
| $70,000 | −$30,000 | −$12,500 |
| $90,000 | −$10,000 | −$12,500 |
| $100,000 | $0 | −$2,500 |
| $120,000 | +$20,000 | +$17,500 |

Read the $90,000 row carefully. Protection costs you money in the mild-loss zone. It saves
you in the tail. That trade-off is the entire product.

### Get Paid to Hold

You receive a guaranteed premium upfront. In exchange, your profit is capped at a defined
ceiling. Downside remains open. **[P]**

This is a covered call. You are selling the right to your upside above a level, and being
paid today for it.

**Worked example.** Long 1 BTC perp at $100,000, ceiling at $115,000, premium received
$3,000.

| BTC settles at | Unprotected perp P&L | Get Paid to Hold P&L |
|----------------|---------------------|----------------------|
| $70,000 | −$30,000 | −$27,000 |
| $100,000 | $0 | +$3,000 |
| $115,000 | +$15,000 | +$18,000 |
| $140,000 | +$40,000 | +$18,000 |

The $140,000 row is the cost. You gave up $22,000 to be paid $3,000 with certainty. Use
this mode when you expect range, not trend.

### Lock My Range

Both loss and profit are capped. The risk-to-reward ratio is fully defined at entry, for
close to zero upfront cost. **[P]**

This is a collar. The call you sell finances the put you buy. Fidelity's own strategy
guide describes the mechanic plainly: selling the call limits upside profit potential
while the protective put reduces downside risk, and the call premium pays for the put.
**[S]**

**Worked example.** Long 1 BTC perp at $100,000, floor $92,000, ceiling $112,000, net cost
approximately $0.

| BTC settles at | Unprotected perp P&L | Lock My Range P&L |
|----------------|---------------------|-------------------|
| $70,000 | −$30,000 | −$8,000 |
| $92,000 | −$8,000 | −$8,000 |
| $112,000 | +$12,000 | +$12,000 |
| $150,000 | +$50,000 | +$12,000 |

Note that all example figures are illustrative. Real premiums depend on implied volatility,
the level you set, and the tenor Aevo prices against. Check the live ticket before sizing.

## Which mode to use, and when

| Your view | Mode | Why |
|-----------|------|-----|
| Directional, high conviction, scared of a wick | Limit My Loss | Keeps the whole upside, buys out the tail |
| Sideways or slow grind, want income | Get Paid to Hold | Converts stagnant exposure into cash today |
| Want a defined R:R, no premium bill | Lock My Range | Fixed ratio at roughly zero net cost |
| No view, just leverage | None of them | PERPS+ is a risk tool, not an alpha tool |

## Why this matters: the numbers behind the problem

PERPS+ exists because perp traders lose money in a specific, measurable way.

- Research across asset classes places the share of day traders who lose money over time
  at somewhere between **70% and 97%**. **[S]**
- Platforms offer **50x to over 100x** leverage on perpetual futures. At 100x, a 1% adverse
  move wipes the position. **[S]**
- On **10 October 2025**, more than **$19 billion** in leveraged crypto positions were
  liquidated inside 24 hours across roughly **1.62 million accounts** — the largest
  single-day liquidation event on record. **[S]**
- Derivatives make up roughly **82%** of all crypto trading volume, with futures and perps
  contributing about **$62 trillion** of the **$79 trillion-plus** in 2025 exchange volume.
  **[S]**

Now hold that against the options side.

- On-chain options traded at roughly **0.2% of on-chain perpetual futures volume** as of
  March 2026. **[S]**
- Deribit, a centralised venue, held about **49.3%** of the total crypto options market in
  H1 2026 on **$425.9 billion** of a **$864.6 billion** BTC/ETH options market. **[S]**
- Deribit's monthly share of combined BTC and ETH options fell from **56.3% in January
  2026 to 41.8% in June 2026**. **[S]**

The reading is straightforward. The instrument that solves the liquidation problem exists.
Almost nobody on-chain uses it. Deribit's grip is loosening at the same time.

PERPS+ is a distribution bet on closing that gap from the perp side rather than the options
side.

## How PERPS+ fits the rest of Aevo

Aevo runs options, perps and structured products inside one cross-margin account, so the
protection leg and the perp leg share collateral rather than fragmenting it. **[P]** Aevo
runs on its own L2, a custom Ethereum rollup on the OP Stack supporting over 5,000
transactions per second. **[P]**

Aevo also paid people to try it. Rewards Epoch 17, live from around 30 March 2026,
allocated **300,000 AEVO** of a **1,000,000 AEVO** weekly pool to PERPS+ users, with
additional USDC bonuses of **$750** for ranks 1–3 and **$400** for ranks 4–10 among
top-volume PERPS+ traders. **[S]**

## What PERPS+ does not do

Be clear about the limits.

- It does not remove liquidation risk from the perp leg entirely. It bounds your loss
  through the options structure; margin mechanics still apply. Read Aevo's margin
  framework before assuming otherwise. **[P]**
- It is not free. Limit My Loss costs premium every time. Get Paid to Hold costs you the
  tail. Lock My Range costs you the trend.
- It launched on BTC and ETH only. **[S]**
- It does not make a bad directional call good.

## Frequently asked questions

### What is PERPS+ on Aevo?
PERPS+ is a feature that adds options-based protection to a perpetual futures position at
entry. You choose one of three modes and set one level; Aevo executes the perp and the
protection together as a single position.

### Do I need to know how options work to use PERPS+?
No. There is no strike selection and no expiry management. You set a protection level in
price terms. Aevo constructs the options leg.

### What are the three PERPS+ modes?
Limit My Loss caps your maximum loss and keeps upside open. Get Paid to Hold pays you a
premium upfront in exchange for a profit ceiling. Lock My Range fixes both a floor and a
ceiling for close to zero net cost.

### Which mode is cheapest?
Lock My Range, in cash terms — it is designed for approximately zero net cost, because the
premium you receive from the ceiling pays for the floor. It is not free in economic terms;
you pay with your upside.

### Which markets support PERPS+?
BTC and ETH perpetual futures at launch.

### Is PERPS+ the same as a stop-loss?
No, and the difference matters. A stop-loss is an order that fires at a price and can slip
or fail to fill in a fast market. A PERPS+ floor is an options structure priced at entry.
You pay for it upfront rather than hoping for a fill.

### Is PERPS+ available on mobile?
Yes. PERPS+ launched on web first, then reached mobile in late July 2026, bringing Aevo's
mobile app to feature parity with desktop. **[S]**

### What does PERPS+ cost?
It depends on the mode. Limit My Loss charges a premium. Get Paid to Hold pays you one.
Lock My Range targets roughly net zero. Actual pricing moves with implied volatility and
the level you set, so the ticket is the only accurate quote.

### How is PERPS+ different from Deribit options?
Deribit gives you the full options chain: strikes, expiries, greeks, spreads. PERPS+ gives
you three preset structures and one input. Deribit is the professional tool. PERPS+ is the
tool for someone who was never going to open Deribit.

### Can I use PERPS+ to run a delta-neutral position?
PERPS+ shapes the payoff of a directional perp position; it is not a market-neutral
product. For delta-neutral exposure Aevo added a different route in August 2026, listing
six Ondo tokenized equities — NVDAon, TSLAon, SPYon, QQQon, HOODon and GOOGLon — alongside
matching perpetual contracts, so a trader can hold the tokenized stock and short its perp
from the same account. **[S]**

---

## Editorial scorecard

| Dimension | Max | v1 | v2 | Notes |
|-----------|-----|----|----|-------|
| Information gain | 25 | 17 | 21 | Worked payoff tables and the options-equivalence mapping do not appear in the competing set |
| First-hand evidence | 20 | 5 | 7 | Examples are illustrative, not real fills |
| Verifiable specificity | 15 | 13 | 14 | Dated, sourced figures throughout |
| Decision utility | 15 | 12 | 15 | Mode-selection table plus three payoff tables |
| Entity and topical authority | 10 | 8 | 10 | Correct mapping to protective put / covered call / collar, cross-margin and L2 context |
| Freshness and date anchoring | 10 | 8 | 9 | Every market figure carries an as-of date |
| Distinct thesis | 5 | 3 | 2 | Thesis is strong but the on-chain-options-gap framing is now shared with article 1 |
| **Total** | **100** | **66** | **78** | **Non-commodity** |

### What is required to push this past 80

1. **Real premiums.** Open the PERPS+ ticket, screenshot the actual quoted cost for a
   $90,000 floor on 1 BTC at three different implied-volatility regimes. Replace the
   illustrative numbers.
2. **A held position.** Open one of each mode, hold to a real move, and publish the P&L
   against an unprotected control. Nobody else on the SERP has done this.
3. **An implied-volatility comparison.** Price the same structure on Deribit and on PERPS+
   and publish the spread. That single table would make the article citable.
4. **Confirm the tenor.** Publish exactly what expiry Aevo prices the protection leg
   against and how it rolls. This is the most-asked unanswered question in the topic.

### Where the current SERP is weak

The existing coverage is a press-wire cluster. Investing.com, DailyCoin, CryptoDaily,
Pluang, CaptainAltcoin and TheBitTimes all carry near-identical Chainwire copy. Not one of
them shows a payoff table. Not one maps the modes to their traditional-options equivalents.
Not one prices anything. That is a wide, shallow SERP — the easiest kind to displace with
depth.

---

## Sources

- Aevo Documentation, PERPS+ and options made easy — https://www.aevo.xyz/docs/aevo-products/aevo-perps+/options-made-easy
- Aevo Documentation, margin framework — https://docs.aevo.xyz/aevo-products/aevo-exchange/technical-architecture/margin-framework
- CryptoSlate, on-chain options and the perp market — https://cryptoslate.com/on-chain-options-close-in-on-cryptos-21b-a-day-perp-market-to-deepen-liquidity-everywhere/
- CoinLaw, crypto options market statistics 2026 — https://coinlaw.io/options-market-in-crypto-statistics/
- The Cryptonomist, Deribit and Bybit market split — https://en.cryptonomist.ch/2026/08/04/crypto-options-market-dynamics/
- Crypto Briefing, US day traders and perpetual futures — https://cryptobriefing.com/us-day-traders-crypto-perpetual-futures/
- MetaMask, perpetual futures liquidation mechanics — https://metamask.io/news/perpetual-futures-liquidation-mechanics
- Fidelity, collar strategy guide — https://www.fidelity.com/learning-center/investment-products/options/options-strategy-guide/collar
- Charles Schwab, options collars — https://www.schwab.com/learn/story/what-are-options-collars
- FinanceFeeds, Ondo tokenized stocks on Aevo — https://financefeeds.com/ondo-finance-lands-on-aevo/
