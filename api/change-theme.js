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
    const { roomCode, playerId, theme } = req.body;

    if (!roomCode || !playerId || !theme) {
      return res.status(400).json({ error: 'Código de sala, ID de jugador y tema requeridos' });
    }

    const room = await storage.getRoom(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    // Verificar que quien cambia el tema sea el host
    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return res.status(403).json({ error: 'Solo el host puede cambiar el tema' });
    }

    // No permitir cambiar tema si el juego ya comenzó
    if (room.started) {
      return res.status(400).json({ error: 'No se puede cambiar el tema durante el juego' });
    }

    // Elegir nueva palabra para el nuevo tema
    const secretWord = getRandomWord(theme);
    room.theme = theme;
    room.secretWord = secretWord;

    await storage.updateRoom(roomCode, room);

    console.log(`[CHANGE-THEME] Sala ${roomCode} - Nuevo tema: ${theme} - Nueva palabra: ${secretWord}`);

    res.status(200).json({
      success: true,
      theme
    });

  } catch (error) {
    console.error('Error al cambiar tema:', error);
    res.status(500).json({ error: error.message });
  }
}

