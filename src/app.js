(function(){"use strict";
/* =========================================================
   The Canadian Guide to End-of-Life Planning — Companion App
   ========================================================= */
const D=window.DATA,CH=D.CH,FC=D.FC,QS=D.Q;
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const LS="cgeolp_v2",OLD_LS="eolp_flash_v1";
const PROV={ON:"Ontario",BC:"British Columbia",AB:"Alberta",QC:"Quebec"};
const L4=["A","B","C","D"];
const LEAF="M50 4 L57 20 L66 15 L63 38 L78 25 L82 33 L95 30 L88 46 L96 50 L74 66 L77 75 L54 71 L55 92 L45 92 L46 71 L23 75 L26 66 L4 50 L12 46 L5 30 L18 33 L22 25 L37 38 L34 15 L43 20 Z";
const TABC=["#2F5D5A","#4D7A8C","#6E8B5E","#B08A45","#A65A43","#7D6390"];

/* ---------------- state ---------------- */
const def=()=>({name:"",theme:null,goal:20,cards:{},star:{},hist:{},exams:[],qp:{},bm:{},sit:null,sits:[],seen:0,toured:0,fx:"flip",pfx:"curl",sound:true,comp:true,big:false,badges:{},lastQ:null,tips:{}});
function load(){
  try{let r=localStorage.getItem(LS);if(!r)r=localStorage.getItem(OLD_LS);if(r){const o=Object.assign(def(),JSON.parse(r));if(!o.badges||typeof o.badges!=="object")o.badges={};if(!o.tips||typeof o.tips!=="object")o.tips={};return o}}catch(e){}
  return def();
}
let S=load(),saveT;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}},120)}
const dkey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>dkey(new Date());
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fname=()=>esc((S.name||"").trim().split(/\s+/)[0]||"");
const reduce=()=>!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
const chNums=()=>Object.keys(CH).map(Number).sort((a,b)=>a-b);
function applyTheme(){const t=S.theme||(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;const b=$("#theme");if(b)b.innerHTML=t==="dark"?I.sun:I.moon;document.documentElement.dataset.big=S.big?"1":"0"}
function toggleTheme(){S.theme=document.documentElement.dataset.theme==="dark"?"light":"dark";applyTheme();save()}

/* ---------------- icons ---------------- */
const sv=(p,w)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||1.9}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={
  home:sv('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  cards:sv('<rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/>'),
  book:sv('<path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/>'),
  exam:sv('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9 2h6"/>'),
  cog:sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',1.6),
  sun:sv('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon:sv('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  star:sv('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  speak:sv('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
  shuffle:sv('<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
  left:sv('<path d="M15 5l-7 7 7 7"/>',2.4),right:sv('<path d="M9 5l7 7-7 7"/>',2.4),
  arrow:sv('<path d="M5 12h14M13 6l6 6-6 6"/>',2.2),
  fire:sv('<path d="M12 22c4.4 0 7-2.9 7-6.7 0-4.3-3.6-6.5-4.4-10.3-2.4 1.6-3.4 4-3.1 6.3-1.3-.6-2.2-1.9-2.4-3.4C7.3 9.7 5 12 5 15.3 5 19.1 7.6 22 12 22z"/>'),
  check:sv('<path d="M4 12.5l5 5L20 6.5"/>',2.2),
  target:sv('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'),
  medal:sv('<circle cx="12" cy="15" r="6"/><path d="M8.5 3h7l-2 6.2M8.5 3l2 6.2"/><path d="M12 12.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>',1.6),
  spark:sv('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'),
  leaf:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${LEAF}" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>`,
  book2:sv('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>'),
  flag:sv('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  search:sv('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',2),
  sound:sv('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>'),
  mute:sv('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>'),
  list:sv('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',2.2),
  fxFlip:sv('<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M12 2v20" stroke-dasharray="2 2"/>'),
  fxTumble:sv('<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M2 12h20" stroke-dasharray="2 2"/>'),
  fxCube:sv('<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12v10M12 12L3 7"/>'),
  fxSpin:sv('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>')
};

/* ---------------- sound ---------------- */
const SND=(()=>{let ctx=null;
  function ac(){if(!S.sound)return null;try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();return ctx}catch(e){return null}}
  function noise(dur,f1,f2,vol){const c=ac();if(!c)return;const n=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<n;i++){const t=i/n;d[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*t),1.5)*(.55+.45*Math.random())}
    const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type="bandpass";f.Q.value=.9;const t0=c.currentTime;f.frequency.setValueAtTime(f1,t0);f.frequency.exponentialRampToValueAtTime(f2,t0+dur);
    const g=c.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(c.destination);s.start()}
  function tone(fr,dur,vol,type,delay){const c=ac();if(!c)return;const t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||"sine";o.frequency.value=fr;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.05)}
  return{page:()=>noise(.6,3000,700,.2),flip:()=>noise(.3,1500,4200,.1),ok:()=>{tone(659,.5,.08);tone(988,.7,.06,"sine",.09)},no:()=>tone(196,.4,.07,"triangle"),pop:()=>tone(880,.15,.045),cheer:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.55,.055,"sine",i*.09))};
})();

/* ---------------- read aloud ---------------- */
function speak(text){
  if(!("speechSynthesis" in window)){toast("Read aloud isn't available in this browser");return}
  const ss=window.speechSynthesis;
  if(ss.speaking){ss.cancel();return}
  const u=new SpeechSynthesisUtterance(text);u.lang="en-CA";u.rate=.95;
  const v=ss.getVoices().find(v=>/en[-_]CA/i.test(v.lang))||ss.getVoices().find(v=>/^en/i.test(v.lang));if(v)u.voice=v;
  ss.speak(u);
}
const stopSpeak=()=>{try{window.speechSynthesis&&window.speechSynthesis.cancel()}catch(e){}};

/* ---------------- toast / modal / ask ---------------- */
function toast(m,ic){const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.innerHTML=(ic?`<i>${ic}</i>`:"")+esc(m);document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
function modal(html,cls){const o=document.createElement("div");o.className="ov";o.innerHTML=`<div class="modal ${cls||""}" role="dialog" aria-modal="true">${html}</div>`;o.addEventListener("click",e=>{if(e.target===o||e.target.closest("[data-close]"))o.remove()});document.body.appendChild(o);const f=o.querySelector("button,input,select,a");if(f)f.focus({preventScroll:true});return o}
function ask(msg,ok,cancel,danger){return new Promise(res=>{const o=modal(`<h3>${esc(ok||"Are you sure?")}</h3><p>${esc(msg)}</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-r="0">${esc(cancel||"Cancel")}</button><button class="btn ${danger?"":"gold"}" data-r="1" style="${danger?"--bg-b:var(--bad);background:var(--bad)":""}">${esc(ok||"Continue")}</button></div>`);
  let done=false;const fin=v=>{if(done)return;done=true;o.remove();res(v)};
  o.addEventListener("click",e=>{const b=e.target.closest("[data-r]");if(b)fin(b.dataset.r==="1");else if(e.target===o)fin(false)});
  o.addEventListener("keydown",e=>{if(e.key==="Escape")fin(false)});
  const y=o.querySelector('[data-r="1"]');if(y)y.focus()})}
function legal(w){
  const n=w==="privacy";
  modal(`<h3>${n?"Privacy":"Important notice"}</h3>${n?
  `<p>This app stores your name (if you give one), your flashcard ratings, starred cards, bookmarks, answers and exam results only in your browser's local storage on this device. Nothing is uploaded or shared, and no advertising cookies are used.</p><p>You can export or delete everything at any time under Settings. Clearing your browser's site data also removes it.</p>`:
  `<p>This companion app accompanies <i>The Canadian Guide to End-of-Life Planning</i>. It is general public legal information and study material. It is <b>not legal, financial, tax or medical advice</b> and does not create a lawyer–client or any other professional relationship.</p><p>Wills, estates, powers of attorney, health-care decisions and taxes are governed by provincial, territorial and federal laws that differ across Canada and change over time. Before you make or change a plan, confirm the rules that apply to you with a lawyer, a Quebec notary, a tax professional or the relevant government office.</p><p>Practice questions are for learning and self-testing only.</p>`}
  <div class="row" style="justify-content:flex-end"><button class="btn" data-close>Close</button></div>`);
}

/* ---------------- progress model (Leitner boxes 0..3) ---------------- */
const rec=id=>S.cards[id];
const isMastered=id=>!!(rec(id)&&rec(id).b>=3);
function rate(id,g){/* g: 0 again, 1 good, 2 easy */
  const r=S.cards[id]||(S.cards[id]={b:0,n:0,l:0});
  r.n++;if(g===2)r.b=3;else if(g===1)r.b=Math.min(3,r.b+1);else{r.b=0;r.l++}
  r.t=Date.now();bump();save();
}
function bump(){const k=today();S.hist[k]=(S.hist[k]||0)+1}
const todayCount=()=>S.hist[today()]||0;
function streak(){let n=0;const d=new Date();if(!S.hist[dkey(d)])d.setDate(d.getDate()-1);while(S.hist[dkey(d)]>0){n++;d.setDate(d.getDate()-1)}return n}
const masteredN=()=>FC.filter(c=>isMastered(c.id)).length;
const qOf=n=>QS[n-1];
const attempted=n=>{const p=S.qp[n];return !!(p&&p.a!=null)};
const correctQ=n=>{const p=S.qp[n];return !!(p&&p.a===qOf(n).c)};
const attemptedN=()=>QS.filter(q=>attempted(q.n)).length;
const correctN=()=>QS.filter(q=>correctQ(q.n)).length;

/* ---------------- badges ---------------- */
const BADGES=[
  {id:"first",t:"First card",ic:I.spark,ok:()=>Object.keys(S.cards).length>=1},
  {id:"goal",t:"Daily goal met",ic:I.target,ok:()=>todayCount()>=S.goal},
  {id:"s3",t:"3-day streak",ic:I.fire,ok:()=>streak()>=3},
  {id:"s7",t:"7-day streak",ic:I.fire,ok:()=>streak()>=7},
  {id:"m25",t:"25 mastered",ic:I.cards,ok:()=>masteredN()>=25},
  {id:"m100",t:"100 mastered",ic:I.cards,ok:()=>masteredN()>=100},
  {id:"m200",t:"Whole deck",ic:I.leaf,ok:()=>masteredN()>=FC.length},
  {id:"chap",t:"Chapter mastered",ic:I.medal,ok:()=>chNums().some(c=>FC.filter(x=>x.ch===c).every(x=>isMastered(x.id)))},
  {id:"q50",t:"50 questions",ic:I.book,ok:()=>attemptedN()>=50},
  {id:"q300",t:"Whole book",ic:I.book2,ok:()=>attemptedN()>=QS.length},
  {id:"ace",t:"Test ace · 80%+",ic:I.medal,ok:()=>S.sits.some(s=>s.n&&s.k/s.n>=.8)},
  {id:"exam",t:"Quick exam done",ic:I.exam,ok:()=>S.exams.length>0}
];
function checkBadges(quiet){
  const fresh=BADGES.filter(b=>!S.badges[b.id]&&b.ok());
  if(!fresh.length)return;
  fresh.forEach(b=>S.badges[b.id]=today());save();
  if(quiet)return;
  const b=fresh[fresh.length-1];
  setTimeout(()=>{toast(fresh.length>1?`${fresh.length} new badges earned`:`Badge earned: ${b.t}`,"★");SND.cheer();MP.say(fresh.length>1?`You just earned ${fresh.length} badges — including <b>${esc(b.t)}</b>. Lovely work${fname()?", "+fname():""}!`:`You earned the <b>${esc(b.t)}</b> badge. Lovely work${fname()?", "+fname():""}!`,{mood:"cheer"})},700);
}

/* =========================================================
   MAPLE — the companion
   ========================================================= */
function mapleSVG(p,cls){return `<svg class="${cls||""}" viewBox="0 0 120 132" aria-hidden="true">
 <defs>
  <radialGradient id="${p}-bd" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#FFEBC0"/><stop offset=".5" stop-color="#F3B95E"/><stop offset="1" stop-color="#D47F38"/></radialGradient>
  <linearGradient id="${p}-lf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EA6A4C"/><stop offset="1" stop-color="#A53220"/></linearGradient>
  <radialGradient id="${p}-gl"><stop offset="0" stop-color="#FFD58A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient>
 </defs>
 <circle class="mp-glow" cx="60" cy="84" r="56" fill="url(#${p}-gl)"/>
 <g class="mp-float">
  <path d="M60 52 C60 44 61 38 62 31" stroke="#7A4A22" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g class="mp-leaf"><path transform="translate(46 4) scale(.3)" d="${LEAF}" fill="url(#${p}-lf)" stroke="#A53220" stroke-width="4" stroke-linejoin="round"/></g>
  <g class="mp-arm l"><ellipse cx="21" cy="96" rx="7" ry="11" transform="rotate(30 21 96)" fill="#DE9445"/></g>
  <g class="mp-arm r"><ellipse cx="99" cy="96" rx="7" ry="11" transform="rotate(-30 99 96)" fill="#DE9445"/></g>
  <ellipse cx="60" cy="88" rx="38" ry="36" fill="url(#${p}-bd)"/>
  <ellipse cx="48" cy="72" rx="15" ry="9" fill="#fff" opacity=".3" transform="rotate(-18 48 72)"/>
  <g class="mp-eyes">
   <g class="mp-pup"><ellipse cx="47" cy="86" rx="5.4" ry="7" fill="#1B2A2F"/><circle cx="49" cy="83" r="2" fill="#fff"/></g>
   <g class="mp-pup"><ellipse cx="73" cy="86" rx="5.4" ry="7" fill="#1B2A2F"/><circle cx="75" cy="83" r="2" fill="#fff"/></g>
  </g>
  <path class="mp-happy" d="M41 88 q6 -8 12 0 M67 88 q6 -8 12 0" stroke="#1B2A2F" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path class="mp-closed" d="M41 87 q6 4 12 0 M67 87 q6 4 12 0" stroke="#1B2A2F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="37" cy="97" rx="6" ry="3.4" fill="#E8684F" opacity=".42"/><ellipse cx="83" cy="97" rx="6" ry="3.4" fill="#E8684F" opacity=".42"/>
  <path class="mp-mouth" d="M54 99 q6 6 12 0" stroke="#1B2A2F" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <ellipse class="mp-o" cx="60" cy="101" rx="4" ry="5" fill="#1B2A2F"/>
  <path class="mp-sad" d="M54 103 q6 -5 12 0" stroke="#1B2A2F" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <text class="mp-z" x="92" y="56" font-size="15" fill="#E9D19A" font-family="Georgia,serif" font-style="italic">z</text>
 </g>
</svg>`}
const TIPS=[
  "Short, daily sessions beat long cramming. Even ten cards a day adds up quickly.",
  "Say the answer out loud before you flip. It makes the memory stronger.",
  "If a card keeps coming back, read its section in the book — the section number is on the back of every card.",
  "Filter by your province to focus on the rules that apply where you live.",
  "Bookmark tricky questions with the red ribbon, then open “Bookmarks” in the contents to review them together.",
  "Once you have worked through two chapters, try sitting the matching practice test — no peeking until the end.",
  "Press <kbd>/</kbd> to search for any topic, like “executor”, “probate” or “mandate”.",
  "Talking your plan through with someone you trust helps it stick — and confirm the details with a lawyer or notary.",
  "Rate cards honestly. “Again” is not a failure — it just means you will see that card sooner.",
  "Try a different card flip or page turn in the toolbar. Small changes keep study sessions fresh."
];
const PRAISE=["Exactly right.","Well done — that one is tricky.","Yes! You know this.","Lovely. On to the next page.","Spot on.","Correct — nicely reasoned."];
const ENCOURAGE=["Not quite — the facing page explains why.","Close. Read the solution, it will make sense.","That one catches many people. Have a look at the explanation.","No worries — that is how learning works."];
const MP=(()=>{
  const el=$("#maple");let bub=null,hideT=null,moodT=null,idleT=null,typeT=null,menuOpen=false;
  el.innerHTML=`<div class="mp-btn" id="mp-btn" role="button" tabindex="0" aria-label="Maple, your guide — open menu">${mapleSVG("mp")}<span class="mp-shadow"></span></div>`;
  const btn=$("#mp-btn",el);
  function mood(m,ms){el.dataset.m=m;clearTimeout(moodT);if(ms)moodT=setTimeout(()=>{el.dataset.m="idle"},ms)}
  function hide(){clearTimeout(hideT);clearInterval(typeT);menuOpen=false;if(!bub)return;const b=bub;bub=null;b.classList.add("out");setTimeout(()=>b.remove(),300)}
  function say(html,o){
    o=o||{};if(!S.comp&&!o.force)return;
    clearTimeout(hideT);clearInterval(typeT);if(bub){bub.remove();bub=null}
    const b=document.createElement("div");b.className="mp-bub";
    b.innerHTML=`<span class="nm">Maple</span><button class="x" aria-label="Dismiss message">×</button><div class="mp-txt"></div>${o.acts?`<div class="acts">${o.acts.map((a,i)=>`<button data-i="${i}" class="${a.alt?"alt":""}">${esc(a.t)}</button>`).join("")}</div>`:""}`;
    el.insertBefore(b,el.firstChild);bub=b;
    $(".x",b).onclick=e=>{e.stopPropagation();hide()};
    if(o.acts)$(".acts",b).onclick=e=>{const x=e.target.closest("button[data-i]");if(!x)return;const a=o.acts[+x.dataset.i];hide();if(a.f)a.f()};
    const t=$(".mp-txt",b);
    const tmp=document.createElement("div");tmp.innerHTML=html;const plain=tmp.textContent;
    if(reduce()||o.instant){t.innerHTML=html}else{let i=0;const step=Math.max(1,Math.round(plain.length/90));t.innerHTML='<span></span><span class="cur"></span>';const sp=t.firstChild;
      typeT=setInterval(()=>{i+=step;sp.textContent=plain.slice(0,i);if(i>=plain.length){clearInterval(typeT);t.innerHTML=html}},18)}
    mood(o.mood||"happy",o.mood==="sleep"?0:2800);
    if(o.wave)wave();
    const ttl=o.ttl!=null?o.ttl:(o.acts?0:Math.max(5200,plain.length*60));
    if(ttl)hideT=setTimeout(hide,ttl);
    wake();
  }
  function wave(){el.classList.remove("wave");void el.offsetWidth;el.classList.add("wave");setTimeout(()=>el.classList.remove("wave"),2200)}
  function menu(){
    if(menuOpen){hide();return}
    const inApp=!$("#app").classList.contains("hidden");
    const acts=[{t:"Give me a tip",f:()=>say(pick(TIPS),{mood:"think"})}];
    if(inApp)acts.push({t:"Show me around",f:()=>tour()});
    acts.push({t:"Hide Maple",alt:true,f:()=>{S.comp=false;save();apply();toast("Maple is resting. Turn her back on in Settings.")}});
    say(`Hi${fname()?" "+fname():""}! How can I help?`,{acts,mood:"happy",instant:true});menuOpen=true;
  }
  btn.addEventListener("click",()=>{SND.pop();menu()});
  btn.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();menu()}});
  /* eyes follow the pointer */
  let px=0,py=0,raf=0;
  window.addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(look);wake()},{passive:true});
  function look(){raf=0;$$("svg").forEach(s=>{const ps=s.querySelectorAll(".mp-pup");if(!ps.length)return;const r=s.getBoundingClientRect();if(!r.width)return;const cx=r.left+r.width/2,cy=r.top+r.height*.62;let dx=px-cx,dy=py-cy;const d=Math.hypot(dx,dy)||1,m=Math.min(1,d/260);dx=dx/d*2.8*m;dy=dy/d*2.4*m;ps.forEach(p=>p.setAttribute("transform",`translate(${dx.toFixed(2)} ${dy.toFixed(2)})`))})}
  /* idle → sleep */
  function wake(){clearTimeout(idleT);if(el.dataset.m==="sleep")mood("idle");idleT=setTimeout(()=>{if(!bub)mood("sleep")},75000)}
  ["keydown","pointerdown","scroll"].forEach(ev=>window.addEventListener(ev,wake,{passive:true}));
  function apply(){el.classList.toggle("off",!S.comp);if(!S.comp)hide()}
  function place(onLanding){el.classList.toggle("on-landing",!!onLanding);el.classList.toggle("in-app",!onLanding)}
  apply();wake();
  return{say,mood,hide,wave,apply,place,el};
})();

