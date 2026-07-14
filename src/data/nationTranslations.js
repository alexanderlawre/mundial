// Per-language display names for nations, keyed by the canonical English
// `name` used everywhere else in the app as the stable identifier (state,
// matchState team refs, bracket skeleton wiring, etc.). This table is
// display-only: nothing here is ever used for lookups or equality checks --
// see lib/i18n.jsx's `tn()` helper, the only consumer.
//
// Only entries that actually differ from the English name are listed; any
// nation missing from a language's table (mostly small/obscure nations whose
// name is identical or near-identical across languages) falls back to the
// English name automatically.

export const ES = {
  Albania: 'Albania', Armenia: 'Armenia', Austria: 'Austria', Azerbaijan: 'Azerbaiyán',
  Belarus: 'Bielorrusia', Belgium: 'Bélgica', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina',
  Bulgaria: 'Bulgaria', Croatia: 'Croacia', Cyprus: 'Chipre', Czechia: 'Chequia',
  Denmark: 'Dinamarca', England: 'Inglaterra', Estonia: 'Estonia', 'Faroe Islands': 'Islas Feroe',
  Finland: 'Finlandia', France: 'Francia', Georgia: 'Georgia', Germany: 'Alemania',
  Greece: 'Grecia', Hungary: 'Hungría', Iceland: 'Islandia', Italy: 'Italia',
  Kazakhstan: 'Kazajistán', Latvia: 'Letonia', Lithuania: 'Lituania', Luxembourg: 'Luxemburgo',
  Moldova: 'Moldavia', Netherlands: 'Países Bajos', 'North Macedonia': 'Macedonia del Norte',
  'Northern Ireland': 'Irlanda del Norte', Norway: 'Noruega', Poland: 'Polonia',
  'Republic of Ireland': 'República de Irlanda', Romania: 'Rumania', Russia: 'Rusia',
  Scotland: 'Escocia', Serbia: 'Serbia', Slovakia: 'Eslovaquia', Slovenia: 'Eslovenia',
  Spain: 'España', Sweden: 'Suecia', Switzerland: 'Suiza', Türkiye: 'Turquía',
  Ukraine: 'Ucrania', Wales: 'Gales',

  Algeria: 'Argelia', Benin: 'Benín', Cameroon: 'Camerún', 'Cabo Verde': 'Cabo Verde',
  'Central African Republic': 'República Centroafricana', Chad: 'Chad', Comoros: 'Comoras',
  'DR Congo': 'República Democrática del Congo', Djibouti: 'Yibuti', Egypt: 'Egipto',
  'Equatorial Guinea': 'Guinea Ecuatorial', Ethiopia: 'Etiopía', Guinea: 'Guinea',
  'Guinea-Bissau': 'Guinea-Bisáu', "Côte d'Ivoire": 'Costa de Marfil', Kenya: 'Kenia',
  Libya: 'Libia', Mauritania: 'Mauritania', Mauritius: 'Mauricio', Morocco: 'Marruecos',
  Mozambique: 'Mozambique', Rwanda: 'Ruanda', 'Sao Tome and Principe': 'Santo Tomé y Príncipe',
  Seychelles: 'Seychelles', 'Sierra Leone': 'Sierra Leona', 'South Africa': 'Sudáfrica',
  'South Sudan': 'Sudán del Sur', Sudan: 'Sudán', Tanzania: 'Tanzania', Tunisia: 'Túnez',

  Afghanistan: 'Afganistán', Australia: 'Australia', Bahrain: 'Baréin', Bhutan: 'Bután',
  Cambodia: 'Camboya', 'Chinese Taipei': 'Taipéi Chino', Iran: 'Irán', Iraq: 'Irak',
  Japan: 'Japón', Jordan: 'Jordania', 'North Korea': 'Corea del Norte', 'South Korea': 'Corea del Sur',
  Kyrgyzstan: 'Kirguistán', Lebanon: 'Líbano', Malaysia: 'Malasia', Maldives: 'Maldivas',
  Mongolia: 'Mongolia', Pakistan: 'Pakistán', Palestine: 'Palestina', Philippines: 'Filipinas',
  'Saudi Arabia': 'Arabia Saudita', Singapore: 'Singapur', Syria: 'Siria',
  Tajikistan: 'Tayikistán', Thailand: 'Tailandia', 'Timor-Leste': 'Timor Oriental',
  Turkmenistan: 'Turkmenistán', 'United Arab Emirates': 'Emiratos Árabes Unidos',
  Uzbekistan: 'Uzbekistán', Yemen: 'Yemen',

  Brazil: 'Brasil', Peru: 'Perú',

  'Antigua and Barbuda': 'Antigua y Barbuda', 'British Virgin Islands': 'Islas Vírgenes Británicas',
  Canada: 'Canadá', 'Cayman Islands': 'Islas Caimán', Curacao: 'Curazao',
  'Dominican Republic': 'República Dominicana', Grenada: 'Granada', Haiti: 'Haití',
  Jamaica: 'Jamaica', Mexico: 'México', Panama: 'Panamá',
  'St. Kitts and Nevis': 'San Cristóbal y Nieves', 'St. Lucia': 'Santa Lucía',
  'St. Vincent and the Grenadines': 'San Vicente y las Granadinas', Suriname: 'Surinam',
  'Trinidad and Tobago': 'Trinidad y Tobago', 'Turks and Caicos Islands': 'Islas Turcas y Caicos',
  'United States': 'Estados Unidos', 'US Virgin Islands': 'Islas Vírgenes de los Estados Unidos',

  'American Samoa': 'Samoa Americana', 'Cook Islands': 'Islas Cook', Fiji: 'Fiyi',
  'New Caledonia': 'Nueva Caledonia', 'New Zealand': 'Nueva Zelanda',
  'Papua New Guinea': 'Papúa Nueva Guinea', 'Solomon Islands': 'Islas Salomón',
}

