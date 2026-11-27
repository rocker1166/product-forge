# Invoices for Indian service firms: Journeys

**J01, owner, first hour:** sign up and send the first real invoice from a phone in five minutes (at most 5 steps; Stripe create and send, about 6 steps; our wide line A039 sets 12 taps on a phone)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | sign_up | user.create | Email and a password of 10 or more characters, nothing else. After Create account: Check your inbox, we sent a link. | Message at the field. An email that already has a login says Sign in instead and links to it. Wrong or lost link: Send the link again. |
| 2 | setup_guide | firm.create | Three questions: firm name, state, GSTIN (optional). A fourth line asks the last invoice number used, so numbering carries on. Done lands on a new invoice screen, not on an empty home. | A GSTIN that fails the 15-character check says which part is wrong and lets the owner continue without it (plain Invoice, no tax lines). |
| 3 | invoice_form | customer.create | A small sheet inside the invoice: name only. Type is business, state is the firm's state. | Message at the field. A GSTIN already used by another customer names that customer. |
| 4 | invoice_form | invoice.issue | One line (description, quantity, rate), the tax split and total with round-off, then a preview and a check list: GSTIN, SAC, place of supply, tax split. Issue takes the number. A Practice invoice button shows the PDF with a PRACTICE watermark and takes no number. | A list of what is missing with a link to each field. A lost connection says Not saved, retrying, and a retry never takes a second number. |
| 5 | invoice | share_link.create | Send on WhatsApp first, then Send by email, Copy link, Download PDF. The link opens a page with the invoice and a UPI button. | A customer with no phone or email: Copy link and Download PDF still work, and the screen says which is missing. |

End: the customer has the link on WhatsApp, the invoice shows Sent and the setup guide ticks first customer and first invoice

**J02, owner, first hour:** finish setup so the invoice shows UPI, logo and bank details and the accountant is invited (at most 3 steps; setup checklist, wide line D301)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | setup_guide | firm.edit | A checklist: firm profile, bank account, first customer, first invoice, invite accountant. Each line opens its own form and ticks when done. | Message at the field with the shape expected (IFSC is four letters, a zero, six letters or digits). |
| 2 | templates | template.customise | The standard look with a live preview. Logo (PNG or JPG, 1 MB, 2000 px), one colour, footer and terms. | A file too big or the wrong type says the limit; the old look stays. |
| 3 | team | invite.create | Email and role (accountant, staff, viewer or owner). One accountant seat is free. | A bad email says so at the field. A person who is already in the firm is told, not invited twice. |

End: the checklist is all ticked and the next invoice prints the logo, bank details and UPI QR

**J03, owner, first hour:** bring the old customer list in from Excel without typing it again (at most 3 steps; Twenty import, 7 steps)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | customers | customer.import | An Import button next to New customer opens a four-step page: file, check, confirm, result. A sample file to download. | A file that is not .csv or .xlsx, or over 5 MB, says which limit it broke. |
| 2 | import_wizard | import_job.create | Columns mapped by their headings, with a dry run: rows to create, update and skip, and bad rows with row number, field and reason. | Bad rows download as a CSV and are skipped; good rows are still importable. Old state spellings map to the GST list, an unmapped one stops its row. |
| 3 | import_wizard | import_job.start | Rows done of total. The page can be closed; an email follows. | If the system fails half way the whole run rolls back, so there is never a half-imported list, and Try again is one button. |

End: the customer list shows the new rows with counts of created, updated, skipped and failed

**J04, owner, a normal day:** send an invoice to a repeat customer from a phone (at most 3 steps; Stripe create and send, about 6 steps)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | home | invoice.create | The big New invoice button. The customer picker opens first, last-used customers on top. | Opens again with the draft kept. A draft also saves every 30 seconds and shows Saved 10:42. |
| 2 | invoice_form | invoice.issue | Preview and the final check list, then the number. If a tax rate changed since the draft was saved, old and new tax are shown and need one tap. | Says what is missing and where. The 30 November, locked-period and free-plan limits say the exact date or count. |
| 3 | invoice | share_link.create | Send on WhatsApp first; email, copy link and PDF below. The invoice shows Sent after the first send and Opened when the customer opens the page. | WhatsApp not installed: Copy link. Email bounced: the outbox row shows why and the invoice page says so. |

