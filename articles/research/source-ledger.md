# Source Ledger — Aevo / PERPS+ article set

Every material claim used across the four articles, with its source and reliability tier
(see the [rubric](../scoring/non-commodity-rubric.md#source-reliability-tiering)).

**Collection method for v1:** web search only. Direct page fetching was blocked by this
environment's network egress proxy for every domain attempted, including `x.com`,
`docs.aevo.xyz`, `investing.com`, `cryptodaily.co.uk`, `dailycoin.com`,
`coinmarketcap.com` and `en.wikipedia.org`. Facts below were therefore taken from search
result summaries, not from reading the pages. **Everything marked "unverified against
primary source" must be re-checked from the source URL before publication.**

---

## A. The four source posts

| # | URL | Posted (UTC, derived from the post ID) | Content read? |
|---|---|---|---|
| 1 | `x.com/aevoxyz/status/2029965683056930907` | 2026-03-06 17:01 | **No — blocked** |
| 2 | `x.com/aevoxyz/status/2036035408430084283` | 2026-03-23 11:00 | **No — blocked** |
| 3 | `x.com/aevoxyz/status/2083191674344255953` | 2026-07-31 14:02 | **No — blocked** |
| 4 | `x.com/aevoxyz/status/2090842637179691210` | 2026-08-21 16:45 | **No — blocked** |

Timestamps are computed from the Twitter/X snowflake ID: `((id >> 22) + 1288834974657)`
milliseconds since epoch. That arithmetic is deterministic and does not require reading
the posts.

Search did surface post 2 in an index as `Aevo on X: "https://t.co/y02Nt3MoT4"`, i.e. a
bare-link post. The destination could not be resolved.

**Topic reconstruction.** The four articles in this repository are built from the cluster
of Aevo coverage that sits in the same date range as the posts. That cluster is:

- "Aevo, the decentralized exchange making perps position protection simple with options" (CaptainAltcoin)
- "Aevo Solves the Interface Problem That Kept Retail Traders Away From Options" (CryptoDirectories)
- "Aevo Brings One-Tap Protected Perps to Mobile With PERPS+ Launch" (Chainwire, syndicated)
- "Aevo Extends PERPS+ to Mobile, Completing Full Platform Parity" (CryptoDaily / CoinDesk.cc)
- "Aevo Makes Protected Perps Portable With PERPS+ on Mobile" (DailyCoin)
- "What the Plus in PERPS+ Means: How Aevo Is Making Crypto Options Usable" (The Bit Times)

**The mapping of a given article to a given post is inferred, not confirmed.** Confirm it
before publishing anything that claims to be a rewrite of a specific post.

---

## B. Aevo — platform and history

| ID | Claim | Source | Tier | Status |
|---|---|---|---|---|
| F1 | Aevo is a decentralised derivatives exchange running options, perpetual futures, pre-launch token futures and structured products from one cross-margin account | Chainwire PR, syndicated | C | Company's own claim |
| F2 | "More than $10 billion in options volume since 2020" | Chainwire PR | C | Company's own claim; the 2020 start date is the Ribbon Finance lineage, not Aevo itself |
| F3 | Ribbon Finance options vaults processed over $10B in options volume, hit an ATH TVL above $350M, and earned depositors over $50M in premiums | Ribbon Finance docs | A | Unverified against primary source |
| F4 | Aevo first launched June 2023, built by the Ribbon Finance team | CoinMarketCap Academy; The Block | B | Unverified against primary source |
| F5 | Aevo runs a custom OP Stack L2 with off-chain order matching and on-chain settlement | CoinMarketCap Academy; Gate Learn | B | Unverified against primary source |
| F6 | Aevo facilitated over $30B in trading volume within months of launch | Gate Learn | C | Unverified |
| F7 | 2026 product additions included equity futures and HYPE options | Aggregator summaries | C | **Weak. Do not publish without confirmation.** |

## C. PERPS+

| ID | Claim | Source | Tier | Status |
|---|---|---|---|---|
| F8 | PERPS+ offers three modes: Limit My Loss, Get Paid to Hold, Lock My Range | Chainwire PR | C | Company's own claim |
| F9 | Limit My Loss defines maximum loss at entry; downside capped, upside fully open | Chainwire PR | C | Company's own claim |
| F10 | Get Paid to Hold pays an upfront premium in exchange for a defined profit ceiling | Chainwire PR | C | Company's own claim |
| F11 | Lock My Range sets a floor and a ceiling for approximately zero net cost | Chainwire PR | C | Company's own claim |
| F12 | PERPS+ is available on BTC and ETH perpetual futures | Chainwire PR | C | Company's own claim |
| F13 | Aevo selects the level; Aevo handles structuring, pricing and execution in one tap | Chainwire PR | C | Company's own claim |
| F14 | PERPS+ reached mobile in July 2026, bringing mobile to feature parity with desktop | CryptoDaily (dated `/2026/07/`), DailyCoin, Chainwire | C | Date corroborated by URL path only |
| F15 | App available on the App Store and Google Play; not available to U.S. or U.K. persons | Chainwire PR | C | Company's own claim. **Jurisdiction restriction must be verified before republishing.** |

## D. Options structures (textbook, independently checkable)

| ID | Claim | Source | Tier |
|---|---|---|---|
| F16 | A collar = long put + short call; the call premium finances the put | dYdX Learn; Bybit Learn; Delta Exchange | B |
| F17 | A zero-cost collar is not free — it swaps upside for downside insurance | dYdX Learn | B |
| F18 | Perpetual funding is typically exchanged every 8 hours and is the recurring carry cost of a perp hedge | Kraken Learn; Mudrex | B |

## E. Market context

| ID | Claim | Source | Tier | Status |
|---|---|---|---|---|
| F19 | Crypto options trade roughly $2B/day — about 0.06% of crypto's ~$3T market cap, roughly 10x lower than equities on a relative basis | Variant Fund, "Putting All Your Calls in One Basket" | B | Unverified against primary source |
| F20 | Retail adoption of options in crypto is "effectively zero" | Variant Fund | B | Direct quote per search summary |
| F21 | DEXs carry upwards of 20% of crypto spot volume, but nearly all options activity still runs through CEXs like Deribit | Variant Fund | B | Unverified |
| F22 | The success of 0DTE options in TradFi is largely explained by improving UX — removing or simplifying the time dimension | Variant Fund | B | Unverified |
| F23 | On 10 Oct 2025 over $19B of leveraged perpetual positions were force-liquidated in a single day — the largest such event on record | Datawallet / CoinPerps statistics pages | C | **Widely reported; verify against a Tier A/B source before publishing** |
| F24 | Bitcoin saw about $1B in liquidations in 24 hours on 5 Feb 2026 | Datawallet / CoinPerps | C | Unverified |
| F25 | In 2025 the top ten crypto perp exchanges processed $92.9T in volume, up 64.6% year on year | Datawallet / CoinPerps | C | Unverified |
| F26 | Crypto perpetual futures volume reached a daily peak near $750B | Datawallet / CoinPerps | C | Unverified |
| F27 | Deribit retained over 90% of the Ethereum options market through 2025 | KuCoin research blog | C | Unverified |
| F28 | IBIT options open interest hit $27.61B in April 2026, passing Deribit's $26.9B — the first month a regulated US venue led offshore BTC options OI | KuCoin research blog; CoinDesk | B | Unverified |
| F29 | Mid-2026 Deribit OI reached $31.3B against IBIT's $27B, per checkonchain | KuCoin research blog | C | Unverified |
| F30 | Bybit Perp Protect programmatically buys a put against a long perp or a call against a short perp; cost starts near 2% of initial margin | CoinSpot.io; Bybit Learn | C | **Competitor claim. Verify the 2% figure — it is the sharpest comparison number in the set.** |

## F. Retail options behaviour

| ID | Claim | Source | Tier | Status |
|---|---|---|---|---|
| F31 | 70–80% of retail options traders lose money over a rolling 12-month period; 73% is the most commonly cited figure | OptionScout 2026 report, citing academic literature | C | **Verify against MIT Sloan / Bogousslavsky & Muravyev before publishing** |
| F32 | Retail investors lose substantially in options markets | MIT Sloan, "Retail investors lose big in options markets" | B | Unverified |
| F33 | Complexity is a barrier: investors make more behavioural mistakes in complex settings and learn to avoid them only with experience | Bogousslavsky & Muravyev, "An Anatomy of Retail Option Trading" | B | Unverified |
| F34 | Robinhood cut commission and contract fees on complex (multi-leg) options to zero in 2018; complex options reached nearly 20% of retail options trades by July 2022; complex options trades rose more than 75.4% relative to options on other stocks | Bogousslavsky & Muravyev | B | Unverified |
| F35 | Cboe published research on retail investors' dynamic trading behaviour in the US options market (2024) | Cboe government-relations PDF | A | Unverified |

## G. AEVO token

| ID | Claim | Source | Tier | Status |
|---|---|---|---|---|
| F36 | 69M AEVO (6.9% of supply) burned on 9 Jan 2026 under proposal AGP-3 | Aevo governance portal; Bitget News | A/C | Unverified against AGP-3 text |
| F37 | Circulating supply approximately 916M after the burn | CoinLaunch | C | Unverified |
| F38 | Monthly buyback-and-burn scaled to platform volume tiers; tiers reviewable monthly by the DAO | AGP-3 | A | Unverified |
| F39 | sAEVO stakers receive a share of accumulated Uniswap V3 LP fees; 69% of accumulated LP fees distributed annually at end of June | Aevo docs | A | Unverified |
| F40 | Approximately 674k USDC of treasury LP revenue scheduled for distribution to stakers in late August 2026 | Aevo docs; aggregator summaries | A/C | Unverified. **Date-adjacent to source post 4.** |

## H. Search-quality references

| ID | Claim | Source | Tier |
|---|---|---|---|
| F41 | Google patent US11354342B2 "Contextual estimation of link information gain", filed 2018, granted June 2022, inventors Victor Carbune and Pedro Gonnet Anders, expiry 14 June 2039 | Google Patents | A |
| F42 | An information gain score is "indicative of additional information that is included in the document beyond information contained in documents that were previously viewed by the user" | US11354342B2 | A |
| F43 | Google's helpful-content self-assessment opens with "Does the content provide original information, reporting, or analysis?" | Google Search Central | A |
| F44 | Google's scaled content abuse policy targets pages produced mainly to manipulate rankings; the test is the primary purpose of the pages, not raw page count | Google Search Central spam policies | A |

---

## Verification queue for the next run

Ordered by how much damage an error would do:

1. **F30 (Bybit Perp Protect ~2% of initial margin).** This is the only direct cost
   comparison in the set. Sourced to one aggregator.
2. **F15 (US/UK availability).** A jurisdiction claim. Wrong is a compliance problem.
3. **F31 (73% of retail options traders lose money).** Load-bearing in article 2. Sourced
   to a vendor blog citing academics. Get the academic figure directly.
4. **F23 (the $19B October 2025 liquidation day).** Load-bearing in article 1.
5. **F7 (equity futures, HYPE options).** Weakest claim in the set. Drop it or confirm it.
6. **The post-to-article mapping in section A.** Everything downstream rests on it.
