/**
 * @typedef {Object} CarStatistics
 * @property {?number} races
 * @property {?number} wins
 * @property {?number} podiums
 * @property {?number} poles
 */

/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} name
 * @property {string} manufacturer
 * @property {string} model
 * @property {'hypercar'|'lmgt3'|'lmp2'|'lmp3'} class
 * @property {string} number
 * @property {string[]} seasons
 * @property {string} image
 * @property {string} heroImage
 * @property {?string} showroomImage
 * @property {string[]} gallery
 * @property {string[]} drivers
 * @property {CarStatistics} statistics
 * @property {string[]} bestResults
 * @property {Array<{year:string,title:string,description:string}>} importantMoments
 * @property {Array<{name:string,image:string}>} liveries
 * @property {?string} description
 * @property {'complete'|'partial'} completion
 */

const emptyStatistics = () => ({ races: null, wins: null, podiums: null, poles: null });

/** @type {Car[]} */
export const cars = [
  {
    id: 'vanwall-680', name: 'Vanwall 680', manufacturer: 'Vanwall', model: '680', class: 'hypercar', number: '777', seasons: [],
    image: 'assets/thumbs/cars/vanwall-680.jpg', heroImage: 'assets/cars/vanwall-680.png', showroomImage: 'assets/generated/cars/vanwall-680-cutout-corrected.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'glickenhaus-scg007', name: 'Glickenhaus SCG007', manufacturer: 'Glickenhaus', model: 'SCG007', class: 'hypercar', number: '777', seasons: [],
    image: 'assets/thumbs/cars/glickenhaus-scg007.jpg', heroImage: 'assets/cars/glickenhaus-scg007.png', showroomImage: 'assets/generated/cars/glickenhaus-scg007-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'genesis-gmr001', name: 'Genesis GMR-001', manufacturer: 'Genesis', model: 'GMR-001', class: 'hypercar', number: '777', seasons: [],
    image: 'assets/thumbs/cars/genesis-gmr001.jpg', heroImage: 'assets/cars/genesis-gmr001.png', showroomImage: 'assets/generated/cars/genesis-gmr001-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'porsche-963', name: 'Porsche 963', manufacturer: 'Porsche', model: '963', class: 'hypercar', number: '777', seasons: [],
    image: 'assets/thumbs/cars/porsche-963.jpg', heroImage: 'assets/cars/porsche-963.png', showroomImage: 'assets/generated/cars/porsche-963-cutout.png', gallery: ['assets/gallery/hypercar-straight.png'], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [{ name: 'Porsche 963', image: 'assets/liveries/livery_porsche963.jpg' }], description: null, completion: 'partial'
  },
  {
    id: 'peugeot-9x8', name: 'Peugeot 9X8', manufacturer: 'Peugeot', model: '9X8', class: 'hypercar', number: '777', seasons: [],
    image: 'assets/thumbs/cars/peugeot-9x8.jpg', heroImage: 'assets/cars/peugeot-9x8.png', showroomImage: 'assets/generated/cars/peugeot-9x8-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'cadillac-v-series-r', name: 'Cadillac V-Series.R', manufacturer: 'Cadillac', model: 'V-Series.R', class: 'hypercar', number: '777', seasons: [],
    image: 'assets/thumbs/cars/cadillac-v-series-r.jpg', heroImage: 'assets/cars/cadillac-v-series-r.png', showroomImage: 'assets/generated/cars/cadillac-v-series-r-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [{ name: 'Red Soul', image: 'assets/liveries/livery_cadillac_redsoul.png' }], description: null, completion: 'partial'
  },
  {
    id: 'bmw-m4-lmgt3', name: 'BMW M4 LMGT3', manufacturer: 'BMW', model: 'M4 LMGT3', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/bmw-m4-lmgt3.jpg', heroImage: 'assets/cars/bmw-m4-lmgt3.png', showroomImage: 'assets/generated/cars/bmw-m4-lmgt3-cutout.png', gallery: ['assets/gallery/bmw-sunset.jpg'], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [{ name: 'Thunder', image: 'assets/liveries/livery_bmw_thunder.png' }], description: null, completion: 'partial'
  },
  {
    id: 'mercedes-amg-lmgt3', name: 'Mercedes-AMG LMGT3', manufacturer: 'Mercedes-AMG', model: 'LMGT3', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/mercedes-amg-lmgt3.jpg', heroImage: 'assets/cars/mercedes-amg-lmgt3.png', showroomImage: 'assets/generated/cars/mercedes-amg-lmgt3-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'porsche-911-gt3-r-lmgt3', name: 'Porsche 911 GT3 R', manufacturer: 'Porsche', model: '911 GT3 R', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/porsche-911-gt3-r-lmgt3.jpg', heroImage: 'assets/cars/porsche-911-gt3-r-lmgt3.png', showroomImage: 'assets/generated/cars/porsche-911-gt3-r-lmgt3-cutout.png', gallery: ['assets/gallery/gt3-porsche-77.png', 'assets/gallery/gt3-pink-studio.png'], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [{ name: 'Red Dream', image: 'assets/liveries/livery_red_dream.png' }, { name: 'Pink Dream', image: 'assets/liveries/livery_pink_dream.png' }], description: null, completion: 'partial'
  },
  {
    id: 'ford-mustang-lmgt3', name: 'Ford Mustang LMGT3', manufacturer: 'Ford', model: 'Mustang LMGT3', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/ford-mustang-lmgt3.jpg', heroImage: 'assets/cars/ford-mustang-lmgt3.png', showroomImage: 'assets/generated/cars/ford-mustang-lmgt3-cutout-corrected.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'chevrolet-corvette-z06-lmgt3-r', name: 'Corvette Z06 LMGT3.R', manufacturer: 'Chevrolet', model: 'Corvette Z06 LMGT3.R', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/chevrolet-corvette-z06-lmgt3-r.jpg', heroImage: 'assets/cars/chevrolet-corvette-z06-lmgt3-r.png', showroomImage: 'assets/generated/cars/chevrolet-corvette-z06-lmgt3-r-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'ferrari-296-lmgt3-evo', name: 'Ferrari 296 LMGT3 Evo', manufacturer: 'Ferrari', model: '296 LMGT3 Evo', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/ferrari-296-lmgt3-evo.jpg', heroImage: 'assets/cars/ferrari-296-lmgt3-evo.png', showroomImage: 'assets/generated/cars/ferrari-296-lmgt3-evo-cutout.png', gallery: ['assets/gallery/gt3-ferrari-777.png'], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'lexus-rcf-lmgt3-red', name: 'Lexus RC F LMGT3 - Red', manufacturer: 'Lexus', model: 'RC F LMGT3', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/lexus-rcf-lmgt3-red.jpg', heroImage: 'assets/cars/lexus-rcf-lmgt3-red.png', showroomImage: 'assets/generated/cars/lexus-rcf-lmgt3-red-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'lexus-rcf-lmgt3-blue', name: 'Lexus RC F LMGT3 - Blue', manufacturer: 'Lexus', model: 'RC F LMGT3', class: 'lmgt3', number: '77', seasons: [],
    image: 'assets/thumbs/cars/lexus-rcf-lmgt3-blue.jpg', heroImage: 'assets/cars/lexus-rcf-lmgt3-blue.png', showroomImage: 'assets/generated/cars/lexus-rcf-lmgt3-blue-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'oreca-07', name: 'Oreca 07', manufacturer: 'Oreca', model: '07', class: 'lmp2', number: '776', seasons: [],
    image: 'assets/thumbs/cars/oreca-07.jpg', heroImage: 'assets/cars/oreca-07.png', showroomImage: 'assets/generated/cars/oreca-07-cutout-corrected.png', gallery: ['assets/gallery/prototype-777-pitlane.png'], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'ligier-js-p325', name: 'Ligier JS P325', manufacturer: 'Ligier', model: 'JS P325', class: 'lmp3', number: '776', seasons: [],
    image: 'assets/thumbs/cars/ligier-js-p325.jpg', heroImage: 'assets/cars/ligier-js-p325.png', showroomImage: 'assets/generated/cars/ligier-js-p325-cutout-corrected.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'ginetta-g61-lt-p325-evo-red', name: 'Ginetta G61-LT-P325 Evo - Red', manufacturer: 'Ginetta', model: 'G61-LT-P325 Evo', class: 'lmp3', number: '776', seasons: [],
    image: 'assets/thumbs/cars/ginetta-g61-lt-p325-evo-red.jpg', heroImage: 'assets/cars/ginetta-g61-lt-p325-evo-red.png', showroomImage: 'assets/generated/cars/ginetta-g61-lt-p325-evo-red-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  },
  {
    id: 'ginetta-g61-lt-p325-evo-blue', name: 'Ginetta G61-LT-P325 Evo - Blue', manufacturer: 'Ginetta', model: 'G61-LT-P325 Evo', class: 'lmp3', number: '776', seasons: [],
    image: 'assets/thumbs/cars/ginetta-g61-lt-p325-evo-blue.jpg', heroImage: 'assets/cars/ginetta-g61-lt-p325-evo-blue.png', showroomImage: 'assets/generated/cars/ginetta-g61-lt-p325-evo-blue-cutout.png', gallery: [], drivers: [], statistics: emptyStatistics(), bestResults: [], importantMoments: [], liveries: [], description: null, completion: 'partial'
  }
];

/** Logotypy producentów (tylko identyfikacja auta). Brak wpisu = nazwa tekstem. */
export const brandLogos = Object.freeze({
  BMW: 'assets/brands/bmw.svg', Cadillac: 'assets/brands/cadillac.svg', Chevrolet: 'assets/brands/chevrolet.svg',
  Ferrari: 'assets/brands/ferrari.svg', Ford: 'assets/brands/ford.svg', Lexus: 'assets/brands/lexus.svg',
  'Mercedes-AMG': 'assets/brands/mercedes.svg', Peugeot: 'assets/brands/peugeot.svg', Porsche: 'assets/brands/porsche.svg'
});

export const carClassLabels = Object.freeze({
  hypercar: 'Hypercar',
  lmgt3: 'LMGT3',
  lmp2: 'LMP2',
  lmp3: 'LMP3'
});
