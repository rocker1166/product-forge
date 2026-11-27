#!/usr/bin/env bun
// forge: checks and prints a product map (spec/*.yaml). One file, Bun only, no packages.
// It finds what is MISSING or unlinked. It cannot know what is wrong; people, walks and tests do that.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LIB = join(import.meta.dir, "..", "library");
const read = (p: string): any => {
  try { return Bun.YAML.parse(readFileSync(p, "utf8")); } catch (e: any) { throw new Error(`${p}: ${e.message}`); }
};
const arr = (v: any): any[] => (Array.isArray(v) ? v.filter(x => x != null) : v == null ? [] : [v]);
const has = (o: any, k: any) => o != null && typeof o === "object" && Object.hasOwn(o, String(k));
// counts DIFFERENT words, so "zz zz zz" is one
const said = (v: any, words = 1) => typeof v === "string" && new Set(v.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).size >= words;
const RANK: Record<string, number> = { now: 3, room: 2, later: 1, no: 0 };

export const library = () => ({
  abilities: read(join(LIB, "abilities.yaml")), kinds: read(join(LIB, "kinds.yaml")), base: read(join(LIB, "base.yaml")),
  dayOne: read(join(LIB, "day-one.yaml")), production: read(join(LIB, "production.yaml")), flow: read(join(LIB, "flow.yaml")), product: read(join(LIB, "product.yaml")),
});

export function load(dir: string): any {
  const one = (f: string, d: any) => (existsSync(join(dir, f)) ? read(join(dir, f)) ?? d : d);
  const files = (sub: string) => (existsSync(join(dir, sub)) ? readdirSync(join(dir, sub)).filter(f => f.endsWith(".yaml")).sort() : []);
  if (!existsSync(dir)) throw new Error(`${dir}: no such folder`);
  const many = (sub: string) => files(sub).flatMap(f => arr(read(join(dir, sub, f))));
  // land/*.yaml: { A001: [invoice.issue, rule:R1] }, one file per filler, so several can land lines at once
  const land: Record<string, string[]> = {};
  for (const f of files("land")) for (const [id, at] of Object.entries<any>(read(join(dir, "land", f)) ?? {})) land[id] = [...new Set([...(land[id] ?? []), ...arr(at)])];
  const wide = [...arr(one("wide.yaml", [])), ...many("wide")].map((w: any) => (land[w?.id] ? { ...w, at: [...arr(w.at), ...land[w.id]] } : w));
  return {
    brief: one("brief.yaml", {}), roles: one("roles.yaml", {}), screens: one("screens.yaml", {}), journeys: one("journeys.yaml", {}),
    messages: one("messages.yaml", []), rules: one("rules.yaml", []), connections: one("connections.yaml", []), running: one("running.yaml", {}),
    risks: one("risks.yaml", []), findings: one("findings.yaml", []), decisions: one("decisions.yaml", []), wide,
    ledger: [...arr(one("ledger.yaml", [])), ...many("ledger")], objects: many("objects"),
    refs: Object.fromEntries(files("refs").map(f => [f.replace(/\.yaml$/, ""), read(join(dir, "refs", f))])),
  };
}

// ---- what an object can do: its kinds give the default, the object writes only what differs
export function abilitiesOf(o: any, lib: any): Record<string, any> {
  const out: Record<string, any> = {};
  for (const id of Object.keys(lib.abilities)) {
    const own = o.abilities?.[id];
    if (own) { out[id] = { ...own, from: "own" }; continue; }
    const ds = arr(o.kinds).map(k => lib.kinds[k]?.abilities?.[id]).filter(Boolean);
    const best = [...ds].sort((a, b) => RANK[b.d] - RANK[a.d])[0] ?? { d: "room", how: "" };
    const clash = lib.base.decide.includes(id) && new Set(ds.map(x => x.d)).size > 1;
    const tiny = lib.base.big_list_only.includes(id) && best.d === "now" && o.volume?.y3 < lib.base.limits.big_list; // a short list needs no view, column or bulk tools
    out[id] = { ...best, ...(tiny ? { d: "later", how: `Short list. ${best.how}` } : {}), from: "kind", clash };
  }
  return out;
}
const moves = (o: any) => Object.entries(o.tracks ?? {}).flatMap(([track, t]: any) => arr(t?.moves).map((m: any) => ({ track, ...m })));

// ---- evidence: every tag must lead to something real
export function evidence(tags: any, m: any): { cls: "strong" | "single" | "judge" | "none"; bad: string[] } {
  const bad: string[] = [], products = new Set<string>(); let strong = false, judge = false;
  for (const t of arr(tags).map(String)) {
    if (t === "judge") judge = true;
    else if (t.startsWith("S:")) {
      const [, p, obj, field] = t.match(/^S:([^/]+)\/([^.]+)(?:\.(.+))?$/) ?? [];
      const o = p && has(m.refs, p) && has(m.refs[p].objects, obj) && m.refs[p].objects[obj];
      if (!o || (field && !has(o.fields, field) && !has(o.states, field))) bad.push(t); else products.add(p.toLowerCase());
    } else if (t.startsWith("owner:")) { if (m.decisions.some((d: any) => `owner:${d.id}` === t && d.answer)) strong = true; else bad.push(t); }
    else if (t.startsWith("walk:")) { if (m.findings.some((f: any) => `walk:${f.id}` === t)) strong = true; else bad.push(t); }
    else if (t.startsWith("wide:")) { // a wide line stands on its own source
      const w = m.wide.find((x: any) => `wide:${x.id}` === t), host = /^https?:\/\/(?:www\.)?([^/]+)/.exec(w?.src ?? "")?.[1];
      if (!w) bad.push(t); else if (host) products.add(host); else if (w.src === "judge") judge = true; else products.add("core study");
    } else {
      const row = m.ledger.find((l: any) => l.id === t);
      if (!row) bad.push(t); else { products.add(String(row.product).toLowerCase()); if (["request", "review", "law"].includes(row.kind)) strong = true; }
    }
  }
  return { cls: judge ? "judge" : strong || products.size > 1 ? "strong" : products.size === 1 ? "single" : "none", bad };
}

