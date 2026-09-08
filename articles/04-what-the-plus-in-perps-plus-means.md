---
title: "What the Plus in PERPS+ Means"
slug: what-the-plus-in-perps-plus-means
primary_query: "what is PERPS+"
secondary_queries:
  - "PERPS+ explained"
  - "Aevo PERPS+ modes"
  - "perps plus vs perps"
source_post: https://x.com/aevoxyz/status/2090842637179691210 (2026-08-21, content not retrievable — see source ledger)
version: 1
last_reviewed: 2026-09-08
---

# What the Plus in PERPS+ Means

**The plus is an option. PERPS+ is a perpetual futures position with an option leg
attached at entry, executed as one action. The option is what converts an
open-ended, liquidatable position into one with a boundary known before the trade moves.
Three modes exist — Limit My Loss, Get Paid to Hold, Lock My Range — and each is a
standard options structure with the strike and expiry selection removed.**

## The one-sentence version

A perp gives you exposure. The plus gives you a boundary.

Everything below is detail on what that boundary costs.

## Decoding the three modes

Each mode is an options position that has been around for decades. The naming is the
product; the structure is not new. Knowing which is which is the fastest way to evaluate
the trade.

### Limit My Loss = protective put

You are buying insurance. The maximum loss is fixed at entry. The upside stays fully open.

You pay a premium up front, and you pay it whether or not the market falls. This is the
only one of the three modes that is protection in the ordinary sense of the word.

### Get Paid to Hold = covered call

You are selling insurance to someone else. A premium lands immediately. In exchange, gains
above a strike belong to the buyer of the call.

This is the mode most likely to be misunderstood. It is a yield structure, not a hedge. It
reduces a loss by exactly the premium received and no more. If the position falls 40%, the
premium does not save it.

### Lock My Range = collar

You buy the put and sell the call together. The premium from the call pays for the put, so
the net cash cost approaches zero.

"Zero cost" is accurate about cash and misleading about cost. As dYdX's explainer puts it,
the cleanest way to understand a zero-cost collar is to stop thinking about it as free
protection — you are swapping one type of exposure for another, giving up part of your
upside in exchange for downside insurance.

## What was actually removed

Nothing in the three structures is novel. A trader could have built any of them on Deribit
years ago. What PERPS+ removes is the decision surface.

Building a collar manually requires selecting: an expiry, a put strike, a call strike, two
sizes, and a venue, then managing margin across two legs and monitoring decay alongside
funding.

Under PERPS+, Aevo states the trader selects the protection level, and Aevo handles the
structuring, pricing and execution in one tap, with no options knowledge required.

Two axes — strike and expiry — are gone. That is the entire product.

It is also a known-good mechanism. Variant Fund's analysis attributes the success of 0DTE
options in traditional finance largely to UX, specifically the removal or simplification
of the time dimension. And when Robinhood cut fees on complex multi-leg options to zero in
2018, complex options trades rose more than 75.4% relative to options on other stocks,
reaching nearly 20% of retail options trades by July 2022. Reduce friction on a multi-leg
structure and volume follows.

## The two costs, stated plainly

**The premium.** Visible, quoted at entry, mode-dependent. Limit My Loss charges it. Get
Paid to Hold pays it to you. Lock My Range nets it to approximately zero.

**The funding.** Perpetual funding is exchanged roughly every eight hours and accrues
while the position is open. Over a multi-day hold, cumulative funding often exceeds the
option premium. Kraken's hedging guide makes the general point directly: funding decides
whether a multi-day hedge is economically sensible, or whether carry exceeds the drawdown
being protected against.

The plus bounds the price leg. It does nothing to the funding leg. Any assessment of
PERPS+ that ignores this is incomplete.

## What the plus does not do

- **It does not remove funding.** See above.
- **It does not guarantee no liquidation.** Margin rules still apply. A defined maximum
  loss on the price leg is a narrower claim than immunity from liquidation.
- **It does not make you an options trader.** You are a consumer of a structure someone
  else selected. That is the point, and it is also the limitation — if your view is on
  volatility rather than direction, buying the option directly gives more control and
  usually costs less.
- **It does not improve the odds.** Between 70% and 80% of retail options traders lose
  money over a rolling twelve months, with 73% the most-cited figure. Simplification
  changes who can access an instrument. It does not change the distribution of outcomes.

## Why this exists now

Because the gap it addresses is enormous and specific.

