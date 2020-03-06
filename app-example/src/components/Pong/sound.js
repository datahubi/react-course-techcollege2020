


export function createAudioContext() {
  const context = new AudioContext();
  return context;
}

/**
 *
 * @param {number} freq
 * @param {string} type can be: 'sine', 'triangle', 'square' or 'sawtooth'
 */
export function playNote(freq, type = "sine") {
  const context = createAudioContext();
  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.connect(context.destination);
  oscillator.frequency.setTargetAtTime(freq, context.currentTime, 0);
  oscillator.start(0);
  context.resume()  
  return context
}

export function stopNote(context) {
  context.suspend();
}

export function playBeep(freq = 400, time = 100, type = "square") {
  // clearTimeout(noteTimer);
  const context = playNote(freq, type);
  const noteTimer = setTimeout(() => {
    stopNote(context);
    clearTimeout(noteTimer)
    // return (noteTimer = null);
  }, time);
  // return noteTimer
  return context;
}

export function collisionSound(sound = '/audio/pop.mp3', vol = 1) {
  const audio = new Audio(sound);
  audio.volume = vol;
  audio.play();
  return audio;
}

// export function createSound 

