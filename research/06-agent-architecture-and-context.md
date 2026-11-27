# 06 - Agent architecture, context, verification, DB-first, parallelism (as of 2026-11-25)

Tags: D = I read the page and the number is from it. S = search snippet only. J = my judgement.
Most evidence is vendor posts or small-n preprints. Treat "strong" below as "best available", not "proven".

## A. Context

| Claim | Number | Tag | URL |
|---|---|---|---|
| Repo context files (ETH, AGENTbench/CTXbench 138 tasks, 12 repos; SWE-bench Lite 300) | LLM-generated file: -0.5 pt (SWE-bench, p=.87), -2 pt (CTXbench, p=.37). Dev-written: +2.4 pt (p=.21). Cost +20-23% for generated. Both inside noise | D | https://arxiv.org/html/2602.11988 |
| Same paper: what content | Agents obey tool mentions (uv used 1.6x/task if named, <0.01 if not). Repo overviews did not cut steps to reach the right files. Removing the testing/tooling sections cut cost, did not change accuracy. With docs deleted, generated files gained +2.7% | D | same |
| AGENTS.md effect on speed (Lulla et al., 124 PRs, 10 repos) | Median runtime -28.6%, output tokens -16.6%, same completion. Numbers via a notes page, not the paper | S | https://arxiv.org/abs/2601.20404 |
| Vercel: 8KB compressed docs index in AGENTS.md vs skills (Next.js 16 evals) | Index 100% pass; skills max 79% even when told to use them; 40KB cut to 8KB with no loss. Baselines differ across write-ups. Narrow eval of new APIs not in training data | S | https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals |
| OpenAI: AGENTS.md ~100 lines as table of contents; `docs/` is the system of record (design-docs, exec-plans, generated, product-specs, references). A big file crowded out the task, went stale, could not be checked by machine | Before automation, 20% of the week (every Friday) went to cleaning "AI slop" | D | https://openai.com/index/harness-engineering/ |
| Anthropic context engineering: smallest set of high-signal tokens; just-in-time retrieval by path/link; compaction; notes file; sub-agents return 1-2K-token summaries | No accuracy numbers | D | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents |
| Anthropic skills: 3 levels (name+description always loaded, body on trigger, linked files on demand), scripts run without loading code | No token counts | D | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills |
| Manus: KV-cache hit rate is the top metric; cached input $0.30 vs $3 per MTok (10x); input:output ~100:1; ~50 tool calls/task; file system as memory; rewrite todo.md to keep the goal at the end of context; leave errors in context | Rebuilt framework 4 times | D | https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus |
| Context rot (Chroma, 18 models incl. GPT-4.1, Claude 4, Gemini 2.5) | Accuracy falls as input grows even on trivial tasks; worse when the target is less similar to the query or distractors exist. Vendor sells vector DB | S | https://research.trychroma.com/context-rot |
| Long-context bug fixing (ICLR 2026) | Qwen3-Coder-30B resolves 7% at 64k context when files are stuffed in the prompt. Agent trajectories are mostly <20k tokens | S | https://arxiv.org/html/2602.16069v1 |
| Aider repo map: tree-sitter symbols, graph, PageRank, binary search to fit a token budget (default 1k) | No published benchmark found | S | https://aider.chat/2023/10/22/repomap.html |
| Cognition: share full traces; parallel agents make conflicting decisions; prefer one linear agent, narrow read-only sub-agents | Principle, no numbers | D | https://cognition.com/blog/dont-build-multi-agents |

What I take from A (J): the measured effect of a context file on pass rate is about zero, and the effect on cost is real. The win is not "more context". It is (1) naming the exact commands and tools, (2) pointers to deeper docs, (3) things the agent cannot see in code. Do not use an LLM to write the file from the code; the agent can read the code itself. Generated reference (schema dump, route list, API types) is fine because it is rebuilt by CI, not written once.

Keeping docs fresh (no study measures this; all J except OpenAI):
- Generate what can be generated: `docs/generated/` (OpenAI does this, D). DB schema, OpenAPI, route map, module graph, env var list.
- CI check "regenerate and `git diff --exit-code`" for generated docs.
- Link check plus "every module has a `CONTEXT.md` with the required headings" as a lint.
- Doc-gardening agent opens fix PRs (OpenAI, D). ContextCov turns instruction-file rules into executable checks (S): https://arxiv.org/pdf/2603.00822

Per-module context pack (J, built from the above): `modules/<name>/CONTEXT.md` under 80 lines: purpose, owned tables, public interface file, events in/out, invariants, "do not touch", test command, one reference link. Root AGENTS.md lists commands plus module index only. Load the pack just in time via path.

