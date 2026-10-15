/* ===== Extras: Eule Emma, Töne, Lernreise, Serie, Blitz, Duell, 3D-Würfel, Trophäen, Level-up, Wochenbericht, Urkunde ===== */
Object.assign(IC,{
 blitz:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 duel:'<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M9.5 17.5L21 6V3h-3L6.5 14.5M11 19l-6-6M8 16l-4 4M5 21l-2-2"/>',
 cube:'<path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
 map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 week:'<path d="M3 3v18h18"/><path d="M7 15v3M11 11v7M15 7v11M19 12v6"/>',
 mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
 cert:'<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/>'
});
if(SET.sound==null)SET.sound=1;

/* --- Eule Emma (Maskottchen) --- */
function owl(mood,cls){
  mood=mood||'idle';
  let eyes;
  if(mood==='happy')eyes='<circle cx="45" cy="60" r="13" fill="#fff"/><circle cx="75" cy="60" r="13" fill="#fff"/><path d="M37 62q8-9 16 0M67 62q8-9 16 0" stroke="#1b1b3a" stroke-width="4" fill="none" stroke-linecap="round"/>';
  else{const dx=mood==='think'?3:0,dy=mood==='think'?-3:mood==='sad'?3:0;
    eyes='<circle cx="45" cy="60" r="13" fill="#fff"/><circle cx="75" cy="60" r="13" fill="#fff"/><g class="pu"><circle cx="'+(45+dx)+'" cy="'+(61+dy)+'" r="6.5" fill="#1b1b3a"/><circle cx="'+(75+dx)+'" cy="'+(61+dy)+'" r="6.5" fill="#1b1b3a"/><circle cx="'+(47+dx)+'" cy="'+(58+dy)+'" r="2" fill="#fff"/><circle cx="'+(77+dx)+'" cy="'+(58+dy)+'" r="2" fill="#fff"/></g>'
    +(mood==='sad'?'<path d="M33 45l14 4M87 45l-14 4" stroke="#2a2170" stroke-width="3.5" stroke-linecap="round"/>':'')}
  return '<svg class="owl owl-'+mood+(cls?' '+cls:'')+'" viewBox="0 0 120 140" aria-hidden="true">'
  +'<path d="M46 131h10M64 131h10" stroke="#f5a524" stroke-width="6" stroke-linecap="round"/>'
  +'<g class="wl"><path d="M24 76c-12 14-10 36 6 44 2-16 1-31-6-44z" fill="#4337b5"/></g><g class="wr"><path d="M96 76c12 14 10 36-6 44-2-16-1-31 6-44z" fill="#4337b5"/></g>'
  +'<ellipse cx="60" cy="86" rx="38" ry="45" fill="#5b4fd8"/>'
  +'<ellipse cx="60" cy="100" rx="24" ry="27" fill="#ece8ff"/><path d="M49 95l5.5 4 5.5-4 5.5 4 5.5-4M49 107l5.5 4 5.5-4 5.5 4 5.5-4" stroke="#c9c1ff" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
  +'<ellipse cx="60" cy="61" rx="33" ry="22" fill="#7b6cf0"/>'+eyes
  +'<path d="M54 70l6 10 6-10z" fill="#f5a524"/><circle cx="31" cy="74" r="5" fill="#ff8fb1" opacity=".5"/><circle cx="89" cy="74" r="5" fill="#ff8fb1" opacity=".5"/>'
  +'<g class="cap"><path d="M28 32l32-13 32 13-32 13z" fill="#1b1b3a"/><path d="M42 38v9c11 6 25 6 36 0v-9" fill="#1b1b3a"/><path d="M92 32v15" stroke="#ffc23d" stroke-width="2.5"/><circle cx="92" cy="49" r="3.5" fill="#ffc23d"/></g>'
  +'</svg>'}
const OWL={
 ok:['Super gemacht!','Klasse – genau richtig!','Stark! Weiter so!','Du denkst wie ein Profi!','Richtig! Ich bin stolz auf dich.','Juhu, das sitzt!'],
 bad:['Nicht schlimm – aus Fehlern lernt man am meisten.','Fast! Lies die Erklärung, dann klappt es beim nächsten Mal.','Kopf hoch! Diese Aufgabe kommt bald noch einmal.','Fehler sind Lernchancen. Du schaffst das!'],
 hint:['Ich hab einen Tipp für dich!','Schau mal, so kannst du vorgehen:','Ganz ruhig – Schritt für Schritt.']
};
function owlSay(mood,text,cls){return '<div class="owlsay '+(cls||'')+'">'+owl(mood)+'<div class="bub">'+esc(text)+'</div></div>'}

