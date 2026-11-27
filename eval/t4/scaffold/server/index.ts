import { existsSync } from "node:fs";
import { createApp } from "./app.ts";
import { open } from "./db.ts";
import { seed } from "./seed.ts";
const db = open(); seed(db);
const app = createApp(db), port = Number(process.env.PORT ?? 4800);
app.get("*", async c => {
  const p = new URL(c.req.url).pathname, f = `dist${p}`;
  return new Response(Bun.file(p !== "/" && !p.includes("..") && existsSync(f) ? f : "dist/index.html"));
});
Bun.serve({ port, hostname: "127.0.0.1", fetch: app.fetch }); console.log(`http://127.0.0.1:${port}`);