## B. Code structure for agents

| Claim | Number | Tag | URL |
|---|---|---|---|
| OpenAI repo: fixed layers per domain, Types > Config > Repo > Service > Runtime > UI, forward-only; cross-cutting only via Providers; custom linters and structural tests for naming, file size, logging; lint messages carry the fix | ~1M lines, ~1,500 PRs, 3 to 7 engineers, 3.5 PRs/engineer/day, "one tenth the time" (self-reported) | D | https://openai.com/index/harness-engineering/ |
| OpenAI drift: agents copy existing patterns including bad ones; fix = golden principles as mechanical rules plus background cleanup agents opening small refactor PRs | Most reviewable in <1 min | D | same |
| SlopCodeBench: agents extend their own code over checkpoints | 36 problems, 196 checkpoints, 15 agents; best passes 14.8% of checkpoints; erosion in 77% of runs; 2.3x more verbose and 2.0x more eroded than 473 human repos. Quality prompts cut start-state mess by up to a third but not the rate of decay | D | https://arxiv.org/abs/2603.24755 |
| Needle in the Repo (21 C++ probes) | Dependency-control pass 4.3%, responsibility decomposition 15.2%: agents pass tests but break structure | S | https://arxiv.org/pdf/2603.27745 |
| Constraint decay: adding layered architecture plus a prescribed ORM to a spec | Avg -27.3 pt assertion pass vs baseline; worse in convention-heavy frameworks (FastAPI, Django); main causes query composition and ORM misuse. Mid-tier models | D | https://arxiv.org/abs/2605.06445 |
| CodeScene: AI on unhealthy code raises defect risk by 30%+; agents want Code Health 9.5+ | Vendor; sample only had health >=7, so the figure is not measured on bad code | S | https://arxiv.org/html/2601.02200v1 |
| GitClear 211M lines: refactor-type changes ~25% (2021) to <10% (2024); copy/paste 8.3% to 12.3% | Pre-agent-era data (assistants) | S | https://www.gitclear.com/write_only_mode_ai_research |
| Anthropic C compiler: 16 agents, ~2,000 sessions, ~$20K, ~100K lines Rust, ~99% on torture tests | New features often broke old ones; stricter CI added late; no orchestrator; roles for dedup, perf, code critique helped | D | https://www.anthropic.com/engineering/building-c-compiler |
| StrongDM factory: no human writes or reviews code; ~$1,000/engineer/day tokens as maturity marker | Criticised for a security product | D | https://simonwillison.net/2026/Feb/7/software-factory/ |

Not found: any study that isolates file size, function size, or vertical slice vs layers on agent success. The file-size rule and slices are J (sound reasons: smaller reads, local blast radius, fewer cross-file facts). OpenAI does lint file size (D).

What I take from B (J):
- Fixed layers and forward-only deps work for OpenAI, but constraint-decay says heavy architecture in the spec lowers pass rate. So enforce by lint after the fact with agent-readable errors; do not stuff the layout into the prompt.
- Vertical slice per module (own tables, own public interface file, own tests). Enforce with dependency-cruiser / eslint-plugin-boundaries / Nx tags (TS) or go-arch-lint (Go). No tool-specific agent evidence found; mechanism evidence only (OpenAI structural tests).
- Contract first (OpenAPI/zod/protobuf, generated clients) is J; Anthropic C compiler shows the value of an external oracle, which a contract is.
- Copy-a-reference-module plus generator: J. OpenAI's "agents copy patterns" (D) cuts both ways: make the reference perfect and keep it the only one.
- What broke across teams: duplication and drift (OpenAI, GitClear), regressions from new features (C compiler), erosion (SlopCodeBench), review load (OpenAI moved to agent review), tests gamed (C part).

## C. Verification