/* --- Töne (Web Audio, ohne Dateien) --- */
const SND={ctx:null,
 play(type){
  if(!SET.sound)return;
  try{
    if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();
    const c=this.ctx;if(c.state==='suspended')c.resume();const t=c.currentTime;
    const tone=(f,st,d,typ,vol,f2)=>{const o=c.createOscillator(),g=c.createGain();o.type=typ||'sine';o.frequency.setValueAtTime(f,t+st);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+st+d);
      g.gain.setValueAtTime(0,t+st);g.gain.linearRampToValueAtTime(vol||.1,t+st+.012);g.gain.exponentialRampToValueAtTime(.0001,t+st+d);o.connect(g);g.connect(c.destination);o.start(t+st);o.stop(t+st+d+.05)};
    if(type==='click')tone(900,0,.05,'triangle',.035);
    else if(type==='ok'){[523,659,784].forEach((f,i)=>tone(f,i*.08,.28,'triangle',.11));tone(1047,.24,.45,'sine',.07)}
    else if(type==='bad'){tone(330,0,.2,'sine',.09);tone(247,.15,.35,'sine',.09)}
    else if(type==='flip')tone(420,0,.16,'sine',.05,900);
    else if(type==='tick')tone(1250,0,.04,'square',.025);
    else if(type==='fan'){[523,659,784,1047].forEach((f,i)=>tone(f,i*.12,.3,'triangle',.1));[523,659,784,1047].forEach(f=>tone(f,.52,.9,'sine',.05))}
    else if(type==='level'){[392,440,523,587,659,784,880,1047].forEach((f,i)=>tone(f,i*.07,.25,'triangle',.08));[523,659,784,1047].forEach(f=>tone(f,.62,1.1,'sine',.05))}
  }catch(e){}
 }};
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('.btn,.chip,.mode,.ibtn,.nav button,.tabs button,.st,.opt:not([disabled])'))SND.play('click')},true);
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.fci'))SND.play('flip')},true);
function sndBtnHTML(){return ico(SET.sound?'speak':'mute')}
ACT.sndToggle=()=>{SET.sound=SET.sound?0:1;saveSet();const b=$('#sndBtn');if(b){b.innerHTML=sndBtnHTML();b.setAttribute('aria-pressed',String(!!SET.sound))}toast(SET.sound?'Töne an':'Töne aus',1500);SND.play('ok')};
ACT.setSound=el=>{SET.sound=el.checked?1:0;saveSet();const b=$('#sndBtn');if(b)b.innerHTML=sndBtnHTML();setTimeout(setr,0)};
(function(){
  const o=ACT.openSettings;
  ACT.openSettings=function(){o.apply(this,arguments);const m=$('.mbox [data-act="setMotion"]');if(m)m.closest('label').insertAdjacentHTML('afterend','<label class="row" style="gap:10px;margin-top:6px"><input type="checkbox" data-act="setSound" style="width:22px;height:22px"'+(SET.sound?' checked':'')+'> Töne und Soundeffekte</label>')};
  // Kontrollkästchen neu zeichnen, damit der Haken zum gespeicherten Wert passt
  ['setContrast','setMotion'].forEach(k=>{const f=ACT[k];ACT[k]=function(el){f(el);setTimeout(setr,0)}});
})();

/* --- Level-up --- */
function lvCheck(){
  if(!U)return;const n=level().name;
  if(U.lvSeen==null){U.lvSeen=n;save();return}
  if(n!==U.lvSeen){U.lvSeen=n;save();showLevelUp(n)}
}
function showLevelUp(name){
  const lv=level();
  const d=document.createElement('div');d.className='lvup';d.setAttribute('role','dialog');d.setAttribute('aria-label','Neues Level');
  d.innerHTML='<div class="lvbox"><div class="medal3d"><div class="front">'+ico('star')+'<b>'+esc(name)+'</b></div><div class="back">'+owl('happy')+'</div></div><p class="lvk">Neues Level erreicht!</p><h2>'+esc(name)+'</h2><p class="lvs">'+U.xp+' Punkte'+(lv.next?' · nächstes Level ab '+lv.next:'')+'</p>'+owlSay('happy','Wow, '+U.name+'! Du wirst immer besser.','light')+'<button class="btn" data-lv="x">Weiter</button></div>';
  document.body.appendChild(d);
  const close=()=>{d.remove();document.removeEventListener('keydown',kd)};const kd=e=>{if(e.key==='Escape')close()};
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-lv]'))close()});document.addEventListener('keydown',kd);
  $('[data-lv]',d).focus();SND.play('level');
  setTimeout(()=>{confetti(innerWidth/2,innerHeight*.4,120,1.6)},300);
}

