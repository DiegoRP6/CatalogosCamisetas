# Catálogos Web

Visor web estático de catálogos PDF, listo para desplegar en **Vercel**.
Sin backend: simplemente sirve los PDFs desde `public/catalogos/` y los muestra
en un visor con buscador.

## Estructura

```
catalogos-web/
├─ public/
│  ├─ index.html        # UI
│  ├─ styles.css
│  ├─ app.js
│  └─ catalogos/        # <-- pon aquí tus .pdf
├─ build-list.js        # genera public/catalogos.json en build
├─ vercel.json
└─ package.json
```

## Cómo añadir catálogos

1. Genera el PDF con el script Python (`crear_catalogo.py`).
2. Renómbralo a algo descriptivo, p. ej. `catalogo-retro.pdf`,
   `catalogo-mundial.pdf`, `catalogo-chandales.pdf`.
3. Cópialo a `catalogos-web/public/catalogos/`.
4. Vuelve a hacer commit + push (o `vercel --prod`). Aparece automáticamente.

## Probar en local

```powershell
cd catalogos-web
npm run dev
```
Abre http://localhost:3000

## Desplegar en Vercel

### Opción A — Desde la web (más fácil)
1. Sube esta carpeta a un repo de GitHub.
2. En https://vercel.com/new importa el repo.
3. **Root Directory**: `catalogos-web` (si subes todo el workspace) o `.`
4. Framework preset: **Other**
5. Build Command: `node build-list.js`
6. Output Directory: `public`
7. Deploy.

### Opción B — Vercel CLI
```powershell
cd catalogos-web
npx vercel        # primer deploy (preview)
npx vercel --prod # producción
```

## Notas

- Los PDFs se sirven con `Content-Disposition: inline` para que el navegador
  los visualice sin descargar.
- El listado se genera en build leyendo `public/catalogos/`. Tras añadir un PDF
  nuevo hay que volver a desplegar.
- Vercel tiene un límite de 100 MB por archivo en plan free; los PDFs típicos
  de catálogo entran sobrados.
