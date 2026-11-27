# Invoices for Indian service firms: two pages to decide

Invoices and payments for small Indian service firms.

For the owner of a service firm of 1 to 20 people (design, IT, legal, consulting, agencies, repair, coaching), who also does the billing. 27 objects, 6 roles, 54 screens, 46 journeys.
All 13848 answers filled. Filled does not mean right.
Evidence: single 243, judge 776, strong 202.

## Your questions (0)


## Left out on purpose, touching money, law or data

- Allocation, edit: **no**. Amounts never change; a wrong split moves to another invoice through reassign, or the payment is reversed.
- Allocation, print pdf: **no**. Printed inside the receipt of its payment, which lists each allocation.
- Allocation, comment: **no**. The payment's note is the only comment.
- Allocation, schedule: **no**. Nothing repeats; rows are written when a payment is recorded.
- Allocation, notify: **no**. Nobody is told about a row; the receipt and the owner alert belong to the payment.
- Allocation, api: **later**. Waits for the public API.
- Allocation, webhook: **later**. Waits for the public API and its events.
- Customer Credit, edit: **no**. Rows are appended, never changed; a wrong application is unapplied.
- Customer Credit, print pdf: **no**. The customer statement and the credit note carry the figures; the account has no paper of its own.
- Customer Credit, comment: **no**. The reason on each row is the only note.
- Customer Credit, schedule: **no**. Credit is never applied by itself; a person chooses the invoice.
- Customer Credit, notify: **no**. Nobody is told about credit rows; the credit note email and the refund alert cover it.
- Customer Credit, api: **later**. Waits for the first public API.
- Customer Credit, webhook: **later**. Waits for the public API events.
- Credit Note, bulk: **no**. Each credit note is a separate tax act; none are done in bulk.
- Credit Note, archive: **no**. Credit notes are tax records and stay in lists; views narrow them.
- Credit Note, restore: **no**. Nothing is archived and a deleted draft does not come back.
- Credit Note, duplicate: **no**. A second credit is made from the invoice again so the remaining creditable value is checked.
- Credit Note, approve: **no**. Accountants issue credit notes; owners get an email on large ones instead of a sign-off.
- Credit Note, tag: **no**. No free tags in wave 1.
- Credit Note, remind: **no**. A credit note has no due date.
- Credit Note, schedule: **no**. A credit note is issued when the person issues it.
- Credit Note, custom fields: **no**. Fixed fields only.
- Credit Note, api: **later**. Credit notes are read by other software only after the API ships.
- Credit Note, webhook: **later**. Credit note events go out only with the API, later.
- E-invoice Record, edit: **no**. Nobody edits it: IRN, acknowledgement and signed QR come from the portal and are written once; a change is a new attempt row.
- E-invoice Record, draft: **no**. A record exists from issue; there is no half-made record.
- E-invoice Record, import: **no**. Opening-balance invoices are migrated and are not e-invoiced; no IRN is imported.
- E-invoice Record, delete: **no**. Never deleted; attempts are the evidence.
- E-invoice Record, archive: **no**. Cancelled records stay in the list; filters hide them.
- E-invoice Record, restore: **no**. Nothing is archived or removed.
- E-invoice Record, duplicate: **no**. A copy would copy an IRN; a new document gets its own record.
- E-invoice Record, version: **no**. Each attempt is its own row; the portal's signed answer is never altered.
- E-invoice Record, print pdf: **no**. The IRN, acknowledgement and signed QR print on the invoice or credit note PDF, a new PDF version, not a separate file.
- E-invoice Record, share link: **no**. Never shared; the customer sees the IRN on the document.
- E-invoice Record, assign: **later**. Owner and accountants all get alerts in wave 1.
- E-invoice Record, tag: **no**. No free tags are offered in wave 1.
- E-invoice Record, custom fields: **no**. Fixed by the portal.
- E-invoice Record, api: **later**. Portal records are not opened to other software in wave 1.
- E-invoice Record, webhook: **later**. No portal events are sent out in wave 1; owners get email alerts.
- Expense, export: **no**. The full firm export carries expenses.
- Expense, archive: **no**. Nothing is archived; an open entry is deleted and a billed one is locked.
- Expense, restore: **no**. Nothing is archived, so nothing is restored; a deleted row is gone after its confirm.
- Export Job, export: **no**. This object is the export; the list of runs is not exported again.
- Export Job, archive: **no**. Expired runs stay in the list as expired.
- Export Job, restore: **no**. An expired file does not come back; run it again.
- Firm, export: **no**. Firm data leaves through export_job (full export, month-end pack); the profile has no export of its own.
- Firm, archive: **no**. A firm is not archived. Lapsed plans make it read only and a closing request starts the 30-day cooling period.
- History Entry, delete: **no**. No role or path removes a row, and no plan, closure or inactivity rule purges one inside 8 years.
- History Entry, archive: **no**. Rows are not put away; they stay as written.
- History Entry, restore: **no**. Nothing is removed, so nothing is restored.
- History Entry, reverse: **no**. A mistake is answered by a new row that points to the old one.
- History Entry, history: **no**. It is the history; it has no history of its own.
- Import Job, export: **later**. A run log CSV for support waits; each run already carries its rejected-rows CSV.
- Import Job, archive: **no**. Old runs stay in the list, found by date.
- Import Job, restore: **no**. A deleted file does not come back; upload it again.
- Invite, archive: **no**. Expired, revoked and accepted invites stay on the list with their status; nothing is put away.
- Invite, restore: **no**. An expired or revoked invite is not revived; a new invite is sent.
- Invoice, archive: **no**. An invoice is never put away: settled and void ones leave the default view through filters and views, and the books stay whole for at least 8 years.
- Invoice, restore: **no**. Nothing is archived and only drafts are deleted; a deleted draft does not come back.
- Invoice, tag: **no**. No free tags in wave 1; PO number, PO date and project reference are the fixed labels.
- Invoice, custom fields: **no**. A firm cannot add fields of its own; the fixed header holds PO number, PO date, project reference and service period.
- Invoice, api: **later**. Read and write by API waits for the integration build, together with webhooks.
- Invoice, webhook: **later**. Events for issued, paid and voided come with the API, not in wave 1.
- Service Item, export: **no**. The full firm export carries items.
- LUT, archive: **no**. An expired LUT stays listed as expired; there is nothing to hide.
- LUT, restore: **no**. An expired LUT is not revived; a new one is added for the next period.
- Membership, delete: **no**. A membership is never deleted; deactivating keeps the name on history.
- Membership, reverse: **no**. A role change or removal is undone by changing the role or reactivating, not by a separate reverse.
- Outbox Message, export: **later**. Rows leave only inside the full-firm export; a stand-alone outbox CSV waits for a request.
- Outbox Message, delete: **no**. Rows are never deleted; delivery records stay for the life of the document and at least 8 years.
- Outbox Message, archive: **no**. Old rows stay in the list, found by date and filters.
- Outbox Message, restore: **no**. Nothing leaves the list, so nothing is restored; a bounced row stays and a corrected address makes a new row.
- Outbox Message, reverse: **no**. A sent email cannot be recalled; the owner sends a correction. Revoking the link inside it is done on the share link.
- Number Series, delete: **no**. A series is closed, never deleted, so the numbers in use stay explainable.
- Number Series, archive: **no**. A closed series stays visible as it is.
- Number Series, restore: **no**. A closed financial year is not reopened; the next year has its own series.
- Payment, schedule: **no**. Nothing retries or repeats; there is no gateway in this wave. The claim lapse is a move of the system.
- Payment, api: **later**. Comes with the public API; every write will carry an idempotency key.
- Payment, webhook: **later**. Waits for the public API and the gateway.
- Quote, bulk: **later**. No bulk quote action is asked for; each quote is sent or cancelled alone.
- Quote, import: **later**. Old quotes are not imported; open ones are typed again.
- Quote, archive: **no**. Lists and views carry the old quotes; nothing is put away.
- Quote, restore: **no**. Only drafts are deleted and they do not come back; an expired quote is reopened by extending its date.
- Quote, reverse: **no**. A quote is not reversed: cancel it with a reason or let it expire. A converted quote is freed only by deleting the draft invoice it made.
- Quote, tag: **no**. No free tags in wave 1.
- Quote, remind: **later**. No automatic nudge before a quote expires; the Expiring in 7 days view serves.
- Quote, schedule: **no**. A quote is sent when the person sends it; it does not repeat.
- Quote, custom fields: **no**. Fixed fields only.
- Quote, api: **later**. Quotes are not exposed to other software in wave 1.
- Quote, webhook: **later**. No quote events are sent out in wave 1.
- Tax Master, export: **later**. Firms see the tables on screen; a download comes when asked.
- Tax Master, delete: **no**. Rows are closed by a newer row, never deleted.
- Tax Master, archive: **no**. A superseded row stays readable as it is; there is nothing to put away.
- Tax Master, restore: **no**. Nothing is archived, so nothing returns; a withdrawn scheduled row goes back to draft.
- Tax Master, reverse: **no**. A wrong row is fixed by publishing a correcting row, never by taking one back after it is live.
- Recurring Plan, archive: **no**. A plan is stopped, not archived; ended plans stay listed with their run history.
- Recurring Plan, restore: **no**. An ended plan does not restart; copy it into a new plan.
- Refund, schedule: **no**. A refund is recorded after the money has left; nothing is scheduled or retried.
- Refund, api: **later**. Read and write come with the public API.
- Refund, webhook: **later**. Refund events come with the public API.
- Share Link, delete: **no**. A link is never deleted; revoke stops it and keeps the view times for the history.
- Share Link, restore: **no**. A revoked link never returns; a new link with a new token is made instead.
- Share Link, reverse: **no**. A page already seen cannot be unseen; revoke stops new visits.
- Subscription, search: **no**. One row per firm; the billing page is not a list.
- Subscription, filter: **no**. One row per firm; the billing page is not a list.
- Subscription, sort: **no**. One row per firm; there is nothing to order.
- Subscription, saved view: **no**. One row per firm, so no views are kept.
- Subscription, columns: **no**. One row per firm, so no columns are chosen.
- Subscription, export: **no**. Plan history leaves with the full firm export, which works in read-only and after cancellation.
- Subscription, delete: **no**. A subscription is never deleted; cancelling ends renewal and the history of plans and payments stays.
- Subscription, archive: **no**. Nothing is hidden; cancelled is a state the billing page shows with the last paid day.
- Subscription, restore: **no**. Paying again returns the same subscription to active at once; nothing is restored from an archive.
- Subscription, duplicate: **no**. A plan is never copied between firms.
- Subscription, print pdf: **no**. The paper is our GST invoice for each period, made as a separate document and listed on the billing page.
- Subscription, comment: **no**. No thread; the optional cancel reason is stored once.
- Subscription, merge: **no**. One firm has one subscription; two are never joined.
- Subscription, api: **later**. Plan reads come with the public API.
- Subscription, webhook: **later**. Plan events come with the public API.
- Template, export: **later**. Templates leave only inside the full-firm export; copying them between firms is later.
- Template, delete: **no**. A template used by any issued document is never deleted; reset puts the default back instead.
- Template, archive: **no**. Reset replaces archive; old versions stay readable.
- Time Entry, archive: **no**. Nothing is archived; an open entry is deleted and a billed one is locked.
- Time Entry, restore: **no**. Nothing is archived, so nothing is restored; a deleted row is gone after its confirm.
- signin: **later**. phone code sign-in waits for a registered SMS sender and templates plus SIM-swap rules
- accounting: **later**. GSTR-1 JSON file in wave 2; wave 1 gives registers, summaries and an error list (the owner may move it to wave 1, question Q4)