Crypto options trade around $2 billion daily — roughly 0.06% of a ~$3 trillion market, and
about ten times below the equities ratio. Variant Fund describes retail adoption of crypto
options as "effectively zero." Meanwhile the top ten perpetuals venues processed $92.9
trillion in 2025, with daily volume peaking near $750 billion.

The instruments were never the constraint. Deribit's open interest reached $31.3 billion
in mid-2026, and it held over 90% of the ETH options market through 2025. Depth exists.
Demand for the exposure exists — Ribbon Finance's options vaults, built by the team that
went on to build Aevo, reached an all-time-high TVL above $350 million and paid depositors
over $50 million in premiums.

Retail wanted the payoff. It would not use the interface. The plus is an attempt to sell
the payoff without the interface.

## FAQs

### What does the plus in PERPS+ stand for?

An option leg attached to the perpetual futures position at entry. The perp provides
exposure; the option provides a boundary.

### What are the three PERPS+ modes?

Limit My Loss (a protective put — capped downside, open upside), Get Paid to Hold (a
covered call — upfront premium for a capped ceiling), and Lock My Range (a collar — floor
and ceiling for approximately zero net cost).

### Which mode should I use?

Limit My Loss if you want genuine downside protection and will pay for it. Get Paid to
Hold if you expect the market to go sideways and want income, accepting that it is not a
hedge. Lock My Range if you want a bounded outcome and are willing to surrender the upside
above a ceiling to avoid paying a premium.

### Is Get Paid to Hold a hedge?

No. It is a covered call. The premium reduces a loss by the amount of the premium and no
further. Treating it as downside protection is the most common error with this structure.

### Is Lock My Range really free?

The cash cost approaches zero because the sold call finances the bought put. The actual
cost is the upside above the call strike, which you give away.

### Which markets does PERPS+ support?

BTC and ETH perpetual futures.

### Does PERPS+ stop me being liquidated?

It caps the loss on the price leg. Margin requirements and accruing funding still apply.
Check Aevo's margin documentation for how the option leg is treated as collateral before
assuming liquidation cannot occur.

### Do I need options knowledge to use it?

Aevo states none is required to place the trade. Two concepts are still worth
understanding before you do: a capped upside is a real cost, and funding is charged
separately from the premium.

### Is this available everywhere?

No. Aevo states the app is not available to U.S. or U.K. persons. Verify against Aevo's
own terms.

---

## Content grade

**Classification: Differentiated. Would not be flagged as commodity, but is not yet
citable.**

| Dimension | Weight | Score | Reasoning |
|---|---|---|---|
| Information gain | 25 | 18 | The mode-to-structure decoding table and the explicit "Get Paid to Hold is not a hedge" warning appear in no competing page. The "what the plus does not do" section is contrarian relative to the syndicated coverage. |
| Primary evidence | 20 | 3 | No first-party data, no screenshots, no payoff diagrams. |
| Expertise and entity signals | 15 | 5 | No named author or credentials. |
| Unanswered-question coverage | 15 | 14 | "Which mode should I use" and "is Get Paid to Hold a hedge" are the two highest-intent unanswered questions on this topic. Both are answered decisively. |
| Verifiability | 15 | 11 | Options theory is independently checkable. Product specifics remain Tier C — Aevo describing Aevo. |
| Structural extractability | 10 | 10 | Best AUF in the set. "The plus is an option" is a directly quotable answer. |
| **Total** | **100** | **61** | |

**Ceiling without new evidence: ~71.**

### What is required to make this non-commodity (75+)

1. **Draw the three payoff diagrams.** One SVG per mode showing profit against underlying
   price, with the strike and premium marked. This is the definitive visual asset for this
   query and nobody currently ranking has it. Worth 10–12 points and it is a
   thirty-minute job.
2. **Publish a worked example with live numbers.** A $10,000 BTC long at a stated spot
   price, with each mode applied, showing exact break-even, maximum loss and maximum gain.
   Real quoted premiums, timestamped.
3. **Build a mode-selection decision tree.** Market view in, mode out. Converts the
   article from explanation into a tool, which changes the link profile.
4. **Add a funding break-even table** — days of carry at the current funding rate against
   the Limit My Loss premium. The number that decides the trade, published nowhere.
5. **Named author, FAQPage schema, and a disclosure of any relationship to Aevo.**

Items 1 and 3 are achievable without an account and lift this to roughly 78. Adding item 2
puts it near 88.
