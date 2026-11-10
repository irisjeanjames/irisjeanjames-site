/* Gentle motion for the case-study illustrations.
   Adds a Pause/Play button and turns the animation on. Does nothing when the
   visitor prefers reduced motion, and if this file is missing the illustrations
   simply stay still. */
(function () {
  var figs = document.querySelectorAll('[data-motion]');
  if (!figs.length) return;
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;
  var PAUSE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z"/></svg>';
  for (var i = 0; i < figs.length; i++) {
    (function (f) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pausebtn';
      b.setAttribute('aria-label', 'Pause animation');
      b.innerHTML = PAUSE;
      b.addEventListener('click', function () {
        var paused = f.classList.toggle('paused');
        b.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
        b.innerHTML = paused ? PLAY : PAUSE;
      });
      f.appendChild(b);
      f.classList.add('anim');
    })(figs[i]);
  }
})();