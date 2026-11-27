# Invoices for Indian service firms: masters

One module of the PRD. The front book is ../PRD.md.

### Customer

| Can do | How |
|---|---|
| create | Form plus inline create from inside other forms, such as a new customer while making an invoice. |
| edit | Always editable. Issued documents keep the values they were issued with, never the new ones. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | One box finds by name, email, phone, code or id; an exact id jumps to the record. |
| filter | Status, tag, owner, created date and one or two business facts such as city or stock. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| import | CSV with column mapping, error rows fixable in place, and a match key to avoid duplicates. |
| export | CSV of the filtered list; large exports are emailed rather than downloaded. |
| delete | Only when the customer has no invoice, quote, payment or credit row; the screen then asks to confirm, the delete leaves one history row, and there is no trash. Otherwise it names what blocks it and offers archive. |
| archive | Hidden from pickers and default lists but still on old documents and searchable. |
| restore | Archived customers come back with one tap. A deleted customer does not come back. Restore is refused while another active customer holds the same GSTIN. |
| print pdf | A customer statement: pick customer and period, see opening balance, invoices, credit notes and payments with a running balance, then print or email it. |
| share link | No separate statement link: the customer's statement is a page inside the password-protected client page (track portal), with a PDF, for a period the client picks. |
| comment | Internal notes on the timeline, never visible to the customer. |
| history | Who changed which field, from what, to what, and when. |
| link related | Shows its documents, payments and tickets with totals, each one opening in place. |

**room:** draft; version

**later:** group; assign; approve; attach (Agreements and KYC files wait for the file feature; a note field holds a reference until then.); follow; remind; merge (Two customers can be joined once the money rules for moving payments and credit are designed; until then a possible duplicate only shows a warning with a link to the other one.); notify; api (Read and write by id or external reference waits for the API build; events for customers follow it.); webhook (Customer created, updated and archived events come with the API.)

**no:** saved view (The list has the views All, With balance and Archived as fixed filters; named saved views are not offered.); columns (Columns are fixed: name, GSTIN, state, outstanding, oldest due.); bulk (Bulk change of customers is rare; archive and edit happen one at a time. Import covers many rows.); duplicate (A copy would carry a GSTIN that must stay unique, and copying a customer is minor next to adding one with only a name.); reverse; preview; tag (No tags in wave 1; search by name, GSTIN, phone and email is enough.); schedule; custom fields (Fixed fields cover launch; the brief has no custom objects.)

| Question | Answer |
|---|---|
| identity | One GSTIN belongs to one active customer in a firm; another firm may use it. A customer without a GSTIN is matched on name with state or on phone: the form shows a warning with a link to the existing one but does not block. Import matches on GSTIN, else email, else name plus pincode. |
| snapshot | At issue these are copied onto the document: name, billing address, state, GSTIN, PAN, tax type and currency. Edits change drafts and future invoices only; issued invoices and credit notes keep the old copy. |
| remove | Any invoice, quote, payment or credit row blocks delete and the screen says which. Archive takes its place. A customer with none can be deleted after a confirm. |
| owner | The firm owns it and users reach only their own firm's customers. Owner, accountant and staff create and edit it, viewer reads. Staff and viewer do not see the outstanding and oldest-due columns. A client never sees the record; after signing in to the client page with the customer's password the client sees only that customer's own documents, payments with receipts, quotes and statement. |
| contacts | Wave 1 holds one billing address, one email, one phone and one GSTIN per customer. Several addresses, contacts and GSTINs are room, with the schema ready. A contact can be erased on request; name, email and phone go and the financial records stay. |
| code | No short code in wave 1. Customers are told apart by name with GSTIN and state. A code is room and would be unique per firm. |
| inactive | Archived customers leave the picker and the default list, and every old document stays readable. A draft already open can still be issued with a notice. A recurring run skips them with a logged reason. Their GSTIN is free for a new customer. |

**States, lifecycle:** active (start), archived

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| put_away | active | archived | owner, accountant |  | leaves the picker and default list; recurring runs for it skip with a logged reason; its GSTIN may be used by another customer | bring_back | none |
| bring_back | archived | active | owner, accountant | no other active customer in the firm holds the same GSTIN | returns to the picker and lists | put_away | none |

