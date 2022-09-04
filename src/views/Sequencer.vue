<script lang="ts" setup>
import ChordTable from '@/components/ChordTable.vue'
import rawChords from '@/assets/chords.json'
import { playNotes, scheduleChords, stopNotes, setBpm } from '@/components/play-note.js';
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import FileHandler from '@/classes/FileHandler.ts';
import Instrument from '@/components/Instrument.vue';
import { addSixthChords } from '@/components/helper-functions';
import { states } from '@/components/chord-grid-states';

// Static variables

const cellSize = 64;
const cellMargin = 4;
const barMargin = 16;
const chords = addSixthChords(rawChords);
const defaultBars = 12;
const denominatorMap = new Map([
  [1, '1m'],
  [2, '2n'],
  [4, '4n'],
  [8, '8n'],
  [16, '16n'],
  [32, '32n']
]);
const allowedKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'F#', 'Ab', 'Db', 'Bb', 'Eb'];
const numerators = new Array(32).fill(null).map((_, index) => index);
const denominators = new Array(6).fill(null).map((_, index) => 2 ** index);
const shorthandMap = {
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
}

const chordNames = Object.keys(chords)
  .filter(type => Object.keys(shorthandMap).includes(type))
  .map(name =>
    Object.values(chords[name])
      .filter(value => allowedKeys.includes(value[0]))
      .map(value => ({ name: `${value[0]}${shorthandMap[name]}`, value }))
  )

// Refs

const cursor = ref(0);
const fileInput = ref(null);
const maxWidth = 5 * 4 * cellSize;
const recording = ref(false);
const state = ref(states.stopped);
const numerator = ref(4);
const denominator = ref(4);
const bpm = ref(128);
const stagedChords = ref(new Array(numerator.value * defaultBars).fill(null));
const stagedChord = ref([]);
const prevChord = ref([]);

// Computed

const barLength = computed(() => {
  let unit = cellSize;

  if (denominator.value === 1){
    unit = cellSize * 4
  }

  if (denominator.value === 2) {
    unit = cellSize * 2;
  }

  return (numerator.value * (unit + cellMargin)) + barMargin;
});

const barsPerRow = computed(() => {
  return Math.floor(maxWidth / barLength.value) || 1;
})

const computedWidth = computed(() => {
  return barsPerRow.value * barLength.value;
})

const bars = computed(() => stagedChords.value.length / numerator.value);

// Methods

const stageChord = chord => {
  if (chord.value) playNotes(chord.value, 1, 0);

  if (state.value === states.recording) {
    stagedChords.value[cursor.value] = chord;
    return;
  }

  if (recording.value && state.value !== states.playing) {
    stagedChords.value[cursor.value] = chord;
    cursor.value++;
  }
}

const setChord = (index, chord) => {
  if (chord !== null) playNotes(chord.value, 1, 0);
  if (!recording.value) return;
  stagedChords.value[index] = chord;
}

const playSequence = (loop = false, record = false) => {
  state.value = record ? states.recording : states.playing;
  const chordSequence = [];
  // Give it one extra note to sound out properly and to determine if we need to loop
  [...stagedChords.value, null]
    .slice(cursor.value)
    .forEach((value, index) => {
      const subset = stagedChords.value.slice(index + 1);
      // Find the distance to the next chord
      const nextIndex = subset.findIndex(record => record);
      // If we did not find a next chord, let it sound out till the end of the sequence
      const duration = nextIndex === -1 ? subset.length + 1: nextIndex + 1;
      chordSequence.push({
        notes: value?.value || [],
        duration,
        index,
        offset: cursor.value
      })
    })

  setBpm(bpm.value);

  scheduleChords(
    chordSequence,
    cursor.value,
    bars.value,
    numerator.value,
    denominatorMap.get(denominator.value),
    ctx => {
      stagedChord.value = ctx.notes.length > 0 ? ctx.notes : stagedChord.value;
      if (ctx.index === chordSequence.length - 1) {
        stopSequence();
        if (loop) {
          playSequence(loop, record);
        }
      } else {
        cursor.value = ctx.index + ctx.offset;
      }
    });
}

const clearSequence = () => stagedChords.value.fill(null);