export function check(m: any, lib = library()) {
  const errors: { code: string; at: string; msg: string }[] = [], warnings: typeof errors = [];
  let asked = 0;
  const need = (ok: any, code: string, at: string, msg: string) => { asked++; if (!ok) errors.push({ code, at, msg }); return !!ok; };
  const warn = (ok: any, code: string, at: string, msg: string) => { if (!ok) warnings.push({ code, at, msg }); };
  const small = m.brief.size === "S";
  const cells: any[] = [];
  const cite = (e: any, at: string, what: string, obj = "") => {
    const r = evidence(e, m); asked++;
    if (r.cls === "none" && !r.bad.length) errors.push({ code: "EVIDENCE", at, msg: `no evidence tag on ${what}` });
    for (const b of r.bad) errors.push({ code: "EVIDENCE", at, msg: `tag "${b}" leads nowhere (${what})` });
    cells.push({ at, what, tags: arr(e), cls: r.cls, obj });
  };
  const objs = new Map<string, any>(m.objects.map((o: any) => [o.id, o]));
  const roles: any[] = arr(m.roles.roles), roleIds = new Set(roles.map(r => r.id));
  const screens: any[] = arr(m.screens.screens), screenIds = new Map(screens.map(s => [s.id, s]));
  const messageIds = new Set(m.messages.map((x: any) => x.id));
  const dup = (xs: any[], what: string) => xs.forEach((x, i) => { if (xs.findIndex(y => y.id === x.id) !== i) errors.push({ code: "DUP", at: what, msg: `id "${x.id}" is used twice` }); });
  dup(m.objects, "objects"); dup(screens, "screens"); dup(roles, "roles"); dup(m.messages, "messages"); dup(m.ledger, "ledger"); dup(m.rules, "rules"); dup(m.decisions, "decisions");
  dup(arr(m.journeys.journeys), "journeys"); dup(m.wide, "wide"); dup(m.connections, "connections"); dup(m.risks, "risks"); dup(m.findings, "findings");
  for (const [what, xs] of [["object", m.objects], ["screen", screens], ["role", roles], ["message", m.messages], ["move", m.objects.flatMap((o: any) => moves(o).map(x => ({ id: x.do })))]] as any)
    for (const x of xs) need(/^[A-Za-z][A-Za-z0-9_]*$/.test(x.id ?? ""), "ID", what, `"${x.id}" may hold only letters, numbers and _`);

  // BRIEF
  for (const k of ["name", "idea", "who", "job", "country", "money"]) need(said(m.brief[k]), "BRIEF", "brief", `${k} is empty`);
  for (const k of ["tenants", "custom_objects"]) need(typeof m.brief[k] === "boolean", "BRIEF", "brief", `${k} must be true or false`);
  need(arr(m.brief.must_never).length, "BRIEF", "brief", "must_never is empty");
  need(["S", "M", "L"].includes(m.brief.size), "BRIEF", "brief", "size must be S, M or L");
  if (small) need(m.objects.length <= 8, "SIZE", "brief", "size S is for one small module, eight objects or fewer");
  const most = m.brief.max_objects ?? lib.base.limits.objects; // a product may raise it in its brief, in writing
  need(m.objects.length && m.objects.length <= most, "SIZE", "objects", `${m.objects.length} objects; a wave holds 1 to ${most}. Split the wave`);

  // LEDGER
  for (const l of m.ledger) {
    need(l.id && said(l.product) && said(l.cap, 2) && /^https?:\/\//.test(l.url ?? "") && l.seen && ["schema", "docs", "changelog", "request", "review", "law"].includes(l.kind), "LEDGER", l.id ?? "?", "needs id, product, cap, url, seen, kind");
    if (l.since) need(l.since_proof, "LEDGER", l.id, "since needs since_proof (commit, release or changelog link)");
  }
  if (!small) need(new Set(m.ledger.map((l: any) => l.product)).size >= 3, "LEDGER", "ledger", "fewer than 3 reference products");
  const said_in = JSON.stringify([m.objects, m.rules, m.connections, m.messages, m.journeys, m.wide]);
  for (const l of m.ledger) need(said_in.includes(JSON.stringify(l.id)) || said_in.includes(JSON.stringify(l.url)) || said(l.skip, 3), "LEDGER", l.id ?? "?", "nothing in the map uses this row (use it, or skip: why)");
  // WIDE: the wide list of requirements found before objects were fixed. Every line must land somewhere or be refused in words.
  if (!small) need(m.wide.length, "WIDE", "wide", "no wide list; breadth comes first (see the skill, step 2)");
  for (const w of m.wide) {
    if (!need(w.id && said(w.text, 3) && has(RANK, w.d), "WIDE", w.id ?? "?", "needs id, text and d (now, room, later, no)")) continue;
    if (w.d === "no" || w.d === "later") need(said(w.why, 3) || lands(w.at, m, lib), "WIDE", w.id, `${w.d}: needs why, or at`);
    else need(arr(w.at).length && arr(w.at).every(a => lands(a, m, lib)), "WIDE", w.id, `lands nowhere: ${arr(w.at).filter(a => !lands(a, m, lib)).join(", ") || "at is empty"}`);
  }

  // OBJECTS
  for (const o of m.objects) {
    const at = o.id ?? "?", ab = abilitiesOf(o, lib), now = (id: string) => ab[id]?.d === "now";
    need(said(o.name) && said(o.module) && said(o.why, 3), "OBJECT", at, "needs name, module and why");
    if (!need(arr(o.kinds).length && arr(o.kinds).every(k => has(lib.kinds, k)), "KIND", at, `kinds must be from: ${Object.keys(lib.kinds).join(", ")}`)) continue;
    need(Array.isArray(o.links), "LINK", at, "links missing (use [] if none)");
    for (const l of arr(o.links)) { need(objs.has(l.to), "LINK", at, `links to unknown object "${l.to}"`); need(said(l.on_delete), "LINK", at, `link to ${l.to}: what happens on delete?`); }
    for (const [id, a] of Object.entries<any>(o.abilities ?? {})) {
      need(has(lib.abilities, id), "ABILITY", at, `unknown ability "${id}"`);
      need(has(RANK, a?.d) && said(a?.how, 3), "ABILITY", at, `${id}: needs d (now, room, later, no) and how (a full sentence)`);
      cite(a?.e, at, `ability ${id}`, o.id);
    }
    for (const [id, a] of Object.entries<any>(ab)) if (a.clash) need(false, "ABILITY", at, `its kinds disagree on ${id}; write the decision (${lib.abilities[id].ask})`);
    for (const k of arr(o.kinds)) for (const [q, v] of Object.entries<any>(lib.kinds[k].questions ?? {})) {
      const ans = o.answers?.[q];
      if (need(said(ans?.a, 3), "QUESTION", at, `${k}.${q}: ${v.q}`)) cite(ans.e, at, `answer ${q}`, o.id);
    }

    need(Object.values<any>(ab).some(a => a.d === "now"), "ABILITY", at, "nothing is now; what is this object for in this wave?");
    need(!moves(o).length || moves(o).some(x => arr(x.who).some(w => w !== "system")), "MOVE", at, "every move is by the system; which one does a person do?");
    // TRACKS
    for (const k of arr(o.kinds)) for (const t of arr(lib.kinds[k].tracks)) need(o.tracks?.[t], "TRACK", at, `kind ${k} needs a "${t}" track`);
    for (const [tid, t] of Object.entries<any>(o.tracks ?? {})) {
      const w = `${at}.${tid}`, st: any[] = arr(t?.states), ids = new Set(st.map(s => s.id)), mv: any[] = arr(t?.moves);
      need(st.length > 1 && ids.size === st.length, "TRACK", w, "needs two or more different states");
      need(st.filter(s => s.start).length === 1, "TRACK", w, "needs exactly one start state");
      const seen = new Set(st.filter(s => s.start).map(s => s.id));
      for (let grew = true; grew; ) { grew = false; for (const x of mv) for (const f of arr(x.from)) if (seen.has(f) && !seen.has(x.to)) { seen.add(x.to); grew = true; } }
      for (const s of st) {
        need(seen.has(s.id), "TRACK", w, `state "${s.id}" cannot be reached`);
        need(s.end || mv.some(x => arr(x.from).includes(s.id)), "TRACK", w, `state "${s.id}" has no way out (mark end: true if final)`);
      }
      for (const x of mv) {
        const mw = `${w}.${x.do ?? "?"}`;
        need(said(x.do) && ids.has(x.to) && arr(x.from).length && arr(x.from).every(f => ids.has(f)), "MOVE", mw, "needs do, from and to that exist");
        need(arr(x.who).length && arr(x.who).every(r => r === "system" || roleIds.has(r)), "MOVE", mw, "who must be known roles or system");
        need(/^none/i.test(x.reverse ?? "") ? /^none: /.test(x.reverse) && said(x.reverse, 4) : said(x.reverse), "MOVE", mw, 'reverse: how is it undone? (or "none: why")');
        need(x.notify === "none" || (arr(x.notify).length && arr(x.notify).every(n => messageIds.has(n))), "MOVE", mw, "notify must be none or known message ids");
        cite(x.e, mw, "move", o.id);
      }
    }

    // FIELDS
    need(arr(o.fields).length >= 3, "FIELD", at, `${arr(o.fields).length} fields; three or more`);
    for (const f of arr(o.fields)) {
      const fw = `${at}.${f.id ?? "?"}`;
      need(f.id && f.type && typeof f.required === "boolean" && said(f.edit), "FIELD", fw, "needs id, type, required and edit (who may change it, when)");
      if (["text", "long_text", "number", "money", "file"].includes(f.type)) need(f.limit != null, "FIELD", fw, `${f.type} needs a limit`);
      if (f.required || f.limit != null) need(said(f.msg, 3) || f.auto, "FIELD", fw, "needs msg (what the person reads when it is wrong) or auto: true");
    }
    cite(o.fields_e, at, "fields", o.id);

    // LIST
    const li = o.list ?? {}, inList = ["search", "filter", "sort", "export", "bulk", "import"].some(now);
    if (inList && need(o.list, "LIST", at, "no list block")) {
      need(arr(li.columns).length >= 2 && said(li.default_sort) && li.page, "LIST", at, "needs columns (2 or more), default_sort, page");
      if (now("search")) need(arr(li.search).length, "LIST", at, "search is now, but which fields?");
      if (now("filter")) { need(arr(li.filters).length, "LIST", at, "filter is now, but no filters"); for (const t of Object.keys(o.tracks ?? {})) need(arr(li.filters).includes(t), "LIST", at, `no filter for the "${t}" track`); }
      if (now("sort")) need(arr(li.sorts).length, "LIST", at, "sort is now, but no sorts");
      if (now("bulk")) need(arr(li.bulk).length && said(li.bulk_fail, 3), "LIST", at, "bulk is now: which actions, and bulk_fail (what if some rows fail)?");
      if (now("saved_view")) need(arr(li.views).length, "LIST", at, "saved_view is now, but no starting views");
      if (now("export")) need(li.export && ["rows", "what", "formats"].every(k => arr(li.export[k]).length) && said(li.export.big, 2), "LIST", at, "export needs rows, what, formats and big (what happens when it is large)");
      if (now("import")) need(li.import && said(li.import.match, 2) && said(li.import.errors, 2) && li.import.limit, "LIST", at, "import needs match, errors and limit");
      cite(li.e, at, "list", o.id);
    }

    // VOLUME AND QUERIES
    need(o.volume?.y1 > 0 && o.volume?.y3 > 0, "VOLUME", at, "volume.y1 and volume.y3 (rows) missing");
    const qs: any[] = arr(o.queries);
    if (o.volume?.y3 >= 5000) {
      const covered = new Set(qs.flatMap(q => [...arr(q.filters), ...arr(q.sort).map((s: string) => s.replace(/^-/, ""))]));
      for (const f of [...arr(li.filters), ...arr(li.sorts).map((s: string) => s.replace(/^-/, ""))]) need(covered.has(f), "QUERY", at, `"${f}" is filtered or sorted but is in no query`);
      for (const q of qs) {
        const ix = arr(q.index), w = `${at}.${q.id ?? "?"}`;
        need(q.id && q.p95 && (ix.length || said(q.no_index, 3)), "QUERY", w, "needs id, p95 and index (or no_index: why)");
        if (ix.length) {
          if (m.brief.tenants) need(ix[0] === "tenant", "QUERY", w, "index must start with tenant");
          for (const f of [...arr(q.filters), ...arr(q.sort).map((s: string) => s.replace(/^-/, ""))]) need(ix.includes(f), "QUERY", w, `index does not hold "${f}"`);
        }
      }
    }
    // DEPTH
    for (const r of arr(o.refs)) {
      const [p, name] = String(r).split("/"), ref = m.refs[p]?.objects?.[name];
      if (!need(ref, "REF", at, `refs "${r}" not harvested`)) continue;
      const n = Object.keys(ref.fields ?? {}).length;
      warn(arr(o.fields).length >= n * 0.25, "DEPTH", at, `${arr(o.fields).length} fields against ${n} in ${r}; is it thin?`);
    }
  }

  // ROLES AND ACCESS
  need(roles.length, "ROLE", "roles", "no roles");
  const mayDo = (role: string, obj: any, act: string) => {
    const mv = moves(obj).find(x => x.do === act); if (mv) return arr(mv.who).includes(role);
    const a = m.roles.access?.[role]?.[obj.id]; if (!a || a === "none") return false;
    const list = a === "*" ? "*" : a.do ?? a; return list === "*" || arr(list).includes(act);
  };
  for (const r of roles) {
    need(said(r.name) && said(r.joins, 2) && said(r.leaves, 2), "ROLE", r.id, "needs name, joins (how they get in) and leaves (what happens to their work)");
    need(screenIds.has(r.home), "ROLE", r.id, `home screen "${r.home}" does not exist`);
    for (const o of m.objects) {
      const a = m.roles.access?.[r.id]?.[o.id];
      if (!need(a != null, "ACCESS", `${r.id} × ${o.id}`, "no answer (write none if no access)")) continue;
      if (a !== "none" && a !== "*") need(a.do && ["own", "team", "all"].includes(a.scope), "ACCESS", `${r.id} × ${o.id}`, "needs do and scope (own, team, all)");
    }
  }
  const onScreen = (o: any, act: string) => screens.some(s => canOn(s, o, act, lib));
  for (const o of m.objects) {
    const ab = abilitiesOf(o, lib);
    for (const [id, a] of Object.entries<any>(ab)) {
      if (a.d !== "now" || !["list", "form", "detail"].includes(lib.abilities[id].on)) continue;
      need(roles.some(r => mayDo(r.id, o, id)), "ACCESS", o.id, `nobody may ${id}`);
      need(onScreen(o, id), "SCREEN", o.id, `${id} is now, but no screen offers it`);
    }
    for (const x of moves(o)) if (arr(x.who).some(w => w !== "system")) need(onScreen(o, x.do), "SCREEN", o.id, `move ${x.do} is on no screen`);
  }

  // SCREENS
  const reach = new Set<string>(["menu", "link", ...roles.map(r => r.home)]);
  for (let grew = true; grew; ) { grew = false; for (const s of screens) if (!reach.has(s.id) && arr(s.from).some(f => reach.has(f))) { reach.add(s.id); grew = true; } }
  for (const s of screens) {
    need(s.id && s.path && s.type && said(s.primary) && arr(s.for).length && arr(s.for).every(r => roleIds.has(r)), "SCREEN", s.id ?? "?", "needs id, path, type, primary and for (known roles)");
    if (["list", "detail", "form"].includes(s.type)) need(arr(s.shows).length <= 3, "SCREEN", s.id, `shows ${arr(s.shows).length} objects; split it`);
    need(reach.has(s.id), "SCREEN", s.id, "no way to reach it from any home, menu or link");
    for (const x of arr(s.shows)) need(objs.has(x), "SCREEN", s.id, `shows unknown object "${x}"`);
    for (const d of arr(s.does)) { const [ob, act] = String(d).split("."); const o = objs.get(ob); need(o && (has(lib.abilities, act) || moves(o).some(x => x.do === act)), "SCREEN", s.id, `does unknown action "${d}"`); }
    const st = lib.base.screen_states[s.type === "board" ? "list" : s.type] ?? lib.base.screen_states.other;
    for (const k of st.own) need(said(s.states?.[k], 4), "STATE", s.id, `${k}: write the real words for this screen`);
    for (const k of st.shared) need(said(s.states?.[k] ?? m.screens.defaults?.[k], 3), "STATE", s.id, `${k}: no answer here or in defaults`);
  }

  // JOURNEYS: people may only press what exists
  const js: any[] = arr(m.journeys.journeys), skip: any[] = arr(m.journeys.skip);
  for (const r of roles) for (const mo of Object.keys(lib.base.moments)) {
    if (small && !["daily", "mistake"].includes(mo)) continue;
    need(js.some(j => j.role === r.id && j.moment === mo) || skip.some(s => s.role === r.id && s.moment === mo && said(s.why, 3)), "JOURNEY", `${r.id} × ${mo}`, "no journey and no written reason to skip");
  }
  for (const j of js) {
    const at = j.id ?? "?", steps: any[] = arr(j.steps);
    need(steps.some(s => /\./.test(s.do ?? "")), "JOURNEY", at, "no step does anything (only read, nav or wait)");
    need(said(j.goal, 3) && said(j.done, 3) && steps.length, "JOURNEY", at, "needs goal, steps and done (what they see at the end)");
    if (need(j.budget?.steps >= steps.length, "JOURNEY", at, `budget.steps missing or smaller than ${steps.length}`)) cite(j.budget.e, at, "flow budget");
    if (j.budget?.ref_steps) need(steps.length <= j.budget.ref_steps + 1, "JOURNEY", at, `${steps.length} steps; the reference needs ${j.budget.ref_steps}. At most one more`);
    steps.forEach((s, i) => {
      const w = `${at}#${i + 1}`, sc = screenIds.get(s.screen);
      if (!need(sc, "JOURNEY", w, `screen "${s.screen}" does not exist`)) return;
      need(arr(sc.for).includes(j.role), "JOURNEY", w, `${j.role} may not open ${s.screen}`);
      need(said(s.fails, 2), "JOURNEY", w, "fails: what if this step goes wrong?");
      if (["read", "nav", "wait"].includes(s.do)) return;
      const [ob, act] = String(s.do).split("."), o = objs.get(ob);
      if (!need(o, "JOURNEY", w, `unknown action "${s.do}"`)) return;
      const ok = abilitiesOf(o, lib)[act]?.d === "now" || moves(o).some(x => x.do === act);
      if (need(ok, "JOURNEY", w, `STUCK: ${s.do} does not exist in this wave`)) { need(mayDo(j.role, o, act), "JOURNEY", w, `STUCK: ${j.role} may not ${s.do}`); need(canOn(sc, o, act, lib), "JOURNEY", w, `STUCK: ${s.do} is not on ${s.screen}`); }
    });
  }

  // MESSAGES
  const used = new Set(m.objects.flatMap((o: any) => moves(o).flatMap(x => (x.notify === "none" ? [] : arr(x.notify)))));
  for (const x of m.messages) {
    need(said(x.text, 3) && arr(x.to).length && arr(x.channels).length && x.mute != null, "MESSAGE", x.id, "needs text, to, channels and mute");
    const on = String(x.on ?? ""), timed = /^(time|job|event):/.test(on), [ob, act] = on.split(".");
    need(timed || (objs.has(ob) && moves(objs.get(ob)).some(v => v.do === act)), "MESSAGE", x.id, `on "${on}" is not a move, time:, job: or event:`);
    if (!timed) need(used.has(x.id), "MESSAGE", x.id, "no move sends it");
    cite(x.e, x.id, "message");
  }

  // RULES AND CONNECTIONS
  for (const r of m.rules) {
    need(r.id && ["money", "tax", "time", "law", "limit"].includes(r.area) && said(r.rule, 4), "RULE", r.id ?? "?", "needs id, area (money, tax, time, law, limit) and rule");
    need(arr(r.examples).filter(e => said(String(e?.given ?? "")) && said(String(e?.expect ?? ""))).length >= (["money", "tax"].includes(r.area) ? 2 : 1), "RULE", r.id, "needs worked examples with given and expect (two for money and tax)");
    cite(r.e, r.id, "rule");
  }
  if (m.objects.some((o: any) => arr(o.kinds).some(k => ["document", "money"].includes(k)))) need(m.rules.some((r: any) => r.area === "money"), "RULE", "rules", "money moves here but there is no money rule");
  if (!small) for (const [a, label] of Object.entries<any>(lib.base.areas)) need(m.connections.some((c: any) => c.area === a), "CONNECTION", a, `nothing decided for ${label}`);
  for (const c of m.connections) {
    need(c.id && has(RANK, c.d) && said(c.what, 3), "CONNECTION", c.id ?? "?", "needs id, d and what");
    if (c.d === "now" && !["move_in", "move_out", "api"].includes(c.area)) for (const k of ["setup", "test", "broken", "off"]) need(said(c[k], 2), "CONNECTION", c.id, `${k} missing (setup, test, when broken, when switched off)`);
    cite(c.e, c.id, "connection");
  }

  // RUNNING IT
  if (!small) {
    for (const k of ["seed", "rollout", "rollback"]) need(said(m.running[k], 3), "RUNNING", "running", `${k} is empty`);
    for (const k of ["settings", "support", "events"]) need(arr(m.running[k]).length, "RUNNING", "running", `${k} is empty`);
    for (const id of Object.keys(lib.dayOne)) need(said(m.running.day_one?.[id], 3), "DAYONE", id, lib.dayOne[id].ask);
    for (const id of Object.keys(lib.production)) need(said(m.running.production?.[id], 2), "PRODUCTION", id, lib.production[id].ask);
    for (const id of Object.keys(lib.product)) need(/^(now|room|later|no): \S+( \S+){2,}/.test(m.running.product?.[id] ?? ""), "PRODUCT", id, lib.product[id].ask);
    for (const id of Object.keys(lib.flow)) need(m.running.flow?.[id] === "yes" || m.running.flow?.[id] === true || /^no: .{5,}/.test(m.running.flow?.[id] ?? ""), "FLOW", id, lib.flow[id].rule);
  }
  for (const r of m.risks) need(said(r.assumption, 3) && said(r.test, 3) && r.result, "RISK", r.id ?? "?", "needs assumption, a cheap test and result (open, passed, failed)");
  for (const f of m.findings) need((f.status === "fixed" && said(f.fix, 3)) || (f.status === "rejected" && said(f.why, 3)), "FINDING", f.id ?? "?", "still open (fixed with fix, or rejected with why)");

  // EVIDENCE MIX
  for (const o of m.objects) {
    const mine = cells.filter(c => c.obj === o.id), judge = mine.filter(c => c.cls === "judge").length;
    if (mine.length && !small) warn(judge / mine.length <= lib.base.limits.judge, "JUDGE", o.id, `${Math.round((100 * judge) / mine.length)}% of its ${mine.length} answers rest on judgement`); // a warning: a hard limit made a filler swap honest tags for loosely related ones
  }
  const by = new Map<string, number>(); for (const c of cells) for (const x of new Set(c.tags)) by.set(x, (by.get(x) ?? 0) + 1);
  if (cells.length > 30) for (const [x, n] of by) if (x !== "judge") need(n / cells.length <= 0.4, "EVIDENCE", x, `one tag stands behind ${n} of ${cells.length} answers`);
  const texts = new Map<string, number>(), hear = (v: any) => typeof v === "string" && v.length > 8 && texts.set(v.toLowerCase().trim(), (texts.get(v.toLowerCase().trim()) ?? 0) + 1);
  for (const o of m.objects) { for (const a of Object.values<any>(o.answers ?? {})) hear(a?.a); for (const a of Object.values<any>(o.abilities ?? {})) hear(a?.how); }
  for (const j of js) for (const s of arr(j.steps)) hear(s.sees); for (const w of m.wide) hear(w.why); for (const l of m.ledger) hear(l.skip); for (const s of skip) hear(s.why);
  for (const [x, n] of texts) need(n <= 3, "REPEAT", "texts", `the same words ${n} times: "${x.slice(0, 60)}"`);
  const landed = new Map<string, number>(); for (const w of m.wide) for (const a of arr(w.at)) landed.set(a, (landed.get(a) ?? 0) + 1);
  if (m.wide.length > 30) for (const [x, n] of landed) need(n / m.wide.length <= 0.1, "WIDE", x, `${n} of ${m.wide.length} wide lines land on this one place`);
  for (const d of m.decisions) warn(d.answer, "DECISION", d.id, `waiting for the owner: ${d.q}`);
  for (const o of m.objects) warn(roles.length < 2 || !roles.every(r => m.roles.access?.[r.id]?.[o.id] === "*"), "ACCESS", o.id, "every role may do everything; is that right?");
  const mix: Record<string, number> = {}; for (const c of cells) mix[c.cls] = (mix[c.cls] ?? 0) + 1;
  const noShare = Object.fromEntries(m.objects.map((o: any) => { const ab = Object.values<any>(abilitiesOf(o, lib)); return [o.id, Math.round((100 * ab.filter(a => a.d === "no").length) / ab.length)]; }));
  return { errors, warnings, asked, filled: asked - errors.length, mix, noShare, cells };
}

// Where a wide line may land: object.ability|move|field|question|filter · screen:x · rule:x · message:x · connection:x · role:x · product:x · setting:text
export function lands(at: any, m: any, lib: any): boolean {
  const [kind, id] = String(at ?? "").includes(":") ? String(at).split(/:(.*)/s) : ["", ""];
  const listed = (xs: any) => arr(xs).some(x => x.id === id);
  if (kind === "screen") return listed(m.screens.screens); if (kind === "rule") return listed(m.rules); if (kind === "message") return listed(m.messages);
  if (kind === "connection") return listed(m.connections); if (kind === "role") return listed(m.roles.roles); if (kind === "product") return has(m.running.product, id);
  if (kind === "setting") return said(id, 1) && arr(m.running.settings).some(s => JSON.stringify(s).toLowerCase().includes(id.toLowerCase()));
  const [ob, act] = String(at ?? "").split(/\.(.*)/s), o = m.objects.find((x: any) => x.id === ob); if (!o || !act) return false;
  return (has(lib.abilities, act) && abilitiesOf(o, lib)[act]?.d !== "no") || moves(o).some(x => x.do === act) || arr(o.fields).some(f => f.id === act) || has(o.answers, act) || [...arr(o.list?.filters), ...arr(o.list?.views), ...arr(o.list?.bulk)].includes(act);
}

function canOn(s: any, o: any, act: string, lib: any): boolean {
  if (arr(s.does).includes(`${o.id}.${act}`)) return true;
  if (!arr(s.shows).includes(o.id)) return false;
  const on = lib.abilities[act]?.on; if (!on) return false;
  return (s.type === "list" || s.type === "board") ? on === "list" || act === "create" : s.type === "form" ? on === "form" : s.type === "detail" ? on === "detail" || act === "view" : false;
}

// ---- printing
const list = (v: any) => arr(v).map(x => (typeof x === "object" ? JSON.stringify(x) : x)).join(", ");
// Hand a finished PRD to builders: the frozen list, the ids for the gate, a short root AGENTS.md and one CONTEXT.md per module.
// Generated, never hand-written: context files written by an agent from the code gave no gain and cost more (research/06).
export function handoff(m: any): Record<string, string> {
  const now = m.wide.filter((w: any) => w.d === "now"), mod = (w: any) => { const c: Record<string, number> = {}; for (const a of arr(w.at)) { const o = m.objects.find((x: any) => x.id === String(a).split(".")[0]); if (o) c[o.module] = (c[o.module] ?? 0) + 1; } return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "product"; };
  const mods = [...new Set([...m.objects.map((o: any) => o.module), ...now.map(mod)])] as string[], files: Record<string, string> = {};
  files["REQUIREMENTS.md"] = mods.map(x => `## ${x}\n` + now.filter((w: any) => mod(w) === x).map((w: any) => `${w.id} ${w.text}`).join("\n")).join("\n\n") + "\n";
  files["ids.txt"] = now.map((w: any) => w.id).join("\n") + "\n";
  for (const x of mods) {
    const os = m.objects.filter((o: any) => o.module === x), links = [...new Set(os.flatMap((o: any) => arr(o.links).map(l => m.objects.find((y: any) => y.id === l.to)?.module).filter((y: any) => y && y !== x)))];
    files[`modules/${x}/CONTEXT.md`] = [`# Module: ${x}`, "", `Owns: ${os.map((o: any) => `${o.name} (${o.why})`).join("; ") || "product-wide rules"}`, `Talks to: ${links.join(", ") || "nothing"}. Use their public functions only; never their tables.`, `Code: src/${x}/ only. Tests name requirement ids in [brackets].`, `Full detail: ../../prd/${x}.md (states, guards, fields, lists, messages). Rules with worked numbers: ../../prd/rules.md.`, "", "## Requirements", ...now.filter((w: any) => mod(w) === x).map((w: any) => `- ${w.id} ${w.text}`), "", "## Traps (add what bit you)", "- none yet", ""].join("\n");
  }
  files["AGENTS.md"] = [`# ${m.brief.name}`, "", m.brief.idea, "", "## Commands", "- Gate (the only meaning of done): `bun ~/product-forge/bin/gate.ts` (other stacks: `gate.ts ids.txt results.xml`)", "- Tests, build, run: fill in when the skeleton exists", "", "## Rules",
    "- Scope is REQUIREMENTS.md. Anything else needs a written decision.", "- Every requirement needs a real passing test whose name holds its id, like [W042]. Never a test that passes without the behaviour.", "- API.md is the contract: change it in the same step as the code.", "- One owner per folder. Bugs in someone else's files go to NOTES.md.", "- Money in minor units, time stored in UTC and shown in the user's zone, tenant on every row and first in every index.", "- The one who built never scores; a separate reviewer uses the running app.", "",
    "## Modules", "| Module | Requirements | Context |", "|---|---|---|", ...mods.map(x => `| ${x} | ${now.filter((w: any) => mod(w) === x).length} | modules/${x}/CONTEXT.md |`), "",
    "## Always / ask first / never", "- Always: read the module's CONTEXT.md and run the gate before saying done.", "- Ask first: new dependency, schema change in another module, changing a requirement.", "- Never: edit tests to pass, push, deploy, or touch production data.", ""].join("\n");
  files["PROGRESS.md"] = `# Progress\n\nOne line per session: date, who, what changed, gate result, what is next.\n`;
  return files;
}

export function flat(m: any, lib = library()): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = []; const add = (text: string) => out.push({ id: `C${String(out.length + 1).padStart(4, "0")}`, text: text.replace(/\s+/g, " ") });
  for (const o of m.objects) {
    for (const [id, a] of Object.entries<any>(abilitiesOf(o, lib))) if (a.d !== "no") add(`${o.name}: ${id.replace(/_/g, " ")} (${a.d}). ${a.how ?? ""}`);
    for (const x of moves(o)) add(`${o.name}: ${x.do} moves ${x.track} from ${list(x.from)} to ${x.to}, by ${list(x.who)}. ${x.effect ?? ""} Undo: ${x.reverse}`);
    for (const [q, a] of Object.entries<any>(o.answers ?? {})) add(`${o.name}, ${q.replace(/_/g, " ")}: ${a.a}`);
    if (o.fields) add(`${o.name} fields: ${arr(o.fields).map(f => f.id).join(", ")}`);
    if (o.list) { add(`${o.name} list filters: ${list(o.list.filters)}; sorts: ${list(o.list.sorts)}; views: ${list(o.list.views)}`); if (o.list.bulk) add(`${o.name} bulk: ${list(o.list.bulk)}`); if (o.list.export) add(`${o.name} export: rows ${list(o.list.export.rows)}; ${list(o.list.export.what)}; ${list(o.list.export.formats)}; ${o.list.export.big}`); }
  }
  for (const w of arr(m.wide)) if (w.d !== "no") add(`${w.text}${w.d === "now" ? "" : ` (${w.d})`}`);
  for (const [k, v] of Object.entries<any>(m.running.product ?? {})) if (!/^no:/.test(v)) add(`${k.replace(/_/g, " ")}: ${v}`);
  for (const x of arr(m.messages)) add(`Message ${x.id} to ${list(x.to)} by ${list(x.channels)}: ${x.text}`);
  for (const r of arr(m.rules)) add(`Rule (${r.area}): ${r.rule}`);
  for (const c of arr(m.connections)) if (c.d !== "no") add(`Connection ${c.area} (${c.d}): ${c.what}`);
  for (const s of arr(m.running.settings)) add(`Setting: ${typeof s === "object" ? JSON.stringify(s) : s}`);
  for (const s of arr(m.running.support)) add(`Support tool: ${typeof s === "object" ? JSON.stringify(s) : s}`);
  return out;
}

