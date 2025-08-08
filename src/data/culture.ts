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

const out: CultureQuestion[] = [];

// Geography: city -> province (single phrasing per concept)
for (const [city, prov] of cityToProvince) {
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
for (const [name, city] of landmarks) {
  const answers = ['Barcelona','Girona','Tarragona','Lleida'];
  const correctIdx = answers.indexOf(city);
  const q = `In which city is ${name}?`;
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