const pauseSequence = () => {
  stopNotes();
  state.value = states.stopped;
}

const stopSequence = () => {
  stopNotes();
  state.value = states.stopped;
  cursor.value = 0;
  showChord();
}

const recordSequence = () => {
  playSequence(true, true);
}

const handleSetCursor = index => {
  cursor.value = index;
  showChord();
}

const showChord = () => {
  stagedChord.value = stagedChords.value[cursor.value]?.value || [];
}

const addBar = () => {
  stagedChords.value = [
    ...stagedChords.value,
    ...new Array(numerator.value).fill(null)
  ]
}

const removeBar = () => {
  stagedChords.value
    .splice(stagedChords.value.length - numerator.value, numerator.value);

  if (cursor.value > stagedChords.value.length - 1) {
    cursor.value = stagedChords.value.length - 1;
  }
}

const getDisplay = chord => chord?.name || '';

const handleKeyInput = e => {
  // console.log(e);
  const base = numerator.value * bars.value;
  switch(e.key) {
    case 'ArrowUp':
      e.preventDefault();
      cursor.value = (base + cursor.value - numerator.value * barsPerRow.value) % base;
      showChord();
      break;
    case 'ArrowDown':
      e.preventDefault();
      cursor.value = (base + cursor.value + numerator.value * barsPerRow.value) % base;
      showChord();
      break;
    case 'ArrowLeft':
      cursor.value = (base + cursor.value - 1) % base
      showChord();
      break;
    case 'ArrowRight':
      cursor.value = (base + cursor.value + 1) % base
      showChord();
      break;
    case ' ': // Space
      e.preventDefault();
      stopNotes();
      state.value = states.stopped;
      recording.value = !recording.value;
      break;
    case 'Backspace':
      setChord(cursor.value, null);
      break;
    default:
      break;
  }
}

const handleSaveFile = () => {
    const filename = prompt('Enter filename');
    if (!filename) return;
    FileHandler.downloadJsonFile(filename, {
      numerator: numerator.value,
      denominator: denominator.value,
      bpm: bpm.value,
      stagedChords: stagedChords.value
    })
}

const handleLoadFile = () => {
  fileInput.value.click();
}

const loadFile = async event => {
  const data = await FileHandler.handleJsonFile(event);
  numerator.value = data.numerator;
  denominator.value = data.denominator;
  bpm.value = data.bpm;
  stagedChords.value = data.stagedChords;
  cursor.value = 0;
  showChord();
}

const handleChangeTimeSignature = () => {
  if (stagedChords.value % numerator.value !== 0) {
    stagedChords.value = [
      ...stagedChords.value,
      ...new Array(numerator.value - (stagedChords.value.length % numerator.value)).fill(null)
    ]
  }
}

// Hooks

onBeforeMount(() => {
  window.addEventListener('keydown', handleKeyInput);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyInput);
});
</script>

