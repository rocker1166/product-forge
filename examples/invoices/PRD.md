# Small invoices: product requirements

Printed from the map. Change the map, not this file. Filled.

Invoices and payments for small Indian service firms. A sample map, kept small on purpose.

| Brief |  |
|---|---|
| who | the owner of a 2 to 20 person service firm, who pays monthly |
| job | send a correct GST invoice, get paid, hand clean books to the accountant |
| country | India (GST, e-invoice, DPDP) |
| money | monthly plan per firm, 14 days free |
| tenants | true |
| custom_objects | false |
| must_never | change an issued invoice, show one firm's data to another, reuse an invoice number |
| size | M |

## Roles

| Role | Home | How they join | When they leave |
|---|---|---|---|
| Owner | home | signs up with phone and email | hands ownership over first; the last owner cannot leave |
| Accountant | home | by an invite that expires in 10 days | loses access at once; their entries keep their name |

## Objects

| Object | Kinds | Module | Why | Linked to |
|---|---|---|---|---|
| Customer | master | billing | the firm or person an invoice is sent to | invoice (blocked while any issued invoice exists; archive instead) |
| Invoice | document | billing | the legal paper that asks for money | customer (the issued copy keeps its own name and address) |

### Customer

| Can do | How |
|---|---|
| create | Form plus inline create from inside other forms, such as a new customer while making an invoice. |
| edit | Always editable. Issued documents keep the values they were issued with, never the new ones. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | One box finds by name, email, phone, code or id; an exact id jumps to the record. |
| filter | Status, tag, owner, created date and one or two business facts such as city or stock. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| import | CSV with column mapping, error rows fixable in place, and a match key to avoid duplicates. |
| export | CSV of the filtered list; large exports are emailed rather than downloaded. |
| delete | Only when nothing refers to it; otherwise the screen says what blocks it and offers archive. |
| archive | Hidden from pickers and default lists but still on old documents and searchable. |
| restore | Archived or deleted record returns with its links; deleted ones keep a fixed recovery window. |
| duplicate | Copies fields and tags; never copies id, history, balances or linked documents. |
| comment | Internal notes on the timeline, never visible to the customer. |
| attach | Contracts, tax forms or datasheets on the record, with size and type limits shown. |
| tag | Free labels the team invents, filterable and bulk-assignable. |
| history | Who changed which field, from what, to what, and when. |
| custom fields | Owner adds their own fields per kind; they show in list, form, import and export. |
| merge | Two duplicates join into one; all linked records move over and the loser is kept as redirect. |
| link related | Shows its documents, payments and tickets with totals, each one opening in place. |
| api | Read, write and search by id and by your own external reference. |
| webhook | Created, updated and deleted events carry the new values and a stable event id. |

**room:** draft; version

**later:** group; saved view; columns; bulk; print pdf; assign; approve; follow; remind; notify

**no:** reverse; share link; preview; schedule

| Question | Answer |
|---|---|
| identity | Same GSTIN, or same email when there is no GSTIN. The form offers the existing customer instead of a second one. |
| snapshot | Name, address and GSTIN are copied into the invoice when it is issued. |
| remove | Issued invoices block removal. Archive takes its place. |
| owner | The firm owns it. Every role in the firm may see it. |
| contacts | Many contacts and addresses, one default of each, one GSTIN per address. |
| code | Optional short code set by the owner, unique in the firm. |
| inactive | Hidden from pickers, old invoices stay readable, can be brought back. |

**States, lifecycle:** active (start), archived

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| put_away | active | archived | owner |  | leaves pickers and default lists | bring_back | none |
| bring_back | archived | active | owner |  |  | put_away | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| name | text | yes | 120 |  | owner and accountant, any time | Enter the customer's name, up to 120 letters. |
| gstin | text |  | 15 |  | owner and accountant; new invoices only | A GSTIN has 15 characters. Check it or leave it empty. |
| email | text |  | 254 |  | owner and accountant | This email does not look right. |
| state | choice | yes |  | the firm's state | owner and accountant; new invoices only | Choose the state. It decides the tax. |
| terms_days | number |  | 365 | 15 | owner | Terms are 0 to 365 days. |

