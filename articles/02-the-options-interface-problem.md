---
title: "The Interface Problem: Why Retail Crypto Traders Still Do Not Use Options"
slug: crypto-options-interface-problem
primary_query: "why don't retail traders use crypto options"
secondary_queries:
  - "crypto options adoption"
  - "are crypto options too complicated"
  - "onchain options UX"
source_post: https://x.com/aevoxyz/status/2036035408430084283 (2026-03-23, content not retrievable — see source ledger)
version: 1
last_reviewed: 2026-09-08
---

# The Interface Problem: Why Retail Crypto Traders Still Do Not Use Options

**Crypto options trade around $2 billion a day. That is roughly 0.06% of a ~$3 trillion
asset class, about ten times lower than the equivalent ratio in equities. The blocker is
not liquidity, regulation, or education — it is the number of decisions an options screen
demands before a trade can be placed. Every product that has meaningfully grown retail
options usage has grown it by deleting decisions, not by explaining them.**

## The size of the gap

Start with the ratio, because the absolute number hides the story.

Variant Fund's research on onchain options markets puts crypto options at roughly $2
billion of daily volume — about 0.06% of crypto's approximately $3 trillion market
capitalisation, and around ten times lower than equities on a relative basis. The same
research describes retail adoption of options in crypto as "effectively zero."

Set that against the perpetuals market. In 2025 the top ten crypto perpetuals venues
processed $92.9 trillion of volume, up 64.6% year on year, with daily volume peaking near
$750 billion.

Same traders. Same assets. Same venues, in many cases. One instrument grew into the
trillions and the other did not leave the starting blocks.

Note also where the options volume sits. DEXs carry upwards of 20% of crypto spot volume,
but nearly all options activity still runs through centralised venues. Deribit retained
over 90% of the Ethereum options market through 2025. Onchain options are a rounding error
inside a rounding error.

## Three explanations that do not survive contact with the data

**"Options are too illiquid."** Deribit's open interest reached $31.3 billion mid-2026.
BlackRock's IBIT options open interest hit $27.61 billion in April 2026, overtaking
Deribit's $26.9 billion — the first month a regulated US venue led offshore Bitcoin
options open interest. Tens of billions of open interest is not an illiquidity problem.

**"Retail does not want defined-outcome exposure."** Retail buys structured products
constantly. Vaults, auto-compounders and yield strategies sell precisely this. Ribbon
Finance's options vaults — the protocol that became Aevo — reached an all-time-high TVL
above $350 million and returned over $50 million in premiums to depositors. Retail was
happy to hold the option exposure. It just would not click the options screen.

**"It is an education problem."** This is the explanation the industry likes, and the
evidence contradicts it in a specific way. Academic work on retail options behaviour finds
that complexity produces behavioural mistakes, and that investors learn to avoid those
mistakes only through experience. That is not a case for more explainer content. It is a
case for fewer things to get wrong.

## What the data actually says the blocker is

The strongest evidence comes from a natural experiment in equities.

In 2018, Robinhood cut the commission and contract fee on complex, multi-leg options to
zero. Research by Bogousslavsky and Muravyev tracked what followed. Complex options trades
rose more than 75.4% relative to options on other stocks. By July 2022, complex options
accounted for nearly 20% of retail options trades.

Nothing was taught. One point of friction was removed, and multi-leg options usage nearly
doubled.

The second piece of evidence is 0DTE. Variant's analysis attributes their success largely
to UX — specifically, removing or simplifying the time dimension. Options carry three
axes: direction, strike, and expiry. 0DTE collapses the third to a constant. Volume
followed.

The pattern is consistent. Delete an axis, get adoption.

## Counting the decisions

Here is the friction, made concrete. To open a hedged long the manual way:

1. Choose the venue.
2. Choose the perp size and leverage.
3. Choose an expiry for the option.
4. Choose a strike for the put.
5. Choose the put size relative to the perp.
6. Choose whether to finance it with a sold call.
7. Choose that call's strike.
8. Fund and manage margin across two positions.
9. Manage the option's decay and the perp's funding separately.

Nine decisions, of which seven are about the hedge rather than the view. A perp trade is
two: direction and size.

The observed adoption ratio between the two instruments is roughly what you would predict
from that decision count.

## What "solving the interface" means in practice

It means the venue makes decisions 3 through 9 and the trader makes 1, 2 and a single
protection level.

Aevo's PERPS+ is a direct implementation of this. The trader picks a mode and a level;
Aevo states it handles structuring, pricing and execution in one tap, with no options
knowledge required. The three modes map onto standard structures — a protective put, a
covered call, and a collar — but the trader never selects a strike or an expiry.

Bybit's Perp Protect does the same thing from the centralised side, programmatically
acquiring a put against a long or a call against a short, with plans described as starting
near 2% of initial margin.

