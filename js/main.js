(function(){
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* entry */
function ready(){document.body.classList.add('ready');document.documentElement.classList.add('ready')}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(ready,100)})}
setTimeout(ready,1600);

/* reveals: IO + parent proxy + scroll-sweep safety net */
var pending=[];
function markIn(t){t.classList.add('in');
  t.querySelectorAll&&t.querySelectorAll('.imgrv:not(.in-child)').forEach(function(v){v.classList.add('in')});
  if(t.hasAttribute&&t.hasAttribute('data-stagger'))[].forEach.call(t.children,function(c,i){c.style.transitionDelay=(.1*i)+'s';
    var iv=c.querySelector&&c.querySelector('.in-child');if(iv)setTimeout(function(){iv.classList.add('in')},120*i+150)})}
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
  var t=e.target.__rvTarget||e.target;markIn(t);io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -5% 0px'}):null;
document.querySelectorAll('[data-io]').forEach(function(el){
  var obsTarget=el.classList.contains('imgrv')&&el.parentElement?(el.parentElement.__rvTarget=el,el.parentElement):el;
  pending.push({o:obsTarget,t:el});
  if(io)io.observe(obsTarget)});
function sweep(){var vh=innerHeight;
  pending=pending.filter(function(p){if(p.t.classList.contains('in'))return false;
    var r=p.o.getBoundingClientRect();
    if(r.top<vh*0.95&&r.bottom>0){markIn(p.t);if(io)io.unobserve(p.o);return false}return true})}
addEventListener('scroll',function(){requestAnimationFrame(sweep)},{passive:true});
var swn=0,swi=setInterval(function(){sweep();if(++swn>30||!pending.length)clearInterval(swi)},400);
document.querySelectorAll('.lines').forEach(function(b){b.querySelectorAll('.ln > span').forEach(function(s,i){s.style.transitionDelay=(.13*i)+'s'})});



/* horizontal home deck */
function setHdh(){var h=document.querySelector('.hd');if(h)document.documentElement.style.setProperty('--hdh',h.offsetHeight+'px')}
setHdh();addEventListener('resize',setHdh);addEventListener('load',setHdh);

/* atelier film: pick a playable codec explicitly (data-URI <source> fallback is unreliable) */
document.querySelectorAll('video:not([data-reel])').forEach(function(v){
var ss=v.querySelectorAll('source'),pick=null;
for(var i=0;i<ss.length;i++){if(v.canPlayType(ss[i].getAttribute('type'))){pick=ss[i].getAttribute('src');break}}
if(!pick&&ss.length)pick=ss[0].getAttribute('src');
if(pick){v.src=pick;v.load();var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}});

/* home crêpe module borrows the saddle reel */
(function(){var slot=document.querySelector('[data-clone-crepe]');if(!slot)return;
  var src=document.querySelector('.crepe video[data-reel]');if(!src)return;
  slot.appendChild(src.cloneNode(true))})();

/* atelier film = the sewing floor (borrowed from the craftsmanship reel) */
(function(){var v=document.querySelector('[data-atl-floor]');if(!v)return;
  var craft=document.querySelector('#craftsmanship video[data-reel]');if(!craft)return;
  var srcs=craft.querySelectorAll('source');if(!srcs.length)return;
  v.src=srcs[srcs.length-1].getAttribute('src');
  var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})})();

/* rolling reels — each clip runs its course, seamless crossfade to the next; text follows the clip */
var REELTXT={
 craftsmanship:[
  {t:'The Label',p:'Sewn on by hand, one stitch at a time \u2014 only once every seam has passed inspection.'},
  {t:'The Cut',p:'The monogrammed cr\u00eape is cut to the millimetre at Cieffe, Milan.'},
  {t:'The Pieces',p:'Every panel matched and sorted by hand before it reaches the needle.'},
  {t:'The Floor',p:'The same hands that dress the great houses of Europe.'}],
 rnd:[
  {t:'Prototypes',p:'Each piece begins as a basted shell \u2014 versions side by side, refined until only one remains.'},
  {t:'The Corset',p:'Fitted directly on the body, pinned and corrected until it holds its line.'},
  {t:'The Details',p:'Buttons cast for the house, chosen by hand.'}],
 crepe:[
  {t:'The Stretch',p:'Tested at full extension \u2014 the suit must move as the rider moves.'},
  {t:'In the Saddle',p:'Fitted where it lives.'},
  {t:'The Detail',p:'Every pocket proven in position.'}]
};
document.querySelectorAll('video[data-reel]').forEach(function(v){
  var srcs=[].map.call(v.querySelectorAll('source'),function(x){return x.getAttribute('src')});
  if(!srcs.length)return;
  v.removeAttribute('loop');v.innerHTML='';
  var host=v.parentElement;if(getComputedStyle(host).position==='static')host.style.position='relative';
  var v2=v.cloneNode(false);v2.removeAttribute('poster');v2.removeAttribute('id');
  [v,v2].forEach(function(x){x.muted=true;x.setAttribute('playsinline','');x.style.transition='opacity .35s linear'});
  v2.style.position='absolute';v2.style.top=0;v2.style.left=0;v2.style.width='100%';v2.style.height='100%';v2.style.opacity='0';
  host.appendChild(v2);
  var vids=[v,v2],act=0,i=0;
  var sec=v.closest('section'),txts=sec?REELTXT[sec.id]:null,tbox=sec?sec.querySelector('.rtx'):null;
  function showTxt(idx){if(!txts||!tbox)return;tbox.style.opacity=0;
    setTimeout(function(){var o=txts[idx%txts.length];
      tbox.innerHTML='<h3 class="gs sub-t">'+o.t+'</h3><p>'+o.p+'</p>';tbox.style.opacity=1},320)}
  function arm(){var nxt=vids[1-act];nxt.src=srcs[(i+1)%srcs.length];nxt.load()}
  vids.forEach(function(x){x.addEventListener('ended',function(){
    if(x!==vids[act])return;
    var cur=vids[act],nxt=vids[1-act];i=(i+1)%srcs.length;act=1-act;
    var pr=nxt.play();if(pr&&pr.catch)pr.catch(function(){});
    nxt.style.opacity='1';cur.style.opacity='0';showTxt(i);
    setTimeout(arm,450)})});
  var started=false;
  var vio=new IntersectionObserver(function(es){es.forEach(function(en){
    if(en.isIntersecting){
      if(!started){started=true;v.src=srcs[0];var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});showTxt(0);arm()}
      else{var pr2=vids[act].play();if(pr2&&pr2.catch)pr2.catch(function(){})}
    }else if(started){vids[act].pause()}
  })},{threshold:.35});
  vio.observe(host)});

/* photographs flow vertically; no strip arrows anywhere */

/* zoom on product pictures */
var zo=document.getElementById('zoomov'),zi=document.getElementById('zoomImg');
function zoomPan(cx,cy){var iw=zi.offsetWidth,ih=zi.offsetHeight,vw=innerWidth,vh=innerHeight;
  var x=Math.min(0,(vw-iw)*(cx/vw)),y=Math.min(0,(vh-ih)*(cy/vh));
  zi.style.transform='translate('+x+'px,'+y+'px)'}
function openZoom(src,e){zi.src=src;zo.classList.add('open');document.body.style.overflow='hidden';
  zoomPan(e?e.clientX:innerWidth/2,e?e.clientY:innerHeight/2)}
function closeZoom(){zo.classList.remove('open');document.body.style.overflow=''}
zo.addEventListener('click',closeZoom);
document.getElementById('zoomX').addEventListener('click',closeZoom);
zo.addEventListener('mousemove',function(e){requestAnimationFrame(function(){zoomPan(e.clientX,e.clientY)})});
document.addEventListener('click',function(e){
  var im=e.target.closest('.pvstack .pframe img,.fstack figure img');if(!im||!im.src)return;
  openZoom(im.src,e)});
addEventListener('keydown',function(e){if(e.key==='Escape')closeZoom()});

/* campaign stage — rotating stills, ends on the connection shot */
(function(){var cs=document.querySelectorAll('.campstage .csv');if(cs.length<2)return;
var i=0;setInterval(function(){
  var ni=(i+1)%cs.length;
  cs[ni].classList.add('on');
  cs[i].classList.remove('on');
  i=ni},5200)})();

