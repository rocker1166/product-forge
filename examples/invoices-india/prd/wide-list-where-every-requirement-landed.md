# Invoices for Indian service firms: Wide list: where every requirement landed

| Id | Requirement | When | Where or why |
|---|---|---|---|
| A014 | Owner creates API tokens with read or read-write scope; the secret shows once, is stored hashed, and revoked tokens return 401. | later | public API follows the web product |
| A025 | Advance refunded because no supply happened: issue a refund voucher against the receipt voucher, reversing the tax shown on it. | later | needs receipt vouchers built first |
| A027 | Time billing: staff log hours against a customer and rate; Bill selected entries builds invoice lines, marks entries billed, and voiding the invoice frees them. | room | time_entry.bill, rule:R68 |
| A028 | Expenses re-billed to a customer become invoice lines from stored expense entries with receipt attached; billed entries cannot be billed twice. | room | expense.bill, rule:R68 |
| A030 | Money received before any invoice exists is saved as on-account payment on the customer and can be allocated later. | room | rule:R60 |
| A032 | Customer pays through a payment link; the gateway webhook records the payment with its reference and emails a receipt without staff action. | later | gateway link comes after the QR |
| A036 | Debit note: added charges after issue go on a debit note linked to the invoice, in its own series, and raise the balance due. | room | rule:R58 |
| A038 | Recurring drafts notify the owner and wait for review; an owner can mark a schedule auto-issue and auto-send once it has run clean three times. | later | auto-issue needs proven schedules |
| A051 | A customer can have several billing and shipping addresses and several contacts with roles (billing, cc); each invoice picks one address and stores a copy. | room | rule:R61 |
| A052 | A customer may hold several GSTINs, one per state registration; the invoice picks one and place of supply follows it. | room | rule:R61 |
| A057 | Firm can hold several GSTIN registrations, each with its own state, address and number series; every invoice belongs to exactly one. | room | rule:R61 |
| A070 | Timesheet entries store person, date, hours, rate, customer, billable flag and billed invoice id; billed entries are locked. | room | time_entry.hours, time_entry.rate |
| A075 | Services invoice prints 'Original for recipient' and 'Duplicate for supplier' copies; printing both on one run is one action. | later | duplicate copy is a print nicety |
| A090 | Composition firm shows a tax-on-turnover report at 6 percent for services, with quarterly figures, and never shows GST on documents. | later | turnover tax report is composition-only |
| A094 | Interest on delayed payment to a micro or small supplier is three times the RBI bank rate with monthly rests; the payment period can be agreed up to 45 days, 15 days without agreement. | later | interest rules need legal review |
| A099 | A TDS rate of 20 percent applies to a payee without PAN; the TDS helper shows this when the firm has no PAN on file. | later | owner rarely lacks a PAN |
| A103 | An optional TCS line sits outside GST taxable value for firms that collect it; it never changes the tax split. | later | TCS is rare for services |
| A116 | Debit note carries its own number series DBN, links to the invoice, adds tax at the original rate, and has no 30 November limit. | later | debit notes follow credit notes |
| A119 | Reimbursed expense lines marked pure-agent need receipt, customer-authorised-payment and no-markup ticks; missing one turns the line taxable. | room | expense.pure_agent_receipt, expense.pure_agent_authorised, expense.pure_agent_no_markup, rule:R68 |
| A128 | Export payment reduced by bank charges or forex difference is closed through a bank-charge adjustment, not left as a small balance due. | later | write-off closes the gap meanwhile |
| A130 | Continuous-supply contracts get an invoice on or before the payment due date set in the contract; the schedule uses that date. | later | contract dates need a contract record |
| A133 | GSTIN change or new registration of the firm starts a fresh series for that GSTIN; old series stay readable and untouched. | room | rule:R61 |
| A136 | Cheque payments carry received, deposited, cleared or bounced; only cleared cheques count toward settled in strict mode, if the firm turns it on. | later | strict clearing is an option |
| A138 | Time entries are open, approved, billed; billed to open happens only when the linked invoice is voided. | room | time_entry.approve, time_entry.release |
| A139 | Payment link states are created, opened, paid, expired and cancelled; a paid link cannot be used again. | later | link states follow payment links |
| A140 | Invoice carries a separate flag disputed on or off; it never changes status or balance, only reminders and list filters. | later | disputes follow share-page actions |
| A144 | Receipt voucher states are issued, adjusted and refunded; adjusted ones cannot be refunded again. | room | rule:R60 |
| A146 | Written-off balance sets invoice status paid-with-write-off in reports and can be undone by an owner within the same open period. | later | undo needs period lock proven |
| A150 | Gateway webhook arrives twice or out of order; the payment is recorded once and later events never undo a newer state. | later | webhooks arrive with the gateway |
| A151 | Gateway webhook with an amount different from the link amount creates a flagged payment for review, not an auto-settled invoice. | later | amount checks belong to gateway |
| A152 | Webhook with a bad signature is rejected with 401 and logged; the payment is not recorded. | later | signature check belongs to gateway |
| A155 | A customer's GSTIN shows cancelled or suspended on the portal at issue time; the user sees a warning and may continue with a reason. | later | needs a GSTIN status lookup |
| A161 | Plan limit reached mid-bulk action: documents already issued stay, the rest stay draft, and the result says how many of each. | later | bulk issue is not in launch |
| A167 | Recurring day 29 to 31 is not offered; a schedule imported with such a day is clamped to 28 and tells the owner. | later | imported schedules are not offered |
| A169 | API requests carry an idempotency key; repeating the key with the same body returns the first result, a different body returns 422. | later | external clients arrive with the API |
| A176 | TAN must match four letters, five digits, one letter. | later | TAN is not stored yet |
| A202 | WhatsApp invoice message uses a pre-approved template with named fields and a PDF; free text is not sent outside the 24-hour reply window. | later | WhatsApp API needs template approval |
| A203 | WhatsApp sends only to customers marked as opted in; the opt-in source and date are stored. | later | opt-in tied to WhatsApp API |
| A204 | Customer replying STOP to a WhatsApp or SMS message sets the opt-out flag and no further reminders go on that channel. | later | STOP replies need WhatsApp API |
| A206 | SMS goes only through a registered sender ID and template with an entity ID; text not matching the template is not sent. | no | SMS is not a channel here |
| A207 | SMS text uses 'Rs' instead of the rupee sign, and a message that would exceed one segment shows its segment count before send. | no | SMS text rules go with SMS |
| A214 | Owner gets a weekly email on Monday 9 am IST with total overdue, newly paid, and top 5 late customers. | later | digest email is a nicety |
| A233 | Webhook delivery to outside systems retries with growing waits for 24 hours, then lands in a dead-letter list the owner can replay. | later | outbound webhooks follow the API |
| A234 | Daily reconciliation job compares gateway settlements with recorded online payments and flags payments missing on either side. | later | reconciliation needs the gateway |
| A250 | GSTR-1 JSON export validates against the GST offline tool's schema and lists errors per document before download. | later | registers first, portal file after |
| A258 | Merge two customers moves invoices, payments, credit notes and credit balance to the kept one and leaves old snapshots unchanged. | later | merge needs careful money moves |
| A259 | Bulk upload of payments from a bank statement CSV matches rows to invoices by amount and reference and shows unmatched rows for manual choice. | room | connection:bank_match |
| A260 | Bank statement matching suggests but never auto-records; the user confirms each batch. | room | connection:bank_match |
| A263 | A firm changing its legal name or address records an effective date; documents on or after it show the new details. | later | legal-name history is rare |
| B002 | Dashboard shows total invoiced and total received for the current financial year; each figure opens its own report on tap. | later | financial-year totals are a second row |
| B003 | Dashboard period switch offers this month, last quarter, this financial year and custom range, and keeps the last choice per user. | later | dashboard period memory is polish |
| B004 | Dashboard lists expected receipts in buckets 0-15, 16-30, 31-45 and above 45 days from today, per customer. | later | expected-receipts buckets need history |
| B007 | A filtered and sorted invoice list can be saved as a named custom view and reopened in one tap. | no | filters cover small firms |
| B008 | A report preview has a text box over each column that filters rows live, and the CSV button then exports only the visible rows. | later | live column filters on reports |
| B009 | Keyboard shortcuts exist for new transaction, and for email, print and download of all selected rows in the list. | no | tap-first product skips keyboard shortcuts |
| B012 | One bulk action sets TDS on only the ticked lines of an invoice, so the user need not untick each line. | no | TDS stays a payment figure |
| B013 | An issued invoice can be scheduled to email at an exact date and time chosen by the user, for example 9 am next morning. | later | timed sending is extra |
| B014 | After saving an invoice the user can stay on a blank new invoice for the same customer, to enter several milestone invoices in a row. | no | repeat entry rarely matters |
| B016 | Recurring setting chooses create as draft or create and send, at firm level, and each recurring profile may override it. | later | auto-send waits for review habit |
| B017 | Repeated CSV import column mappings can be saved as a named template and picked from a dropdown on the next import. | later | saved mappings serve repeat imports |
| B018 | One search key focuses the search box from any page; results group by module and an advanced search can narrow by field. | later | global search is extra |
| B019 | Shift plus question mark opens a popup listing every shortcut, and the same list opens from the help menu. | no | no shortcuts to list |
| B020 | Go-to keys jump to the invoices, estimates and credit notes lists, and other keys open settings and the firm switcher. | no | no go-to keys offered |
| B021 | Keys select all rows, and select a range between two rows, to feed bulk email or download. | no | no range keys offered |
| B024 | A sales-by-user report totals invoice count, amount and tax per creating user; invoices with no assigned user count for nobody and say so. | later | per-user sales report is team-size feature |
| B026 | Request pattern: a permissions grid with View, Create, Edit per category appears when the administrator switch is off. | no | roles are fixed |
| B028 | The user who created the firm is marked super owner; only that user can delete the firm, and transfer needs another active owner. | no | owner-only deletion already covers it |
| B029 | The portal sign-in for a firm's customers can require a one-time code as a second step, switched by the firm. | later | customer portal sign-in not built |
| B030 | Users can sign in with a passkey or a second factor, and the owner can require it for every user of the firm. | later | passkeys after TOTP |
| B031 | Users can sign in with a Google or Microsoft account, and the owner can turn password sign-in off for the firm. | later | social sign-in after password login |
| B033 | Each user picks own language, date format and number format; the invoice PDF follows the firm setting, not the viewer's. | no | one language per firm is enough |
| B034 | Firm setting for first month of the year anchors annual reports; India default is April and the setting shows the resulting financial year. | no | Indian financial year is fixed April to March |
| B035 | Company number format decides how imported amounts parse, comma or full stop as decimal, and the import preview shows the parsed result. | no | Indian number formats only |
| B037 | Two logo variants, one for white backgrounds and one for the coloured header bar, can be uploaded. | no | one logo covers it |
| B039 | The downloaded invoice file name follows a pattern the firm sets, such as number plus customer name. | no | file name stays fixed |
| B041 | The customer portal can run on the firm's own domain, with the firm's own sender address on invoice emails. | later | custom domain is a paid extra |
| B044 | Templates include multi-logo and multi-address variants for firms invoicing from more than one branch. | later | multi-branch variants follow multi GSTIN |
| B047 | Line items can be grouped under a titled group that shows only the group subtotal on the PDF. | no | line groups clutter small invoices |
| B048 | Reminders can run before due date, after due date or after invoice date, in up to three tiers plus an endless repeat with its own frequency. | later | tier setup beyond fixed 1, 7, 15 |
| B049 | Reminders can key off the expected payment date as well as the due date, with three preloaded reminder rules. | later | expected-date rules are an extra |
| B050 | A late fee added by a reminder appears as its own invoice line or note, never silently inside the balance, with consent text. | later | late fee by reminder needs consent text |
| B051 | A thank-you note with the receipt is sent automatically when a customer pays online, and the owner gets a notice. | later | thank-you note follows online payments |
| B053 | Recurring invoices can auto-apply excess payments and open credit notes of the same customer when they are created. | later | credit auto-apply is automation extra |
| B054 | A recurring profile shows next send date, frequency, remaining cycles and status on one summary tab, and a schedule tab lists upcoming dates with due dates. | no | summary tabs add nothing |
| B057 | One customer's several monthly profiles can merge into a single invoice on the same day. | no | separate invoices read clearer |
| B059 | An invoice can be scheduled to be created and sent on a future date as a one-off, separate from repeating profiles. | no | same as timed sending |
| B062 | Sales by customer shows invoiced total per customer for a date range, switchable between invoices only, credit notes only or both. | later | sales by customer is secondary report |
| B063 | Sales by item or service shows quantity and amount per saved service or SAC code for any range. | later | item-wise sales is secondary report |
| B065 | A refund history report lists each refund by customer, date, amount and mode, apart from the payments received report. | later | refunds report follows refund tracking |
| B071 | System mail report lists every email sent by the firm's account with type, recipient, time and status. | no | the outbox already lists mail |
| B072 | A portal activity report lists when each customer opened, viewed or paid, by time. | later | portal activity needs a portal |
| B074 | An aging report, a statement or a sales report can be scheduled by email weekly, monthly or custom, to chosen addresses. | later | scheduled reports are automation extra |
| B075 | A report run can be emailed to the logged-in user as an attachment instead of downloaded, and optionally with attached documents zipped. | later | emailed reports are automation extra |
| B077 | The hosted invoice page offers every enabled pay method in one place: UPI, card, net banking. | later | pay methods follow the gateway |
| B079 | An owner can mark an invoice un-viewed again so the next customer view is tracked afresh. | no | viewed flag must stay truthful |
| B082 | Portal settings include welcome message, whether customers may edit their address and contacts, and whether they may forward documents. | later | portal settings follow portal |
| B083 | A customer can pay money on account without picking an invoice; it lands as an unapplied payment the firm applies later. | later | portal payments follow portal |
| B084 | The owner is told by email when a customer opens an invoice or pays through the portal, if that notice is switched on. | later | portal notices follow portal |
| B085 | Portal colours can be set by the firm, with a contrast check warning before save. | no | portal colours need a portal |
| B091 | Tally data can be imported into the product at first sign-up so old customers and invoices come across. | later | Tally import is a migration extra |
| B092 | AI can read a PDF or photo of a purchase order and prefill customer, lines and amounts; the user reviews before issue. | no | PO photos are not service work |
| B093 | AI answers questions such as who owes me most from the user's own data; answers cite the report they came from. | no | reports already answer these |
| B094 | An MCP server or API lets an AI assistant read invoices only, with scoped keys the owner can revoke. | later | assistant access follows the API |
| B095 | Invoices can be issued in the customer's language from 10 or more languages while the firm's screens stay in its own. | no | English and Hindi are enough |
| B096 | The app UI supports nine or more Indian languages including Hindi, Tamil and Bengali; numbers keep Indian grouping. | no | nine languages exceed small-firm need |
| B097 | Amount in words follows the invoice language, and rupee and paise words are correct for numbers above one crore. | no | depends on B095 |
| B098 | Custom labels let a firm rename built-in words such as Item to Service or Customer to Client on its documents. | no | renamed labels confuse accountants |
| B110 | Import accepts a status value per row (draft, sent, paid) and an optional paid amount column, so history can arrive already settled. | later | paid-history import is a second step |
| B111 | The import result is emailed with counts of created and rejected rows and the reason for each rejected row. | no | the result screen is enough |
| B112 | A migration guide lists steps in order: firm profile, taxes, customers, items, then invoices and payments. | no | the checklist replaces a guide |
| B113 | Bank statement CSV imports map date, description and amount columns, and rows can be matched to invoices afterwards. | later | statement import is bank matching |
| B114 | Request: payments can be imported from a CSV, not only invoices. | later | payment import follows invoice import |
| B115 | Tally customers, items and open bills import from a Tally export, and fields that cannot map are listed in a report. | later | Tally open bills import is migration extra |
| B116 | A demo account with sample data opens before sign-up, and a button clears every sample record in one step. | no | demo data is marketing |
| B117 | Help lives inside the app, with email support hours stated; Zoho states 24/5 free email support on its India plan. | later | help centre comes with launch content |
| B118 | Review pattern: support must solve a problem on first call; a customer reported two hour-long phone calls without a fix. | no | support quality is not a feature |
| B119 | A what's new page lists each release in plain words, and errors link to a help article. | no | a changelog is marketing |
| B120 | Error codes shown to customers on payment failure map to a plain action, for example customer deleted or merchant not enabled. | later | gateway errors follow gateway |
| B124 | Inactive free accounts have a stated retention period, and an email arrives before data is removed. | no | books are never removed for inactivity |
| B125 | A setting group Taxes holds GST settings, TDS settings and MSME settings as separate switches. | no | settings already group sensibly |
| B126 | Account page lists enabled modules so a firm can switch off those it does not use, such as quotes. | no | unused modules just stay quiet |
| B127 | Settings change history is searchable: setting name, old and new value, user and time. | no | the audit log shows setting changes |
| B128 | Group settings let a firm define different defaults for a group of customers, for example export clients versus domestic. | no | customer groups are too heavy |
| B129 | Numbering pattern variables include year, counter and customer fields, with a live example, and can be overridden per group or customer. | no | number format is fixed by GST rules |
| B130 | Custom fields can be marked personal data and encrypted; only admins can view them and others cannot export them. | later | custom fields wait for demand |
| B132 | Backup and export dialogs have an explicit tick for including personal data such as bank account numbers. | no | an export tick is needless |
| B133 | A user can export all their data and ask for deletion; the product states which records must stay under tax law. | later | own-data request handled by support first |
| B134 | A payment link carries an expiry date; after it the link shows expired and cannot be paid, and the invoice stays payable another way. | later | link expiry follows payment links |
| B135 | A payment link can allow partial payment with a minimum first amount, and each part shows on the invoice as its own payment. | later | part payment links follow gateway |
| B136 | A payment link can send reminders before expiry by email and SMS to the customer. | later | link reminders follow gateway |
| B137 | Request pattern: Razorpay as a built-in gateway for Indian firms; its absence was a 15-reaction request in a global tool. | later | gateway choice waits for owner |
| B139 | Gateway charges are the firm's own; the connect page states that, and notes input tax credit on the fee may apply. | later | fee notes follow gateway |
| B140 | Any fee the product keeps on online payments is shown to the firm in rupees before the option is switched on. | later | fee display follows gateway |
| B141 | A payment can record a bank or card fee so net money received differs from the amount settled against the invoice. | later | payment.bank_charge |
| B142 | The payment page offers more than one gateway and the firm sets their order; one gateway failing leaves the others usable. | no | one gateway is enough |
| B143 | When an online payment fails, the customer gets an email with the same link and the firm sees the failure on the invoice. | later | failed-payment mails follow gateway |
| B144 | A standalone payment link, not tied to an invoice, can be created for a fixed amount and is switched on in settings. | later | standalone links follow gateway |
| B145 | Imported bank lines move through three states: unmatched, matched to an invoice, and converted into a payment. | later | bank matching is not in launch |
| B146 | A rule matches incoming money by description text and amount to an invoice, and may convert it into a payment without a click. | later | auto-match rules are risky early |
| B147 | Deleting an imported bank line never deletes the payment created from it. | later | bank lines follow bank matching |
| B148 | Request: bank reconciliation linking bank records to invoices and payments, which 18 users asked for in a global tool. | later | reconciliation is its own module |
| B149 | Bank statement import accepts CSV and XLS of the formats Indian banks export, and lists lines it could not parse. | later | statement formats need samples |
| B150 | Tally can read bank statement PDFs and match them with documents; a statement upload can show suggested invoice matches. | no | PDF statements are too fragile |
| B151 | Request: bank integrations through third-party connectors, shown as a pick-list of banks and aggregators. | no | bank connectors cost too much |
| B157 | The 3B summary exports to Excel as well as PDF and JSON, because users add quarterly figures themselves. | later | Excel export of 3B is convenience |
| B160 | User can mark a period as filed with the filing date and ARN; editing a draft dated in that period then shows a warning. | later | filed marks need lock rules |
| B161 | Marking a return unfiled inside the product does not change the GST portal, and the screen says so. | later | filed marks follow B160 |
| B162 | A debit note raising value after issue is listed with credit notes in the notes section of the GSTR-1 data. | later | debit notes come later |
| B164 | User can override transaction values, such as a place of supply, before generating the GST data for one document. | no | manual overrides invite wrong tax |
| B171 | TDS can be applied on quotes, invoices, credit notes, recurring invoices and payments, and shows the same on each. | no | TDS belongs to payments only |
| B175 | An accountant who serves several firms sees all of them in one list after accepting each invitation, and sees only the periods shared. | later | shared-period limits are extra |
| B178 | Invoices and payment reminders can be sent on WhatsApp from the app, and the send log records time and result. | later | WhatsApp API needs approval |
| B181 | SMS needs paid credits, for example 5 credits at 75 rupees each with up to 300 messages each; stock shows the balance. | no | no SMS credits to sell |
| B189 | Prefix can differ per branch, for example BLR and DEL, with its own gapless counter per financial year. | room | rule:R61 |
| B192 | One invoice can carry several due dates, such as milestone payments, with a part amount per date. | room | rule:R61 |
| B193 | Invoice-level discount spreads over lines and round-off is applied once, not twice. | later | invoice-level discount needs spread rules |
| B194 | Rounding differences across many lines are shared out so the tax split sums to the invoice tax. | no | A121 fixes one rounding rule |
| B199 | Billable time entries convert into invoice lines for a project or customer with hours, rate and description. | room | time_entry.bill, screen:invoice_form |
| B200 | Reimbursable expenses incurred for a customer can be added to its invoice with receipts attached to the PDF. | room | expense.attach, expense.bill |
| B201 | A customer-specific price for a saved service applies when that customer is chosen. | later | customer price lists are extra |
| B203 | A due date beyond 45 days on an invoice from an MSME-registered firm shows an advisory, not a block. | no | advice is not billing truth |
| B204 | An invoice can be held for a set number of hours after creation before sending, so errors can be fixed. | no | send hold duplicates scheduled send |
| B211 | A credit note can cite the customer's debit note number and date, and prints it. | later | debit note citation follows debit notes |
| B215 | Late interest on an overdue invoice is computed once per period and is not charged again after a partial payment. | no | interest charging is legal advice |
| B218 | No self-hosted edition in v1; the plan page says so and offers a full data export instead. | no | no self-hosted edition in v1 |
| B221 | Invoice layout lets the firm show or hide columns, change font size and reorder blocks; reviewers call fixed layouts a limit. | later | layout editing is a template extra |
| B224 | Quote lines can be marked optional; the customer ticks the optional ones when accepting the quote. | later | optional quote lines are extra |
| B225 | Time entries round to a firm-set step such as 15 minutes before they become invoice lines. | room | time_entry.approve, rule:R68 |
| B228 | A payment can carry an attached proof file, such as a UPI screenshot or a cheque photo. | later | payment.attach |
| B229 | App updates never block sign-in; an old version shows a banner and still works for reading. | no | a web app has no store versions |
| B233 | Customers flagged as own branch or internal can be left out of the sales register and tax totals. | no | internal customers are off-market |
| B234 | A subtotal row can be inserted between line groups without becoming a taxable line. | no | subtotal rows clutter lines |
| B236 | Travel and mileage costs can be added as billable lines to an invoice in one step. | no | mileage is an expense matter |
| B238 | Bank feeds import on a schedule that can be switched off per account. | no | automatic feeds add risk |
| B239 | A directory of accountants who know the product is offered to firms that have none. | no | accountant directory is marketing |
| C001 | First screen after signup asks only mobile number and OTP; firm name, GSTIN and state come next, each skippable except firm name. | later | phone OTP login follows email login |
| C006 | Creating an invoice offline saves a local draft with a visible "Not synced" mark and syncs on reconnect without creating a second copy. | later | offline drafts need sync rules |
| C014 | A new firm's lines are prefilled with a SAC suggestion from its chosen business type (design, IT, legal, coaching); the user confirms in one tap. | later | curated SAC suggestions need research |
| C027 | The client can pay a smaller amount on the pay page only if the firm allows part payment; default asks the exact balance. | later | part payment option follows gateway |
| C028 | After payment the client sees a receipt screen with amount, date and reference; the firm sees the invoice turn Paid within 1 minute without refresh. | later | live paid status needs gateway |
| C029 | Payments made by UPI through the product's own gateway are matched to the invoice automatically, with no manual recording step. | later | auto-match is gateway work |
| C038 | Overdue invoices show on the home screen as a single total with a Remind all button that previews each message before sending. | later | bulk reminders are an extra |
| C047 | Agency owner at month end opens Bulk create, sees one row per recurring client with last month's lines, edits amounts inline and issues all in one tap. | later | bulk entry suits big agencies |
| C048 | Bulk issue shows a summary of count and total before confirming and reports per-invoice success or failure after, never an all-or-nothing error. | later | bulk issue not in launch |
| C049 | Bulk send queues WhatsApp messages as a list the owner steps through one by one, because WhatsApp cannot be sent in bulk from the web. | later | bulk WhatsApp follows bulk issue |
| C050 | Bulk send by email sends all at once, and the result lists bounced addresses with a one-tap fix per row. | later | bulk email follows bulk issue |
| C052 | Recurring drafts for 40 clients appear in one Review screen, sorted by amount change from last month, with changed rows highlighted. | later | review screen for forty drafts |
| C053 | Month-end screen for an agency shows who has not been invoiced yet this month (active retainer, no invoice) as a checklist. | later | uninvoiced-retainer checklist is extra |
| C061 | A matter or project field on an invoice groups the invoices of one case or project and shows billed, paid and unpaid per matter. | no | matters need a project module |
| C064 | The assistant's drafts go to an Awaiting owner approval list; the owner sees count on home and can issue one by one or all in one tap. | later | approval queue is polish |
| C068 | The assistant who enters a quantity of 1000 instead of 10 sees an unusual-amount warning when the total is over 10 times the client's usual invoice. | no | guessing amounts creates noise |
| C069 | A wrong-amount warning never blocks; it shows once, can be dismissed, and the dismissal is saved in history. | no | depends on C068 |
| C070 | The assistant can raise a correction request on an issued invoice, which notifies the owner with the invoice and note, instead of editing. | no | comments cover correction asks |
| C073 | Switching firms keeps the current screen type (for example Registers) so the accountant does not return to home each time. | no | screen memory is polish |
| C074 | Accountant home shows across all firms: invoices pending review, unpaid reminders due, filing dates, and firms with a problem, in one list. | later | cross-firm accountant home |
| C080 | A new accountant joining mid-year sees the full history and a note saying which documents were created before the accountant joined. | no | history already shows it |
| C084 | Client can add or correct their GSTIN on the pay page only before issue; after issue the page says to contact the firm for a credit note. | no | share links exist only after issue |
| C085 | The client page works in English and Hindi and chooses by the phone's language, with a switch at the top. | later | Hindi client page follows translations |
| C086 | Pay page shows firm name, GSTIN and a verified mark once the firm's payee name matches the UPI name returned by the gateway. | later | payee name check needs gateway |
| C100 | The firm gets 3 warnings before a plan lapse (7, 3 and 1 day) by email and WhatsApp, each with a one-tap renew link and the exact amount. | later | WhatsApp renewal notices need the API |
| C105 | The owner who loses the phone can log in on a new phone with OTP to the registered number and old sessions are ended from a list. | later | phone-number recovery follows phone login |
| C106 | Login by OTP works on SMS and WhatsApp; the owner can add a second number for recovery that is confirmed once. | later | OTP login follows phone login |
| C107 | Changing the registered phone number requires an OTP to the old and the new number, or a 3-day wait with notices if the old is lost. | later | phone change rules follow phone login |
| C108 | Password-free OTP login takes at most 4 taps and under 20 seconds, with auto-read of the SMS code on Android. | later | OTP auto-read follows phone login |
| C109 | The app asks permission for notifications only after the first invoice is sent, in a sentence saying what it will notify (payments, overdue). | no | push needs a store app |
| C110 | A push or WhatsApp message to the owner on payment arrival says client, amount and invoice number in one line. | no | depends on C109 |
| C111 | Quick actions on the invoice row (swipe or long press) give Send, Record payment and Duplicate; no action needs the detail screen first. | no | swipe actions are fiddly |
| C113 | Phone contacts picker adds a customer from the address book with name and number, after the user grants contacts permission once. | no | contact picker is a gimmick |
| C114 | Voice or typed quick entry: typing Rahul 15000 design opens a draft for client Rahul, amount 15000, description design, ready to review. | no | typed parsing misleads |
| C115 | Quick-entry misparse never issues anything; it only opens a draft that the user reviews before Issue. | no | depends on C114 |
| C121 | Customer names with Indian-language characters search correctly by typing the Latin transliteration or the original script. | no | transliteration search is unreliable |
| C123 | Amounts read back in words (lakh, crore) beside the number field as the user types, so an extra zero is seen. | later | live words beside amount |
| C124 | The user can type 1.5L or 2k in an amount field and it becomes 150000 or 2000 shown back before saving. | no | shorthand invites errors |
| C126 | The app's screens are available in English and Hindi at launch and the language choice is saved per user. | later | Hindi screens follow translations |
| C127 | Help is one tap from every screen and opens a short answer in context, with a WhatsApp chat to a human within 4 working hours. | later | in-app help follows content |
| C128 | Support replies carry the firm's last 5 actions, visible to support only with the user's consent per request, so the user never needs to explain the screen. | later | support context needs consent tooling |
| C129 | The 15-minute grace Cancel never deletes the number; it marks it void so numbering stays continuous, and states this in the dialog. | no | void already keeps the number |
| C133 | Bank details printed on the invoice are entered once; a UPI ID or account number is verified with a one-rupee check or name match before first use. | no | penny-drop checks cost money |
| C134 | After a bank-detail change, all new invoices use the new details for 24 hours with a banner Bank details changed; clients opening old links see the details at issue time. | later | changed-bank banner needs design |
| C137 | Payouts from a payment gateway go only to a bank account that was verified in the owner's name or the firm's name by a penny-drop check. | later | payout checks follow gateway |
| C138 | Money collected through the product's gateway settles to the firm's account directly; the product holds no balance beyond the settlement window. | later | settlement rules follow gateway |
| C140 | A staff member who records a cash payment sees a receipt number that goes to the owner's daily summary; unpaid-but-cash-marked invoices are listed. | no | cash watching is trust detail |
| C141 | The owner's daily summary lists every payment recorded by hand, by user, so a payment marked paid with no money in the bank can be spotted. | no | daily by-hand digest is noisy |
| C142 | A payment marked received by bank transfer can carry a bank statement match (CSV upload) and unmatched payments are listed as Unverified at month end. | later | statement proof follows bank import |
| C143 | Staff who issue invoices with a discount over the owner-set limit (default 20 percent) are blocked until the owner approves. | no | discount approval suits bigger teams |
| C144 | The owner can set a rule that invoices above a chosen amount need owner approval before Issue; it applies to every role except the owner. | no | amount approval suits bigger teams |
| C148 | Share links and exports a deactivated user held cannot be used after deactivation; API keys and integrations they created are revoked. | later | API keys follow the API |
| C150 | A share link opened from 20 different IP addresses in one hour is throttled and the owner is notified. | no | throttling guesses add support load |
| C163 | If a restore ever returns to an earlier point, the numbers issued after that point are detected and listed, and no number is handed out twice. | later | restore edge case needs design |
| C168 | A gateway payment that arrives after the invoice was voided is shown as unmatched money with a refund action, never silently dropped. | later | late gateway money follows gateway |
| C169 | A client paying twice by UPI on one invoice (two successful payments) leads to a visible overpaid state with a one-tap refund request, not a hidden credit. | later | overpaid UPI follows gateway |
| C170 | The pay page stops showing the Pay button for 5 minutes after a payment started and is pending, so a client does not pay twice while confirmation is slow. | later | pending-state lock follows gateway |
| C171 | A payment that stays pending at the gateway for over 30 minutes shows on the firm's screen as Pending with the gateway reference and checks status again every 10 minutes. | later | status polling follows gateway |
| C172 | A failed or reversed UPI payment returns the invoice to unpaid and sends the firm a message; the receipt is marked void, not deleted. | later | failed UPI handling follows gateway |
| C176 | When GST rates change by notification, the product updates the list within 2 working days and warns every firm that issues an invoice dated on or after the change. | no | an operations promise, not a feature |
| C183 | Email invoice text cannot be changed to include links to other domains; only the product's pay link domain and the firm's own domain are allowed. | no | link limits harm honest templates |
| C185 | A new firm's first 20 invoices to a new contact use the WhatsApp or email of the owner and show a mark so abuse by fake firms can be reviewed. | no | new-firm review is internal ops |
| C186 | A fake firm using someone else's GSTIN is blocked: GSTIN legal name must match the firm name within a similarity check, and a mismatch needs a manual proof. | no | name similarity gives false blocks |
| C187 | A firm cannot claim a GSTIN that another active firm already verified; the second claimant sees Contact support and the first firm's owner is notified. | no | claim fights are support cases |
| C188 | SIM-swap risk is reduced: a login from a new device on a phone number changed in the last 7 days needs the second recovery contact or a 24-hour hold. | later | SIM-swap needs phone login |
| C189 | Sensitive actions (change bank, change owner, export all, delete firm) ask for a fresh OTP even inside an open session. | later | fresh OTP needs phone login |
| C195 | The product fails if the accountant dislikes it; the share of firms whose accountant exports a pack each month is tracked, with a goal of 60 percent. | no | a business metric, not a feature |
| C196 | Week-4 retention (firm issued an invoice in each of weeks 1 and 4) is tracked and reviewed monthly; a figure below 40 percent triggers a review of the first-session flow. | no | a business metric, not a feature |
| C198 | Free plan abuse is limited: one free plan per GSTIN and per phone number, and a firm on free that makes 10 accounts is detected by device and payment signals. | no | free-plan abuse is an ops matter |
| C203 | A B2C invoice to an unregistered buyer shows the dynamic UPI QR on it when turnover is above Rs 500 crore; below that the QR is optional and defaults on. | no | applies only above Rs 500 crore |
| C205 | Export of services needs payment in convertible foreign exchange or permitted rupees, and the product shows a flag for export invoices unpaid in foreign currency after 12 months. | no | realisation tracking is FEMA advice |
| C223 | Sensitive client documents (legal matter descriptions) are hidden from line text on the pay page if the firm marks the matter confidential, showing only Professional services. | later | confidential text option is niche |
| D005 | Convert part of a quote: pick lines or a percent milestone; quote shows billed and remaining value and stays open until fully billed. | later | part billing of quotes is advanced |
| D007 | Editing a sent quote saves revision 2, 3 and so on; older revisions stay readable and the client link always shows the latest. | later | quote revisions are an extra |
| D009 | Quote duplicate copies customer, lines, terms and notes; it never copies number, status, acceptance record or validity date. | no | quote copy is minor |
| D011 | Webhooks quote.sent, quote.accepted, quote.declined and quote.expired carry quote id, number, total and customer id. | later | webhooks come with the API |
| D022 | Item list columns: name, SAC, unit, rate, tax rate, times used, last used; filters: active, tax rate, unit; sorts by name, rate, times used. | no | standard columns suffice |
| D023 | Per-customer price list overrides an item's rate for that customer; the line shows the override and a small marker that it differs from the catalogue. | later | customer price lists are an extra |
| D024 | Bulk change rate for selected items by percent or amount with a preview of old and new rate; failed rows are listed with reasons. | no | bulk rate edits are rare |
| D028 | Item export CSV has code, name, SAC, unit, rate, tax rate, active, created date; filtered rows only; UTF-8 with byte-order mark. | no | full export holds items |
| D029 | Items support firm-defined custom fields of text, number, date or dropdown, shown in list, form, import and export. | later | fixed fields cover launch needs |
| D030 | Item duplicate copies all fields except code and appends "(copy)" to the name. | no | item copy is minor |
| D031 | An expense records date, vendor, category, amount, GST paid, paid-through account, notes and receipt, and is filtered by category, vendor, date and billable flag. | room | expense.vendor, expense.amount, screen:expenses |
| D032 | Mark an expense billable to a customer; it then appears as an unbilled item that can be added to that customer's next invoice as a line. | room | expense.mark_billable, expense.unmark_billable |
| D033 | Re-billed expense lines can carry a markup percent; a pure-agent reimbursement line is printed separately and flagged with no markup allowed. | room | expense.markup_percent, rule:R68 |
| D034 | Receipt upload accepts JPG, PNG or PDF up to 5 MB, 3 files per expense; larger or other types are refused with the limit stated. | room | expense.attach |
| D035 | Expense categories are a firm list with defaults (travel, software, rent, salaries, professional fees); renaming keeps old expenses; used categories cannot be deleted, only archived. | no | category lists belong in accounting software |
| D036 | Bulk actions on expenses: categorise, mark billable, delete; result says "12 done, 1 failed" with reason per failed row and leaves failed rows selected. | no | bulk expense edits are bookkeeping |
| D037 | An expense billed on an invoice is locked and links that invoice; voiding the invoice or deleting its draft returns the expense to unbilled. | room | expense.release |
| D038 | Expense export CSV has date, vendor, category, amount, GST, billable, customer, invoice number, paid through, one row per expense. | no | expense reports are an accounting job |
| D039 | Deleted expenses stay in a trash for 30 days and restore with receipts; billed expenses cannot be deleted. | no | expense trash is bookkeeping |
| D040 | Vendor is its own record with name, GSTIN, PAN, state; expense GST split into CGST, SGST or IGST by vendor state, with an input-tax-credit eligible flag. | no | vendor books belong to the accountant |
| D041 | A bank statement line can be turned into an expense in one click, prefilled with date, amount and description. | no | bank-to-expense is accounting work |
| D042 | Expense duplicate copies vendor, category, amount and notes but not date, receipt or billing link. | no | expense copy is bookkeeping |
| D043 | A time entry holds date, person, customer, item or task, hours in 0.25 steps, note and billable flag; entries over 24 hours a day per person are refused. | room | time_entry.hours, time_entry.date |
| D044 | A start and stop timer on the time page creates an entry; only one timer runs per person and stopping saves the elapsed hours rounded up to the firm's step. | later | timers need time module |
| D045 | Add unbilled time to a draft invoice grouped by person, task or day; each group becomes one line with quantity as hours and rate from person or customer. | room | time_entry.bill, screen:invoice_form |
| D046 | Time rate order: customer-specific rate, then person rate, then item rate; the line shows which rate was used. | room | time_entry.rate, rule:R68 |
| D047 | Billed entries are locked and show the invoice number; returning an invoice to void or deleting its draft frees the entries again. | room | time_entry.release |
| D048 | Time list filters by person, customer, date range, billable and billed state; weekly view totals hours per day and per customer. | room | screen:time_entries |
| D049 | Staff see and edit only their own entries; owner and accountant see all; viewer sees none. | room | time_entry.owner |
| D050 | Time export CSV has date, person, customer, task, hours, rate, amount, billed invoice; bulk mark as non-billable lists failures such as already billed rows. | room | time_entry.export |
| D051 | Retainer hours: a customer can have monthly included hours; the customer page shows used and remaining hours and flags overage. | later | included hours need time module |
| D053 | Plan page shows the next 3 run dates and amounts before saving, including the effect of a day above 28. | no | preview adds screen weight |
| D058 | A plan can raise its rate by a set percent on each anniversary, shown in the preview of future amounts. | no | anniversary rises are contract matters |
| D059 | First period can be prorated by days from start date to the end of the month, with the calculation shown on the line. | no | proration is done by hand |
| D060 | Plan list filters by status (active, paused, ended), customer and next run date; sorts by next run, customer, amount. | no | few plans per firm |
| D062 | Auto-issued recurring invoices use the run date as issue date and the current financial year's counter, so numbering stays consecutive. | later | auto-issue is not in launch |
| D063 | Webhook recurring_plan.run fires with plan id and invoice id for every run, success or failure. | later | events follow the API |
| D064 | Duplicate plan copies customer, lines and mode but not run history, next run or end date. | no | plan copy is minor |
| D065 | A plan can bill in advance: create the draft a set number of days before the invoice date. | later | advance drafting is an extra |
| D066 | On an issued invoice, Create payment link produces a hosted page with UPI, card and netbanking; the link amount equals balance due, with an option to allow partial payment. | later | hosted gateway page needs a gateway |
| D067 | Payment link has expiry date, status (created, paid, partially paid, expired, cancelled) and can be cancelled; a cancelled link shows a plain "link no longer active" page. | later | link states need a gateway |
| D068 | Gateway payment success records a payment automatically with mode, gateway payment id, fee and net amount, and a receipt number. | later | auto-recording needs a gateway |
| D070 | A gateway payment above the balance due, as when two links race, records the excess as customer advance instead of failing. | later | race handling needs a gateway |
| D071 | Gateway fee and its GST are recorded on the payment and can be listed as an expense of category payment fees. | later | fee books need a gateway |
| D072 | Payment link list filters by status, customer and date; columns invoice, amount, link status, created, paid on, gateway reference. | later | link list needs a gateway |
| D074 | Failed payment attempts appear on the invoice timeline with gateway reason, but never change status. | later | attempt timeline needs a gateway |
| D075 | Refund through the gateway is started from the payment row, needs owner role, and records a refund linked to the payment. | later | gateway refunds need a gateway |
| D076 | Payout settlement report lists gateway payments per settlement with gross, fee, net and bank credit date to reconcile against statement lines. | later | settlement report needs a gateway |
| D077 | Gateway keys are stored per firm, shown masked, tested on save, and replacing them leaves existing links working. | later | key storage needs a gateway |
| D079 | Invoice can pick which firm bank account prints; the choice is stored on the invoice at issue. | room | rule:R61 |
| D080 | Statement import accepts CSV with column mapping saved per account, with presets for common bank layouts; rows show date, narration, debit, credit, balance. | later | statement mapping is bank matching |
| D081 | Import skips lines already imported, matching on date, amount, reference and balance; the result states how many were new and skipped. | later | re-import checks are bank matching |
| D082 | Bad statement rows (no date, both debit and credit) are listed with row numbers and reasons and can be corrected and re-run without re-uploading. | later | bad-row repair is bank matching |
| D083 | Credit lines show suggested invoice matches ranked by exact amount, invoice number in narration, then customer name. | later | match suggestions are bank matching |
| D084 | One statement line can match several invoices, with a split amount per invoice; the total must equal the line amount. | later | split matches are bank matching |
| D085 | A credit line can be matched as payment, ignored with a reason, or marked as not income (loan, transfer); each is reversible by Unmatch. | later | ignore actions are bank matching |
| D086 | Statement list filters by matched, unmatched, ignored, credit or debit, date range and amount; default shows unmatched newest first. | later | statement lists are bank matching |
| D087 | Bulk accept suggested matches for selected lines; the result states how many matched and lists skipped lines with the reason. | later | bulk accept is bank matching |
| D088 | Net receipt after TDS: a line smaller than the invoice by about the TDS percent offers to record payment plus TDS automatically. | later | payment.tds_amount |
| D089 | Reconciliation page shows opening balance, matched total, unmatched total and difference against the closing balance entered by the user. | later | reconciliation page is accountant work |
| D090 | Deleting an import batch is allowed only when none of its lines is matched; the batch name, file and uploader stay in history. | later | batch deletion is bank matching |
| D091 | Statement export CSV carries match status, matched document number and receipt number beside each line. | later | statement export is bank matching |
| D092 | Statement lines are never edited after import; corrections happen by ignore and match actions, which are logged. | later | immutability rule is bank matching |
| D095 | A refund can be reversed by an owner with a reason, returning the amount to the customer's credit balance. | later | refund.reverse_refund |
| D098 | Webhooks refund.created and refund.reversed carry refund id, customer id and amount. | later | refund.webhook |
| D099 | Receipt voucher is issued when money arrives before an invoice; number RV/YY-YY/NNNNN, with customer, amount, GST rate and tax split by place of supply. | room | rule:R60 |
| D100 | Advance on a customer shows as unapplied; applying it to an invoice offers the amount up to the smaller of advance and balance due. | room | rule:R60 |
| D101 | One advance can be split across several invoices; one invoice can use several advances; each application is a listed row. | room | rule:R60 |
| D102 | Applying an advance to an invoice reduces tax payable on that invoice by the tax already paid on the receipt voucher, shown on the print. | room | rule:R60 |
| D103 | Unapply an advance returns it to unapplied balance and restores the invoice balance, with a logged reason. | later | unapplying advances follows advances |
| D104 | Refund voucher is issued when an advance is returned without supply; it numbers RFV/YY-YY/NNNNN and appears negative in the register. | later | refund vouchers follow advances |
| D105 | Report of unapplied advances by customer with age in days, total, and link to each voucher. | later | advance ageing follows advances |
| D106 | GST sales register export includes receipt vouchers and refund vouchers as separate sections for the advances table of the return. | later | advance register tables follow advances |
| D108 | Issuing a debit note increases the invoice balance due and status can move from paid back to partially paid. | later | debit note balance follows debit notes |
| D109 | Debit note print page is titled "Debit Note" and states the original invoice number and date, reason and tax split. | later | debit note print follows debit notes |
| D110 | Debit notes appear positive in the sales register with their own type column; void ones are excluded. | later | debit note register follows debit notes |
| D111 | Debit note on an e-invoiced invoice requests its own IRN; failure leaves the note issued and retryable. | later | debit note IRN follows debit notes |
| D112 | Only owner can void a debit note with no payment applied; reason of 5 to 200 characters is required and the number stays used. | later | debit note void follows debit notes |
| D115 | TDS list filters by FY, quarter, customer, section and certificate received or pending; default shows pending certificates oldest first. | later | certificate lists follow certificates |
| D116 | System matches certificates to payments' TDS amounts by customer and quarter, showing difference when totals disagree. | later | certificate matching follows certificates |
| D118 | Form 26AS or AIS CSV import compares deductor TAN, section and amount with recorded TDS and lists mismatched rows. | later | 26AS import is advanced |
| D119 | Reminder to request a missing certificate can be queued to the customer contact 15 days after quarter-end TDS filing deadline. | no | chasing certificates is the accountant's job |
| D120 | TDS export CSV has customer, TAN, section, quarter, deducted, certificate number, certificate status and linked payment receipts. | later | TDS export follows certificates |
| D121 | A certificate with matched payments cannot be deleted; it can be replaced with a new upload and the old file stays in history. | later | certificate replacement follows certificates |
| D125 | Download e-invoice JSON for an invoice, built to the portal schema, for manual upload when the live connection is down. | later | manual JSON is a fallback |
| D126 | Bulk generate e-invoices for selected invoices; the result lists each as done or failed with the portal message, and failures can be retried together. | later | bulk e-invoicing is an extra |
| D130 | Webhooks einvoice.generated, einvoice.failed and einvoice.cancelled carry invoice id and IRN. | later | e-invoice events follow the API |
| D131 | A reminder rule has offset in days before or after due date, channel (email), template, and active flag; the firm can hold up to 10 rules. | no | fixed steps suffice for small firms |
| D140 | Escalation rule notifies the owner, not the customer, when an invoice is over 30 days late. | no | owner sees the overdue list |
| D144 | Reset template to default restores the built-in text; the edited version is kept as a revision for 30 days. | no | template history is overkill |
| D147 | Template language option for labels in English or Hindi; amount in words follows the chosen language. | later | Hindi labels follow translations |
| D148 | Test send emails a rendered template to the user's own address only. | no | the preview already shows it |
| D161 | Foreign inward remittance advice reference (FIRC) can be attached to a payment with number and date. | later | payment.attach |
| D165 | A customer holds several contacts with name, email, phone, designation and a flag for each of: gets invoices, gets reminders, gets receipts. | room | rule:R61 |
| D166 | Emails for invoices go to every contact flagged for invoices; the send screen shows the recipients and lets the user remove or add one for that send. | later | multi-contact sends need contacts |
| D167 | The same email twice on one customer is refused; one email may sit on several customers. | later | contact rules need contacts |
| D168 | A contact whose email bounced shows a red marker and is skipped until corrected, and the owner sees the bounce in the outbox. | later | contact bounce marks need bounce tracking |
| D169 | Each contact records consent to be messaged: source, date and a channel list; withdrawing consent stops sends and is logged. | later | contact consent needs WhatsApp |
| D170 | Contact delete is allowed unless it is the only invoice recipient; contact history keeps the name on past emails. | later | contact delete rules need contacts |
| D171 | Contact import is part of customer import; match is by customer GSTIN then contact email; extra contacts attach, none are overwritten. | later | contact import needs contacts |
| D180 | Invoice form has an Issue from branch field; place of supply is compared with that branch's state, not the head office. | later | branch issuing needs multi GSTIN |
| D181 | Counters run per branch, prefix and financial year; two branches may never share a prefix. | later | branch counters need multi GSTIN |
| D182 | A branch used by any document cannot be deleted; it can be deactivated, hiding it from new documents. | later | branch lifecycle needs multi GSTIN |
| D183 | Each branch GSTIN is validated for format and check character, and its first two digits must equal the branch state's code. | later | branch GSTIN checks need multi GSTIN |
| D184 | Register exports can be filtered by branch GSTIN, since returns are filed per GSTIN. | later | per-GSTIN filters need multi GSTIN |
| D193 | A CA or external accountant role can be given access to reports, registers and exports only, with an end date after which access stops. | later | end-dated outside access is an extra |
| D195 | Staff role sees only invoices they created and customers assigned to them, for firms that turn this setting on. | later | own-records view is a team feature |
| D200 | Up to 10 emails can be invited at once, comma-separated; the result lists each as sent or refused with the reason. | later | bulk invites are an extra |
| D203 | API list endpoints page with a cursor, 100 maximum per page; filters include updated_since, status and external reference. | later | cursor paging follows the API |
| D208 | An endpoint failing 20 times in a row is disabled and the owner is emailed; it can be re-enabled after a test delivery succeeds. | later | endpoint auto-disable follows webhooks |
| D211 | Connected integrations list shows name, status, connected by, date and a Disconnect action; disconnecting never deletes records it created. | later | integration list follows integrations |
| D212 | Every record has an optional external_ref field up to 60 characters, unique per object type and firm, for matching with other software. | later | external refs follow the API |
| D213 | API errors return a machine code, a human message and the field name; versions are pinned per key and a changelog is listed. | later | API error format follows the API |
| D220 | Historical invoices import as issued with their original number, date and totals, never use the counter, are marked Imported and cannot be edited. | later | full history import is second step |
| D222 | Whole import can be undone within 24 hours: records created by it are removed if untouched; touched ones are listed and left. | later | import undo is rare |
| D223 | Import history lists file name, who, when, counts and status; uploading a file with the same hash warns that it was already imported. | later | import history page is polish |
| D226 | Statement and payments imports show a matched-versus-unmatched summary before anything is saved, with a Confirm step. | later | payment imports follow bank matching |
| D227 | Export screen shows row count for the current filter before download, offers columns to include, and remembers the column choice per person. | no | column memory is polish |
| D230 | Download invoice PDFs for a date range as one zip named FIRM_INVOICES_YYYY-MM; each file name carries number and customer with slashes replaced by dashes. | no | full export holds PDFs |
| D233 | Excel export option (XLSX) keeps amounts as numbers, dates as dates, and freezes the header row. | no | CSV opens in Excel |
| D236 | Custom fields are exported as columns named after the field label; columns for archived fields appear only when asked. | later | custom field columns need fields |
| D241 | Collections report shows receipts per day and per mode, TDS separately, and the share paid within terms. | no | aging already covers it |
| D243 | Days sales outstanding and average days to pay are shown per customer and for the firm for a chosen period. | no | days-to-pay is analytics |
| D244 | Each report states "as of" time, scope (firm or branch) and the filters used; changing a filter reloads without losing the others. | no | stamps are cosmetic |
| D250 | A saved view stores filters, sort and columns under a name of up to 40 characters; names unique per list per person. | no | filters and search suffice |
| D251 | Saved views are private or shared with the firm; only the creator or an owner edits a shared view. | no | views are not shared |
| D252 | One view can be the default for a person and opens first; a locked All view always exists and cannot be deleted. | no | no default views |
| D253 | Views appear as tabs above the list with a count; at most 20 per person per list, with a clear message at the limit. | no | no view tabs |
| D254 | A view that filters on a deleted or archived record shows a notice and still loads with that filter removed. | no | no views to go stale |
| D255 | Starter views for invoices: Drafts, Unpaid, Overdue, Paid this month; for customers: With balance, Archived. | no | no starter views |
| D256 | A bell lists events: payment received, invoice viewed, quote accepted or declined, e-invoice failed, import finished, reminder skipped; unread count shown, mark all read. | later | bell centre is polish |
| D257 | Per person settings choose in-app, email or none for each event type; owner events default on, others off. | later | notice settings are polish |
| D258 | Daily summary email at 8 AM IST lists new overdue invoices, payments received and failed e-invoices, and is skipped on days with nothing. | later | daily digest is an extra |
| D259 | Notifications link to the record and are kept 90 days; opening one marks it read. | no | bell history is not kept |
| D260 | Mute a customer to stop viewed and payment alerts for it; the customer page shows the mute state. | no | customer muting is clutter |
| D265 | Audit CSV export is owner only and is itself logged; each row includes actor email and IP. | no | audit CSV is rarely needed |
| D284 | Tags are free labels up to 30 characters, shared per firm per object type; same tag in different case is one tag. | no | tags suit bigger teams |
| D285 | Renaming a tag renames it everywhere; deleting a tag removes it from records but never touches them, after a confirm that states the count. | no | no tags to rename |
| D286 | Tags are searchable, filterable and exportable on customers, invoices, expenses and items; up to 10 per record. | no | no tags to filter |
| D287 | Files can be attached to invoice, customer, expense, payment and credit note: PDF, JPG, PNG, XLSX, DOCX up to 5 MB, 10 per record. | later | attachments are a file feature |
| D288 | An attachment can be marked Send with email; those files go with the invoice email up to a 10 MB total. | later | emailed attachments follow attachments |
| D289 | Attachments on issued documents can be added and removed after issue; each add and remove is logged with file name and user. | later | post-issue files follow attachments |
| D291 | A dispute on an invoice records raised by, reason, amount in question and status (open, resolved, written off); open disputes pause reminders. | later | dispute records follow share-page actions |
| D292 | Resolving a dispute offers: no change, issue credit note for the amount in question, or note; the choice is logged. | later | dispute outcomes follow disputes |
| D295 | A second series (for example a branch or export prefix) can be created before first use only; the prefix cannot be changed once any document uses it. | room | rule:R61 |
| D296 | Late fee setting: flat amount or percent per month on overdue balance; when on, it adds a fee line to a draft, never changes an issued invoice. | later | late fees need consent text |
| D297 | Late fee drafts are created monthly per overdue customer for review, never issued automatically; GST on the fee uses the invoice's rate. | later | late fee drafts follow late fees |
| D302 | GSTIN entry fetches legal name, address and state from the portal and fills the profile, with the status shown (active or cancelled). | later | needs a GSTIN lookup provider |
| D303 | Sample data can be loaded to explore and removed in one action; sample records never count toward invoice numbers or plan limits. | no | sample data muddles real books |
| D304 | Global search finds customers, invoices, payments, quotes and items from one box; typing an exact document number jumps straight to it. | later | one search box is an extra |
| D305 | Search results group by object with 5 per group, show a match reason (number, GSTIN, name), and a View all link keeps the query. | no | grouped results follow no global search |
| D307 | Outbox shows delivered, opened and bounced where known; a bounce marks the contact and names the invoice that failed. | later | delivery and open states need callbacks |
| D308 | Queued emails can be cancelled before send; a cancelled row stays in the list with who cancelled it. | no | queue cancel is rare |
| D310 | Customer detail first shows outstanding, overdue amount, unused credit, average days to pay and last payment date, ahead of tabs. | later | payment-speed headline needs history |
| D311 | Customer list columns: name, GSTIN, state, outstanding, overdue, last invoice date, terms, tags; chosen and ordered per person. | no | standard columns suffice |
| D312 | Customer filters: state, has balance, has overdue, has GSTIN yes or no, tag, owner, created date; sorts by name, outstanding, last invoice date. | no | search is enough for customers |
| D315 | Bulk on customers: tag, set terms, archive; result reads "18 done, 2 failed" with each failed customer and reason, failed rows stay selected. | no | bulk customer edits are rare |
| D318 | Deleted customers with no documents stay in trash for 30 days and restore with contacts and notes. | no | archive already acts as trash |
| D319 | Customer duplicate copies address, terms, tags and settings but leaves GSTIN, id, balances and documents blank. | no | customer copy is minor |
| D321 | Customer attachments for agreement, KYC and work order, 10 files of 5 MB, with name, date and uploader shown. | no | customer files go in agreements elsewhere |
| D322 | Customer custom fields: text, number, date, dropdown, up to 10, optionally printed on invoices; shown in list, import and export. | no | fixed fields cover launch needs |
| D323 | Customer owner field assigns a staff member; list filter Mine shows only theirs. | no | customer owners suit bigger teams |
| D325 | API customers carry external_ref; GET by GSTIN or ref returns the record; events customer.created, updated and archived carry changed fields. | later | customer events follow the API |
| D329 | Invoice list extra columns to pick: place of supply, tags, owner, sent date, viewed date, e-invoice status, currency, branch, PO number. | no | extra columns clutter phones |
| D330 | Invoice extra filters: amount range, due date range, overdue by days, sent or not sent, viewed or not, tag, owner, branch, e-invoice status. | no | extra filters clutter phones |
| D331 | Invoice list can group by customer or month showing a subtotal per group; the totals row sums total and balance for the filtered rows. | no | grouped lists clutter phones |
| D332 | Starter saved views: Drafts, Unpaid, Overdue, Due this week, Paid this month; each shows a count. | no | no starter views |
| D333 | Bulk email on selected issued invoices queues one message each; result lists queued and skipped (no email, draft) with reasons. | later | bulk email follows bulk actions |
| D334 | Bulk issue of selected drafts issues in issue-date order, skips drafts failing checks with the reason, and consumes numbers only for those issued. | later | bulk issue is not in launch |
| D335 | Bulk PDF download of selected invoices gives one zip; bulk tag, bulk send reminder and bulk delete drafts follow the same partial-result report. | no | single downloads suffice |
| D342 | Invoice owner field defaults to creator; list filter Mine; owner shown in history. | no | invoice owner suits bigger teams |
| D343 | Comments thread on an invoice, internal only, with @mention of a user that notifies them; comments cannot be edited after 5 minutes. | later | internal comments are team feature |
| D344 | Invoice attachments up to 10 files of 5 MB, optionally sent with the email; add and remove after issue logged. | later | invoice files follow attachments |
| D345 | Custom invoice fields (PO number, project code, work order) of text, number, date or dropdown print on the invoice and are searchable and exportable. | no | fixed PO fields cover it |
| D347 | Invoice related panel shows payments, credit notes, debit notes, e-invoice record, source quote, recurring plan, emails sent and time entries billed. | no | related panel is clutter |
| D349 | Deleted drafts sit in trash 30 days and restore with their lines; issued and void invoices have no delete. | no | drafts are simply deleted |
| D351 | API: create draft, update draft, issue as a separate call; GET by number; filter updated_since; issue returns the number and PDF link. | later | draft API follows the API |
| D352 | Webhooks invoice.issued, invoice.paid, invoice.voided, invoice.overdue with signed delivery, event id and full invoice body. | later | invoice events follow the API |
| D355 | Invoice notify: owner is told when the customer views an invoice for the first time, if the setting is on. | later | first-view alerts follow notices |
| D358 | Search payments by receipt number, reference, customer name, or exact amount. | no | payment.search |
| D360 | Payment mode list is firm-extendable with custom modes (wallet, gateway name) of up to 20 characters; used modes can be hidden, not deleted. | no | fixed modes cover India |
| D361 | Deposit account chosen per payment from the firm's bank accounts and Cash in hand; filter and export by it. | later | deposit accounts need several accounts |
| D363 | Payment has received date and bank clearing date separately; clearing date optional and used for reconciliation. | no | clearing dates are accountant detail |
| D370 | API POST payments with an Idempotency-Key; response gives receipt number; GET filters by invoice, customer and updated_since. | later | payment.api |
| D371 | Webhooks payment.recorded and payment.reversed with amount, invoice ids, receipt number and mode. | later | payment.webhook |
| D373 | Unmatched amount typed above balance shows the balance and offers "Record rest as advance" rather than only an error. | later | rest-as-advance follows advances |
| D374 | Group payments by day for a daybook view with a total per day and per mode. | no | daybook is accountant detail |
| D375 | Payment recorded by a gateway shows its source and cannot be reversed here; a refund through the gateway is the path. | later | gateway rows follow gateway |
| D383 | Attach a supporting document (return slip, approval email) to a credit note, 5 MB each, kept with it. | no | credit note files are clutter |
| D384 | Credit note related panel lists the original invoice, each application to other invoices, refunds and the e-invoice record. | no | related panel is clutter |
| D386 | API creates a credit note against an invoice, with webhooks credit_note.issued and credit_note.voided carrying invoice id and amount. | later | credit note API follows the API |
| K014 | roles: per-customer assignment of accountants (deferred) | no | accountant sees the whole firm |
| K165 | customer: saved view (deferred) | no | saved views are not offered |
| K166 | customer: bulk archive (deferred) | no | bulk customer edits are rare |
| K177 | invoice: saved view (deferred) | no | saved views are not offered |
| K187 | invoice: merge (n/a) | no | invoices are never merged |