**States, portal:** off (start), on, locked, expired

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| open_portal | off | on | owner, accountant | a password of 10 to 64 characters is typed or made by Make one for me; the customer has an email or a phone to send the link to | a client-page token of at least 128 bits is made, the password is stored as a hash only, the link is good for 90 days; the page opens at /c/ and the token | close_portal | none |
| set_password | on, locked, expired | on | owner, accountant | 10 to 64 characters; owner or accountant presses Make one for me or types it | the old hash is replaced, every open session ends, wrong-try count goes to 0, a locked page unlocks at once | set_password again | none |
| send_portal_link | on, expired | on | owner, accountant, staff | an email or phone is on the customer; the page is on or expired | link sent by email or by WhatsApp click-to-chat with no password in it; an expired link is renewed for 90 days; Email the password sends the password in a separate email | close_portal | portal_link_sent, portal_password_sent |
| sign_in | on | on | client | the right password, page not locked or expired | a session starts that ends after 2 hours without a click or 24 hours in all; last sign-in time set, open count goes up; the client sees only this customer's documents | none: a visit cannot be undone, the client signs out | none |
| wrong_password | on | on | client | a wrong password; fewer than 5 wrong tries in the last 15 minutes | the try is counted and the page says Wrong password, then shows how many tries are left; the same words for any customer, so nothing is learned about other pages | sign_in with the right password | none |
| lock_portal | on | locked | system | the 5th wrong password inside 15 minutes | the page refuses every password for 30 minutes and says so with the time it opens again | unlock_portal | portal_locked_alert |
| unlock_portal | locked | on | system | 30 minutes have passed since the lock | tries count goes to 0 and the page takes passwords again | lock_portal | none |
| reset_password | on, locked | on | client | the link from Forgot password is used within 60 minutes and once; the new password is 10 to 64 characters | the new hash is stored, every open session ends, a lock is lifted; the same answer We sent a link is shown whether or not the email is on file | set_password by the firm | portal_reset_link |
| expire_portal | on | expired | system | 90 days have passed since the last send | the page says This link has expired and offers Send me a fresh link to the email on file; sessions end | send_portal_link | none |
| renew_portal | expired | on | client | the client presses Send me a fresh link; mail goes only to the email on file, once an hour | a fresh link is mailed and good for 90 days; the password is unchanged | expire_portal | portal_link_sent |
| close_portal | on, locked, expired | off | owner, accountant | none; also happens by itself when the customer is archived | every session ends at once, the page says This page is not available, the password hash is kept so turning it on again needs a new one; document links already sent keep working | open_portal | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| name | text | yes | 100 |  | owner, accountant and staff while no document is issued; later changes reach new documents only | Enter the customer's name, 1 to 100 letters. |
| type | choice | yes |  | business | owner and accountant; new documents only | Choose business or individual. |
| tax_type | choice | yes |  | unregistered | owner and accountant; new documents only | Choose registered, composition, SEZ, unregistered, overseas or UIN holder. It must agree with whether a GSTIN is given. |
| gstin | text |  | 15 |  | owner and accountant; new documents only | Invalid GSTIN. It has 15 characters, a correct check character and starts with the state's two-digit code. |
| billing_contacts | text |  | up to 3 emails, 120 characters each |  | owner, accountant and staff | Give up to 3 billing emails; mark one as accounts. |
| gstin_checked_on | date |  |  |  | owner and accountant, by hand | The date you checked the GSTIN on the portal, not in the future. |
| pan | text |  | 10 |  | owner and accountant; filled from the GSTIN when one is given | PAN has five letters, four digits, one letter, and must match the GSTIN. |
| state | choice | yes |  | the firm's state | owner and accountant; new documents only | Choose the state from the GST list. It decides the tax. |
| address_line1 | text |  | 150 |  | owner, accountant and staff | Address line 1 is 1 to 150 letters. It is needed once an invoice for this customer needs it. |
| address_line2 | text |  | 150 |  | owner, accountant and staff | Address line 2 is up to 150 letters. |
| city | text |  | 60 |  | owner, accountant and staff | City is 1 to 60 letters. |
| pincode | text |  | 6 |  | owner, accountant and staff | A pincode has exactly 6 digits and does not start with 0. If it does not fit the state you get a warning, not a block. |
| email | text |  | 120 |  | owner, accountant and staff | This email address does not look right. It can be up to 120 characters. |
| phone | text |  | 10 |  | owner, accountant and staff | Give a 10-digit mobile number starting with 6, 7, 8 or 9. A +91 or 0 in front is dropped. |
| terms_days | number |  | 90 |  | owner and accountant | Payment terms are a whole number of days from 0 to 90. Leave empty to use the firm's terms. |
| currency | choice | yes |  | INR | owner and accountant; locked once any invoice exists | The currency cannot change after the first invoice for this customer. |
| default_tax_treatment | choice |  |  | regular | owner and accountant | Choose regular, SEZ, export or unregistered. |
| default_tds_section | choice |  |  |  | owner and accountant | Choose a section from the TDS list, or leave it empty. |
| portal_password | text |  | 64 |  | owner and accountant, write only; never shown again, stored as a hash | The password is 10 to 64 characters. |
| portal_token | text |  | 43 |  | nobody |  |
| portal_link_expires_at | date |  |  |  | system, by a send |  |
| portal_failed_tries | number |  | 5 | 0 | nobody |  |
| portal_locked_until | date |  |  |  | nobody |  |
| portal_last_sign_in | date |  |  |  | nobody |  |
| portal_open_count | number |  | 1000000 | 0 | nobody |  |
| reminders_off | bool |  |  | false | owner, accountant; set automatically when the customer uses the opt-out link | Reminders to this customer are off. |
| notes | long_text |  | 1000 |  | owner, accountant and staff | Notes are up to 1000 characters and are never printed or shared. |
| outstanding | money |  | 99999999999 |  | nobody |  |
| oldest_due | date |  |  |  | nobody |  |
| has_balance | bool |  |  |  | nobody |  |