/* shop the look — numbered looks, filter, mini-pages */
var PRICE={'Tailcoat':4800,'Jacket':4200,'Cargo breeches':2000,'Slim breeches':1850,'Corset':2000,'Belt & epaulettes':750};
var PRICEK={tailcoat:4800,jacket:4200,cargo:2000,slim:1850,corset:2000,belt:750};
function fmtP(v){return '\u20AC'+String(v).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
var LOOKS=[
 {kind:'tailcoat',c:'sand',name:'Tailcoat Suit',variant:'Sandstone',shots:['hero_sand','lm_sand2','lm_sand3','kostym_frack_beige','lining_sand','belt_beige_f','shoulder_beige']},
 {kind:'tailcoat',c:'tar',name:'Tailcoat Suit',variant:'Tar',shots:['hero_tar','lm_tar2','lm_tar3','kostym_frack_svart','lining_tar']},
 {kind:'tailcoat',c:'moss',name:'Tailcoat Suit',variant:'Moss',shots:['hero_moss','lm_moss2','lm_moss3','kostym_frack_gron','lining_moss']},
 {kind:'jacket',c:'tar',name:'Jacket Suit',variant:'Tar',shots:['lj_tar1','lj_tar2','lj_tar3','kostym_black','lining_tar']},
 {kind:'jacket',c:'moss',name:'Jacket Suit',variant:'Moss',shots:['lj_moss4','lj_moss1','lj_moss3','kostym_jacka_gron','lining_moss']},
 {kind:'jacket',c:'sand',name:'Jacket Suit',variant:'Sandstone',shots:['lj_sand1','lj_sand2','lj_sand3','kostym_jacka_beige','lining_sand']}
];
function lookCard(i){var L=LOOKS[i];
  var a=document.createElement('a');a.href='#';
  a.innerHTML='<figure><img loading="lazy" src="'+bankSrc(L.shots[0])+'" alt="'+L.name+', '+L.variant+'"></figure><span class="lookmeta"><strong>'+L.name+' · '+L.variant+'</strong></span>';
  a.addEventListener('click',function(e){e.preventDefault();openLook(i)});
  return a}
function renderLooksInto(id,kind){var g=document.getElementById(id);if(!g)return;g.innerHTML='';
  LOOKS.forEach(function(L,i){if(L.kind!==kind)return;g.appendChild(lookCard(i))})}
(function(){var st=document.getElementById('lookStrip');if(st){[0,2,3].forEach(function(i){st.appendChild(lookCard(i))})}})();
renderLooksInto('lookGridT','tailcoat');renderLooksInto('lookGridJ','jacket');
var curLook=0;
function lookStackShow(slugs){var st=document.getElementById('lookStack');st.innerHTML='';
  slugs.forEach(function(sl,j){var src=bankSrc(sl);if(!src)return;
    var fig=document.createElement('figure');fig.className=j===0?'main fframe':'fframe';
    var im=document.createElement('img');im.src=src;im.alt='';
    if(/^(frack_|jacka_|vast_|byxa_)/.test(sl))im.className='flat';
    if(/^(belt_|shoulder_)/.test(sl))im.className='det';
    fig.appendChild(im);st.appendChild(fig)});
  st.scrollLeft=0;if(st.__upd)setTimeout(st.__upd,80)}
window.__lookStackShow=lookStackShow;
function lookImgs(i){var L=LOOKS[i];curLook=i;
  document.getElementById('lookTitle').textContent='The Equestrian Suit';
  document.getElementById('lookVariant').textContent=L.name+' · '+L.variant;
  var seq=[L.shots[0]];
  ((MODEL_SHOTS[L.kind]||{})[L.c]||[]).forEach(function(sl){if(seq.indexOf(sl)<0)seq.push(sl)});
  L.shots.forEach(function(sl){if(seq.indexOf(sl)<0)seq.push(sl)});
  ['belt_beige_f','shoulder_beige'].forEach(function(sl){if(seq.indexOf(sl)<0)seq.push(sl)});
  lookStackShow(seq)}
function openLook(i){var L=LOOKS[i];
  lookImgs(i);
  var tiles=document.getElementById('lookTiles');
  tiles.setAttribute('data-compose',L.c);
  tiles.setAttribute('data-slots',L.kind==='jacket'?'jacket,corset,breech':'tailcoat,breech,corset');
  buildComposeBox(tiles);
  showView('look')}

/* compose your suit — pieces only; model logic reads the coat bucket */
(function(){
var view=document.querySelector('.view[data-view="composer"]');if(!view)return;
window.__suitSet=window.__suitSet||{};
window.__suitSet['composer']=function(c){/* no model on compose */};
window.__composerInit=function(){
  var tiles=document.getElementById('compTiles');
  tiles.setAttribute('data-compose','tar');
  buildComposeBox(tiles)};
})();



/* views router */
var veilT=null;
var NAVSTACK=['home'];
function goBack(){
  if(history.length>1&&window.__histOn){history.back();return}
  NAVSTACK.pop();var prev=NAVSTACK.pop()||'home';showView(prev)}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-back]');if(!b)return;e.preventDefault();goBack()});
window.__histOn=('pushState' in history);
if(window.__histOn){
  addEventListener('popstate',function(ev){
    var v=(ev.state&&ev.state.v)||'home';__showViewRaw(v)});
}
function showView(name){
  if(window.__histOn){try{history.pushState({v:name},'', '#'+name)}catch(e){}}
  NAVSTACK.push(name);if(NAVSTACK.length>40)NAVSTACK.shift();
  __showViewRaw(name)}
function __showViewRaw(name){
  var de=document.documentElement,bd=document.body;
  de.classList.remove('ready');bd.classList.remove('ready');
  clearTimeout(veilT);
  veilT=setTimeout(function(){de.classList.add('ready');bd.classList.add('ready')},480);
  document.querySelectorAll('.view').forEach(function(v){v.hidden=v.getAttribute('data-view')!==name});
  document.querySelectorAll('.view:not([hidden]) .fstack,.view:not([hidden]) .pvstack').forEach(function(st){
    st.scrollLeft=0;if(st.__upd)setTimeout(st.__upd,80)});
  scrollTo(0,0);
  [80,350,800].forEach(function(t){setTimeout(sweep,t)});
}
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-nav]');if(!a)return;
  var name=a.getAttribute('data-nav');
  var href=a.getAttribute('href')||'#';
  e.preventDefault();
  showView(name==='home'?'home':name);
  if(name==='home'&&href.length>1){var el=document.querySelector(href);if(el)setTimeout(function(){el.scrollIntoView()},60)}
  if(menu.classList.contains('open')){menu.classList.remove('open');focusBack(menu)}
});

/* side drawer menu */
var menu=document.getElementById('menu');
document.getElementById('burger').onclick=function(){menu.classList.add('open')};
document.getElementById('menuX').onclick=function(){menu.classList.remove('open');focusBack(menu)};
document.addEventListener('click',function(e){
  if(!menu.classList.contains('open'))return;
  if(menu.contains(e.target))return;
  var b=document.getElementById('burger');if(b&&b.contains(e.target))return;
  var ov=e.target.closest&&e.target.closest('.ccg,.scrim,.acctov,.quicksize,.zoomov,.sizeg');
  menu.classList.remove('open');focusBack(menu);
  if(!ov){e.preventDefault();e.stopPropagation()}},true);
function openMenuGroup(g){
  menu.querySelectorAll('.mitem').forEach(function(mi){
    var mine=mi.getAttribute('data-group')===g;
    mi.style.display=mine?'':'none';
    mi.classList.toggle('open',mine)});
  var mf=menu.querySelector('.mfoot');if(mf)mf.style.display='none';
  menu.classList.add('open')}
document.querySelectorAll('.hd [data-mgroup]').forEach(function(a){
  a.addEventListener('click',function(e){e.preventDefault();openMenuGroup(a.getAttribute('data-mgroup'))})});
document.getElementById('burger').onclick=function(){
  menu.querySelectorAll('.mitem').forEach(function(mi){mi.style.display='';mi.classList.remove('open')});
  var mf=menu.querySelector('.mfoot');if(mf)mf.style.display='';
  menu.classList.add('open');focusInto(menu,'#menuX')};
