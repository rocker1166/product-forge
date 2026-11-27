import { open, type DB } from "./db.ts";
export function seed(db: DB) {
  const firm = db.prepare("INSERT OR IGNORE INTO firms (id,name,state,gstin) VALUES (?,?,?,?)"), user = db.prepare("INSERT OR IGNORE INTO users (id,firm_id,email,name,role) VALUES (?,?,?,?,?)");
  firm.run("f1", "Asha Design", "Gujarat", "24ABCDE1234F1Z5"); firm.run("f2", "Bina Legal", "Maharashtra", "27ABCDE1234F1Z9");
  for (const f of ["f1", "f2"]) for (const r of ["owner", "accountant", "viewer"]) user.run(`${f}-${r}`, f, `${r}@${f}.test`, `${r} of ${f}`, r);
}
if (import.meta.main) { seed(open()); console.log("seeded"); }
