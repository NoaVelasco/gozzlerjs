const INIT_SPRITESHEETS = [
    {
        key: "roll-h",
        path: "/_assets/player/roll_1.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    {
        key: "roll-v",
        path: "/_assets/player/roll_2.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    {
        key: "idle",
        path: "/_assets/player/idle.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    {
        key: "hit-h",
        path: "/_assets/player/wall_hit.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    {
        key: "hit-v",
        path: "/_assets/player/land.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    {
        key: "celebrate",
        path: "/_assets/player/climb_back.png",
        frameWidth: 64,
        frameHeight: 64,
    }
];

export const initSpritesheet = ({ load }) => {
    INIT_SPRITESHEETS.forEach(({ key, path, frameWidth, frameHeight }) => {
        load.spritesheet(key, path, {
            frameWidth,
            frameHeight,
        });
    });
}