<script setup lang="ts">
// Props

const props = defineProps<{
  name: String,
  modelValue: any,
  options: Array<string>
}>()
</script>

<template>
  <div
    v-for="(value, index) in options"
    :key="`flexRadioDefault-${name}-${index}`"
    class="form-check form-check-inline"
  >
    <input
      :value="value"
      class="form-check-input"
      type="radio"
      :name="`flexRadioDefault-${name}-${index}`"
      :id="`flexRadioDefault-${name}-${index}`"
      :checked="modelValue === index"
      @change="$emit('update:modelValue', index)"
    />
    <label class="form-check-label" :for="`flexRadioDefault-${name}-${index}`">
      {{ value }}
    </label>
  </div>
</template>
