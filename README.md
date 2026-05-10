# Catálogos Camisetikas — Web

Sitio estático para Vercel que lista **múltiples PDFs** dinámicamente desde `public/`
y permite seleccionar y ver cualquiera. Abre el primero por defecto.

## Cómo usar

1. Genera los PDFs con el script Python (uno por cada carpeta en `imagenesCatalogos/`):
   ```powershell
   cd "Fotos camis"
   .\generar_catalogos.bat
   ```
   Se crean archivos como:
   - `catalogo_retro.pdf`
   - `catalogo_mundial_1.pdf`
   - `catalogo_mundial_2.pdf`
   - `catalogo_chandales.pdf`

2. Cópialo a `catalogos-web/public/`:
   ```powershell
   Copy-Item .\catalogo_*.pdf .\catalogos-web\public\ -Force
   ```

3. Regenera la lista de catálogos:
   ```powershell
   cd catalogos-web
   npm run build
   ```

4. Despliega en Vercel.

## Probar en local

```powershell
cd catalogos-web
npm run dev
```
→ http://localhost:3000

Se abrirá automáticamente el primer catálogo. Usa la barra lateral para cambiar.

## Despliegue en Vercel

### Opción A — Web (recomendado)
1. Sube el repo a GitHub.
2. En https://vercel.com/new selecciona el repo.
3. **Root Directory**: `catalogos-web`
4. **Framework**: *Other*
5. **Build Command**: `npm run build`
6. **Output Directory**: `public`
7. Deploy.

### Opción B — CLI
```powershell
cd catalogos-web
npx vercel        # preview
npx vercel --prod # producción
```

## Carga progresiva

Los PDFs se generan con:
- **4 columnas × 4 filas**: imágenes compactas (16 por página)
- **Redimensionamiento**: máx 600×600px por imagen
- **Compresión**: reduce peso drásticamente
- **Linearización** (si instalas `pikepdf`): permite carga progresiva

Tamaño típico por catálogo: **40-60 MB**

