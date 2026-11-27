# Invoices for Indian service firms: comms

One module of the PRD. The front book is ../PRD.md.

### Outbox Message

| Can do | How |
|---|---|
| create | Made by a send action on an issued invoice, credit note, quote, receipt, reminder or invite, and by the daily reminder job; nobody writes a row by hand. Draft documents cannot be sent. Extra To, Cc and Bcc addresses on a send are for owners and accountants only, and each user has a daily send cap and each unverified firm a lower one (R63); the customer's accounts address is the default recipient (R61). |
| view | A row opens the exact subject, body and attachment name that went out, with recipient, status, attempts, provider id and times. |
| search | Recipient email, customer name, subject and document number. |
| filter | Status, type (invoice, reminder, receipt, credit note, quote, invite, alert), customer and date. |
| sort | Newest first; nothing else is needed on a list read by recency. |
| bulk | Retry many failed rows or cancel many queued reminders; the rows that cannot change stay selected with the reason. |
| preview | The send dialog shows the real email with names, amounts and link filled before it is queued, and a template with a missing field cannot be saved. |
| attach | Always the stored PDF of the document, checked against its hash; nobody adds other files. |
| schedule | Reminders wait queued until 9 am to 7 pm IST; invoice and receipt mail goes at once. A person cannot pick a send time. |
| history | Each change of state with its time: queued, sent, delivered, bounced, complained, and the opened flag from the share link. |
| link related | Beside a row: the document, the customer, the share link it carried and the template version. |
| notify | A banner on the invoice and customer after a bounce, and an email to every owner after a spam complaint; neither can be muted. |

**later:** saved view (Built-in views (Failed, Bounced, Skipped, Reminders) come first; saved views wait until firms ask.); import; export (Rows leave only inside the full-firm export; a stand-alone outbox CSV waits for a request.); api (Reading the outbox by API waits with the API.); webhook (Delivery events to other software wait with the API.)

**no:** edit (A queued or sent row is never edited. A wrong address is fixed on the customer and sent again as a new row.); draft (The send dialog is the draft; a row exists only once queued.); group (One flat list; groups would hide failed rows among sent ones.); columns; delete (Rows are never deleted; delivery records stay for the life of the document and at least 8 years.); archive (Old rows stay in the list, found by date and filters.); restore (Nothing leaves the list, so nothing is restored; a bounced row stays and a corrected address makes a new row.); duplicate (Sending again is a new row made from the document, never a copy of an old row.); version (A row is a log line; it has one body forever.); reverse (A sent email cannot be recalled; the owner sends a correction. Revoking the link inside it is done on the share link.); print pdf (The attachment is already a PDF of the document; the row itself is not printed.); share link (Rows are never shown outside the firm; the link inside the mail is the share link object.); assign (No one owns a row; the sender job moves it.); approve (Staff send issued documents without a second look; issuing is the approval.); comment (Notes belong on the invoice and customer, not on the mail log.); tag (Type and status already label every row.); follow (Owners are told by alert on bounce and complaint, not by watching rows.); remind (The reminder is itself a message type; its rules sit on the invoice, not here.); custom fields (Fixed fields only; a mail log needs no extra columns.); merge (Rows are never joined; one consolidated reminder per customer is made when it is built.)

| Question | Answer |
|---|---|
| channel | Email through one provider, from a product address with the firm's name as sender and its verified address as Reply-To. WhatsApp is click-to-chat: a tap writes a row with channel whatsapp_link, marked sent when WhatsApp opens, never delivered or bounced. |
| identity | The recipient is the address on the row, checked for format and the firm's suppression list before queueing. Extra To, Cc and Bcc for one send never change the customer. |
| status | Queued, sent, delivered, failed, bounced, complained, skipped. A queued row that fails 5 times is failed; a hard bounce blocks the address for the firm; opened is a flag set by a visit to the share link. |
| visible | The customer sees only subject, body and the PDF. Internal notes and Bcc addresses are never in the body; the firm sees the whole row. |
| waiting | Nobody waits on a reply. The only clock is the sender job: a queued row older than 60 seconds shows as late, and a queued reminder waits for 9 am IST. |
| route | A customer's reply goes to the firm's Reply-To address, never to the product. Failed, bounced and skipped rows go to the owner's list of rows to fix. |
| edit | A sent row is never edited or deleted, and the customer cannot tell; a correction is a new row. A bounced row shows a banner asking for a corrected address and the old address is not retried. |
| close | There is no thread to close and no rating. The customer may stop reminders with a link in each one, which is stored on the customer; invoices and receipts still go. |

