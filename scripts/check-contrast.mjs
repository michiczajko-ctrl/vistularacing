/**
 * Kontrast par kolorów z tokenów (styles/tokens.css) dla każdego motywu sekcji.
 * Tekst ≥ 4.5:1, obramowania i ikony ≥ 3:1 (WCAG 2.2 AA). Kolory rgb()/alfa pomijamy (zależą od tła).
 */
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(path.resolve(import.meta.dirname, '..', 'styles', 'tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
  selector: selector.trim(),
  vars: Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]))
}));

const themes = ['ink', 'navy', 'paper', 'mist'];
const environment = (theme) => {
  const env = {};
  for (const rule of rules) if (rule.selector === ':root') Object.assign(env, rule.vars);
  for (const rule of rules) if (rule.selector.split(',').some((s) => s.trim() === `[data-theme='${theme}']`)) Object.assign(env, rule.vars);
  return env;
};
const resolve = (env, value, depth = 0) => {
  const match = /^var\((--[\w-]+)\)$/.exec(value || '');
  return match && depth < 8 ? resolve(env, env[match[1]], depth + 1) : value;
};
const channel = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const ratio = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const failures = [];
for (const theme of themes) {
  const env = environment(theme);
  const get = (name) => resolve(env, env[name]);
  const pairs = [
    ['--fg', '--bg', 4.5], ['--muted', '--bg', 4.5], ['--muted', '--surface', 4.5], ['--accent', '--bg', 4.5],
    ['--on-accent', '--accent', 4.5], ['--on-accent', '--accent-hover', 4.5], ['--line', '--bg', 3], ['--focus', '--bg', 3]
  ];
  for (const [fg, bg, min] of pairs) {
    const [a, b] = [get(fg), get(bg)];
    if (!/^#[0-9a-f]{6}$/i.test(a || '') || !/^#[0-9a-f]{6}$/i.test(b || '')) { failures.push(`${theme}: ${fg}/${bg} nie da się obliczyć (${a} / ${b})`); continue; }
    const value = ratio(a, b);
    if (value < min) failures.push(`${theme}: ${fg} ${a} na ${bg} ${b} = ${value.toFixed(2)}:1 (wymagane ${min}:1)`);
  }
}
if (failures.length) {
  console.error(`Kontrast tokenów nieudany (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('OK: kontrast tokenów (4 motywy: tekst ≥ 4.5:1, obramowania i fokus ≥ 3:1).');
