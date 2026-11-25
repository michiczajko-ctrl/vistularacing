import { imageManifest } from '../data/image-manifest.js';

const escapeAttribute = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const srcset = (variants = []) => variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ');

export function pictureMarkup(source, alt = '', options = {}) {
  const entry = imageManifest[source];
  const loading = options.loading || 'lazy';
  const sizes = options.sizes || '100vw';
  const className = options.className ? ` class="${escapeAttribute(options.className)}"` : '';
  const priority = options.fetchpriority ? ` fetchpriority="${options.fetchpriority}"` : '';
  if (!entry || (!entry.avif.length && !entry.webp.length)) {
    return `<img${className} src="${escapeAttribute(source)}" alt="${escapeAttribute(alt)}" loading="${loading}" decoding="async"${priority}>`;
  }
  return `<picture${className}>
    ${entry.avif.length ? `<source type="image/avif" srcset="${srcset(entry.avif)}" sizes="${escapeAttribute(sizes)}">` : ''}
    ${entry.webp.length ? `<source type="image/webp" srcset="${srcset(entry.webp)}" sizes="${escapeAttribute(sizes)}">` : ''}
    <img src="${escapeAttribute(source)}" alt="${escapeAttribute(alt)}" loading="${loading}" decoding="async"${priority}>
  </picture>`;
}

export function bestImageSource(source, targetWidth = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)) {
  const variants = imageManifest[source]?.webp || [];
  if (!variants.length) return source;
  return (variants.find((variant) => variant.width >= targetWidth) || variants.at(-1)).src;
}

/** Portret kierowcy; bez zdjęcia pokazuje inicjały. */
export function portraitMarkup(driver, alt = '', options = {}) {
  const source = options.showcase ? driver.showcaseImage || driver.photo : driver.photo;
  if (source) return pictureMarkup(source, alt, options);
  const words = driver.name.replace(/[„”"].*?[„”"]/g, '').split(/\s+/).filter(Boolean);
  const initials = (words[0]?.[0] || '') + (words.length > 1 ? words.at(-1)[0] : '');
  return `<span class="avatar" aria-hidden="true">${initials.toUpperCase()}</span>`;
}
