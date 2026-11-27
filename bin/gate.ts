#!/usr/bin/env bun
// The gate: every id in the ids file needs at least one passing test whose name holds [id]. Nothing else counts as done.
// usage: bun gate.ts [ids.txt] [results.xml]   With no results file it runs `bun test` itself.
// Any stack works if its tests write JUnit XML (Go: gotestsum --junitfile; Vitest/Jest/Playwright: junit reporter).
const [idsFile = "ids.txt", given] = process.argv.slice(2);
let code = 0;
if (!given) code = Bun.spawnSync(["bun", "test", "--reporter=junit", "--reporter-outfile=.junit.xml"], { stdout: "ignore", stderr: "ignore" }).exitCode;
const xml = await Bun.file(given ?? ".junit.xml").text(), pass = new Set<string>(), fail = new Set<string>();
const unesc = (s: string) => s.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
for (const [, head, body] of xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)) {
  const name = unesc(head.match(/name="([^"]*)"/)?.[1] ?? ""), bad = /<(failure|error|skipped)/.test(body ?? "");
  for (const [, id] of name.matchAll(/\[([^\]]+)\]/g)) (bad ? fail : pass).add(id);
}
const ids = (await Bun.file(idsFile).text()).split("\n").map(l => l.trim().split(/\s/)[0]).filter(Boolean), open = ids.filter(i => !pass.has(i) || fail.has(i));
for (const i of open) console.log(`open ${i}${fail.has(i) ? " (a test fails)" : ""}`);
console.log(`${ids.length - open.length} of ${ids.length} done, ${open.length} open${given ? "" : `, test exit ${code}`}`);
process.exit(open.length || code ? 1 : 0);
