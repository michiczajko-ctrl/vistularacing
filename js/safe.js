const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for safe use in HTML text nodes and quoted attributes. */
export const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>"']/g, (char) => entities[char]);

/** Allow only http(s) and (optionally) mailto links; anything else becomes "#". */
export function safeUrl(url, { mailto = false } = {}) {
  try {
    const parsed = new URL(String(url), 'https://placeholder.invalid/');
    const allowed = parsed.protocol === 'https:' || parsed.protocol === 'http:' || (mailto && parsed.protocol === 'mailto:');
    return allowed ? String(url) : '#';
  } catch {
    return '#';
  }
}

/** Only accept bare YouTube video ids (11 chars, URL-safe base64 alphabet). */
export const isYoutubeId = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{11}$/.test(value);
