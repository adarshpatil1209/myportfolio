// cosmic.js — Parallax, scroll animations, canvas cosmos

(function() {
  'use strict';

  // ============================================================
  // COSMOS CANVAS BACKGROUND
  // ============================================================

  const canvas = document.getElementById('cosmos');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function initStars() {
    stars = [];
    const count = Math.floor((window.innerWidth + window.innerHeight) / 8);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function drawStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
      star.alpha += (Math.random() - 0.5) * star.twinkleSpeed;
      star.alpha = Math.max(0.1, Math.min(1, star.alpha));

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 245, 255, ${star.alpha * 0.3})`;
      ctx.arc(star.x, star.y, star.r + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animateCosmos() {
    drawStars();
    requestAnimationFrame(animateCosmos);
  }

  function setupCosmos() {
    resizeCanvas();
    initStars();
    animateCosmos();
    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
    });
  }

  // ============================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function setupScrollReveal() {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.9, 0.2, 1)';
      observer.observe(el);
    });
  }

  // ============================================================
  // PARALLAX SCROLL EFFECT
  // ============================================================

  function setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // ============================================================
  // SMOOTH MOUSE PARALLAX FOR PLANETS
  // ============================================================

  function setupMouseParallax() {
    const planets = document.querySelectorAll('.planet-float');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

      planets.forEach((planet, index) => {
        const offset = (index + 1) * 3;
        planet.style.transform = `translate(${mouseX * offset}px, ${mouseY * offset}px)`;
      });
    });
  }

  // ============================================================
  // FORM SUBMISSION (Demo)
  // ============================================================

  function setupForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out! (This is a demo form)');
      form.reset();
    });
  }

  // ============================================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================================

  function setupActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 100;

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          const section = document.querySelector(href);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
              navLinks.forEach((l) => l.style.color = 'var(--text-secondary)');
              link.style.color = 'var(--accent-cyan)';
            }
          }
        }
      });
    });
  }

  // ============================================================
  // INIT ALL ON DOM READY
  // ============================================================

  document.addEventListener('DOMContentLoaded', () => {
    setupCosmos();
    setupScrollReveal();
    setupParallax();
    setupMouseParallax();
    setupForm();
    setupActiveNav();
  });
})();
