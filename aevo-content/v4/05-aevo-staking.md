# **Aevo staking explained: tiers, epochs, the lottery and every reward**

**Four reward streams and a standing fee discount run off one staked position, with a monthly buyback and burn underneath them. Here's what each pays, how the tier system decides your share, the arithmetic behind the year-end distribution, and the mistake that quietly costs people a year's rewards.**

**TL;DR**

**•**  Staking AEVO gets you sAEVO. It isn't a separate token or a receipt, it's simply the staked status of your AEVO.

**•**  Your tier is two things at once: an amount tier (LUNAR, MARTIAN, STELLARIS, CELESTIAL) and a duration tier (CADET, EXPLORER, COMMANDER, LEGEND).

**•**  Duration tier is set by lock length, and you get it the day you lock, not when the lock matures.

**•**  Four streams pay off one stake: the weekly AEVO trading epoch, weekly USDC cashback, LP NFT distributions, and the year-end USDC Mega Reward.

**•**  **On top of those, every staker gets a standing trading fee discount of up to 20%**, set by the same tier matrix. It does not apply to options or pre-launch market fees.

**•**  The weekly epoch distributes 1,000,000 AEVO from the DAO Treasury, split by trading volume.

**•**  USDC cashback comes straight out of exchange trading fees, every epoch.

**•**  LP NFTs are minted on the 15th of each month, pairing your accrued AEVO with an equal amount of USDC into a Uniswap V3 position. They vest faster the higher your tier: 7 weeks at LUNAR CADET down to 1 week at CELESTIAL LEGEND.

**•**  **The August distribution moved.** A ~674,000 USDC treasury LP payout was originally scheduled for late August 2026. It now pays annually at the end of December instead, at roughly 808,800 USDC — a 20% increase for waiting.

**•**  Only COMMANDER and LEGEND stakes qualify for that year-end distribution. LEGEND takes 70% of the pool, COMMANDER 30%.

**•**  Inside your tier, your score *is* your share of the tier pool — the maths is below, and it's simpler than it looks.

**•**  **Options volume counts delta-weighted**, not at notional. A far out-of-the-money option contributes a fraction of its face value towards your qualifying total.

**•**  There's a lottery system among the staking perks. It's tied to your staked position rather than being a separate entry you buy.

**•**  Separately from all of it, a monthly buyback and burn removes AEVO from circulation. 75 million tokens are gone so far.

**•**  Adding to a stake consolidates everything into one position, and can shorten your duration tier. This is the mistake that catches people.

Staking AEVO is not one decision, it's two: how much, and for how long. Those two answers set two different tiers, and the tiers feed four different reward streams on different schedules with different rules — plus a fee discount that applies to every trade you make in between.

That's more moving parts than most staking programmes, and the complexity is where the value hides. Traders who understand the duration tier consistently out-earn traders staking more capital for less time.

## **What is sAEVO?**

Your AEVO, in a staked state.

There's no wrapper contract, no receipt token to keep track of, and nothing to swap back at the end. You stake AEVO on the exchange and it becomes sAEVO, which is the same tokens flagged as locked. Your rewards are calculated from your sAEVO balance and your tier.

Practically, that means there's nothing to lose, bridge or forget about. There's also nothing to sell in a hurry: locked is locked until the unlock date.

## **How do the staking tiers work?**

Two tiers, assigned independently, both derived from the same stake.

**Duration tier** comes from how long you lock:

|  |  |  |
| :-: | :-: | :-: |
| **Lock duration** | **Duration tier** | **Year-end distribution** |
| 2 months (8 epochs) | CADET | Not eligible |
| 5 months (22 epochs) | EXPLORER | Not eligible |
| 8 months (36 epochs) | COMMANDER | 30% of pool |
| 12 months (51 epochs) | LEGEND | 70% of pool |

You get the tier on the day you lock, not after the lock runs its course. Lock for twelve months and you're LEGEND from day one.