| Tool | Evidence | Tag | URL |
|---|---|---|---|
| feature_list.json with `passes:false`, only the flag editable, one feature per session, JSON because models edit it less than Markdown | 200+ features; without browser testing Claude marked done after curl/unit tests; with Puppeteer much better. No pass-rate numbers | D | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |
| Separate evaluator with Playwright, sprint contracts (sprint 3 had 27 criteria) | Self-grading skews positive; stock Claude QA "talked itself into approving". Solo run 20 min/$9 and the core game was broken; full harness 6 h/$200 and worked. Later removed per-sprint checks when Opus 4.6 improved | D | https://www.anthropic.com/engineering/harness-design-long-running-apps |
| Tests are the spec; agent optimises what the verifier measures | C compiler needed near-perfect tests and later stricter CI; author warns passing tests can be mistaken for done | D | https://www.anthropic.com/engineering/building-c-compiler |
| Holdout scenarios outside the repo, scored as "satisfaction" (share of trajectories that satisfy), LLM-judged | StrongDM claim; no outside replication | D | https://simonwillison.net/2026/Feb/7/software-factory/ |
| Weak tests pass wrong patches | SWE-ABS: 19.78% of "solved" leaderboard cases semantically wrong; 28.5% of 49 sampled tasks pass a known-wrong patch | S | https://arxiv.org/pdf/2606.16062 |
| Agents game tests (hardcode, edit test files) | EvilGenie and ImpossibleBench: Codex and Claude Code both observed doing it. METR: frontier models cheat on tasks | S | https://arxiv.org/pdf/2511.21654 |
| Mutation testing | Agentic mutants are harder: detection drops 71.0% to 39.8% (SWE-Mutation). No study of mutation gating for agent-written tests in CI | S | https://aclanthology.org/2026.findings-acl.1976.pdf |
| Requirement IDs traced to tests, spec-to-code drift checks, screenshot checks | No measured evidence found | - | - |

Verdicts (J): browser end-to-end checks and an independent evaluator have direct evidence. Mutation testing and holdouts have mechanism evidence only. Requirement-ID traceability is cheap and mechanical (grep that every `REQ-123` has a test tag) but unmeasured. Tests that agents may edit are not a gate: protect test and scenario paths with CODEOWNERS or a hook (J).

## D. System design and database first

| Claim | Number | Tag | URL |
|---|---|---|---|
| OpenAI ChatGPT: one primary + ~50 read replicas, millions QPS reads, p99 low double-digit ms, 5 nines, 1 SEV-0 in 12 months (write spike >10x at ImageGen launch). Rules: no new tables on the main cluster, write-heavy shardable work moved to Cosmos DB, avoid multi-table joins (a 12-table join caused incidents), review ORM SQL, PgBouncer (connect 50 ms to 5 ms), 5 s schema-change timeout, rate limit at app, pooler, proxy, query layers, cache lease against miss storms | Postgres 10x load growth in a year | D | https://openai.com/index/scaling-postgresql/ |
| Notion: app-level sharding by workspace_id; 480 logical shards (schemas) over 32 hosts; cross-shard transactions are partial | Later re-shard post exists | S | https://www.notion.com/blog/sharding-postgres-at-notion |
| Figma: vertical split by table groups first; single tables hit TBs and billions of rows; then horizontal via DBProxy, multiple shard keys | - | S | https://pganalyze.com/blog/5mins-postgres-figma-dbproxy-sharding-postgres |
| RLS cost | Policy itself ~1.6 ms on a count in one benchmark; the missing `tenant_id` index is the real cost; wrap functions in `(select ...)`, name roles, index policy columns, also filter in the query | S | https://supabase.com/docs/guides/database/postgres/row-level-security-performance |
| GitLab, DynamoDB-style access-pattern tables, EXPLAIN in CI, query budgets | Not researched or not found as sourced numbers | - | - |

Spec-to-database pipeline (J; no study shows this makes agents better, but it moves each decision to a checkable artifact):
1. Per module: entity list, tenant key on every table, access-pattern table (query, filter cols, sort, page size, expected rows, p95, frequency).
2. Index list derived from that table. A script fails CI if a pattern has no matching index or an index has no pattern.
3. Seed script producing realistic volume (100k+ rows per large table, skewed tenants) before any UI.
4. CI runs each access pattern under EXPLAIN (ANALYZE, BUFFERS) on the seed; fail on Seq Scan over N rows or on cost above the budget. Per-request query-count budget in an integration test (catches N+1).
5. p95 latency, bundle size, LCP budgets in CI.

| Day one (hard to reverse) | Can wait |
|---|---|
| Tenant id on every table and in every unique index; ID scheme (uuid v7 or bigint); money as integer minor units plus currency; timestamps in UTC; soft-delete and audit approach; idempotency keys on write APIs and webhooks; outbox table for events; migration rules (additive, no table rewrites, lock timeout) | Sharding (OpenAI is on one primary at huge scale); partitioning (plan the key, add when a table passes tens of millions of rows); read replicas; dedicated search engine (start with Postgres FTS); caching layer; queue product (start with a Postgres-backed queue); CDN and file-storage tuning (day one only: object storage with keys in DB, never blobs in rows) |

## E. Parallel agents

