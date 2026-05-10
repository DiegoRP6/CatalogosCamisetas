(async function () {
  const lista = document.getElementById("lista");
  const buscador = document.getElementById("buscador");
  const contador = document.getElementById("contador");
  const iframe = document.getElementById("pdf");
  const placeholder = document.getElementById("placeholder");
  const acciones = document.getElementById("acciones");
  const abrirNueva = document.getElementById("abrirNueva");
  const descargar = document.getElementById("descargar");

  let datos = { catalogos: [] };
  try {
    const r = await fetch("/catalogos.json", { cache: "no-cache" });
    datos = await r.json();
  } catch (e) {
    console.error(e);
  }

  contador.textContent = `${datos.catalogos.length} catálogo(s)`;

  function render(filtro = "") {
    lista.innerHTML = "";
    const f = filtro.trim().toLowerCase();
    const items = datos.catalogos.filter(
      (c) => !f || c.nombre.toLowerCase().includes(f)
    );

    if (items.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Sin resultados";
      li.style.color = "#8a93a3";
      li.style.cursor = "default";
      lista.appendChild(li);
      return;
    }

    for (const c of items) {
      const li = document.createElement("li");
      li.dataset.url = c.url;
      li.dataset.nombre = c.nombre;
      li.innerHTML = `
        <span class="nombre">${c.nombre}</span>
        <span class="meta">${c.tamanioKB} KB</span>
      `;
      li.addEventListener("click", () => abrirCatalogo(c, li));
      lista.appendChild(li);
    }
  }

  function abrirCatalogo(c, li) {
    document
      .querySelectorAll(".lista li.activo")
      .forEach((el) => el.classList.remove("activo"));
    if (li) li.classList.add("activo");

    placeholder.style.display = "none";
    iframe.style.display = "block";
    iframe.src = c.url + "#toolbar=1&navpanes=0";
    acciones.style.display = "flex";
    abrirNueva.href = c.url;
    descargar.href = c.url;
    descargar.download = c.archivo || c.nombre + ".pdf";
    document.title = c.nombre + " · Catálogos";
  }

  buscador.addEventListener("input", (e) => render(e.target.value));
  render();
})();
