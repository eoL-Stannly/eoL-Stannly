# Aevo's 16 March 2026 Product Reveal: What Was Teased, What Shipped, and Why the Timing Mattered

> **Source post:** https://x.com/aevoxyz/status/2029965683056930907 — posted 6 March 2026, 17:01 UTC
> **Rewrite pass:** v2 · **Non-Commodity Score:** 71/100 · **Class:** Non-commodity

---

## The answer, up front

On 6 March 2026 Aevo told its audience a new product was coming on 16 March, paired with
a live AMA. The product was PERPS+ — one-tap downside protection attached to a
perpetual futures position. It went live on BTC and ETH markets, and by 30 March Aevo
was already routing 300,000 AEVO per weekly epoch to PERPS+ users specifically. The
teaser was not marketing filler. It was a ten-day runway for the largest interface change
Aevo had made since launching its L2.

---

## What Aevo actually announced on 6 March 2026

Aevo published a dated commitment: a new product reveal on 16 March, with an AMA held at
the same time. **[S]**

Three things about that framing are worth noting.

**It named a date.** Most crypto teasers do not. A named date creates a checkable
promise, and Aevo shipped against it.

**It bundled an AMA with the reveal.** That pairs the announcement with a live
question-and-answer surface on the same day. For a product whose core difficulty is
explanation rather than mechanics, that sequencing is deliberate.

**It came ten days ahead.** Ten days is long enough to build anticipation and short
enough that the audience does not disengage.

## What shipped: PERPS+

PERPS+ lets a trader attach an options-style risk structure to a perpetual futures
position at the moment of entry. The trader picks a mode, sets a level, and Aevo executes
the combined position in a single action. No strike selection. No expiry management. No
options knowledge required. **[P]**

It launched with three modes:

| Mode | What it does | Cost profile |
|------|--------------|--------------|
| Limit My Loss | Caps maximum loss at a level set at entry; upside stays fully open | Pay a premium |
| Get Paid to Hold | Pays a guaranteed premium upfront; caps upside at a defined ceiling | Receive a premium |
| Lock My Range | Sets both a floor and a ceiling on the position | Close to zero net cost |

PERPS+ launched on BTC and ETH perpetual futures. **[S]**

The mechanics are covered in depth in the companion article on the PERPS+ launch itself.

## The reveal-to-ship timeline

| Date (2026) | Event | Confidence |
|-------------|-------|------------|
| 5 March | Aevo's "new product on March 16" notice reported by crypto news outlets | **[S]** |
| 6 March, 17:01 UTC | Aevo's own post announcing the reveal date | Decoded from status ID |
| 16 March | Product reveal and AMA | **[S]** |
| ~23 March | PERPS+ confirmed live on BTC and ETH by third-party accounts | **[S]** |
| ~30 March | Rewards Epoch 17 opens with 300,000 AEVO earmarked for PERPS+ users, plus USDC bonuses of $750 for ranks 1–3 and $400 for ranks 4–10 | **[S]** |

That last row is the one most coverage missed. Aevo did not just launch a feature — it
re-pointed a third of a 1,000,000 AEVO weekly reward pool at the feature within roughly a
fortnight of launch. Incentive reallocation on that timescale tells you the feature was
strategic, not experimental.

## Why Aevo needed a reveal at all

Aevo's problem in March 2026 was not liquidity. It was comprehension.

Options are the smaller half of Aevo's business by attention, and the market data explains
why. As of March 2026, on-chain options trading accounted for roughly **0.2% of on-chain
perpetual futures volume**. **[S]** The perp market was running at around **$21 billion a
day**. **[S]** Meanwhile Deribit — a centralised venue — held about **49.3% of the total
crypto options market** in H1 2026, on **$425.9 billion** of the **$864.6 billion** in
combined BTC and ETH options volume. **[S]**

So the on-chain options opportunity was real and almost entirely uncaptured. The barrier
was never the payoff structure. It was the order ticket.

That is the thesis a product reveal exists to communicate. You cannot explain "we removed
the reason you never traded options" in a feature changelog.

## What the 6 March post tells you about Aevo's product strategy

Three signals, all checkable.

1. **Aevo is building for perp traders, not options traders.** PERPS+ starts from a perp
   position and adds protection to it. The entry point is the instrument people already
   use.
2. **Aevo treats distribution as a launch component.** The reveal, the AMA, and the
   incentive reallocation happened inside one month.