| List |  |
|---|---|
| search | name, gstin, phone, email |
| filters | lifecycle, portal, state, tax_type, has_balance |
| sorts | name, -created_at, -outstanding, oldest_due |
| default_sort | name |
| columns | name, gstin, state, outstanding, oldest_due |
| export | rows: filtered, all; what: customers; formats: CSV, XLSX; big: over 5,000 rows runs in the background and the link comes by email; it dies after 7 days |
| import | match: GSTIN, else email, else name plus pincode; one choice per file to update or skip a match; errors: nothing imports until the dry run is confirmed; bad rows download as CSV with row, field and reason; old state spellings map to the GST list; limit: 5 MB, 5,000 rows, UTF-8 or Windows-1252 |
| page | 25 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| by_name | lifecycle | name | tenant, lifecycle, name | 100 ms |
| by_portal | lifecycle, portal | name | tenant, lifecycle, portal, name | 100 ms |
| by_state | lifecycle, state | name | tenant, lifecycle, state, name | 100 ms |
| by_tax_type | lifecycle, tax_type | name | tenant, lifecycle, tax_type, name | 100 ms |
| newest | lifecycle | -created_at | tenant, lifecycle, created_at | 100 ms |
| owes_most | lifecycle, has_balance | -outstanding | tenant, lifecycle, has_balance, outstanding | 150 ms |
| oldest_due | lifecycle, has_balance | oldest_due | tenant, lifecycle, has_balance, oldest_due | 150 ms |
| by_gstin | gstin |  | tenant, gstin | 50 ms |

### Service Item

| Can do | How |
|---|---|
| create | Form plus inline create from inside other forms, such as a new customer while making an invoice. |
| edit | Always editable. Issued documents keep the values they were issued with, never the new ones. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | One box finds by name, email, phone, code or id; an exact id jumps to the record. |
| filter | Status, tag, owner, created date and one or two business facts such as city or stock. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| import | CSV with column mapping, error rows fixable in place, and a match key to avoid duplicates. |
| delete | Only an item no document line ever used; otherwise the screen says how many documents use it and offers archive, which hides it from the picker only. |
| archive | Hidden from pickers and default lists but still on old documents and searchable. |
| restore | Archived or deleted record returns with its links; deleted ones keep a fixed recovery window. |
| duplicate | Copies SAC, unit, rate, tax rate and description; the name must be changed because names are unique per firm. |
| history | Who changed which field, from what, to what, and when. |
| link related | Shows its documents, payments and tickets with totals, each one opening in place. |

**room:** draft; version