**States, conversation:** queued (start), sent, delivered, failed, bounced, complained, skipped (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| send | queued | sent | system | address passes format and suppression checks; reminders only inside 9 am to 7 pm IST | provider accepts it; provider id stored | none: a sent email cannot be recalled | none |
| deliver | sent | delivered | system | provider reports delivery | time stored | none: delivery is a fact | none |
| fail | queued | failed | system | provider refuses it or 5 attempts are used; test recipients ending @fail.test fail at once | reason shown on the row and in the outbox | retry | email_failed |
| retry | failed | queued | owner, accountant, system | the address is not suppressed | attempt count goes up; the same row is reused | none: it is queued again and may fail again | none |
| bounce | sent, delivered | bounced | system | provider reports a hard bounce | address blocked for the firm; banner on the invoice and customer; old address not retried | lift_bounce | email_bounced |
| complain | sent, delivered | complained | system | provider reports a spam complaint | all reminders to that address stop across the firm | lift_complaint | email_complaint |
| lift_bounce | bounced | bounced | owner | reason written; the customer's address was corrected or the customer asked again | address may be used again; the old row stays as it was | none: a new bounce blocks it again | none |
| lift_complaint | complained | complained | owner | reason written; the customer asked again to receive reminders | address may be used again; the old row stays as it was | none: a new bounce blocks it again | none |
| skip | queued | skipped | system, owner, accountant | no email on the customer, address blocked, reminders off or opted out, or the invoice is paid or void at send time | reason stored and listed for the owner to call the customer | none: send again after fixing the cause, as a new row | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| to_email | text | yes | 120 |  | nobody |  |
| extra_recipients | text |  | 500 |  | while the send dialog is open | Check the extra To, Cc or Bcc addresses; separate them with commas. |
| channel | choice | yes |  | email | nobody |  |
| type | choice | yes |  |  | nobody |  |
| reminder_step | choice |  |  |  | nobody |  |
| document | link |  |  |  | nobody |  |
| subject | text | yes | 250 |  | nobody |  |
| body | long_text | yes | 20000 |  | nobody |  |
| attachment_name | text |  | 120 |  | nobody |  |
| attempts | number | yes | 5 | 0 | nobody |  |
| provider_id | text |  | 120 |  | nobody |  |
| failure_reason | text |  | 300 |  | nobody |  |
| skip_reason | choice |  |  |  | nobody |  |
| unique_key | text | yes | 120 |  | nobody |  |
| opened | choice |  |  |  | nobody |  |
| block_lifted_at | date |  |  |  | owner only, with a reason | Write why this address may be used again. |

| List |  |
|---|---|
| search | to_email, customer, subject, document_number |
| filters | conversation, type, customer, created_at |
| sorts | -created_at |
| default_sort | -created_at |
| columns | created_at, to_email, type, document, conversation, attempts |
| views | All, Failed, Bounced, Skipped, Reminders |
| bulk | retry, skip |
| bulk_fail | Rows that cannot change stay selected with the reason beside each; the others go through. |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest |  | -created_at | tenant, created_at | 150 ms |
| by_state | conversation | -created_at | tenant, conversation, created_at | 150 ms |
| by_type | type | -created_at | tenant, type, created_at | 150 ms |
| one_customer | customer | -created_at | tenant, customer, created_at | 100 ms |
| of_document | document | -created_at | tenant, document, created_at | 100 ms |
| blocked_address | to_email, conversation | -created_at | tenant, to_email, conversation, created_at | 50 ms |

### Share Link

| Can do | How |
|---|---|
| create | Made on first send of an issued invoice, credit note or sent quote, and by Copy link or Send on WhatsApp; owner, accountant and staff may make one. A document has one active link at a time. |
| edit | Only the expiry day can change, 1 to 365 days from today, by owner or accountant. The token never changes. |
| view | Facts first: document, state, expiry, first and last time opened and the count; owner, accountant and staff also see the link text, a viewer does not. |
| preview | Owner sees the page as the customer will, signed in, and a visit by a signed-in member of the firm is not counted as opened. |
| history | Made, renewed, revoked and expired with who and when; opens are kept as first time, last time and a count only. |
| link related | Beside a link: its document, its customer and the mail rows that carried it. |

**later:** assign; approve; schedule; notify (An alert when a customer first opens it waits; the times show on the invoice now.); api (Creating links by API waits with the API.); webhook (Opened and revoked events for other software wait with the API.)

**no:** draft; search (Found from its document, never searched on its own.); filter (The only filter people ask for is opened-or-not, and that lives on the invoice list.); sort; group; saved view; columns; bulk; import; export; delete (A link is never deleted; revoke stops it and keeps the view times for the history.); archive; restore (A revoked link never returns; a new link with a new token is made instead.); duplicate; version; reverse (A page already seen cannot be unseen; revoke stops new visits.); print pdf; share link; comment; attach; tag; follow; remind (Sending or reminding renews an expired link by itself, so no expiry warning is needed.); custom fields; merge

| Question | Answer |
|---|---|
| secret | A random token of at least 128 bits, with no customer name, number or amount in the address; the page is not indexed and not cached by shared proxies. A link used with another firm's records returns 404 as any wrong token does. |
| scope | One document, read-only. The page shows balance due, a Pay with UPI button, a QR on desktop only while a balance is due, and the PDF; never the customer's other invoices and never internal notes. The customer's other documents, statement and quote answers live on the password-protected client page (customer track portal), not on a document link. |
| health | State is active, expired or revoked. A voided document shows 'This invoice was cancelled' with number and date only; a paid one says paid; a PDF not ready shows 'preparing' and retries by itself. |
| direction | Out. The one way in is the I have paid button, which writes a claim marked Pending check on the payment; the owner or accountant confirms it. The page never marks anything paid. |
| retry | Nothing is sent from here. A PDF that fails to render keeps the invoice issued and the page shows 'preparing' while the job retries. |
| gone | Deactivating a user keeps their links working, because they belong to the firm. A read-only or cancelled firm keeps them for at least 8 years. After firm deletion the page says it is no longer available. |
| limits | No plan limit on links. Page requests are throttled per address to stop token guessing, and a wrong token looks exactly like a missing page. |
| test | There is no sandbox. The owner previews the page signed in, which is never counted as a customer visit; test mail goes to the owner's own address. |
| card | A link shared on WhatsApp previews as a title card with firm name, amount and due date, not a bare address, and the card holds no more than the page does. |

**States, connection:** active (start), expired, revoked (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| view | active | active | client | a visit by someone not signed in to this firm | first and last viewed time set and count goes up; the message row gets the opened flag | none: a visit cannot be undone | none |
| extend | active | active | owner, accountant | new day is 1 to 365 days from today. an owner may also set never on a paid or void document | expiry day changes | extend again with another day | none |
| expire | active | expired | system | expiry day has passed in IST | page says the link has expired and gives the firm's contact | renew | none |
| renew | expired | active | owner, accountant, system, client | system renews it when a send or reminder carries the link. or the client asks for a fresh link on the expired page for any document, paid or not; the mail goes only to the address on file | same token, new expiry 30 days out unless another day is chosen | expire | none |
| revoke | active, expired | revoked | owner, accountant, staff | none | page says the sender withdrew the link, nothing about the document | none: make a new link with a new token | link_revoked |
| report_problem | active | active | client | a reason is chosen from wrong GSTIN, wrong amount, not ours or already paid; a text of up to 300 letters | a comment is written for owner and accountant, owners are emailed, reminders on that invoice stop for 7 days and the invoice shows In dispute | none: the owner clears In dispute when settled | client_reports_problem |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| token | text | yes | 43 |  | nobody |  |
| document | link | yes |  |  | nobody |  |
| document_type | choice | yes |  |  | nobody |  |
| expires_at | date | yes |  | today plus 30 days | owner and accountant, while active or expired | Choose a day between 1 and 365 days from today. |
| first_viewed_at | date |  |  |  | nobody |  |
| last_viewed_at | date |  |  |  | nobody |  |
| view_count | number | yes | 1000000 | 0 | nobody |  |
| revoked_reason | text |  | 200 |  | who revokes it, at that moment | The reason is longer than 200 letters. |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| by_token | token |  | looked up by the token alone through its unique index; the firm is read from the row, so tenant cannot lead | 20 ms |
| of_document | document | -created_at | tenant, document, created_at | 100 ms |
| to_expire | connection | expires_at | tenant, connection, expires_at | 100 ms |

### Template

| Can do | How |
|---|---|
| create | Every firm starts with the product's default for each document and email type; the owner makes a custom one by editing it. There is no blank template. |
| edit | Owner only. Logo, colour, footer, terms, signature, labels and email words change; the legal block (GSTIN, tax split, HSN or SAC, IRN and QR, document title) is locked. Saving makes a new version for new documents only. |
| draft | Changes stay in the editor with a live preview until Save; a template with a missing or unknown field cannot be saved and the field is named. |
| view | Editor beside a live preview that uses a sample invoice; the list shows type, style, version and last saved. |
| restore | Open an older version and save it as the newest version; documents already issued are not touched. |
| version | Every Save keeps a numbered version; the number is stored with each PDF and mail made from it, and two versions can be compared. |
| preview | Live preview with a sample invoice, in desktop and phone widths, using no invoice number; email templates preview with sample names and amounts. |
| assign | Author and optional reviewer; editor roles when more than one writer. |
| attach | Logo and signature, PNG or JPG up to 1 MB and 2000 pixels wide; others are refused with those limits stated. |
| tag | Categories and tags; reader-facing and used for filtering. |
| history | Who saved which version and when, and every reset. |
| link related | Beside a template: the number of documents and mails that used each version. |

**later:** group; saved view; columns; export (Templates leave only inside the full-firm export; copying them between firms is later.); duplicate (Copying wording from one type to another waits; one template per document type for now.); print pdf; follow; remind; api (Reading templates by API waits with the API.); webhook (Template events for other software wait with the API.)

**no:** search (A firm has about a dozen templates on one settings page, grouped by document type.); filter (Nothing to narrow on a dozen rows.); sort (Fixed order: documents, then emails.); bulk (Each template is edited alone because its words differ.); import (Templates are not imported; only a logo and signature picture are uploaded.); delete (A template used by any issued document is never deleted; reset puts the default back instead.); archive (Reset replaces archive; old versions stay readable.); reverse; share link (Preview exists only inside the signed-in app; no outsider sees a template.); approve (The owner is the only editor, so there is no review step.); comment (Wording changes are explained in the history, not in comments.); schedule (A saved template applies to the next document at once; there is no timed switch.); custom fields (Merge tags are the product's fixed list: customer name, number, amount due, due date, link.); merge; notify (Only the owner edits, so nobody else needs telling.)

| Question | Answer |
|---|---|
| states | Default is the product's copy and custom is the firm's edited copy. There is no draft or published split: Save applies to the next document. Only the owner saves; accountants, staff and viewers read. |
| address | A template has no address. It is named by document type and version, for example invoice v3, and old versions stay readable by the documents that used them. |
| search | Engines see nothing, because documents sit behind noindex links. A WhatsApp card shows firm name, amount and due date. |
| language | Template words are English in wave 1. Customer names and notes print in Indian scripts with the rupee sign. Amount in words follows the lakh and crore system and is our choice, not law. |
| author | No byline. The firm's legal name and address print as the supplier; the editor is recorded in history only. |
| media | Logo and signature are PNG or JPG, 1 MB, 2000 pixels wide, stored under the firm's folder. The PDF embeds them at issue; email uses a stable public address per version so old mail never shows a broken logo. |
| live | Editing changes a working copy until Save. A document being issued at that moment uses the version it read at issue, and that number is stored with its PDF and hash. |
| gone | A template is never deleted. After a reset the custom versions stay readable, issued PDFs stay as they were, and mail already sent is not changed. |
| titles | The title is chosen by the firm's tax scheme and cannot be edited: a firm with no GST registration prints a plain Invoice with no tax lines; Tax Invoice for a registered firm; Bill of Supply only for a registered composition firm or exempt supplies, with its GSTIN. When a firm registers, documents from the effective date use the tax invoice title and older ones stay plain. |
| legal wording | Export wording is locked text: under LUT it prints SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX with the recipient address, country of destination and the LUT number; an export with tax ends ON PAYMENT OF INTEGRATED TAX. A custom template cannot move or reword it. |

**States, publish:** default (start), custom

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| customise | default | custom | owner | all merge tags exist and the locked legal block is unchanged | version 2 is saved; new documents use it | reset | none |
| save_version | custom | custom | owner | all merge tags exist and the locked legal block is unchanged | next version number saved; documents issued after it use it | restore an older version and save it | none |
| reset | custom | default | owner | none | the product default applies to new documents; custom versions stay readable | customise again from the kept version | none |
| refresh_default | default | default | system | a law or layout change by the product | new default version for new documents only; a custom template shows a banner when the legal block changed | none: issued documents keep their version | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| doc_type | choice | yes |  |  | nobody |  |
| style | choice | yes |  | standard | owner | Choose plain, standard or modern. |
| accent_colour | text |  | 7 |  | owner | Use a colour like #1A5FB4. |
| footer | long_text |  | 300 |  | owner | The footer is longer than 300 letters. |
| terms | long_text |  | 1000 |  | owner; a different text per document type | Terms are longer than 1,000 letters. |
| logo | file |  | 1 MB, 2000 px wide, PNG or JPG |  | owner | Use a PNG or JPG up to 1 MB and 2000 pixels wide. |
| signature | file |  | 1 MB, 2000 px wide, PNG or JPG |  | owner | Use a PNG or JPG up to 1 MB and 2000 pixels wide. |
| subject | text |  | 250 |  | owner, email templates only | The subject uses a tag we do not know; remove it or pick one from the list. |
| body | long_text |  | 5000 |  | owner, email templates only | The email uses a tag we do not know; remove it or pick one from the list. |
| version | number | yes | 9999 | 1 | nobody |  |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| by_type | doc_type | -version | tenant, doc_type, version | 50 ms |
| of_firm |  | doc_type | tenant, doc_type | 50 ms |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Setup guide | /setup | wizard | owner | Continue setup | home, firm_switcher, sign_up |  |  |  |
| An invoice | /invoices/:id | detail | owner, accountant, staff, viewer | Record payment | invoices, search, customer, payments, payment, credit_note, outbox, einvoice_queue, history, link |  |  |  |
| A credit note | /credit-notes/:id | detail | owner, accountant, viewer | Send credit note | credit_notes, invoice, customer, search |  |  |  |
| A quote | /quotes/:id | detail | owner, accountant, staff, viewer | Convert to invoice | quotes, search, customer, link |  |  |  |
| A payment | /payments/:id | detail | owner, accountant | Send receipt | payments, invoice, customer, search |  |  |  |
| Sent mail and links | /outbox | list | owner, accountant, support | Retry failed | menu, invoice, support_console | Nothing sent yet. Every email and every link you share is listed here. | No message matches. Try Failed, Bounced or the customer name. |  |
| Invoice page for the customer | /d/:token | public | client | Pay with UPI | link |  |  |  |
| Your documents | /c/:token/home | public | client | Pay selected | client_sign_in, link | Nothing yet. Invoices and quotes from the firm will show here. | No document in this period. |  |
| Look of your documents | /settings/templates | list | owner, accountant | Edit look | settings, setup_guide | Your invoices use the standard look. Add a logo and colour to make them yours. | No template matches. Try Invoice, Credit note, Receipt or Email. |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| email_failed | message.fail | sender | app | The {type} mail to {customer} did not go out: {reason}. Open the outbox, fix the address and press Retry. |
| email_bounced | message.bounce | owner, accountant | email, app | {address} bounced. We stopped mailing it for {firm}. A banner shows on {customer} and invoice {number}. Fix the address, or an owner can lift the block with a reason. |
| email_complaint | message.complain | owner | email, app | {address} marked a mail from {firm} as spam. All reminders to it stopped. Only an owner can lift this block, and must give a reason. |
| link_revoked | share_link.revoke | owner | app | {actor} withdrew the link for {document}. Anyone who opens it sees that the sender withdrew it, and nothing about the document. |
| client_reports_problem | share_link.report_problem | owner, accountant | email, app | {customer} pressed Something is wrong on {number}: {reason}. {note} Reminders on this invoice are off for 7 days and it shows In dispute. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| SEC08 | Shared links carry long random tokens, expire, can be revoked, and show only what they were made for. | now | share_link.secret, share_link.scope |
| A005 | Deactivating a user ends all their sessions at once, not at next expiry; their next request returns 401. | now | share_link.gone |
| A010 | Share link visitors see only the one document it was made for, never the customer's other invoices; the customer's other documents and statement are on the customer's password-protected client page, never on a document link. | now | share_link.scope |
| A011 | Owner can revoke a pending invite; its link then shows 'invite expired'. Resend issues a new link and kills the old one. | now | message.type |
| A033 | Client can press Something is wrong on an invoice page; the invoice gets In dispute, reminders on it pause for 7 days and owners get an email. | now | share_link.report_problem |
| A040 | Cancelling the subscription turns the firm read-only after the paid period; invoices, payments, share links and exports stay reachable for as long as books must be kept (at least 8 years), and paying again restores full use at once. | now | share_link.gone |
| A042 | Bounced invoice email shows a banner on the invoice and customer asking for a corrected address; the old address is not retried. | now | message.bounce, message.notify |
| A043 | At issue the firm's legal name, address, GSTIN, bank block and logo are copied onto the invoice; later profile edits never change a reprint. | now | template.live |
| A065 | Message log stores channel, template id, provider message id, status and timestamps for every email sent. | now | message.history, message.provider_id |
| A067 | Generated PDFs and exports live under firm-scoped paths and are served through signed URLs that expire in 15 minutes. | now | template.media |
| A082 | An export under LUT prints exactly "SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX", recipient name and address, country of destination, and tax of zero on every line; the LUT number prints too, as our choice. | now | template.legal_wording |
| A083 | An export with tax charges IGST at the normal rate, prints the Rule 46 ending "ON PAYMENT OF INTEGRATED TAX" and the country of destination, and flags the invoice for refund tracking. | now | template.legal_wording |
| A132 | No tax line can appear on documents of an unregistered firm; when it registers it gives the GSTIN and an effective date, documents from that date use the tax invoice title, and older ones stay plain invoices. | now | template.titles |
| A141 | Email delivery states are queued, sent, delivered, bounced, complained; opened is a flag set by the share link visit. | now | message.status, message.deliver, share_link.view |
| A165 | PDF render fails or times out: the invoice stays issued, the share page shows 'preparing', and a retry runs automatically. | now | share_link.health, share_link.retry |
| A166 | Share link opened after the invoice is voided shows a plain 'This invoice was cancelled' page with number and date only. | now | share_link.health, share_link.gone |
| A189 | Customer note and PDF text strip control characters but keep Hindi, Bengali, Tamil and other Indian scripts. | now | template.language |
| A192 | Email send checks the recipient format and the suppression flag before queueing; blocked sends say which check failed. | now | message.identity, message.skip |
| A193 | Share link expiry chosen by the owner must be between 1 and 365 days; the default is 30. | now | share_link.expires_at, share_link.extend |
| A194 | Uploaded logo accepts PNG or JPG up to 1 MB and 2000 pixels wide; others are refused with the limits stated. | now | template.attach, template.logo, template.media |
| A195 | Invoice email subject reads 'Invoice <number> from <firm> for Rs <amount>, due <date>'; the body gives balance due, pay link, PDF and firm contact. | now | message.subject |
| A196 | Attached PDF file name replaces slashes with hyphens, for example INV-26-27-00001.pdf; no slash reaches a file name or URL path. | now | message.attachment_name |
| A197 | Email is sent from a product address with the firm's name as sender and the firm's email as Reply-To, used only after a verification email to that address is confirmed. | now | message.channel, message.route |
| A198 | The sending domain has SPF, DKIM and DMARC set before launch and a sample message is checked for all three. | now | message.channel |
| A199 | A hard bounce adds the address to a suppression list for that firm; later sends to it are blocked with the reason shown. | now | message.bounce, message.skip |
| A200 | A spam complaint stops all reminders to that address across the firm and tells the owner. | now | message.complain, message.notify |
| A201 | Customer reply to the email goes to the firm, not to the product. | now | message.route |
| A205 | Templates are shown in preview with sample values; a template with a missing field cannot be saved. | now | template.preview, template.save_version |
| A208 | Reminders send between 9 am and 7 pm IST only; ones queued outside the window wait until 9 am. | now | message.schedule |
| A209 | One consolidated reminder per customer lists all overdue invoices; a customer with three overdue invoices gets one message, not three. | now | message.unique_key |
| A210 | Reminder wording has three tones for day 1, 7 and 15; each shows balance due, not original total, and the pay link. | now | template.doc_type, message.reminder_step |
| A211 | Reminders can be switched off per customer and per invoice; an off switch shows on the invoice header. | now | message.skip |
| A212 | Before-due reminder, 3 days ahead, is optional per firm and off by default. | now | message.reminder_step |
| A213 | Payment receipt message goes automatically after a payment unless the box is unticked, and states amount, TDS, balance left and receipt number. | now | message.type |
| A216 | The share page shows invoice, balance due, a Pay with UPI button that opens the customer's UPI app with payee, balance and invoice number, a QR on desktop, and a PDF download; it stays usable after the due date, says plainly when the invoice is paid or voided, needs no login, carries no internal notes and stays light on slow phones. | now | share_link.scope, share_link.view |
| A217 | Amount in words follows the Indian system (lakh, crore) with paise, for example 'Twelve Lakh Rupees and Fifty Paise Only'. | now | template.language |
| A218 | PDF embeds fonts with the rupee glyph and Indian scripts; a customer name in Devanagari prints correctly. | now | template.language |
| A219 | A 50-line invoice paginates with repeated headers, no split rows, and the tax summary and totals on the last page. | now | template.style |
| A221 | Void invoices print with a diagonal CANCELLED mark and the void date; their number stays visible. | now | template.legal_wording |
| A226 | Jobs use a unique key per unit of work, such as invoice and reminder step, so re-running a job sends nothing twice. | now | message.unique_key |
| A227 | A reminder job that missed its day sends at most one catch-up message per invoice, never the whole backlog. | now | message.unique_key, message.schedule |
| A239 | PDF and e-invoice calls run as queued jobs with a retry limit of 5 and an owner-visible failed state, never inline in a user request. | now | message.fail, message.retry |
| B006 | Invoice list has a quick filter for invoices the customer has opened, separate from sent, partially paid and overdue. | now | share_link.first_viewed_at, message.opened |
| B010 | The send-email dialog accepts extra To, Cc and Bcc addresses for that one send without editing the customer record. | now | message.extra_recipients |
| B011 | A dry-run preview of an invoice shows final PDF, totals and number format without consuming an invoice number. | now | template.preview |
| B038 | One brand colour setting applies to emails, the shared invoice page and PDFs. | now | template.accent_colour |
| B042 | The template gallery offers three style families (plain, standard, modern), all passing GST rules; switching never changes a figure, and editing a template changes only documents issued afterwards, since issued documents keep the template they were first printed with. | now | template.style, template.live, template.version |
| B043 | Invoice, credit note, payment receipt and email each have their own template, each editable, with one marked default. | now | template.doc_type, template.customise |
| B045 | Email subject and body for invoice, receipt, credit note, quote and three reminders accept merge tags for number, amount and view link, with a live preview. | now | template.subject, template.body, template.preview |
| B052 | Manual reminders exist separately from automatic ones, with their own editable text for overdue and for sent-not-yet-due invoices. | now | message.reminder_step, message.bulk |
| B087 | Sharing an invoice from the phone to WhatsApp attaches a real, non-empty PDF or its share link; a blank file counts as a failure. | now | message.channel |
| B222 | Reminder email to a customer with no email address is skipped and listed on a screen for the owner to call. | now | message.skip |
| B223 | Customer can opt out of reminder emails with a link; the opt-out is stored and shown on the customer. | now | message.skip, message.lift_complaint |
| C019 | After Issue, the next screen offers Send on WhatsApp (opens WhatsApp with the customer's number and a message holding the share link), Send by email, Copy link and Download PDF, WhatsApp first. | now | message.channel, share_link.create |
| C022 | The invoice message in WhatsApp shows firm name, amount, due date and a link that previews a title card, not a raw URL. | now | share_link.card |
| C030 | A client who pays by UPI to the firm's plain UPI ID outside the page can tell the firm with an I have paid button carrying a reference number. | now | share_link.direction |
| C031 | The firm sees an I have paid claim as Pending check, not as paid, until the owner or accountant confirms it with one tap. | now | share_link.direction |
| C037 | After Save payment, the screen offers Send receipt on WhatsApp as the next action. | now | message.channel |
| C039 | A reminder on WhatsApp is one tap per client, opens WhatsApp with the text prefilled, and logs that a reminder was sent. | now | message.channel, message.reminder_step |
| C136 | Only an owner can change the firm's bank details or UPI ID, and every change emails all owners at once with the old and new last four digits. | now | message.type |
| C139 | Reversing a payment, voiding an invoice or issuing a credit note over Rs 10,000 emails all owners at once with the actor and amount. | now | message.type |
| C182 | Customer names, notes and lines are stored as plain text and shown escaped; a name containing HTML or script tags never runs on any screen, PDF or email. | now | message.body |
| D073 | The invoice PDF and share page print a UPI QR with the firm's UPI ID, the balance due as amount and the invoice number in the note; the QR shows only while the balance due is above 0. | now | share_link.scope |
| D141 | Invoice template settings hold logo, accent colour, footer text, signature image and A4 paper, with a live preview using a sample invoice. | now | template.logo, template.accent_colour, template.footer, template.signature, template.preview |
| D146 | Terms and conditions text up to 1000 characters prints at the foot of invoices and quotes; a different text can be set per document type. | now | template.terms |
| D174 | Client can mark an invoice Disputed with a reason and message; the owner is notified, reminders for that invoice pause, and status shows "Disputed" beside the invoice. | now | share_link.report_problem |
| D309 | Outbox filters by status, type (invoice, reminder, receipt, invite), customer and date; each row opens the exact body and attachments sent. | now | message.view, message.filter, message.type |
| D337 | At issue the PDF is rendered once and stored with its content hash and template version; reopening or resending later serves that file with the same layout, logo and wording, and its name is the document number with slashes replaced by hyphens. | now | template.version, template.live |
| D341 | The share page records the first and last time it was viewed and shows both on the invoice. | now | share_link.first_viewed_at, share_link.last_viewed_at |
| D379 | Email a credit note to the customer's contacts with PDF and share link; goes through the outbox like invoices. | now | message.type, share_link.create |
| K206 | A user who forgot the password asks for a reset link by email; the link comes through the outbox, expires in 1 hour and works once. | now | message.type |
| W032 | A firm with no GST registration issues a plain document titled "Invoice", with no tax lines, no HSN or SAC requirement and no tax columns. "Bill of Supply" is used only by a registered firm on the composition scheme or for exempt supplies, and shows its GSTIN. | now | template.titles |
| W044 | Owner or accountant can create a read-only share link for an issued invoice with a random token of at least 128 bits and no client name or amount in the address; it is not indexed by search engines or cached by shared proxies, expires after 30 days by default, can be revoked, and needs no login. | now | share_link.create, share_link.revoke, share_link.secret, share_link.expires_at |
| W086 | Emailing an issued invoice creates one outbox row with recipient, subject, body containing the share link, and status queued; draft invoices cannot be sent and the recipient email must be valid. | now | message.create |
| W087 | The outbox page lists rows newest first with status queued, sent or failed; the sender job marks queued rows sent or failed from the email provider's answer within 60 seconds, test recipients ending @fail.test fail, and Retry requeues failed rows. | now | message.send, message.retry, message.fail |
| W088 | A daily job at 09:00 IST queues reminders 1, 7 and 15 days after due date, at most 3 per invoice, none after paid or void and none for invoices with a pause; one message per customer lists all their overdue invoices. | now | message.schedule, message.reminder_step |
