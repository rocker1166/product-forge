// Sign-in for the test: POST /api/login {email}. No passwords, no email.
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { DB } from "./db.ts";
export type User = { id: string; firm_id: string; email: string; name: string; role: "owner" | "accountant" | "viewer" };
export function createApp(db: DB) {
  const app = new Hono<{ Variables: { user: User } }>();
  app.post("/api/login", async c => {
    const { email } = await c.req.json().catch(() => ({})), u = db.prepare("SELECT * FROM users WHERE email = ?").get(email ?? "") as User | null;
    if (!u) return c.json({ error: "No user with this email." }, 401);
    const token = crypto.randomUUID(); db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(token, u.id, new Date().toISOString());
    setCookie(c, "session", token, { httpOnly: true, sameSite: "Lax", path: "/" }); return c.json({ user: u });
  });
  app.post("/api/logout", c => { db.prepare("DELETE FROM sessions WHERE token = ?").run(getCookie(c, "session") ?? ""); deleteCookie(c, "session", { path: "/" }); return c.json({ ok: true }); });
  app.use("/api/*", async (c, next) => {
    const u = db.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?").get(getCookie(c, "session") ?? "") as User | null;
    if (!u) return c.json({ error: "Sign in first." }, 401); c.set("user", u); await next();
  });
  app.get("/api/me", c => c.json({ user: c.get("user"), firm: db.prepare("SELECT * FROM firms WHERE id = ?").get(c.get("user").firm_id) }));
  return app;
}
