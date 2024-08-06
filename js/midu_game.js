/* global Phaser */

import { createAnimations } from "./animations.js";
import { initAudio } from "./audio.js";
import { playAudio } from "./audio.js";
import { checkControls } from "./controls.js";
import { initSpritesheet } from "./spritesheet.js";

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

  // --------- IMAGENES ---------
  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.image(
    'supermushroom',
    'assets/collectibles/super-mushroom.png'
  )

  initSpritesheet(this)

  initAudio(this)

}

function create() {
  createAnimations(this)
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
  
  this.collectibles = this.physics.add.staticGroup();
  this.collectibles.create(100, 200, 'coin')
    .anims.play('coin-idle', true)
  this.collectibles.create(300, 120, 'coin')
    .anims.play('coin-idle', true)
  this.collectibles.create(200, config.height-40, 'supermushroom')
    
  // ------- FÍSICAS Y COLISIONES ----------
  this.physics.add.overlap(this.mario, this.collectibles, collectItem, null, this)
  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  this.physics.add.collider(this.enemy, this.floor)
  this.physics.add.collider(this.mario, this.enemy,
    onHitEnemy, null, this
  )
  

  // ------- CAMARA ----------
  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  this.enemy.anims.play('goomba-walk', true)

  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  const { mario } = this
  
  checkControls(this)

  // comprueba si Mario ha muerto
  if (mario.y >= config.height && !mario.isDead) {
    killMario(this)
  }
  
}
  
function onHitEnemy(mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up && !mario.isDead) {
    enemy.anims.play('goomba-dead', true)
    enemy.setVelocityX(0)
    mario.setVelocityY(-200)

    playAudio('goomba-stomp', this)
    addToScore(200, enemy, this)
    
    setTimeout(() => {
      enemy.destroy()
    }, 500);
  } else {
    killMario(this)
  }
}


function killMario(game) {
  const { mario, scene } = game

  if (mario.isDead) return

  mario.isDead = true;
  mario.anims.play("mario-dead");
  mario.setCollideWorldBounds(false);

  // Da error al tratar de usar el audio
  playAudio("gameover", game, { volume: 0.2 });
  
  mario.body.checkCollision.none = true
  mario.setVelocityX(0);
  
  setTimeout(() => {
    mario.setVelocityY(-350);
  }, 100);
  
  setTimeout(() => {
    scene.restart();
  }, 3200);
}

function collectItem(mario, item) {
  const { texture: { key } } = item

  item.destroy()

  if (key === "coin") {
    
    // item.disableBody(true, true)
    // item.destroy()
    playAudio("coin-pickup", this, { volume: 0.1 });
    
    addToScore(100, item, this)
  } else if (key === "supermushroom") {
    this.physics.world.pause()
    this.anims.pauseAll()

    playAudio("powerup", this, { volume: 0.2 })
    
    let i = 0;
    
    const interval = setInterval(() => {
      i++
      mario.anims.play(i % 2 === 0
        ? 'mario-grown-idle'
        : 'mario-idle', true
      )
    }, 100);
    // mario.anims.play('mario-grown-idle', true)
    // mario.setSize()

    mario.refreshBody()
    
    mario.isBlocked = true
    
    setTimeout(() => {
      mario.isGrown = true
      mario.setDisplaySize(18, 32)
      mario.body.setSize(18, 32)
      this.anims.resumeAll()
      mario.isBlocked = false
      clearInterval(interval)
      this.physics.world.resume()
    }, 1000);

  }
}
  
function addToScore(scoreToAdd, origin, game) {
  const scoreText = game.add.text(
    origin.x,
    origin.y,
    scoreToAdd,
    {
      fontFamily: 'pixel',
      fontSize: config.width / 40
    }
  )

  game.tweens.add({
    targets: scoreText,
    duration: 1000,
    y: scoreText.y - 20,
    onComplete: () => {
      game.tweens.add({
      targets: scoreText,
      duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy()
        }
    })
    }
  })
  
}