/* =========================================================
   LANDING
   ========================================================= */
let skyRun=false,skyStart=null;
function initLanding(){
  /* title words */
  const h=$("#hero-title");let k=0;
  const walk=node=>{Array.from(node.childNodes).forEach(n=>{
    if(n.nodeType===3){const parts=n.textContent.split(/(\s+)/);const f=document.createDocumentFragment();parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}const s=document.createElement("span");s.className="w";s.style.animationDelay=(.25+k++*.08)+"s";s.textContent=p;f.appendChild(s)});n.replaceWith(f)}
    else if(n.nodeType===1&&n.classList.contains("foil")){const s=document.createElement("span");s.className="w";s.style.animationDelay=(.25+k++*.08)+"s";n.replaceWith(s);s.appendChild(n)}
    else if(n.nodeType===1)walk(n)})};
  walk(h);
  /* counts */
  const counts={fc:FC.length,q:QS.length,ch:chNums().length,t:new Set(QS.map(q=>q.t)).size};
  $$("[data-count]").forEach(b=>{const n=counts[b.dataset.count];setTimeout(()=>countUp(b,n),1300)});
  /* chapters */
  $("#l-chapters").innerHTML=chNums().map((c,i)=>`<div class="ch-it rv d${i%4}"><b>${String(c).padStart(2,"0")}</b><span>${esc(CH[c])}<small>${FC.filter(x=>x.ch===c).length} cards · ${QS.filter(x=>x.ch===c).length} questions</small></span></div>`).join("");
  /* provinces */
  const gen=FC.filter(c=>c.tag==="All").length;
  $("#l-prov").innerHTML=Object.keys(PROV).map((p,i)=>`<div class="rv d${i}" data-k="${p}"><b>${FC.filter(c=>c.tag===p).length}</b><span>${PROV[p]}</span><small>province-specific cards, plus the ${gen} that apply everywhere</small></div>`).join("");
  /* begin-maple */
  $("#begin-maple").innerHTML=mapleSVG("bm","big-maple");
  /* demo card */
  const dc=FC.find(c=>c.ch===2)||FC[0];
  $("#demo-q").textContent=dc.q;$("#demo-a").textContent=dc.a;
  let dfx="flip",dflip=false,dbusy=false;const card=$("#demo-card"),stage=$("#demo-stage");
  const dd=()=>dfx==="cube"?card.offsetWidth/2:0;
  const demoFlip=()=>{if(dbusy)return;dbusy=true;dflip=!dflip;SND.flip();const fr=fxFrames(dfx,dflip,dd(),true);
    if(reduce()||!card.animate){card.style.transform=fr[fr.length-1].transform;dbusy=false;return}
    card.getAnimations().forEach(a=>a.cancel());const a=card.animate(fr,{duration:fxDur(dfx),easing:"cubic-bezier(.3,.7,.2,1)",fill:"forwards"});a.finished.then(()=>dbusy=false,()=>dbusy=false)};
  stage.onclick=demoFlip;stage.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();demoFlip()}};
  $("#demo-fx").onclick=e=>{const b=e.target.closest("[data-fx]");if(!b||dbusy)return;$$("#demo-fx button").forEach(x=>x.classList.toggle("on",x===b));
    card.getAnimations().forEach(a=>a.cancel());dflip=false;dfx=b.dataset.fx;const d=dd();
    $(".df1",card).style.transform=dfx==="cube"?`translateZ(${d}px)`:"";
    $(".df2",card).style.transform=dfx==="tumble"?"rotateX(180deg)":dfx==="cube"?`rotateY(90deg) translateZ(${d}px)`:"rotateY(180deg)";
    card.style.transform=dfx==="cube"?`translateZ(${-d}px)`:"";setTimeout(demoFlip,60)};
  /* reveal on scroll */
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}}),{threshold:.14,rootMargin:"0px 0px -40px 0px"});
  $$("#landing .rv").forEach(x=>io.observe(x));
  /* nav */
  const nav=$("#lnav");const onS=()=>nav.classList.toggle("solid",window.scrollY>40);window.addEventListener("scroll",onS,{passive:true});onS();
  /* book tilt */
  const hero=$("#top"),hb=$("#hbook");
  hero.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse"||reduce())return;const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hb.style.setProperty("--ry",(-28+x*22).toFixed(1)+"deg");hb.style.setProperty("--rx",(8-y*12).toFixed(1)+"deg")});
  hero.addEventListener("pointerleave",()=>{hb.style.removeProperty("--ry");hb.style.removeProperty("--rx")});
  /* tile spotlight */
  $$("#landing .tile").forEach(t=>t.addEventListener("pointermove",e=>{const r=t.getBoundingClientRect();t.style.setProperty("--mx",(e.clientX-r.left)+"px");t.style.setProperty("--my",(e.clientY-r.top)+"px")}));
  /* form + buttons */
  $("#nm").value=S.name||"";
  $("#nameform").addEventListener("submit",e=>{e.preventDefault();S.name=$("#nm").value.trim();save();enter(true)});
  $$("[data-enter]").forEach(b=>b.onclick=()=>enter(true));
  $$("#landing [data-legal]").forEach(a=>a.addEventListener("click",()=>legal(a.dataset.legal)));
  initSky();
}
function countUp(b,n){if(reduce()){b.textContent=n;return}const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1400);b.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function initSky(){
  const cv=$("#sky-cv"),cx=cv.getContext("2d");let W=0,H=0,stars=[],motes=[],vis=true;
  const size=()=>{const dpr=Math.min(2,window.devicePixelRatio||1);W=cv.offsetWidth;H=cv.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
    stars=Array.from({length:Math.round(W*H/5200)},()=>({x:Math.random()*W,y:Math.random()*H*.75,r:Math.random()*1.1+.2,p:Math.random()*6.28,s:.4+Math.random()*1.4}));
    motes=Array.from({length:Math.round(Math.min(60,W/22))},()=>mk(true))};
  const mk=init=>({x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*1.8+.6,v:.15+Math.random()*.45,a:Math.random()*6.28,w:.3+Math.random()*.6,o:.25+Math.random()*.6});
  const draw=t=>{cx.clearRect(0,0,W,H);
    for(const s of stars){const a=.35+.65*Math.abs(Math.sin(s.p+t*.0006*s.s));cx.globalAlpha=a*.85;cx.fillStyle="#F4EBD6";cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.283);cx.fill()}
    for(const m of motes){m.y-=m.v;m.a+=.01;m.x+=Math.sin(m.a)*m.w*.4;if(m.y<-10)Object.assign(m,mk(false));const g=cx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r*5);g.addColorStop(0,`rgba(244,214,150,${m.o})`);g.addColorStop(1,"rgba(244,214,150,0)");cx.globalAlpha=1;cx.fillStyle=g;cx.beginPath();cx.arc(m.x,m.y,m.r*5,0,6.283);cx.fill()}
    cx.globalAlpha=1};
  const loop=t=>{if(!skyRun)return;if(vis)draw(t);requestAnimationFrame(loop)};
  size();window.addEventListener("resize",()=>{if(skyRun)size()});
  new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe($("#top"));
  skyStart=()=>{if(skyRun)return;if(reduce()){size();draw(0);return}skyRun=true;size();requestAnimationFrame(loop)};
  skyStart();
}
function showLanding(){
  stopSpeak();$("#app").classList.add("hidden");$("#landing").classList.remove("hidden");MP.place(true);
  if(location.hash)history.replaceState(null,"",location.pathname+location.search);
  window.scrollTo(0,0);if(skyStart)skyStart();document.title="The Canadian Guide to End-of-Life Planning — Companion App";
}
function enter(first){
  S.seen=1;save();skyRun=false;
  $("#landing").classList.add("hidden");$("#app").classList.remove("hidden");MP.place(false);MP.hide();
  window.scrollTo(0,0);
  const h=location.hash.replace(/^#\/?/,"").split("/")[0];
  route(VIEWS[h]?h:"home",true);
  if(first&&!S.toured){setTimeout(()=>MP.say(`Welcome${fname()?", "+fname():""}! I'm Maple. Would you like a quick tour of your guide? It takes about thirty seconds.`,{wave:true,acts:[{t:"Yes, show me",f:tour},{t:"Maybe later",alt:true,f:()=>{S.toured=1;save();MP.say("No problem. Tap me any time if you would like the tour or a study tip.",{mood:"happy"})}}]}),900)}
}

/* =========================================================
   ROUTER + SHELL
   ========================================================= */
const NAV=[["home","Home",I.home],["cards","Flashcards",I.cards],["book","Question book",I.book],["exam","Quick exam",I.exam],["settings","Settings",I.cog]];
const VIEWS={};let view="home";const seenView={};
function go(v){if(location.hash!=="#/"+v)location.hash="#/"+v;else route(v)}
function route(v,silent){
  if(!VIEWS[v])v="home";
  if(view==="book"&&v!=="book")stopSpeak();
  if(!tourOn)MP.hide();
  view=v;
  $$("#nav button,#bnav button").forEach(b=>{const on=b.dataset.v===v;b.classList.toggle("on",on);if(on)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  movePill();
  const m=$("#main");m.innerHTML="";m.className="";void m.offsetWidth;m.className="view-in";window.scrollTo(0,0);
  VIEWS[v](m);
  document.title=NAV.find(n=>n[0]===v)[1]+" · The Canadian Guide to End-of-Life Planning";
  setTimeout(()=>viewHello(v),silent?1400:650);
}
function viewHello(v){
  if(tourOn||seenView[v]||$("#app").classList.contains("hidden"))return;seenView[v]=1;
  if(v==="home"&&S.toured){const due=FC.filter(c=>rec(c.id)&&rec(c.id).b<3&&rec(c.id).l>0).length,left=Math.max(0,S.goal-todayCount());
    MP.say(left?`${greet()}${fname()?", "+fname():""}. ${due?`You have <b>${due}</b> card${due>1?"s":""} waiting for review, and `:""}<b>${left}</b> more to reach today's goal.`:`${greet()}${fname()?", "+fname():""}. Today's goal is complete — anything more is a bonus.`,{mood:"happy"});return}
  if(v==="cards"&&!S.tips.cards){S.tips.cards=1;save();MP.say("Read the question and answer it in your head. Then tap the card to flip it, and rate yourself honestly — missed cards come back first.",{mood:"think"});return}
  if(v==="book"&&!S.tips.book){S.tips.book=1;save();MP.say(isSingle()?"Tap A–D and the solution appears below the question. Swipe or use the arrows to turn the page — and try a different page turn in the toolbar!":"Choose A–D and the solution is written on the facing page. Turn pages with the corner, the arrows or your keyboard. Try a different page turn in the toolbar!",{mood:"think"});return}
  if(v==="exam"&&!S.tips.exam){S.tips.exam=1;save();MP.say("A quick exam draws random flashcards. Write or think your answer, reveal the model answer, then mark yourself.",{mood:"think"});return}
}
const greet=()=>{const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening"};
function movePill(){const nav=$("#nav"),p=$("#pill");if(!nav||!p)return;const b=$("button.on",nav);if(!b||!nav.offsetWidth){p.style.width="0";return}p.style.left=b.offsetLeft+"px";p.style.width=b.offsetWidth+"px"}
function initShell(){
  $("#nav").insertAdjacentHTML("beforeend",NAV.map(n=>`<button data-v="${n[0]}">${n[2]}<span>${n[1]}</span></button>`).join(""));
  $("#bnav").innerHTML=NAV.map(n=>`<button data-v="${n[0]}">${n[2]}<span>${n[0]==="book"?"Book":n[0]==="exam"?"Exam":n[0]==="cards"?"Cards":n[1]}</span></button>`).join("");
  $$("#nav [data-v],#bnav [data-v]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.v)));
  $("#logo").onclick=()=>go("home");$("#logo").onkeydown=e=>{if(e.key==="Enter")go("home")};
  $("#theme").onclick=toggleTheme;$("#srch").onclick=openSearch;
  $("#to-cover").onclick=showLanding;
  $$("#app [data-legal]").forEach(a=>a.addEventListener("click",()=>legal(a.dataset.legal)));
  document.addEventListener("keydown",onKey);
  window.addEventListener("hashchange",()=>{const h=location.hash;if(!/^#\//.test(h))return;if($("#app").classList.contains("hidden")){enter(false);return}route(h.slice(2).split("/")[0])});
  let rT;window.addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(()=>{movePill();if(view==="book"&&$("#bookbox")){const s=isSingle();if(s!==lastSingle)drawBook(true)}if(view==="cards"&&$("#card"))sizeCube()},150)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(movePill);
}

/* =========================================================
   HOME
   ========================================================= */
VIEWS.home=function(m){
  const tc=todayCount(),goal=S.goal,pct=Math.min(1,tc/goal),R=74,C=2*Math.PI*R;
  const mN=masteredN(),again=FC.filter(c=>rec(c.id)&&rec(c.id).b<3&&rec(c.id).l>0).length;
  const nm=fname(),qa=attemptedN(),qc=correctN();
  const lq=S.lastQ&&qOf(S.lastQ)?qOf(S.lastQ):null;
  checkBadges(true);
  m.innerHTML=`<section class="hero"><div>
    <span class="eyebrow">${new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}</span>
    <h1>${greet()}${nm?`, <em>${nm}</em>`:""}.</h1>
    <p>${tc>=goal?"Today's goal is complete. Anything more is a bonus — well done.":`${goal-tc} more ${goal-tc===1?"card or question":"cards or questions"} to reach today's goal of ${goal}.`} ${again?`<b style="color:#F3DFAA">${again}</b> card${again>1?"s are":" is"} marked to review again.`:""}</p>
    <div class="row"><button class="btn gold" id="h-go">${I.cards} Study flashcards</button><button class="btn glass" id="h-bk">${I.book} Open the question book</button><button class="btn glass" id="h-ex">${I.exam} Quick exam</button></div>
   </div>
   <div class="ring" role="img" aria-label="Daily goal: ${Math.min(tc,goal)} of ${goal}"><svg viewBox="0 0 170 170"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C9"/><stop offset="1" stop-color="#C8A15A"/></linearGradient></defs><circle cx="85" cy="85" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10"/><circle class="arc" id="arc" cx="85" cy="85" r="${R}" fill="none" stroke="url(#rg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><div><b>${tc}</b><span>of ${goal} today</span></div></div>
  </section>
  ${lq?`<div class="resume" id="h-resume" role="button" tabindex="0"><span class="bk">${lq.t}</span><div><span class="note">Continue the question book</span><b>Question ${lq.n} · ${esc(lq.ti)}</b></div><span class="go">${I.arrow}</span></div>`:""}
  <div class="stats">
   <div class="stat"><i>${I.fire}</i><b>${streak()}</b><span>Day streak</span></div>
   <div class="stat"><i>${I.cards}</i><b>${mN}<small> / ${FC.length}</small></b><span>Cards mastered</span></div>
   <div class="stat"><i>${I.book}</i><b>${qa}<small> / ${QS.length}</small></b><span>Questions tried</span></div>
   <div class="stat"><i>${I.target}</i><b>${qa?Math.round(qc/qa*100)+"%":"—"}</b><span>Question accuracy</span></div>
  </div>
  <div class="duo">
   <div class="panel"><h3>Your study calendar</h3><p class="note" style="margin:.2rem 0 0">Each square is a day. Darker means more cards and questions studied.</p><div class="heat" id="heat"></div><div class="hmini" id="hmini"></div><div class="legend">Less <i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i> More</div></div>
   <div class="panel"><h3>Milestones</h3><p class="note" style="margin:.2rem 0 0">${Object.keys(S.badges).length} of ${BADGES.length} earned</p><div class="badges">${BADGES.map(b=>`<div class="badge ${S.badges[b.id]?"got":""}" title="${esc(b.t)}${S.badges[b.id]?" — earned "+esc(S.badges[b.id]):""}"><div class="md">${b.ic}</div>${esc(b.t)}</div>`).join("")}</div></div>
  </div>
  <div class="sec-h"><div><span class="eyebrow">The twelve chapters</span><h2>Study <em>by chapter</em></h2></div><span class="note">Green: cards mastered · Gold: questions tried</span></div>
  <div class="chs">${chNums().map(c=>{const cs=FC.filter(x=>x.ch===c),mm=cs.filter(x=>isMastered(x.id)).length;const qq=QS.filter(x=>x.ch===c),qd=qq.filter(x=>attempted(x.n)).length;
    return `<div class="chc"><span class="num">${c}</span><small>Chapter ${c}</small><h4>${esc(CH[c])}</h4>
     <div class="bars"><div class="bl"><span>Cards</span><span>${mm}/${cs.length}</span></div><div class="bar"><i style="width:0" data-w="${cs.length?mm/cs.length*100:0}"></i></div>
     <div class="bl"><span>Questions</span><span>${qd}/${qq.length}</span></div><div class="bar"><i class="q" style="width:0" data-w="${qq.length?qd/qq.length*100:0}"></i></div></div>
     <div class="acts"><button data-ch="${c}" data-w="c">Cards</button><button data-ch="${c}" data-w="q">Questions</button></div></div>`}).join("")}</div>`;
  $("#h-go").onclick=()=>{fc.scope="all";go("cards")};$("#h-ex").onclick=()=>go("exam");
  $("#h-bk").onclick=()=>{bk.scope={t:"all",v:""};bk.mode="practice";bk.list=bkList();bk.i=lq?Math.max(0,bk.list.findIndex(q=>q.n===lq.n)):0;go("book")};
  const rs=$("#h-resume");if(rs){const f=()=>{bk.scope={t:"all",v:""};bk.mode="practice";bk.list=bkList();bk.i=Math.max(0,bk.list.findIndex(q=>q.n===lq.n));go("book")};rs.onclick=f;rs.onkeydown=e=>{if(e.key==="Enter")f()}}
  $$(".chc [data-ch]").forEach(b=>b.onclick=()=>{if(b.dataset.w==="q"){bk.scope={t:"ch",v:b.dataset.ch};bk.mode="practice";bk.list=bkList();bk.i=0;go("book")}else{fc.scope=b.dataset.ch;fc.mode="smart";go("cards")}});
  /* heatmap */
  const WEEKS=18,end=new Date();end.setHours(0,0,0,0);const start=new Date(end);start.setDate(start.getDate()-start.getDay()-(WEEKS-1)*7);
  let hh="";const tk=today();
  for(let i=0;i<WEEKS*7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const k=dkey(d),n=S.hist[k]||0,fut=d>end;const l=n===0?0:n<5?1:n<15?2:n<30?3:4;
    hh+=`<i data-l="${l}" class="${k===tk?"today":""}" style="${fut?"visibility:hidden":""}" title="${k}: ${n} studied"></i>`}
  $("#heat").innerHTML=hh;
  const wk=new Date(end);wk.setDate(wk.getDate()-6);let week=0,total=0,best=0,run=0;
  Object.keys(S.hist).forEach(k=>{total+=S.hist[k];const d=new Date(k+"T00:00:00");if(d>=wk&&d<=end)week+=S.hist[k]});
  Object.keys(S.hist).filter(k=>S.hist[k]>0).sort().forEach((k,i,a)=>{if(i&&(new Date(k+"T00:00:00")-new Date(a[i-1]+"T00:00:00"))/864e5===1)run++;else run=1;best=Math.max(best,run)});
  $("#hmini").innerHTML=`<div><b>${week}</b><span>Last 7 days</span></div><div><b>${total}</b><span>All time</span></div><div><b>${best}</b><span>Best streak</span></div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const a=$("#arc");if(a)a.style.strokeDashoffset=C*(1-pct);$$(".chc .bar i").forEach(x=>x.style.width=x.dataset.w+"%")}));
};

/* =========================================================
   FLASHCARDS
   ========================================================= */
let fc={scope:"all",prov:"all",mode:"smart",q:[],i:0,flipped:false,done:0,busy:false};
function matchesF(c,scope,prov){
  if(scope!=="all"&&c.ch!==+scope)return false;
  if(prov==="general")return c.tag==="All";
  if(prov!=="all"&&!(c.tag==="All"||c.tag===prov))return false;
  return true;
}
function buildQueue(){
  const p=FC.filter(c=>matchesF(c,fc.scope,fc.prov));let q;
  if(fc.mode==="smart"){const miss=p.filter(c=>rec(c.id)&&rec(c.id).b<3&&rec(c.id).l>0),nw=p.filter(c=>!rec(c.id)),rest=p.filter(c=>rec(c.id)&&rec(c.id).b<3&&!miss.includes(c));q=shuffle(miss).concat(shuffle(nw),shuffle(rest))}
  else if(fc.mode==="new")q=shuffle(p.filter(c=>!rec(c.id)));
  else if(fc.mode==="review")q=shuffle(p.filter(c=>rec(c.id)&&rec(c.id).b<3&&rec(c.id).l>0));
  else if(fc.mode==="star")q=shuffle(p.filter(c=>S.star[c.id]));
  else q=shuffle(p);
  fc.q=q;fc.i=0;fc.done=0;
}
const provOpt=()=>`<option value="all">All provinces (everything)</option><option value="general">General cards only</option>${Object.keys(PROV).map(k=>`<option value="${k}">${PROV[k]} + general cards</option>`).join("")}`;
const FX=[["flip","Flip","Classic turn",I.fxFlip],["tumble","Tumble","Head over heels",I.fxTumble],["cube","Cube","Rotate a block",I.fxCube],["spin","Spin","A full twirl",I.fxSpin]];
function fxFrames(fx,toBack,d,demo){
  const L=demo?40:70;
  const F={flip:["rotateY(0deg)",`translateZ(${L}px) rotateY(90deg)`,"rotateY(180deg)"],
    tumble:["rotateX(0deg)",`translateZ(${L}px) rotateX(-90deg)`,"rotateX(-180deg)"],
    cube:[`translateZ(${-d}px) rotateY(0deg)`,`translateZ(${-d-(demo?30:60)}px) rotateY(-45deg)`,`translateZ(${-d}px) rotateY(-90deg)`],
    spin:["rotateY(0deg) rotateZ(0deg)",`translateZ(${L*1.8}px) rotateY(270deg) rotateZ(-5deg)`,"rotateY(540deg) rotateZ(0deg)"]}[fx]||["rotateY(0deg)","rotateY(90deg)","rotateY(180deg)"];
  const seq=toBack?F:F.slice().reverse();
  return seq.map((t,i)=>({transform:t,offset:i/(seq.length-1)}));
}
const fxDur=fx=>fx==="spin"?1050:fx==="cube"?720:780;
VIEWS.cards=function(m){
  m.innerHTML=`<div class="fc-layout">
   <aside class="fc-side">
    <div class="panel"><h4>What to study</h4>
     <label class="sel">Chapter<select id="f-sc"><option value="all">All chapters</option>${chNums().map(c=>`<option value="${c}">${c}. ${esc(CH[c])}</option>`).join("")}</select></label>
     <label class="sel">Province<select id="f-pv">${provOpt()}</select></label>
     <label class="sel" style="margin-bottom:0">Show<select id="f-md"><option value="smart">Smart order (missed, new, rest)</option><option value="new">New cards only</option><option value="review">Review again only</option><option value="star">Starred only</option><option value="all">Everything, shuffled</option></select></label>
    </div>
    <div class="panel"><h4>Card motion</h4><div class="fxg" id="f-fx">${FX.map(f=>`<button data-fx="${f[0]}" class="${S.fx===f[0]?"on":""}" aria-pressed="${S.fx===f[0]}">${f[3]}${f[1]}<small>${f[2]}</small></button>`).join("")}</div></div>
    <div class="panel fc-keys"><h4>Keys</h4><p class="note" style="margin:0;line-height:2"><kbd>Space</kbd> flip · <kbd>1</kbd> again · <kbd>2</kbd> good · <kbd>3</kbd> easy<br><kbd>←</kbd> <kbd>→</kbd> back / skip · <kbd>S</kbd> star · <kbd>L</kbd> listen<br>On a phone, swipe a flipped card right if you knew it, left to see it again.</p></div>
   </aside>
   <section>
    <div class="prog"><div class="track"><div class="fill" id="f-bar"></div></div><div class="cnt" id="f-cnt"></div><button class="icbtn" id="f-sh" title="Reshuffle" aria-label="Reshuffle">${I.shuffle}</button></div>
    <div id="f-area"></div>
   </section></div>`;
  $("#f-sc").value=fc.scope;$("#f-pv").value=fc.prov;$("#f-md").value=fc.mode;
  $("#f-sc").onchange=e=>{fc.scope=e.target.value;startCards()};$("#f-pv").onchange=e=>{fc.prov=e.target.value;startCards()};$("#f-md").onchange=e=>{fc.mode=e.target.value;startCards()};
  $("#f-sh").onclick=()=>{buildQueue();showCard();toast("Shuffled")};
  $("#f-fx").onclick=e=>{const b=e.target.closest("[data-fx]");if(!b||fc.busy)return;S.fx=b.dataset.fx;save();$$("#f-fx button").forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b)});showCard(true);setTimeout(()=>{if(!fc.flipped)flip()},350)};
  if(fc.keep){fc.keep=false;showCard()}else startCards();
};
function startCards(){buildQueue();showCard()}
function sizeCube(){const c=$("#card");if(!c)return;const d=c.offsetWidth/2;$(".deck").style.setProperty("--d",d+"px");return d}
function txtCls(s){return s.length>220?"sm":s.length>130?"md":""}
function showCard(noEnter){
  const area=$("#f-area");if(!area)return;fc.busy=false;
  $("#f-bar").style.width=fc.q.length?Math.min(100,fc.i/fc.q.length*100)+"%":"0";
  $("#f-cnt").innerHTML=fc.q.length?`${Math.min(fc.i+1,fc.q.length)} <small>/ ${fc.q.length}</small>`:"";
  if(!fc.q.length){area.innerHTML=`<div class="panel sum"><span class="eyebrow">Nothing here yet</span><h2>No cards match</h2><p class="note">Nothing fits this selection — for example, no cards are marked to review or starred yet. Change the filters or study everything.</p><div class="cta"><button class="btn gold" id="f-all">Study everything</button></div></div>`;$("#f-all").onclick=()=>{fc.scope="all";fc.prov="all";fc.mode="smart";VIEWS.cards($("#main"))};return}
  if(fc.i>=fc.q.length){
    area.innerHTML=`<div class="panel sum"><span class="eyebrow">Round complete</span><div class="big">${fc.done}</div><h2>cards rated${fname()?`, ${fname()}`:""}</h2><p class="note">Today you have studied ${todayCount()} of your goal of ${S.goal}. ${masteredN()} of ${FC.length} cards are now mastered.</p><div class="cta"><button class="btn gold" id="f-again">Another round</button><button class="btn ghost" id="f-ex">Try a quick exam</button><button class="btn ghost" id="f-home">Home</button></div></div>`;
    $("#f-again").onclick=startCards;$("#f-home").onclick=()=>go("home");$("#f-ex").onclick=()=>go("exam");
    confetti();SND.cheer();MP.say(pick(["A whole round done. Take a breath — you are building something that lasts.","Round complete! Shall we go again, or try the question book?","Wonderful focus. Every card you rate makes the next review easier."]),{mood:"cheer"});checkBadges();return}
  const c=fc.q[fc.i];fc.flipped=false;
  const pv=c.tag==="All"?"All provinces":PROV[c.tag];const left=fc.q.length-fc.i;
  area.innerHTML=`<div class="stage-wrap"><div class="deck ${left<2?"empty":""}" data-fx="${S.fx}">
   ${left>2?'<div class="ghost g2"></div>':""}${left>1?'<div class="ghost g1"></div>':""}
   <div class="fly ${noEnter?"":"enter"}" id="fly"><span class="swipe-lab l" id="sw-l">Again</span><span class="swipe-lab r" id="sw-r">Knew it</span>
    <div class="tilt" id="tilt">
     <div class="card" id="card" tabindex="0" role="button" aria-label="Flashcard. Question: ${esc(c.q)}. Press Enter to flip.">
      <div class="face front"><span class="wm">${c.ch}</span>
       <div class="ftags"><span>Chapter ${c.ch}</span><span>${esc(pv)}</span><span class="sp"></span><button class="cbtn" data-a="say" aria-label="Read aloud">${I.speak}</button><button class="cbtn ${S.star[c.id]?"on":""}" data-a="star" aria-label="${S.star[c.id]?"Unstar":"Star"} this card">${I.star}</button></div>
       <div class="lab">Question</div><div class="txt ${txtCls(c.q)}">${esc(c.q)}</div>
       <div class="meta"><span class="tap-hint"><i></i>Tap to reveal</span><span>§ ${esc(c.sec)}</span></div></div>
      <div class="face back"><span class="wm">${c.ch}</span>
       <div class="ftags"><span>Chapter ${c.ch} · § ${esc(c.sec)}</span><span class="sp"></span><button class="cbtn" data-a="say" aria-label="Read aloud">${I.speak}</button></div>
       <div class="lab">Answer</div><div class="txt ${txtCls(c.a)}">${esc(c.a)}</div>
       <div class="meta"><span>Read section ${esc(c.sec)} — ${esc(CH[c.ch])}</span></div></div>
     </div></div></div></div></div>
   <p class="hint" id="f-hint">Think of your answer first, then tap the card or press <kbd>Space</kbd>.</p>
   <div class="grades hidden" id="f-gr"><button class="g0" data-k="0"><span>Again</span><small>Show it soon · <kbd>1</kbd></small></button><button class="g1" data-k="1"><span>Good</span><small>I knew it · <kbd>2</kbd></small></button><button class="g2" data-k="2"><span>Easy</span><small>Mark mastered · <kbd>3</kbd></small></button></div>
   <div class="fnav"><button class="btn ghost sm" id="f-prev" ${fc.i===0?"disabled":""}>${I.left} Back</button><span class="note">${fc.done} rated this round</span><button class="btn ghost sm" id="f-next">${fc.i>=fc.q.length-1?"Finish":"Skip"} ${I.right}</button></div>`;
  const card=$("#card"),fly=$("#fly"),tilt=$("#tilt"),deck=$(".deck");
  fly.addEventListener("animationend",()=>fly.classList.remove("enter"),{once:true});
  if(S.fx==="cube")sizeCube();
  card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();flip()}};
  card.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;e.stopPropagation();
    if(b.dataset.a==="star")toggleStar(c,b);else speak(fc.flipped?"Answer. "+c.a:"Question. "+c.q)});
  $("#f-gr").onclick=e=>{const b=e.target.closest("button[data-k]");if(b)grade(+b.dataset.k)};
  $("#f-prev").onclick=()=>navCard(-1);$("#f-next").onclick=()=>navCard(1);
  /* tilt + glare */
  deck.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse"||drag||fc.busy||reduce())return;const r=deck.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;tilt.style.transform=`rotateX(${((.5-y)*9).toFixed(2)}deg) rotateY(${((x-.5)*11).toFixed(2)}deg)`;const f=$(".face.front",card);f.style.setProperty("--gx",x*100+"%");f.style.setProperty("--gy",y*100+"%")});
  deck.addEventListener("pointerleave",()=>{tilt.style.transform=""});
  /* drag / swipe / tap */
  let drag=null;
  fly.addEventListener("pointerdown",e=>{if(e.target.closest("button")||fc.busy||e.button>0)return;drag={x:e.clientX,y:e.clientY,dx:0,on:false,id:e.pointerId}});
  fly.addEventListener("pointermove",e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.on){if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)){drag.on=true;try{fly.setPointerCapture(e.pointerId)}catch(_){}tilt.style.transform=""}else return}
    drag.dx=dx;fly.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
    if(fc.flipped){$("#sw-r").style.opacity=Math.max(0,Math.min(1,dx/110));$("#sw-l").style.opacity=Math.max(0,Math.min(1,-dx/110))}});
  const end=e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;
    if(!d.on){if(e.type==="pointerup")flip();return}
    $("#sw-r").style.opacity=0;$("#sw-l").style.opacity=0;
    if(Math.abs(d.dx)>110){if(fc.flipped){grade(d.dx>0?1:0);return}if(d.dx<0&&fc.i<fc.q.length-1||d.dx>0&&fc.i>0){flyOut(d.dx>0?1:-1,()=>{fc.i+=d.dx<0?1:-1;showCard()});return}}
    const from=fly.style.transform;fly.style.transform="";if(fly.animate&&!reduce())fly.animate([{transform:from},{transform:"none"}],{duration:380,easing:"cubic-bezier(.2,1.4,.4,1)"})};
  fly.addEventListener("pointerup",end);fly.addEventListener("pointercancel",end);
}
function toggleStar(c,b){if(S.star[c.id])delete S.star[c.id];else S.star[c.id]=1;save();if(b){b.classList.toggle("on",!!S.star[c.id]);b.setAttribute("aria-label",(S.star[c.id]?"Unstar":"Star")+" this card")}toast(S.star[c.id]?"Card starred":"Star removed",S.star[c.id]?"★":"")}
function flip(){
  const card=$("#card");if(!card||fc.busy)return;fc.flipped=!fc.flipped;stopSpeak();
  const fr=fxFrames(S.fx,fc.flipped,S.fx==="cube"?sizeCube():0);SND.flip();
  $("#f-gr").classList.toggle("hidden",!fc.flipped);$("#f-hint").classList.toggle("hidden",fc.flipped);
  if(reduce()||!card.animate){card.style.transform=fr[fr.length-1].transform;return}
  fc.busy=true;card.getAnimations().forEach(a=>a.cancel());
  const a=card.animate(fr,{duration:fxDur(S.fx),easing:"cubic-bezier(.3,.7,.2,1)",fill:"forwards"});
  a.finished.then(()=>{fc.busy=false},()=>{fc.busy=false});
  if(fc.flipped&&!S.tips.grade){S.tips.grade=1;save();setTimeout(()=>MP.say("How did you do? Choose <b>Again</b> if you were unsure, <b>Good</b> if you knew it, or <b>Easy</b> if it is second nature.",{mood:"think"}),700)}
}
function flyOut(dir,cb){const fly=$("#fly");if(!fly){cb();return}fc.busy=true;
  if(reduce()||!fly.animate){cb();return}
  const from=fly.style.transform||"none";const to=dir===0?"translate(0,-130%) rotate(-4deg) scale(.9)":`translate(${dir*135}%,-6%) rotate(${dir*16}deg)`;
  const a=fly.animate([{transform:from},{transform:to}],{duration:430,easing:"cubic-bezier(.5,0,.75,0)",fill:"forwards"});a.finished.then(cb,cb)}
