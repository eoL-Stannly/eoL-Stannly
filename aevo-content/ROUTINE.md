# Working agreement — Aevo Content Writing routine

This file is the contract between runs. The routine has no memory between firings; this directory
is the only state it carries forward. Read this file first, every run.

## Branch

Work on the branch **`aevo-content`** and push to it:

```
git fetch origin aevo-content
git checkout -B aevo-content origin/aevo-content
# ... work ...
git push origin aevo-content
```

Do **not** accept a session-generated branch name, do not create a `claude/*` branch, and do not
open a pull request. One long-lived branch is the point — it is what lets each run see what the
previous run did.

Nothing here is ever merged to `main`. `main` is the GitHub profile README and must stay as it is.

## What the site is

`SITEMAP.md` holds the full page inventory: every page, its path, its search intent, its target
keywords, and its internal links. It is the work queue. A page is `todo` until its file exists,
then `live` and under improvement.

The shape is a homepage over three hub columns — **Core products**, **Markets**, **Learn** — all
converging on a single **Trade on Aevo** call to action, plus a few standalone guides. Read
`SITEMAP.md`'s "intent split" section before writing: core-product and learn pages cover
overlapping subjects on purpose, at different intents, and must not be written as duplicates.

## The loop, every run

1. **Read the current state.** `SITEMAP.md`, `README.md`, `CHANGELOG.md`, and the pages under
   `pages/` that you intend to touch. Also `git log --oneline -15 -- aevo-content/` for the last
   few passes. Do not write a word before you have read what already exists.

2. **Pick the work — build *and* improve, both, every run.**
   - **Build:** take the next one or two `todo` pages from `SITEMAP.md`. Work down the file in
     order — core products, then markets, then learn — so the hub columns fill out evenly rather
     than one column racing ahead.
   - **Improve:** take one or two `live` pages. The CHANGELOG says what the last pass touched;
     pick up where it left off rather than re-polishing the same page every morning. Prefer pages
     that are stale, thin, or whose internal links are now broken because a page they should point
     at has since been written.

   Two pages built properly and two improved properly beats twenty skimmed. If a run can only do
   one thing well, do one thing well and say so.

3. **Wire the links.** Every page you touch must satisfy the linking rules in `SITEMAP.md`: the
   Trade on Aevo CTA as its last block, a link to its counterpart in the other column, hub links up
   and down. When you create a page, also add inbound links to it from the pages `SITEMAP.md` says
   should point at it — a new page nothing links to is invisible.

4. **Edit in place.** Change the files under `pages/`. Never create `v2/`, `v3/`, `-new`, `-final`,
   or a dated copy of a page. Git history is the version history.

5. **Update `SITEMAP.md`** in the same commit: flip any page you created from `todo` to `live`.

6. **Record it.** Prepend a dated entry to `CHANGELOG.md` naming which pages you built and which
   you improved, and what changed in each — accuracy fixes, new sections, keyword coverage, links
   added. Be specific; "improved the options page" is useless to the next run.

7. **Commit and push** to `aevo-content`.

## Rules that keep the set coherent

- The page list is `SITEMAP.md`. Adding a page means adding a row there, with its intent, keywords
  and links, in the same commit.
- Keep the conventions in `README.md` — question-led headings, bold lede, TL;DR bullets,
  comparison tables, related reading.
- Keyword targets are per-page in `SITEMAP.md`. Check coverage against them; do not keyword-stuff
  to hit them, and do not let two pages chase the same primary keyword.
- Never silently drop a section a previous pass added. If you remove something, say so in the
  CHANGELOG and why.

## Facts and staleness

Any figure that can go stale — APRs, margin percentages, fee tiers, size caps, funding rates,
contract specs, market-share splits — must name its source and its as-of date, or point the reader
at the live source.

`aevo.xyz` and its subdomains may be blocked by the environment's network egress policy. If a fetch
to `aevo.xyz`, `docs.aevo.xyz` or `api.aevo.xyz` fails: do **not** guess, and do **not** restate an
old number as current. Work from what is already in the pages, label anything you could not
re-verify with its original as-of date, and list the unverified facts in the CHANGELOG entry so a
later run can confirm them. Market pages are the ones most exposed to this — a market page built
without access to live specs should say plainly which of its numbers are unverified.

## Checking network access before you start

Run `aevo-content/check-egress.sh` at the start of any pass that needs live figures. It reports
which Aevo hosts this environment can reach and exits non-zero if any are blocked.

A blocked host is an egress-policy denial. Do not retry it, do not attempt to route around it, and
do not substitute a third-party mirror of Aevo's own content to get the same numbers — that
defeats the policy just as surely. Report it in your final message and in the CHANGELOG entry, and
fall back to the labelling rule above. Only the environment owner can open a host, in the
environment's settings; `ROUTINE-PROMPT.md` has the details.
