<script lang="ts" setup>
import { keyIndex, shorthandMap, romanNumerals } from '@/components/consts.ts';
import scalesAndChords from '@/assets/scales-and-chords.json'
const keySequence = ['Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#'];
const emit = defineEmits(['click']);

const props = defineProps<{
  chords: any,
  myKey: any,
  scale: any
}>()

const notesInScale = chord => {
  return chord.value.every(note => {
    // Get the note and all its aliases
    const possibleKeys = keyIndex.find(record => record.includes(note));
    // See if the note or one of its aliases is in the scale
    return possibleKeys.some(alias =>
      scalesAndChords[props.myKey][props.scale].scale.includes(alias)
    );
  });
};

const chordNames = Object.keys(props.chords)
  .filter(type => Object.keys(shorthandMap).includes(type))
  .map(name =>
    Object.values(props.chords[name])
      .filter(value => keySequence.includes(value[0]))
      .map(value => ({ name: `${value[0]}${shorthandMap[name]}`, value }))
  );

const getRomanNumeral = note => {
  const possibleKeys = keyIndex.find(record => record.includes(note));
  // See if the note or one of its aliases is in the scale
  const index = scalesAndChords[props.myKey][props.scale].scale.findIndex(thisNote =>
    possibleKeys.includes(thisNote)
  );

  return index === -1 ? '' : romanNumerals[index];
};

const handleClickedChord = chord => {
  emit('click', chord.target.value)
}
</script>

<template>
  <div>
    <div class="d-flex">
      <div v-for="name in keySequence" class="roman">
        {{ getRomanNumeral(name) }}
      </div>
    </div>
    <div class="d-flex chord-row" v-for="chordType in chordNames">
      <div
        class="chord"
        :class="{
            'chord--red': !notesInScale(chord),
            'chord--green': notesInScale(chord)
        }"
        v-for="chord in chordType"
        @click="$emit('clicked', chord)"
        @mouseover="$emit('hovered', chord.value)"
        @mouseout="$emit('quit')"
      >
        {{ chord.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.roman,
.chord {
  width: 64rem;
  padding: 2px 4px;
  margin-right: 2px;
}

.roman {
  color: #666;
  font-size: 12px;
}

.chord {
  border: solid grey 1px;
  cursor: pointer;
}

.chord--red { background: rgba(255, 240, 240); }
.chord--green { background: rgba(240, 255, 240); }
/* .chord--green { background: rgba(0, 255, 0, 16); } */

.chord-row {
  margin: 8px 0;
}
</style>
