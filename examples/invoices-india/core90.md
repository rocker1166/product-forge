W001 A customer needs a name of 1 to 100 characters, a type (business or individual) and a billing state from the GST state list; saving without any is rejected with a field-level error.
W002 A customer GSTIN, if given, must match the 15-character GST format and pass the standard check-character test; otherwise the save is rejected with the message "Invalid GSTIN".
W003 When a customer GSTIN is given, its first two digits must equal the GST code of the selected billing state, otherwise the save is rejected.
W004 A GSTIN may belong to only one non-archived customer within a firm; a second customer with the same GSTIN is rejected, while another firm may use that GSTIN.
W005 Billing address needs line 1 (1 to 150 characters), city (1 to 60 characters) and a pincode of exactly 6 digits not starting with 0; line 2 is optional.
W006 Customer email, if given, must be a valid address of at most 120 characters, and phone, if given, must be a 10-digit Indian mobile number starting with 6, 7, 8 or 9.
W007 Default payment terms on a customer is a whole number of days from 0 to 90; when blank, the firm default terms apply to that customer's new invoices.
W008 Editing a customer changes only drafts and future invoices; issued invoices and credit notes keep the name, address, GSTIN and state copied at the time of issue.
W009 Owner or accountant can archive a customer; archived customers leave the invoice customer picker and the default list, keep all their documents, and can be restored.
W010 Deleting a customer that has any invoice, payment or credit note is refused with a message to archive instead; a customer with none can be deleted after a confirm step.
W011 Customer detail shows outstanding balance as the total balance due on that customer's issued and partially paid invoices, in rupees, with unused credit balance shown as a separate figure.
W012 Customer detail has tabs listing that customer's invoices, payments and credit notes, newest first, 25 rows per page.
W013 A draft invoice needs only a customer; it shows "Draft" instead of a number and may be saved with zero lines.
W014 Issue date defaults to today in Indian Standard Time and cannot be in the future.
W015 Issue date cannot be earlier than the issue date of the latest issued invoice in the same number series, so numbers and dates rise together.
W016 Due date defaults to issue date plus the customer's payment terms (else the firm default) in days, and cannot be earlier than the issue date.
W017 The financial year runs 1 April to 31 March by issue date and is labelled YY-YY, for example 26-27 for 1 April 2026 to 31 March 2027.
W018 Invoice number format is PREFIX/YY-YY/NNNNN, for example INV/26-27/00001, with a prefix of 1 to 4 characters and a 5-digit sequence, so no number exceeds 16 characters.
W019 An invoice number is assigned only when the invoice is issued, from a counter per firm, prefix and financial year that starts at 00001 each year and adds 1 per issue.
W020 Invoice numbers have no gaps: deleting a draft or a failed issue attempt never uses a number, and two simultaneous issues never receive the same number.
W021 An invoice needs 1 to 50 lines to be issued; issuing with zero lines is rejected.
W022 A line needs a description of 1 to 200 characters, a quantity above 0 up to 999999.999 with 3 decimals, and a unit rate from 0 to 9999999.99 with 2 decimals.
W023 A line discount is a percentage from 0 to 100 with at most 2 decimals and is applied before tax.
W024 When the firm has a GSTIN, every line needs an HSN or SAC code made of 4, 6 or 8 digits.
W025 A line tax rate must be one of 0, 0.25, 3, 5, 18 or 40 percent, with 18 percent as the default for new lines.
W026 Line taxable value equals quantity times rate times (1 minus discount percent divided by 100), rounded half up to 2 decimals.
W027 Place of supply defaults to the customer's billing state, can be changed while the invoice is a draft, and is locked at issue.
W028 When place of supply equals the firm's state, each line's CGST and SGST are each taxable value times rate divided by 200, rounded half up to 2 decimals.
W029 When place of supply differs from the firm's state, each line carries IGST equal to taxable value times rate divided by 100, rounded half up to 2 decimals, and no CGST or SGST.
W030 Grand total is the sum of taxable values and taxes rounded half up to a whole rupee, and the signed round-off amount is shown on its own line.
W031 An invoice grand total above 99,99,99,999 rupees is rejected on save with a message that states the limit.
W032 A firm without a GSTIN produces documents titled "Bill of Supply" with all line tax rates fixed at 0, no HSN or SAC requirement, and no tax columns.
W033 After issue, the customer, lines, amounts, issue date and place of supply cannot be changed, and any attempt is refused with a clear error.
W034 After issue, only the due date (not before issue date), customer note and internal note can be edited, and each change is recorded in history.
W035 Invoice status is computed: issued when nothing is paid or credited, partially_paid when balance due is above 0 and below grand total, paid at 0; draft and void are set only by issue and void.
W036 An issued or partially paid invoice whose due date is before today in IST is labelled overdue; overdue is a displayed label, not a stored status.
W037 Balance due equals grand total minus non-reversed payments and TDS, minus active credit notes and customer credit applied to this invoice, and is never below 0.
W038 Only an owner can void an invoice, and only if it has no active payment, credit note or IRN; a reason of 5 to 200 characters is required and the number stays used.
W039 Owner or accountant can hard-delete a draft invoice after a confirm step; an issued or void invoice can never be deleted.
W040 Duplicate creates a new draft with the same customer, lines, place of supply and notes, with today's date, no number and no payments.
W041 An invoice has a customer note of up to 500 characters that is printed, and an internal note of up to 1000 characters that is never printed or shared.
W042 The invoice print page is A4 and shows firm name, address and GSTIN, number, dates, customer details, lines with HSN or SAC, tax summary per rate, round-off, grand total in Indian words and bank details.
W043 Money shows with Indian digit grouping, the rupee sign and 2 decimals, for example ₹12,34,567.50, and dates show as DD-MM-YYYY everywhere in the interface and print pages.
W044 Owner or accountant can create a read-only share link for an issued invoice with a random token of at least 32 characters; it expires after 30 days, can be revoked, and needs no login.
W045 With e-invoicing on, Generate e-invoice on an issued invoice to a customer with a GSTIN asks the fake portal, which follows the firm's mode (succeed, fail, fail 1 in 5) and returns a 64-hex IRN.
W046 When the fake portal fails, the invoice stays issued and payable, the error code and message show on the invoice, and Retry is allowed any number of times.
W047 Owner or accountant can mark an invoice to repeat monthly on a chosen day from 1 to 28; a daily job at 06:00 IST then creates a draft copy and never issues it.
W048 Owner or accountant can record a payment on an issued or partially paid invoice only; draft, paid and void invoices refuse payments with a clear message.
W049 Payment amount must be above 0 with 2 decimals, and amount plus TDS cannot exceed the invoice balance due; larger amounts are rejected because advance payments are out of scope.
W050 Payment date cannot be in the future in IST and cannot be earlier than the invoice issue date.
W051 Payment mode must be one of cash, bank transfer, UPI, cheque, card or other.
W052 Payment reference holds up to 60 characters and is required for cheque, bank transfer and UPI payments.
W053 A payment may carry a TDS amount of 0 or more that counts toward settling the invoice but is not money received, and is shown separately in totals and on the receipt.
W054 After a payment the invoice becomes partially_paid if balance due is still above 0 and paid when balance due is exactly 0.
W055 A payment matching an existing non-reversed payment on the same invoice, amount, date and reference within 24 hours is rejected unless the user explicitly confirms it.
W056 Each payment receives a receipt number REC/YY-YY/NNNNN from its own gapless counter per firm and financial year of the payment date.
W057 The receipt print page shows receipt number, payment date, invoice number, customer, amount received, TDS, mode and reference.
W058 A saved payment cannot be edited except its reference and note; a wrong amount is fixed by reversing and recording again.
W059 Only an owner can reverse a payment with a reason of 5 to 200 characters; the row stays listed as reversed, balance and status are recalculated, and its receipt number is never reused.
W060 A credit note can be created only from an issued, partially paid or paid invoice, stores a link to it, and an invoice may have many credit notes.
W061 A credit note needs one reason from sales return, post-sale discount, invoice correction or deficiency in service, plus an optional note of up to 300 characters.
W062 Credit note lines start as copies of the original lines; each may be lowered but never above that line's remaining creditable taxable value.
W063 Credit note tax uses each original line's rate, HSN or SAC and place of supply, giving CGST and SGST or IGST as the invoice did, with the same rounding.
W064 Credit note number format is CN/YY-YY/NNNNN from its own gapless counter per firm and financial year, assigned at issue, with the year taken from its issue date.
W065 A credit note issue date cannot be before the original invoice date or in the future, and cannot be after 30 November following the end of the original invoice's financial year.
W066 Issuing a credit note lowers the invoice balance due, and any amount above that balance becomes the customer's credit balance.
W067 Owner or accountant can apply a customer's credit balance to another issued invoice of the same customer, up to the smaller of the credit balance and that invoice's balance due.
W068 The credit note print page is titled "Credit Note" and shows its number and date, the original invoice number and date, reason, lines, tax split and total.
W069 An issued credit note cannot be edited or deleted; only an owner can void it with a reason, restoring invoice balance, and only if none of its credit has been applied elsewhere.
W070 Firm profile needs a legal name of 1 to 120 characters, address and state, with an optional GSTIN validated as for customers and starting with the firm state's code; only an owner can edit it.
W071 Invoice and credit note prefixes are each 1 to 4 uppercase letters or digits, default INV and CN, and can change only while no document with that prefix is issued in the current financial year.
W072 Firm defaults hold payment terms of 0 to 90 days (initially 15), a default customer note up to 500 characters and bank details up to 300 characters for printing.
W073 Owner can invite a user by email with role owner, accountant or viewer; the email must be unique system-wide, a user belongs to one firm, and the outbox invite link expires in 7 days.
W074 An owner can change a user's role or deactivate them, but the last active owner of a firm cannot be demoted or deactivated.
W075 A viewer can only view, search and print; an accountant can do everything except edit firm settings, manage users, void invoices or credit notes and reverse payments; forbidden actions return 403.
W076 Login uses email and a password of at least 10 characters stored hashed; 5 failed attempts within 15 minutes lock the account for 15 minutes, and a session ends after 8 hours idle.
W077 Every record belongs to one firm and users reach only their own firm's data; requesting another firm's record by ID, in lists, search, export or share link, returns 404.
W078 The invoice list shows number, customer, issue date, due date, total, balance due and status, 25 per page, newest issue date first, with drafts at the top.
W079 The invoice list filters by status (draft, issued, partially_paid, paid, void, overdue), customer and issue date range, and active filters combine with AND.
W080 Invoice search matches, case-insensitively and by substring, invoice number, customer name or customer GSTIN once at least 2 characters are typed, and combines with filters.
W081 Customer search matches name, GSTIN or phone by case-insensitive substring from 2 characters; archived customers appear only when "Show archived" is switched on.
W082 Invoice list columns number, issue date, due date, grand total and balance due each sort ascending or descending, and the chosen sort stays in the page URL.
W083 Owner or accountant can export the current filtered invoice list as CSV, UTF-8 with byte-order mark, ISO dates (YYYY-MM-DD), amounts as plain decimals with 2 places, up to 50,000 rows.
W084 A GST sales register CSV for a date range has one row per invoice and credit note line with HSN or SAC, taxable value, CGST, SGST and IGST; credit note rows negative; void invoices excluded.
W085 At 375 pixels wide every list, form and print preview uses one column with no sideways page scroll, and every button is at least 44 pixels tall.
W086 Emailing an issued invoice creates one outbox row with recipient, subject, body containing the share link, and status queued; draft invoices cannot be sent and the recipient email must be valid.
W087 The outbox page lists rows newest first with status queued, sent or failed; a local job marks queued rows sent within 60 seconds, except recipients ending @fail.test, which fail; Retry requeues failed rows.
W088 A daily job at 09:00 IST queues a reminder 1, 7 and 15 days after due date for each overdue invoice with a customer email, at most 3 per invoice, none after paid or void.
W089 History is append-only: each create, edit, issue, void, payment, reversal, credit note, e-invoice attempt and role change stores actor, time and old and new values, and shows on the document's page.
W090 An empty list shows a plain message and a create button only if the role may create; a failed load shows a plain error message with a Retry button instead of a blank page.
