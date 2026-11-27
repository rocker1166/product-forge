# 10. Shopify, Salesforce, ERPNext, India invoice: primary sources

Done 2026-11-25, read-only. Codes per 00-taxonomy.md. **D** = I read page, schema or code. **D(a)** = web-fetch agent read it. **S** = snippet only. **J** = my judgement. Not repeated from 03; corrections in section 6.

Refs:
- **SHQL** = Shopify Admin GraphQL 2026-10, full introspection via `POST https://shopify.dev/admin-graphql-direct-proxy/2026-10`. 3,716 types, 537 mutations, 298 query roots, 234 webhook topics.
- **OR** / **LDV** / **LIM** / **META** / **DL** = `https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/` + `object_reference.pdf` (v68.0, 6 Nov 2026) / `salesforce_large_data_volumes_bp.pdf` / `salesforce_app_limits_cheatsheet.pdf` / `api_meta.pdf` / `salesforce_data_loader.pdf`.
- **ARCH** = `architect.salesforce.com/fundamentals/platform-multitenant-architecture` (D(a); developer.salesforce.com gives 403, help.salesforce.com an empty shell).
- **ERP** = `github.com/frappe/erpnext` @259f554, `erpnext/accounts/doctype/sales_invoice/`. **IC** = `github.com/resilient-tech/india-compliance` develop, `india_compliance/gst_india/`.

## 1. Shopify objects (all SHQL, D; "dep" = deprecated, inside the total)

| Object | Fields | State enums | List filters / sort keys | Mutations | Webhooks |
|---|---|---|---|---|---|
| Order | 154 (25 dep) | financial 8 (PENDING AUTHORIZED PARTIALLY_PAID PARTIALLY_REFUNDED VOIDED PAID REFUNDED EXPIRED); fulfilment 11 (UNFULFILLED ... ON_HOLD SCHEDULED REQUEST_DECLINED); return 6; cancelReason 6; edit-request 4. No single status: open/cancelled are `closed`, `cancelledAt` | 41 / 14 (CREATED_AT, CURRENT_TOTAL_PRICE, CUSTOMER_NAME, DESTINATION, FINANCIAL_STATUS, FULFILLMENT_STATUS, ORDER_NUMBER, PO_NUMBER, PROCESSED_AT ...) | 28 (10 are `orderEdit*`) | 11 ORDERS_* |
| DraftOrder | 67 (7) | 3: OPEN INVOICE_SENT COMPLETED | 8 / 8 | 12 | 3 |
| Product | 83 (20) | 4: ACTIVE ARCHIVED DRAFT UNLISTED | 37 / 9 | 23 + 9 variant | 3 |
| ProductVariant | 53 (12) | none | 31 / 13 | (in the 9) | none own |
| Customer | 49 (10) | state 4: DECLINED DISABLED ENABLED INVITED | 17 / 6 | 30 (merge, erasure, tax exemptions, 3 consent) | 10 |
| Return | 18 (1) | 5: REQUESTED OPEN CLOSED CANCELED DECLINED; decline reasons 3; return reasons 10 | no list root, via Order.returns | 10 | 8 |
| Refund | 16 (1) | none; state sits on OrderTransaction (kinds 8, statuses 6) | none | 1 (`refundCreate`) | 1 |
| DiscountNode | 6 (1), wraps 8 union types | DiscountStatus 3: ACTIVE EXPIRED SCHEDULED | 21 / 7 | 30 | 5 |
| FulfillmentOrder | 24 (1) | status 7 (OPEN IN_PROGRESS CANCELLED INCOMPLETE CLOSED SCHEDULED ON_HOLD); request 8; hold reasons 8 | 5 / 2 | 19 | 20 |
| Fulfillment | 21 (0) | status 4; displayStatus 18 | via order | 6 | 2 |
| InventoryItem / Level | 21 (1) / 10 (1) | none | 4 / none | 27 (with transfers, shipments) | 21 |
| Metafield / Definition | 19 (1) / 17 | ownerType 25 | 120 metafield types | 7 | 3 |
| Metaobject / Definition | 17 (1) / 16 | none | 6 / sortKey is a free String | 8 | 3 |

Also SHQL: StaffMemberPermission enum has 34 values. Ten resource types support saved searches.

