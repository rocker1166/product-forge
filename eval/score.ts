// Scores one product from the judges' files. usage: bun eval/score.ts <product> <scratch eval dir>
const [prod, dir] = process.argv.slice(2), out = `${dir}/judge/${prod}`, key = await Bun.file(`${dir}/key-${prod}.json`).json();
const hidden: any[] = Bun.YAML.parse(await Bun.file(`${dir}/hidden/${prod}.yaml`).text()) as any, meta = Object.fromEntries(hidden.map(h => [h.id, h]));
const lines: any = {}; for (const j of ["1", "2"]) for (const s of ["x", "y"]) lines[j + s] = (await Bun.file(`${out}/j${j}-${s}.txt`).text()).trim().split("\n");
const votes: any = {}; let gone = 0;
for (const j of ["1", "2"]) for (const r of Bun.YAML.parse(await Bun.file(`${out}/j${j}.yaml`).text()) as any[]) for (const s of ["x", "y"]) {
  const arm = key["j" + j][s], ln = Number(r[s + "l"]) - 1, text = lines[j + s][ln] ?? ""; let v = r[s];
  if (v === true) v = "yes"; if (v === false) v = "no"; if (v !== "no" && !text) { gone++; v = "no"; }
  ((votes[r.id] ??= {})[arm] ??= []).push({ v, later: /\[(room|later)\]/.test(text) });
}
const val = (x: any, loose: boolean) => (x.v === "yes" ? 1 : x.v === "part" ? 0.5 : 0) * (x.later && !loose ? 0 : 1);
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0), pc = (n: number) => (100 * n).toFixed(1);
const share = (arm: string, f: (h: any) => boolean, loose = false) => avg(hidden.filter(h => f(h) && votes[h.id]).map(h => avg(votes[h.id][arm].map((x: any) => val(x, loose)))));
const row = (name: string, f: (h: any) => boolean) => console.log(`${name.padEnd(12)} n=${String(hidden.filter(f).length).padEnd(4)} ours ${pc(share("ours", f))}  (with later ${pc(share("ours", f, true))})   plain ${pc(share("base", f))}   gap ${pc(share("ours", f) - share("base", f))}`);
row("full", h => h.group === "full"); row("  core", h => h.group === "full" && h.weight === "core"); row("  depth", h => h.group === "full" && h.weight !== "core"); row("new", h => h.group === "new"); row("asked", h => h.group === "asked"); row("all", () => true);
const both = hidden.filter(h => votes[h.id]), agree = (arm: string) => avg(both.map(h => Number(votes[h.id][arm][0]?.v === votes[h.id][arm][1]?.v)));
console.log(`judges agree: ours ${pc(agree("ours"))}% plain ${pc(agree("base"))}% · judged ${both.length}/${hidden.length} · votes with a bad line number ${gone}`);
if (await Bun.file(`${out}/useful.yaml`).exists()) {
  const u = Bun.YAML.parse(await Bun.file(`${out}/useful.yaml`).text()) as any[], s: any = { ours: [], base: [] };
  for (const r of u) s[key.useful[Number(String(r.id).slice(1)) - 1]].push(r.useful === true || r.useful === "yes" ? 1 : 0);
  console.log(`useful: ours ${pc(avg(s.ours))}% of ${s.ours.length}, plain ${pc(avg(s.base))}% of ${s.base.length}`);
}
