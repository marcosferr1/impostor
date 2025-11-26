import storage from '../lib/storage.js';
import crypto from 'crypto';

// Función para generar número aleatorio criptográficamente seguro
function getSecureRandomInt(min, max) {
  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const randomBytes = crypto.randomBytes(bytesNeeded);
  const randomValue = randomBytes.readUIntBE(0, bytesNeeded);
  return min + (randomValue % range);
}

// Fisher-Yates shuffle con crypto para máxima aleatoriedad
function secureShuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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

    // Verificar que quien gira sea el host
    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return res.status(403).json({ error: 'Solo el host puede girar la ruleta' });
    }

    if (!room.started) {
      return res.status(400).json({ error: 'El juego no ha comenzado' });
    }

    // Solo incluir jugadores que tienen rol (estaban listos cuando empezó)
    const playersWithRole = room.players.filter(p => p.role !== null);
    
    if (playersWithRole.length === 0) {
      return res.status(400).json({ error: 'No hay jugadores en la sala' });
    }

    // Crear orden aleatorio de jugadores usando crypto para máxima aleatoriedad
    const playerNames = playersWithRole.map(p => p.name);
    const shuffledPlayers = secureShuffleArray(playerNames);

    // Guardar el orden en la sala y marcar que la ruleta fue girada
    room.playOrder = shuffledPlayers;
    room.wheelSpun = true;
    room.wheelSpunAt = Date.now();
    await storage.updateRoom(roomCode, room);

    console.log(`[RULETA] Sala ${roomCode} - Orden: ${shuffledPlayers.join(' → ')}`);

    res.status(200).json({
      order: shuffledPlayers,
      firstPlayer: shuffledPlayers[0],
      wheelSpun: true
    });

  } catch (error) {
    console.error('Error al girar ruleta:', error);
    res.status(500).json({ error: error.message });
  }
}

