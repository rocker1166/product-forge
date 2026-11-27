# Use cases

| You have | Do | You get |
|---|---|---|
| A one-line idea for a new product | `/forge-prd`, size L | wide list from real products, waved; PRD by module; owner sheet with 8 to 12 decisions; mock |
| One new module in an existing product (billing, inbox, approvals) | `/forge-prd`, size M | the module's list, objects, states, roles, screens, rules |
| A small feature | `/forge-prd`, size S | 1 agent, a few objects, checked |
| An existing PRD you do not trust | `/forge-prd`: passes A and D against it, then the structure check | lines it misses, gaps and clashes |
| A rival to copy the depth of | `forge harvest` on its public API schema | fields, states, filters, events, deprecated fields (what they regret) |
| A PRD and a team of agents | `forge handoff`, then `/forge-build` | parallel build with a gate, a fix pass, a blind review |
| A build that says "done" | `bun gate.ts` | which requirements have no passing test |
| A wave too big to read | `forge print` | short front book plus one file per module |

Not for: one-off copy, landing pages, art. Not a replacement for real users or for a lawyer or accountant on money and law.
