import { gallery } from '../data/archive.js';
import { $, bindDialog, openDialog, pad } from './dom.js';
import { t } from './i18n.js';
import { escapeHtml } from './safe.js';
import { bestImageSource, pictureMarkup } from './media.js';
import { swapIn } from './motion.js';

export function initGallery() {
  const grid = $('[data-gallery-grid]');
  const dialog = $('[data-lightbox]');
  if (!grid || !dialog) return;
  const image = $('[data-lightbox-image]', dialog);
  const prev = $('[data-lightbox-prev]', dialog);
  const next = $('[data-lightbox-next]', dialog);
  let items = gallery;
  let index = 0;
  let touchStart = 0;

  grid.innerHTML = gallery.map((item, position) => `
    <li class="tile tile--${escapeHtml(item.layout)}">
      <button class="tile__btn" type="button" data-gallery-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(`${t('Powiększ')}: ${item.title}`)}">
        ${pictureMarkup(item.thumbnail, item.alt, { loading: position < 2 ? 'eager' : 'lazy', sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 66vw, 600px' })}
        <span class="tile__cap"><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.title)}</strong></span>
      </button>
    </li>`).join('');

  const render = () => {
    const item = items[index];
    image.src = bestImageSource(item.image);
    image.alt = item.alt || item.title;
    $('[data-lightbox-label]', dialog).textContent = item.label || 'Vistula Archive';
    $('[data-lightbox-title]', dialog).textContent = item.title;
    $('[data-lightbox-description]', dialog).textContent = item.description || '';
    $('[data-lightbox-index]', dialog).textContent = `${pad(index + 1)} / ${pad(items.length)}`;
    $('[data-lightbox-meta]', dialog).innerHTML = [[t('Wydarzenie'), item.event], [t('Samochód'), item.car], [t('Kierowca'), item.driver], [t('Rok'), item.year]]
      .filter(([, value]) => value)
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    prev.hidden = items.length < 2;
    next.hidden = items.length < 2;
  };
  const open = (list, position, opener) => {
    items = list;
    index = position;
    render();
    openDialog(dialog, opener);
  };
  const move = (step) => {
    index = (index + step + items.length) % items.length;
    render();
    swapIn(image, step, { distance: 24, duration: 380 });
  };

  bindDialog(dialog);
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-id]');
    if (button) open(gallery, gallery.findIndex((item) => item.id === button.dataset.galleryId), button);
  });
  $('[data-lightbox-close]', dialog).addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && items.length > 1) move(-1);
    if (event.key === 'ArrowRight' && items.length > 1) move(1);
  });
  dialog.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 55 && items.length > 1) move(delta > 0 ? -1 : 1);
  }, { passive: true });

  // Zdjęcie z profilu (dialog zostaje pod spodem; Esc wraca do profilu).
  document.addEventListener('vrt:open-gallery-image', (event) => {
    const { image: source, caption, opener } = event.detail;
    open([{ image: source, thumbnail: source, alt: caption, label: 'Vistula Archive', title: caption, description: '', event: null, car: null, driver: null, year: null }], 0, opener);
  });
}
