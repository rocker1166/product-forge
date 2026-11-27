# Clashes between lines

Format: lines | what clashes | decision | why. Ids refer to ALL.txt; the result is in MERGE.txt.

## People and access
1. W073, K009, D198, B099 against A001, C072, B175 | "a user belongs to one firm, email unique system-wide" against "a CA signs in once and switches between 30 firms" | One login (email) holds many memberships, one role each; W073 and K009 fixed | A CA cannot work with one firm per login; a firm still sees only its own data.
2. W075, K004-K007 against A002, C063, D195 | three roles against a staff role | Four fixed roles: owner, accountant, staff (drafts only, no Reports or Settings), viewer; W075 and A002 fixed | A 20-person firm needs a biller who cannot issue or see revenue.
3. B025 and B026 against D191 | custom role grid against fixed roles | Fixed roles; B026 is no, D191 (grid on screen) dup A003 | Custom roles multiply the 403 tests.
4. K015, C064, C143, C144 against A002 | maker-checker approval before issue | Staff drafts, accountant or owner issues; approval queues and limits are later or no | Role split already gives a checker.
5. A037, C076, D188, K209 | who locks a period | Owner or accountant can lock, only an owner can move the date back with a reason | Accountants close months; loosening must stay with the owner.
6. C145 against W075 and K004 | credit note needs the owner role | Accountants issue credit notes; void and reversal stay owner-only; C139 emails owners on large ones | Credit notes are normal bookkeeping.
7. C147, C148 against A005 | deactivation: share links keep working or stop | Sessions end at once; share links belong to the firm and keep working; API keys are later | Customers hold those links.
8. D198, A012 | invite to an email that belongs to another firm is refused | Allowed, attaches to the existing login after sign-in, never names other firms | Follows decision 1 and protects privacy.
9. C001, C105-C108 against W076 | phone OTP login against email and password | Email and password wave 1, optional TOTP (A015); phone OTP later | SMS needs a registered sender and adds SIM-swap work.
10. B030, B031, B032 against A015 | passkey, social login, TOTP setup | TOTP now (B032 dup A015); passkey and Google sign-in later | One strong second factor first.
11. A013, D279-D283, C157, C194 | support access | Time-boxed owner grant, read-only, logged, banner shown, now | Support must exist and must not see books without consent.

## Documents, numbers, templates
12. B042 against A043, A044, D145, D337, C117 | editing a template changes every invoice using it | Edits apply to new documents only; the PDF is stored at issue with its hash and template version | An issued invoice must never change.
13. A044 against D337 | hash-and-regenerate against stored PDF | Store the PDF at issue with its hash; A044 dup D337 | One copy of truth.
14. A196, C082, D230, D337, B039 | PDF file names: number only, firm plus number, number plus customer | Number with slashes replaced by hyphens | No slash, no personal data in a name.
15. B129, B190, W071, W018, D295, A077 | free numbering patterns, prefix up to 12 characters, against fixed PREFIX/YY-YY/NNNNN with 1 to 4 characters | Fixed format, 16 characters at most; B129 no | Rule 46 and portal limits.
16. A009, A240, D293 | next number settable against read-only | Settable upward only, before any document exists in the series this year | Migration needs it; gaps and reuse are barred.
17. D001, W019 | quote number at first send, invoice number at issue | Both kept; separate series, both gapless | Quotes never touch the invoice counter.
18. W039, A066 against D349, D382, D318 | hard delete of drafts against 30-day trash | Hard delete with a history row; trash is no or later | Drafts carry no tax weight.
19. C129 against W038 | 15-minute cancel after issue | no; void is owner-only, number stays used | Same outcome, one path.
20. W084 against B069 | void invoices excluded from the register against shown for reconciliation | Excluded from totals, listed as marked rows by a switch, always counted as cancelled in the documents-issued summary | Accountants need both views.
21. A121, B194 | rounding per line against shared-out differences | One rule: line tax half-up, total to the rupee with a round-off line; B194 no | Matches the return.
22. W024, K063, A111 | HSN digits 4, 6 or 8 against turnover band | 4, 6 or 8 accepted, minimum by turnover band; W024 fixed | Both are true.
23. W065, K067, A117, D388 | 30 November limit against exception | Refused with the exact date; only an owner may record a non-GST commercial credit | Section 34 stays honest.
24. A122, D328, A073 | B2CL threshold Rs 1 lakh against Rs 2.5 lakh; recipient detail at Rs 50,000 | Rs 1 lakh for B2CL tagging, Rs 50,000 for recipient detail; D328 dup A073 | The Rs 2.5 lakh figure is the pre-August-2024 limit; check again at build time.
25. W045, K076, A104, C202 | fake portal skips threshold against real flag and dated threshold | One provider adapter; a fake adapter with modes for tests; real flag stays | Tests and tax truth both served.
26. K056, K075, K071, W049 against the brief | multi-currency, export and SEZ deferred; no advances | Currency and export are in wave 1 (the brief names them); advances stay out with room left; K056 fixed | The brief wins over the old core.
27. B240, W049, D373, B083, B214, A030 | overpayment handling | Overpayment is refused in wave 1 with a plain message; on-account money and advances are room; credit notes still create customer credit | Receipt vouchers are a tax document needing their own build.
28. A058, D078, D079, A057, D179 | one against several bank accounts and GSTINs | One bank block and one GSTIN in wave 1, with room in the schema | Smallest firm first.
29. C011 against W001, W005 | customer with only a name against required type, state, address | Name only to start; type defaults business, state defaults the firm's; address needed when the invoice requires it | Speed at the desk, rules at issue.
30. W004, C067 against A052 | one GSTIN per customer against several | One per customer in wave 1; several is room | Multi-GSTIN needs branch pickers.
31. D016 against A063, K192 | item rules | D016 is the keeper | Fuller text.
32. A194, B036, D187 | logo limits 1 MB or 2 MB | 1 MB, PNG or JPG, 2000 px | Smaller print files.

