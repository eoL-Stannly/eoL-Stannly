# Aevo PERPS+ on Mobile: Three Protection Modes, One Tap, and What the Options Leg Really Costs

> **Source post:** [@aevoxyz, 31 July 2026](https://x.com/aevoxyz/status/2083191674344255953)
> **Mapping confidence:** Inferred. Nearest confirmed Aevo announcement is dated 19–23 July 2026.
> **Grade:** 64/100. See [SCORING.md](../SCORING.md).

---

## Answer up front

PERPS+ is a perpetual futures position with an options hedge attached at entry, in one action.
Aevo launched it on web first, then extended it to mobile in **July 2026**, giving the mobile app
full feature parity with desktop.

There are **three modes**:

| Mode | What it does |
|---|---|
| **Limit My Loss** | Caps downside at a level you choose |
| **Get Paid to Hold** | Generates income against the position |
| **Lock My Range** | Bounds the position between a floor and a ceiling |

You pick a mode, define the level, and Aevo executes the perp and the protection together in a
single tap. The important word is *together*. Legging into a perp and then hunting an options chain
for the right strike is where retail traders lose the hedge — either to slippage between the two
fills, or to never placing the second leg at all.

---

## What "protected perps" means mechanically

A protected perp is an options overlay on a leveraged futures position.

- **Long perp** → the system acquires a **put**, protecting against a price decline.
- **Short perp** → the system acquires a **call**, protecting against a price rise.

The perp gives continuous, funding-rate-driven exposure with no expiry. The option gives a hard
floor. Together you get a position that can ride a trend without a liquidation price that ends the
trade on a wick.

The thing that is genuinely hard about this manually is strike and size selection. The hedge has to
match your leverage and initial margin, or you are either over-insured and bleeding premium, or
under-insured and still exposed. Aevo's system recommends the option leg from the position
parameters rather than making the trader read a chain.

---

## Why Aevo, specifically, can build this

Most perp DEXs cannot ship protected perps, because most perp DEXs do not have an options book.

Aevo does. It grew out of **Ribbon Finance**, an options-vault protocol, and it runs options and
perpetuals **inside a single margin account** on its own OP Stack Ethereum L2. Both legs settle
against the same collateral, on the same venue, in the same transaction path.

That is the structural moat here, and it is worth stating plainly: PERPS+ is not a feature a
competitor bolts on in a sprint. It requires a live options market with real liquidity next to the
perp book. Aevo spent years building the options side first.

---

## The cost nobody puts in the announcement

Protection is not free. This is the part to internalise before using it.

**You pay a premium.** Buying a put or a call costs money, and that cost is deducted from the
position's returns whether or not the protection is ever needed. In a market that grinds sideways,
you pay the premium and get nothing back. That is the insurance model working as designed, but it
feels like a loss.

**"Get Paid to Hold" is the inverse trade.** Income-generating modes typically involve *selling*
optionality rather than buying it. Selling optionality caps your upside. If the mode pays you to
hold, ask what you gave up to be paid — usually the tail of the move you were hoping for.

**Protection level is a real decision.** A tight floor costs more premium. A loose floor costs less
and protects less. One tap does not remove that trade-off; it just stops you from having to price
it yourself.

---

## Mobile parity is the actual news

The July 2026 release completed platform parity: PERPS+ now works identically on mobile and web.

This matters more than it sounds. Risk management features are used when positions move, and
positions move when traders are away from a desk. A hedging tool that only exists on desktop is
unavailable at precisely the moments it is needed.

---

## FAQ

**What is PERPS+?**
A perpetual futures position with an options-based protection leg applied at entry, executed in one
tap on Aevo.

**When did PERPS+ launch on mobile?**
July 2026. Multiple outlets dated the announcement to 19–23 July 2026. It shipped on web first.

**What are the three PERPS+ modes?**
Limit My Loss (caps downside), Get Paid to Hold (generates income against the position), and Lock My
Range (bounds the position between a floor and a ceiling).

**How does the protection actually work?**
An options overlay. A long perp is paired with a put; a short perp is paired with a call. Aevo
recommends the option leg based on your leverage and initial margin.

**Does PERPS+ cost extra?**
Yes. Buying protection means paying an option premium, which reduces returns when the protection
goes unused. Income modes work the other way and cap upside instead.

**Does protection remove liquidation risk?**
It bounds downside at your chosen level, which is not the same as removing liquidation entirely.
Read the specific mode's terms — the floor you set determines the exposure that remains.

**Can I add protection to a position I already have open?**
PERPS+ is described as applying protection **at entry**. Adding it to an existing position is not
confirmed in the material reviewed here.

**Why can't other perp DEXs do this?**
They generally lack a liquid options book alongside the perp book. Aevo runs options and perps in one
margin account, inheriting an options market from its Ribbon Finance origins.

**Is PERPS+ available on all Aevo markets?**
Market coverage is not confirmed in the material reviewed here. Assume it tracks Aevo's options
coverage, which is deepest on major assets.

**What is "Get Paid to Hold" really doing?**
Almost certainly selling optionality to collect premium. Expect capped upside in exchange for income.
Verify the exact structure in Aevo's docs before sizing into it.

---

## Sources

- [Aevo, 31 July 2026 (source post — body not retrievable, blocked by egress policy)](https://x.com/aevoxyz/status/2083191674344255953)
- [Aevo Extends PERPS+ to Mobile, Completing Full Platform Parity — CryptoDaily](https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity)
- [Aevo Brings One-Tap Protected Perps to Mobile With PERPS+ Launch — Chainwire via Investing.com](https://www.investing.com/news/cryptocurrency-news/aevo-brings-onetap-protected-perps-to-mobile-with-perps-launch-4799727)
- [Aevo Puts One-Tap Downside Protection in Traders' Pockets — Chainwire via Investing.com](https://www.investing.com/news/cryptocurrency-news/aevo-puts-onetap-downside-protection-in-traders-pockets-with-perps-on-mobile-4804902)
- [Aevo Makes Protected Perps Portable With PERPS+ on Mobile — DailyCoin](https://dailycoin.com/aevo-makes-protected-perps-portable-with-perps-on-mobile)
- [Hedging a crypto spot portfolio with perpetual futures — Kraken Learn](https://www.kraken.com/learn/futures-trading-hedging-spot-with-perps)
- [Perpetual Futures vs. Options — Drift Learn](https://www.drift.trade/learn/perpetual-futures-vs-options)
- [Explainer: Perpetual futures contracts — FIA](https://www.fia.org/marketvoice/articles/explainer-perpetual-futures-contracts)
