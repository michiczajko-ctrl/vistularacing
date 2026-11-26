/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} year
 * @property {string} type
 * @property {string} title
 * @property {?string} event
 * @property {?string} track
 * @property {?string} result
 * @property {?string} carId
 * @property {string[]} driverIds
 * @property {string[]} images
 * @property {string} summary
 * @property {?string} sourceUrl
 * @property {'major'|'minor'} [tier]
 * @property {string[]} [driverNames]
 */

/** @type {Achievement[]} */
export const achievements = [
  {
    id: 'hec-championship', year: '2026', type: 'Tytuł mistrzowski', tier: 'major', title: 'Mistrzostwo HEC',
    event: 'HEC', track: null, result: 'Champions', carId: null, driverIds: [],
    images: ['assets/gallery/hypercar-night.png'],
    summary: 'Najważniejszy międzynarodowy sukces w opublikowanej historii Vistula Racing.',
    sourceUrl: 'https://www.instagram.com/p/DWwtWfFjLOm/'
  },
  {
    id: 'team-wec-lmu-championship', year: '2026', type: 'Tytuł drużynowy', tier: 'major', title: 'Team WEC LMU Championship',
    event: 'Team WEC LMU Championship', track: null, result: 'Team Champions', carId: null, driverIds: [],
    images: ['assets/gallery/hypercar-duel.png'],
    summary: 'Mistrzostwo wywalczone wspólną pracą całego składu i wszystkich załóg.',
    sourceUrl: 'https://www.instagram.com/p/DT8RC0UDMsP/'
  },
  {
    id: 'sao-paulo-6h-gt3', year: '2026', type: 'Zwycięstwo GT3', tier: 'minor', title: 'São Paulo 6H',
    event: 'São Paulo 6H', track: 'São Paulo', result: 'P1 · GT3', carId: null, driverIds: [], driverNames: ['Przemek Fabis'],
    images: [], summary: 'Zwycięstwo Przemka Fabisa w klasie GT3.', sourceUrl: null
  },
  {
    id: 'imola-6h-gt3', year: '2026', type: 'Zwycięstwo GT3', tier: 'minor', title: 'Imola 4H',
    event: 'Imola 4H', track: 'Imola', result: 'P1 · GT3', carId: null, driverIds: ['wiktor-kocieda', 'krystian-ogorzelski'],
    images: [], summary: 'Wiktor Kocięda i Krystian Ogorzelski wygrali czterogodzinny wyścig w klasie LMGT3.', sourceUrl: null
  },
  {
    id: 'spa-6h-gt3', year: '2026', type: 'Zwycięstwo GT3', tier: 'minor', title: 'Spa 6H',
    event: 'Spa 6H', track: 'Spa', result: 'P1 · GT3', carId: null, driverIds: [], driverNames: ['Przemek Fabis'],
    images: [], summary: 'Przemek Fabis zwyciężył w klasie GT3.', sourceUrl: null
  },
  {
    id: 'barcelona-4h-lmp2', year: '2026', type: 'Zwycięstwo LMP2', tier: 'minor', title: 'Barcelona 4H',
    event: 'Barcelona 4H', track: 'Barcelona', result: 'P1 · LMP2', carId: null, driverIds: ['krystian-ogorzelski'],
    images: [], summary: 'Krystian Ogorzelski wygrał czterogodzinny wyścig w klasie LMP2.', sourceUrl: null
  },
  {
    id: 'race-record', year: '2025-2026', type: 'Race record', title: '18 zwycięstw · 31 podiów',
    event: null, track: null, result: null, carId: null, driverIds: [],
    images: ['assets/gallery/prototype-777-battle.png'],
    summary: 'Dorobek zespołu: 18 zwycięstw i 31 podiów.',
    sourceUrl: null
  }
];

