# Aevo article rewrites — working set

Rewrites of four @aevoxyz posts into structured, FAQ-bearing articles written to an
**AUF (Answer Up Front)** standard, each graded against a commodity / non-commodity rubric.

## Source posts and mapping confidence

| # | Source post | Posted (UTC) | Topic | Confidence |
|---|---|---|---|---|
| 1 | `x.com/aevoxyz/status/2029965683056930907` | 2026-03-06 17:01 | Aevo MCP server + AI trading bot | **Confirmed** — search index returned this exact status ID with the title "Introducing Aevo MCP and AI Trading Bot", corroborated by a third-party post describing the same launch |
| 2 | `x.com/aevoxyz/status/2036035408430084283` | 2026-03-23 11:00 | AEVO tokenomics: burn, buybacks, staking epochs | **Inferred** — post body indexed as a bare `t.co` image link, no text. Topic chosen from Aevo's confirmed March–April 2026 tokenomics cycle |
| 3 | `x.com/aevoxyz/status/2083191674344255953` | 2026-07-31 14:02 | PERPS+ protected perps on mobile | **Inferred** — nearest confirmed Aevo announcement, dated 19–23 July 2026 across several outlets |
| 4 | `x.com/aevoxyz/status/2090842637179691210` | 2026-08-21 16:45 | Ondo tokenized equities + matching perps | **Inferred** — nearest confirmed Aevo announcement, 7 August 2026; DAO treasury LP distribution also falls in late August 2026 |

Timestamps are derived from the Snowflake IDs (Twitter epoch `1288834974657`), so the
dates are exact even though the post bodies were unreadable.

### Why 3 of 4 are inferred

`x.com` is blocked by this environment's egress policy, as are `aevo.xyz`, `docs.aevo.xyz`,
`t.me`, `coinmarketcap.com`, `binance.com` and every other content domain probed. Web
*search* works (it does not traverse the egress proxy); web *fetch* does not. The four post
bodies could not be read directly.

Articles 2–4 are therefore built from independently verifiable reporting about Aevo in the
matching time window, not from the post text. **Before publishing, paste the real post text
in and re-run** — see "Next iteration" below.

## Files

- `articles/01-aevo-mcp-ai-trading-bot.md`
- `articles/02-aevo-tokenomics-burn-buyback-staking.md`
- `articles/03-aevo-perps-plus-protected-perps.md`
- `articles/04-aevo-tokenized-equities-ondo.md`
- `SCORING.md` — the rubric, the per-article grades, and what each article needs to clear the non-commodity line

## Method

**AUF (Answer Up Front).** Every article and every H2 answers its own question in the first
sentence. No throat-clearing, no "in today's fast-moving world". The first 40 words must be
extractable as a standalone answer, because that is the unit both featured snippets and LLM
retrievers actually lift.

**Short sentences, verifiable claims.** Each factual sentence carries a number, a date, a
named entity, or a named source. Claims that could not be verified are marked inline as
unverified rather than smoothed over.

**Sources disagree, and that is content.** Where two outlets give different figures for the
same metric, both are shown with attribution. Reconciling public numbers is one of the
cheapest forms of information gain available.

## Next iteration

1. Paste the real text of posts 2, 3 and 4 into `content/sources/` and re-run. This converts
   three articles from topic-grounded to source-grounded and is the single biggest scoring lift
   available — it moves every article's "first-hand access" sub-score off the floor.
2. Ask the environment owner to allowlist `x.com` and `aevo.xyz` for this session's egress
   policy, which removes the blocker permanently.
3. Add proprietary measurement — see `SCORING.md`, "What is required", item 1. Every article
   currently tops out around 62–68/100 for exactly the same reason: no original data.
