---
title: "Aevo Brings PERPS+ to Mobile: What One-Tap Protected Perps on a Phone Actually Does"
slug: aevo-perps-plus-mobile
primary_query: "Aevo PERPS+ mobile"
secondary_queries:
  - "Aevo app"
  - "protected perps mobile app"
  - "trade options on phone crypto"
source_post: https://x.com/aevoxyz/status/2083191674344255953 (2026-07-31, content not retrievable — see source ledger)
version: 1
last_reviewed: 2026-09-08
---

# Aevo Brings PERPS+ to Mobile: What One-Tap Protected Perps on a Phone Actually Does

**Aevo shipped PERPS+ to its mobile app in July 2026, bringing the mobile client to
feature parity with desktop. The feature attaches downside protection to a BTC or ETH perp
at the moment of entry, in one tap, with three modes: Limit My Loss, Get Paid to Hold, and
Lock My Range. Aevo states the app is available on the App Store and Google Play and is
not available to U.S. or U.K. persons. The significant part is not the app — it is that a
multi-leg options structure now fits on a phone screen.**

## What shipped

Aevo describes PERPS+ as adding protection directly to a perp at entry: the trader picks a
mode, sets the level, and Aevo executes the combined position in one tap, with no options
knowledge required.

Three modes, each mapping to a textbook options structure:

| Mode | Structure | What it does | What it costs |
|---|---|---|---|
| **Limit My Loss** | Protective put | Defines maximum loss at entry. Downside capped, upside fully open. | A premium, paid up front |
| **Get Paid to Hold** | Covered call | Pays an upfront premium immediately | A defined profit ceiling |
| **Lock My Range** | Collar | Sets both a floor and a ceiling on the position | Approximately zero net cost; the upside above the ceiling |

Availability is BTC and ETH perpetual futures. The trader selects the protection level;
Aevo states it handles the structuring, pricing and execution.

## Why mobile is the load-bearing part

The obvious reading is that this is a routine platform-parity release. That reading
undersells it.

An options chain does not fit on a phone. That is a literal statement about screen area.
A desktop options interface presents a grid of strikes against expiries, with bid, ask,
implied volatility and greeks per cell. Rendering that on a 390-point-wide viewport
produces something unusable, which is why crypto options apps have historically been
desktop-first and why mobile options trading in crypto has been close to nonexistent.

PERPS+ sidesteps the constraint rather than solving it. If the venue selects the strike and
the expiry, there is no chain to render. What remains is a direction, a size, and a
slider. That fits.

This is the same mechanism that drove 0DTE adoption in traditional finance, where Variant
Fund's analysis attributes success largely to UX — specifically removing or simplifying
the time dimension. PERPS+ removes two dimensions instead of one.

## The market context this lands in

Retail derivatives activity in crypto is overwhelmingly mobile and overwhelmingly
perpetual. Perpetuals hit a daily volume peak near $750 billion, and the top ten venues
processed $92.9 trillion in 2025. Crypto options, meanwhile, run around $2 billion a day —
roughly 0.06% of a ~$3 trillion market, about ten times below the equities ratio.

Nearly all of that options activity runs through centralised venues, even though DEXs now
carry upwards of 20% of crypto spot volume.

So the addressable gap is specific: mobile-first perp traders who have never opened an
options position. Aevo names this cohort explicitly as its first target — the perps trader
who has never used options and now gets one-tap protection on positions they were already
planning to open. The second named cohort is the DeFi vault depositor who wants structured
exposure without fixed vault terms.

That second group is a return to the company's origin. Aevo was built by the Ribbon
Finance team and launched in June 2023; Ribbon's options vaults reached an all-time-high
TVL above $350 million and paid depositors over $50 million in premiums. The vault
depositor is not a new customer for this team. PERPS+ is the same exposure without the
lockup.

## How it compares to the alternative

Bybit's Perp Protect is the closest live comparison. It programmatically acquires a put
against a long perp or a call against a short, with plans described as starting near 2% of
initial margin.

The differences that matter to a trader choosing between them:

- **Custody.** Bybit is centralised. Aevo runs a custom OP Stack Layer 2 with off-chain
  order matching and on-chain settlement.
- **Structure choice.** Perp Protect is algorithm-driven protection. PERPS+ exposes three
  named structures, including one that pays the trader (Get Paid to Hold) and one that is
  near-costless (Lock My Range). Perp Protect is protection only.
- **Cost transparency.** Bybit publishes a starting figure. Aevo's cost varies by mode and
  is quoted at entry.
- **Jurisdiction.** Aevo states the app is not available to U.S. or U.K. persons.

