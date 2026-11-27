# Invoices for Indian service firms: core

One module of the PRD. The front book is ../PRD.md.

### Firm

| Can do | How |
|---|---|
| create | Sign-up makes the firm with legal name, state and optional GSTIN, then lands on a new invoice; the signer becomes owner. A CA adds more firms from the switcher. An accountant may also create a firm for a client from the switcher, work in it, and press Hand to owner (the 7-day ownership link) when set up; the creator becomes the accountant when the client accepts. A new GSTIN is always a new firm (R61), and one owner holds at most 3 firms on Free. |
| edit | Owner only. GSTIN, state and tax scheme are frozen once a document is issued, except the unregistered-to-registered switch with an effective date. A bank block or UPI ID change needs the password and the second step, takes effect after 24 hours and any owner can cancel it from the mail (R62). The lock date may be set only up to the last day of the previous month, never in the future. |
| view | Facts first, then linked documents with balance owed, then the activity timeline. |
| search | The firm switcher finds by firm name and GSTIN and lists the last 5 firms used first. |
| sort | Name, newest, and the one money or quantity field people rank by. |
| delete | Owner only, typed firm name, 30-day cooling period and a final export link. Books are kept at least 8 years (72 months after the annual return), then may be removed. |
| restore | An owner cancels closing at any time inside the 30 days; a paid plan restores a read-only firm at once. |
| version | Money-affecting settings keep dated values so old documents compute the same. |
| preview | Templates and tax rules show a sample result before saving. |
| schedule | A new value can start on a set date; old records keep the old one. |
| history | Who changed which field, from what, to what, and when. |
| link related | Shows its documents, payments and tickets with totals, each one opening in place. |
| notify | Every owner is emailed on bank or UPI change, lock date change, support access, large exports and closing. |
| api | Read, write and search by id and by your own external reference. |

**later:** filter (Not needed until a login holds far more than 30 firms.); group; saved view; columns; bulk; print pdf; assign; approve; follow; remind; webhook (Firm events go out with the API later.)

**no:** draft (A firm is not drafted. A missing profile field blocks issuing with a checklist that links to each field.); import (The profile is typed once at sign-up. Opening data comes through import_job, not through this object.); export (Firm data leaves through export_job (full export, month-end pack); the profile has no export of its own.); archive (A firm is not archived. Lapsed plans make it read only and a closing request starts the 30-day cooling period.); duplicate (Copying a firm would copy its GSTIN and number series; a new firm starts from sign-up.); reverse; share link; comment (Profile changes are read in history; there is no thread on a firm.); attach (The logo lives in the template; no other file is kept on the profile.); tag (A firm is one tenant, not a thing to label.); custom fields (The brief has no custom objects or fields.); merge (Two firms are never merged; GSTIN, series and books belong to each firm.)

| Question | Answer |
|---|---|
| identity | Same GSTIN means the same firm in the product, and a GSTIN already held by another firm is refused, and a GSTIN of a sealed firm may be used again; a changed GSTIN is a new firm (R61). A firm with no GSTIN has no such test, so duplicates are possible and are told apart by owner email. |
| snapshot | Legal name, address, GSTIN, bank block and logo are copied onto each invoice at issue; later profile edits never change a reprint. |
| remove | Deleting is blocked while the firm holds issued documents inside the 8-year keep window; closing runs 30 days, then the firm is sealed and its books are kept at least 8 years. |
| owner | Owners own the firm. The other roles see the profile read only, except viewers who do not see bank details. |
| contacts | One legal address, one bank block and one UPI ID in wave 1, with room in the schema for more. |
| code | No human code; the GSTIN and legal name identify it, and the id is internal. |
| inactive | Read only after a lapsed paid plan: nothing new is issued, existing documents, share links and exports keep working. Trial end moves to Free, never to read only. |
| scope | Every setting applies to the whole firm. A client or user setting never overrides it. |
| used | Issued documents keep what they were issued with. Defaults and bank block changes affect new drafts only. |
| default | Payment terms default 15 days, 0 to 90; a default customer note up to 500 characters; only an owner changes them. |
| effective | Profile changes apply at once. Registration, the lock date and e-invoice turnover carry their own dates. An unregistered firm issues a plain Invoice with no tax; from its registration date documents are tax invoices and older ones stay plain invoices. Bill of Supply is only for composition or exempt supplies. |
| order | Order does not matter on the profile. The firm switcher orders by last used. |
| who | Owner edits the profile. Owner or accountant may set the lock date; only an owner moves it back, with a reason. |
| limit | Name 120 letters, note 500, bank block 300; seats and invoices per month come from the plan. |

