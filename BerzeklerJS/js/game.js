/* let matriz = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]; */

import { createAnimations } from "./animations.js";
import { initAudio } from "./audio.js";
import { playAudio } from "./audio.js";
import { initSpritesheet } from "./sprites.js";

// 0 = muro
// 1 = suelo
// 2 = personaje
// 3 = llave

const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 1024;
const MAX_WIDTH = 1536;
const MAX_HEIGHT = 864;
let SCALE_MODE = "SMOOTH"; // FIT OR SMOOTH

const GRID_PX = 64;
const DELAY_X1 = 100;

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image(
      "tiles",
      "/_assets/tiles/64x64/Tilesheet/platformPack_tilesheet.png"
    );
    this.load.image(
      "spotPlayer",
      "/_assets/tiles/64x64/PNG/Tiles/platformPack_tile036.png"
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
    createAnimations(this);

    const map = this.make.tilemap({
      key: "map",
      tileWidth: GRID_PX,
      tileHeight: GRID_PX,
      width: 15,
      height: 15,
    });
    const tileset = map.addTilesetImage("tiles", null, GRID_PX, GRID_PX, 0, 0);
    this.layer = map.createLayer(0, tileset, 0, 0);

    const spotKey = this.add.image(32 + GRID_PX * 13, 32 + GRID_PX, "spotKey");
    // const key = this.add.image(32 + GRID_PX * 13, 32 + GRID_PX, "key");

    const spotPlayer = this.add.image(
      32 + GRID_PX,
      32 + GRID_PX * 13,
      "spotPlayer"
    );

    this.player = this.add.sprite(32 + GRID_PX, 32 + GRID_PX * 13, "duck");
    this.goal = this.add.sprite(32 + GRID_PX * 13, 32 + GRID_PX, "key");
    this.player.direction = [0, 0];
    this.player.isDelayed = false;
    this.player.anims.play("idle", true);

    this.keys = this.input.keyboard.createCursorKeys();
  }
  update() {
    const { player, keys, goal } = this;

    // Si la dirección es [0,0], las teclas escuchan
    if (player.direction[0] == 0 && player.direction[1] == 0) {
      if (checkOverlap(player, goal) && goal.visible) {
        playAudio("have-key", this, { volume: 0.2 });
        goal.destroy();
      };
      // Si se presiona una tecla, configura la dirección y el angulo de player
      if (keys.right.isDown) {
        player.direction = [64, 0];
        // player.angle = 0;
        player.flipX = false;
        player.anims.play("roll-horiz", true);
      } else if (keys.left.isDown) {
        player.direction = [0, 0];
        player.direction = [-64, 0];
        // player.angle = 0;
        player.flipX = true;
        player.anims.play("roll-horiz", true);
      } else if (keys.up.isDown) {
        player.direction = [0, 0];
        player.direction = [0, -64];
        if (player.flipX) {
          // player.angle = 90;
        } else {
          // player.angle = -90;
        }
        player.anims.play("roll-vert", true);
      } else if (keys.down.isDown) {
        player.direction = [0, 0];
        player.direction = [0, 64];
        if (player.flipX) {
          // player.angle = -90;
        } else {
          // player.angle = 90;
        }
        player.anims.play("roll-vert", true);
      }
    } else {
      // Cuando hay dirección, se mueve cuando sale del modo delay (con timeOut)
      if (!this.player.isDelayed) {
        this.moving();
      }
    }
  }

  moving() {
    const { player, layer, goal } = this;
    //  Localiza la casilla a la que se moverá.
    let tile = layer.getTileAtWorldXY(
      player.x + player.direction[0],
      player.y + player.direction[1],
      true
    );
    //  Si la casilla es un muro, se detiene.
    //  Si no, se mueve y establece el modo Delay antes de moverse de nuevo.
    if (tile.index === 31) {
      playAudio("hit-wall", this);
      if (player.direction[0] !== 0) {
        player.anims.play("hit-horiz", true);
      }
      if (player.direction[1] !== 0) {
        player.anims.play("hit-vert", true);
      }
      player.direction = [0, 0];
      // player.angle = 0;
      // player.flipX = false;
      setTimeout(() => {
        player.anims.play("idle", true);
      }, 200);
    } else {
      player.x += player.direction[0];
      player.y += player.direction[1];
      player.isDelayed = true;

      setTimeout(() => {
        player.isDelayed = false;
      }, 250);
    }
  }
}

function checkOverlap(spriteA, spriteB) {
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}

const config = {
  autoFocus: false,
  type: Phaser.AUTO,
  width: 960,
  height: 960,
  parent: "game",
  pixelArt: true,
  backgroundColor: "#198044",
  scene: MainScene,
  scale: {
    // we do scale the game manually in resize()
    mode: Phaser.Scale.NONE,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
};

// const game = new Phaser.Game(config);

// Para adaptar el tamaño al reescalar
window.addEventListener("load", () => {
  const game = new Phaser.Game(config);

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    let maxWidth = MAX_WIDTH;
    let maxHeight = MAX_HEIGHT;
    let scaleMode = SCALE_MODE;

    let scale = Math.min(w / width, h / height);
    let newWidth = Math.min(w / scale, maxWidth);
    let newHeight = Math.min(h / scale, maxHeight);

    let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    let maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT;

    // smooth scaling
    let smooth = 1;
    if (scaleMode === "SMOOTH") {
      const maxSmoothScale = 1.15;
      const normalize = (value, min, max) => {
        return (value - min) / (max - min);
      };
      if (width / height < w / h) {
        smooth =
          -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) /
            (1 / (maxSmoothScale - 1)) +
          maxSmoothScale;
      } else {
        smooth =
          -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) /
            (1 / (maxSmoothScale - 1)) +
          maxSmoothScale;
      }
    }

    // resize the game
    game.scale.resize(newWidth * smooth, newHeight * smooth);

    // scale the width and height of the css
    game.canvas.style.width = newWidth * scale + "px";
    game.canvas.style.height = newHeight * scale + "px";

    // center the game with css margin
    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
  };
  window.addEventListener("resize", (event) => {
    console.log("resize event");
    resize();
  });
  console.log("resize at start");
  resize();
});