End: the customer has the link and the invoice shows Sent

**J05, owner, a normal day:** mark an invoice paid when the money lands in the bank (at most 3 steps; wide line C034, at most 3 taps: open invoice, Record payment, Save)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoices | invoice.search | Type the customer name or the last digits; the unpaid view is one tap. The row shows balance due. | No match text names what to try (part of the name, the last digits). |
| 2 | invoice | invoice.record_full | Record payment sheet with balance due on top and a Full amount chip, then Save. The invoice turns Paid and reminders stop. | An amount over the balance is refused with the balance written out. A locked period or an invoice already paid says so. |
| 3 | payment | message.create | Send receipt on WhatsApp is offered as the next action. The receipt says it is not a tax document. | A customer with no phone or email: Download PDF, and the screen says which is missing. |

End: the invoice shows Paid with the receipt number and the customer holds the receipt

**J06, owner, a normal day:** record one bank credit that pays two invoices with TDS cut (at most 3 steps; judge: one payment split over invoices, wide line A029)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoice | payment.create | Record payment sheet for this invoice. Switch to More options for part payment, TDS and several invoices. | A payment plus TDS over the balance is refused in words; advances are not in this version, and the message says so. |
| 2 | payment_form | payment.record | Amount received, TDS, mode, reference and a list of that customer's open invoices, oldest due first, that must add up to the amount. | The sum that does not match the amount shows the difference at the list. A cash receipt that would reach Rs 2,00,000 in a day is blocked with the section named. |
| 3 | payment | message.create | One receipt per payment, listing both invoices. | As in J05. |

End: both invoices show the new balance and the TDS shows in the customer's receivable ledger

**J07, owner, a normal day:** chase what is overdue in a minute (at most 2 steps; wide lines W088 and C039)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | home | nav | Four tiles: outstanding, overdue, collected this month, drafts. The Overdue tile opens the overdue list. | A failed load shows a plain error with Retry, never a blank page. |
| 2 | invoices | invoice.bulk | Select the rows (or the whole Overdue view), Send reminder. One message per customer listing all their overdue invoices; WhatsApp is one tap per customer. | A customer with no email is skipped and listed for a call. Failed rows come back with the reason and a Retry. |

End: every overdue customer has one reminder and the invoice rows show Reminded

**J08, owner, a busy day:** check and send the month's repeat invoices in one sitting (at most 3 steps; wide lines D054 and C052)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | recurring_plans | recurring_plan.skip_next | Each plan with its next run and last month's amount. Skip next run is one tap on a client who is on break. | A plan that failed shows why and Redo this period. |
| 2 | invoices | invoice.filter | The Needs review view: drafts made by plans and imports, newest first, changed amounts marked. | No match text: Nothing to review. |
| 3 | invoices | invoice.bulk | Issue the reviewed drafts, then Send. Numbers are taken in date order. Failed rows come back listed with a reason. | Stops at the free-plan limit and lists the rest; a row with a missing field is listed, the others still issue. |

End: all repeat invoices are issued and sent, and the skipped ones are listed

**J09, owner, a mistake to fix:** an invoice went out with the wrong amount and nothing is paid, so cancel and re-issue it (at most 4 steps; wide lines W038, B191)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoice | invoice.void | One button, Correct this invoice, picks Void or credit note plus a new draft from the state and says which and why before the first press. Void asks a reason of 5 to 200 characters. The PDF gets CANCELLED, the number stays used and the customer's link says cancelled. | Refused if a payment or credit note counts against it or an IRN is live, and says which one. |
| 2 | invoice | invoice.create | Make a corrected copy: a new draft with the same customer and lines, linked both ways to the void one. | Same as a new invoice. |
| 3 | invoice_form | invoice.issue | The usual preview and check list; a banner says it replaces the voided number. | As in J04. |
| 4 | invoice | share_link.create | Send again: an email and a WhatsApp text are pre-filled with the cancelled and the new number and both PDFs, and the old link shows Replaced by the new invoice with a link. | As in J04. |

