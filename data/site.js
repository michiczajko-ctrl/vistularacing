/**
 * @typedef {Object} RecruitmentConfig
 * @property {'open'|'closed'|'soon'|'tba'} status
 * @property {string} label
 * @property {string[]} programs
 * @property {string} nextRecruitment
 * @property {string} ctaLabel
 * @property {string} ctaUrl
 */

export const site = Object.freeze({
  name: 'Vistula Racing',
  url: 'https://vistularacingteam.web.app',
  /** Set plausibleDomain (e.g. 'vistularacingteam.web.app') to enable cookie-free analytics. */
  analytics: { plausibleDomain: null },
  shortName: 'VRT',
  country: 'Poland',
  foundedAt: '2025-07-26T22:29:51+02:00',
  foundedLabel: '26.07.2025',
  hero: {
    kicker: 'Polish endurance simracing team',
    title: ['Built for', 'the long run.'],
    lead: 'Dane, strategia i wspólna odpowiedzialność zamieniają tempo w wynik - stint po stincie, sezon po sezonie.',
    primaryCta: { label: 'Poznaj Vistula Racing', href: '#history' },
    secondaryCta: { label: 'Wejdź do archiwum', href: '#fleet' }
  },
  record: {
    wins: 18,
    podiums: 31,
    championships: 2,
    races: null
  },
  management: [
    { name: 'Michał Czajkowski', role: 'Founder & Team Principal', driverId: 'michal-czajkowski' },
    { name: 'Jakub Kardas', role: 'Deputy Team Principal', driverId: 'jakub-kardas' },
    { name: 'Grzegorz Zelga', role: 'Former Team Principal · Race Engineer', driverId: null },
    { name: 'Krystian Ogorzelski', role: 'Management', driverId: 'krystian-ogorzelski' },
    { name: 'Wiktor Kocięda', role: 'Driver & Management', driverId: 'wiktor-kocieda' },
    { name: 'Przemek Fabiś', role: 'Driver & Management', driverId: 'przemek-fabis' },
    { name: 'Stephen Fraser', role: 'Team Management', driverId: 'stephen-fraser' }
  ],
  contact: {
    email: 'Vistularacing@gmail.com',
    discord: 'https://discord.gg/McZkGd9gmc',
    instagram: 'https://www.instagram.com/vistularacing/',
    tiktok: 'https://www.tiktok.com/@vistula.racing',
    twitch: 'https://www.twitch.tv/vistula_vision_series'
  },
  /** @type {RecruitmentConfig} */
  recruitment: {
    status: 'closed',
    label: 'Zamknięta',
    programs: ['HY', 'LMP2', 'LMGT3'],
    nextRecruitment: 'Aktywny nabór: brak. Termin kolejnego naboru: TBA - ogłosimy go w kanałach zespołu.',
    ctaLabel: 'Śledź nabór na Discordzie',
    ctaUrl: 'https://discord.gg/McZkGd9gmc'
  }
});

