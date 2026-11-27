# Invoices for Indian service firms: sales

One module of the PRD. The front book is ../PRD.md.

### Quote

| Can do | How |
|---|---|
| create | From scratch, by copy of an older quote, as a quote or as a proforma invoice; the customer picker opens first and terms and currency fill from the customer. |
| edit | A draft allows every field. A sent quote can be revised by owner or accountant (lines, validity, notes): the number stays, a revision counter goes up and the older PDF is kept. Accepted, declined, expired, converted and cancelled quotes are frozen except the internal note. |
| draft | Autosaved every 30 seconds, no number until the first send, never visible to the customer. |
| view | Header with state and amount due, lines and tax, payments, then timeline. |
| search | Quote number, customer name and customer GSTIN, substring from 2 characters. |
| filter | Status, customer, validity date range, and quote or proforma. |
| sort | Date, total and validity date, both ways; newest first by default. |
| saved view | Named filters like Unpaid, Overdue, This month, kept per person or shared. |
| columns | Pick columns such as number, customer, due, balance; choice is kept. |
| export | CSV for the accountant by date range; large ranges are emailed, with tax columns. |
| delete | Only draft quotes, after a confirm; a sent quote is cancelled with a reason of 5 to 200 characters and its number stays used. |
| duplicate | Makes a new draft without number, dates, payments or sent history. |
| print pdf | PDF and page carry the words Not a tax invoice, or Proforma, not a tax invoice, and no tax-invoice number; the terms text of up to 1,000 characters prints at the foot. |
| share link | Read-only page for this quote only, 30 days by default (owner picks 1 to 365), revocable; shows viewed times. There is no Accept button in wave 1: the owner records the answer. |
| preview | Shows the email and PDF as the customer will get them before sending. |
| comment | Internal notes on the timeline; customer-visible notes are a separate field. |
| attach | Supporting files sent with or kept beside the document, with size limit shown. |
| history | Created, sent, viewed, paid, voided, with who and when; cannot be edited. |
| link related | Shows the source quote or order, payments, credit notes and the customer. |
| notify | Customer email on send and on payment; staff alert on paid, failed, viewed or overdue. |

**room:** version; approve

**later:** group; bulk (No bulk quote action is asked for; each quote is sent or cancelled alone.); import (Old quotes are not imported; open ones are typed again.); assign; follow; remind (No automatic nudge before a quote expires; the Expiring in 7 days view serves.); api (Quotes are not exposed to other software in wave 1.); webhook (No quote events are sent out in wave 1.)

**no:** archive (Lists and views carry the old quotes; nothing is put away.); restore (Only drafts are deleted and they do not come back; an expired quote is reopened by extending its date.); reverse (A quote is not reversed: cancel it with a reason or let it expire. A converted quote is freed only by deleting the draft invoice it made.); tag (No free tags in wave 1.); schedule (A quote is sent when the person sends it; it does not repeat.); custom fields (Fixed fields only.); merge

| Question | Answer |
|---|---|
| freeze | A quote number is taken at first send and a sent quote stays editable only by revision, with the older PDF kept. Once accepted it is frozen. A quote is never a tax document and reaches no GST register. |
| number | QT/YY-YY/NNNNN for quotes and PI/YY-YY/NNNNN for proforma invoices, each gapless per firm and year, taken at first send; the invoice counter is never touched; a cancelled quote keeps its number. |
| fix | Revise while sent. After accepted or later, cancel with a reason and copy it into a new draft, which takes a new number at send. A declined quote is final; copy it to offer again. |
| money | Same arithmetic as an invoice: whole paise, line tax half-up, total to the rupee with a round-off line, foreign currency with rate; shown for information only. On conversion tax is recomputed at the rates in force on the invoice date. |
| paid | A quote takes no money in wave 1 and advances are refused. Its payment track only says whether it has been billed: not billed until a converted invoice exists. |
| late | A sent quote becomes expired the day after its validity date, in IST; expired can be reopened by extending the date. An accepted quote never expires and appears in the Accepted not billed view. |
| law | No tax invoice number, no IRN, no register row. A proforma says Proforma, not a tax invoice and creates no tax liability; it converts to a tax invoice draft once. |
| send | Sending is the move: it takes the number, locks the first PDF and emails it through the outbox, or opens WhatsApp with the share link. A quote needs at least one line with a rate and a validity date on or after the quote date. |