/** Wyniki sezonu 2026 przekazane przez zespół. Nie służą do wyliczania oficjalnych statystyk. */
export const raceResults = [
  { id: 'lm24-hy', event: 'Le Mans 24H 2026', class: 'Hypercar', result: 'P1', people: ['Piotr Kochanowicz', 'Wojciech Niemiec', 'Juliusz Kiwalski'] },
  { id: 'lm24-gt3', event: 'Le Mans 24H 2026', class: 'LMGT3', result: 'P1', people: ['Przemek Fabiś', 'Wiktor Kocięda', 'Karlo Kruhan', 'Mateusz Mirończuk'] },
  { id: 'lm24-lmp2', event: 'Le Mans 24H 2026', class: 'LMP2', result: 'P2', people: ['Jakub Kardas', 'Michał Czajkowski'] },
  { id: 'lm24-p4', event: 'Le Mans 24H 2026', class: 'Hypercar', result: 'P4', people: ['Antoni Hordziewicz', 'Julian Moryń', 'Ondra Fort', 'Kajetan Jaszczak', 'Wiktor Siedlecki'] },
  { id: 'imola-4h-gt3', event: 'Imola 4H', class: 'LMGT3', result: 'P1', people: ['Krystian Ogorzelski', 'Wiktor Kocięda'] },
  { id: 'portimao-4h-lmp2', event: 'Portimão 4H', class: 'LMP2', result: 'P3', people: ['Bartłomiej Fijałkowski', 'Bartek Smolak'] },
  { id: 'portimao-4h-split1', event: 'Portimão 4H · Split 1', class: 'LMGT3', result: 'P1', people: ['Janek Feldman', 'Borys Bilobran'] },
  { id: 'lm12h', event: 'Le Mans 12H', class: 'Hypercar', result: 'P1', people: ['Jan Feldman', 'Michał Czajkowski', 'Bartłomiej Fijałkowski'] },
  { id: 'sebring-12h', event: 'Sebring 12H', class: 'Hypercar', result: 'P1', people: ['Michał Lodomir'] },
  { id: 'interlagos-6h-p3', event: 'Interlagos 6H', class: 'LMGT3', result: 'P3', people: ['Mateusz Kramarczyk', 'Bartłomiej Fijałkowski'] },
  { id: 'silverstone-4h', event: 'Silverstone 4H', class: 'LMP3', result: 'P3', people: ['Jan Feldman', 'Jakub Kardas', 'Grzegorz Zelga'] },
  { id: 'laguna-seca', event: 'Laguna Seca', class: 'LMP2', result: 'P2', people: ['Michał Czajkowski', 'Jakub Kardas'] },
  { id: 'sao-paulo-6h', event: 'São Paulo 6H', class: 'GT3', result: 'P1', people: ['Przemek Fabis'] },
  { id: 'le-mans-6h', event: 'Le Mans 6H', class: 'LMP2', result: 'P3', people: ['Karlo Kruhan'] },
  { id: 'le-mans-24h-r1', event: 'Le Mans 2.4H · Runda 1', class: 'GT3', result: 'P1', people: ['Krystian Ogorzelski'] },
  { id: 'le-mans-24h-r2', event: 'Le Mans 2.4H · Runda 2', class: 'GT3', result: 'P1', people: ['Krystian Ogorzelski'] },
  { id: 'le-mans-24h-r3', event: 'Le Mans 2.4H · Runda 3', class: 'GT3', result: 'P2', people: ['Krystian Ogorzelski'] },
  { id: 'le-mans-24h-hy', event: 'Le Mans 2.4H', class: 'Hypercar', result: 'P2', people: ['Fabian Dusek'] },
  { id: 'spa-6h', event: 'Spa 6H', class: 'GT3', result: 'P1', people: ['Przemek Fabis'] },
  { id: 'imola-6h-p2', event: 'Imola 6H', class: 'GT3', result: 'P2', people: ['Przemek Fabis'] },
  { id: 'barcelona-4h', event: 'Barcelona 4H', class: 'LMP2', result: 'P1', people: ['Krystian Ogorzelski'] },
  { id: 'cota-6h', event: 'COTA 6H', class: 'GT3', result: 'Last to first', people: ['Fabian Dusek', 'Krystian Ogorzelski'] },
  { id: 'ginetta-cup', event: 'Ginetta Cup', class: 'Ginetta Cup', result: '2× podium', people: ['Jakub Kardas'] }
];

