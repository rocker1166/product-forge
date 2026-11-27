// Makes the blind files for one product: two lists under neutral names, a 60-line usefulness sheet, and the key.
// usage: bun eval/blind.ts <product> <scratch eval dir>
import { mkdirSync } from "node:fs";
const [prod, dir] = process.argv.slice(2), out = `${dir}/judge/${prod}`; mkdirSync(out, { recursive: true });
const clean = (s: string) => s.split("\n").map(l => l.trim()).filter(Boolean).map(l => l.replace(/^[CB]\d+\s+/, "").replace(/ \(now\)\./, ".").replace(/ \((room|later)\)/, " [$1]"));
const ours = clean(await Bun.file(`${dir}/runs/${prod}-ours/flat.txt`).text()), base = clean(await Bun.file(`${dir}/runs/${prod}-base/list.txt`).text());
const flip = Math.random() < 0.5, A = flip ? base : ours, B = flip ? ours : base;
const num = (xs: string[]) => xs.map((x, i) => `${String(i + 1).padStart(4, "0")} ${x}`).join("\n") + "\n";
for (const [j, x, y] of [["1", A, B], ["2", B, A]] as const) { await Bun.write(`${out}/j${j}-x.txt`, num([...x])); await Bun.write(`${out}/j${j}-y.txt`, num([...y])); }
const pick = (xs: string[], n: number) => { const c = [...xs]; for (let i = c.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [c[i], c[k]] = [c[k], c[i]]; } return c.slice(0, n); };
const sheet = [...pick(ours, 30).map(t => ({ t, w: "ours" })), ...pick(base, 30).map(t => ({ t, w: "base" }))].sort(() => Math.random() - 0.5);
await Bun.write(`${out}/useful.txt`, sheet.map((s, i) => `U${String(i + 1).padStart(2, "0")} ${s.t}`).join("\n") + "\n");
const hidden: any = Bun.YAML.parse(await Bun.file(`${dir}/hidden/${prod}.yaml`).text());
await Bun.write(`${out}/hidden.txt`, hidden.map((h: any) => `${h.id} ${h.text}`).join("\n") + "\n");
await Bun.write(`${dir}/key-${prod}.json`, JSON.stringify({ j1: { x: flip ? "base" : "ours", y: flip ? "ours" : "base" }, j2: { x: flip ? "ours" : "base", y: flip ? "base" : "ours" }, useful: sheet.map(s => s.w), sizes: { ours: ours.length, base: base.length } }));
console.log(prod, "ours", ours.length, "base", base.length, "hidden", hidden.length);