## Money and collection
33. B138, C029, C028, D068 against A058, D073 | QR marks the invoice paid by itself | A UPI QR cannot confirm money; the owner records it, or confirms an I-have-paid claim (C030, C031); automation waits for a gateway | Money truth.
34. A032, D066 and the gateway group | payment link in wave 1 | Later, with room (source, reference and fee fields on payment) | Gateways bring KYC, webhooks, refunds, reconciliation.
35. W059 against C036, D372 | owner-only reversal against 10-second undo | Owner reverses with a reason; the recorder can undo within 10 seconds; the receipt number stays used | Mistyped amounts happen.
36. W088 against A209, A208, B048, D131, D137, B023 | reminders fixed, consolidated, tiered, rule-based, skipping Sundays | Fixed 1, 7, 15 days, one message per customer, 9 am to 7 pm IST, calendar days; Sunday skipping rejected, rules later | Fewest moving parts.
37. A034, B022, D134, D350 | promise date against expected payment date | One field with that meaning | Same idea.
38. D248, B001, B002, C041 | dashboard tiles | Four tiles (D248); B001 dup D248, B002 later | One screen.
39. A031, D362, A136 | cheque states | Cheque is a mode with reversal now; clearing states stay now only for bounce (A031), strict mode later | Cheques are common, strict mode is not.
40. B212, D093, K025 | credit refund deferred against needed | Refund recorded manually, numbered, never above balance | Customer credit must be able to reach zero.
41. A128, D160, C090 | export short-pay | Foreign payment records INR credited, bank charge and gain or loss (D160); A128 later | One place.

## Data, plans and law
42. A232, D271 | trial end read-only against moves to Free | Free, never blocked; read-only only after a lapsed paid plan; A232 fixed | D271 is gentler and keeps books open.
43. A068, A040, C095, B124, C207, D189, D266 | retention 8 years, 12 months, 6 years, delete after inactivity | At least 8 years, never purged for plan or inactivity; B124 no; A040 fixed | The brief says never lose a firm's books.
44. A143, A235, D229, B131, C096, C097 | export link 7 days or 30 days, rate-limited or not | 7 days, never blocked by plan, no rate limit on the owner's own export | A254 and A253.
45. A246, D215, D216 | Windows-1252 against UTF-8 only | Both; amounts cleaned; 5 MB and 5,000 rows | Excel from India saves in 1252.
46. D154, A061 | state list with 96 and 97 against "Other territory" | A061 keeps the GST codes | Codes beat labels.
47. A096, D114, B167, C214 | TDS sections named 194J, 194C | Shown with the Income-tax Act 2025 section names and the old numbers as aliases; table dated and product-owned | The new Act applies from April 2026; confirm names at build.
48. A010, D326, A216 | share link scope and statement link | One document per link; statement link later | Privacy.
49. A075, D338 | original and duplicate labels | D338 prints Original for Recipient on the stored copy; separate duplicate action later | One print.
50. A202-A204, B178, C020, C049 | WhatsApp API against click-to-chat | Click-to-chat with the share link now (C019); API later | No approval wait.
51. B100, B123, D268, B122 | plan limit text | Limits stated in users and issued invoices; one accountant seat free per firm | Plain.
52. D269, C101, C102, D278, A162 | what the free limit blocks | Only new issued invoices; credit notes, payments, voids and exports stay open; voided invoices still count | Numbers used are used.
53. A004, D194, C190, B028 | owner transfer and super owner | Transfer with acceptance; super owner is no | One owner concept.
54. A233, D206, D207 | outbound webhooks | Later with the API | One integration build.
55. A093, B050, D296, D297 | late fees | Taxed at the line's rate if billed; automatic fees later | Consent text first.