export const PT = {
  Armenia: 'Armênia', Austria: 'Áustria', Azerbaijan: 'Azerbaijão', Belarus: 'Bielorrússia',
  Belgium: 'Bélgica', 'Bosnia and Herzegovina': 'Bósnia e Herzegovina', Bulgaria: 'Bulgária',
  Croatia: 'Croácia', Cyprus: 'Chipre', Czechia: 'Chéquia', Denmark: 'Dinamarca',
  England: 'Inglaterra', Estonia: 'Estônia', 'Faroe Islands': 'Ilhas Faroé', Finland: 'Finlândia',
  France: 'França', Georgia: 'Geórgia', Germany: 'Alemanha', Greece: 'Grécia', Hungary: 'Hungria',
  Iceland: 'Islândia', Italy: 'Itália', Kazakhstan: 'Cazaquistão', Latvia: 'Letônia',
  Lithuania: 'Lituânia', Luxembourg: 'Luxemburgo', Moldova: 'Moldávia', Netherlands: 'Países Baixos',
  'North Macedonia': 'Macedônia do Norte', 'Northern Ireland': 'Irlanda do Norte', Norway: 'Noruega',
  Poland: 'Polônia', 'Republic of Ireland': 'República da Irlanda', Romania: 'Romênia',
  Russia: 'Rússia', Scotland: 'Escócia', Serbia: 'Sérvia', Slovakia: 'Eslováquia',
  Slovenia: 'Eslovênia', Spain: 'Espanha', Sweden: 'Suécia', Switzerland: 'Suíça',
  Türkiye: 'Turquia', Ukraine: 'Ucrânia', Wales: 'País de Gales',

  Algeria: 'Argélia', Cameroon: 'Camarões', 'Central African Republic': 'República Centro-Africana',
  Chad: 'Chade', Comoros: 'Comores', 'DR Congo': 'República Democrática do Congo',
  Djibouti: 'Djibuti', Egypt: 'Egito', 'Equatorial Guinea': 'Guiné Equatorial', Ethiopia: 'Etiópia',
  Guinea: 'Guiné', 'Guinea-Bissau': 'Guiné-Bissau', "Côte d'Ivoire": 'Costa do Marfim',
  Kenya: 'Quênia', Libya: 'Líbia', Mauritania: 'Mauritânia', Mauritius: 'Maurícia',
  Morocco: 'Marrocos', Mozambique: 'Moçambique', Rwanda: 'Ruanda',
  'Sao Tome and Principe': 'São Tomé e Príncipe', Seychelles: 'Seicheles',
  'Sierra Leone': 'Serra Leoa', 'South Africa': 'África do Sul', 'South Sudan': 'Sudão do Sul',
  Sudan: 'Sudão', Tanzania: 'Tanzânia', Tunisia: 'Tunísia',

  Afghanistan: 'Afeganistão', Australia: 'Austrália', Bahrain: 'Bahrein', Bhutan: 'Butão',
  Cambodia: 'Camboja', 'Chinese Taipei': 'Taipé Chinesa', Iraq: 'Iraque', Japan: 'Japão',
  Jordan: 'Jordânia', 'North Korea': 'Coreia do Norte', 'South Korea': 'Coreia do Sul',
  Kyrgyzstan: 'Quirguistão', Lebanon: 'Líbano', Malaysia: 'Malásia', Maldives: 'Maldivas',
  Mongolia: 'Mongólia', Pakistan: 'Paquistão', Palestine: 'Palestina', Philippines: 'Filipinas',
  'Saudi Arabia': 'Arábia Saudita', Singapore: 'Singapura', Syria: 'Síria',
  Tajikistan: 'Tajiquistão', Thailand: 'Tailândia', Turkmenistan: 'Turcomenistão',
  'United Arab Emirates': 'Emirados Árabes Unidos', Uzbekistan: 'Uzbequistão', Yemen: 'Iêmen',

  Brazil: 'Brasil',

  'Antigua and Barbuda': 'Antígua e Barbuda', 'British Virgin Islands': 'Ilhas Virgens Britânicas',
  Canada: 'Canadá', 'Cayman Islands': 'Ilhas Cayman', Curacao: 'Curaçau',
  'Dominican Republic': 'República Dominicana', Grenada: 'Granada', 'Mexico': 'México',
  Panama: 'Panamá', 'St. Kitts and Nevis': 'São Cristóvão e Névis', 'St. Lucia': 'Santa Lúcia',
  'St. Vincent and the Grenadines': 'São Vicente e Granadinas',
  'Trinidad and Tobago': 'Trinidad e Tobago', 'Turks and Caicos Islands': 'Ilhas Turcas e Caicos',
  'United States': 'Estados Unidos', 'US Virgin Islands': 'Ilhas Virgens Americanas',

  'American Samoa': 'Samoa Americana', 'Cook Islands': 'Ilhas Cook', Fiji: 'Fiji',
  'New Caledonia': 'Nova Caledônia', 'New Zealand': 'Nova Zelândia',
  'Papua New Guinea': 'Papua-Nova Guiné', 'Solomon Islands': 'Ilhas Salomão',
}

