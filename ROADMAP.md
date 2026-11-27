# Roadmap

## Done
- PRD pipeline: four passes, merge, fact check, structure check, walk, attack, audit, owner sheet, mock
- Checker with 90 tests, schema harvester, printer, mock, handoff, gate
- Build skill with briefs, tested once against a plain build

## Done since
- Baseline pack: 24 common-sense and 20 security requirements in every PRD
- Measured walk of the running app (`walk.ts`)
- Modes (lite, standard, full), model per task, token budget kept by the lead
- Evidence audit always on, `forge demote`
- `handoff` puts a line in the module most of it lands in

## Next
1. Use the whole chain on a real product end to end and publish the numbers.
2. `walk.ts` that also fills forms with safe test data and measures clicks per journey.
5. More schema formats in `harvest` (Django models, Laravel migrations).
6. Test with other models and with more than one product per test.

## Not planned
- Simulated customers as proof of demand (studies show they push back half as much as real ones).
- A big structured build framework: it did not beat one test per line.
