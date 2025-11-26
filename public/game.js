const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');
const playerId = localStorage.getItem('playerId');

let hasSpun = false;
let checkInterval;
let syncInterval;
let isHost = false;
let currentRoom = null;
let wheelOrderShown = false;
let roleRevealed = false;

if (!roomCode || !playerId) {
  toast.error('Información de sala inválida');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

async function checkRole() {
  try {
    const response = await fetch(`/api/get-role?roomCode=${roomCode}&playerId=${playerId}`);
    
    if (!response.ok) {
      const data = await response.json();
      console.error('Error:', data.error);
      return;
    }
    
    const data = await response.json();
    
    if (data.countdown > 0) {
      // Mostrar cuenta regresiva (sin sincronización aquí para no interrumpir)
      document.getElementById('countdown').textContent = data.countdown;
    } else if (data.role) {
      // Revelar rol
      clearInterval(checkInterval);
      roleRevealed = true;
      
      currentRoom = data.room;
      
      // Verificar si soy el host
      if (currentRoom && currentRoom.players) {
        const me = currentRoom.players.find(p => p.id === playerId);
        if (me) {
          isHost = me.isHost;
        }
      }
      
      document.getElementById('countdownScreen').style.display = 'none';
      document.getElementById('roleReveal').style.display = 'block';
      
      document.getElementById('theme').textContent = data.theme;
      
      const roleDisplay = document.getElementById('roleDisplay');
      const instructions = document.getElementById('roleInstructions');
      
      if (data.isImpostor) {
        roleDisplay.textContent = 'IMPOSTOR';
        roleDisplay.className = 'role impostor';
        instructions.textContent = '¡Eres el impostor! Intenta adivinar la palabra sin que te descubran.';
      } else {
        roleDisplay.textContent = data.role;
        roleDisplay.className = 'role word';
        instructions.textContent = `Tu palabra es: "${data.role}". ¡No la digas directamente!`;
      }
      
      document.getElementById('wheelContainer').style.display = 'block';
      
      // Mostrar botón de girar solo al host
      const spinBtn = document.getElementById('spinBtn');
      if (!isHost) {
        spinBtn.style.display = 'none';
        const waitingMsg = document.createElement('p');
        waitingMsg.id = 'waitingWheel';
        waitingMsg.style.cssText = 'color: #666; margin-top: 10px; text-align: center;';
        waitingMsg.textContent = 'Esperando que el host gire la ruleta...';
        document.getElementById('wheelContainer').appendChild(waitingMsg);
      }
      
      // Mostrar botón de reset solo al host
      if (isHost) {
        document.getElementById('resetBtn').style.display = 'block';
      }
      
      // Iniciar sincronización después de revelar el rol
      startSyncPolling();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Polling de sincronización (solo después de revelar roles)
async function syncCheck() {
  try {
    const response = await fetch(`/api/get-room?roomCode=${roomCode}&playerId=${playerId}`);
    
    if (!response.ok) return;
    
    const data = await response.json();
    currentRoom = data;
    
    // Sincronización: Si el host volvió al lobby, redirigir a todos
    if (data.currentPage === 'lobby' && !isHost) {
      clearInterval(syncInterval);
      toast.info('El host volvió al lobby');
      setTimeout(() => {
        window.location.href = `lobby.html?room=${roomCode}`;
      }, 1500);
      return;
    }
    
    // Sincronización: Mostrar orden de la ruleta para todos
    if (data.wheelSpun && data.playOrder && !wheelOrderShown) {
      wheelOrderShown = true;
      showWheelOrder(data.playOrder);
      const waitingMsg = document.getElementById('waitingWheel');
      if (waitingMsg) waitingMsg.remove();
      toast.success(`${data.playOrder[0]} empieza la ronda`);
    }
    
  } catch (error) {
    console.error('Error en sync:', error);
  }
}

function startSyncPolling() {
  // Polling cada 2 segundos para sincronización
  syncInterval = setInterval(syncCheck, 2000);
  syncCheck();
}

function showWheelOrder(order) {
  const orderDisplay = document.getElementById('playOrder');
  const spinBtn = document.getElementById('spinBtn');
  
  if (!order || order.length === 0) return;
  
  // Mostrar orden completo
  let orderHTML = '<h3 style="color: #4CAF50; margin-bottom: 15px;">Orden de Juego:</h3>';
  orderHTML += '<ol style="text-align: left; font-size: 1.2em; line-height: 1.8; background: #f9f9f9; padding: 20px; border-radius: 10px;">';
  order.forEach((playerName, index) => {
    orderHTML += `<li style="color: #333; margin: 5px 0;"><strong>${playerName}</strong>${index === 0 ? ' <span style="color: #4CAF50;">• Empieza</span>' : ''}</li>`;
  });
  orderHTML += '</ol>';
  
  orderDisplay.innerHTML = orderHTML;
  if (spinBtn) spinBtn.style.display = 'none';
}

async function spinWheel() {
  if (hasSpun) return;
  
  if (!isHost) {
    toast.warning('Solo el host puede girar la ruleta');
    return;
  }
  
  const spinBtn = document.getElementById('spinBtn');
  spinBtn.disabled = true;
  spinBtn.textContent = 'Girando...';
  hasSpun = true;
  
  const wheel = document.getElementById('wheel');
  
  // Animación de giro
  wheel.classList.add('spinning');
  
  try {
    const response = await fetch('/api/spin-wheel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al girar ruleta');
    }
    
    const data = await response.json();
    wheelOrderShown = true;
    
    setTimeout(() => {
      wheel.classList.remove('spinning');
      showWheelOrder(data.order);
      toast.success(`${data.firstPlayer} empieza la ronda`);
    }, 3000);
    
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
    hasSpun = false;
    spinBtn.disabled = false;
    spinBtn.textContent = 'Girar Ruleta';
    wheel.classList.remove('spinning');
  }
}

async function resetGame() {
  if (!isHost) {
    toast.warning('Solo el host puede resetear el juego');
    return;
  }
  
  toast.confirm('¿Iniciar nueva ronda con el mismo tema?', async () => {
    try {
      const response = await fetch('/api/reset-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, playerId })
      });
      
      if (response.ok) {
        toast.success('Nueva ronda iniciada. Redirigiendo...');
        setTimeout(() => {
          window.location.href = `lobby.html?room=${roomCode}`;
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al resetear el juego');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  });
}

function backToLobby() {
  const message = isHost ? 
    '¿Volver al lobby? Todos los jugadores volverán contigo.' : 
    '¿Volver al lobby?';
  
  toast.confirm(message, async () => {
    clearInterval(checkInterval);
    
    // Si es el host, sincronizar navegación para todos
    if (isHost) {
      try {
        await fetch('/api/sync-navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId, action: 'lobby' })
        });
      } catch (error) {
        console.error('Error al sincronizar:', error);
      }
    }
    
    toast.info('Volviendo al lobby...');
    setTimeout(() => {
      window.location.href = `lobby.html?room=${roomCode}`;
    }, 500);
  });
}

function leaveRoom() {
  toast.confirm('¿Estás seguro que quieres salir de la sala?', async () => {
    clearInterval(checkInterval);
    
    try {
      // Notificar al servidor que el jugador salió
      await fetch('/api/leave-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, playerId })
      });
    } catch (error) {
      console.error('Error al salir:', error);
    }
    
    // Limpiar datos locales y volver al inicio
    localStorage.removeItem('playerId');
    localStorage.removeItem('roomCode');
    toast.info('Saliendo de la sala...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  });
}

// Polling para obtener el rol
checkInterval = setInterval(checkRole, 1000);
checkRole();

