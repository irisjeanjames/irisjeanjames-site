(function () {
  var wall = document.getElementById('wall');
  var filters = document.getElementById('filters');
  var countEl = document.getElementById('count');
  var active = 'all';
  var data;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function render() {
    wall.textContent = '';
    var shown = 0;
    data.sites.forEach(function (s, i) {
      if (active !== 'all' && s.group !== active) return;
      shown++;
      var g = data.groups[s.group];
      var li = el('li');
      var a = el('a', 'tile');
      a.href = 'https://' + s.domain;
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.setProperty('--c', g.color);
      a.setAttribute('aria-label', s.domain + ', ' + g.label + ' (opens in a new tab)');

      var shot = el('span', 'shot');
      var petal = el('span', 'petal' + (g.darkText ? ' dark' : ''));
      petal.style.setProperty('--r', ((i * 47) % 360) + 'deg');
      petal.appendChild(el('span', '', s.domain.charAt(0).toUpperCase()));
      shot.appendChild(petal);

      var img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.width = 960;
      img.height = 720;
      img.style.opacity = '0';
      img.onload = function () { petal.style.display = 'none'; img.style.opacity = '1'; };
      img.onerror = function () { img.remove(); };
      img.src = 'assets/shots/' + s.domain + '.webp';
      shot.appendChild(img);

      var meta = el('span', 'meta');
      meta.appendChild(el('b', '', s.domain));
      var small = el('small');
      small.appendChild(el('i', 'dot'));
      small.appendChild(document.createTextNode(g.label));
      meta.appendChild(small);

      a.appendChild(shot);
      a.appendChild(meta);
      li.appendChild(a);
      wall.appendChild(li);
    });
    countEl.textContent = 'Showing ' + shown + ' of ' + data.sites.length + ' sites';
  }

  function buildFilters() {
    var counts = {};
    data.sites.forEach(function (s) { counts[s.group] = (counts[s.group] || 0) + 1; });
    var items = [['all', 'All sites', '#1a405a', data.sites.length]];
    Object.keys(data.groups).forEach(function (k) {
      items.push([k, data.groups[k].label + (k === 'level1' || k === 'corporate' ? '' : 's'), data.groups[k].color, counts[k]]);
    });
    items.forEach(function (it) {
      var li = el('li');
      var b = el('button', 'chip');
      b.type = 'button';
      b.setAttribute('aria-pressed', it[0] === active ? 'true' : 'false');
      b.style.setProperty('--c', it[2]);
      b.appendChild(el('i', 'dot'));
      b.appendChild(document.createTextNode(it[1] + ' '));
      b.appendChild(el('span', 'n', '(' + it[3] + ')'));
      b.addEventListener('click', function () {
        active = it[0];
        Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function (c) {
          c.setAttribute('aria-pressed', 'false');
        });
        b.setAttribute('aria-pressed', 'true');
        render();
      });
      li.appendChild(b);
      filters.appendChild(li);
    });
  }

  fetch('sites.json').then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    buildFilters();
    render();
    // The wall fills in after the page has already jumped to a #section, which pushes
    // that section down. Jump again once the wall has its height.
    if (location.hash.length > 1) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) requestAnimationFrame(function () { t.scrollIntoView(); });
    }
  }).catch(function () {
    countEl.textContent = 'The site list could not load. Reload the page to try again.';
  });

  var pupil = document.getElementById('pupil');
  var hero = document.querySelector('.hero');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (pupil && hero && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = pupil.ownerSVGElement.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      var dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      pupil.style.transform = 'translate(' + (dx * 34).toFixed(1) + 'px,' + (dy * 34).toFixed(1) + 'px)';
    });
    hero.addEventListener('pointerleave', function () { pupil.style.transform = 'none'; });
  }
})();
