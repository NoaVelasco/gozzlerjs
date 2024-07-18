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
  for (const filas of matriz) {
    for (const celda of filas) {
      let casilla = document.createElement("div");
      console.log(celda);
      console.log(pintaCeldas(celda));
      casilla.innerHTML = pintaCeldas(celda);
      mapa.appendChild(casilla);
    }
  }
}

let movimientos = [];