/* --- Lernreise, Serie und Tagesziel auf der Startübersicht --- */
function todaySec(){const k=dkey();return U.ses.filter(s=>dkey(new Date(s.ts))===k).reduce((x,s)=>x+(s.sec||0),0)}
function areaMastery(a){const qs=QS.filter(q=>q.a===a);const ok=qs.filter(q=>U.s[q.id]&&U.s[q.id].c>0).length;return{ok,total:qs.length,m:qs.length?ok/qs.length:0}}
function journeyHTML(){
  const nodes=[{t:'start'}].concat(AK.map(a=>({t:'st',a}))).concat([{t:'goal'}]);
  const N=nodes.length;const pts=nodes.map((n,i)=>({x:5+i*(90/(N-1)),y:52+30*Math.sin(i*1.05+.4)}));
  let cur=-1;const ms=AK.map(a=>areaMastery(a));ms.forEach((m,i)=>{if(cur<0&&m.m<.8)cur=i});
  const allDone=cur<0;
  let d='M'+pts[0].x+' '+pts[0].y;for(let i=1;i<N;i++){const p=pts[i-1],q=pts[i],mx=(p.x+q.x)/2;d+=' C'+mx+' '+p.y+' '+mx+' '+q.y+' '+q.x+' '+q.y}
  let h='<section class="journey" aria-label="Deine Lernreise"><div class="jhead"><h3>'+ico('map')+' Deine Lernreise</h3><span class="small mute">Tippe auf eine Station, um diesen Bereich zu üben.</span></div><div class="jr-wrap"><div class="jr"><div class="jr-plane">'
  +'<svg class="jr-road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="'+d+'" class="r1"/><path d="'+d+'" class="r2"/></svg></div><div class="jr-pins">';
  nodes.forEach((n,i)=>{const p=pts[i];const pos='data-x="'+p.x.toFixed(2)+'" data-y="'+p.y.toFixed(2)+'"';const up=i%2?' up':'';
    if(n.t==='start')h+='<div class="st st-end'+up+'" '+pos+'><span class="pin home"><svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg></span><span class="stl">Grundschule</span></div>';
    else if(n.t==='goal')h+='<div class="st st-end'+up+(allDone?' lit':'')+'" '+pos+'><span class="pin goal"><svg viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/></svg></span><span class="stl">Gymnasium</span></div>';
    else{const A=AREAS[n.a],m=ms[i-1];const st=m.m>=.8?'done':m.m>0?'go':'new';
      h+='<button class="st st-'+st+up+(i-1===cur?' cur':'')+'" '+pos+' style="--c:'+A.c+';--p:'+Math.round(m.m*100)+'" data-act="jrGo" data-a="'+n.a+'" aria-label="'+esc(A.n)+', Kapitel '+A.ch+', '+m.ok+' von '+m.total+' Aufgaben gelöst">'
      +(i-1===cur?'<span class="here">'+owl('idle')+'</span>':'')
      +'<span class="pin"><i>'+(st==='done'?'★':A.ch)+'</i></span><span class="stl">'+esc(A.n)+'<small>'+Math.round(m.m*100)+' %</small></span></button>'}});
  return h+'</div></div></div></section>';
}
/* Stationen an die per 3D-Projektion berechneten Punkte der geneigten Ebene setzen */
function layoutJourney(root){
  const jr=root&&$('.jr',root);if(!jr)return;
  const W=jr.clientWidth,H=jr.clientHeight,P=1100,a=40*Math.PI/180;
  const pl=.02*W,pw=.96*W,pt=40,ph=H-50,oy=.7*ph;
  $$('.st',jr).forEach(el=>{const px=pw*(+el.dataset.x)/100,py=ph*(+el.dataset.y)/100;
    const Y=py-oy,Z=Y*Math.sin(a),x=pl+px,y=pt+oy+Y*Math.cos(a),sc=P/(P-Z);
    el.style.left=(W/2+(x-W/2)*sc).toFixed(1)+'px';el.style.top=(H/2+(y-H/2)*sc).toFixed(1)+'px';el.style.setProperty('--sc',sc.toFixed(3))});
}
window.addEventListener('resize',()=>{if(CUR==='home')layoutJourney($('#view'))});
ACT.jrGo=el=>{const a=el.dataset.a;resetLive();startSession({kind:'practice',title:AREAS[a].n,areas:[a],list:pickQs(10,{areas:[a],tier:'adapt'}),immediate:true,hints:true})};
function streakHTML(){
  const s=U.sd.n||0,sec=todaySec(),goal=900,p=Math.min(1,sec/goal),r=34,C=2*Math.PI*r;
  const sc=(1+Math.min(s,14)*.04).toFixed(2);
  return '<div class="streak" title="Tage in Folge"><div class="flame" style="--fs:'+sc+'"><i></i><i></i><i></i></div><b>'+s+'</b><span>'+(s===1?'Tag':'Tage')+' in Folge</span></div>'
  +'<div class="goal" title="Tagesziel: 15 Minuten"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="'+r+'" class="g0"/><circle cx="40" cy="40" r="'+r+'" class="g1" style="stroke-dasharray:'+C.toFixed(1)+';stroke-dashoffset:'+(C*(1-p)).toFixed(1)+'"/></svg><div class="gt"><b>'+Math.min(15,Math.floor(sec/60))+'</b>/15</div><span>'+(p>=1?'Tagesziel geschafft!':'Min. heute')+'</span></div>'
  +'<div class="hello-owl">'+owl(p>=1?'happy':'idle')+'</div>';
}
const EXTRA_MODES=[
 ['blitz','Blitz-Challenge','3 Minuten – so viele richtige wie möglich','blitz','var(--c3)'],
 ['duel','Duell','Zu zweit abwechselnd antworten','duel','var(--c5)'],
 ['cube','3D-Würfel','Würfelnetze falten und drehen','cube','var(--c6)']
];

