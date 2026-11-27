# 04 - Completeness by construction

Date 2026-11-25. Tags: **M** = MEASURED (read in code/docs this session), **I** = INFERRED (my knowledge or a third-party page, not checked in source). Ticks: Y yes, p partial/opt-in/plugin, - no, ? unverified.

## 1. Capability matrix (what one declaration gives)

Columns: FR Frappe, OD Odoo, SF Salesforce, TW Twenty, DJ Django admin, FI Filament, PL Payload, DI Directus, NB NocoBase, RA react-admin/Refine (UI only), OM Open Mercato.

| Capability | FR | OD | SF | TW | DJ | FI | PL | DI | NB | RA | OM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| list, columns, filter, sort, search | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| saved filter / saved view | Y | Y | Y | Y | - | p | Y | Y | Y | p | Y |
| group-by | Y | Y | Y | Y | - | Y | - | p | Y | p | ? |
| kanban / calendar / gantt | Y | Y | Y | Y | - | - | - | Y | Y | - | ? |
| bulk actions | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| inline edit | p | Y | p | Y | Y | Y | p | p | Y | p | ? |
| form + validation | Y | Y | Y | p | Y | Y | Y | p | Y | p | Y |
| draft/submit/cancel/amend | **Y** | p | p | - | - | - | p | - | p | - | - |
| state machine / workflow | Y | p | Y | p | - | - | - | p | Y | - | Y |
| approval | Y | p | Y | - | - | - | - | p | Y | - | ? |
| role + field permission | Y | Y | Y | Y | p | p | Y | Y | Y | p | Y |
| row-level permission | Y | Y | Y | Y | p | p | Y | Y | Y | p | Y |
| audit / version history | Y | p | Y | Y | p | - | Y | Y | Y | p | Y |
| comments | Y | Y | Y | p | - | - | - | Y | Y | - | ? |
| attachments | Y | Y | Y | Y | - | p | Y | Y | Y | - | Y |
| assign / share | Y | Y | Y | p | - | - | - | Y | Y | - | ? |
| notifications | Y | Y | Y | p | - | Y | p | Y | Y | p | Y |
| email from record | Y | Y | Y | p | - | p | p | p | Y | - | p |
| print format / PDF | Y | Y | p | - | - | - | - | - | Y | - | - |
| import | Y | Y | Y | Y | - | Y | Y | Y | Y | - | ? |
| export | Y | Y | Y | Y | - | Y | Y | Y | Y | Y | ? |
| custom fields at runtime | Y | Y | Y | Y | - | - | - | Y | Y | - | Y |
| dashboard / report | Y | Y | Y | Y | - | Y | p | Y | Y | - | Y |
| API | Y | Y | Y | Y | - | - | Y | Y | Y | n/a | Y |
| webhooks | Y | p | Y | Y | - | - | p | Y | Y | - | Y |
| i18n | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| mobile | p | p | Y | p | p | p | p | p | Y | - | ? |
| command search | Y | p | p | Y | - | Y | Y | p | p | Y | ? |
| trash / restore | Y | p | Y | Y | - | Y | Y | p | Y | - | ? |
| duplicate | Y | Y | p | p | p | Y | Y | p | Y | Y | ? |
| links to related | Y | Y | Y | Y | Y | Y | Y | Y | Y | p | Y |
| empty/loading/error states | p | p | Y | p | p | p | p | p | p | Y | ? |

