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
    key: "mario-grown-idle",
    frames: [{ key: "mario-grown", frame: 0 }],
  })
  game.anims.create({
    key: "mario-jump",
    frames: game.anims.generateFrameNumbers("mario", { start: 5, end: 5 }),
    frameRate: 12,
  });
  game.anims.create({
    key: "mario-dead",
    frames: [{ key: "mario", frame: 4 }],
  });

  game.anims.create({
    key: "goomba-walk",
    frames: game.anims.generateFrameNumbers("goomba", { start: 0, end: 1 }),
    frameRate: 6,
    repeat: -1,
  });

  game.anims.create({
    key: "goomba-dead",
    frames: [{ key: "goomba", frame: 2 }],
  });

  game.anims.create({
    key: "coin-idle",
    frames: game.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1,
  });
};