menu.querySelectorAll('.mhead[data-sub]').forEach(function(h){
  h.addEventListener('click',function(){
    var it=h.parentElement,was=it.classList.contains('open');
    menu.querySelectorAll('.mitem.open').forEach(function(x){x.classList.remove('open')});
    if(!was)it.classList.add('open')})});
menu.querySelectorAll('[data-subtoggle]').forEach(function(b){
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
    var it=b.closest('.mitem'),was=it.classList.contains('open');
    menu.querySelectorAll('.mitem.open').forEach(function(x){x.classList.remove('open')});
    if(!was)it.classList.add('open')})});
var MPIECE_COL={tailcoat:'tar',jacket:'tar',corset:'tar',cargo:'tar',slim:'moss',belt:'sand'};
menu.querySelectorAll('[data-mpiece]').forEach(function(a){
  a.addEventListener('click',function(e){e.preventDefault();
    var k=a.getAttribute('data-mpiece');
    menu.classList.remove('open');
    if(k==='belt'){openPiece('sand','belt');return}
    openPiece(MPIECE_COL[k]||'tar',k)})});



/* piece slider */
function bankImg(slug,cls){var i=document.createElement('img');i.src=bankSrc(slug);i.alt='';i.className=cls;return i}
function bankSrc(slug){var b=document.querySelector('#bank [data-slug="'+slug+'"]');return b?(b.getAttribute('data-src')||''):''}
function prodSlug(stack){if(!stack||!stack.length)return null;
  for(var i=0;i<stack.length;i++){if(!/^(hero_|lj_|lm_)/.test(stack[i]))return stack[i]}
  return stack[0]}




/* stacked fashion frames + tar suit — fed from the bank */
document.querySelectorAll('img[data-bank]').forEach(function(im){im.src=bankSrc(im.getAttribute('data-bank'))});

/* pieces — Dior-style: everything stacked under the big picture; named details in the rail */
var PIECES={
 tar:{name:'Tar',
   tailcoat:{n:'Tailcoat',stack:['hero_tar','frack_svart_fram','frack_svart_bak','kostym_frack_svart','lining_tar','belt_beige_f','shoulder_beige'],rail:[]},
   jacket:{n:'Jacket',stack:['lj_tar1','jacka_svart_fram','jacka_svart_bak','kostym_black','lining_tar','belt_beige_f','shoulder_beige'],rail:[]},
   corset:{n:'Corset',stack:['vast_svart_fram','vast_svart_bak'],rail:[]},
   cargo:{n:'Cargo breeches',stack:['byxa_svart_cargo_fram','byxa_svart_cargo_bak','byxa_svart_cargo_sida'],rail:[]},
   slim:{n:'Slim breeches',stack:['byxa_svart_slim_fram','byxa_svart_slim_bak','byxa_svart_slim_sida'],rail:[]},
   belt:{n:'Belt & epaulettes',stack:[],rail:[]}},
 moss:{name:'Moss',
   tailcoat:{n:'Tailcoat',stack:['hero_moss','frack_gron_fram','frack_gron_bak','kostym_frack_gron','lining_moss','belt_beige_f','shoulder_beige'],rail:[]},
   jacket:{n:'Jacket',stack:['lj_moss4','lj_moss1','lj_moss3','jacka_gron_fram','kostym_jacka_gron','lining_moss','belt_beige_f','shoulder_beige'],rail:[]},
   corset:{n:'Corset',stack:['vast_gron_fram','vast_gron_bak'],rail:[]},
   cargo:{n:'Cargo breeches',stack:['byxa_gron_cargo_fram','byxa_gron_cargo_bak','byxa_gron_cargo_sida'],rail:[]},
   slim:{n:'Slim breeches',stack:['byxa_gron_slim_fram','byxa_gron_slim_bak','byxa_gron_slim_sida'],rail:[]},
   belt:{n:'Belt & epaulettes',stack:[],rail:[]}},
 sand:{name:'Sandstone',
   tailcoat:{n:'Tailcoat',stack:['hero_sand','frack_beige_fram','frack_beige_bak','kostym_frack_beige','lining_sand','belt_beige_f','shoulder_beige'],rail:[]},
   jacket:{n:'Jacket',stack:['lj_sand1','lj_sand2','lj_sand3','jacka_beige','jacka_beige_bak','kostym_jacka_beige','lining_sand','belt_beige_f','shoulder_beige'],rail:[]},
   corset:{n:'Corset',stack:['vast_beige_fram','vast_beige_bak'],rail:[]},
   cargo:{n:'Cargo breeches',stack:['byxa_beige_cargo_fram','byxa_beige_cargo_bak','byxa_beige_cargo_sida','byxa_beige_topp'],rail:[]},
   slim:{n:'Slim breeches',stack:['byxa_beige_slim_fram','byxa_beige_slim_bak'],rail:[]},
   belt:{n:'Belt & epaulettes',stack:['belt_beige_f','shoulder_beige'],rail:[]}}
};
/* the clean studio model shots, front then back — never the fashion photography */
var MODEL_SHOTS={
 tailcoat:{tar:['lm_tar2','lm_tar3'],moss:['lm_moss2','lm_moss3'],sand:['lm_sand2','lm_sand3']},
 jacket:{tar:['mj_tar2','mj_tar3'],moss:['lj_moss1','lj_moss3'],sand:['lj_sand2','lj_sand3']}
};
/* piece-page order: the fashion shot, garment front, back (side/top), lining,
   epaulettes, belt. Never the whole-suit shot — that belongs to the looks. */
function pdpShots(c,k){var st=PIECES[c][k].stack,out=[],seen={},ms=((MODEL_SHOTS[k]||{})[c]||[]);
  function add(sl){if(sl&&!seen[sl]&&bankSrc(sl)){seen[sl]=1;out.push(sl)}}
  for(var i=0;i<st.length;i++){var sl=st[i];
    if(/^(hero_|lj_|lm_|mj_)/.test(sl)&&ms.indexOf(sl)<0){add(sl);break}}
  st.forEach(function(sl){if((/_fram/.test(sl)||sl==='jacka_beige')&&!/^(hero_|lj_|lm_|mj_|kostym_)/.test(sl))add(sl)});
  st.forEach(function(sl){if(/_bak/.test(sl)&&!/^(hero_|lj_|lm_|mj_|kostym_)/.test(sl))add(sl)});
  if(!st.some(function(sl){return /_bak/.test(sl)&&!/^(hero_|lj_|lm_|mj_|kostym_)/.test(sl)&&bankSrc(sl)})){
    var mb=((MODEL_SHOTS[k]||{})[c]||[])[1];if(mb)add(mb)}
  st.forEach(function(sl){if(/(_sida|_topp)/.test(sl))add(sl)});
  st.forEach(function(sl){if(/^lining_/.test(sl))add(sl)});
  st.forEach(function(sl){if(/^(belt_|shoulder_)/.test(sl))add(sl)});
  if(k==='tailcoat')add('walk_tailcoat');
  if(k==='jacket')add('walk_jacket');
  return out.length?out:st.slice()}
/* garment-only order for tiles and square-presses: front, back (side/top),
   lining, belt & epaulettes. Models appear only in the look's own flow. */
function shotOrder(c,k){var st=PIECES[c][k].stack,out=[],seen={};
  function add(sl){if(sl&&!seen[sl]&&bankSrc(sl)){seen[sl]=1;out.push(sl)}}
  st.forEach(function(sl){if((/_fram/.test(sl)||sl==='jacka_beige')&&!/^(hero_|lj_|lm_|mj_|kostym_)/.test(sl))add(sl)});
  st.forEach(function(sl){if(/_bak/.test(sl)&&!/^(hero_|lj_|lm_|mj_|kostym_)/.test(sl))add(sl)});
  if(!st.some(function(sl){return /_bak/.test(sl)&&!/^(hero_|lj_|lm_|mj_|kostym_)/.test(sl)&&bankSrc(sl)})){
    var mb=((MODEL_SHOTS[k]||{})[c]||[])[1];if(mb)add(mb)}
  st.forEach(function(sl){if(/(_sida|_topp)/.test(sl))add(sl)});
  st.forEach(function(sl){if(/^lining_/.test(sl))add(sl)});
  st.forEach(function(sl){if(/^(belt_|shoulder_)/.test(sl))add(sl)});
  if(k==='tailcoat')add('walk_tailcoat');
  if(k==='jacket')add('walk_jacket');
  return out.length?out:st.slice()}