**later:** group; print pdf; assign; approve; attach (Files wait for the file feature.); follow; remind; custom fields (Fixed fields cover launch.); merge (Joining two items needs care about which rate wins; for now archive one.); notify; api (Item read and write come with the API.); webhook (Item events come with the API.)

**no:** saved view (Standard columns suffice for a short list.); columns (Fixed columns: name, SAC, unit, rate, tax rate, times used.); bulk (Bulk rate changes are rare; import can update many rows by name.); export (The full firm export carries items.); reverse; share link; preview; comment (The description field is the only text; no timeline notes on an item.); tag (No tags; search by name and SAC.); schedule

| Question | Answer |
|---|---|
| identity | The name is unique per firm, ignoring upper and lower case. A second item with the same name is refused and the form offers the existing one. |
| snapshot | Picking an item copies name, SAC, unit, rate, tax rate and description into the line. Later catalogue edits never change drafts or issued invoices. |
| remove | Any document line that used it blocks delete, with the number of documents named. Archive hides it from the picker only. |
| owner | The firm owns it. Owner and accountant create and edit items. Staff may use them and create one from a line. Viewer reads. |
| contacts | One SAC, one unit and one rate per item. Different rates per customer are later. |
| code | No separate item code. The unique name is what people search, and the SAC is the tax code, kept as text so leading zeros stay. |
| inactive | Archived items leave the picker and stay on old documents. They can be brought back. Drafts already holding the values are untouched. |

**States, lifecycle:** active (start), archived

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| put_away | active | archived | owner, accountant |  | hidden from the picker; old documents unchanged | bring_back | none |
| bring_back | archived | active | owner, accountant | no active item has the same name | returns to the picker | put_away | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| name | text | yes | 120 |  | owner and accountant | Enter a service name up to 120 letters. This name is already used by another item. |
| sac | text | yes | 8 |  | owner and accountant | Not a valid SAC. Use 4, 6 or 8 digits from the official list; search by words to find one. |
| unit | choice | yes |  | nos | owner and accountant | Choose a unit: hours, days, months, nos, sessions, or add one up to 20 characters. |
| rate | money | yes | 9999999.99 |  | owner and accountant | Rate is 0 to 99,99,999.99 with 2 decimals. |
| needs_review | choice | yes |  | no | system sets yes when staff create it; owner or accountant clears it | An owner or accountant must approve a service that staff created. |
| tax_rate | choice | yes |  | 18 | owner and accountant | Choose 0, 0.25, 3, 5, 18 or 40 percent. A rate that differs from the SAC's standard rate shows a warning. |
| tax_nature | choice | yes |  | taxable | owner and accountant | Choose taxable, nil-rated, exempt, non-GST or zero-rated. |
| description | long_text |  | 200 |  | owner and accountant | The description is up to 200 characters. |
| times_used | number |  | 1000000 |  | nobody |  |
| last_used | date |  |  |  | nobody |  |

