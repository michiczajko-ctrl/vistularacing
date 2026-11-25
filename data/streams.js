/**
 * Streams and replays. Add entries and they appear in the "Live" section.
 * A YouTube entry needs the 11-character video id (the part after `v=`).
 * Videos load only after the visitor clicks play (youtube-nocookie, no tracking until then).
 *
 * @typedef {Object} StreamVideo
 * @property {string} id
 * @property {string} title
 * @property {string} youtubeId
 * @property {string} [date]   ISO date
 */

export const streamChannels = Object.freeze({
  youtube: null, // e.g. 'https://www.youtube.com/@vistularacing'
  twitch: 'https://www.twitch.tv/vistula_vision_series'
});

/** @type {StreamVideo[]} */
export const streamVideos = [];
