# Invoices for Indian service firms: billing

One module of the PRD. The front book is ../PRD.md.

### Credit Note

| Can do | How |
|---|---|
| create | Only from an issued, part-paid, paid, credited or written-off invoice (R27); the page offers Create credit note beside Void and re-create. One invoice may have many credit notes. |
| edit | A draft allows reason, note and lowering each line; an issued credit note cannot be edited by anyone. |
| draft | Auto-saved, no number yet, invisible to the customer, deletable without a trace. |
| view | Header with state and amount due, lines and tax, payments, then timeline. |
| search | Number, original invoice number and customer name. |
| filter | Status, e-invoice state, credit use, date and customer. |
| sort | Issue date and total, both ways; newest issue date first. |
| saved view | Named filters like Unpaid, Overdue, This month, kept per person or shared. |
| columns | Pick columns such as number, customer, due, balance; choice is kept. |
| export | CSV for the accountant by date range; large ranges are emailed, with tax columns. |
| delete | Drafts only, after a confirm; issued ones are voided by the owner, never deleted. |
| reverse | Void by the owner with a reason of 5 to 200 characters, only while none of its credit is applied or refunded and, for an e-invoiced note, within 24 hours of its IRN. |
| print pdf | Titled Credit Note with number and date, original invoice number and date, reason, lines, tax split, total and each application to other invoices; stored at issue like an invoice. |
| share link | The email carries the PDF and a read-only link for this credit note only, with the same expiry rules as an invoice link. |
| preview | Before issue it shows the resulting invoice balance and the new customer credit. |
| comment | Internal notes on the timeline; customer-visible notes are a separate field. |
| attach | Supporting files sent with or kept beside the document, with size limit shown. |
| history | Created, sent, viewed, paid, voided, with who and when; cannot be edited. |
| link related | Shows the source quote or order, payments, credit notes and the customer. |
| notify | Customer email on send and on payment; staff alert on paid, failed, viewed or overdue. |

**room:** version

**later:** group; import; assign; follow; api (Credit notes are read by other software only after the API ships.); webhook (Credit note events go out only with the API, later.)

**no:** bulk (Each credit note is a separate tax act; none are done in bulk.); archive (Credit notes are tax records and stay in lists; views narrow them.); restore (Nothing is archived and a deleted draft does not come back.); duplicate (A second credit is made from the invoice again so the remaining creditable value is checked.); approve (Accountants issue credit notes; owners get an email on large ones instead of a sign-off.); tag (No free tags in wave 1.); remind (A credit note has no due date.); schedule (A credit note is issued when the person issues it.); custom fields (Fixed fields only.); merge

| Question | Answer |
|---|---|
| freeze | At issue the lines, tax, reason, original invoice link, customer snapshot and date are frozen; nothing changes after, not even a note. Only void reverses it. |
| number | CN/YY-YY/NNNNN from its own gapless counter per firm and year, taken at issue and read from the credit note's own issue date; a voided number stays used. A commercial non-GST credit takes no number from this series and is shown as Commercial credit. |
| fix | A wrong credit note is voided by the owner while nothing of it is spent and, if it has an IRN, within 24 hours; then a new one is issued. After that, a correcting invoice is raised for the difference. |
| money | Whole paise. Each line uses the original line's rate, SAC and place of supply with the same rounding; the credit that takes the remaining taxable value of a line to 0 carries the rest of its tax, so the notes add up to the invoice to the paisa; the total is rounded to the rupee with a round-off line, and the last credit note takes the rupee residue. |
| paid | Its payment track says where the credit went: not counted, counted on the invoice, held as customer credit, or spent. The invoice takes the credit first; only the part above the invoice balance becomes customer credit. |
| late | The limit is 30 November following the original invoice's financial year, or the annual return date if the firm records an earlier one; a later date is refused with the exact date. |
| law | Needs one reason (sales return, post-sale discount, invoice correction, deficiency in service); a post-sale discount asks whether it was agreed before the supply and reminds that the customer must reverse matching input tax; against an e-invoiced invoice it asks for its own IRN. |
| send | Issuing and sending are separate: the email goes through the outbox with the PDF and a share link, and can be repeated. |
| amount | Each line is lowered from the original, never above its remaining creditable taxable value; the credit note total must be above 0. |
| settles | One credit note settles one invoice first, then any excess sits as customer credit which can be applied to another invoice of the same customer or refunded. |
| undo | Void by the owner restores the invoice balance, only if none of its credit is applied elsewhere or refunded; the owner first unapplies the credit or reverses the refund. |
| fail | If the portal refuses the IRN the credit note stays issued and retryable; credit on the invoice already counts. A credit note never blocks on plan limits. |
| fee | No fee. Foreign-currency credit uses the invoice's own rate. |
| dispute | A dispute is closed by a credit note for the agreed amount, or no credit note and a write-off on the invoice; the reason is recorded on the document. |
| proof | The credit note PDF is the proof; it prints each application to other invoices. |
| match | Matched to its invoice by link, and to the customer credit ledger by row; nothing to match to a bank. |