**States, document:** draft (start), sent, accepted, declined (end), expired, converted, cancelled (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| send | draft | sent | owner, accountant | customer chosen, at least one line with a rate, validity date on or after the quote date | number taken from the quote or proforma series, PDF stored with hash, email queued | cancel | quote_email |
| revise | sent | sent | owner, accountant | not yet accepted | revision counter goes up, new PDF stored, older PDF kept, share link shows the newest | revise again | none |
| accept | sent | accepted | owner, accountant, client | validity date not passed; name of who agreed and the date typed. a client may press it only on the client page after signing in, never from a plain document link, and types their own name | leaves the open view and joins Accepted not billed | cancel | quote_answered_alert |
| decline | sent | declined | owner, accountant, client | optional reason up to 300 characters. a client may press it only on the client page after signing in | closed for good | none: copy it into a new draft to offer again | quote_declined_alert |
| expire | sent | expired | system | validity date has passed in IST | share link says expired | extend | none |
| extend | expired | sent | owner, accountant | new validity date is today or later | link works again; revision counter goes up | expire happens again when the new date passes | none |
| convert | sent, accepted | converted | owner, accountant | at least one line, not converted before | a draft invoice is made with customer and lines, linked both ways; tax is recomputed at issue; the payment track says billed | unconvert | none |
| unconvert | converted | accepted | system | the linked draft invoice was deleted and no invoice from it was issued | the quote is free again and may be converted once more | convert | none |
| cancel | sent, accepted, expired | cancelled | owner, accountant | reason of 5 to 200 characters | number stays used, share link says cancelled | none: copy it into a new draft | none |

**States, payment:** not_billed (start), billed

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| mark_billed | not_billed | billed | system | the quote was converted into an invoice draft | shows the invoice and its payment state read-only | mark_unbilled | none |
| mark_unbilled | billed | not_billed | system | the draft invoice was deleted | back to not billed | mark_billed | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| kind | choice | yes |  | quote | while draft | Choose quote or proforma invoice. |
| number | text | yes | 16 |  | nobody; given at first send |  |
| customer | link | yes |  |  | while draft | Choose a customer. |
| quote_date | date | yes |  | today | while draft | Enter a real date. |
| valid_until | date | yes |  | quote date plus 15 days | while draft, by revise or extend | Validity date must be on or after the quote date. |
| currency | choice | yes |  | the customer's currency | while draft | Choose a currency from the firm's list. |
| lines | list | yes | 50 |  | while draft or by revise | Add 1 to 50 lines, each with a rate. |
| total | money | yes | 9999999999 |  | nobody |  |
| terms | long_text |  | 1000 | the firm's terms for quotes | while draft or by revise | The terms are longer than 1,000 letters. |
| customer_note | long_text |  | 500 |  | while draft or by revise | The note is longer than 500 letters. |
| internal_note | long_text |  | 1000 |  | owner and accountant, any time | The note is longer than 1,000 letters. |
| revision | number | yes | 99 |  | nobody |  |
| accepted_by | text |  | 100 |  | when the quote is accepted | Type who agreed, up to 100 letters. |
| cancel_reason | text |  | 200 |  | when the quote is cancelled | Give a reason of 5 to 200 letters. |
| converted_to | link |  |  |  | nobody; set by convert |  |

| List |  |
|---|---|
| search | number, customer, gstin |
| filters | document, payment, customer, valid_until, kind |
| sorts | quote_date, total, valid_until |
| default_sort | -quote_date |
| columns | number, quote_date, customer, kind, total, valid_until, document |
| views | All, Drafts, Open, Accepted not billed, Expiring in 7 days, Expired |
| export | rows: selected, filtered, date range; what: quotes, lines; formats: CSV, XLSX; big: Over 5,000 rows runs as an export job and the link comes by email and lives 7 days. |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | document, payment, kind | -quote_date | tenant, document, payment, kind, quote_date | 150 ms |
| one_customer | customer | -quote_date | tenant, customer, quote_date | 100 ms |
| expiring |  | valid_until | tenant, valid_until | 150 ms |
| by_total |  | total | tenant, total | 200 ms |

### Recurring Plan

| Can do | How |
|---|---|
| create | From scratch, or from an issued invoice by Repeat this invoice; needs customer, lines, frequency, start date and optionally an end date or a run count. |
| edit | Lines, frequency, notes, end date and run count change future runs only; the customer cannot change after the first run; invoices already made stay as they are. |
| view | State, progress count, started, ended, who started it, errors, and result file or log. |
| search | Customer name and plan name. |
| filter | Run state, customer, frequency and next run date. |
| sort | Next run date, customer; soonest first by default. |
| delete | Only a plan that has never run; otherwise Stop ends it and keeps its history. |
| duplicate | Run again with the same settings, as a new run. |
| version | Money-affecting settings keep dated values so old documents compute the same. |
| reverse | A wrong run is undone by deleting its draft and pressing Create draft for period; a wrongly issued invoice is fixed like any invoice. |
| preview | Import shows what will be created, changed or skipped before it starts. |
| attach | Result and rejected-rows file attached to the run. |
| schedule | Next run date is shown; pause and resume; Skip next run is one click. |
| history | Run history lists each run date, result and generated invoice link, with who created, edited, stopped or restarted the plan. |
| link related | Shows what it touched, the file, and the connection used. |
| notify | Starter told on finish or failure by email or in-app; large exports by email. |

**later:** bulk (Pause or stop many plans at once waits until firms have many plans.); export; share link; approve; remind; api (Plans are not opened to other software in wave 1.); webhook (Run events go out with the API, later.)

**no:** draft (A plan is active from its first save; nothing is made before its start date.); group; saved view; columns; import (Plans are not imported; they are made from existing invoices.); archive (A plan is stopped, not archived; ended plans stay listed with their run history.); restore (An ended plan does not restart; copy it into a new plan.); print pdf; assign; comment; tag; follow; custom fields; merge (Plans are never joined.)

| Question | Answer |
|---|---|
| size | One plan makes one draft per period, never more than 50 lines each; a firm has at most 200 active plans, and a run covers each plan alone so one failure never stops the others. |
| fail | A cause only a person can fix (archived customer, invalid GSTIN, firm read-only, two drafts still waiting) stops that run, shows its reason and pauses the plan as failed; a passing fault retries once next day without a duplicate. The owner is told either way. |
| again | Every run has a unique key of plan and period, so rerunning or restarting never makes a second draft for the same period; after a hard delete of that draft the owner may redo the period once. |
| progress | Next run date, last run result and the run history are shown; a run takes seconds and is not stopped midway. |
| who | Owner and accountant create, change, pause and stop plans; staff cannot; viewers only read. A run sees only its own firm's customer and lines. |
| result | The result is a draft invoice marked Needs review, linked from the run history; it stays until a person issues or deletes it. |
| limit | At most 200 active plans per firm and 50 lines per draft; drafts never count toward the free-plan limit, only issuing does. |
| timing | A daily job at 06:00 IST makes due drafts; it takes a lock so two runners never overlap. A plan saved with today as start date makes its first draft at save. The run day is 1 to 28 so short months never skip it. |
| scope | One plan belongs to one firm and one customer. |
| used | Drafts and invoices already made never change when a plan changes; they carry their plan and period. |
| default | A new plan takes the customer's terms, currency and tax treatment at each run, not at the day it was made. |
| effective | A change applies from the next run; tax rates in force on the run date apply to that run's draft. |
| order | Plans are ordered by next run date; nothing needs manual order. |

**States, run:** active (start), paused, failed, ended (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| run_due | active | active | system | run date reached, no draft exists for this plan and period, fewer than 2 earlier drafts from this plan still unissued | a draft invoice marked Needs review is made with the service period text, owner told it is ready. with the owner's opt-in 'Issue and send automatically' the invoice is issued and sent and the owner is mailed the list (R56) | redo_period | recurring_drafts_ready |
| fail_run | active | failed | system | customer archived, invalid GSTIN, firm read-only or two drafts still waiting | reason logged, no draft made, plan waits for a person | resume | recurring_failed_alert |
| pause | active | paused | owner, accountant | none | no runs while paused | resume | none |
| resume | paused, failed | active | owner, accountant | the cause is fixed; asks to skip the missed periods or create each once | next run date set | pause | none |
| skip_next | active | active | owner, accountant | a next run exists | next run moves one period; the skipped period is written in the history | redo_period | none |
| redo_period | active | active | owner, accountant | the period has no draft because it was deleted or skipped, and has not been redone before | one draft is made for that period | delete the draft | none |
| end_plan | active, paused, failed | ended | owner, accountant | none | no more runs; history stays | none: copy it into a new plan | none |
| complete | active | ended | system | the end date or the run count is reached | no more runs; history stays | none: copy it into a new plan | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| name | text | yes | 100 |  | owner and accountant | Give the plan a name, up to 100 letters. |
| customer | link | yes |  |  | owner and accountant until the first run | Choose a customer. |
| auto_issue | choice | yes |  | no | owner | Automatic issue needs a fixed amount, unchanged lines and a customer email. |
| frequency | choice | yes |  | monthly | owner and accountant; future runs | Choose monthly, quarterly or yearly. |
| start_on | date | yes |  |  | until the first run; the day must be 1 to 28 | Pick a start date on the 1st to the 28th. |
| end_on | date |  |  |  | owner and accountant | The end date must be after the start date. |
| max_runs | number |  | 999 |  | owner and accountant | Run count is 1 to 999. |
| lines | list | yes | 50 |  | owner and accountant; future runs | Add 1 to 50 lines. |
| service_period_label | text |  | 60 | month and year of the run | owner and accountant | The service period text is longer than 60 letters. |
| next_run_on | date |  |  |  | nobody; set by the schedule |  |
| runs_done | number | yes | 999 |  | nobody |  |
| last_error | text |  | 300 |  | nobody; last failure reason |  |

| List |  |
|---|---|
| search | name, customer |
| filters | run, customer, frequency, next_run_on |
| sorts | next_run_on, customer |
| default_sort | next_run_on |
| columns | name, customer, frequency, next_run_on, runs_done, run |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| due | run | next_run_on | tenant, run, next_run_on | 100 ms |
| one_customer | customer | next_run_on | tenant, customer, next_run_on | 100 ms |
| by_frequency | frequency | next_run_on | tenant, frequency, next_run_on | 100 ms |
| by_customer_name |  | customer | tenant, customer | 150 ms |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Quotes | /quotes | list | owner, accountant, staff, viewer | New quote | home, menu, customer | No quotes yet. Send a quote first when the customer wants a price before work starts. | No quote matches these filters. Clear them or widen the dates. |  |
| Write a quote | /quotes/new | form | owner, accountant, staff | Send quote | quotes, customer, quote |  |  | Quote is sent. You will see here when the customer opens it. |
| A quote | /quotes/:id | detail | owner, accountant, staff, viewer | Convert to invoice | quotes, search, customer, link |  |  |  |
| Repeating invoices | /recurring | list | owner, accountant | New plan | menu, customer | No repeating invoices. Set one up for a customer you bill every month and get a draft to check on the day. | No plan matches. Try the customer name. |  |
| A customer | /customers/:id | detail | owner, accountant, staff, viewer | New invoice | customers, invoice, search, credit_register |  |  |  |
| Your documents | /c/:token/home | public | client | Pay selected | client_sign_in, link | Nothing yet. Invoices and quotes from the firm will show here. | No document in this period. |  |
| Quote from the firm | /c/:token/quotes/:id | public | client | Accept quote | client_page |  |  |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| quote_email | quote.send | client | email, whatsapp_link | {firm} sent you quote {number} for {total}, valid until {valid_until}. Open the link to read the lines and terms. To accept, reply to this mail. |
| recurring_drafts_ready | recurring_plan.run_due | owner, accountant | email, app | {count} draft invoices from your recurring plans are ready to review for {period}. Nothing is sent until someone issues them. |
| recurring_failed_alert | recurring_plan.fail_run | owner, accountant | email, app | Plan {name} did not run for {period}: {reason}. No draft was made and the plan waits for you. Fix the cause, then press Create draft for period. |
| quote_answered_alert | quote.accept | owner, accountant | email, app | {customer} accepted quote {number} for {total}; {name} agreed at {time}. Convert it to an invoice from the quote. |
| quote_declined_alert | quote.decline | owner, accountant | email, app | {customer} declined quote {number} for {total} at {time}. {reason} The quote is closed; copy it into a new draft to offer again. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A021 | Quote flow: states draft, sent, accepted, declined, expired and converted; converted and declined are final, expired can be reopened by extending the date; Convert to invoice copies lines and customer into a draft and links both ways. | now | quote.convert, quote.extend, quote.accept |
| A022 | A quote has a validity date; after it passes, the quote shows expired and cannot be accepted without extending the date. | now | quote.expire, quote.extend, quote.late |
| A023 | A proforma invoice has its own series PI/YY-YY/NNNNN, prints 'Proforma, not a tax invoice', creates no tax liability and is left out of GST registers; it converts to a tax invoice draft once, then locks as Converted and links the invoice. | now | quote.kind, quote.convert |
| A026 | A recurring schedule bills a fixed fee each period and fills the service period text on the draft, for example 'May 2026'. | now | recurring_plan.service_period_label |
| A137 | Recurring schedule states are active, paused, ended and failed; a failed run shows its reason and does not retry blindly. | now | recurring_plan.fail_run |
| A148 | Recurring and imported drafts carry a 'needs review' mark that the user clears before issuing them. | now | recurring_plan.result |
| A159 | Recurring run on a day when the customer is archived or firm is read-only skips with a logged reason and tells the owner. | now | recurring_plan.fail_run |
| A160 | Recurring job down for two days: on restart it creates each missed period once, never duplicates, using a unique key of schedule and period. | now | recurring_plan.run_due, recurring_plan.again |
| A191 | Quote validity date must be on or after the quote date; a proforma needs at least one line with a rate. | now | quote.valid_until, quote.send |
| A226 | Jobs use a unique key per unit of work, such as invoice and reminder step, so re-running a job sends nothing twice. | now | recurring_plan.again |
| D001 | Quote numbers use series QT/YY-YY/NNNNN, gapless per firm, assigned when first sent; the invoice counter is never touched by quotes. | now | quote.send |
| D003 | On the client page, after signing in with the customer's password, the client presses Accept or Decline on a sent quote, types their name, gives an optional reason up to 300 characters; time, IP and name go into history. A plain quote document link does not accept. | now | quote.accept, quote.decline |
| D006 | Quote list filters by status (draft, sent, accepted, declined, expired, converted), customer and validity range; sorts by date, total and validity; default newest first. | now | quote.document |
| D008 | Quote PDF and page carry the words "Not a tax invoice", no tax-invoice number, and are excluded from every GST register and tax total. | now | quote.print_pdf |
| D010 | Only draft quotes can be deleted; sent quotes can only be cancelled with a reason, and the number stays used. | now | quote.delete, quote.cancel |
| D052 | A recurring plan has customer, lines, frequency (monthly, quarterly or yearly), start date and an optional end date or run count; every run creates a draft for review and never issues it. | now | recurring_plan.frequency, recurring_plan.create |
| D054 | A recurring plan can be paused and resumed; resuming asks whether to skip the missed periods or create each of them once; Skip next run is a separate one-click action. | now | recurring_plan.pause, recurring_plan.resume, recurring_plan.skip_next |
| D055 | Plan has a run history listing each run date, result and generated invoice link; failed runs state the reason such as archived customer or invalid GSTIN. | now | recurring_plan.history |
| D056 | If a run fails the owner is notified and the plan stays active; the next day retries once without creating a duplicate for the same period. | now | recurring_plan.fail_run |
| D057 | Editing a plan changes only future runs; invoices already created are untouched. | now | recurring_plan.edit |
| D061 | Plan delete is only allowed when it has never run; otherwise Stop ends it and keeps history. | now | recurring_plan.delete, recurring_plan.end_plan |
| D146 | Terms and conditions text up to 1000 characters prints at the foot of invoices and quotes; a different text can be set per document type. | now | quote.terms |
| W047 | Owner or accountant can mark an invoice to repeat monthly on a chosen day from 1 to 28; a daily job at 06:00 IST then creates a draft copy and never issues it. | now | recurring_plan.run_due |
