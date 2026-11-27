#!/usr/bin/env bash
# Links the skills into Claude Code and runs the tests.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
command -v bun >/dev/null || { echo "Install Bun first: https://bun.sh"; exit 1; }
mkdir -p "$HOME/.claude/skills"
for s in forge forge-prd forge-build; do ln -sfn "$here/skills/$s" "$HOME/.claude/skills/$s"; echo "linked $s"; done
[ "$here" = "$HOME/product-forge" ] || echo "Note: the skills expect ~/product-forge. Link it: ln -s \"$here\" ~/product-forge"
bun test "$here/bin" 2>&1 | tail -3
