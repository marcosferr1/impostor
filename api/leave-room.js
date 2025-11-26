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
    const { roomCode, playerId } = req.body;

    if (!roomCode || !playerId) {
      return res.status(400).json({ error: 'Código de sala y ID de jugador requeridos' });
    }

    const room = await storage.getRoom(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    // Encontrar al jugador
    const playerIndex = room.players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    const player = room.players[playerIndex];
    const wasHost = player.isHost;

    // Eliminar al jugador de la sala
    room.players.splice(playerIndex, 1);

    // Si era el host y quedan jugadores, asignar nuevo host
    if (wasHost && room.players.length > 0) {
      room.players[0].isHost = true;
      console.log(`[LEAVE-ROOM] Nuevo host: ${room.players[0].name}`);
    }

    // Si no quedan jugadores, eliminar la sala
    if (room.players.length === 0) {
      await storage.deleteRoom(roomCode);
      console.log(`[LEAVE-ROOM] Sala ${roomCode} eliminada (sin jugadores)`);
    } else {
      await storage.updateRoom(roomCode, room);
      console.log(`[LEAVE-ROOM] Jugador ${player.name} salió de la sala ${roomCode}`);
    }

    res.status(200).json({
      success: true,
      message: 'Has salido de la sala'
    });

  } catch (error) {
    console.error('Error al salir de sala:', error);
    res.status(500).json({ error: error.message });
  }
}