/* --- Blitz-Challenge --- */
const BZ={g:null,last:null};
function bzList(){return shuffle(QS.filter(q=>q.p==null&&!q.g&&q.t!=='h'))}
V.blitz=function(v){
  if(BZ.g&&BZ.g.live){renderBz(v);setTimer(bzTick,200);return}
  const b=U.blitz||{best:0,runs:0};const L=BZ.last;
  let h=backBtn()+'<h2>Blitz-Challenge</h2>';
  if(L){h+='<div class="bzres'+(L.rec?' rec':'')+'"><div class="bzbig">'+L.c+'</div><div><b>'+(L.rec?'Neuer Rekord!':'Geschafft!')+'</b><br>'+L.c+' richtig von '+L.n+' in 3 Minuten.</div>'+owl(L.rec?'happy':'idle')+'</div>'}
  else h+=owlSay('idle','Bereit? Du hast 3 Minuten. Beantworte so viele Aufgaben richtig, wie du kannst!');
  h+='<div class="stats"><div class="stat"><b>'+b.best+'</b><span>Rekord</span></div><div class="stat"><b>'+b.runs+'</b><span>Runden gespielt</span></div></div>'
   +'<p class="small mute">Leichte und mittlere Aufgaben ohne Lesetexte. Die Antworten zählen auch für deine Statistik. Tasten 1–4 oder A–D funktionieren.</p>'
   +'<div class="row"><button class="btn" data-act="bzGo">'+ico('blitz')+' '+(L?'Nochmal spielen':'Los geht’s')+'</button></div>';
  v.innerHTML=h;
};
ACT.bzGo=()=>{const list=bzList();const now=Date.now();BZ.last=null;BZ.g={live:true,list,i:0,ord:null,c:0,n:0,t0:now,end:now+180000,qs:now,lock:false,lastS:-1};go('blitz')};
function renderBz(v){
  const g=BZ.g;v=v||$('#view');const q=g.list[g.i%g.list.length];g.ord=q.ns?[0,1,2,3]:shuffle([0,1,2,3]);g.qs=Date.now();g.lock=false;const a=AREAS[q.a];
  v.innerHTML='<div class="bzhead"><div class="bzt" id="bzT"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" class="g0"/><circle cx="40" cy="40" r="34" class="g1" id="bzRing"/></svg><b id="bzS">3:00</b></div><div class="bzsc"><b id="bzC">'+g.c+'</b><span>richtig</span></div><div class="bzsc"><b>'+g.n+'</b><span>beantwortet</span></div><button class="btn ghost sm" data-act="bzQuit">Beenden</button></div>'
   +'<span class="tag" style="color:'+a.c+'">'+esc(a.n)+'</span><div class="stem">'+esc(q.q)+'</div><div class="opts">'
   +g.ord.map((oi,i)=>'<button class="opt" data-act="bzPick" data-i="'+i+'"><span class="ltr">'+'ABCD'[i]+'</span><span>'+esc(q.o[oi])+'</span></button>').join('')+'</div>';
  v.classList.remove('qin');void v.offsetWidth;if(fx.motion())v.classList.add('qin');
  bzTick();
}
function bzTick(){
  const g=BZ.g;if(!g||!g.live)return;const left=Math.max(0,g.end-Date.now());const s=Math.ceil(left/1000);
  const el=$('#bzS');if(el)el.textContent=fmtT(s*1000);
  const r=$('#bzRing');if(r){const C=2*Math.PI*34;r.style.strokeDasharray=C.toFixed(1);r.style.strokeDashoffset=(C*(1-left/180000)).toFixed(1);r.classList.toggle('low',s<=10)}
  if(s<=10&&s>0&&s!==g.lastS){g.lastS=s;SND.play('tick')}
  if(left<=0)bzEnd();
}
ACT.bzPick=el=>{
  const g=BZ.g;if(!g||!g.live||g.lock)return;g.lock=true;
  const q=g.list[g.i%g.list.length];const i=+el.dataset.i;const ok=g.ord[i]===cIdx(q);
  record(q,ok,Date.now()-g.qs);g.n++;if(ok)g.c++;
  el.classList.add(ok?'right':'wrong');if(!ok){const r=$('.opt[data-i="'+g.ord.indexOf(cIdx(q))+'"]');r&&r.classList.add('right')}
  $$('.opt').forEach(b=>b.disabled=true);SND.play(ok?'ok':'bad');if(ok)burstAt(el,14);
  const c=$('#bzC');if(c)c.textContent=g.c;
  setTimer(()=>{if(!g.live)return;g.i++;if(g.i>=g.list.length){g.list=bzList();g.i=0}renderBz()},ok?380:1100,true);
};
ACT.bzQuit=()=>{if(confirm('Blitz-Challenge beenden?'))bzEnd()};
function bzEnd(){
  const g=BZ.g;if(!g||!g.live)return;g.live=false;clearTimers();
  const b=U.blitz||(U.blitz={best:0,runs:0});b.runs++;const rec=g.c>b.best&&g.c>0;if(rec)b.best=g.c;
  U.ses.push({ts:Date.now(),k:'blitz',n:g.n,c:g.c,sec:Math.round(Math.min(180000,Date.now()-g.t0)/1000),a:null});if(U.ses.length>300)U.ses.shift();
  U.xp+=5;checkBadges();save(true);BZ.last={c:g.c,n:g.n,rec};
  V.blitz($('#view'));SND.play(rec?'fan':'ok');if(rec)setTimeout(()=>confetti(innerWidth/2,innerHeight*.3,110,1.4),200);lvCheck();
}

/* --- Duell zu zweit --- */
const DU={cfg:{n:5},g:null};
V.duel=function(v){
  const g=DU.g;if(g&&g.live){renderDuel(v);return}
  v.innerHTML=backBtn()+'<h2>Duell</h2>'+owlSay('idle','Wer schafft mehr? Ihr antwortet abwechselnd an diesem Gerät. Das Duell zählt nicht zur Statistik.')
   +'<div class="duset"><div><label class="lbl" for="du1">Spieler 1</label><input type="text" id="du1" maxlength="24" value="'+esc(U.name)+'"></div><div class="vs3d" aria-hidden="true">VS</div><div><label class="lbl" for="du2">Spieler 2</label><input type="text" id="du2" maxlength="24" placeholder="z. B. Geschwister oder Freund"></div></div>'
   +'<span class="lbl">Fragen pro Spieler</span>'+chipsOne([[3,'3'],[5,'5'],[10,'10']],DU.cfg.n,'duN')
   +'<div class="row"><button class="btn" data-act="duGo">'+ico('duel')+' Duell starten</button></div>';
};
ACT.duN=el=>{DU.cfg.n=+el.dataset.v;const a=$('#du1').value,b=$('#du2').value;V.duel($('#view'));$('#du1').value=a;$('#du2').value=b};
ACT.duGo=()=>{
  const p1=($('#du1').value||'').trim()||'Spieler 1',p2=($('#du2').value||'').trim()||'Spieler 2';const n=DU.cfg.n;
  const list=shuffle(QS.filter(q=>q.p==null&&!q.g&&q.t!=='h')).slice(0,n*2);
  DU.g={live:true,i:0,list,ord:list.map(q=>q.ns?[0,1,2,3]:shuffle([0,1,2,3])),sc:[0,0],names:[p1,p2],ans:null,n};go('duel')};
