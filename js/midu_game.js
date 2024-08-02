/* global Phaser */

import { createAnimations } from "./animations.js";

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload, // precarga recursos
    create: create, // cuando el juego comienza
    update: update, // en cada frame
  },
};

new Phaser.Game(config);

function preload() {
  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.spritesheet(
    'mario',
    'assets/entities/mario.png',
    { frameWidth: 18, frameHeight: 16 }
  )
  
  // crear la animación de andar
}

function create() {
  // posicion x, y + id imagen 
  this.add.image(100, 50, 'cloud1')
    // origen xy: 0-1; 0,0 arriba izq. / 1,1 abajo der.
    .setOrigin(0, 0)
    // escala: 0.5 = 50%, 2 = 200%...
    .setScale(0.15);

  // carga mapa de sprites básico con suelo:
  // posicion x, y; ancho y alto; id recurso
  /* this.add.tileSprite(0, config.height - 32, config.width, 32, 'floorbricks')
  .setOrigin(0,0); */

  // pero creamos un grupo estático físico de suelos:
  this.floor = this.physics.add.staticGroup();
  this.floor
    .create(50, config.height - 16, 'floorbricks')
    .setOrigin(0.5,0.5)
    .refreshBody();
    this.floor
    .create(200, config.height - 16, 'floorbricks')
    .setOrigin(0.5,0.5)
    .refreshBody();

  // forma básica de cargar sprite:
  /* this.mario = this.add.sprite(50, 210, 'mario')
  .setOrigin(0,1) */

  // forma avanzada de cargar sprite con físicas:
  this.mario = this.physics.add.sprite(50, 210, 'mario')
    .setOrigin(0,1)
    .setCollideWorldBounds(true)
    .setGravityY(500)
    
  this.physics.world.setBounds(0, 0, 500, config.height)
  this.physics.add.collider(this.mario, this.floor)

  this.cameras.main.setBounds(0, 0, 500, config.height)
  this.cameras.main.startFollow(this.mario)

  // crear animaciones
  this.anims.create(
    {
      key: 'mario-walk',
      frames: this.anims.generateFrameNumbers(
        'mario', { start: 3, end: 2 }
      ),
      frameRate: 12,
      repeat: -1  // repetir indefinidamente
    }
  )
  
  this.anims.create(
    {
      key: 'mario-idle',
      frames: this.anims.generateFrameNumbers(
        'mario', { start: 0, end: 0 }
      ),
      frameRate: 12
    }
  )
  this.anims.create(
    {
      key: 'mario-jump',
      frames: this.anims.generateFrameNumbers(
        'mario', { start: 5, end: 5 }
      ),
      frameRate: 12
    }
  )

  createAnimations(this)

  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.keys.left.isDown) {
    this.mario.x -= 4
    this.mario.anims.play('mario-walk', true)
    this.mario.flipX = true
  } else if (this.keys.right.isDown) {
    this.mario.x += 4
    this.mario.anims.play('mario-walk', true)
    this.mario.flipX = false
  } else {
    this.mario.anims.play('mario-idle')
  }

  if (this.keys.up.isDown) {
    this.mario.y -= 4
    this.mario.anims.play('mario-jump', true)
  }


  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300)
  }
}
