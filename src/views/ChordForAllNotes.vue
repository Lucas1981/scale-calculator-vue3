<script setup lang="ts">
import { computed, ref } from 'vue'
import chords from '@/assets/chords.json'
import { chordNameMap } from '@/components/consts.ts';
import { playNotes } from '@/components/play-note.js';

const types = Object.keys(chords);
const chordType = ref(types[0]);

const computedChords = computed(() =>
  Object.entries(chords[chordType.value])
    .filter(([key2]) => key2.length < 3)
    .map(([key2, value]) => ({
      name: `${value[0]} ${chordNameMap[chordType.value]}`,
      notes: value,
    })));
</script>

<template>
  <div class="container">
    <!-- Controls -->
    <div class="row mb-3">
      <div class="col-2">
        <label for="key" class="form-label">Type</label>
        <select class="form-select" v-model="chordType" name="key">
          <option v-for="typeValue in types" :value="typeValue">{{ chordNameMap[typeValue] || typeValue }}</option>
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
