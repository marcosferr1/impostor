# 💰 Cómo Configurar Google AdSense para Monetizar tu Juego

## 📋 Requisitos Previos

1. **Dominio propio** (recomendado, pero no obligatorio)
2. **Contenido original** y de calidad
3. **Tráfico regular** (aunque sea poco al inicio)
4. **Cumplir las políticas de AdSense**

---

## 🚀 Paso 1: Crear Cuenta de Google AdSense

### 1. Ve a Google AdSense
👉 https://www.google.com/adsense/

### 2. Registrarte
- Click en **"Comenzar"**
- Usa tu cuenta de Gmail
- Ingresa la URL de tu sitio: `tu-dominio.vercel.app`
- Acepta los términos y condiciones

### 3. Información de Pago
- Nombre completo
- Dirección postal (donde recibirás pagos)
- Método de pago (transferencia bancaria o cheque)

---

## 📝 Paso 2: Verificar tu Sitio

### AdSense te dará un código como este:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### ⚠️ NO necesitas hacer nada
Ya está incluido en el archivo `ads.js`. Solo necesitas tu **ID de publicador**.

---

## 🔧 Paso 3: Configurar los Anuncios en tu Juego

### 1. Obtén tu ID de Publicador

Después de registrarte, verás algo como:
```
ca-pub-1234567890123456
```

### 2. Edita el archivo `public/ads.js`

Busca esta línea:
```javascript
publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // ⚠️ CAMBIAR POR TU ID
```

Reemplázala con tu ID real:
```javascript
publisherId: 'ca-pub-1234567890123456', // ✅ Tu ID real
```

### 3. Crea tus Unidades de Anuncio

1. Ve a tu cuenta de AdSense
2. Click en **"Anuncios"** → **"Por unidad de anuncio"**
3. Click en **"Anuncios gráficos"**
4. Configuración:
   - **Nombre**: "Impostor - Lateral Izquierdo"
   - **Tamaño**: 160 x 600 (Rascacielos ancho)
   - Click en **"Crear"**

5. Copia el código y busca el `data-ad-slot`:
```html
data-ad-slot="1234567890"
```

6. Repite para el anuncio derecho:
   - **Nombre**: "Impostor - Lateral Derecho"
   - **Tamaño**: 160 x 600

### 4. Actualiza `ads.js` con tus IDs de Slot

```javascript
sidebarLeftId: '1234567890',  // ✅ Tu ID de slot izquierdo
sidebarRightId: '0987654321', // ✅ Tu ID de slot derecho

enabled: true // ✅ ACTIVAR los anuncios
```

### 5. Actualiza los archivos HTML

Busca en `index.html`, `lobby.html` y `game.html`:

```html
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="1234567890"
```

Reemplázalos con tus valores reales.

---

## 🚀 Paso 4: Deploy

```bash
vercel --prod
```

---

## ⏳ Paso 5: Esperar Aprobación

### Timeline:
1. **Verificación inicial**: 1-3 días
   - AdSense verifica que el código esté instalado
   
2. **Revisión del sitio**: 2-4 semanas
   - Revisan contenido y tráfico
   - Pueden pedir ajustes
   
3. **Aprobación**: Recibirás email
   - Los anuncios empezarán a mostrarse automáticamente

### Durante la espera:
- ✅ Los placeholders se mostrarán (texto "Espacio Publicitario")
- ❌ Aún no verás anuncios reales
- ✅ Sigue generando tráfico en tu sitio

---

## 💰 Paso 6: Cobrar tus Ganancias

### Requisitos para cobrar:
- **Mínimo**: $100 USD
- **Método**: Transferencia bancaria o cheque
- **Frecuencia**: Mensual (si superas el mínimo)

### Optimizar ingresos:
1. **Tráfico**: Mientras más usuarios, más clicks
2. **Calidad**: Usuarios reales y comprometidos
3. **Ubicación**: Los anuncios laterales son efectivos
4. **Contenido**: Mantén el juego actualizado

---

## 📊 Monitorear Ganancias

### Dashboard de AdSense:
- **Ingresos estimados**: Diarios/mensuales
- **Impresiones**: Cuántas veces se mostraron anuncios
- **Clicks**: Cuántos usuarios clickearon
- **CTR**: Click-through rate (porcentaje)
- **CPC**: Costo por click

---

## 🎨 Diseño de los Anuncios

### Ya configurado en tu juego:

✅ **Anuncios laterales** (160x600 px)
- Izquierda y derecha
- No intrusivos
- Se ocultan automáticamente en móviles

✅ **Responsive**
- Desktop: Se ven los 2 anuncios
- Tablet: Anuncios más pequeños
- Móvil: Se ocultan (mejor UX)

---

## ⚠️ Políticas Importantes de AdSense

### ❌ PROHIBIDO:
- Click en tus propios anuncios
- Pedir a usuarios que clickeen
- Contenido para adultos
- Violencia extrema
- Contenido copiado
- Tráfico falso/bots

### ✅ PERMITIDO:
- Juegos casuales (como El Impostor)
- Contenido original
- Múltiples sitios con la misma cuenta
- Anuncios en múltiples páginas

---

## 🔍 Solución de Problemas

### "Mis anuncios no se muestran"
1. ¿Actualizaste el `publisherId` en `ads.js`?
2. ¿Cambiaste `enabled: true`?
3. ¿Actualizaste los `data-ad-client` en los HTML?
4. ¿Tu cuenta de AdSense fue aprobada?

### "Solo veo el placeholder"
- Normal si aún no estás aprobado
- Espera la aprobación de AdSense

### "Cuenta rechazada"
- Revisa el email de AdSense
- Corrige lo que piden
- Re-aplica después de 30 días

---

## 📈 Estimación de Ingresos

### Ejemplo realista:
```
100 usuarios/día × 30 días = 3,000 usuarios/mes
CTR promedio: 1% = 30 clicks
CPC promedio: $0.50
Ingreso mensual: ~$15 USD
```

### Para ganar más:
- **1,000 usuarios/día**: ~$150/mes
- **5,000 usuarios/día**: ~$750/mes
- **10,000 usuarios/día**: ~$1,500/mes

*Nota: Varía según país, nicho y calidad de tráfico*

---

## 🎯 Próximos Pasos Después de Configurar

1. **Promociona tu juego**:
   - Redes sociales
   - Grupos de WhatsApp
   - Reddit, Discord
   - TikTok con gameplay

2. **Agrega más temas**:
   - Más palabras = más tiempo en sitio
   - Más tiempo = más impresiones

3. **Analytics**:
   - Instala Google Analytics
   - Monitorea comportamiento de usuarios

4. **SEO**:
   - Agrega meta descriptions
   - Títulos optimizados
   - Open Graph tags

---

## 📞 Soporte

- **AdSense Help**: https://support.google.com/adsense
- **Foro de AdSense**: https://support.google.com/adsense/community
- **Políticas**: https://support.google.com/adsense/answer/48182

---

## ✅ Checklist Final

- [ ] Cuenta de AdSense creada
- [ ] Sitio verificado
- [ ] `publisherId` actualizado en `ads.js`
- [ ] `enabled: true` en `ads.js`
- [ ] IDs de slot configurados
- [ ] `data-ad-client` actualizado en HTMLs
- [ ] Deploy realizado
- [ ] Esperando aprobación
- [ ] Monitoreando dashboard

---

**¡Buena suerte con la monetización! 💰🎉**