| Topic | Fact | Source (D) |
|---|---|---|
| Access scopes | 156 `read_/write_` strings + 13 `unauthenticated_`. `read_orders` sees only the last **60 days**; older needs `read_all_orders` plus approval | shopify.dev/docs/api/usage/access-scopes |
| Staff permissions | 20 store categories, about 113 permission rows (my parse, plus or minus 3). Orders has 20 (View, Manage order information, Edit orders, Apply discounts, Charge card, Record payments, Capture, Waive balances, Fulfill, Buy labels, Return, Refund to original or store credit, Cancel, Export, Delete ...). Needed permissions auto-select | help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions |
| Bulk operations | async to JSONL; 5 bulk queries per app per shop from API 2026-01 (before: 1 per type); must finish in 10 days; URL expires in a week; BULK_OPERATIONS_FINISH webhook | shopify.dev/docs/api/usage/bulk-operations/queries |
| Order timeline | comments on orders, drafts, customers, transfers; internal; editable for 5 minutes; @mention emails the person | help.shopify.com/en/manual/shopify-admin/productivity-tools/timeline |
| Order filters (UI) | 22 (status, payment, fulfilment, delivery, return, label, chargeback, total, method, destination, address check, items, weight, product, code, app, channel, payout, fraud risk, tag, not tag, date); location is outside views | .../managing-orders/viewing-orders/filtering-orders |
| Saved views | filters + columns + order; column edit only on Orders, Inventory, Transfers, Purchase orders, Metaobjects | .../productivity-tools/searching-filtering-views |
| Export | up to 50 or current page: download; more or by date: emailed to you and owner; failure emailed | .../managing-orders/exporting-orders |
| Drafts, returns | invoice email carries checkout link; drafts after 1 Apr 2025 deleted after 1 year idle. Return only for fulfilled, unrefunded items; fees editable; no return after refund; refund cannot be reversed | .../create-orders/create-draft ; .../returns/creating-returns ; .../refunding-orders |

## 2. Shopify path (Shopify posts, changelog, 2015 filing)

The 2015 filing is an **F-1** (424B4, 21 May 2015), not an S-1: `sec.gov/Archives/edgar/data/1594805/000119312515195802/d925168d424b4.htm` (D).

| Date | Added | Push | Made possible | Src |
|---|---|---|---|---|
| 28 Sep 2004 / 2006 | Incorporated / platform launch | founders' own store | one store owner sells | F-1 D |
| 2 Jun 2009 | API + App Store (5,000+ merchants) | merchants already scripting stores | developers sell to merchants | shopify.com/news/shopify-launches-api-platform-and-app-store D |
| 22 Apr 2010 | Theme Store | designers | look is bought; designers earn per theme (F-1) | shopify.com/news/shopify-theme-store-launches D |
| 12 Aug 2013 | POS | selling in person | one catalog online and offline | shopify.com/news/shopify-launches-revolutionary-point-of-sale-system D |
| Aug 2013 US, Sep 2013 CA, Nov 2014 UK | Payments (Stripe as supplier) | revenue per merchant | 36.5% of 2014 revenue | F-1 D |
| Feb 2014 | Plus | bigger merchants | bespoke needs | F-1 D |
| Mar 2015 | snapshot: 162,261 merchants, ~150 countries, 900+ apps, $14 Starter (25 products) | n/a | n/a | F-1 D |
| 18 Sep 2017 | Flow (app-listing date; Unite 2017 recap, S) | Plus automation | no-code workflows | apps.shopify.com/flow D |
| 19 Jun 2019 | New Plus: org-level control of many stores, Flow at org level | merchants with dozens of stores | multi-store admin | shopify.com/news/announcing-shopify-plus-all-new-platform-for-enterprise-merchants D |
| 14 Sep 2021 | Markets | 27% of traffic international | many countries, one store | shopify.com/news/global-by-default-... D |
| 22 Jun 2022 | First Editions: B2B (Plus), Checkout Extensibility preview, Functions post | extend without forking | wholesale; app-based checkout | .../introducing-shopify-editions-100-product-releases-..., .../partners/blog/checkout-extensibility D |
| 9 Feb 2023 | metaobjects post (API 2023-01 page exists, S) | custom content | merchant-defined objects | shopify.com/blog/custom-data-management-tools D |
| 15 Oct 2025 | Variants 100 to 2,048 | catalogs outgrew cap | big option matrices | shopify.com/blog/2048-variants D |
| 2 Apr 2026 | B2B basics on non-Plus (3 catalogs) | wholesale below Plus | small wholesalers | shopify.com/news/b2b-for-all D |

Direction (J): one owner (2006) → developers (2009) → designers (2010) → offline and payments (2013) → larger merchants (2014) → automation (2017) → multi-store orgs (2019) → countries (2021) → extension points and wholesale (2022) → custom data (2023) → limits lifted, wholesale downmarket (2025-26). **Staff roles: no primary date found.**

## 3. Salesforce design and depth