## What to check before using it

Three things the launch coverage does not resolve:

1. **The premium at your size.** "One tap" describes the interaction, not the price. The
   quoted premium at entry is the number that decides whether the trade is worth it. Check
   it against the cost of buying the equivalent put outright.
2. **Funding.** Perpetual funding is exchanged roughly every eight hours and accrues for
   as long as the position is open. Over a multi-day hold it can exceed the protection
   premium. The option caps the price leg. It does not cap the funding leg.
3. **Margin treatment of the option leg.** Capped maximum loss and impossible liquidation
   are not the same claim. Read how the venue treats the option as collateral.

## FAQs

### When did PERPS+ launch on mobile?

July 2026. The release brought Aevo's mobile client to feature parity with desktop.

### Where can I download the Aevo app?

Aevo states the app is on the App Store and Google Play. Aevo also states it is not
available to U.S. or U.K. persons — verify your jurisdiction against Aevo's own terms
before proceeding.

### Which markets support PERPS+?

BTC and ETH perpetual futures.

### Do I need to know how options work to use PERPS+?

No, by design — Aevo states no options knowledge is required. You should still understand
two things before using it: a capped upside is a genuine cost, and funding accrues
separately from the option premium.

### Is PERPS+ free?

Only Lock My Range approaches zero net cost, and it does so by selling away the upside
above a ceiling to pay for the floor. Limit My Loss costs a premium. Get Paid to Hold pays
the trader a premium in exchange for capping gains.

### Is this the same as Bybit's Perp Protect?

Similar goal, different construction. Perp Protect is a centralised, algorithm-driven
protection plan starting near 2% of initial margin. PERPS+ is a decentralised
implementation exposing three named structures, one of which pays the trader rather than
charging them.

### Can I still be liquidated with PERPS+ active?

The option bounds the loss on the price leg. Margin requirements and funding still apply.
Do not treat "maximum loss defined at entry" as "liquidation impossible" without reading
Aevo's margin documentation.

### What is Aevo?

A decentralised derivatives exchange running options, perpetual futures, pre-launch token
futures and structured products from a single cross-margin account. It was launched in
June 2023 by the Ribbon Finance team and runs on a custom OP Stack Layer 2 with off-chain
matching and on-chain settlement. Aevo cites more than $10 billion in options volume since
2020 — a figure that includes the Ribbon Finance lineage, not Aevo alone.

---

## Content grade

**Classification: Near-commodity as written. This is the weakest of the four, because the
underlying event is a press release that dozens of outlets published simultaneously.**

| Dimension | Weight | Score | Reasoning |
|---|---|---|---|
| Information gain | 25 | 14 | The "an options chain does not fit on a phone" argument and the Bybit comparison are not in the ranking set. But the launch facts themselves are syndicated across at least six outlets verbatim. |
| Primary evidence | 20 | 3 | Nothing first-party. No screenshots of the app the article is about, which for a mobile launch piece is a conspicuous absence. |
| Expertise and entity signals | 15 | 5 | No named author. No disclosed relationship to Aevo. |
| Unanswered-question coverage | 15 | 12 | "What to check before using it" and the liquidation FAQ answer things no syndicated version addresses. |
| Verifiability | 15 | 9 | Nearly every product claim is Tier C — Aevo describing Aevo. Attributed correctly, but thin. |
| Structural extractability | 10 | 9 | Strong AUF and table structure. |
| **Total** | **100** | **52** | |

**Ceiling without new evidence: ~62.** A launch article competing against its own press
release cannot win on prose.

### What is required to make this non-commodity (75+)

1. **Screenshot the app.** Every step: mode selection, level slider, quoted premium,
   confirmation, resulting position. A mobile-launch article with no images of the mobile
   product is the single largest miss here. Worth 15+ points, and no syndicated copy has
   it.
2. **Publish real quoted premiums.** Open a small BTC long, capture the premium for each
   of the three modes at three protection levels, and publish the nine numbers with a
   timestamp and the BTC price. This is the only content on the internet that would carry
   those figures.
3. **Time the flow.** Count taps and seconds from app open to protected position, then do
   the same on Deribit mobile and Bybit. Publish the comparison. Original, trivially
   verifiable, and impossible to copy without doing the work.
4. **Verify the U.S./U.K. restriction** against Aevo's terms of service and cite the
   clause. A jurisdiction claim sourced to a press release is a liability.
5. **Add author attribution and Article schema.**

Items 1–3 are one hour with a funded account and move this from 52 to roughly 85. Without
them, this article competes with a press release on the press release's terms.
