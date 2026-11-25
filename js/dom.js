export const $ = (selector, scope = document) => scope?.querySelector?.(selector) || null;
export const $$ = (selector, scope = document) => (scope?.querySelectorAll ? [...scope.querySelectorAll(selector)] : []);
export const pad = (number) => String(number).padStart(2, '0');

export const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
export const prefersReducedMotion = () => mqReduce.matches;

/* ---------- blokada scrolla z licznikiem (zagnieżdżone dialogi nie gubią blokady) ---------- */
let locks = 0;
const root = document.documentElement;
export const lock = () => { locks += 1; root.classList.add('is-locked'); };
export const unlock = () => { locks = Math.max(0, locks - 1); if (!locks) root.classList.remove('is-locked'); };

/** Podpina zachowanie wspólne dla dialogów: zwrot fokusu, klik w tło, odblokowanie scrolla. */
export function bindDialog(dialog) {
  if (!dialog) return;
  dialog.addEventListener('close', () => {
    unlock();
    const opener = dialog._opener;
    dialog._opener = null;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (outside) dialog.close();
  });
}

export function openDialog(dialog, opener = document.activeElement) {
  if (!dialog || dialog.open) return;
  dialog._opener = opener;
  dialog.showModal();
  lock();
}

/** Przewija do elementu i przenosi na niego fokus (cel kotwicy musi dać się sfokusować). */
export function goTo(target, { smooth = !prefersReducedMotion() } = {}) {
  if (!target) return;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
