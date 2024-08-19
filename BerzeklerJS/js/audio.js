const INIT_AUDIOS = [
    {
        key: "hit-wall",
        path: "/_assets/sounds/hit_retro.wav"
    },
    {
        key: "rolling",
        path: "/_assets/sounds/roll_2.wav"
    },
    {
        key: "have-key",
        path: "/_assets/sounds/Coin_7.wav"
    }
];

export const initAudio = ({ load }) => {
    INIT_AUDIOS.forEach(({ key, path }) => {
        load.audio(key, path);
    });
}

export const playAudio = (id, { sound }, { volume = 1 } = {}) => {
    try {
        return sound.add(id, { volume }).play();
    } catch (e) {
        console.error(e);
    }
}