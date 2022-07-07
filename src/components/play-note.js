import * as Tone  from 'tone';
import { keyIndex } from './consts.ts';

const hierarchy = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const synth = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();
const defaultDuration = .3; // 300ms

export const playNotes = (notes, duration = defaultDuration) => {
  const now = Tone.now()
  let prevNoteLetter = null;
  let octave = 4;
  for(let i = 0; i < notes.length; i++) {
    const noteAlias = keyIndex.find(record => record.includes(notes[i]))[0];
    const noteLetter = noteAlias.charAt(0);
    if (
      prevNoteLetter &&
      hierarchy.indexOf(prevNoteLetter) > hierarchy.indexOf(noteLetter)
    ) {
      octave++;
    }
    synth.triggerAttack(`${noteAlias}${octave}`, now + i * duration);
    synth.triggerRelease(now + (i + 1) * duration)
    prevNoteLetter = noteLetter
  }
}
