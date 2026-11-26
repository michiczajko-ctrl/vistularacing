import { bestImageSource, pictureMarkup } from './media.js';
import { bindDialog, openDialog } from './dom.js';
import { t } from './i18n.js';
import { squads } from '../data/squads.js';
import { escapeHtml, safeUrl } from './safe.js';

const hasValue = (value) => value !== null && value !== undefined && value !== '';
const statLabel = () => ({ races: t('Wyścigi'), starts: t('Starty'), wins: t('Zwycięstwa'), podiums: t('Podia'), poles: t('Pole position'), championships: t('Mistrzostwa') });

/** Profil auta, kierowcy lub trofeum w natywnym <dialog>. Zdjęcia z galerii otwierają lightbox nad profilem. */
export class DetailOverlay {
  constructor(dialog, { cars, drivers, achievements, carClassLabels }) {
    this.dialog = dialog;
    this.cars = cars;
    this.drivers = drivers;
    this.achievements = achievements;
    this.carClassLabels = carClassLabels;
    if (!dialog) return;
    bindDialog(dialog);
    dialog.querySelector('[data-detail-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', (event) => this.handleTabKeys(event));
  }

  open(type, id, opener = document.activeElement) {
    const item = this.getItem(type, id);
    if (!this.dialog || !item) return;
    this.render(type, item);
    openDialog(this.dialog, opener);
    this.dialog.querySelectorAll('.detail__shell, .detail__body').forEach((node) => { node.scrollTop = 0; });
  }

  getItem(type, id) {
    const source = { car: this.cars, driver: this.drivers, achievement: this.achievements }[type];
    return source?.find((item) => item.id === id) || null;
  }