Sources for ticks. **M:**
- Frappe: doctype folders `bulk_update, list_filter, kanban_board, calendar_view, version, docshare, todo, data_import, deleted_document, notification_log`, and `public/js/frappe/views/{kanban,calendar,gantt,map,reports}` (gh api frappe/frappe).
- Odoo: `ir_ui_view.py` view types list/form/graph/pivot/calendar/kanban/search; `addons/mail/models` has `mail_thread, mail_followers, mail_activity*, mail_template, mail_message*`.
- Twenty: `engine/metadata-modules` has `view, view-filter, view-sort, view-group, role, row-level-permission-predicate, webhook, workflow, command-menu-item, page-layout`; front `object-record` has `record-table, record-board, record-calendar, record-update-multiple, spreadsheet-import, record-merge`.
- Django: fetched ModelAdmin docs; no import, export, comments, saved filters or workflow listed.
- Filament: `packages/actions/docs` has replicate, restore, force-delete, import, export.
- Payload: `docs/configuration/collections.mdx` flags `versions, trash, lockDocuments, enableQueryPresets, disableBulkEdit, disableDuplicate, authorship, orderable, hierarchy, folders`; `plugin-import-export` (CSV/JSON, jobs queue, preview); `plugin-mcp`.
- Directus: `api/src/services` has `activity, revisions, comments, shares, presets, versions, flows, notifications, import, export, policies`.
- NocoBase: plugins `acl, action-bulk-edit, action-duplicate, action-export, action-import, action-print, audit-logs, comments, calendar, kanban, gantt, field-sequence, form-drafts, workflow-*`.
- react-admin: Bulk Delete/Update/Export, Clone, Export buttons, `Empty`, `*WithUndo`. Refine contexts `accessControl, auditLog, notification, i18n, undoableQueue, unsavedWarn` are provider slots you implement.
- Open Mercato: modules `audit_logs, attachments, perspectives, entities, notifications, workflows, webhooks, dashboards, search`.

**I:** every other tick. Salesforce is least verified (third-party summary only).

Takeaway (M): **only Frappe has submit/cancel/amend as a core document state.** Odoo gets close by per-model convention.

## 2. Declaration shape and escape cost

| Framework | One declaration looks like | Leaving the default |
|---|---|---|
| Frappe | DocType JSON, about 96 settings (`is_submittable, track_changes, allow_import, quick_entry, search_fields, title_field, sort_field, default_view`; M). Sales Order = 1,920-line JSON + 1,930-line `.js` + 1,162-line `.py` + `_list.js` (M). | Per-doctype JS/Py hooks (`frappe.ui.form.on`, `listview_settings`). Small tweaks easy; a new UX means leaving Desk (I). |
| Odoo | Python model `_inherit` of `mail.thread` + activity mixin, fields with `tracking=True`, plus XML views (M `tracking` param). | XML view inheritance; powerful, brittle across versions (I). |
| Salesforce | Object plus checkboxes, page layouts, flows (third-party). | Lightning components; vendor-bound (I). |
| Twenty | Runtime metadata. Create-object input is names, labels, icon, color (M). Docs: new object "appears in the sidebar immediately" (M). Views via `defineView({type, fields, filters, sorts})` (M). | Front components and logic functions in the app SDK (M dir names). |
| Django | `ModelAdmin` attrs `list_display, list_filter, search_fields, list_editable, actions` (M). | Templates / `get_urls()`; docs say admin is not a front end (M). |
| Filament | PHP resource with `table()` and `form()`; prebuilt action classes (M). | Livewire components, inside Laravel (I). |
| Payload | TS `CollectionConfig`; most features opt-in (`trash` defaults false; M). Locking and authorship default on (M). | Custom React components per admin slot (M). |
| Directus | DB-first, tables introspected (I). | Extensions: interfaces, layouts, hooks (I). |
| NocoBase | Feature per plugin (M list). | Write a plugin. |
| react-admin / Refine | `<List><Datagrid>` or `useTable`; you write the data provider (M). | Fully yours. |
| Open Mercato | TS module with auto-discovered files, `makeCrudRoute`, `CrudForm`, `DataTable`; rules for agents in `AGENTS.md` (M). | Injection widgets, interceptors, component replace/wrap (M task router). |
| Wasp | `main.wasp` `crud` block: API only (getAll/get/create/update/delete). No UI, validation or authz; "early preview" (M wasp.sh). | `overrideFn` per operation (M). |

Not studied in depth: Rails (ActiveAdmin, Avo; dir names only), Nova, Encore (I).

## 3. Where it fails

