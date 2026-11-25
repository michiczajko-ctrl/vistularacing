import { lmuCalendar } from './lmu-calendar.js';

/**
 * Season data. Fill these arrays in as rounds are confirmed - the site renders them
 * automatically (calendar, next-round countdown, standings). No code changes needed.
 *
 * @typedef {Object} Round
 * @property {string} id
 * @property {string} date            ISO date, e.g. '2026-10-17'
 * @property {string} [startTime]     Local start time 'HH:MM' (Europe/Warsaw), optional
 * @property {string} event           e.g. 'HEC Round 5'
 * @property {string} series          e.g. 'HEC'
 * @property {string} [track]
 * @property {string} [duration]      e.g. '6H'
 * @property {string[]} [classes]     e.g. ['Hypercar', 'LMGT3']
 * @property {string} [resultUrl]     Link to official results / timing
 * @property {string} [streamUrl]     Link to the stream
 * @property {string} [result]        e.g. 'P1 LMGT3'
 *
 * @typedef {Object} StandingRow
 * @property {string} series
 * @property {string} class
 * @property {number} position
 * @property {string} crew
 * @property {number} points
 */

export const season = Object.freeze({ year: 2026 });

/** @type {Round[]} */
/** Rundy Vistula Racing (udział, wynik, linki) - wpisuj ręcznie, tylko potwierdzone. */
const vistulaRounds = [];

/** Oficjalne wydarzenia LMU (generowane: npm run calendar). Nie oznaczają udziału zespołu. */
export const calendar = [...lmuCalendar, ...vistulaRounds];

/** Załogi sezonu. Puste miejsce = null (renderowane jako „Wolne miejsce”). */
export const crews = [{ number: '237', drivers: [null, null] }];

/** @type {StandingRow[]} */
export const standings = [];
