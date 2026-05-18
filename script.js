/**
 * Ayman Seddik — Portfolio Scripts
 * Vanilla JavaScript — No frameworks
 */

(function () {
  'use strict';

  /* ==========================================
     DOM Elements
     ========================================== */
  const html = document.documentElement;
  const body = document.body;
  const header = document.getElementById('header');
  const preloader = document.getElementById('preloader');
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgress = document.querySelector('.scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const typingEl = document.getElementById('typing-text');
  const contactForm = document.getElementById('contact-form');
  const particlesCanvas = document.getElementById('particles-canvas');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  const TYPING_PHRASES = [
    'Backend Developer',
    'Java Developer',
    'Spring Boot Developer',
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================
     Utility Functions
     ========================================== */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast ${type}`;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ==========================================
     Preloader
     ========================================== */
  function initPreloader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader?.classList.add('hidden');
        body.classList.remove('no-scroll');
      }, 1800);
    });
    body.classList.add('no-scroll');
  }

  /* ==========================================
     Theme Toggle (Dark / Light)
     ========================================== */
  function initTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  }

  themeToggle?.addEventListener('click', toggleTheme);
  initTheme();

  /* ==========================================
     Sticky Navbar & Scroll Progress
     ========================================== */
  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    if (scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', debounce(handleScroll, 10));
  handleScroll();

  /* ==========================================
     Active Nav Link on Scroll
     ========================================== */
  function setActiveNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', debounce(setActiveNavLink, 50));

  /* ==========================================
     Mobile Navigation
     ========================================== */
  function openMenu() {
    navMenu?.classList.add('show');
    navToggle?.classList.add('active');
    body.classList.add('no-scroll');
  }

  function closeMenu() {
    navMenu?.classList.remove('show');
    navToggle?.classList.remove('active');
    body.classList.remove('no-scroll');
  }

  navToggle?.addEventListener('click', () => {
    if (navMenu?.classList.contains('show')) closeMenu();
    else openMenu();
  });

  navClose?.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ==========================================
     Smooth Scroll for Anchor Links
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ==========================================
     Typing Animation (Hero)
     ========================================== */
  function initTyping() {
    if (!typingEl || prefersReducedMotion) {
      if (typingEl) typingEl.textContent = TYPING_PHRASES[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = TYPING_PHRASES[phraseIndex];

      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    type();
  }

  /* ==========================================
     Intersection Observer — Scroll Reveal
     ========================================== */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), parseInt(delay, 10));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ==========================================
     Animated Counters (About Stats)
     ========================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.target, 10);
              const duration = 2000;
              const start = performance.now();

              function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target;
              }

              if (prefersReducedMotion) {
                counter.textContent = target;
              } else {
                requestAnimationFrame(update);
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);
  }

  /* ==========================================
     Skill Progress Bars
     ========================================== */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar span');
    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !animated) {
          animated = true;
          bars.forEach((bar) => {
            const progress = bar.dataset.progress || 0;
            if (prefersReducedMotion) {
              bar.style.width = `${progress}%`;
            } else {
              setTimeout(() => {
                bar.style.width = `${progress}%`;
              }, 100);
            }
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) observer.observe(skillsGrid);
  }

  /* ==========================================
     Skills Filter Tabs
     ========================================== */
  function initSkillsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        skillCards.forEach((card) => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = '';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ==========================================
     Projects Filter
     ========================================== */
  function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.projectFilter;

        projectCards.forEach((card) => {
          const tags = card.dataset.tags || '';
          if (filter === 'all' || tags.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ==========================================
     Testimonial Slider
     ========================================== */
  function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    let current = 0;
    let autoplayTimer;

    if (!slides.length) return;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer?.appendChild(dot);
    });

    const dots = dotsContainer?.querySelectorAll('.testimonial-dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots?.[current]?.classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      dots?.[current]?.classList.add('active');
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(next, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    prevBtn?.addEventListener('click', () => {
      prev();
      resetAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      next();
      resetAutoplay();
    });

    startAutoplay();
  }

  /* ==========================================
     Button Ripple Effect
     ========================================== */
  function initRipple() {
    document.querySelectorAll('.btn-ripple').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ==========================================
     Project Card Tilt Effect
     ========================================== */
  function initTilt() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================
     Custom Cursor
     ========================================== */
  function initCustomCursor() {
    if (!cursorDot || !cursorOutline || window.innerWidth < 1024 || prefersReducedMotion) return;

    body.classList.add('custom-cursor');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    const interactive = 'a, button, .btn, .social-link, .skill-card, .project-card, .nav-link, .filter-btn';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  /* ==========================================
     Particle Background (Canvas)
     ========================================== */
  function initParticles() {
    if (!particlesCanvas || prefersReducedMotion) return;

    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(window.innerWidth / 15), 80);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particlesCanvas.width,
          y: Math.random() * particlesCanvas.height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      const isDark = html.getAttribute('data-theme') === 'dark';
      const color = isDark ? '56, 189, 248' : '99, 102, 241';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', debounce(() => {
      resize();
      createParticles();
    }, 250));

    themeToggle?.addEventListener('click', () => {
      /* particles redraw with new color on next frame */
    });
  }

  /* ==========================================
     Parallax Effect (Hero Blobs)
     ========================================== */
  function initParallax() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const blobs = document.querySelectorAll('.blob');
    const heroVisual = document.querySelector('.hero-visual');

    document.addEventListener('mousemove', debounce((e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 12;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });

      if (heroVisual) {
        heroVisual.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      }
    }, 16));
  }

  /* ==========================================
     Contact Form
     ========================================== */
  function initContactForm() {
    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const subject = formData.get('subject')?.toString().trim();
      const message = formData.get('message')?.toString().trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        showToast('Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 1500);
    });
  }

  /* ==========================================
     Lazy Loading Images (when added)
     ========================================== */
  function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.loading = 'lazy';
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  /* ==========================================
     Initialize All
     ========================================== */
  function init() {
    initPreloader();
    initTyping();
    initReveal();
    initCounters();
    initSkillBars();
    initSkillsFilter();
    initProjectsFilter();
    initTestimonials();
    initRipple();
    initTilt();
    initCustomCursor();
    initParticles();
    initParallax();
    initContactForm();
    initLazyLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
