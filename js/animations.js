export const createAnimations = (game) => {

      
      game.anims.create(
        {
          key: 'mario-idle',
          frames: [{ key: 'mario', frame: 5 }],
        }
      )
      game.anims.create(
        {
          key: 'mario-jump',
          frames: [{ key: 'mario', frame: 5 }],
          }
      )
}

// minuto 1:33:30 para las animaciones aparte