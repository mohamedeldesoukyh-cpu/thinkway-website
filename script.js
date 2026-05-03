/* ─────────────────────────────────────────────────────────────
   THINKWAY AGENCY — MAIN JS
   ───────────────────────────────────────────────────────────── */

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
  let fx = 0, fy = 0, cx = 0, cy = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  function animateFollower() {
    fx += (cx - fx) * 0.1;
    fy += (cy - fy) * 0.1;
    cursorFollower.style.left = fx + 'px';
    cursorFollower.style.top  = fy + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = 'a, button, .portfolio-item, .service-card, .tag-checkbox';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
      cursorFollower.classList.add('cursor-follower--hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
      cursorFollower.classList.remove('cursor-follower--hover');
    }
  });
}

/* ── NAVIGATION ──────────────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const burger = document.querySelector('.nav__burger');
burger?.addEventListener('click', () => nav.classList.toggle('mobile-open'));

document.querySelectorAll('.nav__mobile a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('mobile-open'));
});

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ───────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── PORTFOLIO FILTER ────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

/* ── TESTIMONIAL SLIDER ──────────────────────────────────────── */
const testimonials = document.querySelectorAll('.testimonial');
const dotBtns = document.querySelectorAll('.dot-btn');
let currentSlide = 0;
let sliderInterval;

function goToSlide(idx) {
  testimonials[currentSlide].classList.remove('active');
  dotBtns[currentSlide].classList.remove('active');
  currentSlide = (idx + testimonials.length) % testimonials.length;
  testimonials[currentSlide].classList.add('active');
  dotBtns[currentSlide].classList.add('active');
}

function startSlider() {
  sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

dotBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(sliderInterval);
    goToSlide(parseInt(btn.dataset.idx));
    startSlider();
  });
});

startSlider();

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    shakeForm();
    return;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Sending…</span>';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalHtml;
    submitBtn.disabled = false;
    form.reset();
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1400);
});

function shakeForm() {
  const formEl = document.querySelector('.contact-form');
  formEl.style.animation = 'shake .4s var(--ease-out)';
  setTimeout(() => formEl.style.animation = '', 400);
}

/* ── ACTIVE NAV LINK HIGHLIGHT ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--white)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── SMOOTH PARALLAX ON HERO ORBS ────────────────────────────── */
const orb1 = document.querySelector('.hero__orb--1');
const orb2 = document.querySelector('.hero__orb--2');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${y * -0.1}px)`;
}, { passive: true });

/* ── ADD SHAKE KEYFRAME DYNAMICALLY ─────────────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);