export const history = Object.freeze([
  {
    id: 'roots', years: '2022-2024', title: 'Korzenie', lead: 'Z publicznych lobby Assetto Corsy i nocnych rozmów na Discordzie powstał pomysł na zespół.',
    events: [
      { id: 'garage-roots', date: '2022', title: 'Garażowe początki', body: 'Nie było nazwy, sponsorów ani struktury. Była grupa ludzi, która chciała ścigać się trochę bardziej na serio.', note: 'Bez planu. Z pasją.' },
      { id: 'rot4tion', date: '2023', title: 'Era Rot4tion', body: 'Pierwsza próba zbudowania zespołu rozpadła się przez problemy organizacyjne. Została lekcja: nazwa i logo nie zastąpią ludzi oraz wspólnej pracy.', note: 'Ludzie tworzą zespół.' },
      { id: 'wefc', date: 'Początek 2024', title: 'WEFC', body: 'Worldwide Endurance Formula Championship działało około trzech miesięcy. Projekt pokazał, że największą energię daje nam endurance: strategia, zmiany kierowców i wynik budowany godzinami.' },
      { id: 'endu-racers', date: 'Koniec 2024', title: 'Endu Racers', body: 'Michał Czajkowski i Jakub Kardas podjęli kolejną próbę. Brak stabilnego składu i jasnej struktury zatrzymał projekt, ale przesądził o nowym początku.', note: 'Zaczynamy od nowa.' }
    ]
  },
  {
    id: 'birth', years: '2025', title: 'Narodziny Vistuli', lead: 'Kilka prób doprowadziło do organizacji, która wreszcie utrzymała kurs.',
    events: [
      { id: 'return', date: 'Maj 2025', title: 'Ostatni powrót WEFC', body: 'Krótki powrót wcześniejszego projektu zamknął etap prób. Kilka tygodni później rozpoczęła się praca nad nowym zespołem.' },
      { id: 'name-evolution', date: '15.07.2025', title: 'Początek nowego projektu', body: 'Projekt wystartował jako Endurance Racing Team. W kolejnych tygodniach nazwa ewoluowała przez Vistula Esports i Vistula Team Racing do Vistula Racing Team.', note: 'Endurance Racing Team → Vistula Esports → Vistula Team Racing → VRT' },
      { id: 'founding', date: '26.07.2025', machineDate: '2025-07-26', title: 'Oficjalnie Vistula Racing', body: 'To oficjalna data powstania VRT: zespołu z własnymi barwami, strukturą i kierunkiem na długie wyścigi.', accent: true },
      { id: 'qatar-6h', date: '01.08.2025', machineDate: '2025-08-01', title: 'Chrzest bojowy: Qatar 6H', body: 'Pierwszy poważny test: sześć godzin, jeden samochód, trzy osoby i decyzje podejmowane pod presją stintu.', people: ['Michał Czajkowski', 'Jakub Kardas', 'Krystian Ogorzelski'] },
      { id: 'academy', date: 'Wrzesień 2025', title: 'KYO i Vistula Racing Academy', body: 'Współpraca z KYO zbiegła się z powstaniem Academy - miejsca, w którym mniej doświadczeni kierowcy uczyli się endurance, przygotowania i pracy dla załogi.' },
      { id: 'simline-partnership', date: 'Listopad 2025', title: 'Simline.eu i nowy poziom przygotowań', body: 'Partnerstwo z Simline.eu wsparło pracę w Le Mans Ultimate. Setupy, stinty, strategia, telemetria i rozwój malowań stały się częścią przygotowania do wyścigu.', note: 'Od „jedziemy i zobaczymy” do „przygotowujemy wyścig”.' },
      { id: 'first-wins', date: 'Koniec 2025', title: 'Pierwsze duże wyniki', body: 'Imola 4H i Interlagos 6H przyniosły zwycięstwa w LMGT3. W Le Mans 2.4H przyszło P3, a #777 ukończył 24 Hours of Le Mans na P7 w LMP2 po 355 okrążeniach.' }
    ]
  },
  {
    id: 'growth', years: '2026', title: 'Rozwój i mistrzostwa', lead: 'Vistula weszła na poziom międzynarodowy, rozwijając jednocześnie kierowców i własne zaplecze.',
    events: [
      { id: 'team-wec-title', date: '30.01.2026', machineDate: '2026-01-30', title: 'Drużynowe mistrzostwo Polski WEC', body: 'Załogi #77, #776 i #777 zakończyły krajowy sezon WEC w Le Mans Ultimate na szczycie. Pierwszy tytuł potwierdził wartość pracy całego zespołu.', accent: true },
      { id: 'hec-entry', date: 'Luty 2026', title: 'Wejście do HEC', body: 'Regularna rywalizacja międzynarodowa stała się kolejnym krokiem. Podczas testów w Portimão Aston Martin Vantage GT3 #77 „Red Dream” wygrał swój wyścig.' },
      { id: 'hec-round', date: 'Marzec 2026', title: 'Vistula atakuje HEC', body: 'Krystian Ogorzelski wygrał w LMGT3, Fabian Dusek był drugi. W Hypercarze Jakub Kardas zajął P2, a Karlo Kruhan P5.' },
      { id: 'instant-gaming', date: '10.04.2026', machineDate: '2026-04-10', title: 'Instant Gaming dołącza do partnerów', body: 'Współpraca stała się kolejnym krokiem w budowaniu organizacji rozpoznawalnej także poza paddockiem.' },
      { id: 'hec-title', date: 'Sezon 2026', title: 'Mistrzostwo zespołowe HEC', body: 'VRT zdobył drugi tytuł mistrzowski. Krystian Ogorzelski został mistrzem LMGT3, Fabian Dusek wicemistrzem, a Jakub Kardas wicemistrzem Hypercar.', accent: true },
      { id: 'driver-path', date: '19.06.2026', machineDate: '2026-06-19', title: 'Jedna droga rozwoju kierowców', body: 'Academy zakończyła działalność w osobnej strukturze. Kierowcy PRO, PRO-AM i AM stali się częścią jednego systemu awansu w VRT.', note: 'Rozwój → wyniki → awans.' },
      /* TODO(uzupelnij.md): daty i szczegóły trzech wpisów poniżej do potwierdzenia przez zespół. */
      { id: 'vision-performance', date: 'Sezon 2026', title: 'Partnerstwo z Vision Performance', body: 'Vistula Racing nawiązała współpracę z Vision Performance Racing Team. Wspólny kierunek: rozwój kierowców, przygotowanie do wyścigów i budowa serii, która miała połączyć obie organizacje.', note: 'Dwie ekipy. Jedna seria.', accent: true },
      { id: 'technology', date: '2026', title: 'Vistula Labs: technologia z padoku', body: 'Z Vistula Labs wyrosły projekty RaceGuard i koncepcja VRT Pitwall. Zespół rozwijał także sekcję rajdową - wszystko po to, by decyzje w wyścigu opierać na danych, nie na przeczuciu.' },
      { id: 'vves', date: '18.09.2026', machineDate: '2026-09-18', title: 'Prolog na Fuji - start Vistula Vision Series', body: 'Pierwszy krok własnego ekosystemu ligowego. Prolog na Fuji otworzył Vistula Vision Series, serię organizowaną z Vision Performance. W stawce byli kierowcy Hypercar i GT3.', note: 'From public lobbies to the podium.', accent: true },
      { id: 'racecontrol', date: 'Q4 2026', title: 'VRS Racecontrol w produkcji', body: 'Tworzymy VRS Racecontrol - aplikację do prowadzenia wyścigów: sędziowanie, wyniki na żywo i narzędzia dla organizatorów serii. Powstaje z potrzeb Vistula Vision Series.', note: 'Własna seria. Własne narzędzia.' }
    ]
  }
]);
