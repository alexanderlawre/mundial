// Current-day team strength ratings (0-99 scale), approximating relative
// footballing strength for World Cup simulation purposes. Not sourced from
// any live ranking feed -- built as reasonable, football-literate estimates.
// Nations not listed fall back to a confederation-tier default in getRating().

export const CURRENT_RATINGS = {
  // Elite tier
  'Argentina': 90, 'France': 89, 'Brazil': 88, 'England': 86, 'Spain': 87,
  'Portugal': 85, 'Netherlands': 85, 'Belgium': 82, 'Germany': 84, 'Italy': 82,

  // Strong tier
  'Croatia': 81, 'Uruguay': 80, 'Colombia': 80, 'Morocco': 79, 'Switzerland': 78,
  'Japan': 78, 'United States': 77, 'Mexico': 76, 'Denmark': 78, 'Senegal': 78,
  'Austria': 77, 'Ecuador': 76, 'South Korea': 75, 'Ukraine': 75,
  'Serbia': 76, 'Poland': 75, 'Wales': 73, 'Iran': 74, 'Australia': 73,
  'Canada': 74, 'Türkiye': 76, 'Sweden': 75, 'Egypt': 74, 'Tunisia': 72,
  'Peru': 73, 'Chile': 73, 'Nigeria': 74, 'Algeria': 74, "Côte d'Ivoire": 75,
  'Ghana': 72, 'Cameroon': 73, 'Scotland': 73, 'Norway': 74, 'Hungary': 71,

  // Mid tier
  'Costa Rica': 70, 'Panama': 68, 'Jamaica': 66, 'Venezuela': 71, 'Paraguay': 70,
  'Bolivia': 63, 'South Africa': 68, 'Qatar': 68, 'Saudi Arabia': 61, 'Iraq': 67,
  'Jordan': 65, 'Uzbekistan': 68, 'New Zealand': 63, 'Curacao': 62,
  'Cabo Verde': 66, 'DR Congo': 66, 'Guinea': 65, 'Mali': 66, 'Burkina Faso': 65,
  'Republic of Ireland': 71, 'Slovakia': 70, 'Slovenia': 68, 'Romania': 69,
  'Czechia': 71, 'Finland': 68, 'Israel': 68, 'Bosnia and Herzegovina': 69,
  'North Macedonia': 65, 'Georgia': 67, 'Albania': 66, 'Northern Ireland': 65,
  'Greece': 70, 'Iceland': 68, 'Kosovo': 63, 'Gabon': 62, 'Zambia': 64,
  'Mozambique': 60, 'Benin': 61, 'Uganda': 61, 'Equatorial Guinea': 60,
  'India': 58, 'Thailand': 58, 'Vietnam': 58, 'China': 61,
  'Syria': 63, 'Bahrain': 60, 'United Arab Emirates': 65, 'Kuwait': 60,
  'Oman': 61, 'Lebanon': 58, 'Kyrgyzstan': 60, 'Tajikistan': 59, 'Turkmenistan': 57,
  'Palestine': 57, 'North Korea': 62, 'Hong Kong': 52,

  // Developing tier defaults handled by getRating()
}

const CONFEDERATION_DEFAULTS = {
  UEFA: 66,
  CONMEBOL: 68,
  CAF: 60,
  AFC: 56,
  CONCACAF: 58,
  OFC: 48,
}

export function getRating(nationName, confederation) {
  if (CURRENT_RATINGS[nationName] != null) return CURRENT_RATINGS[nationName]
  return CONFEDERATION_DEFAULTS[confederation] ?? 55
}