| List |  |
|---|---|
| search | name, gstin, email |
| filters | lifecycle, state |
| sorts | name, created_at |
| default_sort | name |
| columns | name, gstin, balance, last_invoice |
| views | All, With balance, Archived |
| bulk | archive, tag, export |
| bulk_fail | Failed rows stay selected with the reason beside each. |
| export | rows: selected, filtered, all; what: customers, contacts; formats: CSV, XLSX; big: over 1,000 rows comes by email |
| import | match: columns are matched by name, then by hand; errors: bad rows turn yellow and can be fixed or skipped; limit: 5,000 rows |
| page | 50 |

### Invoice

| Can do | How |
|---|---|
| create | From scratch, from a quote or order with lines carried over, and by copy of an older one. |
| edit | Only while draft. After issue only note, contact and tags; money and lines lock. |
| draft | Auto-saved, no number yet, invisible to the customer, deletable without a trace. |
| view | Header with state and amount due, lines and tax, payments, then timeline. |
| search | Number, customer name, reference, amount; an exact number jumps straight to it. |
| filter | State, customer, date range, overdue, amount range, and payment status shown separately. |
| sort | Issue date newest first by default; also due date, amount, number. |
| saved view | Named filters like Unpaid, Overdue, This month, kept per person or shared. |
| columns | Pick columns such as number, customer, due, balance; choice is kept. |
| bulk | Send, mark paid, download, archive and cancel many; failures listed row by row. |
| export | CSV for the accountant by date range; large ranges are emailed, with tax columns. |
| delete | Only drafts. Issued documents are voided or reversed, never deleted; the number stays used. |
| archive | Hides a settled or voided document from default lists without changing its state. |
| restore | Archived returns to lists; a deleted draft does not come back. |
| duplicate | Makes a new draft without number, dates, payments or sent history. |
| reverse | Credit note or return document linked to the original; the original stays untouched. |
| print pdf | GST layout, the same bytes as sent, file name pattern set by the firm. |
| share link | Hosted page with pay button; link can expire or be revoked and shows when it was viewed. |
| preview | Shows the email and PDF as the customer will get them before sending. |
| comment | Internal notes on the timeline; customer-visible notes are a separate field. |
| attach | Supporting files sent with or kept beside the document, with size limit shown. |
| tag | Free labels for filtering and reports; editable even after issue. |
| remind | Automatic reminders before and after due date, with a stop once paid. |
| schedule | Send later, and repeat monthly as a recurring invoice that makes drafts or issues. |
| history | Created, sent, viewed, paid, voided, with who and when; cannot be edited. |
| custom fields | Own fields on header and lines that show on the PDF if chosen. |
| link related | Shows the source quote or order, payments, credit notes and the customer. |
| notify | Customer email on send and on payment; staff alert on paid, failed, viewed or overdue. |
| api | Create draft, finalise, void, send, read PDF; writes accept an idempotency key. |
| webhook | Events for created, finalised, paid, failed, voided, overdue, each with a stable id. |

**room:** version

**later:** group; import; assign; approve (Firms this small have one person who issues. Space is left between draft and issued.); follow

**no:** merge

| Question | Answer |
|---|---|
| freeze | Everything except note, contact and tags is frozen when issued. |
| number | Given at issue, per firm and financial year, no gaps; a voided number stays used. |
| fix | Within 24 hours the e-invoice may be cancelled. Later only a credit note. |
| money | Rupees in paise. Tax per line, rounded per invoice, shown as CGST and SGST or IGST. |
| paid | Payment is its own track beside the document track. |
| late | Reminders 3 days before, on the day, and 7 days after. It stops once paid. |
| law | GSTIN, place of supply, HSN or SAC, IRN and QR when the firm must e-invoice. |
| send | Issued means numbered and frozen. Sending is a separate act and can be repeated. |

