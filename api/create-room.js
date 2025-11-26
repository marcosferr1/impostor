import { getRandomWord } from '../lib/words.js';
import storage, { generateRoomCode, generatePlayerId } from '../lib/storage.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { theme, maxPlayers = 5, hostName } = req.body;
    
    if (!theme || !hostName) {
      return res.status(400).json({ error: 'Tema y nombre requeridos' });
    }

    if (!hostName.trim()) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    if (maxPlayers < 3 || maxPlayers > 10) {
      return res.status(400).json({ error: 'El número de jugadores debe estar entre 3 y 10' });
    }

    // El servidor elige la palabra secreta aleatoriamente
    const secretWord = getRandomWord(theme);
    const roomCode = await generateRoomCode();
    const hostId = generatePlayerId();
    
    const room = {
      code: roomCode,
      theme,
      secretWord,  // Nadie la conoce hasta que empiece el juego
      maxPlayers,
      players: [{
        id: hostId,
        name: hostName.trim(),
        isHost: true,
        role: null  // Se asigna al iniciar
      }],
      started: false,
      gameStartedAt: null,
      impostorId: null
    };

    const createdRoom =     await storage.createRoom(roomCode, room);

    console.log(`[CREATE-ROOM] Sala creada exitosamente: ${roomCode} - Tema: ${theme} - Palabra: ${secretWord}`);
    const verification = await storage.getRoom(roomCode);
    console.log(`[CREATE-ROOM] Verificando que existe:`, verification ? 'SÍ' : 'NO');

    res.status(200).json({
      roomCode,
      playerId: hostId,
      theme  // Solo devolvemos el tema, NO la palabra
    });

  } catch (error) {
    console.error('Error al crear sala:', error);
    res.status(500).json({ error: error.message });
  }
}

