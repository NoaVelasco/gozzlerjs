const mapa = document.querySelector("#mapa");
const o = "img/pared.jpg";
const x = "img/meta.jpg";
const w = "img/player.jpg";
const _ = "img/suelo.jpg";

function pintaCeldas(celda) {
  return `<img src="${celda}" />`;
}
let matriz = [
  [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
  [o, _, _, _, _, _, _, _, _, _, _, _, _, x, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, o, o, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, _, _, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, _, _, _, o],
  [o, _, o, o, o, o, o, o, o, o, o, _, _, _, o],
  [o, w, _, _, _, _, _, _, _, _, _, _, o, o, o],
  [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
];

function pintarMapa() {
  mapa.childNodes.forEach((celda) => celda.remove());
  for (const filas of matriz) {
    for (const celda of filas) {
      let casilla = document.createElement("div");
      casilla.innerHTML = pintaCeldas(celda);
      mapa.appendChild(casilla);
    }
  }
}

let movimientos = ["r", "u", "r", "d", "d", "l", "r", "u"];

let bloqueado = false;
let playerXY = [14, 1];
let nextGrid = playerXY;
let direccion = [];
let metaCondicion = false;

let infoRotulo = document.querySelector("#info");

function mover(tecla) {
  bloqueado = true;
  let botonPresionado = tecla.key;

  // while (comprobacion(botonPresionado) != o && !metaCondicion) {
  if (comprobacion(botonPresionado) != o && !metaCondicion) {
    console.log(matriz);
    setTimeout(() => {
      if ((matriz[nextGrid[0]][nextGrid[1]] = x)) {
        metaCondicion = true;
      }
      matriz[playerXY[0]][playerXY[1]] = _;
      matriz[nextGrid[0]][nextGrid[1]] = w;
      playerXY = nextGrid;

      if (metaCondicion) {
        infoRotulo.innerHTML = "¡Lo conseguiste!";
      }

      // pintarMapa();
    }, 200);
  }
  bloqueado = false;
}

function comprobacion(tecla) {
  switch (tecla) {
    case "ArrowUp":
      direccion = [-1, 0];
      break;
    case "ArrowDown":
      direccion = [1, 0];
      break;
    case "ArrowLeft":
      direccion = [0, -1];
      break;
    case "ArrowRight":
      direccion = [0, 1];
      break;
    default:
      break;
  }
  nextGrid = [playerXY[0] + direccion[0], playerXY[1] + direccion[1]];
  // let proxCelda = matriz[nextGrid[0]][nextGrid[1]];
  switch (matriz[nextGrid[0]][nextGrid[1]]) {
    case o:
      return o;
    case x:
      return x;
    case _:
      return _;
    default:
      return null;
  }
}
// document.getElementById("movimientos").addEventListener("keydown", escucha);


function escucha(event){
  console.log("has pulsado la tecla: " + event.key);
  if (bloqueado) {
    return false;
  } else {
    mover(event);
  }
  
  // pintarMapa();
};

/*       if (event.key === "ArrowUp") {
    mover("u");
  } else if (event.key === "ArrowDown") {
    mover("d");
  } else if (event.key === "ArrowLeft") {
    mover("l");
  } else if (event.key === "ArrowRight") {
    mover("r");
  } */