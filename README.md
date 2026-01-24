# Página Web - Destination Wedding Cartagena 2026

Sitio web oficial para la boda en Cartagena, Colombia. Versión HTML estática simple y fácil de usar.

## 🚀 Inicio Rápido

¡No necesitas instalar nada! Solo abre el archivo `index.html` en tu navegador.

1. Haz doble clic en `index.html`
2. O arrastra el archivo a tu navegador
3. ¡Listo! La página debería cargarse

## 📁 Archivos del Proyecto

```
Pagina_GV/
├── index.html          # Página principal HTML
├── styles.css          # Todos los estilos CSS
├── script.js           # JavaScript (countdown, galería, FAQ, etc.)
└── README.md           # Este archivo
```

## ✨ Características

- ✅ **Countdown en tiempo real** hacia el 17 de mayo de 2026
- ✅ **Mapa embebido** de Google Maps con ubicación del hotel
- ✅ **Itinerario completo** con eventos por día
- ✅ **Recomendaciones detalladas** de Cartagena (qué visitar, dónde comer, qué empacar, seguridad, tips prácticos)
- ✅ **Galería de fotos** responsive con modal lightbox
- ✅ **Sección "Nuestra Historia"** con placeholder editable
- ✅ **FAQ** con 10 preguntas frecuentes (acordeón interactivo)
- ✅ **Formulario RSVP** (placeholder - conectar con servicio de email)
- ✅ **Diseño mobile-first** y completamente responsive
- ✅ **Navegación sticky** con scroll suave
- ✅ **Paleta de colores elegante** (dorado, arena, verde palma)

## 🎨 Personalización

### Cambiar los nombres de la pareja

Edita `index.html`, línea 30:
```html
<h1 class="hero-title">Nombre & Nombre</h1>
```
Reemplaza "Nombre & Nombre" con los nombres reales.

### Actualizar la historia

Edita `index.html`, busca la sección con id `historia` y reemplaza el contenido placeholder con la historia real.

### Agregar fotos reales

Edita `script.js`, busca el array `photos` (alrededor de la línea 50) y reemplaza las URLs con las URLs de tus fotos reales:

```javascript
const photos = [
    {
        src: 'URL_DE_LA_FOTO_GRANDE',
        thumbnail: 'URL_DE_LA_FOTO_PEQUEÑA',
        alt: 'Descripción de la foto'
    },
    // ... más fotos
];
```

### Actualizar el mapa del hotel

Edita `index.html`, busca la sección con id `hotel` y reemplaza la URL del iframe:

1. Busca "Karibana Dreams Cartagena" en Google Maps
2. Haz clic en "Compartir" → "Insertar un mapa"
3. Copia la URL del iframe y reemplázala en el código

### Conectar el formulario RSVP

El formulario RSVP actualmente es un placeholder. Para conectarlo:

**Opción 1: EmailJS (Recomendado - Gratis)**
1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email
3. Agrega este código en `script.js` dentro de `handleRSVPSubmit`:

```javascript
emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', {
    name: formData.name,
    email: formData.email,
    guests: formData.guests,
    message: formData.message
});
```

**Opción 2: Formspree**
1. Crea una cuenta en [Formspree](https://formspree.io/)
2. Cambia el formulario en `index.html` para hacer POST a tu endpoint de Formspree

**Opción 3: Backend propio**
- Crea un endpoint en tu servidor
- Cambia el `handleRSVPSubmit` en `script.js` para hacer fetch a tu API

### Actualizar información de contacto

Edita `index.html`, busca el `<footer>` y reemplaza:
- Email: `wedding@example.com`
- Teléfono: `+57 300 123 4567`
- Links de redes sociales

## 🌐 Despliegue

### Opción 1: GitHub Pages (Gratis)

1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama main y la carpeta raíz
4. Tu sitio estará disponible en `https://tu-usuario.github.io/nombre-repo`

### Opción 2: Netlify (Gratis)

1. Ve a [Netlify](https://www.netlify.com/)
2. Arrastra la carpeta del proyecto
3. ¡Listo! Tu sitio estará desplegado

### Opción 3: Vercel (Gratis)

1. Ve a [Vercel](https://vercel.com/)
2. Importa tu proyecto
3. Vercel detectará automáticamente que es un sitio estático

### Opción 4: Cualquier hosting estático

Puedes subir los 3 archivos (`index.html`, `styles.css`, `script.js`) a cualquier servicio de hosting:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- O cualquier servidor web tradicional

## 📱 Responsive Design

El sitio está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS y flexbox/grid
- **JavaScript Vanilla** - Sin dependencias, puro JavaScript
- **Google Fonts** - Playfair Display y Lato

## 📝 Notas

- El countdown usa la zona horaria de Cartagena (America/Bogota, UTC-5)
- Las fotos en la galería son placeholders de Unsplash - reemplázalas con fotos reales
- El formulario RSVP necesita ser conectado a un servicio real
- Los datos de contacto en el footer son placeholders
- El mapa usa coordenadas aproximadas - actualiza con la ubicación real del hotel

## 🎯 Próximos Pasos

1. ✅ Reemplazar nombres de la pareja
2. ✅ Agregar la historia real
3. ✅ Subir fotos reales a la galería
4. ✅ Conectar el formulario RSVP
5. ✅ Actualizar información de contacto
6. ✅ Verificar coordenadas del hotel en el mapa
7. ✅ Personalizar colores si es necesario (en `styles.css`, busca `:root`)

## 💡 Ventajas de esta versión HTML

- ✅ **Sin dependencias** - No necesitas Node.js, npm, ni nada más
- ✅ **Rápida** - Carga instantánea, sin compilación
- ✅ **Fácil de editar** - Solo 3 archivos, HTML/CSS/JS puro
- ✅ **Portable** - Funciona en cualquier servidor web
- ✅ **SEO friendly** - HTML semántico
- ✅ **Sin build process** - Edita y listo

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para uso personal del evento.

---

Hecho con ❤️ para una boda especial en Cartagena
