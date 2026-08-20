# Changelog

One entry per routine run, newest first.

## 2026-08-20 (later) — site architecture added, no page content changes

Second housekeeping pass, made by hand. Expands the brief from five articles to the full site IA.

- Added `SITEMAP.md`: the page inventory and internal link map, taken from the agreed site
  architecture — a homepage over three hub columns (Core products, Markets, Learn) converging on a
  single Trade on Aevo CTA, plus standalone guides. 21 pages total; 5 exist, 16 are `todo`.
  Each row carries the page's path, search intent, target keywords and outbound links.
- Reorganised `articles/` into `pages/`, mirroring the IA. Page content is byte-identical; only
  paths changed. Related-reading blocks use plain titles rather than relative paths, so nothing
  broke:
  - `03-aevo-otc-desk.md` -> `pages/core-products/otc-trading.md`
  - `04-aevo-trading-strategies.md` -> `pages/core-products/automated-strategies.md`
  - `01-pre-launch-token-futures.md` -> `pages/guides/pre-launch-token-futures.md`
  - `02-aevo-mcp.md` -> `pages/guides/aevo-mcp.md`
  - `05-aevo-staking.md` -> `pages/guides/staking.md`
- Rewrote `ROUTINE.md`: the loop is now build-and-improve, both every run — take the next one or
  two `todo` pages, plus one or two `live` pages to improve, and wire the internal links each time.
- Recorded the intent split between `core-products/` and `learn/` in `SITEMAP.md`. Both columns
  cover perpetual futures, options and hedging; written as duplicates they would cannibalise each
  other, so core products is commercial intent and learn is venue-neutral education, with the
  keyword sets split accordingly.
- Updated `ROUTINE-PROMPT.md` with the sitemap-driven prompt and a daily-morning schedule
  (`0 5 * * *`), superseding the every-6-hours draft.

Nothing in this pass changed a word of page copy.

## 2026-08-20 — restructure, no content changes

Housekeeping pass, made by hand rather than by the routine.

- Moved `v2/` to `articles/`. Article content is byte-identical; only the paths changed.
  Renamed `03-aevo-otc.md` to `03-aevo-otc-desk.md` for consistency with the v1 naming.
- Added `ROUTINE.md` — the working agreement each run reads first.
- Rewrote `README.md` as a live index rather than a v2 release note. The v2 pass notes it used to
  carry are preserved in the 2026-08-19 entry below.
- Consolidated onto the long-lived `aevo-content` branch. Previous runs each pushed to a fresh
  `claude/relaxed-ritchie-*` branch, so no run could see the previous run's work; that is what this
  restructure fixes.

## 2026-08-19 — v2 pass (Opus 5), all five articles

**Accuracy fixes**

- *Pre-launch futures* — v1 claimed the liquidation corridor was "2%", conflating margin-ratio
  percentage points with price movement. v2 shows the arithmetic under both maintenance-margin
  conventions (≈2% on entry notional, ≈3.8% on current notional for a long, ≈1.4% for a short) and
  tells the reader to trust the liquidation price in the UI rather than infer one. Also corrects
  "initial margin 0.5x" to the clearer "50% of notional".
- *Staking* — v1 quoted the reward cap as "15% of that pool" in one place and "4.50% / 10.5%" in
  another without reconciling them. v2 states both and shows they are the same rule measured
  against the tier pool vs the total distribution.
- *Staking* — April/May 2026 APR figures were presented as near-current. v2 labels them explicitly
  as historical and several months stale.
- *OTC* — the 25%/75% exchange-vs-OTC split is now framed as an industry estimate rather than a
  hard figure.

**New sections**

- *Pre-launch* — "How far can price move before I'm liquidated?", "How should I size a pre-launch
  position?", "Can I hedge a pre-launch position?"
- *MCP* — "What does a useful session actually look like?", "What can't it do?" (latency,
  non-determinism, unattended use, exchange limits), plus a stale-reads risk item.
- *OTC* — worked slippage-vs-RFQ comparison, quote-window behaviour, "Does an OTC position hedge
  my perps?"
- *Strategies* — "What the three modes look like in numbers": the same 10,000 USDC ETH long carried
  through all three PERPS+ modes; plus a premium-worth-it test in the hedging section.
- *Staking* — "How is my year-end share actually calculated?": worked score example, and the
  observation that tier scores sum to 1 so your score *is* your share of the tier pool.

**SEO / structure**

- Target-keyword coverage brought in line with the perps / hedging / options pillar methodology.
- "Related reading" block added to every article, cross-linking the set.

## 2026-08-18 — v1, all five articles

First drafts of the five core pages: pre-launch token futures, the Aevo MCP, the OTC desk, trading
strategies, staking. Pushed to `claude/relaxed-ritchie-gawjyi` under `content/aevo/`; superseded by
the v2 pass above.
