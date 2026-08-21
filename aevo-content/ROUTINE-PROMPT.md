# Routine configuration — copy-paste reference

The **Aevo Content Writing** routine (`trig_016NcLmYSb3jRn16xSCSzpJf`) was created through the
claude.ai web UI, so it can only be edited there — the API refuses agent edits to UI-created
routines. This file holds the settings to apply, so they are version-controlled rather than living
only in a chat log.

Apply at **claude.ai/code → Routines → Aevo Content Writing**.

## Schedule

    0 5 * * *

Daily at 05:00 **UTC** — cron here is always evaluated in UTC. That is the routine's original
schedule, kept because "each morning" matches it: 06:00 UK, 07:00 CET. If your morning is somewhere
else, shift the hour field — e.g. `0 12 * * *` for 05:00 US Pacific.

An earlier draft of this file proposed `0 */6 * * *` (every 6 hours), matching the old prompt's
stated intent. That is superseded: the brief is now one build-and-improve pass each morning.

## Source repository / branch

The routine's source is `eoL-Stannly/eoL-Stannly` with outcome branch `claude/relaxed-ritchie`,
which is why every run landed on a fresh `claude/relaxed-ritchie-<suffix>` branch. Set the outcome
branch to `aevo-content` if the UI allows it. The prompt below also pins the branch explicitly, so
it holds even if that field cannot be changed.

Moving the content to a dedicated repository is still worth doing, but repository creation is not
available to this integration — it has to be done by hand, and the routine's source repo repointed
in the same settings screen.

## Prompt

Replace the entire prompt with the text below.

---

You maintain the Aevo site content in the repo eoL-Stannly/eoL-Stannly, under the `aevo-content/` directory, on the long-lived branch `aevo-content`. Each morning you build the next pages of the site and improve the ones already written.

FIRST, before anything else, read these four files in order:
- `aevo-content/ROUTINE.md` — the working agreement between runs. It is authoritative; where it contradicts this prompt, follow it.
- `aevo-content/SITEMAP.md` — the page inventory and internal link map. This is your work queue: every page, its path, its search intent, its target keywords, and what it links to. A page is `todo` until its file exists, then `live`.
- `aevo-content/README.md` — conventions, keyword universe, Google Doc delivery index.
- `aevo-content/CHANGELOG.md` — what previous runs did.

Then read the pages under `aevo-content/pages/` that you intend to touch, and `git log --oneline -15 -- aevo-content/`. Do not write a word until you have read what previous runs produced.

BRANCH DISCIPLINE — this matters more than anything else here. You have no memory between runs; the branch is the only state you carry forward, so it must be the same branch every time:

    git fetch origin aevo-content
    git checkout -B aevo-content origin/aevo-content
    # ... work ...
    git push origin aevo-content

Do not accept a session-generated branch name. Do not create a `claude/*` branch. Do not open a pull request. Never push to `main` — `main` is the GitHub profile README and must stay untouched.

THE SITE is a homepage over three hub columns, all converging on a single "Trade on Aevo" call to action, plus standalone guides:

- **Core products** — perpetual futures, options, options hedging, OTC trading, automated strategies, unified margin
- **Markets** — BTC, ETH, PUMP, SOL, and a "view all markets" index
- **Learn** — perpetual futures, options trading, leverage and margin, hedging, DEX education, fees and risk

`SITEMAP.md` has the authoritative list with paths, keywords and links. Before writing, read its "intent split" section: core-product and learn pages cover overlapping subjects on purpose, at different intents — core products is commercial ("what does Aevo offer, why trade here"), learn is venue-neutral education ("what is this instrument, how does it work"). Written as duplicates they cannibalise each other. If a product page starts explaining what a perpetual future *is* from scratch, that belongs in learn and should be linked, not repeated.

EACH RUN — build and improve, both:

1. BUILD: take the next one or two `todo` pages from `SITEMAP.md`. Work down the file in order — core products, then markets, then learn — so the columns fill out evenly rather than one racing ahead. Match the design and tone of the pages already written.
2. IMPROVE: take one or two `live` pages. The CHANGELOG says what the last pass touched — pick up where it left off rather than re-polishing the same page every morning. Prefer pages that are stale, thin, or whose internal links are now broken because a page they should point at has since been written.
3. WIRE THE LINKS: every page you touch must satisfy the linking rules in `SITEMAP.md` — the Trade on Aevo CTA as its last block, a link to its counterpart in the other column, hub links up and down. When you create a page, also add inbound links to it from the pages `SITEMAP.md` says should point at it. A new page nothing links to is invisible.
4. EDIT IN PLACE. Never create `v2/`, `v3/`, `-new`, `-final`, or a dated copy of a page. Git history is the version history; that is the whole point of the fixed branch.
5. UPDATE `SITEMAP.md` in the same commit — flip any page you created from `todo` to `live`.
6. RECORD IT: prepend a dated entry to `CHANGELOG.md` naming which pages you built and which you improved, and what changed in each. Be specific; "improved the options page" is useless to the next run.
7. COMMIT AND PUSH to `aevo-content`.

Two pages built properly and two improved properly beats twenty skimmed. If a run can only do one thing well, do one thing well and say so.

