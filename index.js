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

window.modificarParticipante = modificarParticipante;
window.eliminarParticipante = eliminarParticipante;

/* Inscripciones */ 
    /*const cuerpo = document.getElementById("cuerpoInscripciones");

    participantes = JSON.parse(localStorage.getItem("participantes")) || [];

    function crearSelectParticipantes(nombreCampo) {
      const select = document.createElement("select");
      select.name = nombreCampo;
      participantes.forEach(p => {
        const option = document.createElement("option");
        option.value = p[nombreCampo];
        option.textContent = p[nombreCampo];
        select.appendChild(option);
      });
      return select;
    }

    function agregarFila() {
      const tr = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.appendChild(crearSelectParticipantes("nombre"));

      const tdApellido = document.createElement("td");
      tdApellido.appendChild(crearSelectParticipantes("apellido"));

      const tdEstablecimiento = document.createElement("td");
      const inputEst = document.createElement("input");
      inputEst.type = "text";
      tdEstablecimiento.appendChild(inputEst);

      const tdPrueba = document.createElement("td");
      const inputPrueba = document.createElement("input");
      inputPrueba.type = "text";
      tdPrueba.appendChild(inputPrueba);

      const tdDebutante = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      tdDebutante.style.textAlign = "center";
      tdDebutante.appendChild(checkbox);

      const tdAcciones = document.createElement("td");
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑️";
      btnEliminar.onclick = () => tr.remove();
      tdAcciones.appendChild(btnEliminar);

      tr.append(tdNombre, tdApellido, tdEstablecimiento, tdPrueba, tdDebutante, tdAcciones);
      cuerpo.appendChild(tr);
    }

    function descargarInscripciones() {
      const filas = cuerpo.querySelectorAll("tr");
      if (filas.length === 0) {
        Swal.fire("Atención", "No hay inscripciones para descargar.", "info");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      let y = 10;
      doc.setFontSize(12);

      filas.forEach((fila, i) => {
        const cells = fila.querySelectorAll("td");
        const nombre = cells[0].querySelector("select").value;
        const apellido = cells[1].querySelector("select").value;
        const establecimiento = cells[2].querySelector("input").value;
        const prueba = cells[3].querySelector("input").value;
        const debutante = cells[4].querySelector("input").checked ? "Sí" : "No";

        doc.text(`Nombre: ${nombre}`, 10, y);
        doc.text(`Apellido: ${apellido}`, 10, y + 6);
        doc.text(`Establecimiento: ${establecimiento}`, 10, y + 12);
        doc.text(`Prueba: ${prueba}`, 10, y + 18);
        doc.text(`Debutante: ${debutante}`, 10, y + 24);
        y += 36;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });

      doc.save("inscripciones.pdf");
    }

    // Cargar al menos una fila al abrir la página
    document.addEventListener("DOMContentLoaded", () => {
      if (participantes.length === 0) {
        Swal.fire("Sin participantes", "Agregá participantes antes de inscribir.", "warning");
      } else {
        agregarFila();
      }
    });*/
 
  const cuerpo = document.getElementById("cuerpoInscripciones");
    
  participantes = JSON.parse(localStorage.getItem("participantes")) || [];

  const establecimientosUnicos = [...new Set(participantes.map(p => p.establecimiento))];

  function crearSelectNombre(onChangeCallback) {
    const select = document.createElement("select");
    select.name = "nombre";
    select.style.width = "100%";

    const nombresUnicos = [...new Set(participantes.map(p => p.nombre))];
    nombresUnicos.forEach(nombre => {
      const option = document.createElement("option");
      option.value = nombre;
      option.textContent = nombre;
      select.appendChild(option);
    });

    if (onChangeCallback) {
      select.addEventListener("change", onChangeCallback);
    }

    return select;
  }

  function crearSelectApellido(nombreSeleccionado) {
    const select = document.createElement("select");
    select.name = "apellido";
    select.style.width = "100%";

    const apellidos = participantes
      .filter(p => p.nombre === nombreSeleccionado)
      .map(p => p.apellido);

    apellidos.forEach(apellido => {
      const option = document.createElement("option");
      option.value = apellido;
      option.textContent = apellido;
      select.appendChild(option);
    });

    return select;
  }

  function crearSelectEstablecimientos() {
    const select = document.createElement("select");
    select.style.width = "100%";

    establecimientosUnicos.forEach(est => {
      const option = document.createElement("option");
      option.value = est;
      option.textContent = est;
      select.appendChild(option);
    });

    return select;
  }

  function crearSelectPruebas() {
    const select = document.createElement("select");
    select.style.width = "100%";

    const categoriasPrueba = [
      "-- Seleccionar prueba --",
      "Manejo", "0.40 cm", "0.50 cm", "0.60 cm", "0.70 cm",
      "0.80 cm", "0.90 cm", "1.00 mt", "1.10 mt", "1.20 mt", "1.30 mt"
    ];

    categoriasPrueba.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat === "-- Seleccionar prueba --" ? "" : cat;
      option.textContent = cat;
      select.appendChild(option);
    });

    return select;
  }

  function agregarFila() {
    const tr = document.createElement("tr");

    // Nombre
    const tdNombre = document.createElement("td");
    const selectNombre = crearSelectNombre(actualizarApellido);
    tdNombre.appendChild(selectNombre);

    // Apellido
    const tdApellido = document.createElement("td");
    let selectApellido = crearSelectApellido(selectNombre.value);
    tdApellido.appendChild(selectApellido);

    // Establecimiento
    const tdEstablecimiento = document.createElement("td");
    const selectEst = crearSelectEstablecimientos();
    tdEstablecimiento.appendChild(selectEst);

    // Prueba
    const tdPrueba = document.createElement("td");
    const selectPrueba = crearSelectPruebas();
    tdPrueba.appendChild(selectPrueba);

    // Debutante
    const tdDebutante = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.transform = "scale(1.2)";
    tdDebutante.style.textAlign = "center";
    tdDebutante.appendChild(checkbox);

    // Acciones
    const tdAcciones = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.onclick = () => tr.remove();
    tdAcciones.appendChild(btnEliminar);

    function actualizarApellido() {
      const nuevoSelectApellido = crearSelectApellido(selectNombre.value);
      tdApellido.innerHTML = "";
      tdApellido.appendChild(nuevoSelectApellido);
    }

    tr.append(tdNombre, tdApellido, tdEstablecimiento, tdPrueba, tdDebutante, tdAcciones);
    cuerpo.appendChild(tr);
  }

  function descargarInscripciones() {
    const filas = cuerpo.querySelectorAll("tr");
    if (filas.length === 0) {
      Swal.fire("Atención", "No hay inscripciones para descargar.", "info");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);

    for (let i = 0; i < filas.length; i++) {
      const cells = filas[i].querySelectorAll("td");
      const nombre = cells[0].querySelector("select")?.value;
      const apellido = cells[1].querySelector("select")?.value;
      const establecimiento = cells[2].querySelector("select")?.value;
      const prueba = cells[3].querySelector("select")?.value;
      const debutante = cells[4].querySelector("input").checked ? "Sí" : "No";

      if (!nombre || !apellido || !establecimiento || !prueba) {
        Swal.fire("Falta información", `Completá todos los campos en la fila ${i + 1}.`, "error");
        return;
      }

      doc.text(`Nombre: ${nombre}`, 10, y);
      doc.text(`Apellido: ${apellido}`, 10, y + 6);
      doc.text(`Establecimiento: ${establecimiento}`, 10, y + 12);
      doc.text(`Prueba: ${prueba}`, 10, y + 18);
      doc.text(`Debutante: ${debutante}`, 10, y + 24);
      y += 36;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    }

    doc.save("inscripciones.pdf");
  }

  // Al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    if (participantes.length === 0) {
      Swal.fire("Sin participantes", "Agregá participantes antes de inscribir.", "warning");
    } else {
      agregarFila();
    }
  });
