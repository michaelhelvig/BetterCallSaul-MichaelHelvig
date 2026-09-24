# Better Call Saul — Sitio de Fans

Trabajo práctico de programación (HTML5 + CSS + JavaScript). Sitio de fans no oficial
sobre *Better Call Saul*, con navegación, submenú desplegable, formulario de contacto
funcional, galería con filtros y visor ampliado, sección de Easter Eggs, y optimizado
para SEO.

## Estructura

```
bcs-site/
├── index.html          → Home (H1: "Better Call Saul")
├── temporadas.html      → Las 6 temporadas (cada una es una caja clickeable)
├── temporada-1.html ... temporada-6.html → Resumen completo de cada temporada (submenú del navbar)
├── personajes.html      → Fichas de personajes con retrato ilustrado (flip cards)
├── galeria.html         → Galería con filtros + lightbox funcional
├── contacto.html        → Formulario de contacto validado
├── easter-eggs.html     → Trivia, generador de alias y timbre secreto
├── sitemap.xml          → Mapa del sitio para buscadores
├── robots.txt           → Reglas de indexación
├── css/
│   └── estilos.css
├── js/
│   └── base.js
└── imagenes/
    ├── hero-fondo.jpg                → ilustración propia para el fondo del hero (home)
    ├── imagen1.jpg ... imagen6.jpg   → pósters por temporada, cada uno con su ícono temático
    ├── imagen7.jpg ... imagen10.jpg  → objetos icónicos (galería)
    └── personaje-*.jpg               → retrato ilustrado de cada personaje principal

```

## Requisitos del trabajo cubiertos

- Home + 4 links de primer nivel: Temporadas, Personajes, Galería, Contacto.
- 2 de esos links son un formulario de contacto (`contacto.html`) y una galería de
  imágenes funcional (`galeria.html`, con filtros y visor ampliado).
- "Temporadas" tiene un submenú desplegable de segundo nivel con 6 opciones
  (Temporada 1 a 6), más de las 3 mínimas requeridas.
- Diseño responsive (menú hamburguesa en mobile, grillas flexibles, imágenes fluidas).
- `<h1>` de la home es literalmente "Better Call Saul".

## SEO — qué se implementó

- `<title>` y `<meta name="description">` únicos y descriptivos en cada una de las 6 páginas.
- Open Graph (`og:title`, `og:description`, `og:image`, etc.) y Twitter Cards para que
  se vea bien al compartir el link.
- Datos estructurados JSON-LD (`WebSite` en la home, `BreadcrumbList` en el resto).
- `sitemap.xml` y `robots.txt` en la raíz.
- `lang="es-AR"` (el sitio usa voseo).
- Enlace "saltar al contenido" para accesibilidad/SEO.
- Imágenes con `width`/`height` (evita saltos de layout) y `loading="lazy"` fuera del hero.
- Todas las imágenes optimizadas a menos de 140kb.

### ⚠️ Antes de publicar: reemplazá el dominio de ejemplo

Todas las etiquetas `canonical`, `og:url`, `og:image`, y los archivos `sitemap.xml` y
`robots.txt` usan como placeholder:

```
https://tu-usuario.github.io/better-call-saul-site/
```

Una vez que subas el repo y sepas tu URL real de GitHub Pages, reemplazá
`tu-usuario` (y el nombre del repo si lo cambiaste) en todos los archivos. Podés
hacerlo rápido desde la terminal, parado en la carpeta del proyecto:

```bash
# Mac / Linux
grep -rl "tu-usuario.github.io/better-call-saul-site" . | xargs sed -i '' 's#tu-usuario.github.io/better-call-saul-site#TU-USUARIO-REAL.github.io/TU-REPO#g'

# Si sed -i '' te da error (Linux), usá: sed -i 's#...#...#g'
```

O simplemente buscá "tu-usuario" con el buscador de tu editor (VS Code: Ctrl+Shift+F)
y reemplazalo a mano en los archivos que lo usan (las 6 páginas `.html`, `sitemap.xml`
y `robots.txt`).

## Cómo reemplazar las imágenes por tus propias fotos

