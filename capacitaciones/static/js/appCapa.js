const tbodyCB = document.getElementById("tbody_blandas");
const tbody_historial = document.getElementById("tbody_historial");
const tbodyCT = document.getElementById("tbody_tecnicas");

async function ObtenerCapacitaciones() {
  try {
    const response = await fetch("ListadoCapacitaciones");
    if (!response.ok) {
      throw new Error("Error al obtener capacitaciones");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Función para renderizar los datos en la tabla
async function MostrarCapacitaciones() {
  const capacitaciones = await ObtenerCapacitaciones();
  const capaHistorial = capacitaciones.filter((c) => c.estado === false);
  const capaBlandas = capacitaciones.filter((c) => c.idCategoria === "BLANDAS" && c.estado === true);
  const capaTecnicas = capacitaciones.filter((c) => c.idCategoria === "TECNICAS" && c.estado === true);
  console.log(capaTecnicas);
  if (tbodyCB) {
    tbodyCB.innerHTML = "";
    renderizarTabla(capaBlandas, tbodyCB);
  }
  if (tbodyCT) {
    tbodyCT.innerHTML = "";
    renderizarTabla(capaTecnicas, tbodyCT);
  }
  if (tbody_historial) {
    tbody_historial.innerHTML = "";
    renderizarTabla(capaHistorial, tbody_historial);
  }
}

function renderizarTabla(capacitaciones, tbody) {
  capacitaciones.forEach((capacitacion) => {

    let mostrarCampoExtra = capacitacion.estado === true;
    let campoTerminar = mostrarCampoExtra
    ? `<button class="btn btn-success btn-sm terminar-capacitacion" data-idR="${capacitacion.id_registro}">
          Terminar
        </button>`
    : "";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>CAP${capacitacion.id}</td>
      <td>${capacitacion.nombre}</td>
      <td>${capacitacion.descripcion}</td>
      <td>
        <button class="btn btn-info btn-sm ver-capacitacion"
          data-id="${capacitacion.id}"
          data-nombre="${capacitacion.nombre}"
          data-descripcion="${capacitacion.descripcion}"
          data-fechaInicio="${capacitacion.fechaInicio}"
          data-fechaFin="${capacitacion.fechaFin}"
          data-idCategoria="${capacitacion.idCategoria}"
          data-evidencia="${capacitacion.evidencia}"
          data-estado="${capacitacion.estado}"
          data-url="${capacitacion.url || ""}">
          Ver
        </button>
        ${campoTerminar}
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// Función para generar el modal dinámicamente
async function generarModal(capacitacion) {
  let mostrarCampoExtra = capacitacion.nombreCategoria === "TECNICAS";
  let mostrarCampoEvidencia = capacitacion.estado === false || capacitacion.estado === "false"

  // Mostrar el campo solo si es "TECNICAS"
  let campoExtra = mostrarCampoExtra
    ? `<div class="mb-3">
        <label class="form-label">Enlace Capacitación</label>
        <a href="${capacitacion.url}" target="_blank" class="form-control">
          ${capacitacion.url || "Ver capacitación"}
        </a>
      </div>`
    : "";

    let campoEvidencia = mostrarCampoEvidencia
    ? `<div class="mb-3">
        <label class="form-label">Evidencia</label>
        <p class="form-control">${capacitacion.evidencia || "No hay evidencia disponible"}</p>
      </div>`
    : "";

  console.log("Campo evidencia: ", campoEvidencia);
  console.log(mostrarCampoEvidencia)
  // Crea la estructura del modal
  let modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "modalInfo";
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "modalInfoLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalInfoLabel">Detalles de la Capacitación</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" id="nombreCapacitacion" class="form-control" value="${capacitacion.nombre}" readonly >
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea id="descripcionCapacitacion" class="form-control" rows="2" readonly >${capacitacion.descripcion}</textarea>
            </div>

            ${campoExtra}

            <div class="mb-3">
              <label class="form-label">Fecha de Inicio</label>
              <input type="date" id="fechaInicio" class="form-control" value="${capacitacion.fechaInicio}" readonly >
            </div>
            <div class="mb-3">
              <label class="form-label">Fecha de Fin</label>
              <input type="date" id="fechaFin" class="form-control" value="${capacitacion.fechaFin}" readonly >
            </div>

            ${campoEvidencia}

          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  // Agregar el modal al body
  document.body.appendChild(modal);

  // Mostrar el modal con Bootstrap
  let modalBootstrap = new bootstrap.Modal(modal);
  modalBootstrap.show();
}

async function ObtenerCategoriasCapacitaciones() {
  try {
    const response = await fetch(
      "/Administrador/Capacitaciones/CategoriasCapacitaciones"
    );
    if (!response.ok) {
      throw new Error("Error al obtener categorías");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Evento para abrir el modal cuando se haga clic en "Ver"
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("ver-capacitacion")) {
    const id = event.target.getAttribute("data-id");

    const nombre = event.target.getAttribute("data-nombre");
    const fechaInicio = event.target.getAttribute("data-fechaInicio");
    const fechaFin = event.target.getAttribute("data-fechaFin");
    const nombreCategoria = event.target.getAttribute("data-idCategoria");
    const url = event.target.getAttribute("data-url");
    const descripcion = event.target.getAttribute("data-descripcion");
    const evidencia = event.target.getAttribute("data-evidencia");  
    const estado = event.target.getAttribute("data-estado");  
    
    const capacitacion = {
      id,
      nombre,
      fechaInicio,
      fechaFin,
      nombreCategoria,
      url,
      descripcion,
      evidencia,
      estado,
    };
    generarModal(capacitacion);
  }
});

async function generarModalTerminar(idR) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  // Crea la estructura del modal
  let modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "modalInfo";
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "modalInfoLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalInfoLabel">Detalles de la Capacitación</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="TerminarCapacitacion/${idR}" enctype="multipart/form-data" method="post">
          <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
          <div class="mb-3">
            <label class="form-label">Certificado</label>
            <input type="file" id="archivo" name="archivo" class="form-control" accept=".pdf, image/jpeg, image/png, image/jpg">
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-success">Guardar</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

  // Agregar el modal al body
  document.body.appendChild(modal);

  // Mostrar el modal con Bootstrap
  let modalBootstrap = new bootstrap.Modal(modal);
  modalBootstrap.show();
}

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("terminar-capacitacion")) {
    const idR = event.target.getAttribute("data-idR");
    generarModalTerminar(idR);
  }
});



// Llamar a la función cuando la página se cargue
document.addEventListener("DOMContentLoaded", MostrarCapacitaciones);
