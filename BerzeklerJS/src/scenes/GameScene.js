export const GRID_PX = 64;

export const State = {
  Intermission,
  Planning,
  Executing,
  GameOver,
};

export class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene");

    this.state = State.Intermission;
    this.levelIndex = 0;
  }

  addEvent(delay, callback, callbackScope) {
    return this.time.addEvent({
      delay,
      callback,
      callbackScope,
    });
  };

  create() {

  }
}

// @TODO - Copiar lo útil del juego POWER y aplicar lo que tengo de Berzekler