// What a builder must prove: one id per thing that can be skipped. A test named [id] closes it.
export function todo(m: any, lib = library()): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [], add = (id: string, text: string) => out.push({ id, text: text.replace(/\s+/g, " ").slice(0, 200) });
  for (const w of m.wide) if (w.d === "now") add(w.id, w.text);
  for (const o of m.objects) {
    const ab = abilitiesOf(o, lib), inList = ["search", "filter", "sort", "saved_view", "columns", "group", "bulk", "export", "import"];
    add(`${o.id}.tenant`, `${o.name}: another tenant's id is not found, not listed, not searchable, not exported`);
    for (const [id, a] of Object.entries<any>(ab)) if (a.d === "now" && !inList.includes(id) && ["list", "form", "detail"].includes(lib.abilities[id].on)) add(`${o.id}.${id}`, a.how);
    for (const x of moves(o)) { add(`${o.id}.${x.do}`, `${list(x.from)} to ${x.to}. ${x.effect ?? ""}`); add(`${o.id}.${x.do}.refused`, `not from any other state${x.guard ? `; only if ${x.guard}` : ""}; not by ${roleIdsNot(m, x.who)}`); }
    for (const f of arr(o.fields)) if (!f.auto && (f.required || f.limit != null)) add(`${o.id}#${f.id}`, `${f.required ? "required. " : ""}limit ${f.limit ?? "none"}. Says: ${f.msg}`);
    const l = o.list ?? {}, on = (a: string) => ab[a]?.d === "now";
    if (on("search")) add(`${o.id}?search`, list(l.search)); if (on("filter")) for (const f of arr(l.filters)) add(`${o.id}?${f}`, "filter, kept in the address");
    if (on("sort")) for (const s of arr(l.sorts)) add(`${o.id}?sort=${s}`, "sort"); if (on("bulk")) for (const b of arr(l.bulk)) add(`${o.id}!${b}`, `bulk. ${l.bulk_fail ?? ""}`);
    if (on("export")) for (const f of arr(l.export?.formats)) add(`${o.id}>${f}`, `export ${list(l.export.what)}; rows ${list(l.export.rows)}`);
    for (const ro of arr(m.roles.roles)) { const a = m.roles.access?.[ro.id]?.[o.id]; if (a !== "*") add(`${ro.id}.${o.id}.denied`, a === "none" ? "everything refused" : `everything refused except ${list(a?.do)}`); }
  }
  for (const s of arr(m.screens.screens)) { add(`@${s.id}`, `${s.path}: opens, main action ${s.primary}`); const st = lib.base.screen_states[s.type === "board" ? "list" : s.type] ?? lib.base.screen_states.other; for (const k of st.own) add(`@${s.id}:${k}`, s.states?.[k] ?? ""); }
  for (const x of m.messages) add(`msg:${x.id}`, `${x.on} to ${list(x.to)}: ${x.text}`);
  for (const x of m.rules) arr(x.examples).forEach((e, i) => add(`${x.id}/${i + 1}`, `${e.given} → ${e.expect}`));
  for (const j of arr(m.journeys.journeys)) add(j.id, `${j.role}: ${j.goal}`);
  return out;
}
const roleIdsNot = (m: any, who: any) => arr(m.roles.roles).map(r => r.id).filter(r => !arr(who).includes(r)).join(", ") || "nobody else";

