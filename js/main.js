'use strict';

// 1. Current Year in Footer
const yearEl = document.getElementById('footerYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 2. Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

function setMenuOpen(open) {
  navMenu.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute(
    'aria-label',
    open ? 'Close navigation menu' : 'Open navigation menu'
  );
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('is-open');
    setMenuOpen(!isOpen);
  });

  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener('click', e => {
    if (
      navMenu.classList.contains('is-open') &&
      !navToggle.contains(e.target) &&
      !navMenu.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  });
}

// 3. Active Nav Link on Scroll via IntersectionObserver
const sections  = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const linkMap = new Map();
navLinks.forEach(link => {
  const id = link.getAttribute('href').replace('#', '');
  linkMap.set(id, link);
});

function setActiveLink(activeId) {
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = linkMap.get(activeId);
  if (activeLink) activeLink.classList.add('active');
}

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.getAttribute('id'));
      }
    });
  },
  {
    root: null,
    rootMargin: '-60px 0px -40% 0px',
    threshold: 0,
  }
);

sections.forEach(section => sectionObserver.observe(section));

// 4. Scroll Reveal Animations via IntersectionObserver
const revealElements = document.querySelectorAll(
  '.section__header, .about__bio, .about__card, .project-featured, .project-card, .skill-group, .cert-card, .contact__card'
);

revealElements.forEach(el => {
  el.classList.add('reveal');
  const siblingIndex = Array.from(el.parentElement.children).indexOf(el);
  el.style.setProperty('--reveal-delay', `${Math.min(siblingIndex * 0.08, 0.35)}s`);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.08,
  }
);

revealElements.forEach(el => revealObserver.observe(el));

// 5. Light / Dark Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const rootHtml = document.documentElement;

function updateThemeMeta(theme) {
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'light' ? '#FBF8F4' : '#59171B');
  }
}

// Initial meta theme check
updateThemeMeta(rootHtml.getAttribute('data-theme') || 'dark');

if (themeToggle) {
  function updateThemeButton(theme) {
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  }

  updateThemeButton(rootHtml.getAttribute('data-theme') || 'dark');

  themeToggle.addEventListener('click', () => {
    const currentTheme = rootHtml.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    rootHtml.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('wmbl-theme', newTheme);
    } catch (e) {}
    updateThemeMeta(newTheme);
    updateThemeButton(newTheme);
  });
}

// 6. Direct Email Compose Handler
const emailCard = document.querySelector('.contact__card[href^="mailto:"]');
if (emailCard) {
  emailCard.addEventListener('click', e => {
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=welamaebacarisaslim@gmail.com', '_blank', 'noopener,noreferrer');
    }
  });
}