**Amount tier** comes from how much you stake: LUNAR, MARTIAN, STELLARIS, CELESTIAL, smallest to largest.

Your full tier name combines them, which is why you see labels like Stellaris Legend or Lunar Commander on the [leaderboard](https://app.aevo.xyz/leaderboard). The two halves do different jobs. Duration decides what you're eligible for. Amount feeds how large your share is.

The system is weighted towards duration deliberately. A long lock is a harder commitment than a large one, and the rewards are structured to say so. You can see the weighting in the vesting schedule: a small holder committing for twelve months (LUNAR LEGEND, 4 weeks) gets the same acceleration as a large holder committing for two (CELESTIAL CADET, 4 weeks). Size and time are traded off against each other explicitly, and time is worth more per unit.

## **The fee discount nobody mentions**

Before the four streams, the benefit that pays on every single trade you make.

All stakers receive **trading fee discounts of up to 20%**, set by the same two-dimensional tier matrix. Unlike the reward streams, this one doesn't arrive on a schedule — it just quietly reduces what you pay, every fill, for the whole length of your lock.

|  |  |  |  |  |
| :-: | :-: | :-: | :-: | :-: |
| **Fee discount** | **CADET** | **EXPLORER** | **COMMANDER** | **LEGEND** |
| **LUNAR** | 0% | 2% | 4% | 8% |
| **MARTIAN** | 4% | 6% | 8% | 12% |
| **STELLARIS** | 8% | 10% | 12% | 16% |
| **CELESTIAL** | 12% | 14% | 16% | 20% |

Two things to read off that grid.

**The discount is weighted more heavily towards amount than lock duration** — the opposite of the rest of the programme. Moving up one amount tier is worth 4 percentage points at every duration; moving up one duration tier is worth 2 to 4. This is the one place where staking size does more work than staking time.

**LUNAR CADET earns 0%.** The minimum stake at the minimum lock gets nothing here. If a fee discount is part of your reason for staking, the bottom-left cell of that table is worth avoiding.

The important exclusion, stated plainly because it changes the calculation for a lot of traders: **the discount does not apply to option or pre-launch market fees.** It's a perps discount in practice. If most of your volume is options or pre-launch, this stream is worth close to nothing to you and you should weigh the lock on the other four alone.

All proposed amounts are subject to periodic review by the Treasury and Revenues Management Committee, so treat the grid as current rather than permanent.

## **The four reward streams**

One stake, four sources of income, all running at once. You're not choosing between them.

### **1. Weekly trading epoch**

1,000,000 AEVO every week from the DAO Treasury, split proportionally among active traders by volume.

This is volume-driven rather than stake-driven, so it pays whether or not you're staked. It shows on the Weekly tab. If you trade regularly, this is the stream that pays most often.

### **2. Weekly USDC cashback**

Paid straight out of exchange trading fees, every epoch, in USDC.

Effectively a rebate on what you've paid to trade. It's real cash rather than emissions, which makes it the most predictable stream of the four. Note that it stacks with the fee discount above: you pay less, and then you get some of what you did pay back.

### **3. LP NFT distributions**

Stakers receive Uniswap V3 liquidity positions in the AEVO/USDC pool, minted as NFTs and boosted by both staking tier and weekly trading volume.

The mechanic is worth understanding, because it's unusual. **On the 15th of each month, your accrued AEVO rewards are paired with an equivalent amount of USDC and minted into a Uniswap V3 liquidity position NFT.** That NFT then generates liquidity-provider fees. After a vesting period, it transfers to you.

So the reward isn't a token balance, it's a productive asset. It earns while it vests, and it keeps earning afterwards. It also means your reward is half denominated in USDC — the pairing is funded, not taken out of your AEVO.

Your share is based on your weighted stake, where the weight multiplier comes from combining your duration tier and your amount tier, weighted towards duration. A trading volume multiplier stacks on top of the staking tier multiplier.

Vesting is where the tiers bite hardest:

|  |  |
| :-: | :-: |
| **Tier** | **Vesting period** |
| LUNAR CADET | 7 weeks |
| LUNAR LEGEND | 4 weeks |
| MARTIAN EXPLORER | 5 weeks |
| CELESTIAL CADET | 4 weeks |
| STELLARIS COMMANDER | 3 weeks |
| CELESTIAL LEGEND | 1 week |

Same reward, seven times the wait at the bottom tier. NFTs are minted monthly and can be tracked in the Governance Portal.

### **4. Year-end Mega Reward**

The big one, and the one with real conditions attached.

A USDC distribution funded by the protocol treasury's Uniswap V3 LP fee income — fees that have accumulated without allocation, roughly 977,000 USDC collected to date. **It used to pay in August; it now pays once a year at the end of December.** If you were expecting roughly 674,000 USDC to be distributed in late August 2026, that's the payout that moved — the schedule changed to an annual December distribution, and the 2026 pool is projected at roughly 808,800 USDC, a 20% increase over the original August figure.

That's worth reading twice if you staked on the expectation of an August payment, because it changes two things at once: nothing arrives this month, and your stake now has to still be active in December to collect anything at all. Qualifying volume accumulated since 1 January 2026 counts in full — positions built ahead of the original August date carry over unchanged.

The pool splits by duration tier before anything else: **LEGEND takes 70%, COMMANDER takes 30%.** CADET and EXPLORER get nothing here regardless of size.

Three conditions, all required at once:

1.  **An active COMMANDER or LEGEND stake on the day of the snapshot.** Taken at the end of December, exact epoch to be announced. A stake is active if its unlock time falls after the snapshot. It's a single point-in-time check — unlock in November after eleven months of qualifying and you get nothing.
2.  **A staked amount at least equal to your largest qualifying stake this year.** Coming back smaller after a lapse doesn't qualify. Stake 1M AEVO for twelve months, let it expire, and you must re-stake at least 1M for 8 or 12 months to stay eligible.
3.  **10M in global trading volume.** Perps and options combined, pre-launch markets excluded, built from 1 January 2026 while an active COMMANDER or LEGEND stake was in place.

Volume only accrues while an active COMMANDER or LEGEND stake is in place. Let it lapse and the counter pauses rather than resets, but everything you trade during the gap is lost to this calculation.

Your live position is on the [Mega Reward leaderboard](https://app.aevo.xyz/leaderboard), and the full rules are in the [Treasury LP Revenue Distribution docs](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution).

## **How is qualifying volume actually measured?**

Not the way most people assume, and the difference matters if you trade options.

*Volume = PerpVolume + OptionsVolume*

*PerpVolume = Σ (contracts × execution price)*

*OptionsVolume = Σ (contracts × underlying spot price × |delta|)*

Perps volume is what you'd expect: contracts times price. **Options volume is delta-weighted** — each trade contributes in proportion to its actual market exposure rather than its face value.

The practical consequence is significant. A deep in-the-money option with a delta near 1 contributes close to full notional. A far out-of-the-money option with a delta of 0.1 contributes a tenth of it. If your plan for reaching 10M runs through cheap out-of-the-money options, the number on your fill history and the number that qualifies are going to be very different, and the gap is not in your favour.

Volume identified as wash trading or self-matched activity is discounted or excluded at the protocol's discretion. Accounts determined to belong to the same entity may also be aggregated for allocation and cap purposes — so splitting across wallets doesn't multiply your allocation or evade the cap.

## **How is my year-end share actually calculated?**

With a score that is simpler than it first looks.

*Score = 0.30 × (your stake ÷ tier total stake) + 0.70 × (your volume ÷ tier total volume)*

Both halves are shares of a total, so every score in a tier adds up to exactly 1. Which means **your score is your fraction of the tier pool** — there's no second normalisation step to worry about.

Worked through, on the projected 2026 pool:

  - The LEGEND pool is 70% of roughly 808,800 USDC, so about 566,000 USDC. The COMMANDER pool is 30%, about 243,000 USDC.
  - Say you're LEGEND, your stake is 0.5% of all LEGEND stake, and your volume is 1.0% of all LEGEND volume.
  - Score = 0.30 × 0.005 + 0.70 × 0.010 = 0.0085.
  - Your share is 0.85% of the LEGEND pool, or roughly 4,800 USDC.

Notice what that arithmetic tells you. Doubling your volume from 1.0% to 2.0% of the tier takes the score from 0.0085 to 0.0155 — an 82% increase. Doubling your *stake* from 0.5% to 1.0% takes it to 0.0100, an 18% increase. Volume carries more than twice the weight of stake, and on these numbers it's the lever worth pulling.

**On the cap.** Your reward is capped at 15% of your tier's pool. Expressed against the whole distribution instead, that's a ceiling of 10.5% for a LEGEND (15% of the 70% pool) and 4.5% for a COMMANDER (15% of the 30% pool). Same rule, two ways of saying it — you'll see both quoted, and they don't contradict each other.

**What happens to the capped amount** is a three-step waterfall, and it's worth knowing because it can work in your favour:

  - Amounts above an account's cap are **redistributed among uncapped participants in the same tier.**
  - If a tier cannot absorb its full allocation — including the case where a tier has no qualifying participants at all — the remainder is **added to the other tier's pool.**
  - Anything still undistributed after both steps **rolls forward into the following year's distribution.**

So a whale hitting the cap in your tier doesn't burn the excess, it hands it to everyone else in that tier. And a thin COMMANDER field pushes capital across to LEGEND. If you're a mid-sized LEGEND, both of those quietly work for you.

## **What about the staking lottery?**

There's a lottery system among the staking perks, sitting alongside the four scheduled streams above.

The distinction worth understanding is what kind of reward it is. The weekly epoch, the cashback and the Mega Reward are all proportional: your share is calculated from your stake and your volume, and you know roughly what you're getting before it arrives. A lottery is not proportional. It's a chance-based distribution tied to your staked position rather than something you buy an entry into.

Practically, that means you don't do anything differently to be in it. Your stake is your participation. It also means you shouldn't model it as income. Treat the four scheduled streams and the fee discount as the return on staking, and the lottery as upside on top.

Current mechanics, draw schedule and prize structure are in the [staking documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking), and are worth checking directly before you make decisions based on it, because this is the part of the programme most likely to change between epochs.

## **The sixth thing, which isn't a reward stream: buyback and burn**

Worth understanding because it acts on every AEVO you hold, staked or not.

Aevo runs a monthly buyback and burn funded by real exchange revenue. It began with a one-time burn of 69 million AEVO — 6.9% of total supply — in January 2026, and has continued monthly since. Roughly 75 million tokens have been permanently removed from circulation to date.

The split on each monthly buyback:

  - **50% is burned immediately**, permanently reducing circulating supply.
  - **50% goes to DAO Treasury reserves**, split equally between staking rewards and trading rewards.
  - **In months where exchange volume comes in under $500M, 100% is burned** instead of split.

Two things follow from that structure. First, half of every buyback flows back into the reward streams above, so exchange volume feeds your staking income by a second route on top of the fee cashback. Second, the mechanism is pro-cyclical in an unusual direction: quiet months burn harder, busy months fund rewards harder. Neither outcome is bad for a staker, which is presumably the point.

This is not something you opt into and not something you can size. It's context for what your staked position is denominated in.

## **What APR does staking actually pay?**

It moves, and anyone quoting you a fixed number is quoting a snapshot.

For scale: at the Rewards Epoch 20 launch on 20 April 2026, Aevo posted staking APRs of up to 271.6%, and it drifted through the high 260s and low 270s across the weekly updates that followed. Those are historical figures, not a forecast, and they are several months old by the time you're reading this.

The direction of travel depends on how much AEVO is staked and how much volume the exchange does — more of the first pushes the rate down, more of the second pushes it up. Neither is predictable. Check the [staking page](https://app.aevo.xyz/aevo) for what it's paying today rather than working from a number in an article, including this one.

Worth noting that a headline APR generally doesn't include the fee discount, and for an active trader that can be the more reliable of the two. Emissions vary with participation. A 20% cut on every perp fee you pay is arithmetic.

## **The mistake that costs people a year**

Adding to an existing stake consolidates everything into one position. Your amount tier becomes the total staked, and your duration tier follows the longest remaining lock across your positions.

That can move you down as easily as up. Bolt a short lock onto a long one and you can shorten your remaining duration and drop out of eligibility entirely.

People get caught by this while topping up ahead of a snapshot, which is precisely the worst time. They're adding capital to improve their position and they shorten their duration tier doing it. **Check the resulting duration before you add, every time.**

If your goal is a better position, extending the lock beats adding to it. Going from COMMANDER to LEGEND moves you from the 30% pool to the 70% pool and more than doubles your ceiling on the year-end distribution.

## **Which tier should I choose?**

Depends entirely on whether you trade.

  - **You trade regularly and do real volume.** LEGEND, if you can commit for twelve months. The 70% pool, the fastest LP NFT vesting, the highest cap and the biggest fee discount at any given size. The volume component carries 70% of the weight inside a tier, so a trader on a long lock is the best-positioned account in the system.
  - **You trade occasionally.** COMMANDER at minimum, if the year-end distribution is in scope. Below eight months you're not eligible for it at all. If you can't reach 10M in volume, weigh whether the lock is worth it for the other streams alone — and check whether your volume is mostly options, because the fee discount won't touch it.
  - **You hold and don't trade.** CADET or EXPLORER still earn LP NFT distributions and governance weight, just with the slowest vesting and no year-end distribution. That's a legitimate choice, as long as it's a deliberate one. Note that LUNAR CADET is the one combination that earns no fee discount at all.

## **A checklist before the December snapshot**

  - **Your unlock date.** Falls before the snapshot, even by a fortnight? Extend now. The distribution is annual and in December — there is no August payment to fall back on.
  - **Your staked amount against your high-water mark for the year.** It has to match your largest qualifying stake.
  - **Your volume against 10M.** The leaderboard shows your cumulative qualifying total. Remember pre-launch markets don't count, and options count delta-weighted rather than at notional.
  - **Whether you're capped.** 15% of your tier pool, which is 10.5% of the total distribution as a LEGEND and 4.5% as a COMMANDER. Past it, more volume does nothing for this distribution.
  - **Whether LEGEND is worth it.** Eight months to twelve is the single highest-leverage change available to most stakers.
  - **Which cell of the fee grid you're in.** If you're paying full freight on perps while holding a stake, you're leaving a standing discount on the table.

With the payout now landing in December, the months between here and then are the ones where qualifying volume is still cheap to build. If you're short of 10M, that's the number to work on — it carries more than twice the weight of your stake size in the final score.

Stake at [app.aevo.xyz/aevo](https://app.aevo.xyz/aevo), track your position at [app.aevo.xyz/leaderboard](https://app.aevo.xyz/leaderboard), and the full rules are in the [staking docs](https://docs.aevo.xyz/trading-and-staking-rewards/staking).

## **Related reading**

  - *Aevo trading strategies: from one-tap protection to multi-leg structures* — how to build the volume the year-end score rewards
  - *Pre-launch token futures: trade a token before it lists* — the market whose volume doesn't qualify, and whose fees the discount doesn't reach
  - *Aevo OTC: trade altcoin options on-chain, at size* — options volume that does count, delta-weighted
  - *The Aevo MCP: give your AI agent a trading desk* — for working out how much of your volume actually qualifies
