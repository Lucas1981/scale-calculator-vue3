<script setup lang="ts">
import { ref } from 'vue';
import {
  romanNumerals, thirdsInversions, seventhInversions, susInversions, chordNameMap
} from './consts.js';
import ScRadio from './Radio.vue';
import { playNotes } from '@/components/play-note.js';

// Consts

const playbackOptions = [
  { value: 0, text: 'Full chords' },
  { value: 0.15, text: 'Fast arpeggio' },
  { value: 0.3, text: 'Slow arpeggio' }
];

const invert = (notes, inversion) => [
  ...notes.slice(inversion),
  ...notes.slice(0, inversion)
]

// Refs

const showSusChords = ref(false)
const showAltChords = ref(false)
const thirdsInversion = ref(0)
const susInversion = ref(0)
const seventhInversion = ref(0)
const altInversion = ref(0)
const playback = ref(playbackOptions[0].value)
// Props

const props = defineProps<{
  scale: Array<string>,
  chords: any,
  mode: number
}>()
</script>

<template>
  <div class="d-flex align-items-center">
    <div class="me-4 mb-2">
      <label for="playback" class="form-label">Chord playback</label>
      <select class="form-select" v-model="playback" name="playback">
        <option v-for="option in playbackOptions" :value="option.value">{{ option.text }}</option>
      </select>
    </div>
    <div class="form-check me-2">
      <input v-model="showSusChords" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
      <label class="form-check-label" for="flexCheckDefault">
        Show sus chords
      </label>
    </div>
    <div class="form-check me-2">
      <input v-model="showAltChords" class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
      <label class="form-check-label" for="flexCheckChecked">
        Show alternate chords
      </label>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <table class="table table-bordered">
        <tbody>
          <tr class="custom-no-border">
            <td class="custom-no-border"></td>
            <td class="custom-no-border">
              <sc-radio
                v-model="thirdsInversion"
                name="thirdsInversions"
                :options="thirdsInversions"
              />
            </td>
            <td
              class="custom-no-border"
              v-if="showSusChords"
            >
              <sc-radio
                v-model="susInversion"
                name="susInversions"
                :options="susInversions"
              />
            </td>
            <td
              class="custom-no-border"
            >
              <sc-radio
                v-model="seventhInversion"
                name="seventhInversions"
                :options="seventhInversions"
              />
            </td>
            <td
              class="custom-no-border"
              v-if="showAltChords"
            >
              <sc-radio
                v-model="altInversion"
                name="altInversions"
                :options="seventhInversions"
              />
            </td>
          </tr>
          <tr
            v-for="(chord, index) in scale"
          >
            <td class="text-center">{{ romanNumerals[index] }}</td>
            <td
              class="u-cursor-pointer"
              @mouseenter="$emit('stage-chord',
                invert(chords.triadChords[(index + mode) % scale.length].notes, thirdsInversion)
              )"
              @mouseleave="$emit('stage-chord', [])"
            >
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="playNotes(
                  invert(chords.triadChords[(index + mode) % scale.length].notes, thirdsInversion), playback
                )"
              >
                Play
              </button>
              {{ chords.triadChords[(index + mode) % scale.length].notes[0] }}
              {{ chordNameMap[chords.triadChords[(index + mode) % scale.length].name] }}:
              {{ chords.triadChords[(index + mode) % scale.length].notes.join(', ') }}
            </td>
            <td v-if="showSusChords">
              <div
                v-for="chord in chords.susChords[(index + mode) % scale.length]"
                class="mb-1"
                @mouseenter="$emit('stage-chord', invert(chord.notes, susInversion))"
                @mouseleave="$emit('stage-chord', [])"
              >
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="playNotes(
                    invert(chord.notes, susInversion), playback
                  )"
                >
                  Play
                </button>
                {{ chord.notes[0] }}
                {{ chordNameMap[chord.name] }}:
                {{ chord.notes.join(', ') }}
              </div>
            </td>
            <td
              @mouseenter="$emit('stage-chord',
                invert(chords.seventhChords[(index + mode) % scale.length].notes, seventhInversion)
              )"
              @mouseleave="$emit('stage-chord', [])"
            >
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="playNotes(
                  invert(chords.seventhChords[(index + mode) % scale.length].notes, seventhInversion), playback
                )"
              >
                Play
              </button>
              {{ chords.seventhChords[(index + mode) % scale.length].notes[0] }}
              {{ chordNameMap[chords.seventhChords[(index + mode) % scale.length].name] }}:
              {{ chords.seventhChords[(index + mode) % scale.length].notes.join(', ') }}
            </td>
            <td v-if="showAltChords">
              <div
                v-for="chord in chords.alternateChords[(index + mode) % scale.length]"
                class="mb-1"
                @mouseenter="$emit('stage-chord',
                  invert(chord.notes, altInversion)
                )"
                @mouseleave="$emit('stage-chord', [])"
              >
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="playNotes(
                    invert(chord.notes, altInversion), playback
                  )"
                >
                  Play
                </button>
                {{ chord.notes[0] }}
                {{ chordNameMap[chord.type] || 'Unknown chord' }}:
                {{ chord.notes.join(', ')}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.custom-no-border {
  border-width: 0;
  border-style: none;
}
</style>
