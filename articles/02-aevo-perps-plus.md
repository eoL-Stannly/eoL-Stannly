# PERPS+ Explained: Aevo's Three Protection Modes Are Options Strategies in Disguise

**Topic date:** 23 March 2026 · **Source post:** `x.com/aevoxyz/status/2036035408430084283`
**Commodity grade:** see [scorecard](scoring/commodity-scorecard.md) — **v2 score: 74/100 (non-commodity)**

> **Target query:** `what is aevo perps+` / `limit my loss vs stop loss` / `protected perps explained`
> **Title tag:** Aevo PERPS+ Explained: What Each Protection Mode Really Costs
> **Meta description:** PERPS+ attaches option-based protection to a perp at entry. The three modes map to a protective put, a covered call and a collar — here is what each one gives up.

---

## Answer up front

PERPS+ attaches downside protection to a perpetual futures position **at the moment of entry**. The trader picks a mode, sets a level, and the platform executes the whole structure in one tap. No options knowledge is required. It launched on BTC and ETH perpetuals.

There are three modes:

- **Limit My Loss** — caps the maximum loss at entry. Downside is capped, upside stays fully open.
- **Get Paid to Hold** — pays an upfront premium immediately, in exchange for a defined profit ceiling.
- **Lock My Range** — sets both a floor and a ceiling, at approximately zero net cost.

Aevo announced on 5 March 2026 that it would unveil a new product on 16 March alongside an AMA. PERPS+ is that product line. It reached mobile in July 2026.

