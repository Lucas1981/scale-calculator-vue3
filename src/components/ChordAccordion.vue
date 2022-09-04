<script lang="ts" setup>
import { shorthandMap } from '@/components/consts.ts';

const allowedKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'F#', 'Ab', 'Db', 'Bb', 'Eb'];

const props = defineProps<{
  chords: any
}>()

const chordNames = Object.keys(props.chords)
  .filter(type => Object.keys(shorthandMap).includes(type))
  .map(name =>
    Object.values(props.chords[name])
      .filter(value => allowedKeys.includes(value[0]))
      .map(value => ({ name: `${value[0]}${shorthandMap[name]}`, value }))
  );
</script>

<template>
  <div class="d-flex chord-row" v-for="chordType in chordNames">
    <div
      class="chord"
      v-for="chord in chordType"
      @click="$emit('click', chord)"
      @mouseover="$emit('mouseover', chord.value)"
      @mouseout="$emit('mouseout')"
    >
      {{ chord.name }}
    </div>
  </div>
</template>

<style scoped>
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
</style>
