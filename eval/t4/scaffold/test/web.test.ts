// Example of a browser test: starts the built app on a free port with its own database. Run `bun run build` first.
import { afterAll, beforeAll, expect, test } from "bun:test";
import { chromium, type Browser } from "playwright";
let browser: Browser, proc: any; const port = 4700 + Math.floor(Math.random() * 90), url = `http://127.0.0.1:${port}`;
beforeAll(async () => { proc = Bun.spawn(["bun", "server/index.ts"], { env: { ...process.env, PORT: String(port), DB_FILE: ":memory:" }, stdout: "ignore" }); for (let i = 0; i < 50; i++) { try { await fetch(url); break; } catch { await Bun.sleep(100); } } browser = await chromium.launch(); }, 30000);
afterAll(async () => { await browser?.close(); proc?.kill(); });
test("[SCAFFOLD] sign in through the page", async () => { const p = await browser.newPage(); await p.goto(url); await p.getByLabel("Email").fill("owner@f1.test"); await p.getByRole("button", { name: "Sign in" }).click(); await p.getByRole("heading", { name: "Asha Design" }).waitFor(); expect(await p.title()).toBe("Invoices"); await p.close(); }, 30000);
