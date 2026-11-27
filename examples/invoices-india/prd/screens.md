# Invoices for Indian service firms: Screens

| Screen | Path | Type | For | Main action | Reached from | First use | No match | Done |
|---|---|---|---|---|---|---|---|---|
| Create account | /sign-up | public | owner | Create account | link |  |  |  |
| Sign in | /sign-in | public | owner, accountant, staff, viewer, support | Sign in | link |  |  |  |
| Second step | /sign-in/code | public | owner, accountant, staff, viewer, support | Confirm code | sign_in |  |  |  |
| Reset password | /reset-password | public | owner, accountant, staff, viewer, support | Send reset link | sign_in |  |  |  |
| Accept an invite | /invite/:token | public | owner, accountant, staff, viewer | Accept invite | link |  |  |  |
| Page not found | /* | public | owner, accountant, staff, viewer, client, support | Go to start | link |  |  |  |
| Your firms | /firms | list | owner, accountant, staff, viewer | Open firm | menu, sign_in | You are not in any firm yet. Create yours, or open the invite link your accountant or boss sent. | No firm matches. Try part of the firm name or the GSTIN. |  |
| Setup guide | /setup | wizard | owner | Continue setup | home, firm_switcher, sign_up |  |  |  |
| Home | / | home | owner, accountant, staff, viewer | New invoice | menu |  |  |  |
| Search | /search | list | owner, accountant, staff, viewer | Search | menu, home | Type a number, a name, a GSTIN or an amount. Spaces and slashes in a number are ignored. | Nothing matches. Check the spelling, or try only the last digits of the number. |  |
| Invoices | /invoices | list | owner, accountant, staff, viewer | New invoice | home, menu, customer, search | No invoices yet. Make your first one, it takes about two minutes. | No invoice matches these filters. Clear them or widen the dates. |  |
| Write an invoice | /invoices/new | form | owner, accountant, staff | Issue | invoices, home, invoice, customer, quote, recurring_plans, setup_guide, search |  |  | Invoice is issued and the number is taken. Send it now on WhatsApp or by email, or copy the link. |
| An invoice | /invoices/:id | detail | owner, accountant, staff, viewer | Record payment | invoices, search, customer, payments, payment, credit_note, outbox, einvoice_queue, history, link |  |  |  |
| Credit notes | /credit-notes | list | owner, accountant, viewer | New credit note | menu, invoice | No credit notes yet. They are made from an invoice that needs a correction. | No credit note matches these filters. Clear them or widen the dates. |  |
| Write a credit note | /credit-notes/new | form | owner, accountant | Issue credit note | credit_notes, invoice |  |  | Credit note is issued and linked to its invoice. Send it to the customer or leave it as credit. |
| A credit note | /credit-notes/:id | detail | owner, accountant, viewer | Send credit note | credit_notes, invoice, customer, search |  |  |  |
| Quotes | /quotes | list | owner, accountant, staff, viewer | New quote | home, menu, customer | No quotes yet. Send a quote first when the customer wants a price before work starts. | No quote matches these filters. Clear them or widen the dates. |  |
| Write a quote | /quotes/new | form | owner, accountant, staff | Send quote | quotes, customer, quote |  |  | Quote is sent. You will see here when the customer opens it. |
| A quote | /quotes/:id | detail | owner, accountant, staff, viewer | Convert to invoice | quotes, search, customer, link |  |  |  |
| Repeating invoices | /recurring | list | owner, accountant | New plan | menu, customer | No repeating invoices. Set one up for a customer you bill every month and get a draft to check on the day. | No plan matches. Try the customer name. |  |
| E-invoices | /e-invoices | list | owner, accountant | Retry failed | menu, home, invoice | Nothing waiting. E-invoices appear here when your turnover needs them. | No e-invoice matches. Try Failed or Due soon. |  |
| Customers | /customers | list | owner, accountant, staff, viewer | New customer | home, menu, search | No customers yet. Add one, or bring a list from Excel. | No customer matches. Try part of the name, the phone or the GSTIN. |  |
| Add or edit a customer | /customers/new | form | owner, accountant, staff | Save | customers, customer, invoice_form, setup_guide |  |  | Saved. You can invoice this customer now. |
| A customer | /customers/:id | detail | owner, accountant, staff, viewer | New invoice | customers, invoice, search, credit_register |  |  |  |
| Services | /services | list | owner, accountant, staff, viewer | New service | menu, invoice_form | No saved services. Save the ones you bill often, and each invoice line fills itself. | No service matches. Try part of the name or the SAC code. |  |
| Payments | /payments | list | owner, accountant | Record payment | home, menu, customer | No payments yet. When a customer pays, record it here or from the invoice. | No payment matches these filters. Clear them or widen the dates. |  |
| Record a payment | /payments/new | form | owner, accountant | Save payment | payments, invoice, customer |  |  | Payment is saved and the invoice is updated. Send the receipt on WhatsApp, or undo within 10 seconds. |
| A payment | /payments/:id | detail | owner, accountant | Send receipt | payments, invoice, customer, search |  |  |  |
| Customer credit | /credit | list | owner, accountant, viewer | New refund | menu, customer, credit_note | No customer credit. It appears when you issue a credit note for an invoice that was paid. | No row matches. Try the customer name or With balance. |  |
| Sent mail and links | /outbox | list | owner, accountant, support | Retry failed | menu, invoice, support_console | Nothing sent yet. Every email and every link you share is listed here. | No message matches. Try Failed, Bounced or the customer name. |  |
| Invoice page for the customer | /d/:token | public | client | Pay with UPI | link |  |  |  |
| Your page from the firm | /c/:token | public | client | Open my page | link |  |  |  |
| Your documents | /c/:token/home | public | client | Pay selected | client_sign_in, link | Nothing yet. Invoices and quotes from the firm will show here. | No document in this period. |  |
| Your statement | /c/:token/statement | public | client | Download PDF | client_page |  |  |  |
| Quote from the firm | /c/:token/quotes/:id | public | client | Accept quote | client_page |  |  |  |
| Time | /time | list | owner, accountant, staff | Add time | menu, customer | No time logged. Add the hours you spend on a customer, then bill them on an invoice. | No entry matches. Try another person, customer or week. |  |
| Expenses to bill | /expenses | list | owner, accountant, staff | Add expense | menu, customer | No expenses. Add one you paid for a customer and bill it back on the next invoice. | No expense matches. Try another vendor, customer or category. |  |
| Reports and registers | /reports | home | owner, accountant, viewer | Open month end | menu, home |  |  |  |
| A report | /reports/:name | detail | owner, accountant, viewer | Export | reports, home, month_end |  |  |  |
| Month end | /month-end | wizard | owner, accountant | Build month-end pack | menu, home, reports |  |  |  |
| Exports | /exports | list | owner, accountant | New export | menu, reports, month_end, settings_security | No exports yet. Build the month-end pack, a register, a Tally file or a full copy of your books. | No export matches. Try Ready or Failed. |  |
| Imports | /imports | list | owner, accountant | Bring in data | menu, customers, items, invoices, setup_guide | Nothing imported yet. Bring customers, services or open invoices from Excel, Tally or another app. | No import matches. Try Failed or Done. |  |
| Bring in data | /imports/new | wizard | owner, accountant | Check my file | imports, customers, items, invoices, setup_guide |  |  |  |
| History | /history | list | owner, accountant, support | Search history | menu, invoice, customer, payment, settings, support_console, link | No history yet. Every change to your books is written here from now on. | No entry matches. Try a name, an invoice number or a wider date range. |  |
| Settings | /settings | settings | owner, accountant | Open firm profile | menu |  |  |  |
| Firm profile, bank and reminders | /settings/firm | settings | owner, accountant | Save | settings, setup_guide |  |  |  |
| Tax, numbers and period lock | /settings/tax | settings | owner, accountant | Save | settings, month_end |  |  |  |
| Look of your documents | /settings/templates | list | owner, accountant | Edit look | settings, setup_guide | Your invoices use the standard look. Add a logo and colour to make them yours. | No template matches. Try Invoice, Credit note, Receipt or Email. |  |
| People and roles | /settings/team | list | owner | Invite person | settings, setup_guide | Only you are in this firm. Invite your accountant or a colleague. | No person matches. Try the name or the email. |  |
| Security, support access and closing | /settings/security | settings | owner | Save | settings |  |  |  |
| Plan and billing | /settings/billing | settings | owner, accountant, support | Upgrade | settings, home, support_console, link |  |  |  |
| Tax rates and codes | /tax-tables | list | owner, accountant, staff, viewer, support | Search codes | settings, invoice_form, support_console | No rows yet. Support publishes GST rates, SAC codes and TDS sections here. | No code matches. Try the SAC number or a word from the service. |  |
| My account | /account | settings | owner, accountant, staff, viewer | Save | menu |  |  |  |
| Support console | /support | list | support | Find a firm or user | menu | No open tickets. Search a firm or a login to start. | No firm or user matches. Check the ticket number and the owner's email. |  |

| On every screen |  |
|---|---|
| loading | Grey rows in the final shape, a few seconds at most; a long job shows a progress bar and can be closed. |
| error | What failed in one sentence and a Retry button. Typed text is kept. Nothing says 'error 500'. |
| denied | Says what this role cannot do and names the person who can, with their email. The menu never shows it in the first place. |
| read_only | A bar at the top: your plan has stopped, new invoices are paused, payments, credit notes, exports and your data stay open. |
| plan_locked | Shows the feature, the plan that has it and the price, with one Upgrade button for the owner and a note to ask the owner for everyone else. |
| big | 10,000 rows: pages of 50, the count reads 10,000+, filters and search stay fast, exports go by email. |
| not_found | Says the page is gone or never existed, with a link back to the list. A wrong link token looks exactly like this. |
| phone | One column at 375 px, no sideways scroll, every button 44 px tall, main action in thumb reach, number keypad on amount fields. |
| invalid | Summary on top naming each field, a message at each field with the limit and the fix, shown on submit, never a code. |
| saving | Saving, then Saved 10:42, beside the button. A lost connection says Not saved, retrying. |
| failed | Nothing is lost; the same button tries again, and the text says what went wrong in plain words. |
| leave | Unsaved changes: Save or Discard. Drafts also save by themselves every 30 seconds. |

