/**
 * Escanea public/*.pdf y genera catalogos.json con la lista
 */
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "public");
const out = path.join(__dirname, "public", "catalogos.json");

const files = fs
  .readdirSync(publicDir)
  .filter((f) => f.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

const catalogos = files.map((file) => {
  const stat = fs.statSync(path.join(publicDir, file));
  const nombre = file
    .replace(/^catalogo_/, "")
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  return {
    archivo: file,
    nombre: nombre,
    url: `/${encodeURIComponent(file)}`,
    tamanioKB: Math.round(stat.size / 1024),
  };
});

fs.writeFileSync(out, JSON.stringify({ catalogos }, null, 2), "utf8");
console.log(`OK -> ${out} (${catalogos.length} catálogos)`);