function renderDuel(v){
  const g=DU.g;v=v||$('#view');const pl=g.i%2;const end=g.i>=g.list.length;
  let h='<div class="duboard"><div class="dup'+(!end&&pl===0?' on':'')+'"><span>'+esc(g.names[0])+'</span><b>'+g.sc[0]+'</b></div><div class="vs3d sm" aria-hidden="true">VS</div><div class="dup'+(!end&&pl===1?' on':'')+'"><span>'+esc(g.names[1])+'</span><b>'+g.sc[1]+'</b></div></div>';
  if(end){
    const w=g.sc[0]===g.sc[1]?-1:g.sc[0]>g.sc[1]?0:1;
    h+='<div class="duend">'+owl('happy')+'<h2>'+(w<0?'Unentschieden!':esc(g.names[w])+' gewinnt!')+'</h2><p>'+g.sc[0]+' : '+g.sc[1]+'</p><div class="row" style="justify-content:center"><button class="btn" data-act="duAgain">Revanche</button><button class="btn ghost" data-act="home">Zur Übersicht</button></div></div>';
    v.innerHTML=h;return;
  }
  const q=g.list[g.i],ord=g.ord[g.i],done=g.ans!=null;
  h+='<p class="qmeta">Runde '+(Math.floor(g.i/2)+1)+' von '+g.n+' · <b>'+esc(g.names[pl])+'</b>&nbsp;ist dran</p><div class="stem">'+esc(q.q)+'</div><div class="opts">';
  ord.forEach((oi,i)=>{let c='opt';if(done){if(oi===cIdx(q))c+=' right';else if(g.ans===i)c+=' wrong'}h+='<button class="'+c+'" data-act="duPick" data-i="'+i+'"'+(done?' disabled':'')+'><span class="ltr">'+'ABCD'[i]+'</span><span>'+esc(q.o[oi])+'</span></button>'});
  h+='</div>';
  if(done){const ok=ord[g.ans]===cIdx(q);h+='<div class="fb '+(ok?'ok':'no')+'"><b class="t">'+(ok?'Richtig – ein Punkt für '+esc(g.names[pl])+'!':'Leider nicht richtig.')+'</b><div>'+esc(q.e)+'</div></div><div class="row"><button class="btn" data-act="duNext">'+(g.i+1>=g.list.length?'Ergebnis ansehen':'Weiter: '+esc(g.names[1-pl])+' ist dran →')+'</button></div>'}
  v.innerHTML=h;
  if(!done){v.classList.remove('qin');void v.offsetWidth;if(fx.motion())v.classList.add('qin')}else v.classList.remove('qin');
}
ACT.duPick=el=>{const g=DU.g;if(!g||g.ans!=null)return;g.ans=+el.dataset.i;const q=g.list[g.i];const ok=g.ord[g.i][g.ans]===cIdx(q);if(ok)g.sc[g.i%2]++;renderDuel();SND.play(ok?'ok':'bad');if(ok)burstAt($('.opt.right'),24)};
ACT.duNext=()=>{const g=DU.g;g.i++;g.ans=null;renderDuel();window.scrollTo(0,0);if(g.i>=g.list.length){g.live=false;SND.play('fan');setTimeout(()=>confetti(innerWidth/2,innerHeight*.35,120,1.5),150)}};
ACT.duAgain=()=>{DU.g=null;go('duel')};

/* --- 3D-Würfel: Netz falten und drehen --- */
const CUBE={F:1,U:2,R:3,B:6,D:5,L:4};
function cubeHTML(){
  const f=k=>'<span>'+esc(CUBE[k])+'</span>';
  return '<div class="cw"><div class="cw-net" aria-label="Würfelnetz – Zahlen eintragen">'
   +['U','L','F','R','B','D'].map(k=>'<input class="cn cn-'+k+'" data-f="'+k+'" value="'+esc(CUBE[k])+'" maxlength="2" aria-label="Feld '+k+'">').join('')+'</div>'
   +'<div class="cw-stage"><div class="cw-rot" style="--rx:-24deg;--ry:-32deg"><div class="cf cf-F">'+f('F')
   +'<div class="cf cf-U">'+f('U')+'</div><div class="cf cf-D">'+f('D')+'</div><div class="cf cf-L">'+f('L')+'</div><div class="cf cf-R">'+f('R')+'<div class="cf cf-B">'+f('B')+'</div></div></div></div></div>'
   +'<div class="row" style="justify-content:center"><button class="btn" data-cw="fold">Falten</button><button class="btn ghost sm" data-cw="opp">Gegenüber zeigen</button><button class="btn ghost sm" data-cw="reset">Zurücksetzen</button></div><p class="cw-opp small" aria-live="polite"></p></div>';
}
function cubeInit(root){
  const rot=$('.cw-rot',root),stage=$('.cw-stage',root);let rx=-24,ry=-32,drag=null,folded=false;
  const ap=()=>{rot.style.setProperty('--rx',rx+'deg');rot.style.setProperty('--ry',ry+'deg')};
  stage.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,rx,ry};stage.setPointerCapture(e.pointerId)});
  stage.addEventListener('pointermove',e=>{if(!drag)return;ry=drag.ry+(e.clientX-drag.x)*.6;rx=clamp(drag.rx-(e.clientY-drag.y)*.6,-85,85);ap()});
  stage.addEventListener('pointerup',()=>drag=null);stage.addEventListener('pointercancel',()=>drag=null);
  $$('.cn',root).forEach(i=>i.addEventListener('input',()=>{CUBE[i.dataset.f]=i.value;const s=$('.cf-'+i.dataset.f+'>span',root);s.textContent=i.value}));
  root.addEventListener('click',e=>{const b=e.target.closest('[data-cw]');if(!b)return;const k=b.dataset.cw;
    if(k==='fold'){folded=!folded;rot.classList.toggle('folded',folded);b.textContent=folded?'Aufklappen':'Falten';SND.play('flip')}
    else if(k==='reset'){rx=-24;ry=-32;ap()}
    else if(k==='opp'){$('.cw-opp',root).innerHTML='Gegenüber liegen: <b>'+esc(CUBE.F)+' und '+esc(CUBE.B)+'</b> · <b>'+esc(CUBE.U)+' und '+esc(CUBE.D)+'</b> · <b>'+esc(CUBE.L)+' und '+esc(CUBE.R)+'</b>'}});
}
V.cube=function(v){
  v.innerHTML=backBtn()+'<h2>3D-Würfel</h2>'+owlSay('think','Trage die Zahlen aus deinem Würfelnetz ein (Kreuzform). Dann tippe auf „Falten“ und drehe den Würfel mit dem Finger oder der Maus.')+cubeHTML()
   +'<div class="card"><b>Merke (Lernbuch Kap. 8.2 und 10.5)</b><p class="small" style="margin:4px 0 0">Im Kreuznetz liegen Felder, die in einer Reihe durch genau ein Feld getrennt sind, beim Würfel gegenüber. Gegenüberliegende Seiten berühren sich nie.</p></div>';
  cubeInit($('.cw',v));
};
ACT.cubeModal=()=>{modal('<h3>3D-Würfel</h3><p class="small mute">Übertrage das Netz (Kreuzform), falte es und drehe den Würfel.</p>'+cubeHTML()+'<div class="row"><button class="btn ghost" data-act="closeModal">Schließen</button></div>');cubeInit($('.mbox .cw'))};

