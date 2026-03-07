(async function renderCommands() {
  const container = document.getElementById('commands-root');
  if (!container) return;

  try {
    const [commandsResponse, groupsResponse] = await Promise.all([
      fetch('/data/commands.generated.json', { cache: 'no-store' }),
      fetch('/data/command-groups.json', { cache: 'no-store' }),
    ]);

    if (!commandsResponse.ok) throw new Error('Could not load commands data.');
    if (!groupsResponse.ok) throw new Error('Could not load command groups.');

    const commands = await commandsResponse.json();
    const groupsConfig = await groupsResponse.json();

    const commandMap = new Map(commands.map((cmd) => [cmd.name, cmd]));
    const groupedNames = new Set();

    const groupsHtml = (groupsConfig.groups || []).map((group) => {
      const list = (group.commands || [])
        .map((name) => {
          const cmd = commandMap.get(name);
          if (!cmd) return null;
          groupedNames.add(name);
          return commandCard(cmd);
        })
        .filter(Boolean)
        .join('');

      if (!list) return '';

      return `
        <section class="command-group section">
          <h2>${escapeHtml(group.title || 'Commands')}</h2>
          <p class="muted">${escapeHtml(group.description || '')}</p>
          <div class="command-grid">${list}</div>
        </section>
      `;
    }).join('');

    const ungrouped = commands
      .filter((cmd) => !groupedNames.has(cmd.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    const ungroupedHtml = ungrouped.length
      ? `
        <section class="command-group section">
          <h2>${escapeHtml(groupsConfig.ungroupedTitle || 'Other Commands')}</h2>
          <p class="muted">Commands that are available but not assigned to a manual section yet.</p>
          <div class="command-grid">${ungrouped.map(commandCard).join('')}</div>
        </section>
      `
      : '';

    container.innerHTML = groupsHtml + ungroupedHtml;
  } catch (error) {
    container.innerHTML = `<section class="section"><p>Could not load commands right now. ${escapeHtml(error.message)}</p></section>`;
  }
})();

function commandCard(cmd) {
  const tags = [];
  if (cmd.guildOnly) tags.push('<span class="tag">Guild only</span>');
  if (cmd.ownerOnly) tags.push('<span class="tag">Owner only</span>');

  return `
    <article class="command-card">
      <div class="command-name">/${escapeHtml(cmd.name)}</div>
      <p>${escapeHtml(cmd.description || 'No description yet.')}</p>
      <div class="command-tags">${tags.join('')}</div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
