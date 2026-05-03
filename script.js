/* ═══════════════════════════════════════════════════════════
   THINKWAY — PREMIUM AGENCY SCRIPT
   ═══════════════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let rx = 0, ry = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  (function lerp() {
    rx += (cx - rx) * 0.09;
    ry += (cy - ry) * 0.09;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  const hoverSel = 'a, button, .pf-item, .about__pill, .chip, .filter-btn, .testi__dot, .svc-item__head';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) {
      cursor.classList.add('is-hover');
      cursorRing.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) {
      cursor.classList.remove('is-hover');
      cursorRing.classList.remove('is-hover');
    }
  });
  document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-click'));
}

/* ── WORD SPLIT ──────────────────────────────────────────────── */
function splitWords(el) {
  const html = el.innerHTML;
  // Preserve <br> and <em> tags while splitting text nodes
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach(tn => {
    const words = tn.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    words.forEach(part => {
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else if (part) {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        wrap.innerHTML = `<span class="word">${part}</span>`;
        frag.appendChild(wrap);
      }
    });
    tn.parentNode.replaceChild(frag, tn);
  });
}

document.querySelectorAll('[data-split]').forEach(el => splitWords(el));

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal, [data-split]').forEach(el => revealObs.observe(el));

/* ── NAVIGATION ──────────────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

const burger = document.querySelector('.nav__burger');
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav__mobile a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  })
);

/* ── ACTIVE NAV ON SCROLL ────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => activeObs.observe(s));

/* ── COUNTER ANIMATION ───────────────────────────────────────── */
function countUp(el, target, dur = 1800) {
  let start = null;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, parseInt(e.target.dataset.count));
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ── SERVICES ACCORDION ──────────────────────────────────────── */
const svcItems = document.querySelectorAll('[data-svc]');

svcItems.forEach(item => {
  const btn = item.querySelector('.svc-item__head');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all first
    svcItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.svc-item__head')?.setAttribute('aria-expanded', 'false');
    });
    // toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── PORTFOLIO FILTER ────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.pf-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    portfolioItems.forEach(item => {
      item.classList.toggle('hidden', f !== 'all' && item.dataset.cat !== f);
    });
  });
});

/* ── TESTIMONIAL SLIDER ──────────────────────────────────────── */
const testis   = document.querySelectorAll('.testi');
const testiDots = document.querySelectorAll('.testi__dot');
let current = 0, timer;

function goTo(idx) {
  testis[current].classList.remove('active');
  testiDots[current].classList.remove('active');
  current = (idx + testis.length) % testis.length;
  testis[current].classList.add('active');
  testiDots[current].classList.add('active');
}

function startAuto() { timer = setInterval(() => goTo(current + 1), 5500); }

testiDots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(timer);
    goTo(parseInt(dot.dataset.idx));
    startAuto();
  });
});

startAuto();

/* ── MAGNETIC BUTTONS ────────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.22;
    const y = (e.clientY - r.top  - r.height / 2) * 0.28;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ── HERO PARALLAX ───────────────────────────────────────────── */
const orbA = document.querySelector('.hero__orb--a');
const orbB = document.querySelector('.hero__orb--b');
const wm   = document.querySelector('.hero__watermark');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orbA) orbA.style.transform = `translateY(${y * 0.12}px)`;
  if (orbB) orbB.style.transform = `translateY(${y * -0.08}px)`;
  if (wm)   wm.style.transform   = `translateY(${y * 0.06}px)`;
}, { passive: true });

/* ── STAGGERED WORD DELAYS ───────────────────────────────────── */
document.querySelectorAll('[data-split]').forEach(el => {
  el.querySelectorAll('.word').forEach((word, i) => {
    word.style.transitionDelay = `${i * 0.045}s`;
  });
});

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    form.style.animation = 'shake .4s var(--ease-expo)';
    setTimeout(() => form.style.animation = '', 400);
    return;
  }

  const btn = form.querySelector('[type="submit"] span');
  const origText = btn.textContent;
  btn.textContent = 'Sending…';
  form.querySelector('[type="submit"]').disabled = true;

  setTimeout(() => {
    btn.textContent = origText;
    form.querySelector('[type="submit"]').disabled = false;
    form.reset();
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 6000);
  }, 1500);
});

/* ── INJECT SHAKE KEYFRAME ───────────────────────────────────── */
const ss = document.createElement('style');
ss.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-7px); }
    40%      { transform: translateX(7px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(ss);
