#!/usr/bin/env sh
# Reports which Aevo hosts this environment can actually reach.
# Run before a pass that needs live figures. Exit 0 = all reachable.
#
# A 403 on CONNECT means the host is not on the environment's egress allowlist.
# That is a policy denial: do not retry it and do not route around it. Report it,
# and label the affected figures as unverified (see ROUTINE.md).

HOSTS="aevo.xyz app.aevo.xyz docs.aevo.xyz api-docs.aevo.xyz api.aevo.xyz otc.aevo.xyz"
blocked=0

for h in $HOSTS; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://$h/" 2>/dev/null)
  if [ "$code" = "000" ] || [ -z "$code" ]; then
    echo "BLOCKED  $h"
    blocked=$((blocked + 1))
  else
    echo "ok       $h  (HTTP $code)"
  fi
done

if [ "$blocked" -gt 0 ]; then
  echo
  echo "$blocked host(s) blocked by the environment's network egress policy."
  echo "Diagnosis: curl -sS \"\$HTTPS_PROXY/__agentproxy/status\" — recentRelayFailures names the host."
  echo "Fix (owner only, web UI): claude.ai/code -> Environments -> Default -> allowed domains."
  echo "Until then: work from the copy already in pages/, label unverified figures with their"
  echo "original as-of date, and list them in the CHANGELOG entry."
  exit 1
fi

echo
echo "All Aevo hosts reachable — live figures can be verified this run."
