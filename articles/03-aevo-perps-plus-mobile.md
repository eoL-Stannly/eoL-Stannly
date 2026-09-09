# PERPS+ on Mobile: Aevo Closes the Last Gap Between Its App and Its Desktop Exchange

> **Source post:** https://x.com/aevoxyz/status/2083191674344255953 — posted 31 July 2026, 14:02 UTC
> **Rewrite pass:** v2 · **Non-Commodity Score:** 74/100 · **Class:** Non-commodity

---

## The answer, up front

In late July 2026 Aevo shipped PERPS+ to its mobile app. That completed feature parity:
the phone now does everything the desktop exchange does. The practical consequence is
narrow and specific — a trader can now set a loss floor on a BTC or ETH perp from a phone,
in one tap, without opening a laptop. Given that crypto's largest liquidation cascades
happen in minutes, the device you can reach in thirty seconds is the one that matters.

---

## What shipped

PERPS+ became available on Aevo's mobile app, with the same three protection modes
available on web: Limit My Loss, Get Paid to Hold, and Lock My Range. **[P]**

Aevo framed the release as full platform parity. The mobile app now matches desktop
feature for feature. **[S]**

PERPS+ had launched on web first, in March 2026. Mobile followed roughly four months
later. **[S]**

## The parity checklist

| Capability | Desktop | Mobile after July 2026 |
|------------|---------|------------------------|
| Perpetual futures | Yes | Yes |
| Options | Yes | Yes |
| Structured products | Yes | Yes |
| Cross-margin account | Yes | Yes |
| PERPS+ protection modes | Yes | Yes |
| Pre-launch token futures | Yes | Yes |

Aevo's mobile app is available on iOS. It is **not** available in the US or the UK. **[S]**
That restriction is the single most important qualifier in this entire story and it is
missing from most of the coverage.

## Why parity is the story, not the feature

Feature-parity announcements usually deserve a changelog line, not an article. This one is
different for one reason: PERPS+ is a *time-sensitive risk* product, and risk decisions do
not wait for a desk.

The scale of the timing problem is documented.

- The on-chain perp market runs at roughly **$21 billion a day**. **[S]**
- On **10 October 2025**, more than **$19 billion** in leveraged positions were liquidated
  within 24 hours, hitting roughly **1.62 million accounts**. **[S]**
- Liquidation cascades are self-reinforcing: forced closures accelerate the price move,
  which forces more closures. **[S]**
- Between **70% and 97%** of participants in perpetual futures markets lose money over
  time. **[S]**

A protection tool that only exists on desktop is a protection tool that is unavailable
during exactly the events it was built for.

## Where this sits in the perp DEX landscape

Aevo is not competing for raw perp volume. The 2026 numbers make that obvious.

| Venue | 30-day perp volume (mid-2026) | Share |
|-------|-------------------------------|-------|
| Hyperliquid | ~$245 billion **[S]** | ~36–44% of on-chain perp volume, depending on methodology **[S]** |
| Aster | ~$61.4 billion **[S]** | — |
| Lighter | ~$45.0 billion **[S]** | — |

Perp DEXs collectively captured around **26% of the futures market** by January 2026.
**[S]**

Aevo's position is different in kind. It is the venue where options, perps and structured
products share one cross-margin account, with over **$10 billion in options volume since
2020** and over **$30 billion** in cumulative trading volume across the platform. **[P]**

Read against that landscape, mobile PERPS+ is not an attempt to out-volume Hyperliquid. It
is an attempt to make Aevo's actual differentiator — options-native risk shaping —
available at the moment of decision.

## What to check before you rely on it

1. **Geography.** The app is unavailable in the US and UK. Confirm your jurisdiction
   first. **[S]**
2. **Markets.** PERPS+ covers BTC and ETH perps. **[S]**
3. **Pricing.** Protection cost varies with implied volatility and the level you set. The
   mobile ticket is the only accurate quote.
4. **Margin.** The perp leg still runs under Aevo's margin framework. Bounding your loss
   through an options structure is not the same as removing margin mechanics. **[P]**

## Frequently asked questions

### Is PERPS+ available on the Aevo mobile app?
Yes. PERPS+ shipped to mobile in late July 2026, with the same three protection modes
available on desktop.

### Does the Aevo app do everything the website does?
Yes, as of the July 2026 release. Aevo describes the mobile experience as matching desktop
feature for feature.

### Which platforms is the Aevo app on?
The Aevo app is available on iOS. It is not available in the US or the UK. **[S]**

