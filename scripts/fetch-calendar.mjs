/**
 * Pobiera oficjalny kalendarz Le Mans Ultimate i zapisuje go do data/lmu-calendar.js.
 * Błąd sieci lub zmiana układu strony nie przerywa buildu: zostaje poprzedni plik.
 * Udział Vistula Racing w rundach NIE jest wpisywany automatycznie (patrz data/season.js).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://lemansultimate.com/special-events-calendar-q3-4-2026/';
const target = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/lmu-calendar.js');
const YEAR = 2026;

const slug = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** "w/c 10/11 - 8 Hours Bahrain - Hypercar, LMGT3" */
export function parseCalendar(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<\/?(h\d|p|li|tr|td|div|br)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
  const rounds = [];
  for (const line of text.split('\n')) {
    const m = line.trim().match(/^w\/c\s+(\d{1,2})\/(\d{1,2})\s*-\s*(\d+(?:\.\d+)?)\s*Hours?\s+(.+?)\s*[-,]\s*((?:Hypercar|WEC|LMGT3|LMP2|LMP3).*)$/i);
    if (!m) continue;
    const [, day, month, hours, track, classes] = m;
    const date = `${YEAR}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    rounds.push({
      id: `lmu-${date}-${slug(track)}`,
      date,
      weekOf: true,
      event: `${hours}H ${track.trim()}`,
      series: 'LMU Special Event',
      track: track.trim(),
      duration: `${hours}H`,
      classes: classes.split(',').map((item) => item.trim()).filter(Boolean),
      sourceUrl: SOURCE
    });
  }
  return rounds;
}

async function main() {
  try {
    const response = await fetch(SOURCE, { headers: { 'user-agent': 'Mozilla/5.0 (vistula-site-build)' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rounds = parseCalendar(await response.text());
    if (!rounds.length) throw new Error('nie znaleziono żadnej rundy (zmienił się układ strony?)');
    const body = `/** Generowane przez scripts/fetch-calendar.mjs z ${SOURCE}. Nie edytuj ręcznie. */\nexport const lmuCalendar = ${JSON.stringify(rounds, null, 2)};\n`;
    fs.writeFileSync(target, body);
    console.log(`OK: kalendarz LMU, ${rounds.length} rund.`);
  } catch (error) {
    console.warn(`UWAGA: nie odświeżono kalendarza LMU (${error.message}); zostaje poprzedni plik.`);
    if (!fs.existsSync(target)) fs.writeFileSync(target, `export const lmuCalendar = [];\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
