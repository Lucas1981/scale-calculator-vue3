export const keyIndex = [
  ['C', 'B#', 'Dbb', 'A###'],
  ['Db', 'C#', 'Ebbb', 'B##'],
  ['D', 'C##', 'Ebb', 'B###', 'Fbbb'],
  ['Eb', 'D#', 'Fbb', 'C###'],
  ['E', 'D##', 'Fb', 'Gbbb'],
  ['F', 'E#', 'Gbb', 'D###'],
  ['Gb', 'F#', 'Abbb', 'E##'],
  ['G', 'F##', 'Abb', 'E###'],
  ['Ab', 'G#', 'Bbbb', 'F###'],
  ['A', 'G##', 'Bbb', 'Cbbb'],
  ['Bb', 'A#', 'Cbb', 'G###'],
  ['B', 'A##', 'Cb', 'Dbbb']
];

export const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export enum noteDisplayOptions {
  none = 'None',
  notes = 'Notes',
  romanNumerals = 'Roman numerals'
}

export enum ringDisplayOptions {
  none = 'None',
  relations = 'Relations'
}

export enum collectionTypes {
  scale = 'Scale',
  chord = 'Chord'
}

export const modes = [
  { value: 0, text: 'Ionian' },
  { value: 1, text: 'Dorian' },
  { value: 2, text: 'Phrygian' },
  { value: 3, text: 'Lydian' },
  { value: 4, text: 'Mixolydian' },
  { value: 5, text: 'Aeolian' },
  { value: 6, text: 'Locrian' }
];

export const scaleIntervalsMap = {
	major: 'Major',
	minor: 'Minor',
	harmonicMinor: 'Harmonic minor',
	melodicMinor: 'Melodic minor',
	hungarianGypsyMinor: 'Hungarian gypsy minor',
	gypsy: 'Gypsy',
	neapolitanMinor: 'Neapolitan minor',
	neapolitanMajor: 'Neapolitan major',
	flamenco: 'Flamenco',
	phrygianDominant: 'Phrygian dominant',
	ukranianDorian: 'Ukranian dorian'
};

export const thirdsInversions = [
  '5-3',
  '6-3',
  '6-4'
];

export const susInversions = [
  '1st',
  '2nd',
  '3rd'
]

export const seventhInversions = [
  '7-5-3',
  '6-5-3',
  '6-4-3',
  '6-4-2'
]

export const chordNameMap = {
  major: 'Major',
  minor: 'Minor',
  diminished: 'Diminished',
  augmented: 'Augmented',
  majorDiminished: 'Major diminished',
  diminishedSus2: 'Diminished sus2',

  minorSeventh: 'Minor 7th',
  majorSeventh: 'Major 7th',
  dominantSeventh: 'Dominant 7th',
  halfDiminishedSeventh: 'Half-diminished 7th', // m7b5
  diminishedSeventh: 'Diminished 7th',
  minorMajorSeventh: 'Minor major 7th',

  augmentedSeventh: 'Augmented 7th',
  augmentedMajorSeventh: 'Augmented major 7th',
  dominantSeventhFlatFive: 'Dominant 7th flat 5', // 7b5
  diminishedMajorSeventh: 'Diminished major 7th',

  dominantSixFive: 'Dominant six five',
  halfDiminishedSixFive: 'Half-diminished six five',
  augmentedSixFive: 'Augmented six five', // Couldn't find this one anymore?!

  sus2: 'Sus2',
  sus4: 'Sus4'
}

export const shorthandMap = {
  // sus4: 'sus4',
  // sus2: 'sus2',

  major: '',
  minor: 'm',
  diminished: 'dim',
  augmented: '+',

  dominantSeventh: '7',
  majorSeventh: 'M7',
  minorSeventh: 'm7',
  minorMajorSeventh: 'mM7',
  halfDiminishedSeventh: 'ø',
  diminishedSeventh: '°',
  majorSixth: 'M6',
  minorSixth: 'm6'
};

export const denominatorMap = new Map([
  [1, '1m'],
  [2, '2n'],
  [4, '4n'],
  [8, '8n'],
  [16, '16n'],
  [32, '32n']
]);
