import { keyIndex } from './consts';

const hierarchy = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const generateDrawTextFn = (textOffsetX, textOffsetY, stepWidth, stepHeight) =>
  (ctx, note, i, j, color = 'white') => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "10px helvetica";
    ctx.fillText(
      note,
      textOffsetX + (i * stepWidth),
      textOffsetY + (j * stepHeight)
    );
    ctx.restore();
  }

export const findRelationToRoot = (note, root, scale) => {
  const rootIndex = scale.findIndex(value => value === root);
  const noteIndex = scale.findIndex(value => value === note);
  // compensate for when the root is higher than the note
  return rootIndex + (rootIndex < noteIndex ? scale.length : 0) - noteIndex;
}

export const addSixthChords = chords => ({
  ...chords,
  // These are really inversions of seventh chords, but used as chords in practice
  majorSixth: Object.values(chords['minorSeventh']).reduce((acc, value) => ({
    ...acc,
    [value[1]]: [...value.slice(1), ...value.slice(0, 1)]
  }), {}),
  minorSixth: Object.values(chords['halfDiminishedSeventh']).reduce((acc, value) => ({
    ...acc,
    [value[1]]: [...value.slice(1), ...value.slice(0, 1)]
  }), {})
})

export const generateChordWithOctaves = (notes, raise = true) => {
  let prevNoteLetter = '';
  let octave = 4;
  const finalNotes = [];
  for(let i = 0; i < notes.length; i++) {
    const noteAlias = keyIndex.find(record => record.includes(notes[i]))[0];
    const noteLetter = noteAlias.charAt(0);
    if (
      prevNoteLetter &&
      hierarchy.indexOf(prevNoteLetter) > hierarchy.indexOf(noteLetter)
    ) {
      if (raise) octave++;
    }
    if (i === 0) finalNotes.push(`${noteAlias}${octave - 1}`)
    finalNotes.push(`${noteAlias}${octave}`)
    prevNoteLetter = noteLetter
  }

  return finalNotes
}