<script lang="ts" setup>
import { states } from '@/components/chord-grid-states';

const props = defineProps<{
  state: any
}>()
</script>

<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="state === states.playing"
      @click="$emit('play')"
    >
      Play
    </button>

    <button
      type="button"
      class="btn btn-primary ms-1"
      @click="$emit('pause')"
    >
      Pause
    </button>

    <button
      type="button"
      class="btn btn-primary ms-1"
      @click="$emit('stop')"
    >
      Stop
    </button>

    <button
      type="button"
      class="btn btn-primary ms-1"
      :disabled="state === states.playing"
      @click="$emit('loop')"
    >
      Loop
    </button>

    <button
      type="button"
      class="btn btn-primary ms-1"
      @click="$emit('rewind')"
      :disabled="state === states.playing"
    >
      Rewind
    </button>

    <button
      type="button"
      class="btn btn-danger ms-1"
      :disabled="state === states.playing"
      @click="$emit('record')"
    >
      Record
    </button>

    <button
      type="button"
      class="btn btn-danger ms-1"
      @click="$emit('clear')"
    >
      Clear
    </button>
  </div>
</template>
