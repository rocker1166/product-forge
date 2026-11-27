# Invoices for Indian service firms: Running it

| Topic | Answer |
|---|---|
| settings | {"group":"Firm profile (owner only)","items":["legal name, address, state and GSTIN with the date it started","PAN and Udyam number","tax scheme: regular, composition or unregistered","declared turnover per financial year and the e-invoice flag","filing mode: monthly or quarterly","bank block, SWIFT and UPI ID; a change needs the password and second step, takes effect after 24 hours and any owner can cancel it from the mail (R62)","period lock date: owner or accountant sets it, up to the last day of the previous month; only an owner moves it back, with a reason"]}, {"group":"Numbering and dates","items":["invoice prefix and credit note prefix of 1 to 4 characters","next number per series, upward only before the first document of the year, locked afterwards","payment terms days, default 15, 0 to 90","share link expiry days, default 30, 1 to 365"]}, {"group":"Documents and branding","items":["logo (PNG or JPG, 1 MB), one brand colour, footer note, signature image","terms text per document type, 1000 characters","default customer note, 500 characters","template style: plain, standard or modern","email templates for invoice, receipt, credit note, quote and three reminders"]}, {"group":"Reminders and messages","items":["reminder days 1, 7 and 15 after due date, switchable per customer and per invoice","before-due reminder 3 days ahead, off by default","owner confirms the first reminder batch: off by default; the 18:00 eve mail lists tomorrow's reminders with Paid already on each row","reminder tones gentle, firm and final, text editable once","send window 09:00 to 19:00 IST","receipt email after payment, on by default"]}, {"group":"Money and tax switches","items":["currencies enabled for invoices: USD, EUR, GBP, AED, SGD, AUD","LUT per financial year with number, validity and ARN","default tax treatment and default TDS section per customer","reverse-charge category list","cash receipt limit Rs 2,00,000 (product-owned, shown not edited)","UPI limit note above Rs 1,00,000 balance"]}, {"group":"People and security","items":["require TOTP for all users","invite roles: owner, accountant, staff, viewer (fixed, not editable)","session idle limit 8 hours (fixed)","grant support access for 24 hours or 7 days","sign out of other sessions and see where you are signed in, each person for their own login","list of every support view made under a grant, with time and what was opened: the same list support sees, shown to the owner"]}, {"group":"Plan and billing (owner only)","items":["plan, billing details, cancel at period end and Undo cancel","free limit 10 issued invoices a month, 2 users, 1 accountant seat","paid plan Rs 499 a month or Rs 4,999 a year including GST, 5 users, 1 accountant seat","trial length 14 days (owner decision)"]}, {"group":"Product-owned tables (firms never edit)","items":["GST rate and SAC table with effective dates","TDS table: section 393(1) serial, old alias, rate, threshold, effective dates","GST state codes","e-invoice thresholds Rs 5 crore and Rs 10 crore, B2C large limit Rs 1 lakh, unregistered detail limit Rs 50,000","filing calendar dates","credit note date limit rule and the 01-11-2026 discount change","registration limits Rs 20 lakh and Rs 10 lakh states"]}, {"group":"Clocks and jobs (fixed)","items":["recurring drafts daily 06:00 IST","reminders daily 09:00 IST","month-end pack on the 1st at 08:00 IST","financial year counters created on first use, pre-warmed 1 April 00:05 IST","payment undo window 10 seconds, duplicate guard 24 hours, draft autosave 30 seconds","nightly encrypted backup with a copy in a second Indian region and a weekly restore test"]} |
| support | find a firm by name, GSTIN or owner email, build the full-firm export of a sealed firm for a former owner after the proofs of R65, refund a plan charge made in the last 30 days against a ticket, see its history log and failed jobs, resend or retry an email and an e-invoice call, view as the firm only inside an owner grant, with a banner and a log, restore one firm from backup, run the integrity check for one firm, end all sessions of a user |
| events | signed_up, first_invoice_issued, first_invoice_sent, first_payment_recorded, first_export_used, i_have_paid_claim, reminder_sent, plan_limit_hit, trial_ended, plan_paid, tax_check_failed, einvoice_failed, accountant_invited, support_access_granted |
| seed | two sample firms in different states (one regular with GSTIN, one unregistered), 300 customers, 6,000 invoices in every state across two financial years, credit notes, TDS payments, a foreign-currency export under LUT, a cheque bounce, a recurring plan and every outbox state |
| rollout | five design-partner firms from the interviews, then invite only with a waiting list, then open signup; each step holds until a month-end pack has been checked by a chartered accountant |
| rollback | one command returns web and API to the last release and the database is only ever migrated forward, so every release stays compatible with the one before; tried once before the first firm |
| stack | Go and Postgres backend, React and Vite web app, hosted in the Mumbai region with a backup copy in a second Indian region |