  render(type, item) {
    const view = this.getPresentation(type, item);
    const image = this.dialog.querySelector('[data-detail-image]');
    this.dialog.classList.toggle('has-cutout', Boolean(view.cutout));
    image.src = bestImageSource(view.image, Math.min(window.innerWidth * 1.5, 1280));
    image.alt = view.alt;
    this.dialog.querySelector('[data-detail-type]').textContent = view.typeLabel;
    this.dialog.querySelector('[data-detail-title]').textContent = view.title;
    this.dialog.querySelector('[data-detail-subtitle]').textContent = view.subtitle;

    const panels = this.getPanels(type, item);
    this.dialog.querySelector('[data-detail-tabs]').innerHTML = panels.map((panel, index) => `
      <button type="button" role="tab" id="detail-tab-${panel.id}" aria-controls="detail-panel-${panel.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-detail-tab="${panel.id}">${escapeHtml(panel.label)}</button>`).join('');
    this.dialog.querySelector('[data-detail-panels]').innerHTML = panels.map((panel, index) => `
      <section role="tabpanel" id="detail-panel-${panel.id}" aria-labelledby="detail-tab-${panel.id}" ${index === 0 ? '' : 'hidden'} data-detail-panel="${panel.id}">${panel.content}</section>`).join('');

    this.dialog.querySelectorAll('[data-detail-tab]').forEach((button) => button.addEventListener('click', () => this.activateTab(button.dataset.detailTab)));
    this.dialog.querySelectorAll('[data-overlay-gallery-image]').forEach((button) => {
      button.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('vrt:open-gallery-image', {
          detail: { image: button.dataset.overlayGalleryImage, caption: button.dataset.overlayGalleryCaption || view.title, opener: button }
        }));
      });
    });
  }

  activateTab(id) {
    this.dialog.querySelectorAll('[data-detail-tab]').forEach((button) => {
      const active = button.dataset.detailTab === id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    this.dialog.querySelectorAll('[data-detail-panel]').forEach((panel) => { panel.hidden = panel.dataset.detailPanel !== id; });
  }

  handleTabKeys(event) {
    const current = event.target.closest?.('[data-detail-tab]');
    if (!current || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = [...this.dialog.querySelectorAll('[data-detail-tab]')];
    const index = tabs.indexOf(current);
    const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    event.preventDefault();
    this.activateTab(tabs[next].dataset.detailTab);
    tabs[next].focus();
  }

  getPresentation(type, item) {
    if (type === 'car') {
      return { image: item.showroomImage || item.heroImage, cutout: Boolean(item.showroomImage), alt: `${item.name} ${t('w barwach Vistula Racing')}`, typeLabel: t('Flota Vistula'), title: item.name, subtitle: `${this.carClassLabels[item.class]} · #${item.number}` };
    }
    if (type === 'driver') {
      return { image: item.showcaseImage || item.photo || 'assets/brand/vr_logo.png', cutout: Boolean(item.showcaseImage), alt: `${t('Portret kierowcy')} ${item.name}`, typeLabel: t('Zespół Vistula'), title: item.name, subtitle: item.number === '-' ? item.role : `${item.role} · #${item.number}` };
    }
    return { image: item.images[0] || 'assets/generated/trophy-race-small.webp', cutout: item.tier === 'minor', alt: item.tier === 'minor' ? `${t('Trofeum za')} ${item.title}` : `${t('Materiał archiwalny')}: ${item.title}`, typeLabel: t('Archiwum wyników'), title: item.title, subtitle: `${item.year} · ${item.type}` };
  }

  getPanels(type, item) {
    if (type === 'car') return this.getCarPanels(item);
    if (type === 'driver') return this.getDriverPanels(item);
    return this.getAchievementPanels(item);
  }

  fact(label, value, wide = false) {
    return `<div${wide ? ' class="is-wide"' : ''}><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
  }

  getCarPanels(car) {
    const names = car.drivers.map((id) => this.drivers.find((driver) => driver.id === id)?.name).filter(Boolean);
    const panels = [{
      id: 'overview',
      label: t('Przegląd'),
      content: `
        <div class="prose"><p>${escapeHtml(car.description || `${car.name} - ${t('Flota Vistula')}. ${t('Program')}: ${this.carClassLabels[car.class]}.`)}</p></div>
        <dl class="facts">
          ${this.fact(t('Producent'), escapeHtml(car.manufacturer))}
          ${this.fact(t('Model'), escapeHtml(car.model))}
          ${this.fact(t('Program'), escapeHtml(this.carClassLabels[car.class]))}
          ${this.fact(t('Numer'), `#${escapeHtml(car.number)}`)}
          ${car.seasons.length ? this.fact(t('Sezony'), escapeHtml(car.seasons.join(' / '))) : ''}
          ${names.length ? this.fact(t('Kierowcy'), escapeHtml(names.join(', ')), true) : ''}
        </dl>`
    }];
    if (Object.values(car.statistics).some(hasValue)) panels.push({ id: 'statistics', label: t('Statystyki'), content: this.renderStatistics(car.statistics) });
    if (car.importantMoments.length) panels.push({ id: 'history', label: t('Historia'), content: this.renderTimeline(car.importantMoments) });
    const images = [...car.gallery, ...car.liveries.map((livery) => livery.image)];
    if (images.length) panels.push({ id: 'gallery', label: t('Galeria'), content: this.renderGallery(images, car.name) });
    return panels;
  }

  getDriverPanels(driver) {
    const lineups = squads.flatMap((sim) => sim.teams.filter((team) => team.drivers.includes(driver.id)).map((team) => `${sim.short} · ${t(team.name)}`));
    const panels = [{
      id: 'overview',
      label: t('Przegląd'),
      content: `${driver.transfer ? `<p class="prose detail__transfer" data-transfer="${escapeHtml(driver.id)}">${escapeHtml(t(driver.transfer.note))}</p>` : ''}<dl class="facts">
        ${driver.number === '-' ? '' : this.fact(t('Numer'), `#${escapeHtml(driver.number)}`)}
        ${driver.nationality ? this.fact(t('Narodowość'), escapeHtml(driver.nationality)) : ''}
        ${this.fact(t('Rola'), escapeHtml(driver.role))}
        ${driver.joined ? this.fact(t('Dołączył'), escapeHtml(driver.joined)) : ''}
        ${lineups.length ? this.fact(t('Skład'), lineups.map(escapeHtml).join('<br>'), true) : ''}
      </dl>`
    }];
    if (Object.values(driver.statistics).some(hasValue)) panels.push({ id: 'statistics', label: t('Statystyki'), content: this.renderStatistics(driver.statistics) });
    const moments = [...driver.career, ...driver.moments];
    if (moments.length) panels.push({ id: 'history', label: t('Historia'), content: this.renderTimeline(moments) });
    if (driver.gallery.length) panels.push({ id: 'gallery', label: t('Galeria'), content: this.renderGallery(driver.gallery, driver.name) });
    return panels;
  }

  getAchievementPanels(item) {
    const people = [...item.driverIds.map((id) => this.drivers.find((driver) => driver.id === id)?.name).filter(Boolean), ...(item.driverNames || [])];
    const overview = `
      <div class="prose"><p>${escapeHtml(item.summary)}</p></div>
      <dl class="facts">
        ${this.fact(t('Rok'), escapeHtml(item.year))}
        ${item.event ? this.fact(t('Seria'), escapeHtml(item.event)) : ''}
        ${item.track ? this.fact(t('Tor'), escapeHtml(item.track)) : ''}
        ${item.result ? this.fact(t('Wynik'), escapeHtml(item.result)) : ''}
        ${people.length ? this.fact(t('Skład'), escapeHtml(people.join(', ')), true) : ''}
      </dl>
      ${item.sourceUrl ? `<a class="link-more detail__source" href="${escapeHtml(safeUrl(item.sourceUrl))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('Zobacz opublikowaną historię'))}</a>` : ''}`;
    return [{ id: 'overview', label: t('Przegląd'), content: overview }, ...(item.images.length ? [{ id: 'gallery', label: t('Galeria'), content: this.renderGallery(item.images, item.title) }] : [])];
  }

  renderStatistics(statistics) {
    const labels = statLabel();
    return `<div class="mini-stats">${Object.entries(statistics).map(([key, value]) => `<div><strong>${hasValue(value) ? escapeHtml(value) : '-'}</strong><span>${escapeHtml(labels[key] || key)}</span></div>`).join('')}</div>`;
  }

  renderTimeline(items) {
    return `<ol class="timeline">${items.map((entry) => `<li><time>${escapeHtml(entry.year)}</time><div><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.description)}</p></div></li>`).join('')}</ol>`;
  }

  renderGallery(images, title) {
    return `<div class="gallery-mini">${images.map((image, index) => `
      <button type="button" data-overlay-gallery-image="${escapeHtml(image)}" data-overlay-gallery-caption="${escapeHtml(`${title} · ${index + 1}`)}" aria-label="${escapeHtml(`${t('Powiększ')}: ${title} · ${index + 1}`)}">
        ${pictureMarkup(image, '', { sizes: '(max-width: 640px) 50vw, 180px' })}
      </button>`).join('')}</div>`;
  }
}