function navCard(d){const n=fc.i+d;if(n<0||fc.i>=fc.q.length||fc.busy)return;stopSpeak();if(n>=fc.q.length){fc.i=n;showCard();return}fc.i=n;showCard()}
function grade(g){
  if(!fc.flipped||fc.busy)return;const c=fc.q[fc.i];if(!c)return;stopSpeak();
  rate(c.id,g);if(g===0)fc.q.push(c);fc.done++;
  if(g===0)SND.no();else SND.ok();
  const tc=todayCount();if(tc===S.goal){setTimeout(()=>{confetti();MP.say(`That's your daily goal of ${S.goal}${fname()?", "+fname():""}! Anything more today is a bonus.`,{mood:"cheer"})},500)}
  else if(g>0&&Math.random()<.12)MP.say(pick(["Nicely done.","You're on a roll.","That one's yours now.","Steady progress — I love it."]),{mood:"happy",ttl:2600});
  flyOut(g===2?0:g===1?1:-1,()=>{fc.i++;showCard();checkBadges()});
}

/* confetti */
function confetti(){if(reduce())return;const cv=document.createElement("canvas");cv.className="confetti";document.body.appendChild(cv);const x=cv.getContext("2d"),W=cv.width=innerWidth,H=cv.height=innerHeight;
  const cols=["#C8A15A","#E9D19A","#2F5D5A","#B8432F","#F3E9D1","#4F8E73"];
  const P=Array.from({length:150},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:Math.random()*6.28,vr:(Math.random()-.5)*.3,s:5+Math.random()*7,c:pick(cols),leaf:Math.random()<.25}));
  const lp=new Path2D(LEAF);let t0=performance.now();
  const f=t=>{const k=(t-t0)/1000;x.clearRect(0,0,W,H);P.forEach(p=>{p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.globalAlpha=Math.max(0,1-k/3);x.fillStyle=p.c;if(p.leaf){x.scale(p.s/40,p.s/40);x.translate(-50,-50);x.fill(lp)}else x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});if(k<3)requestAnimationFrame(f);else cv.remove()};requestAnimationFrame(f)}

