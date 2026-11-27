// Example of an API test. Name the requirement in square brackets.
import { beforeEach, expect, test } from "bun:test";
import { createApp } from "../server/app.ts";
import { open } from "../server/db.ts";
import { seed } from "../server/seed.ts";
export const setup = () => { const db = open(":memory:"); seed(db); const app = createApp(db);
  const as = async (email: string) => { const r = await app.request("/api/login", { method: "POST", body: JSON.stringify({ email }) }), cookie = r.headers.get("set-cookie")!.split(";")[0]; return (path: string, init: any = {}) => app.request(`/api${path}`, { ...init, headers: { cookie, "content-type": "application/json" } }); };
  return { db, app, as }; };
let s: ReturnType<typeof setup>; beforeEach(() => { s = setup(); });
test("[SCAFFOLD] signed-in user sees own firm", async () => { const go = await s.as("owner@f1.test"); expect((await (await go("/me")).json()).firm.name).toBe("Asha Design"); });
test("[SCAFFOLD] no session is refused", async () => expect((await s.app.request("/api/me")).status).toBe(401));