End: the old invoice is void and readable, the new one is issued and linked, and the customer has the new link

**J10, owner, a mistake to fix:** correct an invoice that is paid, or old, with a credit note and a new invoice (at most 3 steps; Stripe credit note, about 3 steps)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoice | credit_note.create | A credit note draft with the invoice's lines, one reason (sales return, post-sale discount, invoice correction, deficiency in service) and an optional note. | A date after 30 November following the year end is refused with the exact date; only an owner can record a non-GST commercial credit. An amount over the balance is refused in words. |
| 2 | credit_note_form | credit_note.issue | Preview, then the number. The invoice shows Credited or the balance it lowered; excess becomes customer credit. | Says what is missing and where. |
| 3 | credit_note | message.create | Send credit note by email or WhatsApp; the page reminds, for a post-sale discount, that the customer must reverse the input tax. | As in J05. |

End: a credit note is linked and both papers are readable; the customer holds the credit note

**J11, owner, a mistake to fix:** a payment was saved with the wrong amount, so reverse it and record it again (at most 2 steps; wide line W059)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | payment | payment.reverse | Reverse asks a reason of 5 to 200 characters. The row stays listed as reversed; invoice balance and state are recalculated and reminders restart from the due date. | A reversal that would leave other credit uncounted says what changes; the receipt number stays used. |
| 2 | payment_form | payment.record | The same form as a new payment, with the right amount. | As in J06. |

End: the wrong payment is listed as reversed and the new one is active with its own receipt number

**J12, owner, month end:** hand the month to the accountant in one pack (at most 3 steps; wide lines D228, W083, B156, B152)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | month_end | nav | The month before, with a list of invoices that block the return (missing SAC, no state) and a link to fix each; below, counts that must match: documents issued, outward summary, HSN summary. | A mismatch of even one rupee between the summaries lists the invoices that differ. |
| 2 | month_end | export_job.create | Build pack: invoices, lines, credit notes, payments and TDS, HSN and outward summaries, aging and Tally XML. Progress shows rows done of total; the page may be closed. | A file that fails half way is dropped whole; the run shows failed with the reason and Retry builds it again. |
| 3 | month_end | firm.edit | Lock this month: nothing dated on or before the lock date can be created, edited, voided or reversed. | Moving the date back later needs the owner and a reason. |

End: the accountant has the pack by email and the month is locked

**J13, owner, handing over to a colleague:** give the accountant access to the books (at most 2 steps; wide lines W073, A011)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | team | invite.create | Email and role. The accountant gets one link that works only for that email, for 7 days. | An email that already has a login is invited the same way and never shown other firms. |
| 2 | team | invite.resend | Pending invites with Resend and Revoke. The old link then says replaced. | A seat limit is tested when the person accepts, and says how many to remove. |

End: the accountant is in the list as Active and can open the firm

**J14, owner, handing over to a colleague:** pass the firm to a new owner (at most 1 steps; wide line A004)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | team | membership.offer_ownership | Pick another active person, confirm. They get a link for 7 days; nothing changes until they accept. | Offered to someone who is no longer active: the offer is void and says so. |

End: after acceptance the new owner is Owner and the old one becomes Accountant

**J15, owner, leaving with the data:** leave with every record and close the firm (at most 3 steps; Zoho backup, request then wait then download)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | exports | export_job.create | Full copy of your books: invoices with lines, payments, credit notes, customers, services, history, PDFs and Tally XML. Every owner is emailed. | A file that fails half way is dropped whole; Retry builds it again. |
| 2 | exports | export_job.view | The run with Ready, rows, size and the 7-day link; Download. | An expired link says so and offers a new export. |
| 3 | settings_security | firm.start_closing | Type the firm name and the password again. A 30-day cooling period starts, the firm turns read only, renewal stops and a final export link is made. | A wrong name or password says which. |

