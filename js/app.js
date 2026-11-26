import { site } from '../data/site.js';
import { cars, carClassLabels } from '../data/cars.js';
import { drivers } from '../data/drivers.js';
import { achievements } from '../data/archive.js';
import { $, goTo } from './dom.js';
import { DetailOverlay } from './detail-overlay.js';
import { initAnchorNavigation, initReveals, initCounters } from './motion.js';
import { initNav, syncNavLinks } from './nav.js';
import { renderHistory } from './history.js';
import { renderFleet } from './fleet.js';
import { renderTeam } from './team.js';
import { renderStats, renderAchievements } from './achievements.js';
import { initGallery } from './gallery.js';
import { renderPartners, renderRecruitmentPanel, renderFooter } from './partners.js';
import { renderSeason, renderRecruitForm, initAnalytics } from './features.js';
import { renderTower, initRacecontrolTabs } from './racecontrol.js';
import { initWow } from './wow.js';

const legacyHashes = { '#about': '#history', '#divisions': '#fleet', '#contact': '#recruitment' };

/** Każdy moduł startuje osobno: błąd w jednym nie ucina reszty strony. */
const step = (name, fn) => {
  try {
    fn();
  } catch (error) {
    console.error(`[vrt] ${name}`, error);
  }
};

function init() {
  if (legacyHashes[location.hash]) history.replaceState(null, '', `${location.pathname}${location.search}${legacyHashes[location.hash]}`);

  const overlay = new DetailOverlay($('[data-detail-overlay]'), { cars, drivers, achievements, carClassLabels });

  step('nav', initNav);
  step('stats', renderStats);
  step('history', renderHistory);
  step('fleet', () => renderFleet({ overlay }));
  step('team', () => renderTeam({ overlay }));
  step('achievements', () => renderAchievements());
  step('season', () => { $('#season').hidden = !renderSeason(); });
  step('gallery', initGallery);
  step('partners', renderPartners);
  step('recruitment', () => { renderRecruitmentPanel(); renderRecruitForm(site); });
  step('racecontrol', renderTower);
  step('racecontrol-tabs', () => initRacecontrolTabs({ overlay }));
  step('footer', renderFooter);
  step('wow', initWow);
  step('analytics', () => initAnalytics(site));
  step('links', syncNavLinks);
  step('anchors', initAnchorNavigation);
  step('reveals', initReveals);
  step('counters', initCounters);

  // Sekcje renderowane przez JS zmieniają wysokość strony, więc natywne przewinięcie do #hash trzeba powtórzyć.
  const target = location.hash.length > 1 ? $(decodeURIComponent(location.hash)) : null;
  if (target) goTo(target, { smooth: false });
}

init();
