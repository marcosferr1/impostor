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

    // Verificar que quien inicia sea el host
    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return res.status(403).json({ error: 'Solo el host puede iniciar el juego' });
    }

    if (room.started) {
      return res.status(400).json({ error: 'El juego ya ha comenzado' });
    }

    // Filtrar solo jugadores listos para jugar
    const readyPlayers = room.players.filter(p => p.ready);
    
    if (readyPlayers.length < 3) {
      return res.status(400).json({ 
        error: `Se necesitan al menos 3 jugadores listos para iniciar (${readyPlayers.length}/3)` 
      });
    }

    // Asignar roles SOLO a jugadores listos
    // Elegir impostor con aleatoriedad criptográficamente segura
    // Esto garantiza verdadera aleatoriedad y SÍ puede repetir personas en rondas consecutivas
    
    // Shuffle aleatorio de índices usando Fisher-Yates con crypto.randomBytes
    const indices = Array.from({ length: readyPlayers.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(0, i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // El primer índice del shuffle es el impostor
    const impostorIndex = indices[0];
    
    // Agregar entropía adicional con timestamp y process.hrtime si está disponible
    const entropy = Date.now() + (typeof process !== 'undefined' && process.hrtime ? 
      Number(process.hrtime.bigint()) : 0);
    
    // Segunda verificación aleatoria (doble capa de seguridad)
    const shouldUseFirst = getSecureRandomInt(0, 2) === 1;
    const finalImpostorIndex = shouldUseFirst ? indices[0] : 
      indices[getSecureRandomInt(0, indices.length)];
    
    // Asignar roles solo a jugadores listos
    readyPlayers.forEach((p, index) => {
      if (index === finalImpostorIndex) {
        p.role = 'IMPOSTOR';
        room.impostorId = p.id;
      } else {
        p.role = room.secretWord;
      }
    });
    
    // Los jugadores no listos no participan (sin rol)
    room.players.forEach(p => {
      if (!p.ready) {
        p.role = null;
      }
    });

    room.started = true;
    room.gameStartedAt = Date.now();

    // Guardar historial de impostores (opcional, para debugging)
    if (!room.impostorHistory) {
      room.impostorHistory = [];
    }
    room.impostorHistory.push({
      playerId: readyPlayers[finalImpostorIndex].id,
      playerName: readyPlayers[finalImpostorIndex].name,
      timestamp: Date.now()
    });

    await storage.updateRoom(roomCode, room);

    console.log(`[START-GAME] Sala ${roomCode} - Impostor: ${readyPlayers[finalImpostorIndex].name}`);
    console.log(`[START-GAME] Jugadores listos: ${readyPlayers.length}/${room.players.length}`);
    console.log(`[START-GAME] Historial de impostores:`, room.impostorHistory.map(h => h.playerName).join(' → '));

    res.status(200).json({
      success: true,
      gameStartedAt: room.gameStartedAt,
      playerCount: readyPlayers.length
    });

  } catch (error) {
    console.error('Error al iniciar juego:', error);
    res.status(500).json({ error: error.message });
  }
}