| List |  |
|---|---|
| search | name, sac |
| filters | lifecycle, tax_rate, unit |
| sorts | name, -times_used, rate |
| default_sort | name |
| columns | name, sac, unit, rate, tax_rate, times_used |
| import | match: item name; errors: the dry run lists rows to create, update and skip; rows with a bad SAC or rate download as an error file; limit: 5 MB, 5,000 rows, UTF-8 or Windows-1252 |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| by_name | lifecycle | name | tenant, lifecycle, name | 100 ms |
| by_tax_rate | lifecycle, tax_rate | name | tenant, lifecycle, tax_rate, name | 100 ms |
| by_unit | lifecycle, unit | name | tenant, lifecycle, unit, name | 100 ms |
| most_used | lifecycle | -times_used | tenant, lifecycle, times_used | 100 ms |
| by_rate | lifecycle | rate | tenant, lifecycle, rate | 100 ms |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Setup guide | /setup | wizard | owner | Continue setup | home, firm_switcher, sign_up |  |  |  |
| Search | /search | list | owner, accountant, staff, viewer | Search | menu, home | Type a number, a name, a GSTIN or an amount. Spaces and slashes in a number are ignored. | Nothing matches. Check the spelling, or try only the last digits of the number. |  |
| Write an invoice | /invoices/new | form | owner, accountant, staff | Issue | invoices, home, invoice, customer, quote, recurring_plans, setup_guide, search |  |  | Invoice is issued and the number is taken. Send it now on WhatsApp or by email, or copy the link. |
| Write a quote | /quotes/new | form | owner, accountant, staff | Send quote | quotes, customer, quote |  |  | Quote is sent. You will see here when the customer opens it. |
| Customers | /customers | list | owner, accountant, staff, viewer | New customer | home, menu, search | No customers yet. Add one, or bring a list from Excel. | No customer matches. Try part of the name, the phone or the GSTIN. |  |
| Add or edit a customer | /customers/new | form | owner, accountant, staff | Save | customers, customer, invoice_form, setup_guide |  |  | Saved. You can invoice this customer now. |
| A customer | /customers/:id | detail | owner, accountant, staff, viewer | New invoice | customers, invoice, search, credit_register |  |  |  |
| Services | /services | list | owner, accountant, staff, viewer | New service | menu, invoice_form | No saved services. Save the ones you bill often, and each invoice line fills itself. | No service matches. Try part of the name or the SAC code. |  |
| Your page from the firm | /c/:token | public | client | Open my page | link |  |  |  |
| Your documents | /c/:token/home | public | client | Pay selected | client_sign_in, link | Nothing yet. Invoices and quotes from the firm will show here. | No document in this period. |  |
| Your statement | /c/:token/statement | public | client | Download PDF | client_page |  |  |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| portal_link_sent | customer.send_portal_link | client | email, whatsapp_link | {firm} made a page for you with your invoices, quotes, receipts and statement. Open {link} and sign in with the password {firm} gave you. The link works until {expiry}. The password is not in this message. |
| portal_password_sent | customer.send_portal_link | client | email | Your password for the page {firm} made for you is {password}. Keep it private. You can ask for a new one on the sign-in page with Forgot password. |
| portal_reset_link | customer.reset_password | client | email | Open {link} within 60 minutes to choose a new password for your page from {firm}. It works once. If you did not ask for this, ignore this mail; your password is unchanged. |
| portal_locked_alert | customer.lock_portal | owner, accountant | email, app | The page for {customer} was locked after 5 wrong passwords and opens again at {time}. If it was not them, press Set password on the customer to unlock it with a new password. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A041 | Customer statement: pick customer and period, see opening balance, invoices, payments and credit notes with running balance and the closing balance, then print or send. | now | customer.print_pdf |
| A042 | Bounced invoice email shows a banner on the invoice and customer asking for a corrected address; the old address is not retried. | now | customer.email |
| A050 | Customer holds tax type: registered, composition, SEZ, unregistered, overseas or UIN holder; it drives tax split, invoice title and register section. | now | customer.tax_type |
| A053 | Customer stores an optional PAN, pre-filled from GSTIN characters 3 to 12 and checked against it. | now | customer.pan |
| A056 | Each line stores tax nature: taxable, nil-rated, exempt, non-GST or zero-rated, so GST returns split them correctly. | now | item.tax_nature |
| A063 | Saved services catalogue holds name, SAC, rate, tax rate and unit; lines copy values so later catalogue edits do not change issued invoices. | now | item.snapshot, item.name |
| A112 | SAC field validates against the official code master and shows its description; unknown codes are refused, with a search-by-words picker. | now | item.sac |
| A158 | Customer archived while a draft for them is open; the draft can still be issued but a notice says the customer is archived. | now | customer.inactive |
| A175 | PAN must match five letters, four digits, one letter; the 4th letter must be a valid holder-type code such as C, P, F, H or T. | now | customer.pan |
| A181 | Pincode's first two digits are checked against the state; a mismatch is a warning, not a block. | now | customer.pincode |
| A182 | Phone accepts +91, 91 or 0 prefixes and spaces, then stores 10 digits. | now | customer.phone |
| A183 | Text fields are trimmed, inner whitespace is collapsed, and whitespace-only values count as empty; limits count characters, not bytes. | now | customer.name |
| A186 | Possible duplicate customer, same name and state or same phone, shows a warning with a link to the existing one, not a block. | now | customer.identity |
| A187 | HSN or SAC with leading zeros is kept as text everywhere; codes never lose zeros through import, export or JSON. | now | item.sac |
| A189 | Customer note and PDF text strip control characters but keep Hindi, Bengali, Tamil and other Indian scripts. | now | customer.name |
| A243 | Customer CSV import maps columns, shows a dry run with row errors, and imports nothing until the user confirms. | now | customer.import |
| A244 | Import error report downloads as CSV with row number, field and reason; fixing and re-uploading the file does not duplicate rows already added. | now | customer.import |
| A245 | Import detects duplicates by GSTIN and, for unregistered customers, by name and phone, then skips or updates by user choice. | now | customer.import |
| A246 | Import reads UTF-8 and Windows-1252 files and Excel date formats, cleans amounts with commas, rupee sign or spaces, and keeps leading zeros in pincode, phone and HSN. | now | customer.import |
| A247 | Import accepts CSV and XLSX up to 5 MB and 5,000 rows and tells the user to split larger files before it reads anything. | now | customer.import, item.import |
| A255 | DPDP erasure request on a customer contact removes name, email and phone from the contact but keeps financial records the law requires. | now | customer.contacts |
| B080 | A portal lets each customer see invoices, payments, credit notes and download a statement for any date range they choose. | now | customer.sign_in |
| B081 | The client page is switched on per customer, with one password for that customer; the owner or accountant turns it on or off for each customer, never for all customers at once. | now | customer.open_portal, customer.close_portal |
| B202 | A default tax treatment (regular, SEZ, export, unregistered) and a default TDS section can be set per customer so each new invoice and payment starts right. | now | customer.default_tax_treatment, customer.default_tds_section |
| B208 | Customer category registered, unregistered, SEZ or overseas is required and must agree with whether a GSTIN is present. | now | customer.tax_type |
| B209 | A customer carries its own invoicing currency set at creation and printed on the PDF; it cannot change once an invoice exists for them. | now | customer.currency |
| B210 | A customer record has a client-page state (off, on, locked, expired) and a GST treatment, including tax deductor, separate from its address. | now | customer.open_portal, customer.portal_token |
| B223 | Customer can opt out of reminder emails with a link; the opt-out is stored and shown on the customer. | now | customer.reminders_off |
| C011 | A new customer can be created inside the invoice picker with only a name typed; type defaults to business and state to the firm's state, and the rest stays optional unless the invoice needs it. | now | customer.create |
| C012 | Picking a customer prefills payment terms, place of supply and default tax treatment; last-used lines are wave 2. | now | customer.terms_days, customer.default_tax_treatment |
| C054 | The customer list shows the outstanding balance per customer in one view and sorts by outstanding and by oldest due date. | now | customer.outstanding, customer.oldest_due |
| D016 | A service item has name, SAC code, unit, default rate, default tax rate, description and active flag, with the name unique per firm ignoring case; picking an item copies its values into the line, and later catalogue edits never change drafts or issued invoices. | now | item.identity, item.snapshot |
| D017 | The invoice line item picker searches name and SAC by substring from 1 character, shows rate and tax, and lists recently used items first. | now | item.search |
| D018 | Creating a new item inline from a line asks only name, rate and SAC, saves it to the catalogue, and fills the line. | now | item.create |
| D021 | Units list holds hours, days, months, nos, sessions, and lets the owner add units up to 20 characters; unit prints beside quantity. | now | item.unit |
| D025 | Item CSV import matches on item name; shows rows to create, update and skip before running; bad SAC or rate rows download as an error file. | now | item.import |
| D026 | An item used on any document cannot be deleted; the screen says how many documents use it and offers archive, which hides it from the picker only. | now | item.remove, item.delete, item.put_away |
| D152 | When a line rate differs from the SAC's standard rate the form shows a visible warning that the invoice will go out with that rate. | now | item.tax_rate |
| D172 | A client opens the client page with the password the firm set or sent; no email code. The password is kept only as a hash, 10 to 64 characters; a forgotten password is reset by a one-hour link to the email on file. | now | customer.sign_in, customer.reset_password |
| D175 | Owner can revoke a portal user, or switch portal off for a customer; sessions end immediately. | now | customer.close_portal |
| D176 | Portal records "viewed" time on each invoice and shows it to the owner on the invoice timeline. | now | customer.sign_in, customer.portal_open_count |
| D177 | Client page sessions end after 2 hours without a click or 24 hours in all; the page never shows drafts, internal notes, tags or other customers. | now | customer.sign_in |
| D219 | State names and old spellings (Orissa, Pondicherry) map to the GST state list; unmapped values stop that row with the value shown. | now | customer.import |
| D326 | The client page shows a read-only statement for a period the client picks (opening balance, invoices, payments, credit notes, running and closing balance, open invoices) with a PDF; there is no separate statement link. | now | customer.print_pdf, customer.share_link |
| K168 | customer: notes, history | now | customer.notes, customer.history |
| W001 | A customer needs a name of 1 to 100 characters, a type (business or individual) and a billing state from the GST state list; saving without any is rejected with a field-level error. | now | customer.name, customer.type |
| W002 | A customer GSTIN, if given, must match the 15-character GST format and pass the standard check-character test; otherwise the save is rejected with the message "Invalid GSTIN". | now | customer.gstin |
| W003 | When a customer GSTIN is given, its first two digits must equal the GST code of the selected billing state, otherwise the save is rejected. | now | customer.gstin, customer.state |
| W004 | A GSTIN may belong to only one non-archived customer within a firm; a second customer with the same GSTIN is rejected, while another firm may use that GSTIN. | now | customer.identity |
| W005 | Billing address needs line 1 (1 to 150 characters), city (1 to 60 characters) and a pincode of exactly 6 digits not starting with 0; line 2 is optional. | now | customer.address_line1, customer.city, customer.pincode |
| W006 | Customer email, if given, must be a valid address of at most 120 characters, and phone, if given, must be a 10-digit Indian mobile number starting with 6, 7, 8 or 9. | now | customer.email, customer.phone |
| W007 | Default payment terms on a customer is a whole number of days from 0 to 90; when blank, the firm default terms apply to that customer's new invoices. | now | customer.terms_days |
| W008 | Editing a customer changes only drafts and future invoices; issued invoices and credit notes keep the name, address, GSTIN and state copied at the time of issue. | now | customer.snapshot |
| W009 | Owner or accountant can archive a customer; archived customers leave the invoice customer picker and the default list, keep all their documents, and can be restored. | now | customer.put_away, customer.inactive |
| W010 | Deleting a customer that has any invoice, payment or credit note is refused with a message to archive instead; a customer with none can be deleted after a confirm step. | now | customer.delete, customer.remove |
| W011 | Customer detail shows outstanding balance as the total balance due on that customer's issued and partially paid invoices, in rupees, with unused credit balance shown as a separate figure. | now | customer.outstanding |
| W012 | Customer detail has tabs listing that customer's invoices, payments and credit notes, newest first, 25 rows per page. | now | customer.link_related |
| W081 | Customer search matches name, GSTIN or phone by case-insensitive substring from 2 characters; archived customers appear only when "Show archived" is switched on. | now | customer.search |
| W201 | Owner or accountant turns the client page on for one customer by typing a password of 10 to 64 characters or pressing Make one for me (12 letters and digits, shown once); only a hash is kept, the page stays off until a password exists, and a wrong length says so in words. | now | customer.open_portal, customer.set_password, customer.portal_password |
| W202 | Send link goes by email or by WhatsApp click-to-chat with the client page link and no password in it; the password goes to the customer's email only if the firm presses Email the password, otherwise the firm tells it, and the link and the password never travel in one message. | now | customer.send_portal_link |
| W203 | Forgot password asks for the email on file and always answers We sent a link if that email is on file, so the page never shows whether an email exists; the link works once for 60 minutes, takes a new password of 10 to 64 characters and ends every open session. | now | customer.reset_password |
| W204 | Five wrong passwords within 15 minutes lock the client page for 30 minutes; the page says Too many tries, try again after the time shown or ask the firm for a new password, owners and accountants are mailed once per lock, and Set password by the firm unlocks it at once. | now | customer.wrong_password, customer.lock_portal, customer.unlock_portal |
| W205 | The client page link is good for 90 days from the last send; an older link shows This link has expired with a Send me a fresh link button that mails the email on file only, and sending or resending from the customer page renews it. | now | customer.expire_portal, customer.renew_portal, customer.send_portal_link |
| W207 | History records on the customer every client-page sign-in, wrong password, lock, unlock, reset, password set by the firm, turn on and off, document opened, quote accepted and declined with time, IP and device, never the password text; the customer page shows the last sign-in and the open count. | now | customer.portal_last_sign_in, customer.portal_open_count |
| W210 | Switching the client page off, or deactivating the customer, ends every session at once and the page says This page is not available; document links already sent keep working for their own documents. | now | customer.close_portal |
