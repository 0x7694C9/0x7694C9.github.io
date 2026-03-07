(function bootstrapThemeEarly() {
  try {
    const stored = localStorage.getItem('aurora-theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (_error) {
    // Ignore storage failures.
  }
})();

(async function bootstrapSite() {
  setupThemeToggle();

  const activePath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav a').forEach((a) => {
    const path = (a.getAttribute('href') || '').replace(/\/$/, '') || '/index.html';
    if (path === activePath || (path === '/' && activePath === '/index.html')) {
      a.classList.add('current');
    }
  });

  try {
    const response = await fetch('/data/site-config.json', { cache: 'no-store' });
    if (!response.ok) return;
    const config = await response.json();

    document.querySelectorAll('[data-bind="invite-url"]').forEach((el) => {
      if (config.inviteUrl && el.tagName.toLowerCase() === 'a') {
        el.setAttribute('href', config.inviteUrl);
      }
      if (config.inviteUrl && el.hasAttribute('data-bind-text')) {
        el.textContent = config.inviteUrl;
      }
    });

    document.querySelectorAll('[data-bind="support-url"]').forEach((el) => {
      if (config.supportUrl && el.tagName.toLowerCase() === 'a') {
        el.setAttribute('href', config.supportUrl);
      }
    });

    document.querySelectorAll('[data-bind="brand-name"]').forEach((el) => {
      if (config.brandName) el.textContent = config.brandName;
    });

    document.querySelectorAll('[data-bind="updated-date"]').forEach((el) => {
      if (config.lastUpdated) el.textContent = config.lastUpdated;
    });
  } catch (_error) {
    // Config loading is optional for local previews.
  }
})();

function setupThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const stored = getStoredTheme();
  applyTheme(stored);
  updateThemeToggleLabel(button, stored);

  button.addEventListener('click', () => {
    const current = getStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
    updateThemeToggleLabel(button, next);
  });
}

function getStoredTheme() {
  try {
    return localStorage.getItem('aurora-theme') || 'dark';
  } catch (_error) {
    return 'dark';
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('aurora-theme', theme);
  } catch (_error) {
    // Ignore storage failures.
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function updateThemeToggleLabel(button, theme) {
  if (theme === 'dark') {
    button.textContent = 'Light mode';
    button.setAttribute('aria-label', 'Switch to light mode');
    return;
  }

  button.textContent = 'Dark mode';
  button.setAttribute('aria-label', 'Switch to dark mode');
}
