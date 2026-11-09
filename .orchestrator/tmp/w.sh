#!/bin/zsh
cd ~/Documents/Personal/portfolio/omniverse
for i in $(seq 1 9); do
  r=""
  for b in $(git branch --format='%(refname:short)' | grep -E '^r(17|18|19|20|21|22|23|24|25|26)|r25/copilot-effigy-dpr/'); do [ "$(git log --oneline main..$b | wc -l)" -gt 0 ] && r="$r $b"; done
  [ -n "$r" ] && { echo "ready:$r"; exit 0; }
  for p in w2:pJ w2:pK w2:pM w2:pQ w2:pS; do
    t=$(herdr pane read $p 2>/dev/null | tail -16)
    echo "$t" | grep -q "4. No, cancel" && herdr pane send-keys $p Down Down Enter
    echo "$t" | grep -qE "No \(Esc\)|Yes, allow creation|enter accept|tab Amend|Yes, accept this change|2. No, reject this change" && herdr pane send-keys $p Enter
  done
  sleep 25
done