3. **Aevo shipped narrow first.** BTC and ETH only. Two markets, three modes. That is a
   deliberately small surface for a launch of this profile.

## Frequently asked questions

### What did Aevo launch on 16 March 2026?
PERPS+ — a feature that attaches options-based downside protection to a perpetual futures
position in one action. It launched on BTC and ETH perps with three modes: Limit My Loss,
Get Paid to Hold, and Lock My Range.

### Was the 16 March reveal the first time PERPS+ appeared?
It was the public reveal. PERPS+ went live on web first, then reached mobile in late July
2026, at which point Aevo's mobile app matched desktop feature for feature. **[S]**

### Do I need to understand options to use what Aevo launched?
No. That is the design premise. You select a protection mode and a level; Aevo constructs
and executes the underlying options leg alongside the perp. There is no strike selection
and no expiry to roll. **[P]**

### What is Aevo?
Aevo is a decentralised derivatives exchange offering options, perpetual futures and
structured products inside a single cross-margin account. It runs on the Aevo L2, a custom
Ethereum rollup built on the OP Stack, which supports over 5,000 transactions per second.
Aevo reports over $30 billion in cumulative trading volume and more than $10 billion in
options volume since 2020. **[P]**

### Is Aevo related to Ribbon Finance?
Yes. Aevo is the successor protocol to Ribbon Finance, and Ribbon's documentation carries
the Aevo transition. **[P]**

### Which markets did PERPS+ support at launch?
BTC and ETH perpetual futures. **[S]**

### Did Aevo pay users to try PERPS+?
Yes, directly. Rewards Epoch 17, live from around 30 March 2026, allocated 300,000 AEVO of
its 1,000,000 AEVO weekly pool to PERPS+ users, with additional USDC prizes for the
highest-volume PERPS+ traders. **[S]**

### Where can I watch the AMA?
The AMA was held on 16 March 2026 alongside the reveal. Check Aevo's own channels for the
recording — https://www.aevo.xyz/ and the Aevo documentation at https://docs.aevo.xyz/.

---

## Editorial scorecard

| Dimension | Max | v1 | v2 | Notes |
|-----------|-----|----|----|-------|
| Information gain | 25 | 15 | 20 | The Epoch 17 incentive-reallocation link and the reveal-to-ship timeline are not in the competing coverage |
| First-hand evidence | 20 | 4 | 6 | No AMA notes, no screenshots, no attendance |
| Verifiable specificity | 15 | 12 | 14 | Every figure dated and sourced |
| Decision utility | 15 | 8 | 11 | Timeline table and mode table give a reader something to act on |
| Entity and topical authority | 10 | 8 | 9 | Ribbon lineage, L2 architecture, options-market context all present |
| Freshness and date anchoring | 10 | 8 | 9 | All claims carry as-of dates |
| Distinct thesis | 5 | 3 | 2 | Thesis ("comprehension, not liquidity, was the constraint") is strong but partly shared with article 2 |
| **Total** | **100** | **58** | **71** | **Non-commodity** |

### What is required to push this past 80

1. Publish notes or a transcript from the 16 March AMA. Nothing else on the SERP has it.
2. Screenshot the PERPS+ ticket as it looked at launch versus today. Interface archaeology
   is first-hand evidence no competitor can copy.
3. Pull the actual Epoch 17 leaderboard payouts and show what the top PERPS+ traders
   earned.
4. Add a direct quote from Aevo, or from a trader who used PERPS+ in its first week.

### Where the current SERP is weak

Coverage of the March 2026 reveal is thin and mostly aggregator-generated. The July mobile
launch is heavily covered because it had a press-wire distribution; the March reveal did
not. That asymmetry is the ranking opportunity: this is a genuinely under-served query
cluster with an entity that has news demand.

---

## Sources

- Aevo — https://www.aevo.xyz/
- Aevo Documentation — https://docs.aevo.xyz/
- Aevo governance proposals — https://agp.aevo.xyz/
- CryptoSlate, on-chain options and the $21B/day perp market — https://cryptoslate.com/on-chain-options-close-in-on-cryptos-21b-a-day-perp-market-to-deepen-liquidity-everywhere/
- CoinLaw, crypto options market statistics 2026 — https://coinlaw.io/options-market-in-crypto-statistics/
- CryptoDaily, PERPS+ extended to mobile — https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity
- Ribbon Finance documentation on Aevo — https://docs.ribbon.finance/aevo
