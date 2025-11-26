# 🎭 El Impostor

Un juego de engaño social para jugar con amigos. Uno de ustedes es el impostor... ¿podrán descubrirlo?

## 🎮 Cómo Jugar

1. **Crear Sala**: Un jugador crea una sala y selecciona un tema (cantantes, países, películas, etc.)
2. **Unirse**: Los demás jugadores se unen usando el código de 4 letras
3. **Inicio**: Cuando todos estén listos, el host inicia el juego
4. **Cuenta Regresiva**: Todos tienen 10 segundos para prepararse
5. **Revelación**: Cada jugador ve su palabra secreta... ¡excepto el impostor!
6. **Juego**: Hablen sobre sus palabras sin decirlas directamente
7. **Votación**: ¡Intenten descubrir quién es el impostor!

## ✨ Características

- 🎲 **Aleatorio**: El servidor elige la palabra y el impostor de forma aleatoria
- 🎯 **Ruleta**: Para decidir quién empieza a hablar
- 🎨 **Diseño Moderno**: Interfaz hermosa y fácil de usar
- 📱 **Responsive**: Funciona en móviles, tablets y computadoras
- ⚡ **Rápido**: Sin necesidad de registro ni instalación

## 🚀 Deployment en Vercel

### Opción 1: Deploy con Git

1. Sube el proyecto a GitHub/GitLab
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Deploy automático ✨

### Opción 2: Deploy con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 🛠️ Desarrollo Local

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ejecutar servidor de desarrollo
vercel dev

# Abre http://localhost:3000
```

## 📁 Estructura del Proyecto

```
impostor/
├── public/              # Frontend estático
│   ├── index.html       # Página principal
│   ├── lobby.html       # Sala de espera
│   ├── game.html        # Pantalla del juego
│   ├── styles.css       # Estilos
│   └── *.js             # Lógica del cliente
├── api/                 # Serverless Functions
│   ├── create-room.js   # Crear sala
│   ├── join-room.js     # Unirse a sala
│   ├── get-room.js      # Obtener info de sala
│   ├── start-game.js    # Iniciar juego
│   ├── get-role.js      # Obtener rol del jugador
│   └── spin-wheel.js    # Girar ruleta
├── lib/                 # Utilidades compartidas
│   ├── words.js         # Banco de palabras
│   └── storage.js       # Sistema de almacenamiento
├── vercel.json          # Configuración de Vercel
├── package.json
└── README.md
```

## ⚠️ Nota sobre Almacenamiento

Este proyecto usa almacenamiento en memoria, lo que significa que:
- ✅ Funciona perfectamente para desarrollo y pruebas
- ✅ No requiere configuración adicional
- ⚠️ Las salas se borran cuando el servidor se reinicia

### Para Producción (Opcional)

Si quieres que las salas persistan, puedes usar:

1. **Vercel KV** (Redis) - Recomendado
   - Gratis hasta 256MB
   - Configuración en 2 minutos
   - [Documentación](https://vercel.com/docs/storage/vercel-kv)

2. **Firebase Realtime Database**
   - Plan gratuito generoso
   - Sincronización en tiempo real

3. **Supabase** (PostgreSQL)
   - Alternativa open-source a Firebase

## 🎨 Temas Disponibles

- 🎤 Cantantes
- 🌍 Países
- 🎬 Películas
- 🦁 Animales
- 🍕 Comidas
- ⚽ Deportes

## 🔧 Personalización

### Agregar Nuevos Temas

Edita `lib/words.js`:

```javascript
export const WORD_BANK = {
  'tu-tema': [
    'Palabra 1',
    'Palabra 2',
    'Palabra 3',
    // ...
  ]
};
```

Luego actualiza el selector en `public/index.html`:

```html
<option value="tu-tema">🎯 Tu Tema</option>
```

## 📝 Variables de Configuración

- **Jugadores mínimos**: 3 (editar en `api/start-game.js`)
- **Jugadores máximos**: 10 (editar en `api/create-room.js`)
- **Tiempo de cuenta regresiva**: 10 segundos (editar en `api/get-role.js`)
- **Limpieza de salas**: 2 horas (editar en `lib/storage.js`)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Agregar nuevos temas y palabras
- Mejorar el diseño
- Reportar bugs
- Sugerir nuevas características

## 📄 Licencia

MIT - Siéntete libre de usar este proyecto como quieras.

## 🎉 ¡Disfruta el Juego!

Creado con ❤️ para jugar con amigos

