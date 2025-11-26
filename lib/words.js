export const WORD_BANK = {
  'cantantes': [
    'Shakira', 'Bad Bunny', 'Taylor Swift', 'Beyoncé', 'Drake',
    'Ariana Grande', 'The Weeknd', 'Billie Eilish', 'Ed Sheeran',
    'Dua Lipa', 'Post Malone', 'Rosalía', 'Daddy Yankee', 'Maluma',
    'J Balvin', 'Karol G', 'BTS', 'Harry Styles', 'Adele', 'Coldplay'
  ],
  'países': [
    'Argentina', 'Brasil', 'Japón', 'Francia', 'Alemania',
    'Australia', 'México', 'Canadá', 'Italia', 'España',
    'Corea del Sur', 'India', 'Egipto', 'Rusia', 'China',
    'Inglaterra', 'Grecia', 'Perú', 'Colombia', 'Chile'
  ],
  'películas': [
    'Titanic', 'Avatar', 'Matrix', 'Inception', 'Parasite',
    'Toy Story', 'Frozen', 'Interstellar', 'Gladiator',
    'Forrest Gump', 'Pulp Fiction', 'El Padrino', 'Joker',
    'Avengers', 'Star Wars', 'Jurassic Park', 'El Rey León',
    'Coco', 'Up', 'Shrek'
  ],
  'animales': [
    'León', 'Elefante', 'Jirafa', 'Pingüino', 'Delfín',
    'Koala', 'Tigre', 'Panda', 'Águila', 'Tiburón',
    'Gorila', 'Leopardo', 'Canguro', 'Oso Polar', 'Ballena',
    'Hipopótamo', 'Rinoceronte', 'Cebra', 'Lobo', 'Búho'
  ],
  'comidas': [
    'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta',
    'Empanadas', 'Paella', 'Ramen', 'Asado', 'Falafel',
    'Curry', 'Ceviche', 'Hot Dog', 'Milanesa', 'Croissant',
    'Burrito', 'Lasaña', 'Tiramisú', 'Pad Thai', 'Enchiladas'
  ],
  'deportes': [
    'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Boxeo',
    'Voleibol', 'Rugby', 'Golf', 'Baseball', 'Hockey',
    'Ciclismo', 'Atletismo', 'Surf', 'Esquí', 'Karate',
    'Fórmula 1', 'MMA', 'Gimnasia', 'Ping Pong', 'Handball'
  ]
};

export function getRandomWord(theme) {
  const normalizedTheme = theme.toLowerCase().trim();
  const words = WORD_BANK[normalizedTheme];
  
  if (!words || words.length === 0) {
    throw new Error('Tema no encontrado');
  }
  
  return words[Math.floor(Math.random() * words.length)];
}

export function getAvailableThemes() {
  return Object.keys(WORD_BANK);
}

