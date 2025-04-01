const tbodyCB = document.getElementById("tbody_blandas");
const tbodyCT = document.getElementById("tbody_tecnicas");

async function ObtenerCapacitacionesBlandas() {
  try {
    const response = await fetch("Capacitaciones/ListadoCapacitacionesBlandas");
    if (!response.ok) {
      throw new Error("Error al obtener capacitaciones");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function ObtenerCapacitacionesTecnicas() {
  try {
    const response = await fetch(
      "Capacitaciones/ListadoCapacitacionesTecnicas"
    );
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
  if (tbodyCB) {
    tbodyCB.innerHTML = "";
    const capacitacionesBlandas = await ObtenerCapacitacionesBlandas();
    renderizarTabla(capacitacionesBlandas, tbodyCB);
  }

  if (tbodyCT) {
    tbodyCT.innerHTML = "";
    const capacitacionesTecnicas = await ObtenerCapacitacionesTecnicas();
    renderizarTabla(capacitacionesTecnicas, tbodyCT);
  }
}

function renderizarTabla(capacitaciones, tbody) {
  capacitaciones.forEach((capacitacion) => {
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
          data-idCategoria="${capacitacion.idCategoria_id}"
          data-url="${capacitacion.url || ""}">
          Ver
        </button>
        <button class="btn btn-danger btn-sm eliminar-capacitacion" 
          data-id="${capacitacion.id}">
          Eliminar
        </button>
        <a href="Capacitaciones/RegistrosCapacitaciones/${capacitacion.id}" class="btn btn-warning btn-sm">Registros</a>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// Función para generar el modal dinámicamente
async function generarModal(capacitacion) {
  // Obtener todas las categorías
  const categorias = await ObtenerCategoriasCapacitaciones();

  // Elimina cualquier modal anterior para evitar duplicados
  let modalExistente = document.getElementById("modalInfo");
  if (modalExistente) {
    modalExistente.remove();
  }

  // Crear las opciones del select
  let opcionesCategoria = categorias
    .map((cat) => {
      let selected = cat.nombre === capacitacion.Categoria ? "selected" : "";
      return `<option value="${cat.id}" ${selected}>${cat.nombre}</option>`;
    })
    .join("");

  // Campo adicional si la categoría es "Asignado"
  let mostrarCampoExtra = capacitacion.Categoria === "TECNICAS";
  let campoExtra = `
      <div id="campoExtra" class="mb-3" ${
        !mostrarCampoExtra ? 'style="display:none;"' : ""
      }>
        <label class="form-label">Url Capacitación</label>
        <input type="text" id="urlCapacitacion" class="form-control" value="${
          capacitacion.url || ""
        }">
      </div>
    `;

  // Crea la estructura del modal
  let modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "modalInfo";
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "modalInfoLabel");
  modal.setAttribute("aria-hidden", "true");
  console.log(capacitacion);
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
              <input type="text" id="nombreCapacitacion" class="form-control" value="${capacitacion.nombre}">
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea id="descripcionCapacitacion" class="form-control" rows="2">${capacitacion.descripcion}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <select id="categoriaSelect" class="form-control">${opcionesCategoria}</select>
            </div>

            ${campoExtra}

            <div class="mb-3">
              <label class="form-label">Fecha de Inicio</label>
              <input type="date" id="fechaInicio" class="form-control" value="${capacitacion.fechaInicio}">
            </div>
            <div class="mb-3">
              <label class="form-label">Fecha de Fin</label>
              <input type="date" id="fechaFin" class="form-control" value="${capacitacion.fechaFin}">
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn btn-info btn-sm actualizar-capacitacion"
            data-id="${capacitacion.id}">
            Actualizar
          </button>
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

  const categoriaSelect = document.getElementById("categoriaSelect");
  const campoExtraDiv = document.getElementById("campoExtra");

  categoriaSelect.addEventListener("change", () => {
    const categoriaSeleccionada =
      categoriaSelect.options[categoriaSelect.selectedIndex].text;
    if (categoriaSeleccionada === "TECNICAS") {
      campoExtraDiv.style.display = "block";
    } else {
      campoExtraDiv.style.display = "none";
    }
  });
}

async function ObtenerCategoriasCapacitaciones() {
  try {
    const response = await fetch("Capacitaciones/CategoriasCapacitaciones");
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
  if (event.target.classList.contains("actualizar-capacitacion")) {
    const id = event.target.getAttribute("data-id");
    const datosActualizados = {
      nombre: document.getElementById("nombreCapacitacion").value,
      descripcion: document.getElementById("descripcionCapacitacion").value,
      fechaInicio: document.getElementById("fechaInicio").value,
      fechaFin: document.getElementById("fechaFin").value,
      idCategoria: categoriaSelect.value,
      url: document.getElementById("urlCapacitacion").value,
    };
    await ActualizarCapacitacion(id, datosActualizados);
  }
  if (event.target.classList.contains("eliminar-capacitacion")) {
    const id = event.target.getAttribute("data-id");
    await EliminarCapacitacion(id);
  }
  if (event.target.classList.contains("ver-capacitacion")) {
    const id = event.target.getAttribute("data-id");

    const nombre = event.target.getAttribute("data-nombre");
    const fechaInicio = event.target.getAttribute("data-fechaInicio");
    const fechaFin = event.target.getAttribute("data-fechaFin");
    const nombreCategoria = event.target.getAttribute("data-idCategoria");
    const url = event.target.getAttribute("data-url");
    const descripcion = event.target.getAttribute("data-descripcion");

    // Obtener todas las categorías
    const categorias = await ObtenerCategoriasCapacitaciones();

    // Buscar la categoría por nombre o devolver "Desconocida"
    const categoriaEncontrada = categorias.find(
      (cat) => cat.id == nombreCategoria
    );
    const categoriaFinal = categoriaEncontrada
      ? categoriaEncontrada.nombre
      : "Desconocida";
    const capacitacion = {
      id,
      nombre,
      fechaInicio,
      fechaFin,
      Categoria: categoriaFinal,
      url,
      descripcion,
    };
    generarModal(capacitacion);
  }
});

//agregar capacitacion propios
document.addEventListener("DOMContentLoaded", function () {
  const FormACB = document.getElementById("FormACB");

  if (FormACB) {
    FormACB.addEventListener("submit", async function (event) {
      event.preventDefault();

      const nombre = document.getElementById("nombreACB").value.trim();
      const descripcion = document
        .getElementById("descripcionACB")
        .value.trim();
      const fechaInicio = document.getElementById("fechaInicioACB").value;
      const fechaFin = document.getElementById("fechaFinACB").value;

      if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
        alert("Todos los datos son requeridos");
        return;
      }

      // Crear el objeto con los datos
      const datos = {
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
      };

      const csrftoken = document.querySelector(
        "[name=csrfmiddlewaretoken]"
      ).value;

      try {
        // Enviar datos con fetch
        const respuesta = await fetch(
          "Capacitaciones/AgregarCapacitacionBlanda",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(datos),
          }
        );

        const resultado = await respuesta.json();

        if (resultado.status === "success") {
          FormACB.reset();
          let modal = bootstrap.Modal.getInstance(
            document.getElementById("modalAgregarBlandas")
          );
          modal.hide();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        alert("Error al enviar la solicitud.");
        console.error("Error:", error);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const FormACT = document.getElementById("FormACT");

  if (FormACT) {
    FormACT.addEventListener("submit", async function (event) {
      event.preventDefault();

      const nombre = document.getElementById("nombreACT").value.trim();
      const descripcion = document
        .getElementById("descripcionACT")
        .value.trim();
      const fechaInicio = document.getElementById("fechaInicioACT").value;
      const fechaFin = document.getElementById("fechaFinACT").value;
      const urlACT = document.getElementById("urlACT").value;

      if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
        alert("Todos los datos son requeridos");
        return;
      }

      // Crear el objeto con los datos
      const datos = {
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
        urlACT
      };

      const csrftoken = document.querySelector(
        "[name=csrfmiddlewaretoken]"
      ).value;

      try {
        // Enviar datos con fetch
        const respuesta = await fetch(
          "Capacitaciones/AgregarCapacitacionTecnica",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(datos),
          }
        );

        const resultado = await respuesta.json();

        if (resultado.status === "success") {
          FormACT.reset();
          let modal = bootstrap.Modal.getInstance(
            document.getElementById("modalAgregarTecnicas")
          );
          modal.hide();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        alert("Error al enviar la solicitud.");
        console.error("Error:", error);
      }
    });
  }
});

// Función para actualizar una capacitación
async function ActualizarCapacitacion(id, datos) {
  if (!confirm("¿Estás seguro de actualizar esta capacitación?")) return;

  try {
    const csrftoken = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;

    const respuesta = await fetch(
      `Capacitaciones/ActualizarCapacitacion/${id}`,
      {
        method: "PUT", // Usamos el método PUT para actualizar
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(datos),
      }
    );

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      alert("Capacitación actualizada exitosamente.");
      MostrarCapacitaciones(); // Refrescar las tablas
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert(resultado.message || "Error al actualizar la capacitación.");
    }
  } catch (error) {
    console.error("Error en la actualización:", error);
    alert("Hubo un error al actualizar la capacitación.");
  }
}

async function EliminarCapacitacion(id) {
  if (!confirm("¿Estás seguro de eliminar esta capacitación?")) return;

  try {
    const csrftoken = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;

    const respuesta = await fetch(
      `Capacitaciones/ElimininarCapacitacion/${id}`,
      {
        method: "DELETE",
        headers: { "X-CSRFToken": csrftoken },
      }
    );

    if (respuesta.ok) {
      alert("Capacitación eliminada exitosamente.");
      MostrarCapacitaciones();
    } else {
      alert("Error al eliminar la capacitación.");
    }
  } catch (error) {
    console.error("Error en la eliminación:", error);
  }
}

// Llamar a la función cuando la página se cargue
document.addEventListener("DOMContentLoaded", MostrarCapacitaciones);
