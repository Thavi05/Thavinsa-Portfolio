// ============================================================
//  PARTICLE CANVAS — Hero background animation
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, canvas.width),
      y: randomBetween(0, canvas.height),
      radius: randomBetween(0.8, 2.2),
      opacity: randomBetween(0.05, 0.35),
      speedX: randomBetween(-0.18, 0.18),
      speedY: randomBetween(-0.12, -0.28),
      pulse: randomBetween(0, Math.PI * 2),
      pulseSpeed: randomBetween(0.008, 0.022),
    };
  }

  function initParticlePool() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
    particles = Array.from({ length: count }, createParticle);
  }

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();

    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const pulsedOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${pulsedOpacity})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    });

    raf = requestAnimationFrame(animate);
  }

  resize();
  initParticlePool();
  animate();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    initParticlePool();
    animate();
  });
})();

// ============================================================
//  NAVBAR — scroll behavior & mobile toggle
// ============================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
//  SCROLL REVEAL — IntersectionObserver for .reveal elements
// ============================================================
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent for visual flow
        const siblings = Array.from(entry.target.parentElement.children).filter(el => el.classList.contains('reveal'));
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 320);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  items.forEach(el => observer.observe(el));
})();

// ============================================================
//  ACTIVE NAV LINK — highlight based on current section
// ============================================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
})();

// ============================================================
//  CONTACT FORM — simple validation + success state
// ============================================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/>
      </svg>
      Sending...
    `;

    // Simulate sending (replace with real API call)
    setTimeout(() => {
      form.reset();
      successMsg.classList.add('visible');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Message
      `;
      setTimeout(() => successMsg.classList.remove('visible'), 5000);
    }, 1500);
  });
})();

// ============================================================
//  SMOOTH SCROLL for CTA anchor buttons
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
//  CSS spin keyframe (for submit button loading)
// ============================================================
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-link.active { color: #38bdf8 !important; }
  .nav-link.active::after { width: 100% !important; }
`;
document.head.appendChild(styleEl);
