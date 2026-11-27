# 01 - OSS commerce and billing: how the main object grew
Codes from 00-taxonomy.md. P/U/X = predictable / usage-only / outside change. MEASURED = read from code or API. INFERRED = my reading.
Method: migration lists via `gh api repos/O/R/git/trees/HEAD`, migration file dates via commit history (oldest commit per file), releases API, issues search sorted by reactions. Repo roots: IN=invoiceninja/invoiceninja, MED=medusajs/medusa, SAL=saleor/saleor, LAGO=getlago/lago-api (+ getlago/lago for issues).

## 0. Caveats that change how to read the timelines
- IN: all v5 tables are created in ONE migration (database/migrations/2014_10_13_000000_create_users_table.php, 1397 lines). Only post-launch additions show as separate files (318 migrations). v1 tag 2014-04-26, v2 2015-04-30, v3 2017-01-23, v4 2017-12-12, v5 tag 2020-04-02 (rewrite, Laravel) (MEASURED releases API).
- MED: v1 (TypeORM, 2021-2024) migrations are gone from the tree (0 files under packages/medusa/src/migrations). v2 Order module migrations start 2024-02-19; v2.0.0 on 2024-10-23. v1 history cannot be read from migrations.
- LAGO: migrations were squashed to `20250122112050_initial_migration` (db/migrate, 941 files total, mostly 2025-26). Pre-2025 history comes from release notes (v0.1.0-alpha 2022-05-31 to v1.57.0 2026-11-05, 210 releases).
- SAL: full history kept (order 291 migrations, product 260, checkout 117, payment 87, discount 111, invoice 11). Repo created 2013, Order 0001_initial 2015-07-14. Dates below from commit history of each file.

## 1. FULL DEPTH TODAY (counts)