/* --- Trophäen-Raum (3D-Regal) --- */
function trophyHTML(){
  const won=BADGES.filter(b=>U.badges[b[0]]);
  if(!won.length)return '<div class="trophy empty">'+owlSay('idle','Dein Trophäen-Regal wartet noch. Mach deine erste Übung – dann steht hier dein erster Pokal!')+'</div>';
  return '<div class="trophy" aria-label="Trophäen-Regal"><div class="tr-stage"><div class="tr-ring">'+won.map((b,i)=>'<div class="tr-it"><span class="cup">'+ico('trophy')+'</span><b>'+esc(b[1])+'</b></div>').join('')+'</div><div class="tr-base"></div></div><p class="small mute" style="text-align:center">Ziehe zum Drehen.</p></div>';
}
function trophySpin(root){
  const ring=$('.tr-ring',root),st=$('.tr-stage',root);if(!ring)return;const its=$$('.tr-it',ring),n=its.length;
  const R=n<2?0:Math.min(Math.max(140,n*36),st.clientWidth*.38);let a=0,drag=null;
  st.addEventListener('pointerdown',e=>{drag={x:e.clientX,a};st.setPointerCapture(e.pointerId)});
  st.addEventListener('pointermove',e=>{if(drag)a=drag.a+(e.clientX-drag.x)*.006});
  st.addEventListener('pointerup',()=>drag=null);st.addEventListener('pointercancel',()=>drag=null);
  // Jede Trophäe kreist im Raum und schaut immer nach vorn
  const draw=()=>{its.forEach((el,i)=>{const t=a+i*2*Math.PI/n,x=Math.sin(t)*R,z=Math.cos(t)*R-R;el.style.transform='translate3d('+x.toFixed(1)+'px,0,'+z.toFixed(1)+'px)';el.style.zIndex=String(1000+Math.round(z));el.style.opacity=(0.45+0.55*(Math.cos(t)+1)/2).toFixed(2)})};
  const loop=()=>{if(!ring.isConnected)return;if(!drag&&fx.motion())a+=.006;draw();requestAnimationFrame(loop)};loop();
}
/* --- Wochenbericht für Eltern --- */
function weekData(){
  const now=Date.now();
  const days=[...Array(7)].map((_,k)=>{const d=new Date(now-(6-k)*DAY);return{k:dkey(d),lbl:d.toLocaleDateString('de-DE',{weekday:'short'}),dt:d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}),n:0,c:0,sec:0}});
  U.ses.forEach(s=>{const d=days.find(x=>x.k===dkey(new Date(s.ts)));if(d){d.n+=s.n||0;d.c+=s.c||0;d.sec+=s.sec||0}});
  const since=now-7*DAY;
  const ar=AK.map(a=>{let n=0,c=0;QS.forEach(q=>{if(q.a!==a)return;const s=U.s[q.id];if(s&&s.l>=since){n++;if(s.ok)c++}});return{a,n,c,p:n?c/n:null}});
  const badges=BADGES.filter(b=>U.badges[b[0]]>=since);
  const T={n:days.reduce((x,d)=>x+d.n,0),c:days.reduce((x,d)=>x+d.c,0),sec:days.reduce((x,d)=>x+d.sec,0),act:days.filter(d=>d.n>0||d.sec>0).length};
  const rated=ar.filter(x=>x.n>=3).sort((x,y)=>x.p-y.p);
  return{days,ar,badges,T,weak:rated[0]||null,strong:rated.length>1?rated[rated.length-1]:null};
}
function weekChart(days){
  const W=640,H=210,mx=Math.max(5,...days.map(d=>d.n)),bw=56,gap=(W-40-bw*7)/6;
  let s='<svg class="wchart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Antworten pro Tag"><line x1="20" y1="170" x2="'+(W-20)+'" y2="170" stroke="#c9cfe3"/>';
  days.forEach((d,i)=>{const x=20+i*(bw+gap),h=Math.round(140*d.n/mx),y=170-h,p=d.n?d.c/d.n:0;const col=!d.n?'#c9cfe3':p>=.75?'#0e9b6f':p>=.5?'#f0a400':'#e2464b';
    s+='<rect x="'+x+'" y="'+(d.n?y:166)+'" width="'+bw+'" height="'+(d.n?h:4)+'" rx="8" fill="'+col+'"/>'
    +(d.n?'<text x="'+(x+bw/2)+'" y="'+(y-8)+'" text-anchor="middle" font-size="13" font-weight="700" fill="#141f4f">'+d.n+'</text>':'')
    +'<text x="'+(x+bw/2)+'" y="188" text-anchor="middle" font-size="12" fill="#5a6383">'+d.lbl+'</text><text x="'+(x+bw/2)+'" y="203" text-anchor="middle" font-size="10" fill="#8a91aa">'+(d.n?Math.round(100*p)+' %':'–')+'</text>'});
  return s+'</svg>';
}
function weekBody(w){
  return '<div class="stats"><div class="stat"><b>'+w.T.n+'</b><span>Antworten</span></div><div class="stat"><b>'+(w.T.n?pct(w.T.c,w.T.n)+' %':'–')+'</b><span>richtig</span></div><div class="stat"><b>'+fmtMin(w.T.sec*1000)+'</b><span>Übungszeit</span></div><div class="stat"><b>'+w.T.act+' / 7</b><span>Tage aktiv</span></div></div>'
  +'<h3 style="margin:18px 0 6px">Antworten pro Tag</h3><div class="card" style="padding:10px">'+weekChart(w.days)+'<p class="small mute" style="margin:0 10px">Farbe = Trefferquote: grün ab 75 %, gelb ab 50 %, rot darunter.</p></div>'
  +'<h3 style="margin:18px 0 6px">Bereiche in dieser Woche</h3>'+w.ar.map(x=>{const q=x.p==null?0:Math.round(100*x.p);return '<div class="arow"><span>'+esc(AREAS[x.a].n)+'</span><div class="bar '+(x.p==null?'':q<50?'bad':q<75?'warn':'')+'"><i style="width:'+q+'%"></i></div><b>'+(x.n?x.c+'/'+x.n:'–')+'</b></div>'}).join('')
  +'<div class="card">'+(w.strong?'<p><b>Stärkster Bereich:</b> '+esc(AREAS[w.strong.a].n)+' ('+Math.round(100*w.strong.p)+' %)</p>':'')+(w.weak?'<p><b>Empfehlung für nächste Woche:</b> '+esc(AREAS[w.weak.a].n)+' üben (Lernbuch Kap. '+AREAS[w.weak.a].ch+').</p>':'<p>Noch zu wenige Antworten für eine Empfehlung.</p>')
  +'<p style="margin:0"><b>Neue Abzeichen:</b> '+(w.badges.length?w.badges.map(b=>esc(b[1])).join(', '):'keine')+' · <b>Serie:</b> '+U.sd.n+' Tage</p></div>';
}
V.week=function(v){
  if(U.pin&&!PS.ok){go('parent');return}
  const w=weekData();const from=w.days[0].dt,to=w.days[6].dt;
  v.innerHTML='<p><button class="btn ghost sm" data-act="goV" data-v="parent">← Eltern-Bereich</button></p><h2>Wochenbericht</h2><p class="mute">'+esc(U.name)+' · '+from+' bis '+to+'</p>'+weekBody(w)
   +'<div class="row"><button class="btn" data-act="weekPrint">'+ico('week')+' Drucken / als PDF</button></div>';
  animBars();
};
ACT.weekPrint=()=>{
  const w=weekData();const pr=$('#printReport');
  pr.innerHTML='<div class="prw"><h1>Wochenbericht – '+esc(U.name)+'</h1><p>'+w.days[0].dt+' bis '+w.days[6].dt+'.'+new Date().getFullYear()+' · Potenzialtest Gymnasium BW Vorbereitung 2027</p>'
   +'<table><tr><th>Antworten</th><th>Richtig</th><th>Übungszeit</th><th>Tage aktiv</th><th>Serie</th></tr><tr><td>'+w.T.n+'</td><td>'+(w.T.n?pct(w.T.c,w.T.n)+' %':'–')+'</td><td>'+fmtMin(w.T.sec*1000)+'</td><td>'+w.T.act+' / 7</td><td>'+U.sd.n+' Tage</td></tr></table>'
   +'<h2>Antworten pro Tag</h2>'+weekChart(w.days)
   +'<h2>Bereiche</h2><table><tr><th>Bereich</th><th>Aufgaben</th><th>Richtig</th></tr>'+w.ar.map(x=>'<tr><td>'+esc(AREAS[x.a].n)+'</td><td>'+x.n+'</td><td>'+(x.n?Math.round(100*x.p)+' %':'–')+'</td></tr>').join('')+'</table>'
   +'<p>'+(w.weak?'Empfehlung: '+esc(AREAS[w.weak.a].n)+' üben (Lernbuch Kap. '+AREAS[w.weak.a].ch+'). ':'')+'Neue Abzeichen: '+(w.badges.length?w.badges.map(b=>esc(b[1])).join(', '):'keine')+'.</p>'
   +'<p style="font-size:9pt;margin-top:16pt">Unabhängiges Übungswerkzeug, keine amtliche Veröffentlichung. Daten nur lokal gespeichert.</p></div>';
  pr.setAttribute('aria-hidden','false');setTimeout(()=>window.print(),50);
};

