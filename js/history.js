import { history as historyPl } from '../data/site.js';
import { historyEn, historyOutroEn } from '../data/site.en.js';
import { $, $$ } from './dom.js';
import { lang, t } from './i18n.js';
import { escapeHtml } from './safe.js';

export const localHistory = lang === 'en' ? historyEn : historyPl;

const outro = () => (lang === 'en'
  ? historyOutroEn
  : { kicker: 'Est. 2025 · Roots since 2022', title: 'Jedziemy dalej.', body: 'Historia Vistuli składa się z prób, błędów i ludzi, którzy za każdym razem decydowali się wrócić na tor. Od publicznych lobby do podium - jeden zespół, jeden długi wyścig.' });

/** Rozdziały jako przełączniki: widać jeden naraz (domyślnie najnowszy), reszta ma `hidden`. */
export function renderHistory() {
  const nav = $('[data-history-nav]');
  const chronicle = $('[data-history-chronicle]');
  if (!nav || !chronicle) return;

  nav.innerHTML = localHistory.map((chapter) => `
    <button class="history__nav-link" type="button" aria-pressed="false" data-history-link="${chapter.id}">
      <strong>${chapter.years}</strong><span>${chapter.title}</span>
    </button>`).join('');

  chronicle.innerHTML = localHistory.map((chapter) => `
    <section class="chapter" id="chapter-${chapter.id}" data-history-chapter="${chapter.id}" aria-labelledby="chapter-title-${chapter.id}" hidden>
      <header class="chapter__head"><h3 id="chapter-title-${chapter.id}">${chapter.years} - ${chapter.title}</h3><p>${chapter.lead}</p></header>
      <div class="chapter__events">${chapter.events.map((event) => `
        <article class="event" id="archive-${event.id}">
          <div class="event__date">${event.machineDate ? `<time datetime="${event.machineDate}">${event.date}</time>` : `<span>${event.date}</span>`}</div>
          <div class="event__copy">
            <h4>${event.title}</h4>
            <p>${event.body}</p>
            ${event.people ? `<p class="event__crew"><span class="visually-hidden">${escapeHtml(t('Załoga'))}:</span>${event.people.map((person) => `<span>${person}</span>`).join('')}</p>` : ''}
            ${event.note ? `<blockquote class="event__note">${event.note}</blockquote>` : ''}
          </div>
        </article>`).join('')}</div>
    </section>`).join('') + (() => {
    const o = outro();
    return `<div class="history__outro"><strong>${escapeHtml(o.title)}</strong><p>${escapeHtml(o.body)}</p><span>${escapeHtml(o.kicker)}</span></div>`;
  })();

  const show = (id) => {
    $$('[data-history-chapter]', chronicle).forEach((chapter) => { chapter.hidden = chapter.dataset.historyChapter !== id; });
    $$('[data-history-link]', nav).forEach((link) => link.setAttribute('aria-pressed', String(link.dataset.historyLink === id)));
  };
  /** Kotwica do wpisu (#archive-…, #chapter-…) w ukrytym rozdziale: najpierw go pokaż, potem przewijanie zadziała. */
  const showForHash = (hash) => {
    let target = null;
    try { target = hash.length > 1 ? chronicle.querySelector(decodeURIComponent(hash)) : null; } catch { /* hash nie jest selektorem */ }
    const chapter = target?.closest('[data-history-chapter]');
    if (chapter) show(chapter.dataset.historyChapter);
  };

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('[data-history-link]');
    if (link) show(link.dataset.historyLink);
  });
  // Faza przechwytywania: przed obsługą kotwic w js/motion.js, która przewija do celu.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href*="#"]');
    if (link) showForHash(new URL(link.href, location.href).hash);
  }, true);
  window.addEventListener('popstate', () => showForHash(location.hash));

  show(localHistory[localHistory.length - 1].id);
  showForHash(location.hash);
}
