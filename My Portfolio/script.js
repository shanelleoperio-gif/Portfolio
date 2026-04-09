
'use strict';

/* ══════════════════════════════════════════════════════════════
   EMAILJS SETUP — required to receive contact form notifications
   ══════════════════════════════════════════════════════════════
   Steps:
   1. Sign up free at https://www.emailjs.com
   2. Add Email Service (Gmail) → copy the Service ID
   3. Create Email Template — add these variables:
        {{from_name}}  {{from_email}}  {{subject}}  {{message}}
      Set recipient to: shanelleoperio@gmail.com
   4. Copy your Public Key from Account → API Keys
   5. Paste the three values below:
   ═══════════════════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

(function () {
  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) {}
})();

/* ── THEME ────────────────────────────────────────────────────── */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('so-theme', t);
  themeIcon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
applyTheme(localStorage.getItem('so-theme') || 'dark');

themeBtn.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ── NAVBAR SCROLL ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
});

/* ── MOBILE MENU ──────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

/* ── ACTIVE NAV LINK ──────────────────────────────────────────── */
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}
highlightNav();

/* ── SMOOTH SCROLL ────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── SCROLL REVEAL ────────────────────────────────────────────── */
function setupReveal() {
  const targets = document.querySelectorAll(
    '.skill-card, .project-card, .cert-card, .connect-icon, .about-card-glow, .about-body, .contact-info, .contact-form'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach(el => obs.observe(el));
}
setupReveal();

/* ── CAROUSEL ─────────────────────────────────────────────────── */
(function () {
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let current  = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }
  function go(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 5000);
  }

  prevBtn && prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => go(current + 1));

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
  });

  timer = setInterval(() => go(current + 1), 5000);
})();

/* ── LIGHTBOX ─────────────────────────────────────────────────── */
function openLightbox(src, caption) {
  const lb  = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── CONTACT FORM — EmailJS ───────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn    = form.querySelector('button[type="submit"]');

  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  status.textContent = '';
  status.className   = 'form-status';

  const params = {
    from_name:  form.name.value,
    from_email: form.email.value,
    subject:    form.subject.value || 'Portfolio Contact',
    message:    form.message.value,
    reply_to:   form.email.value,
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(() => {
      status.textContent = '✓ Message sent! I\'ll be in touch soon.';
      status.className   = 'form-status success';
      form.reset();
    })
    .catch(err => {
      console.error(err);
      status.textContent = EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
        ? '⚠ Add your EmailJS keys in script.js to enable this form.'
        : '✕ Something went wrong. Please email me directly.';
      status.className = 'form-status error';
    })
    .finally(() => {
      btn.disabled  = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
}


