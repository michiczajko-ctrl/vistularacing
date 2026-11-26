import { $ } from './dom.js';

/*
 * Ruch sterowany z JS: słowa tytułu w maskach, poświata i tilt za kursorem.
 * Scroll (pasek postępu, parallax) robi CSS scroll-driven animations w styles/wow.css.
 */
const media = (query) => window.matchMedia?.(query).matches ?? false;
const reduce = () => media('(prefers-reduced-motion: reduce)');
const finePointer = () => media('(hover: hover) and (pointer: fine)');

function progressBar() {
  const header = $('.site-header');
  if (header) header.insertAdjacentHTML('beforeend', '<div class="progress" aria-hidden="true"><i></i></div>');
}

/** Tytuł hero: każde słowo w masce, wjeżdża po kolei. Etykieta zostaje na h1, więc czytnik czyta całość. */
function splitWords(el) {
  const label = (el.innerText || el.textContent).replace(/\s+/g, ' ').trim();
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const mask = document.createElement('span');
          const word = document.createElement('span');
          mask.className = 'w';
          word.textContent = part;
          word.style.setProperty('--i', String(i++));
          mask.append(word);
          frag.append(mask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
    });
  };
  el.setAttribute('aria-label', label);
  walk(el);
  el.classList.add('js-split');
}

const GLOW = '.person, .legend, .tower, .driver';
const TILT = '.driver';

/** Jedna para nasłuchów na dokumencie: karty są renderowane dynamicznie, więc delegacja. */
function pointerEffects() {
  let current = null;
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const glow = event.target.closest?.(GLOW);
    if (glow) {
      const box = glow.getBoundingClientRect();
      glow.style.setProperty('--mx', `${event.clientX - box.left}px`);
      glow.style.setProperty('--my', `${event.clientY - box.top}px`);
    }
    const tilt = event.target.closest?.(TILT);
    if (current && current !== tilt) { current.style.removeProperty('--rx'); current.style.removeProperty('--ry'); }
    current = tilt || null;
    if (tilt) {
      const box = tilt.getBoundingClientRect();
      tilt.style.setProperty('--ry', `${(((event.clientX - box.left) / box.width - 0.5) * 10).toFixed(2)}deg`);
      tilt.style.setProperty('--rx', `${(((event.clientY - box.top) / box.height - 0.5) * -10).toFixed(2)}deg`);
    }
    const button = event.target.closest?.('.btn-primary');
    if (button) {
      const box = button.getBoundingClientRect();
      button.style.setProperty('--bx', `${((event.clientX - box.left) / box.width - 0.5) * 8}px`);
      button.style.setProperty('--by', `${((event.clientY - box.top) / box.height - 0.5) * 6}px`);
    }
  }, { passive: true });
  document.addEventListener('pointerout', (event) => {
    const gone = event.target.closest?.(`${TILT}, .btn-primary`);
    if (!gone || gone.contains(event.relatedTarget)) return;
    ['--rx', '--ry', '--bx', '--by'].forEach((name) => gone.style.removeProperty(name));
  });
}

export function initWow() {
  progressBar();
  headerState();
  if (reduce()) { document.documentElement.classList.add('is-ready'); return; }
  const title = $('.hero h1');
  if (title) splitWords(title);
  // dwie klatki przerwy, żeby przejście słów tytułu wystartowało
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('is-ready')));
  if (finePointer()) pointerEffects();
}

/** Przezroczysty nagłówek na hero, szkło po przewinięciu. */
function headerState() {
  const header = $('.site-header');
  if (!header) return;
  const set = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  set();
  window.addEventListener('scroll', set, { passive: true });
}

