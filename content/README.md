# Content pipeline

Rewrites source announcements into structured, FAQ-bearing articles, then grades
each one for non-commodity status before it ships.

## Current status

**Blocked.** The active source set — four @aevoxyz posts — could not be read. This
session's egress policy is a GitHub-only allowlist, so `x.com`, `aevo.xyz`,
`aevo.mirror.xyz` and every other non-GitHub host are refused at the gateway.
No articles have been drafted. Full detail and the unblock steps are in
[`sources/aevo-2026-source-set.md`](sources/aevo-2026-source-set.md).

The methodology below is complete and does not depend on the network, so the next
run with open egress can go straight to drafting.

## Layout

```
content/
  methodology/
    non-commodity-grading.md   scoring rubric, bands, scorecard template
    auf-writing-standard.md    answer-up-front rules, structure, FAQ rules
  sources/                     one file per source set: URLs, status, retrieval log
  articles/                    drafts, each with a completed scorecard
```

## Process per article

1. **Retrieve the primary source.** The announcement itself and anything it links
   to. Coverage of the announcement is not the source.
2. **Read the SERP.** Search the target query. Read the top ten. Record their URLs
   in `serp_reviewed` and list the questions none of them answer.
3. **Gather outside data.** Independent figures, comparisons, third-party
   measurements. Each with a source and an as-of date.
4. **Draft to the AUF standard.** Structure and sentence rules in
   `methodology/auf-writing-standard.md`.
5. **Grade it.** Complete the scorecard from
   `methodology/non-commodity-grading.md`. Below 65 does not ship.
6. **Iterate.** Raise the score by adding input, not by rewriting prose. The
   leverage list is in the rubric.

## Non-negotiable

No claim ships unless it is verifiable, attributed, or explicitly marked
uncertain. When sources cannot be reached, the run reports the blocker — it does
not draft around it. An article assembled from search-result summaries scores in
the commodity band by construction, which defeats the point of the pipeline.
