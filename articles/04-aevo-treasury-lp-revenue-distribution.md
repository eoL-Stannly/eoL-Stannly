# Aevo's 674k USDC Staker Payout Became 808k — and Moved to December

**Source post:** https://x.com/aevoxyz/status/2090842637179691210 — 21 August 2026, 16:45 UTC
**Topic confidence:** Medium-high — post content could not be retrieved. The 674k USDC Treasury LP distribution was scheduled for late August 2026 and is the strongest match for this date. **Confirm before publishing.**
**Last revised:** 3 September 2026 · Iteration 1

---

## Answer up front

Aevo's Treasury LP Revenue Distribution was originally scheduled for **late August 2026** at approximately **674,000 USDC**.

It is now approximately **808,800 USDC**, distributed at the **end of December 2026**. That is a **20% increase** on the original figure.

To qualify you need both of the following:

1. An active **COMMANDER or LEGEND** tier stake as of the distribution date.
2. At least **10,000,000 in global trading volume** between 1 January 2026 and the distribution date, held while at COMMANDER or LEGEND tier.

Miss either condition and you receive nothing, regardless of how much AEVO you hold.

---

## What is being distributed, and where it comes from

This is not an emission. No new AEVO is minted for it. The payout is USDC that the treasury actually earned.

The chain of custody is specific:

```
Staking rewards accrue weekly in AEVO
        ↓
15th of each month: accrued AEVO paired with equal-value USDC
        ↓
Minted as a Uniswap V3 liquidity position NFT
        ↓
Position earns LP trading fees, accumulating in USDC
        ↓
End of December: accumulated fees distributed to qualifying stakers
```

Aevo does not sit on unclaimed rewards. It puts them to work as liquidity, and the fees that liquidity generates become the annual distribution.

That is why the number grew. A delay from August to December is four more months of fee accrual on a live LP position. The 20% increase is not a top-up from the treasury — it is the mechanism working as designed over a longer window.

---

## The eligibility rules are stricter than they look

Read the two conditions again. There are three traps in them.

**Trap 1 — the volume threshold is cumulative, not annual-average.** 10,000,000 in global trading volume between 1 January 2026 and the distribution date. Someone who starts in November cannot realistically reach it.

**Trap 2 — the tier must be active *while* the volume is generated.** The requirement is volume generated while holding an active COMMANDER or LEGEND tier stake. Trading at a lower tier and then upgrading late does not retroactively qualify that volume.

**Trap 3 — the tier must be active *on* the distribution date.** It is a snapshot. Unstaking in mid-December to capture a price move forfeits the payout.

Recall how tiers are calculated: **stake weighted 30%, trading volume weighted 70%**. Reaching COMMANDER or LEGEND is mostly a function of trading, not holding. This distribution is designed for active traders who also stake. It is not a passive yield product.

---

## Why the date moved

Aevo has not published a reason that is available in secondary sources, so treat the following as reasoning from the mechanism rather than as a stated cause.

An annual distribution at end of December has one clear structural advantage over an ad-hoc August payout: it aligns the eligibility window with the calendar year the volume requirement already uses. The volume threshold runs from 1 January. Distributing in December closes that window cleanly, rather than cutting it at an arbitrary point in August and leaving four months of accrual in limbo.

The 20% increase is the direct financial consequence.

---

## How this fits the rest of Aevo's 2026 token economics

The LP distribution is one of four revenue-linked mechanisms running concurrently:

| Mechanism | Frequency | Paid in |
|---|---|---|
| Buyback and burn (50% burned, 50% to treasury) | Monthly | AEVO destroyed |
| Staking rewards | Weekly, 100,000 AEVO | AEVO |
| Trading Rewards epochs | Per epoch, ~1,000,000 AEVO | AEVO |
| Treasury LP revenue distribution | Annually, end of December | **USDC** |

The last row is the one that differs. Every other mechanism pays in AEVO — which is, functionally, paying holders in more of the thing they already hold. The LP distribution pays in dollars.

For scale: Aevo's self-reported market capitalisation was around **$16.29 million on 27 July 2026**. An 808,800 USDC distribution is roughly 5% of that market cap, paid in stablecoin to a restricted subset of stakers.

The 69,000,000 AEVO burn in January 2026 removed 6.9% of total supply. Rewards Epoch 20, launched 20 April 2026, allocated 1,000,000 AEVO over seven days — 700,000 to perpetual futures and 300,000 to options — with reported staking APRs up to 271.6%.

---

## Frequently asked questions

### Am I eligible if I just stake a lot of AEVO?
No. Stake alone does not qualify you. You also need 10,000,000 in cumulative global trading volume generated while at COMMANDER or LEGEND tier.

### Is the 674,000 USDC figure wrong now?
It is superseded. 674,000 USDC was the amount scheduled for late August 2026. The distribution moved to end of December 2026 at approximately 808,800 USDC.

### What counts toward the 10M volume?
Global trading volume on Aevo between 1 January 2026 and the distribution date. Verify which instruments count against Aevo's documentation before assuming, as perps and options are treated differently in other Aevo reward programmes.

### Do I get paid in AEVO or USDC?
USDC. This is the one major Aevo distribution paid in stablecoin rather than in the native token.

### Can I unstake after the snapshot but before payment?
The requirement is an active COMMANDER or LEGEND tier stake *as of the distribution date*. Do not unstake before that date. Confirm the exact snapshot timing in Aevo's documentation.

### Does this happen every year?
The distribution is described as occurring once annually at the end of December, funded by accumulated LP fees.

### Why does Aevo route rewards through Uniswap V3 instead of just paying out?
Because unclaimed rewards would otherwise sit idle. Pairing accrued AEVO with USDC in a concentrated liquidity position makes the treasury productive and deepens AEVO's own market liquidity at the same time. The LP fees fund the distribution.

### Is 808,800 USDC guaranteed?
No. It is described as a projection. The amount depends on fees the Uniswap V3 positions actually earn between now and the end of December, which depends on trading activity.

---

## Sources

- [Treasury LP Revenue Distribution — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution)
- [Staking — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking)
- [AGP-3 Aevonomics: New Buyback and Burning System](https://agp.aevo.xyz/approved-proposals/agp-3-aevonomics/proposal/new-buyback-and-burning-system)
- [Aevo Self Reported Market Capitalization Reaches $16.29 Million](https://www.dailypolitical.com/2026/07/27/aevo-self-reported-market-capitalization-reaches-16-29-million-aevo.html)
- [69 Million AEVO Tokens Burned Amid Governance Shift](https://bitcoinethereumnews.com/tech/69-million-aevo-tokens-burned-amid-governance-shift/)
- [Aevo Statistics — CoinGecko](https://www.coingecko.com/en/exchanges/aevo)
