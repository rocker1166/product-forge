# 11 - UX flow feel and production readiness (research, 2026-11-25)

Legend. **D** = stated in the cited doc. **S** = read from source/docs steps (code or step list). **J** = my judgment, not in a source. Short names: PJ = design.gitlab.com/patterns, POL = Shopify Polaris repo (github.com/Shopify/polaris, `polaris.shopify.com/content/...`), GOV = design-system.service.gov.uk, CAR = carbondesignsystem.com.

## A. Checkable pattern rules

Each rule is yes/no for a script (S) or reviewer (R).

| # | Area | Rule | Chk | Source |
|---|---|---|---|---|
| A1 | Index | Page title is the resource name; one primary "create" button top right; no button if creation is impossible. D | R | POL patterns/resource-index-layout/variants/default.mdx |
| A2 | Index | Filter, sort and multi-select actions sit above the list; saved views include a locked "All" view plus rename/duplicate/delete. D | R | same file (view tabs in the example code) |
| A3 | Filters | Choose and state one mode: batch ("Apply") or live. Several filter categories are never hidden inside one menu. D | R | CAR /patterns/filtering/ |
| A4 | Search | Search input debounces about 250 ms; validation about 500 ms. D | S | PJ saving-and-feedback |
| A5 | Bulk | List has row checkboxes; selecting shows a bulk bar; selection survives paging; action asks for a reason where money moves. D | S | CAR /components/data-table/usage/; Stripe bulk refund, docs.stripe.com/refunds |
| A6 | Form | Required marks use "(optional)" text, never asterisks; every question page has a Back link; ask each fact once per journey. D | S | GOV patterns/question-pages |
| A7 | Form | Submit button is never disabled to signal invalid input; Cmd/Ctrl+Enter submits from any control. D | S | PJ forms |
| A8 | Validation | Error summary at top plus message at each field, summary links to the field; shown on submit, not on blur. D | S | GOV components/error-summary, patterns/validation |
| A9 | Validation | Contrast: PJ lets real-time validation run, GOV forbids on-blur validation. Pick one and write it down. D (conflict) | R | PJ forms vs GOV patterns/validation |
| A10 | Error text | One sentence, says what is wrong and the next step, no blame; removed when input becomes valid. D | R | POL components/selection-and-input/inline-error.mdx |
| A11 | Save | Unsaved changes trigger a save/discard bar with text "Unsaved changes" and verb-only buttons (Save, Discard). One form per page. D | S | POL components/internal-only/contextual-save-bar.mdx |
| A12 | Save | Auto-save shows inline "Saving…" then "Change saved", fires on blur or 3 s after last key, and a failed save keeps an alert with retry until success. Never auto-save a whole multi-field form. D | S | PJ saving-and-feedback |
| A13 | Leave | Leaving with unsaved changes warns. D | S | PJ saving-and-feedback ("safety measure") |
| A14 | Destructive | Hard-to-undo delete uses a modal with a danger-styled confirm button and a cancel that names what is kept; deleting a container with children requires typing its name. D | S | PJ destructive-actions |
| A15 | Undo | If an action is reversible, offer undo (Linear: Cmd/Ctrl+Z on moves) and state what undo does not restore. D | R | linear.app/docs/select-issues |
| A16 | Empty | Empty state has one primary action, an action-oriented title (about 5 words, no period), a positive tone, and analytics on its views. D | S | POL components/layout-and-structure/empty-state.mdx; PJ empty-states; CAR /patterns/empty-states-pattern/ |
| A17 | Empty | "No results" state differs from "nothing yet" and from "system error"; no-results explains how to adjust search or filters. D | R | CAR empty-states-pattern |
| A18 | Loading | Skeletons only on containers and data components, only for seconds; spinner for whole-page processing; more than a few seconds uses a progress bar. D | S | CAR /patterns/loading-pattern/ |
| A22 | Done | End of a transaction has a confirmation page with reference, next step, and a URL the user can reopen. D | R | GOV patterns/confirmation-pages |
| A23 | Review | Multi-step flows end with a check-answers page with a "Change" link per section; Continue returns to it. D | S | GOV patterns/check-answers |
| A25 | Denied | "Not eligible / not allowed" is a page with next steps, not a validation error. D | R | GOV patterns/validation |