| Topic | Fact | Src |
|---|---|---|
| Storage | Objects and fields are metadata rows. Data of all tenants sits in a few heap tables partitioned by tenant; runtime builds virtual tables | ARCH D(a); LDV p2 D |
| Tables | Metadata: MT_Objects, MT_Fields (FieldNum, IsIndexed). Data: MT_Data (OrgID, ObjID, Name, Value0..ValueN, 4 audit cols, IsDeleted), MT_Clob (131,072 chars), MT_Relationships, MT_Name_Denorm. Index: MT_Indexes (typed cols), MT_Unique_Indexes, MT_Fallback_Indexes. Security: Groups, Members, GroupBlowout, CustomShare | ARCH D(a) |
| Flex columns | variable-length strings, one slot per field, shared across objects; N not stated; type change allocates a new slot | ARCH D(a) |
| Indexes | indexed values copied synchronously to typed pivot columns, case-folded. Default indexed: Id, Name, OwnerId, CreatedDate, SystemModstamp, RecordType, all lookups. Custom index via Support or metadata file | ARCH; LDV p6 D |
| Optimizer | own per-tenant, per-user statistics, refreshed nightly. Selective if under 150,000 rows (ANDed: under 300,000 each or intersect under 150,000). Skinny tables max 200 columns, one object | LDV p5-7 D |
| Field types | 21 (address, anyType, calculated, combobox, currency, DataCategoryGroupReference, email, encryptedstring, floatarray, ID, JunctionIdList, location, masterrecord, multipicklist, percent, phone, picklist, reference, textarea, textarray, url). Custom: `__c`, `__r`. Event, Lead, Product2, Task, User cannot be master | OR ch1 D |
| Opportunity | **55 fields**, 12 API calls. StageName picklist drives ForecastCategoryName, IsClosed, IsWon, Probability; stages live in OpportunityStage (sample: Prospecting 10%, Qualification 10%, Needs Analysis 20%). ForecastCategory 6 values. Other: Amount, CloseDate, RecordTypeId, Pricebook2Id, OwnerId, PushCount, LastStageChangeDate, AgeInDays, IsPrivate, IsSplit, SyncedQuoteId. Satellites: History, FieldHistory, Share, OwnerSharingRule, Feed, ChangeEvent, Competitor, ContactRole, LineItem, Split. Child line item changes fire parent validation and triggers | OR p3828-3844; META p852 D |
| Permission layers | org (API Enabled) → object (R/C/E/D) → field (hidden fields vanish from query and describe) → record (sharing). One override: Edit Read Only Fields. Profile is base; permission sets only add | OR p27-28; META D |
| Record type, layout, rule | Record type = process, picklist values, layout per user; **not access control** (profile blocks create, not read). Validation rule = true/false formula + message, can attach to a field, no compound fields. Approval process order is not in metadata (reorder by hand after deploy). Flow = screens, record ops, loops, Apex | META p854 D |
| Limits | API per 24h: 100,000 + licences x 1,000 (Enterprise) or 5,000 (Unlimited); Developer 15,000; 25 long concurrent calls (5 in Developer); 10-minute timeout; under 2,000 rows use REST, else Bulk | LIM D |
| Import/export | Bulk: 15,000 batches/24h, 150M records, 10 MB per batch (v1), 150 MB per job (v2). Data Loader: import batch max 200, export max 2,000, 150M rows with Bulk 2.0. Import Wizard 50,000 (S) | LIM; DL D |

**Day-one decisions for customer-defined fields and objects (J, from the rows):**
1. Fields as metadata rows over typed or flex columns, no schema change per tenant; set the slot limit.
2. Tenant id in every row, index and query.
3. Separate typed index table; say which fields may be indexed.
4. Own statistics per tenant and user (the DB cannot see visibility).
5. Permission layers before the first custom object; permission sets allow-only.
6. Picklist values carry side effects (probability, closed flag).
7. Governor limits per plan from day one.
8. Naming and relationship rules (`__c`, master-detail vs lookup deletes).
9. Soft delete and history as base columns.
10. Separate async bulk path.

## 4. India invoice (ERP and IC, counts from JSON and code, D)

