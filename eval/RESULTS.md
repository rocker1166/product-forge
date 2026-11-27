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
