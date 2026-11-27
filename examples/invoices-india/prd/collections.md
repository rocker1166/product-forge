# Invoices for Indian service firms: collections

One module of the PRD. The front book is ../PRD.md.

### Allocation

| Can do | How |
|---|---|
| create | Written by Record payment, one row per invoice; the split screen defaults to oldest due first and must add up to the payment. Nobody adds a row on its own. |
| view | Amount, method, state, fees, the document it settled, and the payer. |
| search | Receipt number, invoice number and customer name. |
| filter | State, method, date range, amount range, currency, payer, settled or unsettled. |
| sort | Newest first; also amount and date received. |
| saved view | Named filters like Failed, Disputed, This month. |
| columns | Pick amount, fee, net, method, payer, settled-on columns. |
| export | CSV of payment, invoice, amount and TDS per row, for the accountant's receipts check. |
| reverse | Reassign by the owner with a reason, or reversed together with its payment by the system. |
| history | Every state change with time and gateway message; kept forever. |
| link related | Shows the document, customer, refunds, payout and dispute together. |

**room:** custom fields

**later:** group; bulk; import; share link; approve; attach; tag; remind; api (Waits for the public API.); webhook (Waits for the public API and its events.)

**no:** edit (Amounts never change; a wrong split moves to another invoice through reassign, or the payment is reversed.); draft; delete; archive; restore; duplicate; version; print pdf (Printed inside the receipt of its payment, which lists each allocation.); preview; assign; comment (The payment's note is the only comment.); follow; schedule (Nothing repeats; rows are written when a payment is recorded.); merge; notify (Nobody is told about a row; the receipt and the owner alert belong to the payment.)

| Question | Answer |
|---|---|
| amount | Rupees in paise, above 0, and the rows of one payment add up exactly to its amount; the database refuses a row that would make the sum pass the payment. Each row also holds its own income-tax and GST TDS shares, and the rows add up to the payment's TDS. |
| settles | One invoice per row, all of one customer. An invoice accepts a row only up to its balance due; a payment and a credit note posted at the same moment cannot together pass it because the invoice row is locked. |
| undo | Reversed with its payment, or reassigned by the owner to another invoice of the same customer with a reason; the old row stays reversed and a new row is written, the payment and receipt do not change. |
| fail | A row that no longer fits because the invoice was credited or voided at the same moment is refused, the whole payment is not saved, and the person sees the new balance due. |
| fee | No fee; bank charge and exchange gain or loss stay on the payment, not on a row. |
| dispute | Nothing to dispute on a row; a wrong split is reassigned, a wrong payment is reversed. |
| proof | The receipt of the payment lists every row with invoice number and the amount it settled. |
| match | The nightly integrity check compares the allocation sum of every payment with its amount and every invoice balance with its payments and credits. |

**States, payment:** active (start), reversed (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| reassign | active | reversed | owner, accountant | reason of 5 to 200 letters; new invoice is of the same customer, issued or part-paid, and its balance due covers the amount; period not locked. the TDS on the row moves with it and is refused when it is above 20 percent of the new invoice's taxable value; invoice-wise TDS is marked 'changed' for the accountant, because the customer's certificate no longer matches | this row reversed, a new active row written for the other invoice, both invoices recalculated, receipt stays | reassign again | none |
| release | active | reversed | system | its payment was reversed | invoice balance and state recalculated | none: record the payment again as a new payment | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| payment | link | yes |  |  | nobody |  |
| invoice | link | yes |  |  | nobody |  |
| amount | money | yes | above 0, never more than the invoice balance due |  | nobody | This is more than the balance due on the invoice. |
| tds_amount | money |  | 0 to the invoice taxable value | 0 | nobody | TDS cannot be more than the taxable value of the invoice. |
| gst_tds_amount | money |  | 0 to 2 percent of the taxable value of the invoice | 0 | nobody | GST TDS cannot be more than 2 percent of the taxable value. |
| reassign_reason | text |  | 200 |  | nobody | Write a reason of 5 to 200 letters. |

| List |  |
|---|---|
| search | receipt_number, invoice, customer |
| filters | payment, invoice, customer, created_at |
| sorts | -created_at, amount |
| default_sort | -created_at |
| columns | created_at, receipt_number, invoice, customer, amount, tds_amount, payment |
| views | All, Reversed, This month |
| export | rows: filtered, date range; what: allocations; formats: CSV; big: over 1,000 rows comes by email; failure is emailed too |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | payment | -created_at | tenant, payment, created_at | 150 ms |
| one_invoice | invoice | -created_at | tenant, invoice, created_at | 100 ms |
| one_customer | customer | -created_at | tenant, customer, created_at | 150 ms |
| in_range | created_at | -created_at | tenant, created_at | 150 ms |
| by_amount |  | amount | tenant, amount | 200 ms |

### Customer Credit

| Can do | How |
|---|---|
| create | Made by the system when a credit note's excess first lands on a customer. Credit is applied to an invoice by the owner or accountant from the invoice or from the customer's page. |
| view | Each credit in, amount applied, refund and balance after, newest first, each row linking to its document. |
| search | Customer name and credit note number. |
| filter | State, method, date range, amount range, currency, payer, settled or unsettled. |
| sort | Newest first; also amount and date received. |
| export | CSV of every row with customer, kind, amount, balance after and linked document, for the accountant. |
| reverse | Unapply credit from an invoice returns it to the account and restores the invoice balance, with who and why; a voided credit note takes its credit out only if none was used. |
| history | Every state change with time and gateway message; kept forever. |
| link related | Shows the document, customer, refunds, payout and dispute together. |

**room:** custom fields

**later:** group; saved view; columns; bulk; import; share link; approve; attach; tag; remind; api (Waits for the first public API.); webhook (Waits for the public API events.)

**no:** edit (Rows are appended, never changed; a wrong application is unapplied.); draft; delete; archive; restore; duplicate; version; print pdf (The customer statement and the credit note carry the figures; the account has no paper of its own.); preview; assign; comment (The reason on each row is the only note.); follow; schedule (Credit is never applied by itself; a person chooses the invoice.); merge; notify (Nobody is told about credit rows; the credit note email and the refund alert cover it.)

| Question | Answer |
|---|---|
| amount | Rupees in paise, one account per customer in the customer's currency. The balance is always the sum of the rows and is never below zero; the database refuses a row that would push it under. |
| settles | Credit in comes only from a credit note's excess over its invoice balance. It settles another issued invoice of the same customer, up to the smaller of the balance and that invoice's balance due, or leaves as a refund. |
| undo | Unapply returns the amount to the account and restores the invoice balance, with a reason. A credit note can be voided only if none of its credit was applied or refunded; otherwise the owner first unapplies or reverses the refund. |
| fail | Two people applying the same credit at once: the account row is locked, the second is refused with the new balance. An application larger than the balance is refused with the figure. |
| fee | No fee; credit moves between the firm and one customer only. |
| dispute | A customer who disputes a credit sees the ledger on the statement; the owner corrects it by unapply or by a new credit note, never by editing a row. |
| proof | The credit note is the legal paper; each application is printed on the credit note's page and on the target invoice. The ledger itself is not a tax document. |
| match | The nightly integrity check compares every balance with the sum of its rows; the customer page shows unused credit apart from outstanding balance. |

**States, payment:** open (start), exhausted, owed

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| add_credit | open, exhausted | open | system | a credit note was issued and its excess over the invoice balance is above 0 | a credit row written, balance goes up. the credit is the excess less the TDS recorded on the part credited (R29), and an on-account payment adds a row dated with its real receipt date | withdraw when the credit note is voided and none of it was used | none |
| apply | open | open | owner, accountant | target invoice is issued or part-paid and of the same customer; amount not above the balance and not above the invoice balance due; period not locked. the amount is not reserved for a refund | an applied row written, invoice balance and state recalculated | unapply | none |
| unapply | open, exhausted | open | owner, accountant | reason written; period not locked | the amount returns to the balance, the invoice balance due is restored, who and why are logged | apply again | none |
| withdraw | open | open | system | the credit note was voided by an owner and none of its credit was applied or refunded | the credit row is reversed, balance goes down, never below zero | none: issue a new credit note | none |
| use_up | open | exhausted | system | balance is exactly 0 after an application, refund or withdrawal | account shows exhausted and leaves the apply picker | add_credit or unapply brings it back | none |
| record_shortfall | open | owed | system | a payment was reversed or bounced after its credit was applied or refunded (R30) | a debit row is written; the customer page shows Customer owes Rs X and the owner is told | none: the debit is cleared by the next credit or written off by an owner | none |
| clear_owed | owed | open | system | new credit arrives that covers the debit, or the owner wrote it off | the debit row is set off; what is left is credit again | none: a set-off cannot be undone; record the shortfall again by reversing the payment | none |
| write_off_owed | owed | open | owner | reason of 5 to 200 letters | the debit is written off as a loss with the reason; history row | none: record the amount again as a new debit by hand | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| customer | link | yes |  |  | nobody |  |
| currency | choice | yes |  | INR | nobody |  |
| balance | money | yes | 0 to 10 crore |  | nobody |  |
| credited_total | money | yes | 0 to 10 crore |  | nobody |  |
| applied_total | money | yes | 0 to 10 crore |  | nobody |  |
| refunded_total | money | yes | 0 to 10 crore |  | nobody |  |
| rows | list | yes |  |  | nobody |  |
| unapply_reason | text |  | 200 |  | nobody | Write a reason of 5 to 200 letters. |

| List |  |
|---|---|
| search | customer, credit_note |
| filters | payment, customer |
| sorts | -last_activity, balance, customer |
| default_sort | -last_activity |
| columns | customer, balance, credited_total, applied_total, refunded_total, last_activity |
| views | All, With balance, Exhausted |
| export | rows: filtered, all; what: accounts, rows; formats: CSV, XLSX; big: over 1,000 rows comes by email; failure is emailed too |
| page | 50 |

### Payment

| Can do | How |
|---|---|
| create | Owner or accountant presses Record payment on an issued or part-paid invoice, prefilled with the full balance, today, the last-used mode and the customer's usual TDS. A client with a share link may file an I-have-paid claim instead. Staff and viewers cannot. Staff file 'Money received' (amount, mode, photo) as a Pending check claim that an owner or accountant confirms with one tap, so the customer can have a receipt the same day. Money above the open invoices, or arriving before any invoice, is kept on account (R60). |
| edit | Only the reference and the note change after saving. A wrong amount, date or invoice is fixed by reversing and recording again. |
| view | Amount, method, state, fees, the document it settled, and the payer. |
| search | Receipt number, reference, customer name, invoice number and amount. |
| filter | State, method, date range, amount range, currency, payer, settled or unsettled. |
| sort | Newest first; also amount and date received. |
| saved view | Named filters like Failed, Disputed, This month. |
| columns | Pick amount, fee, net, method, payer, settled-on columns. |
| export | CSV for the accountant with date, receipt, customer, invoice, mode, amount, TDS, reference and reversed; same filters as the screen; reversed rows only when asked. |
| reverse | Owner or accountant reverses the whole payment with a reason of 5 to 200 letters; the recorder may undo within 10 seconds with no reason. There is no partial reversal. A bounced cheque is a reversal marked bounced. |
| print pdf | Receipt with number, date, each invoice it settles, amount in figures and words, TDS, mode, reference and balance after. It says it is not a tax document. |
| comment | Internal note on the payment, such as bank reference or dispute detail. |
| remind | A claim that nobody confirmed reminds owner and accountant on day 3 and day 7, and lapses on day 14. |
| history | Every state change with time and gateway message; kept forever. |
| link related | Shows the document, customer, refunds, payout and dispute together. |
| notify | The customer gets the receipt by email unless the box is unticked; WhatsApp is offered next. Every owner is emailed at once when a payment is reversed or bounced. |

**room:** custom fields

**later:** group; bulk; import; share link; approve; attach; tag; api (Comes with the public API; every write will carry an idempotency key.); webhook (Waits for the public API and the gateway.)

**no:** draft; delete; archive; restore; duplicate; version; preview; assign; follow; schedule (Nothing retries or repeats; there is no gateway in this wave. The claim lapse is a move of the system.); merge

| Question | Answer |
|---|---|
| amount | Rupees in paise, above 0 and up to 10 crore, 2 decimals; 0 is allowed only when TDS arrives later and a TDS amount is given. Income-tax TDS and GST TDS are two separate figures. Amount plus both TDS figures may not pass the balance due of the invoices it settles; a larger amount is kept on account of the customer after one tick (R60), never refused; income-tax TDS across all rows stays within 20 percent of the taxable value unless an owner overrides (R23). A foreign payment also stores the foreign amount, the rupees credited, the bank charge and the gain or loss. |
| settles | One or more issued or part-paid invoices of one customer, through allocation rows that add up to the amount; oldest due first by default. Draft, paid and void invoices refuse it with a clear message. |
| undo | Recorder within 10 seconds, no reason; then the owner or an accountant, with a reason. The row stays, greyed and left out of totals, the invoices are recalculated and the receipt number is never reused. A reversal is never refused for credit already spent or refunded: it writes 'Customer owes' on the credit account (R30); in a locked period it writes a new correction row dated today. |
| fail | A claim is shown as Pending check, never as paid. Owner and accountant are told at once, reminded on day 3 and 7, and on day 14 it lapses; the client then sees not confirmed and may file again. Nothing else can hang, because no gateway is connected. After one lapsed or declined claim on an invoice, the next claim on it needs an owner to allow it, and reminders resume the day it lapses (R40). |
| fee | No fee on a rupee payment. A foreign payment keeps the bank charge as its own figure beside the gross amount, the rupees credited, and the exchange gain or loss, and the invoice settles at its own currency value. |
| dispute | There are no chargebacks without a gateway. When a customer says a recorded payment never happened, the owner reverses it with a reason; the history keeps both rows. |
| proof | A receipt REC/YY-YY/NNNNN from its own gapless counter per firm and financial year of the payment date, given when the payment becomes active, not when a claim is filed. It states TDS and balance left and says it is not a tax document. |
| match | By hand, through the reference and the receipt number; there is no bank import in this wave. A possible duplicate (the same UTR or reference anywhere in the firm, or the same customer and amount within 3 days, reversed rows ignored) needs one more tap and names the earlier row; each save carries a client key so a retry saves once (R25). |

**States, payment:** pending_check (start), active, reversed (end), declined (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| record | pending_check | active | owner, accountant | invoice is issued or part-paid; amount above 0, or 0 when a TDS amount is given; amount plus both TDS amounts not above balance due; date not in the future in IST and not before the invoice date; reference given for cheque, bank transfer and UPI; period not locked; cash of Rs 2,00,000 or more from one person in a day, for one transaction or for one event is refused with the section 186 warning. Money above the balance is kept on account when the person ticks it (R60); TDS stays within 20 percent of taxable value across rows unless an owner overrides; cash at the limit is refused for an accountant and an owner records it with a reason, marked cash over limit (R33); a payment dated before the invoice is recorded on account, not on the invoice. | a person's save is born pending and becomes active in the same save; receipt number given, allocation rows written, invoice balance and state recalculated, history row | reverse by the owner, or undo_save within 10 seconds | pay_receipt |
| confirm_claim | pending_check | active | owner, accountant | claim still pending and the amount still fits the balance due of the invoice. a claim by UPI or bank transfer needs its reference, and an accountant cannot confirm a claim above Rs 10,000.00: an owner does | same as record: receipt number given now, invoice recalculated, the client's share page shows paid. a daily digest lists to the owners every payment recorded or confirmed with no bank reference | reverse by the owner | pay_receipt |
| decline_claim | pending_check | declined | owner, accountant | reason of 5 to 200 letters | claim closed, invoice untouched, the client sees not confirmed | none: the client may file a new claim or the owner records the payment by hand | pay_claim_declined |
| claim_lapses | pending_check | declined | system | pending for 14 days | claim closed with the reason lapsed, owner told once | none: the client may file a new claim or the owner records the payment by hand | pay_claim_lapsed |
| undo_save | active | reversed | owner, accountant | same person who saved it, within 10 seconds | invoices recalculated, no reason asked, receipt number stays used | record the payment again | none |
| reverse | active | reversed | owner, accountant | reason of 5 to 200 letters; in a locked period it writes a new correction row dated today, tagged prior-period correction, and never moves the lock; never refused for credit already spent or refunded, a debit row 'Customer owes' is written (R30) | allocations reversed, invoice balances and states recalculated, a later credit note on the same invoice recalculated too, receipt number stays used | record the payment again as a new payment with a new receipt | pay_reversed_owner |
| bounce | active | reversed | owner, accountant | mode is cheque and the bank memo reference is written. in a locked period it writes a new row dated today tagged prior-period correction; never refused for spent or refunded credit (R30) | as reverse; an optional bank charge is kept for the accountant and is not billed to the customer | record the payment again if the cheque is presented again | pay_reversed_owner |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| receipt_number | text | yes | 16 |  | nobody |  |
| customer | link | yes |  |  | nobody |  |
| paid_at | date | yes |  | today | nobody; reverse and record again | The payment date cannot be in the future or before the invoice date. |
| amount | money | yes | above 0 and up to 10 crore, 2 decimals; 0 only with TDS |  | nobody; reverse and record again | Enter an amount above 0. With TDS it cannot be more than the balance due. |
| kept_on_account | money |  | 0 to the amount, 2 decimals | 0 | nobody; reverse and record again | The part kept on account cannot be more than the amount. |
| client_key | text | yes | 64 |  | nobody | Set by the app so that a retry saves once. |
| tds_amount | money |  | 0 to 20 percent of the invoice taxable value across all rows; an owner can raise it with a reason | 0 | nobody; reverse and record again | TDS cannot be more than 20 percent of the taxable value of the invoice. |
| gst_tds_amount | money |  | 0 to 2 percent of the taxable value of the invoice | 0 | nobody; reverse and record again | GST TDS cannot be more than 2 percent of the taxable value. |
| tds_section | choice |  |  |  | nobody | Choose the section from the list or type another rate. |
| mode | choice | yes |  |  | nobody | Choose cash, bank transfer, UPI, cheque, card or other. |
| reference | text |  | 60 |  | owner and accountant, any time | Enter the cheque number, bank reference or UPI reference, up to 60 letters. |
| note | text |  | 300 |  | owner and accountant, any time | The note is longer than 300 letters. |
| source | choice | yes |  | manual | nobody |  |
| currency | choice | yes |  | INR | nobody | The payment currency must be the invoice currency. |
| inr_credited | money |  | up to 10 crore, 2 decimals |  | nobody | Enter the rupees that reached the bank. |
| bank_charge | money |  | up to 1 lakh, 2 decimals |  | nobody | Enter the bank charge, up to 1 lakh. |
| fx_gain_loss | money |  | signed, 2 decimals |  | nobody |  |
| reversed_reason | text |  | 200 |  | nobody | Write a reason of 5 to 200 letters. |
| claim_expires_at | date |  |  |  | nobody |  |

| List |  |
|---|---|
| search | receipt_number, reference, customer, invoice, amount |
| filters | payment, mode, paid_at, customer, source |
| sorts | -paid_at, amount, receipt_number |
| default_sort | -paid_at |
| columns | paid_at, receipt_number, customer, invoice, mode, amount, tds_amount, reference, recorded_by |
| views | All, Pending check, This month, Reversed, Cheques, Foreign |
| export | rows: selected, filtered, date range; what: payments, allocations, TDS; formats: CSV, XLSX; big: over 1,000 rows comes by email; failure is emailed too |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest | payment | -paid_at | tenant, payment, paid_at | 150 ms |
| by_mode | payment, mode | -paid_at | tenant, payment, mode, paid_at | 150 ms |
| one_customer | customer | -paid_at | tenant, customer, paid_at | 100 ms |
| in_range | paid_at | -paid_at | tenant, paid_at | 150 ms |
| claims | source, payment | -paid_at | tenant, source, payment, paid_at | 100 ms |
| by_amount |  | amount | tenant, amount | 200 ms |
| by_receipt |  | receipt_number | tenant, receipt_number | 100 ms |

### Refund

| Can do | How |
|---|---|
| create | Owner or accountant presses Refund on the customer's credit; amount, date, mode, reference and paid from are asked, and the number REF/YY-YY/NNNNN is given on save. Refund starts as Reserve: the amount is locked in the ledger so nobody can apply it, the owner pays from the bank, then Confirm paid with the bank reference gives the number (R29). The most that can be refunded per customer is the cash received less cash already refunded. |
| edit | Only the reference and the note change after saving; a wrong amount is fixed by reversing and recording again. |
| view | Amount, method, state, fees, the document it settled, and the payer. |
| search | Refund number, customer name and reference. |
| filter | State, method, date range, amount range, currency, payer, settled or unsettled. |
| sort | Newest first; also amount and date received. |
| export | CSV with number, date, customer, amount, mode, reference and reversed, filtered like the list. |
| reverse | Owner reverses a refund with a reason of 5 to 200 letters; the amount returns to the customer's credit and the number stays used. |
| print pdf | Refund page with number, date, customer, amount, mode, reference and the credit note it settles. |
| comment | Internal note on the payment, such as bank reference or dispute detail. |
| history | Every state change with time and gateway message; kept forever. |
| link related | Shows the document, customer, refunds, payout and dispute together. |
| notify | Every owner is emailed when a refund is reversed; the customer is told nothing by the system. |

**room:** custom fields

**later:** group; saved view; columns; bulk; import; share link; approve; attach; tag; remind; api (Read and write come with the public API.); webhook (Refund events come with the public API.)

**no:** draft; delete; archive; restore; duplicate; version; preview; assign; follow; schedule (A refund is recorded after the money has left; nothing is scheduled or retried.); merge

| Question | Answer |
|---|---|
| amount | Rupees in paise, above 0 and never above the customer's credit balance; refused with the available figure. Two refunds at once cannot together pass the balance, the account is locked while one saves. |
| settles | The credit of one customer, taken from the account and not from a single invoice; the print page names the credit note it came from. |
| undo | Only the owner reverses it, with a reason; the amount goes back to the credit account, the number stays used, the row is greyed and left out of totals. |
| fail | A refund is a record of money that already left, so nothing hangs. A save that loses the race to another refund is refused with the new balance. |
| fee | No fee is recorded in this wave; a bank charge on the refund is the firm's own bookkeeping. |
| dispute | A customer who says the money did not arrive is answered by the reference on the refund; if it was wrong the owner reverses it and records it again. |
| proof | A numbered refund page REF/YY-YY/NNNNN from its own gapless counter per firm and financial year, with no tax effect and not a tax document. |
| match | By the reference, mode and the paid-from account; there is no bank import in this wave. The list and the CSV give the accountant one row per refund. |

**States, payment:** reserved (start), recorded, reversed (end), released (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| reverse_refund | recorded | reversed | owner | reason of 5 to 200 letters; period not locked | amount returns to the customer's credit as a new row, the account may leave exhausted, number stays used | record the refund again with a new number | refund_reversed_owner |
| confirm_paid | reserved | recorded | owner, accountant | the bank reference is typed; the reserved amount is still in the ledger; an accountant above Rs 10,000.00 needs an owner to confirm | the number REF/YY-YY/NNNNN is given, the reserved amount leaves the ledger as refunded, history row | reverse_refund by the owner | none |
| release_reserved | reserved | released | owner, accountant | reason of 5 to 200 letters | the reserved amount is free again in the ledger; no number was used | reserve again with a new refund | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| number | text | yes | 16 |  | nobody |  |
| customer | link | yes |  |  | nobody |  |
| amount | money | yes | above 0 and not above the credit balance |  | nobody; reverse and record again | The refund is more than the credit balance; the available credit is shown. |
| refunded_at | date | yes |  | today | nobody; reverse and record again | The refund date cannot be in the future. |
| mode | choice | yes |  |  | nobody | Choose cash, bank transfer, UPI, cheque or other. |
| paid_from | choice | yes |  | firm_bank | nobody | Choose the firm's bank account or cash. |
| reference | text |  | 60 |  | owner and accountant, any time | Enter the reference, up to 60 letters. |
| note | text |  | 300 |  | owner and accountant, any time | The note is longer than 300 letters. |
| reversed_reason | text |  | 200 |  | nobody | Write a reason of 5 to 200 letters. |

| List |  |
|---|---|
| search | number, customer, reference |
| filters | payment, customer, mode, refunded_at |
| sorts | -refunded_at, amount, number |
| default_sort | -refunded_at |
| columns | number, refunded_at, customer, amount, mode, reference |
| views | All, This month, Reversed |
| export | rows: selected, filtered, all; what: refunds; formats: CSV; big: over 1,000 rows comes by email; failure is emailed too |
| page | 50 |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Search | /search | list | owner, accountant, staff, viewer | Search | menu, home | Type a number, a name, a GSTIN or an amount. Spaces and slashes in a number are ignored. | Nothing matches. Check the spelling, or try only the last digits of the number. |  |
| An invoice | /invoices/:id | detail | owner, accountant, staff, viewer | Record payment | invoices, search, customer, payments, payment, credit_note, outbox, einvoice_queue, history, link |  |  |  |
| A customer | /customers/:id | detail | owner, accountant, staff, viewer | New invoice | customers, invoice, search, credit_register |  |  |  |
| Payments | /payments | list | owner, accountant | Record payment | home, menu, customer | No payments yet. When a customer pays, record it here or from the invoice. | No payment matches these filters. Clear them or widen the dates. |  |
| Record a payment | /payments/new | form | owner, accountant | Save payment | payments, invoice, customer |  |  | Payment is saved and the invoice is updated. Send the receipt on WhatsApp, or undo within 10 seconds. |
| A payment | /payments/:id | detail | owner, accountant | Send receipt | payments, invoice, customer, search |  |  |  |
| Customer credit | /credit | list | owner, accountant, viewer | New refund | menu, customer, credit_note | No customer credit. It appears when you issue a credit note for an invoice that was paid. | No row matches. Try the customer name or With balance. |  |
| Invoice page for the customer | /d/:token | public | client | Pay with UPI | link |  |  |  |
| Your documents | /c/:token/home | public | client | Pay selected | client_sign_in, link | Nothing yet. Invoices and quotes from the firm will show here. | No document in this period. |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| pay_receipt | payment.record | client | email, whatsapp_link | {firm} received {amount} on {date} for invoice {number}, receipt {receipt}. Tax deducted at source {tds}. Balance left {balance}. |
| pay_claim_declined | payment.decline_claim | client | email | {firm} could not confirm your payment of {amount} for invoice {number}. {balance} is still due. If you paid, send the bank reference to {contact} or file the claim again. |
| pay_claim_lapsed | payment.claim_lapses | owner, accountant | app | The claim of {amount} on invoice {number} from {customer} was not checked in 14 days and lapsed. The customer sees it as not confirmed and may file again. |
| pay_reversed_owner | payment.reverse | owner | email, app | Payment {receipt} of {amount} on invoice {number} was {kind} by {actor}. Reason: {reason}. The balance is {balance} again. |
| refund_reversed_owner | refund.reverse_refund | owner | email, app | Refund {number} of {amount} to {customer} was reversed by {actor}. Reason: {reason}. The amount is back in the customer's credit. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A029 | One payment can be split across several invoices of the same customer; the allocation screen defaults to oldest-due first and must sum to the amount. | now | allocation.create |
| A031 | Cheque payment moves received, deposited, cleared or bounced; a bounce reverses the payment, restores balance, and can add a bank-charge debit. | now | payment.bounce |
| A048 | Payments link to invoices through an allocation table; the sum of allocations never exceeds the payment amount, enforced by constraint or locked transaction. | now | allocation.amount |
| A096 | TDS on fees is stored by section 393(1) serial number of the Income-tax Act 2025 for payments from 1 April 2026 (Sl.6(iii) old 194J, Sl.6(i) old 194C), shown with the old number as an alias; the user can type another rate. | now | payment.tds_section |
| A097 | Suggested TDS amount is computed on the amount before GST when GST is shown separately on the invoice; the user can override it. | now | payment.tds_amount |
| A100 | TDS recorded on a payment appears in a receivable ledger by customer, section and financial year, with a flag for certificate received: Form 131 for payments from 1 April 2026, Form 16A before. | now | payment.tds_section |
| A102 | TDS on a payment has a type, income-tax or GST TDS at 2 percent from government customers; each shows on its own line and both settle the invoice. | now | payment.gst_tds_amount |
| A120 | A cash receipt that would reach Rs 2,00,000 from one person in a day, for one transaction, or for one event is blocked with the warning of section 186 of the Income-tax Act 2025 (old 269ST). | now | payment.record |
| A156 | Payment and credit note posted to the same invoice at the same moment cannot together exceed balance; the invoice row is locked. | now | allocation.settles |
| A172 | Reversing a payment whose invoice already carries a later credit note recalculates both, and customer credit never goes negative. | now | payment.reverse |
| A188 | TDS amount cannot exceed the invoice taxable value; payment mode, amount and TDS all show together in one error summary. | now | payment.tds_amount |
| A213 | Payment receipt message goes automatically after a payment unless the box is unticked, and states amount, TDS, balance left and receipt number. | now | payment.notify |
| A216 | The share page shows invoice, balance due, a Pay with UPI button that opens the customer's UPI app with payee, balance and invoice number, a QR on desktop, and a PDF download; it stays usable after the due date, says plainly when the invoice is paid or voided, needs no login, carries no internal notes and stays light on slow phones. | now | payment.create |
| A230 | Month-end job on the 1st at 08:00 IST builds the accountant pack: sales register, credit and debit notes, receipts, TDS and ageing, emailed or linked. | now | payment.export |
| A249 | Sales register, credit notes and receipts export as a zip with one CSV per month for the accountant, in the same column order every time. | now | payment.export |
| A251 | Customer ledger and payment CSV exports exist with the same filter options as the screen they come from. | now | payment.export |
| B043 | Invoice, credit note, payment receipt and email each have their own template, each editable, with one marked default. | now | payment.print_pdf |
| B045 | Email subject and body for invoice, receipt, credit note, quote and three reminders accept merge tags for number, amount and view link, with a live preview. | now | payment.notify |
| B064 | A payments-received report lists date, customer, invoice, mode, amount and TDS for a range, with refunds in a separate report. | now | payment.export |
| B141 | A payment can record a bank or card fee so net money received differs from the amount settled against the invoice. | later | payment.bank_charge |
| B170 | The payment form states in one line what TDS is and shows net money expected before saving. | now | payment.tds_amount |
| B212 | A credit note's excess becomes customer credit; the owner can apply it to a later invoice of the same customer or record a manual refund that reduces it. | now | credit_ledger.apply, refund.create |
| B228 | A payment can carry an attached proof file, such as a UPI screenshot or a cheque photo. | later | payment.attach |
| C030 | A client who pays by UPI to the firm's plain UPI ID outside the page can tell the firm with an I have paid button carrying a reference number. | now | payment.create |
| C031 | The firm sees an I have paid claim as Pending check, not as paid, until the owner or accountant confirms it with one tap. | now | payment.confirm_claim |
| C034 | Marking an invoice paid by hand takes at most 3 taps: open invoice, Record payment (prefilled with the full balance, today, the last-used mode and the customer's usual TDS percent, with balance due on top and a Full amount chip), Save. | now | payment.create |
| C037 | After Save payment, the screen offers Send receipt on WhatsApp as the next action. | now | payment.notify |
| C139 | Reversing a payment, voiding an invoice or issuing a credit note over Rs 10,000 emails all owners at once with the actor and amount. | now | payment.reverse |
| D088 | Net receipt after TDS: a line smaller than the invoice by about the TDS percent offers to record payment plus TDS automatically. | later | payment.tds_amount |
| D093 | A refund of customer credit records an amount up to the credit balance, date, mode, reference and bank account, is numbered REF/YY-YY/NNNNN without gaps, and two refunds at once can never exceed the balance. | now | refund.create |
| D094 | Refund list filters by customer, mode and date; columns number, date, customer, amount, mode, reference; exports to CSV. | now | refund.filter, refund.export |
| D095 | A refund can be reversed by an owner with a reason, returning the amount to the customer's credit balance. | later | refund.reverse_refund |
| D096 | Refund print page shows number, date, customer, amount, mode, reference and the credit note or advance it settles. | now | refund.print_pdf |
| D098 | Webhooks refund.created and refund.reversed carry refund id, customer id and amount. | later | refund.webhook |
| D160 | Payment in foreign currency records amount received, INR credited, bank charges and the exchange gain or loss line. | now | payment.inr_credited |
| D161 | Foreign inward remittance advice reference (FIRC) can be attached to a payment with number and date. | later | payment.attach |
| D173 | The client page shows only that customer's issued invoices, quotes, payments with receipts, credit notes and statement, with PDF download and Pay with UPI; drafts and internal notes never show. | now | payment.create |
| D298 | Customer credit ledger lists each credit in, amount applied, refund and balance after, newest first, each row linking to its document. | now | credit_ledger.view |
| D300 | Unapply credit from an invoice returns it to the ledger, restores balance due, and records who and why. | now | credit_ledger.unapply |
| D357 | The payments list shows date, receipt, customer, invoice, mode, amount, TDS, reference and recorded-by, newest first, filterable by mode, date, customer and reversed; reversed rows are greyed and left out of totals. | now | payment.filter |
| D370 | API POST payments with an Idempotency-Key; response gives receipt number; GET filters by invoice, customer and updated_since. | later | payment.api |
| D371 | Webhooks payment.recorded and payment.reversed with amount, invoice ids, receipt number and mode. | later | payment.webhook |
| K043 | data: payment: invoice, amount, TDS, date, mode, reference, receipt number, reversed flag | now | payment.amount |
| W011 | Customer detail shows outstanding balance as the total balance due on that customer's issued and partially paid invoices, in rupees, with unused credit balance shown as a separate figure. | now | credit_ledger.match |
| W037 | Balance due equals grand total minus non-reversed payments and TDS, minus active credit notes and customer credit applied to this invoice, and is never below 0. | now | credit_ledger.settles |
| W048 | Owner or accountant can record a payment on an issued or partially paid invoice only; draft, paid and void invoices refuse payments with a clear message. | now | payment.record |
| W049 | Payment amount must be above 0 with 2 decimals, and amount plus TDS cannot exceed the invoice balance due; larger amounts are rejected with a message, because advance receipts are wave 2. | now | payment.amount |
| W050 | Payment date cannot be in the future in IST and cannot be earlier than the invoice issue date. | now | payment.paid_at |
| W051 | Payment mode must be one of cash, bank transfer, UPI, cheque, card or other. | now | payment.mode |
| W052 | Payment reference holds up to 60 characters and is required for cheque, bank transfer and UPI payments. | now | payment.reference |
| W053 | A payment may carry a TDS amount of 0 or more that counts toward settling the invoice but is not money received, and is shown separately in totals and on the receipt. | now | payment.tds_amount |
| W054 | After a payment the invoice becomes partially_paid if balance due is still above 0 and paid when balance due is exactly 0. | now | payment.record |
| W055 | A payment matching an existing non-reversed payment on the same invoice, amount, date and reference within 24 hours is rejected unless the user explicitly confirms it. | now | payment.match |
| W056 | Each payment receives a receipt number REC/YY-YY/NNNNN from its own gapless counter per firm and financial year of the payment date. | now | payment.receipt_number |
| W057 | The receipt print page shows receipt number, payment date, invoice number or the invoices it settles with each allocation, customer, amount received in figures and words, TDS, mode, reference, balance after, and a note that it is not a tax document. | now | payment.print_pdf |
| W058 | A saved payment cannot be edited except its reference and note; a wrong amount is fixed by reversing and recording again. | now | payment.edit |
| W059 | Only an owner can reverse a payment with a reason of 5 to 200 characters, and the user who saved a payment can undo it within 10 seconds with no reason; the row stays listed as reversed, balance and status are recalculated, and its receipt number is never reused. | now | payment.reverse, payment.undo_save |
| W066 | Issuing a credit note lowers the invoice balance due, and any amount above that balance becomes the customer's credit balance. | now | credit_ledger.add_credit |
| W067 | Owner or accountant can apply a customer's credit balance to another issued invoice of the same customer, up to the smaller of the credit balance and that invoice's balance due. | now | credit_ledger.apply |
| W068 | The credit note print page is titled "Credit Note" and shows its number and date, the original invoice number and date, reason, lines, tax split, total, and each application to other invoices. | now | credit_ledger.proof |
| W069 | An issued credit note cannot be edited or deleted; only an owner can void it with a reason, restoring invoice balance, and only if none of its credit has been applied elsewhere. | now | credit_ledger.withdraw |
| W208 | The client page lists a receipt for each confirmed payment with a PDF download; a claim that waits for the firm shows Pending check and has no receipt until it is confirmed. | now | payment.print_pdf |
| W209 | On the client page the client ticks several open invoices, sees one total, pays it by one UPI transfer and files one I have paid claim of that amount; it waits as Pending check and the firm splits it across the invoices with the oldest-due-first default. | now | payment.create |
