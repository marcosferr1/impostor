# 📱 Configurar Anuncios para Móvil

## ✅ Lo que ya está hecho:

He configurado tu sitio para mostrar:
- **Desktop**: Anuncios laterales (160x600)
- **Móvil**: Anuncios arriba y abajo (banner responsive)

---

## 📝 Crear Unidades de Anuncio para Móvil

### 1. Ve a AdSense:
👉 https://adsense.google.com/

### 2. Click en "Anuncios" → "Por unidad de anuncio"

### 3. Click en "Anuncios gráficos"

### 4. Configurar Anuncio Superior Móvil:

```
Nombre: Impostor - Banner Móvil Superior
Tipo: Cuadrado o Horizontal
Tamaño: Responsive (recomendado)
```

**Opciones de tamaño:**
- ✅ **Responsive** (recomendado) - Se adapta automáticamente
- 320x50 (Banner móvil estándar)
- 320x100 (Banner móvil grande)
- 300x250 (Rectángulo mediano)

Click en **"Crear"**

### 5. Copiar el Slot ID:

Te mostrará código como:
```html
data-ad-slot="1234567890"  ← Copia este número
```

### 6. Repetir para Anuncio Inferior:

```
Nombre: Impostor - Banner Móvil Inferior
Tipo: Responsive
Tamaño: Responsive
```

Anota el nuevo Slot ID.

---

## 🔧 Actualizar los Archivos:

### Necesitas reemplazar en 3 archivos:

**`public/index.html`** (líneas 12 y 67)  
**`public/lobby.html`** (líneas 12 y 86)  
**`public/game.html`** (líneas 12 y 78)

Busca:
```html
data-ad-slot="CREAR_SLOT_MOBILE_TOP"
```

Reemplaza con tu Slot ID superior (ejemplo):
```html
data-ad-slot="1234567890"
```

Busca:
```html
data-ad-slot="CREAR_SLOT_MOBILE_BOTTOM"
```

Reemplaza con tu Slot ID inferior (ejemplo):
```html
data-ad-slot="0987654321"
```

---

## 📊 Resumen de Unidades de Anuncio:

Después de crear todo, tendrás **4 unidades**:

```
Desktop:
├─ Lateral Izquierdo:  1734930678 (160x600) ✅
└─ Lateral Derecho:    9421849006 (160x600) ✅

Móvil:
├─ Banner Superior:    [TU_SLOT_TOP]    (Responsive) ⚠️ CREAR
└─ Banner Inferior:    [TU_SLOT_BOTTOM] (Responsive) ⚠️ CREAR
```

---

## 🎯 Cómo se Verá:

### Desktop (> 900px):
```
┌────────┬──────────────┬────────┐
│  AD    │   TU JUEGO   │   AD   │
│ LEFT   │              │  RIGHT │
│160x600 │              │160x600 │
└────────┴──────────────┴────────┘
```

### Móvil (< 900px):
```
┌────────────────────────┐
│   [AD SUPERIOR]        │ ← Banner responsive
├────────────────────────┤
│                        │
│      TU JUEGO          │
│                        │
├────────────────────────┤
│   [AD INFERIOR]        │ ← Banner responsive
└────────────────────────┘
```

---

## 💡 Beneficios de Anuncios Responsive:

✅ **Se adaptan automáticamente** al tamaño de pantalla  
✅ **Mejores ingresos** en móvil  
✅ **Mayor fill rate** (más veces se muestra un ad)  
✅ **Mejor experiencia de usuario**  

---

## ⚙️ Tipo de Anuncio Recomendado:

Para móvil, Google recomienda:

### Opción 1: **Anuncios Responsive** ⭐ (Mejor)
```html
data-ad-format="auto"
data-full-width-responsive="true"
```
- Google elige el mejor tamaño automáticamente
- Se adapta a cualquier pantalla
- Máximos ingresos

### Opción 2: **Banner Fijo**
```html
style="width:320px;height:50px"
```
- Tamaño fijo
- Funciona siempre igual
- Menos flexible

**Ya está configurado con Responsive (Opción 1)** ✅

---

## 🚀 Pasos Finales:

1. **Crear las 2 unidades móviles** en AdSense
2. **Anotar los Slot IDs**
3. **Dame los IDs** y yo actualizo los archivos
4. **Deploy** automático
5. **Listo** ✨

---

## 📝 Ejemplo de lo que me tienes que dar:

```
Slot Superior: 1234567890
Slot Inferior: 0987654321
```

---

¿Ya creaste las unidades de anuncio móvil? Dame los Slot IDs y termino la configuración. 📱💰

