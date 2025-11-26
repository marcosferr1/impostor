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
    'Burrito', 'Lasaña', 'Tiramisú', 'Asado', 'Enchiladas'
  ],
  'deportes': [
    'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Boxeo',
    'Voleibol', 'Rugby', 'Golf', 'Baseball', 'Hockey',
    'Ciclismo', 'Atletismo', 'Surf', 'Esquí', 'Karate',
    'Fórmula 1', 'MMA', 'Gimnasia', 'Ping Pong', 'Handball'
  ],
  'juegos_gaming': [
    'Fortnite', 'Minecraft', 'League of Legends', 'Counter-Strike 2', 'Valorant',
    'GTA V', 'Call of Duty', 'PUBG', 'Apex Legends', 'Overwatch',
    'FIFA', 'eFootball', 'Rocket League', 'Roblox', 'Among Us',
    'Elden Ring', 'The Witcher 3', 'Red Dead Redemption 2', 'Cyberpunk 2077', 'God of War',
    'Assassin\'s Creed', 'Halo', 'Destiny 2', 'Diablo IV', 'World of Warcraft',
    'Dota 2', 'Battlefield', 'Genshin Impact', 'Fall Guys', 'Super Mario'
  ],
  'jugadores_futbol': [
    'Lionel Messi', 'Cristiano Ronaldo', 'Neymar Jr', 'Kylian Mbappé', 'Erling Haaland',
    'Kevin De Bruyne', 'Luka Modric', 'Karim Benzema', 'Vinicius Jr', 'Mohamed Salah',
    'Lewandowski', 'Antoine Griezmann', 'Harry Kane', 'Jude Bellingham', 'Pedri',
    'Ronaldinho', 'Zinedine Zidane', 'Ronaldo Nazário', 'Pelé', 'Maradona',
    'Xavi Hernández', 'Andrés Iniesta', 'Francesco Totti', 'Thierry Henry', 'David Beckham',
    'Zlatan Ibrahimović', 'Paolo Maldini', 'Sergio Ramos', 'Didier Drogba', 'Kaká'
  ],
  'equipos_futbol_europeos': [
    'Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Sevilla', 'Valencia',
    'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal',
    'Tottenham', 'Bayern Múnich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
    'Juventus', 'Inter de Milán', 'AC Milan', 'Roma', 'Napoli',
    'Paris Saint-Germain', 'Olympique de Marseille', 'Lyon', 'Monaco', 'Benfica',
    'Porto', 'Sporting Lisboa', 'Ajax', 'PSV', 'Feyenoord'
  ],
  'equipos_futbol_argentinos': [
    'Boca Juniors', 'River Plate', 'Racing Club', 'Independiente', 'San Lorenzo',
    'Vélez Sarsfield', 'Huracán', 'Estudiantes LP', 'Gimnasia LP', 'Rosario Central',
    'Newell\'s Old Boys', 'Argentinos Juniors', 'Banfield', 'Lanús', 'Tigre',
    'Arsenal de Sarandí', 'Colón', 'Unión', 'Godoy Cruz', 'Atlético Tucumán',
    'Talleres', 'Belgrano', 'Instituto', 'Ferro', 'Chacarita Juniors',
    'Quilmes', 'Platense', 'Sarmiento', 'Patronato', 'Aldosivi'
  ],
  'equipos_futbol_sudamericanos': [
    'Boca Juniors', 'River Plate', 'Flamengo', 'Palmeiras', 'Santos',
    'Corinthians', 'São Paulo', 'Gremio', 'Internacional', 'Atlético Mineiro',
    'Nacional (Uruguay)', 'Peñarol', 'Colo-Colo', 'Universidad de Chile', 'Universidad Católica',
    'Liga de Quito', 'Barcelona SC', 'Emelec', 'Independiente del Valle', 'Olimpia',
    'Cerro Porteño', 'Libertad', 'Junior', 'Atlético Nacional', 'Millonarios',
    'Sporting Cristal', 'Alianza Lima', 'The Strongest', 'Bolívar', 'Caracas FC'
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

