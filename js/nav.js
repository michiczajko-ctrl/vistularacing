import { $, $$, lock, unlock } from './dom.js';
import { t } from './i18n.js';

const desktop = window.matchMedia('(min-width: 64rem)');

/** Ukrywa linki do sekcji, które są schowane (brak danych), żeby nie prowadziły donikąd. */
export function syncNavLinks() {
  $$('[data-site-nav] a, [data-mobile-menu] a').forEach((link) => {
    if (!link.hash) return;
    const target = $(link.hash);
    if (target) link.hidden = target.hidden;
  });
}

export function initNav() {
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  const main = $('main');
  const footer = $('.site-footer');
  if (!toggle || !menu) return;

  const setMenu = (open, { restoreFocus = false } = {}) => {
    if (open === isOpen()) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? t('Zamknij menu') : t('Otwórz menu'));
    menu.inert = !open;
    menu.classList.toggle('is-open', open);
    if (open) lock();
    else unlock();
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (open) $('a:not([hidden])', menu)?.focus({ preventScroll: true });
    else if (restoreFocus) toggle.focus({ preventScroll: true });
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setMenu(!isOpen()));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  desktop.addEventListener('change', () => { if (desktop.matches && isOpen()) setMenu(false); });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      setMenu(false, { restoreFocus: true });
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [toggle, ...$$('a[href]:not([hidden])', menu)];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  initScrollSpy();
}

/** Podświetla w nawigacji sekcję pod środkiem ekranu; obserwuje wszystkie sekcje, nie tylko te z menu. */
function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const links = $$('[data-site-nav] a');
  const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
  const sections = $$('main > section[id]');
  const visible = new Set();

  const update = () => {
    const current = sections.filter((section) => visible.has(section)).at(-1);
    links.forEach((link) => link.removeAttribute('aria-current'));
    byId.get(current?.id)?.setAttribute('aria-current', 'true');
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
    update();
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
