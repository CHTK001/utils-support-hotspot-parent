#!/bin/bash
git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch */target/ */target/lib/ *.jar *.zip 2>/dev/null' \
  --prune-empty -- --all
echo "Filter-branch complete"