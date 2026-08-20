# Aevo site architecture — page inventory and internal link map

This file is the routine's work queue. Every page the site should have is listed here with its
slug, search intent, target keywords and outbound internal links. A page is `todo` until a file
exists at its path; after that it is `live` and gets improved rather than rewritten.

Structure comes from the agreed IA:

```
                          AEVO HOMEPAGE
        Decentralized derivatives exchange: perps, options, OTC
                                |
        +-----------------------+-----------------------+
        |                       |                       |
  CORE PRODUCTS             MARKETS                   LEARN
  Perpetual futures         BTC                       Perpetual futures
  Options                   ETH                       Options trading
  Options hedging           PUMP                      Leverage and margin
  OTC trading               SOL                       Hedging
  Automated strategies      View all markets          DEX education
  Unified margin                                      Fees and risk
        |                       |                       |
        +--------------- Internal links ----------------+
                                |
                          TRADE ON AEVO
```

## The intent split — read this before writing anything

`core-products/` and `learn/` deliberately cover overlapping subjects (perpetual futures, options,
hedging appear in both columns). They are **not** duplicates and must not be written as if they
were, or they will cannibalise each other:

- **`core-products/` is commercial intent.** The reader is choosing where to trade. Answer "what
  does Aevo offer, how does it work here, why here rather than elsewhere". Product mechanics,
  specs, fees, limits, comparison against other venues. Primary keywords are venue-shaped:
  `perps dex`, `options dex`, `decentralized options`, `trade eth perps`.
- **`learn/` is informational intent.** The reader does not yet know the instrument. Answer "what
  is this, how does it work, what can go wrong" in a venue-neutral way, then link to the product
  page as the next step. Primary keywords are question-shaped: `how do options work`,
  `options 101`, `what is a perpetual future`, `how does leverage work`.
- **`markets/` is asset intent.** One asset, its contracts on Aevo, its specs and its quirks.

If a core-product page starts explaining what a perpetual future *is* from scratch, that content
belongs in `learn/` and should be linked, not duplicated. The reverse is also true.

## Homepage

| Path | Status | Intent | Primary keywords | Links to |
| ---- | ------ | ------ | ---------------- | -------- |
| `pages/homepage.md` | todo | commercial | `decentralized derivatives exchange`, `crypto derivatives dex`, `perps options otc` | all three hub pages, Trade on Aevo |

Positioning line: *decentralized derivatives exchange: perps, options, OTC*.

## Core products

| Path | Status | Primary keywords | Links to |
| ---- | ------ | ---------------- | -------- |
| `pages/core-products/perpetual-futures.md` | todo | `perps dex`, `perpetual futures`, `perps trading`, `eth perps`, `btc perps`, `eth perpetual futures`, `btc perpetual futures` | `learn/perpetual-futures`, `markets/btc`, `markets/eth`, `core-products/unified-margin` |
| `pages/core-products/options.md` | todo | `options dex`, `decentralized options`, `crypto options`, `btc options`, `eth options`, `simple options`, `options easy mode` | `learn/options-trading`, `core-products/options-hedging`, `core-products/otc-trading` |
| `pages/core-products/options-hedging.md` | todo | `built in hedging`, `simple hedging`, `hedging perps positions with options`, `downside protection` | `learn/hedging`, `core-products/perpetual-futures`, `core-products/unified-margin` |
| `pages/core-products/otc-trading.md` | **live** | `otc crypto options`, `altcoin options`, `rfq options`, `block trades` | `core-products/options`, `learn/fees-and-risk` |
| `pages/core-products/automated-strategies.md` | **live** | `automated trading strategies`, `one-tap hedging`, `perps+`, `structured products` | `core-products/options-hedging`, `learn/hedging` |
| `pages/core-products/unified-margin.md` | todo | `cross margin`, `hedging cross margin`, `cross margin hedging`, `unified margin`, `portfolio margin` | `learn/leverage-and-margin`, `core-products/perpetual-futures`, `core-products/options-hedging` |

