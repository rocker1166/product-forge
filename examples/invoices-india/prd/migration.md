# Invoices for Indian service firms: migration

One module of the PRD. The front book is ../PRD.md.

### Export Job

| Can do | How |
|---|---|
| create | Owner and accountant start one from a list's Export button, Reports, or Settings; the full-firm export is owner only and mails every owner. Staff and viewers cannot. Plan and unpaid dues never block it, in read-only or grace too. Support may build the full-firm export for a sealed firm only, for a former owner, after the proofs of R65; support never exports a live firm. |
| view | State, progress count, started, ended, who started it, errors, and result file or log. |
| filter | By type, state, person and date; failed runs first. |
| sort | Newest first. |
| saved view | Save as a named report, shareable. |
| columns | Choose and order columns. |
| delete | The file is deleted 7 days after creation and its link dies with it; the owner may delete it earlier. The record stays with row count, who ran it and the filters. |
| duplicate | Run again with the same filters as a new run with a new file and a new 7 days. |
| reverse | Cancel while queued or running and no file is kept; a ready file is not recalled but can be deleted at once. |
| share link | A ready file is fetched through a sign-in page with a link that lives 7 days; a month-end pack to an outside address is created by an owner only and uses a random link of at least 128 bits that opens only after a code sent to the same address and lives 24 hours, and each download is written to history. |
| preview | The dialog shows the row count and columns before starting and says when a file will come by email instead of at once. |
| attach | Result and rejected-rows file attached to the run. |
| schedule | The month-end pack builds on the 1st at 08:00 IST for the month before, once per firm and month, to an address the owner chooses; there is a pause switch. |
| history | Every state, with time and row counts; rejected rows kept. |
| link related | Shows what it touched, the file, and the connection used. |
| notify | The starter is told when a file is ready or fails; every owner gets an email when a full-firm export runs. |

**later:** search (Runs are few; filters by kind, state and person are enough.); approve; comment; follow; remind; custom fields; api (Starting exports by API waits with the API.); webhook (Ready and failed events for other software wait with the API.)

**no:** edit (A run is not edited; change the filters and start a new one.); draft (Filters are chosen in a dialog and the run starts; nothing is kept half done.); group (A flat history, newest first; months are grouped inside the pack itself.); bulk (Runs are cancelled or retried one at a time; nothing else changes in bulk.); import (A file made here is never read back; the full-firm zip is for keeping and for another system.); export (This object is the export; the list of runs is not exported again.); archive (Expired runs stay in the list as expired.); restore (An expired file does not come back; run it again.); version (Each run is its own file; change the dates to get another.); print pdf (Packs are CSV and zip; a PDF of a report is printed from the report screen.); assign; tag (Kind and period already label every run.); merge