| product | Answer |
|---|---|
| home. Home or dashboard: what does each role see first, and can they change it? | now: four tiles, unpaid total, overdue total, paid this month and drafts, each opening its list; a staff user sees no revenue figure and the page never fetches one |
| views. Other ways to see the main records: board, calendar, timeline, map, sheet? | no: lists with filters, sort and a quick Opened filter kept in the page address are enough; board, calendar and timeline wait |
| quick_entry. Fastest way to add the most common record: one line, drag on a calendar, copy the last one, start and stop? | now: a bottom plus button, a customer picker with the 5 latest customers, a name-only customer, item autocomplete and a live PDF preview that takes no number |
| modes. Which ways of working does one firm choose between (strict or free entry, future dates, required fields)? | no: one fixed way of working; dates cannot be in the future and Issue locks the paper; approval before issue is later |
| favourites. Recent and favourite records, reused in one press? | now: recent customers first in the picker and recently used items first, no pinned favourites |
| search_all. One search over everything, with jump by number or id? | now: every list searches from 2 characters and a number typed with or without spaces and slashes finds its document; one box over everything is later |
| keyboard. Keys and command menu for daily users? | later: Ctrl or Cmd Enter submits a form now, the command menu waits |
| planning. Planning ahead: capacity, targets, budgets, forecasts? | no: this product does not forecast or budget |
| time_off. Working days, holidays, absence: do they change any number or date here? | no: due dates and reminders count calendar days and no holiday calendar changes any date |
| teams. Teams or groups: who leads, who sees whose records? | no: firms of one to twenty people use roles, not teams |
| custom_roles. Can a customer make roles and switch each permission? | no: four fixed roles; the Users page lists what each may do and the 403 tests come from that table |
| signin_company. Company sign-in (SAML, OpenID, LDAP), forced second step, sign-out of other devices? | later: company sign-in waits; email and password with optional TOTP and sign-out of other sessions are now |
| preferences. Each person's language, theme, time zone, date and number format, first day of week, landing page? | now: dates DD-MM-YYYY, Indian grouping and IST are fixed for everyone; no per-person format yet. Every screen, PDF, CSV export and email shows dates and times in IST in that format; stored times are UTC and converted only on display |
| branding. Logo, colours, own domain, own sender address, templates they can edit? | now: logo, one brand colour, footer, terms and signature on the paper and emails; own domain later |
| templates. Which papers, emails and records have templates a customer edits? | now: three style families, separate invoice, credit note, receipt and email templates with merge tags, edits apply to new documents only |
| automation. Rules a customer sets: when this, then that? | later: fixed reminders and recurring drafts are the only rules; when-this-then-that waits |
| recurring. What repeats by itself, and who is told when it fails? | now: monthly, quarterly or yearly review drafts once per period, failures tell the owner, never issued by the job |
| reports. Which questions do people ask each week, month and year? One report each, with its filters. | now: aging summary and detail, payments received, customer balance, sales register, GST summaries and TDS by customer, each with a date preset and customer filter |
| scheduled_report. Reports sent by email on a schedule? | now: only the month-end accountant pack on the 1st at 08:00 IST; other schedules later |
| public_page. What may an outsider see or do without an account? | now: a share page per document with pay button, QR, PDF, view times and a plain paid or cancelled notice, no login |
| portal. A place for the customer's customer? | no: no customer logins; the share link and I have paid claim are the whole customer side |
| phone_app. Phone: web page, installed app, offline, camera, scan? | now: an installable web app, lists and drafts readable offline, Issue needs the network |
| desktop. Browser extension, desktop app, email add-in, calendar link? | no: nothing to add on a desktop in wave 1 |
| external_sync. Which outside records are kept in step both ways (calendar, contacts, files, chat)? | later: Tally and Zoho Books sync; wave 1 exports Tally XML |
| ai. Help by AI: draft, summarise, suggest, answer; who pays and who approves? | no: no AI features in wave 1 |
| languages. Languages and right-to-left of the product and of its papers? | now: English screens; names and notes in any Indian script print correctly; Hindi screens later |
| many_companies. One person in several firms, one firm with several brands or branches? | room: one login can belong to many firms (a CA); one plan covers one business |
| audit_all. One log of everything, searchable, exportable, how long kept? | now: append-only history, one log filterable and searchable by record number, kept at least 8 years, every export logged |
| trash_all. One trash for everything: how long, who restores? | no: drafts are hard-deleted with a history row, issued papers are never deleted, customers and items are archived |
| import_all. Moving in from each rival: which files, which fields are lost? | now: customers, items and opening invoices from CSV or XLSX with a sample file and a dry run; rival files go through CSV |
| demo. Sample data a new user can try and remove? | later: a sample firm the owner can try and remove |
| help. Help inside the product, contact, status page, what is new? | now: a help page, a support email and a status page, linked from every error |
| plans. Plans, limits, trial end, upgrade, downgrade, unpaid: what still works? | now: Free with 10 issued invoices a month, a 14-day trial that ends on Free, one paid plan; whatever happens every paper stays readable and exportable |
| self_host. Is it also installed by customers: install, update, backup, restore? | no: hosted by us only |
| admin_settings. Every switch a firm's admin can set, in groups? | now: every switch is in the grouped settings list of this map and owner-only ones are marked |
| privacy. A person asks for their data or its deletion: who does what, what must stay? | now: owner can export everything, correct or erase a contact's data on request, delete the firm after 30 days; tax papers stay by law |

