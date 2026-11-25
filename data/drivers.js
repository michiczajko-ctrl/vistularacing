/**
 * @typedef {Object} DriverProgram
 * @property {'hy'|'lmp2'|'lmp3'|'gt3'} id
 * @property {'pro'|'pro-am'|'am'} tier
 * @property {string} number
 */

/**
 * @typedef {Object} Driver
 * @property {string} id
 * @property {string} name
 * @property {string} number
 * @property {?string} nationality
 * @property {string} role
 * @property {DriverProgram[]} programs
 * @property {string} photo
 * @property {string} sceneImage
 * @property {?string} showcaseImage
 * @property {{starts:?number,wins:?number,podiums:?number,poles:?number,championships:?number}} statistics
 * @property {Array<{year:string,title:string,description:string}>} career
 * @property {Array<{year:string,title:string,description:string}>} moments
 * @property {string[]} gallery
 * @property {?string} favoriteCarId
 * @property {string[]} teammateHistory
 * @property {string[]} raceHistory
 * @property {'complete'|'partial'} completion
 * @property {?string} joined
 * @property {string[]} tags
 */

const makeDriver = (id, name, number, photo, programs, role = 'Driver') => ({
  id,
  name,
  number,
  nationality: null,
  role,
  programs,
  photo,
  sceneImage: photo,
  showcaseImage: null,
  statistics: { starts: null, wins: null, podiums: null, poles: null, championships: null },
  career: [],
  moments: [],
  gallery: [],
  favoriteCarId: null,
  teammateHistory: [],
  raceHistory: [],
  completion: 'partial',
  joined: null,
  tags: []
});

/** @type {Driver[]} */
const baseDrivers = [
  { ...makeDriver('michal-czajkowski', 'Michał Czajkowski', '7', 'assets/drivers/avatar_czajkowski.jpg', [
    { id: 'hy', tier: 'pro-am', number: '7' },
    { id: 'lmp2', tier: 'pro-am', number: 'TBA' },
    { id: 'lmp3', tier: 'pro', number: 'TBA' }
  ], 'Founder & Driver'), showcaseImage: 'assets/generated/drivers/michal-czajkowski-cutout.png' },
  { ...makeDriver('krystian-ogorzelski', 'Krystian Ogorzelski', '17', 'assets/drivers/avatar_ogorzelski.jpg', [
    { id: 'hy', tier: 'pro', number: '17' },
    { id: 'lmp2', tier: 'pro', number: '17' }
  ]), showcaseImage: 'assets/generated/drivers/krystian-ogorzelski-cutout.png' },
  { ...makeDriver('jakub-kardas', 'Jakub Kardas', '8', 'assets/drivers/avatar_kardas.jpg', [
    { id: 'hy', tier: 'pro', number: '8' },
    { id: 'lmp2', tier: 'pro', number: '8' },
    { id: 'lmp3', tier: 'pro', number: '8' },
    { id: 'gt3', tier: 'pro', number: '8' }
  ], 'Co-founder & Driver'), showcaseImage: 'assets/generated/drivers/jakub-kardas-cutout.png' },
  makeDriver('fabian-dusek', 'Fabian Dusek', '67', 'assets/drivers/avatar_dusek.jpg', [
    { id: 'hy', tier: 'pro-am', number: '67' },
    { id: 'gt3', tier: 'pro', number: '67' }
  ]),
  makeDriver('przemek-fabis', 'Przemek Fabiś', '9', 'assets/drivers/avatar_fabis.jpg', [
    { id: 'hy', tier: 'pro-am', number: '9' },
    { id: 'gt3', tier: 'pro', number: '9' }
  ]),
  makeDriver('karlo-kruhan', 'Karlo Kruhan', '6', 'assets/drivers/avatar_kruhan.jpg', [
    { id: 'gt3', tier: 'pro', number: '6' }
  ]),
  makeDriver('wiktor-kocieda', 'Wiktor Kocięda', '43', 'assets/drivers/avatar_kocieda.jpg', [
    { id: 'gt3', tier: 'pro', number: '43' }
  ]),
  makeDriver('bartlomiej-fijalkowski', 'Bartłomiej Fijałkowski', '24', 'assets/drivers/bartlomiej-fijalkowski.jpg', [
    { id: 'hy', tier: 'am', number: '24' },
    { id: 'gt3', tier: 'am', number: '24' }
  ]),
  makeDriver('piotr-koziol', 'Piotr Kozioł', '89', 'assets/drivers/avatar_koziol.jpg', [
    { id: 'lmp2', tier: 'am', number: '89' },
    { id: 'lmp3', tier: 'am', number: '89' }
  ]),
  makeDriver('turner-smith', 'Turner Smith', '21', 'assets/drivers/turner-smith.jpg', [
    { id: 'lmp2', tier: 'am', number: '21' }
  ]),
  makeDriver('blazej-bogucki', 'Błażej Bogucki', '83', 'assets/drivers/avatar_bogucki.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '83' }
  ]),
  makeDriver('filip-mazgaj', 'Filip Mazgaj', '71', 'assets/drivers/filip-mazgaj.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '71' }
  ]),
  makeDriver('kacper-cyganowski', 'Kacper Cyganowski', '10', 'assets/drivers/kacper-cyganowski.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '10' }
  ]),
  makeDriver('kacper-slabisz', 'Kacper Slabisz', '117', 'assets/drivers/kacper-slabisz.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '117' }
  ]),
  makeDriver('mateusz-kramarczyk', 'Mateusz Kramarczyk', '66', 'assets/drivers/mateusz-kramarczyk.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '66' }
  ]),
  makeDriver('michal-lodomir', 'Michał Lodomir', '77', 'assets/drivers/michal-lodomir.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '77' }
  ]),
  makeDriver('rdzewny', 'Rdzewny', '666', 'assets/drivers/rdzewny.jpg', [
    { id: 'gt3', tier: 'pro-am', number: '666' }
  ]),
  makeDriver('dawid-podpirko', 'Dawid Podpirko', '80', 'assets/drivers/avatar_podpirko.jpg', [
    { id: 'gt3', tier: 'am', number: '80' }
  ]),
  makeDriver('mateusz-klamka', 'Mateusz Klamka', '30', 'assets/drivers/mateusz-klamka.jpg', [
    { id: 'gt3', tier: 'am', number: '30' }
  ])
];

