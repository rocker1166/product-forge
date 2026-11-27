---
name: forge-prd
description: Turn a one-line brief into a deep, concrete PRD - a four-pass requirement list checked against real products, fact-checked law and money rules, then a structure pass (states, roles, screens, journeys, clashes), a clickable mock and a two-page sheet for the owner. Use for "make a full PRD", "spec this product", "/forge-prd", or before any real build.
---

# Forge PRD

Brief → four passes → merge → fact check → structure → walk → mock → owner sheet → PRD.
**Lists find. Structure checks the PRD. Tests prove the build.** In a test on one product a plain four-pass list found 74% of a hidden feature list and a map with early objects found 54%. Structure then found gaps and clashes in a list that looked complete. So both, in this order.

You are the lead. Passes, fillers and walkers are Sonnet agents, 6 to 8 at once, one owner per file. The one who wrote never audits. `forge` = `bun ~/product-forge/bin/forge.ts`. Folder: `<project>/spec`. Shapes: `examples/invoices/spec`.

## 0. Pick a mode, and who works on what
| Mode | For | Steps | Agents | Tokens (measured on one product) |
|---|---|---|---|---|
| **lite** | a feature, a quick check of an idea | 1, passes A+D in one agent, baseline, structure in one agent, 7 | 2 to 3 | about 0.4M |
| **standard** (default) | a module or a small product | 1, 2 (A, B, D), 3, 4, baseline, 5, attack, audit, 7 | 8 to 12 | about 1.5M |
| **full** | a product you will build for real | everything | 20 to 25 | about 3.5M |
Pass C (walk minute by minute) added 2.5 points of coverage in the test but finds what is wrong: in standard only the attack runs.

**Models: the cheapest one that can do the job.**
| Work | Model |
|---|---|
| You, the lead: scope, briefs, merge decisions, judging results, owner sheet | the session model |
| Research passes, structure fillers, attack, fact check | Sonnet |
| Evidence audit, harvest summaries, reading a long file for one fact, counting | Haiku |

**Tokens are the lead's job.** Before fanning out, write the plan and its token guess in `spec/COST.md`. After each agent, add one line: step, model, tokens it reported, what it produced. Stop and say so when the run passes its guess by half. Small briefs, exact file paths, word caps on what agents return, no agent reads more than its slice.

## 1. Brief
`forge init <project>/spec`, fill `brief.yaml`. At most five questions, only if the answer is not known: who pays, the job, country and law, money model, will customers make their own fields or objects.

## 2. Four passes, at the same time (M and L)
Each agent writes `spec/raw/<letter>.yaml`: `{id, text (one testable sentence, at most 30 words), area, src (link or judge), d: "", at: [], why: ""}`. No limit on areas. A line may end as later or no, but it is written first.

| Pass | What | In the test it added |
|---|---|---|
| A | ten gap areas: roles; workflows with exceptions; data; rules; states; exceptions; validation; messages; jobs; joining, leaving, moving data | 56 points |
| B | at least eight real products: settings, permissions, reports, templates, requests, bad reviews, changelogs; every area in `library/product.yaml`. Also `spec/ledger/market.yaml` | 7 |
| C | walk minute by minute as eight people (taps, prefilled, seen after, undo, bad network), then attack: fraud, money, law, leaks | 2.5, but it finds what is wrong and how it feels |
| D | list every object, then every object × 37 abilities (`library/abilities.yaml`) | 8 |

## 3. Merge
One agent reads all lines and writes one row per line: `now`, `room`, `later: why`, `no: why`, `dup ID`, `fix now: new sentence`. Also OBJECTS.md (at most 25 for the wave), CLASHES.md, QUESTIONS.md. Wave 1 is the smallest product someone can really live on for a month.

## 4. Fact check
A different agent checks every law, tax, money and platform fact on pages it opens now: RIGHT, WRONG, CHANGED, UNSURE. Wrong facts are fixed in the list. Unsure ones go to the owner sheet with the name of the expert who must confirm. Never skip this for money, tax, health or law.

## 4b. Baseline: common sense and security
`forge baseline spec` adds 24 common-sense and 20 security lines (`library/baseline.yaml`) to the wide list with no decision. Each must be landed (now) or refused (no: why) before the check passes. In a blind test both builds missed about 12 of 40 common-sense checks because no PRD said them.

## 5. Structure pass
Fillers (at most 5 objects each) write `spec/objects/*.yaml`; others own roles, screens, journeys, messages, rules, connections, running. Each also writes `spec/land/<name>.yaml`: where each wave-1 line lands (`invoice.issue`, `rule:R3`, `screen:home`, `message:x`, `connection:x`, `setting:text`, `product:views`).
Rules for fillers: the list wins over a kind default; carry exact numbers; every state has a way out; every move says who, guard, effect, reverse, notify; every refusal has words; evidence is `wide:ID`, a ledger id, `S:product/Object.field` or `judge`. Judgement is allowed and counted; a tag that does not support the answer is a lie and worse than `judge`. **Write down every gap and clash the structure shows**; that is what this pass is for.
`forge check spec` until it exits 0. Fix by answering, never by deleting a question.

## 6. Walk, attack, audit
Walkers run in the mock and the PRD with jobs from outside the map; they may only press what exists; a finding names the step that fails. One attacker, who always covers security: access by role and tenant, links, files, payments and bank changes, logs, support access, sign-in abuse.
**Audit, always** (Haiku): `forge sample spec 10` to a different agent, which writes `spec/raw/audit.yaml` (holds, loose, wrong, judge). Then `forge demote spec` turns every loose or wrong tag into `judge`. Report the share that held; in our run only about half did.

## 7. Give it to the owner
`forge print spec` (PRD.md, OWNER-SHEET.md), `forge mock spec` (MOCK.html), `forge todo spec` (what a builder must prove). The owner reads the sheet and clicks the mock. Answers go to `decisions.yaml`. Say what is unsure, what was not read, and that filled does not mean right. Later changes: edit the map, check, print again.

## 8. Hand over
The builder gets PRD.md, prd/*.md and the wave-1 list (`forge flat spec`, or the `now` lines). Use `forge-build`. Do not hand the map's 1,900 todo ids to a builder: a build test showed it costs more and is not more correct.

## Sizes
S: one feature or small module, up to 8 objects: one agent, steps 1, 3 (objects), 5, 7. M: one module: passes A and D, merge, 4 to 7. L: everything, one wave at a time.
