const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');
const playerId = localStorage.getItem('playerId');

let isHost = false;
let pollInterval;

if (!roomCode || !playerId) {
  toast.error('Información de sala inválida');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

document.getElementById('roomCode').textContent = roomCode;

async function loadRoomData() {
  try {
    const response = await fetch(`/api/get-room?roomCode=${roomCode}&playerId=${playerId}`);
    
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error || 'Error al cargar la sala');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      return;
    }
    
    const data = await response.json();
    
    // Si el juego ya comenzó, redirigir
    if (data.started) {
      clearInterval(pollInterval);
      window.location.href = `game.html?room=${roomCode}`;
      return;
    }
    
    // Actualizar UI
    document.getElementById('theme').textContent = data.theme;
    document.getElementById('playerCount').textContent = data.players.length;
    document.getElementById('maxPlayers').textContent = data.maxPlayers;
    
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    data.players.forEach(player => {
      const div = document.createElement('div');
      div.className = player.isHost ? 'player host' : 'player';
      div.innerHTML = `
        <span>${player.name}</span>
        ${player.isHost ? '<span class="crown">👑</span>' : ''}
      `;
      playersList.appendChild(div);
      
      if (player.id === playerId && player.isHost) {
        isHost = true;
      }
    });
    
    // Mostrar botón de iniciar solo al host
    if (isHost) {
      const startBtn = document.getElementById('startBtn');
      startBtn.style.display = 'block';
      startBtn.disabled = data.players.length < 3;
      document.getElementById('waiting').style.display = 'none';
      document.getElementById('changeThemeBtn').style.display = 'inline-block';
      
      if (data.players.length < 3) {
        startBtn.textContent = `Esperando más jugadores (${data.players.length}/3 mínimo)`;
      } else {
        startBtn.textContent = 'Iniciar Juego';
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function startGame() {
  const startBtn = document.getElementById('startBtn');
  startBtn.disabled = true;
  startBtn.textContent = 'Iniciando...';
  
  try {
    const response = await fetch('/api/start-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerId })
    });

    if (response.ok) {
      toast.success('¡Juego iniciado!');
      setTimeout(() => {
        window.location.href = `game.html?room=${roomCode}`;
      }, 500);
    } else {
      const data = await response.json();
      toast.error(data.error || 'Error al iniciar el juego');
      startBtn.disabled = false;
      startBtn.textContent = 'Iniciar Juego';
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión');
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar Juego';
  }
}

function showThemeSelector() {
  document.getElementById('themeSelector').style.display = 'block';
  document.getElementById('changeThemeBtn').style.display = 'none';
}

function hideThemeSelector() {
  document.getElementById('themeSelector').style.display = 'none';
  document.getElementById('changeThemeBtn').style.display = 'inline-block';
}

async function changeTheme() {
  const newTheme = document.getElementById('newTheme').value;
  
  if (!newTheme) {
    toast.warning('Por favor selecciona un tema');
    return;
  }
  
  try {
    const response = await fetch('/api/change-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerId, theme: newTheme })
    });
    
    if (response.ok) {
      hideThemeSelector();
      toast.success('¡Tema cambiado exitosamente!');
      loadRoomData(); // Recargar datos
    } else {
      const error = await response.json();
      toast.error(error.error || 'Error al cambiar el tema');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión');
  }
}

function leaveRoom() {
  toast.confirm('¿Estás seguro que quieres salir de la sala?', async () => {
    clearInterval(pollInterval);
    
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

// Cargar datos iniciales y polling cada 2 segundos
loadRoomData();
pollInterval = setInterval(loadRoomData, 2000);