/* wishlist */
var WLHEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-9-9c-1.2-2.8.6-6 3.7-6 1.9 0 3.4 1.1 4.3 2.7C11.9 6.1 13.4 5 15.3 5c3.1 0 4.9 3.2 3.7 6-2 4.5-7 9-7 9z"/></svg>';
function wlData(){try{return JSON.parse(localStorage.getItem('kc_wishlist')||'[]')}catch(e){return[]}}
function wlSave(a){try{localStorage.setItem('kc_wishlist',JSON.stringify(a))}catch(e){}}
function wlHas(c,k){return wlData().some(function(x){return x.c===c&&x.k===k})}
function wlToggle(c,k){var a=wlData();var i=-1;
  a.forEach(function(x,j){if(x.c===c&&x.k===k)i=j});
  if(i>-1)a.splice(i,1);else a.push({c:c,k:k});
  wlSave(a)}
function wlRender(){var box=document.getElementById('wlItems');box.innerHTML='';
  var a=wlData();document.getElementById('wlEmpty').style.display=a.length?'none':'block';
  a.forEach(function(x){var P=PIECES[x.c]&&PIECES[x.c][x.k];if(!P)return;
    var row=document.createElement('div');row.className='wlitem';
    var im=document.createElement('img');im.src=P.stack.length?bankSrc(prodSlug(P.stack)):'';row.appendChild(im);
    var nm=document.createElement('div');nm.className='nm';nm.textContent=PIECES[x.c].name+' \u00b7 '+P.n;row.appendChild(nm);
    if(P.stack.length){var ab=document.createElement('button');ab.className='ordlink';ab.textContent='Add to bag';
      ab.addEventListener('click',function(){var item={p:P.n,c:PIECES[x.c].name,z:null};
        if(x.k==='tailcoat'||x.k==='jacket')item.includedSet=PIECES[x.c].name;
        openQuickSize(item)});
      row.appendChild(ab)}
    var ob=document.createElement('button');ob.className='ordlink';ob.setAttribute('data-piece-link',x.c+':'+x.k);
    ob.textContent='View piece';row.appendChild(ob);
    var rm=document.createElement('button');rm.className='rm';rm.innerHTML='&#215;';
    rm.addEventListener('click',function(){wlToggle(x.c,x.k);wlRender();wlHearts()});row.appendChild(rm);
    box.appendChild(row)})}
function wlHearts(){document.querySelectorAll('.wlbtn[data-wl]').forEach(function(b){
  var p=b.getAttribute('data-wl').split(':');b.classList.toggle('on',wlHas(p[0],p[1]))})}
/* move focus into overlays on open; hand it back on close */
function focusInto(box,sel){box.__pf=document.activeElement;
  var t=(sel&&box.querySelector(sel))||box.querySelector('button,[href],input,select,textarea');
  if(t)t.focus()}
function focusBack(box){if(box.__pf&&box.__pf.focus)box.__pf.focus();box.__pf=null}
var wlov=document.getElementById('wl');
function wlOpen(e){if(e)e.preventDefault();wlRender();wlov.classList.add('open');document.body.style.overflow='hidden';focusInto(wlov,'#wlX')}
function wlClose(){wlov.classList.remove('open');document.body.style.overflow='';focusBack(wlov)}
document.getElementById('wlLink').addEventListener('click',wlOpen);
var wlm=document.getElementById('wlLinkM');if(wlm)wlm.addEventListener('click',function(e){wlOpen(e);document.getElementById('menu').classList.remove('open')});
document.getElementById('wlX').addEventListener('click',wlClose);
wlov.addEventListener('click',function(e){if(e.target===wlov)wlClose();if(e.target.closest('[data-piece-link]'))wlClose()});
var bagov=document.getElementById('bag');
function bagData(){try{return JSON.parse(localStorage.getItem('kc_bag')||'[]')}catch(e){return[]}}
function bagHasCoat(a){return a.some(function(x){return x.p==='Tailcoat'||x.p==='Jacket'})}
function coatFromOrders(){var o=orderData();
  for(var j=0;j<o.length;j++){var it=o[j].items||[];
    for(var k=it.length-1;k>=0;k--){if(it[k].p==='Tailcoat'||it[k].p==='Jacket')return it[k]}}
  return null}
function lastCoat(){var b=bagData();
  for(var i=b.length-1;i>=0;i--){if(b[i].p==='Tailcoat'||b[i].p==='Jacket')return b[i]}
  return coatFromOrders()}
function bagSave(a){
  if(!bagHasCoat(a)&&!coatFromOrders())a=a.filter(function(x){return x.p!=='Belt & epaulettes'});
  try{localStorage.setItem('kc_bag',JSON.stringify(a))}catch(e){};bagBadge()}
function orderData(){try{return JSON.parse(localStorage.getItem('kc_orders')||'[]')}catch(e){return[]}}
function orderSave(a){try{localStorage.setItem('kc_orders',JSON.stringify(a))}catch(e){}}
function bagBadge(){var n=bagData().length,el=document.getElementById('bagN');
  el.style.display=n?'block':'none';el.textContent=n}
function bagRender(){var a=bagData(),box=document.getElementById('bagItems');box.innerHTML='';
  document.getElementById('bagEmpty').style.display=a.length?'none':'block';
  document.getElementById('bagPay').style.display=a.length?'block':'none';
  var shownGroups={};
  a.forEach(function(x,i){
    if(x.group&&!shownGroups[x.group]){var gh=document.createElement('p');gh.className='baggroup';gh.textContent='Your composition';box.appendChild(gh);shownGroups[x.group]=true}
    var row=document.createElement('div');row.className='wlitem';
    var ck=null;
    for(var cc in PIECES){if(PIECES[cc].name===x.c){for(var k in PIECES[cc]){if(PIECES[cc][k]&&PIECES[cc][k].n===x.p){ck=PIECES[cc][k]}}}}
    var im=document.createElement('img');im.src=(ck&&ck.stack&&ck.stack.length)?bankSrc(prodSlug(ck.stack)):(x.p==='Belt & epaulettes'?bankSrc('belt_beige_f'):'');row.appendChild(im);
    var nm=document.createElement('div');nm.className='nm';nm.textContent=x.c+' \u00b7 '+(x.extra?'Extra Belt & Epaulettes':x.p)+' \u00b7 ';
    if(x.z==='One size'){nm.appendChild(document.createTextNode('One size'))}
    else{var zb=document.createElement('button');zb.type='button';zb.className='zedit';zb.textContent=x.z;
      zb.setAttribute('aria-label','Change size for '+x.p);zb.title='Change size';
      zb.addEventListener('click',function(){openQuickSize({p:x.p,c:x.c,z:null,__edit:i})});
      nm.appendChild(zb)}
    if(x.includedSet){var included=document.createElement('em');included.className='included-set';included.textContent='Included Belt & Epaulettes \u00b7 '+x.includedSet;nm.appendChild(included)}
    row.appendChild(nm);
    var pr=document.createElement('span');pr.className='rprice';pr.textContent=fmtP(PRICE[x.p]||0);row.appendChild(pr);
    var rm=document.createElement('button');rm.className='rm';rm.innerHTML='&#215;';
    rm.addEventListener('click',function(){var b=bagData();b.splice(i,1);bagSave(b);bagRender()});row.appendChild(rm);
    box.appendChild(row)});
  if(a.length){var tot=0;a.forEach(function(x){tot+=PRICE[x.p]||0});
    var tr=document.createElement('div');tr.className='bagtot';
    tr.innerHTML='<span>Total <i>Incl. 25% VAT</i></span><span>'+fmtP(tot)+'</span>';
    box.appendChild(tr)}
  bagUpsell(a)}
