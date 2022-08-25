<script setup lang="ts">
import { computed, ref } from 'vue'
import chords from '@/assets/chords.json'
import { chordNameMap } from '@/components/consts.ts';
import { playNotes } from '@/components/play-note.js';

const keys = Object.keys(Object.values(chords)[0])
  .filter(name => name.length < 3);
const key = ref('C');

const computedChords = computed(() =>
  Object.entries(chords)
  .map(([key2, value]) => ({
    name: `${value[key.value][0]} ${chordNameMap[key2]}`,
    notes: value[key.value]
  }))
)
</script>

<template>
  <div class="container">
    <!-- Controls -->
    <div class="row mb-3">
      <div class="col-2">
        <label for="key" class="form-label">Key</label>
        <select class="form-select" v-model="key" name="key">
          <option v-for="keyValue in keys">{{ keyValue }}</option>
        </select>
      </div>
    </div>

    <div v-for="chord in computedChords" class="mb-2">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="playNotes(chord.notes)"
        >
          Play
        </button>
        {{ chord.name }}:
        {{ chord.notes.join(', ') }}
    </div>
  </div>
</template>
