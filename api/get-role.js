import storage from '../lib/storage.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { roomCode, playerId } = req.query;

    if (!roomCode || !playerId) {
      return res.status(400).json({ error: 'Código de sala y ID de jugador requeridos' });
    }

    const room = await storage.getRoom(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    // Solo revelar el rol si el juego ha comenzado
    if (!room.started || !room.gameStartedAt) {
      return res.status(400).json({ error: 'El juego no ha comenzado' });
    }

    // Calcular tiempo transcurrido desde el inicio
    const elapsedTime = Date.now() - room.gameStartedAt;
    const COUNTDOWN_DURATION = 10000; // 10 segundos

    if (elapsedTime < COUNTDOWN_DURATION) {
      // Aún en cuenta regresiva
      const remainingSeconds = Math.ceil((COUNTDOWN_DURATION - elapsedTime) / 1000);
      return res.status(200).json({
        countdown: remainingSeconds,
        role: null
      });
    }

    // Revelar el rol después de los 10 segundos
    res.status(200).json({
      countdown: 0,
      role: player.role,
      theme: room.theme,
      isImpostor: player.role === 'IMPOSTOR',
      room: {
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          isHost: p.isHost
        })),
        playOrder: room.playOrder,
        wheelSpun: room.wheelSpun || false
      }
    });

  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({ error: error.message });
  }
}

