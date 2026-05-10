/**
 * Genera public/catalogos.json con la lista de PDFs encontrados en
 * public/catalogos/. Se ejecuta en el build de Vercel.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "public", "catalogos");
const out = path.join(__dirname, "public", "catalogos.json");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

const catalogos = files.map((file) => {
  const stat = fs.statSync(path.join(dir, file));
  const nombre = file
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    archivo: file,
    nombre: nombre.toUpperCase(),
    url: `/catalogos/${encodeURIComponent(file)}`,
    tamanioKB: Math.round(stat.size / 1024),
  };
});

fs.writeFileSync(out, JSON.stringify({ catalogos }, null, 2), "utf8");
console.log(`OK -> ${out} (${catalogos.length} catálogos)`);
