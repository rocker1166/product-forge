---
name: forge
description: Product Forge router. Idea to deep PRD (forge-prd), PRD to working code (forge-build). Use on "/forge", "plan this product", "make a full PRD", "spec this properly", "what is this PRD missing", "build from this PRD", or when a build is about to start from a thin brief.
---

# Forge

Home: `~/product-forge` (PLAN, research, tests). Script: `bun ~/product-forge/bin/forge.ts`.

| He wants | Do |
|---|---|
| a product, module or feature planned | `forge-prd` |
| to know what an existing PRD misses | `forge-prd`: passes A and D against it, then the structure check; report new lines, gaps and clashes |
| code built from a PRD | `forge-build` |
| a change to a finished PRD | edit the spec, `forge check`, print again; one line in `decisions.yaml` says why |

What is proven (2026-11-27, tests in `eval/`): a plain four-pass list finds more than a structured map (74% vs 54% of a hidden feature list). Building from the map was no better than building from the list with one test per line (83 vs 88 of 90 right, 36% dearer). The structure check still finds real gaps and money bugs in a PRD. So: lists find, structure checks the PRD, tests prove the build.

Never say complete. The script says filled; it finds what is missing, not what is wrong.
