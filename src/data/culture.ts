export type CultureQuestion = { question: string; options: string[]; answerIndex: number; topic: 'history'|'culture'|'cuisine'|'geography' };

// Build 300 unique questions programmatically across topics with unique wordings
const PROVINCES = ['Barcelona','Girona','Tarragona','Lleida'] as const;

const cityToProvince: Array<[string, typeof PROVINCES[number]]> = [
  ['Barcelona','Barcelona'], ['L’Hospitalet de Llobregat','Barcelona'], ['Badalona','Barcelona'], ['Sabadell','Barcelona'], ['Terrassa','Barcelona'],
  ['Mataró','Barcelona'], ['Granollers','Barcelona'], ['Manresa','Barcelona'], ['Vilafranca del Penedès','Barcelona'], ['Sitges','Barcelona'],
  ['Girona','Girona'], ['Figueres','Girona'], ['Blanes','Girona'], ['Olot','Girona'], ['Banyoles','Girona'],
  ['Tarragona','Tarragona'], ['Reus','Tarragona'], ['Valls','Tarragona'], ['Tortosa','Tarragona'], ['Amposta','Tarragona'],
  ['Lleida','Lleida'], ['Balaguer','Lleida'], ['La Seu d’Urgell','Lleida'], ['Tàrrega','Lleida'], ['Vielha e Mijaran','Lleida'],
];

const dishes: Array<[string, string]> = [
  ['pa amb tomàquet','Bread rubbed with tomato, oil, and salt'],
  ['escalivada','Roasted peppers, aubergine, and onion'],
  ['fideuà','Noodle dish similar to paella'],
  ['suquet de peix','Catalan fish stew'],
  ['escudella i carn d’olla','Meat and vegetable stew'],
  ['crema catalana','Custard dessert with caramelized sugar'],
  ['panellets','Almond sweets for All Saints’ Day'],
  ['botifarra amb mongetes','Sausage with white beans'],
  ['esqueixada','Shredded salted cod salad'],
  ['trinxat','Cabbage and potato hash with pork'],
  ['cargols a la llauna','Grilled snails with aioli'],
  ['xató','Endive salad with romesco-like sauce'],
  ['coca de recapte','Flatbread with roasted vegetables'],
  ['coca de Sant Joan','Sweet brioche-like coca with candied fruit'],
  ['allioli','Garlic and oil emulsion'],
  ['mar i muntanya','Surf and turf stew'],
  ['calçots','Grilled spring onions'],
  ['fricandó','Veal stew with mushrooms'],
  ['bacallà a la llauna','Baked cod with paprika and tomato'],
  ['arròs negre','Black rice with squid ink'],
];

const figures: Array<[string, string]> = [
  ['Antoni Gaudí','architect'],
  ['Lluís Domènech i Montaner','architect'],
  ['Josep Puig i Cadafalch','architect'],
  ['Pau Casals','cellist'],
  ['Joan Miró','painter'],
  ['Salvador Dalí','painter'],
  ['Mercè Rodoreda','writer'],
  ['Montserrat Caballé','soprano'],
  ['Pep Guardiola','football coach'],
  ['Núria Espert','actress and theatre director'],
  ['Xavier Cugat','bandleader'],
  ['Jacint Verdaguer','poet'],
  ['Josep Carreras','tenor'],
  ['Laia Sanz','motorcycle racer'],
  ['Ferran Adrià','chef'],
  ['C. R. Zafón','novelist'],
  ['Ariadna Gil','actress'],
  ['Estopa','music duo'],
  ['Quim Monzó','writer'],
  ['Lola Casas','children’s author'],
];

const landmarks: Array<[string, 'Barcelona'|'Girona'|'Tarragona'|'Lleida']> = [
  ['Sagrada Família','Barcelona'], ['Park Güell','Barcelona'], ['Casa Batlló','Barcelona'], ['La Pedrera (Casa Milà)','Barcelona'],
  ['Hospital de Sant Pau','Barcelona'], ['Palau de la Música Catalana','Barcelona'], ['Cathedral of Barcelona','Barcelona'], ['Santa Maria del Mar','Barcelona'],
  ['Arc de Triomf (BCN)','Barcelona'], ['La Rambla','Barcelona'], ['Mercat de la Boqueria','Barcelona'], ['Montjuïc','Barcelona'],
  ['Girona Cathedral','Girona'], ['Cases de l’Onyar','Girona'], ['Barri Jueu (Girona)','Girona'],
  ['Amphitheatre of Tarragona','Tarragona'], ['Tarraco Roman ruins','Tarragona'],
  ['Seu Vella (Old Cathedral of Lleida)','Lleida'], ['La Paeria (Lleida)','Lleida'],
];

