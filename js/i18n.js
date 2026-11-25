/**
 * Minimal i18n. Polish is the source language: t('polski tekst') returns the English
 * translation on /en/ and the original text otherwise. Brakujący klucz zostaje po polsku.
 */
export const lang = document.documentElement.lang === 'en' ? 'en' : 'pl';
export const locale = lang === 'en' ? 'en-GB' : 'pl-PL';

const en = {
  /* nawigacja i hero */
  'Zamknij menu': 'Close menu',
  'Otwórz menu': 'Open menu',
  'Pokaż wszystkich': 'Show all',
  /* sekcje (paleta Ctrl+K) */
  'O nas': 'About',
  'Historia': 'History',
  'Flota': 'Fleet',
  'Zespół': 'Team',
  'Wyniki': 'Results',
  'Sezon': 'Season',
  'Transmisje': 'Live',
  'Galeria': 'Gallery',
  'Partnerzy': 'Partners',
  'Rekrutacja': 'Recruitment',
  'Sekcja': 'Section',
  'Samochód': 'Car',
  'Kierowca': 'Driver',
  'Brak wyników': 'No results',
  'Dołączył': 'Joined',
  'Tydz. od': 'Week of',
  'Dział wewnętrzny': 'Internal division',
  'Wewnętrzny dział oprogramowania, technologii i infrastruktury: VRS Race Control, VRT Pitwall i VRT-SITE.': 'Internal software, technology and infrastructure division: VRS Race Control, VRT Pitwall and VRT-SITE.',
  'Marka suplementów i napojów dla graczy: focus, energia, nawodnienie i sen. „Fuel Better. Push Further. Be ADVANCED."': 'Gaming supplement and drink brand: focus, energy, hydration and sleep. "Fuel Better. Push Further. Be ADVANCED."',
  'Najnowsze podia': 'Latest podiums',
  'Oficjalny drugi sponsor Vistula Racing.': 'Official second sponsor of Vistula Racing.',
  /* liczby */
  'Zwycięstwa': 'Wins',
  'Podia': 'Podiums',
  'Mistrzostwa': 'Championships',
  'Kierowcy': 'Drivers',
  'Modele aut': 'Car models',
  'Programy': 'Programmes',
  /* historia */
  'Załoga': 'Crew',
  /* flota */
  'Wszystkie': 'All',
  'Otwórz profil': 'Open profile',
  'Poprzedni samochód': 'Previous car',
  'Następny samochód': 'Next car',
  'w barwach Vistula Racing': 'in Vistula Racing colours',
  'Numer': 'Number',
  'Program': 'Programme',
  /* zespół i porównywarka */
  'Wszyscy': 'Everyone',
  'Kadra programu': 'Programme roster',
  'kierowców': 'drivers',
  'Profil samochodu': 'Car profile',
  'Samochód reprezentujący klasę. Składy konkretnych entry zostaną opublikowane po potwierdzeniu przez zespół.': 'A car representing the class. Line-ups for specific entries will be published once confirmed by the team.',
  'Portret kierowcy': 'Driver portrait',
  'Porównaj': 'Compare',
  'Wybrany': 'Selected',
  'wybierz drugą osobę': 'pick a second driver',
  'Parametr': 'Parameter',
  'Rola': 'Role',
  'Narodowość': 'Nationality',
  'Starty': 'Starts',
  'Pole position': 'Pole positions',
  'Brak danych': 'No data',
  'Statystyki pojawią się po weryfikacji danych przez zespół.': 'Statistics will appear once the team has verified the data.',
  /* wyniki */
  'Zdobyte razem.': 'Won together.',
  'Wybierz trofeum, aby zobaczyć rezultat i skład.': 'Pick a trophy to see the result and line-up.',
  'Zobacz szczegóły': 'See details',
  'Ostatnie wyniki': 'Recent results',
  'Wyniki przekazane przez zespół. Kolejność i dokładne daty rund nie zostały określone.': 'Results provided by the team. The order and exact dates of the rounds have not been specified.',
  /* galeria */
  'Powiększ': 'Enlarge',
  'Wydarzenie': 'Event',
  'Rok': 'Year',
  /* profil (dialog) */
  'Przegląd': 'Overview',
  'Statystyki': 'Statistics',
  'Wyścigi': 'Races',
  'Producent': 'Manufacturer',
  'Model': 'Model',
  'Sezony': 'Seasons',
  'Seria': 'Series',
  'Tor': 'Track',
  'Wynik': 'Result',
  'Skład': 'Line-up',
  'Flota Vistula': 'Vistula Fleet',
  'Zespół Vistula': 'Vistula Team',
  'Archiwum wyników': 'Results archive',
  'Trofeum za': 'Trophy for',
  'Materiał archiwalny': 'Archive material',
  'Zobacz opublikowaną historię': 'See the published story',
  /* partnerzy i nabór */
  'Partner Vistula Racing.': 'Vistula Racing partner.',
  'Logo ': 'Logo ',
  'Historia współpracy': 'Partnership story',
  'Strona partnera': 'Partner website',
  'Status naboru': 'Recruitment status',
  'Aktywny nabór: brak. Termin kolejnego naboru: TBA - ogłosimy go w kanałach zespołu.': 'No active recruitment. Next intake date: TBA - we will announce it on the team channels.',
  'Śledź nabór na Discordzie': 'Follow recruitment on Discord',
  'Dołącz na Discord': 'Join on Discord',
  /* sezon i transmisje */
  'Najbliższa runda': 'Next round',
  'Kalendarz sezonu': 'Season calendar',
  'Klasyfikacje': 'Standings',
  'Załogi': 'Crews',
  'Wolne miejsce': 'Open seat',
  'Dni': 'Days',
  'Godz.': 'Hrs',
  'Min.': 'Min',
  'czas warszawski': 'Warsaw time',
  'Zakończona': 'Finished',
  'Transmisja': 'Stream',
  'Pozycja': 'Pos',
  'Załoga / zespół': 'Crew / team',
  'Punkty': 'Points',
  'Odtwórz: ': 'Play: ',
  /* formularz */
  'Otwieram Twój program pocztowy z gotową wiadomością. Jeśli nic się nie stało, użyj przycisku „Skopiuj treść”.': 'Opening your email app with a ready message. If nothing happens, use the “Copy message” button.',
  'Skopiowano. Wyślij wiadomość na adres zespołu.': 'Copied. Send the message to the team address.',
  'Nie udało się skopiować - zaznacz treść ręcznie.': 'Could not copy - select the text manually.'
};

export const t = (text) => (lang === 'en' ? en[text] ?? text : text);

export const formatDate = (iso, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString(locale, options);
};