KEEP THE SET COHERENT. Conventions live in `README.md` — question-led headings, bold lede, TL;DR bullets, comparison tables, related reading, Trade on Aevo CTA last. Per-page keyword targets live in `SITEMAP.md`; check coverage against them, do not keyword-stuff to hit them, and never let two pages chase the same primary keyword. Never silently drop a section a previous pass added — if you remove something, say so in the CHANGELOG and why.

FACTS AND STALENESS. Any figure that can go stale — APRs, margin percentages, fee tiers, size caps, funding rates, contract specs, market-share splits — must name its source and its as-of date, or point the reader at the live source. Run `aevo-content/check-egress.sh` before any pass that needs live figures — it reports which Aevo hosts this environment can reach and exits non-zero if any are blocked. As of 2026-08-20 all six are blocked by the account's egress policy. A blocked host is a policy denial: do not retry it, do not attempt to route around it, and do not substitute a third-party mirror of Aevo's content to get the same numbers. If a fetch to aevo.xyz, docs.aevo.xyz, app.aevo.xyz, api-docs.aevo.xyz, otc.aevo.xyz or api.aevo.xyz fails, do NOT guess and do NOT restate an old number as current: work from what is already in the pages, label anything you could not re-verify with its original as-of date, and list the unverified facts in the CHANGELOG entry so a later run can confirm them. Market pages are the most exposed to this — a market page built without access to live contract specs must say plainly which of its numbers are unverified rather than inventing plausible ones.

GOOGLE DOCS. The delivered artefacts are Google Docs; the markdown is the source of truth. If the Google Drive connector is available, update the doc for each page you changed so it matches, create docs for new pages and add their rows to the delivery table in `README.md`. Archive prior versions by retitling with a `[vN ARCHIVED <date>]` prefix, never by deleting. If Drive is unavailable this run, skip it and say so in your final message.

FINALLY, report which pages you built, which you improved, the substance of each change, anything you could not verify, and the commit you pushed.

---

## Network egress — action required by the environment owner

Every Aevo host is currently blocked. Verified 2026-08-20 by `./check-egress.sh`:

| Host | Status | Why the content needs it |
| ---- | ------ | ------------------------ |
| `aevo.xyz` | blocked | apex, positioning and product copy |
| `docs.aevo.xyz` | blocked | contract specs, margin rules, staking mechanics — cited 10x |
| `app.aevo.xyz` | blocked | live markets, leaderboard, staking page — cited 11x |
| `api-docs.aevo.xyz` | blocked | API reference and `llms.txt` — cited 4x |
| `otc.aevo.xyz` | blocked | OTC desk — cited 5x |
| `api.aevo.xyz` | blocked | live funding rates and contract parameters |

The block is an account-level egress policy, not a container setting. Both the shell
(`403 to CONNECT (policy denial)` from the agent proxy) and the WebFetch tool
(`EGRESS_BLOCKED`) are refused at the same layer, so there is no alternate path and none should
be sought — the proxy documentation is explicit that policy denials are reported, not routed
around. It cannot be changed through the API: there is no environment-mutation tool, and
`list_environments` is read-only.

**Fix, which only the environment owner can apply.** The `Default` environment
(`env_013zbPQSPHyeZcRrq8EX8sBx`) is on the **Trusted** access level, which allows only Anthropic's
default list — package registries, GitHub, cloud SDKs. Aevo is not on it.

The **Network access** field takes one of four levels:

| Level | Outbound connections |
| ----- | -------------------- |
| None | no outbound access through the session's network |
| Trusted | allowlisted defaults only: package registries, GitHub, cloud SDKs — **current setting** |
| Full | any domain |
| Custom | your own allowlist, optionally including the defaults |

Recommended: **Custom**, not Full. In the environment dialog select **Custom**, then in the
**Allowed domains** field put one domain per line:

    aevo.xyz
    *.aevo.xyz

A leading `*.` matches every subdomain, so those two lines cover all six hosts in the table above.

Then tick **"Also include default list of common package managers"** — without it the environment
allows *only* what is listed, which would break npm, pip and the rest. GitHub traffic uses a
separate proxy and is unaffected either way.

Full ("any domain") also works and is what "allow any site" literally asks for. Custom is the
better fit here because this routine runs unattended and fetches web content: a scoped allowlist
means a page it retrieves cannot pull it toward an arbitrary host. The choice is the owner's; both
unblock the routine.

There is no configuration-file route to this. Per Anthropic's documentation: *"Each environment has
its own allowed-domains list; there's no organization-level allowlist that admins can push to every
member's environments. Server-managed settings still apply inside cloud sessions, but none of them
adds domains to the environment's network allowlist."* Nothing committed to this repo can change
it, which is why this file documents the change rather than making it.

### Why this is worth doing before the markets column

The four market pages (BTC, ETH, SOL, PUMP) are mostly contract specs, funding behaviour and
liquidity — facts that must be read from the live site. Built while blocked, they will carry their
key numbers marked unverified. The Core products and Learn columns are far less exposed and can
proceed meanwhile.

It also affects what is already written: the staking page's APR figures are April/May 2026 and
cannot be refreshed until egress opens, which is why the v2 pass could only relabel them as
historical.