| Claim | Number | Tag | URL |
|---|---|---|---|
| Cursor: lock files failed (20 agents gave the throughput of 2-3); optimistic concurrency better; flat agents turn risk-averse; planner/worker/judge hierarchy worked; integrator role became a bottleneck | Browser build ~1 week, 1M+ lines, 1,000 files; no dollar figure | D | https://cursor.com/blog/scaling-agents |
| Anthropic C compiler: separate container per agent, shared bare repo, lock file per task in `current_tasks/`, conflicts resolved by agents, oracle (GCC) used to split one giant bug into per-file tasks | 16 agents | D | https://www.anthropic.com/engineering/building-c-compiler |
| Multi-agent research: ~15x tokens of chat; +90.2% over single agent on research eval; token use explains 80% of variance; Anthropic says most coding is a poor fit (shared context, dependencies) | - | D | https://www.anthropic.com/engineering/multi-agent-research-system |
| Cognition says do not parallelise writers | Principle | D | https://cognition.com/blog/dont-build-multi-agents |
| OpenAI: one git worktree per change with its own app instance and its own log/metric stack; runs up to 6+ hours | - | D | https://openai.com/index/harness-engineering/ |

Reading (J): the sources disagree; the practical join is: parallel across modules with disjoint file ownership, one writer per module, serial inside a module; freeze contracts (OpenAPI, event schemas, DB migrations) before fan-out; merge in dependency order; the contract file has one owner. Cost: measure tokens per merged PR from day one; StrongDM-level spend is ~$1,000/engineer/day (D).

## 15 rules to adopt

| # | Rule | Strength |
|---|---|---|
| 1 | Root AGENTS.md ~100 lines: exact commands, module index, links. No overview prose, no LLM-written filler | strong (OpenAI D, ETH D) |
| 2 | Per-module CONTEXT.md under 80 lines, loaded by path only when working in that module | medium (mechanism plus OpenAI layout) |
| 3 | Generate reference docs (schema, routes, API types) in CI and fail on diff | medium |
| 4 | Doc-gardening and quality-score agent on a schedule | medium (OpenAI only) |
| 5 | Progress file plus git log plus a startup script (`init.sh`) per long task | strong (Anthropic D) |
| 6 | `features.json` with `passes:false`; agent may flip only the flag; one feature per session | medium (Anthropic D, no pass numbers) |
| 7 | "Done" requires a browser end-to-end run, not curl or unit tests alone | strong (Anthropic D) |
| 8 | Separate evaluator agent with its own skeptical prompt and sprint-style acceptance criteria | strong (Anthropic D) |
| 9 | Test, scenario and contract paths protected from agent edits; holdout scenarios outside the repo for money/auth flows | medium (StrongDM, EvilGenie, SWE-ABS) |
| 10 | Vertical-slice modules, one public interface file each; boundaries enforced by lint with fix-it messages | medium (OpenAI D; no tool-specific evidence) |
| 11 | Contract first plus generated clients; contract frozen before parallel work | weak-medium (J) |
| 12 | One golden reference module plus generator; background cleanup agents for drift | medium (OpenAI D, SlopCodeBench D) |
| 13 | Access-pattern table to index list to EXPLAIN check on 100k+ seeded rows in CI | weak (J; no study) |
| 14 | Day-one data decisions: tenant key, IDs, money, idempotency, outbox, additive migrations; defer sharding and caching | medium (OpenAI Postgres D) |
| 15 | Parallel agents only across disjoint modules, one writer per module, planner/worker, no lock files, no integrator agent | medium (Cursor D, Cognition D) |

## 8 popular ideas to skip (poor evidence)

1. LLM-generated AGENTS.md from /init: no gain, +20% cost (ETH D).
2. Repo-overview sections in context files: did not cut steps to the right files (ETH D).
3. Skills as the main way to carry project rules: 56% not invoked in one eval; Vercel index beat them (S, narrow).
4. One giant spec of architecture rules in the prompt: -27 pt in constraint decay (D); enforce by lint.
5. Agent-written tests as the only gate: 19.8% wrong "solved" cases (S).
6. Coverage percent as a quality gate: not tested for agents; agentic mutants evade 60% of tests (S).
7. Lock files and an integrator agent for parallelism: Cursor saw both fail (D).
8. Many agents, many roles by default: 15x tokens, and "most coding" is a poor fit (D). Also skip "no human review" for money/auth code (StrongDM critique, S) until holdouts are proven in-house.

## Not verified
Primary StrongDM page; Vercel original post numbers; Notion/Figma original posts; GitLab; any measured file-size or slice-vs-layer effect; mutation-in-CI for agents; METR 2026 follow-up; aider repo-map benchmark; Agentless.