**States, lifecycle:** active (start), read_only, closing, deleted (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| go_read_only | active | read_only | system | a paid period lapsed after the 7-day grace; a trial end never does this | no new issued documents or master edits; payments, voids, credit notes, views, share links and exports stay open | restore_paid | firm_read_only |
| restore_paid | read_only | active | owner, system | paid plan active again | full use at once | go_read_only | none |
| start_closing | active, read_only | closing | owner | typed firm name matches; final export link made; password entered again. when the firm has two or more owners a second owner must confirm by mail within 24 hours | 30-day cooling period; the firm acts read only; renewal charges stop | cancel_closing | firm_closing_started |
| cancel_closing | closing | active | owner | inside 30 days | back to active; if the plan has lapsed it goes read only again | start_closing | firm_closing_cancelled |
| finish_closing | closing | deleted | system | 30 days passed and the final export link was sent | personal data not needed by law is removed; books stay sealed at least 8 years | none: the firm is sealed; the former owner may ask for an export of the kept books | firm_deleted_final |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| legal_name | text | yes | 120 |  | owner; before issue freely, after issue new documents only | Enter the firm's legal name, 1 to 120 letters. |
| gstin | text |  | 15 |  | owner; frozen after first issue except the registration switch | A GSTIN has 15 characters and starts with the state's code. |
| pan | text |  | 10 |  | owner; follows the GSTIN | The PAN must match characters 3 to 12 of the GSTIN. |
| state | choice | yes |  |  | owner; frozen after first issue | Choose the state from the GST list. It decides the tax. |
| address | long_text | yes | 300 |  | owner | Enter the firm's address, up to 300 letters. |
| tax_scheme | choice | yes |  | regular | owner; frozen after first issue except unregistered to registered | Choose regular, composition or unregistered. Unregistered firms issue a plain Invoice with no tax. |
| gst_effective_date | date |  |  |  | owner; once, when an unregistered firm registers | Give the date the GST registration started. |
| udyam | text |  | 19 |  | owner | A Udyam number looks like UDYAM-XX-00-0000000. |
| turnover_band | choice | yes |  | under_5cr | owner; a change is logged | Choose the turnover band: under 5 crore, 5 to 10 crore, 10 crore or more. |
| einvoice_on | flag |  |  | false | owner | Turn e-invoice on only when the firm must use it. |
| filing_mode | choice | yes |  | monthly | owner | Choose monthly or quarterly (QRMP) filing. |
| bank_name | text |  | 80 |  | owner only; every owner is emailed | Enter the bank's name, up to 80 letters. |
| bank_account | text |  | 18 |  | owner only; every owner is emailed | A bank account number has 9 to 18 digits. |
| ifsc | text |  | 11 |  | owner only; every owner is emailed | An IFSC has four letters, a zero, then six letters or digits. |
| swift | text |  | 11 |  | owner only | A SWIFT code has 8 or 11 characters. |
| upi_id | text |  | 100 |  | owner only; every owner is emailed | Enter a UPI ID such as name@bank. |
| default_terms_days | number |  | 90 | 15 | owner | Payment terms are 0 to 90 days. |
| default_customer_note | long_text |  | 500 |  | owner | The default note holds up to 500 letters. |
| lock_date | date |  |  |  | owner or accountant forward, up to the last day of the previous month; only an owner moves it back, with a reason | Moving the lock date back needs an owner and a reason of 5 to 200 letters. |
| annual_return_filed_on | date |  |  |  | owner or accountant; when set, it caps the date a credit note may carry | Give the date the annual return was filed, not a future date. |
| reply_to_email | text |  | 254 |  | owner; used only after the address is confirmed by email | This email does not look right. |
| mfa_required | flag |  |  | false | owner; users without a second step must enrol at next sign-in | Turn on two-step sign-in for everyone or leave it off. |
| support_access_until | date |  |  |  | owner grants; system ends it; max 7 days | Support access can last 1 to 7 days. |
| support_ticket | text |  | 40 |  | owner when granting | Give the support ticket number. |
| closing_started_at | date |  |  |  | system | Set by the system. |

| List |  |
|---|---|
| search | legal_name, gstin |
| sorts | last_used, legal_name |
| default_sort | last_used |
| columns | legal_name, gstin, role, plan |
| page | 50 |

### History Entry

| Can do | How |
|---|---|
| create | Only the system writes a row, in the same transaction as the change it records; no screen or API creates one. |
| view | Each document page shows its own rows; a firm log shows time, actor, action, record number and summary, newest first. |
| search | Find by record number such as INV/26-27/00012, which returns every row touching it, and by words in the summary. |
| filter | Narrow by actor, object type, action and date range. |
| sort | By time, newest first by default; oldest first on request. |
| export | Owner and accountant export the filtered log as CSV up to 50,000 rows and it is part of the full-firm export; the export writes its own row. |
| link related | Each row links to the record it touched and to the actor. |

**later:** api (Read-only history through an API comes with the API wave.)

**no:** edit (Nobody edits a row, owner and product staff included; a wrong entry is answered by a new row.); draft (A row is written once, whole.); group (The log is read as a time line, not in groups.); saved view (One log with four filters needs no saved views.); columns (The columns are fixed and short.); bulk (Nothing is done to many rows.); import (History cannot be brought in; migrated documents start a fresh trail.); delete (No role or path removes a row, and no plan, closure or inactivity rule purges one inside 8 years.); archive (Rows are not put away; they stay as written.); restore (Nothing is removed, so nothing is restored.); duplicate (A copied row would forge a record.); version (A row is never changed, so it has no versions.); reverse (A mistake is answered by a new row that points to the old one.); print pdf (The CSV export and the document page serve auditors.); share link (Outsiders never see history; support sees it only inside an owner grant.); preview (There is nothing to preview.); assign (Rows belong to the firm, not to a person.); approve (Nobody approves a record of what happened.); comment (Talk about a change on the document, not on the log.); attach (No files on a row.); tag (Rows are not labelled.); follow (Owners are told of key rows by email instead.); remind (Nothing is due on a row.); schedule (Rows are written when things happen, never later.); history (It is the history; it has no history of its own.); custom fields (The brief has no custom fields.); merge (Rows are never joined.); notify (A row does not notify; the move that wrote it does.); webhook (Events go out with the API later, from the same moves.)

| Question | Answer |
|---|---|
| what | A row of who did what to which record and when, with old and new values, IP, device and a support label. Owners and accountants read it; it proves a record was never quietly changed. |
| states | One state: written. It never changes, so it has no way out and none is needed. |
| remove | Nothing removes a row. Deleting a draft leaves a row; closing a firm keeps rows at least 8 years. Personal values are stored masked so erasure does not need an edit. |
| who | Owner and accountant read the whole log. Staff read rows of the documents they may open. Viewers see a document's rows without sign-in, role or export rows. Support sees it only inside an owner grant. |
| kind | Closest to a ledger: append-only with a clock and an actor. It differs because no row, move or role can change it. |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| ts | date | yes |  |  | never; set by the system | Set by the system. |
| actor | link |  |  |  | never; empty for system jobs | Set by the system. |
| actor_label | text | yes | 120 |  | never; the name as it was when written | Set by the system. |
| support_label | text |  | 60 |  | never; shows 'Support' and the ticket | Set by the system. |
| action | choice | yes |  |  | never | Set by the system. |
| object_type | text | yes | 40 |  | never | Set by the system. |
| object_id | text | yes | 40 |  | never | Set by the system. |
| record_number | text |  | 20 |  | never; a number such as INV/26-27/00012 | Set by the system. |
| summary | text | yes | 300 |  | never | Set by the system. |
| old_values | long_text |  | 20000 |  | never; personal and bank values stored masked | Set by the system. |
| new_values | long_text |  | 20000 |  | never; personal and bank values stored masked | Set by the system. |
| reason | text |  | 200 |  | never | Set by the system. |
| ip | text |  | 45 |  | never | Set by the system. |
| device | text |  | 200 |  | never | Set by the system. |

| List |  |
|---|---|
| search | record_number, summary |
| filters | actor, object_type, action, ts |
| sorts | ts |
| default_sort | -ts |
| columns | ts, actor_label, action, record_number, summary |
| export | rows: filtered, all; what: history; formats: CSV; big: over 5,000 rows runs as a background job and the link is emailed; it dies after 7 days |
| page | 50 |

| Query | Filters | Sort | Index | p95 |
|---|---|---|---|---|
| newest |  | -ts | tenant, ts | 150 ms |
| by_actor | actor | -ts | tenant, actor, ts | 150 ms |
| by_type | object_type | -ts | tenant, object_type, ts | 150 ms |
| by_action | action | -ts | tenant, action, ts | 150 ms |
| by_record | record_number | -ts | tenant, record_number, ts | 100 ms |
| one_document | object_type, object_id | -ts | tenant, object_type, object_id, ts | 100 ms |

### Invite

| Can do | How |
|---|---|
| create | Owner invites by email with a role of owner, accountant, staff or viewer. One live invite per email per firm: a new one replaces the old. An email already active in the firm is refused with its words. |
| view | Name, role, last active, access and, for a key, scope, created and last used. |
| search | Name and email; for keys, name and last four characters. |
| filter | Role, status (active, pending, disabled), team. |
| sort | Name, last active, role. |
| reverse | Revoke an invite or key at once; effect shows immediately. |
| schedule | Invite and key expiry dates; optional scheduled removal. |
| history | Role changes, sign-ins, key creation and use, kept for audit. |
| link related | Shows what the person owns, their teams and recent activity. |
| notify | Invite email, sign-in from new place, role change, key about to expire. |

**later:** group; bulk; import; export; preview; approve; tag; remind; custom fields; api (Invites through an API come with the API wave.); webhook

**no:** edit (A pending invite cannot be edited. Revoke it and send a new one, so the link and the role always agree.); draft; saved view; columns; delete; archive (Expired, revoked and accepted invites stay on the list with their status; nothing is put away.); restore (An expired or revoked invite is not revived; a new invite is sent.); duplicate; version; print pdf; share link (The link works for the invited email only; it is never public.); assign (The role is fixed on the invite when it is sent.); comment; attach; follow; merge

| Question | Answer |
|---|---|
| secret | The link holds a random token stored hashed. It is shown only in the email and never in the list. |
| scope | It grants one role in one firm, only to the invited email, only after the signed-in email matches and is confirmed. |
| expiry | 7 days. After that the link says the invite expired and an owner may send a new one. |
| last | An invite can make a second owner, so the last-owner rule stays safe; revoking an invite never touches the active owners. |
| leave | A revoked or expired invite leaves no access. If the person already had a login, only the membership that waited on the invite goes inactive. |
| proof | The person proves the email by opening the link and signing in as that same email; a different signed-in user is refused. |
| layers | Only an owner sends, resends or revokes. The page before accepting shows the firm name, role and who invited, and never names any other firm. |
| audit | Send, resend, accept, revoke and expiry are in the firm history with the actor. |

**States, access:** pending (start), accepted (end), expired (end), revoked (end)

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| accept | pending | accepted | owner, accountant, staff, viewer | signed in as the invited email, email confirmed, link not used, seat free (an accountant seat is free) | membership becomes active with the invited role; the firm shows in the switcher | none: an owner may deactivate the membership | invite_accepted |
| revoke | pending | revoked | owner | none | the link shows 'invite expired' or 'replaced' | send a new invite | none |
| resend | pending | revoked | owner | none | a new invite row and a new link are made; the old link says 'This invite was replaced' | none: the new invite stands | invite_sent |
| expire | pending | expired | system | 7 days passed | link dead; the waiting membership goes inactive | send a new invite | invite_expired_owner |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| email | text | yes | 254 |  | set when sent; never changed | Enter the person's email. This one does not look right. |
| role | choice | yes |  |  | set when sent; never changed | Choose owner, accountant, staff or viewer. |
| invited_by | link | yes |  |  | system | Set by the system. |
| token_hash | text | yes | 128 |  | system | Set by the system. |
| expires_at | date | yes |  |  | system; 7 days after sending | Set by the system. |
| accepted_at | date |  |  |  | system | Set by the system. |
| replaced_by | link |  |  |  | system | Set by the system. |

| List |  |
|---|---|
| search | email |
| filters | access, role |
| sorts | created_at, email |
| default_sort | created_at |
| columns | email, role, invited_by, status, created_at |
| page | 50 |

### Membership

| Can do | How |
|---|---|
| create | Made by sign-up (the first owner, active at once) or by sending an invite (waits as invited). No form makes a membership without an invite. |
| edit | Owner changes a role from the users page; it applies on the next request with no sign-out, and the person is told in the app and by email. Nobody changes their own role. |
| view | Name, role, last active, access and, for a key, scope, created and last used. |
| search | Name and email; for keys, name and last four characters. |
| filter | Role, status (active, pending, disabled), team. |
| sort | Name, last active, role. |
| archive | Disable sign-in while keeping history and owned work. |
| restore | Re-enable a disabled person with the role they had; revoked keys stay revoked. |
| assign | Role and team set per person; one person may hold several roles. |
| history | Role changes, sign-ins, key creation and use, kept for audit. |
| link related | Shows what the person owns, their teams and recent activity. |
| notify | Told on invite, role change, removal, return and ownership offer. |
| api | Manage people and keys by api; secrets are shown only once. |

**later:** draft; group; bulk; import; export; share link; preview (View as a role later; for now the users page lists what each of the four roles may do.); approve; tag; remind; custom fields; webhook

**no:** saved view; columns; delete (A membership is never deleted; deactivating keeps the name on history.); duplicate (A copied membership would copy access.); version (Role changes are read in history, not as versions.); reverse (A role change or removal is undone by changing the role or reactivating, not by a separate reverse.); print pdf; comment; attach; follow; schedule (No timed access in wave 1; only a support grant on the firm has an end date.); merge (Two logins are never merged; move drafts with reassign and deactivate one.)

| Question | Answer |
|---|---|
| secret | A membership holds no secret; its power comes from the login that signs in. |
| scope | One of owner, accountant, staff, viewer, fixed by the table; no custom roles. Accountant seats from the firm list come free, one per firm. |
| expiry | None once active. A support grant on the firm is the only timed access. |
| last | The last active owner cannot be demoted, deactivated or left behind; the message says to make another owner first. Several owners are allowed. |
| leave | Access ends on the very next request: it is checked against the membership record every time, with no delay. Drafts stay with the firm and can be reassigned in one step; the name stays on history; share links keep working. |
| proof | The membership relies on the login's proof; an owner may demand a second step for everyone. |
| layers | Firm first (another firm returns 404), then the role table (forbidden returns 403 with the missing permission named). |
| audit | Every invite, role change, removal, return and ownership move is in firm history with actor and old and new role. |
| used | Nothing is copied from a membership onto a document, only the person's name and id on history. |
| default | A new invite defaults to staff; the first owner is owner; the default is shown, never silent. |
| effective | A role change applies on the next request, never later and never on a future date. |
| order | The users page orders by name; owners first is a sort choice. |
| who | Only an owner invites, changes roles, removes or restores. Viewers do not see the user list. |
| limit | The seat count comes from the plan; reactivating or accepting over the limit is refused with how many to remove. One accountant seat per firm is free. |

**States, access:** invited (start), active, deactivated

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| activate | invited | active | system | its invite was accepted | the firm appears in the person's switcher | deactivate | invite_accepted |
| cancel_invited | invited | deactivated | owner, system | its last live invite was revoked or expired | no access; a later invite can wake it | reinvite | none |
| reinvite | deactivated | invited | owner | never accepted before | a new invite is sent | cancel_invited | invite_sent |
| change_role | active | active | owner | not your own, not the last active owner, seats allow. one owner may demote or remove another owner only after a 24-hour notice mailed to all owners that either can cancel; the owner count is checked inside the same transaction with a lock on the firm and the database refuses a state with no active owner | applies on the next request; an open page fails its next action with 403 and a notice | change it again | role_changed |
| deactivate | active | deactivated | owner | not yourself, not the last active owner. the owner picks who gets the person's open drafts in the same confirm; one owner removes another only after the 24-hour notice (change_role) | access ends on the next request; drafts stay with the firm. a pack address equal to the person's email is cleared and the owners are told; the offline copy on their phone is wiped at the next sign-in; history of their last 30 days is shown | reactivate | access_removed |
| leave | active | deactivated | accountant, staff, viewer | owners cannot leave; make another owner first. before the confirm the screen lists the drafts waiting, the unlocked months and any failed month-end pack of this firm | the firm drops from the switcher; the owner is told. that list is copied into the owner's notice; a pack address equal to the person's email is cleared | an owner sends a new invite | member_left |
| reactivate | deactivated | active | owner | was active before, and a seat is free | role returns as it was | deactivate | access_returned |
| offer_ownership | active | active | owner | the target is another active member | target is emailed a confirm link that lasts 7 days; nothing changes yet | the offer lapses or the target declines | owner_transfer_ask |
| accept_ownership | active | active | accountant, staff, viewer | offer is open and the link belongs to this login | this person becomes owner and the offering owner becomes accountant; both are logged | the new owner may offer it back | owner_transfer_done |
| decline_ownership | active | active | accountant, staff, viewer | offer is open | offer cleared; roles stay | the owner offers again | owner_transfer_declined |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| user | link | yes |  |  | system | Set by the system. |
| role | choice | yes |  |  | owner; not your own | Choose owner, accountant, staff or viewer. |
| invited_by | link |  |  |  | system | Set by the system. |
| may_issue | choice |  |  | no | owner | Choose yes or no; yes needs an amount cap per invoice. |
| issue_cap | money |  | 0 to 10 crore, 2 decimals |  | owner | Enter the highest total this person may issue. |
| accepted_at | date |  |  |  | system | Set by the system. |
| deactivated_at | date |  |  |  | system | Set by the system. |
| deactivated_by | link |  |  |  | system | Set by the system. |
| ownership_offer_from | link |  |  |  | system | Set by the system. |
| ownership_offer_expires | date |  |  |  | system; 7 days | Set by the system. |
| last_active_at | date |  |  |  | system | Set by the system. |

| List |  |
|---|---|
| search | name, email |
| filters | access, role |
| sorts | name, last_active_at, role |
| default_sort | name |
| columns | name, email, role, status, last_active_at |
| page | 50 |

### User

| Can do | How |
|---|---|
| create | Sign up with email and a password of 10 or more characters, or set one on an invite page. The person must be 18 or older. The email must be confirmed by a link before any invite can be accepted. |
| edit | A person edits their own name, password and second step. Email changes only after a link sent to the new address is opened; invites to the old address stay bound to it. Nobody edits their own role. |
| view | Name, role, last active, access and, for a key, scope, created and last used. |
| archive | Disable sign-in while keeping history and owned work. |
| restore | Re-enable a disabled person with the role they had; revoked keys stay revoked. |
| reverse | Support reopens a closed login on the person's request; old sessions stay ended and memberships need an owner to reactivate. |
| history | Role changes, sign-ins, key creation and use, kept for audit. |
| link related | Shows what the person owns, their teams and recent activity. |
| notify | Emails: sign-in from a new place, password reset link (1 hour, once), role changed, second step turned on. |

**later:** group; bulk; import; export; share link; preview; approve; tag; remind; custom fields; api (People and keys through an API come with the API wave.); webhook

**no:** draft; search (People are found through a firm's memberships; there is no search over all logins, because that would show who else uses the product.); filter (No list of logins exists outside a firm.); sort (No list of logins exists outside a firm.); saved view; columns; delete; duplicate; version; print pdf; assign (The role lives on the membership, one per firm.); comment; attach; follow; schedule (Sessions end after 8 hours idle and lockout lasts 15 minutes; nothing else is timed on the login.); merge

| Question | Answer |
|---|---|
| secret | The password is stored hashed and never shown; the second-step secret is shown once as a QR and saved only after one valid code is typed. |
| scope | A login has no power on its own. Each membership gives one role in one firm and every request is checked on the server. |
| expiry | Sessions end after 8 hours idle; the reset link lasts 1 hour and works once. An invite link lasts 7 days. |
| last | A login that is the only active owner of any firm cannot be closed or deactivated; the message names the firm and says transfer first. |
| leave | Sessions end at once, memberships end, the name stays on history, and drafts they made stay with the firm for an owner to reassign. |
| proof | Email and password, five wrong tries lock it for 15 minutes; an optional authenticator code becomes required when the owner turns it on for the firm. |
| layers | Two layers: firm membership first, then role. Another firm's record returns 404, a forbidden action in your own firm returns 403. |
| audit | Sign-ins, failed tries, password and second-step changes and role changes are logged with IP and device and kept at least 8 years. |

**States, access:** active (start), deactivated

| Action | From | To | Who | Only if | Also does | Undo | Tells |
|---|---|---|---|---|---|---|---|
| close_account | active | deactivated | owner, accountant, staff, viewer | not the only active owner of any firm; password typed again | all sessions end at once and every membership goes inactive | reopen | account_closed |
| deactivate | active | deactivated | support | not the only active owner of any firm; reason written. the person's proved email is given, the ticket number is written in history, and the move is offered only while an owner's grant is open | all sessions end at once; no firm data is opened to support by this | reopen | account_closed |
| reopen | deactivated | active | support | the person asked, proved by email | can sign in; no membership returns by itself | deactivate | none |
| reset_second_step | active | active | support | the person proved their email and the firm GSTIN, 48 hours have passed and every owner was mailed | the authenticator is cleared and the person sets it again; the recovery codes are new | none: the person enrols again | none |

| Field | Type | Required | Limit | Default | Who may change it | Message |
|---|---|---|---|---|---|---|
| email | text | yes | 254 |  | the person, after confirming the new address | This email does not look right. Use one you can open. |
| name | text | yes | 100 |  | the person | Enter your name, up to 100 letters. |
| password_hash | text | yes | 255 |  | the person; never shown | A password has at least 10 characters. |
| email_verified_at | date |  |  |  | system when the link is opened | Set by the system. |
| recovery_codes | text |  | 255 |  | system at enrolment; 8 one-time codes shown once | Set by the system. |
| totp_secret | text |  | 64 |  | the person; saved after one valid code | Type the code your authenticator shows. |
| failed_attempts | number |  | 5 | 0 | system | Set by the system. |
| locked_until | date |  |  |  | system | Set by the system. |
| last_active_at | date |  |  |  | system | Set by the system. |

## Screens of this module

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Create account | /sign-up | public | owner | Create account | link |  |  |  |
| Reset password | /reset-password | public | owner, accountant, staff, viewer, support | Send reset link | sign_in |  |  |  |
| Accept an invite | /invite/:token | public | owner, accountant, staff, viewer | Accept invite | link |  |  |  |
| Your firms | /firms | list | owner, accountant, staff, viewer | Open firm | menu, sign_in | You are not in any firm yet. Create yours, or open the invite link your accountant or boss sent. | No firm matches. Try part of the firm name or the GSTIN. |  |
| Setup guide | /setup | wizard | owner | Continue setup | home, firm_switcher, sign_up |  |  |  |
| Month end | /month-end | wizard | owner, accountant | Build month-end pack | menu, home, reports |  |  |  |
| History | /history | list | owner, accountant, support | Search history | menu, invoice, customer, payment, settings, support_console, link | No history yet. Every change to your books is written here from now on. | No entry matches. Try a name, an invoice number or a wider date range. |  |
| Firm profile, bank and reminders | /settings/firm | settings | owner, accountant | Save | settings, setup_guide |  |  |  |
| Tax, numbers and period lock | /settings/tax | settings | owner, accountant | Save | settings, month_end |  |  |  |
| People and roles | /settings/team | list | owner | Invite person | settings, setup_guide | Only you are in this firm. Invite your accountant or a colleague. | No person matches. Try the name or the email. |  |
| Security, support access and closing | /settings/security | settings | owner | Save | settings |  |  |  |
| My account | /account | settings | owner, accountant, staff, viewer | Save | menu |  |  |  |
| Support console | /support | list | support | Find a firm or user | menu | No open tickets. Search a firm or a login to start. | No firm or user matches. Check the ticket number and the owner's email. |  |

## Messages of this module

| Message | When | To | By | Words |
|---|---|---|---|---|
| firm_read_only | firm.go_read_only | owner | email, app | {firm} is read only from {date}. You can still view, record payments, void, issue credit notes, share links and export. New invoices and edits wait until the plan is paid. |
| firm_closing_started | firm.start_closing | owner | email, app | {actor} started closing {firm} on {date}. It stays read only for 30 days and you can cancel until {final_date}. A final export link is in your mail. |
| firm_closing_cancelled | firm.cancel_closing | owner | email, app | {actor} cancelled the closing of {firm}. The firm is active again{plan_note}. |
| firm_deleted_final | firm.finish_closing | owner | email | {firm} is closed. Personal data we do not need by law was removed. The books stay sealed for at least 8 years and a last export link is here: {link} |
| invite_sent | invite.resend | invitee | email | {inviter} invited you to join {firm} as {role}. Open the link within 7 days; it works only for this email. Any earlier invite from them is replaced. |
| invite_accepted | invite.accept | owner | email, app | {person} accepted the invite to {firm} as {role}. The firm now shows in their switcher. |
| invite_expired_owner | invite.expire | owner | email, app | The invite to {email} for {firm} ended after 7 days without an answer. Send a new one if they still need access. |
| role_changed | membership.change_role | person | email, app | {actor} changed your role in {firm} from {old_role} to {new_role}. It applies from your next click; what you already did is not changed. |
| access_removed | membership.deactivate | person | email | {actor} removed your access to {firm}. Your sessions there ended. The drafts you made stay with the firm. |
| member_left | membership.leave | owner | email, app | {person} left {firm} on {date}. Their drafts stay with the firm and their entries keep their name. |
| access_returned | membership.reactivate | person | email | {actor} gave you back your access to {firm} as {role}. Sign in to carry on. |
| owner_transfer_ask | membership.offer_ownership | target | email | {owner} asks you to become the owner of {firm}. Confirm with this link within 7 days. Nothing changes until you do, and then they become an accountant. |
| owner_transfer_done | membership.accept_ownership | owner, accountant | email, app | {new_owner} is now owner of {firm} and {old_owner} is now an accountant. Both changes are in the firm history. |
| owner_transfer_declined | membership.decline_ownership | owner | email, app | {person} did not accept ownership of {firm}. You are still the owner and nothing changed. |
| account_closed | user.close_account | user, owner | email | The login {email} was closed on {date}. Its sessions ended and its memberships went inactive. Books and drafts stay with each firm. To open it again, write to support. |

## Requirements that land here

| Id | Requirement | When | Where |
|---|---|---|---|
| A001 | A CA invited by several firms signs in once and switches firm from a header menu; the header always shows firm name and role. | now | firm.search |
| A004 | Owner can transfer ownership to another active user; the new owner confirms by emailed link, then the old owner becomes accountant. | now | membership.offer_ownership |
| A005 | Deactivating a user ends all their sessions at once, not at next expiry; their next request returns 401. | now | membership.deactivate |
| A006 | A role change applies on the user's next request without logout; a page already open fails its next action with 403. | now | membership.change_role |
| A007 | Any user can list their own active sessions with device and last-seen time and sign out any of them. | now | user.secret |
| A008 | A user cannot change their own role, deactivate themselves, or remove the last owner through any other route such as account deletion. | now | membership.last |
| A011 | Owner can revoke a pending invite; its link then shows 'invite expired'. Resend issues a new link and kills the old one. | now | invite.revoke, invite.resend |
| A012 | An invite link works only for the invited email; accepting it while signed in as another user is refused. | now | invite.proof |
| A013 | Product support staff enter a firm only through owner-approved, time-boxed access that is written to the firm's history with a support label. | now | firm.support_access_until |
| A015 | Owner can require TOTP two-step login for all users; users without it are forced to enrol at next login. | now | firm.mfa_required |
| A017 | Full firm data export is owner-only, and every owner gets an email notice when it runs. | now | firm.notify |
| A018 | Viewer cannot see internal notes, bank account numbers of the firm's own settings page, or the user list. | now | membership.who |
| A037 | Owner or accountant can lock a period up to a date and only an owner can move the date back, with a reason; no document with issue date on or before it can be created, edited, voided or reversed, and the error names the lock date. | now | firm.lock_date |
| A039 | Onboarding takes signup, firm name, state and optional GSTIN, then lands on a new invoice screen; a first invoice is issuable within five minutes and at most 12 taps on a phone. | now | firm.create |
| A040 | Cancelling the subscription turns the firm read-only after the paid period; invoices, payments, share links and exports stay reachable for as long as books must be kept (at least 8 years), and paying again restores full use at once. | now | firm.go_read_only, firm.restore_paid |
| A043 | At issue the firm's legal name, address, GSTIN, bank block and logo are copied onto the invoice; later profile edits never change a reprint. | now | firm.snapshot |
| A050 | Customer holds tax type: registered, composition, SEZ, unregistered, overseas or UIN holder; it drives tax split, invoice title and register section. | now | firm.turnover_band |
| A058 | Firm stores one bank account (bank name, account number, IFSC, optional SWIFT) and a UPI ID; each invoice prints them; several accounts are wave 2. | now | firm.bank_account |
| A068 | Books and history are kept at least 8 years and never purged by plan, trial or closure rules. | now | history_entry.remove |
| A069 | Audit history cannot be switched off by any role and has no edit or delete path in the interface or API. | now | history_entry.remove |
| A104 | E-invoice applies when the firm's turnover crossed Rs 5 crore in any year since 2017-18; the firm profile stores that flag. | now | firm.einvoice_on |
| A123 | Registers cut by tax period follow the firm's filing mode, monthly or QRMP quarterly, set in the profile. | now | firm.filing_mode |
| A132 | No tax line can appear on documents of an unregistered firm; when it registers it gives the GSTIN and an effective date, documents from that date use the tax invoice title, and older ones stay plain invoices. | now | firm.gst_effective_date |
| A163 | Trial or paid period ends while a user is typing: the save succeeds as a draft, then the firm turns read-only on next load. | now | firm.go_read_only |
| A164 | Firm has no GSTIN, state or address yet; issuing is blocked with a checklist of what to fill and a link to each field. | now | firm.create |
| A232 | Trial-end job moves the firm to the Free plan, never to a blocked state, and no job deletes any firm's books. | now | firm.inactive |
| A256 | Firm deletion is owner-only with typed firm name, a 30-day cooling period and a final export link; books are kept at least 8 years (GST law needs 72 months after the annual return), then may be removed. | now | firm.start_closing, firm.finish_closing |
| A257 | Departing user's access ends at once, their name stays on history, and drafts they own can be reassigned in one step. | now | membership.deactivate |
| B025 | Custom roles are not offered; the Users page says roles are fixed and lists exactly what each of the four roles (owner, accountant, staff, viewer) can do. | now | membership.scope |
| B104 | Every export and every PII-including backup is logged with user and time. | now | history_entry.export |
| B123 | Plans state their limits in users and issued invoices per firm; every paid plan includes one accountant seat that does not count as a user. | now | membership.limit |
| C136 | Only an owner can change the firm's bank details or UPI ID, and every change emails all owners at once with the old and new last four digits. | now | firm.bank_name |
| C210 | DPDP: data of under-18 users is not collected; the signup states the user must be 18 or older. | now | user.create |
| D186 | Firm profile also holds the PAN (derived from GSTIN characters 3 to 12, a mismatch is refused), the Udyam number and the tax scheme: regular, composition or unregistered. | now | firm.pan, firm.udyam, firm.tax_scheme |
| D198 | An invited email that already has a login attaches the firm to that login after sign-in, and no message ever reveals which other firms that person belongs to. | now | invite.leave |
| D199 | Invite page shows the firm name, role and inviter before the person sets a password. | now | invite.layers |
| D262 | The audit log lists time, actor, action, object, record number and summary, filterable by actor, object type, action and date range, searchable by record number such as INV/26-27/00012, newest first. | now | history_entry.search, history_entry.filter |
| D264 | Audit also records sign-ins, failed sign-ins, role changes, exports and permission-denied attempts, with IP address and device. | now | history_entry.view |
| D271 | Trial shows days left in a banner; at the end the firm moves to Free automatically, never to a blocked state. | now | firm.inactive |
| D273 | Downgrade is blocked when active users exceed the new plan's seats; the message names how many to deactivate. | now | membership.limit |
| D275 | A failed subscription payment gives a 7-day grace with a banner and emails on day 1, 3 and 6 before read-only mode; the firm can pay by UPI AutoPay, card or one-time UPI. | now | firm.go_read_only |
| K206 | A user who forgot the password asks for a reset link by email; the link comes through the outbox, expires in 1 hour and works once. | now | user.expiry |
| W016 | Due date defaults to issue date plus the customer's payment terms (else the firm default) in days, and cannot be earlier than the issue date. | now | firm.default_terms_days |
| W065 | A credit note issue date cannot be before the original invoice date, in the future, or after 30 November following the end of the original invoice's financial year; if the firm records that its annual return was filed earlier, that date is the limit. | now | firm.annual_return_filed_on |
| W070 | Firm profile needs a legal name of 1 to 120 characters, address and state, with an optional GSTIN validated as for customers and starting with the firm state's code; only an owner can edit it. | now | firm.legal_name, firm.edit |
| W072 | Firm defaults hold payment terms of 0 to 90 days (initially 15), a default customer note up to 500 characters and bank details up to 300 characters for printing. | now | firm.default_terms_days, firm.default_customer_note |
| W073 | Owner can invite a user by email with role owner, accountant, staff or viewer; one login can belong to several firms with one role in each, email is unique system-wide per login, and the invite link expires in 7 days and works only for the invited email. | now | invite.accept, user.create |
| W074 | An owner can change a user's role, deactivate them or reactivate them, but the last active owner of a firm cannot be demoted or deactivated. | now | membership.change_role, membership.deactivate, membership.reactivate |
| W075 | A viewer can only view, search and print; staff create and edit drafts only; an accountant can do everything except edit firm settings, manage users, void invoices or credit notes and reverse payments; forbidden actions return 403. | now | membership.edit |
| W076 | Login uses email and a password of at least 10 characters stored hashed; 5 failed attempts within 15 minutes lock the account for 15 minutes, and a session ends after 8 hours idle. | now | user.proof, user.expiry |
| W077 | Every record belongs to one firm and users reach only their own firm's data; requesting another firm's record by ID, in lists, search, export or share link, returns 404, and the firm scope is enforced in the data layer with an automated test that tries one firm's token on other firms' IDs. | now | firm.scope |
| W089 | History is append-only: each create, edit, issue, void, payment, reversal, credit note, e-invoice attempt and role change stores actor, time and old and new values, and shows on the document's page. | now | history_entry.create |
