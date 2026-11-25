/**
 * Generates, from the Polish index.html (source of truth):
 *   1. a no-JS fallback (<noscript>) with the real content, injected between the prerender markers
 *   2. en/index.html (English page) by applying the PL -> EN pairs below
 *   3. sitemap.xml
 * Run via `npm run build`. Idempotent.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { site, history } from '../data/site.js';
import { historyEn } from '../data/site.en.js';
import { drivers } from '../data/drivers.js';
import { cars } from '../data/cars.js';
import { partners, raceResults } from '../data/archive.js';

const root = path.resolve(import.meta.dirname, '..');
const origin = 'https://vistularacingteam.web.app';
const esc = (value = '') => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const BEGIN = '<!-- prerender:begin -->';
const END = '<!-- prerender:end -->';

/* ---------- 1. no-JS fallback ---------- */
const fallback = (lang) => {
  const en = lang === 'en';
  const chapters = en ? historyEn : history;
  const L = en
    ? { h: 'Vistula Racing - summary', hist: 'History', team: 'Drivers', fleet: 'Fleet', results: 'Recent results', partners: 'Partners', note: 'This page works best with JavaScript enabled.' }
    : { h: 'Vistula Racing - podsumowanie', hist: 'Historia', team: 'Kierowcy', fleet: 'Flota', results: 'Ostatnie wyniki', partners: 'Partnerzy', note: 'Ta strona działa najlepiej z włączonym JavaScript.' };
  const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  return `<noscript>
      <section class="container noscript-note" aria-label="${esc(L.h)}">
        <h2>${esc(L.h)}</h2>
        <p>${esc(L.note)}</p>
        <h3>${L.hist}</h3>
        ${chapters.map((chapter) => `<h4>${esc(chapter.years)} - ${esc(chapter.title)}</h4>${list(chapter.events.map((event) => `<strong>${esc(event.date)}: ${esc(event.title)}.</strong> ${esc(event.body)}`))}`).join('')}
        <h3>${L.team}</h3>
        ${list(drivers.map((driver) => `${esc(driver.name)} - #${esc(driver.number)}`))}
        <h3>${L.fleet}</h3>
        ${list(cars.map((car) => `${esc(car.name)} #${esc(car.number)}`))}
        <h3>${L.results}</h3>
        ${list(raceResults.map((item) => `${esc(item.result)} - ${esc(item.event)} (${esc(item.class)})`))}
        <h3>${L.partners}</h3>
        ${list(partners.map((partner) => (partner.url ? `<a href="${esc(partner.url)}" rel="noopener noreferrer">${esc(partner.name)}</a>` : esc(partner.name))))}
        <p><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a> · <a href="${esc(site.contact.discord)}" rel="noopener noreferrer">Discord</a> · <a href="${esc(site.contact.instagram)}" rel="noopener noreferrer">Instagram</a></p>
      </section>
    </noscript>`;
};

const inject = (html, lang) => html.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), `${BEGIN}\n    ${fallback(lang)}\n    ${END}`);

/* ---------- 2. English page ---------- */
const PAIRS = [
  /* head */
  ['<html lang="pl">', '<html lang="en">'],
  ['content="Vistula Racing - polski zespół simracingowy endurance. Inżynieria, strategia i praca zespołowa, stint po stincie."', 'content="Vistula Racing - a Polish endurance simracing team. Engineering, strategy and teamwork, stint after stint."'],
  ['<title>Vistula Racing - polski zespół simracingowy endurance</title>', '<title>Vistula Racing - Polish endurance simracing team</title>'],
  ['<link rel="canonical" href="https://vistularacingteam.web.app/">', '<link rel="canonical" href="https://vistularacingteam.web.app/en/">'],
  ['<meta property="og:locale" content="pl_PL">', '<meta property="og:locale" content="en_GB">'],
  ['<meta property="og:locale:alternate" content="en_GB">', '<meta property="og:locale:alternate" content="pl_PL">'],
  ['<meta property="og:url" content="https://vistularacingteam.web.app/">', '<meta property="og:url" content="https://vistularacingteam.web.app/en/">'],
  ['content="Polski zespół simracingowy endurance. Cyfrowe archiwum samochodów, kierowców i wyników Vistula Racing."', 'content="Polish endurance simracing team. A digital archive of Vistula Racing cars, drivers and results."'],
  ['content="Polski zespół simracingowy endurance. Cyfrowe archiwum samochodów, kierowców i wyników."', 'content="Polish endurance simracing team. A digital archive of cars, drivers and results."'],
  ['content="Samochody wyścigowe Vistula Racing na torze"', 'content="Vistula Racing race cars on track"'],
  /* nagłówek i menu */
  ['Przejdź do treści', 'Skip to content'],
  ['aria-label="Vistula Racing - strona główna"', 'aria-label="Vistula Racing - home"'],
  ['aria-label="Główna nawigacja"', 'aria-label="Main navigation"'],
  ['<a href="#history">Historia</a>', '<a href="#history">History</a>'],
  ['<a href="#fleet">Flota</a>', '<a href="#fleet">Fleet</a>'],
  ['<a href="#team">Zespół</a>', '<a href="#team">Team</a>'],
  ['<a href="#achievements">Wyniki</a>', '<a href="#achievements">Results</a>'],
  ['<a href="#season" hidden>Sezon</a>', '<a href="#season" hidden>Season</a>'],
  ['<a href="#gallery">Galeria</a>', '<a href="#gallery">Gallery</a>'],
  ['<a href="#partners">Partnerzy</a>', '<a href="#partners">Partners</a>'],
  ['<a href="#recruitment">Rekrutacja</a>', '<a href="#recruitment">Recruitment</a>'],
  ['<a class="lang-switch" href="en/" hreflang="en" lang="en" aria-label="English version">EN</a>', '<a class="lang-switch" href="./" hreflang="pl" lang="pl" aria-label="Wersja polska">PL</a>'],
  ['href="#recruitment">Dołącz</a>', 'href="#recruitment">Apply</a>'],
  ['aria-label="Otwórz menu"', 'aria-label="Open menu"'],
  ['aria-label="Menu mobilne"', 'aria-label="Mobile menu"'],
  ['<a href="en/" hreflang="en" lang="en">English version</a>', '<a href="./" hreflang="pl" lang="pl">Wersja polska</a>'],
  /* hero */
  ['Dane, strategia i wspólna odpowiedzialność zamieniają tempo w wynik - stint po stincie, sezon po sezonie.', 'Data, strategy and shared responsibility turn pace into results - stint after stint, season after season.'],
  ['href="#fleet">Poznaj flotę</a>', 'href="#fleet">Discover the fleet</a>'],
  ['<p class="hero__eyebrow">Polski zespół simracingowy &middot; endurance</p>', '<p class="hero__eyebrow">Polish endurance simracing team</p>'],
  ['aria-label="Przewiń w dół"', 'aria-label="Scroll down"'],
  ['href="#history">Nasza historia</a>', 'href="#history">Our story</a>'],
  /* tożsamość */
  /* historia */
  ['Historia zapisana<br><span class="outline">w stintach.</span>', 'A history written<br><span class="outline">in stints.</span>'],
  ['Od publicznych lobby do mistrzostw. Wybierz rozdział i przeczytaj historię ludzi, którzy zbudowali Vistulę.', 'From public lobbies to championships. Pick a chapter and read the story of the people who built Vistula.'],
  ['aria-label="Rozdziały historii"', 'aria-label="History chapters"'],
  /* flota */
  ['<span data-model-count>16</span> modeli.<br><span class="outline">Jedna flota.</span>', '<span data-model-count>16</span> models.<br><span class="outline">One fleet.</span>'],
  ['Cyfrowy showroom konfiguracji Vistula Racing. Wybierz klasę i samochód, aby zobaczyć jego profil.', 'A digital showroom of Vistula Racing configurations. Pick a class and a car to see its profile.'],
  ['aria-label="Filtruj flotę"', 'aria-label="Filter the fleet"'],
  ['aria-label="Samochody floty"', 'aria-label="Fleet cars"'],
  ['Włącz JavaScript, aby uruchomić interaktywny showroom floty.', 'Enable JavaScript to run the interactive fleet showroom.'],
  /* zespół */
  ['Jeden zespół.<br>Cztery programy.', 'One team.<br>Four programmes.'],
  ['Samochód prowadzi opowieść o programie. Poznaj kadrę każdej klasy i otwórz profil kierowcy.', 'The car tells the story of the programme. Meet the roster of each class and open a driver profile.'],
  ['aria-label="Wybierz program"', 'aria-label="Choose a programme"'],
  ['<h3>Wszyscy kierowcy</h3>', '<h3>All drivers</h3>'],
  ['Zaznacz dwie osoby, aby zestawić ich profile obok siebie.', 'Select two people to compare their profiles side by side.'],
  ['aria-label="Filtruj kierowców"', 'aria-label="Filter drivers"'],
  /* wyniki, sezon, transmisje, galeria, partnerzy */
  ['Wyniki tworzą<br><span class="outline">archiwum.</span>', 'Results build<br><span class="outline">the archive.</span>'],
  ['Wynik to praca całej załogi. Najważniejsze tytuły oglądaj w gablocie zespołu.', 'A result is the work of the whole crew. See the most important titles in the team cabinet.'],
  ['Sezon<br>runda po rundzie.', 'The season,<br>round by round.'],
  ['Kalendarz, najbliższy start i klasyfikacje Vistula Racing w jednym miejscu.', 'The Vistula Racing calendar, next start and standings in one place.'],
  ['Prędkość<br>w kadrze.', 'Speed<br>in frame.'],
  ['Tor, studio i chwile poza scenariuszem. Kliknij kadr, aby wejść do pełnoekranowego archiwum.', 'Track, studio and unscripted moments. Click a frame to open the full-screen archive.'],
  ['Wspólny<br>kierunek.', 'A shared<br>direction.'],
  ['Partnerstwa są częścią przygotowań i historii Vistula Racing. Poznaj organizacje, które wspierają zespół.', 'Partnerships are part of Vistula Racing’s preparation and history. Meet the organisations that support the team.'],
  ['<a class="btn btn-ghost" href="#achievements">Wyniki</a>', '<a class="btn btn-ghost" href="#achievements">Results</a>'],
  ['aria-label="Partnerzy"', 'aria-label="Partners"'],
  ['<span>Partnerzy</span>', '<span>Partners</span>'],
  /* nowe sekcje: seria, zarząd, legendy, Racecontrol */
  ['<a href="#vvs">Seria</a>', '<a href="#vvs">Series</a>'],
  ['<a href="#management">Zarząd</a>', '<a href="#management">Management</a>'],
  ['Vistula Vision<br>Series.', 'Vistula Vision<br>Series.'],
  ['Własna seria ligowa, tworzona z Vision Performance Racing Team. Zaczęliśmy od prologu na Fuji.', 'Our own league series, built with Vision Performance Racing Team. We started with the Fuji prologue.'],
  ['>Oglądaj na Twitchu</a>', '>Watch on Twitch</a>'],
  ['<strong>Partnerstwo z Vision Performance</strong><p>Wspólne przygotowanie kierowców i wspólny kierunek dla nowej serii.</p>', '<strong>Partnership with Vision Performance</strong><p>Shared driver preparation and a shared direction for the new series.</p>'],
  ['<time>Sezon 2026</time>', '<time>2026 season</time>'],
  ['<strong>Prolog na Fuji</strong><p>Pierwszy wyścig serii. Na starcie kierowcy Hypercar i GT3.</p>', '<strong>Fuji prologue</strong><p>The first race of the series. Hypercar and GT3 drivers on the grid.</p>'],
  ['<strong>Pierwszy pełny sezon</strong><p>Kalendarz, klasy i zasady ogłosimy na Discordzie i na kanale serii.</p>', '<strong>First full season</strong><p>We will announce the calendar, classes and rules on Discord and on the series channel.</p>'],
  ['Zarząd<br>zespołu.', 'Team<br>management.'],
  ['Struktura, strategia i kierunek zespołu. Kierowców i programy znajdziesz niżej.', 'Structure, strategy and direction of the team. Drivers and programmes are below.'],
  ['<span class="badge">W produkcji</span>', '<span class="badge">In production</span>'],
  ['VRS<br>Racecontrol.', 'VRS<br>Racecontrol.'],
  ['Tworzymy VRS Racecontrol, aplikację do prowadzenia wyścigów: sędziowanie, wyniki na żywo i narzędzia dla organizatorów.', 'We are building VRS Racecontrol, an app for running races: stewarding, live results and tools for organisers.'],
  ['<strong>Sędziowanie</strong><span>Zgłoszenia incydentów, kary, decyzje</span><em>W budowie</em>', '<strong>Stewarding</strong><span>Incident reports, penalties, decisions</span><em>In progress</em>'],
  ['<strong>Wyniki na żywo</strong><span>Tablica czasów i klasyfikacje</span><em>W budowie</em>', '<strong>Live results</strong><span>Timing board and standings</span><em>In progress</em>'],
  ['<strong>Panel organizatora</strong><span>Kalendarz, składy, zgłoszenia</span><em>Planowane</em>', '<strong>Organiser panel</strong><span>Calendar, line-ups, entries</span><em>Planned</em>'],
  ['<strong>Integracja z serią</strong><span>Vistula Vision Series</span><em>Planowane</em>', '<strong>Series integration</strong><span>Vistula Vision Series</span><em>Planned</em>'],
  ['aria-label="Podgląd: tablica wyników VRS Racecontrol (dane przykładowe)"', 'aria-label="Preview: VRS Racecontrol results board (sample data)"'],
  ['<span>Podgląd na żywo</span>', '<span>Live preview</span>'],
  ['<i aria-hidden="true"></i> Dane przykładowe', '<i aria-hidden="true"></i> Sample data'],
  /* FAQ */
  /* rekrutacja i stopka */
  ['Nabór zamknięty.<br>Kolejny - TBA.', 'Recruitment closed.<br>Next intake - TBA.'],
  ['<h3>Zgłoś się do zespołu</h3>', '<h3>Apply to the team</h3>'],
  ['Wypełnij formularz - otworzymy gotowy e-mail do zespołu. Odpowiadamy po zamknięciu naboru.', 'Fill in the form - we will open a ready-made email to the team. We reply once the intake closes.'],
  ['<a href="privacy.html">Prywatność</a>', '<a href="privacy.html">Privacy</a>'],
  ['aria-label="Nawigacja w stopce"', 'aria-label="Footer navigation"'],
  /* dialogi */
  ['aria-label="Zamknij profil"', 'aria-label="Close profile"'],
  ['aria-label="Zakładki profilu"', 'aria-label="Profile tabs"'],
  ['data-detail-title>Profil</h2>', 'data-detail-title>Profile</h2>'],
  ['aria-label="Zamknij galerię"', 'aria-label="Close gallery"'],
  ['aria-label="Poprzednie zdjęcie"', 'aria-label="Previous photo"'],
  ['aria-label="Następne zdjęcie"', 'aria-label="Next photo"'],
];

const polishLetters = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

/** Ostrzega (nie przerywa builda), gdy w angielskiej stronie został widoczny tekst z polskimi znakami. */
const warnUntranslated = (html) => {
  const visible = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, '');
  const found = new Set();
  for (const match of visible.matchAll(/>([^<>]+)</g)) if (polishLetters.test(match[1])) found.add(match[1].trim());
  for (const match of visible.matchAll(/\s(?:aria-label|alt|placeholder|title)="([^"]+)"/g)) if (polishLetters.test(match[1])) found.add(match[1]);
  if (found.size) {
    console.warn(`build-site: ${found.size} tekst(ów) w en/index.html nadal po polsku (dopisz parę w PAIRS):`);
    [...found].forEach((item) => console.warn(`  - ${item.slice(0, 90)}`));
  }
};

const toEnglish = (html) => {
  let out = html;
  const missing = [];
  for (const [pl, en] of PAIRS) {
    if (!out.includes(pl)) { missing.push(pl); continue; }
    out = out.split(pl).join(en);
  }
  if (missing.length) {
    console.error(`build-site: ${missing.length} PL->EN pair(s) not found in index.html (update scripts/build-site.mjs):`);
    missing.forEach((item) => console.error(`  - ${item.slice(0, 90)}`));
    process.exit(1);
  }
  warnUntranslated(out);
  // <base href="/"> pozwala używać tych samych względnych ścieżek do zasobów, ale kotwice #x
  // rozwiązywałyby się wtedy do polskiej strony „/”. Kotwice dostają więc jawną ścieżkę /en/.
  return out.replace(/href="#/g, 'href="/en/#').replace('<meta name="viewport"', '<base href="/">\n  <meta name="viewport"');
};

/* ---------- cache-busting: ?v= to skrót zawartości CSS i bundla, liczony przy każdym buildzie ---------- */
const hash = crypto.createHash('sha1');
for (const file of fs.readdirSync(path.join(root, 'styles')).filter((name) => name.endsWith('.css')).sort()) hash.update(fs.readFileSync(path.join(root, 'styles', file)));
hash.update(fs.readFileSync(path.join(root, 'app.bundle.js')));
const stamp = hash.digest('hex').slice(0, 8);
const withStamp = (html) => html.replace(/((?:styles\/[\w.-]+\.css|app\.bundle\.js))\?v=[\w.-]+/g, `$1?v=${stamp}`);
const privacyPath = path.join(root, 'privacy.html');
fs.writeFileSync(privacyPath, withStamp(fs.readFileSync(privacyPath, 'utf8')));

const indexPath = path.join(root, 'index.html');
let pl = withStamp(fs.readFileSync(indexPath, 'utf8'));
pl = inject(pl, 'pl');
fs.writeFileSync(indexPath, pl);

let en = toEnglish(pl);
en = inject(en, 'en');
fs.mkdirSync(path.join(root, 'en'), { recursive: true });
fs.writeFileSync(path.join(root, 'en', 'index.html'), en);

/* ---------- 3. sitemap ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = [['/', 'pl'], ['/en/', 'en'], ['/privacy.html', null]];
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(([loc, lang]) => `  <url>
    <loc>${origin}${loc}</loc>
    <lastmod>${today}</lastmod>${lang ? `
    <xhtml:link rel="alternate" hreflang="pl" href="${origin}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en/"/>` : ''}
  </url>`).join('\n')}
</urlset>
`);

console.log('OK: no-JS fallback, en/index.html, sitemap.xml wygenerowane.');