function bagUpsell(a){var up=document.getElementById('bagUp');up.innerHTML='';
  if(!a.length)return;
  var wl=wlData().filter(function(x){var P=PIECES[x.c]&&PIECES[x.c][x.k];
    return P&&P.stack.length&&!a.some(function(it){return it.p===P.n&&it.c===PIECES[x.c].name})});
  if(wl.length){var hw=document.createElement('p');hw.className='upt';hw.textContent='From your wishlist';up.appendChild(hw);
    wl.forEach(function(x){var P=PIECES[x.c][x.k];
      var row=document.createElement('div');row.className='suprow';
      var im=document.createElement('img');im.src=bankSrc(prodSlug(P.stack));row.appendChild(im);
      var nm=document.createElement('i');nm.style.fontStyle='normal';nm.style.flex='1';
      nm.innerHTML=PIECES[x.c].name+' \u00b7 '+P.n+'<em style="display:block;font-style:normal;font-size:11px;color:var(--grey);margin-top:2px">'+fmtP(PRICEK[x.k]||0)+'</em>';
      row.appendChild(nm);
      var ad=document.createElement('button');ad.type='button';ad.className='add';ad.textContent='Add';
      ad.style.textDecoration='underline';ad.style.textUnderlineOffset='3px';
      ad.style.fontSize='10.5px';ad.style.letterSpacing='.18em';ad.style.textTransform='uppercase';
      ad.addEventListener('click',function(){var item={p:P.n,c:PIECES[x.c].name,z:null};
        if(x.k==='tailcoat'||x.k==='jacket')item.includedSet=PIECES[x.c].name;
        openQuickSize(item)});
      row.appendChild(ad);up.appendChild(row)})}
  var suit=null;a.forEach(function(x){if(!suit&&['Tailcoat','Jacket'].indexOf(x.p)>-1)suit=x});
  if(!suit)return;
  if(a.some(function(x){return x.p==='Belt & epaulettes'&&x.viaOffer}))return;
  var h=document.createElement('p');h.className='upt';h.textContent='Add an extra set';
  if(wl.length)h.style.marginTop='18px';
  up.appendChild(h);
  var nte=document.createElement('p');nte.className='upn';nte.textContent='Your Tailcoat or Jacket includes the belt and epaulettes colour you selected. Add an extra set in another colour, if desired.';up.appendChild(nte);
  up.appendChild(upsellRow(suit.includedSet||suit.c,suit.z))}
function openBag(e){if(e)e.preventDefault();bagov.classList.remove('confirmed');bagRender();bagov.classList.add('open');document.body.style.overflow='hidden';focusInto(bagov,'#bagX')}
function closeBag(){bagov.classList.remove('open');document.body.style.overflow='';focusBack(bagov)}
document.getElementById('bagLink').addEventListener('click',openBag);
document.getElementById('bagX').addEventListener('click',closeBag);
bagov.addEventListener('click',function(e){if(e.target===bagov)closeBag()});
var UPIMGS={Belt:'belt_beige_f',Epaulettes:'shoulder_beige'};
var UPDOT={Tar:'t',Moss:'m',Sandstone:'s'};
function upsellRow(suitCol,size){var pn='Belt & epaulettes';
  var others=['Tar','Moss','Sandstone'];
  var chosen=suitCol==='Sandstone'?'Tar':'Sandstone';
  var row=document.createElement('div');row.className='suprow';
  var im=document.createElement('img');row.appendChild(im);
  var nm=document.createElement('i');nm.style.fontStyle='normal';nm.style.flex='1';row.appendChild(nm);
  var sw=document.createElement('span');sw.className='sw csw';row.appendChild(sw);
  var ad=document.createElement('button');ad.type='button';ad.className='add';ad.textContent='Add';
  ad.style.textDecoration='underline';ad.style.textUnderlineOffset='3px';
  ad.style.fontSize='10.5px';ad.style.letterSpacing='.18em';ad.style.textTransform='uppercase';
  row.appendChild(ad);
  function render(){
    if(chosen==='Sandstone'){im.src=bankSrc(UPIMGS.Belt);im.style.display=''}else{im.removeAttribute('src');im.style.display='none'}
    nm.innerHTML='Extra belt & epaulettes<em style="display:block;font-style:normal;font-size:11px;color:var(--grey);margin-top:2px">'+fmtP(PRICE['Belt & epaulettes'])+'</em>';
    sw.innerHTML='';
    others.forEach(function(c){var d=document.createElement('button');d.type='button';d.className=UPDOT[c];
      d.setAttribute('aria-pressed',String(c===chosen));d.setAttribute('aria-label',c);
      d.addEventListener('click',function(e){e.stopPropagation();chosen=c;render()});sw.appendChild(d)})}
  ad.addEventListener('click',function(){var a=bagData();
    if(!bagHasCoat(a)&&!coatFromOrders()){bagToast(null,'Belt & epaulettes are available with a Jacket or Tailcoat');return}
    openQuickSize({p:pn,c:chosen,z:null,extra:true,viaOffer:true})});
  render();return row}
var bagToastEl=null,bagToastT=null;
function bagToast(item,message){
  if(!bagToastEl){bagToastEl=document.createElement('button');bagToastEl.type='button';bagToastEl.className='bagtoast';
    bagToastEl.setAttribute('aria-label','Open bag');
    bagToastEl.addEventListener('click',function(){bagToastEl.classList.remove('show');openBag()});
    document.body.appendChild(bagToastEl)}
  bagToastEl.textContent=message||((item?item.c+' '+item.p+' \u2014 ':'')+'added to your bag');
  bagToastEl.classList.add('show');
  clearTimeout(bagToastT);bagToastT=setTimeout(function(){bagToastEl.classList.remove('show')},2200)}
var quickSize=document.getElementById('quickSize'),quickSizeTitle=document.getElementById('quickSizeTitle');
var quickSizeOptions=document.getElementById('quickSizeOptions'),quickSizeConfirm=document.getElementById('quickSizeConfirm');
var quickSizePrice=document.getElementById('quickSizePrice');
var pendingQuickItem=null;
function closeQuickSize(){quickSize.classList.remove('open');pendingQuickItem=null;
  document.body.style.overflow=(bagov.classList.contains('open')||wlov.classList.contains('open')||acct.classList.contains('open'))?'hidden':'';
  focusBack(quickSize)}
function openQuickSize(item){pendingQuickItem=item;quickSizeTitle.textContent=item.c+' '+item.p;
  quickSizePrice.textContent=PRICE[item.p]?fmtP(PRICE[item.p]):'';
  [].forEach.call(quickSizeOptions.children,function(b){b.setAttribute('aria-pressed','false')});
  quickSizeConfirm.disabled=true;quickSize.classList.add('open');document.body.style.overflow='hidden';
  focusInto(quickSize,'#quickSizeOptions button')}
quickSizeOptions.addEventListener('click',function(e){var b=e.target.closest('[data-size]');if(!b||!pendingQuickItem)return;
  [].forEach.call(quickSizeOptions.children,function(x){x.setAttribute('aria-pressed',String(x===b))});
  pendingQuickItem.z=b.getAttribute('data-size');quickSizeConfirm.disabled=false});
quickSizeConfirm.addEventListener('click',function(){if(!pendingQuickItem||!pendingQuickItem.z)return;
  var item=pendingQuickItem,bag=bagData();
  if(item.__edit!=null){if(bag[item.__edit]){bag[item.__edit].z=item.z;bagSave(bag);
    if(bagov.classList.contains('open'))bagRender()}
    closeQuickSize();bagToast(null,item.c+' '+item.p+' · size updated to '+item.z);return}
  bag.push(item);bagSave(bag);closeQuickSize();
  if(bagov.classList.contains('open'))bagRender();
  bagToast(item)});
document.getElementById('quickSizeX').addEventListener('click',closeQuickSize);
quickSize.addEventListener('click',function(e){if(e.target===quickSize)closeQuickSize()});
document.querySelectorAll('[data-bagpay]').forEach(function(b){b.addEventListener('click',function(){
  var current=bagData();if(!current.length)return;
  var d=acctData();
  if(!d||!d.name||!d.address){window.__payPending=true;closeBag();acctOpen();
    bagToast(null,'Tell us where to deliver — then confirm your order');return}
  var orders=orderData(),ref='KC'+String(Date.now()).slice(-8);
  orders.unshift({reference:ref,date:new Date().toISOString(),items:current});orderSave(orders);
  bagov.classList.add('confirmed');bagSave([]);bagRender();
  var confirmation=document.getElementById('bagConfirmation');if(confirmation)confirmation.textContent='Order '+ref+' has been confirmed — delivering to '+d.name+', '+d.address+'.';
  document.getElementById('bagEmpty').style.display='none'})});
