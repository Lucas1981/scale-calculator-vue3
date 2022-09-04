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
  onload: () => console.log('Sampler loaded'),
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

const defaultDuration = .3; // 300ms

export const setBpm = bpm => Tone.Transport.bpm.value = bpm;

export const playNotes = (notes, duration = defaultDuration, time = 0, arpeggio = 0) => {
  const now = Tone.now();
  let prevNoteLetter = null;
  let octave = 4;
  const finalNotes = [];
  for(let i = 0; i < notes.length; i++) {
    const noteAlias = keyIndex.find(record => record.includes(notes[i]))[0];
    const noteLetter = noteAlias.charAt(0);
    if (
      prevNoteLetter &&
      hierarchy.indexOf(prevNoteLetter) > hierarchy.indexOf(noteLetter)
    ) {
      octave++;
    }
    finalNotes.push(`${noteAlias}${octave}`)
    prevNoteLetter = noteLetter
  }

  if (arpeggio !== 0) {
    for (let i = 0; i < finalNotes.length; i++) {
      synth
        .triggerAttackRelease(finalNotes[i], duration, (arpeggio * i) + (time || now));
    }
  } else {
    synth
      .triggerAttackRelease(finalNotes, duration, time || now);
  }
}

const getDurationScale = denominator => {
  // A quarter note takes 0.5 seconds at 120 bpm
  const quarterTime = (0.5 * (120 / Tone.Transport.bpm.value));
  const denominatorAsInt = parseInt(denominator.replace(/[^0-9]/g, ''));
  return (4 / denominatorAsInt) * quarterTime;
}

export const scheduleChords = (chords, offset, bars, numerator, denominator, callback) => {
  Tone.Transport.timeSignature = numerator;
  const durationScale = getDurationScale(denominator);

  const part = new Tone.Sequence(((time, value) => {
    playNotes(value.notes, durationScale * (value.duration || 0), time);
    Tone.Draw.schedule(() => callback(value), time);
  }), chords, denominator).start(0);

  // This will enable playback if it is not first triggered by an attackRelease
  Tone.context.resume();

  Tone.Transport.start();
}

export const stopNotes = () => {
  Tone.Transport.cancel();
  Tone.Transport.stop();
}