Not found as pattern pages (fetch blocked or absent): PJ filtering and permissions (HTTP 403), Material empty-state (404), Atlassian import/export. Import-with-mapping, export dialog, mobile and permission-denied rules above come from products, not design systems (see B, J-rules A25).

## B. Measured journeys

"Steps" are counted from the cited text; S = I counted. "Not seen" = I could not read it.

| Journey | Product | Steps / prefill / after success / undo / limits | Source |
|---|---|---|---|
| First hour | Shopify | Docs sequence: first product, theme, domain, then "continue setup". Trial users advised free theme. | help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-getting-started |
| Create+send invoice | Stripe | Create Invoice, add items, optional tax/coupon/memo, pick delivery (manual link / email with link / PDF only), optional schedule, Review, Send. About 6 steps (S). Leaving the editor auto-saves a draft. | docs.stripe.com/invoicing/dashboard |
| Create+send invoice | Invoice Ninja | Invoice date defaults to today; client picked or created inline; "Save as default terms/footer" reuses text. Draft is invisible to the client; once sent it cannot go back to draft. Actions: Email, Schedule, Mark Sent, Mark Paid, Reverse. | invoiceninja.github.io `docs/user-guide/invoices.md` |
| Create+send invoice | ERPNext | Save draft then Submit; Submit posts ledger entries. Create from Sales Order/Delivery Note carries lines forward; partial invoicing allowed. | docs.frappe.io/erpnext/sales-invoice |
| Refund/correct | Stripe | Default is full refund, amount editable for partial. Multiple partial refunds allowed up to the charge. Bulk full refund across pages. Card refunds cancellable within 30 minutes; fees not returned. | docs.stripe.com/refunds |
| Refund/correct | Shopify | Refund cannot be cancelled or reversed after start; workaround is a draft order. Return after refund impossible; refund without return records no reason. | help.shopify.com/en/manual/orders/refund-cancel-order/refund-order |
| Refund/correct | ERPNext | Return / Credit Note preferred "from the original invoice" so references carry over; cancel only after handling payments, returns, stock. | docs.frappe.io/erpnext/sales-invoice |
| Import customers | Twenty | 7 steps: prepare, open import (⋮ menu or Cmd+K), upload, map columns, map select values, review errors (yellow rows, fix in place or skip), complete. Email must be unique. | github.com/twentyhq/twenty `.../import-contacts-via-csv.mdx`, `fix-import-errors.mdx` |
| Import customers | Invoice Ninja | Upload, auto column matching page, adjust, Import; result emailed; mapping can be saved as template. | invoiceninja.github.io `docs/advanced-topics/import-and-export.md` |
| Import customers | Shopify | Customer CSV max 15 MB; template provided. Product CSV: only Title required; missing Option columns replace variants (data-loss trap). | help.shopify.com/en/manual/customers/import-export-customers; .../products/import-export/using-csv |
| Invite + role | Stripe | Enter emails, assign roles (multiple allowed), review, Send invites. Invites expire in 10 days. Roles editable later. | docs.stripe.com/get-started/account/teams |
| Invite + role | Notion | Settings, People, Add members, email, choose owner/admin/member, Invite. Paid plans bill per member. | notion.com/help/add-members-admins-guests-and-groups |
| Find one of 10,000 | Stripe | Top results appear as you type; Enter or "View all"; dates accept "last week"; an object ID jumps straight to the object. | docs.stripe.com/dashboard/search |
| Find one of 10,000 | Linear | Saved views via Option/Alt+V; select with Shift-click or Cmd/Ctrl+A; actions via Cmd/Ctrl+K. | linear.app/docs/custom-views, /select-issues |
| Export for accountant | Shopify | Up to 50 orders or current page downloads; more than 50 or by date is emailed to user and owner; failure emailed. | help.shopify.com/en/manual/orders/export-orders |
| Export | Twenty | Max 20,000 records per export; exports only the filtered view; needs "Export CSV" permission. | `.../export-your-data.mdx` (twentyhq/twenty) |
| Cancel and leave | Notion | Account deletion is permanent; sole-member private workspaces and sole-admin shared workspaces are deleted. Pages: 30 days in Trash, then 30 more days deleted, then gone. Export PDF; failed PDF falls back to HTML. | notion.com/help/delete-your-account, /duplicate-delete-and-restore-content, /export-your-content |
| Create (keyboard) | Linear | C opens create modal; Alt+C template; leaving keeps a local draft; Esc offers a synced draft (6-month retention). | linear.app/docs/select-issues |

