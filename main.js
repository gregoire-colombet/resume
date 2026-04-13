/**
 * main.js — Grégoire Colombet Portfolio
 * Depends on DOM IDs: #cursor, #cursor-ring, #timelineProgress
 * Depends on CSS classes: .reveal, .timeline-item, .skill-group,
 *                         .skill-item, .skill-bar-fill, .hero-content
 *                         .nav-toggle, .nav-links
 *
 * Execution: deferred via <script defer src="main.js">
 * All selectors resolve after full DOM parse.
 */
(function () {
  'use strict';

  /* ── 1. Custom cursor ───────────────────────────────────────────── */
  var cursorDot  = document.getElementById('cursor');
  var cursorRing = document.getElementById('cursor-ring');
  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  });

  function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (cursorDot)  { cursorDot.style.left  = mx + 'px'; cursorDot.style.top  = my + 'px'; }
    if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  /* ── 2. Hamburger menu toggle ───────────────────────────────────── */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
    });

    /* Close menu when any nav link is tapped */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  /* ── 3. Scroll-reveal for .reveal and .timeline-item ───────────── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .timeline-item').forEach(function (el) {
    revealObs.observe(el);
  });

  /* ── 4. Skill bar animation ─────────────────────────────────────── */
  /**
   * getW — reads the CSS custom property --w from a .skill-bar-fill element.
   * getComputedStyle can return '' for inline custom props in some browsers,
   * so we fall back to reading el.style directly via getPropertyValue.
   * @param {HTMLElement} fillEl
   * @returns {number} float between 0 and 1
   */
  function getW(fillEl) {
    var fromInline = fillEl.style.getPropertyValue('--w');
    if (fromInline !== '') return parseFloat(fromInline) || 0;
    var fromComputed = getComputedStyle(fillEl).getPropertyValue('--w').trim();
    return fromComputed !== '' ? parseFloat(fromComputed) : 1;
  }

  var skillObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-item').forEach(function (item, i) {
        setTimeout(function () {
          item.classList.add('animated');
          var fill = item.querySelector('.skill-bar-fill');
          if (fill) {
            fill.style.transform = 'scaleX(' + getW(fill) + ')';
          }
        }, i * 110);
      });
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skill-group').forEach(function (g) {
    skillObs.observe(g);
  });

  /* ── 5. Timeline progress bar ───────────────────────────────────── */
  var timelineWrap = document.querySelector('.timeline-wrap');
  var progressBar  = document.getElementById('timelineProgress');

  function updateProgress() {
    if (!timelineWrap || !progressBar) return;
    var rect    = timelineWrap.getBoundingClientRect();
    var visible = Math.max(0, Math.min(window.innerHeight - rect.top, rect.height));
    var pct     = Math.min(100, (visible / rect.height) * 100);
    progressBar.style.height = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ── 6. Hero staggered entrance animation ───────────────────────── */
  /**
   * Each direct child of .hero-content starts invisible and slides up,
   * with a staggered delay based on its index.
   * Double rAF ensures the initial opacity:0 is painted before the
   * transition begins, preventing a flash-of-content on fast GPUs.
   */
  document.querySelectorAll('.hero-content > *').forEach(function (el, i) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ' + (i * 0.12) + 's ease, '
                        + 'transform 0.7s ' + (i * 0.12) + 's ease';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity   = '1';
        el.style.transform = 'none';
      });
    });
  });

}());