// whole map in one text; with `module`, only that module's objects and what touches them; with "book", everything but the object chapters
export function print(m: any, lib = library(), part = ""): string {
  const r = check(m, lib), L: string[] = [], p = (...x: string[]) => L.push(...x);
  const tbl = (head: string[], rows: any[][]) => { if (!rows.length) return; p(`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map(x => `| ${x.map(c => String(c ?? "").replace(/\|/g, "/").replace(/\n/g, " ")).join(" | ")} |`), ""); };
  const chapter = (o: any) => {
    const ab = abilitiesOf(o, lib);
    p(`### ${o.name}`, "");
    tbl(["Can do", "How"], Object.entries<any>(ab).filter(([, a]) => a.d === "now").map(([id, a]) => [id.replace(/_/g, " "), a.how]));
    for (const d of ["room", "later", "no"]) { const x = Object.entries<any>(ab).filter(([, a]) => a.d === d); if (x.length) p(`**${d}:** ${x.map(([id, a]) => (a.from === "own" ? `${id.replace(/_/g, " ")} (${a.how})` : id.replace(/_/g, " "))).join("; ")}`, ""); }
    tbl(["Question", "Answer"], Object.entries<any>(o.answers ?? {}).map(([q, a]) => [q.replace(/_/g, " "), a.a]));
    for (const [tid, t] of Object.entries<any>(o.tracks ?? {})) { p(`**States, ${tid}:** ${arr(t.states).map(s => s.id + (s.start ? " (start)" : s.end ? " (end)" : "")).join(", ")}`, ""); tbl(["Action", "From", "To", "Who", "Only if", "Also does", "Undo", "Tells"], arr(t.moves).map(x => [x.do, list(x.from), x.to, list(x.who), x.guard, x.effect, x.reverse, list(x.notify)])); }
    tbl(["Field", "Type", "Required", "Limit", "Default", "Who may change it", "Message"], arr(o.fields).map(f => [f.id, f.type, f.required ? "yes" : "", f.limit, f.default, f.edit, f.msg]));
    if (o.list) tbl(["List", ""], Object.entries<any>(o.list).filter(([k]) => k !== "e").map(([k, v]) => [k, typeof v === "object" && !Array.isArray(v) ? Object.entries(v).map(([a, b]) => `${a}: ${list(b)}`).join("; ") : list(v)]));
    tbl(["Query", "Filters", "Sort", "Index", "p95"], arr(o.queries).map(q => [q.id, list(q.filters), list(q.sort), list(q.index) || q.no_index, q.p95]));
  };
  const screenTable = (ss: any[]) => tbl(["Screen", "Path", "Type", "For", "Main action", "Reached from", "First use", "No match", "Done"], ss.map(s => [s.name ?? s.id, s.path, s.type, list(s.for), s.primary, list(s.from), s.states?.first_use, s.states?.no_match, s.states?.done]));
  if (part && part !== "book") {
    const os = m.objects.filter((o: any) => o.module === part), ids = new Set(os.map((o: any) => o.id)), mine = (at: any) => arr(at).some((a: string) => ids.has(String(a).split(".")[0]));
    p(`# ${m.brief.name}: ${part}`, "", `One module of the PRD. The front book is ../PRD.md.`, ""); for (const o of os) chapter(o);
    p("## Screens of this module", ""); screenTable(arr(m.screens.screens).filter(s => arr(s.shows).some(x => ids.has(x)) || arr(s.does).some(x => ids.has(String(x).split(".")[0]))));
    p("## Messages of this module", ""); tbl(["Message", "When", "To", "By", "Words"], m.messages.filter((x: any) => ids.has(String(x.on).split(".")[0])).map((x: any) => [x.id, x.on, list(x.to), list(x.channels), x.text]));
    p("## Requirements that land here", ""); tbl(["Id", "Requirement", "When", "Where"], m.wide.filter((w: any) => w.d !== "no" && mine(w.at)).map((w: any) => [w.id, w.text, w.d, list(arr(w.at).filter((a: string) => ids.has(a.split(".")[0])))]));
    return L.join("\n");
  }
  p(`# ${m.brief.name}: product requirements`, "", `Printed from the map. Change the map, not this file. ${r.errors.length ? `**${r.errors.length} answers still missing.**` : "Filled."}`, "", m.brief.idea ?? "", "");
  tbl(["Brief", ""], ["who", "job", "country", "money", "tenants", "custom_objects", "must_never", "size"].map(k => [k, list(m.brief[k])]));
  p("## Roles", ""); tbl(["Role", "Home", "How they join", "When they leave"], arr(m.roles.roles).map(x => [x.name, x.home, x.joins, x.leaves]));
  p("## Objects", ""); tbl(["Object", "Kinds", "Module", "Why", "Linked to"], m.objects.map((o: any) => [o.name, list(o.kinds), o.module, o.why, arr(o.links).map(l => `${l.to} (${l.on_delete})`).join("; ")]));
  if (part === "book") p("Each module has its own file in prd/: " + [...new Set(m.objects.map((o: any) => o.module))].map(x => `[${x}](prd/${x}.md)`).join(", "), ""); else for (const o of m.objects) chapter(o);
  p("## Who may do what", ""); tbl(["Object", ...arr(m.roles.roles).map(x => x.name)], m.objects.map((o: any) => [o.name, ...arr(m.roles.roles).map(x => { const a = m.roles.access?.[x.id]?.[o.id]; return a == null ? "?" : typeof a === "string" ? a : `${list(a.do)} (${a.scope})`; })]));
  p("## Screens", ""); screenTable(arr(m.screens.screens));
  tbl(["On every screen", ""], Object.entries(m.screens.defaults ?? {}));
  p("## Journeys", ""); for (const j of arr(m.journeys.journeys)) { p(`**${j.id}, ${j.role}, ${lib.base.moments[j.moment] ?? j.moment}:** ${j.goal} (at most ${j.budget?.steps} steps; ${j.budget?.ref ?? "no reference"})`, ""); tbl(["#", "Screen", "Does", "Sees", "If it fails"], arr(j.steps).map((s, i) => [i + 1, s.screen, s.do, s.sees, s.fails])); p(`End: ${j.done}`, ""); }
  p("## Messages", ""); tbl(["Message", "When", "To", "By", "Words", "Can mute"], arr(m.messages).map(x => [x.id, x.on, list(x.to), list(x.channels), x.text, x.mute]));
  p("## Rules", ""); tbl(["Rule", "Area", "Text", "Examples"], arr(m.rules).map(x => [x.id, x.area, x.rule, arr(x.examples).map(e => `${e.given} → ${e.expect}`).join("; ")]));
  p("## Connections", ""); tbl(["Connection", "Area", "When", "What", "Set up", "Test", "When broken", "When off"], arr(m.connections).map(c => [c.id, c.area, c.d, c.what, c.setup, c.test, c.broken, c.off]));
  p("## Running it", ""); tbl(["Topic", "Answer"], Object.entries<any>(m.running).filter(([, v]) => typeof v !== "object" || Array.isArray(v)).map(([k, v]) => [k, list(v)]));
  for (const [k, src, f] of [["product", lib.product, "ask"], ["day_one", lib.dayOne, "ask"], ["production", lib.production, "ask"], ["flow", lib.flow, "rule"]] as any) tbl([k.replace("_", " "), "Answer"], Object.entries<any>(src).map(([id, v]) => [`${id}. ${v[f]}`, m.running[k]?.[id]]));
  p("## Risks to test first", ""); tbl(["Assumption", "Cheap test", "Result"], arr(m.risks).map(x => [x.assumption, x.test, x.result]));
  p("## Wide list: where every requirement landed", ""); tbl(["Id", "Requirement", "When", "Where or why"], arr(m.wide).filter(w => part !== "book" || w.d !== "now").map(w => [w.id, w.text, w.d, list(w.at) || w.why]));
  p("## Sources", ""); tbl(["Id", "Product", "What it shows", "Link"], m.ledger.map((l: any) => [l.id, l.product, l.cap, l.url]));
  return L.join("\n");
}

const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
const pick = <T,>(xs: T[], n: number, key: (x: T) => string) => [...xs].sort((a, b) => hash(key(a)) - hash(key(b))).slice(0, n);

export function ownerSheet(m: any, lib = library()): string {
  const r = check(m, lib), rows = m.objects.flatMap((o: any) => Object.entries<any>(abilitiesOf(o, lib)).map(([id, a]) => ({ o, id, ...a })));
  const risky = rows.filter((x: any) => ["no", "later"].includes(x.d) && x.from === "own" && (["reverse", "delete", "restore", "export", "archive", "history"].includes(x.id) || arr(x.o.kinds).some((k: string) => ["money", "document"].includes(k))));
  const offs = m.connections.filter((c: any) => ["payments", "accounting", "move_out", "signin"].includes(c.area) && ["no", "later"].includes(c.d));
  const open = m.decisions.filter((d: any) => !d.answer);
  return [
    `# ${m.brief.name}: two pages to decide`, "", m.brief.idea, "", `For ${m.brief.who}. ${m.objects.length} objects, ${arr(m.roles.roles).length} roles, ${arr(m.screens.screens).length} screens, ${arr(m.journeys.journeys).length} journeys.`,
    r.errors.length ? `**Not ready: ${r.errors.length} of ${r.asked} answers missing.**` : `All ${r.asked} answers filled${m.decisions.some((d: any) => !d.answer) ? `, ${m.decisions.filter((d: any) => !d.answer).length} decisions wait for you` : ""}. Filled does not mean right.`,
    `Evidence: ${Object.entries(r.mix).map(([k, v]) => `${k} ${v}`).join(", ")}.`, "",
    `## Your questions (${Math.min(open.length, 10)})`, "", ...open.slice(0, 10).flatMap((d: any, i: number) => [`${i + 1}. **${d.q}** We recommend: ${d.recommend}. ${d.why ?? ""}`]), ...(open.length > 10 ? [`**${open.length - 10} more are open; the sheet holds ten.**`] : []), "",
    "## Left out on purpose, touching money, law or data", "", ...risky.map((x: any) => `- ${x.o.name}, ${x.id.replace(/_/g, " ")}: **${x.d}**. ${x.how}`), ...offs.map((c: any) => `- ${c.area}: **${c.d}**. ${c.what}`), "",
    "## Ten random \"no\" answers", "", ...pick(rows.filter((x: any) => x.d === "no"), 10, (x: any) => x.o.id + x.id).map((x: any) => `- ${x.o.name}, ${x.id.replace(/_/g, " ")}: ${x.how}`), "",
    "## Unusual objects", "", ...(m.objects.filter((o: any) => arr(o.kinds).includes("other")).map((o: any) => `- ${o.name}: ${o.why}`)), "",
    "## Risks to test before building", "", ...arr(m.risks).map(x => `- ${x.assumption} Test: ${x.test} (${x.result})`), "",
  ].join("\n");
}

export function sample(m: any, pct = 10, lib = library()) {
  const cells = check(m, lib).cells.filter(c => c.tags.length);
  return pick(cells, Math.max(1, Math.ceil((cells.length * pct) / 100)), c => c.at + c.what).map(c => ({ at: c.at, what: c.what, tags: c.tags, links: c.tags.map((t: string) => m.ledger.find((l: any) => l.id === t)?.url ?? (t.startsWith("S:") ? m.refs[t.slice(2).split("/")[0]]?.source : t)) }));
}

// ---- harvest: read public schemas exactly, instead of asking an agent to remember them
const INTROSPECT = "{ __schema { mutationType { fields(includeDeprecated:true) { name } } types { kind name enumValues(includeDeprecated:true) { name } fields(includeDeprecated:true) { name isDeprecated deprecationReason type { name kind ofType { name kind ofType { name kind ofType { name kind } } } } args { name } } } } }";
export function parseSchema(format: string, text: string): any {
  const objects: any = {}, actions: string[] = []; let events: string[] = [];
  if (format === "graphql") {
    const s = (JSON.parse(text).data ?? JSON.parse(text)).__schema, base = (t: any): any => (t?.ofType ? base(t.ofType) : t);
    const enums = Object.fromEntries(s.types.filter((t: any) => t.kind === "ENUM").map((t: any) => [t.name, t.enumValues.map((v: any) => v.name)]));
    for (const t of s.types) if (t.kind === "OBJECT" && !/^__|(Connection|Edge|Payload)$/.test(t.name)) {
      const fields: any = {}, states: any = {};
      for (const f of t.fields ?? []) { const b = base(f.type); fields[f.name] = f.isDeprecated ? `${b?.name} (deprecated: ${f.deprecationReason ?? ""})` : b?.name; if (b?.kind === "ENUM" && /status|state/i.test(f.name) && enums[b.name]) states[f.name] = enums[b.name]; }
      objects[t.name] = { fields, states };
    }
    actions.push(...(s.mutationType?.fields ?? []).map((f: any) => f.name));
    events = Object.entries(enums).find(([k]) => /Topic$/.test(k))?.[1] as string[] ?? [];
  } else if (format === "openapi") {
    const d = text.trim().startsWith("{") ? JSON.parse(text) : Bun.YAML.parse(text) as any;
    const res = (x: any): any => (x?.$ref ? d.components?.schemas?.[x.$ref.split("/").pop()] : x);
    for (const [name, s] of Object.entries<any>(d.components?.schemas ?? {})) {
      const props = Object.assign({}, ...arr(s.allOf).map(a => res(a)?.properties ?? {}), s.properties ?? {}); if (!Object.keys(props).length) continue;
      const states: any = {}; for (const [k, v] of Object.entries<any>(props)) { const e = res(v)?.enum; if (e && /status|state/i.test(k)) states[k] = e.filter((x: any) => x); }
      objects[name] = { fields: Object.fromEntries(Object.entries<any>(props).map(([k, v]) => [k, (v.deprecated ? "deprecated " : "") + (v.type ?? v.$ref?.split("/").pop() ?? "any")])), states };
    }
    for (const [p, ops] of Object.entries<any>(d.paths ?? {})) for (const [verb, op] of Object.entries<any>(ops)) if (["get", "post", "put", "patch", "delete"].includes(verb)) {
      const q = arr(op.parameters).filter(x => x.in === "query").map(x => x.name); actions.push(`${verb.toUpperCase()} ${p}${q.length ? ` ?${q.join(",")}` : ""}`);
    }
  } else if (format === "doctype") {
    const d = JSON.parse(text), skip = /Break$|^(HTML|Heading|Button|Fold|Image)$/, fs = d.fields.filter((f: any) => !skip.test(f.fieldtype)), st = fs.find((f: any) => f.fieldname === "status");
    objects[d.name] = { fields: Object.fromEntries(fs.map((f: any) => [f.fieldname, f.fieldtype + (f.allow_on_submit ? " (editable after submit)" : "")])), states: st?.options ? { status: st.options.split("\n").filter(Boolean) } : {}, permissions: arr(d.permissions).map(x => x.role) };
  } else if (format === "prisma") {
    const enums: any = {}; for (const [, n, b] of text.matchAll(/^enum (\w+) \{([\s\S]*?)^\}/gm)) enums[n] = b.split("\n").map(l => l.trim().split(/[\s@]/)[0]).filter(l => /^\w+$/.test(l));
    for (const [, n, b] of text.matchAll(/^model (\w+) \{([\s\S]*?)^\}/gm)) {
      const fields: any = {}, states: any = {}; for (const l of b.split("\n")) { const x = l.trim().match(/^(\w+)\s+(\w+)(\[\])?/); if (x && !l.trim().startsWith("//")) { fields[x[1]] = x[2] + (x[3] ?? ""); if (enums[x[2]] && /status|state/i.test(x[1])) states[x[1]] = enums[x[2]]; } }
      objects[n] = { fields, states };
    }
  } else if (format === "rails") {
    for (const [, n, b] of text.matchAll(/create_table "(\w+)"[^\n]*\n([\s\S]*?)\n\s+end/g)) objects[n] = { fields: Object.fromEntries([...b.matchAll(/t\.(\w+) "(\w+)"/g)].filter(x => x[1] !== "index").map(x => [x[2], x[1]])), states: {} };
  } else throw new Error(`unknown format "${format}" (graphql, openapi, doctype, prisma, rails)`);
  if (!Object.keys(objects).length) throw new Error("nothing found; wrong format or empty file");
  return { objects, actions, events };
}

async function harvest(dir: string, name: string, format: string, source: string, only?: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(name ?? "") || !source) throw new Error("harvest <spec> <name> <format> <url or file>; the name may hold only letters, numbers, - and _");
  const web = /^https?:/.test(source);
  const res = web ? await fetch(source, format === "graphql" ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: INTROSPECT }) } : {}) : null;
  if (res && !res.ok) throw new Error(`${source}: HTTP ${res.status}`);
  const s = parseSchema(format, res ? await res.text() : readFileSync(source, "utf8"));
  const want = only?.split(","); if (want) { for (const k of Object.keys(s.objects)) if (!want.includes(k)) delete s.objects[k]; const miss = want.filter(w => !s.objects[w]); if (miss.length) throw new Error(`not found: ${miss.join(", ")}`); }
  if (want) for (const k of ["actions", "events"]) s[k] = s[k].filter((a: string) => want.some(w => a.toLowerCase().replace(/_/g, "").includes(w.toLowerCase().replace(/[_ ]/g, ""))));
  mkdirSync(join(dir, "refs"), { recursive: true });
  writeFileSync(join(dir, "refs", `${name}.yaml`), Bun.YAML.stringify({ product: name, source, format, read: new Date().toISOString().slice(0, 10), ...s }, null, 2));
  for (const [k, v] of Object.entries<any>(s.objects).slice(0, 30)) console.log(`${name}/${k}: ${Object.keys(v.fields).length} fields (${Object.values<any>(v.fields).filter(f => /deprecated/.test(String(f))).length} deprecated), states ${Object.entries<any>(v.states).map(([a, b]) => `${a} ${b.length}`).join(", ") || "none"}`);
  console.log(`${Object.keys(s.objects).length} objects, ${s.actions.length} actions, ${s.events.length} events`);
}

