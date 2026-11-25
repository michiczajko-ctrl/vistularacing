import { site } from '../data/site.js';
import { partners } from '../data/archive.js';
import { $ } from './dom.js';
import { lang, t } from './i18n.js';
import { escapeHtml, safeUrl } from './safe.js';

const external = 'target="_blank" rel="noopener noreferrer"';

export function renderPartners() {
  const root = $('[data-partners]');
  if (!root) return;
  root.innerHTML = partners.map((partner) => `
    <li class="partner${partner.internal ? ' partner--internal' : ''}${partner.featured ? ' partner--featured' : ''}">
      <div class="partner__logo"><img src="${escapeHtml(partner.logo)}" alt="${escapeHtml(t('Logo ') + partner.name)}" loading="lazy"></div>
      <h3>${escapeHtml(partner.name)}</h3>
      ${partner.internal ? `<p class="partner__tag">${escapeHtml(t('Dział wewnętrzny'))}</p>` : ''}
      <p>${escapeHtml(partner.description || t('Partner Vistula Racing.'))}</p>
      <div class="partner__links">
        ${partner.storyId ? `<a class="link-more" href="#${escapeHtml(partner.storyId)}">${escapeHtml(t('Historia współpracy'))}</a>` : ''}
        ${partner.url ? `<a class="link-more" href="${escapeHtml(safeUrl(partner.url))}" ${external}>${escapeHtml(t('Strona partnera'))}</a>` : ''}
      </div>
    </li>`).join('');
}

export function renderRecruitmentPanel() {
  const root = $('[data-recruitment]');
  if (!root) return;
  const { recruitment } = site;
  const next = lang === 'en' ? t(recruitment.nextRecruitment) : recruitment.nextRecruitment;
  root.innerHTML = `
    <p class="status"><span class="visually-hidden">${escapeHtml(t('Status naboru'))}:</span> ${escapeHtml(recruitment.label)}</p>
    <p>${escapeHtml(next)}</p>
    <ul class="chips" aria-label="${escapeHtml(t('Programy'))}">${recruitment.programs.map((program) => `<li>${escapeHtml(program)}</li>`).join('')}</ul>
    <a class="btn btn-primary" href="${escapeHtml(safeUrl(recruitment.ctaUrl))}" ${external}>${escapeHtml(t(recruitment.ctaLabel))}</a>`;
}

export function renderFooter() {
  const socials = $('[data-footer-socials]');
  if (socials) {
    socials.innerHTML = `
      <a href="mailto:${escapeHtml(site.contact.email)}">${escapeHtml(site.contact.email)}</a>
      <a href="${escapeHtml(safeUrl(site.contact.instagram))}" ${external}>Instagram</a>
      <a href="${escapeHtml(safeUrl(site.contact.tiktok))}" ${external}>TikTok</a>
      <a href="${escapeHtml(safeUrl(site.contact.discord))}" ${external}>Discord</a>`;
  }
  const year = $('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
}