| Item | ERP | IC adds |
|---|---|---|
| Fields | 235 rows: 159 real, 44 section/tab breaks, 29 column breaks; 52 Link, 27 Check, 26 Currency, 11 child tables; 14 required. Item row 124 (90 real) | **34 custom rows on Sales Invoice (29 real)**: gst_category, place_of_supply, company_gstin, is_reverse_charge, is_export_with_gst, port_code, shipping_bill_*, irn, einvoice_status, ewaybill, transporter, vehicle_no, distance ...; +15 on item |
| States | status 13 (Draft, Return, Credit Note Issued, Submitted, Paid, Partly Paid, Unpaid, Overdue, 3 "and Discounted", Cancelled, Internal Transfer) over docstatus 0/1/2 | einvoice_status 9 (Pending, Generated, Manually Generated, Auto-Retry, Cancelled, Manually Cancelled, Failed, Not Applicable, Pending Cancellation) |
| Actions | Payment, Return/Credit Note, Delivery Note, Payment Request, Invoice Discounting, Dunning, Maintenance Schedule; pull from Timesheet, Sales Order, Quotation | generate/cancel e-invoice and e-waybill, bulk, retry job, auto-cancel |
| Payment link | Payment Request: 60 fields, 8 states, `payment_url`, gateway account | none |
| Credit note | `is_return` + `return_against` | credit note and debit note together blocked; past 24h with `restrict_cancel_if_e_invoice_final`, cancel says "create a Credit Note" |
| E-invoice / e-waybill | none | cancel only within 24h of acknowledgement; 4 cancel reasons; 1,000 items max; e-waybill threshold per state; logs of 17 and 22 fields |
| GSTR export, reports | Sales Register | GSTR-1 (15 fields), GSTR-3B Report (14), Return Log, Return Export; 16 reports |
| Print formats | 5 (bordered, classic, modern, modern with images, return) + credit_note | 7 (GST tax invoice, POS, e-invoice, e-waybill x2, purchase, 3B) |
| Validations | about 25 `validate_/check_` methods | 25 `throw` in `transaction.py`; place of supply, HSN, reverse charge, GSTIN status, backdated cancel |
| Settings | Accounts and Selling Settings | GST Settings: 89 rows, 65 real, 45 checkboxes, 4 tabs |
| List filters | 5 saved (Drafts, Unpaid, Overdue, This Month, Credit Notes); 4 standard filters | none |
| Frozen on submit | only 21 fields editable (project, cost_center, po_no, letter_head, sales_team, dispatch address, title ...) | transporter fields restricted |

Paths: ERP `sales_invoice.json`, `sales_invoice.py` (cancel l.547-600), `list_filter/*.json`. IC `constants/custom_fields.py`, `utils/e_invoice.py` (l.542), `overrides/sales_invoice.py` (l.221), `doctype/gst_settings/gst_settings.json`.

## 5. One "issued document", five products (D)

| | Shopify Order | Shopify DraftOrder | Stripe Invoice | ERPNext | Invoice Ninja |
|---|---|---|---|---|---|
| States | 8 + 11 + 6 enums; closed, cancelledAt | 3 | 5: draft open paid uncollectible void | 13 over docstatus | 1 Draft 2 Sent 3 Partial 4 Paid 5 Cancelled 6 Reversed; overdue computed |
| Frozen when | cancelled or not `merchantEditable`; edits via session (begin, commit) | until completed; update unlinks a started checkout | at finalize: money and `collection_method` | at submit; 21 fields stay open | `lock_invoices`: off, when_sent, when_paid, end_of_month |
| Correct | order edit; return then refund; `orderUpdate` | `draftOrderUpdate` | credit note (4 reasons, pre or post payment), or void and re-issue | Return/Credit Note, or cancel and amend | edit if unlocked; reverse |
| Cancel | `orderCancel` irreversible; delete limited | delete | draft: delete; finalized: void, irreversible, trail kept | cancel reverses ledger; e-invoice only within 24h | balance to 0, status 5; reverse unwinds payments |
| Customer sees | `statusPageUrl`, emails | `invoiceUrl` checkout | `hosted_invoice_url`, `invoice_pdf` | portal list, print formats, `payment_url` | portal invitations, PDF |
| Size | 154 fields | 67 | 79 fields, 15 routes, 17 events | 235 rows | about 40 fillable fields |

Sources: SHQL; `github.com/stripe/openapi` spec3.json (2026-09-30); ERP; `github.com/invoiceninja/invoiceninja` `app/Models/Invoice.php`, `app/Services/Invoice/*`.

## 6. Corrections to 03
- Order filters: 03 said 5; UI lists 22, API 41.
- Now D: API and App Store 2 Jun 2009; Flow 18 Sep 2017; Markets 14 Sep 2021; Functions and Checkout Extensibility 22 Jun 2022; variant cap 15 Oct 2025 (Shopify blog).
- Salesforce metadata design is D, not J.

## 7. Not verified
- Salesforce help pages (Opportunity list view filters, standard stage list, layout, flow and report limits): blocked or empty. Import Wizard 50,000 is S.
- Flex column count N; per-edition custom object and field limits.
- Shopify staff role dates; Theme Store closure years; first metaobjects release.
- ERPNext GSTR-1 JSON format, per-state e-waybill thresholds; Invoice Ninja reversal output and portal view (service file names only).