bagBadge();

/* compose in the squares — colour dots under each piece */
var SWCLS={tar:'t',moss:'m',sand:'s'},CCOLS=['tar','moss','sand'];
function composeCell(box,group,startCol){
  var variants=group==='breech'?['cargo','slim']:(group==='coat'?['tailcoat','jacket']:[group]);
  var state={k:variants[0],c:startCol,si:0};
  if(!PIECES[state.c][state.k])state.c=CCOLS.filter(function(c){return PIECES[c][state.k]})[0];
  var cell=document.createElement('div');cell.className='cell'+(group==='belt'?' is-accessory':'');
  var pc=document.createElement('div');pc.className='pc';pc.setAttribute('role','button');pc.tabIndex=0;
  pc.setAttribute('aria-label','Open the piece page');
  var tile=document.createElement('span');tile.className='tile';
  var img=document.createElement('img');img.className='gimg';img.setAttribute('role','img');
  tile.appendChild(img);
  var shots=[];
  pc.appendChild(tile);
  pc.addEventListener('click',function(e){if(!shots.length)return;
    if(group==='belt'){openPiece('sand','belt');return}
    openPiece(state.c,state.k,(state.k==='tailcoat'||state.k==='jacket')?(box.id==='compTiles'?(window.__composerIncludedSet||PIECES[state.c].name):PIECES[state.c].name):null)});
  pc.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pc.click()}});
  var cap=document.createElement('span');cap.className='cap2';pc.appendChild(cap);
  cap.addEventListener('click',function(e){e.stopPropagation();
    if(group==='belt'){openPiece('sand','belt');return}
    openPiece(state.c,state.k,(state.k==='tailcoat'||state.k==='jacket')?(box.id==='compTiles'?(window.__composerIncludedSet||PIECES[state.c].name):PIECES[state.c].name):null)});
  cell.appendChild(pc);
  var locked=box.hasAttribute('data-lock');
  var tog=null;
  if(variants.length>1){tog=document.createElement('span');tog.className='vtog';
    variants.forEach(function(v){var b=document.createElement('button');b.type='button';
      b.textContent={cargo:'Cargo',slim:'Slim',tailcoat:'Tailcoat',jacket:'Jacket'}[v]||v;
      b.addEventListener('click',function(e){e.stopPropagation();state.k=v;
        if(!PIECES[state.c][v])state.c=CCOLS.filter(function(c){return PIECES[c][v]})[0];
        render();
        var sv=box.closest('.view');var kk=sv&&sv.getAttribute('data-view');
        if(kk&&window.__suitSet&&window.__suitSet[kk])window.__suitSet[kk](state.c,false)});
      tog.appendChild(b)});
    cell.appendChild(tog)}
  else if(/(^|,)(coat|breech)(,|$)/.test(box.getAttribute('data-slots')||'')){
    var ghost=document.createElement('span');ghost.className='vtog vghost';ghost.setAttribute('aria-hidden','true');
    var gb=document.createElement('button');gb.type='button';gb.tabIndex=-1;gb.textContent='Corset';ghost.appendChild(gb);
    cell.appendChild(ghost)}
  var sw=document.createElement('span');sw.className='sw csw';if(!locked)cell.appendChild(sw);
  var quick=document.createElement('div');quick.className='quick-buy';
  var quickAdd=document.createElement('button');quickAdd.type='button';quickAdd.className='quick-add';quickAdd.textContent='Add to bag';
  quickAdd.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var P=PIECES[state.c][state.k];
    if(group==='belt'){var bag=bagData(),coatIndex=-1;for(var bi=bag.length-1;bi>=0;bi--){if(bag[bi].p==='Tailcoat'||bag[bi].p==='Jacket'){coatIndex=bi;break}}
      if(coatIndex<0){bagToast(null,'Add your Tailcoat or Jacket first, then include this set');return}
      bag[coatIndex].includedSet=PIECES[state.c].name;bagSave(bag);bagToast(null,PIECES[state.c].name+' Belt & Epaulettes included with your suit');return}
    var item={p:P.n,c:PIECES[state.c].name,z:null};
    if(state.k==='tailcoat'||state.k==='jacket')item.includedSet=box.id==='compTiles'?(window.__composerIncludedSet||PIECES[state.c].name):PIECES[state.c].name;
    openQuickSize(item)});
  quick.appendChild(quickAdd);cell.appendChild(quick);
  var wlb=document.createElement('button');wlb.className='wlbtn';wlb.type='button';wlb.innerHTML=WLHEART;
  wlb.setAttribute('aria-label','Save to wishlist');
  wlb.addEventListener('click',function(e){e.stopPropagation();wlToggle(state.c,state.k);
    wlb.setAttribute('data-wl',state.c+':'+state.k);wlHearts()});
  cell.appendChild(wlb);
  if(group==='belt'){
    if(box.id==='compTiles')wlb.style.display='none';
    var accessoryNote=document.createElement('p');accessoryNote.className='accessory-note';
    accessoryNote.textContent='One set is included with your Tailcoat or Jacket, cut to its size.';
    cell.insertBefore(accessoryNote,quick)}
  function render(){
    var P=PIECES[state.c][state.k];
    if(group==='belt')pc.removeAttribute('data-piece');else pc.setAttribute('data-piece',state.c+':'+state.k);
    state.si=0;
    var allShots=group==='belt'?['belt_beige_f','shoulder_beige']:(P.stack.length?shotOrder(state.c,state.k):[]);
    shots=allShots.slice(0,1);
    if(shots.length){img.style.display='';img.src=bankSrc(shots[0]);img.classList.remove('cover')}else{img.style.display='none';img.removeAttribute('src')}img.setAttribute('aria-label',P.n);
    if(group==='belt'&&box.id==='compTiles')window.__composerIncludedSet=PIECES[state.c].name;
    cap.innerHTML=(group==='belt'&&box.id==='compTiles'
      ? P.n+'<em class="capprice">Included · '+PIECES[state.c].name+'</em>'
      : P.n+' · '+PIECES[state.c].name+(PRICEK[state.k]?'<em class="capprice">'+fmtP(PRICEK[state.k])+'</em>':''));
    quickAdd.setAttribute('aria-label','Add '+P.n+' to bag');
    if(typeof wlb!=='undefined'){wlb.setAttribute('data-wl',state.c+':'+state.k);wlb.classList.toggle('on',wlHas(state.c,state.k))}
    if(tog)[].forEach.call(tog.children,function(b,i){b.setAttribute('aria-pressed',String(variants[i]===state.k))});
    sw.innerHTML='';
    CCOLS.forEach(function(c){if(!PIECES[c][state.k])return;
      var d=document.createElement('button');d.type='button';d.className=SWCLS[c];
      d.setAttribute('aria-label',PIECES[c].name);
      d.setAttribute('aria-pressed',String(c===state.c));
      d.addEventListener('click',function(e){e.stopPropagation();if(state.c!==c){state.c=c;render()}});
      sw.appendChild(d)});
  }
  render();box.appendChild(cell);
}
function buildComposeBox(box){var col=box.getAttribute('data-compose');box.innerHTML='';
  box.getAttribute('data-slots').split(',').forEach(function(g){composeCell(box,g,col)})}
