# Aevo's Leaderboard and the 808,800 USDC Question

> **Source post:** [@aevoxyz, 21 August 2026, 16:45 UTC](https://x.com/aevoxyz/status/2090842637179691210)
> **NCS: 68/100** — non-commodity, weak moat. Scoring detail at the foot of this page.

---

## Answer up front

Aevo launched a permanent leaderboard and moved its treasury USDC distribution from late August 2026 to the end of December 2026. The projected pool rose from **674,000 USDC to approximately 808,800 USDC** — a 20% increase.

The leaderboard shows every trader their live trading volume, current staking tier and projected year-end USDC reward, updating in real time. It is not a campaign. It stays on the platform.

To qualify for the year-end payout you need two things at once: an active **COMMANDER or LEGEND** stake on the distribution date, and **10 million USD in cumulative trading volume** across perps and options accumulated since 1 January 2026.

The deferral is the part worth thinking about. Four extra months of Uniswap V3 LP fee accrual bought stakers 20% more — but it also bought Aevo four extra months of locked supply. Both things are true.

---

## What the leaderboard actually changes

Reward programmes normally work in the dark. You trade, you stake, you wait, and you find out what you earned when the distribution lands.

The leaderboard removes the wait. Every trader can open the platform and see their exact projected reward on their own account, live. Volume, tier and projected USDC update continuously as they trade and stake.

That is a behavioural instrument, not a UI improvement. A trader who can see they are 1.2 million USD short of the 10 million volume threshold, with a number attached, behaves differently from a trader who cannot see the gap. The mechanism is the same one that makes loyalty tiers work in every other industry: make the next tier visible and quantified.

## The three reward streams, kept separate

Aevo runs three programmes simultaneously. Confusing them is the most common error in coverage of this announcement.

| Stream | Pays | Frequency | Funded by |
|---|---|---|---|
| Trading epochs | 1,000,000 AEVO | Weekly | DAO treasury |
| Trading cashback | USDC | Weekly, per epoch | Exchange trading fees |
| Year-end distribution | ~808,800 USDC projected | Annually, end of December | Treasury Uniswap V3 LP fee income |

They are independent. Qualifying for one does not qualify you for another. The 10 million volume threshold and the staking tier requirement apply to the **year-end distribution only**.

Note the funding sources differ, and that matters for durability. Epoch rewards spend treasury tokens. Cashback recycles fees the exchange already earned. The year-end pool comes from LP fee income the treasury generates as a liquidity provider — the only one of the three that is genuinely external revenue rather than redistribution.

## What we can derive from the two numbers

Here is a calculation nobody else has published. Method stated so you can check it.

**Verification:** 808,800 ÷ 674,000 = 1.1999. The stated 20% increase is exact, not rounded loosely. The two figures are internally consistent.

**Implied accrual rate:** deferring the distribution from late August to end of December is roughly four months. The pool grew by 134,800 USDC over that period.

134,800 ÷ 4 = **approximately 33,700 USDC per month** of additional LP fee accrual.

Annualised, that implies an LP fee run-rate of roughly **404,000 USDC per year** on the treasury's Uniswap V3 position.

**Assumptions, stated:** this treats the entire increase as newly accrued fees over four months, at a constant rate. It ignores any change in the underlying LP position size, any repricing of the assets in the pool, and any variation in trading activity across those months. LP fee income scales with volume, so a busy autumn would push the real figure higher and a quiet one lower. Treat 404,000 USDC per year as an order-of-magnitude estimate, not a forecast.

**Why it is useful anyway:** it gives you a sanity check on what the 2027 distribution might look like, and it tells you the treasury's LP position is producing a few hundred thousand dollars a year rather than a few million. That scales the programme honestly.

## How the staking tiers work

Two tiers qualify. Both are lock commitments.

- **COMMANDER** — eight-month lock
- **LEGEND** — twelve-month lock

The tier is granted on the day you lock, not after a waiting period. That removes the usual disincentive where a staker earns nothing during a ramp-in window.

There is one mechanic worth knowing, because it is genuinely forgiving and rarely mentioned. If your stake expires, or your tier drops below COMMANDER, **the volume counter stops accruing but does not reset**. Re-stake to COMMANDER or LEGEND and accrual resumes from where it stopped.

Practically: an accidental lapse costs you the time, not the progress. Someone at 8 million USD of accumulated volume who lets a stake expire does not go back to zero.

## Reading the deferral honestly

Coverage framed the change as a 20% bonus. That is accurate and incomplete.

**What stakers gained:** 134,800 USDC more in the pool.

**What Aevo gained:** four additional months during which qualifying holders must keep AEVO locked in an eight- or twelve-month commitment to remain eligible. Moving the qualification date forward extends the required lock window for everyone chasing the payout.

**Why that is not a criticism:** the incentives are aligned in a reasonable way. Longer locks reduce circulating supply, and the payout is real, external revenue. But a reader deciding whether to lock for eight months should understand that they are being paid for duration, and price the lock accordingly.

## Where this fits in Aevo's 2026 token programme

The distribution is one part of a wider restructuring under AGP-3, the governance proposal known as Aevonomics.

- **January 2026** — one-time burn of **69 million AEVO**, 6.9% of total supply
- **Ongoing** — monthly buybacks and burns funded from a portion of protocol revenue
- **2026** — a new governance portal for community proposals and voting
- **Weekly** — 1,000,000 AEVO per epoch to traders, split 700,000 to perps and 300,000 to a featured market type
- **Reported staking APRs** — up to 295.5% during Epoch 17, 271.6% during Epoch 20

Those APR figures are the ones to be most careful with. They are denominated in AEVO and move inversely with total staked value. A high nominal APR paid in a token you are contractually unable to sell for eight months is not the same thing as a high return.

## The number to check in January 2027

The 808,800 figure is a **projection**, not a commitment. It depends on LP fee income between now and the end of December.

The honest test of this programme is the delta between projection and payment. Anyone tracking Aevo should record the projection now and compare it to the actual distribution when it lands. That comparison is worth more than any amount of launch coverage.

---

## FAQ

**How much USDC will Aevo distribute at year-end 2026?**
Approximately 808,800 USDC is projected — 20% above the 674,000 USDC originally scheduled for late August 2026. It is a projection, not a guaranteed figure.

**Why was the August distribution moved to December?**
The distribution was restructured to pay once annually at the end of December. The four-month deferral allowed additional LP fee accrual, which is where the 20% increase comes from.

**Who qualifies for the year-end distribution?**
You need both an active COMMANDER or LEGEND tier stake on the distribution date, and at least 10 million USD in cumulative trading volume across perps and options since 1 January 2026.

**What is the difference between COMMANDER and LEGEND?**
Lock duration. COMMANDER requires an eight-month lock; LEGEND requires twelve months. The tier applies from the day you lock.

**What happens if my stake expires before the distribution?**
Your accumulated volume stops accruing but is not reset. Re-staking to COMMANDER or LEGEND resumes accrual from where it stopped. You must hold a qualifying tier on the distribution date itself to receive the payout.

**Where does the USDC come from?**
The protocol treasury's Uniswap V3 LP fee income. It is external revenue the treasury earns as a liquidity provider, not a token emission.

**What is the Aevo leaderboard?**
A permanent on-platform leaderboard showing each trader their live trading volume, staking tier and projected year-end USDC reward, updating in real time. It is not a limited-time campaign.

**Is the leaderboard a competition?**
It functions primarily as a progress tracker against the 10 million volume threshold rather than a winner-takes-all contest. The year-end distribution pays every qualifying staker.

**How many reward programmes does Aevo run?**
Three, independently: weekly trading epochs paying 1,000,000 AEVO, weekly USDC cashback from exchange trading fees, and the annual year-end USDC distribution.

**Are the advertised staking APRs realistic?**
The reported figures — up to 295.5% in Epoch 17 and 271.6% in Epoch 20 — are AEVO-denominated and vary inversely with total staked value. They are not USD returns, and the rewards sit behind an eight- or twelve-month lock. Price the lock and the token risk before treating the APR as a yield.

**Does the 69 million AEVO burn affect this?**
Not directly. The January 2026 burn removed 6.9% of total supply and sits under the same AGP-3 governance package, alongside monthly buybacks and burns funded from protocol revenue. It changes token supply, not distribution eligibility.

**What is the realistic annual size of the LP fee pool?**
Deriving from the disclosed figures — a 134,800 USDC increase over roughly four months — implies about 33,700 USDC per month, or roughly 404,000 USDC annualised. That is an estimate with stated assumptions, not an Aevo figure. See the derivation above.

---

## Sources

- Post ID 2090842637179691210, timestamp decoded → 21 August 2026, 16:45:05 UTC
- [Aevo Launches Leaderboard With an 808,800 USDC Projected Reward — Coindoo](https://coindoo.com/aevo-launches-leaderboard-with-an-808800-usdc-projected-reward/)
- [Treasury LP Revenue Distribution — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution)
- [Staking — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking)
- [Latest Aevo News — CoinMarketCap](https://coinmarketcap.com/cmc-ai/aevo/latest-updates/) — 674,000 USDC August schedule
- [New Buyback and Burning System — Aevo Governance Proposals (AGP-3)](https://agp.aevo.xyz/approved-proposals/agp-3-aevonomics/proposal/new-buyback-and-burning-system)
- [Aevo Token Burn: The Strategic 69 Million Token Reduction — Bitget News](https://www.bitget.com/news/detail/12560605139155)
- Post ID 2038640223111053730 — Rewards Epoch 17 allocation and staking APR
- Arithmetic in "What we can derive from the two numbers" performed by the author from the two published figures; assumptions disclosed inline

---

## Scoring

| Dimension | Score | Note |
|---|---|---|
| Information gain | 18/25 | The implied LP fee run-rate derivation and the duration-lock reading appear in no competing coverage |
| Proprietary data | 11/20 | Original calculation with disclosed method on public inputs; still no measured data |
| Verifiability | 13/15 | Every figure attributed; the derivation is reproducible and its assumptions are stated |
| Experience signals | 5/15 | Leaderboard not used; no account staked |
| Query coverage | 9/10 | Twelve FAQs including the "are the APRs realistic" question competitors avoid |
| Structure / AUF | 9/10 | |
| Irreplaceability | 3/5 | The derivation would be lost with the page |
| **Total** | **68/100** | Non-commodity, weak moat — highest in this set |

**To reach 85+:** query the treasury's Uniswap V3 position directly and publish the actual monthly LP fee income, replacing the estimate with a measurement. Then screenshot the leaderboard from a real account showing tier, volume and projected reward. Finally, set a January 2027 reminder to publish the actual distribution against the 808,800 projection. That last step converts this from an article into a tracked series, which is the most durable non-commodity format there is.