Not seen: Cal.com (docs pages located in github.com/calcom/docs but I read only the overview of event types and bookings; no step counts), ERPNext import/search/invite/close (docs.frappe.io data-import returned 404), Shopify staff invite and closing steps (page text did not expose steps), Stripe customer import and account close (404), Invoice Ninja invite/export/leave, keyboard paths for Stripe, Shopify and ERPNext, batch limits beyond those listed.

## C. Numbers

| Metric | Number | Evidence | Source |
|---|---|---|---|
| Response time limits | 0.1 s feels direct; 1 s keeps flow; 10 s loses attention | Solid, long-standing; NN/g says unchanged since 1993; perception-based | nngroup.com/articles/response-times-3-important-limits/ (via search) |
| Debounce | 250 ms search, 500 ms validation | Design guidance, not a study | PJ saving-and-feedback |
| Form fields | Checkout average 11.3 fields (2024), 8 enough; field count matters more than steps | Benchmark by one vendor, 2024 | baymard.com/blog/checkout-flow-average-form-fields |
| Abandonment from complexity | 17% or 22% on two Baymard pages | Unreconciled; treat as folklore until sourced | baymard.com/research-articles |
| Task success | Average completion 78% across 1,100+ tasks | Decent (large set), source is one vendor | measuringu.com/?p=138 |
| SUS | Average 68 (500 datasets) = 50th percentile, a "C" | Solid | measuringu.com/?p=170; uxpajournal.org JUS Lewis 2018 |
| First click | Correct first click: 87% finish; wrong: 46% | Cited widely; I did not find the primary study | link.springer.com/content/pdf/10.1007/978-3-642-02806-9_1.pdf |
| Default acceptance | Meta-analysis of 58 studies, d = 0.68, large variance; real-world organ-donor effect contested | Solid on "defaults work", weak on size | pubmed.ncbi.nlm.nih.gov/15614141/ ; academic.oup.com/pnasnexus/article/4/10/pgaf311/8303887 |
| Onboarding checklist | Average completion 19.2%, median 10.1%, 188 Userpilot customers | Self-selected vendor sample; folklore as a target | userpilot.com/blog/?p=197841 |
| KLM | K = 0.28 s typical keystroke; M = 1.35 s mental step; predicts expert error-free time only | Solid method; P and 21% figures NOT verified | cs.umd.edu/~golbeck/INST631/KSM.pdf |
| 5-user rule | 5 users find about 85% on average, worst group 55%; 10 users give 95%/82% | Model holds for similar users and simple tasks; real critique exists | nngroup.com/articles/why-you-only-need-to-test-with-5-users/ ; cacm.acm.org/?p=43164 |
| "Fix before code is 100x cheaper" | none | Folklore: I found no source | not found |

What a prototype catches before code (J, from the above): wrong first click, missing step, wrong labels, flow length. It cannot catch latency, real data volume, or errors from a server. No study found comparing defect counts before vs after code.

