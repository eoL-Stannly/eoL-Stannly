# Tokenized Stocks and Their Perps, Same Account: What Aevo's Ondo Listing Actually Enables

**Topic date:** 21 August 2026 · **Source post:** `x.com/aevoxyz/status/2090842637179691210`
**Commodity grade:** see [scorecard](scoring/commodity-scorecard.md) — **v2 score: 76/100 (non-commodity — the strongest of the four)**

> **Target query:** `can you short tokenized stocks` / `aevo ondo tokenized stocks` / `tokenized stock perps delta neutral`
> **Title tag:** Tokenized Stocks + Perps in One Account: Aevo's Ondo Listing
> **Meta description:** Six Ondo tokenized equities went live on Aevo on 7 August 2026 with matching perps on day one — enabling delta-neutral equity positions from a single on-chain account.

---

## Answer up front

Six Ondo Finance tokenized stocks went live on Aevo on **7 August 2026**: NVDAon, TSLAon, SPYon, QQQon, HOODon and GOOGLon. Aevo listed **matching perpetual futures for all six at the same time**.

That simultaneity is the whole story. A trader can hold the tokenized stock and short its perp from **one on-chain account**, running a delta-neutral position on a real-world asset from the first hour of listing. Each tokenized stock carries one-to-one backing by the underlying equity and settles on-chain.

This was Aevo's first integration of tokenized real-world equities. Aevo's zero-gas bridge moves Ondo assets from Ethereum mainnet to Aevo Chain without transaction fees.

