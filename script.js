/* ═══════════════════════════════════════════
   PORTFOLIO — SCROLL-DRIVEN STORYTELLING
   INTERACTIONS & ANIMATIONS
   ═══════════════════════════════════════════ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Utility ────────────────────────────────
  function raf(fn) {
    let ticking = false;
    return function (...args) {
      if (!ticking) {
        requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
        ticking = true;
      }
    };
  }

  // ─── Custom Cursor ───────────────────────────
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top  = `${ringY}px`;
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .image-frame, .project-card, .skill-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  // ─── Counter Animation ───────────────────────
  function animateCounters() {
    document.querySelectorAll('.stat-value').forEach(el => {
      const target   = parseInt(el.closest('.stat-number').dataset.target);
      const duration = 2000;
      const start    = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }
  setTimeout(animateCounters, 800);

  // ─── Scroll Progress Bar ─────────────────────
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    if (!progressBar) return;
    const docH = document.body.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }

  // ─── Hero Parallax / Fade on Scroll ─────────
  const heroLeft  = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  const heroSection = document.getElementById('hero');

  function updateHeroParallax() {
    if (!heroLeft || !heroRight || !heroSection) return;
    const scrollY  = window.scrollY;
    const heroH    = heroSection.offsetHeight;
    const progress = Math.min(scrollY / heroH, 1); // 0 → 1 as user scrolls through hero

    if (!prefersReduced) {
      // Fade + slight upward float
      const opacity = 1 - progress * 1.4;
      const translateY = progress * -40;
      heroLeft.style.opacity  = Math.max(opacity, 0);
      heroLeft.style.transform = `translateY(${translateY}px)`;
      // Image drifts slightly faster
      heroRight.style.opacity  = Math.max(1 - progress * 1.6, 0);
      heroRight.style.transform = `translateY(${translateY * 0.6}px)`;
    }
  }

  // ─── Abstract Shape Parallax ─────────────────
  const shapes = document.querySelectorAll('.shape');

  function updateShapeParallax() {
    if (prefersReduced) return;
    const y = window.scrollY;
    shapes.forEach((s, i) => {
      const speed = (i % 3 + 1) * 0.06;
      s.style.transform = `translateY(${y * speed}px)`;
    });
  }

  // ─── Navbar Hide/Show + Active Link ──────────
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');
  let lastScroll = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Hide/show on scroll direction
    if (scrollY > 100) {
      navbar.style.transform = scrollY > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = scrollY;

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  // ─── Scroll Indicator Fade ────────────────────
  const scrollIndicator = document.getElementById('scrollIndicator');
  function updateScrollIndicator() {
    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 200);
    }
  }

  // ─── Master Scroll Handler ────────────────────
  window.addEventListener('scroll', raf(() => {
    updateProgress();
    updateHeroParallax();
    updateShapeParallax();
    updateNavbar();
    updateScrollIndicator();
    revealFooter();
  }), { passive: true });

  // ─── IntersectionObserver — Scroll Reveals ────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.scroll-item').forEach(el => revealObserver.observe(el));

  // ─── Footer Reveal ────────────────────────────
  const footer = document.getElementById('footer');
  function revealFooter() {
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      footer.classList.add('revealed');
    }
  }

  // ─── Smooth Scroll for Nav Links ─────────────
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Logo → top
  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Magnetic Book A Call ─────────────────────
  const bookCallBtn = document.getElementById('bookCall');
  if (bookCallBtn) {
    bookCallBtn.addEventListener('mousemove', (e) => {
      const r = bookCallBtn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      bookCallBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    bookCallBtn.addEventListener('mouseleave', () => {
      bookCallBtn.style.transform   = 'translate(0, 0)';
      bookCallBtn.style.transition  = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    bookCallBtn.addEventListener('mouseenter', () => {
      bookCallBtn.style.transition = 'none';
    });
  }

  // ─── Image Tilt Effect ────────────────────────
  const imageFrame = document.querySelector('.image-frame');
  if (imageFrame) {
    imageFrame.addEventListener('mousemove', (e) => {
      const r = imageFrame.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
      imageFrame.style.transform  = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
      imageFrame.style.transition = 'none';
    });
    imageFrame.addEventListener('mouseleave', () => {
      imageFrame.style.transform  = 'perspective(800px) rotateY(0) rotateX(0)';
      imageFrame.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  // ─── Project Card 3D Tilt ─────────────────────
  if (!prefersReduced) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width  - 0.5;   // -0.5 → 0.5
        const y  = (e.clientY - r.top)  / r.height - 0.5;
        const cx = -(y * 8).toFixed(2);   // rotateX
        const cy =  (x * 8).toFixed(2);   // rotateY
        card.style.setProperty('--cx', `${cx}deg`);
        card.style.setProperty('--cy', `${cy}deg`);
        card.classList.add('tilting');
        card.classList.remove('tilt-reset');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--cx', '0deg');
        card.style.setProperty('--cy', '0deg');
        card.classList.remove('tilting');
        card.classList.add('tilt-reset');
        setTimeout(() => card.classList.remove('tilt-reset'), 600);
      });

      // Ripple on click
      card.addEventListener('click', (e) => {
        const r      = card.getBoundingClientRect();
        const size   = Math.max(r.width, r.height) * 1.5;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.cssText = `
          width: ${size}px; height: ${size}px;
          left: ${e.clientX - r.left - size / 2}px;
          top:  ${e.clientY - r.top  - size / 2}px;
        `;
        card.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  // ─── Mouse Parallax on Abstract Shapes ────────
  // (kept only for mouse movement, scroll parallax handled above)
  window.addEventListener('mousemove', raf((e) => {
    if (prefersReduced) return;
    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 2.5;
      // Only apply mouse parallax when not also applying scroll parallax (near top)
      if (window.scrollY < 100) {
        shape.style.transform = `translate(${cx * speed}px, ${cy * speed}px)`;
      }
    });
  }), { passive: true });

  // ─── Initial Trigger ─────────────────────────
  updateProgress();

})();