/* =========================================================
   QUICK EXAM
   ========================================================= */
let ex=null,exT=null;
VIEWS.exam=function(m){
  clearInterval(exT);
  if(ex&&ex.run){drawExam();return}
  const last=S.exams.slice(-6).reverse();
  m.innerHTML=`<div class="ex-grid"><div class="panel"><span class="eyebrow">Quick exam</span><h2 style="margin:.5rem 0 .4rem;font-size:2rem;font-weight:400">Test yourself <em style="color:var(--gold3)">without peeking</em></h2><p class="note" style="margin-top:0">Questions come one at a time in random order, drawn from the flashcards. Write or think your answer, reveal the model answer, then mark yourself honestly. Your marks also update your flashcard progress.</p>
  <div class="opts"><label class="sel">Chapters<select id="e-sc"><option value="all">All chapters</option>${chNums().map(c=>`<option value="${c}">${c}. ${esc(CH[c])}</option>`).join("")}</select></label>
  <label class="sel">Province<select id="e-pv">${provOpt()}</select></label>
  <label class="sel">Questions<select id="e-n"><option>10</option><option selected>25</option><option>50</option><option value="0">All matching</option></select></label>
  <label class="sel">Time limit<select id="e-t"><option value="0">None</option><option value="10">10 minutes</option><option value="20">20 minutes</option><option value="40">40 minutes</option></select></label></div>
  <button class="btn gold lg" id="e-go">Start the exam ${I.arrow}</button></div>
  <div class="panel"><h3>Recent results</h3>${last.length?`<table class="tb" style="margin-top:.6rem"><tr><th>Date</th><th>Scope</th><th class="n">Score</th></tr>${last.map(r=>`<tr><td>${esc(r.d)}</td><td>${esc(r.s)}</td><td class="n">${r.k}/${r.n} · ${Math.round(r.k/r.n*100)}%</td></tr>`).join("")}</table>`:`<p class="note">No exams yet. Your last six results will appear here.</p>`}
  ${S.sits.length?`<h3 style="margin-top:1.4rem">Practice test sittings</h3><table class="tb" style="margin-top:.6rem"><tr><th>Date</th><th>Test</th><th class="n">Score</th></tr>${S.sits.slice(-6).reverse().map(r=>`<tr><td>${esc(r.d)}</td><td>Test ${r.t}</td><td class="n">${r.k}/${r.n} · ${Math.round(r.k/r.n*100)}%</td></tr>`).join("")}</table>`:""}</div></div>`;
  $("#e-go").onclick=()=>{
    const sc=$("#e-sc").value,pv=$("#e-pv").value,n=+$("#e-n").value,tl=+$("#e-t").value;
    let p=shuffle(FC.filter(c=>matchesF(c,sc,pv)));if(n)p=p.slice(0,n);
    if(!p.length){toast("No cards match that selection");return}
    const label=(sc==="all"?"All chapters":"Ch. "+sc)+(pv==="all"?"":" · "+(pv==="general"?"General":PROV[pv]));
    ex={run:true,q:p,i:0,res:[],rev:false,txt:"",end:tl?Date.now()+tl*60000:0,label};drawExam();
  };
};
function drawExam(){
  const m=$("#main");clearInterval(exT);
  if(ex.i>=ex.q.length)return finishExam();
  const c=ex.q[ex.i];
  m.innerHTML=`<div class="panel" style="max-width:860px;margin:0 auto"><div class="examhead"><span class="eyebrow">Question ${ex.i+1} of ${ex.q.length}</span><div style="display:flex;gap:.5rem;align-items:center"><span class="timer ${ex.end?"":"hidden"}" id="e-tm"></span><button class="icbtn" id="e-say" aria-label="Read the question aloud">${I.speak}</button><button class="btn ghost sm" id="e-quit">End exam</button></div></div>
  <div class="bar bar-t"><i style="width:${ex.i/ex.q.length*100}%;background:linear-gradient(90deg,var(--teal),var(--gold))"></i></div>
  <div class="note" style="margin-top:1rem">Chapter ${c.ch} · ${esc(CH[c.ch])}${c.tag!=="All"?" · "+PROV[c.tag]:""}</div>
  <div class="qbox">${esc(c.q)}</div>
  <label class="sr" for="e-txt">Your answer</label><textarea id="e-txt" placeholder="Write your answer here (optional) …">${esc(ex.txt||"")}</textarea>
  <div id="e-rev">${ex.rev?`<div class="ans"><small>Model answer · section ${esc(c.sec)}</small>${esc(c.a)}</div><div class="grades ex-grades"><button class="g0" data-k="0"><span>I missed it</span><small><kbd>1</kbd></small></button><button class="g1" data-k="1"><span>I got it</span><small><kbd>2</kbd></small></button></div>`:`<div class="row"><button class="btn" id="e-show">Reveal the answer</button></div>`}</div></div>`;
  $("#e-quit").onclick=async()=>{if(await ask("End the exam now and see your results so far?","End exam","Keep going")){ex.i=ex.q.length;finishExam()}};
  $("#e-say").onclick=()=>speak(ex.rev?c.q+". Model answer. "+c.a:c.q);
  $("#e-txt").oninput=e=>ex.txt=e.target.value;
  const sh=$("#e-show");if(sh)sh.onclick=()=>{ex.rev=true;SND.flip();drawExam()};
  const gr=$(".grades",m);if(gr)gr.onclick=e=>{const b=e.target.closest("button[data-k]");if(!b)return;exMark(b.dataset.k==="1")};
  if(ex.end){const tick=()=>{const left=ex.end-Date.now(),el=$("#e-tm");if(!el){clearInterval(exT);return}if(left<=0){clearInterval(exT);toast("Time is up");ex.i=ex.q.length;finishExam();return}const mm=Math.floor(left/60000),ss=Math.floor(left/1000)%60;el.textContent=mm+":"+String(ss).padStart(2,"0");el.classList.toggle("low",left<60000)};tick();exT=setInterval(tick,1000)}
}
function exMark(k){const c=ex.q[ex.i];ex.res.push({c,k});rate(c.id,k?1:0);k?SND.ok():SND.no();ex.i++;ex.rev=false;ex.txt="";stopSpeak();drawExam()}
function finishExam(){
  clearInterval(exT);const m=$("#main");const r=ex.res,k=r.filter(x=>x.k).length,n=r.length;ex.run=false;
  if(n){S.exams.push({d:today(),s:ex.label,k,n});S.exams=S.exams.slice(-30);save()}
  const by={};r.forEach(x=>{const b=by[x.c.ch]||(by[x.c.ch]={k:0,n:0});b.n++;if(x.k)b.k++});
  const missed=r.filter(x=>!x.k).map(x=>x.c);const pc=n?Math.round(k/n*100):0;
  m.innerHTML=`<div class="panel sum" style="max-width:720px"><span class="eyebrow">Exam finished</span>${n?`<div class="big" style="margin:.6rem 0">${pc}%</div><p class="note">${k} of ${n} answered correctly · ${esc(ex.label)}</p>
  <table class="tb" style="text-align:left;margin-top:1rem"><tr><th>Chapter</th><th class="n">Correct</th></tr>${Object.keys(by).sort((a,b)=>a-b).map(c=>`<tr><td>${c}. ${esc(CH[c])}</td><td class="n">${by[c].k}/${by[c].n}</td></tr>`).join("")}</table>`:`<h2>No questions answered</h2>`}
  <div class="cta"><button class="btn gold" id="x-again">New exam</button>${missed.length?`<button class="btn ghost" id="x-miss">Study the ${missed.length} missed card${missed.length>1?"s":""}</button>`:""}<button class="btn ghost" id="x-home">Home</button></div></div>`;
  $("#x-again").onclick=()=>{ex=null;VIEWS.exam($("#main"))};$("#x-home").onclick=()=>{ex=null;go("home")};
  const mb=$("#x-miss");if(mb)mb.onclick=()=>{fc.scope="all";fc.prov="all";fc.mode="all";fc.q=missed.slice();fc.i=0;fc.done=0;fc.keep=true;ex=null;go("cards")};
  if(n){if(pc>=80){confetti();SND.cheer()}MP.say(pc>=80?`${pc}% — excellent work${fname()?", "+fname():""}!`:pc>=50?`${pc}%. A solid base — the missed cards are the best place to go next.`:`${pc}%. Every miss shows you exactly what to review. Shall we study them?`,{mood:pc>=50?"cheer":"happy"})}
  checkBadges();
}