**Can an agent measure this?** Documented: Lighthouse user flows (navigation, timespan, snapshot modes). Multi-step flows need the Node API with Puppeteer, and INP appears only if the script clicks or types, not scrolls (web.dev/articles/lighthouse-user-flows; github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md). Playwright support for flows: not verified. UXAgent simulates usability tests with LLM personas against a real page (arxiv.org/abs/2504.09407). Own design (J), cheap in Playwright: count clicks and keys per task; focus moves with a `focusin` listener; max scroll depth with a `scroll` listener; time with `performance.now()` between start and success selector; dead end = click with no DOM mutation or URL change within 1 s; back-navigation count; fields touched per form; unlabelled error text. Gate: fewer steps than baseline, zero dead ends, no step over 1 s without feedback.

## D. Production readiness: 30 yes/no items

Sources behind groups: SRE launch checklist (sre.google/sre-book/launch-checklist/), SRE data integrity (sre.google/sre-book/data-integrity/), Heroku Production Check (devcenter.heroku.com/articles/production-check), 12-factor (12factor.net), OWASP ASVS 5.0 (owasp.org/www-project-application-security-verification-standard/), AWS SaaS Lens (docs.aws.amazon.com/wellarchitected/latest/saas-lens/saas-lens.html, only landing text read). GitLab's readiness review is retired and replaced by PREP (handbook.gitlab.com/handbook/engineering/infrastructure-platforms/production/readiness/); template text not read. Stripe's checklist is not public (not found). Items are my merge (J) unless an origin is shown.

| Group | Item (yes/no) | Origin |
|---|---|---|
| Security | 1. Target ASVS level chosen (L1 minimum) and requirement IDs tracked as v5.0.0-x.y.z | ASVS |
| | 2. Config and secrets come from environment, none in repo | 12-factor |
| | 3. Tenant isolation tested: user A cannot read B's records by ID | AWS SaaS Lens (topic), J |
| | 4. Server-side validation on every input | GOV validation |
| | 5. Every action checked against role on the server, not only hidden in UI | J |
| Data safety | 6. Automated backups exist | Heroku |
| | 7. A restore was performed into a clean environment and timed this quarter | SRE ("recovery matters"), J |
| | 8. Deleted records recoverable for a stated period | Notion 30+30 days (B) |
| | 9. Migrations run forward and are tested on a copy of production data | J |
| Release | 10. One-command rollback, tried once | Heroku, SRE |
| | 11. Deploy does not need downtime or manual DB steps | J |
| | 12. Admin tasks run as one-off scripts, not by hand in prod | 12-factor |
| Monitoring | 13. Alert on errors and latency, with an owner | Heroku, SRE |
| | 14. End-to-end synthetic check of the main journey | SRE launch checklist |
| | 15. Logs go to a searchable store | 12-factor, Heroku |
| Limits | 16. Load test at expected peak | SRE launch checklist |
| | 17. Rate limits and timeouts on public endpoints | SRE launch checklist |
| | 18. Upload, export and page-size caps documented (e.g. 15 MB, 20,000) | B |
| | 19. At least two instances for anything mission-critical | Heroku |
| Jobs | 20. Background jobs are retryable and idempotent | J |
| | 21. Failed jobs are visible and replayable by support | J |
| | 22. Long exports run async and notify (email) | B (Shopify) |
| Privacy | 23. User can export their data | B (Notion, Twenty) |
| | 24. User can delete account and its data; effects stated before confirm | Notion (B) |
| | 25. Personal data inventory and retention period written | J |
| | 26. India DPDP: rights handling and breach duties start staged over about 18 months from Nov 2025; exact dates and erasure timelines UNVERIFIED | news search, not official text |
| Support | 27. Staff can find a user, see their activity log, and impersonate with audit | Invoice Ninja activity panel (B), J |
| | 28. Status/problem page and contact route exist | GOV problem page |
| Cost | 29. Per-tenant or per-job cost is measured and a monthly budget alert exists | J |
| | 30. Free-tier or abuse path is capped | SRE (abuse), J |

Pajamas vs GOV.UK disagree on validation timing (A9), so the framework should require a stated choice, not a fixed rule.