const R = (year, title, description = '') => ({ year, title, description });
const PL = 'Polska';

/** Uzupełnienia istniejących profili (źródło: baza danych zespołu, 14.11.2026). */
const patches = {
  'michal-czajkowski': { nationality: PL, role: 'Founder & Team Principal', tags: ['management'] },
  'jakub-kardas': { nationality: PL, role: 'Deputy Team Principal & Driver', joined: 'Od początku', tags: ['management'], career: [R('2026', 'P2 Le Mans 24H', 'LMP2, po 22 godzinach jazdy solo.'), R('2026', 'Wicemistrz HEC Hypercar')] },
  'krystian-ogorzelski': { nationality: PL, role: 'Management · były kierowca', joined: 'Od początku', tags: ['management'], career: [R('2026', 'Mistrz HEC LMGT3'), R('2026', 'Zwycięstwo Imola 4H', 'LMGT3.')] },
  'fabian-dusek': { nationality: PL, joined: 'Listopad 2025', career: [R('2026', 'Wicemistrz HEC LMGT3'), R('2026', 'P1 Last to First COTA 6H')] },
  'przemek-fabis': { role: 'Driver · Management', joined: 'Grudzień 2025', tags: ['management', 'academy'], career: [R('2026', 'Zwycięstwo Le Mans 24H'), R('2026', 'Trzy zwycięstwa w wyścigach solo 6-8H')] },
  'karlo-kruhan': { nationality: 'Chorwacja', joined: 'Grudzień 2025', tags: ['academy'], career: [R('2026', 'Zwycięstwo Le Mans 24H'), R('2026', 'HEC Hypercar P5')] },
  'wiktor-kocieda': { role: 'Driver · Management', joined: 'Q1 2026', tags: ['management', 'academy'], career: [R('2026', 'Zwycięstwo Le Mans 24H'), R('2026', 'Zwycięstwo Imola 4H', 'LMGT3, z Krystianem Ogorzelskim.')] },
  'bartlomiej-fijalkowski': { nationality: PL, joined: 'Maj 2026', career: [R('2026', 'P3 Portimão 4H', 'LMP2.')] },
  'piotr-koziol': { joined: 'Q1 2026', tags: ['academy'], career: [R('2026', 'P10 LMP2')] },
  'turner-smith': { nationality: 'Wielka Brytania', joined: 'Q2 2026' },
  'blazej-bogucki': { nationality: PL, joined: '2025', tags: ['academy'], career: [R('2026', 'P7 Spa 4H')] },
  'filip-mazgaj': { joined: 'Q3 2026', career: [R('2026', 'P31 Monza 6H')] },
  'kacper-cyganowski': { nationality: PL, joined: 'Q2 2026', career: [R('2026', 'P15 Imola 6H')] },
  'kacper-slabisz': { joined: 'Q1 2026', tags: ['academy'] },
  'mateusz-kramarczyk': { nationality: PL, joined: 'Styczeń 2026', tags: ['academy'], career: [R('2026', 'P3 Interlagos 6H')] },
  'mateusz-klamka': { nationality: PL, joined: 'Q2 2026', career: [R('2026', 'P10 Imola 6H')] },
  'michal-lodomir': { nationality: PL, joined: 'Listopad 2025', career: [R('2026', 'Zwycięstwo Sebring 12H')] },
  'dawid-podpirko': { career: [R('2026', 'Le Mans 24H', 'LMGT3 AM, Porsche #83.')] }
};

