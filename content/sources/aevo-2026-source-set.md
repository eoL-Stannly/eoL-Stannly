# Source set: Aevo (@aevoxyz) — 4 posts

Status: **BLOCKED — source text not retrieved.** No article has been written from
this set, because none of the four sources could be read.

## The four assigned sources

| # | URL | Post timestamp (UTC) | Retrieved? |
|---|-----|----------------------|------------|
| 1 | https://x.com/aevoxyz/status/2029965683056930907 | 2026-03-06 17:01:48 | No |
| 2 | https://x.com/aevoxyz/status/2036035408430084283 | 2026-03-23 11:00:43 | No |
| 3 | https://x.com/aevoxyz/status/2083191674344255953 | 2026-07-31 14:02:53 | No |
| 4 | https://x.com/aevoxyz/status/2090842637179691210 | 2026-08-21 16:45:05 | No |

The timestamps are the only facts recovered so far, and they were derived from the
IDs themselves rather than from the network. Twitter/X status IDs are Snowflake
IDs: the post time in milliseconds is `(id >> 22) + 1288834974657`, where
1288834974657 is the Twitter epoch (2010-11-04 01:42:54.657 UTC).

```
python3 -c "import datetime;i=2029965683056930907;print(datetime.datetime.utcfromtimestamp(((i>>22)+1288834974657)/1000))"
```

## Why they could not be read

The session's egress proxy enforces a GitHub-only allowlist. Every other host is
refused at the gateway before any request is sent:

```
$ curl -sS -o /dev/null -w "%{http_code}\n" https://x.com
000
$ curl -sS "$HTTPS_PROXY/__agentproxy/status"
  "recentRelayFailures": [
    { "kind": "connect_rejected",
      "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
      "host": "x.com:443" }
  ]
```

Hosts confirmed blocked: `x.com`, `www.aevo.xyz`, `aevo.mirror.xyz`, `t.me`,
`en.wikipedia.org`, `l2beat.com`. Hosts confirmed reachable: `api.github.com`,
`raw.githubusercontent.com`.

The proxy documentation at `/root/.ccr/README.md` is explicit that a 403 from the
gateway is an organisation policy denial and must be reported, not retried or
worked around. Mirror front-ends for X were therefore not attempted.

## What is required to unblock this

Widen the remote environment's network policy to permit outbound HTTPS, then
re-run. The policy is chosen per environment and is documented at
https://code.claude.com/docs/en/claude-code-on-the-web. At minimum the run needs:

- `x.com` — the four assigned posts and any thread replies.
- `aevo.xyz`, `aevo.mirror.xyz`, `docs.aevo.xyz` — the primary-source articles the
  posts link to, plus product documentation for verifying mechanics.
- General web search and fetch — required by the brief's "see what else ranks for
  the title" and "incorporate data from other sources" steps.

Alternative if the policy cannot change: paste the four posts' text, and the URLs
they link to, directly into the task prompt. The rewrite can then run against
supplied text, though the competitive-SERP and third-party-data steps still need
open egress.

## What was deliberately not done

No article drafts were produced. Search-engine result summaries were the only
external signal available, and those are generated summaries rather than primary
text — one of them attributed a title to source #1 that could not be corroborated
against any reachable page. Drafting from that would have manufactured exactly the
kind of unverifiable filler the brief's AUF standard exists to prevent, and would
have scored in the commodity band of the rubric in `../methodology/`.