/* tiles build deferred to init (needs PIECES) */
var DESCR={
 tailcoat:'The Tailcoat is the most ceremonial piece in the Kiwi & Colibri wardrobe. Its standing collar, structured shoulders, sculpted waist and elongated tails create a sharper, more modern silhouette. The Tailcoat carries the presence of the dressage arena into everyday life \u2014 made not to wait in the wardrobe, but to be worn.',
 jacket:'A precise equestrian jacket with a sculpted shoulder, defined waist and the house\u2019s military line. Designed to move between the stable, the city and evening.',
 corset:'A close, architectural layer that brings definition to the complete equestrian suit while retaining freedom of movement.',
 cargo:'Breeches cut with a clean cargo line and engineered for movement in and out of the saddle.',
 slim:'A streamlined breech in Colibri Cr\u00eape, shaped for a close silhouette and ease in motion.',
 belt:'One set, in the colour you choose, is included with every Tailcoat and Jacket. This additional set is for evolving your suit \u2014 another colour, cut to the size of your Tailcoat or Jacket.'
};
var CARE={
 tailcoat:{care:['Made in Italy','Dry clean only','Remove belt and epaulettes before dry cleaning','Do not bleach','Do not tumble dry','Do not iron','Store on a shaped hanger'],comp:[['Colibri Cr\u00eape by Reggiani','80% Polyamide, 20% Elastane'],['Lining','61% Viscose, 39% Polyester (PBT)'],['Belt & epaulettes (vegan suede)','80% Polyester (approx. 20% plant-based), 20% Polyurethane (approx. 31% plant-based)']]},
 jacket:{care:['Made in Italy','Dry clean only','Remove belt and epaulettes before dry cleaning','Do not bleach','Do not tumble dry','Do not iron','Store on a shaped hanger'],comp:[['Colibri Cr\u00eape by Reggiani','80% Polyamide, 20% Elastane'],['Lining','61% Viscose, 39% Polyester (PBT)'],['Belt & epaulettes (vegan suede)','80% Polyester (approx. 20% plant-based), 20% Polyurethane (approx. 31% plant-based)']]},
 corset:{care:['Made in Italy','Wash delicately inside out at 30\u00b0C','Hang dry','Iron on low heat using a protection cloth','Do not bleach','Do not tumble dry','Do not wring','Avoid fabric softeners'],comp:[['Poplin by Reggiani','78% Cotton, 17% Polyamide, 5% Elastane'],['Secondary fabric','73% Polyamide, 27% Elastane']]},
 cargo:{care:['Made in Italy','Wash delicately inside out at 30\u00b0C','Close zippers before washing','Hang dry','Do not bleach','Do not tumble dry','Do not wring','Do not iron','Avoid fabric softeners'],comp:[['Colibri Cr\u00eape by Reggiani','80% Polyamide, 20% Elastane'],['Secondary fabric','80% Polyester (approx. 20% plant-based), 20% Polyurethane (approx. 31% plant-based)'],['Lining','73% Polyamide, 27% Elastane']]},
 slim:{care:['Made in Italy','Wash delicately inside out at 30\u00b0C','Close zippers before washing','Hang dry','Do not bleach','Do not tumble dry','Do not wring','Do not iron','Avoid fabric softeners'],comp:[['Colibri Cr\u00eape by Reggiani','80% Polyamide, 20% Elastane'],['Secondary fabric','80% Polyester (approx. 20% plant-based), 20% Polyurethane (approx. 31% plant-based)'],['Lining','73% Polyamide, 27% Elastane']]}
};
var lastColour='tar',lastKey='tailcoat',lastOrigin=null,lastIncludedSet=null;
function openPiece(c,k,includedSet){
  var cv=document.querySelector('.view:not([hidden])');
  if(cv&&cv.getAttribute('data-view')!=='piece')lastOrigin=cv.getAttribute('data-view');
  var P=PIECES[c][k];
  if(!P||!P.stack.length)return;
  lastColour=c;lastKey=k;lastIncludedSet=(k==='tailcoat'||k==='jacket')?(includedSet||PIECES[c].name):null;
  var th=document.getElementById('pieceThumbs');th.innerHTML='';
  ['tar','moss','sand'].forEach(function(cc){if(!PIECES[cc][k]||!PIECES[cc][k].stack.length)return;
    var bt=document.createElement('button');bt.type='button';
    if(cc===c)bt.className='on';
    bt.setAttribute('aria-label',PIECES[cc].name);
    var tstack=PIECES[cc][k].stack,tsl=tstack[0];
    for(var ti=0;ti<tstack.length;ti++){if(!/^(hero_|lj_|lm_)/.test(tstack[ti])){tsl=tstack[ti];break}}
    bt.appendChild(bankImg(tsl,''));
    bt.addEventListener('click',function(){openPiece(cc,k,lastIncludedSet)});
    th.appendChild(bt)});
  document.getElementById('pieceName').textContent=P.n;
  var pp=document.getElementById('piecePrice');if(pp&&PRICEK[k])pp.innerHTML=fmtP(PRICEK[k])+'<span class="vat">Incl. 25% VAT</span>';
  var pd=document.getElementById('pieceDesc');if(pd)pd.textContent=DESCR[k]||'';
  var pcb=document.getElementById('pieceCareBody'),pce=document.getElementById('pieceCare');
  if(pcb&&pce){var cd=CARE[k];
    if(cd){pce.style.display='';var h='';
      cd.comp.forEach(function(x){h+='<h5>'+x[0]+'</h5><p>'+x[1]+'</p>'});
      h+='<h5>Care</h5>';cd.care.forEach(function(x){h+='<p>'+x+'</p>'});
      pcb.innerHTML=h;pce.removeAttribute('open')}
    else pce.style.display='none'}
  document.getElementById('pieceColour').textContent=PIECES[c].name;
  var stackBox=document.getElementById('psStack');stackBox.innerHTML='';
  pdpShots(c,k).forEach(function(sl){var fr=document.createElement('div');
    fr.className='pframe tile'+(sl.indexOf('zoom_')===0?' det':'');
    fr.appendChild(bankImg(sl, sl.indexOf('zoom_')===0?'dimg':(sl.indexOf('lining_')===0?'gimg cover':(/^(belt_|shoulder_)/.test(sl)?'gimg det':'gimg'))));
    stackBox.appendChild(fr)});
  stackBox.scrollLeft=0;if(stackBox.__upd)setTimeout(stackBox.__upd,60);

  renderCTL(c,k);
  if(document.querySelector('.view[data-view="piece"]').hidden)showView('piece');
  else document.querySelector('.view[data-view="piece"]').scrollIntoView({behavior:'smooth',block:'start'});
}
var COLS=['tar','moss','sand'];
function nextCol(c,step){return COLS[(COLS.indexOf(c)+step)%3]}
function renderCTL(c,k){
  var row=document.getElementById('ctlRow');row.innerHTML='';
  var garments=['tailcoat','corset','cargo'].filter(function(x){return x!==k});
  var items=[];
  garments.forEach(function(g){var cc=c;
    if(!PIECES[cc][g]||!PIECES[cc][g].stack.length){for(var s=1;s<3;s++){var alt=nextCol(c,s);
      if(PIECES[alt][g]&&PIECES[alt][g].stack.length){cc=alt;break}}}
    if(!PIECES[cc][g]||!PIECES[cc][g].stack.length)return;
    items.push({img:prodSlug(PIECES[cc][g].stack),name:PIECES[cc][g].n,col:PIECES[cc].name,go:function(){openPiece(cc,g)}})});
  items.forEach(function(it){
    var b=document.createElement('button');b.className='ctlc';b.type='button';
    var sp=document.createElement('span');sp.className='tile';sp.appendChild(bankImg(it.img,'gimg'));
    var pc=document.createElement('span');pc.className='pcap';pc.innerHTML='<span>'+it.name+'</span><span>'+fmtP(PRICE[it.name]||750)+'</span>';sp.appendChild(pc);
    var nm=document.createElement('span');nm.className='nm';nm.textContent=it.name;
    var cl=document.createElement('span');cl.className='cl';cl.textContent=it.col;
    b.appendChild(sp);b.appendChild(nm);b.appendChild(cl);
    b.addEventListener('click',it.go);
    row.appendChild(b)});
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-piece-link]');if(!b)return;e.preventDefault();e.stopPropagation();
  var parts=b.getAttribute('data-piece-link').split(':');
  var piece=PIECES[parts[0]]&&PIECES[parts[0]][parts[1]];
  if(piece&&piece.stack.length){openPiece(parts[0],parts[1]);return}
  if(piece){var item={p:piece.n,c:PIECES[parts[0]].name,z:'One size'};var bag=bagData();bag.push(item);bagSave(bag);bagToast(item)}});
document.getElementById('pieceBack').addEventListener('click',function(e){e.preventDefault();goBack()});
document.getElementById('pieceOrder').addEventListener('click',function(){
  var item={p:PIECES[lastColour][lastKey].n,c:PIECES[lastColour].name,z:null};
  if(lastIncludedSet)item.includedSet=lastIncludedSet;
  if(lastKey==='belt'){
    if(!lastCoat()){bagToast(null,'Belt & epaulettes are available with a Jacket or Tailcoat');return}
    item.extra=true}
  openQuickSize(item)});

