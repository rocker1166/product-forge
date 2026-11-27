# Roadmap

## Done
- PRD pipeline: four passes, merge, fact check, structure check, walk, attack, audit, owner sheet, mock
- Checker with 90 tests, schema harvester, printer, mock, handoff, gate
- Build skill with briefs, tested once against a plain build

## Next
1. Use the whole chain on a real product end to end and publish the numbers.
2. Common sense in builds: turn the 40 hidden checks into a standard requirement pack every PRD gets.
3. Fix-pass agent driving the mock and the running app with measured clicks, focus and dead ends.
4. Better module guessing in `handoff` (lines land in one module today).
5. More schema formats in `harvest` (Django models, Laravel migrations).
6. Test with other models and with more than one product per test.

## Not planned
- Simulated customers as proof of demand (studies show they push back half as much as real ones).
- A big structured build framework: it did not beat one test per line.
