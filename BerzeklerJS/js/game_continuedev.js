import { createAnimations } from "./animations.js";
import { initAudio } from "./audio.js";
import { playAudio } from "./audio.js";
import { initSpritesheet } from "./sprites.js";

// FASE 1
// 31 = muro
// 17 = suelo
// 1,14 = personaje
// 14,1 = llave

const GRID_PX = 64;
const DELAY_X1 = 250;

// Array para almacenar las direcciones
let movementQueue = [];

class PlanScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlanScene" });
  }

  preload() {
    // Carga los recursos necesarios para el mapa, la llave y el personaje
    this.load.image(
      "tiles",
      "/_assets/tiles/64x64/Tilesheet/platformPack_tilesheet.png"
    );
    this.load.image(
      "spotKey",
      "/_assets/tiles/64x64/PNG/Tiles/platformPack_tile042.png"
    );
    this.load.image(
      "key",
      "/_assets/tiles/64x64/PNG/Items/platformPack_item014.png"
    );
    this.load.image("duck", "/_assets/player/full.png");
    this.load.tilemapCSV("map", "/_assets/maps/map01.csv");

    initSpritesheet(this);
    initAudio(this);
  }

  create() {
    // Crear el mapa y la capa de tiles
    const map = this.make.tilemap({
      key: "map",
      tileWidth: GRID_PX,
      tileHeight: GRID_PX,
      width: 15,
      height: 15,
    });
    const tileset = map.addTilesetImage("tiles", null, GRID_PX, GRID_PX, 0, 0);
    this.layer = map.createLayer(0, tileset, 0, 0);

    // Agregar la llave (objetivo)
    this.goal = this.add.sprite(32 + GRID_PX * 13, 32 + GRID_PX, "key");

    // Agregar el personaje
    this.player = this.add.sprite(32 + GRID_PX, 32 + GRID_PX * 13, "duck");

    // Texto de instrucciones
    this.add.text(10, 10, "Planifica tus movimientos:", {
      fontSize: "32px",
      fill: "#000",
    });

    // Texto de instrucciones
    this.add.text(10, 10, "Planifica tus movimientos:", {
      fontSize: "32px",
      fill: "#000",
    });

    // Botones para agregar direcciones a la cola
    this.add
      .text(10, 100, "Arriba", { fontSize: "24px", fill: "#000" })
      .setInteractive()
      .on("pointerdown", () => movementQueue.push([0, -64]));

    this.add
      .text(10, 150, "Abajo", { fontSize: "24px", fill: "#000" })
      .setInteractive()
      .on("pointerdown", () => movementQueue.push([0, 64]));

    this.add
      .text(10, 200, "Izquierda", { fontSize: "24px", fill: "#000" })
      .setInteractive()
      .on("pointerdown", () => movementQueue.push([-64, 0]));

    this.add
      .text(10, 250, "Derecha", { fontSize: "24px", fill: "#000" })
      .setInteractive()
      .on("pointerdown", () => movementQueue.push([64, 0]));

    // Botón para iniciar la ejecución
    this.add
      .text(10, 300, "Ejecutar", { fontSize: "24px", fill: "#000" })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("PlayScene"));

    // Mostrar la cola de movimientos (opcional)
    this.movementText = this.add.text(10, 350, "Movimientos: ", {
      fontSize: "24px",
      fill: "#000",
    });
    this.updateMovementText();
  }

  updateMovementText() {
    this.movementText.setText(
      "Movimientos: " +
        movementQueue
          .map((move) =>
            move[0] === 0
              ? move[1] > 0
                ? "Abajo"
                : "Arriba"
              : move[0] > 0
              ? "Derecha"
              : "Izquierda"
          )
          .join(", ")
    );
  }

  update() {
    // Actualizar la visualización de la cola de movimientos (opcional)
    this.updateMovementText();
  }
}

