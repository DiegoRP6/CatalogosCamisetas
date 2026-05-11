# CAMISETIKA

Catálogo visual minimalista de camisetas de fútbol.
Angular 18 standalone · Signals · TailwindCSS · CDK Virtual Scroll · Lazy loading.

> Sin backend. Sin base de datos. Las secciones y las imágenes se detectan
> automáticamente desde `assets/camisetas/<carpeta>/*`.

---

## 1. Estructura

```
catalogos-web/
├── angular.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
├── build-manifest.js              ← escanea las carpetas
├── assets/camisetas/              ← TUS imágenes (intactas)
│   ├── CHANDALES/
│   ├── MUNDIAL 1/
│   ├── MUNDIAL 2/
│   └── RETRO/
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── manifest.json              ← generado por build-manifest.js
    └── app/
        ├── app.component.ts
        ├── app.config.ts
        ├── app.routes.ts
        ├── core/
        │   ├── models/catalog.model.ts
        │   └── services/catalog.service.ts
        ├── shared/components/header.component.ts
        └── features/
            ├── home/home.component.ts
            ├── section/section.component.ts
            ├── grid/shirt-grid.component.ts
            └── viewer/viewer.component.ts
```

## 2. Cómo funciona la carga dinámica

Cada carpeta dentro de `assets/camisetas/` es una sección. El script
`build-manifest.js` la escanea y genera `src/manifest.json` con:

```jsonc
{
  "totalSections": 4,
  "totalImages": 1268,
  "sections": [
    {
      "slug": "retro",
      "name": "Retro",
      "folder": "RETRO",
      "count": 844,
      "cover": "/assets/camisetas/RETRO/imgi_10_small.jpg",
      "images": [
        { "id": "retro__imgi_10_small", "src": "/assets/camisetas/RETRO/imgi_10_small.jpg", "name": "imgi_10_small" }
      ]
    }
  ]
}
```

Se ejecuta automáticamente antes de `npm start` y `npm run build` gracias a
los hooks `prestart` / `prebuild` de `package.json`. También a mano:

```bash
npm run manifest
```

## 3. Instalación

```bash
cd catalogos-web
npm install
```

## 4. Desarrollo

```bash
npm start
```

Abre <http://localhost:4200>. Angular sirve también las imágenes desde
`assets/` (configurado en `angular.json`).

## 5. Producción

```bash
npm run build
```

Salida en `dist/camisetika/`. Súbelo a cualquier hosting estático
(Vercel, Netlify, S3, GitHub Pages…). `angular.json` ya copia
`assets/camisetas/` al `dist`.

## 6. Rendimiento

- **Virtual Scroll (CDK)** sobre filas: sólo las filas visibles existen
  en el DOM, incluso con 800+ imágenes en una sección.
- **Lazy loading nativo** (`loading="lazy"`, `decoding="async"`,
  `fetchpriority="low"`).
- **ResizeObserver** recalcula columnas (2 / 3 / 4 / 5 / 6 / 7) según el
  ancho del viewport.
- **OnPush + Signals** en todos los componentes.
- **`contain: strict`** en el viewport para minimizar reflows.
- **Skeletons** elegantes mientras carga el manifest.

Esto permite secciones de 800–2000+ imágenes con scroll fluido en móvil.

## 7. Visor fullscreen

Al pulsar una camiseta se abre un visor:

- Click sobre el fondo o `Esc` para cerrar.
- Flechas `←` / `→` o botones laterales para navegar.
- Swipe horizontal en móvil.
- Click sobre la imagen para alternar zoom.
- Contador `n / total`.

## 8. Añadir nuevas secciones

1. Crea una carpeta dentro de `assets/camisetas/` (p. ej. `LALIGA`).
2. Pega las imágenes (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`).
3. Ejecuta `npm run manifest` (o relanza `npm start`).
4. La sección aparece automáticamente en el header.

## 9. Stack

- Angular `^18.2` standalone (`bootstrapApplication`, `loadComponent`).
- `@angular/cdk/scrolling` Virtual Scroll.
- TailwindCSS `^3.4` con tokens propios.
- Signals + `OnPush` + `toSignal` para reactividad mínima.
- Sin backend, sin BD. Todo estático.
