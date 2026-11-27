# 02 - OSS CRM / support / work tracking / scheduling: how the main object grew

Codes: see 00-taxonomy.md. P = predictable by PRD, U = only usage showed it, X = outside change. MEASURED = read from code, migration, release or API. INFERRED = my reading.
Repo notes: cal.com is now `calcom/cal.diy` (renamed; some enterprise code absent, e.g. no Workflow enums in schema). Plane moved `apiserver/` to `apps/api/` on 2025-07-04. Chatwoot `db/migrate` was squashed to `20230426130150_init_schema` (pre-2023 schema history is gone; I used release notes for 2020-2023). Twenty `core/migrations` holds only 19 util files, so Twenty history comes from release notes and standard-object code.
Sources: `gh api repos/{O}/{R}/git/trees/HEAD` file lists, `contents/` files, `/releases`, `/commits?path=`, `search/issues` (all MEASURED unless marked).

## 1. FULL DEPTH TODAY (counts)

| Facet | Chatwoot Conversation | Plane Work item | Cal.com Booking + Event type | Twenty Opportunity/Person + table |
|---|---|---|---|---|
| Fields | 29 columns, 22 indexes (db/schema.rb) | 21 Issue fields + 14 child tables (comment, activity, link, attachment, relation, subscriber, reaction, vote, version, desc-version, mention, assignee, label, sequence) (db/models/issue.py) | Booking 55-56 fields; EventType 106 fields (prisma/schema.prisma) | Opportunity: 4 business fields (name, amount, closeDate, stage) + 3 relations (company, pointOfContact, owner) + 9 activity-target relations + ~8 system. Person: ~6 business (name, emails, phones, jobTitle, linkedin, avatar) + company + 10 relations. 25 field types (twenty-shared FieldMetadataType) |
| States | 4: open, resolved, pending, snoozed (+ priority none/low/med/high/urgent) (models/conversation.rb:91) | 6 state groups: backlog, unstarted, started, completed, cancelled, triage; 5 priorities; 6 relation types (duplicate, relates_to, blocked_by, start_before, finish_before, implemented_by) | 5 booking statuses: cancelled, accepted, rejected, pending, awaiting_host; 5 list tabs: upcoming, recurring, past, cancelled, unconfirmed | Stage = SELECT custom per workspace; soft-deleted state |
| Actions | 13 member actions (mute, unmute, transcript, toggle_status, toggle_priority, typing, update_last_seen, unread, custom_attrs set/destroy, attachments, inbox_assistant, reporting_events) + CRUD + 7 nested groups (messages, assignments, labels, participants, drafts, suggestions, contact_info_request) (config/routes.rb:201-243) | ~39 workspace-scoped issue routes (list, detail, sub-issues, links, attachments, history, comments, subscribers, reactions, archive, relations, versions, description-versions, deleted-issues, meta) (app/urls/issue.py) | 13 row actions: confirm, reject, cancel, reschedule, reschedule_request, change_location, add_members, reassign, report, charge_card, no_show, view_recordings, session_details (components/booking/actions/bookingActions.ts); +wrong-assignment report x3, getBookingHistory | 84 engine command keys; ~22 on records: create, delete, destroy, restore, export x4, import, merge x2, update-many, favorite add/remove, search, see/hide deleted, next/prev, share, create view, edit page layout |
| Bulk | BulkActionsJob: status, assignee, team, add/remove labels | 3 endpoints: bulk-delete, bulk-archive, bulk-create-labels | none found on booking list (INFERRED) | UPDATE_MULTIPLE, DELETE/DESTROY/RESTORE/EXPORT/MERGE multiple |
| Filters / sorts / views | 15 conversation filter keys (lib/filters/filter_keys.yml): status, assignee, inbox, team, contact, priority, display_id, campaign, labels, browser_lang, conv_lang, referer, created_at, last_activity_at, mail_subject; saved custom_filters | 11 filters (priority, state_group, state, cycle, module, assignee, mention, created_by, label, start, target); group-by 9 (+sub-group 7); order-by 6; 12 display props; 5 layouts (list, kanban, calendar, spreadsheet, gantt) (packages/constants/src/issue) | 7 list filters: eventType, team, user, attendeeName, attendeeEmail, dateRange, bookingUid; list + calendar view | 17 filter operands; 5 view types (TABLE, KANBAN, CALENDAR, LIST, INBOX) + 5 widget types; aggregates in footer/kanban |
| Export / import | account data_exports (+download, rerun); data_imports (validate, start, retry, abandon, error_logs, rejected_rows); transcript email; reports CSV | exporter: csv, json, xlsx with filters; importers | CSV download of bookings, 9 columns, batches of 100 | CSV import (incl relations), CSV export, 4 export commands |
| Roles | agent, administrator + 6 custom-role permissions (enterprise): conversation_manage, unassigned_manage, participating_manage, contact_manage, report_manage, knowledge_base_manage | Admin 20, Member 15, Guest 5 | MembershipRole MEMBER/ADMIN/OWNER + custom Role (pbac) | roles + object permissions + row-level predicates (2026) |
| Customer-facing | widget, email, 20+ channels, CSAT page, help-center `hc/:slug` | public deploy board (published issues, votes, comments, reactions) | booking/[uid], booking/[uid]/embed, booking-successful/[uid], payment/[uid], dry-run page, embeds | none (internal CRM); forms via apps |
| API / webhook events | 12 webhook events (5 conversation: created, updated, status_changed, typing_on, typing_off; 2 message; 2 contact; 2 inbox; webwidget_triggered) | 5 webhook objects: project, issue, module, cycle, issue_comment; webhook version field | 19 events (BOOKING_CREATED/RESCHEDULED/REQUESTED/CANCELLED/REJECTED/PAID/PAYMENT_INITIATED/NO_SHOW_UPDATED, MEETING_STARTED/ENDED, RECORDING_READY, FORM_SUBMITTED ...); 15 audit actions | REST + GraphQL generated from metadata; webhooks; MCP (2025-07) |