/** Podia przekazane przez zespół. Daty i zdjęcia do uzupełnienia. */
export const podiums = [
  { id: 'monza-6h-fabis-kardas', event: 'Monza 6H', place: 'P3', class: 'Hypercar', car: 'Porsche 963', people: ['Przemek Fabiś', 'Jakub Kardas'] },
  { id: 'monza-6h-feldman-zgliczynski', event: 'Monza 6H', place: 'P3', class: 'Hypercar', car: 'Porsche 963', people: ['Jan Feldman', 'Aleksander Zgliczyński'] },
  { id: 'bahrain-8h-fabis-kocieda', event: 'Bahrain 8H', place: 'P2', class: 'LMGT3', car: 'BMW M4 GT3', people: ['Przemek Fabiś', 'Wiktor Kocięda'] },
  { id: 'bahrain-8h-feldman-mironczuk', event: 'Bahrain 8H', place: 'P3', class: 'LMGT3', car: 'Porsche 992 GT3', people: ['Jan Feldman', 'Mateusz Mirończuk'] }
];

/**
 * @typedef {Object} GalleryItem
 * @property {string} id
 * @property {string} image
 * @property {string} thumbnail
 * @property {string} alt
 * @property {string} label
 * @property {string} title
 * @property {?string} event
 * @property {?string} car
 * @property {?string} driver
 * @property {?string} year
 * @property {string} description
 * @property {'hero'|'portrait'|'wide'|'standard'} layout
 */

/** @type {GalleryItem[]} */
export const gallery = [
  { id: 'hypercar-night', image: 'assets/gallery/hypercar-night.png', thumbnail: 'assets/thumbs/gallery/hypercar-night.jpg', alt: 'Hypercar Vistula Racing podczas nocnego stintu', label: 'Night stint', title: 'Hypercar #777', event: null, car: 'Hypercar #777', driver: null, year: null, description: 'Nocny stint w barwach Vistula Racing.', layout: 'hero' },
  { id: 'gt3-pink-studio', image: 'assets/gallery/gt3-pink-studio.png', thumbnail: 'assets/thumbs/gallery/gt3-pink-studio.jpg', alt: 'Porsche GT3 Pink Dream w studio', label: 'Livery', title: 'Pink Dream', event: null, car: 'Porsche GT3', driver: null, year: null, description: 'Studyjna prezentacja malowania Pink Dream.', layout: 'portrait' },
  { id: 'hypercar-straight', image: 'assets/gallery/hypercar-straight.png', thumbnail: 'assets/thumbs/gallery/hypercar-straight.jpg', alt: 'Hypercar Vistula Racing na prostej', label: 'Race pace', title: 'Full attack', event: null, car: 'Hypercar #777', driver: null, year: null, description: 'Pełne tempo na prostej.', layout: 'standard' },
  { id: 'gt3-neon-studio', image: 'assets/gallery/gt3-neon-studio.png', thumbnail: 'assets/thumbs/gallery/gt3-neon-studio.jpg', alt: 'Samochód GT3 w zielonym świetle studyjnym', label: 'Studio', title: 'After dark', event: null, car: 'GT3', driver: null, year: null, description: 'Nocna sesja studyjna samochodu GT3.', layout: 'portrait' },
  { id: 'hypercar-duel', image: 'assets/gallery/hypercar-duel.png', thumbnail: 'assets/thumbs/gallery/hypercar-duel.jpg', alt: 'Dwa Hypercary Vistula Racing jadące obok siebie', label: 'One team', title: '#776 × #777', event: null, car: '#776 i #777', driver: null, year: null, description: 'Dwie załogi. Jeden kierunek.', layout: 'wide' },
  { id: 'gt3-porsche-77', image: 'assets/gallery/gt3-porsche-77.png', thumbnail: 'assets/thumbs/gallery/gt3-porsche-77.jpg', alt: 'Porsche GT3 numer 77 na tarkach', label: 'LMGT3', title: 'Red Dream', event: null, car: 'Porsche GT3 #77', driver: null, year: null, description: 'Red Dream w specyfikacji wyścigowej.', layout: 'standard' },
  { id: 'bmw-sunset', image: 'assets/gallery/bmw-sunset.jpg', thumbnail: 'assets/thumbs/gallery/bmw-sunset.jpg', alt: 'BMW M4 GT3 Vistula Racing na tle zachodzącego słońca', label: 'Golden hour', title: 'BMW M4 GT3', event: null, car: 'BMW M4 GT3', driver: null, year: null, description: 'BMW M4 GT3 podczas złotej godziny.', layout: 'wide' },
  { id: 'koenigsegg-airborne', image: 'assets/gallery/koenigsegg-airborne.jpg', thumbnail: 'assets/thumbs/gallery/koenigsegg-airborne.jpg', alt: 'Samochód wyścigowy w powietrzu nad barierą toru Nordschleife', label: 'Unscripted', title: 'No lift', event: null, car: 'Koenigsegg', driver: null, year: null, description: 'Kadr spoza scenariusza na Nordschleife.', layout: 'wide' },
  { id: 'prototype-battle', image: 'assets/gallery/prototype-777-battle.png', thumbnail: 'assets/thumbs/gallery/prototype-777-battle.jpg', alt: 'Prototyp Vistula Racing numer 777 walczący na torze', label: 'Racecraft', title: 'Fight to the flag', event: null, car: 'Prototype #777', driver: null, year: null, description: 'Walka do końca stintu.', layout: 'wide' },
  { id: 'prototype-pitlane', image: 'assets/gallery/prototype-777-pitlane.png', thumbnail: 'assets/thumbs/gallery/prototype-777-pitlane.jpg', alt: 'Prototyp Vistula Racing numer 777 w alei serwisowej', label: 'After the stint', title: 'Earned, not staged', event: null, car: 'Prototype #777', driver: null, year: null, description: 'Ślady wyścigu w alei serwisowej.', layout: 'wide' },
  { id: 'gt3-ferrari-777', image: 'assets/gallery/gt3-ferrari-777.png', thumbnail: 'assets/thumbs/gallery/gt3-ferrari-777.jpg', alt: 'Ferrari GT3 numer 777 w barwach Vistula Racing', label: 'Race trim', title: 'Ferrari #777', event: null, car: 'Ferrari GT3 #777', driver: null, year: null, description: 'Ferrari GT3 w pełnym tempie.', layout: 'hero' }
];

