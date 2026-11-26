import { $, $$, goTo, mqReduce, prefersReducedMotion } from './dom.js';

/**
 * Kotwice na stronie: przewijanie + fokus na celu + wpis w historii.
 * Adres liczony z location.pathname, więc /en/ zostaje na /en/ (dawny bug: <base href="/"> przepisywał URL na PL).
 */
export function initAnchorNavigation() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    // Linki zaczynające się od „#” uznajemy za lokalne także na /en/ (tam <base href="/"> zmienia link.href).
    const raw = link.getAttribute('href');
    const url = new URL(link.href, location.href);
    if (!raw.startsWith('#') && url.pathname !== location.pathname) return;
    const hash = raw.startsWith('#') ? raw : url.hash;
    if (!hash || hash === '#') return;
    const target = $(decodeURIComponent(hash));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', `${location.pathname}${location.search}${hash}`);
    goTo(target);
  });
  window.addEventListener('popstate', () => {
    const target = location.hash ? $(decodeURIComponent(location.hash)) : null;
    if (target) goTo(target, { smooth: false });
  });
}

/* ---------- etap 4: animacje ---------- */

const REVEAL = [
  '.section-head', '.event', '.history__outro', '.stage', '.fleet__list',
  '.management', '.result', '.tile', '.partner',
  '.recruitment__form', '.drivers__grid > li', '.management > .person', '.vvs__steps > li', '.legend', '.roadmap > li', '.tower'
].join(', ');
const MAX_STAGGER = 6;

/**
 * Odsłanianie przy przewijaniu. Ukrywamy tylko elementy poniżej pierwszego ekranu, więc nic, co już widać, nie mruga.
 * Po zakończeniu przejścia klasy znikają i wracają zwykłe przejścia elementu (np. ramka karty przy hover).
 */
export function initReveals() {
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;
  const fold = window.innerHeight;
  const targets = $$(REVEAL).filter((el) => el.getBoundingClientRect().top > fold && !el.closest('[hidden]'));

  targets.forEach((el) => {
    const peers = [...el.parentElement.children].filter((child) => child.matches(REVEAL));
    el.style.setProperty('--reveal-i', String(Math.min(peers.indexOf(el), MAX_STAGGER)));
    el.classList.add('reveal');
  });

  const finish = (el) => {
    el.classList.remove('reveal', 'is-revealed');
    el.style.removeProperty('--reveal-i');
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      el.classList.add('is-revealed');
      el.addEventListener('transitionend', (event) => { if (event.target === el && event.propertyName === 'transform') finish(el); });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
  targets.forEach((el) => observer.observe(el));

  // Włączenie reduced-motion w trakcie wizyty: od razu stan końcowy.
  mqReduce.addEventListener('change', () => {
    if (!mqReduce.matches) return;
    observer.disconnect();
    targets.forEach(finish);
  });
}

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/** Liczniki statystyk: od 0 do wartości, raz, gdy wejdą w ekran. Czytniki ekranu dostają od razu wartość końcową. */
export function initCounters() {
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;
  const fold = window.innerHeight;
  const counters = $$('[data-count]').filter((el) => el.getBoundingClientRect().top > fold);
  counters.forEach((el) => { el.textContent = '0'; });

  const run = (el, delay) => {
    const target = Number(el.dataset.count);
    const duration = 1200;
    let start = 0;
    const frame = (now) => {
      if (!start) start = now + delay;
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      el.textContent = String(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      observer.unobserve(entry.target);
      run(entry.target, counters.indexOf(entry.target) * 80);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => observer.observe(el));
  mqReduce.addEventListener('change', () => {
    if (!mqReduce.matches) return;
    observer.disconnect();
    counters.forEach((el) => { el.textContent = el.dataset.count; });
  });
}

/**
 * Płynna podmiana treści (auto w konfiguratorze, panel programu, zdjęcie w lightboxie).
 * direction: 1 = z prawej, -1 = z lewej, 0 = samo pojawienie. Czeka na zdekodowanie obrazka, żeby nie animować pustki.
 */
export function swapIn(el, direction = 0, { distance = 40, duration = 520 } = {}) {
  if (!el?.animate || prefersReducedMotion()) return;
  const image = el.matches('img') ? el : $('img', el);
  const ready = image && !image.complete ? image.decode().catch(() => {}) : Promise.resolve();
  el.style.opacity = '0';
  ready.then(() => {
    el.style.removeProperty('opacity');
    el.animate(
      [{ opacity: 0, transform: `translateX(${direction * distance}px)` }, { opacity: 1, transform: 'none' }],
      { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  });
}
