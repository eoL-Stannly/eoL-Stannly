# Aevo PERPS+: Options Protection on a Perp, in One Click

> **Source post:** [@aevoxyz, 23 March 2026, 11:00 UTC](https://x.com/aevoxyz/status/2036035408430084283)
> **Attribution note:** this post's visible text is a bare link. Its subject is inferred from timing and corroborating evidence — see *Why we attribute this post to PERPS+* below.
> **NCS: 58/100** — borderline. Scoring detail at the foot of this page.

---

## Answer up front

PERPS+ attaches an options strategy to a perpetual futures position in a single action. You pick a mode, set a level, and Aevo executes both legs together. You do not select strikes, compare expiries, or manage the option separately.

There are three modes. **Limit My Loss** caps your downside at a level you choose and leaves the upside completely uncapped. **Get Paid to Hold** pays you a premium immediately in exchange for a ceiling on your profit. **Lock My Range** fixes both the best and worst case before you enter, for close to zero net cost.

It launched on BTC and ETH perpetual futures. It is a structured product wearing a perp's interface.

---

## The problem PERPS+ is aimed at

Options are the right tool for defined-risk trading, and almost nobody in crypto uses them.

Options accounted for just **2.4% of total crypto derivatives volume** in the first half of 2026. The segment grew 12% year on year — real growth, tiny base. Meanwhile perpetual futures on DEXs alone did **$739.5 billion in January 2026**, an eightfold increase from $81.7 billion two years earlier.

The gap is not appetite. It is interface. Options markets require the trader to read implied volatility, open interest distribution and gamma exposure — data historically difficult for retail traders to interpret. The academic evidence is blunt: retail option losses increase with trade complexity, and retail investors use complex strategies markedly less often than non-retail investors. Fewer than 20% of retail traders adopt protective strategies even during earnings season, when the case for them is most obvious.

So the industry's read is that complexity is the barrier. PERPS+ takes the position that the fix is to remove the complexity from view rather than to make it more visible.

That is a design opinion, and it is worth naming as one. Hiding the strike selection makes the trade accessible. It also means the trader cannot audit whether the strike they were given was a good one.

## How the three modes work

### Limit My Loss

You set the maximum you are willing to lose. Downside is capped there. Upside stays fully open.

Mechanically this is a protective option leg on the perp — a put against a long, a call against a short. You pay a premium for it. The premium is the cost of the cap.

**Use it when:** you have conviction on direction but the position is larger than you would normally carry, or you cannot watch the screen.

### Get Paid to Hold

You receive a premium up front. In exchange, your profit is capped at a ceiling.

This is the covered-call shape. It converts the funding cost of holding a ranging position into immediate income.

**Use it when:** you expect the market to go sideways and the funding bleed is the thing actually killing the trade.

### Lock My Range

Both the floor and the ceiling are fixed before you enter, at close to zero net cost.

The premium you receive from selling the ceiling roughly pays for the floor you buy. This is a collar. You get a fully defined risk-to-reward ratio for approximately nothing up front.

**Use it when:** you want a known outcome distribution rather than a good expected value.

### The trade-off, stated plainly

There is no free protection. Limit My Loss costs a premium. Get Paid to Hold sells your tail. Lock My Range does both and nets to near zero. The question is never whether you are paying — it is whether the price you were quoted was fair, and that is the number PERPS+ deliberately does not put in front of you.

## Why we attribute this post to PERPS+

Stating the evidence, because we could not read the post directly.

1. The post's visible text on X is a bare `t.co` link with no accompanying copy. It points to an article or video, not to a written announcement.
2. Its timestamp decodes to 23 March 2026, 11:00:43 UTC.
3. Five days later, on 28 March 2026, Aevo announced Rewards Epoch 17 allocating **300,000 AEVO to PERPS+ users**. A reward epoch cannot target users of a product that does not exist. PERPS+ was therefore live before the end of March 2026.
4. Search engines associate this post ID with PERPS+ coverage.
5. Aevo's own later coverage states PERPS+ launched on web first and reached mobile in July 2026 — consistent with a March web launch.

The inference is strong but it is an inference. Treat the date attribution as high-confidence and the specific post content as unverified.

## How PERPS+ compares to what already exists

The concept is not unique. The packaging is.

| | Aevo PERPS+ | Bybit Perp Protect |
|---|---|---|
| Venue | Decentralised, Aevo L2 | Centralised |
| Mechanism | Options leg attached to a perp at entry | Buys a put for a long, a call for a short |
| Modes | Three (cap loss, sell upside, collar) | Protection only |
| Assets at launch | BTC, ETH perps | BTCUSDT, ETHUSDT, BTC-PERP, ETH-PERP |
| Upside sale | Available (Get Paid to Hold) | Not offered |
| Strike selection | Abstracted behind a mode | Algorithmic recommendation |

Bybit's version is a hedging add-on. Aevo's covers the full three-shape space — long protection, short volatility, and the collar between them — which is the part competitors have not matched.

## Where Aevo sits in the market

Context matters for judging whether this product can move the needle.

Aevo has processed more than **$10 billion in options volume since 2020**, and holds a reported **79% of the on-chain options market**. Within DeFi options, it leads.

That leadership is on a small board. **Deribit holds 85–90% of global BTC and ETH options open interest.** DeFi options volumes remain orders of magnitude below centralised venues.

On the perps side, decentralised exchanges took DEX perp market share from 2% in January 2024 to over 10% by January 2026, with Hyperliquid alone executing around 44% of on-chain perpetual volume.

Read together: Aevo is the largest player in a small on-chain options market, competing for perps flow in a market where one rival holds nearly half. PERPS+ is a bid to convert perps traders into options users — which is the only route to growing the options side that does not require taking share from Deribit head-on.

## What we could not verify

Listed openly, because a page that hides its gaps is less useful than one that marks them.

- The premium quoted for each mode, and how it compares to constructing the same position manually on Aevo's own options book
- Expiry mechanics: tenor of the attached option, and what happens if the perp is closed before the option expires
- Whether the position can be unwound partially
- Fee treatment of the options leg relative to a standalone options trade
- Liquidity depth backing the quoted strikes

Every one of these is answerable by placing a single trade. That is the next iteration of this article.

---

## FAQ

**What is Aevo PERPS+?**
A one-click product that attaches an options strategy to a perpetual futures position at entry. Three modes: Limit My Loss, Get Paid to Hold, Lock My Range.

**Which assets support PERPS+?**
BTC and ETH perpetual futures at launch.

**Do I need to understand options to use it?**
No. That is the design goal — the trader selects a mode and a level, and Aevo builds the position. You should still understand what you are giving up, which the mode descriptions above spell out.

**Does PERPS+ cost anything?**
Yes, though it varies by mode. Limit My Loss costs a premium. Get Paid to Hold pays you one. Lock My Range is close to zero net cost because the two roughly offset. Exact quotes were not published at launch.

**How is Limit My Loss different from a stop loss?**
A stop loss is a market order that fires at a price. It can slip badly in a fast move and it can be wicked out by a brief spike. An options floor pays out based on price at expiry and cannot be gapped through in the same way. The floor costs a premium; the stop is free. That is the trade.

**Is Get Paid to Hold the same as a covered call?**
Structurally, yes — you sell upside for premium. The difference is that the underlying is a perpetual futures position, so funding also affects your PnL.

**What is Lock My Range?**
A collar. You buy a floor and sell a ceiling, and the premiums roughly cancel. Best and worst case are both fixed before entry.

**Is PERPS+ available on mobile?**
Yes, since July 2026. It launched on web first.

**How does this compare to Bybit Perp Protect?**
Perp Protect offers downside protection only, on a centralised venue. PERPS+ offers protection, premium-collection and collars on a decentralised one. See the comparison table above.

**Can I still get liquidated with PERPS+?**
The position is still a leveraged perpetual futures position. Treat the options leg as reducing your loss at settlement, not as removing margin risk during the trade. Confirm the specific margin treatment in Aevo's documentation before sizing up.

**Does PERPS+ activity earn rewards?**
Yes. Rewards Epoch 17, live from 28 March 2026, allocated 300,000 AEVO specifically to PERPS+ users, alongside 700,000 AEVO to crypto perpetual futures markets.

**Who is PERPS+ actually for?**
Aevo names two profiles: perps traders who have never touched options and want one-click protection on a trade they were already making, and DeFi vault depositors who want vault-like payoff structures without accepting fixed vault terms.

---

## Sources

- Post ID 2036035408430084283, timestamp decoded → 23 March 2026, 11:00:43 UTC
- Post ID 2038640223111053730 — Rewards Epoch 17, 300,000 AEVO to PERPS+ users
- [Aevo documentation — Options made easy](https://www.aevo.xyz/docs/aevo-products/aevo-perps+/options-made-easy)
- [Aevo Brings One-Tap Protected Perps to Mobile With PERPS+ Launch — Chainwire via Investing.com](https://www.investing.com/news/cryptocurrency-news/aevo-brings-onetap-protected-perps-to-mobile-with-perps-launch-4799727)
- [Aevo Solves the Interface Problem That Kept Retail Traders Away From Options](https://cryptodirectories.com/news/aevo-solves-the-interface-problem-that-kept-retail-traders-away-from-options/)
- [Introduction to Perpetual Protect — Bybit](https://www.bybit.com/en/help-center/article/Introduction-to-Perpetual-Protect)
- [An Anatomy of Retail Option Trading — Bogousslavsky & Muravyev](https://www.lsu.edu/business/files/event-files/2025-finance-mardi-gras/retail_option_trading_v2.pdf) — complexity and retail losses
- [Options Market in Crypto Statistics 2026 — CoinLaw](https://coinlaw.io/options-market-in-crypto-statistics/) — Deribit share
- [DEX Perpetuals Hit 10.2% Market Share — BlockEden](https://blockeden.xyz/blog/2026/03/07/dex-perpetuals-market-share-growth/) — perp DEX volume figures

---

## Scoring

| Dimension | Score | Note |
|---|---|---|
| Information gain | 15/25 | Bybit comparison and the market-position framing are additive; core mechanics are widely covered |
| Proprietary data | 7/20 | No original measurement |
| Verifiability | 12/15 | Attribution reasoning shown explicitly; unverified items listed |
| Experience signals | 4/15 | Product not used |
| Query coverage | 9/10 | |
| Structure / AUF | 9/10 | |
| Irreplaceability | 2/5 | |
| **Total** | **58/100** | Borderline |

**To reach 80+:** place one trade in each mode on BTC and publish the premium quoted, the strike offered, the fill time and the total fee. Then build the same position manually on Aevo's options book and publish the price difference. That single comparison — *what does the convenience cost?* — is the question every serious reader has and nobody has answered.
