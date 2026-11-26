import { drivers } from '../data/drivers.js';
import { site } from '../data/site.js';
import { squads } from '../data/squads.js';
import { $, $$ } from './dom.js';
import { t } from './i18n.js';
import { escapeHtml } from './safe.js';
import { portraitMarkup } from './media.js';

export function renderTeam({ overlay }) {
  $$('[data-staff]').forEach((root) => renderPeople(root, site.staff[root.dataset.staff], overlay));
  renderDrivers(overlay);
}

export function renderPeople(root, people, overlay) {
  if (!root) return;
  const card = (person) => {
    const driver = person.driverId ? drivers.find((item) => item.id === person.driverId) : null;
    const initials = person.name.split(' ').map((word) => word[0]).join('').slice(0, 2);
    const photo = driver ? portraitMarkup(driver, '', { sizes: '(max-width: 640px) 50vw, 220px' }) : `<span class="avatar" aria-hidden="true">${escapeHtml(initials)}</span>`;
    const inner = `<span class="person__photo">${photo}</span><span class="person__text"><strong>${escapeHtml(person.name)}</strong><span>${escapeHtml(person.role)}</span></span>`;
    return driver
      ? `<button class="person" type="button" data-management-driver="${escapeHtml(person.driverId)}">${inner}</button>`
      : `<div class="person">${inner}</div>`;
  };
  root.innerHTML = people.map(card).join('');
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-management-driver]');
    if (button) overlay.open('driver', button.dataset.managementDriver, button);
  });
}

/* ---------- składy według symulatorów ---------- */
function renderDrivers(overlay) {
  const root = $('[data-squads]');
  const filters = $('[data-squad-filters]');
  if (!root || !filters) return;
  const byId = new Map(drivers.map((driver) => [driver.id, driver]));

  const card = (driver) => `<li class="driver">
    <button class="driver__open" type="button" data-driver-id="${escapeHtml(driver.id)}">
      <span class="driver__photo">${portraitMarkup(driver, `${t('Portret kierowcy')} ${driver.name}`, { showcase: true, sizes: '(max-width: 640px) 50vw, 200px' })}${driver.number === '-' ? '' : `<b>#${escapeHtml(driver.number)}</b>`}</span>
      <span class="driver__text">${driver.transfer?.badge ? `<em class="driver__transfer">${escapeHtml(t(driver.transfer.badge))}</em>` : ''}<strong>${escapeHtml(driver.name)}</strong><small>${escapeHtml(driver.role)}</small></span>
    </button>
  </li>`;

  filters.innerHTML = [{ id: 'all', short: t('Wszystkie') }, ...squads]
    .map((sim, index) => `<button type="button" aria-pressed="${index === 0}" data-squad-filter="${sim.id}">${escapeHtml(sim.short)}</button>`).join('');

  root.innerHTML = squads.map((sim) => `<section class="sim" data-sim="${sim.id}">
    <header class="sim__head">
      <h3>${escapeHtml(sim.label)}</h3>
      <p>${sim.directors.map(([role, id]) => `${role}: <strong>${escapeHtml(byId.get(id).name)}</strong>`).join(' · ')}</p>
    </header>
    ${sim.teams.map((item) => `<h4 class="sim__squad">${escapeHtml(t(item.name))}</h4>
    <ul class="drivers__grid">${item.drivers.map((id) => card(byId.get(id))).join('')}</ul>`).join('')}
  </section>`).join('');

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-squad-filter]');
    if (!button) return;
    const chosen = button.dataset.squadFilter;
    $$('[data-squad-filter]', filters).forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    $$('[data-sim]', root).forEach((sim) => { sim.hidden = chosen !== 'all' && sim.dataset.sim !== chosen; });
  });
  root.addEventListener('click', (event) => {
    const open = event.target.closest('[data-driver-id]');
    if (open) overlay.open('driver', open.dataset.driverId, open);
  });
}
