# AEVO Staking, Buybacks and the 69 Million Token Burn Explained

**Source post:** https://x.com/aevoxyz/status/2036035408430084283 — 23 March 2026, 11:00 UTC
**Topic confidence:** Low — the source post is link-only and could not be retrieved. Topic inferred from Aevo's announcement cycle in that window. **Confirm before publishing.**
**Last revised:** 3 September 2026 · Iteration 1

---

## Answer up front

Aevo burned **69,000,000 AEVO in January 2026** — 6.9% of total supply. That burn was the headline of AGP-3, the governance proposal that rebuilt Aevo's token economics.

Three mechanisms came out of it:

1. **Monthly buybacks.** Protocol revenue buys AEVO on the open market. Half of every buyback is burned immediately. Half goes to the DAO Treasury, split evenly between staking and trading rewards.
2. **A new staking system.** Stake AEVO, receive sAEVO. sAEVO is not a separate token and not a receipt token — it is the staked *status* of your AEVO. You can unstake at any time.
3. **LP fee revenue sharing.** Every month on the 15th, accrued AEVO staking rewards are paired with an equal value of USDC and minted into a Uniswap V3 liquidity position NFT. The fees that position earns flow back to qualifying stakers.

Staking rewards run at **100,000 AEVO per week**. Tier placement weights **stake at 30% and trading volume at 70%**.

---

## The burn, in context

69 million tokens is 6.9% of supply removed permanently in a single event, in January 2026.

For scale: Aevo's self-reported market capitalisation was around **$16.29 million on 27 July 2026**. A 6.9% supply reduction on a float that size is structurally significant in a way the same percentage would not be on a large-cap token.

The burn was not a standalone gesture. It arrived alongside a governance shift, and monthly buybacks resumed after AGP-2 passed. The one-time burn set a floor; the monthly programme is the ongoing mechanism.

### Where buyback tokens go

```
Monthly buyback (funded by protocol revenue)
├── 50% → burned immediately, permanently removed
└── 50% → DAO Treasury reserves
         ├── staking rewards
         └── trading rewards
```

The design point: half the buyback leaves supply forever, half is recycled into user incentives. It is neither a pure burn nor a pure rewards programme.

The programme scales with protocol volume. More trading means larger buybacks. That couples token supply to actual exchange usage rather than to a fixed emission schedule.

---

## How sAEVO staking works

### Staking is a status, not a swap

This is the detail most explainers get wrong. You do not swap AEVO for a different asset. Staking marks your AEVO as staked and it becomes sAEVO. There is no wrapper contract risk of the usual kind, and there is no separate liquid token to depeg.

sAEVO also carries **2x the governance voting power** of unstaked AEVO.

### The four tiers

Aevo runs four staker tiers. Two multipliers attach to them:

| Multiplier | Applies to | Maximum |
|---|---|---|
| Base boost (linear, scales with stake size) | Aevo Airdrops | 5x |
| Lucky boost (linear) | Trading Rewards | 2x |

Tier placement is **not** stake alone. The formula weights stake at 30% and trading volume at 70%.

Read that ratio carefully. Aevo is not primarily paying you to hold. It is paying you to trade, with holding as a multiplier. A large passive stake with no volume will not reach the top tiers.

The top two tiers are named **COMMANDER** and **LEGEND**, and they are the gate for LP revenue distributions.

### The Uniswap V3 mechanism

On the 15th of each month, accrued AEVO rewards are paired with an equivalent amount of USDC and minted as a Uniswap V3 liquidity position NFT. That position earns trading fees continuously. Those fees accumulate in USDC and are distributed to qualifying stakers.

This is an unusual construction. Most protocols distribute revenue directly. Aevo routes it through a productive LP position first, so the treasury earns a second layer of yield on rewards that have not yet been claimed.

---

## What stakers actually earned in 2026

Concrete, dated figures rather than projections:

- **Rewards Epoch 20**, launched 20 April 2026: 1,000,000 AEVO distributed over 7 days — 700,000 to crypto perpetual futures markets, 300,000 to options markets. Reported staking APRs reached **271.6%**.
- **LP fee distribution for 2026:** approximately **808,800 USDC**, scheduled for end of December — a **20% increase** over the originally scheduled August distribution of 674,000 USDC.

The 70/30 volume weighting shows up here too: 70% of Epoch 20's allocation went to perps, 30% to options. Aevo's incentive design consistently favours the perpetuals book.

---

## Frequently asked questions

### Can I unstake at any time?
Yes. There is no lock. The trade-off is that rewards accrue over time, so a short stake earns proportionally less and may not hold a tier through a distribution snapshot.

### Does staking AEVO give me exchange revenue?
Indirectly and conditionally. LP fee revenue reaches stakers who hold an active COMMANDER or LEGEND tier stake and meet the volume requirement. Lower tiers do not qualify for the annual USDC distribution.

### Is sAEVO tradeable?
No. sAEVO is the staked status of AEVO, not a transferable receipt token. There is no secondary market for it.

### How much do I need to stake?
Aevo publishes tier thresholds in its documentation, and they are subject to governance. Because the tier formula weights volume at 70%, the required stake is not the only variable — an active trader reaches a given tier with less stake than a passive holder.

### Are the 271.6% APRs real?
That figure was reported for Rewards Epoch 20 in April 2026. It is a snapshot, not a stable rate. Epoch APRs are a function of a fixed AEVO allocation divided across however much stake participates, so the rate falls as participation rises. Treat any headline APR as an instantaneous reading.

### What is the difference between AGP-2 and AGP-3?
AGP-2 restarted monthly AEVO buybacks. AGP-3, sometimes called "Aevonomics," was the wider package: the new staking system, new trading rewards, the buyback and burning system, and the 69M burn.

### Will there be more burns?
Yes — structurally. Half of every monthly buyback is burned. Whether another single event on the scale of the 69M burn occurs is a governance decision, not a scheduled one.

### Does the burn guarantee the price goes up?
No. Supply reduction is one input. Aevo's market capitalisation was roughly $16.29M in late July 2026, after the January burn. Burns change supply; they do not create demand.

---

## Sources

- [Staking — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking)
- [Treasury LP Revenue Distribution — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution)
- [New Buyback and Burning System — AGP-3 Aevonomics](https://agp.aevo.xyz/approved-proposals/agp-3-aevonomics/proposal/new-buyback-and-burning-system)
- [69 Million AEVO Tokens Burned Amid Governance Shift](https://bitcoinethereumnews.com/tech/69-million-aevo-tokens-burned-amid-governance-shift/)
- [Aevo Reignites Monthly AEVO Token Buybacks After AGP-2 Approval — BitcoinWorld](https://bitcoinworld.co.in/aevo-token-buybacks-resume/)
- [AEVO Announces Buyback Amid the Market Downturn — KuCoin](https://www.kucoin.com/news/articles/aevo-announces-buyback-amid-the-market-downturn)
- [Aevo Self Reported Market Capitalization Reaches $16.29 Million](https://www.dailypolitical.com/2026/07/27/aevo-self-reported-market-capitalization-reaches-16-29-million-aevo.html)
- [Aevo Stakers Captured A Burn That Sellers Walked Past](https://www.cryptonewsnavigator.com/academy/article/aevo-token-burn-staking-playbook)