/* --- Urkunde nach dem Prüfungsmodus --- */
function certHTML(){
  const r=S.res,p=pct(r.c,r.n);const lvl=p>=85?'mit Auszeichnung':p>=65?'mit Erfolg':'mit viel Einsatz';
  return '<div class="cert"><div class="cseal" aria-hidden="true">★</div><div class="ct1">Urkunde</div><h1>Probeprüfung geschafft</h1><p>Hiermit wird bestätigt, dass</p><div class="cnm">'+esc(U.name)+'</div>'
   +'<p>die Probeprüfung <b>'+esc(S.title)+'</b> '+lvl+' abgeschlossen hat:<br><b>'+r.c+' von '+r.n+'</b> Aufgaben richtig ('+p+' %).</p>'
   +'<div class="cfoot"><span>'+fmtDate(new Date())+'<br><small>Datum</small></span><span class="cowl">'+owl('happy')+'</span><span>Eule Emma<br><small>Lernbegleiterin</small></span></div>'
   +'<p class="cdis">Übungs-Urkunde zum Buch „Potenzialtest Gymnasium BW Vorbereitung 2027“. Keine amtliche Bescheinigung.</p></div>';
}
ACT.certShow=()=>{if(!S||!S.res)return;modal(certHTML()+'<div class="row"><button class="btn" data-act="certPrint">'+ico('cert')+' Drucken / als PDF</button><button class="btn ghost" data-act="closeModal">Schließen</button></div>');SND.play('fan')};
ACT.certPrint=()=>{const pr=$('#printReport');pr.innerHTML=certHTML();pr.setAttribute('aria-hidden','false');setTimeout(()=>window.print(),50)};

