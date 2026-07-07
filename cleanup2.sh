#!/bin/bash
cd /d/ch/project/utils-support-hotspot-parent
export PATH="/d/Program Files/Git/mingw64/libexec/git-core:$PATH"
git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch */target/ */target/lib/ *.jar *.zip 2>/dev/null || true' \
  --prune-empty -- --all
echo "RESULT: $?"