<template>
  <div class="container d-flex mb-2 justify-content-between">
    <div class="d-flex align-items-center">
      <div class="me-2">Time:</div>
      <div>
        <select name="time-signature" v-model="numerator" class="form-select custom-input-width" @change="handleChangeTimeSignature">
          <option v-for="value in numerators" :key="`numerator-${value}`" :value="value">
            {{ value }}
          </option>
        </select>
      </div>
      <div class="mx-1">/</div>
      <div>
        <select v-model="denominator" class="form-select custom-input-width" @change="handleChangeTimeSignature">
          <option v-for="value in denominators" :key="`denominator-${value}`" :value="value">
            {{ value }}
          </option>
        </select>
      </div>
      <div class="mx-2">BPM:</div>
      <input type="number" v-model="bpm" class="form-control custom-input-width"/>
    </div>
    <div>
      <button class="btn btn-primary" type="button" @click="handleSaveFile">Save file</button>
      <button class="btn btn-primary ms-2" type="button" @click="handleLoadFile">Load file</button>
      <input type="file" class="d-none" ref="fileInput" @change="loadFile($event)"/>
    </div>
  </div>
  <div
    class="background-black mb-2"
    :class="{
      'border-blue': recording && state !== states.recording,
      'border-red': state === states.recording
    }"
  >
    <div
      class="container py-3"
    >
      <div
        class="stage"
        :style="`width: ${computedWidth}px`"
      >
        <div
          class="chord-cell mb-2 position-relative"
          v-for="(chord, chordIndex) in stagedChords"
          :key="`chord-cell-${chordIndex}`"
          :class="{
            'chord-cell--whole-note': denominator === 1,
            'chord-cell--half-note': denominator === 2,
            'highlight': chordIndex === cursor,
            'next-bar': !(chordIndex % numerator)
          }"
          @click="handleSetCursor(chordIndex)"
        >
          <div
            v-if="chordIndex % numerator === 0"
            class="position-absolute chord-cell__chord-index"
          >
            {{ 1 + (chordIndex / numerator) }}
          </div>
          <div
            class="chord-cell__numerator"
            :class="{
              'highlight': chordIndex === cursor,
            }"
          >
            {{ 1 + (chordIndex % numerator) }}
          </div>
          <div class="position-absolute">{{ getDisplay(chord) }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="state === states.playing"
          @click="playSequence(false, false)"
        >
          Play
        </button>

        <button
          type="button"
          class="btn btn-primary ms-1"
          @click="pauseSequence"
        >
          Pause
        </button>

        <button
          type="button"
          class="btn btn-primary ms-1"
          @click="stopSequence"
        >
          Stop
        </button>

        <button
          type="button"
          class="btn btn-primary ms-1"
          :disabled="state === states.playing"
          @click="playSequence(true, false)"
        >
          Loop
        </button>

        <button
          type="button"
          class="btn btn-primary ms-1"
          @click="cursor = 0"
          :disabled="state === states.playing"
        >
          Rewind
        </button>

        <button
          type="button"
          class="btn btn-danger ms-1"
          :disabled="state === states.playing"
          @click="recordSequence"
        >
          Record
        </button>

        <button
          type="button"
          class="btn btn-danger ms-1"
          @click="clearSequence"
        >
          Clear
        </button>
      </div>

      <div>
        <button
          type="button"
          class="btn btn-primary"
          @click="addBar"
        >
          Add bar
        </button>

        <button
          type="button"
          class="btn btn-primary ms-1"
          @click="removeBar"
          :disabled="numerator >= stagedChords.length - 1"
        >
          Remove bar
        </button>
      </div>
    </div>

    <instrument
      :scale="stagedChord"
      :chord="[]"
      :show-options="false"
    />

    <div class="d-flex chord-row" v-for="chordType in chordNames">
      <div
        class="chord"
        v-for="chord in chordType"
        @click="stageChord(chord)"
        @mouseover="stagedChord = chord.value"
        @mouseout="showChord"
      >
        {{ chord.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.chord-cell {
  color: white;
  font-family: "Courier New", monospace;
  width: 64px;
  height: 2rem;
  margin-right: 4px;
  border-bottom: solid white 2px;
  float: left;
  line-height: 2.5rem;
}

.next-bar {
  margin-left: 16px;
}

.chord-cell--whole-note {
  width: 256px;
}

.chord-cell--half-note {
  width: 128px;
}

.chord-cell__chord-index,
.chord-cell__numerator {
  color: #aaa;
  position: absolute;
  font-size: 10px;
  left: 0;
}

.chord-cell__numerator {
  line-height: 1rem;
  top: 0;
}

.chord-cell__chord-index {
  line-height: 1rem;
  top: 21px;
  margin-left: -18px;
  text-align: right;
  width: 1rem;
}

/* .chord-cell:nth-child(4n + 1) {
  margin-left: 8px;
} */

.highlight {
  color: black;
  background: white;
}

.chord {
  width: 64rem;
  border: solid grey 1px;
  padding: 2px 4px;
  margin-right: 2px;
  cursor: pointer;
}

.chord-row {
  margin: 8px 0;
}

.background-black {
  background: black;
  border: black 10px solid;
  box-sizing: border-box;
}

.border-blue {
  border-color: blue;
}

.border-red {
  border-color: red;
}

.stage {
  height: 200px;
  overflow-y: scroll;
}

.custom-input-width {
  min-width: 4rem;
  max-width: 5rem;
}
</style>