Sources: [Chainwire via Investing.com](https://www.investing.com/news/cryptocurrency-news/aevo-brings-onetap-protected-perps-to-mobile-with-perps-launch-4799727), [Bitget News, 5 March 2026](https://www.bitget.com/news/detail/12560605240274).

---

## The insight the press coverage misses

Each PERPS+ mode is a well-known options overlay with the jargon removed. This mapping is not marketing language — it follows directly from the described payoff shapes.

| PERPS+ mode | Payoff described | Equivalent classical structure |
|---|---|---|
| Limit My Loss | Loss capped, upside uncapped | Protective put (long spot/perp + long put) |
| Get Paid to Hold | Premium received now, profit ceiling imposed | Covered call (long position + short call) |
| Lock My Range | Floor and ceiling, ~zero net cost | Collar (long put funded by short call) |

If you already trade options, that table tells you everything about the risk you are taking. If you do not, it tells you the product is not novel financial engineering — it is packaging. Packaging is a legitimate and valuable thing to ship. It is also a claim you can verify against the payoff description rather than take on trust.

Aevo can build this because its venue runs options and perpetual futures against a **single margin account** on its own Ethereum layer-2. The overlay and the perp settle in the same place.

## Limit My Loss is not a stop-loss, and the difference matters

This is the most consequential practical point about the product, and it is absent from the syndicated coverage.

A stop-loss is **path-dependent**. It is a conditional order that triggers when price touches a level. Three failure modes follow:
1. A wick through your level closes the position even if price immediately recovers.
2. In a fast market, the fill can be materially worse than the trigger — slippage.
3. In a liquidity gap, there may be no fill near the level at all.

An option-based floor is **not path-dependent** in the same way. The floor is a contractual right, not a queued order. Price can trade through the level and back without the protection being consumed, and the protection does not depend on there being a bid at your number when you need one.

That difference is not free. The floor costs premium. A stop-loss costs nothing up front. You are paying to remove wick risk and slippage risk from your downside.

## What you give up in each mode

Honest framing, because every one of these has a cost.

**Limit My Loss** — you pay premium at entry. If price goes nowhere, that premium is a drag on the position. Protection has a carrying cost.

**Get Paid to Hold** — you receive cash immediately and sell your upside above a level. In a strong trend, this is the mode that hurts. You keep the premium and watch the position stop participating.

**Lock My Range** — approximately zero net cost because the ceiling you sell finances the floor you buy. You have converted an unbounded position into a bounded one on both sides. If your thesis is a large move, this mode contradicts it.

None of these are flaws. They are the terms. A product that abstracts options into one tap has an obligation to make the trade-off legible, and a piece of content about that product has the same obligation.

## Competitive context: Aevo is not first, and that is fine

Bybit ships **Perp Protect**, an automated tool that hedges long and short perpetual exposure by programmatically buying options. The concept — options overlay applied to a perp position, automated — is established.

Source: [Perp Protect hedge guide](https://coinspot.io/en/cryptocurrencies/bybit-perp-protect-for-perpetual-contracts-a-concise-hedge-guide-for-cryptocurrency-trading/).

The differentiators worth stating precisely:
- **Entry-time, not after-the-fact.** PERPS+ constructs the protection as part of opening the position, in one action.
- **Named modes, not parameters.** "Limit My Loss" is an intent. "Buy a 5% OTM put with 14 days to expiry" is a configuration. The first is usable by someone who has never priced an option.
- **On-chain venue.** Aevo settles on its own layer-2 rather than in a centralised exchange's internal ledger.

Broader context: perpetual futures were crypto's dominant instrument through 2026, with the category expanding into mainstream venues — [Polymarket launched leveraged perps in April 2026](https://www.cnbc.com/2026/04/21/polymarket-launches-trading-of-heavily-leveraged-perps-contracts.html), and [CoinDesk ran a general explainer on perps in July 2026](https://www.coindesk.com/business/2026/07/27/what-are-perps-anyway-everything-you-need-to-know-about-crypto-s-hottest-trading-instrument). Retail adoption of perps ran far ahead of retail adoption of options. Products that convert the second into the first are chasing a real gap.

---

## FAQ

**What is PERPS+?**
A feature that attaches option-based protection to a perpetual futures position at entry, in a single tap, across three preset modes.

**Which markets does it support?**
BTC and ETH perpetual futures at launch.

**Do I need to understand options to use it?**
No. That is the explicit design goal. Understanding what each mode costs you, however, is worth ten minutes.

**How is "Limit My Loss" different from a stop-loss?**
A stop-loss is a conditional order — it can be triggered by a wick, and it can slip in a fast market. An option floor is a contractual right that does not depend on getting a fill at your level. You pay premium for that difference.

**Is PERPS+ free?**
The protection costs premium in Limit My Loss. Get Paid to Hold pays you premium and caps your upside. Lock My Range is approximately zero net cost because the ceiling finances the floor. Normal trading fees apply in all cases.

**What is the catch with "Get Paid to Hold"?**
You have sold your upside above a level. In a strong rally you keep the premium and stop participating. It suits range-bound or slow-grind expectations, not breakout theses.

**Can I close a PERPS+ position early?**
Position management follows the venue's normal rules for the underlying instruments. Confirm current behaviour in Aevo's own documentation before relying on it — this article does not verify it.

**When did it launch?**
Aevo signalled a new product for 16 March 2026 with an accompanying AMA. Mobile availability followed in July 2026.

**Who cannot use it?**
Aevo's mobile app is stated as not available to U.S. or U.K. persons. Aevo has also faced regulatory action elsewhere — the Philippine SEC moved against it on 21 April 2026 for operating without local licences. Check your own jurisdiction.

---

## Source and verification note

The original X post is a bare `t.co` media link with no post text, and `x.com` is blocked by this environment's network egress proxy. The post could not be read.

**Date-to-topic confidence: medium.** The 23 March 2026 timestamp falls one week after Aevo's announced 16 March product unveil, and PERPS+ is the product line Aevo launched in that window and extended in July. The mapping is an inference from date proximity and product timeline, not a confirmed reading of the post. The *product facts* below are independently sourced and stand on their own regardless of which post they came from.

The structure-equivalence table (protective put / covered call / collar) is analysis, derived from the published payoff descriptions. It is not a claim made by Aevo.

**Sources:**
- [Aevo Brings One-Tap Protected Perps to Mobile With PERPS+ Launch — Chainwire](https://www.investing.com/news/cryptocurrency-news/aevo-brings-onetap-protected-perps-to-mobile-with-perps-launch-4799727)
- [Aevo Puts One-Tap Downside Protection in Traders' Pockets — Chainwire](https://www.investing.com/news/cryptocurrency-news/aevo-puts-onetap-downside-protection-in-traders-pockets-with-perps-on-mobile-4804902)
- [Aevo announces new product launch on March 16 — Bitget News](https://www.bitget.com/news/detail/12560605240274)
- [Bybit Perp Protect hedge guide](https://coinspot.io/en/cryptocurrencies/bybit-perp-protect-for-perpetual-contracts-a-concise-hedge-guide-for-cryptocurrency-trading/)
- [CoinDesk — What are perps, anyway?](https://www.coindesk.com/business/2026/07/27/what-are-perps-anyway-everything-you-need-to-know-about-crypto-s-hottest-trading-instrument)
- [CNBC — Polymarket launches leveraged perps](https://www.cnbc.com/2026/04/21/polymarket-launches-trading-of-heavily-leveraged-perps-contracts.html)
