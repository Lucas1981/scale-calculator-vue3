<script setup lang="ts">
import { computed, ref } from 'vue'
import { modes, scaleIntervalsMap } from '@/components/consts.ts';
import scalesAndChords from '@/assets/scales-and-chords.json'
import Instrument from '@/components/instrument.vue';
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

const computedScale = computed(() => {
  const rawScale = scalesAndChords[key.value][scale.value].scale;
  return [
    ...rawScale.slice(mode.value),
    ...rawScale.slice(0, mode.value)
  ]
})
const computedChords = computed(() => {
  const rawChords = scalesAndChords[key.value][scale.value].chords;
  return [
    ...rawChords.slice(mode.value),
    ...rawChords.slice(0, mode.value)
  ]
})
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
      :scale="scalesAndChords[key][scale].scale"
      :mode="mode"
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
      :scale="scalesAndChords[key][scale].scale"
      :chords="scalesAndChords[key][scale].chords"
      :mode="mode"
      @stage-chord="stagedChord = $event"
      @play-notes="playNotes($event)"
    />
  </div>
</template>