/* =========================================================
   QUESTION BOOK
   ========================================================= */
let coverDone=false,lastSingle=null;
let bk={scope:{t:"all",v:""},list:[],i:0,mode:"practice",busy:false,fresh:null,result:null};
function bkList(){const s=bk.scope;return QS.filter(q=>s.t==="all"||(s.t==="test"&&q.t===+s.v)||(s.t==="ch"&&q.ch===+s.v)||(s.t==="bm"&&S.bm[q.n]))}
const isSingle=()=>window.innerWidth<900;
const PFX=[["curl","Soft curl"],["classic","Classic"],["flutter","Flutter"]];
const ORN=`<svg viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="52" stroke="#C9B48A" stroke-width="1.2"/><circle cx="60" cy="60" r="42" stroke="#C9B48A" stroke-width="1" stroke-dasharray="2 5"/><path d="M60 6v14M60 100v14M6 60h14M100 60h14" stroke="#B08A45" stroke-width="2" stroke-linecap="round"/><g transform="translate(36 34) scale(.48)"><path d="${LEAF}" fill="#B8432F" opacity=".85" stroke="#8E3326" stroke-width="3" stroke-linejoin="round"/></g></svg>`;
VIEWS.book=function(m){
  bk.list=bkList();if(bk.i>=bk.list.length)bk.i=0;
  m.innerHTML=`<div class="bk-wrap"><aside class="toc" id="toc" aria-label="Contents"></aside><section style="min-width:0">
  <div class="bk-top"><div style="display:flex;gap:.8rem;align-items:center"><button class="icbtn tocbtn" id="tocbtn" aria-label="Open contents">${I.list}</button><div class="crumb" id="crumb"></div></div>
   <div class="bk-tools"><div class="seg" role="group" aria-label="Mode"><button id="m-pr" data-m="practice">Practice</button><button id="m-sit" data-m="sit">Sit a test</button></div>
   <div class="seg" role="group" aria-label="Page turn" id="pfx">${PFX.map(p=>`<button data-p="${p[0]}" class="${S.pfx===p[0]?"on":""}">${p[1]}</button>`).join("")}</div>
   <button class="icbtn" id="b-snd" aria-label="Page sounds">${S.sound?I.sound:I.mute}</button></div></div>
  <div class="desk"><div class="book" id="bookbox"></div></div>
  <div class="bk-nav" id="bknav"><button class="rbtn" id="b-prev" aria-label="Previous page">${I.left}</button><div class="scrub"><div class="note"><span id="b-pos"></span><span id="b-pct"></span></div><input type="range" id="b-range" min="1" value="1" aria-label="Go to question"></div><label class="sr" for="b-jump">Jump to question number</label><input class="inp jump" id="b-jump" type="number" min="1" max="${QS.length}" placeholder="No." title="Jump to question number"><button class="rbtn" id="b-next" aria-label="Next page">${I.right}</button></div>
  <div class="keys"><kbd>←</kbd> <kbd>→</kbd> turn pages · <kbd>A</kbd>–<kbd>D</kbd> choose · <kbd>M</kbd> bookmark · <kbd>L</kbd> listen</div>
  </section></div>`;
  drawToc();drawBook(true);
  $("#b-prev").onclick=()=>turn(-1);$("#b-next").onclick=()=>turn(1);
  $("#tocbtn").onclick=()=>openToc(true);
  $$(".seg [data-m]").forEach(b=>b.onclick=()=>setMode(b.dataset.m));
  $("#pfx").onclick=e=>{const b=e.target.closest("[data-p]");if(!b)return;S.pfx=b.dataset.p;save();$$("#pfx button").forEach(x=>x.classList.toggle("on",x===b));if(bk.i<bk.list.length-1)turn(1);else turn(-1)};
  $("#b-snd").onclick=e=>{S.sound=!S.sound;save();e.currentTarget.innerHTML=S.sound?I.sound:I.mute;toast(S.sound?"Sounds on":"Sounds off")};
  $("#b-jump").onchange=e=>{const n=+e.target.value;const k=bk.list.findIndex(q=>q.n===n);if(k>=0)jumpTo(k);else if(n>=1&&n<=QS.length){bk.scope={t:"all",v:""};if(bk.mode==="sit")bk.mode="practice";bk.list=bkList();jumpTo(n-1)}else toast("Choose a number from 1 to "+QS.length)};
  $("#b-range").oninput=e=>{const q=bk.list[e.target.value-1];if(q)$("#b-pos").innerHTML=`Question <b>${q.n}</b> · ${e.target.value} of ${bk.list.length}`;e.target.style.setProperty("--p",(e.target.value-1)/Math.max(1,bk.list.length-1)*100+"%")};
  $("#b-range").onchange=e=>jumpTo(Math.max(0,Math.min(bk.list.length-1,+e.target.value-1)));
  const bx=$("#bookbox");bx.onclick=bkClick;bx.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&e.target.dataset.o!=null){e.preventDefault();bkClick(e)}};
  let tx=null,ty=null;bx.addEventListener("touchstart",e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
  bx.addEventListener("touchend",e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1)},{passive:true});
};
function openToc(o){const t=$("#toc");if(!t)return;t.classList.toggle("open",o);const sc=$(".toc-scrim");if(o&&!sc&&isTocDrawer()){const s=document.createElement("div");s.className="toc-scrim";s.onclick=()=>openToc(false);document.body.appendChild(s)}else if(!o&&sc)sc.remove()}
const isTocDrawer=()=>window.innerWidth<=1100;
function jumpTo(i){if(bk.busy)return;bk.i=i;bk.result=null;drawBook(false);drawToc()}
async function setMode(md){
  if(md===bk.mode)return;
  if(md==="sit"){
    const T=bk.scope.t==="test"?+bk.scope.v:(bk.list[bk.i]?bk.list[bk.i].t:1);
    if(S.sit&&S.sit.t!==T&&Object.keys(S.sit.ans).length&&!(await ask(`Starting Test ${T} will discard your unfinished attempt on Test ${S.sit.t}.`,`Start Test ${T}`,"Keep my attempt")))return;
    if(!S.sit||S.sit.t!==T)S.sit={t:T,ans:{},flag:{},t0:Date.now()};
    save();bk.mode="sit";bk.scope={t:"test",v:T};bk.list=bkList();
    const f=bk.list.findIndex(q=>S.sit.ans[q.n]==null);bk.i=f<0?0:f;
    MP.say(`You're sitting <b>Test ${T}</b>: 50 questions, no feedback until you finish. Take your time — the clock is only for your information.`,{mood:"think"});
  }else bk.mode="practice";
  bk.result=null;drawToc();drawBook(true);
}
function drawToc(){
  const t=$("#toc");if(!t)return;const st=t.scrollTop,sc=bk.scope;
  const att=attemptedN(),cor=correctN(),bmN=Object.keys(S.bm).length;
  const ring=(a,tot,col,lab)=>{const C=75.4;return `<span class="ring2"><svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" stroke-opacity=".16" stroke-width="2.6"/><circle cx="15" cy="15" r="12" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-a/tot)}"/></svg>${lab}</span>`};
  let h=`<h3>Contents</h3><div class="sub">${att} of ${QS.length} attempted · ${cor} correct</div>
  <div class="${sc.t==="all"?"on":""}" data-t="all" tabindex="0" role="button"><span>All ${QS.length} questions</span><i>${QS.length}</i></div>
  <div class="${sc.t==="bm"?"on":""}" data-t="bm" tabindex="0" role="button"><span>★ Bookmarks</span><i>${bmN}</i></div>`;
  const tests=[...new Set(QS.map(q=>q.t))].sort((a,b)=>a-b);
  for(const T of tests){
    const qs=QS.filter(q=>q.t===T),a=qs.filter(q=>attempted(q.n)).length,c=qs.filter(q=>correctQ(q.n)).length,on=sc.t==="test"&&+sc.v===T;
    const chs=[...new Set(qs.map(q=>q.ch))].sort((x,y)=>x-y);
    const openT=on||(sc.t==="ch"&&chs.includes(+sc.v));
    h+=`<div class="tt ${on?"on":""}" data-t="test" data-v="${T}" tabindex="0" role="button">${ring(a,qs.length,on?"#E9D19A":TABC[(T-1)%6],T)}<span>Test ${T}<small>Chapters ${chs.join(" & ")} · ${a}/${qs.length} · ${c} correct</small></span></div>
    <div class="chs2 ${openT?"open":""}">${chs.map(ch=>{const cq=qs.filter(q=>q.ch===ch),ca=cq.filter(q=>attempted(q.n)).length;return `<div class="${sc.t==="ch"&&+sc.v===ch?"on":""}" data-t="ch" data-v="${ch}" tabindex="0" role="button"><span>${ch}. ${esc(CH[ch])}<small>${ca}/${cq.length} attempted</small></span></div>`}).join("")}</div>`;
  }
  t.innerHTML=h;t.scrollTop=st;
  const pk=el=>{bk.scope={t:el.dataset.t,v:el.dataset.v||""};if(bk.mode==="sit"&&!(bk.scope.t==="test"&&S.sit&&+bk.scope.v===S.sit.t))bk.mode="practice";bk.list=bkList();bk.i=0;bk.result=null;openToc(false);drawToc();drawBook(true)};
  t.onclick=e=>{const el=e.target.closest("[data-t]");if(el)pk(el)};
  t.onkeydown=e=>{const el=e.target.closest("[data-t]");if(el&&(e.key==="Enter"||e.key===" ")){e.preventDefault();pk(el)}};
}
const head=q=>`<div class="rh"><span>Test ${q.t} · Chapter ${q.ch}</span><span>Section ${esc(q.sec)}</span></div>`;
function qBody(q,live){
  const sit=bk.mode==="sit"&&S.sit,p=S.qp[q.n]||{},sa=sit?S.sit.ans[q.n]:undefined,lock=!sit&&p.a!=null,rev=!sit&&p.sh&&p.a==null;
  let h=head(q)+`<div class="qhead"><span class="qno"><sup>No.</sup>${q.n}</span><span class="qti">${esc(q.ti)}</span></div><p class="qtext">${esc(q.q)}</p><ul class="opts2">`;
  h+=q.o.map((o,i)=>{
    let cls="";
    if(sit)cls=sa===i?"picked":"";
    else if(lock)cls=i===q.c?"right lock":p.a===i?"wrong lock":"lock";
    else if(rev)cls=i===q.c?"right lock":"lock";
    const mk=(lock||rev)?(i===q.c?"✓":p.a===i?"✕":L4[i]):L4[i];
    const act=live&&(sit||(!lock&&!rev))?`tabindex="0" role="button" data-o="${i}" aria-label="Answer ${L4[i]}: ${esc(o)}"`:"";
    return `<li class="opt ${cls}${live&&bk.fresh===q.n&&(i===q.c||p.a===i)?" fresh":""}" ${act}><span class="sl">${mk}</span><span>${esc(o)}</span></li>`}).join("")+`</ul>`;
  if(live){h+=`<div class="pg-tools"><button data-act="say-q">${I.speak} Listen</button>${sit?`<button data-act="flag">${I.flag} ${S.sit.flag[q.n]?"Flagged for review":"Flag for review"}</button>`:""}</div>`}
  return h;
}
function solBody(q,live,inline){
  const p=S.qp[q.n]||{};
  if(p.a==null&&!p.sh)return `<div class="ph">${ORN}<div class="big">Answer first, then read on</div><p>Choose an option on the facing page and the solution will be written here.</p>${live?`<button class="btn ghost sm" data-act="reveal" style="color:#1B3233">Show the answer</button>`:""}</div>`;
  const ok=p.a===q.c,fr=live&&bk.fresh===q.n;
  return (p.a!=null?`<div class="stamp ${ok?"ok":"no"}${fr?" fresh":""}">${ok?"Correct":"Not quite"}</div>`:"")+`<div class="solh">Solution</div><div class="res ${p.a!=null&&!ok?"no":""}">${p.a!=null?(ok?"Yes. ":"Not this time. "):""}The answer is <b>${L4[q.c]}</b>: ${esc(q.o[q.c])}</div><p class="expl ${fr?"fresh-ink":""}">${esc(q.e)}</p><div class="see">Read more · Section ${esc(q.sec)} · ${esc(CH[q.ch])}</div>${live?`<div class="pg-tools"><button data-act="say-e">${I.speak} Listen to the explanation</button></div>`:""}`;
}
function sheetBody(q){
  const T=S.sit.t,qs=QS.filter(x=>x.t===T),done=qs.filter(x=>S.sit.ans[x.n]!=null).length,fl=qs.filter(x=>S.sit.flag[x.n]).length;
  return `<div class="rh"><span>Answer sheet · Test ${T}</span><span>Section ${esc(q.sec)}</span></div><div class="sheetmeta"><span><b>${done}</b> / ${qs.length} answered${fl?` · ${fl} flagged`:""}</span><span class="sitTime">${fmtT(Date.now()-S.sit.t0)}</span></div>
  <div class="sheet">${qs.map(x=>{const a=S.sit.ans[x.n];return `<button class="bub ${a!=null?"done":""} ${x.n===q.n?"cur":""} ${S.sit.flag[x.n]?"fl":""}" data-go="${x.n}" aria-label="Question ${x.n}${a!=null?", answered "+L4[a]:""}"><b>${x.n}</b><i>${a!=null?L4[a]:"·"}</i></button>`}).join("")}</div>
  <p class="note" style="color:#6F7372;font-size:.82rem">No feedback until you finish — like the real thing. You can change any answer before scoring.</p><button class="btn gold" data-act="finish">Finish &amp; score the test</button>`;
}
const fmtT=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(s%60).padStart(2,"0")};
const bmRib=(q,live)=>live?`<button class="rib ${S.bm[q.n]?"on":""}" data-act="bm" aria-label="${S.bm[q.n]?"Remove bookmark":"Bookmark this question"}" title="Bookmark (M)"></button>`:"";
const pageNos=n=>[n*2-1,n*2];
function pgL(q,live){return `<div class="pg-in">${qBody(q,live)}</div>${bmRib(q,live)}${live?`<button class="corner pv" data-act="prev" aria-label="Previous page"></button>`:""}<div class="pgno">${pageNos(q.n)[0]}</div>`}
function pgR(q,live){const sit=bk.mode==="sit"&&S.sit;return `<div class="pg-in">${sit?sheetBody(q):head(q)+solBody(q,live)}</div>${live?`<button class="corner nx" data-act="next" aria-label="Next page"></button>`:""}<div class="pgno">${pageNos(q.n)[1]}</div>`}
function pgOne(q,live){
  const sit=bk.mode==="sit"&&S.sit,p=S.qp[q.n]||{};
  let extra="";
  if(sit){if(live)extra=`<div class="pg-tools"><button data-act="sheet">Answer sheet (${QS.filter(x=>x.t===S.sit.t&&S.sit.ans[x.n]!=null).length}/${QS.filter(x=>x.t===S.sit.t).length})</button><button data-act="finish" style="background:var(--gold);box-shadow:none">Finish &amp; score</button></div>`}
  else if(p.a!=null||p.sh)extra=`<div class="one-sol" style="margin-top:1.4rem;padding-top:1.2rem;border-top:1px solid rgba(31,43,46,.14)">${solBody(q,live).replace('class="stamp','style="position:static;display:inline-block;margin-bottom:.8rem" class="stamp').replace('class="res','style="padding-right:0" class="res')}</div>`;
  else if(live)extra=`<div class="pg-tools"><button data-act="reveal">Show the answer</button></div>`;
  return `<div class="pg-in">${qBody(q,live)}${extra}</div>${bmRib(q,live)}${live?`<button class="corner nx" data-act="next" aria-label="Next page"></button>`:""}<div class="pgno">${q.n}</div>`;
}
function setStacks(){const box=$("#bookbox");if(!box)return;const n=bk.list.length,f=n>1?bk.i/(n-1):0;const l=$(".stack.l",box),r=$(".stack.r",box);if(l)l.style.setProperty("--w",(2+f*10).toFixed(1)+"px");if(r)r.style.setProperty("--w",(2+(1-f)*10).toFixed(1)+"px")}
function drawBook(full){
  const box=$("#bookbox");if(!box)return;const list=bk.list,sc=bk.scope,single=isSingle();lastSingle=single;
  $("#m-pr").classList.toggle("on",bk.mode==="practice");$("#m-sit").classList.toggle("on",bk.mode==="sit");
  $("#crumb").innerHTML=sc.t==="all"?`<span class="cn">The whole book</span>All ${QS.length} questions`:sc.t==="bm"?`<span class="cn">Your bookmarks</span>${list.length} saved`:sc.t==="test"?`<span class="cn">${bk.mode==="sit"?"Sitting":"Practice test"}</span>Test ${esc(sc.v)}`:`<span class="cn">Chapter ${esc(sc.v)}</span>${esc(CH[sc.v]||"")}`;
  const nav=$("#bknav");box.classList.toggle("onep",single);
  if(bk.result){nav.classList.add("hidden");return drawResult(box)}
  nav.classList.remove("hidden");
  if(!list.length){box.innerHTML=`<div class="board"></div><div class="results"><span class="eyebrow">${sc.t==="bm"?"Bookmarks":"Empty"}</span><h2 style="margin:.6rem 0">${sc.t==="bm"?"No bookmarks yet":"No questions here"}</h2><p>${sc.t==="bm"?"Tap the red ribbon at the top of a page to bookmark a question you want to come back to.":""}</p></div>`;nav.classList.add("hidden");return}
  if(bk.i>=list.length)bk.i=list.length-1;
  const q=list[bk.i];
  if(full||!$(".spread",box)){
    const tests=[...new Set(QS.map(x=>x.t))].sort((a,b)=>a-b);
    box.classList.remove("closed");box.innerHTML=`${single?"":`<div class="itabs">${tests.map(T=>`<button style="background:${TABC[(T-1)%6]}" data-tab="${T}" aria-label="Go to Test ${T}">${T}</button>`).join("")}</div>`}<div class="board"></div>${single?"":`<div class="stack l"></div>`}<div class="stack r"></div><div class="spread">${single?`<div class="page one" id="pl"></div>`:`<div class="page l" id="pl"></div><div class="page r" id="pr"></div>`}</div>`;
    if(!coverDone){coverDone=true;const cv=document.createElement("div");cv.className="cover3d";cv.innerHTML=`<div class="ci"></div><div class="co"><svg class="lf" viewBox="0 0 100 100"><defs><linearGradient id="cgl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C9"/><stop offset=".5" stop-color="#E9D19A"/><stop offset="1" stop-color="#A88242"/></linearGradient></defs><path d="${LEAF}" fill="url(#cgl)"/></svg><small>Part II</small><h2>Practice<br>Tests</h2><div class="rule"></div><p>The Canadian Guide to End-of-Life Planning</p><span>${QS.length} questions · ${tests.length} tests</span><button class="btn gold" data-act="open">Open the book ${I.arrow}</button></div>`;$(".spread",box).appendChild(cv);if(!single)box.classList.add("closed")}
  }
  const live=!$(".cover3d",box);
  if(single)$("#pl").innerHTML=pgOne(q,live);else{$("#pl").innerHTML=pgL(q,live);$("#pr").innerHTML=pgR(q,live);$$(".itabs button",box).forEach(b=>b.classList.toggle("on",+b.dataset.tab===q.t))}
  if(single&&bk.fresh===q.n){const s=$(".one-sol",box);if(s)setTimeout(()=>s.scrollIntoView({behavior:reduce()?"auto":"smooth",block:"nearest"}),80)}
  bk.fresh=null;setStacks();
  if(bk.mode==="practice"){S.lastQ=q.n;save()}
  const n=list.length,rg=$("#b-range");
  $("#b-pos").innerHTML=`Question <b>${q.n}</b> · ${bk.i+1} of ${n}`;$("#b-pct").textContent=Math.round((bk.i+1)/n*100)+"%";
  rg.max=n;rg.value=bk.i+1;rg.disabled=n<2;rg.style.setProperty("--p",(n>1?bk.i/(n-1)*100:100)+"%");$("#b-jump").value="";$("#b-jump").placeholder="No. "+q.n;
  $("#b-prev").disabled=bk.i===0;$("#b-next").disabled=bk.i>=n-1;
}
function redrawPages(){const q=bk.list[bk.i];if(!q)return;const box=$("#bookbox");if($(".cover3d",box))return;if(isSingle())$("#pl").innerHTML=pgOne(q,true);else{$("#pl").innerHTML=pgL(q,true);$("#pr").innerHTML=pgR(q,true)}
  if(isSingle()&&bk.fresh===q.n){const s=$(".one-sol",box);if(s)setTimeout(()=>s.scrollIntoView({behavior:reduce()?"auto":"smooth",block:"nearest"}),80)}bk.fresh=null}
