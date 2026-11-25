import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import css from 'css';
import sharp from 'sharp';
import { site, history } from '../data/site.js';
import { cars, brandLogos } from '../data/cars.js';
import { drivers } from '../data/drivers.js';
import { achievements, raceResults, podiums, gallery, partners } from '../data/archive.js';
import { imageManifest } from '../data/image-manifest.js';
import { historyEn } from '../data/site.en.js';
import { calendar, standings } from '../data/season.js';
import { streamVideos } from '../data/streams.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const uniqueIds = (items, label) => {
  const ids = items.map((item) => item.id);
  assert(ids.every(Boolean), `${label}: każdy rekord musi mieć ID`);
  assert(new Set(ids).size === ids.length, `${label}: wykryto zduplikowane ID`);
};

const fileExists = (relativePath, label) => {
  if (!relativePath) return;
  assert(fs.existsSync(path.join(root, relativePath)), `${label}: brak pliku ${relativePath}`);
};

uniqueIds(cars, 'Samochody');
uniqueIds(drivers, 'Kierowcy');
uniqueIds(achievements, 'Osiągnięcia');
uniqueIds(gallery, 'Galeria');
uniqueIds(partners, 'Partnerzy');
uniqueIds(history, 'Historia');
uniqueIds(raceResults, 'Wyniki');
uniqueIds(podiums, 'Podia');
uniqueIds(history.flatMap((chapter) => chapter.events), 'Wydarzenia historii');

assert(new Date(site.foundedAt).getFullYear() === 2025, 'Data założenia musi wskazywać rok 2025');
assert(site.foundedLabel.endsWith('2025'), 'Etykieta daty założenia musi kończyć się rokiem 2025');
assert(site.foundedLabel === '26.07.2025', 'Oficjalna data VRT musi pozostać 26.07.2025');
assert(site.record.wins === 18 && site.record.podiums === 31 && site.record.championships === 2, 'Niespójne oficjalne statystyki');
assert(cars.length === 18, `Oczekiwano 18 konfiguracji aut, znaleziono ${cars.length}`);
assert(drivers.length === 49, `Oczekiwano 49 kierowców, znaleziono ${drivers.length}`);
assert(new Set(cars.map((car) => `${car.manufacturer}:${car.model}`)).size === 16, 'Liczba unikalnych modeli aut musi wynosić 16');

const carIds = new Set(cars.map((car) => car.id));
const driverIds = new Set(drivers.map((driver) => driver.id));

cars.forEach((car) => {
  fileExists(car.image, `Samochód ${car.id}`);
  fileExists(car.heroImage, `Samochód ${car.id}`);
  fileExists(car.showroomImage, `Showroom samochodu ${car.id}`);
  car.gallery.forEach((image) => fileExists(image, `Galeria samochodu ${car.id}`));
  car.liveries.forEach((livery) => fileExists(livery.image, `Malowanie samochodu ${car.id}`));
  car.drivers.forEach((id) => assert(driverIds.has(id), `Samochód ${car.id}: nieznany kierowca ${id}`));
});
for (const car of cars) {
  assert(Boolean(car.showroomImage), `Samochód ${car.id}: brak wycięcia showroom`);
  if (!car.showroomImage || !fs.existsSync(path.join(root, car.showroomImage))) continue;
  const image = sharp(path.join(root, car.showroomImage));
  const metadata = await image.metadata();
  const stats = await image.stats();
  assert(metadata.hasAlpha && stats.channels[3]?.min === 0 && stats.channels[3]?.max >= 200, `Samochód ${car.id}: wycięcie nie ma rzeczywistej przezroczystości`);
}

drivers.forEach((driver) => {
  fileExists(driver.photo, `Kierowca ${driver.id}`);
  fileExists(driver.sceneImage, `Scena kierowcy ${driver.id}`);
  fileExists(driver.showcaseImage, `Showcase kierowcy ${driver.id}`);
  if (driver.favoriteCarId) assert(carIds.has(driver.favoriteCarId), `Kierowca ${driver.id}: nieznane auto ${driver.favoriteCarId}`);
});

achievements.forEach((achievement) => {
  achievement.images.forEach((image) => fileExists(image, `Osiągnięcie ${achievement.id}`));
  if (achievement.carId) assert(carIds.has(achievement.carId), `Osiągnięcie ${achievement.id}: nieznane auto ${achievement.carId}`);
  achievement.driverIds.forEach((id) => assert(driverIds.has(id), `Osiągnięcie ${achievement.id}: nieznany kierowca ${id}`));
});