function init(dir: string) {
  if (existsSync(join(dir, "brief.yaml"))) throw new Error(`${dir}/brief.yaml exists; nothing written`);
  for (const d of ["objects", "ledger", "refs"]) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "brief.yaml"), 'name: ""\nidea: ""\nwho: ""\njob: ""\ncountry: ""\nmoney: ""\ntenants: true\ncustom_objects: false\nmust_never: []\nsize: M\n');
  for (const [f, t] of [["roles", "roles: []\naccess: {}\n"], ["screens", "defaults: {}\nscreens: []\n"], ["journeys", "journeys: []\nskip: []\n"], ["running", "settings: []\nsupport: []\nevents: []\nproduct: {}\nday_one: {}\nproduction: {}\nflow: {}\n"], ...["messages", "rules", "connections", "risks", "findings", "decisions", "wide"].map(x => [x, "[]\n"])]) writeFileSync(join(dir, `${f}.yaml`), t);
  console.log(`map started in ${dir}. Read examples/invoices/spec for the shape of each file.`);
}

if (import.meta.main) {
  const [cmd, dir = "spec", ...rest] = process.argv.slice(2);
  try {
    if (cmd === "init") init(dir);
    else if (cmd === "harvest") await harvest(dir, rest[0], rest[1], rest[2], rest[3]);
    else if (cmd === "check") {
      const r = check(load(dir)), all = rest.includes("--all"), by: Record<string, typeof r.errors> = {};
      for (const e of r.errors) (by[e.code] ??= []).push(e);
      for (const [c, es] of Object.entries(by)) { console.log(`\n${c} (${es.length})`); for (const e of all ? es : es.slice(0, 12)) console.log(`  ${e.at}: ${e.msg}`); if (!all && es.length > 12) console.log(`  ... ${es.length - 12} more (--all)`); }
      for (const w of r.warnings) console.log(`warning ${w.code} ${w.at}: ${w.msg}`);
      console.log(`\n${r.filled} of ${r.asked} filled, ${r.errors.length} missing. Evidence: ${JSON.stringify(r.mix)}. "no" share %: ${JSON.stringify(r.noShare)}. Filled does not mean right.`);
      process.exit(r.errors.length ? 1 : 0);
    } else if (cmd === "print") {
      const m = load(dir), mods = [...new Set(m.objects.map((o: any) => o.module))] as string[], split = mods.length > 1 && print(m).split(/\s+/).length / 450 > library().base.limits.pages, out = join(dir, "..");
      const prd = print(m, library(), split ? "book" : ""), pages = Math.ceil(prd.split(/\s+/).length / 450);
      if (split) { mkdirSync(join(out, "prd"), { recursive: true }); for (const x of mods) { const s = print(m, library(), x); writeFileSync(join(out, "prd", `${x}.md`), s); console.log(`prd/${x}.md about ${Math.ceil(s.split(/\s+/).length / 450)} pages`); } }
      if (split) { // long sections go to their own files; the book keeps brief, roles, objects, access, risks
        const [head, ...secs] = prd.split(/^(?=## )/m), keep: string[] = [], links: string[] = [];
        for (const s of secs) { const name = s.slice(3, s.indexOf("\n")).trim(), file = name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""); if (/^(Screens|Journeys|Messages|Rules|Connections|Running|Wide|Sources)/.test(name)) { writeFileSync(join(out, "prd", `${file}.md`), `# ${m.brief.name}: ${s.slice(3)}`); links.push(`[${name}](prd/${file}.md)`); } else keep.push(s); }
        const book = head + `Also: ${links.join(", ")}\n\n` + keep.join(""); writeFileSync(join(out, "PRD.md"), book); console.log(`PRD.md about ${Math.ceil(book.split(/\s+/).length / 450)} pages, the rest in prd/`);
      } else writeFileSync(join(out, "PRD.md"), prd); writeFileSync(join(out, "OWNER-SHEET.md"), ownerSheet(m));
      console.log(split ? "OWNER-SHEET.md written" : `PRD.md about ${pages} pages, OWNER-SHEET.md written`);
    } else if (cmd === "mock") {
      const { mock } = await import("./mock.ts"), out = join(dir, "..", "MOCK.html");
      writeFileSync(out, mock(load(dir))); console.log(`${out} written. Open it, or run measure() in its console.`);
    } else if (cmd === "baseline") {
      const base = read(join(LIB, "baseline.yaml")), have = new Set(load(dir).wide.map((w: any) => w.id)), add = Object.entries<string>(base).filter(([id]) => !have.has(id));
      mkdirSync(join(dir, "wide"), { recursive: true }); const f = join(dir, "wide", "baseline.yaml"), old = existsSync(f) ? readFileSync(f, "utf8") : "";
      writeFileSync(f, old + add.map(([id, text]) => `- ${JSON.stringify({ id, text, d: "", at: [], why: "", src: "library/baseline.yaml" })}\n`).join(""));
      console.log(`${add.length} baseline lines added to wide/baseline.yaml; land each (now) or refuse it (no: why)`);
    } else if (cmd === "demote") { // after an audit: every tag judged loose or wrong becomes judge
      const verdicts = read(rest[0] ?? join(dir, "raw", "audit.yaml")) as any[], bad = new Set(verdicts.filter(v => ["loose", "wrong"].includes(v.verdict)).flatMap(v => arr(v.tags).filter((x: string) => x !== "judge").map((x: string) => `${v.at}|${x}`)));
      let n = 0;
      for (const f of readdirSync(join(dir, "objects")).filter(x => x.endsWith(".yaml"))) {
        const o = read(join(dir, "objects", f)), walk = (x: any, at: string): any => { if (Array.isArray(x)) return x; if (x && typeof x === "object") { for (const k of Object.keys(x)) { if (k === "e" || k.endsWith("_e")) { const before = arr(x[k]); x[k] = before.map((tag: string) => (bad.has(`${at}|${tag}`) || bad.has(`${o.id}|${tag}`) ? (n++, "judge") : tag)); x[k] = [...new Set(x[k])]; } else walk(x[k], at); } } return x; };
        walk(o, o.id); writeFileSync(join(dir, "objects", f), Bun.YAML.stringify(o, null, 2));
      }
      console.log(`${n} tags set to judge from ${bad.size} loose or wrong verdicts`);
    } else if (cmd === "handoff") {
      const out = rest[0]; if (!out) throw new Error("forge handoff <spec> <project folder>");
      for (const [f, s] of Object.entries(handoff(load(dir)))) { if (["AGENTS.md", "PROGRESS.md"].includes(f) && existsSync(join(out, f))) { console.log(`kept your ${f}`); continue; } mkdirSync(join(out, f, ".."), { recursive: true }); writeFileSync(join(out, f), s); }
      const src = join(dir, ".."); if (existsSync(join(src, "PRD.md"))) { const { cpSync } = await import("node:fs"); cpSync(join(src, "PRD.md"), join(out, "PRD.md")); if (existsSync(join(src, "prd"))) cpSync(join(src, "prd"), join(out, "prd"), { recursive: true }); }
      console.log(`handed to ${out}: REQUIREMENTS.md, ids.txt, AGENTS.md, modules/*/CONTEXT.md, PROGRESS.md, PRD.md, prd/ (run forge print first)`);
    } else if (cmd === "todo") for (const x of todo(load(dir))) console.log(`${x.id} ${x.text}`);
    else if (cmd === "flat") for (const x of flat(load(dir))) console.log(`${x.id} ${x.text}`);
    else if (cmd === "sample") console.log(Bun.YAML.stringify(sample(load(dir), Number(rest[0] ?? 10)), null, 2));
    else console.log("forge init|check|print|mock|todo|flat|sample|baseline|demote <spec> · forge handoff <spec> <project> · forge harvest <spec> <name> <graphql|openapi|doctype|prisma|rails> <url or file> [Only,These]");
  } catch (e: any) { console.error(`forge: ${e.message}`); process.exit(2); }
}