Source: [FinanceFeeds — Ondo Finance Lands on Aevo](https://financefeeds.com/ondo-finance-lands-on-aevo/).

---

## Why "spot and perp on day one" is the non-obvious part

Most tokenized-equity listings give you the token and nothing else. You can hold it. You can sell it. That is the whole product.

Listing the perpetual alongside the spot token changes the position set available, immediately:

| Position | Requires | Available at Aevo listing? |
|---|---|---|
| Long the equity | Spot token | Yes |
| Short the equity | Perp | Yes |
| Delta-neutral carry (long spot, short perp) | Both, same margin account | Yes |
| Leveraged directional | Perp | Yes |

The third row is the one that does not exist on a token-only venue. Long spot plus short perp collects the funding differential while holding the asset. On a venue where the two legs live in separate accounts or separate platforms, that trade carries transfer risk, timing risk and duplicated collateral. On a unified margin account it does not.

Aevo's architecture — one margin account across options, perps and structured products on its own Ethereum layer-2 — is what makes the same-account version possible. The listing is an application of an existing design, not a new one.

## The wider tokenized-equity picture in mid-2026

Context that a single-listing announcement does not give you, and that changes how you read it.

- **Ondo Stocks** — rebranded from Ondo Global Markets in July 2026 — listed **more than 430 tokenized securities** and crossed **$1 billion in total value locked**.
- **Ondo Perps** went live on **7 July 2026**, exactly one month before the Aevo listing, offering up to **20x leverage** on equities, ETFs, commodities and indices, and allowing tokenized stock holdings to be posted directly as collateral.
- Tokenized equities were a crowded 2026 category. Crypto.com launched tokenized stocks in the EEA; eToro launched 24/5 trading, futures and tokenized stocks; Arbital shipped a unified Solana terminal covering memecoins, tokenized stocks and perps.

Sources: [FinanceFeeds](https://financefeeds.com/ondo-finance-lands-on-aevo/), [Ondo Finance — Introducing Ondo Perps](https://ondo.finance/blog/introducing-ondo-perps), [PRNewswire](https://www.prnewswire.com/news-releases/ondo-perps-launches-first-equity-perpetuals-platform-with-tokenized-stock-collateral-302819574.html).

The competitive read: Ondo built its own perps venue in July, then supplied its assets to a rival derivatives venue in August. Ondo is positioning as **collateral infrastructure** rather than as a destination exchange. Aevo is one distribution endpoint among several. That is a more useful framing than "partnership announced."

## The questions this raises that the coverage does not answer

Stating these openly is more valuable than pretending completeness.

**Corporate actions.** A tokenized share tracks a real instrument that splits, pays dividends and can be subject to tender offers. How each is handled is defined by the issuer's terms, not by the exchange listing it. Available sources do not specify Ondo's treatment. Read the issuer's disclosures before assuming economic equivalence to holding the share.

**Trading hours mismatch.** The underlying equities trade during exchange hours. The perps trade continuously. Between the close and the open, the perp is the only live price. Weekend gap risk on an equity perp is structurally different from weekend risk on BTC.

**Redemption path.** One-to-one backing is a claim about reserves. What matters operationally is who can redeem, under what conditions, and how quickly. Not specified in available sources.

**Access.** Aevo's mobile app is stated as unavailable to U.S. or U.K. persons, and the Philippine SEC took enforcement action against Aevo on 21 April 2026. Tokenized U.S. equities are among the most jurisdictionally sensitive products in crypto.

## The token side of the same period

Aevo spent 2026 tightening AEVO supply while widening the product surface.

| Item | Detail |
|---|---|
| One-time burn | 69M AEVO — 6.9% of total supply — January 2026 |
| Monthly buybacks | ~1M AEVO per month, from protocol revenue, following AGP-2/AGP-3 |
| August 2026 buyback | 1M AEVO, disclosed 4 September 2026 |
| Treasury LP distribution | ~674,000 USDC of liquidity-pool revenue to AEVO stakers, late August 2026 |

The treasury distribution landed in the same window as the 21 August post date. It is a plausible alternative subject for that post — see the verification note.

Sources: [Aevo governance — new buyback and burning system](https://agp.aevo.xyz/approved-proposals/agp-3-aevonomics/proposal/new-buyback-and-burning-system), [CryptoRank](https://cryptorank.io/news/aevo).

---

## FAQ

**What tokenized stocks are live on Aevo?**
Six Ondo Finance assets as of 7 August 2026: NVDAon (Nvidia), TSLAon (Tesla), SPYon (S&P 500 ETF), QQQon (Nasdaq-100 ETF), HOODon (Robinhood) and GOOGLon (Alphabet).

**Can I short a tokenized stock on Aevo?**
Yes. Aevo listed matching perpetual futures for all six assets at the same time as the spot tokens.

**What does "one-to-one backing" mean?**
Each tokenized stock is stated to be backed by one unit of the underlying equity. Verify redemption terms in the issuer's disclosures — backing and redeemability are separate questions.

**Can I run a delta-neutral position?**
Yes, from a single Aevo account. Hold the tokenized stock, short the corresponding perp. Both legs sit in the same margin account.

**Does it cost gas to bridge Ondo assets to Aevo?**
No. Aevo's zero-gas bridge moves Ondo assets from Ethereum mainnet to Aevo Chain without transaction fees.

**Do I receive dividends or voting rights?**
Not specified in any source reviewed for this article. Corporate-action treatment is set by the token issuer's terms. Do not assume equivalence to direct share ownership.

**What happens outside U.S. market hours?**
The underlying equity is closed; the perp continues trading. Price discovery in that window happens entirely in the perp, and gaps at the open are a real risk.

**How is this different from Ondo Perps?**
Ondo Perps is Ondo's own venue, live 7 July 2026, with up to 20x leverage and tokenized stocks usable as collateral. The Aevo listing puts Ondo's assets on a third-party derivatives exchange with unified margin across options, perps and spot. Ondo is supplying both.

**Who can trade these?**
Subject to Aevo's jurisdictional restrictions. U.S. and U.K. persons are excluded from the mobile app, and Aevo faced Philippine SEC enforcement in April 2026. Check your own jurisdiction first.

---

## Source and verification note

`x.com` is blocked by this environment's network egress proxy; the original post could not be read.

**Date-to-topic confidence: medium.** The post timestamp decodes to 21 August 2026 16:45 UTC. Two candidate subjects sit in that window: the Ondo tokenized-equity listing (live 7 August, two weeks earlier) and the treasury LP revenue distribution of ~674,000 USDC (late August). This article leads on the Ondo listing because it is the larger and better-documented event, and covers the treasury distribution in the token section. The mapping is an inference from date proximity, not a confirmed reading of the post.

All product facts, dates and figures are independently sourced. Open questions are marked as open rather than filled with plausible-sounding answers.

**Sources:**
- [FinanceFeeds — Ondo Finance Lands on Aevo With a Bold New Arsenal](https://financefeeds.com/ondo-finance-lands-on-aevo/)
- [Ondo Finance — Introducing Ondo Perps](https://ondo.finance/blog/introducing-ondo-perps)
- [PRNewswire — Ondo Perps Launches First Equity Perpetuals Platform With Tokenized Stock Collateral](https://www.prnewswire.com/news-releases/ondo-perps-launches-first-equity-perpetuals-platform-with-tokenized-stock-collateral-302819574.html)
- [Crypto Briefing — Ondo Perps equity perpetual futures launch](https://cryptobriefing.com/ondo-perps-equity-perpetual-futures-launch/)
- [Aevo Governance — New Buyback and Burning System](https://agp.aevo.xyz/approved-proposals/agp-3-aevonomics/proposal/new-buyback-and-burning-system)
- [CryptoRank — Aevo news](https://cryptorank.io/news/aevo)
- [CoinMarketCap — Latest Aevo updates](https://coinmarketcap.com/cmc-ai/aevo/latest-updates/)
