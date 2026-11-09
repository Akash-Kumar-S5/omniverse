#!/bin/zsh
cd ~/Documents/Personal/portfolio/omniverse
for i in $(seq 1 14); do
  r=""
  for b in $(git branch --format='%(refname:short)' | grep '^r16/'); do
    [ "$(git log --oneline main..$b | wc -l)" -gt 0 ] && r="$r $b"
  done
  [ -n "$r" ] && { echo "ready:$r"; break; }
  for p in w2:pJ w2:pK w2:pM w2:pQ w2:pS w2:pY w2:pE; do
    t=$(herdr pane read $p 2>/dev/null | tail -16)
    echo "$t" | grep -q "4. No, cancel" && herdr pane send-keys $p Down Down Enter
    echo "$t" | grep -q "Yes, accept this change" && herdr pane send-keys $p Enter
  done
  sleep 30
done
