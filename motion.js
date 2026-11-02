/* Gentle motion for the case-study illustrations.
   Adds a Pause/Play button and turns the animation on. Does nothing when the
   visitor prefers reduced motion, and if this file is missing the illustrations
   simply stay still. */
(function () {
  var figs = document.querySelectorAll('[data-motion]');
  if (!figs.length) return;
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;
  for (var i = 0; i < figs.length; i++) {
    (function (f) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pausebtn';
      b.setAttribute('aria-pressed', 'false');
      b.textContent = 'Pause animation';
      b.addEventListener('click', function () {
        var paused = f.classList.toggle('paused');
        b.setAttribute('aria-pressed', paused ? 'true' : 'false');
        b.textContent = paused ? 'Play animation' : 'Pause animation';
      });
      f.appendChild(b);
      f.classList.add('anim');
    })(figs[i]);
  }
})();