/** @typedef {{id:string,name:string,logo:string,url:?string,internal?:boolean,storyId?:string,description?:string}} Partner */
/** @type {Partner[]} */
export const partners = [
  { id: 'advanced-gg', name: 'ADVANCED.gg', logo: 'assets/partners/advanced-gg.png', url: 'https://advanced.gg', featured: true, description: 'Marka suplementów i napojów dla graczy: focus, energia, nawodnienie i sen. „Fuel Better. Push Further. Be ADVANCED."' },
  { id: 'instant-gaming', name: 'Instant Gaming', logo: 'assets/partners/instant-gaming.png', url: 'https://www.instant-gaming.com/en/', description: 'Oficjalny drugi sponsor Vistula Racing.' },
  { id: 'simline', name: 'Simline.eu', logo: 'assets/partners/simline_logo.png', url: 'https://simline.eu/pl/strona-glowna', description: 'Wsparcie przygotowań zespołu i dostęp do RC Pro+ w Le Mans Ultimate.', storyId: 'archive-simline-partnership' },
  { id: 'vistula-technologies', name: 'Vistula Racing Technologies', logo: 'assets/brand/vr_logo.png', url: null, internal: true, storyId: 'archive-technology', description: 'Wewnętrzny dział oprogramowania, technologii i infrastruktury: VRS Race Control, VRT Pitwall i VRT-SITE.' },
  { id: '237-league', name: '237 League', logo: 'assets/partners/237-league.png', url: 'https://237league.pl', description: 'Partner ligowy. 237 League to polska liga simracingowa dla kierowców, którzy chcą ścigać się twardo, ale czysto. Organizuje m.in. Polish Endurance Series.' }
];