| Framework | Failure | Evidence |
|---|---|---|
| Frappe | List view was about 20% of CPU on Frappe Cloud; they added switches to turn off counts and auto-refresh. | frappe.io blog "balancing the costs of count" (search) |
| Frappe | List freezes near 6,600 rows on v16. | discuss.frappe.io thread 164365 (search) |
| Frappe | Cancel chain: editing a submitted order forces cancelling every downstream doc first. | ERPNext docs + forum "amend without amending downstream" (search) |
| Frappe | 1,000+ child rows slow validation. | frappe issue 31196 (gh search) |
| Odoo | `mail_message` and `mail_tracking_value` dominate DB size; Odoo's own PR moves tracking values into the message body, citing up to 30% space saved. | mergebot odoo/enterprise PR 99500 (search; 370 GB is a forum anecdote) |
| Odoo | Slow product lists on large data. | odoo issues 85926, 46407 (gh search) |
| Twenty | Timeline activity fetch and generic table performance. | twenty issues 20726, 11729 (gh search, closed) |
| Twenty | Not uniform: email/calendar sync only for People, Companies, Opportunities. | docs.twenty.com data-model (M) |
| Directus | Large tables slow from per-instance CSS `v-bind()`; app loads all fields on init. | directus issues 28434, 15702 (gh search) |
| Django | No import, export, comments, saved filters, workflow. | Django docs (M) |
| Payload | Safe features are off by default; easy to forget. | collections.mdx (M) |
| Open Mercato | Kernel files are huge: `factory.ts` 3,468 lines, `CrudForm.tsx` 5,307, `DataTable.tsx` 4,241 (M, `wc -l`). v0.x, 1,964 stars. | open-mercato repo (M) |
| Wasp | CRUD ignores business rules and authz. | wasp.sh (M) |

## 4. Frappe documents and Odoo chatter

**Frappe submit / cancel / amend (M, `document.py`, `docstatus.py`).**
- `docstatus` is an int: 0 draft, 1 submitted, 2 cancelled.
- `check_docstatus_transition` allows 0 to 0 (save), 0 to 1 (submit, needs `is_submittable`), 1 to 1 (update after submit, only allow-on-submit fields), 1 to 2 (cancel). It rejects 0 to 2, 1 to 0, and any edit of a cancelled doc (about lines 1781-1830).
- **Amend** creates a new draft with `amended_from`; `validate_amended_from` requires the source to be docstatus 2 (about line 1210). The name gets a suffix (`_set_amended_name`, naming.py:180), so `SO-0001` becomes `SO-0001-1`.
- Workflow is separate and optional (`workflow.py`); it maps states onto docstatus.

**Naming (M, `naming.py` 148-200).** Order: amended suffix, controller `autoname`, DocType `autoname` option, then hash fallback. Options: `naming_series:` (prefix plus `.#####`, DB counter, preview that does not touch the counter), `format:` expressions, `field:`, `prompt`, `UUID`, `autoincrement`, and Document Naming Rules with conditions.

**Odoo chatter and activities (M, `addons/mail/models`).**
- `mail.thread` is an abstract model, 5,474 lines. Inheriting it adds a message log, followers and notifications. `_mail_post_access = 'write'` sets who may post.
- Field changes are logged only for fields with `tracking=True`, one tracking row per change. This is the cost in section 3.
- `mail.activity.mixin` adds scheduled to-dos: `activity_schedule, activity_reschedule, activity_feedback, activity_unlink`. Activity types are data, not code.
- Copy the idea: one timeline per record with comments, emails, field changes and scheduled tasks. Do not copy the per-field tracking table.

## 5. Same idea as plain code: the resource kernel

What real repos share (file listings, M):

| Product | Shared | Hand built |
|---|---|---|
| Twenty | Whole record UI is generic: table, board, calendar, filter, sort, merge, bulk update, import (2,848 files in `object-record`); API and views from metadata. | Standard-object quirks, workflows, email sync, app front components. |
| Open Mercato | `makeCrudRoute`, `CrudForm`, `DataTable`, injection spots for columns, row actions, bulk actions, filters; optimistic locking default ON. | Module business logic; `customers` is the reference module. |
| Plane | One layout family (list, kanban, calendar, gantt, spreadsheet) plus `rich-filters` packages, for the **work item entity only**. | Other entities separate. |
| Cal.com | `packages/features/data-table`: 5 filter types, saved segments, pagination, GUIDE.md. | Columns and page wiring per screen. |
| Midday | `tables/` folder with about 16 resource folders, each its own columns and table. | Almost everything; shared header-drag and resize bits. |
| Documenso | Two primitives: `data-table.tsx`, `data-table-pagination.tsx`. | Everything else. |
| Mattermost | `admin_console/data_grid`. | Product UIs. |