End: the owner holds a full export and the firm shows Closing with the date it will be sealed

**J16, accountant, first hour:** join a client's firm from an invite and see the books (at most 2 steps; wide lines W073, A001)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | accept_invite | invite.accept | Firm name, role and who invited. Sign in or create a login with that same email. The link never names other firms. | A different signed-in email is refused and says which email the invite is for. An expired link says so and names the owner to ask. |
| 2 | firm_switcher | firm.search | A list of your firms with role, newest first. Typing finds a firm by name or GSTIN. | No match text; a firm you left is gone from the list. |

End: the header shows the firm name and the role Accountant and Home opens

**J17, accountant, a normal day:** issue the drafts staff made for a client firm (at most 3 steps; wide lines A001, K107)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | firm_switcher | firm.search | The last five firms first; type to find another. | No match text. |
| 2 | invoices | invoice.filter | Drafts and Needs review views with who made each draft. | No match text: No drafts waiting. |
| 3 | invoices | invoice.bulk | Tick the drafts and press Issue selected: each row runs its own check list and the rows that fail are listed with the field. One draft still opens in the form; if a second person changed it, the save is refused and the newer version shows. | As in J04. |

End: the staff drafts are issued with numbers and the staff member sees them as Issued

**J18, accountant, a busy day:** build the month-end pack for each of thirty client firms (at most 2 steps; wide lines A001, D228)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | firm_switcher | firm.search | Thirty firms, the next one by name or GSTIN; the active firm name is always in the header. | A firm the owner closed is listed as Closing. |
| 2 | month_end | export_job.create | The blockers list for that firm first, then Build pack. The file is the same shape for every firm. | As in J12. |

End: a pack is queued per firm and the accountant gets one email per firm

**J19, accountant, a mistake to fix:** correct a sent invoice with a credit note (at most 3 steps; Stripe credit note, about 3 steps)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoice | credit_note.create | As in J10. | As in J10. |
| 2 | credit_note_form | credit_note.issue | Preview, then the number. | Says what is missing and where. Void is not offered; the owner does that. |
| 3 | credit_note | message.create | Send credit note. | As in J05. |

End: a credit note is linked and the invoice shows the lower balance; large ones email the owners

**J20, accountant, month end:** check the returns data and take the registers (at most 2 steps; wide lines A124, A125, A126, B152, B156)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | report | export_job.create | The documents-issued summary, the outward summary and the HSN summary for the period; each carries the same taxable total, any rupee mismatch is listed with the invoices that differ, and voided invoices show only through a switch. | An invoice with no SAC blocks the data and the list links to it. |
| 2 | month_end | firm.edit | Lock the month with the date; the owner is emailed. | Moving it back is the owner's with a reason. |

End: the registers are in the accountant's inbox and the month is locked

**J21, accountant, handing over to a colleague:** leave a client firm that stopped working with them (at most 1 steps; wide lines A008, A257)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | firm_switcher | membership.leave | First the screen lists the drafts waiting, the unlocked months and any failed pack for this firm, and the same list goes into the owner's notice. Leave this firm with one confirm. Drafts stay with the firm for the owner to reassign; your name stays on history. | An owner cannot leave until another owner exists, and the message says so. |

End: the firm drops out of the switcher and the owner is told

**J22, accountant, leaving with the data:** take the books and go (at most 2 steps; wide lines A257, A254)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | exports | export_job.create | Registers, payments with TDS and Tally XML for the last month; files last 7 days. | As in J15. |
| 2 | firm_switcher | membership.leave | As in J21. | As in J21. |

End: the accountant has the files and the firm is gone from their list