const festivals: Array<[string, string]> = [
  ['La Mercè','Major festival of Barcelona'],
  ['Temps de Flors','Flower festival in Girona'],
  ['Concurs de Castells','Human towers competition in Tarragona'],
  ['Patum de Berga','Traditional festival in Berga (UNESCO)'],
  ['Sant Jordi','Books and roses day (23 April)'],
  ['La Diada','National Day of Catalonia (11 September)'],
  ['Sant Joan','Bonfires to welcome summer (24 June)'],
  ['Reis','Three Kings Day (6 January)'],
];

const rivers = ['Ebre (Ebro)','Ter','Llobregat','Segre'] as const;
const mountains = ['Montserrat','Montseny','Cadí','Puigmal'] as const;

// Small helpers for sampling distractors
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function sampleFromPool<T>(pool: T[], count: number, exclude: (x: T) => boolean): T[] {
  const candidates = pool.filter((x) => !exclude(x));
  shuffle(candidates);
  return candidates.slice(0, Math.max(0, Math.min(count, candidates.length)));
}

function buildAnswerSet(correctAnswer: string, distractors: string[]): { options: string[]; answerIndex: number } {
  const uniqueDistractors = distractors.filter((d) => d !== correctAnswer);
  const chosenDistractors = uniqueDistractors.slice(0, 3);
  const options = [...chosenDistractors];
  const randomIndex = Math.floor(Math.random() * 4);
  options.splice(randomIndex, 0, correctAnswer);
  return { options, answerIndex: randomIndex };
}

const out: CultureQuestion[] = [];

// Geography: city -> province (single phrasing per concept)
// Skip cases where city equals its province to avoid leaking the answer
for (const [city, prov] of cityToProvince) {
  if (city === prov) continue;
  const answers = PROVINCES as unknown as string[];
  const correctIdx = answers.indexOf(prov);
  const q = `Which province contains ${city}?`;
  out.push({ topic: 'geography', question: q, options: answers, answerIndex: correctIdx });
}

// Cuisine: dish -> description (single phrasing; distractors from other dishes)
const allDishDescriptions = dishes.map(([, d]) => d);
for (const [dish, desc] of dishes) {
  const distractors = sampleFromPool(allDishDescriptions, 3, (d) => d === desc);
  const answers = [desc, ...distractors];
  const correctIdx = 0;
  const q = `Which description best fits ${dish}?`;
  out.push({ topic: 'cuisine', question: q, options: answers, answerIndex: correctIdx });
}

// Culture: figure -> role (single phrasing; distractors from other roles)
const rolePool = Array.from(new Set(figures.map(([, role]) => role)));
for (const [name, role] of figures) {
  const distractors = sampleFromPool(rolePool, 3, (r) => r === role);
  const answers = [role, ...distractors];
  const correctIdx = 0;
  const q = `Who was ${name}?`;
  out.push({ topic: 'culture', question: q, options: answers, answerIndex: correctIdx });
}

// Culture/Geography: landmark -> city (single phrasing)
// If the landmark name contains a parenthetical that includes the correct city name,
// strip that parenthetical. If the remaining name still mentions the city, drop the question.
for (const [name, city] of landmarks) {
  // Remove any parenthetical that contains the exact city name (case-insensitive)
  const sanitizedName = name
    .replace(/\s*\(([^)]*)\)\s*/g, (match, inner) => {
      return (String(inner).toLowerCase().includes(city.toLowerCase())) ? ' ' : match;
    })
    .replace(/\s{2,}/g, ' ')
    .trim();

  // If the sanitized name still includes the city name, skip this question to avoid leakage
  const mentionsCity = new RegExp(`\\b${city}\\b`, 'i').test(sanitizedName);
  if (mentionsCity) continue;

  const answers = ['Barcelona','Girona','Tarragona','Lleida'];
  const correctIdx = answers.indexOf(city);
  const q = `In which city is ${sanitizedName}?`;
  out.push({ topic: 'culture', question: q, options: answers, answerIndex: correctIdx });
}

