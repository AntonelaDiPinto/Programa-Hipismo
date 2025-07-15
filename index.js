// Mostrar/Ocultar Menú Hamburguesa
document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btnMenu");
  const menuDesplegable = document.getElementById("menuDesplegable");

  if (btnMenu) {
    btnMenu.addEventListener("click", (e) => {
      e.preventDefault();
      menuDesplegable.classList.toggle("mostrar");
    });
  }

  cargarCarrusel();
});

// Carrusel de Logos 
const logosCarrusel = [
  {
    nombre: "Club Atlético Estudiantes",
    imagen: "../Imagenes/Logo Club Estudiantes Olavarría.png"
  },
  {
    nombre: "Hipismo - C.A.E. Olavarría",
    imagen: "../Imagenes/Logo Hipismo CAE.jpg"
  }
];

let indiceInicio = 0;
let logoSeleccionado = "";

function cargarCarrusel() {
  const carrusel = document.getElementById("carruselLogos");
  const btnAtras = document.getElementById("btnAtras");
  const btnAdelante = document.getElementById("btnAdelante");

  carrusel.innerHTML = "";

  const visibles = [];
  for (let i = 0; i < Math.min(3, logosCarrusel.length); i++) {
    const index = (indiceInicio + i) % logosCarrusel.length;
    visibles.push(logosCarrusel[index]);
  }

  visibles.forEach((logo, index) => {
    const div = document.createElement("div");
    div.className = "logo-card";
    if (index === 1) div.classList.add("seleccionada");

    div.innerHTML = `
      <img src="${logo.imagen}" alt="${logo.nombre}" />
      <p class="logo-nombre">${logo.nombre}</p>
    `;
    carrusel.appendChild(div);
  });

  if (visibles[1]) logoSeleccionado = visibles[1].nombre;

  const hayMasDeUno = logosCarrusel.length > 1;
  btnAtras.style.display = hayMasDeUno ? "block" : "none";
  btnAdelante.style.display = hayMasDeUno ? "block" : "none";
}

window.moverCarrusel = function (direccion) {
  indiceInicio = (indiceInicio + direccion + logosCarrusel.length) % logosCarrusel.length;
  cargarCarrusel();
};

/* Participantes */

// Recuperar participantes del localStorage
let participantes = JSON.parse(localStorage.getItem("participantes")) || [];

// Referencias a elementos del DOM (se asignarán en el DOMContentLoaded)
let btnAgregar, tablaBody, encabezado;

document.addEventListener("DOMContentLoaded", () => {
  btnAgregar = document.getElementById("agregar");
  tablaBody = document.getElementById("participantesLista");
  encabezado = document.getElementById("encabezadoParticipantes");

  // Si estamos en la página de Participantes.html
  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const documento = document.getElementById("documento").value.trim();
      const edad = document.getElementById("edad").value.trim();
      const establecimiento = document.getElementById("establecimiento").value.trim();

      if (!nombre || !apellido || !documento || !edad || !establecimiento) {
        Swal.fire("Error", "Por favor completá todos los campos obligatorios.", "warning");
        return;
      }

      const participante = { nombre, apellido, documento, edad, establecimiento };
      participantes.push(participante);
      localStorage.setItem("participantes", JSON.stringify(participantes));
      limpiarFormulario();
      Swal.fire("Éxito", "Participante agregado correctamente.", "success");
    });
  }

  // Si estamos en la página ListadoParticipantes.html
  if (tablaBody && encabezado) {
    renderizarTabla();
  }
});

// Renderiza la tabla de participantes
function renderizarTabla() {
  encabezado.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>Apellido</th>
      <th>DNI</th>
      <th>Edad</th>
      <th>Establecimiento</th>
      <th>Acciones</th>
    </tr>`;

  tablaBody.innerHTML = participantes.map((p, index) => `
    <tr>
      <td style="text-align:center">${p.nombre}</td>
      <td style="text-align:center">${p.apellido}</td>
      <td style="text-align:center">${p.documento}</td>
      <td style="text-align:center">${p.edad}</td>
      <td style="text-align:center">${p.establecimiento}</td>
      <td style="text-align:center">
        <button onclick="modificarParticipante(${index})">✏️</button>
        <button onclick="eliminarParticipante(${index})">🗑️</button>
      </td>
    </tr>`).join("");
}

// Limpia el formulario luego de agregar
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("documento").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("establecimiento").value = "";
}

// Modifica un participante usando SweetAlert
function modificarParticipante(index) {
  const p = participantes[index];
  Swal.fire({
    title: "Modificar participante",
    html:
      `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${p.nombre}">` +
      `<input id="swal-apellido" class="swal2-input" placeholder="Apellido" value="${p.apellido}">` +
      `<input id="swal-documento" class="swal2-input" placeholder="Documento" value="${p.documento}">` +
      `<input id="swal-edad" class="swal2-input" placeholder="Edad" value="${p.edad}">` +
      `<input id="swal-establecimiento" class="swal2-input" placeholder="Establecimiento" value="${p.establecimiento}">`,
    focusConfirm: false,
    preConfirm: () => {
      const nombre = document.getElementById("swal-nombre").value;
      const apellido = document.getElementById("swal-apellido").value;
      const documento = document.getElementById("swal-documento").value;
      const edad = document.getElementById("swal-edad").value;
      const establecimiento = document.getElementById("swal-establecimiento").value;

      if (!nombre || !apellido || !documento || !edad || !establecimiento) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      participantes[index] = { nombre, apellido, documento, edad, establecimiento };
      localStorage.setItem("participantes", JSON.stringify(participantes));
      renderizarTabla();
    }
  });
}

// Elimina un participante
function eliminarParticipante(index) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esto eliminará el participante de forma permanente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      participantes.splice(index, 1);
      localStorage.setItem("participantes", JSON.stringify(participantes));
      renderizarTabla();
      Swal.fire("Eliminado", "El participante fue eliminado.", "success");
    }
  });
}

// Descarga el listado en TXT o PDF
function descargarListado(tipo) {
  if (participantes.length === 0) {
    Swal.fire("Atención", "No hay participantes para descargar.", "info");
    return;
  }

  if (tipo === "txt") {
    const contenido = participantes.map(p => `Nombre: ${p.nombre}\nApellido: ${p.apellido}\nDNI: ${p.documento}\nEdad: ${p.edad}\nEstablecimiento: ${p.establecimiento}\n---`).join("\n");
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "participantes.txt";
    link.click();
  } else if (tipo === "pdf") {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);

    participantes.forEach((p, index) => {
      doc.text(`Nombre: ${p.nombre}`, 10, y);
      doc.text(`Apellido: ${p.apellido}`, 10, y + 6);
      doc.text(`DNI: ${p.documento}`, 10, y + 12);
      doc.text(`Edad: ${p.edad}`, 10, y + 18);
      doc.text(`Establecimiento: ${p.establecimiento}`, 10, y + 24);
      y += 36;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("participantes.pdf");
  }
}

