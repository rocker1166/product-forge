# Spec frameworks, requirement methods, simulated users (as of 2026-11-25)

Marks: D = I read the page/file. S = search snippet only. J = my judgement. Stars and releases pulled with `gh api` today (D).

## Part A. AI spec frameworks

| Tool | Stars / last release | Steps and artefacts | Completeness check | Domain research / role sim / code trace |
|---|---|---|---|---|
| [Spec Kit](https://github.com/github/spec-kit) | 151k / v1.4.4, 23 Nov (D) | constitution, specify, clarify, plan, tasks, analyze, implement, plus checklist and converge commands; spec, plan, data-model, tasks files (D, [templates](https://github.com/github/spec-kit/tree/main/templates/commands)) | Best in class, but all LLM-judged. `clarify` scans a fixed taxonomy, marks each category Clear / Partial / Missing, asks at most 5 questions ([clarify.md](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md), D). `checklist` is framed as "unit tests for English" on requirement quality ([checklist.md](https://github.com/github/spec-kit/blob/main/templates/commands/checklist.md), D). `analyze` maps tasks to requirements, flags zero-coverage, rates severity ([analyze.md](https://github.com/github/spec-kit/blob/main/templates/commands/analyze.md), D) | None / none / task-to-requirement only |
| [BMAD](https://github.com/bmad-code-org/BMAD-METHOD) | 55.7k / v6.12.4, 14 Oct (D) | v6 is now a skill pack: analyst, PM, UX, architect, dev, PO agents; PRD template with ids UJ/FR/RULE/SM/OQ and a "done when" rubric ([template-prd.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/skills/method/bmad-agent-pm/assets/template-prd.md), D) | Rubric prose, not computed. Template says every FR traces to a journey and metrics need counter-metrics (D). `advanced-elicitation` picks methods from a CSV with a script ([pick_methods.py](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/skills/core-tools/bmad-advanced-elicitation), D) | `deep-recon` skill exists (name only, not read). Role sim: yes, `party-mode` multi-agent and `forge-idea` with attack/defend personas, one question at a time ([SKILL.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/skills/core-tools/bmad-forge-idea/SKILL.md), D). Trace: IDs, no matrix |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 75.7k / v2.2.0, 24 Nov (D) | proposal, delta specs per capability, design, tasks; archive merges deltas ([spec-driven schema](https://github.com/Fission-AI/OpenSpec/blob/main/docs-lab/reference/schemas/spec-driven/index.md), D) | `openspec validate` is structural (needs at least one delta or an explicit skip). Nothing checks "what is missing" (D) | None / none / spec-to-change folder, living spec per capability |
| [Superpowers](https://github.com/obra/superpowers) | 326k / v7.0.2, 3 Nov (D) | brainstorm (approaches, design doc, approval), writing-plans, execution skills | One question at a time, no coverage taxonomy ([brainstorming SKILL](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md), D) | None |
| [GSD](https://github.com/gsd-build/get-shit-done) | 64k / v1.42.3, May 2026, last push 31 May (D) | discuss-phase, plan, execute, verify per phase | Phase verification; no taxonomy (S) | Stalled since May (J) |
| [Agent OS](https://github.com/buildermethods/agent-os) | 5.6k / v3.0.0, Jan 2026 (D) | standards discovery from your own code, inject into specs | Standards only (S) | Reads your code, not the market |
| [Taskmaster](https://github.com/eyaltoledano/claude-task-master) | 28.5k / 0.43.1, Mar 2026 (D) | PRD in, tasks out, complexity analysis | Complexity score, not completeness (S) | None |
| [PRPs](https://github.com/Wirasm/PRPs-agentic-eng) | 2.3k, no releases, push Oct (D) | PRP = PRD + codebase context + validation loops | Validation gates on code (S) | Codebase research only |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 26.2k / v3.38.3, 23 Nov (D) | ce-brainstorm, ce-plan, ce-work, ce-code-review, ce-compound (writes lessons back) | `ce-doc-review` runs persona reviewers (coherence, feasibility, scope-guardian, product, design, security, adversarial); a finding must show the work fails without the fix; rejected findings are suppressed next round ([guide](https://github.com/EveryInc/compound-engineering-plugin/blob/main/docs/guides/ce-doc-review.md), D) | Roles: yes, as reviewers. Domain research: none found |
| [Kiro](https://kiro.dev/docs/specs/) | closed source (D) | requirements (or bugfix.md), design, tasks | "Analyze Requirements" finds inconsistencies, ambiguity, gaps; property-based tests for correctness. Page does not mention EARS (D) | None |
| [Tessl](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/) | no public repo found | Spec Registry (10k+ library specs), Framework in beta | Registry quality scores are Tessl's own checks (S) | Library docs only |
| [Traycer](https://traycer.ai) / [ChatPRD](https://www.chatprd.ai) | Traycer 1.8k, desktop v1.5.4 / ChatPRD closed | Traycer: parallel agents with planning skills. ChatPRD: PRD drafting, MCP to coding tools | Neither page shows a completeness check (D) | none |
| Newer: [Spec Workflow MCP](https://github.com/Pimzino/spec-workflow-mcp) 4.3k, [Conductor](https://github.com/gemini-cli-extensions/conductor) 3.8k, [spec-kitty](https://github.com/spec-kitty/spec-kitty) 1.7k, [pm-claude-skills](https://github.com/mohitagw15856/pm-claude-skills) 1.6k, [SpecForge](https://github.com/ductienuit/SpecForge) 1 star | (D, star counts only) | | SpecForge claims requirement-quality scoring (S, tiny) | |

**What works** (J, from the files above): fixed category taxonomy with Clear/Partial/Missing (Spec Kit); persona reviewers that must justify each finding (CE); stable IDs (BMAD); one-question-at-a-time interviews (Superpowers, BMAD).

**Real complaints** (D): no way to refine an existing spec, 105 thumbs-up, closed April 2026 only via a community extension ([spec-kit #1191](https://github.com/github/spec-kit/issues/1191)). Brainstorm asks generic questions the code already answers ([superpowers #2530](https://github.com/obra/superpowers/issues/2530)). Questions auto-answered, traced to a Claude Code runtime bug ([GSD #803](https://github.com/gsd-build/get-shit-done/issues/803)). Kiro: bugs, credit opacity, slower than plain coding ([G2/DEV roundup](https://dev.to/pickuma/amazon-kiro-review-awss-spec-driven-agentic-ide-in-2026-4f48), S). Plans over-specify and leave no judgement ([superpowers #895](https://github.com/obra/superpowers/issues/895), S).

**Gap shared by all** (J): they are spec-for-code tools. None starts from a one-line idea and researches the domain, none computes completeness from structure, none simulates customers over time. Their checks are an LLM re-reading its own prose.

Closest prior art on completeness: **Cross-Pollination** (ESEM 2026). Ten fixed gap dimensions: actors, workflows with exceptions, data, business rules, state machine, exception handling, validation, notifications, background jobs, onboarding/offboarding. LLM stories reached recall 98.4% in e-commerce against production-derived stories, versus 37.7% for analyst backlogs; precision was 46.5% versus 97.9% ([PDF](https://drops.dagstuhl.de/storage/00lipics/lipics-vol394-esem2026/LIPIcs.ESEM.2026.82/LIPIcs.ESEM.2026.82.pdf), D). Library system: recall 94.5% vs 40.0%. It also calibrates an expected story count (floor x0.78, ceiling x1.28 of a complexity midpoint). Single industry study, authors' own method (J).

## Part B. Methods that force completeness

All S/J: I know these methods; I did not fetch each page. Links are canonical references.

| Method | Class of missing thing it catches | Mechanical form for agents |
|---|---|---|
| ORCA / object-oriented UX ([Prater](https://www.sophiaprater.com/)) | Missing screens, attributes, actions | JSON: objects, relationships, CTAs, attributes. Script: every object has list, detail, create, edit, delete screens; every relationship has a nav path |
| CRUD / CRUD-L matrix | Missing edit, delete, list, search per object | Object x {C,R,U,D,List,Search,Export,Import,Archive,Restore} grid; empty cell must hold "n/a + reason" |
| Permission matrix | Blocked users, role gaps | Role x action x object; script flags objects with no deny path, and roles that never reach an object |
| [State machines / statecharts](https://statecharts.dev/) | Missing statuses, dead-end states, illegal transitions | Per object: states, events, guards. Script: every state reachable, has an exit or is marked terminal, every state x event cell filled |
| [Use case 2.0](https://www.ivarjacobson.com/publications/white-papers/use-case-ebook) | Alternate and exception paths | Per use case: main flow, then at least one alternate or exception per step; count steps with none |
| [EARS](https://alistairmavin.com/ears/) | Vague requirements, missing triggers and unwanted-behaviour clauses | Five templates; regex-lint every requirement; require one "if unwanted condition" per event |
| [Example mapping](https://cucumber.io/blog/bdd/example-mapping-introduction/) | Untested rules, open questions | Rule, example, question cards; script rejects rules with no example |
| [Event storming](https://www.eventstorming.com/) | Missing events, policies, external systems, hot spots | Events list, then commands, actors, policies; every event needs a producer and a consumer or reaction |
| [Story mapping](https://www.jpattonassociates.com/user-story-mapping/) | Gaps in the end-to-end journey | Backbone of activities, ribs of steps; every step needs a story or an explicit skip |
| JTBD | Wrong or missing jobs, no switching trigger | Job statement, trigger, current solution, success measure; each feature maps to a job |
| [Nielsen heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) | Missing feedback, undo, error recovery, help | 10 checks run per screen; "no state defined" fails visibility and error-prevention |
| [Kano](https://www.nngroup.com/articles/kano-model/) | Table-stakes features nobody mentions | Tag each feature must-be / performance / delighter; competitor-wide must-be with no coverage = gap |
| [Opportunity solution tree](https://www.producttalk.org/opportunity-solution-tree/) | Solutions with no outcome behind them | Tree file; orphan solution nodes fail |
| [Service blueprint](https://www.nngroup.com/articles/service-blueprints-definition/) | Back-office, support, billing, ops work | Rows: user action, frontstage, backstage, support process; every user action needs a backstage row |
| [Pre-mortem](https://hbr.org/2007/09/performing-a-project-premortem) | Failure modes, adoption risks | "It failed in 12 months, why?" list; each reason maps to a requirement or an accepted-risk line |
| [STRIDE / abuse cases](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) | Spoofing, tampering, export leaks, tenant crossing | Per data flow x 6 threats; each cell has a control or waiver |
| DDD bounded contexts | Hidden second domain (billing, identity, notifications) | Context list with owned objects; any object with two owners fails |
| Data volume / lifecycle | Pagination, retention, archive, GDPR delete, backups | Per object: expected rows at 1y, growth, retention, deletion; 10k rows with no pagination fails |
| [FMEA](https://asq.org/quality-resources/fmea) | Failure effects ranked | Failure mode, effect, severity x likelihood x detectability; top N need a requirement |

J: the common trick is a **grid that must be fully filled** (object x action, role x action, state x event, threat x flow). A script can count empty cells; an LLM cannot skip them quietly. That is the core of the completeness score.

## Part C. Evidence on simulated users and multi-agent elicitation

| Study | Numbers | Lesson |
|---|---|---|
| [NN/g, synthetic vs human, Feb 2026](https://www.nngroup.com/articles/synthetic-users-vs-human-respondents/) (D) | 120 synthetic vs 604 humans; humans gave 50+ labels, synthetic about a dozen; 84% vs 70% used UX terms; role differences blurred | Mode collapse: long tail lost. Use only for hypotheses. Vendor-tool test, one question |
| [Elicitron](https://arxiv.org/html/2404.16045v1) (D) | 20 agents/condition, tent design, GPT-4-Turbo; serial generation gave more diverse agents (hull volume 0.868 vs 0.267 parallel); 10.9 latent needs per agent (manual) vs 8.8 (auto), t(38)=2.32; LLM latent-need classification F1 0.95 with criteria plus CoT; about 2.4 USD | Generate personas one after another, aware of earlier ones. Human baseline had no variance data; no real-user validation |
| [MARE](https://arxiv.org/html/2405.03256v1) (D) | Five agents (stakeholder, collector, modeler, checker, documenter). Use-case F1 78.9 vs 55.0 baseline; but only +1.1 F1 over one LLM; human completeness score 0.98 of 2, lowest of three | Multi-agent adds little over one good LLM; completeness stayed the weakest (J: supports a script check) |
| [Cross-Pollination](https://drops.dagstuhl.de/storage/00lipics/lipics-vol394-esem2026/LIPIcs.ESEM.2026.82/LIPIcs.ESEM.2026.82.pdf) (D) | Recall 98.4% / precision 46.5% | Fixed taxonomy gives recall; half the extra stories are out of scope. Need a filter |
| [Simulated Customers Never Walk Away](https://arxiv.org/abs/2606.20708) (D) | 2,790 real sales chats, 793 with verified payment; non-buyers pushed 0.40 deeper into the funnel than reality; resistance 25.1% real vs 13.5% simulated; "you may leave" prompt cut overall bias about 5x, barely closed buyer/non-buyer gap | Sim customers fail on churn and "not now". Exactly what a time-sim must get right |
| [Generative Agents, 1,000 people](https://arxiv.org/abs/2411.10109) (S) | Agents built from 2-hour interviews match GSS answers at 85% of a person's own 2-week retest; demographic-only personas do worse | Real interview data beats invented personas |
| [Interview-informed LLM surveys](https://arxiv.org/pdf/2505.21997), [WVS persona study](https://arxiv.org/abs/2602.18462) (S) | Much lower variance than humans; persona prompting often does not improve alignment (70K+ item instances) | Personas alone do not buy diversity |
| [UXAgent](https://arxiv.org/abs/2504.09407) (D) | Thousands of persona agents on a live site; evaluation was 16 UX researchers rating the tool, no agreement-with-humans number | Pre-pilot tool, not a measured substitute |
| [AgentA/B](https://arxiv.org/abs/2504.09723) (S/D) | 1,000 agents on Amazon vs aggregated human data; agents more goal-directed, shorter action sequences | Agents walk the happy path faster than humans |
| [From Reviews to Requirements](https://arxiv.org/abs/2603.28163) (S) | LLM user stories from app reviews match experts on form; overlap and non-unique stories | Dedupe step needed |
| Sycophancy ([position paper](https://arxiv.org/pdf/2504.02234), [user-simulator bias](https://arxiv.org/pdf/2609.00608)) (S) | Aligned models are too agreeable; assistant bias leaks into user simulators | Force disagreement; do not let the "customer" help the PM |
| Time horizon: [LifeSim](https://arxiv.org/pdf/2603.12152), CEO-Bench (S) | LLMs weak at implicit intent and long-term preference; mistakes show up as churn late | No validated "months of use" simulator found |

What simulated users **miss**: the long tail, refusal and abandonment, boredom, switching costs, real money pain, odd workflows. What they **invent**: over-agreeable praise, tidy goal-directed behaviour, uniform vocabulary (D above).

Fixes with evidence behind them: ground each persona in real text (reviews, tickets) (Generative Agents 85%; J for transfer); one-by-one persona generation (Elicitron); an explicit permission to leave (5x bias cut, but gap persists); a fixed taxonomy for recall (Cross-Pollination); an evidence rule (CE: a finding must show failure without it); blind voting and required dissent (J, no paper tested for requirements). Treat simulator output as hypotheses, never as demand proof (NN/g).

## Part D. Grounding sources, ranked by value per effort (J)

| Rank | Source | How an agent reads it |
|---|---|---|
| 1 | Competitor help centre | Crawl sitemap; each article title is a feature or workflow; extract nouns into the object list, verbs into CRUD cells; headings "Archive / Export / Roles" fill the matrix |
| 2 | Public API reference or OpenAPI file | Parse to get exact objects, fields, enums (= statuses), filters, webhooks, rate limits. Cheapest, hardest evidence |
| 3 | Changelog / release notes | Read oldest to newest: shows build order, and what customers forced later (the natural time-sim script) |
| 4 | Import and export templates, CSV samples | Column lists = real attributes; export formats = reporting needs |
| 5 | Open-source schemas and migrations (GitHub) | Tables, status columns, soft-delete, audit tables; migration history = evolution under load |
| 6 | App store, G2, Reddit, review sites | Cluster negative reviews by theme; quote ids; tells "what breaks", not "what exists" |
| 7 | Feature-request boards (Canny, GitHub reactions) | Sort by votes; missing-feature demand with counts |
| 8 | Migration guides ("moving from X") | Reveal what data users must carry and what they fear losing |
| 9 | Training videos, webinars | Transcripts for real workflows and jargon; slow, use last |

Rule for agents (J): store each claim with source URL, date and a verbatim snippet under 15 words; a requirement with no source is marked "assumed".

## 12 ideas to borrow
1. Fixed taxonomy scan, Clear/Partial/Missing per category (Spec Kit clarify).
2. "Unit tests for requirements" checklists (Spec Kit).
3. Ten gap dimensions plus complexity-calibrated count (Cross-Pollination).
4. Persona reviewers that must prove failure-without-fix, with finding suppression (CE).
5. Stable IDs UJ/FR/RULE/SM/OQ and a "done when" rubric (BMAD), turned into script checks.
6. Attack / defend modes and one question at a time (BMAD forge-idea).
7. Delta specs per capability (OpenSpec) for the update-a-spec problem.
8. Serial persona generation for diversity (Elicitron).
9. Personas built from real interview or review text, not demographics (Generative Agents).
10. Fully-filled grids (ORCA objects x CRUD, role x action, state x event).
11. Explicit "may leave" rule for sim customers (Never Walk Away).
12. Zero-coverage trace from requirement to task (Spec Kit analyze) extended to code.

## 8 failure patterns to avoid
1. LLM re-reading its own prose as the only check.
2. Generic questions the repo or domain already answers (superpowers #2530).
3. Many extra stories, low precision (46.5%); no scope filter.
4. Persona-only simulation: mode collapse, agreeable customers.
5. Sim customers that never churn, so time adds nothing.
6. No path to update a spec after it is written (spec-kit #1191).
7. Heavy process for tiny tasks; cost and slowness (Kiro, GSD complaints).
8. Agent roles adding ceremony without gain (MARE: +1.1 F1 over a single LLM).

## What is new vs already done (honest, J)
| Idea | Verdict |
|---|---|
| Completeness from a fixed taxonomy | Done: Cross-Pollination, Spec Kit clarify. Not new |
| Completeness computed by a **script over a structured spec** (empty grid cells, orphan objects, unreachable states) | I found none. Spec Kit analyze maps IDs, but over prose. Closest in spirit, not in mechanism. Plausibly new, unproven (I only searched; not exhaustive) |
| Role-POV agents | Done (BMAD party mode, CE personas, MARE) |
| Grounding in competitor docs, API, schemas for domain research | Practised ad hoc; no framework found automating it end to end |
| Simulated customers over months | No validated work found; Never Walk Away shows the core failure. New and risky |
| Sim customers grounded in **real changelogs** (replay a product's history, ask which request each cohort would file when) | I found nothing doing this. New. Check: does it recover requests that real boards show later? That is a testable score |
| One-line idea to full PRD | Partly: BMAD forge-idea and analyst, ChatPRD. Not with the pieces combined |

Could not verify: Tessl and Kiro internals; Superpowers/GSD/Taskmaster/PRP/Agent OS prompt files not read; Part B methods not fetched; Cross-Pollination is one unreplicated study; sycophancy numbers not read in full.