## Markets

Each market page: contract specs, margin and leverage limits, funding behaviour, liquidity notes,
what is distinctive about that asset on Aevo. Keep the numbers sourced and dated.

| Path | Status | Primary keywords | Links to |
| ---- | ------ | ---------------- | -------- |
| `pages/markets/index.md` | todo | `view all markets`, `crypto perps markets`, `available contracts` | every market page, `core-products/perpetual-futures` |
| `pages/markets/btc.md` | todo | `btc perps`, `bitcoin perps`, `btc perpetual futures`, `btc futures`, `btc options` | `markets/index`, `core-products/perpetual-futures`, `learn/fees-and-risk` |
| `pages/markets/eth.md` | todo | `eth perps`, `ethereum perps`, `eth perpetual futures`, `eth futures`, `eth options` | `markets/index`, `core-products/perpetual-futures`, `learn/fees-and-risk` |
| `pages/markets/sol.md` | todo | `sol perps`, `solana perps`, `sol perpetual futures` | `markets/index`, `core-products/perpetual-futures` |
| `pages/markets/pump.md` | todo | `pump perps`, `pump fun perps`, `pump token futures` | `markets/index`, `guides/pre-launch-token-futures` |

## Learn

Venue-neutral education. Every page ends by pointing at the matching product page.

| Path | Status | Primary keywords | Links to |
| ---- | ------ | ---------------- | -------- |
| `pages/learn/perpetual-futures.md` | todo | `what is a perpetual future`, `how do perpetual futures work`, `funding rate explained`, `perps vs futures` | `core-products/perpetual-futures`, `learn/leverage-and-margin` |
| `pages/learn/options-trading.md` | todo | `learn options trading`, `how to trade options`, `how do options work`, `options principles`, `options basics`, `options 101` | `core-products/options`, `learn/hedging` |
| `pages/learn/leverage-and-margin.md` | todo | `leverage explained`, `initial vs maintenance margin`, `liquidation price`, `how does leverage work` | `core-products/unified-margin`, `learn/fees-and-risk` |
| `pages/learn/hedging.md` | todo | `simple hedging`, `how to hedge a crypto position`, `hedging perps positions with options`, `downside protection` | `core-products/options-hedging`, `core-products/automated-strategies` |
| `pages/learn/dex-education.md` | todo | `what is a dex`, `decentralized exchange explained`, `cex vs dex`, `self custody trading` | homepage, `core-products/perpetual-futures` |
| `pages/learn/fees-and-risk.md` | todo | `trading fees`, `funding costs`, `liquidation risk`, `crypto derivatives risk` | `learn/leverage-and-margin`, `markets/index` |

## Guides

Standalone pages outside the three hub columns. They still carry the conventions and the CTA.

| Path | Status | Primary keywords |
| ---- | ------ | ---------------- |
| `pages/guides/pre-launch-token-futures.md` | **live** | `pre launch futures`, `pre market perps`, `trade token before listing` |
| `pages/guides/aevo-mcp.md` | **live** | `aevo mcp`, `ai agent trading`, `mcp trading server` |
| `pages/guides/staking.md` | **live** | `aevo staking`, `staking rewards`, `staking lottery`, `aevo tiers` |

## Linking rules

- Every page carries a **Trade on Aevo** call to action as its last block. It is the single
  conversion target in the diagram; no page is a dead end.
- Every page links to its counterpart in the other column — product to learn, learn to product.
  That pairing is the spine of the internal link graph.
- Hub pages (`homepage`, `markets/index`) link down to every page in their cluster; cluster pages
  link back up to their hub.
- Links are relative markdown paths within this repo, with the full page title as anchor text so
  the publisher can swap them for live URLs without rewriting the sentence. Never "click here".
- Cross-column links only where the pairing is real. Do not link every page to every other page.

## Status legend

`live` — a file exists and is under improvement. `todo` — not written yet.
Update this table in the same commit that changes a page's status.
