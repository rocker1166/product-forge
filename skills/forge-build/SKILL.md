---
name: forge-build
description: Build a module or product from a PRD so nothing is skipped and little is wrong - frozen numbered requirement list, one passing test per line as the only definition of done, API contract first, parallel builders with one owner per file, a fix pass that uses the running app, and a blind review. Use on "/forge-build", "build this PRD", "build module X from the spec", or after forge-prd.
---

# Forge build

Tested 2026-11-27 (`~/product-forge/eval/T4.md`): building from a numbered list with one test per line got 88 of 90 requirements right, 0 skipped. That is this skill. Gate: `bun ~/product-forge/bin/gate.ts`.

## 1. Freeze the list and the context
`bun ~/product-forge/bin/forge.ts handoff <spec> <project>` writes REQUIREMENTS.md (the wave's `now` lines by module), ids.txt, a short AGENTS.md, modules/*/CONTEXT.md (what the module owns, its lines, where the detail is), PROGRESS.md, and copies the PRD. No forge spec? Write REQUIREMENTS.md by hand: `W001 <one testable sentence>`, numbers and limits written out; ids in ids.txt. Anything not in the list is out of scope for this build. A change to the list is a decision, written down.

## 2. Stack and skeleton
Stack from your own stack choice (newest stable versions, checked live). One thin slice that signs in, saves, lists and is tested end to end before any feature. Seed with realistic volume.

## 3. Contract first
The server agent writes `API.md` (every endpoint, body, answer, errors, roles) **before** code. Page builders start from it at once. Paths and names stay stable; a change updates API.md in the same step.

## 4. Build in parallel, one owner per file
Server agent; two page agents splitting the screens; Sonnet; at most 6 at once. Each owns its folders, writes bugs it finds in others' files to a notes file, never edits them. Shared kit first by one owner.
Rules in every brief: every line needs a real test whose name holds `[W0xx]`; one test may name several lines only if it proves each; never a test that passes without the behaviour; small files by subject; no new dependencies without a reason.

## 5. Gate
`bun gate.ts` (or `bun gate.ts ids.txt results.xml` for another stack with JUnit output). Done means 0 open and the full suite green. Nothing else counts.

## 6. Fix pass (the one that matters)
A fresh agent who owns everything: gate to 0, then **does not trust the tests**: starts the app and goes through every line in the browser as each role and firm, to the paisa and the word; then walks as a careful user (double press, reload, Back, two tabs, phone width, long names, another tenant's ids, forbidden actions). In the test it found 15 real defects behind a green gate.

## 7. Blind review
A reviewer who did not build uses the running app against the list and reports right / wrong / skipped per line. Fix what is wrong, then run step 6 once more. The builder never scores its own work.

## Briefs
Ready-to-use agent briefs (server, pages, fix pass, blind reviewer): `~/product-forge/skills/forge-build/briefs.md`.

## Context while building
Each agent reads AGENTS.md and only its module's CONTEXT.md, then prd/<module>.md when it needs detail. When something bites, add one line under Traps in that CONTEXT.md. One line per session in PROGRESS.md. Generated context beats agent-written context: no gain was measured from long hand-written files.

## Known limits
One test showed this; one product, one model. Common-sense UX not in the list (unsaved-changes warning, not-found page, offline errors) failed about 12 of 40 hidden checks in both builds: put those in the list (forge-prd pass C) rather than hoping.