**J23, staff, first hour:** join the firm and save a first draft invoice (at most 3 steps; wide lines A002, D346)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | accept_invite | invite.accept | As in J16. | As in J16. |
| 2 | home | nav | A home with New invoice, Customers and Quotes. No revenue totals, and the page never fetches them. Reports and Settings are not in the menu. | A typed address for a hidden page returns a denied page that names the owner. |
| 3 | invoice_form | invoice.draft | Save draft is the main button. The draft says Saved 10:42 and shows who will issue. | A lost connection says Not saved, retrying. |

End: a draft sits in the owner's and accountant's Drafts view

**J24, staff, a normal day:** copy last month's invoice into a new draft (at most 4 steps; wide line W040)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoices | invoice.search | Find the customer's last invoice by name or number. | No match text. |
| 2 | invoice | invoice.duplicate | A new draft with the same customer, lines and notes; today's date, no number, no payments. | A customer put away says so and asks the owner. |
| 3 | invoice_form | invoice.edit | Change the amount or the period on the draft. | As in J23. |
| 4 | invoice_form | invoice.draft | Saved 10:42 and the draft is waiting for the owner or accountant. | As in J23. |

End: the new draft is in the Drafts view

**J25, staff, a mistake to fix:** fix a wrong draft before anyone issues it (at most 2 steps; wide line K107)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoices | invoice.filter | The Drafts view, mine first. | No match text. |
| 2 | invoice_form | invoice.edit | Every field of a draft can change. If another person saved first, this save is refused and the newer version shows. | Refused with the newer version side by side; nothing typed is lost. |

End: the draft is correct and waiting

**J26, staff, a mistake to fix:** tell the owner that an issued invoice is wrong (at most 1 steps; judge: staff cannot change an issued invoice, so the comment is the only way to flag it)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoice | invoice.comment | An internal comment on the invoice, shown to owner and accountant only, never printed or shared. Staff cannot void or edit an issued invoice. | A comment that is too long shows the count. |

End: the owners see the comment on the invoice and as Needs a look on Home with the invoice link, and can void it or issue a credit note

**J27, staff, handing over to a colleague:** leave the firm (at most 1 steps; wide line A257)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | firm_switcher | membership.leave | As in J21. | As in J21. |

End: the firm drops from the switcher; the owner reassigns any drafts in one step

**J28, staff, leaving with the data:** close my own login (at most 1 steps; wide lines A255, A257)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | account | user.close_account | Close account asks the password again. Sessions end at once; the name stays on history. | A person who is the only owner of any firm is refused and the message names the firm. |

End: the person cannot sign in and the firm's history still shows the name

**J29, viewer, first hour:** join the firm and see how the business is doing (at most 3 steps; wide line W073)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | accept_invite | invite.accept | As in J16. | As in J16. |
| 2 | home | nav | A read-only strip: unpaid total, overdue total and issued this month, each linking to its view. | A denied page names the owner. |
| 3 | invoices | invoice.filter | Invoices open read-only; New invoice is not shown. The Unpaid and Overdue views are one tap. | A denied page names the owner. |

End: the viewer sees the unpaid list

**J30, viewer, a normal day:** check whether one customer has paid (at most 2 steps; wide line D341)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | invoices | invoice.search | The customer's invoices with state and balance. | No match text. |
| 2 | invoice | invoice.view | State, balance, payments listed with date, mode and amount and never TDS or reference, the share link's first and last open, never the link text. | A gone invoice says so with a link to the list. |

End: the viewer knows whether and when it was paid

**J31, viewer, month end:** read the month's figures (at most 2 steps; wide lines B060, B068)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | report | nav | Aging, customer balance and sales for the month, with a date range and a customer filter. No export button; the accountant gets the files. | A denied export says who can make it. |
| 2 | invoices | invoice.filter | Tapping a figure opens the invoices behind it. | No match text. |

End: the viewer has read the figures and found the invoices behind them

**J32, viewer, handing over to a colleague:** leave the firm (at most 1 steps; wide line A257)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | firm_switcher | membership.leave | As in J21. | As in J21. |