/* pills generic */
document.querySelectorAll('.pills').forEach(function(g){g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
  g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})})})});

/* shared service overlays */
var scrim=document.getElementById('scrim');
var sizeg=document.getElementById('sizeg');
function openSizeg(){sizeg.classList.add('open');scrim.classList.add('open');focusInto(sizeg,'.sg-x')}
function closeSizeg(){if(sizeg.classList.contains('open'))focusBack(sizeg);sizeg.classList.remove('open');scrim.classList.remove('open')}
document.querySelectorAll('[data-open-sizeg]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openSizeg()})});
document.getElementById('sizegX').onclick=closeSizeg;
sizeg.addEventListener('click',function(e){if(e.target===sizeg)closeSizeg()});
scrim.addEventListener('click',function(){closeFilm();closeCcg();closeSizeg()});
addEventListener('keydown',function(e){if(e.key==='Escape'){closeFilm();closeCcg();closeSizeg();closeQuickSize();menu.classList.remove('open')}});

/* concierge */
var ccg=document.getElementById('ccg'),ccgBtn=document.getElementById('ccgBtn');
function openCcg(){ccg.classList.add('open');ccgBtn.setAttribute('aria-expanded','true')}
function closeCcg(){ccg.classList.remove('open');ccgBtn.setAttribute('aria-expanded','false')}
ccgBtn.onclick=function(){ccg.classList.contains('open')?closeCcg():openCcg()};
document.getElementById('ccgX').onclick=closeCcg;
document.querySelectorAll('[data-open-ccg]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();if(typeof closeSizeg==='function')closeSizeg();openCcg()})});

/* account — LV-style email-first sign in, no password */
var acct=document.getElementById('acct'),acctCard=document.getElementById('acctCard');
var acctEmailForm=document.getElementById('acctEmailForm'),acctForm=document.getElementById('acctForm');
function acctData(){try{return JSON.parse(localStorage.getItem('kc_account')||'null')}catch(e){return null}}
function acctStep(st){acctCard.setAttribute('data-step',st);
  var t=document.getElementById('acctTitle'),sub=document.getElementById('acctSub');
  if(st==='email'){t.textContent='Sign in';sub.textContent='Enter your email to continue \u2014 no password needed.'}
  if(st==='details'){t.textContent='Almost there';sub.textContent='Tell us where to reach you \u2014 saved for every future order.'}
  if(st==='done'){t.textContent='';sub.textContent='You are signed in on this device.'}}
function acctNav(){var d=acctData();var l1=document.getElementById('acctLink'),l2=document.getElementById('acctLinkM');
  var label=(d&&d.name)?d.name.split(' ')[0]:'Sign in';
  if(l1){l1.setAttribute('aria-label',label);l1.setAttribute('title',label)}
  if(l2)l2.textContent=label}
function acctShowDone(){var d=acctData();if(!d)return acctStep('email');
  document.getElementById('acctHi').textContent='Welcome, '+d.name.split(' ')[0];
  document.getElementById('acctSummary').textContent=d.email+' \u00b7 '+d.phone+' \u00b7 '+d.address;
  var saved=document.getElementById('acctSavedCount');if(saved)saved.textContent=wlData().length;
  var composition=null;try{composition=JSON.parse(localStorage.getItem('kc_composition')||'null')}catch(e){}
  var compEl=document.getElementById('acctComposition');if(compEl)compEl.textContent=composition?composition.summary:'None yet';
  var sizes=document.getElementById('acctSizes');if(sizes&&composition&&composition.items){var labels=[];composition.items.forEach(function(item){if(labels.indexOf(item.z)<0)labels.push(item.z)});sizes.textContent=labels.join(' \u00b7 ')}
  var orders=orderData(),ordersEl=document.getElementById('acctOrders');if(ordersEl)ordersEl.textContent=orders.length?(orders.length+' order'+(orders.length===1?'':'s')+' \u00b7 '+orders[0].reference):'No orders yet';
  acctStep('done');
  if(window.__payPending){window.__payPending=false;acctClose();openBag();
    bagToast(null,'Delivery details saved \u2014 confirm your order')}}
function acctOpen(e){if(e)e.preventDefault();
  var d=acctData();
  if(d&&d.name){acctShowDone()}else{acctStep('email');if(d&&d.email)acctEmailForm.elements.email.value=d.email}
  acct.classList.add('open');document.body.style.overflow='hidden'}
function acctClose(){acct.classList.remove('open');document.body.style.overflow=''}
document.getElementById('acctLink').addEventListener('click',acctOpen);
var alm=document.getElementById('acctLinkM');if(alm)alm.addEventListener('click',function(e){acctOpen(e);document.getElementById('menu').classList.remove('open')});
document.getElementById('acctX').addEventListener('click',acctClose);
acct.addEventListener('click',function(e){if(e.target===acct)acctClose()});
acctEmailForm.addEventListener('submit',function(e){e.preventDefault();
  var em=acctEmailForm.elements.email.value.trim();var d=acctData();
  if(d&&d.name&&d.email===em){acctShowDone()}
  else{try{localStorage.setItem('kc_account',JSON.stringify({email:em}))}catch(err){}
    if(d&&d.name){['name','phone','address'].forEach(function(k){acctForm.elements[k].value=d[k]||''})}
    acctStep('details')}});
acctForm.addEventListener('submit',function(e){e.preventDefault();
  var d=acctData()||{};['name','phone','address'].forEach(function(k){d[k]=acctForm.elements[k].value.trim()});
  try{localStorage.setItem('kc_account',JSON.stringify(d))}catch(err){}
  acctNav();acctShowDone()});
document.getElementById('acctEdit').addEventListener('click',function(){var d=acctData()||{};
  ['name','phone','address'].forEach(function(k){acctForm.elements[k].value=d[k]||''});
  acctStep('details')});
document.getElementById('acctOut').addEventListener('click',function(){try{localStorage.removeItem('kc_account')}catch(err){}
  acctEmailForm.reset();acctForm.reset();acctNav();acctStep('email')});
document.getElementById('acctSaved').addEventListener('click',function(){acctClose();wlOpen()});
document.querySelectorAll('[data-account-concierge]').forEach(function(button){button.addEventListener('click',function(){acctClose();openCcg()})});
var confirmConcierge=document.querySelector('[data-confirm-concierge]');if(confirmConcierge)confirmConcierge.addEventListener('click',function(){closeBag();openCcg()});
acctNav();

/* films */
var film=document.getElementById('film');
var FT={kur:'The Kür',conn:'The Connection'};
document.querySelectorAll('[data-film]').forEach(function(c){c.addEventListener('click',function(){
  document.getElementById('filmImg').src=c.querySelector('img').src;
  document.getElementById('filmT').textContent=FT[c.dataset.film];
  film.classList.add('open');document.body.style.overflow='hidden'})});
function closeFilm(){film.classList.remove('open');document.body.style.overflow=''}
document.getElementById('filmX').onclick=closeFilm;
film.addEventListener('click',function(e){if(e.target===film)closeFilm()});

/* init that depends on PIECES */
document.querySelectorAll('.tiles[data-compose]').forEach(buildComposeBox);
document.querySelectorAll('a.vback').forEach(function(bk){
  bk.textContent='Back';
  var row=document.createElement('div');row.className='navrow';
  bk.parentNode.insertBefore(row,bk);row.appendChild(bk);
  var hm=document.createElement('a');hm.href='#';hm.className='back vhome';hm.textContent='Home';
  hm.setAttribute('data-nav','home');row.appendChild(hm)});
var nf=document.getElementById('newsForm');
if(nf)nf.addEventListener('submit',function(e){e.preventDefault();nf.hidden=true;document.getElementById('newsOk').hidden=false});
if(window.__composerInit)window.__composerInit();

/* boot to the view named in the URL, so reload and shared links land right */
(function(){var v=location.hash.slice(1);
  if(['about','atelier','services','delivery','looks','composer'].indexOf(v)<0)return;
  if(window.__histOn){try{history.replaceState({v:v},'','#'+v)}catch(e){}}
  NAVSTACK.push(v);__showViewRaw(v)})();
})();