**States, document:** draft (start), issued, void (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| issue | draft | issued | owner, accountant | original invoice is issued and not void; date not before the original, not in the future and not after the limit; one reason chosen; every line within its remaining creditable value; total above 0; outside any locked period | number taken, PDF stored, invoice balance lowered, excess goes to customer credit, e-invoice track started when the original has an IRN. the excess goes to customer credit less the TDS recorded on the part credited (R29); credits are added up per invoice and per customer per day and month for the large-credit alert | void | credit_note_large_alert |
| void | issued | void | owner | reason of 5 to 200 characters, none of its credit applied or refunded, and no IRN older than 24 hours | invoice balance restored, number stays used, shown as cancelled in the documents-issued summary | none: issue a new credit note | none |

**States, payment:** not_counted (start), on_invoice, credit_held, credit_spent

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| count_on_invoice | not_counted | on_invoice | system | the whole credit fits inside the invoice balance due | invoice balance lowered by the full amount | release | none |
| hold_excess | not_counted | credit_held | system | the credit is above the invoice balance; the part up to the balance lowers the invoice | a customer credit row is made for the excess | release | none |
| spend_credit | credit_held | credit_spent | owner, accountant | the held credit is applied to another invoice of the same customer or refunded in full | ledger shows applied or refunded | restore_credit | none |
| restore_credit | credit_spent | credit_held | owner | credit unapplied or the refund reversed, with a reason | credit is back in the ledger | spend_credit | none |
| release | on_invoice, credit_held | not_counted | system | the credit note is voided and none of its credit is spent | invoice balance restored, held credit removed | none: issue a new credit note | none |

**States, tax:** not_needed (start), due, pending, generated, failed, cancelled (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| require_irn | not_needed | due | system | the firm is liable for e-invoice on the credit note date; the original IRN is referenced when it has one | e-invoice record created | none: follows the firm flag at issue | none |
| start_portal_call | due, failed | pending | owner, accountant, system | credit note is issued | queued portal call | none: wait for the answer | none |
| portal_ok | pending | generated | system | portal returned an IRN | IRN and QR stored, PDF version added | cancel_irn | none |
| portal_refused | pending | failed | system | portal refused or automatic tries ended | error shown; the credit note stays issued and its credit counts | start_portal_call | einvoice_failed_alert |
| cancel_irn | generated | cancelled | owner, accountant | within 24 hours, coded reason | the credit note can then be voided | none: a cancelled IRN cannot come back | none |
| close_tax | due, failed | cancelled | system | credit note voided before any IRN | record closed | none: the credit note is void | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| number | text | yes | 16 |  | nobody; given at issue |  |
| invoice | link | yes |  |  | nobody after it is created | A credit note belongs to one issued invoice. |
| nature | choice | yes |  | gst | while draft; commercial only by the owner | Choose GST credit note or commercial credit. |
| issued_at | date | yes |  | today | while draft | The date cannot be before the invoice, in the future or after the limit. |
| reason | choice | yes |  |  | while draft | Choose one reason. |
| agreed_before_supply | flag |  |  |  | while draft; asked for a post-sale discount |  |
| note | long_text |  | 300 |  | while draft | The note is longer than 300 letters. |
| lines | list | yes | 50 |  | while draft | Each line can be lowered but never above what is left to credit. |
| round_off | money | yes | 1 |  | nobody |  |
| total | money | yes | 9999999999 |  | nobody |  |
| void_reason | text |  | 200 |  | when the owner voids | Give a reason of 5 to 200 letters. |

| List |  |
|---|---|
| search | number, invoice_number, customer |
| filters | document, payment, tax, customer, issued_at |
| sorts | issued_at, total |
| default_sort | -issued_at |
| columns | number, issued_at, customer, invoice_number, reason, total, document |
| views | All, Drafts, Issued, Void, Credit held, Tax failed |
| export | rows: selected, filtered, date range; what: credit notes, lines; formats: CSV, month zip, Tally XML; big: Over 5,000 rows runs as an export job and the link comes by email and lives 7 days. |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | document, payment | -issued_at | tenant, document, payment, issued_at | 150 ms |
| one_customer | customer | -issued_at | tenant, customer, issued_at | 100 ms |
| tax_state | tax | -issued_at | tenant, tax, issued_at | 100 ms |
| by_total |  | total | tenant, total | 200 ms |

### Expense

| Can do | How |
|---|---|
| create | Form plus inline create from inside other forms, such as a new customer while making an invoice. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | One box finds by name, email, phone, code or id; an exact id jumps to the record. |
| filter | Status, tag, owner, created date and one or two business facts such as city or stock. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| history | Who changed which field, from what, to what, and when. |

**room:** edit (An expense is edited until it is billed; a billed expense is locked.); draft; delete (Only an expense that is not billed, by owner or accountant after a confirm; a billed expense cannot be deleted.); version; attach (A receipt of JPG, PNG or PDF up to 5 MB, 3 files per expense, stored under the firm's path and shown only to the firm unless the line says Show receipt.); link related (Beside a row: its customer, its invoice and the history of who changed it.)

**later:** group; print pdf; assign; approve; follow; remind; notify; api (Expenses by API come with the API.); webhook (Expense events come with the API.)

**no:** saved view (Filters by category, vendor, date and billable are enough.); columns (Fixed columns: date, vendor, category, amount, customer, state.); bulk (Bulk expense edits are bookkeeping, not billing.); import (Rows are typed in one at a time; a spreadsheet import of old hours or old spend is not offered.); export (The full firm export carries expenses.); archive (Nothing is archived; an open entry is deleted and a billed one is locked.); restore (Nothing is archived, so nothing is restored; a deleted row is gone after its confirm.); duplicate (Copying an expense is minor; the form remembers the last vendor and category.); reverse; share link; preview; comment (The notes field is the only text.); tag (Expenses carry no tags because the category and the customer already group them.); schedule; custom fields (The fixed fields cover re-billing and nothing else is asked for.); merge (Expenses are never joined.)

| Question | Answer |
|---|---|
| identity | No uniqueness; the same vendor, amount and date twice shows a warning with a link to the earlier row and does not block. |
| snapshot | When billed, the line copies the description, amount, markup and tax treatment; later edits are refused because a billed expense is locked. |
| remove | A billed expense cannot be deleted; an unbilled one is deleted after a confirm. |
| owner | The firm owns it. Owner and accountant create, mark billable and bill; staff may add their own and cannot mark them billable; a viewer sees none. |
| contacts | One vendor name as text, not a vendor record; vendor books belong to the accountant. |
| code | No code; an expense is found by vendor, date and customer. |
| inactive | Expenses of an archived customer stay readable and can still be billed on a draft. |

**States, lifecycle:** active (start), archived

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| put_away | active | archived | owner, accountant |  | leaves the default list | bring_back | none |
| bring_back | archived | active | owner, accountant |  | returns to the list | put_away | none |

**States, billing:** recorded (start), billable, billed

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| mark_billable | recorded | billable | owner, accountant | a customer chosen, amount above 0, a receipt attached | appears under Expenses to bill for that customer | unmark_billable | none |
| unmark_billable | billable | recorded | owner, accountant | not billed | leaves the customer's unbilled list | mark_billable | none |
| bill | billable | billed | owner, accountant, staff | added to a draft invoice of the same customer by Add expenses; a line is taxable at the service's rate unless the three pure-agent ticks are all on (R68) | locked and shows the invoice number; billed twice is refused | release | none |
| release | billed | billable | system | the invoice is voided or its draft is deleted | back to billable and free to bill again | bill | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| date | date | yes |  |  | owner and accountant while not billed | Choose the day you paid, not in the future. |
| vendor | text | yes | 120 |  | owner and accountant while not billed | Enter who you paid, up to 120 letters. |
| category | choice |  |  |  | owner and accountant while not billed | Choose travel, software, printing, government fees or other. |
| amount | money | yes | 9999999.99 |  | owner and accountant while not billed | Amount is above 0 and up to 99,99,999.99 with 2 decimals. |
| gst_paid | money |  | 9999999.99 |  | owner and accountant while not billed | GST paid is 0 or more and not above the amount. |
| customer | link |  |  |  | owner and accountant while not billed | Choose the customer to bill. |
| markup_percent | number |  | 100 | 0 | owner and accountant while not billed | Markup is 0 to 100 percent, and must be 0 for a pure agent line. |
| pure_agent_receipt | bool |  |  | false | owner and accountant while not billed | Tick only if the supplier's receipt is kept. |
| pure_agent_authorised | bool |  |  | false | owner and accountant while not billed | Tick only if the customer authorised you to pay on their behalf. |
| pure_agent_no_markup | bool |  |  | false | owner and accountant while not billed | Tick only if you bill the exact cost with no markup. |
| notes | long_text |  | 300 |  | owner and accountant | Notes are up to 300 characters. |
| invoice | link |  |  |  | nobody |  |

| List |  |
|---|---|
| search | vendor, notes |
| filters | lifecycle, billing, customer, category |
| sorts | -date, vendor, -amount |
| default_sort | -date |
| columns | date, vendor, category, amount, customer, state |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| active_newest | lifecycle | -date | tenant, lifecycle, date | 100 ms |
| by_date | billing | -date | tenant, billing, date | 100 ms |
| by_category | billing, category | -date | tenant, billing, category, date | 100 ms |
| by_vendor | billing | vendor | tenant, billing, vendor | 100 ms |
| biggest | billing | -amount | tenant, billing, amount | 100 ms |
| by_customer | billing, customer | -date | tenant, billing, customer, date | 100 ms |

### Invoice

| Can do | How |
|---|---|
| create | A draft starts from the bottom plus button, from a quote, from a recurring plan, from a copy, or from a voided invoice that it replaces; the customer picker opens first and terms, place of supply and tax treatment fill from the customer. |
| edit | A draft allows every field, to owner, accountant and staff; if two people edit at once the second save is refused and shows the newer version. After issue only due date, customer note, internal note, expected payment date and the reminders switch change, each logged with old and new values; the Edit button explains the lock and offers credit note or void and re-create. The In dispute flag and its note can also be set after issue by an owner; the due date moves later only by an owner (R37). |
| draft | A draft needs only a customer and may hold zero lines; it autosaves every 30 seconds and on leaving, shows Saved 10:42, has no number, and a lost connection shows Not saved, retrying. |
| view | Header with state and amount due, lines and tax, payments, then timeline. |
| search | Number, customer name or customer GSTIN, any case, substring from 2 characters; spaces and slashes inside a number are ignored so INV2627 00001 finds INV/26-27/00001. |
| filter | Document state, payment state, e-invoice state, customer, issue date range, currency and opened by the customer, all combined with AND. Overdue is a ready view, because it is a label made from payment state and due date. |
| sort | Number, issue date, due date, total and balance due, both ways; default newest issue date first with drafts at the top; the choice stays in the page address. |
| saved view | Named filters like Unpaid, Overdue, This month, kept per person or shared. |
| columns | Pick columns such as number, customer, due, balance; choice is kept. |
| bulk | Send email, send reminder, download PDFs and issue reviewed drafts, each row on its own; failed rows are listed with the reason and a Retry. Issuing many takes numbers in issue date order and stops at the free-plan limit with the rest listed. |
| import | Opening unpaid invoices only: one row per invoice, kept as migrated and read-only, original number and date kept, counters untouched; a bad row stops only itself. |
| export | Selected rows, the current filter or a date range; one row per invoice or one per line; CSV with a byte-order mark, a zip of CSV files per month, Tally XML or a zip of PDFs; large sets come by email. |
| delete | Drafts only, by owner or accountant after a confirm; one history row keeps draft id, who, customer and total. An issued or void invoice is never deleted. |
| duplicate | Makes a new draft with the same customer, lines, place of supply and notes; today's date, no number, no payments, no IRN and no attachments. |
| version | Issue stores PDF version 1 with its hash and template version; the IRN and QR, a due-date edit or a note edit each store a newer version; every earlier file stays readable and listed. |
| reverse | Three separate acts: void for an invoice with nothing counted against it, a credit note for any issued invoice, and reversal of a payment. The invoice itself is never edited back. |
| print pdf | A4 GST layout with every legal field, stored once at issue with its hash and served unchanged; the file name is the number with slashes turned into hyphens; Indian-style words and scripts print correctly. A viewer's copy is made without the bank block and UPI ID, as the firm profile says viewers do not see them. |
| share link | A read-only page for this invoice only, random token of at least 128 bits, 30 days by default (owner picks 1 to 365), revocable, no login; shows first and last view; UPI button and QR only while balance is above 0; says cancelled after a void. The page also offers Something is wrong (wrong GSTIN, wrong amount, not ours, already paid, with a text box), I deduct TDS on the claim, a receipt download after a confirmed payment, a request for a fresh link on an expired page, 'Replaced by' on a cancelled one, and the last four digits of the account with the date the bank details last changed. |
| preview | A dry run of the final PDF and email with totals and number format, without taking a number, on phone and desktop width. |
| comment | Internal notes on the timeline; customer-visible notes are a separate field. |
| attach | Supporting files sent with or kept beside the document, with size limit shown. |
| remind | 1, 7 and 15 days after due date, at most 3 per invoice, between 9 am and 7 pm IST, one message per customer listing all overdue invoices; 3 days before due is optional and off by default; stops at paid, credited or void; paused by an expected payment date or the per-invoice off switch. |
| history | Created, sent, viewed, paid, voided, with who and when; cannot be edited. |
| link related | Shows the source quote or order, payments, credit notes and the customer. |
| notify | Customer email on send and on payment; staff alert on paid, failed, viewed or overdue. |

**room:** approve (No approval step: staff draft, accountant or owner issues, and that is the second pair of eyes. A slot stays between draft and issued for an approval limit later.); schedule (Repeating is done by a recurring plan that only creates review drafts; sending later is not in wave 1.)

**later:** group; assign; follow; api (Read and write by API waits for the integration build, together with webhooks.); webhook (Events for issued, paid and voided come with the API, not in wave 1.)

**no:** archive (An invoice is never put away: settled and void ones leave the default view through filters and views, and the books stay whole for at least 8 years.); restore (Nothing is archived and only drafts are deleted; a deleted draft does not come back.); tag (No free tags in wave 1; PO number, PO date and project reference are the fixed labels.); custom fields (A firm cannot add fields of its own; the fixed header holds PO number, PO date, project reference and service period.); merge

| Question | Answer |
|---|---|
| freeze | At issue the customer snapshot, firm block with bank and logo, lines, amounts, issue date, place of supply and exchange rate are frozen. Only due date, customer note up to 500, internal note up to 1,000, expected payment date and the reminders switch change after, each logged. |
| number | Given only at issue from a counter per firm, prefix and financial year, shaped PREFIX/YY-YY/NNNNN and at most 16 characters, starting at 00001 each 1 April, with no gaps: a failed issue or a deleted draft takes none, and a voided number stays used. The database refuses a second row with the same firm, type, series, year and sequence. The IST date is read once inside the issue step, so 00:30 on 1 April takes the new year. |
| fix | Nothing is edited. Void is owner-only, needs no counted payment, credit note or live IRN, and a reason of 5 to 200 characters. A credit note works on any issued invoice up to 30 November after the year end, or the annual return date if the firm filed earlier. Void and re-create copies a voided invoice into a new draft linked both ways. Once an IRN is older than 24 hours only the credit note remains. |
| money | Whole paise in integers. Line taxable is quantity times rate less discount, half-up to paise; tax per line half-up (CGST and SGST each tax over 200 inside the state, IGST over 100 across states); the total is rounded to the rupee with a labelled round-off line. Foreign invoices keep amount, currency, rate to 4 decimals with its source and the INR of every line. The server recomputes at issue and refuses a total that differs by one paisa. |
| paid | Its own track beside the document: unpaid, part_paid, paid, credited, written_off. Balance due is the total less non-reversed payments and TDS, credit notes, applied customer credit and write-off, never below 0. Overdue is only a label for an issued or part-paid invoice whose due date is before today in IST. |
| late | Reminders at 1, 7 and 15 days after the due date, with balance due and pay link, in the 9 am to 7 pm IST window; due dates count calendar days and never shift for Sundays. A promise-to-pay date pauses reminders until the day after it. Nothing changes state when an invoice is late. |
| law | Firm name, address and GSTIN, number, date, recipient, SAC, taxable value, rate, tax, place of supply, reverse-charge line and amount in words; titled Tax Invoice; Bill of Supply or Invoice-cum-Bill of Supply only for a registered composition or exempt supplier; an unregistered firm issues a plain Invoice with no tax lines. A firm over Rs 5 crore also gets an IRN and signed QR; cancelling an IRN is allowed only within 24 hours; issuing more than 30 days after the service date warns. |
| send | Issued means numbered and frozen. Sending is a separate act, repeatable: email through the outbox with extra To, Cc and Bcc for that send, WhatsApp click-to-chat with the share link, copy link or download PDF. A draft cannot be sent. |
| amount | Payment above 0 with 2 decimals; payment plus TDS cannot exceed the balance due, and a larger one is refused in plain words because advance receipts are wave 2. A foreign payment records amount received, INR credited, bank charge and exchange gain or loss. |
| settles | Through allocation rows: one payment may be split across several invoices of the same customer and the sum never passes the payment. An invoice takes payments only while issued or part-paid; draft, paid, credited and void invoices refuse them. |
| undo | The owner reverses a payment with a reason of 5 to 200 characters; whoever saved it may undo within 10 seconds with no reason. The row stays listed as reversed, balance and state are recalculated and the receipt number is never reused. |
| fail | No gateway in wave 1, so no failed charge. A UPI I-have-paid claim waits as Pending check and counts for nothing until confirmed; a bounced cheque reverses the payment; a payment that would overpay is refused. |
| fee | No gateway fee. Only a foreign bank charge and an exchange gain or loss are stored, beside the dollar value the invoice settles at. |
| dispute | No chargebacks without a gateway. A customer dispute ends as an agreed credit note or an owner write-off with a reason; the invoice and its number stay. While an owner has marked it In dispute, or after the customer pressed Something is wrong, reminders stop and a chip shows (R40). |
| proof | A receipt REC/YY-YY/NNNNN from its own gapless counter, marked not a tax document; the invoice itself is the tax proof. |
| match | By hand: the person picks the invoice and amount. A UPI QR cannot prove money arrived, so only the owner or accountant records it; bank statement lines are not read in wave 1. |

**States, document:** draft (start), issued, void (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| issue | draft | issued | owner, accountant, staff | customer chosen, 1 to 50 lines, total above 0, issue date not future and not before the latest issued date in the series, outside any locked period, firm has the details its tax scheme needs, plan limit not reached; rates in force on the date are shown and clicked through if they changed. issue date in the same financial year as today in IST (R37); staff only when the switch 'May issue' is on for that person and the total is within the cap set for them | number taken, fields frozen, PDF rendered and stored with hash, e-invoice track started when the firm and customer need it, plan counter goes up by 1. an invoice issued as the corrected copy of a voided one does not count against the plan limit; the history names the issuer | void, or credit_note | none |
| void | issued | void | owner | no counted payment, no active credit note, no live IRN, no draft credit note, reason of 5 to 200 characters. no applied customer credit and no write-off (an owner unapplies or undoes it first), no pending I-have-paid claim; when the due date of the return month has passed the screen warns that the return may be filed and offers a credit note instead, and the reason must say it was not filed | number stays used, PDF gets a CANCELLED mark and date, share link says cancelled, counts as cancelled in the documents-issued summary, plan counter goes down only for a void within 24 hours with nothing sent or viewed (R42), the cancelled page shows 'Replaced by' the corrected copy and the send step is pre-filled with both numbers (J09) | none: copy it into a new draft with void and re-create | invoice_voided_alert |
| request_void | issued | issued | accountant | reason of 5 to 200 characters; an owner exists in the firm | every owner is mailed one tap to open the invoice and Void it; nothing changes until an owner does | none: withdraw by asking the owner not to void | void_requested |

**States, payment:** unpaid (start), part_paid, paid, credited, written_off

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| record_part | unpaid, part_paid | part_paid | owner, accountant | invoice is issued; amount plus TDS is below the balance due | allocation row added, balance lowered | reverse_to_part or reverse_to_unpaid | none |
| record_full | unpaid, part_paid | paid | owner, accountant | amount plus TDS equals the balance due to the paisa | balance reaches 0, reminders stop, payment share of the share page shows paid | reverse_to_unpaid or reverse_to_part | none |
| reverse_to_part | paid | part_paid | owner | reason of 5 to 200 characters, or by the saver within 10 seconds; other money or credit still counts; a credit already spent elsewhere is not needed back | balance rises, receipt number stays used, reminders restart from the due date | record the payment again | payment_reversed_alert |
| reverse_to_unpaid | paid, part_paid | unpaid | owner | reason of 5 to 200 characters, or by the saver within 10 seconds; nothing else counts against the invoice | balance returns to the full total less credits, receipt number stays used | record the payment again | payment_reversed_alert |
| credit_lowers | unpaid, part_paid | part_paid | system | a credit note issues or customer credit is applied and the balance stays above 0 | balance lowered by the credit | credit_returns_part | none |
| credit_clears | unpaid | credited | system | credit alone brings the balance to 0 and no money or TDS counts | balance 0 and the state says Credited, not Paid; reminders stop | credit_returns_all | none |
| credit_settles | part_paid | paid | system | credit brings the balance to 0 and some money or TDS counts | balance 0, reminders stop | credit_returns_part | none |
| credit_returns_part | paid, credited | part_paid | system | a credit note is voided or applied credit is returned and the balance goes above 0 but below the total | balance rises by the credit returned | credit_lowers | none |
| credit_returns_all | credited | unpaid | system | the last credit counting against it is voided or returned and no money counts | balance back to the full total | credit_clears | none |
| write_off | unpaid, part_paid | written_off | owner, accountant | amount above 0 and at most the balance due, reason of 5 to 200 characters. an accountant only up to Rs 10.00 per invoice and only with the reason rounding; an owner without that limit | balance goes to 0 as write-off, not as a payment; tax already charged stays in the registers; reminders stop | undo_write_off_part or undo_write_off_unpaid | none |
| undo_write_off_part | written_off | part_paid | owner | reason of 5 to 200 characters; some money or credit still counts | written-off amount returns to the balance | write_off | none |
| undo_write_off_unpaid | written_off | unpaid | owner | reason of 5 to 200 characters; nothing else counts | written-off amount returns to the balance | write_off | none |

**States, tax:** not_needed (start), due, pending, generated, failed, cancelled (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| require_einvoice | not_needed | due | system | firm is flagged for e-invoice and the customer has a GSTIN, or the supply is export, SEZ or deemed export; never for a B2C invoice | e-invoice record created, due-by date set, warning counted down | none: the flag follows the firm and the customer at the moment of issue | none |
| start_portal_call | due, failed | pending | owner, accountant, system | invoice is issued and the 30-day window for turnover of Rs 10 crore or more is not over | queued portal call, never inline | none: wait for the answer, the record explains it | none |
| portal_ok | pending | generated | system | portal returned an IRN, or says the IRN already exists | IRN, ack number, ack date and signed QR stored, PDF version added. a send that was waiting for the IRN goes out by itself and the owner is told (R12) | cancel_irn | none |
| portal_refused | pending | failed | system | portal refused or 5 automatic tries ended | error code and message show on the invoice; the invoice stays issued and payable | start_portal_call | einvoice_failed_alert |
| cancel_irn | generated | cancelled | owner, accountant | within 24 hours of generation, no counted payment or credit note, coded reason chosen | cancelled IRN is never reused; the invoice can then only be voided | none: a cancelled IRN cannot come back, make a new invoice | none |
| close_tax | due, failed | cancelled | system | invoice voided before any IRN was generated | record closed, due-by warning stops | none: the invoice is void | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| number | text | yes | 16 |  | nobody; given at issue |  |
| in_dispute | choice | yes |  | no | owner after issue; owner, accountant and staff while draft | Choose yes or no; a dispute needs a note. |
| dispute_note | text |  | 300 |  | owner | The dispute note is longer than 300 letters. |
| customer | link | yes |  |  | while draft | Choose a customer. |
| supply_type | choice | yes |  | from the customer: B2B, B2C, export under LUT, export with IGST, SEZ with or without payment, reverse charge | while draft | Choose the type of supply; it decides the tax. |
| place_of_supply | choice | yes |  | the customer's billing state | while draft; locked at issue | Choose the place of supply; it decides CGST and SGST or IGST. |
| issued_at | date | yes |  | today | while draft; refreshed to today at Issue unless the person typed a date | The date cannot be in the future or before the last issued invoice. |
| due_at | date | yes |  | issue date plus the customer's terms, else the firm's 15 days | while draft, then owner or accountant any time, never before the issue date | Due date is before the issue date. |
| service_from | date |  |  |  | while draft | Service period start is after its end. |
| service_to | date |  |  |  | while draft | Service period end is before its start. |
| currency | choice | yes |  | the customer's currency | while draft; the customer's currency cannot change once an invoice exists | Choose a currency from the firm's list. |
| exchange_rate | number |  | 9999999 | last rate used for that currency | while draft; locked at issue | Enter a rate above 0 with up to 4 decimals; no rate is saved for this date. |
| lines | list | yes | 50 |  | while draft | Add 1 to 50 lines, each with a description, a quantity above 0 and a rate. |
| round_off | money | yes | 1 |  | nobody |  |
| total | money | yes | 9999999999 |  | nobody |  |
| po_number | text |  | 40 |  | while draft | The PO number is longer than 40 letters. |
| po_date | date |  |  |  | while draft | Enter a real date. |
| project_ref | text |  | 60 |  | while draft | The project reference is longer than 60 letters. |
| customer_note | long_text |  | 500 | the firm's default note | any time, owner and accountant; each change logged and saved as a new PDF version | The note is longer than 500 letters. |
| internal_note | long_text |  | 1000 |  | any time, owner and accountant, never printed or shared | The note is longer than 1,000 letters. |
| expected_payment_on | date |  |  |  | owner and accountant, any time while unpaid | The promise date cannot be before today. |
| reminders_off | flag |  |  | false | owner and accountant, any time |  |
| needs_review | flag |  |  | false | set by recurring and import; cleared by owner or accountant before issue |  |
| source | choice | yes |  | manual | nobody |  |
| replaces | link |  |  |  | set when copied from a voided invoice; nobody after |  |

| List |  |
|---|---|
| search | number, customer, gstin |
| filters | document, payment, tax, customer, issued_at, currency, opened |
| sorts | number, issued_at, due_at, total, balance |
| default_sort | -issued_at |
| columns | number, issued_at, due_at, customer, currency, total, balance, document, payment, tax |
| views | All, Drafts, Needs review, Unpaid, Overdue, This month, Opened, Tax pending, Tax failed, Voided |
| bulk | send, remind, download, issue |
| bulk_fail | Each row goes alone; the rest go through and failed rows are listed with the reason and a Retry. |
| export | rows: selected, filtered, date range; what: invoices, lines, sales register; formats: CSV, month zip, Tally XML, PDF zip; big: Over 5,000 rows runs as an export job and the link comes by email and lives 7 days; one request holds at most 50,000 rows, so a larger range is asked to be split by financial year. |
| import | match: firm, series and original number; a clash is rejected row by row; errors: a CSV of row, field and reason; re-uploading skips rows already added; limit: 5 MB and 5,000 rows |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | document, payment | -issued_at | tenant, document, payment, issued_at | 150 ms |
| overdue | payment | due_at | tenant, payment, due_at | 150 ms |
| one_customer | customer | -issued_at | tenant, customer, issued_at | 100 ms |
| tax_state | tax | -issued_at | tenant, tax, issued_at | 100 ms |
| by_currency | currency | -issued_at | tenant, currency, issued_at | 150 ms |
| opened | opened | -issued_at | tenant, opened, issued_at | 150 ms |
| by_number |  | number | tenant, number | 100 ms |
| by_total |  | total | tenant, total | 200 ms |
| by_balance |  | balance | tenant, balance | 200 ms |

### Subscription

| Can do | How |
|---|---|
| create | Made by the system when a firm signs up, in trial. Nobody adds a second one; a second business needs its own firm and plan. |
| edit | Owner changes plan or monthly and yearly period; upgrades start now with proration shown first, downgrades start at period end and are refused with the number of users to deactivate when the new plan has fewer seats. |
| view | Amount, method, state, fees, the document it settled, and the payer. |
| version | Money-affecting settings keep dated values so old documents compute the same. |
| reverse | Cancel at period end can be undone until the date; a plan change at period end can be withdrawn; a charge itself is refunded by support outside the app. |
| preview | The upgrade and plan-change dialog shows the prorated amount with GST before the owner confirms. |
| remind | Owner is told 7 and 1 days before the trial ends, at 80 and 100 percent of the invoice limit, and on day 1, 3 and 6 of a failed payment. |
| schedule | Retry failed payments on a schedule; scheduled or recurring charges belong to the plan. |
| history | Every state change with time and gateway message; kept forever. |
| link related | Shows the document, customer, refunds, payout and dispute together. |
| notify | Owners only: trial, limit, failed renewal, read-only, cancel and a pre-debit notice at least 24 hours before an auto-debit. Accountants and staff see the banner but get no email. |

**room:** custom fields

**later:** draft; group; bulk; import; share link; approve; attach; tag; api (Plan reads come with the public API.); webhook (Plan events come with the public API.)

**no:** search (One row per firm; the billing page is not a list.); filter (One row per firm; the billing page is not a list.); sort (One row per firm; there is nothing to order.); saved view (One row per firm, so no views are kept.); columns (One row per firm, so no columns are chosen.); export (Plan history leaves with the full firm export, which works in read-only and after cancellation.); delete (A subscription is never deleted; cancelling ends renewal and the history of plans and payments stays.); archive (Nothing is hidden; cancelled is a state the billing page shows with the last paid day.); restore (Paying again returns the same subscription to active at once; nothing is restored from an archive.); duplicate (A plan is never copied between firms.); print pdf (The paper is our GST invoice for each period, made as a separate document and listed on the billing page.); assign; comment (No thread; the optional cancel reason is stored once.); follow; merge (One firm has one subscription; two are never joined.)

| Question | Answer |
|---|---|
| amount | Rupees in paise, the plan price per month or per year with GST added, shown with GST on the price page; an upgrade is prorated and the figure is shown before confirming. The yearly toggle shows the saving. |
| settles | One plan period of one firm. Each paid period gets our own GST invoice carrying the firm's GSTIN, emailed within 24 hours of payment, so the firm can claim input credit. |
| undo | Cancel at period end keeps full use until the date, shows the date and can be undone until then. A paid period is not refunded by the app; a wrong charge is refunded by support and noted in the history. |
| fail | A failed renewal retries for 3 days with full use, then 7 days of grace counted from the first failure with a banner and emails on day 1, 3 and 6, then read-only. The firm pays by UPI AutoPay, card or one-time UPI. |
| fee | The gateway fee is ours; the firm pays the listed price and never sees a fee line. |
| dispute | A charge the firm disputes with its bank is handled as a failed renewal until support settles it; books and exports stay open meanwhile. |
| proof | The firm's own GST invoice for the plan, with number and GSTIN, plus a billing page with payment method, next charge date and amount. |
| match | The gateway reference and our plan invoice number are stored on each period, and the billing page lists them with the next charge date. |
| scope | One subscription per firm; users and accountant seats are counted per firm, and a second business needs an upgrade and its own firm. |
| used | Users and issued invoices use the plan's limits. A change never touches old invoices, payments or books; they stay open in every state. |
| default | A new firm starts in trial; when the trial ends without a paid plan the firm moves to Free and is never blocked. Only the owner can change the plan. The trial and the free allowance are given once per owner email and per PAN when given (R45). |
| effective | Upgrades start now with proration; downgrades start at period end; a cancel takes effect after the paid period; the plan table behind the limits is product-owned and effective-dated. |
| order | Plans have a fixed order, Free then paid; the owner picks one and cannot reorder anything. |
| who | Owner only for plan, billing details and cancel; accountant sees the plan read-only and gets 403 on a change; staff and viewer see only the banner; support sees it only under an owner's grant. |
| limit | Free allows 10 issued invoices a month, counted in IST from the 1st; a void within 24 hours with nothing sent or viewed does not count, and the corrected copy never counts (R42). Only a new issued invoice is blocked at the limit; credit notes, payments, voids and exports stay open. The message names the limit, the allowance and the reset date. Alerts at 80 and 100 percent. |

**States, payment:** trial (start), free, active, past_due, grace, read_only, cancelled

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| trial_ends | trial | free | system | trial end date reached and no paid plan chosen | firm is on Free with its limit; issues already made this month count; nothing is blocked except a new issue over the limit. users above the Free limit become viewers (the oldest stay) and the owner is told | upgrade | sub_trial_over |
| upgrade | trial, free | active | owner | payment method accepted; the prorated amount was shown and confirmed | paid limits start at once, our GST invoice is made for the period | cancel, or switch_to_free at period end | sub_plan_changed |
| renewal_fails | active | past_due | system | the charge for the next period failed | full use continues, banner shows, the failure day is day 1 of the 7-day grace (R44) and retries run inside it | pay_again | sub_renewal_failed |
| retry_paid | past_due | active | system | a retry inside the grace was paid | banner goes, period continues | none: a new failure starts the move again | none |
| grace_starts | past_due | grace | system | the renewal failed (the same day, day 1) | banner and emails on day 1, 3 and 6 of the 7 days; full use continues | pay_again | sub_grace |
| go_read_only | grace | read_only | system | day 8 after the failure has begun (00:00 IST) | viewing, share links, payments, exports and downloads stay; new invoice and quote issue and their mails stop; reminders, receipts, credit note mails and void notices still go, because money is owed | pay_again | sub_read_only |
| pay_again | past_due, grace, read_only | active | owner, system | a payment succeeded | full use returns at once, nothing is lost | none: a new failure starts the move again | sub_plan_changed |
| cancel | active | cancelled | owner | in at most 3 taps; one optional reason | full use until the period end, the last paid day is shown, exports stay open | undo_cancel until the date | sub_cancel_set |
| undo_cancel | cancelled | active | owner | period end has not passed | renewal continues as before | cancel | none |
| period_ends | cancelled | free | system | paid period is over | firm moves to Free; users above the Free limit become viewers; books, share links and exports stay open for at least 8 years | pay_again or switch_to_free | sub_read_only |
| refund_charge | active | active | support | a charge made in the last 30 days, not refunded before, a ticket number typed | the charge goes back to the original payment method through the provider, a history row names the ticket and the owner is emailed | none: a refund cannot be recalled; charge again by upgrading | sub_refund_notice |
| switch_to_free | active, read_only | free | owner, system | active users and issued data fit Free; otherwise refused with how many users to deactivate | an active firm keeps paid use until period end and the system makes the move then; a read-only firm moves at once | upgrade | sub_plan_changed |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| plan | choice | yes |  | free | owner; upgrade now, downgrade at period end | Choose a plan. |
| billing_period | choice | yes |  | monthly | owner; at period end | Choose monthly or yearly. |
| trial_ends_at | date |  |  |  | nobody |  |
| period_ends_at | date |  |  |  | nobody |  |
| grace_ends_at | date |  |  |  | nobody |  |
| user_limit | number | yes | set by the plan table |  | nobody | This plan allows fewer users; deactivate some first. |
| issued_limit | number | yes | Free 10 a month; paid set by the plan table |  | nobody | You have used all issued invoices of this month. They reset on the 1st. |
| issued_count | number | yes | 0 up to the limit for Free |  | nobody |  |
| pending_plan | choice |  |  |  | owner, until period end | Choose the plan that starts at period end. |
| cancel_reason | text |  | 300 |  | owner, at cancel | The reason is longer than 300 letters. |
| payment_method_ref | text |  | 120 |  | nobody |  |

### Time Entry

| Can do | How |
|---|---|
| create | Form plus inline create from inside other forms, such as a new customer while making an invoice. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | One box finds by name, email, phone, code or id; an exact id jumps to the record. |
| filter | Status, tag, owner, created date and one or two business facts such as city or stock. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| history | Who changed which field, from what, to what, and when. |

**room:** edit (Its maker edits an open entry; an approved or billed entry is changed only after it is unapproved or freed.); draft; bulk (Approve and bill several selected entries at once; the result says how many were done and lists the rows it skipped with the reason.); export (A CSV with date, person, customer, task, hours, rate, amount and invoice number.); delete (Only an open entry, by its maker or an owner or accountant; a billed entry cannot be deleted.); version; link related (Beside a row: its customer, its invoice and the history of who changed it.)

**later:** group; print pdf; assign; approve; follow; remind; notify; api (Time entries by API come with the API.); webhook (Entry events come with the API.)

**no:** saved view (Filters by person, customer, week, billable and billed state are enough.); columns (Fixed columns: date, person, customer, task, hours, rate, state.); import (Rows are typed in one at a time; a spreadsheet import of old hours or old spend is not offered.); archive (Nothing is archived; an open entry is deleted and a billed one is locked.); restore (Nothing is archived, so nothing is restored; a deleted row is gone after its confirm.); duplicate (Copying an entry is minor; the form remembers the last customer and task.); reverse; share link; preview; comment (The note field is the only text.); attach (No files on an entry.); tag (Entries carry no tags because the customer and the task already group them.); schedule; custom fields (The fixed fields cover billing hours and nothing else is asked for.); merge (Entries are never joined; the bill step groups them.)

| Question | Answer |
|---|---|
| identity | No two entries are joined; two entries of the same person, customer and day are allowed, and one person may not log more than 24 hours on one day. |
| snapshot | The rate is stamped when an entry is approved: the customer's rate, else the person's rate, else the service's rate, and the line shows which was used. Later rate edits do not change approved or billed entries. |
| remove | A billed entry cannot be deleted. An open entry is deleted by its maker, owner or accountant after a confirm. |
| owner | The firm owns it. Staff see and edit only their own entries while open; owner and accountant see all, approve and bill; a viewer sees none. |
| contacts | One person, one customer and one task per entry. |
| code | No code; an entry is found by person, customer and date. |
| inactive | Entries of an archived customer stay readable and can still be billed on a draft; an archived service stays on old entries. |

**States, lifecycle:** active (start), archived

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| put_away | active | archived | owner, accountant |  | leaves the default list | bring_back | none |
| bring_back | archived | active | owner, accountant |  | returns to the list | put_away | none |

**States, billing:** open (start), approved, billed

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| approve | open | approved | owner, accountant | billable, hours above 0 in 0.25 steps and a customer chosen; rate is stamped and rounded to the firm's step | joins Unbilled time for that customer | unapprove | none |
| unapprove | approved | open | owner, accountant | not billed | the maker may edit it again | approve | none |
| bill | approved | billed | owner, accountant, staff | added to a draft invoice of the same customer by Add unbilled time; each group becomes one line with hours as quantity | locked and shows the invoice number; billed twice is refused | release | none |
| release | billed | open | system | the invoice is voided or its draft is deleted | the entry is open again and can be approved and billed on another invoice | bill | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| date | date | yes |  |  | its maker while open; owner and accountant | Choose the day the work was done, not in the future. |
| person | link | yes |  |  | nobody; the maker, or an owner or accountant for someone else |  |
| customer | link | yes |  |  | its maker while open | Choose the customer. |
| task | text |  | 120 |  | its maker while open | The task is up to 120 letters. |
| hours | number | yes | 24 |  | its maker while open | Hours are in 0.25 steps, above 0 and not over 24 a day for one person. |
| billable | bool | yes |  | true | its maker while open | Choose billable or not. |
| rate | money |  | 9999999.99 |  | owner and accountant while open, stamped at approval | Rate is 0 to 99,99,999.99 with 2 decimals. |
| note | long_text |  | 300 |  | its maker while open | The note is up to 300 characters. |
| invoice | link |  |  |  | nobody |  |

| List |  |
|---|---|
| search | task, note |
| filters | lifecycle, billing, person, customer, billable |
| sorts | -date, customer, person |
| default_sort | -date |
| columns | date, person, customer, task, hours, state |
| export | rows: filtered, all; what: time entries; formats: CSV; big: over 5,000 rows runs in the background and the link comes by email |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| active_newest | lifecycle | -date | tenant, lifecycle, date | 100 ms |
| by_week | billing | -date | tenant, billing, date | 100 ms |
| by_customer | billing, customer | -date | tenant, billing, customer, date | 100 ms |
| billable_only | billing, billable | -date | tenant, billing, billable, date | 100 ms |
| by_person | billing, person | -date | tenant, billing, person, date | 100 ms |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Setup guide | /setup | wizard | owner | Continue setup | home, firm_switcher, sign_up |  |  |  |
| Home | / | home | owner, accountant, staff, viewer | New invoice | menu |  |  |  |
| Search | /search | list | owner, accountant, staff, viewer | Search | menu, home | Type a number, a name, a GSTIN or an amount. Spaces and slashes in a number are ignored. | Nothing matches. Check the spelling, or try only the last digits of the number. |  |
| Invoices | /invoices | list | owner, accountant, staff, viewer | New invoice | home, menu, customer, search | No invoices yet. Make your first one, it takes about two minutes. | No invoice matches these filters. Clear them or widen the dates. |  |
| Write an invoice | /invoices/new | form | owner, accountant, staff | Issue | invoices, home, invoice, customer, quote, recurring_plans, setup_guide, search |  |  | Invoice is issued and the number is taken. Send it now on WhatsApp or by email, or copy the link. |
| An invoice | /invoices/:id | detail | owner, accountant, staff, viewer | Record payment | invoices, search, customer, payments, payment, credit_note, outbox, einvoice_queue, history, link |  |  |  |
| Credit notes | /credit-notes | list | owner, accountant, viewer | New credit note | menu, invoice | No credit notes yet. They are made from an invoice that needs a correction. | No credit note matches these filters. Clear them or widen the dates. |  |
| Write a credit note | /credit-notes/new | form | owner, accountant | Issue credit note | credit_notes, invoice |  |  | Credit note is issued and linked to its invoice. Send it to the customer or leave it as credit. |
| A credit note | /credit-notes/:id | detail | owner, accountant, viewer | Send credit note | credit_notes, invoice, customer, search |  |  |  |
| A customer | /customers/:id | detail | owner, accountant, staff, viewer | New invoice | customers, invoice, search, credit_register |  |  |  |
| Invoice page for the customer | /d/:token | public | client | Pay with UPI | link |  |  |  |
| Your documents | /c/:token/home | public | client | Pay selected | client_sign_in, link | Nothing yet. Invoices and quotes from the firm will show here. | No document in this period. |  |
| Time | /time | list | owner, accountant, staff | Add time | menu, customer | No time logged. Add the hours you spend on a customer, then bill them on an invoice. | No entry matches. Try another person, customer or week. |  |
| Expenses to bill | /expenses | list | owner, accountant, staff | Add expense | menu, customer | No expenses. Add one you paid for a customer and bill it back on the next invoice. | No expense matches. Try another vendor, customer or category. |  |
| Plan and billing | /settings/billing | settings | owner, accountant, support | Upgrade | settings, home, support_console, link |  |  |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| credit_note_large_alert | credit_note.issue | owner | email, app | Credit note {number} for {total} was issued against invoice {invoice} for {customer} by {actor}. It is above {limit}, or the credits on that invoice or for that customer today or this month together pass it, so every owner is told. |
| invoice_voided_alert | invoice.void | owner, accountant | email, app | Invoice {number} for {customer} was voided by {actor}. The number stays used, the link now says cancelled and reminders stopped. The customer was not mailed. |
| payment_reversed_alert | invoice.reverse_to_part | accountant, recorder | app | Payment {receipt} on invoice {number} was reversed by {actor}. {balance} is due again and reminders restart from the due date. Owners get the email; you get this note only. |
| sub_trial_over | subscription.trial_ends | owner | email, app | The trial of {firm} ended on {date}. You are on the Free plan with {limit} invoices a month and {used} are used. Nothing is blocked except new invoices above the limit. |
| sub_plan_changed | subscription.upgrade | owner | email, app | The plan of {firm} is {plan} from {date}. {detail} |
| sub_renewal_failed | subscription.renewal_fails | owner | email, app | The renewal for {firm} failed on {date}. Everything works as before and we try again for 3 days. Update the payment method to avoid a pause. |
| sub_grace | subscription.grace_starts | owner | email, app | Payment for {firm} is still due. {days_left} days are left before the firm becomes read only. Full use continues until then. |
| sub_read_only | subscription.go_read_only | owner | email, app | {firm} is read only because {reason}. Viewing, sharing, payments and exports stay open. New invoices and edits return the moment the plan is paid. |
| sub_cancel_set | subscription.cancel | owner | email, app | The plan of {firm} ends on {end_date}. You keep full use until then and exports stay open. You can undo this before that day. |
| void_requested | invoice.request_void | owner | email, app | {actor} asks you to void invoice {number} for {customer}: {reason}. Nothing has changed. Open the invoice and press Void, or ignore this. |
| sub_refund_notice | subscription.refund_charge | owner | email | Support refunded {amount} charged on {date} for ticket {ticket}. It returns to your original payment method. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A010 | Share link visitors see only the one document it was made for, never the customer's other invoices; the customer's other documents and statement are on the customer's password-protected client page, never on a document link. | now | invoice.share_link |
| A016 | Plan, billing details and cancellation are owner-only; accountants see the plan read-only and get 403 on changes. | now | subscription.who |
| A019 | Accountant may edit a draft created by someone else; history records both the creator and the editor. | now | invoice.edit |
| A027 | Time billing: staff log hours against a customer and rate; Bill selected entries builds invoice lines, marks entries billed, and voiding the invoice frees them. | room | time_entry.bill |
| A028 | Expenses re-billed to a customer become invoice lines from stored expense entries with receipt attached; billed entries cannot be billed twice. | room | expense.bill |
| A034 | Owner can record an expected payment date (promise to pay) on an invoice; its reminders pause until the day after that date, and the date is kept apart from the due date. | now | invoice.expected_payment_on |
| A035 | Owner can write off a small remaining balance with a reason; it reduces balance as write-off, not as a payment, and shows on reports. | now | invoice.write_off |
| A037 | Owner or accountant can lock a period up to a date and only an owner can move the date back, with a reason; no document with issue date on or before it can be created, edited, voided or reversed, and the error names the lock date. | now | invoice.issue, invoice.void |
| A039 | Onboarding takes signup, firm name, state and optional GSTIN, then lands on a new invoice screen; a first invoice is issuable within five minutes and at most 12 taps on a phone. | now | invoice.create |
| A040 | Cancelling the subscription turns the firm read-only after the paid period; invoices, payments, share links and exports stay reachable for as long as books must be kept (at least 8 years), and paying again restores full use at once. | now | subscription.cancel, subscription.period_ends |
| A043 | At issue the firm's legal name, address, GSTIN, bank block and logo are copied onto the invoice; later profile edits never change a reprint. | now | invoice.freeze |
| A046 | Timestamps are stored in UTC and shown in IST; FY, due-date and reminder logic all use the IST calendar date. | now | invoice.number |
| A047 | Database enforces unique (firm, document type, series, FY, sequence); a second insert of the same number fails at the database, not only in code. | now | invoice.number |
| A050 | Customer holds tax type: registered, composition, SEZ, unregistered, overseas or UIN holder; it drives tax split, invoice title and register section. | now | invoice.supply_type |
| A054 | Invoice carries optional customer PO number, PO date, project reference and service period from and to, all printed when filled. | now | invoice.po_number, invoice.project_ref |
| A055 | Invoice stores supply type: B2B, B2C, export with payment of IGST, export under LUT, SEZ with payment, SEZ without payment, or reverse charge. | now | invoice.supply_type |
| A056 | Each line stores tax nature: taxable, nil-rated, exempt, non-GST or zero-rated, so GST returns split them correctly. | now | invoice.lines |
| A058 | Firm stores one bank account (bank name, account number, IFSC, optional SWIFT) and a UPI ID; each invoice prints them; several accounts are wave 2. | now | invoice.print_pdf |
| A059 | LUT record per firm per FY: LUT number, valid-from, valid-to and ARN; export invoices under LUT read it and print its number. | now | invoice.supply_type |
| A060 | GST rates and SAC master are effective-dated tables; an invoice uses the rate in force on its date of supply, never a hard-coded list. | now | invoice.money |
| A062 | Foreign-currency invoices store currency, exchange rate to 4 decimals, rate source and date, and the INR equivalent of every amount. | now | invoice.currency, invoice.exchange_rate |
| A063 | Saved services catalogue holds name, SAC, rate, tax rate and unit; lines copy values so later catalogue edits do not change issued invoices. | now | invoice.lines |
| A064 | Subscription record stores plan, status, trial end, period end, limits and per-month issued-invoice count used for plan limits. | now | invoice.issue, subscription.plan, subscription.issued_count |
| A066 | Deleting a draft hard-deletes it but leaves a history row with draft id, actor, customer and total; nothing else survives. | now | invoice.delete |
| A067 | Generated PDFs and exports live under firm-scoped paths and are served through signed URLs that expire in 15 minutes. | now | invoice.print_pdf |
| A068 | Books and history are kept at least 8 years and never purged by plan, trial or closure rules. | now | invoice.history, subscription.used |
| A069 | Audit history cannot be switched off by any role and has no edit or delete path in the interface or API. | now | invoice.history |
| A070 | Timesheet entries store person, date, hours, rate, customer, billable flag and billed invoice id; billed entries are locked. | room | time_entry.hours, time_entry.rate |
| A071 | Invoice must show the firm's name, address, GSTIN, number, date, recipient details, SAC, taxable value, rate, tax amounts and place of supply. | now | invoice.law |
| A072 | Services invoice should be issued within 30 days of supply; issue date more than 30 days after the stated service date shows a warning. | now | invoice.issue |
| A073 | Invoice for an unregistered recipient with taxable value of Rs 50,000 or more requires recipient name, address and state; below it, state only. | now | invoice.issue |
| A074 | Invoice prints a line showing whether tax is payable on reverse charge, Yes or No, and a signature block for the authorised signatory. | now | invoice.law |
| A076 | Invoice with both taxable and exempt lines is titled 'Invoice-cum-Bill of Supply'; an all-exempt firm issues 'Bill of Supply'. | now | invoice.law |
| A077 | Invoice number must start with a letter or digit 1 to 9 and use only letters, digits, slash and hyphen, or the e-invoice portal rejects it. | now | invoice.number |
| A078 | Default place of supply is the recipient's registered location; for an unregistered recipient it is address on record, else the supplier's location. | now | invoice.place_of_supply |
| A079 | Place of supply can be overridden with a reason for immovable-property services (location of property) and for services physically performed (location of performance). | now | invoice.place_of_supply |
| A080 | Intermediary services, common for agencies and recruiters, have place of supply at the supplier's location, so a foreign customer is not an export and tax applies. | now | invoice.place_of_supply |
| A081 | Export of services requires recipient outside India, place of supply outside India and payment in foreign exchange; a failed check blocks zero-rating with the reason. | now | invoice.supply_type |
| A082 | An export under LUT prints exactly "SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX", recipient name and address, country of destination, and tax of zero on every line; the LUT number prints too, as our choice. | now | invoice.supply_type |
| A083 | An export with tax charges IGST at the normal rate, prints the Rule 46 ending "ON PAYMENT OF INTEGRATED TAX" and the country of destination, and flags the invoice for refund tracking. | now | invoice.supply_type |
| A084 | Export under LUT is refused when no LUT is recorded for the FY of the invoice date or when the stored LUT has expired. | now | invoice.supply_type |
| A085 | Supply to an SEZ unit or developer is zero-rated: with LUT no tax, or with IGST; the invoice marks SEZ and place of supply is the SEZ state. | now | invoice.supply_type |
| A087 | Reverse-charge supply: the supplier's invoice shows no tax and 'Tax payable on reverse charge: Yes'; a firm-level RCM category list pre-sets it, and an invoice cannot mix reverse-charge and normal lines. | now | invoice.supply_type |
| A088 | Legal services by an advocate or firm of advocates to a business entity are on reverse charge, so such invoices default to no tax charged. | now | invoice.supply_type |
| A089 | Composition firm issues a Bill of Supply reading 'Composition taxable person, not eligible to collect tax on supplies'; tax invoices are blocked. | now | invoice.law |
| A093 | Late payment charges are taxable consideration; a late fee billed on a debit note or invoice line carries the service's tax rate. | now | invoice.lines |
| A095 | Invoice prints the Udyam registration number when the firm has one; buyers use it to meet the 45-day payment rule. | now | invoice.print_pdf |
| A104 | E-invoice applies when the firm's turnover crossed Rs 5 crore in any year since 2017-18; the firm profile stores that flag. | now | invoice.require_einvoice |
| A106 | IRN cancellation is allowed only within 24 hours of generation and only if the invoice is not yet in a filed return; reason is mandatory. | now | invoice.cancel_irn |
| A107 | A credit or debit note against an e-invoiced invoice must itself get an IRN; the issue flow does this or blocks with the portal error. | now | credit_note.require_irn, credit_note.issue |
| A108 | B2C invoices need no IRN; the generate button appears only for B2B, export, SEZ and deemed export documents. | now | invoice.require_einvoice |
| A109 | E-invoice documents print the IRN, acknowledgement number and date, and the signed QR code returned by the portal. | now | invoice.version |
| A111 | HSN or SAC digits depend on turnover: 4 digits up to Rs 5 crore, 6 digits above; the firm's turnover band sets the minimum. | now | invoice.lines |
| A112 | SAC field validates against the official code master and shows its description; unknown codes are refused, with a search-by-words picker. | now | invoice.lines |
| A113 | A Council rate or SAC change takes effect by date of supply; drafts saved earlier are rechecked at issue, and the issue screen shows old and new tax and needs a click before issuing. | now | invoice.issue |
| A114 | Discount before supply may reduce taxable value only if shown on the invoice; post-supply discount needs a credit note with the buyer's ITC adjustment noted. | now | invoice.lines |
| A115 | Credit note for post-sale discount asks 'Was this agreed before the supply?' and records the answer on the document. | now | credit_note.agreed_before_supply |
| A117 | A credit note dated after the limit (30 November, or the annual return date if earlier) is refused with the exact date, unless the owner records it as a commercial, non-GST credit with no tax effect. | now | credit_note.issue |
| A118 | Reimbursed expense lines are taxable at the main service's rate; pure-agent treatment is wave 2. | now | invoice.lines |
| A119 | Reimbursed expense lines marked pure-agent need receipt, customer-authorised-payment and no-markup ticks; missing one turns the line taxable. | room | expense.pure_agent_receipt, expense.pure_agent_authorised, expense.pure_agent_no_markup |
| A121 | Rounding follows one rule everywhere: line tax half-up to paise, document total to nearest rupee with a round-off line, GSTR figures use stored paise. | now | invoice.money |
| A122 | B2C inter-state invoices above Rs 1 lakh are reported invoice-wise (B2CL); smaller ones fall in state-wise summary; register tags each document. | now | invoice.law |
| A127 | Foreign-currency invoices convert at the rate of the date of time of supply per the firm's accounting policy; the rate source is stored. | now | invoice.exchange_rate |
| A132 | No tax line can appear on documents of an unregistered firm; when it registers it gives the GSTIN and an effective date, documents from that date use the tax invoice title, and older ones stay plain invoices. | now | invoice.law |
| A135 | Subscription states are trial, free, active, past_due, grace, read_only and cancelled; each state names exactly which actions stay allowed. | now | subscription.go_read_only |
| A138 | Time entries are open, approved, billed; billed to open happens only when the linked invoice is voided. | room | time_entry.approve, time_entry.release |
| A148 | Recurring and imported drafts carry a 'needs review' mark that the user clears before issuing them. | now | invoice.needs_review |
| A149 | Issuing at 00:30 IST on 1 April uses the new FY number even though UTC is still 31 March. | now | invoice.number |
| A156 | Payment and credit note posted to the same invoice at the same moment cannot together exceed balance; the invoice row is locked. | now | invoice.credit_lowers |
| A158 | Customer archived while a draft for them is open; the draft can still be issued but a notice says the customer is archived. | now | invoice.issue |
| A162 | Plan limit never blocks credit notes, payments, voids or exports; only creating new issued invoices counts toward it. | now | credit_note.fail, invoice.void, subscription.limit |
| A163 | Trial or paid period ends while a user is typing: the save succeeds as a draft, then the firm turns read-only on next load. | now | invoice.draft, subscription.go_read_only |
| A164 | Firm has no GSTIN, state or address yet; issuing is blocked with a checklist of what to fill and a link to each field. | now | invoice.issue |
| A165 | PDF render fails or times out: the invoice stays issued, the share page shows 'preparing', and a retry runs automatically. | now | invoice.print_pdf |
| A166 | Share link opened after the invoice is voided shows a plain 'This invoice was cancelled' page with number and date only. | now | invoice.void |
| A168 | Database failover mid-issue: the number is either committed with the invoice or not at all, and a retry cannot make a second invoice. | now | invoice.issue |
| A171 | Voiding an invoice that has draft credit notes is blocked until those drafts are deleted or issued. | now | invoice.void |
| A172 | Reversing a payment whose invoice already carries a later credit note recalculates both, and customer credit never goes negative. | now | invoice.reverse_to_unpaid, invoice.credit_returns_part |
| A173 | Currency rate missing for the invoice date: save is blocked with a prompt to enter a rate, never a stale rate. | now | invoice.exchange_rate |
| A184 | Exchange rate must be above 0 with up to 4 decimals; foreign amounts allow 2 decimals except for currencies with none. | now | invoice.exchange_rate |
| A190 | Write-off amount must be above 0 and at most the balance due, with a reason of 5 to 200 characters. | now | invoice.write_off |
| A193 | Share link expiry chosen by the owner must be between 1 and 365 days; the default is 30. | now | invoice.share_link |
| A196 | Attached PDF file name replaces slashes with hyphens, for example INV-26-27-00001.pdf; no slash reaches a file name or URL path. | now | invoice.print_pdf |
| A215 | Owner gets alerts for e-invoice failure, trial ending in 7 and 1 days, and plan limit at 80 and 100 percent; LUT expiry 30 days ahead. | now | subscription.remind |
| A217 | Amount in words follows the Indian system (lakh, crore) with paise, for example 'Twelve Lakh Rupees and Fifty Paise Only'. | now | invoice.print_pdf |
| A218 | PDF embeds fonts with the rupee glyph and Indian scripts; a customer name in Devanagari prints correctly. | now | invoice.print_pdf |
| A219 | A 50-line invoice paginates with repeated headers, no split rows, and the tax summary and totals on the last page. | now | invoice.print_pdf |
| A221 | Void invoices print with a diagonal CANCELLED mark and the void date; their number stays visible. | now | invoice.void |
| A222 | Pre-debit notice emails go to the owner at least 24 hours before our own subscription auto-debit. | now | subscription.notify |
| A223 | Our own subscription invoice to each firm is a GST invoice with the firm's GSTIN so the firm can claim input credit. | now | subscription.settles |
| A232 | Trial-end job moves the firm to the Free plan, never to a blocked state, and no job deletes any firm's books. | now | subscription.trial_ends |
| A237 | FY rollover job runs on 1 April 00:05 IST, creates new counters at 00001, and does not reset any pending draft. | now | invoice.number |
| A241 | Opening-balance import adds unpaid old invoices with original number, date, customer and balance, marked migrated and read-only. | now | invoice.import |
| A242 | Migrated invoices keep their original numbers even if longer or differently formatted, up to 16 characters, never touch the counters, and a number that clashes with an existing one in the same series is rejected. | now | invoice.import |
| A249 | Sales register, credit notes and receipts export as a zip with one CSV per month for the accountant, in the same column order every time. | now | credit_note.export |
| A253 | Full firm export is one zip with CSVs of every object, all PDFs, and a read-me with field meanings; it works in read-only state. | now | subscription.used |
| A254 | Export is available after cancellation and during grace; requesting data export is never blocked by plan or unpaid dues. | now | subscription.fail |
| B006 | Invoice list has a quick filter for invoices the customer has opened, separate from sent, partially paid and overdue. | now | invoice.opened |
| B010 | The send-email dialog accepts extra To, Cc and Bcc addresses for that one send without editing the customer record. | now | invoice.send |
| B011 | A dry-run preview of an invoice shows final PDF, totals and number format without consuming an invoice number. | now | invoice.preview |
| B042 | The template gallery offers three style families (plain, standard, modern), all passing GST rules; switching never changes a figure, and editing a template changes only documents issued afterwards, since issued documents keep the template they were first printed with. | now | invoice.print_pdf |
| B052 | Manual reminders exist separately from automatic ones, with their own editable text for overdue and for sent-not-yet-due invoices. | now | invoice.remind |
| B100 | A plan covers one business; adding a second business needs an upgrade, and the price page says so. | now | subscription.scope |
| B121 | The free plan allows a stated number of issued invoices per month, shown on the plan page and in the limit message. | now | subscription.issued_limit |
| B123 | Plans state their limits in users and issued invoices per firm; every paid plan includes one accountant seat that does not count as a user. | now | subscription.user_limit |
| B187 | Export of services uses place of supply 96 Other Countries with a check that no state code is used for a foreign customer. | now | invoice.place_of_supply |
| B191 | A voided invoice can be copied into a new draft that records which invoice it replaces, shown on both. | now | invoice.replaces, invoice.void |
| B199 | Billable time entries convert into invoice lines for a project or customer with hours, rate and description. | room | time_entry.bill |
| B200 | Reimbursable expenses incurred for a customer can be added to its invoice with receipts attached to the PDF. | room | expense.attach, expense.bill |
| B202 | A default tax treatment (regular, SEZ, export, unregistered) and a default TDS section can be set per customer so each new invoice and payment starts right. | now | invoice.create |
| B209 | A customer carries its own invoicing currency set at creation and printed on the PDF; it cannot change once an invoice exists for them. | now | invoice.currency |
| B212 | A credit note's excess becomes customer credit; the owner can apply it to a later invoice of the same customer or record a manual refund that reduces it. | now | credit_note.hold_excess |
| B225 | Time entries round to a firm-set step such as 15 minutes before they become invoice lines. | room | time_entry.approve |
| B231 | A limit error names the limit hit, the plan's allowance and when it resets, not a code. | now | subscription.limit |
| C010 | New invoice starts from a bottom Plus button reachable by thumb; customer picker opens first with the 5 most recent customers listed. | now | invoice.create |
| C011 | A new customer can be created inside the invoice picker with only a name typed; type defaults to business and state to the firm's state, and the rest stays optional unless the invoice needs it. | now | invoice.create |
| C012 | Picking a customer prefills payment terms, place of supply and default tax treatment; last-used lines are wave 2. | now | invoice.create |
| C013 | Line description autocompletes from the firm's earlier lines and fills the last-used HSN or SAC, rate and tax rate for that description. | now | invoice.lines |
| C019 | After Issue, the next screen offers Send on WhatsApp (opens WhatsApp with the customer's number and a message holding the share link), Send by email, Copy link and Download PDF, WhatsApp first. | now | invoice.send |
| C043 | Every destructive action says what happens in plain words and gives Undo or a way back; where none exists the dialog says so. | now | invoice.void |
| C045 | An issued invoice has an Edit button that explains it is locked and offers Create credit note and Void and re-create, not a dead end. | now | invoice.edit |
| C103 | Plan price page shows the monthly and yearly price including GST and states the GST invoice for the plan arrives in email within 24 hours of payment. | now | subscription.amount |
| C131 | A user who presses back after Issue lands on the invoice, never on the issued form with editable fields. | now | invoice.issue |
| C139 | Reversing a payment, voiding an invoice or issuing a credit note over Rs 10,000 emails all owners at once with the actor and amount. | now | invoice.void, credit_note.issue |
| C173 | Tax on a line is recomputed on the server at Issue; a client-side total that differs by even one paisa is rejected and the server value is shown. | now | invoice.issue |
| D031 | An expense records date, vendor, category, amount, GST paid, paid-through account, notes and receipt, and is filtered by category, vendor, date and billable flag. | room | expense.vendor, expense.amount |
| D032 | Mark an expense billable to a customer; it then appears as an unbilled item that can be added to that customer's next invoice as a line. | room | expense.mark_billable, expense.unmark_billable |
| D033 | Re-billed expense lines can carry a markup percent; a pure-agent reimbursement line is printed separately and flagged with no markup allowed. | room | expense.markup_percent |
| D034 | Receipt upload accepts JPG, PNG or PDF up to 5 MB, 3 files per expense; larger or other types are refused with the limit stated. | room | expense.attach |
| D037 | An expense billed on an invoice is locked and links that invoice; voiding the invoice or deleting its draft returns the expense to unbilled. | room | expense.release |
| D043 | A time entry holds date, person, customer, item or task, hours in 0.25 steps, note and billable flag; entries over 24 hours a day per person are refused. | room | time_entry.hours, time_entry.date |
| D045 | Add unbilled time to a draft invoice grouped by person, task or day; each group becomes one line with quantity as hours and rate from person or customer. | room | time_entry.bill |
| D046 | Time rate order: customer-specific rate, then person rate, then item rate; the line shows which rate was used. | room | time_entry.rate |
| D047 | Billed entries are locked and show the invoice number; returning an invoice to void or deleting its draft frees the entries again. | room | time_entry.release |
| D049 | Staff see and edit only their own entries; owner and accountant see all; viewer sees none. | room | time_entry.owner |
| D050 | Time export CSV has date, person, customer, task, hours, rate, amount, billed invoice; bulk mark as non-billable lists failures such as already billed rows. | room | time_entry.export |
| D073 | The invoice PDF and share page print a UPI QR with the firm's UPI ID, the balance due as amount and the invoice number in the note; the QR shows only while the balance due is above 0. | now | invoice.print_pdf |
| D128 | Invoice list filters by e-invoice status: not needed, pending, generated, failed, cancelled. | now | invoice.tax |
| D155 | Invoice currency can be chosen from a firm-enabled list (USD, EUR, GBP, AED, SGD, AUD); the symbol, name and 2 decimals are fixed per currency. | now | invoice.currency |
| D157 | Exchange rate defaults from the last entered rate for that currency and can be edited only on draft; at issue it is locked. | now | invoice.exchange_rate |
| D162 | Invoice list shows currency; filter by currency; totals row shows INR and foreign totals separately. | now | invoice.currency |
| D269 | Free plan shows "7 of 10 invoices this month" on the invoice list; at the limit, issuing is blocked with an upgrade prompt while drafts, payments and all reading stay open. | now | subscription.limit |
| D271 | Trial shows days left in a banner; at the end the firm moves to Free automatically, never to a blocked state. | now | subscription.trial_ends |
| D272 | Plan change takes effect now for upgrades, with proration shown before confirming, and at period end for downgrades. | now | subscription.preview, subscription.edit |
| D273 | Downgrade is blocked when active users exceed the new plan's seats; the message names how many to deactivate. | now | subscription.user_limit |
| D275 | A failed subscription payment gives a 7-day grace with a banner and emails on day 1, 3 and 6 before read-only mode; the firm can pay by UPI AutoPay, card or one-time UPI. | now | subscription.grace_starts |
| D276 | Cancel at period end keeps full use until the date, shows the date, and offers Undo cancel until then. | now | subscription.cancel |
| D277 | Billing page lists payment method, next charge date and amount; annual and monthly toggle shows the saving. | now | subscription.proof |
| D278 | Usage count for the free limit counts issued invoices only, resets on the 1st IST, and voided invoices still count. | now | subscription.issued_count |
| D300 | Unapply credit from an invoice returns it to the ledger, restores balance due, and records who and why. | now | credit_note.restore_credit |
| D337 | At issue the PDF is rendered once and stored with its content hash and template version; reopening or resending later serves that file with the same layout, logo and wording, and its name is the document number with slashes replaced by hyphens. | now | invoice.print_pdf |
| D341 | The share page records the first and last time it was viewed and shows both on the invoice. | now | invoice.share_link |
| D346 | Draft autosaves every 30 seconds and on leaving; the draft shows "Saved 10:42" and a lost connection shows "Not saved, retrying". | now | invoice.draft |
| D353 | Issue screen shows a final check list (customer GSTIN, SAC present, place of supply, tax split) with a plain warning for anything unusual before the number is taken. | now | invoice.issue |
| D377 | The credit note list shows number, date, customer, original invoice, reason, total and status, filterable by status, date and customer. | now | credit_note.search |
| D379 | Email a credit note to the customer's contacts with PDF and share link; goes through the outbox like invoices. | now | credit_note.share_link |
| D380 | Credit note preview shows the resulting invoice balance and new customer credit before issue. | now | credit_note.preview |
| D382 | Draft credit notes can be deleted after a confirm; issued ones cannot. | now | credit_note.delete |
| K039 | data: money stored as integer paise | now | invoice.money |
| K041 | data: invoice: number, series, FY, dates, customer snapshot, place of supply, status, notes, IRN fields, totals | now | invoice.customer |
| K042 | data: line: description, HSN/SAC, qty, rate, discount, tax rate, taxable, cgst, sgst, igst | now | invoice.lines |
| K056 | Foreign-currency invoices for export of services are in wave 1: money is stored as integer paise in INR, with the foreign amount, currency and rate kept beside it. | now | invoice.currency |
| K107 | When two users edit the same draft, the second save is refused with a notice that shows the newer version. | now | invoice.edit |
| K190 | Lines can be added, edited and removed on a draft; reordering and duplicating a line are wave 2. | now | invoice.lines |
| W013 | A draft invoice needs only a customer; it shows "Draft" instead of a number and may be saved with zero lines. | now | invoice.draft, invoice.create |
| W014 | Issue date defaults to today in Indian Standard Time and cannot be in the future. | now | invoice.issued_at |
| W015 | Issue date cannot be earlier than the issue date of the latest issued invoice in the same number series, so numbers and dates rise together. | now | invoice.issued_at |
| W016 | Due date defaults to issue date plus the customer's payment terms (else the firm default) in days, and cannot be earlier than the issue date. | now | invoice.due_at |
| W017 | The financial year runs 1 April to 31 March by issue date and is labelled YY-YY, for example 26-27 for 1 April 2026 to 31 March 2027. | now | invoice.number |
| W018 | Invoice number format is PREFIX/YY-YY/NNNNN, for example INV/26-27/00001, with a prefix of 1 to 4 characters and a 5-digit sequence, so no number exceeds 16 characters. | now | invoice.number |
| W019 | An invoice number is assigned only when the invoice is issued, from a counter per firm, prefix and financial year that starts at 00001 each year and adds 1 per issue. | now | invoice.number |
| W020 | Invoice numbers have no gaps: deleting a draft or a failed issue attempt never uses a number, and two simultaneous issues never receive the same number. | now | invoice.number |
| W021 | An invoice needs 1 to 50 lines to be issued; issuing with zero lines is rejected. | now | invoice.lines |
| W022 | A line needs a description of 1 to 200 characters, a quantity above 0 up to 999999.999 with 3 decimals, and a unit rate from 0 to 9999999.99 with 2 decimals. | now | invoice.lines |
| W023 | A line discount is a percentage from 0 to 100 with at most 2 decimals and is applied before tax. | now | invoice.lines |
| W024 | When the firm has a GSTIN, every line needs an HSN or SAC code of 4, 6 or 8 digits, and the minimum digits follow the firm's turnover band (4 digits up to Rs 5 crore, 6 above). | now | invoice.lines |
| W025 | A line tax rate must be one of 0, 0.25, 3, 5, 18 or 40 percent, with 18 percent as the default for new lines. | now | invoice.lines |
| W026 | Line taxable value equals quantity times rate times (1 minus discount percent divided by 100), rounded half up to 2 decimals. | now | invoice.lines |
| W027 | Place of supply defaults to the customer's billing state, can be changed while the invoice is a draft, and is locked at issue. | now | invoice.place_of_supply |
| W028 | When place of supply equals the firm's state, each line's CGST and SGST are each taxable value times rate divided by 200, rounded half up to 2 decimals. | now | invoice.money |
| W029 | When place of supply differs from the firm's state, each line carries IGST equal to taxable value times rate divided by 100, rounded half up to 2 decimals, and no CGST or SGST. | now | invoice.money |
| W030 | Grand total is the sum of taxable values and taxes rounded half up to a whole rupee, and the signed round-off amount is shown on its own line. | now | invoice.money |
| W031 | An invoice grand total above 99,99,99,999 rupees is rejected on save with a message that states the limit. | now | invoice.total |
| W032 | A firm with no GST registration issues a plain document titled "Invoice", with no tax lines, no HSN or SAC requirement and no tax columns. "Bill of Supply" is used only by a registered firm on the composition scheme or for exempt supplies, and shows its GSTIN. | now | invoice.law |
| W033 | After issue, the customer, lines, amounts, issue date and place of supply cannot be changed, and any attempt is refused with a clear error. | now | invoice.freeze |
| W034 | After issue, only the due date (not before issue date), customer note and internal note can be edited, and each change is recorded in history. | now | invoice.edit |
| W035 | Invoice status is computed: issued when nothing is paid or credited, partially_paid when balance due is above 0 and below grand total, paid at 0; draft and void are set only by issue and void. | now | invoice.paid |
| W036 | An issued or partially paid invoice whose due date is before today in IST is labelled overdue; overdue is a displayed label, not a stored status. | now | invoice.late |
| W037 | Balance due equals grand total minus non-reversed payments and TDS, minus active credit notes and customer credit applied to this invoice, and is never below 0. | now | invoice.paid |
| W038 | Only an owner can void an invoice, and only if it has no active payment, credit note or IRN; a reason of 5 to 200 characters is required and the number stays used. | now | invoice.void |
| W039 | Owner or accountant can hard-delete a draft invoice after a confirm step; an issued or void invoice can never be deleted. | now | invoice.delete |
| W040 | Duplicate creates a new draft with the same customer, lines, place of supply and notes, with today's date, no number and no payments. | now | invoice.duplicate |
| W041 | An invoice has a customer note of up to 500 characters that is printed, and an internal note of up to 1000 characters that is never printed or shared. | now | invoice.customer_note, invoice.internal_note |
| W042 | The invoice print page is A4 and shows firm name, address and GSTIN, number, dates, customer details, lines with HSN or SAC, tax summary per rate, round-off, grand total in Indian words and bank details. | now | invoice.print_pdf |
| W043 | Money shows with Indian digit grouping, the rupee sign and 2 decimals, for example ₹12,34,567.50, and dates show as DD-MM-YYYY everywhere in the interface and print pages. | now | invoice.print_pdf |
| W044 | Owner or accountant can create a read-only share link for an issued invoice with a random token of at least 128 bits and no client name or amount in the address; it is not indexed by search engines or cached by shared proxies, expires after 30 days by default, can be revoked, and needs no login. | now | invoice.share_link |
| W048 | Owner or accountant can record a payment on an issued or partially paid invoice only; draft, paid and void invoices refuse payments with a clear message. | now | invoice.record_part |
| W049 | Payment amount must be above 0 with 2 decimals, and amount plus TDS cannot exceed the invoice balance due; larger amounts are rejected with a message, because advance receipts are wave 2. | now | invoice.amount |
| W053 | A payment may carry a TDS amount of 0 or more that counts toward settling the invoice but is not money received, and is shown separately in totals and on the receipt. | now | invoice.record_full |
| W054 | After a payment the invoice becomes partially_paid if balance due is still above 0 and paid when balance due is exactly 0. | now | invoice.record_full |
| W059 | Only an owner can reverse a payment with a reason of 5 to 200 characters, and the user who saved a payment can undo it within 10 seconds with no reason; the row stays listed as reversed, balance and status are recalculated, and its receipt number is never reused. | now | invoice.reverse_to_unpaid |
| W060 | A credit note can be created only from an issued, partially paid or paid invoice, stores a link to it, and an invoice may have many credit notes. | now | credit_note.create |
| W061 | A credit note needs one reason from sales return, post-sale discount, invoice correction or deficiency in service, plus an optional note of up to 300 characters; for a post-sale discount it reminds that the customer must reverse matching input tax. | now | credit_note.reason |
| W062 | Credit note lines start as copies of the original lines; each may be lowered but never above that line's remaining creditable taxable value. | now | credit_note.lines |
| W063 | Credit note tax uses each original line's rate, HSN or SAC and place of supply, giving CGST and SGST or IGST as the invoice did, with the same rounding. | now | credit_note.lines |
| W064 | Credit note number format is CN/YY-YY/NNNNN from its own gapless counter per firm and financial year, assigned at issue, with the year taken from its issue date. | now | credit_note.number |
| W065 | A credit note issue date cannot be before the original invoice date, in the future, or after 30 November following the end of the original invoice's financial year; if the firm records that its annual return was filed earlier, that date is the limit. | now | credit_note.issue |
| W066 | Issuing a credit note lowers the invoice balance due, and any amount above that balance becomes the customer's credit balance. | now | credit_note.hold_excess |
| W067 | Owner or accountant can apply a customer's credit balance to another issued invoice of the same customer, up to the smaller of the credit balance and that invoice's balance due. | now | credit_note.spend_credit |
| W068 | The credit note print page is titled "Credit Note" and shows its number and date, the original invoice number and date, reason, lines, tax split, total, and each application to other invoices. | now | credit_note.print_pdf |
| W069 | An issued credit note cannot be edited or deleted; only an owner can void it with a reason, restoring invoice balance, and only if none of its credit has been applied elsewhere. | now | credit_note.void |
| W078 | The invoice list shows number, customer, issue date, due date, total, balance due and status, 25 per page, newest issue date first, with drafts at the top. | now | invoice.columns |
| W079 | The invoice list filters by status (draft, issued, partially_paid, paid, void, overdue), customer and issue date range, and active filters combine with AND. | now | invoice.filter |
| W080 | Invoice search matches, case-insensitively and by substring, invoice number, customer name or customer GSTIN once at least 2 characters are typed, and combines with filters. | now | invoice.search |
| W082 | Invoice list columns number, issue date, due date, grand total and balance due each sort ascending or descending, and the chosen sort stays in the page URL. | now | invoice.sort |
| W083 | Owner or accountant can export the current filtered invoice list as CSV, UTF-8 with byte-order mark, ISO dates, plain 2-decimal amounts, up to 50,000 rows, with columns number, date, due, customer, GSTIN, place of supply, taxable, CGST, SGST, IGST, round-off, total, paid, TDS, credited, balance and status, and a line-level option with one row per line. | now | invoice.export |
| W084 | A GST sales register CSV for a date range has one row per invoice and credit note line with HSN or SAC, taxable value, CGST, SGST and IGST; credit note rows negative; void invoices excluded. | now | invoice.export |
| W086 | Emailing an issued invoice creates one outbox row with recipient, subject, body containing the share link, and status queued; draft invoices cannot be sent and the recipient email must be valid. | now | invoice.send |
| W088 | A daily job at 09:00 IST queues reminders 1, 7 and 15 days after due date, at most 3 per invoice, none after paid or void and none for invoices with a pause; one message per customer lists all their overdue invoices. | now | invoice.remind |
| W089 | History is append-only: each create, edit, issue, void, payment, reversal, credit note, e-invoice attempt and role change stores actor, time and old and new values, and shows on the document's page. | now | invoice.history |
