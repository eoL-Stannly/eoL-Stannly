# PERPS+ Reaches Mobile: Why Platform Parity Was the Whole Point

> **Source post:** [@aevoxyz, 31 July 2026, 14:02 UTC](https://x.com/aevoxyz/status/2083191674344255953)
> **NCS: 63/100** — non-commodity, weak moat. Scoring detail at the foot of this page.

---

## Answer up front

Aevo brought PERPS+ to its mobile app on 31 July 2026, roughly four months after the web launch. The mobile version has full feature parity with desktop. All three modes — Limit My Loss, Get Paid to Hold, Lock My Range — work in a single tap on BTC and ETH perpetual futures, with no options knowledge required.

This reads like a routine platform update. It is not. **More than 70% of retail crypto trades in 2026 are executed on mobile devices.** A risk-management product that only existed on desktop was, in practice, unavailable to most of the people it was designed for.

---

## The number that makes this a story

Start with the distribution problem.

Over 70% of retail crypto trades now originate from mobile. Options are already the least-used instrument in crypto derivatives at **2.4% of total volume**. Restricting a retail-facing options product to the desktop compounds those two facts: a small category, delivered only to the minority channel.

Four months of web-only availability was four months of the product being invisible to most of its target user. The July release is when PERPS+ became a distribution story rather than a feature story.

## What shipped

Feature parity, not a reduced mobile build. Specifically:

- All three PERPS+ modes on mobile
- BTC and ETH perpetual futures
- The same one-tap flow: select a mode, define the level, Aevo executes the combined position
- No separate options interface to learn

The mechanical flow is unchanged from web. The trader picks a mode, sets a level, and the combined perp-plus-options position executes as one action.

## Why the interface, not the maths, was the barrier

Aevo's stated framing is that complexity is the barrier to retail options adoption, and that the fix is to remove complexity from view rather than make it visible.

The research supports the diagnosis. Options markets demand that traders interpret implied volatility, open interest distribution and gamma exposure — data historically hard for retail to read. Retail option losses rise with trade complexity. Fewer than 20% of retail traders use protective strategies even during earnings season.

On a phone the problem gets worse, not better. An options chain is a dense grid. Dense grids do not survive a 6-inch screen. Any mobile options product either simplifies radically or fails.

PERPS+ simplifies radically: three named outcomes instead of a strike grid.

## The two users this is aimed at

Aevo names them explicitly, and they want opposite things.

**The perps trader who has never touched options.** They get one-tap protection on a trade they were already going to place. Nothing new to learn. The product meets them inside a workflow they already have.

**The DeFi vault depositor.** They already want structured payoffs — that is why they are in a vault. What they dislike is fixed vault terms. PERPS+ gives them the same vault-like payoff shape with their own parameters: their strike level, their tenor, their size.

That second group is the more interesting one commercially. A vault depositor has already accepted the concept of a capped, defined-outcome position. They are not being taught anything. They are being offered control they previously did not have.

## What mobile parity actually buys you

The unglamorous case for this release, in three points.

**1. Protection is time-sensitive.** The moment you most want a floor under a position is the moment the market moves against you, and you are rarely at a desk when that happens. A protection product you cannot reach in ninety seconds is a protection product you do not have.

**2. Entry-time decisions must be made at entry.** PERPS+ attaches the option at entry, not after. If the perp entry happens on the phone and the protection only exists on the desktop, the two never meet. Parity is the only configuration that works.

**3. Phones favour presets over configuration.** The three-mode design is worse than a full options chain for a professional and better for everyone else. On a phone, that trade is straightforwardly correct.

## Where this sits competitively

Aevo has processed more than **$10 billion in options volume since 2020** and holds a reported **79% of the on-chain options market**.

That dominance is over a small territory. **Deribit holds 85–90% of global BTC and ETH options open interest.** On-chain options remain orders of magnitude smaller than centralised venues — for scale, Derive sat at roughly 0.8% of the BTC options market by open interest as of March 2026.

Bybit's Perp Protect is the closest centralised analogue, and it offers downside protection only. Aevo's three-mode set is wider. Whether wider matters depends entirely on execution quality, which no public data currently measures.

## The open question

Nobody has published PERPS+ adoption numbers.

The interesting metric is not launch coverage. It is what share of Aevo's BTC and ETH perp volume carries a PERPS+ leg, and how that share moved after the mobile release. If the mobile launch was the distribution unlock this article argues it was, there should be a step change in the data from August 2026 onwards.

Aevo settles to Ethereum, so the data is queryable by anyone willing to write the query. As of this writing, nobody has.

---

## FAQ

**When did PERPS+ launch on mobile?**
31 July 2026. Web came first, around late March 2026.

**Is the mobile version limited compared to desktop?**
No. Coverage describes full feature parity — all three modes, same assets, same one-tap flow.

**Which assets are supported on mobile?**
BTC and ETH perpetual futures, matching web.

**Do I need to know anything about options to use PERPS+ on mobile?**
No. You select one of three modes and set a level. Aevo constructs and executes the position.

**What are the three modes again?**
*Limit My Loss* — downside capped at your level, upside uncapped, costs a premium. *Get Paid to Hold* — premium paid to you up front, profit capped. *Lock My Range* — both floor and ceiling fixed, close to zero net cost.

**Why does mobile availability matter for a derivatives product?**
Because more than 70% of retail crypto trades in 2026 happen on mobile. A desktop-only risk tool is unavailable to most retail traders in practice.

**Is this the same product as on web?**
Yes. Same mechanics, same modes, same assets. The release is about access, not function.

**Can I manage or close a PERPS+ position from the app?**
Position management sits alongside entry in the mobile app. Confirm the specific unwind mechanics — particularly early closure of the options leg — in Aevo's documentation before relying on it. That detail is not covered in launch materials.

**Does PERPS+ work on assets other than BTC and ETH?**
Not as of the mobile launch. BTC and ETH only.

**How does Aevo compare to Deribit for options?**
They are not in the same weight class. Deribit holds 85–90% of global BTC and ETH options open interest. Aevo leads the on-chain segment with a reported 79% share and over $10 billion in cumulative options volume since 2020. Aevo's differentiator is unified margin across perps and options on a decentralised venue, not scale.

**Is PERPS+ a structured product?**
Functionally, yes — it is Aevo's structured product line, packaging perps with options into a single defined-payoff trade. The word "structured product" just does not appear in the interface.

---

## Sources

- Post ID 2083191674344255953, timestamp decoded → 31 July 2026, 14:02:53 UTC
- [Aevo Brings One-Tap Protected Perps to Mobile With PERPS+ Launch — Chainwire via Investing.com](https://www.investing.com/news/cryptocurrency-news/aevo-brings-onetap-protected-perps-to-mobile-with-perps-launch-4799727)
- [Aevo Puts One-Tap Downside Protection in Traders' Pockets — Chainwire via Investing.com](https://www.investing.com/news/cryptocurrency-news/aevo-puts-onetap-downside-protection-in-traders-pockets-with-perps-on-mobile-4804902)
- [Aevo Extends PERPS+ to Mobile, Completing Full Platform Parity — CryptoDaily](https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity)
- [Aevo Makes Protected Perps Portable With PERPS+ on Mobile — DailyCoin](https://dailycoin.com/aevo-makes-protected-perps-portable-with-perps-on-mobile)
- [Best Crypto App in 2026: What Mobile Traders Actually Need — Phemex](https://phemex.com/academy/best-crypto-app-2026) — 70%+ mobile share
- [Options Market in Crypto Statistics 2026 — CoinLaw](https://coinlaw.io/options-market-in-crypto-statistics/) — Deribit open interest share
- [Exploring Derive's Record Options Surge — FalconX](https://www.falconx.io/newsroom/exploring-derives-record-options-surge) — Derive share of BTC options
- [An Anatomy of Retail Option Trading — Bogousslavsky & Muravyev](https://www.lsu.edu/business/files/event-files/2025-finance-mardi-gras/retail_option_trading_v2.pdf)

---

## Scoring

| Dimension | Score | Note |
|---|---|---|
| Information gain | 16/25 | The 70% mobile statistic reframes the story; no competing coverage makes the distribution argument |
| Proprietary data | 9/20 | Cited data combined into an original argument; nothing measured |
| Verifiability | 13/15 | Dates and figures attributed; unknowns flagged |
| Experience signals | 5/15 | App not used |
| Query coverage | 9/10 | |
| Structure / AUF | 9/10 | |
| Irreplaceability | 2/5 | |
| **Total** | **63/100** | Non-commodity, weak moat |

**To reach 80+:** open the app, place one PERPS+ trade in each mode, and publish annotated screenshots of the entry flow with the quoted premium and strike visible. Then run the on-chain query this article calls for — PERPS+ leg volume as a share of BTC and ETH perp volume, weekly, from the March web launch through the August mobile release. If the step change is real, this page becomes the source that proved it.
