import { $ } from './dom.js';
import { escapeHtml } from './safe.js';

/* Dane przykładowe: podgląd interfejsu VRS Racecontrol, nie prawdziwe wyniki. */
const field = [
  { no: '777', name: 'Vistula Racing' },
  { no: '12', name: 'Baltic Endurance' },
  { no: '88', name: 'Tatra Motorsport' },
  { no: '31', name: 'Śląsk GT Racing' },
  { no: '54', name: 'Mazury Racing' },
  { no: '09', name: 'Kaszuby Sim Team' }
];
const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

export function renderTower() {
  const root = $('[data-tower]');
  if (!root) return;
  const order = field.map((_, i) => i);

  const paint = (flashed = -1) => {
    root.innerHTML = order.map((id, place) => `<li class="${id === flashed ? 'is-flash' : ''}">
      <b>${place + 1}</b><span class="tower__no">#${escapeHtml(field[id].no)}</span><strong>${escapeHtml(field[id].name)}</strong>
      <small>${place === 0 ? 'LEADER' : `+${(place * 1.37 + (id % 3) * 0.21).toFixed(3)}`}</small></li>`).join('');
  };
  paint();
  if (mqReduce.matches) return;

  // Co kilka sekund dwa sąsiednie auta zamieniają się miejscami; nie liczymy, gdy karta jest ukryta.
  setInterval(() => {
    if (document.hidden) return;
    const at = 1 + Math.floor(Math.random() * (order.length - 1));
    [order[at - 1], order[at]] = [order[at], order[at - 1]];
    paint(order[at - 1]);
  }, 2600);
}
