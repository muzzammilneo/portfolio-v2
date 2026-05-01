/* ═══════════════════════════════════════════
   PORTFOLIO — INTERACTIONS & ANIMATIONS
   ═══════════════════════════════════════════ */

(() => {
  'use strict';

  // ─── Custom Cursor ─────────────────────────
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Ring follows with smooth lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .image-frame');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  // ─── Counter Animation ─────────────────────
  function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
      const target = parseInt(el.closest('.stat-number').dataset.target);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Start counters after a delay to sync with entrance animation
  setTimeout(animateCounters, 800);

  // ─── Scroll Effects ────────────────────────
  const scrollIndicator = document.getElementById('scrollIndicator');
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Fade out scroll indicator
    if (scrollIndicator) {
      const opacity = Math.max(0, 1 - scrollY / 200);
      scrollIndicator.style.opacity = opacity;
    }

    // Navbar hide/show on scroll direction
    if (scrollY > 100) {
      if (scrollY > lastScroll) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = scrollY;
  }, { passive: true });

  // ─── Parallax on Abstract Shapes ──────────
  const shapes = document.querySelectorAll('.shape');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 3;
      const offsetX = x * speed;
      const offsetY = y * speed;

      shape.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  }, { passive: true });

  // ─── Magnetic Button Effect ────────────────
  const bookCallBtn = document.getElementById('bookCall');

  if (bookCallBtn) {
    bookCallBtn.addEventListener('mousemove', (e) => {
      const rect = bookCallBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      bookCallBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    bookCallBtn.addEventListener('mouseleave', () => {
      bookCallBtn.style.transform = 'translate(0, 0)';
      bookCallBtn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    bookCallBtn.addEventListener('mouseenter', () => {
      bookCallBtn.style.transition = 'none';
    });
  }

  // ─── Image Tilt Effect ─────────────────────
  const imageFrame = document.querySelector('.image-frame');

  if (imageFrame) {
    imageFrame.addEventListener('mousemove', (e) => {
      const rect = imageFrame.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;

      imageFrame.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
      imageFrame.style.transition = 'none';
    });

    imageFrame.addEventListener('mouseleave', () => {
      imageFrame.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      imageFrame.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  // ─── Smooth Scroll for Nav Links ───────────
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ─── Logo Click → Scroll to Top ───────────
  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
