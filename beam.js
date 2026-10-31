(function(){

  var sec=document.querySelector('.beam'); if(!sec) return;
  var SHOTS=(sec.getAttribute('data-shots')||'').split(',').filter(Boolean), ROOT=sec.getAttribute('data-root')||'';
  var CODE=[
"<b>add_action</b>( <u>'template_redirect'</u>, function () {",
"    <b>ob_start</b>( <u>'vista_fix_markup'</u> );",
"}, <i>-9999</i> );",
"",
"<b>function</b> vista_fix_markup( $html ) {",
"    <i>// one H1 per page, please</i>",
"    $html = <b>preg_replace</b>(",
"        <u>'/&lt;h1/'</u>, <u>'&lt;h2'</u>, $html, <i>-1</i>",
"    );",
"    <b>return</b> $html;",
"}",
"",
".car-panel { <i>background</i>: <u>#16384f</u>;",
"  <i>border-radius</i>: <u>4px 40px 4px 40px</u>; }",
"",
"<b>wp</b> post list --post_type=attachment",
"   --meta_key=_wp_attachment_image_alt",
"",
"<b>UPDATE</b> wp_postmeta <b>SET</b> meta_value = <u>'...'</u>",
"<b>WHERE</b> meta_key = <u>'_wp_attachment_image_alt'</u>;",
"",
"<b>if</b> ( ! <b>is_user_logged_in</b>() ) {",
"    <b>return</b> <i>false</i>;",
"}"
];
  var stage=document.getElementById('beam-stage'), line=document.getElementById('beam-line');
  var cv=document.getElementById('beam-sparks'), ctx=cv.getContext('2d');
  var pp=document.getElementById('beam-pp');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tiles=[], W=0,H=0,beamX=0,tileW=260,gap=44,total=0,speed=38;

  SHOTS.forEach(function(s,k){
    var t=document.createElement('div'); t.className='beam-tile';
    var f=document.createElement('div'); f.className='beam-face';
    f.innerHTML='<img src="'+ROOT+'assets/shots/'+s+'.webp" alt="" loading="lazy">';
    var c=document.createElement('div'); c.className='beam-code';
    var start=(k*5)%CODE.length, lines=[];
    for(var j=0;j<14;j++) lines.push(CODE[(start+j)%CODE.length]);
    c.innerHTML=lines.join('\n');
    t.appendChild(f); t.appendChild(c); stage.insertBefore(t,cv); tiles.push({el:t,face:f,code:c});
  });

  function size(){
    W=stage.clientWidth; H=stage.clientHeight; beamX=Math.round(W*0.42);
    tileW=tiles[0].el.offsetWidth; gap=Math.round(tileW*0.17); total=tiles.length*(tileW+gap);
    line.style.left=beamX+'px';
    cv.width=W; cv.height=H;
  }
  var sparks=[];
  function spawn(){ sparks.push({x:beamX+(Math.random()*40-20),y:30+Math.random()*(H-60),vx:(Math.random()-.6)*0.6,vy:(Math.random()-.5)*0.4,a:1,r:Math.random()*1.4+.4}); }

  var t0=null, off=0, running=false, last=0, visible=true, raf=0;
  function place(){
    tiles.forEach(function(o,k){
      var x=((k*(tileW+gap)-off)%total+total)%total-tileW-gap;
      // x runs from -tileW-gap .. total-tileW-gap; shift so tiles enter from the right edge
      x=x+W*0.1;
      o.el.style.transform='translateX('+x+'px)';
      var left=x, right=x+tileW;
      var showFace=Math.max(0,Math.min(tileW,beamX-left)); // px of tile left of beam
      // face visible to the RIGHT of the beam; code visible to the LEFT of beam
      o.face.style.clipPath='inset(0 0 0 '+showFace+'px)';
      o.code.style.clipPath='inset(0 '+Math.max(0,Math.min(tileW,right-beamX))+'px 0 0)';
    });
  }
  function frame(ts){
    raf=0;
    if(!running||!visible||document.hidden) return;
    if(!last) last=ts; var dt=Math.min(.05,(ts-last)/1000); last=ts;
    off+=speed*dt; place();
    ctx.clearRect(0,0,W,H);
    if(sparks.length<70 && Math.random()<.6) spawn();
    sparks=sparks.filter(function(p){p.x+=p.vx;p.y+=p.vy;p.a-=.008;return p.a>0;});
    sparks.forEach(function(p){ctx.globalAlpha=Math.max(0,p.a)*.8;ctx.fillStyle='#c7b8ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();});
    raf=requestAnimationFrame(frame);
  }
  function kick(){ if(!raf && running && visible) { last=0; raf=requestAnimationFrame(frame);} }
  function setRunning(r){
    running=r; pp.textContent=r?'Pause':'Play';
    pp.setAttribute('aria-label',r?'Pause the animation':'Play the animation');
    if(r) kick();
  }
  pp.onclick=function(){setRunning(!running);};
  new IntersectionObserver(function(e){visible=e[0].isIntersecting;kick();}).observe(stage);
  document.addEventListener('visibilitychange',kick);
  addEventListener('resize',function(){size();place();});
  size(); off=total*0.35; place();
  setRunning(!reduce);
})();