| Question | Answer |
|---|---|
| size | Invoice list export is up to 50,000 rows; over 5,000 rows runs in the background and comes by email. The full-firm zip has no row cap. Beyond 50,000 the dialog says to narrow the dates. |
| fail | A file that fails half way is dropped whole; nothing partial is offered. The run shows failed with the reason, the starter is told, and Retry builds it again from the start. |
| again | Safe. Every run makes a new file. The month-end job has a unique key of firm, kind and month, so a second runner makes nothing twice. |
| progress | Queued, ready or expired, with rows done of total. A queued run can be cancelled; the page may be closed because the email follows. |
| who | Owner and accountant start and open runs; the full-firm export is owner only; staff, viewers and customers cannot. An accountant sees all runs of the firm and the owner sees every download. |
| result | The file is kept 7 days under the firm's own path and then deleted. The run record, row count, filters and who ran it stay at least 8 years. |
| limit | Two runs at once per firm, the rest queue; no rate limit on the owner's own export. A job lock keeps two app instances off the same run. |
| timing | The run reads one snapshot taken at start, so totals and rows agree while people keep working; the file says the time it was made as of. |
| limits | CSV is UTF-8 with a byte-order mark, ISO dates and plain 2 decimal amounts. Tally output is XML with party, sales, tax and round-off ledgers. HSN and SAC codes keep their zeros. |
| store | Files sit under the firm's own path and are never cached under a key another firm could read. |
| remove | Deleted at 7 days or by the owner. If the firm is deleted, a final export link comes first and the books stay at least 8 years. |
| safe | Cells that start with = + - or @ get a single quote in front so Excel cannot run them. The file is built by us, so it is not scanned. |
| dupe | The same filters twice give two files; nothing is merged. |
| meta | File names have no customer or firm name: kind, period and run date, with slashes in document numbers turned into hyphens. The full-firm zip holds a read-me with field meanings. |
| definition | Each export lists its columns and how they are worked. Credit note rows are negative, void invoices are left out of totals and a switch lists them as marked rows, and foreign currency rows show currency, rate and the rupee value. TDS rows name the section and the certificate form: Form 131 from 1 April 2026, Form 16A before, and the yearly list by quarter is for matching with Form 168 or AIS. |
| period | Default is the month before for the pack and the current financial year for registers, in IST with April to March years; the filing mode of the firm decides quarter cuts. |
| fresh | Live data as of the start time, printed in the file and the read-me; there is no cache. |
| drill | A totals row equals the sum of the rows above it, and the filters used are printed with the file so the screen and the file match. |
| big | Over 5,000 rows is a background run with an email link; smaller exports are ready in the same minute but still create a run, so every export is logged. |
| money | Rupees with 2 decimals and no separators; a foreign currency row also carries the exchange rate column and the taxable value in rupees. |
| log | Every export writes a history row with who, what, filters, row count and time, and no one can edit or delete it. |