class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
    // Carga los recursos necesarios para el mapa, la llave y el personaje
    this.load.image(
      "tiles",
      "/_assets/tiles/64x64/Tilesheet/platformPack_tilesheet.png"
    );
    this.load.image(
      "spotKey",
      "/_assets/tiles/64x64/PNG/Tiles/platformPack_tile042.png"
    );
    this.load.image(
      "key",
      "/_assets/tiles/64x64/PNG/Items/platformPack_item014.png"
    );
    this.load.image("duck", "/_assets/player/full.png");
    this.load.tilemapCSV("map", "/_assets/maps/map01.csv");
  }

  create() {
    createAnimations(this);
    // Crear el mapa y la capa de tiles
    const map = this.make.tilemap({
      key: "map",
      tileWidth: GRID_PX,
      tileHeight: GRID_PX,
      width: 15,
      height: 15,
    });
    const tileset = map.addTilesetImage("tiles", null, GRID_PX, GRID_PX, 0, 0);
    this.layer = map.createLayer(0, tileset, 0, 0);

    // Agregar la llave (objetivo)
    this.goal = this.add.sprite(32 + GRID_PX * 13, 32 + GRID_PX, "key");

    // Agregar el personaje
    this.player = this.add.sprite(32 + GRID_PX, 32 + GRID_PX * 13, "duck");
    this.executeMovementQueue();
  }

  executeMovementQueue() {
    if (movementQueue.length > 0) {
      const nextMove = movementQueue.shift(); // Obtener el siguiente movimiento
      this.movePlayer(nextMove);
    } else {
      // No quedan movimientos en la cola
      console.log("Fin de la cola de movimientos");
    }
  }

  movePlayer(direction) {
    const { player, layer, goal } = this;

    // Función recursiva para mover al jugador casilla por casilla
    const moveOneTile = () => {
      //  Localiza la casilla a la que se moverá.
      let tile = layer.getTileAtWorldXY(
        player.x + direction[0],
        player.y + direction[1],
        true
      );

      //  Si la casilla es un muro, se detiene.
      if (tile.index === 31) {
        playAudio("hit-wall", this, { volume: 0.2 });
        if (direction[0] !== 0) {
          player.anims.play("hit-horiz", true);
        }
        if (direction[1] !== 0) {
          player.anims.play("hit-vert", true);
        }
        setTimeout(() => {
          player.anims.play("idle", true);
          this.executeMovementQueue(); // Continuar con el siguiente movimiento
        }, 200);
      } else {
        // Mover al jugador una casilla
        player.x += direction[0];
        player.y += direction[1];

        // Reproducir la animación de movimiento
        if (direction[0] !== 0) {
          player.flipX = direction[0] < 0; // Voltear el sprite si se mueve a la izquierda
          player.anims.play("roll-horiz", true);
        }
        if (direction[1] !== 0) {
          player.anims.play("roll-vert", true);
        }

        // Comprobar si el jugador ha llegado al objetivo DESPUÉS de moverse
        setTimeout(() => {
          if (checkOverlap(player, goal)) {
            playAudio("have-key", this, { volume: 0.2 });
            goal.destroy();
            setTimeout(() => {
              player.anims.play("player-win", true);
            }, 300);
            console.log("¡Objetivo alcanzado!");
          } else {
            // Continuar moviendo una casilla después de un retraso
            setTimeout(() => {
              moveOneTile();
            }, DELAY_X1);
          }
        }, DELAY_X1); // Esperar el mismo tiempo que el movimiento
      }
    };

    // Iniciar el movimiento casilla por casilla
    moveOneTile();
  }
}

// class MainScene extends Phaser.Scene {
//   preload() {
//     this.load.image(
//       "tiles",
//       "/_assets/tiles/64x64/Tilesheet/platformPack_tilesheet.png"
//     );
//     this.load.image(
//       "spotPlayer",
//       "/_assets/tiles/64x64/PNG/Tiles/platformPack_tile036.png"
//     );
//     this.load.image(
//       "spotKey",
//       "/_assets/tiles/64x64/PNG/Tiles/platformPack_tile042.png"
//     );
//     this.load.image(
//       "key",
//       "/_assets/tiles/64x64/PNG/Items/platformPack_item014.png"
//     );
//     this.load.image("duck", "/_assets/player/full.png");
//     this.load.tilemapCSV("map", "/_assets/maps/map01.csv");

