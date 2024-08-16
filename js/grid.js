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

class Example extends Phaser.Scene {
  preload() {
    this.load.image("tiles", "_assets/tiles/64x64/Tilesheet/platformPack_tilesheet.png");
    this.load.image(
      "spot",
      "_assets/tiles/64x64/PNG/Tiles/platformPack_tile042.png"
    );
    this.load.image("key", "_assets/tiles/64x64/PNG/Items/platformPack_item012.png");
    this.load.image("duck", "_assets/player/full.png");
    this.load.tilemapCSV("map", "_assets/maps/map01.csv");
  }

  create() {
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 64,
      tileHeight: 64,
      width: 15,
      height: 15,
    });
    const tileset = map.addTilesetImage("tiles", null, 64, 64, 0, 0);
    const layer = map.createLayer(0, tileset, 0, 0);

    const spot = this.add.image(32 + 64 * 13, 32 + 64, "spot");
    const key = this.add.image(32 + (64 * 13), 32 + 64, "key");
    const player = this.add.image(32 + 64, 32 + (64 * 13), "duck");

    //  Left
    this.input.keyboard.on("keydown-A", (event) => {
      const tile = layer.getTileAtWorldXY(player.x - 64, player.y, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.x -= 64;
      }
      player.angle = 0;
      player.flipX = true;
    });

    //  Right
    this.input.keyboard.on("keydown-D", (event) => {
      const tile = layer.getTileAtWorldXY(player.x + 64, player.y, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.x += 64;
      }
      player.angle = 0;
      player.flipX = false;
    });

    //  Up
    this.input.keyboard.on("keydown-W", (event) => {
      const tile = layer.getTileAtWorldXY(player.x, player.y - 64, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.y -= 64;
      }
      if (player.flipX) {
        player.angle = 90;
      } else {
        player.angle = -90;
      }
      // player.flipX = false;
    });

    //  Down
    this.input.keyboard.on("keydown-S", (event) => {
      const tile = layer.getTileAtWorldXY(player.x, player.y + 64, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.y += 64;
      }
      if (player.flipX) {
        player.angle = -90;
      } else {
        player.angle = 90;
      }
      // player.flipX = false;
    });

    this.add.text(8, 8, "Move with WASD", {
      fontSize: "18px",
      fill: "#ffffff",
      backgroundColor: "#000000",
    });
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
