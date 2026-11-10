
/* Open lightbox when clicking on meme links */



(function () {
  var links = document.querySelectorAll('a.meme-link');
  if (!links.length || !window.HTMLDialogElement) return; // no JS or old browser: the link just opens the image

  var box = document.createElement('dialog');
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML = '<button type="button" class="lb-close" aria-label="Close image">&times;</button><img alt="">';
  document.body.appendChild(box);

  var big = box.querySelector('img');
  var opener = null;

  links.forEach(function (a) {
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let "open in new tab" work
      e.preventDefault();
      opener = a;
      var thumb = a.querySelector('img');
      big.src = a.getAttribute('href');
      big.alt = a.getAttribute('data-alt') || (thumb ? thumb.alt : a.textContent.trim());
      box.showModal();
    });
  });

  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); }); // click outside the picture
  box.addEventListener('close', function () { big.removeAttribute('src'); if (opener) opener.focus(); });
})();


