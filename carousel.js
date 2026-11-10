/* Case-study slider: manual only (no autoplay). Buttons, numbered trail, arrow keys and swipe. */
(function () {
  var car = document.getElementById('car-wrap');
  if (!car) return;
  var stage = car.querySelector('.car-stage');
  var track = car.querySelector('.car-track');
  var slides = [].slice.call(car.querySelectorAll('.car-slide'));
  var dots = [].slice.call(car.querySelectorAll('.car-trail button'));
  var live = document.getElementById('car-live');
  var i = 0;

  function show(n, speak) {
    i = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    slides.forEach(function (s, k) {
      var on = k === i;
      s.classList.toggle('on', on);
      if (on) { s.removeAttribute('inert'); s.removeAttribute('aria-hidden'); }
      else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
      [].forEach.call(s.querySelectorAll('a'), function (a) { a.tabIndex = on ? 0 : -1; });
    });
    dots.forEach(function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    if (speak) live.textContent = slides[i].querySelector('h3').textContent + ', ' + (i + 1) + ' of ' + slides.length;
  }

  document.getElementById('car-next').addEventListener('click', function () { show(i + 1, true); });
  document.getElementById('car-prev').addEventListener('click', function () { show(i - 1, true); });
  dots.forEach(function (b, k) { b.addEventListener('click', function () { show(k, true); }); });
  car.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(i + 1, true);
    else if (e.key === 'ArrowLeft') show(i - 1, true);
  });

  // Swipe on touch screens. Vertical scrolling is left alone (touch-action: pan-y in the CSS).
  var sx = 0, sy = 0, tracking = false;
  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    sx = e.clientX; sy = e.clientY; tracking = true;
  });
  stage.addEventListener('pointerup', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(i + (dx < 0 ? 1 : -1), true);
  });
  stage.addEventListener('pointercancel', function () { tracking = false; });

  show(0, false);
})();
