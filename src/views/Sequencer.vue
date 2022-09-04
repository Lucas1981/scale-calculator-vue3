<script lang="ts" setup>
import ChordTable from '@/components/ChordTable.vue'
import ChordGrid from '@/components/ChordGrid.vue';
import ChordAccordion from '@/components/ChordAccordion.vue';
import PlaybackControls from '@/components/PlaybackControls.vue';
import rawChords from '@/assets/chords.json'
import { playNotes, scheduleChords, stopNotes, setBpm } from '@/components/play-note.js';
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import FileHandler from '@/classes/FileHandler.ts';
import Instrument from '@/components/Instrument.vue';
import { addSixthChords } from '@/components/helper-functions';
import { states } from '@/components/chord-grid-states';
import { denominatorMap } from '@/components/consts.ts';

// Static variables

const cellSize = 64;
const cellMargin = 4;
const barMargin = 16;
const chords = addSixthChords(rawChords);
const defaultBars = 12;
const numerators = new Array(32).fill(null).map((_, index) => index);
const denominators = new Array(6).fill(null).map((_, index) => 2 ** index);

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

  <chord-grid
    :recording="recording"
    :state="state"
    :computedWidth="computedWidth"
    :staged-chords="stagedChords"
    :denominator="denominator"
    :numerator="numerator"
    :cursor="cursor"
    @set-cursor="handleSetCursor"
  />

  <div class="container">
    <div class="d-flex justify-content-between">
      <playback-controls
        :state="state"
        @play="playSequence(false, false)"
        @pause="pauseSequence"
        @stop="stopSequence"
        @loop="playSequence(true, false)"
        @rewind="cursor = 0"
        @record="recordSequence"
        @clear="clearSequence"
      />
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

    <chord-accordion
      :chords="chords"
      @click="stageChord($event)"
      @mouseover="stagedChord = $event"
      @mouseout="showChord"
    />
  </div>
</template>

<style scoped>
.custom-input-width {
  min-width: 4rem;
  max-width: 5rem;
}
</style>
