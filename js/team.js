import { cars, carClassLabels } from '../data/cars.js';
import { drivers, programLabels } from '../data/drivers.js';
import { site } from '../data/site.js';
import { $, $$, bindDialog, openDialog } from './dom.js';
import { t } from './i18n.js';
import { escapeHtml } from './safe.js';
import { pictureMarkup, portraitMarkup } from './media.js';
import { swapIn } from './motion.js';

const programmes = [
  { classId: 'hypercar', driverId: 'hy', label: 'Hypercar', featuredCar: 'vanwall-680' },
  { classId: 'lmp2', driverId: 'lmp2', label: 'LMP2', featuredCar: 'oreca-07' },
  { classId: 'lmp3', driverId: 'lmp3', label: 'LMP3', featuredCar: 'ligier-js-p325' },
  { classId: 'lmgt3', driverId: 'gt3', label: 'LMGT3', featuredCar: 'ford-mustang-lmgt3' }
];
const driverFilters = ['all', 'hy', 'lmp2', 'lmp3', 'gt3'];
const MAX_COMPARE = 2;

const entryNumber = (entry) => (entry.number === 'TBA' ? '-' : `#${entry.number}`);

export function renderTeam({ overlay }) {
  renderManagement(overlay);
  renderProgrammes(overlay);
  renderDrivers(overlay);
}

function renderManagement(overlay) {
  const root = $('[data-management]');
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
  root.innerHTML = site.management.map(card).join('');
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-management-driver]');
    if (button) overlay.open('driver', button.dataset.managementDriver, button);
  });
}

/* ---------- programy: taby ARIA + kadra ---------- */
function renderProgrammes(overlay) {
  const tabs = $('[data-programme-tabs]');
  const panel = $('[data-programme-panel]');
  if (!tabs || !panel) return;
  let active = programmes[0];

  tabs.innerHTML = programmes.map((programme, index) => `<button type="button" role="tab" id="programme-tab-${programme.classId}" aria-controls="programme-panel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-programme="${programme.classId}">${programme.label}</button>`).join('');
  panel.id = 'programme-panel';
  panel.setAttribute('role', 'tabpanel');

  const render = () => {
    const car = cars.find((item) => item.id === active.featuredCar) || cars.find((item) => item.class === active.classId);
    const roster = drivers.filter((driver) => driver.programs.some((program) => program.id === active.driverId));
    const source = car.showroomImage || car.heroImage;
    panel.setAttribute('aria-labelledby', `programme-tab-${active.classId}`);
    panel.innerHTML = `
      <article class="programme__car card">
        <div class="programme__media ${car.showroomImage ? 'is-cutout' : ''}">${pictureMarkup(source, `${car.name} ${t('w barwach Vistula Racing')}`, { sizes: '(max-width: 1024px) 100vw, 55vw' })}</div>
        <div class="programme__copy">
          <h3>${escapeHtml(car.name)} <span>#${escapeHtml(car.number)}</span></h3>
          <p>${escapeHtml(t('Samochód reprezentujący klasę. Składy konkretnych entry zostaną opublikowane po potwierdzeniu przez zespół.'))}</p>
          <button class="link-more" type="button" data-programme-car>${escapeHtml(t('Profil samochodu'))}</button>
        </div>
      </article>
      <div class="programme__roster">
        <header><h4>${escapeHtml(t('Kadra programu'))}</h4><span>${roster.length} ${escapeHtml(t('kierowców'))}</span></header>
        <ul>${roster.map((driver) => {
          const entry = driver.programs.find((program) => program.id === active.driverId);
          return `<li><button class="roster__row" type="button" data-roster-driver="${escapeHtml(driver.id)}">
            ${portraitMarkup(driver, '', { sizes: '48px' })}
            <span><strong>${escapeHtml(driver.name)}</strong><small>${escapeHtml(driver.role)}</small></span>
            <span class="roster__num">${escapeHtml(entryNumber(entry))}</span>
          </button></li>`;
        }).join('')}</ul>
      </div>`;
    $('[data-programme-car]', panel).addEventListener('click', (event) => overlay.open('car', car.id, event.currentTarget));
  };

  const activate = (button, { focus = false } = {}) => {
    active = programmes.find((programme) => programme.classId === button.dataset.programme);
    $$('[role="tab"]', tabs).forEach((tab) => {
      const on = tab === button;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    if (focus) button.focus();
    render();
    swapIn(panel, 0, { duration: 420 });
  };

  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[role="tab"]');
    if (button) activate(button);
  });
  tabs.addEventListener('keydown', (event) => {
    const all = $$('[role="tab"]', tabs);
    const index = all.indexOf(document.activeElement);
    if (index < 0) return;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: all.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    activate(all[(next + all.length) % all.length], { focus: true });
  });
  panel.addEventListener('click', (event) => {
    const row = event.target.closest('[data-roster-driver]');
    if (row) overlay.open('driver', row.dataset.rosterDriver, row);
  });
  render();
}

/* ---------- wszyscy kierowcy + porównywarka ---------- */
function renderDrivers(overlay) {
  const grid = $('[data-driver-grid]');
  const filtersRoot = $('[data-driver-filters]');
  if (!grid || !filtersRoot) return;

  let filter = 'all';
  let expanded = false;
  const FIRST = 12;
  grid.insertAdjacentHTML('afterend', '<button class="btn btn-quiet drivers__more" type="button" data-drivers-more></button>');
  const more = grid.nextElementSibling;

  filtersRoot.innerHTML = driverFilters.map((key) => {
    const amount = key === 'all' ? drivers.length : drivers.filter((driver) => driver.programs.some((program) => program.id === key)).length;
    const label = key === 'all' ? t('Wszyscy') : programLabels[key];
    return `<button type="button" aria-pressed="${key === 'all'}" data-driver-filter="${key}">${escapeHtml(label)}<small>${amount}</small></button>`;
  }).join('');

  const renderGrid = () => {
    const items = filter === 'all' ? drivers : drivers.filter((driver) => driver.programs.some((program) => program.id === filter));
    // Wszystkie karty są w DOM (test dymny liczy 49); ponad pierwsze 12 chowa `hidden`. Wybrane do porównania zostają widoczne.
    more.hidden = expanded || items.length <= FIRST;
    more.textContent = `${t('Pokaż wszystkich')} (${items.length})`;
    grid.innerHTML = items.map((driver, index) => {
      return `<li class="driver"${!expanded && index >= FIRST ? ' hidden' : ''}>
        <button class="driver__open" type="button" data-driver-id="${escapeHtml(driver.id)}">
          <span class="driver__photo">${portraitMarkup(driver, `${t('Portret kierowcy')} ${driver.name}`, { showcase: true, sizes: '(max-width: 640px) 50vw, 200px' })}<b>#${escapeHtml(driver.number)}</b></span>
          <span class="driver__text"><strong>${escapeHtml(driver.name)}</strong><small>${escapeHtml(driver.programs.map((program) => programLabels[program.id]).join(' · '))}</small></span>
        </button>
      </li>`;
    }).join('');
  };

  filtersRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-driver-filter]');
    if (!button) return;
    filter = button.dataset.driverFilter;
    $$('[data-driver-filter]', filtersRoot).forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderGrid();
  });
  grid.addEventListener('click', (event) => {
    const open = event.target.closest('[data-driver-id]');
    if (open) overlay.open('driver', open.dataset.driverId, open);
    return undefined;
  });

  more.addEventListener('click', () => {
    expanded = true;
    renderGrid();
    $$('[data-driver-id]', grid)[FIRST]?.focus({ preventScroll: true });
  });

  renderGrid();
}
