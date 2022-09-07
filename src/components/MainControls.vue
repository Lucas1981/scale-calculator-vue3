<script lang="ts" setup>
import chords from '@/assets/chords.json'
import scalesAndChords from '@/assets/scales-and-chords.json'
import { chordNameMap } from '@/components/consts.ts';

const scales = Object.keys(Object.values(scalesAndChords)[0]);
const keys = Object.keys(Object.values(chords)[0])
  .filter(name => name.length < 3);

const emit = defineEmits([
  'update:numerator',
  'update:denominator',
  'update:bpm',
  'change-time-signature'
])

const props = defineProps<{
  numerator: any,
  denominator: any,
  myKey: any,
  scale: any,
  bpm: any
}>()

const numerators = new Array(32).fill(null).map((_, index) => index);
const denominators = new Array(6).fill(null).map((_, index) => 2 ** index);

const handleChangeNumerator = event => {
  emit('update:numerator', parseInt(event.target.value))
  emit('change-time-signature');
}

const handleChangeDenominator = event => {
  emit('update:denominator', parseInt(event.target.value))
  emit('change-time-signature');
}
</script>

<template>
  <div class="d-flex align-items-center">
    <div class="me-2">Time:</div>
    <div>
      <select
        :value="numerator"
        name="numerator"
        class="form-select custom-input-width"
        @input="handleChangeNumerator"
      >
        <option v-for="value in numerators" :key="`numerator-${value}`" :value="value">
          {{ value }}
        </option>
      </select>
    </div>
    <div class="mx-1">/</div>
    <div>
      <select
        :value="denominator"
        name="denominator"
        class="form-select custom-input-width"
        @input="handleChangeDenominator"
      >
        <option v-for="value in denominators" :key="`denominator-${value}`" :value="value">
          {{ value }}
        </option>
      </select>
    </div>
    <div class="mx-2">BPM:</div>
    <input
      :value="bpm"
      type="number"
      @input="$emit('update:bpm', $event.target.value)"
      class="form-control custom-input-width"
    />
    <div class="mx-2">Key:</div>
    <div>
      <select
        :value="myKey"
        class="form-select"
        name="key"
        @input="$emit('update:my-key', $event.target.value)"
      >
        <option v-for="keyValue in keys">{{ keyValue }}</option>
      </select>
    </div>
    <div class="ms-1">
      <select
        :value="scale"
        class="form-select"
        name="key"
        @input="$emit('update:scale', $event.target.value)"
      >
        <option v-for="typeValue in scales" :value="typeValue">
          {{ chordNameMap[typeValue] || typeValue }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.custom-input-width {
  min-width: 4rem;
  max-width: 5rem;
}
</style>
