export const roomId_generator = () => {
    const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let id = ""
    for(let i=0; i<10; i++){
        id += s[Math.floor(Math.random() * s.length)]
    }
    return id;
}

const audioCache = {};

export const preload_sound = (filePath) => {
  return new Promise((resolve, reject) => {
    if (audioCache[filePath]) return resolve();

    const audio = new Audio(filePath);
    audio.addEventListener('canplaythrough', () => {
      audioCache[filePath] = audio;
      resolve();
    });
    audio.addEventListener('error', reject);
    audio.load();
  });
};

export const play_sound = (filePath) => {
  const audio = audioCache[filePath]?.cloneNode();
  if (audio) {
    audio.play();
  }
};