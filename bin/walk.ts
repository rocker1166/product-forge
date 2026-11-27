#!/usr/bin/env bun
// Measured walk of a running app for the fix pass: visits every same-site page it can reach, never presses buttons
// (read-only), at desktop and phone width, and reports what a careful user would hit.
// usage: bun walk.ts <url> [--email a@b --password x] [--max 60]   Needs `playwright` installed in the current project.
const args = process.argv.slice(2), opt = (k: string) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : undefined; };
const start = args[0]; if (!start) { console.log("bun walk.ts <url> [--email a@b --password x] [--max 60]"); process.exit(2); }
const { chromium } = await import(require.resolve("playwright", { paths: [process.cwd()] }));
const origin = new URL(start).origin, max = Number(opt("max") ?? 60), browser = await chromium.launch(), issues: string[] = [], titles = new Map<string, string>();
const page = await browser.newPage();
page.on("console", (m: any) => m.type() === "error" && issues.push(`console error on ${page.url()}: ${m.text().slice(0, 140)}`));
page.on("response", (r: any) => r.status() >= 500 && issues.push(`HTTP ${r.status()} ${r.url()}`));
if (opt("email")) { // fills the first email and password fields it sees, then submits
  await page.goto(start); await page.locator('input[type=email],input[name*=email i]').first().fill(opt("email")!);
  await page.locator("input[type=password]").first().fill(opt("password") ?? ""); await page.keyboard.press("Enter"); await page.waitForLoadState("networkidle").catch(() => {});
}
const seen = new Set<string>(), queue = [start];
while (queue.length && seen.size < max) {
  const url = queue.shift()!.split("#")[0]; if (seen.has(url)) continue; seen.add(url);
  for (const [w, h] of [[1280, 800], [375, 812]]) {
    await page.setViewportSize({ width: w, height: h }); const t0 = performance.now();
    const res = await page.goto(url, { waitUntil: "networkidle" }).catch((e: any) => (issues.push(`cannot open ${url}: ${e.message.slice(0, 80)}`), null)); if (!res) continue;
    const ms = Math.round(performance.now() - t0); if (ms > 1000) issues.push(`slow: ${url} took ${ms} ms at ${w}px`);
    const r = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth, title: document.title, blank: document.body.innerText.trim().length < 3,
      unlabeled: [...document.querySelectorAll("input:not([type=hidden]),select,textarea")].filter((e: any) => !e.labels?.length && !e.getAttribute("aria-label") && !e.getAttribute("aria-labelledby")).length,
      nameless: [...document.querySelectorAll("button,a[href]")].filter((e: any) => !(e.innerText || "").trim() && !e.getAttribute("aria-label") && !e.getAttribute("title")).length,
      links: [...document.querySelectorAll("a[href]")].map((a: any) => a.href),
    }));
    if (r.blank) issues.push(`blank page: ${url} at ${w}px`);
    if (r.overflow > 2) issues.push(`sideways scroll ${r.overflow}px: ${url} at ${w}px`);
    if (r.unlabeled) issues.push(`${r.unlabeled} inputs without a label: ${url}`);
    if (r.nameless) issues.push(`${r.nameless} buttons or links without a name: ${url}`);
    if (w === 1280) { if (!r.title) issues.push(`no page title: ${url}`); else if ([...titles.values()].includes(r.title) && !titles.has(url)) issues.push(`same title as another page: "${r.title}" on ${url}`); titles.set(url, r.title);
      for (const l of r.links) if (l.startsWith(origin) && !seen.has(l.split("#")[0]) && !/\/api\/|\.(csv|pdf|zip|xlsx)(\?|$)|logout|sign-?out|delete|remove/i.test(l)) queue.push(l); }
  }
}
const bad = await page.goto(`${origin}/this-page-does-not-exist-${Date.now()}`).catch(() => null);
if (bad && bad.status() !== 404) issues.push(`unknown route answers ${bad.status()}, not 404`);
await browser.close();
const unique = [...new Set(issues)]; for (const i of unique) console.log(i);
console.log(`\n${seen.size} pages walked at 1280 and 375 px, ${unique.length} issues. Read-only: forms and buttons need the fix-pass agent.`);
process.exit(unique.length ? 1 : 0);
