/* global Phaser */

import { createAnimations } from "./animations.js";
import { checkControls } from "./controls.js";

const config = {
  // evitar que nos cambie el foco cada vez que modificamos algo
  autoFocus: false,
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
  
  this.load.spritesheet(
    'goomba',
    'assets/entities/overworld/goomba.png',
    { frameWidth: 16, frameHeight: 16 }
  )

  this.load.audio(
    'gameover',
    'assets/sound/music/gameover.mp3'
  )
}

function create() {
  // posicion x, y + id imagen 
  this.add.image(100, 50, 'cloud1')
    // origen xy: 0-1; 0,0 arriba izq. / 1,1 abajo der.
    .setOrigin(0, 0)
    // escala: 0.5 = 50%, 2 = 200%...
    .setScale(0.15);


  // creamos un grupo estático físico de suelos:
  this.floor = this.physics.add.staticGroup();

  this.floor
    .create(0, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody();

  this.floor
    .create(160, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody();

  // forma básica de cargar sprite:
  /* this.mario = this.add.sprite(50, 210, 'mario')
  .setOrigin(0,1) */

  // forma avanzada de cargar sprite con físicas:
  this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0,1)
    .setCollideWorldBounds(true)
    .setGravityY(300)
    
    this.enemy = this.physics.add.sprite(120, config.height - 64, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-50)
    
  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  this.physics.add.collider(this.enemy, this.floor)
  this.physics.add.collider(this.mario, this.enemy,
    onHitEnemy, null, this
  )
  

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  this.keys = this.input.keyboard.createCursorKeys();
}

function onHitEnemy(mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.destroy()
    mario.setVelocityY(-200)
  } else {

  }
}

function update() {
  const { mario, sound, scene } = this
  
  checkControls(this)

  // comprueba si Mario ha muerto
  if (mario.y >= config.height) {
    mario.isDead = true
    mario.anims.play('mario-dead')
    mario.setCollideWorldBounds(false)
    // Da error al tratar de usar el audio
    try {
      sound.add('gameover', { volume: 0.2 }).play()
    } catch (error) {

    }

    setTimeout(() => {
      mario.setVelocityY(-300)
    }, 200);

    setTimeout(() => {
      scene.restart()
    }, 2200);
  }
  
}