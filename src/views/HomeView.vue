<script setup lang="ts">
import { computed, ref } from 'vue'
import { modes, scaleIntervalsMap } from '@/components/consts';
import scalesAndChords from '@/assets/scales-and-chords.json'
import Instrument from '@/components/Instrument.vue';
import ChordTable from '@/components/ChordTable.vue'
import { playNotes } from '@/components/play-note.js';

// Consts

const keys = Object.keys(scalesAndChords);
const scales = Object.keys(Object.values(scalesAndChords)[0])

// Refs

const key = ref('E')
const scale = ref('major')
const mode = ref(modes[0].value)
const stagedChord = ref([])

// Computed

const computedMode = computed(() => {
  // @ts-ignore: Object is possibly 'undefined'.
  const foundKey = Object.entries(scalesAndChords)
    .find(([localKey, value]) =>
      value[scale.value].scale[mode.value] === key.value
    )[0]

  return scalesAndChords[foundKey][scale.value];
});

const computedScale = computed(() => {
  const raw = computedMode.value.scale;

  return [
    ...raw.slice(mode.value),
    ...raw.slice(0, mode.value)
  ];
})

const computedChords = computed(() => computedMode.value.chords);
</script>

<template>
  <div class="container">
    <!-- Controls -->
    <div class="row">
      <div class="col-2">
        <label for="key" class="form-label">Key</label>
        <select class="form-select" v-model="key" name="key">
          <option v-for="key in keys">{{ key }}</option>
        </select>
      </div>
      <div class="col-2">
        <label for="scale" class="form-label">Scale</label>
        <select class="form-select" v-model="scale" name="scale">
          <option v-for="value in scales" :value="value">{{ scaleIntervalsMap[value] }}</option>
        </select>
      </div>
      <div class="col-2">
        <label for="mode" class="form-label">Mode</label>
        <select class="form-select" v-model="mode" name="mode">
          <option v-for="mode in modes" :value="mode.value">{{ mode.text }}</option>
        </select>
      </div>
    </div>

    <instrument
      :scale="computedScale"
      :chord="stagedChord"
    />

    <p class="mt-2">
      Scale of {{ key }} {{ scaleIntervalsMap[scale].toLowerCase() }} in {{ modes[mode].text.toLowerCase() }} mode : {{ computedScale.join(', ') }}
      <button
        type="button"
        class="btn btn-primary btn-sm ms-1"
        @click="playNotes([...computedScale, computedScale[0]])"
      >
        Play
      </button>
    </p>

    <chord-table
      :scale="computedScale"
      :chords="computedChords"
      :mode="mode"
      @stage-chord="stagedChord = $event"
    />
  </div>
</template>