### Can I set a stop-loss equivalent from my phone on Aevo?
You can set something stronger. Limit My Loss defines your maximum loss at entry as an
options structure rather than a resting order, so it does not depend on getting a fill in a
fast market.

### Which assets support PERPS+ on mobile?
BTC and ETH perpetual futures.

### Did PERPS+ launch on mobile first?
No. It launched on web in March 2026 and reached mobile in late July 2026.

### Is trading on mobile riskier than desktop?
The instrument risk is identical. The behavioural risk is not. Phones make it easier to
open positions impulsively and easier to close them in a panic. If you use the app, decide
your protection level before you open the ticket, not during a drawdown.

### Do I earn the same rewards trading from mobile?
Rewards on Aevo are account-level, not device-level. Aevo has run weekly reward epochs of
1,000,000 AEVO, weekly USDC cashback funded by trading fees, and a year-end USDC
distribution to qualifying stakers. **[S]** See the companion article on Aevo's leaderboard
and year-end distribution for the qualification thresholds.

### What is Aevo?
Aevo is a decentralised derivatives exchange running options, perpetual futures and
structured products in a single cross-margin account, on the Aevo L2 — a custom Ethereum
rollup built on the OP Stack supporting over 5,000 transactions per second. **[P]**

---

## Editorial scorecard

| Dimension | Max | v1 | v2 | Notes |
|-----------|-----|----|----|-------|
| Information gain | 25 | 14 | 18 | The US/UK restriction and the perp DEX volume context are absent from the press-wire cluster |
| First-hand evidence | 20 | 4 | 8 | Parity checklist is constructed, not verified on-device |
| Verifiable specificity | 15 | 12 | 13 | All figures dated; two conflicting share figures given rather than averaged |
| Decision utility | 15 | 10 | 13 | "What to check before you rely on it" gives four concrete pre-flight checks |
| Entity and topical authority | 10 | 9 | 9 | Competitive landscape correctly positioned |
| Freshness and date anchoring | 10 | 8 | 9 | July 2026 anchored throughout |
| Distinct thesis | 5 | 4 | 4 | "Parity matters because risk tools must be reachable in a cascade" is not being argued elsewhere |
| **Total** | **100** | **61** | **74** | **Non-commodity** |

### What is required to push this past 80

1. **Screenshot the mobile PERPS+ flow.** Every tap, in order. The press-wire cluster has
   no screenshots at all. This is the single highest-value addition available.
2. **Time it.** Count the seconds from app-open to protected position on mobile versus
   desktop. A measured number turns a claim into evidence.
3. **Confirm Android.** Every source found refers to iOS. State the Android status
   definitively either way.
4. **Verify the geo-restriction currently.** The US/UK exclusion needs an as-of date and a
   primary source before publication.
5. **Name the app version and release date.** Precise versioning is a durable
   first-hand signal.

### Where the current SERP is weak

This topic has the most competing coverage of the four — Investing.com, DailyCoin,
CryptoDaily, CoinDesk mirrors, Pluang and CaptainAltcoin all ran the same Chainwire
release within days. Ranking against near-duplicate syndication is not a depth problem, it
is a *differentiation* problem: identical copy across many domains means none of them holds
a strong topical claim. Screenshots, timings and the geo-restriction detail are enough to
separate from all of them.

---

## Sources

- Aevo — https://www.aevo.xyz/
- Aevo Documentation — https://docs.aevo.xyz/
- CryptoDaily, Aevo extends PERPS+ to mobile — https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity
- DailyCoin, protected perps on mobile — https://dailycoin.com/aevo-makes-protected-perps-portable-with-perps-on-mobile
- CryptoSlate, the $21B/day perp market — https://cryptoslate.com/on-chain-options-close-in-on-cryptos-21b-a-day-perp-market-to-deepen-liquidity-everywhere/
- 21Shares, the perpetual DEX wars — https://www.21shares.com/en-eu/insights/the-perpetual-dex-wars-hyperliquid-aster-and-lighter-in-focus
- BlockEden, perp DEX wars of 2026 — https://blockeden.xyz/blog/2026/01/29/perp-dex-wars-2026-hyperliquid-lighter-aster-edgex-paradex-decentralized-derivatives/
- Crypto Briefing, US day traders and perpetual futures — https://cryptobriefing.com/us-day-traders-crypto-perpetual-futures/
- MetaMask, perpetual futures liquidation mechanics — https://metamask.io/news/perpetual-futures-liquidation-mechanics
