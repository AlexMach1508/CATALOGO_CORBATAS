// ====================
// CONFIGURACIÓN INICIAL
// ====================
const colores = [
  { nombre: "Azul", hex: "#0056d2" },
  { nombre: "Gris", hex: "#888888" },
  { nombre: "Rojo", hex: "#b93131" },
  { nombre: "Corinto", hex: "#5e2129"},
  { nombre: "Cafe", hex: "#462620ff"},
  { nombre: "Verde", hex: "#054905ff" },
  { nombre: "Negro", hex: "#202020" },
  { nombre: "Amarillo", hex: "#ffe05c "},
  { nombre: "Blanco", hex: "#eeeeeeff"}
  
];

const bordados = [
    {
        categoria: "Templo de Guatemala",
        items: [
            { nombre: "Guatemala", archivo: "Guatemala.png", size: 100 },
            { nombre: "Guatemala_D", archivo: "Guatemala_D.png", size: 100 },
            { nombre: "Guatemala_G", archivo: "Guatemala_G.png", size: 100 },
            { nombre: "Guatemala_B", archivo: "Guatemala_B.png", size: 100 }
        ]
    },
    {
        categoria: "Templo de Miraflores",
        items: [
            { nombre: "Miraflores", archivo: "Miraflores.png", size: 100 },
            { nombre: "Miraflores_D", archivo: "Miraflores_D.png", size: 100 },
            { nombre: "Miraflores_G", archivo: "Miraflores_G.png", size: 100 },
            { nombre: "Miraflores_B", archivo: "Miraflores_B.png", size: 100 }
        ]
    },
    {
        categoria: "Otros Diseños",
        items: [
            { nombre: "Family_search", archivo: "Family_search.png", size: 60 },
            { nombre: "HLJ", archivo: "HLJ.png", size: 80 },
            { nombre: "Jesus", archivo: "Jesus.png", size: 80 },
            { nombre: "Moroni", archivo: "Moroni.png", size: 60 }
        ]
    }
];

const colorOptions = document.getElementById("color-options");
const bordadoOptions = document.getElementById("bordado-options");
const bordadoPreview = document.getElementById("bordado-preview");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("corbata-canvas");
const ctx = canvas.getContext("2d");
const imgBase = new Image();
imgBase.src = "img/corbata.png";

// Controles
const btnAumentar = document.getElementById("btn-aumentar");
const btnDisminuir = document.getElementById("btn-disminuir");
const btnReset = document.getElementById("btn-reset");

let colorSeleccionado = colores[0];
let bordadoSeleccionado = bordados[0];

// ====================
// GENERAR OPCIONES
// ====================
function generarOpciones() {
  // Colores
  colores.forEach(c => {
    const div = document.createElement("div");
    div.className = "color-option";
    div.style.backgroundColor = c.hex;
    div.title = c.nombre;
    div.addEventListener("click", () => seleccionarColor(c, div));
    colorOptions.appendChild(div);
  });
  colorOptions.querySelector("div").classList.add("selected");

  // Bordados agrupados por categoría
  bordados.forEach(grupo => {
    const categoriaDiv = document.createElement("div");
    categoriaDiv.className = "categoria-bordado";

    const titulo = document.createElement("p");
    titulo.textContent = grupo.categoria;
    categoriaDiv.appendChild(titulo);

    const contenedorImgs = document.createElement("div");
    contenedorImgs.className = "grupo-bordados";

    grupo.items.forEach(b => {
      const img = document.createElement("img");
      img.src = `img/bordados/${b.archivo}`;
      img.alt = b.nombre;
      img.title = b.nombre;
      img.addEventListener("click", () => seleccionarBordado(b, img));
      contenedorImgs.appendChild(img);
    });

    categoriaDiv.appendChild(contenedorImgs);
    bordadoOptions.appendChild(categoriaDiv);
  });

  // Seleccionar el primero por defecto
  const primeraImg = bordadoOptions.querySelector("img");
  if (primeraImg) primeraImg.classList.add("selected");
}

// ====================
// COLOR
// ====================
function seleccionarColor(c, elemento) {
  colorOptions.querySelectorAll(".color-option").forEach(e => e.classList.remove("selected"));
  elemento.classList.add("selected");
  colorSeleccionado = c;
  recolorearCorbata(c.hex);
  actualizarResultado();
}

// ====================
// BORDADO
// ====================
function seleccionarBordado(b, elemento) {
  bordadoOptions.querySelectorAll("img").forEach(e => e.classList.remove("selected"));
  elemento.classList.add("selected");
  bordadoSeleccionado = b;
  bordadoPreview.src = `img/bordados/${b.archivo}`;

  // Reiniciar posición y aplicar tamaño inicial del bordado
  offsetX = 0;
  offsetY = 0;
  scale = b.size / 100; // tamaño inicial relativo
  updateTransform();
  actualizarResultado();
}

// ====================
// CANVAS (recolorear)
// ====================
function recolorearCorbata(colorHex) {
  const img = imgBase;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

// ====================
// MOVER Y ESCALAR BORDADO
// ====================
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let isDragging = false;
let startX, startY;

function updateTransform() {
  bordadoPreview.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

bordadoPreview.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

window.addEventListener("mousemove", e => {
  if (!isDragging) return;
  offsetX = e.clientX - startX;
  offsetY = e.clientY - startY;
  updateTransform();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// Soporte táctil
bordadoPreview.addEventListener("touchstart", e => {
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX - offsetX;
  startY = touch.clientY - offsetY;
});

bordadoPreview.addEventListener("touchmove", e => {
  if (!isDragging) return;
  const touch = e.touches[0];
  offsetX = touch.clientX - startX;
  offsetY = touch.clientY - startY;
  updateTransform();
});

bordadoPreview.addEventListener("touchend", () => {
  isDragging = false;
});

// ====================
// CONTROLES DE ESCALA
// ====================
btnAumentar.addEventListener("click", () => {
  scale += 0.1;
  updateTransform();
});

btnDisminuir.addEventListener("click", () => {
  scale = Math.max(0.1, scale - 0.1);
  updateTransform();
});

btnReset.addEventListener("click", () => {
  offsetX = 0;
  offsetY = 0;
  scale = bordadoSeleccionado.size / 100; // restaurar tamaño inicial del bordado actual
  updateTransform();
});

// ====================
// RESULTADO
// ====================
function actualizarResultado() {
  resultado.textContent = `${colorSeleccionado.nombre} - ${bordadoSeleccionado.nombre}`;
}

// ====================
// INICIALIZAR
// ====================
imgBase.onload = () => {
  generarOpciones();
  recolorearCorbata(colorSeleccionado.hex);
  updateTransform();
};
