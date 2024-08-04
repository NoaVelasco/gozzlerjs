export const createAnimations = (game) => {
  game.anims.create({
    key: "mario-walk",
    frames: game.anims.generateFrameNumbers("mario", { start: 3, end: 2 }),
    frameRate: 12,
    repeat: -1, // repetir indefinidamente
  });
  game.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }],
  });
  game.anims.create({
    key: "mario-jump",
    frames: game.anims.generateFrameNumbers("mario", { start: 5, end: 5 }),
    frameRate: 12,
  });
  game.anims.create({
    key: "mario-dead",
    frames: [{ key: "mario", frame: 4 }],
  });
};

// minuto 1:33:30 para las animaciones aparte
