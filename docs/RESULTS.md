# Results of the two tests

# T1 and T3, pilot on one product (2026-11-26)

**T1 failed. T3 failed against the baseline. By the plan's own rule we stop and rethink.**

Idea given to both: "Time tracking for freelancers and small agencies that ends in an invoice." Hidden product: Kimai, never opened by either arm (checked: no mention in their files). Same model (Sonnet). Budgets: ours about 863k tokens, plain about 791k. Two blind judges with the lists swapped, about 90% agreement. Hidden list 192 items.

| Found of the hidden list | Ours (map) | Plain (four passes, prose) | Gap |
|---|---|---|---|
| Full list (129) | 53.5% | 73.8% | **-20.3** (pass mark was +15) |
| core (53) | 72.2% | 85.4% | -13.2 |
| depth (76) | 40.5% | 65.8% | -25.3 |
| New since July (33) | 21.2% | 31.1% | -9.8 |
| Most asked for (30) | 37.5% | 50.8% | -13.3 |
| Useful, 30 random lines each | 76.7% | 93.3% | -16.6 (mark: 60%, and not below plain) |

## Why we lost
1. **We closed the scope too early.** One agent fixed 14 objects from 78 rows. On the objects both plans had (invoice, customer, rates, report, project, import) we tied. We lost whole areas nobody opened: absence, calendar, dashboard, preferences, company sign-in, ways of entering time.
2. **I told that agent 10 to 14 objects.** The plain plan had no such limit. That part is my mistake, not the method's.
3. **Nearly half of our lines were the common abilities** (437 of 947). They gave a tie on shared objects, not a win. Nothing the judges found was in ours and not in the plain plan.
4. The plain plan's fourth pass was told to go through every object and every common ability. That is our grid, in prose. It was the second most useful pass.
5. Ours was less useful because it printed labels (screen and journey names) and gave short lists tools they do not need (saved views, column choice). Both are fixed.

## What each plain pass added (full list)
| Pass | Lines | Adds | Total |
|---|---|---|---|
| 1. ten gap areas with some study | 436 | 56.0 | 56.0% |
| 2. more products, settings, requests | 235 | 7.0 | 63.0% |
| 3. walk as five people, then attack | 129 | 2.5 | 65.5% |
| 4. every object × every ability | 130 | 8.3 | 73.8% |

Credit goes to the line a judge named, so later passes are a little undercounted. **Pass 1 alone, about 137k tokens, already beat our whole map.**

## What this does and does not show
- It shows that structure does not find more features. A plain list with a good checklist, several passes and no limit does.
- It does not show that the map is useless for building: links, indexes, access, journeys, mock and drift checks were not tested. The map's walk and attack did find real clashes (no sign-in screen, a permission nothing stored, a delete that would have removed legal papers).
- One product, one run per arm, judges from the same model family, a hidden list made by an agent and partly matched by keyword. The gap is too big to be luck alone, but the exact numbers are soft.
- InvenTree and Zammad were **not** run. Their lists are sealed and clean.
- Your own blind rating (part of T3) was not done. The 60 lines are in `kimai/judge/useful.txt`, the key is in `kimai/key.json`.

## Tokens
About 3M for phases 0 and 1: library 0.15M, hidden lists at least 0.5M, our arm 0.86M, plain arm 0.79M, judges 0.5M. The plan guessed 0.5M for a module-size run; it was 0.86M.

## Review of the script (separate agent, after the test)
It built a hollow map (one-word answers, two tags behind everything, one journey that reads) and the checker passed it. Fixed, and that map is now a permanent test. Also fixed: inherited names counted as real, judgement hidden behind one real tag, size S for a whole product, every move by the system, "none" without a reason, empty examples, crash on half-written files, path in a harvest name, open owner decisions not shown, unescaped ids in the mock.
**Cannot be fixed by a script:** real words that are wrong, and real tags that do not support the answer. Only the 10% audit and the walks catch those. The pilot skipped the audit.


# T4: does the map make a build more complete? (rules written 2026-11-26, before any run)

**Module:** customers, invoices, payments and credit notes for small Indian service firms (2 to 20 people). Roles: owner, accountant, viewer. Two firms in the data.

**Both arms get the same frozen list of 90 requirements.** Finding features is no longer the question (T1 answered it). The question is whether a builder skips or breaks less when the same list is carried by a map.

| | Arm A, list | Arm B, map |
|---|---|---|
| Input | the 90 lines | the 90 lines, turned into a map, checked to exit 0, printed |
| Gate | every line needs a passing test that names it | every map id (lines, moves, refusals, rules, filters, states, access, messages) needs a passing test that names it |
| Same for both | scaffold, model (Sonnet), stack, brief, number of build agents, total tokens within 10% | making the map counts as tokens; arm A gets the same amount as extra review and fix passes |

Arm A is the strong version of a plain list on purpose: numbered lines and one test per line. If that is as good as the map, the map is not worth its cost.

**Stack:** Bun, Hono, SQLite, React, Vite. Light on purpose: this tests completeness, not speed. It is not the stack for real products (Go + Postgres).

**Judging.** Judges get two neutral folders (P and Q, chosen by coin), tests and spec removed, and the running apps. They use the apps. They never see the arms' tests or our checker.
- 90 lines: right / wrong (there, but incomplete or incorrect) / skipped.
- 40 hidden checks written by someone who saw only the list: 20 correctness edges, 20 common things the list does not say.
- Two judges, 30 shared items to measure agreement.

**Pass mark (from the plan, unchanged):** arm B skips **nothing** of the 90, and has **half the wrong items of arm A or fewer**. Hidden checks are reported, not part of the mark.
**If arm A has 3 or fewer skipped plus wrong,** there is nothing left for a map to win: counts as fail.
**If it fails, the map goes and the list stays.**

Known weakness: one run per arm, one small module, same model family for builders and judges.

## Result (scored 2026-11-27, key opened after all judges finished)
P was the plain list (A), Q was the map (B). Judges agreed on 57 of 60 shared verdicts.

| | List (A) | Map (B) |
|---|---|---|
| 90 lines right | **88** | 83 |
| wrong | **2** | 7 |
| skipped | 0 | 0 |
| 40 hidden checks passed | 27 | 27 |
| tokens | **about 1.05M** | about 1.43M |

**Fail.** The map needed half of A's wrong items (1) or fewer; it had 7. Neither skipped anything: one test per line was enough to stop skipping. The map's extra rules did show up in its app (for example, no payment reversal while credit is unused), but they did not make it more correct, and it cost 36% more.
**So the map is dropped as a build tool. Kept: the four-pass list, the structure pass as a PRD check (it found real holes), and one passing test per line.**