Todas las imágenes del sitio están preparadas para que solo tengas que **reemplazar el
archivo dentro de `imagenes/` conservando el mismo nombre** (incluida la extensión `.jpg`).
No hace falta tocar HTML ni CSS: el CSS recorta cada foto al formato de su tarjeta
(`object-fit: cover`), así que no se deforma aunque la foto original tenga otra proporción.

| Archivo | Dónde se usa | Formato recomendado |
|---|---|---|
| `hero-fondo.jpg` | Fondo del hero (home) | Horizontal **16:9**, ideal 1920×1080 |
| `imagen1.jpg` … `imagen6.jpg` | Temporadas (home, temporadas, página de cada temporada, galería) | Vertical **4:5**, ej. 900×1125 |
| `imagen7.jpg` … `imagen10.jpg` | Galería (objetos icónicos) | Vertical **4:5**, ej. 900×1125 |
| `personaje-*.jpg` | Fichas de personajes | Vertical **4:5**, ej. 640×800 (el rostro se prioriza arriba) |

Consejos:

- Si la foto tiene otra proporción, no se estira: se recorta desde el centro. Para cambiar
  qué parte se ve, agregá en la etiqueta `<img>` un `style="--foco: 50% 20%"` (x e y).
- Para el hero, dejá la zona izquierda de la foto lo más despejada posible: ahí va el texto.
- Mantené cada archivo por debajo de ~150 kb para que la página cargue rápido.
- Si usás otro formato (`.png`, `.webp`), cambiá también la extensión en los `src`.

## Cómo correrlo en localhost

Con Python instalado, parado en la carpeta del proyecto:

```bash
python -m http.server 8000
```

y abrís `http://localhost:8000` en el navegador. Si ya tenés Node.js (por ejemplo por
trabajar con Next.js), también funciona:

```bash
npx http-server -p 8000
```

No lo abras con doble clic (`file://`) porque algunas cosas de JavaScript pueden fallar.

## Cómo subirlo a GitHub y publicarlo con GitHub Pages

1. Creá un repositorio nuevo y **público** en GitHub (por ejemplo `better-call-saul-site`).
2. Desde la carpeta del proyecto, en una terminal:
   ```bash
   git init
   git add .
   git commit -m "Sitio Better Call Saul - trabajo práctico"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/better-call-saul-site.git
   git push -u origin main
   ```
3. En GitHub, andá a **Settings → Pages**.
4. En "Build and deployment", elegí **Deploy from a branch**, rama `main`, carpeta `/root`.
5. Guardá. En un par de minutos el sitio va a quedar disponible en:
   `https://TU-USUARIO.github.io/better-call-saul-site/`
6. Reemplazá el dominio placeholder (ver sección de SEO arriba) y volvé a subir los cambios.
7. Entregá ambos links: el del repositorio y el de GitHub Pages.

## Notas de diseño — por qué no hay fotos reales de la serie

El pedido original incluía usar una foto promocional oficial de la serie como fondo
del hero y fotos de los actores en las fichas de personajes. No se usaron esas
imágenes: son material con copyright de AMC/Sony Pictures Television (y, en el caso
del hero, la imagen de un actor real), y reproducirlas en un trabajo público generaría
un problema de derechos de autor.

En su lugar:

- **Hero:** ilustración propia (`hero-fondo.jpg`), un paisaje desértico minimalista en
  la misma paleta amarillo/rojo/gris del resto del sitio, con el `<h1>Better Call
  Saul</h1>` pedido y el eslogan original como subtítulo aparte.
- **Personajes:** cada ficha tiene un retrato ilustrado propio (`personaje-*.jpg`):
  silueta genérica + un ícono distintivo del personaje (teléfono, balanza, reloj,
  llama, manta térmica, etc.), no una foto ni un dibujo que imite a los actores.
- **Temporadas:** los pósters (`imagen1.jpg` a `imagen6.jpg`) ahora incluyen un ícono
  temático dentro del círculo que antes estaba vacío.
- **Optimización de imágenes:** todas verificadas por debajo de 140kb.

El formulario de contacto valida en el navegador pero no envía datos a ningún
servidor real (no hay backend en este trabajo).