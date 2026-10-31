(function(){
  var root=document.documentElement, el=document.getElementById('intro');
  if(!el||!root.classList.contains('intro-on')) return;
  try{sessionStorage.setItem('iris-intro','1');}catch(e){}
  function done(){ root.classList.remove('intro-on'); removeEventListener('keydown',done); removeEventListener('pointerdown',done); }
  el.addEventListener('animationend',function(e){ if(e.target===el) done(); });
  addEventListener('keydown',done); addEventListener('pointerdown',done);
  setTimeout(done,4200);
})();
