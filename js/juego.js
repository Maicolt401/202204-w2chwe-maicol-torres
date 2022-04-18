let canvas;
let ctx;

const fpsJuego = 20;
const fpsEditor = 60;
let fps = fpsJuego;

const canvasX = 500;
const canvasY = 500;
let color;
let tileX;
let tileY;

// Variable para el tablero junto con sus dimensiones
let tablero;
const filas = 100;
const columnas = 100;

const negro = "#000000";
const blanco = "#FFFFFF";
const rojo = "#FF0000";

let pausa = true;

//--------------------------------------------------
// PATRONES

const patron = [
  [
    [0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],

  [
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],

  [
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
    ],
    [
      0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  ],

  [
    [1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],

  [
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],

  [
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],

  [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
];

//--------------------------------------------------
// CADA CASILLA TENDRÁ UN AGENTE
// eslint-disable-next-line func-names
const Agente = function (y, x, vivo) {
  this.x = x;
  this.y = y;
  this.vivo = vivo; // vivo=1 / muerto=0

  this.estadoProx = this.vivo; // indica el estado que tendrá el agente en la siguiente generación

  this.vecinos = [];

  // LO USAMOS PARA CAMBIAR CON EL RATÓN EL AGENTE
  this.cambiaEstado = () => {
    if (this.vivo === true) this.vivo = false;
    else this.vivo = true;
  };

  this.pintaEstado = (est) => {
    this.vivo = est;
  };

  // Método que determina sus vecinos (se usa la primera vez, al crear el agente)
  this.addVecinos = () => {
    let xVecino;
    let yVecino;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        // Usamos el operador módulo para continuar por los márgenes opuestos al salirnos de la pantalla
        xVecino = (j + this.x + columnas) % columnas;
        yVecino = (i + this.y + filas) % filas;

        // siempre que no estemos en (0,0) ya que seríamos nosotros mismos
        if (i !== 0 || j !== 0) {
          this.vecinos.push(tablero[yVecino][xVecino]);
        }
      }
    }
  };

  // Método que calcula el estado siguiente en función de sus vecinos
  this.nuevoCiclo = () => {
    let suma = 0;

    for (let i = 0; i < this.vecinos.length; i++) {
      // Si el vecino está vivo, sumamos
      if (this.vecinos[i].vivo === 1) {
        suma++;
      }
    } // for

    //--------------------------------------
    // REGLAS PARA SABER EL PRÓXIMO VALOR

    // valor por defecto (se queda como estaba)
    this.estadoProx = this.vivo;

    // Reproducción: si la casilla está vacía (muerto) y hay justo 3 vecinos, se crea vida
    if (this.vivo === 0 && suma === 3) {
      this.estadoProx = 1;
    }

    // Muerte: si hay sobrepoblación (más de 3 vecinos) o se está aislado (menos de 2 vecinos) no se sobrevive
    if (this.vivo === 1 && (suma < 2 || suma > 3)) {
      this.estadoProx = 0;
    }
  };

  // Método para cambiar al ciclo siguiente
  this.mutacion = () => {
    this.vivo = this.estadoProx;
  };

  // Método que dibuja el agente en el tablero
  this.dibuja = () => {
    if (this.vivo === 1) color = blanco;
    else color = negro;

    ctx.fillStyle = color;
    ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
  };
};

// Función que crea un array 2D y devuelve el objeto
function creaArray2D(rows, cols) {
  const obj = new Array(rows);
  for (let y = 0; y < rows; y++) {
    obj[y] = new Array(cols);
  }
  return obj;
}

// Crea un agente para cada casilla del tablero
function inicializaTablero(obj, aleatorio) {
  let estado;

  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      if (aleatorio === true) estado = Math.floor(Math.random() * 2);
      else estado = 0;

      // eslint-disable-next-line no-param-reassign
      obj[y][x] = new Agente(y, x, estado);
    }
  }

  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].addVecinos();
    }
  }
}

function borraCanvas() {
  // eslint-disable-next-line no-self-assign
  canvas.width = canvas.width;
  // eslint-disable-next-line no-self-assign
  canvas.height = canvas.height;
}

// eslint-disable-next-line no-unused-vars
function inicia() {
  // eslint-disable-next-line no-undef
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = canvasX;
  canvas.height = canvasY;

  // RATÓN

  // eslint-disable-next-line no-use-before-define
  canvas.addEventListener("mousedown", clicRaton, false);
  // eslint-disable-next-line no-use-before-define
  canvas.addEventListener("mouseup", sueltaRaton, false);
  // eslint-disable-next-line no-use-before-define
  canvas.addEventListener("mousemove", posicionRaton, false);

  // LECTURA DEL TECLADO

  // eslint-disable-next-line no-undef
  document.addEventListener("keyup", (tecla) => {
    // ESPACIO = PAUSA
    if (tecla.keyCode === 32) {
      // eslint-disable-next-line no-use-before-define
      controlaPausa();
    }

    // R = REINICIAR VACÍO
    if (tecla.keyCode === 82) {
      inicializaTablero(tablero, false);
    }

    // T = REINICIAR ALEATORIO
    if (tecla.keyCode === 84) {
      inicializaTablero(tablero, true);
    }
  });

  // Calculamos el tamaño de los tiles para que sea proporcionado
  tileX = Math.floor(canvasX / filas);
  tileY = Math.floor(canvasY / columnas);

  // Creamos el tablero
  tablero = creaArray2D(filas, columnas);

  // Obj tablero, aleatorio
  inicializaTablero(tablero, false);

  setInterval(() => {
    // eslint-disable-next-line no-use-before-define
    principal();
  }, 1000 / fps);
}

let ratonX = 0;
let ratonY = 0;

function clicRaton() {}

function sueltaRaton() {
  // eslint-disable-next-line no-use-before-define
  cambiaRaton();
}

function posicionRaton(e) {
  ratonX = e.pageX;
  ratonY = e.pageY;
}

//----------------------------------------------------------

function cambiaRaton() {
  // tablero[posY][posX].cambiaEstado();
  const figura = 2;
  let valor;

  for (let py = 0; py < 9; py++) {
    for (let px = 0; px < 38; px++) {
      valor = patron[figura][py][px];
      // eslint-disable-next-line no-use-before-define
      tablero[posY - 1 + py][posX - 1 + px].pintaEstado(valor);
    }
  }
}
//----------------------------------------------------------

let posX;
let posY;

function dibujaTablero(obj) {
  // DIBUJAMOS
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].dibuja();
    }
  }

  if (pausa === false) {
    // eslint-disable-next-line no-use-before-define
    siguiente(obj);
  }

  // dibujamos el puntero del ratón
  if (pausa === true) {
    posX = Math.floor(ratonX / tileX) - 1;
    posY = Math.floor(ratonY / tileY) - 1;

    ctx.fillStyle = rojo;
    ctx.fillRect(posX * tileX, posY * tileY, tileX, tileY);
  }
}

let controlaPausa = () => {
  if (pausa === true) {
    pausa = false;
    fps = fpsJuego;
  } else {
    pausa = true;
    fps = fpsEditor;
  }
};

// CALCULAMOS EL SIGUIENTE CICLO
let siguiente = (obj) => {
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].nuevoCiclo();
    }
  }

  // APLICAMOS LOS DATOS DEL CICLO NUEVO (Actualizamos)
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].mutacion();
    }
  }
};

let principal = () => {
  borraCanvas();
  dibujaTablero(tablero);
};
