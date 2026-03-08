(async function bootstrapSite() {
  const activePath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav a').forEach((a) => {
    const path = (a.getAttribute('href') || '').replace(/\/$/, '') || '/index.html';
    if (path === activePath || (path === '/' && activePath === '/index.html')) {
      a.classList.add('current');
    }
  });

  try {
    const configVersion = '20260307b';
    const response = await fetch(`/data/site-config.json?v=${configVersion}`, { cache: 'no-store' });
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

    const mc = config.minecraftServer || {};
    const host = mc.host || '';
    const port = mc.port || '';
    const address = host && port ? `${host}:${port}` : (host || port || 'Not configured');

    document.querySelectorAll('[data-bind="minecraft-name"]').forEach((el) => {
      if (mc.name) el.textContent = mc.name;
    });

    document.querySelectorAll('[data-bind="minecraft-host"]').forEach((el) => {
      if (host) el.textContent = host;
    });

    document.querySelectorAll('[data-bind="minecraft-port"]').forEach((el) => {
      if (port) el.textContent = String(port);
    });

    document.querySelectorAll('[data-bind="minecraft-address"]').forEach((el) => {
      el.textContent = address;
    });

    document.querySelectorAll('[data-bind="minecraft-version"]').forEach((el) => {
      if (mc.version) el.textContent = mc.version;
    });

    document.querySelectorAll('[data-bind="minecraft-edition"]').forEach((el) => {
      if (mc.edition) el.textContent = mc.edition;
    });
  } catch (_error) {
    // Config loading is optional for local previews.
  }
})();