End: the firm drops from the switcher

**J33, viewer, leaving with the data:** close my own login (at most 1 steps; wide line A257)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | account | user.close_account | As in J28. | As in J28. |

End: the person cannot sign in

**J34, client, first hour:** open the link from WhatsApp and read the invoice (at most 1 steps; wide lines W044, C022)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | shared_document | share_link.view | Firm name, invoice number, amount, due date, state (Due, Paid, Cancelled) and a large Pay with UPI button with a QR below it while a balance is left. Download PDF. | An expired link says so and gives the firm's contact. A wrong link looks exactly like a missing page. A PDF still being made says Preparing and retries by itself. |

End: the client has read the invoice and the firm sees Opened with the time

**J35, client, a normal day:** pay by UPI and tell the firm (at most 3 steps; wide lines D073, C030, C031)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | shared_document | share_link.view | The page with Pay with UPI and the QR. | Link expired or cancelled: plain page with the firm's contact. |
| 2 | shared_document | nav | Pay with UPI opens the client's own UPI app with amount and note filled. The page cannot know if the money moved, so it does not claim Paid. | No UPI app on the phone: the QR can be scanned from another phone, or the bank details can be copied. |
| 3 | shared_document | payment.create | Back on the page, I have paid asks the amount and the UPI reference (optional). It then reads Pending check: the firm will confirm. | A claim over the balance is refused in words. A claim lapses after 14 days and the page says not confirmed and allows another. |

End: the client sees Pending check, the owner is told at once, and after one tap by the owner the page shows Paid

**J36, client, a mistake to fix:** the firm did not confirm the claim, so file it again or reach the firm (at most 2 steps; wide line C031)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | shared_document | share_link.view | The page says the last claim was not confirmed and gives the reason, with the firm's phone and email. | As in J34. |
| 2 | shared_document | payment.create | I have paid again, with the right amount and reference. | As in J35. |

End: the new claim is Pending check and the firm is told

**J37, client, leaving with the data:** keep a copy of the invoice (at most 1 steps; wide lines W042, C022)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | shared_document | invoice.print_pdf | Download PDF gives the stored copy, file name is the number with hyphens, marked Original for Recipient. A cancelled invoice still downloads with its CANCELLED mark. | Preparing: retry by itself. |

End: the client has the PDF on the phone

**J38, support, first hour:** sign in to the console and open a firm that granted access (at most 3 steps; wide lines A013, D282)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | sign_in | nav | The same sign-in page. Support always needs the second step. | Five wrong tries lock the login for 15 minutes. |
| 2 | second_step | nav | A code box that stays open when tapped outside. | A wrong code says so; five tries. |
| 3 | support_console | firm.search | Search by firm name, GSTIN or ticket number. A firm with no grant shows denied and says to ask the owner; a firm with a grant shows a banner with the end date. | No match text names the ticket and owner email to check. |

End: support sees the firm read-only under the banner and every read is written to the owner's history

**J39, support, a normal day:** find why a customer did not get an invoice and tell the owner what to press (at most 2 steps; wide lines W087, A013)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | history | history_entry.search | Entries for the firm by invoice number, with the support label and ticket. | No grant: denied with the owner's name. |
| 2 | outbox | message.search | The failed row with the provider's reason (bounced, spam complaint, no address). Support only reads: Retry is the owner's or accountant's button, and the ticket note says which row and why. | A firm with no grant shows denied and names the owner to ask. |

End: the ticket names the reason and the owner knows which row to retry

**J40, support, a busy day:** publish a tax rate change before it takes effect (at most 2 steps; wide lines A060, A098, A113)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | tax_tables | rate_master.create | A dated row: table, code, name, old alias, rate, threshold, effective date and source note. | A row for the same table, code and date is refused. The source note is required. |
| 2 | tax_tables | rate_master.publish | Firms that use the code are told before the date; drafts saved earlier show old and new tax at issue. | A date in the past is refused unless the row corrects an earlier one. |