export const FR = {
  Andorra: 'Andorre', Austria: 'Autriche', Azerbaijan: 'Azerbaïdjan', Belarus: 'Biélorussie',
  Belgium: 'Belgique', 'Bosnia and Herzegovina': 'Bosnie-Herzégovine', Bulgaria: 'Bulgarie',
  Croatia: 'Croatie', Cyprus: 'Chypre', Czechia: 'Tchéquie', Denmark: 'Danemark',
  England: 'Angleterre', Estonia: 'Estonie', 'Faroe Islands': 'Îles Féroé', Finland: 'Finlande',
  Georgia: 'Géorgie', Germany: 'Allemagne', Greece: 'Grèce', Hungary: 'Hongrie',
  Iceland: 'Islande', Israel: 'Israël', Italy: 'Italie', Kazakhstan: 'Kazakhstan',
  Latvia: 'Lettonie', Lithuania: 'Lituanie', Luxembourg: 'Luxembourg', Moldova: 'Moldavie',
  Netherlands: 'Pays-Bas', 'North Macedonia': 'Macédoine du Nord', 'Northern Ireland': 'Irlande du Nord',
  Norway: 'Norvège', Poland: 'Pologne', 'Republic of Ireland': "République d'Irlande",
  Romania: 'Roumanie', Russia: 'Russie', Scotland: 'Écosse', Serbia: 'Serbie',
  Slovakia: 'Slovaquie', Slovenia: 'Slovénie', Spain: 'Espagne', Sweden: 'Suède',
  Switzerland: 'Suisse', Türkiye: 'Turquie', Wales: 'Pays de Galles',

  Algeria: 'Algérie', Cameroon: 'Cameroun', 'Cabo Verde': 'Cap-Vert',
  'Central African Republic': 'République centrafricaine', Chad: 'Tchad', Comoros: 'Comores',
  'DR Congo': 'République démocratique du Congo', Djibouti: 'Djibouti', Egypt: 'Égypte',
  'Equatorial Guinea': 'Guinée équatoriale', Ethiopia: 'Éthiopie', Guinea: 'Guinée',
  'Guinea-Bissau': 'Guinée-Bissau', Kenya: 'Kenya', Libya: 'Libye', Madagascar: 'Madagascar',
  Mauritania: 'Mauritanie', Mauritius: 'Maurice', Morocco: 'Maroc', Mozambique: 'Mozambique',
  Rwanda: 'Rwanda', 'Sao Tome and Principe': 'Sao Tomé-et-Principe', Senegal: 'Sénégal',
  Seychelles: 'Seychelles', 'Sierra Leone': 'Sierra Leone', Somalia: 'Somalie',
  'South Africa': 'Afrique du Sud', 'South Sudan': 'Soudan du Sud', Sudan: 'Soudan',
  Tanzania: 'Tanzanie', Tunisia: 'Tunisie',

  Afghanistan: 'Afghanistan', Australia: 'Australie', Bahrain: 'Bahreïn', Bhutan: 'Bhoutan',
  Cambodia: 'Cambodge', China: 'Chine', 'Chinese Taipei': 'Taïpei chinois', Iraq: 'Irak',
  Japan: 'Japon', Jordan: 'Jordanie', 'North Korea': 'Corée du Nord', 'South Korea': 'Corée du Sud',
  Kuwait: 'Koweït', Kyrgyzstan: 'Kirghizistan', Laos: 'Laos', Lebanon: 'Liban',
  Malaysia: 'Malaisie', Maldives: 'Maldives', Mongolia: 'Mongolie', Pakistan: 'Pakistan',
  Palestine: 'Palestine', Philippines: 'Philippines', Qatar: 'Qatar',
  'Saudi Arabia': 'Arabie saoudite', Singapore: 'Singapour', Syria: 'Syrie',
  Tajikistan: 'Tadjikistan', Thailand: 'Thaïlande', 'Timor-Leste': 'Timor oriental',
  Turkmenistan: 'Turkménistan', 'United Arab Emirates': 'Émirats arabes unis',
  Uzbekistan: 'Ouzbékistan', Vietnam: 'Vietnam', Yemen: 'Yémen',

  Brazil: 'Brésil', Peru: 'Pérou',

  'Antigua and Barbuda': 'Antigua-et-Barbuda', 'British Virgin Islands': 'Îles Vierges britanniques',
  'Cayman Islands': 'Îles Caïmans', Curacao: 'Curaçao', 'Dominican Republic': 'République dominicaine',
  Grenada: 'Grenade', Haiti: 'Haïti', Jamaica: 'Jamaïque', Mexico: 'Mexique',
  'St. Kitts and Nevis': 'Saint-Christophe-et-Niévès', 'St. Lucia': 'Sainte-Lucie',
  'St. Vincent and the Grenadines': 'Saint-Vincent-et-les-Grenadines',
  'Trinidad and Tobago': 'Trinité-et-Tobago', 'Turks and Caicos Islands': 'Îles Turques-et-Caïques',
  'United States': 'États-Unis', 'US Virgin Islands': 'Îles Vierges des États-Unis',

  'American Samoa': 'Samoa américaines', 'Cook Islands': 'Îles Cook', Fiji: 'Fidji',
  'New Caledonia': 'Nouvelle-Calédonie', 'New Zealand': 'Nouvelle-Zélande',
  'Papua New Guinea': 'Papouasie-Nouvelle-Guinée', Samoa: 'Samoa',
  'Solomon Islands': 'Îles Salomon',
}

