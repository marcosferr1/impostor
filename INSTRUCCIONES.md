# 🚀 Instrucciones Rápidas - El Impostor

## ✅ ¡Tu proyecto está listo!

Todos los archivos han sido creados. Ahora solo necesitas deployarlo en Vercel.

## 📦 Opción 1: Deploy con Vercel CLI (Recomendado)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Hacer Login en Vercel

```bash
vercel login
```

Esto abrirá tu navegador para iniciar sesión (o crear cuenta gratuita si no tienes).

### Paso 3: Deploy

Desde la carpeta del proyecto:

```bash
vercel
```

Responde las preguntas:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta
- **Link to existing project?** → No
- **Project name?** → impostor (o el nombre que quieras)
- **In which directory?** → ./
- **Override settings?** → No

¡Listo! Te dará una URL como: `https://impostor-xxxxx.vercel.app`

### Paso 4: Deploy a Producción

```bash
vercel --prod
```

Esto te dará una URL de producción permanente.

## 🌐 Opción 2: Deploy con GitHub (Sin CLI)

### Paso 1: Crear repositorio en GitHub

```bash
git init
git add .
git commit -m "Initial commit - El Impostor"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/impostor.git
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Click en "Deploy"

¡Listo! Vercel detectará automáticamente la configuración.

## 🧪 Probar Localmente (Opcional)

Si quieres probar antes de deployar:

```bash
# Instalar Vercel CLI si no lo tienes
npm install -g vercel

# Correr servidor de desarrollo
vercel dev
```

Abre `http://localhost:3000` en tu navegador.

**Nota**: En desarrollo local, necesitarás al menos 2 dispositivos/ventanas para probar el juego multijugador.

## 🎮 Cómo Usar Tu Juego

1. **Comparte el link** con tus amigos
2. **Uno crea la sala** y comparte el código de 4 letras
3. **Los demás se unen** con ese código
4. **El host inicia** cuando todos estén listos
5. **¡A jugar!**

## 🎨 Personalización

### Cambiar colores:

Edita `public/styles.css` y busca:
- `#667eea` - Color primario (púrpura)
- `#764ba2` - Color secundario

### Agregar más palabras:

Edita `lib/words.js` y agrega palabras a los arrays existentes.

### Agregar nuevos temas:

1. Agrega el tema en `lib/words.js`
2. Agrega la opción en `public/index.html` (línea ~35)

## ⚠️ Notas Importantes

- **Almacenamiento**: Las salas se guardan en memoria. Si el servidor se reinicia, se pierden.
- **Límites gratuitos Vercel**:
  - 100GB bandwidth/mes
  - Perfecto para uso con amigos
- **Salas inactivas**: Se borran automáticamente después de 2 horas

## 🔧 Solución de Problemas

### "Error al crear sala"
- Verifica que el deploy se completó correctamente
- Revisa los logs en Vercel Dashboard

### "Sala no encontrada"
- La sala puede haber expirado (2 horas de inactividad)
- Crear una nueva sala

### Los jugadores no ven actualizaciones
- Asegúrate de que todos tienen buena conexión
- El polling es cada 2 segundos

## 📱 Compatibilidad

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Móviles iOS/Android

## 🎉 ¡Disfruta!

Comparte el link con tus amigos y diviértanse jugando al Impostor.

¿Preguntas? Revisa el README.md para más detalles técnicos.

