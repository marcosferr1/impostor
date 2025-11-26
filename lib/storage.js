// Sistema de almacenamiento usando Vercel KV (Redis)
// Almacenamiento persistente y compartido entre todas las funciones serverless

import { kv } from '@vercel/kv';

class RoomStorage {
  constructor() {
    this.prefix = 'room:';
  }

  async createRoom(roomCode, roomData) {
    roomData.createdAt = Date.now();
    const code = roomCode.toUpperCase();
    await kv.set(`${this.prefix}${code}`, JSON.stringify(roomData), { ex: 7200 }); // Expira en 2 horas
    console.log(`[KV-STORAGE] Sala creada: ${code}`);
    return roomData;
  }

  async getRoom(roomCode) {
    if (!roomCode) return null;
    const code = roomCode.toUpperCase();
    const data = await kv.get(`${this.prefix}${code}`);
    console.log(`[KV-STORAGE] Buscando sala: ${code}, encontrada:`, data ? 'SÍ' : 'NO');
    if (!data) return null;
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  async updateRoom(roomCode, updates) {
    const room = await this.getRoom(roomCode);
    if (!room) return null;
    
    Object.assign(room, updates);
    const code = roomCode.toUpperCase();
    await kv.set(`${this.prefix}${code}`, JSON.stringify(room), { ex: 7200 });
    console.log(`[KV-STORAGE] Sala actualizada: ${code}`);
    return room;
  }

  async deleteRoom(roomCode) {
    if (!roomCode) return false;
    const code = roomCode.toUpperCase();
    await kv.del(`${this.prefix}${code}`);
    console.log(`[KV-STORAGE] Sala eliminada: ${code}`);
    return true;
  }

  async getAllRooms() {
    const keys = await kv.keys(`${this.prefix}*`);
    const rooms = [];
    for (const key of keys) {
      const data = await kv.get(key);
      if (data) {
        rooms.push(typeof data === 'string' ? JSON.parse(data) : data);
      }
    }
    return rooms;
  }
}

// Instancia global compartida
const storage = new RoomStorage();

export default storage;

export async function generateRoomCode() {
  let code;
  let attempts = 0;
  do {
    code = Math.random().toString(36).substring(2, 6).toUpperCase();
    attempts++;
    if (attempts > 100) {
      // Fallback: agregar timestamp si hay muchos códigos
      code = Date.now().toString(36).substring(-4).toUpperCase();
      break;
    }
  } while (await storage.getRoom(code)); // Asegurar que el código sea único
  
  console.log(`[KV-STORAGE] Código generado: ${code}`);
  return code;
}

export function generatePlayerId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

