(function(){
  var car=document.getElementById('car-wrap');
  var slides=[].slice.call(car.querySelectorAll('.car-slide'));
  var thumbs=[].slice.call(car.querySelectorAll('.car-thumbs button'));
  var count=document.getElementById('car-count'), prog=document.getElementById('car-prog');
  var live=document.getElementById('car-live'), pp=document.getElementById('car-pp');
  var ul=car.querySelector('.car-thumbs'), hl=document.getElementById('car-hl'), lis=thumbs.map(function(b){return b.parentNode;});
  var DUR=7000, i=0, t=null, playing=false, hold=false;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(n,speak){
    i=(n+slides.length)%slides.length;
    slides.forEach(function(s,k){
      var on=k===i; s.classList.toggle('on',on);
      s.setAttribute('aria-hidden',on?'false':'true');
      [].forEach.call(s.querySelectorAll('a'),function(a){a.tabIndex=on?0:-1;});
    });
    thumbs.forEach(function(b,k){ if(k===i) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current'); });
    lis.forEach(function(l){l.classList.remove('hot');}); lis[i].classList.add('hot'); moveHl(lis[i]);
    count.textContent=(i+1)+' / '+slides.length;
    if(speak){ live.textContent=slides[i].querySelector('h3').textContent+', '+(i+1)+' of '+slides.length; }
    restart();
  }
  function moveHl(li){
    if(!hl||!li) return;
    hl.style.width=li.offsetWidth+'px'; hl.style.height=li.offsetHeight+'px';
    hl.style.transform='translate('+li.offsetLeft+'px,'+li.offsetTop+'px)';
    hl.style.setProperty('--c',li.style.getPropertyValue('--c')||'#fff'); hl.classList.add('on');
  }
  function hot(li){ lis.forEach(function(l){l.classList.toggle('hot',l===li);}); moveHl(li); }
  lis.forEach(function(li){
    li.addEventListener('mouseenter',function(){hot(li);});
    li.firstChild.addEventListener('focus',function(){hot(li);});
  });
  ul.addEventListener('mouseleave',function(){hot(lis[i]);});
  ul.addEventListener('focusout',function(e){ if(!ul.contains(e.relatedTarget)) hot(lis[i]); });
  addEventListener('resize',function(){moveHl(lis[i]);});
  addEventListener('load',function(){moveHl(lis[i]);});
  function restart(){
    clearTimeout(t); prog.classList.remove('run'); void prog.offsetWidth;
    if(playing && !hold && !reduce){
      prog.style.setProperty('--dur',DUR+'ms'); prog.classList.add('run');
      t=setTimeout(function(){show(i+1,false);},DUR);
    }
  }
  function setPlaying(p){
    playing=p;
    pp.textContent=p?'Pause':'Play';
    pp.setAttribute('aria-label',p?'Pause automatic slide show':'Start automatic slide show');
    live.setAttribute('aria-live',p?'off':'polite');
    restart();
  }
  document.getElementById('car-next').onclick=function(){show(i+1,true);};
  document.getElementById('car-prev').onclick=function(){show(i-1,true);};
  pp.onclick=function(){setPlaying(!playing);};
  thumbs.forEach(function(b,k){b.onclick=function(){show(k,true);};});
  car.addEventListener('mouseenter',function(){hold=true;restart();});
  car.addEventListener('mouseleave',function(){hold=false;restart();});
  car.addEventListener('focusin',function(){hold=true;restart();});
  car.addEventListener('focusout',function(){hold=false;restart();});
  car.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){show(i+1,true);}
    else if(e.key==='ArrowLeft'){show(i-1,true);}
  });
  show(0,false);
  setPlaying(!reduce);
})();
