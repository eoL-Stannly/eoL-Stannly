# Aevo content iteration — run log

State file for the scheduled Aevo article routine. The routine rewrites five live
Google Docs each run, archives the previous versions, and grades each page for
commodity vs non-commodity status.

Keep this updated at the end of every run. It exists because run state was
previously held nowhere, which allowed a partial run to leave a duplicate live
document behind for four days without anyone noticing.

## The five live articles

| Slug | Title | Doc ID (live as of v18) |
| --- | --- | --- |
| `/aevo-staking` | Aevo Rewards \| Aevo Staking Explained | `17qirKyt5BgF6xhWfTI6oUaxCCCVRoz0EhZLs-2XOvnc` |
| `/aevo-otc` | Aevo Products \| Aevo OTC | `1TEvIJFAqOC4vBpsrjhe8cclG88oqSkeeeWZ29Ot7xk8` |
| `/aevo-mcp` | Aevo Products \| The Aevo MCP | `1HIC3fXogQCnVfpNxR2eBJHjKoHHw09fSPVqRU9Z6C1Y` |
| `/pre-launch-token-futures` | Aevo Products \| Pre-Launch Token Futures | `1vpAefYojYRq_O52u3VxA5XvtA8EMLRZdYJJBe-yjrOc` |
| `/aevo-trading-strategies` | Aevo Trading \| Aevo Trading Strategies | `1-DS0ZuFHlYcExk6PTPaYCCUzZ5Syz2CP9mlpmn34Bew` |

Scorecard: `1wr3d7nLrzPlyGRnvfTrLv7se9tYbhGbYZ76wmPRTVIw`

All live in Drive root (`parentId 0ACaUDMMQ5ycTUk9PVA`), owned by
eolithicproductions@gmail.com.

## Conventions

- Live documents carry no version prefix. Archiving renames the previous version
  to `[vN ARCHIVED YYYY-MM-DD] <original title>`.
- Version numbers are shared across all five articles so they stay in lockstep.
- Upload as `text/markdown` via Drive `create_file`; it converts to a Google Doc.
  The `fileSize: 1` in the create response is pre-conversion and misleading —
  re-read metadata to confirm the real size.
- Each run should grow or sharpen the articles, never merely reformat them.
  Adding generic definitions lowers the commodity score without lowering length.

## Run history

### v18 — 2026-09-07

Five articles rewritten and republished; v16/v17 archived; scorecard created.

Cleanup: the 2026-09-03 run died after creating only a new Trading Strategies
doc, leaving two live copies of that article. Both archived (the stale one
flagged `SUPERSEDED DUPLICATE`). No run occurred 04–06 Sep.

Research added this run:
- OTC: named market makers (Galaxy, GSR, OrBit Markets); named institutional
  firsts (CoinFund/Galaxy, Re7 Capital/OrBit APT); options market concentration
  (BTC+ETH ~85% of volume, ~85% of OI at Deribit).
- Pre-launch: TIA/JUP/DYM pre-launch vs launch price accuracy; full Aevo vs
  Hyperliquid hyperps mechanical comparison.
- MCP: 2026 exchange MCP landscape (Bybit, Bitget, Binance Agent OS 20 Aug 2026)
  and the three axes that actually differentiate.
- Staking: retired Bronze–Diamond tier system still dominating the SERP;
  supply arithmetic (917,139,416 circulating of 1B total).
- Trading strategies: restored five FAQs dropped in v17, including the PERPS+
  BTC/ETH-only coverage limit; Ondo volume and Ondo Perps competitive context.

Scores (weighted, 1–5): staking 4.85, pre-launch 4.70, OTC 4.45,
trading strategies 4.30, MCP 4.05. All non-commodity.

**Open item for the next run:** the MCP article states a hosted endpoint at
`mcp.aevo.xyz/mcp` with `AEVO-KEY`/`AEVO-SECRET` headers. The public GitHub
README documents only the Docker route at `localhost:8080/mcp`. Likely taken
from Aevo's own docs, which are blocked from this environment. Needs a human
check against docs.aevo.xyz — a reader following a wrong endpoint fails at
step one.

## Environment notes

The egress proxy blocks most research domains, including x.com, docs.aevo.xyz,
agp.aevo.xyz, coinmarketcap.com, binance.com, t.me and mirror.xyz. `WebSearch`
works and `github.com` / `raw.githubusercontent.com` are reachable via WebFetch.
Source the four X post URLs in the prompt indirectly — they cannot be fetched.
