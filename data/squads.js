/** Składy wg rozpiski zespołu z Discorda. Kierowcy to ID z data/drivers.js; jedna osoba może być w kilku składach. */
const squad = (name, ids) => ({ name, drivers: ids.split(' ') });

export const squads = Object.freeze([
  {
    id: 'lmu', label: 'Le Mans Ultimate', short: 'LMU',
    directors: [['Director', 'michal-czajkowski'], ['V-Director', 'bartlomiej-fijalkowski']],
    teams: [
      squad('HY I', 'wojciech-niemiec piotr-kochanowicz janek-feldman aleksander-zgliczynski fabian-dusek michal-lodomir'),
      squad('HY II', 'wiktor-siedlecki kajetan-jaszczak antoni-hordziewicz julian-moryn marcel-lipski'),
      squad('HY III', 'erik-timmermans ondra-fort wiktor-nejfi bartosz-richert ivano-cikoja'),
      squad('LMP2 I', 'michal-czajkowski bartlomiej-fijalkowski jakub-kardas piotr-koziol'),
      squad('LMGT3 I', 'wiktor-kocieda karlo-kruhan mateusz-mironczuk przemek-fabis'),
      squad('LMGT3 II', 'kacper-slabisz kacper-cyganowski mateusz-kramarczyk igor-kruk'),
      squad('LMGT3 III', 'bartek-smolak jim-storey blazej-bogucki szymon-trojanowski mateusz-klamka'),
      squad('LMGT3 IV', 'oskar-potapiuk jakub-koncewicz franciszek-ostafin filip-jankowski'),
      squad('LMGT3 V', 'jan-palupski blanin-blaze kamil-kucharczyk mateusz-dziebak'),
      squad('Rezerwy', 'turner-smith dawid-podpirko')
    ]
  },
  {
    id: 'iracing', label: 'iRacing', short: 'iRacing',
    directors: [['Director', 'przemek-fabis']],
    teams: [squad('SQ I', 'erik-timmermans krystian-ogorzelski jakub-kardas')]
  },
  {
    id: 'ac', label: 'Assetto Corsa', short: 'Assetto Corsa',
    directors: [['Director', 'jakub-kardas']],
    teams: [squad('Rezerwy', 'filip-mazgaj piotrek-schabowski rdzewny stephen-fraser')]
  }
]);
