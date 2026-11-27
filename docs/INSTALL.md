# Install

Needs: [Bun](https://bun.sh) 1.3 or newer (the script uses `Bun.YAML`), [Claude Code](https://claude.com/claude-code), git.

```bash
git clone https://github.com/rocker1166/product-forge ~/product-forge
```

```bash
cd ~/product-forge && ./install.sh
```

`install.sh` links the three skills into `~/.claude/skills` and runs the tests. Paths in the skills assume `~/product-forge`; if you clone elsewhere, link it there or edit the paths.

Check it works:

```bash
bun ~/product-forge/bin/forge.ts check ~/product-forge/examples/invoices/spec
```

It should end with `0 missing`. Open `examples/invoices/MOCK.html` in a browser to see a clickable mock made from a spec.

## Use
In Claude Code, in any project:
- `/forge-prd` then describe the idea in one line.
- Answer the owner sheet (`OWNER-SHEET.md`).
- `bun ~/product-forge/bin/forge.ts handoff <project>/spec <project>`
- `/forge-build`

## Commands
| Command | Does |
|---|---|
| `forge init <spec>` | start a spec folder |
| `forge check <spec>` | list what is missing or unlinked; exit 1 if anything |
| `forge print <spec>` | write PRD.md (split into prd/*.md when long) and OWNER-SHEET.md |
| `forge mock <spec>` | write MOCK.html; `measure()` in its console walks every journey |
| `forge harvest <spec> <name> <graphql\|openapi\|doctype\|prisma\|rails> <url or file> [Only,These]` | read a public schema into refs/ |
| `forge handoff <spec> <project>` | write REQUIREMENTS.md, ids.txt, AGENTS.md, modules/*/CONTEXT.md, PROGRESS.md, copy the PRD |
| `forge todo / flat / sample <spec>` | ids a builder can prove / one line per capability / 10% of answers to audit |
| `bun gate.ts [ids.txt] [results.xml]` | done = every id has a passing test |

`forge` = `bun ~/product-forge/bin/forge.ts`. Tests: `bun test bin`.