// Geography: features description
for (const r of rivers) {
  const answers = ['River in/near Catalonia', 'Mountain range', 'Coastal town', 'Natural park'];
  out.push({ topic: 'geography', question: `The ${r} is a…`, options: answers, answerIndex: 0 });
}
for (const m of mountains) {
  const answers = ['Mountain/massif in Catalonia', 'River delta', 'Urban district', 'Island'];
  out.push({ topic: 'geography', question: `${m} is best described as a…`, options: answers, answerIndex: 0 });
}

// History & calendar (single phrasing)
const commemorations: Array<[string,string]> = [
  ['11 September','National Day of Catalonia (La Diada)'],
  ['23 April','Sant Jordi (books and roses)'],
  ['24 June','Sant Joan (bonfires)'],
  ['6 January','Three Kings Day'],
];
for (const [date, event] of commemorations) {
  const answers = [event, 'Spanish Constitution Day', 'Andalusian Day', 'Castile Day'];
  const q = `What is celebrated on ${date}?`;
  out.push({ topic: 'history', question: q, options: answers, answerIndex: 0 });
}

// Additional Catalan history questions (25)
type HistorySeed = { question: string; correct: string; distractors: string[] };
const historySeeds: HistorySeed[] = [
  {
    question: 'In which year did the Siege of Barcelona end during the War of the Spanish Succession?',
    correct: '1714',
    distractors: ['1640', '1707', '1808'],
  },
  {
    question: 'The Reapers’ War began in which year?',
    correct: '1640',
    distractors: ['1659', '1714', '1705'],
  },
  {
    question: 'Which treaty ceded Roussillon and northern Cerdanya to France?',
    correct: 'Treaty of the Pyrenees',
    distractors: ['Treaty of Utrecht', 'Treaty of Lisbon', 'Treaty of Versailles'],
  },
  {
    question: 'Who served as the Conseller en Cap of Barcelona during the city’s 1714 defense?',
    correct: 'Rafael Casanova',
    distractors: ['Pau Claris', 'Josep Moragues', 'Narcís Feliu de la Penya'],
  },
  {
    question: 'What was the medieval assembly of the Principality known as?',
    correct: 'Les Corts Catalanes',
    distractors: ['The Cortes of Cádiz', 'The Estates General', 'Parliament of Westminster'],
  },
  {
    question: 'The 1932 Statute of Autonomy is commonly known by which name?',
    correct: 'Statute of Núria',
    distractors: ['Statute of Sau', 'Statute of Sant Cugat', 'Statute of Montserrat'],
  },
  {
    question: 'Which president declared a State within the Spanish Federal Republic in October 1934?',
    correct: 'Lluís Companys',
    distractors: ['Francesc Macià', 'Josep Tarradellas', 'Jordi Pujol'],
  },
  {
    question: 'Who famously proclaimed “Ja sóc aquí” upon returning from exile in 1977?',
    correct: 'Josep Tarradellas',
    distractors: ['Lluís Companys', 'Francesc Macià', 'Pasqual Maragall'],
  },
  {
    question: 'Which decree abolished Catalonia’s constitutions after the War of the Spanish Succession?',
    correct: 'Nueva Planta Decrees',
    distractors: ['Pragmatic Sanction', 'Alhambra Decree', 'Edict of Nantes'],
  },
  {
    question: 'What was the confederation linking the County of Barcelona with Aragon known as?',
    correct: 'Crown of Aragon',
    distractors: ['Crown of Castile', 'Holy Roman Empire', 'Duchy of Burgundy'],
  },
  {
    question: 'Which monarch, nicknamed “the Ceremonious,” consolidated institutions in the 14th century?',
    correct: 'Peter IV',
    distractors: ['James I', 'Ferdinand II', 'Alfonso V'],
  },
  {
    question: 'Who led the 1641 proclamation placing Catalonia under French protection as President of the Generalitat?',
    correct: 'Pau Claris',
    distractors: ['Rafael Casanova', 'Narcís Monturiol', 'Josep Puig i Cadafalch'],
  },
  {
    question: 'Which sector primarily drove Catalonia’s 19th-century industrialization?',
    correct: 'Textile manufacturing',
    distractors: ['Shipbuilding', 'Mining', 'Wine production'],
  },
  {
    question: 'The capture of which city in January 1939 marked the end of the Civil War in Catalonia?',
    correct: 'Barcelona',
    distractors: ['Girona', 'Lleida', 'Tarragona'],
  },
  {
    question: 'Which body governed Barcelona’s municipal affairs from the Middle Ages until 1714?',
    correct: 'Consell de Cent',
    distractors: ['Junta de Comerç', 'Diputació del General', 'Audiencia de Barcelona'],
  },
  {
    question: 'Who authored the Catalan Atlas of 1375?',
    correct: 'Abraham Cresques',
    distractors: ['Jaume Ferrer de Blanes', 'Joan de la Cosa', 'Piri Reis'],
  },
  {
    question: 'What does the term “Renaixença” refer to?',
    correct: '19th-century revival of Catalan language and literature',
    distractors: ['Medieval university movement', 'Agricultural collectivization', 'Baroque art trend'],
  },
  {
    question: 'Who co-founded the Orfeó Català in 1891?',
    correct: 'Lluís Millet',
    distractors: ['Enric Granados', 'Isaac Albéniz', 'Pau Casals'],
  },
  {
    question: 'Who served as the first president of the Mancomunitat de Catalunya (1914)?',
    correct: 'Enric Prat de la Riba',
    distractors: ['Josep Puig i Cadafalch', 'Francesc Cambó', 'Antoni Maura'],
  },
  {
    question: 'The Nueva Planta was promulgated under which monarch?',
    correct: 'Philip V',
    distractors: ['Charles III', 'Ferdinand VII', 'Philip II'],
  },
  {
    question: 'The Reapers’ War concluded with which agreement in 1659?',
    correct: 'Treaty of the Pyrenees',
    distractors: ['Treaty of the Hague', 'Treaty of Rastatt', 'Treaty of Utrecht'],
  },
  {
    question: 'Which Catalan general was executed after 1714 and became a symbol of resistance?',
    correct: 'Josep Moragues',
    distractors: ['Antoni de Villarroel', 'Rafael Casanova', 'Manuel Desvalls'],
  },
  {
    question: 'Which medieval compilation set out maritime law across Mediterranean ports of the realm?',
    correct: 'Llibre del Consolat de Mar',
    distractors: ['Siete Partidas', 'Magna Carta', 'Laws of the Indies'],
  },
  {
    question: 'What name is given to the riot on Corpus Christi in 1640 that sparked the uprising?',
    correct: 'Corpus de Sang',
    distractors: ['La Gloriosa', 'La Triennal', 'Nit de Sant Bartomeu'],
  },
  {
    question: 'Which year saw the formation of the Mancomunitat de Catalunya?',
    correct: '1914',
    distractors: ['1901', '1923', '1932'],
  },
  {
    question: 'Which ruler is associated with the dynastic union that later paved the way for the Spanish monarchy?',
    correct: 'Ferdinand II of Aragon',
    distractors: ['Henry IV of Castile', 'Charles V', 'John II of Aragon'],
  },
];

