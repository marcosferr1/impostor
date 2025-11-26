import storage from '../lib/storage.js';

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
    const { roomCode, playerId, action } = req.body;

    if (!roomCode || !playerId || !action) {
      return res.status(400).json({ error: 'Código de sala, ID de jugador y acción requeridos' });
    }

    const room = await storage.getRoom(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    // Verificar que quien ejecuta la acción sea el host
    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return res.status(403).json({ error: 'Solo el host puede sincronizar navegación' });
    }

    // Actualizar la página actual de la sala
    room.currentPage = action; // 'lobby', 'game', etc.
    room.lastNavigationAt = Date.now();

    await storage.updateRoom(roomCode, room);

    console.log(`[SYNC-NAV] Host movió la sala ${roomCode} a: ${action}`);

    res.status(200).json({
      success: true,
      currentPage: action
    });

  } catch (error) {
    console.error('Error al sincronizar navegación:', error);
    res.status(500).json({ error: error.message });
  }
}