function openCover(){
  const box=$("#bookbox"),cv=$(".cover3d",box);if(!cv||bk.busy)return;bk.busy=true;SND.page();
  const fin=()=>{if(!cv.isConnected&&!bk.busy)return;cv.remove();box.classList.remove("closed");bk.busy=false;drawBook(false)};
  if(reduce()||!cv.animate){fin();return}
  $(".co .btn",cv).style.visibility="hidden";box.classList.remove("closed");cv.classList.add("opening");
  $(".co",cv).animate([{opacity:1},{opacity:1,offset:.49},{opacity:0,offset:.5},{opacity:0}],{duration:1500,fill:"forwards"});
  const a=cv.animate([{transform:"translateZ(2px) rotateY(0deg)"},{transform:"translateZ(40px) rotateY(-90deg)",offset:.5},{transform:"translateZ(2px) rotateY(-180deg)",opacity:isSingle()?0:1}],{duration:1500,easing:"cubic-bezier(.5,.05,.25,1)",fill:"forwards"});
  if(!isSingle())a.finished.then(()=>cv.animate([{opacity:1},{opacity:0}],{duration:300,fill:"forwards"}).finished).then(fin,fin);else a.finished.then(fin,fin);
}
async function bkClick(e){
  const box=$("#bookbox");
  if(e.target.closest('[data-act="open"]')){openCover();return}
  if($(".cover3d",box))return;
  const o=e.target.closest("[data-o]");if(o){choose(+o.dataset.o);return}
  const g=e.target.closest("[data-go]");if(g){const k=bk.list.findIndex(q=>q.n===+g.dataset.go);if(k>=0){bk.i=k;drawBook(false)}return}
  const tb=e.target.closest("[data-tab]");if(tb){const T=+tb.dataset.tab;if(bk.mode==="sit"){toast("Finish or leave the sitting to change tests");return}bk.scope={t:"test",v:T};bk.list=bkList();bk.i=0;drawToc();drawBook(true);return}
  const a=e.target.closest("[data-act]");if(!a)return;const act=a.dataset.act,q=bk.list[bk.i];
  if(act==="next")turn(1);else if(act==="prev")turn(-1);
  else if(act==="reveal"){const p=S.qp[q.n]||(S.qp[q.n]={});p.sh=1;save();bk.fresh=q.n;redrawPages();drawToc()}
  else if(act==="bm")toggleBm(q);
  else if(act==="flag"){if(S.sit.flag[q.n])delete S.sit.flag[q.n];else S.sit.flag[q.n]=1;save();redrawPages()}
  else if(act==="finish")finishSit();
  else if(act==="say-q")speak(`Question ${q.n}. ${q.q} ${q.o.map((x,i)=>`Option ${L4[i]}: ${x}.`).join(" ")}`);
  else if(act==="say-e")speak(`The answer is ${L4[q.c]}: ${q.o[q.c]}. ${q.e}`);
  else if(act==="sheet"){const ov=modal(`<h3>Answer sheet</h3><div style="background:var(--pg);color:var(--pg-ink);border-radius:16px;padding:1rem">${sheetBody(q)}</div>`);
    ov.addEventListener("click",ev=>{const g2=ev.target.closest("[data-go]");if(g2){const k=bk.list.findIndex(x=>x.n===+g2.dataset.go);if(k>=0){bk.i=k;ov.remove();drawBook(false)}}else if(ev.target.closest('[data-act="finish"]')){ov.remove();finishSit()}})}
}
function toggleBm(q){if(S.bm[q.n])delete S.bm[q.n];else S.bm[q.n]=1;save();redrawPages();drawToc();toast(S.bm[q.n]?"Bookmarked":"Bookmark removed",S.bm[q.n]?"❦":"")}
function choose(i){
  const q=bk.list[bk.i];if(!q||bk.busy||$(".cover3d",$("#bookbox")))return;
  if(bk.mode==="sit"&&S.sit){S.sit.ans[q.n]=i;save();SND.pop();redrawPages();return}
  const p=S.qp[q.n]||(S.qp[q.n]={});if(p.a!=null||p.sh)return;
  p.a=i;bk.fresh=q.n;bump();save();redrawPages();drawToc();
  const ok=i===q.c;if(ok)SND.ok();else SND.no();
  if(!ok&&Math.random()<.45)MP.say(pick(ENCOURAGE),{mood:"sad",ttl:3800});
  else if(ok&&Math.random()<.25)MP.say(pick(PRAISE),{mood:"happy",ttl:2600});
  if(todayCount()===S.goal)setTimeout(()=>{confetti();MP.say(`Daily goal reached${fname()?", "+fname():""}! Lovely work.`,{mood:"cheer"})},600);
  checkBadges();
}
/* ---- page turn engine: nested 3D strips bend like real paper ---- */
function turnFrames(style,s,N,k){
  if(style==="flutter")return [{transform:"rotateY(0deg)",offset:0},{transform:`translateZ(50px) rotateX(5deg) rotateY(${70*s}deg)`,offset:.35},{transform:`translateZ(70px) rotateX(-3deg) rotateY(${135*s}deg)`,offset:.7},{transform:`rotateY(${180*s}deg)`,offset:1}];
  if(style==="classic"||N===1)return [{transform:"rotateY(0deg)"},{transform:`rotateY(${180*s}deg)`}];
  if(k===0)return [0,30,100,165,180].map((a,i)=>({transform:`rotateY(${a*s}deg)`,offset:i/4}));
  return [0,70,60,15,0].map((a,i)=>({transform:`rotateY(${(a/(N-1))*s}deg)`,offset:i/4}));
}
function buildLeaf(side,fHTML,bHTML,W,N){
  const leaf=document.createElement("div");leaf.className="leaf lf-"+side;leaf.style.transform="translateZ(1px)";
  const w=W/N;let parent=leaf;const strips=[];
  for(let k=0;k<N;k++){
    const s=document.createElement("div");s.className="strip";s.style.width=w+"px";
    if(side==="l"){s.style.left=(k===0?W-w:-w)+"px";s.style.transformOrigin="100% 50%"}else{s.style.left=(k===0?0:w)+"px";s.style.transformOrigin="0 50%"}
    const fOff=side==="l"?W-(k+1)*w:k*w,bOff=side==="l"?k*w:W-(k+1)*w;
    const gf=side==="l"?"270deg":"90deg",gb=side==="l"?"90deg":"270deg";
    const sh=(g,off)=>`background:linear-gradient(${g},rgba(0,0,0,.22),rgba(0,0,0,.04) 55%,rgba(255,255,255,.14));background-size:${W}px 100%;background-position:${-off}px 0`;
    s.innerHTML=`<div class="sf" style="width:${w+1}px"><div class="clone" style="width:${W}px;left:${-fOff}px">${fHTML}</div><div class="shd" style="${sh(gf,fOff)}"></div></div><div class="sb" style="width:${w+1}px"><div class="clone" style="width:${W}px;left:${-bOff}px">${bHTML}</div><div class="shd" style="${sh(gb,bOff)}"></div></div>`;
    parent.appendChild(s);strips.push(s);parent=s;
  }
  return{leaf,strips};
}
function turn(dir){
  if(bk.busy||bk.result)return;const box=$("#bookbox");if(!box||$(".cover3d",box))return;
  const list=bk.list,ni=bk.i+dir;if(ni<0||ni>=list.length)return;
  const sp=$(".spread",box);if(!sp)return;stopSpeak();
  const oq=list[bk.i],nq=list[ni],single=isSingle();
  if(reduce()||!sp.animate){bk.i=ni;drawBook(false);drawToc();return}
  bk.busy=true;SND.page();
  const style=S.pfx,N=style==="curl"?(single?7:9):1;
  const pg=(cls,html)=>`<div class="page ${cls}">${html}</div>`;
  const ref=single?$("#pl"):$("#pr");const W=ref.offsetWidth;
  const keepScroll=(el,src)=>{const a=$$(".pg-in",el),st=src?$(".pg-in",src):null;if(st&&st.scrollTop)a.forEach(x=>x.scrollTop=st.scrollTop)};
  let side,front,back,reverse=false,under,after,cast;
  if(single){
    side="1";cast="c1";
    if(dir>0){front=pg("one",pgOne(oq,false));back=pg("one",'<div class="blankback"></div>');under=()=>{$("#pl").innerHTML=pgOne(nq,true)}}
    else{front=pg("one",pgOne(nq,false));back=pg("one",'<div class="blankback"></div>');reverse=true;under=()=>{}}
    after=()=>{};
  }else if(dir>0){side="r";cast="cl";front=pg("r",pgR(oq,false));back=pg("l",pgL(nq,false));under=()=>{$("#pr").innerHTML=pgR(nq,true)};after=()=>{$("#pl").innerHTML=pgL(nq,true)}}
  else{side="l";cast="cr";front=pg("l",pgL(oq,false));back=pg("r",pgR(nq,false));under=()=>{$("#pl").innerHTML=pgL(nq,true)};after=()=>{$("#pr").innerHTML=pgR(nq,true)}}
  const src=single?$("#pl"):(dir>0?$("#pr"):$("#pl"));
  const {leaf,strips}=buildLeaf(side,front,back,W,N);
  sp.appendChild(leaf);if(!reverse)keepScroll(leaf,src);
  under();
  const cs=document.createElement("div");cs.className="cast "+cast;sp.appendChild(cs);
  const s=side==="l"?1:-1,T=style==="curl"?1050:style==="flutter"?1100:820,ease="cubic-bezier(.45,.05,.25,1)";
  const norm=fr=>fr.map((f,i,a)=>Object.assign({},f,{offset:f.offset!=null?f.offset:i/(a.length-1)}));
  const anims=strips.map((st,k)=>{let fr=norm(turnFrames(style,s,N,k));if(reverse)fr=fr.slice().reverse().map(f=>Object.assign({},f,{offset:1-f.offset}));return st.animate(fr,{duration:T,easing:ease,fill:"forwards"})});
  $$(".shd",leaf).forEach(x=>x.animate([{opacity:0},{opacity:.9,offset:.5},{opacity:0}],{duration:T,easing:ease}));
  cs.animate([{opacity:0},{opacity:.85,offset:.45},{opacity:0}],{duration:T,easing:ease});
  bk.i=ni;
  const fin=()=>{if(!bk.busy)return;after();leaf.remove();cs.remove();bk.busy=false;drawBook(false);drawToc()};
  Promise.all(anims.map(a=>a.finished)).then(fin,fin);
  setTimeout(fin,T+400);
}
/* sitting */
setInterval(()=>{if(S.sit)$$(".sitTime").forEach(e=>e.textContent=fmtT(Date.now()-S.sit.t0))},1000);
async function finishSit(){
  if(!S.sit)return;const T=S.sit.t,qs=QS.filter(q=>q.t===T),un=qs.filter(q=>S.sit.ans[q.n]==null).length;
  if(!(await ask(un?`${un} question${un>1?"s are":" is"} still unanswered. Unanswered questions count as incorrect.`:"You've answered every question. Ready to see your score?",un?"Finish anyway":"Score my test","Keep working")))return;
  const ms=Date.now()-S.sit.t0,ans=Object.assign({},S.sit.ans);let k=0;
  qs.forEach(q=>{const a=ans[q.n];if(a===q.c)k++;if(!S.qp[q.n]||(S.qp[q.n].a==null&&a!=null)){const o=Object.assign(S.qp[q.n]||{},{a:a==null?null:a});if(a==null)o.sh=1;else delete o.sh;S.qp[q.n]=o}});
  qs.forEach(q=>{if(ans[q.n]!=null)bump()});
  S.sits.push({t:T,k,n:qs.length,d:today(),ms});S.sits=S.sits.slice(-30);S.sit=null;save();
  bk.mode="practice";bk.result={t:T,k,n:qs.length,ans,ms};
  $$(".ov").forEach(o=>o.remove());drawToc();drawBook(true);
  const pc=Math.round(k/qs.length*100);if(pc>=80){confetti();SND.cheer()}
  MP.say(pc>=80?`Test ${T}: ${pc}%. That is excellent — be proud of that.`:`Test ${T}: ${pc}%. Tap any missed question below to open its page and read the explanation.`,{mood:pc>=80?"cheer":"think"});
  checkBadges();
}
function drawResult(box){
  const r=bk.result,qs=QS.filter(q=>q.t===r.t),pc=Math.round(r.k/r.n*100);
  const by={};qs.forEach(q=>{const b=by[q.ch]||(by[q.ch]={k:0,n:0});b.n++;if(r.ans[q.n]===q.c)b.k++});
  const miss=qs.filter(q=>r.ans[q.n]!==q.c);
  const prev=S.sits.filter(s=>s.t===r.t).slice(-4,-1);
  box.innerHTML=`<div class="board"></div><div class="results"><span class="eyebrow">Test ${r.t} scored</span><div style="display:flex;gap:2rem;align-items:flex-end;flex-wrap:wrap;margin:.6rem 0"><div class="big">${pc}%</div><div><h2 style="margin:0;font-weight:400">${r.k} of ${r.n} correct</h2><p style="margin:.2rem 0;color:#6F7372">Time ${fmtT(r.ms)}${prev.length?` · earlier: ${prev.map(s=>Math.round(s.k/s.n*100)+"%").join(", ")}`:""}</p></div></div>
  <table><tr><th>Chapter</th><th class="n">Correct</th></tr>${Object.keys(by).map(c=>`<tr><td>${c}. ${esc(CH[c])}</td><td class="n">${by[c].k}/${by[c].n}</td></tr>`).join("")}</table>
  ${miss.length?`<div class="solh">Review the ${miss.length} you missed — tap one to open its page</div><div class="miss">${miss.map(q=>`<button data-rv="${q.n}"><b>${q.n}.</b> ${esc(q.ti)} <small>· you: ${r.ans[q.n]==null?"blank":L4[r.ans[q.n]]} · correct: ${L4[q.c]}</small></button>`).join("")}</div>`:`<p>A perfect score. Wonderful.</p>`}
  <div class="cvlink"><button class="btn gold" id="r-again">Sit Test ${r.t} again</button><button class="btn ghost" id="r-book" style="color:#1B3233">Back to the book</button></div></div>`;
  box.onclick=e=>{
    const rv=e.target.closest("[data-rv]");
    if(rv){bk.result=null;bk.mode="practice";bk.scope={t:"test",v:r.t};bk.list=bkList();bk.i=Math.max(0,bk.list.findIndex(q=>q.n===+rv.dataset.rv));box.onclick=bkClick;drawToc();drawBook(true);return}
    if(e.target.closest("#r-again")){bk.result=null;box.onclick=bkClick;bk.scope={t:"test",v:r.t};bk.mode="practice";bk.list=bkList();S.sit=null;setMode("sit");return}
    if(e.target.closest("#r-book")){bk.result=null;box.onclick=bkClick;bk.list=bkList();bk.i=0;drawToc();drawBook(true)}
  };
}

