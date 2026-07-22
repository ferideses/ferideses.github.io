(function () {
  'use strict';

  // header: border appears once scrolled
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '\u2715' : '\u2630';
    });
    // close menu when a link inside is activated
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '\u2630';
      }
    });
  }

  document.querySelectorAll('.submenu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item = btn.closest('.nav-item');
      var expanded = item.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  });

  // section reveal on scroll (skipped under prefers-reduced-motion via CSS)
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // home hero video overlay
  var overlay = document.querySelector('.video-overlay');
  var heroVideo = document.getElementById('hero-video');
  if (overlay && heroVideo) {
    overlay.addEventListener('click', function () {
      overlay.classList.add('hidden');
      heroVideo.setAttribute('controls', '');
      heroVideo.play();
    });
  }

  // lightbox
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbImg = lb.querySelector('img');
  var lbTitle = lb.querySelector('.lb-text h3');
  var lbDesc = lb.querySelector('.lb-text p');
  var lastFocus = null;

  function openLightbox(src, title, desc) {
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = title || '';
    lbTitle.textContent = title || '';
    lbDesc.innerHTML = desc || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-close')) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lb.hidden) closeLightbox();
  });

  document.querySelectorAll('.gallery-item').forEach(function (fig) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    var activate = function () {
      openLightbox(fig.querySelector('img').src, fig.dataset.title, fig.dataset.desc);
    };
    fig.addEventListener('click', activate);
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  document.querySelectorAll('img[data-lightbox]').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.src, img.alt, '');
    });
  });
})();
