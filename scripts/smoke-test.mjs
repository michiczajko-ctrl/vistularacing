/**
 * Headless smoke test (jsdom): loads the PL and EN pages, runs app.bundle.js and checks that
 * every dynamic section rendered and nothing threw. Not a visual test — run audit:ui for that.
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';
import { calendar, standings } from '../data/season.js';

const root = path.resolve(import.meta.dirname, '..');
const bundle = fs.readFileSync(path.join(root, 'app.bundle.js'), 'utf8');
const failures = [];

async function run(name, file, expectLang) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(error.message));
  virtualConsole.on('error', (error) => errors.push(String(error)));
  const html = fs.readFileSync(path.join(root, file), 'utf8').replace(/<script[^>]*src="[^"]*app\.bundle\.js[^"]*"[^>]*><\/script>/, '');
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  const { window } = dom;
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  window.HTMLDialogElement.prototype.showModal ||= function showModal() { this.open = true; };
  window.HTMLDialogElement.prototype.close ||= function close() { this.open = false; };
  window.HTMLMediaElement.prototype.pause = () => {};
  window.HTMLMediaElement.prototype.load = () => {};
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.scrollTo = () => {};
  window.Element.prototype.scrollTo = () => {};
  window.Element.prototype.scrollIntoView = () => {};
  window.eval(bundle);
  await new Promise((resolve) => setTimeout(resolve, 100));

  const d = window.document;
  const count = (selector) => d.querySelectorAll(selector).length;
  const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  const hasSeasonData = calendar.length > 0 || standings.length > 0;

  // Interakcje: wybór auta w konfiguratorze .
  const titleBefore = d.querySelector('[data-stage-title]')?.textContent;
  const items = [...d.querySelectorAll('[data-car-id]')];
  if (items[1]) click(items[1]);
  const titleAfter = d.querySelector('[data-stage-title]')?.textContent;

  const checks = {
    'html lang': d.documentElement.lang === expectLang,
    'history chapters': count('.chapter') === 3,
    'fleet cars': count('[data-car-id]') === 18,
    'fleet selection changes stage': Boolean(titleBefore) && titleBefore !== titleAfter,
    'programme tabs': count('[data-programme-tabs] [role="tab"]') === 4 && count('.roster__row') > 0,
    'driver cards': count('.driver') === 49,
    'racecontrol videos': count('.rc-videos video') === 2,
    'stats': count('[data-stats] > .stat') === 6,
    'gallery tiles': count('.tile') === 11,
    'partners': count('.partner') >= 1,
    'season hidden without data': d.querySelector('#season').hidden === !hasSeasonData,
    'hidden sections have no nav link': [...d.querySelectorAll('[data-site-nav] a[href$="#season"]')].every((a) => a.hidden === !hasSeasonData),
    'recruit form hidden when closed': count('.recruit-form') === 0,
    'footer socials': count('[data-footer-socials] a') === 4,
    'menu inert by default': d.querySelector('[data-mobile-menu]').hasAttribute('inert'),
    'no unsafe link schemes': [...d.querySelectorAll('a[href]')].every((a) => !/^\s*javascript:/i.test(a.getAttribute('href')))
  };
  if (expectLang === 'en') {
    checks['EN history'] = d.body.textContent.includes('Garage beginnings');
    checks['EN fleet filter'] = d.body.textContent.includes('All');
    checks['EN base href'] = d.querySelector('base')?.getAttribute('href') === '/';
    checks['EN anchors stay on /en/'] = [...d.querySelectorAll('[data-site-nav] a[href*="#"]')].every((a) => a.getAttribute('href').startsWith('/en/#'));
  } else {
    checks['PL history'] = d.body.textContent.includes('Garażowe początki');
    checks['PL anchors are local'] = [...d.querySelectorAll('[data-site-nav] a[href*="#"]')].every((a) => a.getAttribute('href').startsWith('#'));
  }
  for (const [label, ok] of Object.entries(checks)) if (!ok) failures.push(`${name}: ${label}`);
  errors.forEach((message) => failures.push(`${name}: błąd JS — ${message}`));
  window.close();
}

await run('PL', 'index.html', 'pl');
await run('EN', 'en/index.html', 'en');

if (failures.length) {
  console.error(`Smoke test nieudany (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('OK: smoke test PL + EN (render sekcji, brak błędów JS).');
