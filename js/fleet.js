import { cars, carClassLabels, brandLogos } from '../data/cars.js';
import { $, $$, pad, prefersReducedMotion } from './dom.js';
import { t } from './i18n.js';
import { escapeHtml } from './safe.js';
import { bestImageSource, pictureMarkup } from './media.js';

const classTint = { hypercar: '#4aa3ff', lmp2: '#8b7bff', lmp3: '#34d1bf', lmgt3: '#ffb23d' };
import { swapIn } from './motion.js';

const chevron = (d) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

/** Konfigurator floty: szkielet sceny budowany raz, przy wyborze podmieniane są tylko treści (fokus nie ginie). */
export function renderFleet({ overlay }) {
  const stage = $('[data-fleet-stage]');
  const list = $('[data-fleet-list]');
  const filters = $('[data-fleet-filters]');
  const status = $('[data-fleet-status]');
  if (!stage || !list || !filters) return;

  const modelCount = new Set(cars.map((car) => `${car.manufacturer}:${car.model}`)).size;
  const modelCountEl = $('[data-model-count]');
  if (modelCountEl) modelCountEl.textContent = modelCount;

  const state = { filter: 'all', items: cars, selected: 0 };
  const order = ['all', 'hypercar', 'lmgt3', 'lmp2', 'lmp3'];

  filters.innerHTML = order.map((key) => {
    const amount = key === 'all' ? cars.length : cars.filter((car) => car.class === key).length;
    const label = key === 'all' ? t('Wszystkie') : carClassLabels[key];
    return `<button type="button" aria-pressed="${key === 'all'}" data-fleet-filter="${key}">${escapeHtml(label)}<small>${amount}</small></button>`;
  }).join('');

  stage.innerHTML = `
    <div class="stage__visual" data-stage-visual></div>
    <div class="stage__copy">
      <p class="stage__brand" data-stage-brand></p>
      <p class="stage__meta" data-stage-meta></p>
      <h3 data-stage-title></h3>
      <dl class="stage__facts" data-stage-facts></dl>
      <div class="stage__actions">
        <button class="btn btn-primary" type="button" data-stage-open>${escapeHtml(t('Otwórz profil'))}</button>
        <div class="stage__nav">
          <button class="icon-btn" type="button" aria-label="${escapeHtml(t('Poprzedni samochód'))}" data-fleet-prev>${chevron('m12 4-6 6 6 6')}</button>
          <button class="icon-btn" type="button" aria-label="${escapeHtml(t('Następny samochód'))}" data-fleet-next>${chevron('m8 4 6 6-6 6')}</button>
        </div>
      </div>
    </div>`;

  const current = () => state.items[state.selected];
  const renderStage = (direction = 0) => {
    const car = current();
    const source = car.showroomImage || car.heroImage;
    const visual = $('[data-stage-visual]', stage);
    visual.classList.toggle('is-cutout', Boolean(car.showroomImage));
    stage.dataset.number = car.number;
    visual.innerHTML = `${pictureMarkup(source, `${car.name} ${t('w barwach Vistula Racing')}`, { loading: 'eager', sizes: '(max-width: 1024px) 100vw, 60vw' })}<span class="stage__floor" aria-hidden="true"></span>`;
    $('[data-stage-brand]', stage).innerHTML = brandLogos[car.manufacturer] ? `<img src="${escapeHtml(brandLogos[car.manufacturer])}" alt="${escapeHtml(t('Logo ') + car.manufacturer)}" height="36">` : escapeHtml(car.manufacturer);
    $('[data-stage-meta]', stage).textContent = `${carClassLabels[car.class]} · ${pad(state.selected + 1)} / ${pad(state.items.length)}`;
    $('[data-stage-title]', stage).innerHTML = `${escapeHtml(car.manufacturer)} <span>${escapeHtml(car.model)}</span>`;
    $('[data-stage-facts]', stage).innerHTML = `
      <div><dt>${escapeHtml(t('Numer'))}</dt><dd>#${escapeHtml(car.number)}</dd></div>
      <div><dt>${escapeHtml(t('Program'))}</dt><dd>${escapeHtml(carClassLabels[car.class])}</dd></div>
      ${car.seasons.length ? `<div><dt>${escapeHtml(t('Sezon'))}</dt><dd>${escapeHtml(car.seasons.join(', '))}</dd></div>` : ''}`;
    if (status) status.textContent = `${car.name}, ${carClassLabels[car.class]}, ${t('Numer').toLowerCase()} ${car.number}`;
    if (direction) {
      swapIn(visual, direction);
      swapIn($('.stage__copy', stage), 0, { duration: 360 });
    }
  };

  const markSelected = ({ scroll = false, focus = false } = {}) => {
    $$('[data-car-id]', list).forEach((button, index) => {
      const active = index === state.selected;
      button.setAttribute('aria-current', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus({ preventScroll: true });
      if (active && scroll) button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  };

  const select = (index, opts) => {
    const direction = Math.sign(index - state.selected);
    state.selected = (index + state.items.length) % state.items.length;
    renderStage(direction);
    markSelected(opts);
  };

  const renderList = () => {
    state.items = state.filter === 'all' ? cars : cars.filter((car) => car.class === state.filter);
    const firstShowroom = state.items.findIndex((car) => car.showroomImage);
    state.selected = Math.max(0, firstShowroom);
    list.innerHTML = state.items.map((car, index) => `
      <li><button class="fleet-item" type="button" data-car-id="${escapeHtml(car.id)}" aria-current="false" tabindex="-1">
        <span class="fleet-item__thumb">${pictureMarkup(car.image, '', { loading: index < 6 ? 'eager' : 'lazy', sizes: '(max-width: 1024px) 192px, 88px' })}</span>
        <span class="fleet-item__text"><strong>${brandLogos[car.manufacturer] ? `<img class="fleet-item__brand" src="${escapeHtml(brandLogos[car.manufacturer])}" alt="" height="16" loading="lazy">` : ''}${escapeHtml(car.name)}</strong><small>${escapeHtml(carClassLabels[car.class])} · #${escapeHtml(car.number)}</small></span>
      </button></li>`).join('');
    renderStage();
    markSelected();
  };

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fleet-filter]');
    if (!button) return;
    state.filter = button.dataset.fleetFilter;
    $$('[data-fleet-filter]', filters).forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderList();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-car-id]');
    if (button) select($$('[data-car-id]', list).indexOf(button));
  });
  // Strzałki przesuwają wybór (roving tabindex): jeden punkt tabulacji dla całej listy.
  list.addEventListener('keydown', (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (event.key in keys) select(state.selected + keys[event.key], { focus: true, scroll: true });
    else if (event.key === 'Home') select(0, { focus: true, scroll: true });
    else if (event.key === 'End') select(state.items.length - 1, { focus: true, scroll: true });
    else return;
    event.preventDefault();
  });

  $('[data-fleet-prev]', stage).addEventListener('click', () => select(state.selected - 1, { scroll: true }));
  $('[data-fleet-next]', stage).addEventListener('click', () => select(state.selected + 1, { scroll: true }));
  $('[data-stage-open]', stage).addEventListener('click', (event) => overlay.open('car', current().id, event.currentTarget));

  // Paleta Ctrl+K wybiera auto w konfiguratorze.
  document.addEventListener('vrt:select-car', (event) => {
    const id = event.detail?.id;
    if (!cars.some((car) => car.id === id)) return;
    if (state.filter !== 'all') {
      state.filter = 'all';
      $$('[data-fleet-filter]', filters).forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.fleetFilter === 'all')));
      renderList();
    }
    select(state.items.findIndex((car) => car.id === id), { scroll: true });
  });

  renderList();
}
