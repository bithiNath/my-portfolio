/* ==========================================================================
   Shared site behaviour — nav, footer injection, scroll reveal, bar fills.
   Reads personal data from SITE_DATA (js/data.js) so every page stays
   in sync when you edit that one file.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  injectContactInfo();
  initScrollReveal();
  initProficiencyBars();
});

/* ---- Mobile nav toggle ---- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ---- Inject contact / social links wherever data-site-* hooks exist ---- */
function injectContactInfo() {
  if (typeof SITE_DATA === 'undefined') return;

  document.querySelectorAll('[data-site="email"]').forEach(el => {
    el.textContent = SITE_DATA.email;
    if (el.tagName === 'A') el.href = `mailto:${SITE_DATA.email}`;
  });
  document.querySelectorAll('[data-site="phone"]').forEach(el => {
    el.textContent = SITE_DATA.phone;
    if (el.tagName === 'A') el.href = `tel:${SITE_DATA.phone.replace(/[^+\d]/g, '')}`;
  });
  document.querySelectorAll('[data-site="location"]').forEach(el => {
    el.textContent = SITE_DATA.location;
  });
  document.querySelectorAll('[data-site="linkedin"]').forEach(el => {
    el.href = SITE_DATA.linkedin;
  });
  document.querySelectorAll('[data-site="github"]').forEach(el => {
    el.href = SITE_DATA.github;
  });
  document.querySelectorAll('[data-site="resume"]').forEach(el => {
    el.href = SITE_DATA.resumeFile;
  });
  document.querySelectorAll('[data-site="project-egrocery"]').forEach(el => {
    el.href = SITE_DATA.projects.eGrocery;
  });
  document.querySelectorAll('[data-site="project-retailnexus"]').forEach(el => {
    el.href = SITE_DATA.projects.retailNexus;
  });
  document.querySelectorAll('[data-site="project-workforceiq"]').forEach(el => {
    el.href = SITE_DATA.projects.workforceIQ;
  });

  document.querySelectorAll('[data-site="year"]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  renderPassions();
}

/* ---- Passions grid (passions.html only) ---- */
const PASSION_ICONS = {
  gardening: '<path d="M16 28V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 14c0-5-5-7-9-6 0 5 4 9 9 6Z" fill="currentColor"/><path d="M16 18c0-4 4-6 8-5 0 4-3.5 7.5-8 5Z" fill="currentColor"/><line x1="7" y1="28" x2="25" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  aquascaping: '<rect x="4" y="8" width="24" height="18" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 14c3-2 6 2 9 0s6 2 9 0 6-2 6-2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 26v-6c0-3 2-5 2-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M19 26v-8c0-2 2-3 2-3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  compass: '<circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20 12l-3 7-7 3 3-7 7-3Z" fill="currentColor"/>',
  camera: '<rect x="4" y="9" width="24" height="17" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M11 9l2-3h6l2 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="17.5" r="5" stroke="currentColor" stroke-width="2" fill="none"/>',
  video: '<rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><polygon points="10,10 16,14 10,18" fill="currentColor"/>',
  yoga: '<circle cx="16" cy="8" r="3" fill="currentColor"/><path d="M16 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 13c-4 0-7 3-7 3M16 13c4 0 7 3 7 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M9 24c3-3 6-5 7-7 1 2 4 4 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 24h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
};

function renderPassions() {
  const grid = document.querySelector('[data-passion-grid]');
  if (!grid || typeof SITE_DATA === 'undefined') return;

  grid.innerHTML = SITE_DATA.passions.map(h => `
    <div class="hobby-card reveal">
      <svg class="hobby-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">${PASSION_ICONS[h.icon] || PASSION_ICONS.compass}</svg>
      <h3>${h.title}</h3>
      <p>${h.blurb}</p>
    </div>
  `).join('');

  initScrollReveal();
}

/* ---- Scroll reveal ---- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

/* ---- Proficiency bar fill on scroll into view ---- */
function initProficiencyBars() {
  const bars = document.querySelectorAll('.proficiency-fill[data-level]');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach(bar => { bar.style.width = bar.dataset.level + '%'; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
}