//     initSpritesheet(this);
//     initAudio(this);
//   }

//   create() {
//     createAnimations(this);

//     const map = this.make.tilemap({
//       key: "map",
//       tileWidth: GRID_PX,
//       tileHeight: GRID_PX,
//       width: 15,
//       height: 15,
//     });
//     const tileset = map.addTilesetImage("tiles", null, GRID_PX, GRID_PX, 0, 0);
//     this.layer = map.createLayer(0, tileset, 0, 0);

//     const spotKey = this.add.image(32 + GRID_PX * 13, 32 + GRID_PX, "spotKey");

//     const spotPlayer = this.add.image(
//       32 + GRID_PX,
//       32 + GRID_PX * 13,
//       "spotPlayer"
//     );

//     this.player = this.add.sprite(32 + GRID_PX, 32 + GRID_PX * 13, "duck");
//     this.goal = this.add.sprite(32 + GRID_PX * 13, 32 + GRID_PX, "key");
//     this.player.direction = [0, 0];
//     this.player.isDelayed = false;
//     this.player.anims.play("idle", true);

//     this.keys = this.input.keyboard.createCursorKeys();
//   }
//   update() {
//     const { player, keys, goal } = this;

//     // Si la dirección es [0,0], las teclas escuchan
//     if (player.direction[0] == 0 && player.direction[1] == 0) {
//       if (checkOverlap(player, goal) && goal.visible) {
//         playAudio("have-key", this, { volume: 0.2 });
//         goal.destroy();
//         setTimeout(() => {
//           player.anims.play("player-win", true);
//         }, 300);
//       };
//       // Si se presiona una tecla, configura la dirección y el angulo de player
//       if (keys.right.isDown) {
//         player.direction = [64, 0];
//         player.flipX = false;
//         player.anims.play("roll-horiz", true);
//       } else if (keys.left.isDown) {
//         player.direction = [0, 0];
//         player.direction = [-64, 0];
//         player.flipX = true;
//         player.anims.play("roll-horiz", true);
//       } else if (keys.up.isDown) {
//         player.direction = [0, 0];
//         player.direction = [0, -64];
//         player.anims.play("roll-vert", true);
//       } else if (keys.down.isDown) {
//         player.direction = [0, 0];
//         player.direction = [0, 64];
//         player.anims.play("roll-vert", true);
//       }
//     } else {
//       // Cuando hay dirección, se mueve cuando sale del modo delay (con timeOut)
//       if (!this.player.isDelayed) {
//         this.moving();
//       }
//     }
//   }

//   moving() {
//     const { player, layer, goal } = this;
//     //  Localiza la casilla a la que se moverá.
//     let tile = layer.getTileAtWorldXY(
//       player.x + player.direction[0],
//       player.y + player.direction[1],
//       true
//     );
//     //  Si la casilla es un muro, se detiene.
//     //  Si no, se mueve y establece el modo Delay antes de moverse de nuevo.
//     if (tile.index === 31) {
//       playAudio("hit-wall", this, { volume: 0.2 });
//       if (player.direction[0] !== 0) {
//         player.anims.play("hit-horiz", true);
//       }
//       if (player.direction[1] !== 0) {
//         player.anims.play("hit-vert", true);
//       }
//       player.direction = [0, 0];

//       setTimeout(() => {
//         player.anims.play("idle", true);
//       }, 200);
//     } else {
//       player.x += player.direction[0];
//       player.y += player.direction[1];
//       player.isDelayed = true;

//       setTimeout(() => {
//         player.isDelayed = false;
//       }, DELAY_X1);
//     }
//   }
// }

function checkOverlap(spriteA, spriteB) {
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}

const config = {
  autoFocus: false,
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 960,
    min: {
      width: 480,
      height: 480,
    },
    max: {
      width: 960,
      height: 960,
    },
  },
  pixelArt: true,
  backgroundColor: "#cccccc",
  scene: [PlanScene, PlayScene],
};

const game = new Phaser.Game(config);