/** Nowi kierowcy: [id, imię i nazwisko, numer, narodowość, dołączył, opcje, osiągnięcia]. Brak zdjęcia = inicjały. */
const newcomers = [
  ['aleksander-zgliczynski', 'Aleksander Zgliczyński', '25', PL, 'Q3 2026'],
  ['antoni-hordziewicz', 'Antoni Hordziewicz', '54', PL, 'Q3 2026', {}, [R('2026', 'P4 Le Mans 24H', 'Hypercar.')]],
  ['bartek-smolak', 'Bartek „Barti” Smolak', '656', PL, 'Q3 2026', {}, [R('2026', 'P3 Portimão 4H', 'LMP2.')]],
  ['bartosz-richert', 'Bartosz „Richard” Richert', '35', PL, 'Q4 2026'],
  ['blanin-blaze', 'Blanin Blaze', '4', PL, 'Q4 2026'],
  ['erik-timmermans', 'Erik „Verstappen” Timmermans', '33', 'Holandia / Polska', 'Q3 2026', { role: 'Driver · iRacing Team' }],
  ['filip-jankowski', 'Filip Jankowski', '61', PL, 'Q3 2026', {}, [R('2026', 'P19 Le Mans 24H')]],
  ['franciszek-ostafin', 'Franciszek „Franek” Ostafin', '13', PL, 'Q3 2026'],
  ['igor-kruk', 'Igor Kruk', '13', PL, 'Q3 2026'],
  ['ivano-cikoja', 'Ivano Cikoja', '44', 'Chorwacja', 'Q4 2026'],
  ['jakub-koncewicz', 'Jakub Koncewicz', '11', PL, 'Q3 2026'],
  ['jan-palupski', 'Jan Palupski', '37', PL, 'Q4 2026'],
  ['janek-feldman', 'Janek „Franek” Feldman', '95', PL, 'Q3 2026', {}, [R('2026', 'Zwycięstwo Portimão 4H', 'Split 1.'), R('2026', 'Zwycięstwo Le Mans 12H')]],
  ['jim-storey', 'Jim „Gustav” Storey', '86', 'Wielka Brytania', 'Q4 2026'],
  ['julian-moryn', 'Julian Moryń', '88', PL, 'Q3 2026', {}, [R('2026', 'P4 Le Mans 24H')]],
  ['kajetan-jaszczak', 'Kajetan Jaszczak', '04', PL, 'Q4 2026', {}, [R('2026', 'P4 Le Mans 24H')]],
  ['kamil-kucharczyk', 'Kamil Kucharczyk', '42', PL, 'Q4 2026'],
  ['marcel-lipski', 'Marcel „stolarz” Lipski', '74', PL, 'Q3 2026', { role: 'Driver · Management VVS', tags: ['management'] }, [R('2026', 'P18 Le Mans 24H')]],
  ['mateusz-mironczuk', 'Mateusz „Mirosław” Mirończuk', '11', PL, 'Q3/Q4 2026', {}, [R('2026', 'Zwycięstwo Le Mans 24H')]],
  ['mateusz-dziebak', 'Mateusz Dziębak', '20', PL, 'Q3 2026'],
  ['mateusz-mrozik', 'Mateusz Mrozik', '41', PL, 'Q4 2026'],
  ['ondra-fort', 'Ondra Fort', '22', 'Czechy', 'Q4 2026', {}, [R('2026', 'P4 Le Mans 24H')]],
  ['oskar-potapiuk', 'Oskar Potapiuk', '11', PL, 'Q3 2026'],
  ['piotr-kochanowicz', 'Piotr „Garfield” Kochanowicz', '84', PL, 'Q3 2026', { role: 'Driver · Management VVS i M-Helper', tags: ['management'] }, [R('2026', 'Zwycięstwo Le Mans 24H')]],
  ['piotrek-schabowski', 'Piotrek Schabowski', '02', PL, 'Q4 2026'],
  ['stephen-fraser', 'Stephen Fraser', '-', 'Szkocja', 'Od początku', { role: 'Team Management', tags: ['management'] }],
  ['szymon-trojanowski', 'Szymon Maciej Trojanowski', '55', PL, 'Q4 2026'],
  ['wiktor-nejfi', 'Wiktor Nejfi', '45', null, 'Q3 2026', { role: 'Driver · Management VVS', tags: ['management'] }, [R('2026', 'P18 Le Mans 24H')]],
  ['wiktor-siedlecki', 'Wiktor Siedlecki', '777', null, 'Q3 2026', {}, [R('2026', 'P4 Le Mans 24H')]],
  ['wojciech-niemiec', 'Wojciech „Reviak” Niemiec', '84', null, 'Q3 2026', { role: 'Driver · Management VVS', tags: ['management'] }, [R('2026', 'Zwycięstwo Le Mans 24H')]]
].map(([id, name, number, nationality, joined, extra = {}, career = []]) => ({
  ...makeDriver(id, name, number, null, [], extra.role || 'Driver'),
  nationality, joined, career, tags: extra.tags || []
}));

export const drivers = [
  ...baseDrivers.map((driver) => ({ ...driver, ...(patches[driver.id] || {}) })),
  ...newcomers
];

export const programLabels = Object.freeze({
  hy: 'Hypercar',
  lmp2: 'LMP2',
  lmp3: 'LMP3',
  gt3: 'LMGT3'
});
