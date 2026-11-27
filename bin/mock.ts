// Draws a clickable grey mock from the map: every screen, state, action and journey, one HTML file, no packages.
// It shows whether a person can get through. It does not show final looks, speed or real data.
import { abilitiesOf, library } from "./forge.ts";

const arr = (v: any): any[] => (Array.isArray(v) ? v : v == null ? [] : [v]);

export function mock(m: any, lib = library()): string {
  const objects = Object.fromEntries(m.objects.map((o: any) => [o.id, {
    name: o.name, fields: arr(o.fields), list: o.list ?? {},
    tracks: Object.fromEntries(Object.entries<any>(o.tracks ?? {}).map(([k, t]) => [k, { states: arr(t.states), moves: arr(t.moves).map((x: any) => ({ ...x, who: arr(x.who), from: arr(x.from) })) }])),
    can: Object.fromEntries(Object.entries<any>(abilitiesOf(o, lib)).filter(([, a]) => a.d === "now").map(([id, a]) => [id, { on: lib.abilities[id].on, how: a.how }])),
  }]));
  const data = { brief: m.brief, roles: arr(m.roles.roles), access: m.roles.access ?? {}, defaults: m.screens.defaults ?? {}, screens: arr(m.screens.screens), journeys: arr(m.journeys.journeys), moments: lib.base.moments, states: lib.base.screen_states, objects };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${String(m.brief.name).replace(/[<&]/g, "")} mock</title><style>
:root{--bg:#f6f6f4;--card:#fff;--ink:#1c1c1a;--dim:#6b6b66;--line:#deded9;--hit:#1d4ed8;--bad:#b42318}
@media(prefers-color-scheme:dark){:root{--bg:#161615;--card:#1f1f1d;--ink:#ededea;--dim:#9a9a94;--line:#353532;--hit:#7da2ff;--bad:#ff8a7a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif;display:grid;grid-template-columns:210px minmax(0,1fr) 300px;min-height:100vh}
nav,aside{padding:16px;border-right:1px solid var(--line)}aside{border:0;border-left:1px solid var(--line)}main{padding:24px;min-width:0}
h1{font-size:22px;margin:0 0 4px}h2{font-size:14px;margin:20px 0 6px}small,.dim{color:var(--dim);font-size:13px}
button,select,input{font:inherit;color:inherit;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:7px 12px;min-height:36px}
button{cursor:pointer}button:hover{border-color:var(--dim)}button.main{background:var(--ink);color:var(--bg);border-color:var(--ink)}button.next{outline:3px solid var(--hit);outline-offset:2px}
:focus-visible{outline:3px solid var(--hit);outline-offset:2px}nav button{display:block;width:100%;text-align:left;margin:2px 0;border-color:transparent;background:none}nav button.on{background:var(--card);border-color:var(--line)}
.row{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;align-items:center}.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:12px 0;overflow-x:auto}
table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:8px;border-bottom:1px solid var(--line);white-space:nowrap}tr.go{cursor:pointer}label{display:block;margin:10px 0}label input{width:100%;max-width:420px;display:block}
.chip{border:1px solid var(--line);border-radius:99px;padding:2px 10px;font-size:13px}.bad{color:var(--bad)}#say{min-height:48px}ol{padding-left:18px}li.now{font-weight:600}
@media(max-width:900px){body{display:block}nav,aside{border:0;border-bottom:1px solid var(--line)}nav button{display:inline-block;width:auto}}
</style></head><body><nav id="nav" aria-label="Screens"></nav><main id="main"></main><aside id="side" aria-label="Journeys"></aside><script>
const D=${JSON.stringify(data).replace(/</g, "\\u003c")};
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let role=D.roles[0]?.id,at=D.roles[0]?.home,view="",said="",trk={},run=null,clicks=0;
const S=id=>D.screens.find(s=>s.id===id),O=id=>D.objects[id],moves=o=>Object.entries(o.tracks).flatMap(([t,v])=>v.moves.map(x=>({track:t,...x})));
function may(r,ob,act){const o=O(ob),mv=moves(o).filter(x=>x.do===act);if(mv.length)return mv.some(x=>x.who.includes(r));const a=D.access[r]?.[ob];if(!a||a==="none")return false;const l=a==="*"?"*":a.do??a;return l==="*"||l.includes(act)}
function offers(s){const out=new Set(s.does||[]);for(const ob of s.shows||[])for(const[id,a]of Object.entries(O(ob).can)){const t=s.type;if((t==="list"||t==="board")?(a.on==="list"||id==="create"):t==="form"?a.on==="form":t==="detail"?(a.on==="detail"||id==="view"):false)out.add(ob+"."+id)}return[...out].filter(x=>{const[ob,act]=x.split(".");return O(ob)&&may(role,ob,act)})}
const st=(ob,t)=>trk[ob+"."+t]??O(ob).tracks[t].states.find(s=>s.start)?.id;
function go(id){at=id;view="";said="";draw()}
function act(x,quiet){const[ob,a]=x.split("."),o=O(ob),s=S(at),mv=moves(o).find(m=>m.do===a&&m.from.includes(st(ob,m.track)))||moves(o).find(m=>m.do===a);
 if(mv){if(!mv.from.includes(st(ob,mv.track))){said='<span class="bad">Not now: '+esc(a)+' needs '+esc(mv.track)+' to be '+esc(mv.from.join(" or "))+', it is '+esc(st(ob,mv.track))+'.</span>'}else{trk[ob+"."+mv.track]=mv.to;said="<b>"+esc(a)+"</b>: "+esc(mv.track)+" is now "+esc(mv.to)+". "+esc(mv.effect||"")+" Undo: "+esc(mv.reverse)}}
 else{said="<b>"+esc(a.replace(/_/g," "))+"</b>: "+esc(o.can[a]?.how||"");const f=D.screens.find(q=>q.type==="form"&&(q.shows||[]).includes(ob)&&q.for.includes(role));const d=D.screens.find(q=>q.type==="detail"&&(q.shows||[]).includes(ob)&&q.for.includes(role));if((a==="create"||a==="edit")&&f&&f.id!==at)at=f.id;if(a==="view"&&d)at=d.id}
 step(x);if(!quiet)draw()}
function step(x){if(!run)return;const j=run.j,cur=j.steps[run.i];if(cur&&cur.do===x){run.i++;run.hit++;if(run.i>=j.steps.length)said+="<br><b>Journey done.</b> "+esc(j.done)}else run.extra++}
function start(id){const j=D.journeys.find(q=>q.id===id);role=j.role;trk={};run={j,i:0,hit:0,extra:0};clicks=0;go(j.steps[0].screen)}
function btn(x,main){const[ob,a]=x.split("."),n=run&&run.j.steps[run.i]?.do===x&&run.j.steps[run.i]?.screen===at;return'<button data-act="'+esc(x)+'" class="'+(main?"main ":"")+(n?"next":"")+'">'+esc(a.replace(/_/g," "))+(Object.keys(D.objects).length>1&&!(S(at).shows||[])[0]?.includes(ob)?" "+esc(O(ob).name.toLowerCase()):"")+"</button>"}
function draw(){const s=S(at);if(!s)return;const seen=D.screens.filter(q=>q.for.includes(role));
 $("#nav").innerHTML="<b>"+esc(D.brief.name)+'</b><div class="row"><select id="role" aria-label="Role">'+D.roles.map(r=>'<option value="'+esc(r.id)+'"'+(r.id===role?" selected":"")+">"+esc(r.name)+"</option>").join("")+"</select></div>"+seen.map(q=>'<button data-go="'+esc(q.id)+'" class="'+(q.id===at?"on":"")+'">'+esc(q.name||q.id)+"</button>").join("");
 const all=offers(s),spec=D.states[s.type==="board"?"list":s.type]||D.states.other,keys=[...spec.own,...spec.shared];let h="<h1>"+esc(s.name||s.id)+'</h1><small>'+esc(s.path)+" · "+esc(s.type)+" · main action: "+esc(s.primary)+'</small><div class="row"><select id="view" aria-label="State"><option value="">normal</option>'+keys.map(k=>'<option value="'+k+'"'+(k===view?" selected":"")+">"+k.replace(/_/g," ")+"</option>").join("")+"</select></div>";
 if(view)h+='<div class="card"><b>'+esc(view.replace(/_/g," "))+"</b><br>"+esc(s.states?.[view]??D.defaults[view]??"not answered")+"</div>";
 for(const ob of s.shows||[]){const o=O(ob),mine=all.filter(x=>x.startsWith(ob+"."));
  if(s.type==="list"||s.type==="board"){const L=o.list;h+='<div class="row">'+(L.views||[]).map(v=>'<span class="chip">'+esc(v)+"</span>").join("")+'</div><div class="row">'+mine.map((x,i)=>btn(x,x.endsWith(".create"))).join("")+'</div><div class="card"><small>filters: '+esc((L.filters||[]).join(", "))+" · sorts: "+esc((L.sorts||[]).join(", "))+" · default: "+esc(L.default_sort)+"</small><table><tr>"+(L.columns||[]).map(c=>"<th>"+esc(c)+"</th>").join("")+"</tr>"+[1,2,3].map(n=>'<tr class="go" data-act="'+esc(ob)+'.view">'+(L.columns||[]).map(c=>"<td>"+esc(c)+" "+n+"</td>").join("")+"</tr>").join("")+"</table></div>"}
  else if(s.type==="form")h+='<div class="card">'+o.fields.map(f=>"<label>"+esc(f.id.replace(/_/g," "))+(f.required?"":" (optional)")+'<input placeholder="'+esc(f.default??"")+'"><small>'+esc(f.msg||(f.auto?"filled by the system":""))+"</small></label>").join("")+'</div><div class="row">'+mine.map((x,i)=>btn(x,i===0)).join("")+"</div>";
  else h+='<div class="card">'+Object.keys(o.tracks).map(t=>'<span class="chip">'+esc(t)+": <b>"+esc(st(ob,t))+"</b></span> ").join("")+"<table>"+o.fields.slice(0,8).map(f=>"<tr><td>"+esc(f.id)+'</td><td class="dim">'+esc(f.type)+"</td></tr>").join("")+'</table></div><div class="row">'+mine.map(x=>btn(x)).join("")+"</div>"}
 const rest=all.filter(x=>!(s.shows||[]).includes(x.split(".")[0]));if(rest.length)h+='<div class="row">'+rest.map(x=>btn(x,true)).join("")+"</div>";
 h+='<div class="card" id="say" role="status">'+(said||'<span class="dim">Press anything. What happens is written here.</span>')+"</div>";$("#main").innerHTML=h;
 $("#side").innerHTML="<b>Journeys</b>"+D.journeys.map(j=>'<div class="row"><button data-run="'+esc(j.id)+'">'+esc(j.id)+"</button><small>"+esc(j.role)+", "+esc(D.moments[j.moment]||j.moment)+": "+esc(j.goal)+"</small></div>").join("")+(run?"<h2>"+esc(run.j.goal)+"</h2><ol>"+run.j.steps.map((q,i)=>'<li class="'+(i===run.i?"now":"")+'">'+esc((S(q.screen)||{}).name||q.screen)+": "+esc(q.do)+(i<run.i?" ✓":"")+"</li>").join("")+"</ol><small>clicks "+clicks+" · off the path "+run.extra+" · budget "+esc(run.j.budget?.steps)+(run.j.budget?.ref?" · "+esc(run.j.budget.ref):"")+"</small>"+(run.i<run.j.steps.length?'<div class="row"><button data-skip="1">read, go on</button></div>':""):"")}
document.addEventListener("click",e=>{const b=e.target.closest("[data-act],[data-go],[data-run],[data-skip]");if(!b)return;clicks++;const d=b.dataset;if(d.act)act(d.act);else if(d.go)go(d.go);else if(d.run)start(d.run);else{const q=run.j.steps[run.i];if(["read","nav","wait"].includes(q.do)){run.i++;const n=run.j.steps[run.i];if(n)at=n.screen}else{at=q.screen;said="This step is on "+esc((S(q.screen)||{}).name)+"."}draw()}});
document.addEventListener("change",e=>{if(e.target.id==="role"){role=e.target.value;run=null;go(D.roles.find(r=>r.id===role).home)}if(e.target.id==="view"){view=e.target.value;draw()}});
// Walks every journey by pressing the real buttons. Returns clicks, and the step where it got stuck if it did.
window.measure=()=>D.journeys.map(j=>{start(j.id);let n=0;for(const q of j.steps){if(at!==q.screen){const b=document.querySelector('[data-go="'+q.screen+'"]');if(!b)return{id:j.id,stuck:q.screen,clicks:n};b.click();n++}if(["read","nav","wait"].includes(q.do)){run.i++;continue}const b=document.querySelector('#main [data-act="'+q.do+'"]');if(!b)return{id:j.id,stuck:q.screen+" has no "+q.do,clicks:n};b.click();n++;if(document.querySelector("#say .bad"))return{id:j.id,stuck:$("#say").textContent,clicks:n}}return{id:j.id,clicks:n,steps:j.steps.length,budget:j.budget?.steps,done:true}});
draw();
</script></body></html>`;
}
