import { calendar, standings, crews, season } from '../data/season.js';
import { $, pad } from './dom.js';
import { escapeHtml, safeUrl, isYoutubeId } from './safe.js';
import { t, formatDate, lang } from './i18n.js';

const external = 'target="_blank" rel="noopener noreferrer"';

/** Data i godzina rundy są w czasie Europe/Warsaw, niezależnie od strefy odwiedzającego. */
function warsawInstant(date, time = '12:00') {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Warsaw', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  const offsetAt = (ms) => {
    const p = Object.fromEntries(formatter.formatToParts(new Date(ms)).map((part) => [part.type, part.value]));
    return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute) - ms;
  };
  const first = guess - offsetAt(guess);
  return new Date(guess - offsetAt(first));
}
const roundStart = (round) => warsawInstant(round.date, round.startTime || '12:00');

/** Zwraca true, gdy jest co pokazać. Sekcja bez danych zostaje ukryta (decyduje app.js). */
export function renderSeason() {
  const root = $('[data-season]');
  if (!root || (!calendar.length && !standings.length)) return false;

  const now = new Date();
  const rounds = [...calendar].sort((a, b) => roundStart(a) - roundStart(b));
  const next = rounds.find((round) => !round.weekOf && roundStart(round) >= now);

  // Pas w hero: najbliższy start, także gdy znany jest tylko tydzień.
  const upcoming = rounds.find((round) => roundStart(round) >= now);
  const heroNext = $('[data-hero-next]');
  if (heroNext && upcoming) {
    heroNext.hidden = false;
    heroNext.innerHTML = `<small>${escapeHtml(t('Najbliższa runda'))}</small><strong>${escapeHtml(upcoming.event)}</strong><time datetime="${escapeHtml(upcoming.date)}">${upcoming.weekOf ? `${escapeHtml(t('Tydz. od'))} ` : ''}${escapeHtml(formatDate(upcoming.date, { day: 'numeric', month: 'short' }))}</time>`;
  }

  const nextBlock = next ? `
    <div class="next-round card">
      <p>${escapeHtml(t('Najbliższa runda'))}</p>
      <h3>${escapeHtml(next.event)}</h3>
      <p>${escapeHtml([next.track, next.duration, (next.classes || []).join(' · ')].filter(Boolean).join(' · '))}</p>
      <div class="countdown" role="timer" data-countdown="${roundStart(next).toISOString()}">
        <span><b data-cd-days>00</b><small>${escapeHtml(t('Dni'))}</small></span>
        <span><b data-cd-hours>00</b><small>${escapeHtml(t('Godz.'))}</small></span>
        <span><b data-cd-mins>00</b><small>${escapeHtml(t('Min.'))}</small></span>
      </div>
      <p><time datetime="${escapeHtml(next.date)}">${escapeHtml(formatDate(next.date))}</time>${next.startTime ? ` · ${escapeHtml(next.startTime)} (${escapeHtml(t('czas warszawski'))})` : ''}</p>
    </div>` : '';

  const rows = rounds.map((round) => {
    const done = roundStart(round) < now;
    const links = [
      round.resultUrl ? `<a href="${escapeHtml(safeUrl(round.resultUrl))}" ${external}>${escapeHtml(t('Wyniki'))}</a>` : '',
      round.streamUrl ? `<a href="${escapeHtml(safeUrl(round.streamUrl))}" ${external}>${escapeHtml(t('Transmisja'))}</a>` : ''
    ].join('');
    return `<li class="calendar__row ${round === next ? 'is-next' : ''}">
      <time datetime="${escapeHtml(round.date)}">${round.weekOf ? escapeHtml(t('Tydz. od')) + ' ' : ''}${escapeHtml(formatDate(round.date, { day: 'numeric', month: 'short' }))}</time>
      <div><strong>${escapeHtml(round.event)}</strong><small>${escapeHtml([round.series, round.track, round.duration].filter(Boolean).join(' · '))}</small></div>
      ${round.result || done ? `<span class="calendar__status">${escapeHtml(round.result || t('Zakończona'))}</span>` : ''}
      ${links ? `<span class="calendar__links">${links}</span>` : ''}
    </li>`;
  }).join('');

  const crewsBlock = crews.map((crew) => `
    <div class="crew"><b class="crew__no">#${escapeHtml(crew.number)}</b><ul>${crew.drivers.map((d) => `<li class="${d ? '' : 'is-open'}">${escapeHtml(d || t('Wolne miejsce'))}</li>`).join('')}</ul></div>`).join('');

  const groups = new Map();
  standings.forEach((row) => {
    const key = `${row.series} · ${row.class}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });
  const standingsBlock = [...groups].map(([key, list]) => `
    <div class="standings">
      <h4>${escapeHtml(key)}</h4>
      <table>
        <caption class="visually-hidden">${escapeHtml(key)}</caption>
        <thead><tr><th scope="col">${escapeHtml(t('Pozycja'))}</th><th scope="col">${escapeHtml(t('Załoga / zespół'))}</th><th scope="col">${escapeHtml(t('Punkty'))}</th></tr></thead>
        <tbody>${[...list].sort((a, b) => a.position - b.position).map((row) => `<tr><td>${escapeHtml(row.position)}</td><td>${escapeHtml(row.crew)}</td><td>${escapeHtml(row.points ?? '-')}</td></tr>`).join('')}</tbody>
      </table>
    </div>`).join('');

  root.innerHTML = `
    ${nextBlock}
    <div class="season__cols">
      ${rounds.length ? `<div><h3 class="season__title">${escapeHtml(t('Kalendarz sezonu'))} ${escapeHtml(season.year)}</h3><ol class="calendar">${rows}</ol></div>` : ''}
      <div>${crews.length ? `<h3 class="season__title">${escapeHtml(t('Załogi'))}</h3>${crewsBlock}` : ''}${groups.size ? `<h3 class="season__title">${escapeHtml(t('Klasyfikacje'))}</h3>${standingsBlock}` : '<p class="season__loading" role="status"><span>Loading</span><i></i></p>'}</div>
    </div>`;

  const timer = $('[data-countdown]', root);
  if (timer) {
    const target = new Date(timer.dataset.countdown).getTime();
    const days = $('[data-cd-days]', timer);
    const hours = $('[data-cd-hours]', timer);
    const mins = $('[data-cd-mins]', timer);
    const tick = () => {
      const left = Math.max(0, target - Date.now());
      days.textContent = pad(Math.floor(left / 86400000));
      hours.textContent = pad(Math.floor(left / 3600000) % 24);
      mins.textContent = pad(Math.floor(left / 60000) % 60);
      if (!left) clearInterval(id);
    };
    const id = setInterval(tick, 30000);
    tick();
  }
  return true;
}

/* ---------- formularz rekrutacyjny (bez backendu: składa e-mail) ---------- */

export function renderRecruitForm(site) {
  const root = $('[data-recruit-form]');
  if (!root) return;
  if (site.recruitment.status !== 'open') {
    root.closest('.recruitment__form')?.setAttribute('hidden', '');
    return;
  }
  const en = lang === 'en';
  const L = en
    ? { nick: 'Discord nickname', name: 'Name', country: 'Country', prog: 'Programme', exp: 'Level', hours: 'Hours per week', about: 'About you (experience, best results, setup)', consent: 'I agree to the processing of the data above for the purpose of this recruitment.', send: 'Open email', copy: 'Copy message', subject: 'Driver application', req: 'required', errNick: 'Enter your Discord nickname.', errAbout: 'Briefly describe your experience.', errConsent: 'Tick the consent box to send the application.', fix: 'Fix the highlighted fields.' }
    : { nick: 'Nick na Discordzie', name: 'Imię', country: 'Kraj', prog: 'Program', exp: 'Poziom', hours: 'Godzin tygodniowo', about: 'O Tobie (doświadczenie, wyniki, sprzęt)', consent: 'Wyrażam zgodę na przetwarzanie powyższych danych w celu rekrutacji.', send: 'Otwórz e-mail', copy: 'Skopiuj treść', subject: 'Zgłoszenie kierowcy', req: 'wymagane', errNick: 'Podaj nick na Discordzie.', errAbout: 'Opisz krótko swoje doświadczenie.', errConsent: 'Zaznacz zgodę, aby wysłać zgłoszenie.', fix: 'Popraw zaznaczone pola.' };

  root.innerHTML = `
    <form class="recruit-form" novalidate>
      <div class="field"><label for="rf-nick">${L.nick} (${L.req})</label><input id="rf-nick" name="nick" required maxlength="60" autocomplete="nickname"></div>
      <div class="field"><label for="rf-name">${L.name}</label><input id="rf-name" name="name" maxlength="60" autocomplete="given-name"></div>
      <div class="field"><label for="rf-country">${L.country}</label><input id="rf-country" name="country" maxlength="60" autocomplete="country-name"></div>
      <div class="field"><label for="rf-programme">${L.prog}</label><select id="rf-programme" name="programme">${site.recruitment.programs.map((p) => `<option>${escapeHtml(p)}</option>`).join('')}</select></div>
      <div class="field"><label for="rf-level">${L.exp}</label><select id="rf-level" name="level"><option>AM</option><option>PRO-AM</option><option>PRO</option></select></div>
      <div class="field"><label for="rf-hours">${L.hours}</label><input id="rf-hours" name="hours" type="number" min="0" max="80" inputmode="numeric"></div>
      <div class="field field-wide"><label for="rf-about">${L.about} (${L.req})</label><textarea id="rf-about" name="about" rows="4" required maxlength="1500"></textarea></div>
      <div class="field field-wide"><label class="consent"><input id="rf-consent" type="checkbox" name="consent" required><span>${L.consent}</span></label></div>
      <div class="recruit-actions field-wide">
        <button class="btn btn-primary" type="submit">${L.send}</button>
        <button class="btn btn-quiet" type="button" data-copy>${L.copy}</button>
      </div>
      <p class="form-status field-wide" role="status" aria-live="polite" data-form-status></p>
    </form>`;

  const form = $('form', root);
  const status = $('[data-form-status]', root);

  const setError = (control, message) => {
    const host = control.closest('.field');
    let error = $('.field__error', host);
    if (!message) {
      error?.remove();
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
      return;
    }
    if (!error) {
      error = document.createElement('p');
      error.className = 'field__error';
      error.id = `${control.id}-error`;
      host.append(error);
    }
    error.textContent = message;
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', error.id);
  };

  const checks = [['#rf-nick', (c) => c.value.trim(), L.errNick], ['#rf-about', (c) => c.value.trim(), L.errAbout], ['#rf-consent', (c) => c.checked, L.errConsent]];
  form.addEventListener('input', (event) => {
    const check = checks.find(([selector]) => event.target.matches(selector));
    if (check && check[1](event.target)) setError(event.target, '');
  });

  const valid = () => {
    let first = null;
    checks.forEach(([selector, ok, message]) => {
      const control = $(selector, form);
      const good = ok(control);
      setError(control, good ? '' : message);
      if (!good && !first) first = control;
    });
    status.textContent = first ? L.fix : '';
    first?.focus();
    return !first;
  };

  const compose = () => {
    const data = new FormData(form);
    const lines = [`${L.nick}: ${data.get('nick')}`, `${L.name}: ${data.get('name')}`, `${L.country}: ${data.get('country')}`, `${L.prog}: ${data.get('programme')}`, `${L.exp}: ${data.get('level')}`, `${L.hours}: ${data.get('hours')}`, '', `${L.about}:`, `${data.get('about')}`];
    return { subject: `[VRT] ${L.subject} - ${data.get('nick')}`, body: lines.join('\n') };
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!valid()) return;
    const { subject, body } = compose();
    status.textContent = t('Otwieram Twój program pocztowy z gotową wiadomością. Jeśli nic się nie stało, użyj przycisku „Skopiuj treść”.');
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  $('[data-copy]', root).addEventListener('click', async () => {
    if (!valid()) return;
    const { subject, body } = compose();
    try {
      await navigator.clipboard.writeText(`${site.contact.email}\n${subject}\n\n${body}`);
      status.textContent = t('Skopiowano. Wyślij wiadomość na adres zespołu.');
    } catch {
      status.textContent = t('Nie udało się skopiować - zaznacz treść ręcznie.');
    }
  });
}

/* ---------- opcjonalna analityka bez cookies (wyłączona, dopóki nie ustawisz domeny) ---------- */

export function initAnalytics(site) {
  const domain = site.analytics?.plausibleDomain;
  if (!domain || navigator.doNotTrack === '1') return;
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.append(script);
}
