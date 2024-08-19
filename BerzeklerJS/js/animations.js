export const createAnimations = (game) => {
    game.anims.create({
        key: 'roll-horiz',
        frameRate: 8,
        repeat: -1,
        frames: game.anims.generateFrameNumbers('roll-h', {
            start: 0,
            end: 3
        })
    });

    game.anims.create({
        key: 'roll-vert',
        frameRate: 8,
        repeat: -1,
        frames: game.anims.generateFrameNumbers('roll-v', {
            start: 0,
            end: 3
        })
    });

    game.anims.create({
        key: 'idle',
        frameRate: 8,
        repeat: -1,
        frames: game.anims.generateFrameNumbers('idle', {
            start: 0,
            end: 3
        })
    });

    game.anims.create({
        key: 'hit-horiz',
        frameRate: 8,
        repeat: 0,
        frames: [{ key: 'hit-h', frame: 0 }],
    });

    game.anims.create({
        key: 'hit-vert',
        frameRate: 8,
        repeat: 0,
        frames: game.anims.generateFrameNumbers('hit-v', {
            start: 0,
            end: 1
        })
    });
}