for (const seed of historySeeds) {
  const { options, answerIndex } = buildAnswerSet(seed.correct, seed.distractors);
  out.push({ topic: 'history', question: seed.question, options, answerIndex });
}

// Additional culture & traditions questions (20)
type CultureSeed = { question: string; correct: string; distractors: string[] };
const cultureSeeds: CultureSeed[] = [
  {
    question: 'Which Catalan tradition builds multi-tier human towers?',
    correct: 'Castells',
    distractors: ['Sardana', 'Correfoc', 'Ball de bastons'],
  },
  {
    question: 'Which traditional circle dance is accompanied by a cobla?',
    correct: 'Sardana',
    distractors: ['Jota', 'Ball de bastons', 'Muiñeira'],
  },
  {
    question: "Which Christmas custom involves striking a log so it 'gives' gifts?",
    correct: 'Caga Tió',
    distractors: ['Cavalcada de Reis', 'Olentzero', 'Pessebre vivent'],
  },
  {
    question: 'Which Nativity scene figure is depicted crouching as a humorous good-luck symbol?',
    correct: 'Caganer',
    distractors: ['Pastoret', 'Herodes', 'Àngel'],
  },
  {
    question: 'Which seasonal gathering centers on grilling long onions served with a nutty red sauce?',
    correct: 'Calçotada',
    distractors: ['Aplec del Caragol', 'Festa de la Verema', 'Magosto'],
  },
  {
    question: 'Which sauce of roasted peppers, tomato, almonds and hazelnuts is traditional with calçots?',
    correct: 'Romesco',
    distractors: ['Salsa brava', 'Allioli', 'Xató'],
  },
  {
    question: 'Which figures are towering papier-mâché giants paraded through streets?',
    correct: 'Gegants',
    distractors: ['Capgrossos', 'Diables', 'Trabucaires'],
  },
  {
    question: 'Which characters wear oversized heads accompanying giants in parades?',
    correct: 'Capgrossos',
    distractors: ['Gegants', 'Bastoners', 'Castellers'],
  },
  {
    question: 'Which spectacle features devil troupes running under sparks from handheld fireworks?',
    correct: 'Correfoc',
    distractors: ['Focs de Sant Joan', 'Passacarrers', 'Batucada'],
  },
  {
    question: 'In a human tower, what is the mass of supporters at ground level called?',
    correct: 'Pinya',
    distractors: ['Tronc', 'Folre', 'Manilles'],
  },
  {
    question: 'What is the typical ensemble that accompanies the Sardana?',
    correct: 'Cobla',
    distractors: ['Charanga', 'Orfeó', 'Rondalla'],
  },
  {
    question: 'Which genre of songs, often accompanied by rom cremat, is sung at coastal gatherings?',
    correct: 'Havaneres',
    distractors: ['Jotes', 'Fados', "Cant d'estil"],
  },
  {
    question: 'What name is given to the broken-tile mosaic style seen on Modernisme architecture?',
    correct: 'Trencadís',
    distractors: ['Sgrafitto', 'Marqueteria', 'Opus tessellatum'],
  },
  {
    question: 'Which folk dance involves pairs striking wooden sticks rhythmically?',
    correct: 'Ball de bastons',
    distractors: ['Ball de gitanes', 'Sardana', 'Bolero'],
  },
  {
    question: "Which style blending flamenco and Afro-Cuban rhythms is associated with Barcelona's Romani communities?",
    correct: 'Rumba catalana',
    distractors: ['Sevillanas', 'Sardana', 'Nova cançó'],
  },
  {
    question: 'Which event in Sant Sadurní d’Anoia showcases cava each autumn?',
    correct: 'Cavatast',
    distractors: ['Temps de Flors', 'Fira de Santa Llúcia', 'Mercat de Música Viva'],
  },
  {
    question: 'Which event in Lleida centers on eating snails cooked a la llauna?',
    correct: 'Aplec del Caragol',
    distractors: ['Fira de Tots Sants', 'Festa de la Ratafia', 'Festa dels Traginers'],
  },
  {
    question: 'Which double-reed instrument often leads festive parades and casteller events?',
    correct: 'Gralla',
    distractors: ['Tenora', 'Tible', 'Gaita'],
  },
  {
    question: 'Which cultural movement around the 1910s promoted order and classicism over Modernisme?',
    correct: 'Noucentisme',
    distractors: ['Decadentisme', 'Futurisme', 'Romanticisme'],
  },
  {
    question: 'Which night-time celebration on 23 June involves bonfires and fireworks to welcome summer?',
    correct: 'Revetlla de Sant Joan',
    distractors: ['Nit dels Museus', 'La Mercè', 'Falles de Sant Josep'],
  },
];

for (const seed of cultureSeeds) {
  const { options, answerIndex } = buildAnswerSet(seed.correct, seed.distractors);
  out.push({ topic: 'culture', question: seed.question, options, answerIndex });
}

// Deduplicate by exact question text
const unique: CultureQuestion[] = [];
const seen = new Set<string>();
for (const q of out) {
  if (!seen.has(q.question)) {
    seen.add(q.question);
    unique.push(q);
  }
}

// Export unique questions only to avoid repetitions in a session
export const cultureQuestions: CultureQuestion[] = unique;