| Product / object | Columns | States | Actions | Filters | Sorts | Settings | Webhook events | Source |
|---|---|---|---|---|---|---|---|---|
| IN Invoice | 58 at v5 launch (create table); fillable today 39 | 6 stored (draft, sent, partial, paid, cancelled, reversed) + 2 virtual (overdue -1, unpaid -2) | 14 single actions (auto_bill, clone_to_invoice, clone_to_quote, convert_to_purchase_order, history, delivery_note, mark_paid, mark_sent, download, restore, archive, delete, cancel, +email) | 12 filter methods (client_status, number, filter/search, status_id, upcoming, overdue, payable, date, due_date, private_notes, include, sort) | sort param free-form | CompanySettings has 248 properties (company-wide) | 65 webhook EVENT_ constants overall; 8 for invoice (create, update, delete, late, remind, archive, restore, sent) | app/Models/Invoice.php, database/migrations/2014_10_13..., InvoiceFilters.php, Webhook.php, CompanySettings.php |
| IN Bulk | - | - | 19 bulk actions (archive, restore, delete, email, send_email, mark_paid, mark_sent, download, bulk_download, bulk_print, template, cancel, auto_bill, clone_to_invoice, convert_to_purchase_order, set_payment_link, history, delivery_note) | - | - | - | - | app/Http/Requests/Invoice/BulkInvoiceRequest.php |
| IN Reports/export | - | - | 32 report routes (invoices, invoice_items, payments, clients, tasks, expenses, ar_detail, ar_summary, client_balance, tax_summary, tax_period, profitloss, user_sales...), throttled 20/min; CSV engine in app/Export | - | - | - | - | routes/api.php, app/Export |
| MED Order (v2) | order table 20 cols at birth; with item/summary/shipping/change tables: 15 tables in first migration (order, order_address, order_change, order_change_action, order_item, order_line_item, order_line_item_adjustment, order_line_item_tax_line, order_shipping, order_shipping_method (+adjustment, tax_line), order_summary, order_transaction, return_reason) | 6 (pending, completed, draft, archived, canceled, requires_action); Return 5; OrderChange 5; Claim types 2 | 24 admin route families under orders/draft-orders/order-edits/returns/exchanges/claims (~100 routes); orders/[id]: archive, cancel, complete, changes, credit-lines, fulfillments(+cancel, mark-as-delivered, shipments), line-items, payment-sessions/authorize, preview, shipping-options, transfer(+cancel, guest), export; 34 core workflows | list filters 4 active (region, sales_channel, created_at, updated_at); payment_status and fulfillment_status filters exist but are COMMENTED OUT | configurable columns + saved views (view config UI) | - | 23 order change action types (FULFILL_ITEM, DELIVER_ITEM, ITEM_ADD/REMOVE/UPDATE, RETURN_ITEM, RECEIVE_RETURN_ITEM, SHIPPING_*, WRITE_OFF_ITEM, TRANSFER_CUSTOMER, CREDIT_LINE_ADD, PROMOTION_ADD/REMOVE ...) | packages/modules/order/src/migrations/*, packages/core/utils/src/order/*, packages/medusa/src/api/admin/*, core-flows/src/order/workflows, admin/dashboard hooks/table/filters |
| SAL Order | 76 declared model fields | 9 (draft, unconfirmed, unfulfilled, partially_fulfilled, fulfilled, partially_returned, returned, canceled, expired) + authorize_status 3 + charge_status 4 + origin 4 + fulfillment 6 + granted-refund 4 | 36 order mutation files (draft create/update/complete/delete, fulfill, cancel, capture, void, refund, mark_as_paid, confirm, discount add/update/delete, line add/update/delete/discount, note add/update, update_shipping, grant_refund create/update, fulfillment approve/cancel/refund/return/update_tracking) + bulk: cancel, create, draft delete | ~30 distinct filter fields (status, authorize/charge status, user_email, checkout_token, gift card used/bought, voucher_code, has_invoices, has_fulfillments, lines_count, total_gross/net, product_type_id, addresses, events, transactions, click_and_collect, channel...) | 9 sorters (number, rank, created_at, last_modified, customer, payment, fulfillment_status, status) | per-channel settings | ~18 order events + fulfillment/invoice/draft events; 168 webhook event types overall | 68 order event types (OrderEvents enum) | saleor/order/{__init__,models}.py, saleor/graphql/order/*, saleor/webhook/event_types.py |
| LAGO Invoice | 56 columns | 9 statuses (draft 0, finalized 1, voided 2, generating 3, failed 4, open 5, closed 6, pending 7, deleted 8) + payment_status 3 + tax_status 3 + 7 invoice types (subscription, add_on, credit, one_off, advance_charges, progressive_billing, contract) | 15 REST actions: create, update, show, index, download_pdf, download_xml, refresh, finalize, void, destroy, lose_dispute, retry_payment, retry (tax), resend_email, payment_url, x402_payment_url, sync_salesforce_id, preview, regenerate | 19 index filters (amount range, billing entity, currency, customer, invoice_type, issuing date range, metadata, partially_paid, dispute_lost, overdue, payment_status, PO number, search_term, self_billed, settlements, status, subscription) | index cursor + overdue cursor + type cursor | org/billing-entity level (numbering, grace period, payment term, custom sections) | 13 invoice webhooks (created, drafted, generated, one_off_created, paid_credit_added, dispute_lost, payment_overdue, payment_status_updated, ready_to_finalize, resynced, voided, deleted, payment_failure) | app/models/invoice.rb, app/queries/invoices_query.rb, invoices_controller.rb, app/services/webhooks/invoices |
| LAGO Subscription | 36 columns | statuses in STATUSES enum; billing_time 2 (calendar, anniversary); on_termination_credit_note / on_termination_invoice enums | create, terminate, update, cancel pending, upgrade/downgrade (previous_subscription_id), usage threshold, lifetime usage | - | - | - | 8 subscription webhooks (started, terminated, updated, canceled, incomplete, trial_ended, termination_alert, usage_thresholds_reached) | app/models/subscription.rb |


## 2. TIMELINES (dates MEASURED unless marked)

### Invoice Ninja (Invoice, Payment, Client, Recurring) - v5 additions after launch
| Date | Item | Code | P/U/X |
|---|---|---|---|
| 2020-08-13 | reminder_sent fields on entity tables | E2 | P |
| 2021-07 to 10 | 12+ gateway drivers (payfast, paytrace, eway, mollie, square, gocardless, razorpay, ...) and 8 payment types (zelle, kbc, bancontact, ideal, direct debit, hosted page) | I6 / H1 | U |
| 2022-12-20 / 2023-03-17 | proforma invoice type (issue #93 opened 2014-04-15, shipped 2022) | A4 | P |
| 2023-03-21 / 03-24 | automated tax calculation for invoices, client exempt | H1 | X |

### Medusa (Order, v2 module)
| Date | Item | Code | P/U/X |
|---|---|---|---|
| 2024-02-19 | order, versioned items, change + change_action, summary, transaction, shipping, adjustments, tax lines, return_reason (15 tables, day one) | A7, A5, H1 | P |
| 2024-09-02 | is_custom_price, is_custom_amount | H1 | U |
| 2024-11-25 | order transfer request/accept | D2 | U |

### Saleor (Order)
| Date | Item | Code | P/U/X |
|---|---|---|---|
| 2019-08-14 | django-prices 2 (money split into net/gross amount fields) | H1 | U |
| 2020-03-05 | Invoice model on order (later deleted 0085, 2020) | C4 | P |
| 2020-11-17 | multichannel: order channel listing | D5 | U |
| 2022-03-25 to 04-05 | order id int to UUID, order number separate (0127-0144) | H3 | U |
Product variant: 0001 2015-06-08; stock allocation 2016-02-08 (0011); disable stock mgmt 2018-06-03; attributes rewrite "enterprise grade" 2019-08-05; variant channel listing 2020-11-17 (price moved off variant); quantity limit per customer 2021-12-07; tax class 2022-11-17; external_reference 2022-12-19; prior price for EU Omnibus 2025-01-31 (X, law).

### Lago (Invoice / Subscription) - from release notes
| Date | Item | Code | P/U/X |
|---|---|---|---|
| 2022-11-17..12-08 | grace period (draft invoices), invoice.status renamed to payment_status | A6 | U |
| 2023-05-10..07-06 | single vat_rate migrated to TaxRate, then multiple taxes | H1 | U |
| 2024-06-27..2024-12 | dunning (payment_overdue, campaigns, payment requests) | E2 | U |
| 2025-03-25..04-08 | billing entities (multi-entity), per-entity sequential ids | D5 | U |
| 2025-04-29..07-07 | organization_id added to 6 child tables then NOT NULL | I2 | U |

## 3. WHAT USERS ASKED FOR MOST (reactions, MEASURED via search/issues)
| Product | Top asks (issue#, reactions) | Codes |
|---|---|---|
| IN | OIDC for self-host #10839 (47); Revolut #1849 (24); custom PDF file name #7119 (21); LDAP #1768 (20); to/cc/bcc on send #1880 (20); bank reconciliation #2481 (18); Italy e-invoice #5102 (17); German compliance #1487 (14); proforma #93 (9); undo Viewed flag #7496 (10); optional items on quotes #2108 (12); client portal 2FA #8319 | D1, C4, E1, C3, H1, I6 |
| MED | multi-tenant #383 (31) and multiple stores #384 (17); multilanguage #2055 (10); product in many collections #1370 (11); export/import missing metadata #5864; (rest are bugs) | D5, H1, C2, C3 |
| SAL | multi-vendor #1251 (30); drop dashboard 1.0 #4463 (22); cash on delivery #1110 (12); multi-site #1068 (10); payment gateways as libraries #3422 (9); attribute input types #5036 (9); product in many categories #5350; CSV import/export #5174 | D5, I6, C3, C2 |
| LAGO | custom billing interval #58 (22); prepaid credits #29 (14); custom SQL aggregation #41 (12); price caps/minimums #78 (12); Stripe link #31 (11); Salesforce #34 (10); per-customer plan override #57 (8); PDF invoices #28 (7); credit note per invoice #59 (6); invoice dry run #52 (5); grace periods #99 (5) | H1, I6, A5, A6 |
Pattern: top asks are rarely screens. They are tenancy/identity (D5, D1), payment/accounting integrations (I6), tax/legal (H1, X), import/export (C2, C3).

## 4. ONE-WAY DOORS (early decision, painful later)
| Product | Decision | Evidence | Cost |
|---|---|---|---|
| SAL | Order primary key = integer id, exposed in URLs | migrations 0127_add_order_number_and_alter_order_token (2022-03-25) to 0144 (rewrite relations of gift cards, events, fulfillment lines, lines); PR "Migrate order id from int to UUID (#9324)" and "Fix failing order migrations (#9426)" | 18 migrations, 5+ data rewrites on every child table |
| SAL | Money as price_net / price_gross object | 0072_django_price_2 (2019-08-14), 0106_django_prices_2 in product | schema rewrite across order, product, checkout |
| SAL | Price on variant, single currency | 0133_product_variant_channel_listing (2020-11-17, "Multichannel MVP", #6242) moved price to listing; 0090_order_channel_listing | migration of every price + a major version (3.0) |
| MED | v1 Order computed at runtime, swaps, TypeORM | v2 rewrote Order as module with versioned items and change/action tables (15 tables on 2024-02-19); v2.0.0 2024-10-23. Swell blog says no automated v1 to v2 path (secondary source, INFERRED). Medusa 2.3.0 release adds data-migration scripts | full rewrite, v1 migrations deleted |
| LAGO | Single vat_rate on org/customer | v0.32 to v0.39 (2023-05-10 to 07-06): TaxRate model, migration from vat_rate, applied_tax tables for plan, charge, add_on, credit note, fee | 7 releases in 8 weeks |
| LAGO | invoice.status meant payment state | v0.17.0 2022-12-08 "Rename invoice#status to payment_status" after grace period added draft | public API rename |
| LAGO | Per-customer invoice sequence | v1.1.0 2024-03-26 per_organization numbering; 2025-03-25..04-08 billing entities with billing_entity_sequential_id; 6 "ensure ... sequential id" backfill migrations | numbering is legal data |
| LAGO | Tenant id only on parent | 2025-04-29..07-07: organization_id + FK + NOT NULL added to invoice_subscriptions, invoices_taxes, invoice_metadata, invoices_payment_requests, applied_invoice_custom_sections (3 steps each, 15+ migrations) | denormalization after the fact |
| IN | Tax as 3 name/rate pairs | initial schema (tax_name1-3); 2023-03-21 tax_data and 2024-07/08 tax_model_migration x2, 2024-12-18 enforce_tax_data_model | tax model migrated twice |

## 5. ACROSS THE FOUR
Tally basis: capability appears in the main object of that product (MEASURED where a file or route proves it, else INFERRED).

### Universal (all 4)
A1 edit (Lago late: edit draft only 2024-01, update API 2023-02), A2 delete/archive/void (soft delete), A4 status machine, A5 cancel/refund/credit (IN credit and refund 2023-10; Lago credit notes 2022-10; MED claims 2024-06; SAL granted refund 2023-03), A6 draft state, B2 filter, B4 pagination (Lago cursor indexes only 2026-11), C2 export (IN 32 reports; MED orders/export; SAL bulk + CSV; Lago exports tables), D1 permission, D5 tenant/channel/entity (all four added late and hard), E1 email/webhook notify, E4 activity log (SAL OrderEvent 2018, IN activities, MED order_change history, Lago finalized_at/events), H1 money/tax/currency (the biggest code in every product; 0 got it right first time), H6 metadata/custom fields (IN custom_value1-4, MED metadata jsonb, SAL metadata, Lago metadata), I6 public API + webhooks (IN 65 events, SAL 168, Lago 13+8 for these two objects, MED workflow events).
### In 3 of 4
A7 version/history (MED, IN history action, Lago version_number; SAL via events only), B1 search (IN filter, MED q, SAL search_vector 2021; Lago search only 2026-08), C3 import (IN, SAL bulk create 2023, MED CSV; Lago none for invoice), C4 PDF/share (IN, SAL via invoice app, Lago; MED none), D3 approval (SAL unconfirmed + approval fulfillments; IN quote approve; MED order change request/confirm), E2 reminders (IN reminders, Lago dunning, SAL none native; MED none), I3 retry (IN auto_bill_tries, Lago retry_payment, SAL transaction retries), A3 clone/template (IN clone_to_invoice, Lago regenerate; SAL reissue origin; MED draft convert).
### In 2
B5 saved view/columns (MED 2026, IN react columns), E3 preferences (MED 2026-08; IN), D2 assign (IN assigned_user_id; MED transfer), F-codes (not visible in migrations; skip).
### Order of arrival (stage = when it appears)
- Stage 1 launch (first 12 months): A4 states, A5 cancel/refund basics, A6 draft (Lago added at month 6), B2 filters, C4 PDF (IN, Lago), E1 email, H1 single currency + simple tax, I6 API + webhooks (Lago v0.3 had webhooks in month 1).
- Stage 2 daily use (year 1-2): A1 edit-after, A2 void/archive, E2 reminders/dunning, I3 auto retry, payment gateways, partial payments, discounts, E4 event log, B1 search, custom fields.
- Stage 3 teams/scale (year 2-4): D5 multi-entity/channel (SAL 2020-11, Lago 2025-03, IN locations 2025-02), D1 granular permission, D3 approval, I1 indexes (SAL 8 index migrations 2025; Lago 10 index migrations 2026; MED 10 indexes 2025-09), C3 import, A7 versions, bank/accounting sync, H3 id and numbering migrations.
- Stage 4 platform: I6 apps/extensions (SAL apps 2021+; Lago integrations), e-invoicing and tax compliance (X: IN 2023-26, Lago 2025-10, SAL Omnibus 2025-01), AI/agent endpoints (IN MCP #11843, Lago x402 2026-10).

### Counts by taxonomy code (late items in tables above, 4 products, N and K excluded)
H1 money/tax/currency: 38 (largest; 24 U, 7 X, 7 P) ; A5 undo/refund/cancel: 15 ; I1 index/perf: 14 ; I6 integrations/API: 14 ; A4 states: 10 ; D5 tenant/entity: 7 ; A1/A2/A6: 11 ; C3/C4: 9 ; E1-E5: 13 ; G5/H5/H6 config and fields: 15 ; H2/H3 idempotency/migration: 3 ; B1-B5: 5. Share: P about 18%, U about 72%, X about 10% (INFERRED; my coding of 190 rows). A careful PRD predicts state machine, soft delete, refund/credit, draft, filters, PDF and email; it cannot predict ledger-level money details (credit lines, granted refunds, prior price, settlements), numbering rules, or tenant scoping.

## 6. Unverified
- Exact v4 to v5 and Medusa v1 to v2 migration tooling (no migration docs fetched).
- Medusa v1 timeline (migrations deleted) and Medusa Product/Cart/Promotion depth (only migration file lists read: cart 13, product 21, promotion 17, payment 13 migrations).
- Invoice Ninja Payment/Client/Recurring depth is columns + constants only; client portal pages and UI-only list columns not counted.
- Counts of P/U/X are my coding, not from the products.
- Lago pre-2025 column history (squashed) and Saleor webhook events specific to order only partly counted.