gallery.forEach((item) => {
  fileExists(item.image, `Galeria ${item.id}`);
  fileExists(item.thumbnail, `Miniatura galerii ${item.id}`);
});
Object.entries(brandLogos).forEach(([brand, file]) => fileExists(file, `Logo marki ${brand}`));
partners.forEach((partner) => fileExists(partner.logo, `Partner ${partner.id}`));
history.forEach((chapter) => {
  assert(chapter.events.length > 0, `Historia ${chapter.id}: brak wydarzeń`);
  chapter.events.forEach((event) => assert(Boolean(event.date && event.title && event.body), `Historia ${event.id}: niekompletny wpis`));
});
assert(achievements.filter((item) => item.tier === 'major').length === 2, 'Gablota wymaga dwóch tytułów');
assert(achievements.filter((item) => item.tier === 'minor').length === 4, 'Gablota wymaga czterech mniejszych trofeów');
Object.entries(imageManifest).forEach(([source, entry]) => {
  fileExists(source, `Manifest obrazów ${source}`);
  [...entry.avif, ...entry.webp].forEach((variant) => fileExists(variant.src, `Wariant obrazu ${source}`));
});

try {
  JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));
} catch (error) {
  errors.push(`firebase.json: ${error.message}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Nowe dane: kalendarz, klasyfikacje, transmisje, tłumaczenie historii
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
assert(new Set(calendar.map((round) => round.id)).size === calendar.length, 'Kalendarz: zduplikowane ID rund');
calendar.forEach((round) => {
  assert(isoDate.test(round.date) && !Number.isNaN(Date.parse(round.date)), `Kalendarz ${round.id}: data musi mieć format RRRR-MM-DD`);
  assert(Boolean(round.event && round.series), `Kalendarz ${round.id}: brak nazwy wydarzenia lub serii`);
  [round.resultUrl, round.streamUrl].filter(Boolean).forEach((url) => assert(/^https?:\/\//.test(url), `Kalendarz ${round.id}: link musi być http(s)`));
});
standings.forEach((row) => assert(Boolean(row.series && row.class && row.crew) && Number.isFinite(row.position) && (row.points === null || Number.isFinite(row.points)), `Klasyfikacja: niekompletny wiersz ${JSON.stringify(row)}`));
streamVideos.forEach((video) => assert(/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId), `Transmisja ${video.id}: niepoprawny youtubeId`));
assert(historyEn.length === history.length, 'Historia EN: inna liczba rozdziałów niż PL');
history.forEach((chapter, index) => {
  const translated = historyEn[index];
  assert(translated?.id === chapter.id, `Historia EN: rozdział ${chapter.id} w złej kolejności lub brak`);
  chapter.events.forEach((event, eventIndex) => {
    const other = translated?.events?.[eventIndex];
    assert(other?.id === event.id, `Historia EN: brak tłumaczenia wpisu ${event.id}`);
    assert(other?.machineDate === event.machineDate, `Historia EN: niezgodna data maszynowa wpisu ${event.id}`);
  });
});
for (const page of ['en/index.html', 'privacy.html', 'robots.txt', 'sitemap.xml', '404.html']) assert(fs.existsSync(path.join(root, page)), `Brak pliku ${page} (uruchom npm run build)`);
assert(html.includes('rel="canonical"') && html.includes('hreflang="en"') && html.includes('og:image" content="https://'), 'index.html: brak canonical / hreflang / absolutnego og:image');
assert(html.includes('src="app.bundle.js'), 'index.html: brak klasycznego bundle dla trybu file://');
assert(!html.includes('type="module"'), 'index.html: skrypt modułowy nie działa przy bezpośrednim otwarciu z dysku');
assert(!html.includes("classList.add('js')"), 'index.html: nie wolno ukrywać treści przed poprawnym uruchomieniem aplikacji');
['divisions', 'contact'].forEach((id) => assert(html.includes(`id="${id}"`), `index.html: brak zgodności starej kotwicy #${id}`));
const localLinks = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1].split('?')[0])
  .filter((target) => target && !/^(?:https?:|mailto:|#|data:)/.test(target));
localLinks.forEach((target) => fileExists(target, 'index.html'));

for (const stylesheet of fs.readdirSync(path.join(root, 'styles')).filter((file) => file.endsWith('.css'))) {
  const source = fs.readFileSync(path.join(root, 'styles', stylesheet), 'utf8');
  try {
    css.parse(source, { source: stylesheet });
  } catch (error) {
    errors.push(`CSS ${stylesheet}: ${error.message}`);
  }
}

assert(new Date(site.foundedAt).toISOString().startsWith('2025-07-26'), 'Oficjalna data w ISO musi wskazywać 26.07.2025');

if (errors.length) {
  console.error(`Walidacja nieudana (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`OK: ${cars.length} aut, ${drivers.length} kierowców, ${gallery.length} zdjęć, ${achievements.length} wpisy archiwum.`);