## Ten random "no" answers

- History Entry, group: The log is read as a time line, not in groups.
- Export Job, merge: Runs are not merged.
- Number Series, restore: A closed financial year is not reopened; the next year has its own series.
- Import Job, assign: It belongs to the person who started it.
- Import Job, merge: Runs are not merged.
- History Entry, edit: Nobody edits a row, owner and product staff included; a wrong entry is answered by a new row.
- History Entry, saved view: One log with four filters needs no saved views.
- History Entry, delete: No role or path removes a row, and no plan, closure or inactivity rule purges one inside 8 years.
- Number Series, assign: A setting belongs to the account, not a person.
- History Entry, columns: The columns are fixed and short.

## Unusual objects

- History Entry: the append-only record of every create, edit, issue, void, payment, reversal, sign-in and export

## Risks to test before building

- Small service firms will leave Excel, Vyapar or free Zoho Invoice and pay Rs 499 a month for a GST invoice tool Test: put a priced fake-door page on a landing page and talk to 10 firm owners; count who gives a card or a firm yes (open)
- A UPI QR plus I-have-paid claims, with money recorded by hand, gets firms paid faster without a gateway Test: five firms use only QR for 30 days; compare days to payment with their last quarter (open)
- Owners will record payments themselves without a bank statement match Test: watch five firms for two weeks; count paid invoices that have a recorded payment against what the bank shows (open)
- Accountants accept registers, summaries and Tally XML without a GSTR-1 JSON file Test: show the month-end pack to 8 chartered accountants and ask which tool they would import it into (open)
- Per-line half-up rounding and the odd-paisa CGST plus SGST rule match what accountants' filing tools compute to the paisa Test: run 200 invoices of all rates through the portal's offline tool and a CA's software and diff every paisa (open)
- The fixed number format PREFIX/YY-YY/NNNNN is acceptable to most firms Test: ask 20 firms for their current invoice number and count how many it fits or can be mapped to (open)
- Ten free invoices a month is enough to hook a firm and tight enough to convert Test: ask 15 firms how many invoices they issue a month and find the median (open)
- Invoices sent from our domain reach the inbox at Gmail, Outlook, Zoho and Yahoo Test: send 100 seeded invoices with SPF, DKIM and DMARC and count spam placements (open)
- Chartered accountants will invite their clients because the accountant seat is free Test: offer the free seat to 10 CAs and count client firms invited in 30 days (open)
- Most firms are below Rs 5 crore so a fake e-invoice adapter is enough before launch Test: ask the 10 design-partner firms for their aggregate turnover band before the build (open)
- The 2025-Act section numbers, Form 131 and 168 names and the 1 November 2026 credit note change are right as printed Test: give the rule table to a chartered accountant for one hour before the build (open)
- One GSTIN, one bank account and one business per plan fits most firms of 1 to 20 people Test: ask 20 firms how many GSTINs and bank accounts they invoice from (open)
- Reminders at 1, 7 and 15 days after due date, one per customer, do not annoy payers or the firm Test: run them for 5 firms for a month and count complaints and payments within 3 days (open)
- A customer's UPI app can pay the full balance of a typical invoice, so the QR works above Rs 1 lakh Test: pay test amounts of Rs 1,00,001 and Rs 2,00,000 from three UPI apps to a business ID (open)
- Owners and accountants accept 24-hour delay on bank and UPI changes and a Waiting for IRN state without calling support Test: watch five design-partner firms for a month; count support tickets that mention a bank change or an unsent invoice (open)
- Money recorded on account with its real receipt date and a 'tax due in the receipt month' flag is enough for firms that take advances, before the receipt voucher exists Test: give the flag and the register line to 5 coaching or agency firms and ask their accountant to file one month from it (open)
