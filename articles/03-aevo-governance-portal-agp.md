# The Aevo Governance Portal: How AGP Voting Actually Works

**Source post:** https://x.com/aevoxyz/status/2083191674344255953 — 31 July 2026, 14:02 UTC
**Topic confidence:** Medium — post content could not be retrieved. Governance Portal launch is the best-supported Aevo announcement in this window. **Confirm before publishing.**
**Last revised:** 3 September 2026 · Iteration 1

---

## Answer up front

Aevo's Governance Portal is the front end for AGPs — Aevo Governance Proposals. It lives at `agp.aevo.xyz`.

The rules are specific and worth knowing before you vote:

- **Who votes:** AEVO and sAEVO holders.
- **Voting power:** sAEVO carries **2x** the weight of unstaked AEVO.
- **Where:** Snapshot.
- **How long:** up to **one calendar week** per proposal.
- **Quorum:** **2,500,000 AEVO** or **1,250,000 sAEVO** by default.

That quorum figure is the one number most coverage omits, and it is the number that decides whether a proposal counts.

---

## Why the 2x multiplier is the whole design

Governance systems have a standard failure mode. Mercenary capital buys tokens, votes for a short-term extraction, and exits.

Aevo's answer is to price voting power in commitment. Staked tokens vote twice as loudly as liquid ones. A voter with 2x power is, by construction, someone who has given up immediate liquidity.

The quorum thresholds encode the same idea. Note that they are not equal in token terms — they are equal in *voting power* terms:

| Path to quorum | Tokens required | Voting power |
|---|---|---|
| Unstaked AEVO | 2,500,000 | 2,500,000 |
| Staked sAEVO | 1,250,000 | 2,500,000 |

Half as many staked tokens clear the same bar. The system is internally consistent: one quorum, two prices, and staking is the discount.

---

## What has actually passed

The portal is not theoretical. Two proposals define Aevo's current economics.

**AGP-2** restarted monthly AEVO buybacks after a pause.

**AGP-3 — "Aevonomics"** — was the larger package. It delivered the new staking system, new trading rewards, the buyback and burning system, and the **69,000,000 AEVO burn (6.9% of total supply) executed in January 2026**.

That is the useful test of any governance portal: did a vote move real money? AGP-3 destroyed 6.9% of the supply and rewrote how protocol revenue is split. It did.

---

## The mechanics, step by step

1. **Draft.** A proposal is written and shared for community discussion.
2. **Publish.** It goes onto the Governance Portal as a numbered AGP.
3. **Vote.** Balloting runs on Snapshot for up to one calendar week. Snapshot voting is off-chain and gasless — voters sign a message, they do not pay to vote.
4. **Quorum check.** The ballot is valid only if 2,500,000 AEVO / 1,250,000 sAEVO of voting power participates.
5. **Execution.** Approved proposals move to implementation and are listed under approved proposals.

Step 3 is why participation is even possible at small stake sizes. On-chain voting on Ethereum mainnet would cost more in gas than a small holder's stake is worth. Snapshot removes that barrier entirely.

---

## The uncomfortable arithmetic

Aevo's self-reported market capitalisation was around **$16.29 million on 27 July 2026** — four days before this announcement.

Set quorum against that. 2,500,000 AEVO of participation is required for a valid vote. Against a float of that size, quorum is a meaningful fraction of the circulating token, not a rounding error.

Two readings, both true:

- **Optimistic:** quorum is high enough that no small group can quietly pass a proposal.
- **Pessimistic:** quorum is high enough that apathy alone can kill a good proposal.

This is the standard tension in DAO design, and Aevo has resolved it toward safety over speed. Governance forums are the place to check live participation rates before assuming a proposal will clear.

---

## Frequently asked questions

### Do I need to stake to vote?
No. Unstaked AEVO votes. Staking doubles your weight, it does not create your eligibility.

### Does voting cost gas?
No. Voting runs on Snapshot, which is off-chain and gasless. You sign a message with your wallet.

### How long do I have to vote?
Up to one calendar week per proposal. Check the specific proposal — the week is a maximum, not a guarantee.

### What happens if quorum is not met?
The ballot is not valid. The proposal does not pass, regardless of how the votes split.

### Can quorum be changed?
The 2,500,000 AEVO / 1,250,000 sAEVO figure is described as the default quorum, which implies it is a parameter rather than a constant. Parameters are themselves governable.

### Where do I find proposals?
The Governance Portal at `agp.aevo.xyz`, which lists approved proposals including the AGP-3 Aevonomics package.

### Does sAEVO's 2x power mean whales control governance?
It concentrates power toward committed holders, not necessarily toward the largest holders. A whale who stakes gets 2x, and so does a small holder who stakes. The multiplier is uniform; it rewards a behaviour, not a size.

### Is the Governance Portal the same as Snapshot?
No. The portal is Aevo's own interface for drafting, listing and tracking AGPs. Snapshot is the third-party voting layer the ballots run on.

---

## Sources

- [AGP — Aevo Governance Proposals — Aevo Documentation](https://docs.aevo.xyz/aevo-governance/governance/agp-aevo-governance-proposals)
- [AGP-3 Aevonomics — Aevo Governance Portal](https://agp.aevo.xyz/approved-proposals/agp-3-aevonomics/proposal/new-buyback-and-burning-system)
- [Aevo Reignites Monthly AEVO Token Buybacks After AGP-2 Approval — BitcoinWorld](https://bitcoinworld.co.in/aevo-token-buybacks-resume/)
- [69 Million AEVO Tokens Burned Amid Governance Shift](https://bitcoinethereumnews.com/tech/69-million-aevo-tokens-burned-amid-governance-shift/)
- [Aevo Self Reported Market Capitalization Reaches $16.29 Million](https://www.dailypolitical.com/2026/07/27/aevo-self-reported-market-capitalization-reaches-16-29-million-aevo.html)
- [Staking — Aevo Documentation](https://docs.aevo.xyz/trading-and-staking-rewards/staking)
