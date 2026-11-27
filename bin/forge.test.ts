// The sample map passes. Each broken copy must fail with its own code: a check that cannot fail is not a check.
import { expect, test } from "bun:test";
import { join } from "node:path";
import { abilitiesOf, check, evidence, flat, library, load, ownerSheet, parseSchema, print, sample, todo, handoff } from "./forge.ts";

const SPEC = join(import.meta.dir, "..", "examples", "invoices", "spec"), lib = library();
const fresh = () => load(SPEC), codes = (m: any) => check(m, lib).errors.map(e => e.code);
const obj = (m: any, id: string) => m.objects.find((o: any) => o.id === id);
const scr = (m: any, id: string) => m.screens.screens.find((s: any) => s.id === id);

test("library: every kind answers every ability", () => {
  for (const [k, v] of Object.entries<any>(lib.kinds)) expect([k, ...Object.keys(v.abilities).sort()]).toEqual([k, ...Object.keys(lib.abilities).sort()]);
});
test("sample map passes", () => expect(check(fresh(), lib).errors).toEqual([]));

const breaks: [string, string, (m: any) => void][] = [
  ["BRIEF", "empty money model", m => (m.brief.money = "")],
  ["SIZE", "26 objects", m => { for (let i = 0; i < 24; i++) m.objects.push({ ...obj(m, "customer"), id: `x${i}` }); }],
  ["LEDGER", "date without proof", m => (m.ledger[0].since = "2020-01")],
  ["LEDGER", "fewer than three products", m => m.ledger.forEach((l: any) => (l.product = "One"))],
  ["KIND", "unknown kind", m => (obj(m, "customer").kinds = ["thing"])],
  ["LINK", "link to nowhere", m => (obj(m, "customer").links[0].to = "ghost")],
  ["ABILITY", "vague how", m => (obj(m, "invoice").abilities.approve.how = "yes")],
  ["ABILITY", "kinds disagree on edit", m => obj(m, "invoice").kinds.push("money")],
  ["QUESTION", "kind question unanswered", m => delete obj(m, "invoice").answers.freeze],
  ["TRACK", "state with no way out", m => delete obj(m, "invoice").tracks.document.states[2].end],
  ["TRACK", "state never reached", m => obj(m, "invoice").tracks.document.states.push({ id: "lost", end: true })],
  ["MOVE", "no reverse", m => delete obj(m, "invoice").tracks.document.moves[0].reverse],
  ["MOVE", "unknown role", m => (obj(m, "invoice").tracks.document.moves[0].who = ["nobody"])],
  ["FIELD", "text without limit", m => delete obj(m, "customer").fields[0].limit],
  ["LIST", "no filter for a track", m => (obj(m, "invoice").list.filters = ["document", "payment", "customer", "issued_at"])],
  ["LIST", "export without choices", m => delete obj(m, "invoice").list.export.formats],
  ["LIST", "bulk without what happens on failure", m => delete obj(m, "invoice").list.bulk_fail],
  ["QUERY", "sort without a query", m => obj(m, "invoice").list.sorts.push("note")],
  ["QUERY", "index without tenant", m => (obj(m, "invoice").queries[0].index = ["document", "payment", "issued_at"])],
  ["VOLUME", "no volume", m => delete obj(m, "customer").volume],
  ["REF", "reference not harvested", m => obj(m, "customer").refs.push("stripe/ghost")],
  ["EVIDENCE", "tag leads nowhere", m => (obj(m, "invoice").answers.freeze.e = ["stripe-999"])],
  ["EVIDENCE", "schema field that does not exist", m => (obj(m, "invoice").answers.paid.e = ["S:stripe/invoice.ghost"])],
  ["EVIDENCE", "no tag", m => delete obj(m, "invoice").answers.freeze.e],
  ["ROLE", "home does not exist", m => (m.roles.roles[0].home = "ghost")],
  ["ACCESS", "role silent about an object", m => delete m.roles.access.accountant.invoice],
  ["ACCESS", "nobody may merge", m => (m.roles.access.owner.customer = { do: ["view"], scope: "all" })],
  ["SCREEN", "move on no screen", m => (scr(m, "invoice").does = [])],
  ["SCREEN", "no way to reach it", m => (scr(m, "customers").from = ["ghost"])],
  ["STATE", "empty text missing", m => delete scr(m, "invoices").states.no_match],
  ["STATE", "shared state missing", m => delete m.screens.defaults.phone],
  ["JOURNEY", "moment skipped in silence", m => m.journeys.skip.pop()],
  ["JOURNEY", "button that does not exist", m => (m.journeys.journeys[0].steps[2].do = "invoice.approve")],
  ["JOURNEY", "action not allowed for the role", m => (m.journeys.journeys[2].steps[1].do = "invoice.import")],
  ["JOURNEY", "too many steps against the reference", m => (m.journeys.journeys[0].budget.ref_steps = 1)],
  ["MESSAGE", "never sent", m => m.messages.push({ ...m.messages[0], id: "lonely" })],
  ["RULE", "tax rule with one example", m => m.rules[1].examples.pop()],
  ["RULE", "money moves but no money rule", m => (m.rules = m.rules.filter((r: any) => r.area !== "money"))],
  ["CONNECTION", "area not decided", m => (m.connections = m.connections.filter((c: any) => c.area !== "move_out"))],
  ["CONNECTION", "no answer for broken", m => delete m.connections[0].broken],
  ["RUNNING", "no rollback", m => delete m.running.rollback],
  ["DAYONE", "day-one decision missing", m => delete m.running.day_one.D3],
  ["PRODUCTION", "restore test missing", m => delete m.running.production.P7],
  ["FLOW", "flow rule unanswered", m => delete m.running.flow.A7],
  ["RISK", "risk without a test", m => delete m.risks[0].test],
  ["FINDING", "open finding", m => m.findings.push({ id: "F1", status: "open" })],
  ["LEDGER", "row nobody uses", m => m.ledger.push({ ...m.ledger[0], id: "stripe-900" })],
  ["WIDE", "no wide list", m => (m.wide = [])],
  ["WIDE", "line lands on an ability that is no", m => (m.wide[3].at = ["invoice.merge"])],
  ["WIDE", "line lands on a rule that does not exist", m => (m.wide[3].at = ["rule:R99"])],
  ["WIDE", "refused without a reason", m => delete m.wide[8].why],
  ["PRODUCT", "area never opened", m => delete m.running.product.time_off],
  ["PRODUCT", "bare word instead of an answer", m => (m.running.product.home = "now: yes")],
  ["ABILITY", "object with nothing now", m => { const o = obj(m, "customer"); o.kinds = ["other"]; o.abilities = {}; }],
  ["QUESTION", "answer of one word three times", m => (obj(m, "invoice").answers.freeze.a = "zz zz zz")],
  ["WIDE", "lands on an inherited name", m => (m.wide[3].at = ["invoice.constructor"])],
  ["EVIDENCE", "schema field that is an inherited name", m => (obj(m, "invoice").answers.paid.e = ["S:stripe/invoice.toString"])],
  ["EVIDENCE", "one tag behind everything", m => { for (const o of m.objects) { for (const a of Object.values<any>(o.answers)) a.e = ["stripe-001", "erp-001"]; for (const t of Object.values<any>(o.tracks)) for (const x of t.moves) x.e = ["stripe-001", "erp-001"]; } }],
  ["REPEAT", "same sentence again and again", m => Object.values<any>(obj(m, "invoice").answers).forEach(a => (a.a = "It works like other products do"))],
  ["MOVE", "only the system ever acts", m => obj(m, "customer").tracks.lifecycle.moves.forEach((x: any) => (x.who = ["system"]))],
  ["MOVE", "reverse none without why", m => (obj(m, "invoice").tracks.document.moves[0].reverse = "none")],
  ["FIELD", "object with one field", m => (obj(m, "customer").fields.length = 1)],
  ["SCREEN", "one screen for everything", m => (scr(m, "invoices").shows = ["invoice", "customer", "invoice", "customer"])],
  ["JOURNEY", "journey that only reads", m => m.journeys.journeys[2].steps.forEach((s: any) => (s.do = "read"))],
  ["RULE", "empty examples", m => (m.rules[0].examples = [{ given: "", expect: "" }, { given: "", expect: "" }])],
  ["FINDING", "fixed without saying how", m => m.findings.push({ id: "F1", status: "fixed" })],
  ["SIZE", "size S for a whole product", m => { m.brief.size = "S"; for (let i = 0; i < 7; i++) m.objects.push({ ...obj(m, "customer"), id: `x${i}` }); }],
  ["ID", "id with a quote in it", m => (scr(m, "home").id = 'x"><img')],
  ["DUP", "same journey twice", m => m.journeys.journeys.push(m.journeys.journeys[0])],
  ["DUP", "same id twice", m => m.messages.push({ ...m.messages[0] })],
];
for (const [code, name, hurt] of breaks) test(`${code}: ${name}`, () => { const m = fresh(); hurt(m); expect(codes(m)).toContain(code); });

