# Invoices for Indian service firms: tax

One module of the PRD. The front book is ../PRD.md.

### E-invoice Record

| Can do | How |
|---|---|
| create | Made by the system at issue when the firm is flagged and the supply qualifies; a person only presses Generate, Retry or Cancel IRN on the invoice or credit note. |
| view | Header with state and amount due, lines and tax, payments, then timeline. |
| search | IRN, document number, customer name. |
| filter | E-invoice state, call state, money counted, days left in the 30-day window. |
| sort | Days left first, then newest; both ways. |
| saved view | Named filters like Unpaid, Overdue, This month, kept per person or shared. |
| columns | Pick columns such as number, customer, due, balance; choice is kept. |
| bulk | Retry the selected failed or stuck records; each runs alone and the rest are listed with the reason. |
| export | CSV for the accountant by date range; large ranges are emailed, with tax columns. |
| reverse | Cancel IRN with a coded reason, only within 24 hours of generation, only if not in a filed return and no payment or credit note counts against the invoice; after that the answer is a credit note. |
| preview | Shows the payload and the checks before sending: legal name 100, address line 100, city 3 to 50, item description 300 characters, place of supply, a later date warning. |
| comment | Internal notes on the timeline; customer-visible notes are a separate field. |
| attach | Supporting files sent with or kept beside the document, with size limit shown. |
| remind | Automatic reminders before and after due date, with a stop once paid. |
| schedule | Send later, and repeat monthly as a recurring invoice that makes drafts or issues. |
| history | Created, sent, viewed, paid, voided, with who and when; cannot be edited. |
| link related | Shows the source quote or order, payments, credit notes and the customer. |
| notify | Customer email on send and on payment; staff alert on paid, failed, viewed or overdue. |

**room:** approve

**later:** group; assign (Owner and accountants all get alerts in wave 1.); follow; api (Portal records are not opened to other software in wave 1.); webhook (No portal events are sent out in wave 1; owners get email alerts.)

