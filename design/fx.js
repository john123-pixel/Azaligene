/* ===== Premium-Oberfläche: Startseite, 3D-Neigung, Parallax, Konfetti ===== */
/* Eigenes Buchcover: Bildadresse oder data:-URI hier eintragen, z. B. 'cover.jpg'. Leer = gezeichnetes Cover. */
const BOOK_COVER='';
const LPHOTOS=[
 {id:'photo-1594608661623-aa0bd3a69d98',pill:'Schulweg',t:'Der erste Schultag am Gymnasium',s:'Mit Ranzen und gutem Gefühl in den neuen Abschnitt.'},
 {id:'photo-1588075592446-265fd1e6e76f',pill:'Unterricht',t:'Mitmachen und melden',s:'Wer geübt hat, traut sich mehr zu.'},
 {id:'photo-1767356326735-2da0a10cf1f0',pill:'Bibliothek',t:'Lesen und verstehen',s:'Leseverständnis ist der Schlüssel – Kapitel 3.'},
 {id:'photo-1588072432836-e10032774350',pill:'Gemeinsam',t:'Zusammen knobeln',s:'Logik, Muster und Reihen.'},
 {id:'photo-1502086223501-7ea6ecd79368',pill:'Pause',t:'Spielen gehört dazu',s:'Kurze Lernrunden lassen Zeit für den Spielplatz.'},
 {id:'photo-1529390079861-591de354faf5',pill:'Konzentration',t:'Ruhig und sicher schreiben',s:'Rechtschreibung und Diktat.'}
];
const FEATS=[
 ['exam','Prüfungsmodus','Mit Zeit, Ergebnis erst am Ende.','var(--c3)'],
 ['cards','Karteikarten','100 Karten mit klugem Wiederholen.','var(--c4)'],
 ['kopf','Kopfrechnen','Schnell und sicher rechnen.','var(--c2)'],
 ['diktat','Diktat','Hören, schreiben, vergleichen.','var(--c1)'],
 ['radar','Schwächen-Radar','Stärken und Lücken auf einen Blick.','var(--c5)'],
 ['errors','Fehler-Wiederholung','Fehler kommen zur rechten Zeit wieder.','var(--c3)'],
 ['speak','Vorlesen','Jede Aufgabe kann vorgelesen werden.','var(--c6)'],
 ['calm','Ruhe-Übung','Atmen und Anspannung lösen.','var(--c5)']
];
const fx={
  motion(){return !SET.motion&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)},
  fine(){return window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches},
  lastQ:null
};
/* --- Startseite füllen --- */
function buildLanding(){
  $('#lnQ').textContent=QS.length;$('#lnCount').textContent=QS.length;$('#lnC').textContent=CARDS.length;
  const now=new Date();$('#lnDays').textContent=Math.max(0,Math.ceil((new Date(EXAM_DATE.getFullYear(),EXAM_DATE.getMonth(),EXAM_DATE.getDate())-new Date(now.getFullYear(),now.getMonth(),now.getDate()))/DAY));
  if(BOOK_COVER){const f=$('#bookFront');f.classList.add('img');f.style.backgroundImage='url("'+BOOK_COVER+'")'}
  $('#gallery').innerHTML=LPHOTOS.map((p,i)=>'<figure class="gcard rv" style="transition-delay:'+(i*60)+'ms;margin:0"><img alt="'+esc(p.t)+'" loading="lazy" decoding="async" data-src="'+photoUrl(p.id,i===0?1400:900)+'"><span class="pill">'+esc(p.pill)+'</span><figcaption><b>'+esc(p.t)+'</b><span>'+esc(p.s)+'</span></figcaption></figure>').join('');
  $$('#gallery img').forEach(im=>{im.onload=()=>im.classList.add('ok');im.src=im.dataset.src});
  $('#areas').innerHTML=AK.map((a,i)=>{const A=AREAS[a];const subs=Object.keys(REFN).filter(k=>k.split('.')[0]===String(A.ch)).map(k=>REFN[k]);const n=QS.filter(q=>q.a===a).length;
    return '<article class="acard rv" style="--c:'+A.c+';transition-delay:'+(i%3*70)+'ms"><span class="num" aria-hidden="true">'+A.ch+'</span><span class="ch">Kapitel '+A.ch+'</span><h3>'+esc(A.n)+'</h3><p>'+esc(A.s)+'</p><ul>'+subs.slice(0,4).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul><div class="cnt">'+n+' Übungsaufgaben</div></article>'}).join('');
  $('#feats').innerHTML=FEATS.map((f,i)=>'<div class="feat rv" style="--c:'+f[3]+';transition-delay:'+(i%4*60)+'ms"><span class="fi">'+ico(f[0])+'</span><span><h3>'+esc(f[1])+'</h3><p>'+esc(f[2])+'</p></span></div>').join('');
  // weiches Scrollen innerhalb der Startseite
  $('#landing').addEventListener('click',e=>{const a=e.target.closest('[data-lgo]');if(!a)return;e.preventDefault();const t=document.getElementById(a.dataset.lgo);if(!t)return;
    t.scrollIntoView({behavior:fx.motion()?'smooth':'auto',block:a.dataset.lgo==='start'?'center':'start'});if(a.dataset.lgo==='start')setTimeout(()=>{try{$('#nameIn').focus({preventScroll:true})}catch(_){}},fx.motion()?600:0)});
  // Einblenden beim Scrollen
  const rv=$$('#landing .rv');
  if('IntersectionObserver' in window&&fx.motion()){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{root:$('#landing'),rootMargin:'0px 0px -8% 0px',threshold:.12});rv.forEach(el=>io.observe(el))}
  else rv.forEach(el=>el.classList.add('in'));
  // Parallax der 3D-Bühne
  const sc=$('#stageCol'),hero=$('.hero');let raf=0,mx=0,my=0;
  hero.addEventListener('pointermove',e=>{if(!fx.motion()||!fx.fine())return;const r=hero.getBoundingClientRect();mx=((e.clientX-r.left)/r.width-.5)*2;my=((e.clientY-r.top)/r.height-.5)*2;
    if(!raf)raf=requestAnimationFrame(()=>{raf=0;sc.style.setProperty('--mx',mx.toFixed(3));sc.style.setProperty('--my',my.toFixed(3))})},{passive:true});
  hero.addEventListener('pointerleave',()=>{sc.style.setProperty('--mx',0);sc.style.setProperty('--my',0)});
}
/* --- 3D-Neigung für Karten --- */
const TILT_SEL='.mode,.stat,.acard,.gcard,.feat,.cdcard,.badge.on,[data-tilt]';
let tEl=null;
function untilt(el){el.classList.remove('tilting');el.style.transform='';el.style.removeProperty('--gx');el.style.removeProperty('--gy')}
document.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||!fx.motion()){if(tEl){untilt(tEl);tEl=null}return}
  const el=e.target.closest?e.target.closest(TILT_SEL):null;
  if(el!==tEl){if(tEl)untilt(tEl);tEl=el;if(el)el.classList.add('tilting')}
  if(!el)return;
  const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  const max=clamp(2600/Math.max(r.width,1),3,11);
  el.style.transform='perspective(900px) rotateX('+((.5-y)*max).toFixed(2)+'deg) rotateY('+((x-.5)*max).toFixed(2)+'deg) translateY(-3px)';
  el.style.setProperty('--gx',(x*100).toFixed(1)+'%');el.style.setProperty('--gy',(y*100).toFixed(1)+'%');
},{passive:true});
document.addEventListener('pointerleave',()=>{if(tEl){untilt(tEl);tEl=null}});
/* --- Konfetti --- */
const CONF={parts:[],cv:null,cx:null,raf:0};
function confetti(x,y,n,spread){
  if(!fx.motion())return;
  if(!CONF.cv){const c=document.createElement('canvas');c.id='fxCanvas';c.setAttribute('aria-hidden','true');document.body.appendChild(c);CONF.cv=c;CONF.cx=c.getContext('2d')}
  const dpr=Math.min(2,window.devicePixelRatio||1);CONF.cv.width=innerWidth*dpr;CONF.cv.height=innerHeight*dpr;CONF.cx.setTransform(dpr,0,0,dpr,0,0);
  const cols=['#4353e0','#6a4de8','#ffc23d','#ff6b57','#14b88a','#4fd2e4'];spread=spread||1;
  for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*Math.PI*spread,v=5+Math.random()*7;
    CONF.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:6+Math.random()*6,h:4+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:cols[rnd(cols.length)],life:0,tilt:Math.random()*6})}
  if(!CONF.raf)CONF.raf=requestAnimationFrame(confStep);
}
function confStep(){
  const cx=CONF.cx;cx.clearRect(0,0,innerWidth,innerHeight);
  CONF.parts=CONF.parts.filter(p=>p.life<180&&p.y<innerHeight+40);
  CONF.parts.forEach(p=>{p.life++;p.vy+=.22;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.tilt+=.12;
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(1,Math.cos(p.tilt));cx.globalAlpha=Math.max(0,1-p.life/180);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()});
  if(CONF.parts.length)CONF.raf=requestAnimationFrame(confStep);else{CONF.raf=0;cx.clearRect(0,0,innerWidth,innerHeight)}
}
function burstAt(el,n){if(!el)return;const r=el.getBoundingClientRect();confetti(r.left+r.width/2,r.top+r.height/2,n||36,.9)}
/* --- Erweiterungen der bestehenden Ansichten --- */
(function(){
  const origRenderQ=renderQ;
  renderQ=function(v){
    const view=v||$('#view');const it=S&&S.items[S.i];const key=it?S.i+':'+it.id:null;
    const changed=key!==fx.lastQ;fx.lastQ=key;
    origRenderQ(v);
    view.classList.toggle('qin',changed&&fx.motion());
  };
  const origCheck=ACT.check;
  ACT.check=function(){origCheck.apply(this,arguments);const it=S&&S.items[S.i];if(it&&it.done&&it.ok&&S.immediate)burstAt($('.opt.right'),30)};
  const origResult=V.result;
  V.result=function(v,p){origResult(v,p);if(!S||!S.res)return;const r=S.res;const q=pct(r.c,r.answered||1);
    if(q>=65&&r.answered)setTimeout(()=>{confetti(innerWidth*.25,innerHeight*.35,70,1.1);confetti(innerWidth*.75,innerHeight*.35,70,1.1)},250)};
  const origGo=go;
  go=function(name,p,noPush){if(name!=='quiz'){fx.lastQ=null;const vw=$('#view');vw&&vw.classList.remove('qin')}origGo(name,p,noPush)};
  const origKnown=renderKnown;
  renderKnown=function(){origKnown();$$('#known button').forEach(b=>b.dataset.i=(b.dataset.n||'?').charAt(0).toUpperCase())};
})();
buildLanding();