| day one | Answer |
|---|---|
| D1. Where is the tenant key, including child tables? | firm_id on every table including child rows and in the first place of every index, with composite keys so a child cannot point at another firm's parent |
| D2. ID type, and is the human number separate? | UUID v7 keys; the human document number is a separate column from the counter |
| D3. Are taxes rows, not one column? | tax rows per line (head, rate, amount) and per document, not single columns, so a new tax head is a row |
| D4. Is price per list or channel, not on the product? | price and rate are copied onto the line; the catalogue is a convenience; a price list can come later |
| D5. Which state tracks run side by side (payment, delivery, return)? | document, payment, e-invoice and delivery states run as separate tracks side by side |
| D6. Which documents are never edited after issue, and what reverses them? | issued invoices and credit notes are never edited; only due date and notes change, and a credit note or void reverses |
| D7. Number series: per entity, per year, any gaps allowed? | one counter row per firm, GSTIN, document type, prefix and financial year, locked in the issue transaction, no gaps allowed |
| D8. Can an owner be a person, a team or a bot? | an owner is a membership of a person today; the column can later point at a team or bot |
| D9. View settings: per user, per place, shared? | no saved views in wave 1; filters live in the page address per person |
| D10. Which limits live in settings, not in the schema? | rates, thresholds, plan limits, number format and reminder days live in dated settings tables, not in code or schema |
| D11. Where is space for custom fields, and will customers make their own objects? | one jsonb custom fields column on customer and invoice; customers do not make their own objects |
| D12. Idempotency keys, outbox, UTC time, money in minor units, API version: decided? | idempotency key on every write, outbox table, UTC time, integer paise, API version header |

| production | Answer |
|---|---|
| P1. Target ASVS level chosen (L1 minimum) and requirement IDs tracked as v5.0.0-x.y.z | ASVS level 1 minimum, level 2 for sign-in, sharing and money; requirement ids tracked as v5.0.0-x.y.z |
| P2. Config and secrets come from environment, none in repo | all secrets and provider tokens come from the environment or a secret manager and are encrypted at rest; none in the repository |
| P3. Tenant isolation tested: user A cannot read B's records by ID | an automated test takes one firm's token and requests 100 ids of other firms by record, list, search, export and share link and expects 404 |
| P4. Server-side validation on every input | every input is validated on the Go server with the same limits as the rules; the web checks are courtesy only |
| P5. Every action checked against role on the server, not only hidden in UI | every write endpoint is called by every role in a test generated from the role table, expecting 403 where forbidden |
| P6. Automated backups exist | managed Postgres in the Mumbai region with daily backups and point-in-time recovery; encrypted copy in a second Indian region |
| P7. A restore was performed into a clean environment and timed this quarter | a restore into a clean database runs weekly and checks invoice and payment counts; one firm can be restored alone; the time is recorded |
| P8. Deleted records recoverable for a stated period | drafts are hard-deleted with a history row; issued papers never deleted; archived customers restorable; no general trash |
| P9. Migrations run forward and are tested on a copy of production data | migrations only move forward, run first on a copy of production data, and never need downtime |
| P10. One-command rollback, tried once | one command rolls back the web and API to the last release, tried once before the first firm |
| P11. Deploy does not need downtime or manual DB steps | rolling deploy of two or more instances with no manual database step |
| P12. Admin tasks run as one-off scripts, not by hand in prod | support and admin tasks are scripts in the repository, reviewed and logged, never typed by hand in production |
| P13. Alert on errors and latency, with an owner | alerts on error rate, latency, failed jobs and counter gaps go to a named owner on call |
| P14. End-to-end synthetic check of the main journey | an hourly synthetic check signs in to a test firm, issues an invoice, records a payment and opens the share link |
| P15. Logs go to a searchable store | structured logs go to a searchable store for 30 days with no full GSTIN, phone, account number or amount beside a name |
| P16. Load test at expected peak | load test at 5 times the expected peak of end of month, mainly the issue transaction and the register build |
| P17. Rate limits and timeouts on public endpoints | rate limits of 100 requests a minute per user and 1,000 per firm, sign-in lockout, and limits on share-link opens and email sends |
| P18. Upload, export and page-size caps documented (e.g. 15 MB, 20,000) | documented caps: import 5 MB and 5,000 rows, CSV export 50,000 rows, logo 1 MB, 50 lines per invoice, 99,99,99,999 rupees a document |
| P19. At least two instances for anything mission-critical | at least two app instances and a managed database with a standby in another zone |
| P20. Background jobs are retryable and idempotent | every job takes a lock and a unique key per unit of work, so running it twice sends or creates nothing twice |
| P21. Failed jobs are visible and replayable by support | failed jobs are listed for support and owner with the reason and a Retry; the retry limit is 5 |
| P22. Long exports run async and notify (email) | exports over 5,000 rows run as background jobs and email a 7-day link |
| P23. User can export their data | owner exports the whole firm as one zip of CSVs and PDFs, open in every plan state |
| P24. User can delete account and its data; effects stated before confirm | firm deletion is owner-only with the typed name, a 30-day cooling period and a plain list of what stays 8 years by law |
| P25. Personal data inventory and retention period written | a written personal data inventory with the retention of each field, shown in the privacy page |
| P26. India DPDP: rights handling and breach duties start staged over about 18 months from Nov 2025; exact dates and erasure timelines UNVERIFIED | DPDP duties start in stages over about 18 months from 14 November 2025; the firm is the fiduciary and we are the processor; a lawyer reviews terms before launch; our reply time target is 30 days against the 90 allowed |
| P27. Staff can find a user, see their activity log, and impersonate with audit | support finds a firm, sees its history and failed jobs and can view as the firm only inside an owner grant, every view logged |
| P28. Status/problem page and contact route exist | a status page and a support email, both linked from the app footer |
| P29. Per-tenant or per-job cost is measured and a monthly budget alert exists | cost per firm (storage, email, PDF, e-invoice calls) is measured monthly with a budget alert |
| P30. Free-tier or abuse path is capped | free plan is 10 issued invoices a month, 2 users, email sends capped per day, and one signup per verified email |

