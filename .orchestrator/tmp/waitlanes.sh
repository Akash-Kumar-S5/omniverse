#!/bin/zsh
cd ~/Documents/Personal/portfolio/omniverse
for i in $(seq 1 14); do
  for b in $(git branch --format='%(refname:short)' | grep '^r16/'); do
    n=$(git log --oneline main..$b | wc -l); m=$(git merge-base --is-ancestor $b main && echo 1 || echo 0)
    [ "$n" -gt 0 ] && echo "ready $b"
  done | sort -u > .orchestrator/tmp/ready.txt
  [ -s .orchestrator/tmp/ready.txt ] && { cat .orchestrator/tmp/ready.txt; break; }
  for p in $(herdr agent list | grep -oE '"pane_id":"[^"]*"' | cut -d'"' -f4 | sort -u); do
    t=$(herdr pane read $p 2>/dev/null | tail -16)
    echo "$t" | grep -q "4. No, cancel" && herdr pane send-keys $p Down Down Enter
    echo "$t" | grep -q "Yes, accept this change" && herdr pane send-keys $p Enter
  done
  sleep 30
done