/* =========================================================
   SETTINGS
   ========================================================= */
VIEWS.settings=function(m){
  const sw=(id,on)=>`<button class="sw" id="${id}" role="switch" aria-checked="${!!on}"></button>`;
  m.innerHTML=`<div class="sec-h" style="margin-top:0"><div><span class="eyebrow">Make it yours</span><h2>Settings</h2></div></div>
  <div class="set-grid">
   <div class="panel"><h3>You</h3>
    <div class="set-row"><label for="s-nm"><b>Your first name</b><small>Used only for greetings</small></label><input class="inp" id="s-nm" value="${esc(S.name||"")}" maxlength="40" style="max-width:200px" placeholder="Optional"></div>
    <div class="set-row"><label for="s-goal"><b>Daily goal</b><small>Cards and questions per day</small></label><label class="sel" style="margin:0"><select id="s-goal">${[10,20,30,50,100].map(n=>`<option value="${n}" ${n===S.goal?"selected":""}>${n}</option>`).join("")}</select></label></div>
    <div class="set-row"><div><b>Maple, your guide</b><small>Tips, cheers and the guided tour</small></div>${sw("s-comp",S.comp)}</div>
    <div class="set-row"><div><b>Take the tour again</b><small>A thirty-second walk through the app</small></div><button class="btn ghost sm" id="s-tour">Start tour</button></div>
   </div>
   <div class="panel"><h3>Look &amp; feel</h3>
    <div class="set-row"><div><b>Dark mode</b><small>Easier on the eyes at night</small></div>${sw("s-dark",document.documentElement.dataset.theme==="dark")}</div>
    <div class="set-row"><div><b>Larger text</b><small>Increase the reading size everywhere</small></div>${sw("s-big",S.big)}</div>
    <div class="set-row"><div><b>Sounds</b><small>Soft page and card sounds</small></div>${sw("s-snd",S.sound)}</div>
    <div class="set-row"><label for="s-fx"><b>Flashcard motion</b><small>How cards flip</small></label><label class="sel" style="margin:0"><select id="s-fx">${FX.map(f=>`<option value="${f[0]}" ${S.fx===f[0]?"selected":""}>${f[1]}</option>`).join("")}</select></label></div>
    <div class="set-row"><label for="s-pfx"><b>Page turn</b><small>How the question book turns</small></label><label class="sel" style="margin:0"><select id="s-pfx">${PFX.map(f=>`<option value="${f[0]}" ${S.pfx===f[0]?"selected":""}>${f[1]}</option>`).join("")}</select></label></div>
   </div>
   <div class="panel"><h3>Back up your progress</h3><p class="note" style="margin-top:.3rem">Progress lives only in this browser. Export a file to move it to another device or keep a backup.</p>
    <div class="row"><button class="btn" id="s-exp">Export progress</button><button class="btn ghost" id="s-imp">Import progress</button><input type="file" id="s-file" accept="application/json,.json" class="hidden"></div></div>
   <div class="panel"><h3>Reset</h3><p class="note" style="margin-top:.3rem">These actions only affect this device.</p>
    <div class="row"><button class="btn ghost" id="s-star">Clear starred cards</button><button class="btn ghost" id="s-qreset">Reset question book</button><button class="btn ghost" id="s-reset" style="color:var(--bad)">Delete all my data</button></div></div>
  </div>
  <div class="notice"><b>Not legal advice.</b> This app is a study aid for <i>The Canadian Guide to End-of-Life Planning</i>. Its practice questions are for learning, not for legal exam preparation. Rules differ by province and change over time — confirm with a lawyer or notary before you act. <a href="#" id="s-notice" style="color:var(--h)">Read the full notice</a> · <a href="#" id="s-priv" style="color:var(--h)">Privacy</a></div>`;
  const tg=(id,f)=>{$("#"+id).onclick=e=>{const b=e.currentTarget,v=b.getAttribute("aria-checked")!=="true";b.setAttribute("aria-checked",v);f(v)}};
  $("#s-nm").onchange=e=>{S.name=e.target.value.trim();save();toast("Saved")};
  $("#s-goal").onchange=e=>{S.goal=+e.target.value;save();toast("Daily goal updated")};
  tg("s-comp",v=>{S.comp=v;save();MP.apply();if(v)MP.say("I'm back! Tap me whenever you'd like a tip.",{wave:true})});
  tg("s-dark",v=>{S.theme=v?"dark":"light";applyTheme();save()});
  tg("s-big",v=>{S.big=v;applyTheme();save()});
  tg("s-snd",v=>{S.sound=v;save();if(v)SND.pop()});
  $("#s-fx").onchange=e=>{S.fx=e.target.value;save();toast("Card motion updated")};
  $("#s-pfx").onchange=e=>{S.pfx=e.target.value;save();toast("Page turn updated")};
  $("#s-tour").onclick=()=>{if(!S.comp){S.comp=true;save();MP.apply();$("#s-comp").setAttribute("aria-checked","true")}tour()};
  $("#s-exp").onclick=()=>{const b=new Blob([JSON.stringify({app:"cgeolp",v:2,data:S},null,1)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="canadian-guide-progress-"+today()+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast("Progress exported")};
  $("#s-imp").onclick=()=>$("#s-file").click();
  $("#s-file").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);if(!(j.app==="cgeolp"||j.app==="eolp-flashcards")||!j.data||typeof j.data!=="object")throw 0;S=Object.assign(def(),j.data);if(!S.badges||typeof S.badges!=="object")S.badges={};if(!S.tips||typeof S.tips!=="object")S.tips={};save();applyTheme();MP.apply();toast("Progress imported");go("home")}catch(x){toast("That file could not be read")}};r.readAsText(f);e.target.value=""};
  $("#s-qreset").onclick=async()=>{if(await ask("Clear all question-book answers, bookmarks and practice-test scores on this device?","Reset question book","Cancel",true)){S.qp={};S.bm={};S.sit=null;S.sits=[];S.lastQ=null;save();toast("Question book reset")}};
  $("#s-star").onclick=async()=>{if(await ask("Remove the star from every card?","Clear stars")){S.star={};save();toast("Stars cleared")}};
  $("#s-reset").onclick=async()=>{if(await ask("Delete your name, ratings, stars, answers, badges and exam history from this device? This cannot be undone.","Delete everything","Keep my data",true)){try{localStorage.removeItem(LS);localStorage.removeItem(OLD_LS)}catch(e){}S=def();applyTheme();MP.apply();fc={scope:"all",prov:"all",mode:"smart",q:[],i:0,flipped:false,done:0,busy:false};bk={scope:{t:"all",v:""},list:[],i:0,mode:"practice",busy:false,fresh:null,result:null};ex=null;coverDone=false;toast("All data deleted");$("#nm").value="";showLanding()}};
  $("#s-notice").onclick=e=>{e.preventDefault();legal("notice")};$("#s-priv").onclick=e=>{e.preventDefault();legal("privacy")};
};

