(async function bootstrapSite() {
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
