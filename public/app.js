function showCreateRoom() {
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('createRoom').classList.add('active');
  document.getElementById('joinRoom').classList.remove('active');
}

function showJoinRoom() {
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('createRoom').classList.remove('active');
  document.getElementById('joinRoom').classList.add('active');
}

function showMainMenu() {
  document.getElementById('mainMenu').style.display = 'flex';
  document.getElementById('createRoom').classList.remove('active');
  document.getElementById('joinRoom').classList.remove('active');
}

async function createRoom() {
  const hostName = document.getElementById('hostName').value.trim();
  const theme = document.getElementById('theme').value;
  const maxPlayers = parseInt(document.getElementById('maxPlayers').value);

  if (!hostName) {
    toast.warning('Por favor ingresa tu nombre');
    return;
  }

  if (!theme) {
    toast.warning('Por favor selecciona un tema');
    return;
  }

  if (maxPlayers < 3 || maxPlayers > 10) {
    toast.warning('Debe haber entre 3 y 10 jugadores');
    return;
  }

  try {
    const response = await fetch('/api/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName, theme, maxPlayers })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('roomCode', data.roomCode);
      toast.success('¡Sala creada! Redirigiendo...');
      setTimeout(() => {
        window.location.href = `lobby.html?room=${data.roomCode}`;
      }, 500);
    } else {
      toast.error(data.error || 'Error al crear sala');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión. Verifica que el servidor esté corriendo.');
  }
}

async function joinRoom() {
  const playerName = document.getElementById('playerName').value.trim();
  const roomCode = document.getElementById('roomCodeInput').value.toUpperCase().trim();

  if (!playerName) {
    toast.warning('Por favor ingresa tu nombre');
    return;
  }

  if (!roomCode || roomCode.length !== 4) {
    toast.warning('Por favor ingresa un código de sala válido (4 caracteres)');
    return;
  }

  try {
    const response = await fetch('/api/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, roomCode })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('roomCode', roomCode);
      toast.success('¡Te uniste a la sala!');
      setTimeout(() => {
        window.location.href = `lobby.html?room=${roomCode}`;
      }, 500);
    } else {
      toast.error(data.error || 'Error al unirse a la sala');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión. Verifica que el servidor esté corriendo.');
  }
}

// Auto-uppercase para el código de sala
document.getElementById('roomCodeInput')?.addEventListener('input', function(e) {
  e.target.value = e.target.value.toUpperCase();
});