/* --- Bestehende Ansichten erweitern --- */
(function(){
  const oHome=V.home;
  V.home=function(v,p){
    oHome(v,p);
    const art=$('.hello .art',v);if(art){art.className='art2';art.innerHTML=streakHTML()}
    const st=$('.stats',v);if(st){st.insertAdjacentHTML('afterend',journeyHTML());layoutJourney(v)}
    const grid=$('.grid',v);if(grid&&grid.firstElementChild)grid.firstElementChild.insertAdjacentHTML('afterend',EXTRA_MODES.map((m,i)=>'<button class="mode" style="--c:'+m[4]+';animation-delay:'+(40+i*35)+'ms" data-act="goV" data-v="'+m[3]+'">'+ico(m[0])+'<span><h3>'+esc(m[1])+'</h3><p>'+esc(m[2])+'</p></span><span class="b new">Neu</span></button>').join(''));
  };
  const oRQ=renderQ;
  renderQ=function(v){
    oRQ(v);const view=v||$('#view');if(!S)return;const it=S.items[S.i],q=QID[it.id];
    if(S.immediate&&it.done){const fb=$('.fb',view);if(fb){const L=it.ok?OWL.ok:OWL.bad;fb.insertAdjacentHTML('afterbegin',owlSay(it.ok?'happy':'sad',L[(it.id+S.i)%L.length],'in-fb'))}}
    else if(S.hints&&it.hint>=1){const hb=$$('.fb',view).pop();if(hb)hb.insertAdjacentHTML('afterbegin',owlSay('think',OWL.hint[it.id%OWL.hint.length],'in-fb'))}
    if((q.rn==='8.2'||q.rn==='10.5')&&S.kind!=='exam'&&S.kind!=='diag'){const ob=$('.opts',view);if(ob)ob.insertAdjacentHTML('beforebegin','<button class="btn ghost sm cubebtn" data-act="cubeModal">'+ico('cube')+' 3D-Würfel zum Ausprobieren</button>')}
  };
  const oCheck=ACT.check;
  ACT.check=function(){oCheck.apply(this,arguments);const it=S&&S.items[S.i];if(it&&it.done&&S.immediate)SND.play(it.ok?'ok':'bad');setTimeout(lvCheck,700)};
  const oRes=V.result;
  V.result=function(v,p){oRes(v,p);if(!S||!S.res)return;const q=pct(S.res.c,S.res.answered||1);
    const h2=$('h2',v);if(h2)h2.insertAdjacentHTML('afterend',owlSay(q>=65?'happy':q>=45?'idle':'sad',q>=85?'Wahnsinn! Das war richtig stark.':q>=65?'Gut gemacht! Darauf kannst du stolz sein.':q>=45?'Du bist auf einem guten Weg. Bleib dran!':'Jeder Profi hat mal klein angefangen. Wir üben das zusammen!'));
    if(S.kind==='exam'&&S.res.answered){const r=$('.row',v);if(r)r.insertAdjacentHTML('afterbegin','<button class="btn ok" data-act="certShow">'+ico('cert')+' Urkunde ansehen</button>')}
    SND.play(q>=65?'fan':'ok');setTimeout(lvCheck,1200)};
  const oBadges=V.badges;
  V.badges=function(v,p){oBadges(v,p);const h2=$('h2',v);h2.textContent='Trophäen-Raum';const nxt=h2.nextElementSibling;(nxt||h2).insertAdjacentHTML('afterend',trophyHTML());trophySpin(v)};
  const oParent=V.parent;
  V.parent=function(v,p){oParent(v,p);if(PS.tab==='rep'&&$('.tabs',v))v.insertAdjacentHTML('beforeend','<div class="card wk"><b>Wochenbericht</b><p class="small">Die letzten 7 Tage mit Diagramm, Bereichen und einer Empfehlung für die nächste Woche – auch zum Ausdrucken.</p><button class="btn" data-act="goV" data-v="week">'+ico('week')+' Wochenbericht öffnen</button></div>')};
  const oGo=go;
  go=function(name,p,noPush){if(name!=='blitz'&&BZ.g&&BZ.g.live)BZ.g.live=false;if(name!=='duel'&&DU.g&&!DU.g.live)DU.g=null;oGo(name,p,noPush);if(U&&name!=='quiz')setTimeout(lvCheck,500)};
  // Tasten für Blitz und Duell
  document.addEventListener('keydown',e=>{
    if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||$('#modalRoot').firstChild||e.ctrlKey||e.metaKey)return;
    if(!((CUR==='blitz'&&BZ.g&&BZ.g.live)||(CUR==='duel'&&DU.g&&DU.g.live)))return;
    const m={'1':0,'2':1,'3':2,'4':3,a:0,b:1,c:2,d:3}[e.key.toLowerCase()];
    if(m!=null){const b=$('.opt[data-i="'+m+'"]');if(b&&!b.disabled){b.click();e.preventDefault()}}
  });
  // Kopfzeile: Ton-Schalter
  $('.tools').insertAdjacentHTML('afterbegin','<button class="ibtn" id="sndBtn" data-act="sndToggle" title="Töne an/aus" aria-label="Töne an oder aus" aria-pressed="'+(!!SET.sound)+'">'+sndBtnHTML()+'</button>');
  // Startseite: Eule und neue Funktionen
  $('#start').insertAdjacentHTML('afterbegin','<div class="owlpeek" aria-hidden="true">'+owl('happy')+'<span class="bub">Hallo! Ich bin Emma, deine Lerneule.</span></div>');
  $('#feats').insertAdjacentHTML('beforeend',[
    ['blitz','Blitz-Challenge','3 Minuten, so viele richtige wie möglich.','var(--c3)'],
    ['duel','Duell zu zweit','Mit Geschwistern oder Freunden spielen.','var(--c5)'],
    ['map','Lernreise','Von der Grundschule bis zum Gymnasium.','var(--c2)'],
    ['trophy','Trophäen-Raum','Pokale im drehbaren 3D-Regal.','var(--c4)'],
    ['cube','3D-Würfel','Würfelnetze falten und drehen.','var(--c6)'],
    ['cert','Urkunde','Nach jeder Probeprüfung zum Ausdrucken.','var(--c1)'],
    ['week','Wochenbericht','Für Eltern, mit Diagramm und Tipp.','var(--c2)'],
    ['speak','Töne','Fröhliche Klänge – jederzeit abschaltbar.','var(--c3)']
  ].map((f,i)=>'<div class="feat rv in" style="--c:'+f[3]+'"><span class="fi">'+ico(f[0])+'</span><span><h3>'+esc(f[1])+'</h3><p>'+esc(f[2])+'</p></span></div>').join(''));
})();