/* =========================================================
   SEARCH
   ========================================================= */
function openSearch(){
  if($(".pal"))return;
  const o=document.createElement("div");o.className="pal";o.innerHTML=`<div class="pal-box" role="dialog" aria-modal="true" aria-label="Search"><div class="pal-in">${I.search}<input id="pal-q" placeholder="Search 200 cards and 300 questions… e.g. executor, probate, RRSP" autocomplete="off" aria-label="Search"><kbd>Esc</kbd></div><div class="pal-res" id="pal-res"><div class="pal-empty">Type at least two letters.</div></div></div>`;
  document.body.appendChild(o);const inp=$("#pal-q",o),res=$("#pal-res",o);let items=[],sel=0;
  const close=()=>o.remove();
  o.addEventListener("click",e=>{if(e.target===o)close()});
  const hl=(s,t)=>{const i=s.toLowerCase().indexOf(t);if(i<0)return esc(s.length>140?s.slice(0,140)+"…":s);const st=Math.max(0,i-50),seg=s.slice(st,st+150);const j=i-st;return (st?"…":"")+esc(seg.slice(0,j))+"<mark>"+esc(seg.slice(j,j+t.length))+"</mark>"+esc(seg.slice(j+t.length))+(st+150<s.length?"…":"")};
  const run=()=>{const t=inp.value.trim().toLowerCase();if(t.length<2){res.innerHTML='<div class="pal-empty">Type at least two letters.</div>';items=[];return}
    const a=FC.filter(c=>(c.q+" "+c.a).toLowerCase().includes(t)).slice(0,25).map(c=>({k:"c",c,ttl:hl(c.q,t),sub:(c.q.toLowerCase().includes(t)?"":hl(c.a,t)+"<br>")+`Chapter ${c.ch} · § ${c.sec}${c.tag!=="All"?" · "+PROV[c.tag]:""}`}));
    const b=QS.filter(q=>(q.ti+" "+q.q+" "+q.o.join(" ")+" "+q.e).toLowerCase().includes(t)).slice(0,25).map(q=>{const inQ=q.q.toLowerCase().includes(t),hay=[q.ti].concat(q.o,[q.e]).find(x=>x.toLowerCase().includes(t));return{k:"q",q,ttl:`<b style="display:inline">No. ${q.n}</b> · `+hl(q.q,t),sub:(inQ||!hay?"":hl(hay,t)+"<br>")+`Test ${q.t} · ${esc(q.ti)}`}});
    items=a.concat(b);sel=0;
    res.innerHTML=items.length?items.map((x,i)=>`<button data-i="${i}" class="${i===0?"on":""}"><span class="k ${x.k==="q"?"q":""}">${x.k==="q"?"Question":"Card"}</span><span><b>${x.ttl}</b><small>${x.sub}</small></span></button>`).join(""):`<div class="pal-empty">Nothing found for “${esc(inp.value)}”.</div>`};
  const openIt=i=>{const x=items[i];if(!x)return;close();
    if(x.k==="c"){fc.scope="all";fc.prov="all";fc.mode="all";fc.q=[x.c];fc.i=0;fc.done=0;fc.keep=true;go("cards")}
    else{bk.scope={t:"all",v:""};if(bk.mode==="sit")bk.mode="practice";bk.list=bkList();bk.i=x.q.n-1;bk.result=null;if(view==="book"&&$("#bookbox")){drawToc();drawBook(false)}else go("book")}};
  res.addEventListener("click",e=>{const b=e.target.closest("[data-i]");if(b)openIt(+b.dataset.i)});
  inp.addEventListener("input",run);
  inp.addEventListener("keydown",e=>{if(e.key==="Escape"){close();return}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!items.length)return;sel=(sel+(e.key==="ArrowDown"?1:-1)+items.length)%items.length;$$("button",res).forEach((b,i)=>b.classList.toggle("on",i===sel));const b=$$("button",res)[sel];if(b)b.scrollIntoView({block:"nearest"})}if(e.key==="Enter"){e.preventDefault();openIt(sel)}});
  setTimeout(()=>inp.focus(),30);
}

/* =========================================================
   GUIDED TOUR
   ========================================================= */
let tourOn=false;
function tour(){
  if(tourOn)return;if(!S.comp){S.comp=true;save();MP.apply()}
  if(view!=="home"||!$(".hero")){go("home");setTimeout(tour,250);return}
  tourOn=true;const vis=(...sels)=>{for(const s of sels){const e=$(s);if(e&&e.offsetParent!==null&&e.getBoundingClientRect().width)return e}return null};
  const steps=[
    {el:()=>vis(".hero"),t:"This is <b>Home</b>. Your daily goal ring, your streak and your progress through all twelve chapters live here."},
    {el:()=>vis('#nav [data-v="cards"]','#bnav [data-v="cards"]'),t:"<b>Flashcards</b>: think of the answer, flip the card, then rate yourself. Choose from four different flip motions."},
    {el:()=>vis('#nav [data-v="book"]','#bnav [data-v="book"]'),t:"The <b>Question book</b> holds all 300 practice questions. Turn real pages, bookmark with the ribbon, or sit a full test."},
    {el:()=>vis('#nav [data-v="exam"]','#bnav [data-v="exam"]'),t:"<b>Quick exam</b> is a self-graded test drawn from the flashcards, with an optional timer."},
    {el:()=>vis("#srch"),t:"<b>Search</b> any topic across every card and question. On a keyboard, just press <kbd>/</kbd>."},
    {el:()=>vis("#mp-btn"),t:"And I'm always right here. Tap me for a study tip, to repeat this tour, or to let me rest. Enjoy your guide!"}
  ];
  const blk=document.createElement("div");blk.className="tour-block";const hole=document.createElement("div");hole.className="tour-hole";document.body.append(blk,hole);
  let i=0;
  const end=()=>{tourOn=false;blk.remove();hole.remove();S.toured=1;save();window.removeEventListener("resize",pos)};
  function pos(){const st=steps[i];const e=st&&st.el();if(!e){hole.style.opacity=0;return}const r=e.getBoundingClientRect(),p=8;hole.style.opacity=1;Object.assign(hole.style,{left:r.left-p+"px",top:r.top-p+"px",width:r.width+p*2+"px",height:r.height+p*2+"px"})}
  function show(){if(i>=steps.length){end();MP.mood("cheer",2000);SND.cheer();return}const e=steps[i].el();if(e&&e.getBoundingClientRect().top<0||e&&e.getBoundingClientRect().bottom>innerHeight)e.scrollIntoView({block:"center"});setTimeout(pos,30);
    MP.say(steps[i].t,{mood:i===steps.length-1?"happy":"think",acts:[{t:i===steps.length-1?"Finish":"Next",f:()=>{i++;show()}},{t:"Skip tour",alt:true,f:()=>{end();MP.say("No problem. Tap me any time to see the tour again.",{mood:"happy"})}}]})}
  window.addEventListener("resize",pos);blk.onclick=()=>{};
  show();
}

/* =========================================================
   KEYBOARD
   ========================================================= */
function onKey(e){
  if($("#app").classList.contains("hidden"))return;
  const tag=document.activeElement&&document.activeElement.tagName;
  if(e.key==="Escape"){const t=$("#toc.open");if(t)openToc(false);const ov=$(".ov");if(ov&&!ov.querySelector("[data-r]"))ov.remove();return}
  if(/INPUT|TEXTAREA|SELECT/.test(tag)||e.metaKey||e.ctrlKey||e.altKey)return;
  if($(".ov")||$(".pal")||tourOn)return;
  if(e.key==="/"){e.preventDefault();openSearch();return}
  if(view==="book"&&$("#bookbox")){
    if($(".cover3d")){if(e.key==="Enter"||e.key===" "||e.key==="ArrowRight"){e.preventDefault();openCover()}return}
    if(e.key==="ArrowRight"){e.preventDefault();turn(1)}else if(e.key==="ArrowLeft"){e.preventDefault();turn(-1)}
    else if(/^[a-dA-D]$/.test(e.key)){choose("abcd".indexOf(e.key.toLowerCase()))}
    else if(/^[1-4]$/.test(e.key))choose(+e.key-1);
    else if(e.key==="m"||e.key==="M"){const q=bk.list[bk.i];if(q&&!bk.result)toggleBm(q)}
    else if(e.key==="l"||e.key==="L"){const q=bk.list[bk.i];if(q&&!bk.result){const p=S.qp[q.n]||{};speak(p.a!=null||p.sh?`The answer is ${L4[q.c]}: ${q.o[q.c]}. ${q.e}`:`Question ${q.n}. ${q.q} ${q.o.map((x,i)=>`Option ${L4[i]}: ${x}.`).join(" ")}`)}}
    return;
  }
  if(view==="cards"&&$("#card")){
    const c=fc.q[fc.i];
    if(e.key===" "&&document.activeElement.id!=="card"&&!(document.activeElement.tagName==="BUTTON")){e.preventDefault();flip()}
    else if(fc.flipped&&(e.key==="1"||e.key==="r"||e.key==="R"))grade(0);
    else if(fc.flipped&&(e.key==="2"||e.key==="k"||e.key==="K"))grade(1);
    else if(fc.flipped&&e.key==="3")grade(2);
    else if(e.key==="ArrowRight"){e.preventDefault();navCard(1)}
    else if(e.key==="ArrowLeft"){e.preventDefault();navCard(-1)}
    else if((e.key==="s"||e.key==="S")&&c)toggleStar(c,$('[data-a="star"]'));
    else if((e.key==="l"||e.key==="L")&&c)speak(fc.flipped?"Answer. "+c.a:"Question. "+c.q);
    return;
  }
  if(view==="exam"&&ex&&ex.run){
    if(ex.rev&&(e.key==="1"||e.key==="2"))exMark(e.key==="2");
    else if(!ex.rev&&e.key===" "){e.preventDefault();const b=$("#e-show");if(b)b.click()}
  }
}

/* =========================================================
   BOOT
   ========================================================= */
applyTheme();
if(window.matchMedia)matchMedia("(prefers-color-scheme: dark)").addEventListener&&matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{if(!S.theme)applyTheme()});
initLanding();initShell();
if(S.seen&&(!location.hash||/^#\//.test(location.hash)))enter(false);
else{MP.place(true);setTimeout(()=>{if(!$("#landing").classList.contains("hidden"))MP.say(`Hello! I'm <b>Maple</b>. I'll be your guide through <i>The Canadian Guide to End-of-Life Planning</i>. Have a look around, or open the guide whenever you're ready.`,{wave:true,acts:[{t:"Open the guide",f:()=>enter(true)},{t:"Look around first",alt:true}],ttl:16000})},2200)}
})();
