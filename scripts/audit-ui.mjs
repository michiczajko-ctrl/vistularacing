/**
 * Audyt w prawdziwej przeglądarce: układ na wielu szerokościach, błędy konsoli/HTTP, axe (PL + EN, też z otwartym dialogiem),
 * klawiatura (skip-link, Ctrl+K), tryb file:// i prefers-reduced-motion. Zrzuty trafiają do <tmp>/vrt-audit.
 * Chrome: zmienna CHROME_PATH, systemowy Chrome (macOS/Windows/Linux) albo Chrome for Testing z ~/.cache/puppeteer.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { AxePuppeteer } from '@axe-core/puppeteer';

const root = path.resolve(import.meta.dirname, '..');
const baseUrl = process.env.VRT_URL || 'http://127.0.0.1:4173/';
const auditDir = path.join(os.tmpdir(), 'vrt-audit');
fs.mkdirSync(auditDir, { recursive: true });

function findChrome() {
  const cache = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  const cached = fs.existsSync(cache) ? fs.readdirSync(cache).flatMap((version) => [
    path.join(cache, version, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
    path.join(cache, version, 'chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
    path.join(cache, version, 'chrome-linux64', 'chrome'),
    path.join(cache, version, 'chrome-win64', 'chrome.exe')
  ]) : [];
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    ...cached
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('Nie znaleziono Chrome. Ustaw CHROME_PATH albo uruchom: npx @puppeteer/browsers install chrome@stable');
  return found;
}

const server = process.env.VRT_URL ? null : spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, stdio: 'ignore' });
const stopServer = () => server?.kill();
process.on('exit', stopServer);

for (let attempt = 0; ; attempt += 1) {
  try {
    if ((await fetch(baseUrl)).ok) break;
  } catch {}
  if (attempt > 40) throw new Error(`Lokalny serwer nie odpowiada: ${baseUrl}`);
  await new Promise((resolve) => setTimeout(resolve, 150));
}

const viewports = [
  { name: '2560', width: 2560, height: 1440 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'mobile-360', width: 360, height: 800, isMobile: true, hasTouch: true },
  { name: 'landscape-667', width: 667, height: 375, isMobile: true, hasTouch: true }
];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ['--no-sandbox', '--mute-audio', '--allow-file-access-from-files'] });
const failures = [];
const results = [];

const watch = (page, label, sink) => {
  page.on('console', (message) => { if (message.type() === 'error') sink.push(`${label}: konsola: ${message.text()}`); });
  page.on('pageerror', (error) => sink.push(`${label}: błąd JS: ${error.message}`));
  page.on('response', (response) => { if (response.status() >= 400) sink.push(`${label}: HTTP ${response.status()} ${response.url()}`); });
};
const ready = (page) => page.waitForFunction(() => document.querySelectorAll('[data-car-id]').length === 18, { timeout: 10000 });
// axe ocenia stan końcowy: odsłaniamy elementy i czekamy na koniec animacji czasowych (otwieranie dialogu, przejścia).
const settle = (page) => page.evaluate(async () => {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-revealed'));
  await new Promise((resolve) => setTimeout(resolve, 50));
  await Promise.all(document.getAnimations().filter((animation) => animation.timeline === document.timeline && animation.effect.getComputedTiming().iterations !== Infinity).map((animation) => animation.finished.catch(() => {})));
});
const axeFailures = async (page, label) => {
  await settle(page);
  const { violations } = await new AxePuppeteer(page).analyze();
  violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))
    .forEach((violation) => failures.push(`${label}: axe ${violation.id} (${violation.nodes.map((node) => node.target.join(' ')).slice(0, 4).join(' | ')})`));
};

try {
  for (const viewport of viewports) {
    const page = await browser.newPage();
    watch(page, viewport.name, failures);
    await page.setViewport(viewport);
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await ready(page);
    await page.evaluate(() => document.fonts?.ready);

    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      cars: document.querySelectorAll('[data-car-id]').length,
      drivers: document.querySelectorAll('.driver').length,
      chapters: document.querySelectorAll('.chapter').length,
      results: document.querySelectorAll('.result').length,
      tiles: document.querySelectorAll('.tile').length,
      tiny: [...document.querySelectorAll('body *')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).length
    }));
    if (layout.overflow > 1) failures.push(`${viewport.name}: poziomy overflow ${layout.overflow}px`);
    if (layout.cars !== 18 || layout.drivers !== 50 || layout.chapters !== 3 || layout.results !== 23 || layout.tiles !== 11) failures.push(`${viewport.name}: niepełne dane ${JSON.stringify(layout)}`);
    if (layout.tiny) failures.push(`${viewport.name}: ${layout.tiny} elementów z tekstem < 12px`);

    if (viewport.name === '1440') {
      await page.screenshot({ path: path.join(auditDir, 'home-1440.png') });
      await axeFailures(page, 'PL 1440');
      await page.keyboard.press('Tab');
      if (!(await page.evaluate(() => document.activeElement.classList.contains('skip-link')))) failures.push('1440: pierwszy Tab nie trafia w skip-link');
      await page.keyboard.press('Escape');
      await page.evaluate(() => document.querySelector('[data-stage-open]').click());
      await page.waitForSelector('[data-detail-overlay][open]');
      await axeFailures(page, 'PL profil auta');
      await page.keyboard.press('Escape');
      await page.evaluate(() => document.querySelector('.tile__btn').click());
      await page.waitForSelector('[data-lightbox][open]');
      await axeFailures(page, 'PL lightbox');
      await page.keyboard.press('Escape');
    }
    if (viewport.name === 'mobile-390') {
      await page.screenshot({ path: path.join(auditDir, 'home-390.png') });
      await axeFailures(page, 'PL 390');
      await page.tap('[data-menu-toggle]');
      await wait(450); // koniec przejścia opacity menu, inaczej axe mierzy kontrast w połowie animacji
      if (!(await page.evaluate(() => document.querySelector('[data-mobile-menu]').classList.contains('is-open')))) failures.push('390: menu nie otwiera się');
      await axeFailures(page, 'PL menu mobilne');
      await page.keyboard.press('Escape');
    }
    results.push({ viewport: viewport.name, ...layout });
    await page.close();
  }

  const en = await browser.newPage();
  watch(en, 'EN', failures);
  await en.setViewport({ width: 1440, height: 900 });
  await en.goto(`${baseUrl}en/`, { waitUntil: 'networkidle0' });
  await ready(en);
  await en.click('[data-site-nav] a[href$="#fleet"]');
  await wait(2000);
  const enPath = await en.evaluate(() => location.pathname + location.hash);
  if (enPath !== '/en/#fleet') failures.push(`EN: nawigacja zmieniła adres na ${enPath} zamiast /en/#fleet`);
  await axeFailures(en, 'EN 1440');
  await en.close();

  // file:// działa tylko dla wersji PL (EN korzysta z <base href="/">).
  const file = await browser.newPage();
  watch(file, 'file://', failures);
  await file.setViewport({ width: 1440, height: 900 });
  const fileUrl = pathToFileURL(path.join(root, 'index.html')).href;
  await file.goto(`${fileUrl}#divisions`, { waitUntil: 'domcontentloaded' });
  await ready(file);
  await wait(500);
  const target = await file.evaluate(() => { const rect = document.querySelector('#fleet').getBoundingClientRect(); return rect.top < window.innerHeight * 0.55 && rect.bottom > 0; });
  if (!target) failures.push('file://: stary adres #divisions nie prowadzi do floty');
  await file.close();

  // Animacje: po przewinięciu całej strony nic nie może zostać ukryte; CLS i LCP do raportu.
  const motionPage = await browser.newPage();
  watch(motionPage, 'animacje', failures);
  await motionPage.setViewport({ width: 1440, height: 900 });
  await motionPage.evaluateOnNewDocument(() => {
    window.__cls = 0;
    window.__lcp = 0;
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => { window.__lcp = list.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await motionPage.goto(baseUrl, { waitUntil: 'networkidle0' });
  await ready(motionPage);
  await wait(500);
  const { pendingAtLoad, lcp } = await motionPage.evaluate(() => ({ pendingAtLoad: document.querySelectorAll('.reveal').length, lcp: Math.round(window.__lcp) }));
  const pageHeight = await motionPage.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= pageHeight; y += 450) {
    await motionPage.evaluate((top) => window.scrollTo(0, top), y);
    await wait(90);
  }
  await wait(1800);
  const motionState = await motionPage.evaluate(() => ({
    left: document.querySelectorAll('.reveal:not(.is-revealed)').length,
    invisible: [...document.querySelectorAll('main h2, .stat, .tile, .driver')].filter((el) => !el.closest('[hidden]') && getComputedStyle(el).opacity !== '1').length,
    counters: [...document.querySelectorAll('[data-count]')].every((el) => el.textContent === el.dataset.count),
    cls: Number(window.__cls.toFixed(4))
  }));
  if (!pendingAtLoad) failures.push('animacje: żaden element nie czeka na odsłonięcie (initReveals nie działa)');
  if (motionState.left || motionState.invisible) failures.push(`animacje: po przewinięciu nadal ukryte elementy ${JSON.stringify(motionState)}`);
  if (!motionState.counters) failures.push('animacje: liczniki nie doszły do wartości końcowej');
  if (motionState.cls > 0.1) failures.push(`animacje: CLS ${motionState.cls} > 0.1`);
  results.push({ viewport: 'animacje-1440', pendingAtLoad, lcpAtLoad: lcp, ...motionState });
  await motionPage.close();

  const reduced = await browser.newPage();
  watch(reduced, 'reduced-motion', failures);
  await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await reduced.setViewport({ width: 1440, height: 900 });
  await reduced.goto(baseUrl, { waitUntil: 'networkidle0' });
  await ready(reduced);
  const motion = await reduced.evaluate(() => ({
    hiddenByReveal: document.querySelectorAll('.reveal').length,
    runningAnimations: document.getAnimations().filter((animation) => animation.playState === 'running' && animation.timeline === document.timeline).length,
    videoPlaying: document.querySelector('[data-hero-video]')?.paused === false,
    allVisible: [...document.querySelectorAll('h1, h2')].every((el) => getComputedStyle(el).opacity === '1')
  }));
  if (motion.videoPlaying) failures.push('reduced-motion: wideo hero nadal gra');
  if (motion.hiddenByReveal || motion.runningAnimations) failures.push(`reduced-motion: animacje aktywne ${JSON.stringify(motion)}`);
  if (!motion.allVisible) failures.push('reduced-motion: nagłówki nie są widoczne');
  await reduced.close();
} finally {
  await browser.close();
  stopServer();
}

console.log(JSON.stringify(results, null, 1));
console.log(`Zrzuty: ${auditDir}`);
if (failures.length) {
  console.error(`Audyt UI nieudany (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('OK: audyt UI (układ, axe, klawiatura, file://, reduced-motion).');
