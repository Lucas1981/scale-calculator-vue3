<script lang="ts" setup>
import { watchEffect, Ref } from 'vue';
import { states } from '@/components/chord-grid-states';

const getDisplay = chord => chord?.name || '';

const props = defineProps<{
  recording: any,
  state: any,
  computedWidth: any,
  stagedChords: any,
  denominator: Ref<number>,
  numerator: Ref<number>,
  cursor: Ref<number>
}>()
</script>

<template>
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
          @click="$emit('set-cursor', chordIndex)"
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
</template>

<style scoped>
.stage {
  height: 200px;
  overflow-y: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.stage::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.stage {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

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
</style>