**States, document:** draft (start), issued, void (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| issue | draft | issued | owner, accountant | customer has a state, at least one line | number given, fields frozen, tax record started | void or credit_note | invoice_sent |
| void | issued | void | owner, accountant | nothing paid, and within 24 hours if an e-invoice exists | link stays open and says voided | none: make a new invoice | invoice_voided |

**States, payment:** unpaid (start), part_paid, paid, written_off (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| record_part | unpaid | part_paid | owner, accountant |  |  | remove_payment | none |
| record_full | unpaid, part_paid | paid | owner, accountant, system |  |  | remove_payment | invoice_paid |
| remove_payment | part_paid, paid | unpaid | owner | reason written |  | record the payment again | none |
| write_off | unpaid, part_paid | written_off | owner |  |  | none: make a new invoice | none |

**States, tax:** not_needed (start), pending, generated, failed, cancelled (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| send_to_portal | not_needed, failed | pending | owner, accountant, system | firm must e-invoice |  | none: wait for the answer | none |
| portal_ok | pending | generated | system |  |  | cancel_irn | none |
| portal_refused | pending | failed | system |  |  | send_to_portal | tax_failed |
| cancel_irn | generated | cancelled | owner, accountant | within 24 hours |  | none: only a credit note can correct it now | none |
| close_tax | not_needed | cancelled | system | invoice voided before any portal call |  | none: invoice is void | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| number | text | yes | 16 |  | nobody |  |
| customer | link | yes |  |  | while draft | Choose a customer. |
| issued_at | date | yes |  | today | while draft | The date cannot be before the last issued invoice. |
| due_at | date | yes |  | issue date plus customer terms | while draft | Due date is before the issue date. |
| lines | list | yes |  |  | while draft | Add at least one line. |
| total | money | yes | 0 to 10 crore |  | nobody |  |
| note | long_text |  | 1000 |  | any time | The note is longer than 1,000 letters. |

| List |  |
|---|---|
| search | number, customer, amount |
| filters | document, payment, tax, customer, issued_at |
| sorts | -issued_at, due_at, total |
| default_sort | -issued_at |
| columns | number, issued_at, customer, total, balance, payment, tax |
| views | All, Drafts, Unpaid, Overdue, This month, Tax failed |
| bulk | send, remind, download, export |
| bulk_fail | The rest go through; failed rows are listed with the reason and Retry. |
| export | rows: selected, filtered, date range; what: invoices, lines, tax summary; formats: CSV, XLSX, PDF zip; big: over 50 rows comes by email; failure is emailed too |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | document, payment | -issued_at | tenant, document, payment, issued_at | 150 ms |
| overdue | payment | due_at | tenant, payment, due_at | 150 ms |
| one_customer | customer | -issued_at | tenant, customer, issued_at | 100 ms |
| by_total |  | total | tenant, total | 200 ms |
| tax_failed | tax | -issued_at | tenant, tax, issued_at | 100 ms |

## Who may do what

| Object | Owner | Accountant |
|---|---|---|
| Customer | * | view, create, edit, search, filter, sort, saved_view, columns, export, comment, attach, tag, history, link_related (all) |
| Invoice | * | view, create, edit, draft, search, filter, sort, saved_view, columns, bulk, export, duplicate, reverse, print_pdf, share_link, preview, comment, attach, tag, remind, schedule, history, link_related (all) |

## Screens

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Home | / | home | owner, accountant | New invoice | menu |  |  |  |
| Invoices | /invoices | list | owner, accountant | New invoice | home, menu | No invoices yet. Make your first one, it takes two minutes. | No invoice matches these filters. Clear them or widen the dates. |  |
| Write an invoice | /invoices/new | form | owner, accountant | Issue | invoices, home, invoice |  |  | Invoice INV-26-0007 is issued. Send it now or copy the link. |
| An invoice | /invoices/:id | detail | owner, accountant | Record payment | invoices, link |  |  |  |
| Customers | /customers | list | owner, accountant | New customer | home, menu | No customers yet. Add one or bring a list from Excel. | No customer matches. Try part of the name or the GSTIN. |  |
| Edit a customer | /customers/new | form | owner, accountant | Save | customers, customer, invoice_form |  |  | Saved. You can invoice this customer now. |
| A customer | /customers/:id | detail | owner, accountant | New invoice | customers, invoice |  |  |  |

| On every screen |  |
|---|---|
| loading | Grey rows in the final shape, at most a few seconds. |
| error | What failed in one sentence, a Retry button, typed text kept. |
| denied | Says who can give access, with their name. |
| read_only | A bar says the plan has stopped and what still works. |
| plan_locked | Shows the feature, what it needs, and the price. |
| big | 10,000 rows: pages of 50, count shown as 10,000+, filters stay fast. |
| not_found | Says it is gone or never existed, with a link to the list. |
| phone | One column, no sideways scroll, main action within thumb reach. |
| invalid | Summary on top, message at each field, shown on submit. |
| saving | Saving, then Saved, beside the button. |
| failed | Nothing is lost; the same button tries again. |
| leave | Unsaved changes: Save or Discard. |

## Journeys

**J1, owner, first hour:** send the first real invoice (at most 4 steps; Stripe, about 6 steps)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | home | invoice.create | a form with date, terms and number ready | opens again with the draft kept |
| 2 | invoice_form | customer.create | a small form inside the page | message at the field |
| 3 | invoice_form | invoice.issue | preview, then the number | says what is missing and where |

End: the customer gets the invoice and the owner sees Sent

**J2, owner, a mistake to fix:** correct an invoice sent with the wrong amount (at most 3 steps; Stripe credit note)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoices | invoice.search | the invoice by number | no match text |
| 2 | invoice | invoice.reverse | credit note with lines filled | says the amount is over the balance |

End: a credit note is linked and both papers are readable

**J3, accountant, month end:** hand over the month to the books (at most 3 steps; Shopify export)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoices | invoice.filter | This month | no match text |
| 2 | invoices | invoice.export | choice of rows, what and format | emailed with the reason |

End: a file with invoices, lines and tax summary

## Messages

| Message | When | To | By | Words | Can mute |
|---|---|---|---|---|---|
| invoice_sent | invoice.issue | customer contact | email, WhatsApp | Invoice {number} for {total} is due on {due}. Pay or download here. | false |
| invoice_voided | invoice.void | customer contact | email | Invoice {number} was cancelled. Nothing is due. | false |
| invoice_paid | invoice.record_full | owner | app, email | {customer} paid {total} for {number}. | true |
| tax_failed | invoice.portal_refused | accountant | app, email | The tax portal refused {number}: {reason}. Fix and retry. | false |
| overdue | time:due_at + 7 days | customer contact | email, WhatsApp | Invoice {number} is 7 days late. {balance} is due. | true |

## Rules

| Rule | Area | Text | Examples |
|---|---|---|---|
| R1 | money | Credit notes together never exceed the invoice total. | invoice 10,000, credit 6,000 then 5,000 → second refused, 4,000 left; invoice 10,000, credit 10,000 → allowed, balance 0 |
| R2 | tax | Same state: CGST plus SGST. Other state: IGST. | Gujarat to Gujarat, 1,000 at 18% → CGST 90, SGST 90; Gujarat to Maharashtra, 1,000 at 18% → IGST 180 |
| R3 | law | An e-invoice may be cancelled only within 24 hours of the portal answer. | 23 h 59 m later → cancel allowed; 24 h 1 m later → credit note only |

## Connections

| Connection | Area | When | What | Set up | Test | When broken | When off |
|---|---|---|---|---|---|---|---|
| signin | signin | now | phone code or email link; owner can require a second step | asked at sign up | code arrives in a minute | email link instead of phone | last owner cannot lose both |
| pay | payments | room | pay link by UPI and card; amounts recorded by hand until then |  |  |  |  |
| mail | messaging | now | email from the firm's name; WhatsApp after approval | verify the sender | send to yourself | the invoice shows not delivered with the reason | copy the link by hand |
| portal | accounting | now | e-invoice portal through a registered provider | GSTIN, user and password of the portal | dry run on the portal's test site | invoice waits in failed, accountant is told | invoices go without IRN, with a warning |
| move_in | move_in | now | customers and open invoices from Excel or Tally export |  |  |  |  |
| move_out | move_out | now | all data as CSV plus every PDF, asked from settings, sent by email |  |  |  |  |
| api | api | later | read and write API with keys; events for issued and paid |  |  |  |  |

## Running it

| Topic | Answer |
|---|---|
| settings | number format, terms, reminder days, logo and colours, e-invoice on or off |
| seed | 300 customers and 6,000 invoices in every state, two firms |
| support | find a firm, see its activity, resend an email, view as the firm with a log |
| events | first invoice issued, first payment recorded, export used, tax failed |
| rollout | five friendly firms, then invite only, then open |
| rollback | one command, tried before the first firm |

| product | Answer |
|---|---|
| home. Home or dashboard: what does each role see first, and can they change it? | now: money due, overdue and drafts; owner and accountant see the same |
| views. Other ways to see the main records: board, calendar, timeline, map, sheet? | no: a list is enough for two objects |
| quick_entry. Fastest way to add the most common record: one line, drag on a calendar, copy the last one, start and stop? | now: new invoice from home, last customer offered first |
| modes. Which ways of working does one firm choose between (strict or free entry, future dates, required fields)? | later: strict approval before issue for bigger firms |
| favourites. Recent and favourite records, reused in one press? | later: recent customers on the form only |
| search_all. One search over everything, with jump by number or id? | now: one box finds customers and invoices, a number jumps |
| keyboard. Keys and command menu for daily users? | later: save with Ctrl Enter is in, the rest waits |
| planning. Planning ahead: capacity, targets, budgets, forecasts? | no: this product does not forecast |
| time_off. Working days, holidays, absence: do they change any number or date here? | no: no date here depends on working days |
| teams. Teams or groups: who leads, who sees whose records? | no: firms have two to five people |
| custom_roles. Can a customer make roles and switch each permission? | later: two fixed roles are enough first |
| signin_company. Company sign-in (SAML, OpenID, LDAP), forced second step, sign-out of other devices? | later: phone or email code first |
| preferences. Each person's language, theme, time zone, date and number format, first day of week, landing page? | now: language of the product and date format per person |
| branding. Logo, colours, own domain, own sender address, templates they can edit? | now: logo, colours and number format on the paper |
| templates. Which papers, emails and records have templates a customer edits? | now: invoice email and reminder text can be edited |
| automation. Rules a customer sets: when this, then that? | later: reminders are the only rule now |
| recurring. What repeats by itself, and who is told when it fails? | later: monthly invoices are space only in this wave |
| reports. Which questions do people ask each week, month and year? One report each, with its filters. | now: sales by month, unpaid by age, tax summary |
| scheduled_report. Reports sent by email on a schedule? | later: month end report by email |
| public_page. What may an outsider see or do without an account? | now: an invoice page with download, says voided when void |
| portal. A place for the customer's customer? | later: one page per customer with all their papers |
| phone_app. Phone: web page, installed app, offline, camera, scan? | now: a good web page, no app in this wave |
| desktop. Browser extension, desktop app, email add-in, calendar link? | no: nothing to add on a desktop |
| external_sync. Which outside records are kept in step both ways (calendar, contacts, files, chat)? | later: Tally and Zoho Books |
| ai. Help by AI: draft, summarise, suggest, answer; who pays and who approves? | later: read a photo of an old invoice |
| languages. Languages and right-to-left of the product and of its papers? | now: English and Hindi, paper in either |
| many_companies. One person in several firms, one firm with several brands or branches? | room: one person may join several firms |
| audit_all. One log of everything, searchable, exportable, how long kept? | now: history on each record, one log for the owner |
| trash_all. One trash for everything: how long, who restores? | no: drafts are deleted, issued papers never |
| import_all. Moving in from each rival: which files, which fields are lost? | now: customers and open invoices from Excel or Tally |
| demo. Sample data a new user can try and remove? | later: a sample firm with papers in every state |
| help. Help inside the product, contact, status page, what is new? | now: help page, email, status page |
| plans. Plans, limits, trial end, upgrade, downgrade, unpaid: what still works? | now: after the trial all papers stay readable, new ones stop |
| self_host. Is it also installed by customers: install, update, backup, restore? | no: hosted by us only |
| admin_settings. Every switch a firm's admin can set, in groups? | now: number format, terms, reminder days, logo, e-invoice |
| privacy. A person asks for their data or its deletion: who does what, what must stay? | now: export and deletion request, tax papers stay by law |

| day one | Answer |
|---|---|
| D1. Where is the tenant key, including child tables? | tenant on every table and first in every index |
| D2. ID type, and is the human number separate? | UUID v7 ids; invoice number is separate |
| D3. Are taxes rows, not one column? | tax rows per line and per invoice |
| D4. Is price per list or channel, not on the product? | price lives on the invoice line; a price list comes later |
| D5. Which state tracks run side by side (payment, delivery, return)? | document, payment and tax run side by side |
| D6. Which documents are never edited after issue, and what reverses them? | issued invoices are never edited; credit notes reverse them |
| D7. Number series: per entity, per year, any gaps allowed? | per firm and financial year, no gaps, locked row |
| D8. Can an owner be a person, a team or a bot? | owner is a person now; the column can hold a team or bot |
| D9. View settings: per user, per place, shared? | saved views per person, owner may share |
| D10. Which limits live in settings, not in the schema? | terms, reminders, limits and number format are settings |
| D11. Where is space for custom fields, and will customers make their own objects? | one JSON column for custom fields; no customer-made objects |
| D12. Idempotency keys, outbox, UTC time, money in minor units, API version: decided? | idempotency key on writes, outbox table, UTC, paise, API version header |

| production | Answer |
|---|---|
| P1. Target ASVS level chosen (L1 minimum) and requirement IDs tracked as v5.0.0-x.y.z | ASVS L1, tracked by id |
| P2. Config and secrets come from environment, none in repo | secrets from environment only |
| P3. Tenant isolation tested: user A cannot read B's records by ID | test reads another firm's id and gets not found |
| P4. Server-side validation on every input | every input checked on the server |
| P5. Every action checked against role on the server, not only hidden in UI | every action checked on the server |
| P6. Automated backups exist | daily backup plus point in time |
| P7. A restore was performed into a clean environment and timed this quarter | restore tried every quarter, timed |
| P8. Deleted records recoverable for a stated period | trash for 30 days, invoices never |
| P9. Migrations run forward and are tested on a copy of production data | migrations run on a copy first |
| P10. One-command rollback, tried once | one command, tried |
| P11. Deploy does not need downtime or manual DB steps | rolling deploy, no manual step |
| P12. Admin tasks run as one-off scripts, not by hand in prod | scripts in the repo only |
| P13. Alert on errors and latency, with an owner | alerts on errors and slow pages, owner named |
| P14. End-to-end synthetic check of the main journey | hourly check issues a test invoice |
| P15. Logs go to a searchable store | logs searchable for 30 days |
| P16. Load test at expected peak | load test at 5 times year one |
| P17. Rate limits and timeouts on public endpoints | limits on sign in and public links |
| P18. Upload, export and page-size caps documented (e.g. 15 MB, 20,000) | file 10 MB, import 5,000 rows, export by email |
| P19. At least two instances for anything mission-critical | two instances |
| P20. Background jobs are retryable and idempotent | jobs safe to run twice |
| P21. Failed jobs are visible and replayable by support | failed jobs listed with retry |
| P22. Long exports run async and notify (email) | exports run as jobs and email the file |
| P23. User can export their data | data export in settings |
| P24. User can delete account and its data; effects stated before confirm | account deletion says what stays by law |
| P25. Personal data inventory and retention period written | list of personal data with periods |
| P26. India DPDP: rights handling and breach duties start staged over about 18 months from Nov 2025; exact dates and erasure timelines UNVERIFIED | DPDP duties reviewed by a lawyer first |
| P27. Staff can find a user, see their activity log, and impersonate with audit | support view with log |
| P28. Status/problem page and contact route exist | status page and help email |
| P29. Per-tenant or per-job cost is measured and a monthly budget alert exists | cost per firm measured, budget alert |
| P30. Free-tier or abuse path is capped | free plan limited to 20 invoices |

| flow | Answer |
|---|---|
| A1. Page title is the resource name; one primary "create" button top right; no button if creation is impossible. | yes |
| A2. Filter, sort and multi-select actions sit above the list; saved views include a locked "All" view plus rename/duplicate/delete. | yes |
| A3. Choose and state one mode: batch ("Apply") or live. Several filter categories are never hidden inside one menu. | yes |
| A4. Search input debounces about 250 ms; validation about 500 ms. | yes |
| A5. List has row checkboxes; selecting shows a bulk bar; selection survives paging; action asks for a reason where money moves. | yes |
| A6. Required marks use "(optional)" text, never asterisks; every question page has a Back link; ask each fact once per journey. | yes |
| A7. Submit button is never disabled to signal invalid input; Cmd/Ctrl+Enter submits from any control. | yes |
| A8. Error summary at top plus message at each field, summary links to the field; shown on submit, not on blur. | yes |
| A9. Contrast: PJ lets real-time validation run, GOV forbids on-blur validation. Pick one and write it down. | no: checked on submit only, so no real-time rule is needed |
| A10. One sentence, says what is wrong and the next step, no blame; removed when input becomes valid. | yes |
| A11. Unsaved changes trigger a save/discard bar with text "Unsaved changes" and verb-only buttons (Save, Discard). One form per page. | yes |
| A12. Auto-save shows inline "Saving…" then "Change saved", fires on blur or 3 s after last key, and a failed save keeps an alert with retry until success. Never auto-save a whole multi-field form. | yes |
| A13. Leaving with unsaved changes warns. | yes |
| A14. Hard-to-undo delete uses a modal with a danger-styled confirm button and a cancel that names what is kept; deleting a container with children requires typing its name. | yes |
| A15. If an action is reversible, offer undo (Linear: Cmd/Ctrl+Z on moves) and state what undo does not restore. | yes |
| A16. Empty state has one primary action, an action-oriented title (about 5 words, no period), a positive tone, and analytics on its views. | yes |
| A17. "No results" state differs from "nothing yet" and from "system error"; no-results explains how to adjust search or filters. | yes |
| A18. Skeletons only on containers and data components, only for seconds; spinner for whole-page processing; more than a few seconds uses a progress bar. | yes |
| A22. End of a transaction has a confirmation page with reference, next step, and a URL the user can reopen. | yes |
| A23. Multi-step flows end with a check-answers page with a "Change" link per section; Continue returns to it. | yes |
| A25. "Not eligible / not allowed" is a page with next steps, not a validation error. | yes |

## Risks to test first

| Assumption | Cheap test | Result |
|---|---|---|
| Small firms will give portal passwords to us | ask ten firms before building | open |

## Wide list: where every requirement landed

| Id | Requirement | When | Where or why |
|---|---|---|---|
| W001 | Make an invoice from the last customer in one press | now | product:quick_entry, invoice.create |
| W002 | Filter invoices by tax state | now | invoice.tax |
| W003 | Export the tax summary of a month for the accountant | now | invoice.export |
| W004 | Correct an issued invoice with a credit note | now | invoice.reverse, rule:R1 |
| W005 | Tell the accountant when the tax portal refuses | now | message:tax_failed |
| W006 | Merge two copies of one customer | now | customer.merge |
| W007 | Show the firm's logo on the paper | now | setting:logo |
| W008 | Monthly invoices that make themselves | later | space only, after the first firms ask |
| W009 | Forecast of next quarter's income | no | not the job of this product |

## Sources

| Id | Product | What it shows | Link |
|---|---|---|---|
| stripe-001 | Stripe | Finalising freezes money fields; later only memo and metadata change | https://docs.stripe.com/invoicing/overview |
| stripe-002 | Stripe | Credit notes together can never be more than the invoice | https://docs.stripe.com/invoicing/dashboard/credit-notes |
| stripe-003 | Stripe | A voided invoice keeps its page and says voided | https://docs.stripe.com/invoicing/overview |
| stripe-004 | Stripe | Create and send an invoice in about six steps; a draft saves itself | https://docs.stripe.com/invoicing/dashboard |
| stripe-005 | Stripe | Search shows top results while typing and an id opens the object | https://docs.stripe.com/dashboard/search |
| stripe-006 | Stripe | Team invites carry roles and expire in 10 days | https://docs.stripe.com/get-started/account/teams |
| erp-001 | ERPNext | Only 21 of 159 fields can change after submit | https://github.com/frappe/erpnext/blob/develop/erpnext/accounts/doctype/sales_invoice/sales_invoice.json |
| erp-002 | ERPNext | A return is made against the original invoice | https://docs.frappe.io/erpnext/sales-invoice |
| ic-001 | India Compliance | E-invoice cancel only within 24 hours, then a credit note | https://github.com/resilient-tech/india-compliance |
| shop-001 | Shopify | Export asks which rows; up to 50 download now, more are emailed, failure is emailed | https://help.shopify.com/en/manual/fulfillment/managing-orders/exporting-orders |
| twenty-001 | Twenty | Import in seven steps with bad rows marked, fixable or skippable | https://github.com/twentyhq/twenty |
| twenty-002 | Twenty | Merge records button joins duplicates | https://github.com/twentyhq/twenty/releases |
| ninja-001 | Invoice Ninja | People ask for a custom PDF file name (21 votes) | https://github.com/invoiceninja/invoiceninja/issues/7119 |
| ninja-002 | Invoice Ninja | Reminders before and after the due date, stopped once paid | https://invoiceninja.github.io/ |
