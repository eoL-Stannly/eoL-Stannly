# **Aevo staking explained: tiers, epochs, the lottery and every reward**

**Four reward streams run off one staked position. Here's what each pays, how the tier system decides your share, and the mistakes that quietly cost people a year's rewards.**

**TL;DR**

**•**  Staking AEVO gets you sAEVO. It isn't a separate token or a receipt, it's simply the staked status of your AEVO.

**•**  Your tier is two things at once: an amount tier (LUNAR, MARTIAN, STELLARIS, CELESTIAL) and a duration tier (CADET, EXPLORER, COMMANDER, LEGEND).

**•**  Duration tier is set by lock length, and you get it the day you lock, not when the lock matures.

**•**  Four streams pay off one stake: the weekly AEVO trading epoch, weekly USDC cashback, LP NFT distributions, and the year-end USDC Mega Reward.

**•**  The weekly epoch distributes 1,000,000 AEVO from the DAO Treasury, split by trading volume.

**•**  USDC cashback comes straight out of exchange trading fees, every epoch.

**•**  LP NFTs are minted as Uniswap V3 positions in the AEVO/USDC pool and vest faster the higher your tier: 7 weeks at LUNAR CADET down to 1 week at CELESTIAL LEGEND.

**•**  The year-end distribution is projected at roughly 808,800 USDC for 2026. Only COMMANDER and LEGEND stakes qualify.

**•**  There's a lottery system among the staking perks. It's tied to your staked position rather than being a separate entry you buy.

**•**  Adding to a stake consolidates everything into one position, and can shorten your duration tier. This is the mistake that catches people.

Staking AEVO is not one decision, it's two: how much, and for how long. Those two answers set two different tiers, and the tiers feed four different reward streams on different schedules with different rules.

That's more moving parts than most staking programmes, and the complexity is where the value hides. Traders who understand the duration tier consistently out-earn traders staking more capital for less time.

## **What is sAEVO?**

Your AEVO, in a staked state.

There's no wrapper contract, no receipt token to keep track of, and nothing to swap back at the end. You stake AEVO on the exchange and it becomes sAEVO, which is the same tokens flagged as locked. Your rewards are calculated from your sAEVO balance and your tier.

Practically, that means there's nothing to lose, bridge or forget about. There's also nothing to sell in a hurry: locked is locked until the unlock date.

## **How do the staking tiers work?**

Two tiers, assigned independently, both derived from the same stake.

**Duration tier** comes from how long you lock:

| | | |
|:-:|:-:|:-:|
| **Lock duration** | **Duration tier** | **Year-end distribution** |
| 2 months (8 epochs) | CADET | Not eligible |
| 5 months (22 epochs) | EXPLORER | Not eligible |
| 8 months (36 epochs) | COMMANDER | 30% of pool |
| 12 months (51 epochs) | LEGEND | 70% of pool |

You get the tier on the day you lock, not after the lock runs its course. Lock for twelve months and you're LEGEND from day one.

**Amount tier** comes from how much you stake: LUNAR, MARTIAN, STELLARIS, CELESTIAL, smallest to largest.

