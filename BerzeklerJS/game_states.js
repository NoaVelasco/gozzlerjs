import Phaser from "phaser";
import { GameScene } from "@/scenes/GameScene";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  mipmapFilter: "LINEAR_MIPMAP_LINEAR",
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: GameScene,
  // scene: [PreloadScene, TitleScene, GameScene, UIScene],
};

const game = new Phaser.Game(config);