**no:** edit (Nobody edits it: IRN, acknowledgement and signed QR come from the portal and are written once; a change is a new attempt row.); draft (A record exists from issue; there is no half-made record.); import (Opening-balance invoices are migrated and are not e-invoiced; no IRN is imported.); delete (Never deleted; attempts are the evidence.); archive (Cancelled records stay in the list; filters hide them.); restore (Nothing is archived or removed.); duplicate (A copy would copy an IRN; a new document gets its own record.); version (Each attempt is its own row; the portal's signed answer is never altered.); print pdf (The IRN, acknowledgement and signed QR print on the invoice or credit note PDF, a new PDF version, not a separate file.); share link (Never shared; the customer sees the IRN on the document.); tag (No free tags are offered in wave 1.); custom fields (Fixed by the portal.); merge

| Question | Answer |
|---|---|
| freeze | The record is append-only: every portal attempt is a row with time, request, answer and error; IRN, ack number, ack date and signed JSON and QR are written once and never edited. |
| number | No number of its own; identity is the IRN of 64 hex characters. The invoice or credit note number must start with a letter or digit 1 to 9, use letters, digits, slash and hyphen, and stay within 16 characters, or the portal rejects it. |
| fix | A wrong IRN is cancelled within 24 hours with a coded reason; later only a credit note. A refused record is retried; data inside the frozen invoice cannot be edited, so a document refused for its own data is voided and re-created. |
| money | Sent exactly as stored: INR paise per line, the round-off line, and for foreign invoices the INR equivalents at the stored rate; the portal's total is never recomputed. |
| paid | Payment does not depend on the portal: a refused or pending record leaves the invoice payable. The payment track here only mirrors whether money counts, to stop an IRN cancel. |
| late | For turnover of Rs 10 crore or more the IRN must be reported within 30 days of the invoice date; a daily job lists records with 3 or fewer days left and later generation is blocked with the reason; creating it on a later date than the invoice date is warned. |
| law | Applies when turnover crossed Rs 5 crore in any year since 2017-18; B2B, export, SEZ and deemed export only, never B2C; export and SEZ carry their supply type in the request; the IRN, ack number, ack date and signed QR print on the document. |
| send | Generation is a queued job, never inline: the invoice is issued and payable first. 5 automatic attempts, then a visible stuck state; Retry by hand any number of times. |
| secret | Provider keys are stored encrypted, never returned to the browser and never written in logs; rotating is by replacing, with no downtime because calls read the newest key. |
| scope | Only what is needed: generate an IRN, cancel an IRN, and fetch an IRN by document details. Nothing else is asked of the provider. |
| health | Each record shows its call state and attempt count on the invoice; owners get an alert on each refusal and when attempts end, and the list filters failed and stuck. |
| direction | Out go our document data; in come IRN, ack and QR. If the portal says the IRN is a duplicate we compare the document number, date, value and buyer GSTIN in the answer with the stored invoice; only when all match do we store the IRN and mark it generated, and any difference marks it failed with the reason, because a number reused after a restore must never print another document's QR. |
| retry | After a timeout we first ask the portal by document details and reuse any IRN found, before any new call; then 5 automatic attempts with growing pauses; then stuck; manual retry has no limit. |
| gone | If the provider sign-in is revoked calls stop with a plain message, invoices stay issued and payable, owners are alerted and the 30-day warnings continue. |
| limits | Field limits are checked when the invoice is saved so a bad length never reaches the portal; the provider's own rate limit is handled by the queue. |
| test | One provider adapter. A fake adapter with modes succeed, fail and fail 1 in 5 serves tests and the sandbox; its records are marked Test and its IRNs never print on a PDF. The real flag and threshold stay on. |

**States, document:** none (start), generated, failed, cancelled (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| portal_ok | none, failed | generated | system | portal returned an IRN or says it already exists | IRN, ack number, ack date and signed QR stored; PDF version added | cancel_irn | none |
| portal_refused | none, failed | failed | system | portal refused or 5 automatic tries ended | code and message shown on the document, invoice stays payable | retry from the call track | einvoice_failed_alert |
| cancel_irn | generated | cancelled | owner, accountant | within 24 hours, no counted payment or credit note, coded reason | cancelled IRN is never reused; the document can only be voided | none: a cancelled IRN cannot come back, make a new document | none |
| close_unused | none, failed | cancelled | system | the invoice or credit note was voided before any IRN | record closed, due-by warning stops | none: the document is void | none |

**States, payment:** no_money (start), money_counted

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| money_arrives | no_money | money_counted | system | a payment, TDS, applied credit or write-off now counts on the invoice | Cancel IRN is disabled with the reason | money_leaves | none |
| money_leaves | money_counted | no_money | system | nothing counts any more | Cancel IRN may be offered again if still within 24 hours | money_arrives | none |

**States, connection:** idle (start), calling, unknown, waiting_retry, stuck

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| call_portal | idle, stuck | calling | owner, accountant, system | the document is issued, the 30-day window is open, firm is flagged | queued call to the one provider adapter | none: wait for the answer | none |
| portal_answers | calling | idle | system | the portal gave a yes or a no | the document track records which | call_portal | none |
| portal_times_out | calling | unknown | system | no answer in time | no new call until the portal is asked by document details | found_out | none |
| found_out | unknown | idle | system | lookup by document details answered | IRN reused or confirmed missing | call_portal | none |
| transient_fail | calling | waiting_retry | system | network or provider error and fewer than 5 tries | pause grows, attempt count shown on the document | auto_retry | none |
| auto_retry | waiting_retry | calling | system | pause is over | next attempt | none: the answer decides | none |
| give_up | waiting_retry, unknown | stuck | system | 5 tries used or the lookup also failed | owner-visible stuck state and an alert | call_portal | einvoice_failed_alert |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| document | link | yes |  |  | nobody; set at creation to one invoice or one credit note | A record belongs to one invoice or credit note. |
| irn | text |  | 64 |  | nobody; written by the portal answer |  |
| ack_no | text |  | 20 |  | nobody; written by the portal answer |  |
| ack_at | date |  |  |  | nobody; written by the portal answer |  |
| signed_qr | long_text |  | 20000 |  | nobody; written by the portal answer |  |
| supply_type | choice | yes |  |  | nobody; copied from the document |  |
| due_by | date |  |  |  | nobody; invoice date plus 30 days |  |
| attempts | list | yes | 500 |  | nobody; one row added per attempt |  |
| error_message | text |  | 500 |  | nobody; last portal message |  |
| cancel_reason | choice |  |  |  | owner or accountant when cancelling an IRN | Choose a coded reason; it is required to cancel. |
| mode | choice | yes |  | live | nobody; test for the fake adapter and sandbox |  |

| List |  |
|---|---|
| search | irn, document_number, customer |
| filters | document, payment, connection, due_by |
| sorts | due_by, created_at |
| default_sort | due_by |
| columns | document_number, customer, document, connection, attempts, due_by |
| views | All, Failed, Stuck, Due soon, Cancelled |
| bulk | retry |
| bulk_fail | Each record retries alone; the rest go through and failed ones are listed with the reason and a Retry. |
| export | rows: selected, filtered, date range; what: e-invoice records, attempts; formats: CSV; big: Over 5,000 rows runs as an export job and the link comes by email and lives 7 days. |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| due_soon | document, payment, connection | due_by | tenant, document, payment, connection, due_by | 150 ms |
| by_created |  | created_at | tenant, created_at | 150 ms |

### LUT

| Can do | How |
|---|---|
| create | Owner or accountant adds the LUT with number, ARN and valid dates. An export under LUT is refused until a LUT covers the invoice date. |
| edit | Only the owner edits. Once any invoice used it, number and ARN lock; the end date can only be extended. |
| view | Value, where it is used, and when and by whom it last changed. |
| sort | Manual order where order shows to users, otherwise name. |
| delete | Only while no invoice used it; otherwise it can only expire. |
| duplicate | Renew copies the last LUT into the next financial year with new dates and a blank number and ARN, which must be typed. |
| version | Money-affecting settings keep dated values so old documents compute the same. |
| preview | Templates and tax rules show a sample result before saving. |
| remind | A banner and an email warn 30 days before the end date and again when it ends. |
| schedule | A new value can start on a set date; old records keep the old one. |
| history | Who changed which setting, from what to what, and when. |
| link related | Shows what uses it, such as customers on a plan or products in a category. |

**later:** draft; search; filter; bulk; import; export; approve; merge; notify; api (No outside software reads LUTs.); webhook (LUT events come with the API.)

**no:** group; saved view; columns; archive (An expired LUT stays listed as expired; there is nothing to hide.); restore (An expired LUT is not revived; a new one is added for the next period.); reverse; print pdf; share link; assign; comment; attach (Only number, ARN and dates are kept; the filed form is not stored.); tag; follow; custom fields

| Question | Answer |
|---|---|
| scope | One LUT per firm per financial year, with number, valid from, valid to and ARN. Wave 1 has one GSTIN; several are room. |
| used | An export invoice under LUT reads the LUT covering its date, copies the number onto the invoice and prints it. The invoice shows exactly the wording of Rule 46 for export under bond or letter of undertaking without payment of integrated tax, with zero tax on every line. |
| default | The LUT whose dates cover the invoice date is used. If none covers it, the export is refused with the reason and the invoice can still be issued as an export with IGST. |
| effective | From valid-from to valid-to by invoice date. An invoice dated before the valid-from date, or after the end, cannot use it. |
| order | Newest financial year first. |
| who | Owner and accountant add one. Only the owner edits or deletes it. Staff and viewer read the number only. |
| limit | One valid LUT per firm per financial year at a time; the number is up to 40 characters. |

**States, lifecycle:** valid (start), expired (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| warn_expiry | valid | valid | system | 30 days before the valid-to date, once | banner on the firm home and on export invoices | none: it is only a notice | lut_expiring |
| expire | valid | expired | system | the valid-to date has passed in IST | export invoices without tax are refused from the next day | none: add a new LUT | lut_expired |
| withdraw | valid | expired | owner | reason written; the LUT was cancelled or is wrong | same as expiry; invoices already issued keep their printed number | none: add a new LUT | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| number | text | yes | 40 |  | owner; locked once an invoice used it | Enter the LUT number, up to 40 characters. |
| arn | text | yes | 40 |  | owner; locked once an invoice used it | Enter the ARN from the filed application. |
| fy | text | yes | 5 |  | nobody |  |
| valid_from | date | yes |  |  | owner; locked once an invoice used it | Choose the date the LUT starts. |
| valid_to | date | yes |  |  | owner; only later once an invoice used it | The end date must be after the start date and not later than 31 March of that financial year. |

| List |  |
|---|---|
| sorts | -valid_to |
| default_sort | -valid_to |
| columns | fy, number, valid_from, valid_to, lifecycle |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | lifecycle | -valid_to | tenant, lifecycle, valid_to | 50 ms |
| covering |  | -valid_to | tenant, valid_to | 50 ms |

### Number Series

| Can do | How |
|---|---|
| create | The system opens each series on the first issue of a financial year and at the 1 April rollover. The owner does not add series in wave 1; a second series is room. |
| edit | The owner may change the prefix only while no document in the series is issued in this financial year. The next number can be raised only before the first document of the financial year exists in the series, never below the last used and never afterwards, so a hole can never open; the prefix may not equal another document type's prefix (R35). |
| view | Value, where it is used, and when and by whom it last changed. |
| sort | Manual order where order shows to users, otherwise name. |
| version | Money-affecting settings keep dated values so old documents compute the same. |
| preview | Templates and tax rules show a sample result before saving. |
| schedule | The only date is the automatic rollover at 00:05 IST on 1 April, which opens new counters at 00001 and keeps pending drafts. |
| history | Every change to a prefix or next number records who, when, old and new, and the system records each rollover. |
| link related | Shows what uses it, such as customers on a plan or products in a category. |

**later:** draft; search; filter; bulk; import; export; approve; remind; merge; notify; api (No outside software sets numbers.); webhook (Series events come with the API.)

**no:** group; saved view; columns; delete (A series is closed, never deleted, so the numbers in use stay explainable.); archive (A closed series stays visible as it is.); restore (A closed financial year is not reopened; the next year has its own series.); duplicate (A second counter with the same keys would break the unique rule.); reverse; print pdf; share link; assign; comment; attach; tag; follow; custom fields

| Question | Answer |
|---|---|
| scope | One counter per firm, GSTIN, document type, prefix and financial year. The database enforces that the same number cannot be stored twice in one series. Wave 1 has one GSTIN and room for more. |
| used | Invoice (plain Invoice, Tax Invoice and Bill of Supply share one counter), credit note, receipt, quote, proforma and refund each have their own series. Their prefixes are INV, CN, REC, QT, PI and REF. |
| default | Prefix defaults are INV, CN, REC, QT, PI and REF. Only the owner changes a prefix, before the first number of the year is taken. |
| effective | The year runs 1 April to 31 March by IST issue date and the counter starts at 00001 each year. A new next number applies to the next issue only. |
| order | The list shows newest year first, then document type. Nobody reorders it. |
| who | Only the owner changes prefix or next number. Accountant and viewer read. Staff and client do not see it. Support sees it only through approved access. |
| limit | A prefix is 1 to 4 uppercase letters or digits and the whole number is at most 16 characters, in the form PREFIX/YY-YY/NNNNN with a 5-digit sequence. |

**States, lifecycle:** open (start), closed (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| close_series | open | closed | system, owner | the financial year has ended and the period lock date is past it, or the owner confirms the firm has moved to a new GSTIN or prefix and a replacement is open | no new number is taken from it; its documents stay readable | none: a closed series is not reopened; the next one carries on | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| doc_type | choice | yes |  |  | nobody after the first number | Choose the document type: invoice, credit note, receipt, quote, proforma or refund. |
| prefix | text | yes | 4 |  | owner, only while no document of this series is issued in this financial year | A prefix is 1 to 4 capital letters or digits. It cannot change after a number was issued this year. |
| fy | text | yes | 5 |  | nobody |  |
| gstin | text |  | 15 |  | nobody |  |
| next_number | number | yes | 99999 |  | owner; up only and never below the last number used | The next number must be above the last one used and at most 99999. You can lower it until the first document of this year is issued. |
| last_number | number |  | 99999 |  | nobody |  |
| last_issued_on | date |  |  |  | nobody |  |

| List |  |
|---|---|
| filters | lifecycle, doc_type, fy |
| sorts | -fy, doc_type |
| default_sort | -fy |
| columns | doc_type, prefix, fy, next_number, last_number, last_issued_on |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| by_year | lifecycle | -fy | tenant, lifecycle, fy | 50 ms |
| by_type | lifecycle, doc_type | -fy | tenant, lifecycle, doc_type, fy | 50 ms |
| by_type_name | doc_type | doc_type | tenant, doc_type | 50 ms |
| for_year | fy | doc_type | tenant, fy, doc_type | 50 ms |

### Tax Master

| Can do | How |
|---|---|
| create | Product support adds a dated row or a whole new version of a table. Firms cannot add rows. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | One box finds by name, email, phone, code or id; an exact id jumps to the record. |
| filter | Status, tag, owner, created date and one or two business facts such as city or stock. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| duplicate | Support copies a table version as the start of the next one, then changes the dates and values. |
| version | Money-affecting settings keep dated values so old documents compute the same. |
| preview | Templates and tax rules show a sample result before saving. |
| schedule | A new value can start on a set date; old records keep the old one. |
| history | Who changed which field, from what, to what, and when. |
| link related | Shows its documents, payments and tickets with totals, each one opening in place. |

**room:** draft

**later:** group; saved view; columns; import (Loading the official SAC list from a file is a support task done by script for now.); export (Firms see the tables on screen; a download comes when asked.); print pdf; assign; approve; follow; remind; notify; api (Reading tables by software comes with the API.); webhook (Rate change events come with the API.)

**no:** edit (A published row is never edited in place. A change is a new row with its own effective date, so old documents compute the same.); bulk (Rows are published one table version at a time.); delete (Rows are closed by a newer row, never deleted.); archive (A superseded row stays readable as it is; there is nothing to put away.); restore (Nothing is archived, so nothing returns; a withdrawn scheduled row goes back to draft.); reverse (A wrong row is fixed by publishing a correcting row, never by taking one back after it is live.); share link; comment (The source field says why the row exists.); attach (The notification number and date sit in the source field; no files.); tag (Tables are structure, not things to label.); custom fields (No firm adds fields to a product table.); merge (Two rows for one code and date would be a mistake, so the second is refused.)

| Question | Answer |
|---|---|
| identity | One row is one code in one table from one effective date. The same table, code and effective date twice is refused. |
| snapshot | At issue a line copies its rate, SAC, description and the row used. A payment copies the TDS section serial, old alias and rate. Later rows never touch them. |
| remove | Rows are never deleted. A newer row closes the old one by setting its end date. |
| owner | The product owns it and support staff publish it. Every role in a firm reads it; no firm role edits it; a client never sees it. |
| contacts | One row holds one code with its old aliases, such as the earlier TDS section number. There are no addresses or contacts. |
| code | The code is the identity and is kept as text so leading zeros stay: SAC digits, the Income-tax Act 2025 section 393(1) serial number for TDS, the two-digit GST state code. |
| inactive | A row past its end date stays readable and cannot be picked for a date of supply after it ends. Old documents still show it. |
| scope | One table for the whole product; every firm sees the same rows. |
| used | Every issued invoice and payment points to the row it used. A change adds a row and leaves every issued document as it was. |
| default | New lines start at 18 percent. A firm cannot change the default; only support can. |
| effective | A row applies by date of supply. Drafts saved earlier are rechecked at issue, and the issue screen shows old and new tax and needs a click. |
| order | Rates by value, SAC by code, TDS by serial number, states by GST code. Firms cannot reorder. |
| who | Support publishes. Owner, accountant, staff and viewer read it through pickers. |
| limit | GST rates are 0, 0.25, 3, 5, 18 and 40 percent. SAC is 4, 6 or 8 digits, with the firm's turnover band setting the minimum. There is no count limit per table. |

**States, lifecycle:** draft (start), scheduled, current, superseded (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| publish | draft | scheduled | support | effective date is today or later, the source note is filled, and no row for the same table, code and date exists. a second support person has approved the row, and the effective date is at least 24 hours ahead unless both mark it a correction | firms using the code are told before the date. the issue screen shows 'rate changed this week' for a code whose rate changed in the last 7 days | withdraw | rate_change_notice |
| withdraw | scheduled | draft | support | the effective date has not arrived | the row stops being scheduled | publish | none |
| go_live | scheduled | current | system | the effective date has arrived in IST | new documents use it by date of supply | none: a live row is corrected by a new row | none |
| supersede | current | superseded | system | a newer row for the same code is now live | end date is set to the day before the newer row | none: history stays as it was | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| table | choice | yes |  |  | support, while draft | Choose the table: GST rate, SAC, TDS section, threshold or state code. |
| code | text | yes | 12 |  | support, while draft | Enter the code. SAC is 4, 6 or 8 digits and TDS uses the 393(1) serial. |
| name | text | yes | 200 |  | support, while draft | Enter the name or description, up to 200 letters. |
| alias | text |  | 40 |  | support, while draft | The old name or number, such as the earlier TDS section, up to 40 characters. |
| rate | number |  | 100 |  | support, while draft | A rate is a percentage from 0 to 100 with up to 2 decimals. |
| threshold | money |  | 99999999999 |  | support, while draft | A threshold is a rupee amount; for yearly limits it is per financial year. |
| effective_from | date | yes |  |  | support, while draft | Choose the date the row starts. It cannot be earlier than today unless the row corrects an earlier one. |
| effective_to | date |  |  |  | nobody |  |
| source | text | yes | 200 |  | support, while draft | Name the notification or Act section this row follows. |

| List |  |
|---|---|
| search | code, name, alias |
| filters | lifecycle, table |
| sorts | code, -effective_from |
| default_sort | code |
| columns | table, code, name, rate, effective_from, effective_to |
| page | 50 |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| E-invoices | /e-invoices | list | owner, accountant | Retry failed | menu, home, invoice | Nothing waiting. E-invoices appear here when your turnover needs them. | No e-invoice matches. Try Failed or Due soon. |  |
| Tax, numbers and period lock | /settings/tax | settings | owner, accountant | Save | settings, month_end |  |  |  |
| Tax rates and codes | /tax-tables | list | owner, accountant, staff, viewer, support | Search codes | settings, invoice_form, support_console | No rows yet. Support publishes GST rates, SAC codes and TDS sections here. | No code matches. Try the SAC number or a word from the service. |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| einvoice_failed_alert | einvoice.portal_refused | owner, accountant | email, app | The tax portal refused the e-invoice for {number}: {reason}. The document stays issued and payable. Fix the cause and press Retry; the 30-day window runs to {last_day}. |
| lut_expiring | lut.warn_expiry | owner, accountant | email, app | LUT {number} ends on {end_date}. Export invoices without tax are refused after that day. Add the next LUT before then. |
| lut_expired | lut.expire | owner, accountant | email, app | LUT {number} ended on {end_date}. Export invoices without tax are refused from today. Add the new LUT to carry on. |
| rate_change_notice | rate_master.publish | owner, accountant | email, app | The rate for {code} changes from {old_rate} to {new_rate} on {effective_date}. Invoices dated on or after that day use the new rate. Check your saved services that use this code. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A009 | Owner can set the next invoice number for a series during onboarding or in settings, only upward and only before any document in that series exists this year. | now | number_series.next_number |
| A023 | A proforma invoice has its own series PI/YY-YY/NNNNN, prints 'Proforma, not a tax invoice', creates no tax liability and is left out of GST registers; it converts to a tax invoice draft once, then locks as Converted and links the invoice. | now | number_series.doc_type |
| A047 | Database enforces unique (firm, document type, series, FY, sequence); a second insert of the same number fails at the database, not only in code. | now | number_series.scope |
| A059 | LUT record per firm per FY: LUT number, valid-from, valid-to and ARN; export invoices under LUT read it and print its number. | now | lut.number, lut.valid_from, lut.valid_to, lut.arn |
| A060 | GST rates and SAC master are effective-dated tables; an invoice uses the rate in force on its date of supply, never a hard-coded list. | now | rate_master.effective, rate_master.used |
| A061 | State list carries GST codes including 38 Ladakh and 97 Other Territory, and a foreign option for exports (the portal code must be confirmed); 99 Centre Jurisdiction is not offered for customers. | now | rate_master.code |
| A073 | Invoice for an unregistered recipient with taxable value of Rs 50,000 or more requires recipient name, address and state; below it, state only. | now | rate_master.threshold |
| A077 | Invoice number must start with a letter or digit 1 to 9 and use only letters, digits, slash and hyphen, or the e-invoice portal rejects it. | now | number_series.prefix |
| A082 | An export under LUT prints exactly "SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX", recipient name and address, country of destination, and tax of zero on every line; the LUT number prints too, as our choice. | now | lut.used |
| A084 | Export under LUT is refused when no LUT is recorded for the FY of the invoice date or when the stored LUT has expired. | now | lut.expire, lut.used |
| A086 | Export and SEZ invoices of e-invoice firms carry the matching e-invoice supply type (export or SEZ, with or without payment) in the IRN request. | now | einvoice.supply_type |
| A091 | Registration threshold tracker warns the owner when an unregistered firm's year turnover nears Rs 20 lakh (Rs 10 lakh in special-category states). | now | rate_master.threshold |
| A096 | TDS on fees is stored by section 393(1) serial number of the Income-tax Act 2025 for payments from 1 April 2026 (Sl.6(iii) old 194J, Sl.6(i) old 194C), shown with the old number as an alias; the user can type another rate. | now | rate_master.alias, rate_master.code |
| A098 | The TDS table holds section 393(1) serial number, old alias, rate and yearly threshold with effective dates; the product owner edits it, never a firm. Fees threshold is Rs 50,000. | now | rate_master.rate, rate_master.threshold |
| A104 | E-invoice applies when the firm's turnover crossed Rs 5 crore in any year since 2017-18; the firm profile stores that flag. | now | rate_master.threshold, einvoice.create |
| A105 | E-invoice must be reported within 30 days of invoice date for firms with turnover Rs 10 crore or more; generation after that is blocked with a reason. | now | einvoice.due_by |
| A106 | IRN cancellation is allowed only within 24 hours of generation and only if the invoice is not yet in a filed return; reason is mandatory. | now | einvoice.cancel_irn |
| A109 | E-invoice documents print the IRN, acknowledgement number and date, and the signed QR code returned by the portal. | now | einvoice.signed_qr |
| A110 | E-invoice data limits apply on save for e-invoice firms: legal name 100 characters, address line 100, city 3 to 50, item description 300. | now | einvoice.preview |
| A111 | HSN or SAC digits depend on turnover: 4 digits up to Rs 5 crore, 6 digits above; the firm's turnover band sets the minimum. | now | rate_master.limit |
| A112 | SAC field validates against the official code master and shows its description; unknown codes are refused, with a search-by-words picker. | now | rate_master.code |
| A113 | A Council rate or SAC change takes effect by date of supply; drafts saved earlier are rechecked at issue, and the issue screen shows old and new tax and needs a click before issuing. | now | rate_master.effective, rate_master.go_live |
| A120 | A cash receipt that would reach Rs 2,00,000 from one person in a day, for one transaction, or for one event is blocked with the warning of section 186 of the Income-tax Act 2025 (old 269ST). | now | rate_master.threshold |
| A122 | B2C inter-state invoices above Rs 1 lakh are reported invoice-wise (B2CL); smaller ones fall in state-wise summary; register tags each document. | now | rate_master.threshold |
| A147 | E-invoice states add cancelled to none, generated, failed; cancelled IRN cannot be reused and the invoice then needs a credit note or void. | now | einvoice.cancel_irn, einvoice.close_unused |
| A149 | Issuing at 00:30 IST on 1 April uses the new FY number even though UTC is still 31 March. | now | number_series.effective |
| A153 | E-invoice request times out after the portal accepted it; before retrying the app fetches the IRN by document details and reuses it. | now | einvoice.found_out, einvoice.retry |
| A154 | Portal says duplicate IRN: the app stores the IRN it returns and marks the invoice generated instead of showing failure. | now | einvoice.portal_ok |
| A168 | Database failover mid-issue: the number is either committed with the invoice or not at all, and a retry cannot make a second invoice. | now | number_series.scope |
| A215 | Owner gets alerts for e-invoice failure, trial ending in 7 and 1 days, and plan limit at 80 and 100 percent; LUT expiry 30 days ahead. | now | lut.warn_expiry, einvoice.health |
| A228 | A nightly integrity job checks that stored totals equal a recomputation from lines, balances equal payments plus credits, allocations never exceed payments, counters match the highest issued number with gaps listed, and stored PDF hashes equal their files, and alerts engineers on any difference. | now | number_series.last_number |
| A229 | Daily job checks e-invoice window: documents near 30 days without an IRN are listed to the owner. | now | einvoice.due_by |
| A237 | FY rollover job runs on 1 April 00:05 IST, creates new counters at 00001, and does not reset any pending draft. | now | number_series.schedule, number_series.close_series |
| A239 | PDF and e-invoice calls run as queued jobs with a retry limit of 5 and an owner-visible failed state, never inline in a user request. | now | einvoice.send, einvoice.auto_retry |
| A242 | Migrated invoices keep their original numbers even if longer or differently formatted, up to 16 characters, never touch the counters, and a number that clashes with an existing one in the same series is rejected. | now | number_series.next_number |
| B184 | Creating an e-invoice on a later date than the invoice date is warned, since numbers and dates then differ from the portal record. | now | einvoice.preview |
| B187 | Export of services uses place of supply 96 Other Countries with a check that no state code is used for a foreign customer. | now | rate_master.code |
| D001 | Quote numbers use series QT/YY-YY/NNNNN, gapless per firm, assigned when first sent; the invoice counter is never touched by quotes. | now | number_series.doc_type |
| D093 | A refund of customer credit records an amount up to the credit balance, date, mode, reference and bank account, is numbered REF/YY-YY/NNNNN without gaps, and two refunds at once can never exceed the balance. | now | number_series.doc_type |
| D152 | When a line rate differs from the SAC's standard rate the form shows a visible warning that the invoice will go out with that rate. | now | rate_master.rate |
| D219 | State names and old spellings (Orissa, Pondicherry) map to the GST state list; unmapped values stop that row with the value shown. | now | rate_master.code |
| D293 | Numbering settings show per series the next number, last issued number and date, and the year; the next number moves only upward, as A009 allows. | now | number_series.next_number, number_series.last_number |
| W017 | The financial year runs 1 April to 31 March by issue date and is labelled YY-YY, for example 26-27 for 1 April 2026 to 31 March 2027. | now | number_series.fy |
| W018 | Invoice number format is PREFIX/YY-YY/NNNNN, for example INV/26-27/00001, with a prefix of 1 to 4 characters and a 5-digit sequence, so no number exceeds 16 characters. | now | number_series.prefix, number_series.limit |
| W019 | An invoice number is assigned only when the invoice is issued, from a counter per firm, prefix and financial year that starts at 00001 each year and adds 1 per issue. | now | number_series.scope |
| W020 | Invoice numbers have no gaps: deleting a draft or a failed issue attempt never uses a number, and two simultaneous issues never receive the same number. | now | number_series.scope |
| W024 | When the firm has a GSTIN, every line needs an HSN or SAC code of 4, 6 or 8 digits, and the minimum digits follow the firm's turnover band (4 digits up to Rs 5 crore, 6 above). | now | rate_master.limit |
| W025 | A line tax rate must be one of 0, 0.25, 3, 5, 18 or 40 percent, with 18 percent as the default for new lines. | now | rate_master.limit, rate_master.rate |
| W045 | With e-invoicing on, Generate e-invoice on an issued invoice to a customer with a GSTIN calls the e-invoice provider through one adapter and returns a 64-hex IRN; a fake adapter with modes succeed, fail and fail 1 in 5 serves tests and the sandbox. | now | einvoice.call_portal |
| W046 | When the fake portal fails, the invoice stays issued and payable, the error code and message show on the invoice, and Retry is allowed any number of times. | now | einvoice.portal_refused |
| W056 | Each payment receives a receipt number REC/YY-YY/NNNNN from its own gapless counter per firm and financial year of the payment date. | now | number_series.doc_type |
| W064 | Credit note number format is CN/YY-YY/NNNNN from its own gapless counter per firm and financial year, assigned at issue, with the year taken from its issue date. | now | number_series.doc_type |
| W071 | Invoice and credit note prefixes are each 1 to 4 uppercase letters or digits, default INV and CN, and can change only while no document with that prefix is issued in the current financial year. | now | number_series.prefix |