Your full tier name combines them, which is why you see labels like Stellaris Legend or Lunar Commander on the [leaderboard](https://app.aevo.xyz/leaderboard). The two halves do different jobs. Duration decides what you're eligible for. Amount feeds how large your share is.

The system is weighted towards duration deliberately. A long lock is a harder commitment than a large one, and the rewards are structured to say so.

## **The four reward streams**

One stake, four sources of income, all running at once. You're not choosing between them.

### **1. Weekly trading epoch**

1,000,000 AEVO every week from the DAO Treasury, split proportionally among active traders by volume.

This is volume-driven rather than stake-driven, so it pays whether or not you're staked. It shows on the Weekly tab. If you trade regularly, this is the stream that pays most often.

### **2. Weekly USDC cashback**

Paid straight out of exchange trading fees, every epoch, in USDC.

Effectively a rebate on what you've paid to trade. It's real cash rather than emissions, which makes it the most predictable stream of the four.

### **3. LP NFT distributions**

Stakers receive Uniswap V3 liquidity positions in the AEVO/USDC pool, minted as NFTs and boosted by both staking tier and weekly trading volume.

Your share is based on your weighted stake, where the weight multiplier comes from combining your duration tier and your amount tier, weighted towards duration.

Vesting is where the tiers bite hardest:

| | |
|:-:|:-:|
| **Tier** | **Vesting period** |
| LUNAR CADET | 7 weeks |
| MARTIAN EXPLORER | 5 weeks |
| STELLARIS COMMANDER | 3 weeks |
| CELESTIAL LEGEND | 1 week |

Same reward, seven times the wait at the bottom tier. NFTs are minted monthly and can be tracked in the Governance Portal.

### **4. Year-end Mega Reward**

The big one, and the one with real conditions attached.

A USDC distribution funded by the protocol treasury's Uniswap V3 LP fee income, paid once at the end of the year. The 2026 pool is projected at roughly 808,800 USDC, up 20% on the original schedule.

The pool splits by duration tier before anything else: **LEGEND takes 70%, COMMANDER takes 30%.** CADET and EXPLORER get nothing here regardless of size.

Inside your tier, your allocation comes from a score:

*Score = 0.30 × (your stake ÷ tier total stake) + 0.70 × (your volume ÷ tier total volume)*

Your reward is your score as a proportion of every score in your tier, times the tier pool, capped at 15% of that pool.

Three conditions, all required at once:

  1. **An active COMMANDER or LEGEND stake on the day of the snapshot.** Taken at the end of December, exact date to be announced. It's a single point-in-time check. Unlock in November after eleven months of qualifying and you get nothing.
  2. **A staked amount at least equal to your largest qualifying stake this year.** Coming back smaller after a lapse doesn't qualify.
  3. **10M in global trading volume.** Perps and options combined, pre-launch markets excluded, built from 1 January 2026 while an active COMMANDER or LEGEND stake was in place.

Volume only accrues while an active COMMANDER or LEGEND stake is in place. Let it lapse and the counter pauses rather than resets, but everything you trade during the gap is lost to this calculation.

Your live position is on the [Mega Reward leaderboard](https://app.aevo.xyz/leaderboard), and the full rules are in the [Treasury LP Revenue Distribution docs](https://docs.aevo.xyz/trading-and-staking-rewards/staking/treasury-lp-revenue-distribution).

## **What about the staking lottery?**

There's a lottery system among the staking perks, sitting alongside the four scheduled streams above.

The distinction worth understanding is what kind of reward it is. The weekly epoch, the cashback and the Mega Reward are all proportional: your share is calculated from your stake and your volume, and you know roughly what you're getting before it arrives. A lottery is not proportional. It's a chance-based distribution tied to your staked position rather than something you buy an entry into.

Practically, that means you don't do anything differently to be in it. Your stake is your participation. It also means you shouldn't model it as income. Treat the four scheduled streams as the return on staking, and the lottery as upside on top.

Current mechanics, draw schedule and prize structure are in the [staking documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking), and are worth checking directly before you make decisions based on it, because this is the part of the programme most likely to change between epochs.

## **What APR does staking actually pay?**

It moves, and anyone quoting you a fixed number is quoting a snapshot.

At the Rewards Epoch 20 launch on 20 April 2026, Aevo posted staking APRs of up to 271.6%. By mid-May it had drifted into the high 260s and low 270s across a couple of weekly updates.

That's a narrow drift over a month, but it is drift, and the direction of travel depends on how much AEVO is staked and how much volume the exchange does. Check the [staking page](https://app.aevo.xyz/aevo) for what it's paying today rather than working from a number in an article.

## **The mistake that costs people a year**

Adding to an existing stake consolidates everything into one position. Your amount tier becomes the total staked, and your duration tier follows the longest remaining lock across your positions.

That can move you down as easily as up. Bolt a short lock onto a long one and you can shorten your remaining duration and drop out of eligibility entirely.

People get caught by this while topping up ahead of a snapshot, which is precisely the worst time. They're adding capital to improve their position and they shorten their duration tier doing it. **Check the resulting duration before you add, every time.**

If your goal is a better position, extending the lock beats adding to it. Going from COMMANDER to LEGEND moves you from the 30% pool to the 70% pool and more than doubles your ceiling on the year-end distribution.

## **Which tier should I choose?**

Depends entirely on whether you trade.

  - **You trade regularly and do real volume.** LEGEND, if you can commit for twelve months. The 70% pool, the fastest LP NFT vesting, and the highest cap. The volume component carries 70% of the weight inside a tier, so a trader on a long lock is the best-positioned account in the system.
  - **You trade occasionally.** COMMANDER at minimum, if the year-end distribution is in scope. Below eight months you're not eligible for it at all. If you can't reach 10M in volume, weigh whether the lock is worth it for the other three streams alone.
  - **You hold and don't trade.** CADET or EXPLORER still earn LP NFT distributions and governance weight, just with the slowest vesting and no year-end distribution. That's a legitimate choice, as long as it's a deliberate one.

## **A checklist before each snapshot**

  - **Your unlock date.** Falls before the snapshot, even by a fortnight? Extend now.
  - **Your staked amount against your high-water mark for the year.** It has to match your largest qualifying stake.
  - **Your volume against 10M.** The leaderboard shows your cumulative qualifying total.
  - **Whether you're capped.** 4.50% on COMMANDER or 10.5% on LEGEND is the ceiling. Past it, more volume does nothing for this distribution.
  - **Whether LEGEND is worth it.** Eight months to twelve is the single highest-leverage change available to most stakers.

Stake at [app.aevo.xyz/aevo](https://app.aevo.xyz/aevo), track your position at [app.aevo.xyz/leaderboard](https://app.aevo.xyz/leaderboard), and the full rules are in the [staking docs](https://docs.aevo.xyz/trading-and-staking-rewards/staking).
