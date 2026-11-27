import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export const api = async (path: string, init?: RequestInit) => {
  const r = await fetch(`/api${path}`, { headers: { "content-type": "application/json" }, ...init }), b = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(b.error ?? "Something went wrong."), { status: r.status, body: b }); return b;
};
export function App() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => api("/me"), retry: false }), qc = useQueryClient(), [email, setEmail] = useState(""), [err, setErr] = useState("");
  if (me.isLoading) return <p>Loading</p>;
  if (me.isError) return <form onSubmit={async e => { e.preventDefault(); try { await api("/login", { method: "POST", body: JSON.stringify({ email }) }); await qc.invalidateQueries(); } catch (x: any) { setErr(x.message); } }}><label>Email <input value={email} onChange={e => setEmail(e.target.value)} /></label><button>Sign in</button><p role="alert">{err}</p></form>;
  return <main><h1>{me.data.firm.name}</h1><p>{me.data.user.name}</p></main>;
}
