/* design.js
   - Mobile menu
   - Theme toggle (persist)
   - Reveal animations (IntersectionObserver)
   - Skill bars animation
   - Modal handling
   - Contact form via Formspree (fetch)
   - Small helpers
*/

/* helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

/* DOM elements */
const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
const mobileClose = $('#mobileClose');
const mobileLinks = $$('[data-mobile-nav]');
const themeToggle = $('#themeToggle');
const contactForm = $('#contactForm');
const formStatus = $('#formStatus');
const revealElems = $$('.reveal');
const modalButtons = $$('[data-demo]');
const modals = $$('.modal');
const modalCloses = $$('.modal-close');

/* Mobile menu open/close */
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.style.display = 'block';
    mobileMenu.setAttribute('aria-hidden', 'false');
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
}
mobileLinks.forEach(a => a.addEventListener('click', () => {
  mobileMenu.style.display = 'none';
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

/* theme toggle with localStorage */
const THEME_KEY = 'portfolio-theme';
function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.style.setProperty('--bg', '#f6f8fb');
    document.documentElement.style.setProperty('--text', '#0f172a');
    document.documentElement.style.setProperty('--card', 'rgba(255,255,255,0.85)');
    document.documentElement.style.setProperty('--muted', '#5b6770');
  } else {
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--text');
    document.documentElement.style.removeProperty('--card');
    document.documentElement.style.removeProperty('--muted');
  }
  localStorage.setItem(THEME_KEY, theme);
}
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
setTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem(THEME_KEY) || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

/* smooth nav scrolling */
$$('[data-nav]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  });
});
$$('[data-mobile-nav]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  });
});

/* reveal on scroll + skill bar animation */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // animate skill bar children if present
      const fills = entry.target.querySelectorAll('.bar-fill');
      fills.forEach(f => {
        const w = f.style.getPropertyValue('--w') || f.getAttribute('data-w') || '0%';
        requestAnimationFrame(() => f.style.width = w);
      });
    }
  });
}, { threshold: 0.15 });

revealElems.forEach(el => observer.observe(el));

/* Modals (project details) */
modalButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selector = btn.getAttribute('data-demo');
    const modal = document.querySelector(selector);
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }
  });
});
modalCloses.forEach(c => {
  c.addEventListener('click', () => {
    c.closest('.modal').style.display = 'none';
    c.closest('.modal').setAttribute('aria-hidden', 'true');
  });
});
modals.forEach(m => {
  m.addEventListener('click', (e) => {
    if (e.target === m) {
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    }
  });
});

/* Contact form submit (Formspree) */
if (contactForm) {
  contactForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (!contactForm.action) return;

    formStatus.textContent = 'Sending...';
    formStatus.style.color = 'var(--muted)';

    const data = new FormData(contactForm);

    try {
      const res = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        formStatus.textContent = 'Message sent — thanks!';
        formStatus.style.color = 'var(--accent)';
        contactForm.reset();
      } else {
        const json = await res.json().catch(()=>({}));
        formStatus.textContent = json.error || 'Error sending message.';
        formStatus.style.color = 'tomato';
      }
    } catch (err) {
      formStatus.textContent = 'Network error — try again later.';
      formStatus.style.color = 'tomato';
    }
  });
}

/* copy year */
const copyYear = new Date().getFullYear();
const yearEl = document.getElementById('copyYear');
if (yearEl) yearEl.textContent = copyYear;

/* keyboard accessibility: close modal on esc */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modals.forEach(m => {
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    });
    if (mobileMenu) {
      mobileMenu.style.display = 'none';
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }
});

/* small enhancement: lazy load images */
document.addEventListener('DOMContentLoaded', () => {
  $$('img').forEach(img => {
    if (!img.loading) img.loading = 'lazy';
  });
});