GitLab and Discourse not read. Pattern: **mature products share the list/filter/saved-view/pagination layer and hand-build forms, detail pages and domain.** Only metadata products (Twenty, Frappe, Odoo) also generate forms.

Sketch for Go + Postgres + React (INFERRED design from the evidence above):
1. **Resource descriptor**: one Go struct per resource, code-first, in git. Fields, types, list columns, search fields, states, permissions, flags (`issued`, `audit`, `softDelete`, `attachments`). An agent edits this file.
2. **Generic list endpoint**: filter/sort/search/page DSL compiled to SQL (sqlc is static, so dynamic filters need squirrel, goqu or bob). Tenant and row scope injected in middleware. Export reuses the same DSL.
3. **Timeline table** in the Odoo chatter shape: entity, id, kind, actor, body, diff_json, time. Comments, audit, emails and system events all land here.
4. **Issued documents**: `status`, `docstatus`, `amended_from`, a series row locked with `SELECT ... FOR UPDATE`, reset per fiscal year. Cancel and amend are two endpoints.
5. **React**: one `<ResourceList>` on TanStack Table, Router and Query (URL-state filters, saved views, bulk bar, export, empty/loading/error states) and one `<ResourceForm>` from the descriptor, with slots for custom cells and row actions.
6. **Conformance test**: loop over every registered resource; fail if permissions, audit, list columns or search fields are missing. This is the real "impossible to forget", since Payload shows opt-in flags get forgotten.

## 6. Union checklist by coverage

Counts are Y or p out of 11 columns, my reading (I where not M):
- **10-11:** list/filter/sort/search, bulk, i18n, related links, form.
- **8-9:** saved views, export, attachments, role and row permission, audit, runtime custom fields, API, dashboards, duplicate.
- **6-7:** import, notifications, trash, webhooks, kanban/calendar, comments, inline edit, group-by.
- **3-5:** assign/share, workflow states, approval, command search, print/PDF, email from record, mobile.
- **1-2:** draft/submit/cancel/amend (Frappe fully; Odoo, NocoBase by convention or plugin).

## 7. Recommendation on kernel scope

**Share from day one:**
- Descriptor, generic list/query (filter, sort, search, page, saved views, URL state).
- Permission checks (role, row, field), tenant scoping, soft delete and trash, optimistic lock (OM default ON; M).
- Timeline table (audit, comments, system events), attachments, notification hooks.
- Bulk bar, job-based export, empty/loading/error states.
- Naming series and issued-document state, only for resources flagged `issued` (invoices, quotes, POs).
- Conformance test over the registry.

**Share later:** import with dry-run preview (Payload and Frappe offer preview), kanban/calendar, print templates, activities and reminders, runtime custom fields.

**Keep custom:** detail-page layout, dashboards, pipeline boards, money logic, customer-facing document design, onboarding, workflows touching payments.

**Biggest risks:**
1. Kernel turns into a god component (OM 3-5k-line files; M). Cap it at list, form shell and slots.
2. Timeline growth (Odoo; M source, anecdotal sizes). Store diffs compactly, partition by month, set retention.
3. Generic list performance and counts (Frappe, Directus, Twenty; issues). Keyset paging, optional counts, an index per declared filter.
4. Opt-in flags re-create forgetting (Payload; M). Default on; opt out with a written reason.
5. Runtime metadata (Twenty, Frappe) needs a migration engine. We ship code with agents, so choose static descriptors.
6. Cancel chains (Frappe docs). Default correction should be a reversal document (credit note), not cancel-all.
7. Agent drift. Open Mercato's `AGENTS.md` has Always/Ask First/Never lists, a 32 KB budget, a reference module and a "never edit generated files" rule (M). Copy that.

## 8. Could not verify
Salesforce first-party docs (third-party summaries only); Nova, Avo, ActiveAdmin features beyond directory names; Directus layout types and NocoBase approval (inferred); Open Mercato `?` cells; GitLab and Discourse code; Encore; any scale benchmark with numbers (only issue titles and one Frappe blog); evidence for "looks generic".