## 2. TIMELINES (code, P/U/X)

**Chatwoot Conversation** (launch v1.0.0 2020-01-03; releases chatwoot/chatwoot/releases; migrations db/migrate)
| Date | Added | Code |
|---|---|---|
| 2020-03 v1.2 | conversation webhooks; email notif settings; auto-assign off; pagination | I6 P; E3 P; G5 P; B4 U |
| 2020-05 v1.4 | private notes; browser push | E5 P; E1 P |
| 2020-07/08 v1.6-1.7 | labels, unread; custom attributes; transcript | B2 P; H6 P; C4 P |
| 2020-11 v1.10 | auto-resolve after N days idle; global search | A4 U; B1 P |
| 2021-01 v1.12 | pending state; teams; self-host onboarding | A4 U; D2 P; G2 P |
| 2021-02 v1.13 | bulk API (UI came 2022-06, +16 mo) | C1 P |
| 2021-03/06/08 | filters; account onboarding; canned replies; snooze | B2 P; G2 P; A3 P; A4 P |
| 2022-02 | automations; custom views | E2 P; B5 P |
| 2022-06/08 | bulk actions UI; macros | C1 P; A3 P |
| 2023-02 | conversation participants | D2 U |
| 2023-05/06 | priority (v2.17); SLA columns sla_policy_id, waiting_since (20230620132319); exports | A4 P; E2 P; C2 P |
| 2024-08 | custom roles (issue #4216 opened 2022-03) | D1 P |
| 2025-10 | assignee_agent_bot_id (20251022162159) | D2 U |
| 2026-07/08 | status_changed_at (20260709060100); ai_assignee_type (20260811000000) | E4 U; D2 U |
| 2026-11-24 | last_message_at + 3 indexes + backfill job, same day | I1 U |

**Plane Work item** (first migration 2022-11-29; apiserver/plane/db/migrations commits)
Day one (0001, 2022-11-29): Issue, parent, state, priority, assignees, labels, comment, activity, blocker, sequence, cycle, view, file asset. Label parent 0007 same day (H5 P).
| Date | Added | Code |
|---|---|---|
| 2023-07-19 (0037) | archived_at, project auto-archive/auto-close | A2 P; A4 P |
| 2023-08-16 (0041) | comment access (private/public) | D1 P |
| 2023-09-29 (0045) | activity epoch, issue display props | E4 U; B5 U |
| 2023-12-07 (0047) | webhooks + API tokens (13 months after launch) | I6 P |
| 2024-04-08 (0063) | triage state | A4 P |
| 2024-06-10 (0067) | issue estimate | H5 P |
| 2024-07-10 (0070) | exporter history with filters | C2 P |
| 2024-08-14 (0074) | public deploy board | C4 P |
| 2024-10-08 (0077) | draft issue | A6 P |
| 2024-11-08/28 (0085/0086) | intake object; issue version | G7 P; A7 P |
| 2025-01-31 (0091) | comment edited_at | A1 P |
| 2025-08-19 (0101) | description version tables | A7 P |
| 2025-09-03 (0104/0107) | rich_filters + data migration | B2 U |
| 2025-12-30 (0113) | webhook version | I6 P |
| 2026-01-06 (0114) | projectuserproperty (per-user view prefs, 3rd scope) | B5 U |
| 2026-02-17 (0120) | view archived_at | A2 P |

**Cal.com Booking / Event type** (first booking migration 2021-06-05; packages/prisma/migrations)
| Date | Added | Code |
|---|---|---|
| 2021-07 | requires-confirmation; location on booking; min notice; period settings | A4 P; H5 P; G5 P x2 |
| 2021-09/12 | status enum; disable guests; slot interval | A4 P; G5 P x2 |
| 2022-03 | reschedule fields | A5 P |
| 2022-05 | custom inputs on booking | H6 P |
| 2023-01 | booking fields (replaces custom inputs) | H6 U |
| 2023-05/09 | requested/rejected webhooks; payment-initiated | I6 P; H1 P |
| 2024-03 | rating, noShowHost | A4 U |
| 2024-05/06 | scheduled webhook triggers; rescheduledBy/cancelledBy | I3 U; E4 U |
| 2024-10 | reassign reason/by | D2 U |
| 2025-01/03 | creationSource; tracking (utm) | E4 P; E4 U |
| 2025-05 | booking_denormalized table + triggers + backfill | I1 U |
| 2025-08 | booking triggers on workflows | E1 P |
| 2025-10 | booking report; calendar view flag | I2 U; B5 P |
| 2025-11 | booking audit tables (53 months after launch) | E4 P |
| 2026-01 | CSV export of bookings (55 months after launch) | C2 P |

**Twenty Opportunity/Person/table** (v0.1.0 2023-06-22; twentyhq/twenty/releases)
| Date | Added | Code |
|---|---|---|
| 2023-06 v0.1.0 | person+company tables, basic pipeline, filter, sort, Cmd+K | baseline |
| 2023-07 v0.1.1 | show page, timeline, notes | E5 P |
| 2023-08 | show/hide columns; opportunity probability picker (gone from today's fields) | B5 P |
| 2023-09 v0.1.3 | views + viewSorts tables; favorites; CSV import | B5 P; G3 P; C3 P |
| 2023-10 | kanban column reorder; soft delete in metadata | B3 P; A2 P |
| 2023-11-30 v0.2.0 | custom objects and fields (360 changes) | H6 P |
| 2023-10..2024-01 | API keys; webhooks | I6 P |
| 2024-03 | export as CSV (#4034); duplicates section | C2 P; A3 P |
| 2024-08 | soft delete for records (#6576) | A2 P |
| 2024-11 | aggregate queries | B3 P |
| 2025-01/02 | roles + object-permission tab | D1 P |
| 2025-07/08 | import relations; merge records button | C3 U; A3 P |
| 2026 | row-level permission predicates (issue #13841 "Only see your own objects", 2025-08) | D1 P |
N (excluded): workflows, AI agents, MCP, dashboards, messaging and calendar sync, page layouts.

## 3. MOST ASKED (top reacted, search/issues sorted by reactions)
| Product | Top asks (reactions) | Code |
|---|---|---|
| Chatwoot | Voice channel 57 (#11481); WhatsApp Cloud 52; message streaming 50; ChatGPT 46; custom roles 40 (#4216); Google Business Messaging 41; Discord 34; merge conversations 27 (#9264, open); GDPR consent 26 (#1231, open since 2020-09); schedule send 23 (#9484); delete conversation 15 (#947) | N/I6 x7; D1; A3; G4/I2; E2; A2 |
| Plane | GitLab 113; Gitea 89; OIDC 66 (+24 for "move OIDC back to free"); custom fields on issues 62 (#2865); time tracking 57 (#1184); recurring tasks 41 (#818) | I6 x2; D1/H4; H6; H5; E2 |
| Cal.com | multi-calendar availability 38 (#15); Proton calendar 36; i18n 28; ICS double-booking check 21; multi-day bookings 16+12; per-event "check conflicts" 11; override own schedule 10; timezone 11 | I5 x4; J1; H5; G5 x2; H1 |
| Twenty | reactions are tiny (max 8): many-to-many relations 8; MCP server 4; only-see-own-objects 3; CSV export 3; multi-select CSV import 2 | H6; I6; D1; C2; C3 |
Reading: top votes are integrations and channels (I5/I6/N), not object features. Object-level asks are roles (D1), custom fields (H6), merge (A3), export (C2), plan-gate fairness (H4). Twenty feedback runs through Discord, so GitHub votes understate it (INFERRED).

## 4. ONE-WAY DOORS
| Product | Early decision | Later pain (evidence) |
|---|---|---|
| Chatwoot | One `assignee_id` FK | participants 2023-02; bot FK 2025-10; ai_assignee_type 2026-08: three patches on one idea (migrations above) |
| Chatwoot | Integer enum status + toggle | code comment "FIXME: implement state machine with aasm" (conversation.rb:178); pending/snoozed appended after resolved |
| Chatwoot | Sort by last_activity_at | 2026-11-24 last_message_at, backfill job, 3 indexes (I1) |
| Plane | Per-user view props table | IssueProperty -> IssueUserProperty (0071, 2024-07) -> ProjectUserProperty (0114, 2026-01): scoped wrong twice |
| Plane | Issue description in 4 columns on Issue | separate description tables (0101); IssueVersion description added 0086 then removed 0087 within a month |
| Plane | filters JSON | rich_filters + data migration (0104/0107, 2025-09) |
| Cal.com | customInputs | replaced by bookingFields + responses 2023-01; both columns still in schema |
| Cal.com | SQL view booking_time_status | fixed 2023-07, 2023-09, 2023-10 then denormalized table 2025-05 |
| Cal.com | User-owned event types | Profile table 2024-01 for orgs; managed event types parentId |
| Cal.com | `rescheduled` bool + fromReschedule string | not a FK; indexed 2025-11 (from_reschdule index) |
| Twenty | hard-coded Person/Company/Opportunity | metadata engine v0.2.0, 5 months after launch |
| Twenty | enum names | ViewFilterOperand TODOs "would require a migration" + ViewFilterOperandDeprecated.ts |
| Twenty | field identity | universalIdentifier/applicationId made NOT NULL (1767277454048, 1768212224801; Jan 2026) |
| Twenty | upgrades | #9041, #15235, #17413 broke self-host DBs after upgrade |

## 5. FIRST-RUN AND BLOCKED-USER FIXES
- Chatwoot: self-host onboarding flow v1.12 (2021-01); account onboarding v1.14 (2021-03); pending state so bots can hand off v1.12; block messages on resolved live chat v2.1 (2022-01); email confirmation flow v2.1; "channel finish setup guidance" commit 2026-09-10 (#13539); GDPR consent ask open 5+ years.
- Plane: onboarding fields use_case (0050), goals (0099), marketing consent (0100), explored_features (0116); product tour column added then removed (0118, 2026-01); per-project switches cycle_view, module_view, intake_view, page_view, time-tracking (project.py) = progressive disclosure; "require verified email to accept invites" 2026-11-23 (#10305).
- Cal.com: onboarding-v3 enabled globally 2026-02 (#27922); Continue button overlapped Bio on small screens 2026-04 (#29046); Microsoft sign-up 2026-03. Top-reacted bugs are self-host first run: localhost:3000 stuck #8501, WARN domains #12201, ARM64 image #15315/#25182.
- Twenty: top-commented issues are install and first workspace: #9120 unhealthy container, #8701 fresh Postgres fails, #9041 "not member of this workspace", #11494 workspace setup disabled on docker, #20666 restart loop on first workspace; #3310 "New Empty states" (2024-01).
Pattern (INFERRED): for self-hosted OSS the largest blocked-user class is install and first workspace, not features.

## 6. ACROSS THE FOUR (105 coded late items; K and N excluded)
Totals by code: A4 10, B5 7, E4 6, D1 5, I6 5, A3 4, B2 4, C2 4, D2 4, G5 4, H6 4, A2 3, C1 3, C4 3, E1 3, E5 3, H5 3, I1 3, plus 1-2 each: A1, A5, A6, A7, B1, B3, B4, C3, D5, E2, E3, G2, G3, G7, H1, H4, I2, I3. Groups: A 23, E 16, B 15, C 12, I 11, D 10, H 10, G 8. F and J = 0 (blind spot: release logs do not record empty states, loading, polish). P = 81 (77%), U = 24 (23%), X = 0. Sample is curated, so the ratio is directional.

**Universal (all 4):** status/transition model (A4); soft delete or archive (A2); filters + saved view or columns (B2, B5); roles (D1); owner/assign (D2); comments/notes + activity (E5, E4); CSV export (C2); custom fields or attributes (H6); webhooks + API tokens (I6).
**In 2-3:** bulk action (CW, TW, PL); import (TW, CW contacts); record merge/dedupe (CW, TW); draft (CW, PL); versions/history (PL, CAL); reminders/automation/SLA (CW, CAL, PL); notification preferences (CW, PL); public page (PL, CAL, CW); intake/triage (PL, CW).
**Taxonomy gaps:** merge/dedupe of records, hierarchy (parent/sub-item, label parent), SLA timers, AI assignee/copilot have no code (I used A3, H5, E2).

**Arrival order and lag from launch (MEASURED dates):**
- Stage 1 (launch to 3 months): list, filter, sort, status, assign, comments/notes, one saved view, API. Plane shipped views, labels, activity, blockers on day one. Twenty added notes and show page in 3 weeks.
- Stage 2 (3-18 months, daily use): webhooks and API tokens (CW 2 mo, TW 4 mo, PL 13 mo), labels, custom fields (TW 5 mo, CW 7 mo), saved views (TW 3 mo), import (TW 3 mo), archive/soft delete (TW 4 mo, PL 8 mo), notification prefs, bulk (TW 18 mo; CW API 13 mo), snooze/mute.
- Stage 3 (18-60 months, teams/scale): export (TW 9 mo, PL 20 mo, CW 41 mo, CAL 55 mo), roles (TW 19 mo, CW custom 56 mo), automations (CW 25 mo), SLA (CW 41 mo), audit/history (PL 24 mo, CAL 53 mo), merge (TW 26 mo), per-booker limits, row-level permissions.
- Stage 4 (platform): versioned webhooks (PL 2025-12), apps/MCP/AI (TW 2025-07, CW 2025), public boards, workflows, dashboards.
Correction to the usual guess: webhooks and API come early (stage 2), while export, audit and bulk-UI come surprisingly late despite being obvious (P).

## 7. NOT VERIFIED
- Pre-2023 Chatwoot migrations (squashed) and all Twenty migrations: used release notes; Twenty notes are PR titles, so dates are "first release that mentions it".
- Plane "5 state groups" is 6 with triage (checked); Plane notification preference field list not read.
- Cal.com workflows/PBAC are partly stripped in cal.diy; Cal booking cancel/reschedule public pages inferred from routes.
- Booking bulk actions absent in Cal is INFERRED from file search only.
- Reaction counts are GitHub totals at read time (2026-11-25).