End: the row is Scheduled and firms see the warning

**J41, support, a mistake to fix:** an owner closed their own login by mistake, so open it again (at most 1 steps; judge: support reopens only what the person asked for)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | support_console | user.reopen | The person asked and proved the email. The login opens; no firm membership comes back by itself, so the owner is asked to check the firm list. | A login that was never closed says so. An email that does not match is refused. |

End: the owner can sign in and the history has a support row

**J42, support, leaving with the data:** give a former owner a copy of the books of a sealed firm (at most 2 steps; wide lines A068, A256)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | support_console | firm.search | Find the sealed firm by GSTIN. Its books are open only to the proofs below: the former owner's email, the GSTIN or PAN, a signed request and a 7-day wait with a mail to the last known phone (R65). | A firm that is not sealed shows no export button; a missing proof says which one. |
| 2 | support_console | export_job.create | The full-firm export is built under the support label and the ticket. The link goes only to the proved email, opens after a code sent to the same address and works 24 hours. | An email that is not the proved one is refused and nothing is made. |

End: the former owner holds the export and the sealed firm's history has a support row

**J43, client, month end:** see the month's statement and pay six invoices with one transfer (at most 3 steps; wide lines W209, D326, B080)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | client_sign_in | customer.sign_in | One field, Password, and Open my page. The firm's name and phone sit at the top. | Wrong password, 3 tries left. After five: Too many tries, try again after the time shown or ask the firm for a new password. |
| 2 | client_page | payment.create | Waiting for you: six open invoices with tick boxes and one total. Pay selected opens one UPI payment of that total, then I have paid asks the amount and an optional reference. It reads Pending check on all six. | A claim above the ticked total is refused in words. A claim that is not confirmed lapses after 14 days and the page says so. |
| 3 | client_statement | customer.print_pdf | This month by default: opening balance, every invoice, payment, credit note and cancellation with a running balance, the closing balance and the open invoices. | A period with nothing in it says No document in this period. |

End: the client paid once, the firm sees one Pending check claim to split, and the client holds the statement PDF

**J44, client, a busy day:** accept a quote the firm sent (at most 2 steps; wide lines D003, W207)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | client_sign_in | customer.sign_in | Password and Open my page. | As in J43. |
| 2 | client_quote | quote.accept | Lines, total, terms and the last day to answer. Accept quote asks for your name; Decline asks for an optional reason. | After the validity date: This quote expired on 30 Nov, with the firm's phone and email. A quote already answered shows its answer and no buttons. |

End: the quote shows Accepted with the name and time, and the owner and accountant are mailed

**J45, client, a mistake to fix:** forget the password and get back in (at most 2 steps; wide lines W203, W204)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | client_sign_in | customer.wrong_password | Wrong password, 3 tries left, with Forgot password beside the field. | After the fifth wrong try: Too many tries. Try again after 14:35 or ask the firm for a new password, with the firm's phone and email. |
| 2 | client_sign_in | customer.reset_password | Type the email on file. The page always says We sent a link. The mail link works once for 60 minutes and asks for a new password of 10 to 64 characters. | An expired or used link says so and offers Forgot password again. The page never says whether an email is on file. |

End: the client signs in with a new password and every older session has ended

**J46, owner, a normal day:** turn on the client page for a customer and send the link (at most 2 steps; wide lines W201, W202, B081)

| # | Screen | Does | Sees | If it fails |
|---|---|---|---|---|
| 1 | customer | customer.open_portal | A Client page panel showing Off. Turn on asks for a password or Make one for me, which shows 12 letters and digits once. | A password under 10 characters says so. A customer with no email or phone cannot be sent a link and the panel says which one to add. |
| 2 | customer | customer.send_portal_link | Send link by email or WhatsApp with no password in it. Email the password sends it separately. | No email or phone: the panel says Add one first. |

End: the panel reads On, the client has the link and the owner knows the password to tell

