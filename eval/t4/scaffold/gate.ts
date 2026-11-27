// The gate: every id in ids.txt needs at least one passing test whose name holds [id]. Nothing else counts as done.
const r = Bun.spawnSync(["bun", "test", "--reporter=junit", "--reporter-outfile=.junit.xml"], { stdout: "ignore", stderr: "ignore" });
const xml = await Bun.file(".junit.xml").text(), pass = new Set<string>(), fail = new Set<string>();
for (const [, head, body] of xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)) { const name = head.match(/name="([^"]*)"/)?.[1] ?? "", bad = /<(failure|error|skipped)/.test(body ?? ""); for (const [, id] of name.matchAll(/\[([^\]]+)\]/g)) (bad ? fail : pass).add(id.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&")); }
const ids = (await Bun.file("ids.txt").text()).split("\n").map(l => l.trim().split(" ")[0]).filter(Boolean), open = ids.filter(i => !pass.has(i) || fail.has(i));
for (const i of open) console.log(`open ${i}${fail.has(i) ? " (a test fails)" : ""}`);
console.log(`${ids.length - open.length} of ${ids.length} done, ${open.length} open, test exit ${r.exitCode}`); process.exit(open.length || r.exitCode ? 1 : 0);