Note what neither product does: neither teaches options. Both remove the need to know
them.

## The part that should worry anyone building this

Lowering the barrier increases participation. It does not improve outcomes.

The same body of research that shows retail piling into complex options after fee removal
also shows what happened to those traders. Estimates put the share of retail options
traders losing money over a rolling twelve-month period at 70–80%, with 73% the figure
most commonly cited in recent literature. MIT Sloan's summary of the research is blunt:
retail investors lose big in options markets.

A one-tap interface is an honest improvement when it caps a loss the trader was already
taking. It is a different thing when it makes an unnecessary position easier to open.

The distinction is whether the default is protective. A product whose one-tap action
*bounds* risk is subtracting from the failure mode. A product whose one-tap action *adds*
leverage is adding to it.

## FAQs

### How big is the crypto options market compared to perpetuals?

Crypto options trade roughly $2 billion daily. Perpetuals peaked near $750 billion daily,
and the top ten venues did $92.9 trillion across 2025. Options are on the order of a
quarter of one percent of perpetual volume.

### Is that ratio normal for a maturing asset class?

No. Crypto options at ~0.06% of market cap run roughly ten times below the equivalent
equities ratio, per Variant Fund. The gap is crypto-specific.

### Are crypto options illiquid?

Not at the index level. Deribit's open interest reached $31.3 billion in mid-2026 and it
held over 90% of the ETH options market through 2025. Liquidity thins fast outside BTC and
ETH and outside near-dated expiries — which is one reason simplified products currently
launch on BTC and ETH only.

### Would better educational content fix adoption?

The evidence does not support it. Removing a fee in 2018 lifted complex options usage by
more than 75.4%, with no educational intervention. Research also finds retail learns to
avoid complexity-driven mistakes only through experience, not instruction.

### What is a 0DTE option and why does it matter here?

A zero-day-to-expiration option expires the day it is traded. It matters because its
growth is attributed largely to UX — it removes the expiry decision. It is the clearest
proof that deleting a decision drives options adoption.

### Do simplified options products make retail traders more profitable?

There is no evidence yet that they do. Between 70% and 80% of retail options traders lose
money over a rolling year. Simplification changes who can access the instrument, not the
distribution of outcomes. The one case where it plausibly helps is when the simplified
action caps a loss on a position the trader was going to open regardless.

### Why has this not been solved onchain before?

Infrastructure and orderflow. Variant's analysis traces the gap to early onchain options
designs constrained by primitive infrastructure that failed on two counts: protecting
liquidity providers from bad orderflow, and attracting good orderflow. Venues that fixed
matching and settlement first — Aevo runs a custom OP Stack L2 with off-chain matching and
on-chain settlement — are the ones now able to work on the interface layer.

---

## Content grade

**Classification: Differentiated, close to non-commodity. The strongest article in this
set.**

| Dimension | Weight | Score | Reasoning |
|---|---|---|---|
| Information gain | 25 | 22 | The Robinhood-2018 natural experiment is not connected to crypto options adoption anywhere in the ranking set. The nine-decision count is an original framing. The "lowering the barrier does not improve outcomes" section directly contradicts the prevailing take. |
| Primary evidence | 20 | 5 | No first-party data. The synthesis is original; the inputs are not. |
| Expertise and entity signals | 15 | 5 | No named author or credentials. |
| Unanswered-question coverage | 15 | 13 | Answers the adoption-ratio question with a number, which competing pages do not. |
| Verifiability | 15 | 12 | Variant Fund and the academic papers are Tier B and citable. The 73% figure needs primary confirmation. |
| Structural extractability | 10 | 9 | Each section stands alone. AUF leads with the ratio. |
| **Total** | **100** | **66** | |

**Ceiling without new evidence: ~72.**

### What is required to make this non-commodity (75+)

1. **Publish an original decision-count audit.** Screenshot the trade flow on five venues
   — Deribit, Aevo, Bybit, Derive, and one perp-only DEX — and count the fields required
   to open a hedged long on each. This is a half-day of work and produces a dataset nobody
   else has. Worth 12–15 points on its own.
2. **Pull the actual ratio.** Take options daily volume and perpetuals daily volume from
   The Block or Coinalyze for the trailing 90 days and publish the series with a chart,
   rather than quoting one figure from a research post.
3. **Confirm the 73% loss figure** in Bogousslavsky and Muravyev or the MIT Sloan write-up
   directly. It is load-bearing in the closing argument and currently sourced to a vendor
   blog.
4. **Quote one practitioner** — a market maker or a desk trader — on why options flow
   never reached retail. One paragraph of first-hand comment is a Tier A source that no
   competitor can copy.

Item 1 alone crosses the threshold. Items 1 and 4 together put this near 85.
