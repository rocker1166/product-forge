# Closed products: origin to platform (Shopify, Stripe, Salesforce, Linear, Notion, Zoho)

Marks: D = I read the page. S = search snippet only. J = my judgement or prior knowledge, not checked here. Taxonomy codes from 00-taxonomy.md. Trigger: C customer ask, Sc scale, Pa partner, L law, F founder need.
Gaps are listed honestly at the end. Zoho help pages returned 403, so Zoho object depth is partial.

## 1. Origin to platform timeline

| Product | Step | Trigger | Code | Mark / source |
|---|---|---|---|---|
| Shopify | 2004 founders wanted to sell snowboards online, found software clunky and costly; built own store on Rails | F | N | S https://en.wikipedia.org/wiki/Shopify (via search) |
| Shopify | Jun 2006 relaunched as Shopify; Liquid templates are the theme layer | F | H6 | S same |
| Shopify | Jun 2009 API plus App Store | C/Pa | I6 | S same; date varies by source |
| Shopify | Metafields extended to orders, collections, customers in Jan 2022 (so custom data on orders came about 13 years after launch) | C | H6 | S https://changelog.shopify.com/posts/metafields-now-available-on-orders-collections-and-customers |
| Shopify | Variant cap 100 raised to 2,048 for all merchants on 15 Oct 2025 | C/Sc | H4 | S https://changelog.shopify.com/posts/we-ve-increased-the-product-variant-limit-to-2048 |
| Shopify | Flow, Markets, Functions dates | - | - | NOT verified (my search returned nothing) |
| Stripe | Rolling API versions kept compatible since 2011; ~100 breaking changes by 2017 | Sc | I6 | D https://stripe.com/blog/api-versioning |
| Stripe | Idempotency-Key on POST, written up Feb 2017 | Sc | H2 | D https://stripe.com/blog/idempotency |
| Stripe | Invoice: draft, open, paid, void, uncollectible; credit notes added later for post-finalise correction | L/C | A4, A5 | D https://docs.stripe.com/invoicing/overview |
| Stripe | Invoicing/Billing launch dates | - | - | NOT verified |
| Salesforce | 8 Mar 1999 founded; first prototype Nov 1999 | F | N | D https://en.wikipedia.org/wiki/Salesforce |
| Salesforce | AppExchange 2005 (TechCrunch quotes Harris saying 2006) | Pa | I6 | D (Wikipedia), S (TechCrunch conflict) https://techcrunch.com/2019/03/22/how-salesforce-paved-the-way-for-the-saas-platform-approach/ |
| Salesforce | Apex 2006; Force.com announced Dreamforce 2007 (some say 2008); earlier S-Force APIs ~2003 | C | H6, I6 | S https://www.salesforceben.com/brief-history-salesforce-com/ |
| Salesforce | 2010+ buys Heroku, Radian6, ExactTarget, MuleSoft, Tableau, Slack: growth by acquisition once the platform base was set | Sc | N | D Wikipedia |
| Linear | Apr 2019 private alpha; Sequoia-led seed Nov 2019 ($4.2M) | F | N | S https://techcrunch.com/2019/11/21/linear-lines-up-4-2m-led-by-sequoia-to-build-a-better-platform-for-software-developer-collaboration/ |
| Linear | Triage inbox, Asks, rules, AI triage (Business tier) added on top of issues | C | A4, D2 | D https://linear.app/docs/triage |
| Linear | Cycles/roadmap/public launch dates | - | - | NOT verified |
| Notion | 2013 founded, ~$2M angel money; 2015 near-collapse: stack could not scale; team moved to Kyoto and rebuilt (said four rebuilds) | F | H3 | S https://figma.com/blog/design-on-a-deadline-how-notion-pulled-itself-back-from-the-brink-of-failure/ ; https://notion.com/blog/100-million-of-you |
| Notion | 2016 Notion 1.0 (Mar or Aug, sources differ) | F | N | S |
| Notion | 18 May 2021 block model published; Oct 2021 Postgres sharded | Sc | I1 | D https://www.notion.com/blog/data-model-behind-notion ; https://www.notion.com/blog/sharding-postgres-at-notion |
| Zoho Books | 2011 launch (time tracking, custom fields early); 2014 relaunch; 2017 GST edition after GST began 1 Jul 2017; 2020 India e-invoicing | L | H1 | S https://www.zoho.com/books/10years/ |
| Zoho | E-invoice: push to IRP, IRN and QR returned; recurring invoices auto-push; cancel in app only within 24h of IRN, later on GST portal | L | H1, H2 | S https://www.zoho.com/invoice/help/e-invoicing/functions.html |

