const url = window.location.href.split("/");
const idCapa = url.at(-1) || url[url.length - 1];
const tbodyR = document.getElementById("tbody_registro");
const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

async function ObtenerRegistrosCapa() {
  try {
    const response = await fetch(
      `/Administrador/Capacitaciones/ListadoRegistrosCapa/${idCapa}`
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

async function EliminarRegistro(id) {
  try {
    const respuesta = await fetch(
      `/Administrador/Capacitaciones/ElimininarRegistro/${id}`,
      {
        method: "DELETE",
        headers: { "X-CSRFToken": csrfToken },
      }
    );
    return true;
  } catch (error) {
    console.error("Error en la eliminación:", error);
  }
}

async function AgregarRegistro(datos) {
  try {
    const respuesta = await fetch(`/Administrador/Capacitaciones/AgregarRegistro/${idCapa}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error en la eliminación:", error);
  }
}

async function MostrarRegistros() {
  const registros = await ObtenerRegistrosCapa();
  renderizarTabla(registros, tbodyR);
  console.log(registros);
}

function renderizarTabla(registros, tbody) {
  registros.forEach((registro) => {
    const estado = registro.estado === false ? "CUMPLIDO" : "NO CUMPLIDO";
    const evidencia = registro.evidencia === null ? "NA" : registro.evidencia;
    console.log(evidencia);
    // const evidencia = registro.evidencia
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>REG${registro.idRegistro}</td>
      <td>${registro.usuario}</td>
      <td>${estado}</td>
      <td>${evidencia}</td>
      <td>
        <button class="btn btn-danger btn-sm eliminar-registro"
        data-id="${registro.idRegistro}">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("eliminar-registro")) {
    event.preventDefault();

    const id = event.target.getAttribute("data-id");

    const confirmacion = confirm("Estas seguro de eliminar este registro?");

    if (!confirmacion) return;

    try {
      await EliminarRegistro(id);
      alert("Registro Eliminado");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const FormAR = document.getElementById("FormAR");

  if (FormAR) {
    FormAR.addEventListener("submit", async function (event) {
      event.preventDefault();
      const usuario = document.getElementById("usuarioAR").value.trim();
      if (!usuario) {
        alert("Todos los datos son requeridos");
        return;
      }
      const datos = {
        usuario
      };
      const confirmacion = confirm("Estas seguro de agregar este registro?");

      if (!confirmacion) return;

      try {
        result = await AgregarRegistro(datos);

        if (result['status'] === 'error') {
          alert(result['message']);
          return;
        }

        alert(result['message']);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.log("Error: ", error);
      }
    });
  }
  if (tbodyR) {
    try {
      await MostrarRegistros();
    } catch (error) {
      console.error("Error al cargar registros:", error);
    }
  }
});

