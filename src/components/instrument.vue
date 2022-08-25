<script setup lang="ts">
import { ref } from 'vue'
import { noteDisplayOptions, ringDisplayOptions } from '@/components/consts';
import Piano from '@/components/Piano.vue'
import Guitar from '@/components/Guitar.vue'

// Consts

enum instruments {
  piano = 'piano',
  guitar = 'guitar'
}

// Refs

const instrument = ref(instruments.piano)
const noteDisplayOption = ref(noteDisplayOptions.notes)
const ringDisplayOption = ref(ringDisplayOptions.relations)
const stagedChord = ref([])

// Props

const props = defineProps<{
  scale: Array<string>,
  chord: any,
  showOptions: {
    type: Boolean,
    default: true
  }
}>()
</script>

<template>
  <div class="d-flex mt-3">
    <div>
      <piano
        v-if="instrument === instruments.piano"
        :scale="scale"
        :chord="chord"
        :note-display-option="noteDisplayOption"
        :ring-display-option="ringDisplayOption"
      />
      <guitar
        v-if="instrument === instruments.guitar"
        :scale="scale"
        :chord="chord"
        :note-display-option="noteDisplayOption"
        :ring-display-option="ringDisplayOption"
      />
    </div>
    <div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="instrument" v-model="instrument" :value="instruments.piano" />
        <label :for="instruments.piano" class="form-check-label" >Piano</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="instrument" v-model="instrument" :value="instruments.guitar" />
        <label :for="instruments.guitar" class="form-check-label" >Guitar</label>
      </div>
      <template v-if="showOptions">
        <label for="noteDisplay" class="form-label mt-2">Note display</label>
        <select class="form-select" v-model="noteDisplayOption" name="noteDisplay">
          <option v-for="option in noteDisplayOptions">
            {{ option }}
          </option>
        </select>
        <label for="ringDisplay" class="form-label mt-2">Ring display</label>
        <select class="form-select" v-model="ringDisplayOption" name="noteDisplay">
          <option v-for="option in ringDisplayOptions">
            {{ option }}
          </option>
        </select>
      </template>
    </div>
  </div>
</template>