| flow | Answer |
|---|---|
| A1. Page title is the resource name; one primary "create" button top right; no button if creation is impossible. | yes |
| A2. Filter, sort and multi-select actions sit above the list; saved views include a locked "All" view plus rename/duplicate/delete. | no: no saved views in wave 1; filters, sort and search live in the page address and an All list is always the default |
| A3. Choose and state one mode: batch ("Apply") or live. Several filter categories are never hidden inside one menu. | yes |
| A4. Search input debounces about 250 ms; validation about 500 ms. | yes |
| A5. List has row checkboxes; selecting shows a bulk bar; selection survives paging; action asks for a reason where money moves. | no: no bulk selection in wave 1; every money action is one record at a time |
| A6. Required marks use "(optional)" text, never asterisks; every question page has a Back link; ask each fact once per journey. | yes |
| A7. Submit button is never disabled to signal invalid input; Cmd/Ctrl+Enter submits from any control. | yes |
| A8. Error summary at top plus message at each field, summary links to the field; shown on submit, not on blur. | yes |
| A9. Contrast: PJ lets real-time validation run, GOV forbids on-blur validation. Pick one and write it down. | no: errors show on submit with the summary, never on blur or while typing, so no real-time rule is needed |
| A10. One sentence, says what is wrong and the next step, no blame; removed when input becomes valid. | yes |
| A11. Unsaved changes trigger a save/discard bar with text "Unsaved changes" and verb-only buttons (Save, Discard). One form per page. | yes |
| A12. Auto-save shows inline "Saving…" then "Change saved", fires on blur or 3 s after last key, and a failed save keeps an alert with retry until success. Never auto-save a whole multi-field form. | no: invoice drafts autosave every 30 seconds and on leaving with Saved hh:mm, as the list says; other forms use Save and Discard |
| A13. Leaving with unsaved changes warns. | yes |
| A14. Hard-to-undo delete uses a modal with a danger-styled confirm button and a cancel that names what is kept; deleting a container with children requires typing its name. | yes |
| A15. If an action is reversible, offer undo (Linear: Cmd/Ctrl+Z on moves) and state what undo does not restore. | yes |
| A16. Empty state has one primary action, an action-oriented title (about 5 words, no period), a positive tone, and analytics on its views. | yes |
| A17. "No results" state differs from "nothing yet" and from "system error"; no-results explains how to adjust search or filters. | yes |
| A18. Skeletons only on containers and data components, only for seconds; spinner for whole-page processing; more than a few seconds uses a progress bar. | yes |
| A22. End of a transaction has a confirmation page with reference, next step, and a URL the user can reopen. | yes |
| A23. Multi-step flows end with a check-answers page with a "Change" link per section; Continue returns to it. | yes |
| A25. "Not eligible / not allowed" is a page with next steps, not a validation error. | yes |

