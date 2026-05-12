/**
 * build-manifest.js
 * Escanea ./assets/camisetas/<seccion>/*.{jpg,jpeg,png,webp,avif}
 * y genera src/manifest.json con la lista de secciones e imágenes.
 *
 * - El nombre de la carpeta se convierte en sección navegable.
 * - Las rutas se devuelven como "/assets/camisetas/<carpeta>/<archivo>"
 *   ya codificadas para usarse directamente en <img src>.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const CAMISETAS_DIR = path.join(ROOT, "assets", "camisetas");
const OUT_DIR = path.join(ROOT, "public");
const OUT_FILE = path.join(OUT_DIR, "manifest.json");

const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;
const COVER_BASE_RE = /^0+[_-]?portada$/i;

function slugify(s) {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pretty(name) {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function encodePath(parts) {
  return "/" + parts.map(encodeURIComponent).join("/");
}

function basenameWithoutExt(file) {
  return file.replace(IMAGE_RE, "");
}

function isPreferredCover(file) {
  return COVER_BASE_RE.test(basenameWithoutExt(file));
}

function walkSection(sectionDir, sectionFolder) {
  const entries = fs.readdirSync(sectionDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && IMAGE_RE.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  const preferredCover = files.find(isPreferredCover);
  const fallbackCover = files[0];
  const coverFile = preferredCover ?? fallbackCover ?? null;

  const images = files
    .filter((file) => file !== coverFile)
    .map((file) => {
      const base = basenameWithoutExt(file);
      return {
        id: `${slugify(sectionFolder)}__${slugify(base)}`,
        src: encodePath(["assets", "camisetas", sectionFolder, file]),
        name: base
      };
    });

  const cover = coverFile
    ? encodePath(["assets", "camisetas", sectionFolder, coverFile])
    : null;

  return { images, cover };
}

function main() {
  if (!fs.existsSync(CAMISETAS_DIR)) {
    console.error("No existe la carpeta:", CAMISETAS_DIR);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(CAMISETAS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  const sections = folders.map((folder) => {
    const { images, cover } = walkSection(
      path.join(CAMISETAS_DIR, folder),
      folder
    );
    return {
      slug: slugify(folder),
      name: pretty(folder),
      folder,
      count: images.length,
      cover,
      images
    };
  });

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalSections: sections.length,
    totalImages: sections.reduce((acc, s) => acc + s.count, 0),
    sections
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(manifest), "utf8");

  console.log(
    `OK -> ${path.relative(ROOT, OUT_FILE)}  ` +
      `(${manifest.totalSections} secciones, ${manifest.totalImages} imágenes)`
  );
  for (const s of sections) {
    console.log(`  · ${s.name.padEnd(24)} ${String(s.count).padStart(5)} imgs`);
  }
}

main();