export const DE = {
  Austria: 'Österreich', Azerbaijan: 'Aserbaidschan', Belarus: 'Weißrussland', Belgium: 'Belgien',
  'Bosnia and Herzegovina': 'Bosnien und Herzegowina', Bulgaria: 'Bulgarien', Croatia: 'Kroatien',
  Cyprus: 'Zypern', Czechia: 'Tschechien', Denmark: 'Dänemark', England: 'England',
  Estonia: 'Estland', 'Faroe Islands': 'Färöer', Finland: 'Finnland', France: 'Frankreich',
  Georgia: 'Georgien', Germany: 'Deutschland', Greece: 'Griechenland', Hungary: 'Ungarn',
  Iceland: 'Island', Italy: 'Italien', Kazakhstan: 'Kasachstan', Latvia: 'Lettland',
  Lithuania: 'Litauen', Luxembourg: 'Luxemburg', Moldova: 'Moldau', Netherlands: 'Niederlande',
  'North Macedonia': 'Nordmazedonien', 'Northern Ireland': 'Nordirland', Norway: 'Norwegen',
  Poland: 'Polen', 'Republic of Ireland': 'Irland', Romania: 'Rumänien', Russia: 'Russland',
  Scotland: 'Schottland', Serbia: 'Serbien', Slovakia: 'Slowakei', Slovenia: 'Slowenien',
  Spain: 'Spanien', Sweden: 'Schweden', Switzerland: 'Schweiz', Türkiye: 'Türkei',

  Algeria: 'Algerien', Cameroon: 'Kamerun', 'Cabo Verde': 'Kap Verde',
  'Central African Republic': 'Zentralafrikanische Republik', Chad: 'Tschad',
  Comoros: 'Komoren', 'DR Congo': 'Demokratische Republik Kongo', Djibouti: 'Dschibuti',
  Egypt: 'Ägypten', 'Equatorial Guinea': 'Äquatorialguinea', Ethiopia: 'Äthiopien',
  "Côte d'Ivoire": 'Elfenbeinküste', Kenya: 'Kenia', Libya: 'Libyen', Madagascar: 'Madagaskar',
  Mauritania: 'Mauretanien', Morocco: 'Marokko', Mozambique: 'Mosambik', Rwanda: 'Ruanda',
  'Sao Tome and Principe': 'São Tomé und Príncipe', Seychelles: 'Seychellen',
  'South Africa': 'Südafrika', 'South Sudan': 'Südsudan', Sudan: 'Sudan', Tanzania: 'Tansania',
  Tunisia: 'Tunesien',

  Afghanistan: 'Afghanistan', Australia: 'Australien', Bahrain: 'Bahrain', Bhutan: 'Bhutan',
  Cambodia: 'Kambodscha', 'Chinese Taipei': 'Chinesisch Taipeh', Iraq: 'Irak', Japan: 'Japan',
  Jordan: 'Jordanien', 'North Korea': 'Nordkorea', 'South Korea': 'Südkorea',
  Kyrgyzstan: 'Kirgisistan', Lebanon: 'Libanon', Malaysia: 'Malaysia', Maldives: 'Malediven',
  Mongolia: 'Mongolei', Pakistan: 'Pakistan', Palestine: 'Palästina', Philippines: 'Philippinen',
  'Saudi Arabia': 'Saudi-Arabien', Singapore: 'Singapur', Syria: 'Syrien',
  Tajikistan: 'Tadschikistan', Thailand: 'Thailand', 'Timor-Leste': 'Osttimor',
  Turkmenistan: 'Turkmenistan', 'United Arab Emirates': 'Vereinigte Arabische Emirate',
  Uzbekistan: 'Usbekistan', Yemen: 'Jemen',

  Brazil: 'Brasilien',

  'Antigua and Barbuda': 'Antigua und Barbuda', 'British Virgin Islands': 'Britische Jungferninseln',
  Canada: 'Kanada', 'Cayman Islands': 'Kaimaninseln', Curacao: 'Curaçao',
  'Dominican Republic': 'Dominikanische Republik', Grenada: 'Grenada', Haiti: 'Haiti',
  Jamaica: 'Jamaika', Mexico: 'Mexiko', Panama: 'Panama',
  'St. Kitts and Nevis': 'St. Kitts und Nevis', 'St. Lucia': 'St. Lucia',
  'St. Vincent and the Grenadines': 'St. Vincent und die Grenadinen', Suriname: 'Suriname',
  'Trinidad and Tobago': 'Trinidad und Tobago', 'Turks and Caicos Islands': 'Turks- und Caicosinseln',
  'United States': 'Vereinigte Staaten', 'US Virgin Islands': 'Amerikanische Jungferninseln',

  'American Samoa': 'Amerikanisch-Samoa', 'Cook Islands': 'Cookinseln', Fiji: 'Fidschi',
  'New Caledonia': 'Neukaledonien', 'New Zealand': 'Neuseeland',
  'Papua New Guinea': 'Papua-Neuguinea', 'Solomon Islands': 'Salomonen',
}

export const NATION_NAME_TRANSLATIONS = { es: ES, pt: PT, fr: FR, de: DE }
