import { site } from '../data/site.js';
import { cars } from '../data/cars.js';
import { drivers } from '../data/drivers.js';
import { raceResults } from '../data/archive.js';
import { $ } from './dom.js';
import { t } from './i18n.js';
import { escapeHtml } from './safe.js';

/** Liczby zespołu: wartość końcowa jest od razu w HTML (animacja liczników dojdzie w etapie animacji). */
export function renderStats() {
  const root = $('[data-stats]');
  if (!root) return;
  const models = new Set(cars.map((car) => `${car.manufacturer}:${car.model}`)).size;
  const stats = [
    [site.record.wins, 'Zwycięstwa'],
    [site.record.podiums, 'Podia'],
    [site.record.championships, 'Mistrzostwa'],
    [drivers.length, 'Kierowcy'],
    [models, 'Modele aut']
  ];
  root.innerHTML = stats.map(([value, label]) => `<div class="stat"><dt>${escapeHtml(t(label))}</dt><dd><span class="visually-hidden">${value}</span><span aria-hidden="true" data-count="${value}">${value}</span></dd></div>`).join('');
}

export function renderAchievements() {
  const results = $('[data-results]');
  if (!results) return;
  results.innerHTML = `
    <header class="results__head"><h3>${escapeHtml(t('Wyniki'))}</h3></header>
    <ul class="results__list">${raceResults.map((item) => `
      <li class="result${item.result === 'P1' ? ' is-win' : ''}${/^P\d+$/.test(item.result) ? '' : ' is-text'}"><span class="result__place">${escapeHtml(item.result)}</span><div><strong>${escapeHtml(item.event)}</strong><small>${escapeHtml(item.people.join(' / '))}</small></div><span class="result__class">${escapeHtml(item.class)}</span></li>`).join('')}</ul>`;
}
