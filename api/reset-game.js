import storage from '../lib/storage.js';
import { getRandomWord } from '../lib/words.js';

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
    const { roomCode, playerId, newTheme } = req.body;

    if (!roomCode || !playerId) {
      return res.status(400).json({ error: 'Código de sala y ID de jugador requeridos' });
    }

    const room = await storage.getRoom(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    // Verificar que quien resetea sea el host
    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return res.status(403).json({ error: 'Solo el host puede resetear el juego' });
    }

    // Elegir nueva palabra (mismo tema o tema nuevo)
    const theme = newTheme || room.theme;
    const secretWord = getRandomWord(theme);

    // Resetear estado del juego manteniendo jugadores
    room.theme = theme;
    room.secretWord = secretWord;
    room.started = false;
    room.gameStartedAt = null;
    room.impostorId = null;
    room.playOrder = null;
    
    // Limpiar roles de jugadores
    room.players.forEach(p => {
      p.role = null;
    });

    await storage.updateRoom(roomCode, room);

    console.log(`[RESET] Sala ${roomCode} reseteada - Nuevo tema: ${theme} - Nueva palabra: ${secretWord}`);

    res.status(200).json({
      success: true,
      theme,
      message: 'Juego reseteado. Listos para una nueva ronda!'
    });

  } catch (error) {
    console.error('Error al resetear juego:', error);
    res.status(500).json({ error: error.message });
  }
}

