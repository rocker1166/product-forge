# Briefs for forge-build (fill the <...>)
These are the briefs that built the T4 apps (88 of 90 right). Sonnet, one owner per folder.

## Server
Build the server. Folder: <project>. Read AGENTS.md, REQUIREMENTS.md, modules/<m>/CONTEXT.md for the modules you own, prd/<m>.md when you need detail. You own: <server folders>, <server tests>. Stack: <stack>; no new dependencies.
First write API.md: every endpoint, body, answer, errors, roles. Colleagues build pages from it now; keep it in step with the code.
Build everything server-side for every line, with indexes for every list filter and sort, permissions, tenant isolation, jobs, messages, history. Money in minor units; let tests set the clock.
Every line the server can prove gets a real test whose name holds [W0xx]. Never a test that passes without the behaviour. Run the gate. Return: gate line, lines left for the pages, what you could not do.

## Pages (two agents, split the screens)
Build pages. Folder: <project>. Read AGENTS.md, REQUIREMENTS.md, API.md, the CONTEXT.md of your modules. You own: <web folders>, <browser tests>. One of you writes the shared kit first (button, field with error, dialog, confirm, toast, table, pager, formats, loading, empty, error with Retry).
Everything a person sees or does, every role. Browser tests whose name holds [W0xx] for lines only pages can prove. Never edit the server; bugs go to NOTES.md. Return: pages built, lines proven, what is left.

## Fix pass (fresh agent, owns everything)
Get the gate to 0 open and the suite green. Then do not trust the tests: start the app and go through every line in the browser as each role and tenant, to the exact number and word. Then walk as a careful user: mistakes, double press, reload, Back, two tabs, phone width, long names, another tenant's ids, forbidden actions. Fix with a test each. Never weaken a test. Return: gate line, what you found and fixed, worst first, what is still open.

## Blind reviewer (did not build)
Use the running app only. For every line: right / wrong (incomplete, incorrect, unreachable, words or numbers differ) / skipped, with what you saw. Try limits at and one over, each role, both tenants. Write review.yaml. Return counts and the worst five.