**States, run:** queued (start), ready, failed, expired (end), cancelled (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| finish | queued | ready | system | file written whole and its hash stored | link made, valid 7 days; starter emailed | delete_file | export_ready |
| fail | queued | failed | system | the build fails or times out | no partial file kept; reason shown | retry | export_failed |
| retry | failed | queued | owner, accountant | none | built again from the start | cancel | none |
| cancel | queued | cancelled | owner, accountant | not yet ready | nothing is kept | none: start a new run | none |
| expire | ready | expired | system | 7 days after creation | link dies and the file is deleted; the record stays | none: run it again as a new run | none |
| announce_full_export | queued | queued | system | kind is the full-firm export | every owner is emailed that it was started and by whom | none: an email cannot be recalled | export_full_firm |

**States, upload:** pending (start), stored, write_failed (end), deleted (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| write | pending | stored | system | the whole file is written and checked | bytes kept under the firm's path | delete_file | none |
| fail_write | pending | write_failed | system | the file cannot be finished | temporary bytes removed | none: the run is retried and writes again | none |
| delete_file | stored | deleted | system, owner | 7 days after creation, or the owner asks | bytes removed, link dead | none: run the export again | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| kind | choice | yes |  |  | nobody after start | Choose what to export. |
| format | choice | yes |  | CSV | nobody after start | Choose CSV, XLSX, XML or ZIP. |
| filters | long_text |  | 2000 |  | nobody after start |  |
| from_date | date |  |  |  | nobody after start | The start date must not be after the end date. |
| to_date | date |  |  |  | nobody after start | The end date must not be before the start date. |
| rows | number | yes | 50000 |  | nobody |  |
| file | file |  | 1 GB |  | nobody |  |
| expires_at | date |  |  |  | nobody |  |
| recipient | text |  | 120 |  | owner, for the month-end pack | This email does not look right. |

| List |  |
|---|---|
| filters | run, upload, kind, started_by, created_at |
| sorts | -created_at |
| default_sort | -created_at |
| columns | created_at, kind, started_by, rows, run, expires_at |
| views | All, Ready, Failed |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest |  | -created_at | tenant, created_at | 150 ms |
| by_state | run | -created_at | tenant, run, created_at | 150 ms |
| by_file | upload | -created_at | tenant, upload, created_at | 150 ms |
| by_kind | kind | -created_at | tenant, kind, created_at | 150 ms |
| by_person | started_by | -created_at | tenant, started_by, created_at | 150 ms |
| to_expire | run | expires_at | tenant, run, expires_at | 100 ms |

### Import Job

| Can do | How |
|---|---|
| create | Owner or accountant starts one from the Customers, Services or Invoices list or Settings, picking what is imported. Opening-invoice runs need an owner to confirm. Staff and viewers cannot. |
| draft | After upload a dry run shows what will be created, updated or skipped, with row errors; nothing is written until the owner or accountant confirms. |
| view | State, progress count, started, ended, who started it, errors, and result file or log. |
| filter | By type, state, person and date; failed runs first. |
| sort | Newest first. |
| delete | The uploaded file and its error CSV are deleted 30 days after the run ends, or at once by the owner; the run record with counts stays. |
| duplicate | Run again with the same kind and column mapping and a fresh upload; rows already added are skipped, not doubled. |
| version | Older bytes kept when replaced, with restore and a visible limit. |
| reverse | Cancel before it ends and nothing is kept. After done, the owner may undo within 7 days only if the run created new rows and none has a payment, credit note, email or edit since; otherwise the touched rows are listed and undo is refused. |
| preview | The dry run lists rows to create, update and skip before anything starts, with the mapping used. |
| attach | Result and rejected-rows file attached to the run. |
| tag | Labels, and for photos people, places and albums. |
| history | Every state, with time and row counts; rejected rows kept. |
| link related | Shows what it touched, the file, and the connection used. |
| notify | The person who started it is told in the app and by email when it finishes or fails. |

**later:** search (Runs are a few dozen per firm; filters are enough.); saved view; columns; bulk; export (A run log CSV for support waits; each run already carries its rejected-rows CSV.); comment; custom fields; api (Starting imports by API waits with the API.); webhook (Finished and failed events for other software wait with the API.)

**no:** edit (A run is not edited; a corrected file is a new upload and a new run.); group (A flat history, newest first.); import (This object is the import; a file of runs is never imported.); archive (Old runs stay in the list, found by date.); restore (A deleted file does not come back; upload it again.); print pdf; share link (The error file downloads for the person who started it and owners; no outsider link.); assign; approve (An opening-invoice run is confirmed by an owner as part of starting it; no second approver.); follow; remind; schedule (Imports are one-off by hand; nothing repeats.); merge

| Question | Answer |
|---|---|
| size | CSV or XLSX up to 5 MB and 5,000 rows. A larger file is refused before anything is read, with a message to split it. |
| fail | Bad rows are listed with row number, field and reason in an error CSV and skipped on confirm; good rows are written in one step. If the system fails mid-way, the whole run rolls back and no half-imported row remains. State names with old spellings map to the GST list; an unmapped value stops its row. |
| again | Safe. Customers match on GSTIN, or name and phone when there is none; services on name; opening invoices on customer and original number. The same file twice creates nothing the second time, and the same file bytes show a warning with the earlier run. |
| progress | Shows uploaded, validated, importing with rows done of total, then done. It can be cancelled until it ends and the page may be closed; the starter is mailed at the end. |
| who | Owner and accountant start and see every run of the firm; staff, viewers and support cannot unless the owner grants support access. The file is opened only by them through a 15 minute signed link. |
| result | Counts of rows created, updated, skipped and failed stay on the run for good; the error CSV and source file stay 30 days and are then deleted. |
| limit | One run importing at a time per firm; a second waits at validated. A job lock stops two app instances taking the same run. |
| timing | Work in the firm goes on. A row that meets a customer added meanwhile is skipped with that reason. Opening invoices keep their own numbers up to 16 characters, never touch the counters, and a clash in the same series refuses the row. |
| limits | Only .csv and .xlsx, 5 MB. UTF-8 and Windows-1252 are read, Excel dates and amounts with commas, rupee sign or spaces are cleaned, and leading zeros in pincode, phone and HSN are kept. Anything else says which limit it broke. |
| store | The original bytes sit under the firm's own path and are read only by the import worker; the rows made from them live in their own tables. The file is deleted 30 days after the run ends. |
| remove | Deleting a run's file never removes the rows it made. A customer's DPDP erasure leaves the run counts alone and the file is gone by then; firm deletion removes everything after the final export. |
| safe | Type is checked by content, not name, so a renamed program is refused. Cells starting with = + - or @ are saved as text and formulas are never run. |
| dupe | Same bytes uploaded twice are noticed by hash and the owner is told which run took them; the rows are skipped by the match rules, so nothing doubles. |
| meta | Only the header row, row count and cell values are read; author and other hidden file details are ignored, and the file name is shown only to the firm. |

**States, run:** uploaded (start), validated, importing, done, failed, cancelled (end), undone (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| validate | uploaded | validated | system | file readable, at most 5,000 rows, columns matched | dry run counts and row errors made | cancel | none |
| refuse_file | uploaded | failed | system | file unreadable, over 5 MB or over 5,000 rows | nothing is read; the message names the limit | retry | import_failed |
| start | validated | importing | owner, accountant | at least one good row, no other run importing in this firm, an owner for opening invoices | good rows written in one step; bad rows skipped and listed | cancel | none |
| finish | importing | done | system | all good rows written | counts stored; rows made are marked migrated and read-only if opening invoices | undo | import_done |
| fail | importing | failed | system | the system fails before the last row | whole batch rolled back; no row remains | retry | import_failed |
| retry | failed | validated | owner, accountant | the stored file still exists | the same file is checked again | cancel | none |
| cancel | uploaded, validated, importing, failed | cancelled | owner, accountant | none | nothing is kept; a running batch rolls back | none: upload the file again as a new run | none |
| undo | done | undone | owner | within 7 days, the run only created rows, and none has a payment, credit note, email or edit | the created rows are removed and a history row names the run | none: upload the file again | none |

**States, upload:** receiving (start), stored, refused (end), deleted (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| store | receiving | stored | system | type by content is csv or xlsx and size is 5 MB or less | bytes kept under the firm's path with a hash | delete_file | none |
| refuse | receiving | refused | system | wrong type by content or over 5 MB | message states the allowed types and size | none: upload a proper file | none |
| delete_file | stored | deleted | system, owner | 30 days after the run ends, or the owner asks | bytes and error CSV removed; the run record stays | none: upload the same file again | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| kind | choice | yes |  |  | while uploaded | Choose what you are importing: customers, services or opening invoices. |
| file | file | yes | 5 MB, csv or xlsx |  | nobody after upload | Choose a CSV or XLSX file up to 5 MB. |
| encoding | choice | yes |  | auto | while uploaded | Choose UTF-8 or Windows-1252, or leave it on auto. |
| mapping | list | yes |  |  | while uploaded or validated | Match every required column before you continue. |
| mode | choice | yes |  | skip_duplicates | while validated | Choose whether matching rows are skipped or updated. |
| rows_total | number | yes | 5000 |  | nobody |  |
| rows_created | number | yes | 5000 |  | nobody |  |
| rows_updated | number | yes | 5000 |  | nobody |  |
| rows_skipped | number | yes | 5000 |  | nobody |  |
| rows_failed | number | yes | 5000 |  | nobody |  |
| file_hash | text | yes | 64 |  | nobody |  |
| error_file | file |  | 2 MB, csv |  | nobody |  |

| List |  |
|---|---|
| filters | run, upload, kind, started_by, created_at |
| sorts | -created_at |
| default_sort | -created_at |
| columns | created_at, kind, started_by, rows_total, rows_failed, run |
| views | All, Failed, Done |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest |  | -created_at | tenant, created_at | 100 ms |
| by_state | run | -created_at | tenant, run, created_at | 100 ms |
| same_file | file_hash | -created_at | tenant, file_hash, created_at | 50 ms |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Reports and registers | /reports | home | owner, accountant, viewer | Open month end | menu, home |  |  |  |
| A report | /reports/:name | detail | owner, accountant, viewer | Export | reports, home, month_end |  |  |  |
| Month end | /month-end | wizard | owner, accountant | Build month-end pack | menu, home, reports |  |  |  |
| Exports | /exports | list | owner, accountant | New export | menu, reports, month_end, settings_security | No exports yet. Build the month-end pack, a register, a Tally file or a full copy of your books. | No export matches. Try Ready or Failed. |  |
| Imports | /imports | list | owner, accountant | Bring in data | menu, customers, items, invoices, setup_guide | Nothing imported yet. Bring customers, services or open invoices from Excel, Tally or another app. | No import matches. Try Failed or Done. |  |
| Bring in data | /imports/new | wizard | owner, accountant | Check my file | imports, customers, items, invoices, setup_guide |  |  |  |
| Support console | /support | list | support | Find a firm or user | menu | No open tickets. Search a firm or a login to start. | No firm or user matches. Check the ticket number and the owner's email. |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| export_ready | export_job.finish | starter | email, app | Your export {name} is ready with {rows} rows. The link asks you to sign in and works for 7 days, then the file is deleted. |
| export_failed | export_job.fail | starter | email, app | Your export {name} could not be built: {reason}. No partial file was kept. Try again, or narrow the dates if the list is very large. |
| export_full_firm | export_job.announce_full_export | owner | email, app | {actor} started a full export of {firm} on {date}. It holds all the books. If you did not expect this, remove their access in Users now. |
| import_failed | import_job.fail | starter | email, app | Import {name} did not run: {reason}. Nothing was added. Fix the file and upload it again; the 5 MB and 5,000 row limits apply. |
| import_done | import_job.finish | starter, owner | email, app | Import {name} finished: {added} added, {skipped} skipped, {errors} with errors. The rows with errors are listed on the run page. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A017 | Full firm data export is owner-only, and every owner gets an email notice when it runs. | now | export_job.notify, export_job.announce_full_export |
| A040 | Cancelling the subscription turns the firm read-only after the paid period; invoices, payments, share links and exports stay reachable for as long as books must be kept (at least 8 years), and paying again restores full use at once. | now | export_job.create |
| A067 | Generated PDFs and exports live under firm-scoped paths and are served through signed URLs that expire in 15 minutes. | now | import_job.store, export_job.store |
| A100 | TDS recorded on a payment appears in a receivable ledger by customer, section and financial year, with a flag for certificate received: Form 131 for payments from 1 April 2026, Form 16A before. | now | export_job.definition |
| A101 | A TDS-by-customer report for the year lists deducted amounts by quarter so the owner can match them with Form 168 (old 26AS) or AIS. | now | export_job.definition |
| A142 | Import job states are uploaded, validated, importing, done, failed; failed leaves no half-imported rows. | now | import_job.finish, import_job.fail, import_job.refuse_file |
| A187 | HSN or SAC with leading zeros is kept as text everywhere; codes never lose zeros through import, export or JSON. | now | import_job.limits, export_job.limits |
| A196 | Attached PDF file name replaces slashes with hyphens, for example INV-26-27-00001.pdf; no slash reaches a file name or URL path. | now | export_job.meta |
| A224 | Every job takes a lock so two app instances never run the same job at once; a test starts two runners and expects one set of results. | now | import_job.limit, export_job.limit |
| A225 | Each job run stores start, end, counts and errors. | now | import_job.history, export_job.history |
| A226 | Jobs use a unique key per unit of work, such as invoice and reminder step, so re-running a job sends nothing twice. | now | import_job.again, export_job.again |
| A230 | Month-end job on the 1st at 08:00 IST builds the accountant pack: sales register, credit and debit notes, receipts, TDS and ageing, emailed or linked. | now | export_job.schedule, export_job.share_link, export_job.kind |
| A241 | Opening-balance import adds unpaid old invoices with original number, date, customer and balance, marked migrated and read-only. | now | import_job.kind, import_job.timing |
| A242 | Migrated invoices keep their original numbers even if longer or differently formatted, up to 16 characters, never touch the counters, and a number that clashes with an existing one in the same series is rejected. | now | import_job.timing, import_job.again |
| A243 | Customer CSV import maps columns, shows a dry run with row errors, and imports nothing until the user confirms. | now | import_job.draft, import_job.start, import_job.preview |
| A244 | Import error report downloads as CSV with row number, field and reason; fixing and re-uploading the file does not duplicate rows already added. | now | import_job.duplicate, import_job.result, import_job.error_file |
| A245 | Import detects duplicates by GSTIN and, for unregistered customers, by name and phone, then skips or updates by user choice. | now | import_job.mode, import_job.again |
| A246 | Import reads UTF-8 and Windows-1252 files and Excel date formats, cleans amounts with commas, rupee sign or spaces, and keeps leading zeros in pincode, phone and HSN. | now | import_job.limits, import_job.encoding |
| A247 | Import accepts CSV and XLSX up to 5 MB and 5,000 rows and tells the user to split larger files before it reads anything. | now | import_job.size, import_job.refuse_file |
| A248 | Tally export produces vouchers in Tally's XML import format with party ledgers, sales ledger, tax ledgers and round-off per document. | now | export_job.kind, export_job.limits |
| A249 | Sales register, credit notes and receipts export as a zip with one CSV per month for the accountant, in the same column order every time. | now | export_job.kind, export_job.period |
| A251 | Customer ledger and payment CSV exports exist with the same filter options as the screen they come from. | now | export_job.kind |
| A252 | Exports prefix cells starting with =, +, - or @ with a single quote, and imports save such cells as text, so customer names cannot run formulas in Excel. | now | import_job.safe, export_job.safe |
| A253 | Full firm export is one zip with CSVs of every object, all PDFs, and a read-me with field meanings; it works in read-only state. | now | export_job.kind, export_job.create |
| A254 | Export is available after cancellation and during grace; requesting data export is never blocked by plan or unpaid dues. | now | export_job.create, export_job.limit |
| A255 | DPDP erasure request on a customer contact removes name, email and phone from the contact but keeps financial records the law requires. | now | import_job.remove |
| A256 | Firm deletion is owner-only with typed firm name, a 30-day cooling period and a final export link; books are kept at least 8 years (GST law needs 72 months after the annual return), then may be removed. | now | export_job.remove |
| B104 | Every export and every PII-including backup is logged with user and time. | now | export_job.history, export_job.log |
| B108 | CSV and XLSX files import with a choice of character encoding and field mapping, and a sample file is downloadable. | now | import_job.mapping, import_job.encoding |
| D025 | Item CSV import matches on item name; shows rows to create, update and skip before running; bad SAC or rate rows download as an error file. | now | import_job.kind, import_job.preview |
| D219 | State names and old spellings (Orissa, Pondicherry) map to the GST state list; unmapped values stop that row with the value shown. | now | import_job.fail |
| D228 | Exports over 5,000 rows run as a background job with states queued, ready and expired, an email with the link when ready, and a link that dies after 7 days with the file deleted while the job record stays. | now | export_job.expire, export_job.delete, export_job.big |
| D290 | Uploaded files are checked by content, not name; an executable renamed to .png or .pdf is refused. | now | import_job.safe |
| W083 | Owner or accountant can export the current filtered invoice list as CSV, UTF-8 with byte-order mark, ISO dates, plain 2-decimal amounts, up to 50,000 rows, with columns number, date, due, customer, GSTIN, place of supply, taxable, CGST, SGST, IGST, round-off, total, paid, TDS, credited, balance and status, and a line-level option with one row per line. | now | export_job.create, export_job.limits, export_job.size |
| W084 | A GST sales register CSV for a date range has one row per invoice and credit note line with HSN or SAC, taxable value, CGST, SGST and IGST; credit note rows negative; void invoices excluded. | now | export_job.definition |