Pattern (J): first release is one narrow job. Platform steps follow in this order: custom data, public API, partner marketplace, automation, compliance and region packs, then acquisitions. Law (GST, e-invoice) and partner demand arrive from outside; a PRD cannot date them, but it can leave the room for them (X).

## 2. The move that made it a platform

| Product | The move | Why it worked | Mark |
|---|---|---|---|
| Shopify | Liquid themes, then API + App Store (2009), later metafields and Functions | Merchants and agencies change look and logic without touching core | S Wikipedia; J for Functions |
| Salesforce | Customers define their own objects and fields; apps sold on AppExchange; Apex code runs inside shared tenancy | Metadata, not code, defines the customer app, so one codebase serves all | S https://www.salesforceben.com/brief-history-salesforce-com/ ; J for "metadata" reading, my searches did not confirm it directly |
| Stripe | One API with stable versions plus idempotency; objects (invoice, credit note) with webhooks | Developers trust it enough to build revenue on it | D |
| Linear | Local-first sync engine: UI works on an in-memory object graph, sync is separate | Speed feels instant; new features are cheap model additions | S https://dev.to/wzhudev/i-reversed-linears-sync-engine-to-see-how-it-works-3cj (third-party reverse engineering, not Linear) |
| Notion | Everything is a block (uuid, type, properties, content[] down, parent up) | One primitive for pages, rows, text; permissions inherit via parent | D https://www.notion.com/blog/data-model-behind-notion |
| Zoho | Suite of apps plus compliance connector (registered GSP) | India law needs an approved channel to the tax portal | S https://www.zoho.com/in/books/help/e-invoicing/ |

## 3. One-way doors

| Early decision | Cost later | Evidence | Mark |
|---|---|---|---|
| Shopify: 100 variants per product, 3 options | Lived about 16 years (2009 to Oct 2025 for the 100 cap, J on start); 3-option cap not confirmed changed | Changelog 15 Oct 2025; community says option limit unchanged | S https://changelog.shopify.com/posts/we-ve-increased-the-product-variant-limit-to-2048 |
| Stripe: API contract is forever | Each old version adds a "version change module"; responses are built current then transformed back | Stripe 2017 | D https://stripe.com/blog/api-versioning |
| Stripe: no idempotency key at first (J) | Clients could double-charge on retry; fix needed key-to-request state storage | Stripe 2017; Brandur notes Stripe stores even 500 results against a key | D https://stripe.com/blog/idempotency ; S https://brandur.org/idempotency-keys |
| Notion: one Postgres, block per row | VACUUM stalls, TXID wraparound risk; sharded by workspace id into 480 logical shards on 32 databases; lesson "composite id + space_id key was harder than one key" | Notion Oct 2021, about 5 min downtime, 3-day backfill | D https://www.notion.com/blog/sharding-postgres-at-notion |
| Notion: content[] and parent pointers mirror each other | Edge cases still being fixed | Notion 2021 | D data-model post |
| Notion: stack that could not scale | Full rebuild in 2015 | Figma/Notion posts | S |
| Linear: sync engine from day one | Heavy up-front cost, but fast UI; scaling talk 2023 says API grew in response | Linear talk page | S https://linear.app/now/scaling-the-linear-sync-engine (page had no detail, D of that page only) |
| Salesforce: shared multi-tenant model | Lets one release serve all; limits (governor limits) are the price | J, not verified here | J |
| Zoho: IRN cancel not mirrored automatically | Cancelling in app does not cancel IRN at the portal after 24h | Zoho help | S |

## 4. Feature depth of one object today

