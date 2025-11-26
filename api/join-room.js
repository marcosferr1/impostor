import storage, { generatePlayerId } from '../lib/storage.js';

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
    const { roomCode, playerName } = req.body;
    
    if (!roomCode || !playerName) {
      return res.status(400).json({ error: 'Código de sala y nombre requeridos' });
    }

    if (!playerName.trim()) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    const room = await storage.getRoom(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    if (room.started) {
      return res.status(400).json({ error: 'La partida ya comenzó' });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ error: 'Sala llena' });
    }

    // Verificar que el nombre no esté repetido
    const nameExists = room.players.some(p => 
      p.name.toLowerCase() === playerName.trim().toLowerCase()
    );

    if (nameExists) {
      return res.status(400).json({ error: 'Ya existe un jugador con ese nombre' });
    }

    const playerId = generatePlayerId();
    const newPlayer = {
      id: playerId,
      name: playerName.trim(),
      isHost: false,
      role: null,
      ready: false
    };

    room.players.push(newPlayer);
    await storage.updateRoom(roomCode, room);

    console.log(`Jugador ${playerName} se unió a la sala ${roomCode}`);

    res.status(200).json({
      success: true,
      playerId,
      theme: room.theme,
      players: room.players.map(p => ({ 
        name: p.name, 
        isHost: p.isHost 
      }))
    });

  } catch (error) {
    console.error('Error al unirse a sala:', error);
    res.status(500).json({ error: error.message });
  }
}