test("small size asks less", () => { const m = fresh(); m.brief.size = "S"; m.connections = []; m.running = {}; m.wide = []; expect(codes(m).filter(c => c !== "LEDGER")).toEqual([]); });
test("a short list needs no view, column or bulk tools", () => {
  const o = { kinds: ["master"], volume: { y1: 10, y3: 100 } };
  expect(abilitiesOf(o, lib).saved_view.d).toBe("later"); expect(abilitiesOf(o, lib).export.d).toBe("now");
  expect(abilitiesOf({ ...o, volume: { y1: 10, y3: 90000 } }, lib).saved_view.d).toBe("now");
});
test("evidence classes", () => {
  const m = fresh();
  expect(evidence(["stripe-001", "erp-001"], m).cls).toBe("strong");
  expect(evidence(["stripe-001", "stripe-002"], m).cls).toBe("single");
  expect(evidence(["ic-001"], m).cls).toBe("strong"); // law
  expect(evidence(["judge"], m).cls).toBe("judge");
  expect(evidence(["owner:Q1"], m).bad).toEqual(["owner:Q1"]); // not answered yet
});
test("the fuller kind wins, except where a decision is needed", () => {
  const o = { kinds: ["master", "document"] };
  expect(abilitiesOf(o, lib).import.clash).toBe(true);
  expect(abilitiesOf(o, lib).print_pdf.d).toBe("now");
});
test("printing", () => {
  const m = fresh(), prd = print(m, lib), own = ownerSheet(m, lib);
  expect(prd).toContain("| issue | draft | issued |"); expect(prd).not.toContain("undefined"); expect(prd).not.toContain("[object");
  expect(own).toContain("Take online payments"); expect(own).toContain("Ten random");
  expect(flat(m, lib).length).toBeGreaterThan(100); expect(sample(m, 10, lib).length).toBeGreaterThan(3);
});
test("harvest formats", () => {
  expect(Object.keys(parseSchema("prisma", "enum S {\n A\n B\n}\nmodel X {\n id Int\n status S\n}\n").objects.X.states)).toEqual(["status"]);
  expect(parseSchema("rails", 'create_table "a", force: :cascade do |t|\n    t.string "name"\n    t.index ["name"]\n  end').objects.a.fields).toEqual({ name: "string" });
  expect(parseSchema("openapi", '{"components":{"schemas":{"inv":{"properties":{"status":{"enum":["a","b"]},"old":{"type":"string","deprecated":true}}}}},"paths":{"/v1/inv":{"get":{"parameters":[{"in":"query","name":"status"}]}}}}').actions).toEqual(["GET /v1/inv ?status"]);
  expect(() => parseSchema("prisma", "nothing here")).toThrow();
});
test("mock holds every screen and runs as valid script", async () => {
  const { mock } = await import("./mock.ts"), html = mock(fresh(), lib), js = html.match(/<script>([\s\S]*)<\/script>/)![1];
  for (const s of fresh().screens.screens) expect(html).toContain(`"id":"${s.id}"`);
  expect(() => new Function(js)).not.toThrow();
  const evil = fresh(); evil.brief.name = "</script><b>x"; expect(mock(evil, lib).match(/<\/script>/g)!.length).toBe(1);
});
test("half-written files do not crash the check", () => {
  const m = fresh(); obj(m, "customer").links = [null]; m.ledger.push(null); m.objects.push(null); obj(m, "invoice").tracks.document.states.push(null); m.roles.roles.push(null);
  m.ledger = m.ledger.filter(Boolean); m.objects = m.objects.filter(Boolean); expect(() => check(m, lib)).not.toThrow();
});
test("an open decision is shown, not hidden", () => { expect(check(fresh(), lib).warnings.map(w => w.code)).toContain("DECISION"); expect(ownerSheet(fresh(), lib)).toContain("1 decisions wait"); });
test("command line: 0 when filled, 1 when not, 2 on a bad folder or name", () => {
  const run = (...a: string[]) => Bun.spawnSync(["bun", join(import.meta.dir, "forge.ts"), ...a]).exitCode, tmp = join(process.env.TMPDIR ?? "/tmp", `forge-${process.pid}`);
  expect(run("check", SPEC)).toBe(0); expect(run("init", tmp)).toBe(0); expect(run("check", tmp)).toBe(1); expect(run("init", tmp)).toBe(2); expect(run("check", "/no/such/folder")).toBe(2); expect(run("harvest", tmp, "../evil", "openapi", "x")).toBe(2);
});
test("harvest graphql and doctype", () => {
  const g = parseSchema("graphql", JSON.stringify({ data: { __schema: { mutationType: { fields: [{ name: "orderCancel" }] }, types: [{ kind: "ENUM", name: "St", enumValues: [{ name: "A" }] }, { kind: "ENUM", name: "WebhookTopic", enumValues: [{ name: "ORDERS_CREATE" }] }, { kind: "OBJECT", name: "Order", fields: [{ name: "status", type: { kind: "NON_NULL", ofType: { kind: "ENUM", name: "St" } } }, { name: "old", isDeprecated: true, deprecationReason: "use new", type: { kind: "SCALAR", name: "String" } }] }] } } }));
  expect(g.objects.Order.states.status).toEqual(["A"]); expect(g.objects.Order.fields.old).toContain("deprecated: use new"); expect(g.events).toEqual(["ORDERS_CREATE"]);
  expect(parseSchema("doctype", JSON.stringify({ name: "X", fields: [{ fieldname: "a", fieldtype: "Data", allow_on_submit: 1 }, { fieldname: "b", fieldtype: "Section Break" }, { fieldname: "status", fieldtype: "Select", options: "\nDraft\nPaid" }] })).objects.X.states.status).toEqual(["Draft", "Paid"]);
});
// The reviewer's hollow map (2026-11-26): it once passed with 0 errors.
test("a hollow map fails in many ways", () => {
  const m = fresh(), T = ["stripe-001", "erp-001"], z = "zz zz zz";
  for (const o of m.objects) Object.assign(o, { kinds: ["other"], tracks: {}, abilities: {}, list: {}, queries: [], links: [], refs: [], fields: [{ id: "f", type: "flag", required: false, edit: "anyone anytime" }], fields_e: T, answers: Object.fromEntries(Object.keys(lib.kinds.other.questions).map(q => [q, { a: z, e: T }])) });
  m.rules = []; m.messages = []; m.connections.forEach((c: any) => (c.e = T)); m.wide.forEach((w: any) => { w.d = "now"; w.at = ["invoice.view"]; }); m.screens.screens.forEach((s: any) => { s.does = []; s.shows = []; });
  m.journeys = { journeys: [{ id: "J1", role: "owner", moment: "daily", goal: z, done: z, steps: [{ screen: m.roles.roles[0].home, do: "read", fails: z }], budget: { steps: 1, e: T } }], skip: m.roles.roles.flatMap((r: any) => Object.keys(lib.base.moments).map(mo => ({ role: r.id, moment: mo, why: z }))) };
  m.ledger.forEach((l: any) => (l.skip = z));
  expect([...new Set(codes(m))].sort()).toEqual(["ABILITY", "FIELD", "JOURNEY", "LEDGER", "QUESTION"]);
});
test("todo: one id for everything that can be skipped, no id twice", () => {
  const ids = todo(fresh(), lib).map(x => x.id);
  for (const id of ["W001", "invoice.issue", "invoice.issue.refused", "invoice.tenant", "invoice?tax", "invoice?sort=due_at", "invoice>CSV", "accountant.customer.denied", "@invoices:no_match", "msg:tax_failed", "R2/2", "J1", "customer#name"]) expect(ids).toContain(id);
  expect(ids).not.toContain("W009"); expect(ids).not.toContain("customer.merge.refused"); expect(new Set(ids).size).toBe(ids.length);
});
test("several fillers may land lines at once; a wide line stands on its own source", async () => {
  const { cpSync, mkdirSync, writeFileSync, mkdtempSync } = await import("node:fs"), { tmpdir } = await import("node:os"), d = mkdtempSync(join(tmpdir(), "forge-land-"));
  cpSync(SPEC, d, { recursive: true }); mkdirSync(join(d, "land")); writeFileSync(join(d, "land", "x.yaml"), "W004: [invoice.void]\nW005: [invoice.issue]\n"); writeFileSync(join(d, "land", "y.yaml"), "W004: [rule:R3]\n");
  const m = load(d), at = (id: string) => m.wide.find((w: any) => w.id === id).at;
  expect(at("W004")).toEqual(["invoice.reverse", "rule:R1", "invoice.void", "rule:R3"]); expect(check(m, lib).errors).toEqual([]);
  m.wide[0].src = "https://www.stripe.com/x"; m.wide[1].src = "judge";
  expect(evidence(["wide:W001"], m).cls).toBe("single"); expect(evidence(["wide:W002"], m).cls).toBe("judge"); expect(evidence(["wide:W777"], m).bad).toEqual(["wide:W777"]);
});
test("judgement is reported, never forced", () => {
  const m = fresh(); Object.values<any>(obj(m, "customer").answers).forEach(a => (a.e = ["judge", "stripe-001"]));
  const r = check(m, lib); expect(r.errors.map(e => e.code)).not.toContain("JUDGE"); expect(r.warnings.map(w => w.code)).toContain("JUDGE");
});
test("a module prints alone and the book leaves the chapters out", () => {
  const m = fresh(); m.objects[1].module = "sales"; const mod = m.objects[1].module, one = print(m, lib, mod), book = print(m, lib, "book");
  expect(one).toContain(`### ${m.objects[1].name}`); expect(one).not.toContain(`### ${m.objects[0].name}`); expect(book).not.toContain("### "); expect(book).toContain("prd/sales.md"); expect(one + book).not.toContain("undefined");
});
test("a ledger row counts as used through its link", () => { const m = fresh(); m.ledger.push({ ...m.ledger[0], id: "stripe-901", url: "https://example.com/used" }); m.wide[0].src = "https://example.com/used"; expect(codes(m)).not.toContain("LEDGER"); });
test("handoff: every now line once, in the list, the ids and one module", () => {
  const f = handoff(fresh()), now = fresh().wide.filter((w: any) => w.d === "now").map((w: any) => w.id);
  expect(f["ids.txt"].trim().split("\n")).toEqual(now); for (const id of now) expect(f["REQUIREMENTS.md"]).toContain(id);
  expect(f["modules/billing/CONTEXT.md"]).toContain("W004"); expect(f["AGENTS.md"].split("\n").length).toBeLessThan(100); expect(Object.values(f).join()).not.toContain("undefined");
});
