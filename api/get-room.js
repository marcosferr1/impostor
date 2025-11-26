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

    console.log(`[GET-ROOM] Solicitando sala: ${roomCode} por jugador: ${playerId}`);

    if (!roomCode || !playerId) {
      return res.status(400).json({ error: 'Código de sala y ID de jugador requeridos' });
    }

    const room = await storage.getRoom(roomCode);

    console.log(`[GET-ROOM] Sala encontrada:`, room ? 'SÍ' : 'NO');

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    // Verificar que el jugador pertenezca a la sala
    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      return res.status(403).json({ error: 'No perteneces a esta sala' });
    }

    // Devolver información de la sala sin revelar la palabra secreta
    res.status(200).json({
      code: room.code,
      theme: room.theme,
      maxPlayers: room.maxPlayers,
      started: room.started,
      wheelSpun: room.wheelSpun || false,
      playOrder: room.playOrder || null,
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost
        // NO incluir el rol
      }))
    });

  } catch (error) {
    console.error('Error al obtener sala:', error);
    res.status(500).json({ error: error.message });
  }
}

