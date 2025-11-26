const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');
const playerId = localStorage.getItem('playerId');

let hasSpun = false;
let checkInterval;
let isHost = false;
let currentRoom = null;

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
    currentRoom = data.room;
    
    // Verificar si soy el host
    if (currentRoom && currentRoom.players) {
      const me = currentRoom.players.find(p => p.id === playerId);
      if (me) {
        isHost = me.isHost;
      }
    }
    
    if (data.countdown > 0) {
      // Mostrar cuenta regresiva
      document.getElementById('countdown').textContent = data.countdown;
    } else if (data.role) {
      // Revelar rol
      clearInterval(checkInterval);
      
      document.getElementById('countdownScreen').style.display = 'none';
      document.getElementById('roleReveal').style.display = 'block';
      
      document.getElementById('theme').textContent = data.theme;
      
      const roleDisplay = document.getElementById('roleDisplay');
      const instructions = document.getElementById('roleInstructions');
      
      if (data.isImpostor) {
        roleDisplay.textContent = '🎭 IMPOSTOR';
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
        document.getElementById('wheelContainer').innerHTML += '<p style="color: #666; margin-top: 10px;">Esperando que el host gire la ruleta...</p>';
      }
      
      // Mostrar botón de reset solo al host
      if (isHost) {
        document.getElementById('resetBtn').style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
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
  const orderDisplay = document.getElementById('playOrder');
  
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
    
    setTimeout(() => {
      wheel.classList.remove('spinning');
      
      // Mostrar orden completo
      let orderHTML = '<h3 style="color: #4CAF50; margin-bottom: 15px;">🎯 Orden de Juego:</h3>';
      orderHTML += '<ol style="text-align: left; font-size: 1.2em; line-height: 1.8;">';
      data.order.forEach((playerName, index) => {
        orderHTML += `<li><strong>${playerName}</strong>${index === 0 ? ' 👑 (Empieza)' : ''}</li>`;
      });
      orderHTML += '</ol>';
      
      orderDisplay.innerHTML = orderHTML;
      spinBtn.style.display = 'none';
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
  toast.confirm('¿Volver al lobby? El juego seguirá en curso para los demás.', () => {
    clearInterval(checkInterval);
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

