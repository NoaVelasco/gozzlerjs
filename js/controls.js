export function checkControls({ mario, keys }) {

  const isMarioGrounded = mario.body.touching.down;

  const isLeftKeyDown = keys.left.isDown;
  const isRightKeyDown = keys.right.isDown;
  const isUpKeyDown = keys.up.isDown;

  if (mario.isDead) {
    return;
  }

  if (isLeftKeyDown) {
    // no conozco esta sintaxis, pero así solo anda si está en el suelo
    isMarioGrounded && mario.anims.play("mario-walk", true);
    mario.x -= 2;
    mario.flipX = true;
  } else if (isRightKeyDown) {
    isMarioGrounded && mario.anims.play("mario-walk", true);
    mario.x += 2;
    mario.flipX = false;
  } else if (isMarioGrounded) {
    mario.anims.play("mario-idle", true);
  }

  if (isUpKeyDown && isMarioGrounded) {
    mario.setVelocityY(-300);
    mario.anims.play("mario-jump", true);
  }
}