# Working agreement — Aevo Content Writing routine

This file is the contract between runs. The routine has no memory between firings; this
directory is the only state it carries forward. Read this file first, every run.

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

## The loop

Every run, in order:

1. **Read the current state.** `aevo-content/README.md`, `aevo-content/CHANGELOG.md`, and every
   file in `aevo-content/articles/`. Also `git log --oneline -15 -- aevo-content/` to see the last
   few passes. Do not start writing before you have read what already exists.
2. **Pick the work.** If an article in the index has no file yet, write it. Otherwise improve the
   articles that are weakest or most stale — the CHANGELOG says what the last pass touched, so
   pick up where it left off rather than re-polishing the same article every time.
3. **Edit in place.** Change the files in `articles/`. Never create `v2/`, `v3/`, `-new`, `-final`,
   or a dated copy of an article. Git history is the version history.
4. **Record it.** Prepend a dated entry to `CHANGELOG.md` saying which articles changed and what
   changed in each — accuracy fixes, new sections, keyword coverage. Specific, not "improved
   article 3".
5. **Commit and push** to `aevo-content`.

## Rules that keep the set coherent

- Five articles, fixed filenames, as listed in `README.md`. Adding a sixth means adding it to the
  index in `README.md` too.
- Keep the conventions in `README.md` — question-led headings, bold lede, TL;DR bullets, related
  reading block.
- Keyword coverage targets live in `README.md`. Check against them; don't keyword-stuff to hit them.
- Facts that can go stale (APRs, margin percentages, fee tiers, size caps) must name their source
  and their as-of date, or point the reader at the live source. If you cannot verify a number this
  run, label it as of its original date rather than restating it as current.
- Never silently drop a section a previous pass added. If you remove something, say so in the
  CHANGELOG and why.

## Network access

`aevo.xyz` and its subdomains may be blocked by the environment's network egress policy. If a
fetch to `aevo.xyz`, `docs.aevo.xyz`, or `api.aevo.xyz` fails, do not guess at the numbers and do
not present unverified figures as current — work from what is already in the articles, label
anything you could not re-verify with its original as-of date, and note in the CHANGELOG which
facts went unverified this run.
