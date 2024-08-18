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

// 0 = muro
// 1 = suelo
// 2 = personaje
// 3 = moneda

const GRID_PX = 64;

class Example extends Phaser.Scene {
  preload() {
    this.load.image(
      "tiles",
      "_assets/tiles/64x64/Tilesheet/platformPack_tilesheet.png"
    );
    this.load.image(
      "spotPlayer",
      "_assets/tiles/64x64/PNG/Tiles/platformPack_tile036.png"
    );
    this.load.image(
      "spotKey",
      "_assets/tiles/64x64/PNG/Tiles/platformPack_tile042.png"
    );
    this.load.image(
      "key",
      "_assets/tiles/64x64/PNG/Items/platformPack_item014.png"
    );
    this.load.image("duck", "_assets/player/full.png");
    this.load.tilemapCSV("map", "_assets/maps/map01.csv");
  }

  create() {
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
    const key = this.add.image(32 + GRID_PX * 13, 32 + GRID_PX, "key");

    const spotPlayer = this.add.image(
      32 + GRID_PX,
      32 + GRID_PX * 13,
      "spotPlayer"
    );

    this.player = this.add.image(32 + GRID_PX, 32 + GRID_PX * 13, "duck");
    this.player.direction = [0, 0];
    this.player.isDelayed = false;

    this.keys = this.input.keyboard.createCursorKeys();
  }
  update() {
    const { player, keys, layer } = this;

    // Si la dirección es [0,0], las teclas escuchan
    if (!player.direction.includes(64) && !player.direction.includes(-64)) {
      // Si se presiona una tecla, configura la dirección y el angulo de player
      if (keys.right.isDown) {
        player.direction = [64, 0];
        player.angle = 0;
        player.flipX = false;
      } else if (keys.left.isDown) {
        player.direction = [0, 0];
        player.direction = [-64, 0];
        player.angle = 0;
        player.flipX = true;
      } else if (keys.up.isDown) {
        player.direction = [0, 0];
        player.direction = [0, -64];
        if (player.flipX) {
          player.angle = 90;
        } else {
          player.angle = -90;
        }
      } else if (keys.down.isDown) {
        player.direction = [0, 0];
        player.direction = [0, 64];
        if (player.flipX) {
          player.angle = -90;
        } else {
          player.angle = 90;
        }
      }
    } else {
      // Cuando hay dirección, se mueve cuando sale del modo delay (con timeOut)
      if (!this.player.isDelayed) {
        this.moving();
      }
    }
  }

  moving() {
    const { player, layer } = this;

    //  Localiza la casilla a la que se moverá.
    let tile = layer.getTileAtWorldXY(
      player.x + player.direction[0],
      player.y + player.direction[1],
      true
    );

    //  Si la casilla es un muro, se detiene.
    //  Si no, se mueve y establece el modo Delay antes de moverse de nuevo.
    if (tile.index === 31) {
      player.direction = [0, 0];
    } else {
      player.x += player.direction[0];
      player.y += player.direction[1];
      player.isDelayed = true;

      setTimeout(() => {
        player.isDelayed = false;
      }, 100);
    }
  }
}

const config = {
  autoFocus: false,
  type: Phaser.AUTO,
  width: 960,
  height: 960,
  parent: "phaser-example",
  pixelArt: true,
  backgroundColor: "#198044",
  scene: Example,
};

const game = new Phaser.Game(config);
