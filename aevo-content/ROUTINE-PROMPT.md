# Routine configuration — copy-paste reference

The **Aevo Content Writing** routine (`trig_016NcLmYSb3jRn16xSCSzpJf`) was created through the
claude.ai web UI, so it can only be edited there — the API refuses agent edits to UI-created
routines. This file holds the settings to apply, so they are version-controlled rather than
living only in a chat log.

Apply at **claude.ai/code → Routines → Aevo Content Writing**.

## Schedule

    0 */6 * * *

Every 6 hours. The old value was `0 5 * * *` (once daily), which contradicted the prompt's own
"every 6 hours".

## Source repository / branch

The routine's source is `eoL-Stannly/eoL-Stannly` with outcome branch `claude/relaxed-ritchie`,
which is why every run landed on a fresh `claude/relaxed-ritchie-<suffix>` branch. Set the outcome
branch to `aevo-content` if the UI allows it. The prompt below also pins the branch explicitly, so
it holds even if the outcome-branch field cannot be changed.

Moving the content to a dedicated repository is still worth doing, but repository creation is not
available to this integration — it has to be done by hand, and then the routine's source repo
repointed in the same settings screen.

## Prompt

Replace the entire prompt with the text below. The old prompt's opening block was a one-off
keyword audit of the perps / hedging / options pages, marked "DON'T DO THESE EACH TIME" but left in
a recurring prompt; it has been dropped. The keyword lists it referenced now live in `README.md`.

---

You maintain the Aevo core-page articles in the repo eoL-Stannly/eoL-Stannly, under the `aevo-content/` directory, on the long-lived branch `aevo-content`.

FIRST, before anything else: read `aevo-content/ROUTINE.md`. It is the working agreement between runs and it is authoritative — where it contradicts this prompt, follow it. Then read `aevo-content/README.md`, `aevo-content/CHANGELOG.md`, every file in `aevo-content/articles/`, and `git log --oneline -15 -- aevo-content/`. Do not write a word until you have read what previous runs produced.

BRANCH DISCIPLINE — this matters more than anything else here. You have no memory between runs; the branch is the only state you carry forward, so it must be the same branch every time:

    git fetch origin aevo-content
    git checkout -B aevo-content origin/aevo-content
    # ... work ...
    git push origin aevo-content

Do not accept a session-generated branch name. Do not create a `claude/*` branch. Do not open a pull request. Never push to `main` — `main` is the GitHub profile README and must stay untouched.

THE ARTICLE SET is five fixed files in `aevo-content/articles/`:
1. `01-pre-launch-token-futures.md` — pre-launch token futures
2. `02-aevo-mcp.md` — the Aevo MCP
3. `03-aevo-otc-desk.md` — Aevo's OTC desk
4. `04-aevo-trading-strategies.md` — Aevo trading strategies
5. `05-aevo-staking.md` — Aevo staking, including the lottery and all forms of staking

EACH RUN:
1. If a listed article has no file, write it, matching the design and tone of the existing ones and of the earlier perps / hedging / options pillar pages.
2. Otherwise improve the articles that are weakest or most stale. The CHANGELOG says what the last pass touched — pick up where it left off instead of re-polishing the same article every run. One or two articles improved properly beats five skimmed.
3. Edit the files in `articles/` IN PLACE. Never create `v2/`, `v3/`, `-new`, `-final`, or a dated copy of an article. Git history is the version history; that is the whole point of the fixed branch.
4. Prepend a dated entry to `aevo-content/CHANGELOG.md` naming which articles changed and what changed in each — accuracy fixes, new sections, keyword coverage. Be specific; "improved article 3" is useless to the next run.
5. Commit with a message summarising the pass, and push to `aevo-content`.

KEEP THE SET COHERENT. Conventions and target-keyword lists live in `README.md` — question-led headings, bold lede, TL;DR bullets, comparison tables, a related-reading block cross-linking the set. Check keyword coverage against those lists; do not keyword-stuff to hit them. Never silently drop a section a previous pass added — if you remove something, say so in the CHANGELOG and why.

FACTS AND STALENESS. Any figure that can go stale (APRs, margin percentages, fee tiers, size caps, market-share splits) must name its source and its as-of date, or point the reader at the live source. `aevo.xyz` and its subdomains may be blocked by this environment's network egress policy. If a fetch to aevo.xyz, docs.aevo.xyz or api.aevo.xyz fails, do NOT guess and do NOT restate an old number as current: work from what is already in the articles, label anything you could not re-verify with its original as-of date, and list the unverified facts in the CHANGELOG entry so a later run can confirm them.

GOOGLE DOCS. The delivered artefacts are Google Docs; the markdown is the source of truth. If the Google Drive connector is available, update the doc for each article you changed so it matches, and keep the doc links in `README.md` current. Archive prior versions by retitling them, never by deleting. If Drive is unavailable this run, skip it and say so in your final message.

FINALLY, report which articles you changed, the substance of each change, anything you could not verify, and the commit you pushed.

---

## Network egress

`aevo.xyz`, `api.aevo.xyz` and `docs.aevo.xyz` are currently unreachable from the runtime
environment — all three return no response. Add `aevo.xyz` and `*.aevo.xyz` to the allowed domains
for the `Default` environment (`env_013zbPQSPHyeZcRrq8EX8sBx`) at claude.ai/code → Environments.
Until that is done, runs cannot verify any live Aevo figure, which is why the prompt above tells
them to label unverified facts rather than restate them as current.