### Shopify Order (admin)
| Area | Count / finding | Mark |
|---|---|---|
| Filters on list | 5 named on one page: fulfillment status, payment status, sales channel, date range, tag; plus saved views, plus filter by order metafield. Another page named 3 (fulfillment, payment method, date). Real UI has more; I did not count it. | D https://help.shopify.com/en/manual/fulfillment/managing-orders/viewing-orders |
| Search | 4 inputs: order number, customer name, email, product | D same |
| Bulk actions | 9: create shipping labels, fulfill, capture payments, print orders, print packing slips, archive, unarchive, add tags, remove tags. Over 250 selected: some actions unavailable | S https://help.shopify.com/manual/productivity-tools/bulk-actions |
| Edit | add/remove items, change quantity, shipping fee, discount (4) | D https://help.shopify.com/en/manual/orders/manage-orders |
| Refund, cancel, returns, exchange, self-serve return rules, print invoice/packing slip, fraud risk review plus Flow automation | exist | D same |
| Export | Choose records: current page, up to 50 (downloaded); more than 51 or by date range (emailed to you and store owner). Choose type: orders or transaction histories. Only UTF-8 CSV. Failed export sends email | D https://help.shopify.com/en/manual/fulfillment/managing-orders/exporting-orders |
| Timeline, draft orders, staff permissions, archive rules | exist (J); counts not verified | J |

### Stripe Invoice
| Area | Finding | Mark |
|---|---|---|
| States | 5: draft, open, paid, void, uncollectible. UI badges Past due, Retrying, Pending are display only | D https://docs.stripe.com/invoicing/overview |
| Finalise | draft to open; most fields then locked; only memo and metadata editable; bigger changes = revise (new invoice, void old) | D |
| Delete | draft only, not subscription ones; irreversible | D |
| Void | from open or uncollectible; terminal; hosted page still shows "voided"; zero-value in reports | D |
| Uncollectible | write-off for bad debt; can go to void or paid | D |
| Paid | terminal in the status table; also says can be reopened by unapplying payments (the page contradicts itself) | D |
| Out of band | mark paid for cash, via Dashboard or `paid_out_of_band` | D |
| Credit note | on open, paid; not on uncollectible via Dashboard. Sum of credit notes cannot exceed invoice total. Paid invoice: refund to card, credit balance, or outside Stripe (3 destinations). 3 ways to credit a line: amount, quantity, custom line (custom blocked with auto tax). Void credit note only on open invoices. Open invoice with pending payment cannot get one | D https://docs.stripe.com/invoicing/dashboard/credit-notes |
| Webhooks | `invoice.deleted/paid/voided/marked_uncollectible/payment_failed` | D |

### Zoho Invoice's Invoice (not read; pages 403)
| Area | What I have | Mark |
|---|---|---|
| States | Inventory lists 6: Draft, Sent, Overdue, Partially Paid, Paid, Void. Books adds Pending Approval, Rejected, Approved. Write-off exists on Billing | S https://www.zoho.com/en-sg/inventory/help/invoice/index.html ; https://www.zoho.com/billing/kb/invoices/different-invoice-status.html |
| E-invoice | IRP push, IRN, QR; recurring pushes automatically; failed push means invoice not sent, owner emailed | S https://www.zoho.com/invoice/help/e-invoicing/functions.html |
| Credit note, reminders, templates, portal, bulk, custom fields, export formats, lock after payment | NOT verified: no counts | - |

## 5. Quality of flow: documented behaviours a simple PRD would miss

