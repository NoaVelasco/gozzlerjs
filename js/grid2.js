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

    // console.log(this.player.direction)

    this.keys = this.input.keyboard.createCursorKeys();

    // this.listenToKeys = true;
    // console.log(-GRID_PX);
  }
  update() {
    const { player, keys, layer } = this;
    if (!player.direction.includes(64) && !player.direction.includes(-64)) {
      if (keys.right.isDown) {
        // player.direction = [0, 0];
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
      if (!this.player.isDelayed) {
        this.moving();
      }
    }
    //  Left
    this.input.keyboard.on("keydown-A", (event) => {
      const tile = layer.getTileAtWorldXY(player.x - GRID_PX, player.y, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.x -= GRID_PX;
      }
      player.angle = 0;
      player.flipX = true;
    });

    //  Right
    this.input.keyboard.on("keydown-D", (event) => {
      let tile = layer.getTileAtWorldXY(player.x + GRID_PX, player.y, true);

      player.angle = 0;
      player.flipX = false;

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.x += GRID_PX;
      }
    });

    //  Up
    this.input.keyboard.on("keydown-W", (event) => {
      const tile = layer.getTileAtWorldXY(player.x, player.y - GRID_PX, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.y -= GRID_PX;
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
      const tile = layer.getTileAtWorldXY(player.x, player.y + GRID_PX, true);

      if (tile.index === 20) {
        //  Blocked, we can't move
      } else {
        player.y += GRID_PX;
      }
      if (player.flipX) {
        player.angle = -90;
      } else {
        player.angle = 90;
      }
      // player.flipX = false;
    });

    /*       this.add.text(8, 8, "Move with WASD", {
        fontSize: "18px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      }); */
  }

  moving() {
    const { player, layer } = this;
    let tile = layer.getTileAtWorldXY(
      player.x + player.direction[0],
      player.y + player.direction[1],
      true
    );

    // console.log(player.direction[0], player.direction[1]);

    if (tile.index === 20) {
      player.direction = [0, 0];
      //  Blocked, we can't move
    } else {
      if (!player.isDelayed) {
        // console.log(player.x + parseInt(player.direction[0]), player.y + parseInt(player.direction[1]));
        player.x += player.direction[0];
        player.y += player.direction[1];
        player.isDelayed = true;

        setTimeout(() => {
          player.isDelayed = false;
        }, 100);
      }
      // player.moving = true;
      // player.x += player.direction[0];
      // player.y += player.direction[1];
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
