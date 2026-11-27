# Product Forge

**Turn a one-line product idea into a deep, checked PRD, then build it so nothing is skipped.**
Skills for [Claude Code](https://claude.com/claude-code) plus one small script. Built and tested, with the failures kept in.

```
idea ─▶ /forge-prd ─▶ PRD + owner sheet + clickable mock ─▶ forge handoff ─▶ /forge-build ─▶ gate: every requirement has a passing test
```

## Why
AI agents build what the PRD says. Most PRDs miss the boring things a mature product has: edit after create, every filter, export options, undo, states, roles, empty and error screens, money and tax edges. Then the build "finishes" with half of it missing.

## What is in it
| Part | What it does |
|---|---|
| `/forge-prd` | Four research passes over real products (gap areas, rivals' settings and requests, users walking minute by minute, every object × 37 abilities), a merge into waves, a fact check of law and money facts, a structure check that finds gaps and clashes, a user walk, an attack and an evidence audit. Out: PRD, two-page owner sheet, clickable mock |
| `forge handoff` | Writes the project's context: numbered requirement list, ids for the gate, a short `AGENTS.md`, one `CONTEXT.md` per module, a progress log |
| `/forge-build` | API contract first, parallel builders who each own their files, a gate, a fix pass on the running app, a blind review. Ready briefs for each agent |
| `gate.ts` | Done means every requirement id has a passing test that names it, like `[W042]`. Works with any test runner that writes JUnit XML |
| `forge` script | `check` (finds blanks, dead ends, unreachable states, unlinked lines), `print`, `mock`, `harvest` (reads public GraphQL, OpenAPI, Frappe DocType, Prisma, Rails schemas), `handoff`, `todo`, `sample` |
| `library/` | 13 kinds of object with what a mature product gives each, 37 abilities, 36 product-wide areas, 21 flow rules, 30 production checks, 12 day-one decisions |

## What the tests showed (honest)
| Test | Result |
|---|---|
| Find a hidden product's features from one line (blind judges) | A plain four-pass list found **74%**; a structured map with early objects found 54%. So lists find first |
| Build the same module twice (blind judges, 90 requirements) | List plus one test per line: **88 right, 0 skipped**. Map-driven build: 83 right, 36% dearer. So the build rule is one test per line |
| Fact check of law and tax lines written from memory | **14 of 68 wrong or changed.** The fact check is not optional |
| Evidence audit | Only about half the cited sources really supported the answer. A hard cap on "judgement" made agents fake sources; it is a warning now |

Details: [docs/RESULTS.md](docs/RESULTS.md), raw data in `eval/`.

## Start
[docs/INSTALL.md](docs/INSTALL.md) · [docs/USE-CASES.md](docs/USE-CASES.md) · [ROADMAP.md](ROADMAP.md)

Example output: [`examples/invoices-india`](examples/invoices-india) (a full PRD for invoices and payments for small Indian service firms: 452 wave-1 requirements, 27 objects, 68 money and tax rules with worked numbers, 54 screens, mock) and the small [`examples/invoices`](examples/invoices).

## Limits
Two tests, one model family, small samples. It finds what is missing, not what is wrong: the script says *filled*, never *right*. Common sense not written in the list still gets missed in builds. Tax and law facts need a professional.

MIT licence.