| # | Product | Behaviour | Code | Mark |
|---|---|---|---|---|
| 1 | Shopify | Export asks which records first; small sets download, large ones are emailed; failure is emailed | C2, F3 | D |
| 2 | Shopify | Bulk fulfil skips orders owned by a fulfilment service; needs tracking unless using Shopify Shipping; optional customer notice checkbox; progress panel; >250 limits | C1, G4 | S |
| 3 | Stripe | Draft is freely editable, open is nearly frozen, revise = void + replace; credit note exists so you need not void | A4, A7 | D |
| 4 | Stripe | Invoice below minimum charge auto-moves to paid and debits customer credit balance | H1 | D |
| 5 | Stripe | Voided invoice's hosted link still works and says voided (customer never meets a dead link) | G1, E1 | D |
| 6 | Stripe | Local rules note: some countries forbid void; issue credit note or new invoice instead | L | D |
| 7 | Linear | Triage: 5 actions (accept, decline, duplicate, snooze, comment-and-keep), keys 1/2/3/H, duplicate moves attachments and customer requests to the canonical issue; option to require priority before leaving triage; triage issues hidden from views unless filtered | A4, D2 | D https://linear.app/docs/triage |
| 8 | Zoho | Recurring e-invoice that fails to push is not sent; customer still gets a thank-you; owner emailed reason | I3, I5 | S |
| 9 | Zoho | Cancel in app within 24h of IRN; later, cancel on the government portal yourself | L, A5 | S |
| 10 | Notion | Edits apply locally in a few ms, queued as transactions, server validates permissions before commit | F2, F9 | D data-model post |
| 11 | Stripe | Test mode (J, well known, not re-read here); Linear undo and command menu (J) | - | J |

## 6. Maturity ladder (J, built from the above)

| Stage | Appears | Why |
|---|---|---|
| 0 Single job | create, view, one state change | prove the problem |
| 1 Complete lifecycle | edit, delete or archive, status model, cancel/refund (A1, A2, A4, A5) | first real users make mistakes |
| 2 Find and move many | search, filter, sort, bulk, export, import, print (B, C) | second week of real data |
| 3 Teams | roles, owner, approval, comments, notifications, audit log (D, E) | more than one user per tenant |
| 4 Money and law | tax, currency, immutable issued docs, credit notes, e-invoice (H1, L) | first accountant or regulator |
| 5 Scale and safety | idempotency, rate limits, sharding, jobs, retries, admin tools (H2, I) | Stripe 2017, Notion 2021 |
| 6 Extensibility | custom fields, API, webhooks, apps, automation (H6, I6) | Shopify 2009, Salesforce 2005 |
| 7 Platform | marketplace, acquisitions, compliance connectors | ecosystem does the work |

## 7. Day-one decisions: cheap now, costly later

| Decision | Real case | Mark |
|---|---|---|
| Tenant key on every row (workspace id) | Notion could shard because every block has exactly one workspace; still hurt by composite key | D |
| Money as integer minor units plus currency | Stripe minimum-charge and credit-balance logic depends on exact amounts | D (indirect), J rest |
| Issued documents immutable; fix by credit note or revise | Stripe finalise lock; Zoho IRN cannot be silently undone | D / S |
| Document number and state machine with terminal states | Stripe paid/void terminal, void keeps paper trail | D |
| Idempotency keys on every write | Stripe 2017 | D |
| API versioning from first public endpoint | Stripe date versions since 2011 | D |
| Audit trail / event log | Stripe webhook per transition; Linear/Notion transactions are logs (J) | D / J |
| Soft delete and archive | Shopify archive bulk action; Stripe says deleted draft cannot be recovered, so decide it per state | S / D |
| Custom fields and metadata bag | Shopify orders got metafields only in 2022; Stripe keeps `metadata` on objects | S / J |
| Limits as config, not schema | Shopify 100 variants lasted until Oct 2025 | S |
| Roles model with per-action permissions | Shopify staff permissions exist (counts unverified) | J |
| Timezone stored with each tenant and date | J, no case read; Zoho IRN is per financial year (S) | J |
| Parent pointer for permission inheritance | Notion: content arrays gave ambiguous ancestors | D |
| Tax-law hooks (place of supply, tax ids) | Zoho Books GST edition 2017 and e-invoice 2020 forced rework | S |

## Could not verify
- Zoho Invoice object depth (403): lock after payment, counts of filters, export formats, templates, portal, approvals.
- Shopify order timeline, draft orders, risk levels, staff permission counts, full filter list.
- Dates for Shopify Flow, Markets, Functions; Linear public launch, Cycles; Stripe Billing/Invoicing launch.
- Salesforce metadata/tenancy design (no primary source read); Linear sync design from Linear itself.
