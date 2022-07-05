<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  keyIndex, romanNumerals, noteDisplayOptions, ringDisplayOptions,
  collectionTypes
} from './consts.ts';
import { generateDrawTextFn, findRelationToRoot } from './helper-functions.ts';
import guitarImagePng from '@/assets/fretboard.png';
import blueDotPng from '@/assets/blue-dot.png';
import redDotPng from '@/assets/red-dot.png';
import orangeHoopPng from '@/assets/orange-hoop.png';
import yellowHoopPng from '@/assets/yellow-hoop.png';

// Consts

const guitarImage = new Image();
const blueDot = new Image();
const redDot = new Image();
const orangeHoop = new Image();
const yellowHoop = new Image();
const textOffset = 16;
const stepWidth = 32;
const stepHeight = 32;
const strings = 6;
const fretsPerLine = 24;
const tuning = [4, 11, 7, 2, 9, 4];
const props = defineProps<{
  scale: Array,
  chord: Array,
  mode: number,
  noteDisplayOption: noteDisplayOptions,
  ringDisplayOption: ringDisplayOptions
}>()

// Variables

let isBeingDestroyed = false;

// Refs

const canvas = ref('canvas');

// Methods

const drawText = generateDrawTextFn(textOffset, textOffset, stepWidth, stepHeight);
const getPosition = (notes, collection) => collection.findIndex(note => notes.includes(note))
const draw = (ctx, collection, primaryImage, secondaryImage, type, mode = 0) => {
  for(let j = 0; j < strings; j++) {
    const offset = tuning[j];
    for(let i = 0; i <= fretsPerLine; i++) {
      const notes = keyIndex[(i + offset) % keyIndex.length];
      if (collection.some(note => notes.includes(note))) {
        ctx.drawImage(
          getPosition(notes, collection) === mode ? primaryImage : secondaryImage,
          i * stepWidth,
          j * stepHeight
        );

        const index = collection.findIndex(note => notes.includes(note))

        if (type === collectionTypes.scale && props.noteDisplayOption !== noteDisplayOptions.none) {
          const name = props.noteDisplayOption === noteDisplayOptions.notes ? collection[index] : romanNumerals[index];
          drawText(ctx, name, i, j)
        }

        if(type === collectionTypes.chord && props.ringDisplayOption === ringDisplayOptions.relations) {
          const relation = findRelationToRoot(collection[0], collection[index], props.scale)
          drawText(
            ctx,
            relation === 0 ? 'R' : relation + 1,
            i,
            j + .38,
            'black'
          )
        }
      }
    }
  }
}

const drawScale = ctx => draw(ctx, props.scale, redDot, blueDot, collectionTypes.scale, props.mode)
const drawChord = ctx => draw(ctx, props.chord, orangeHoop, yellowHoop, collectionTypes.chord)
const drawGuitar = ctx => ctx.drawImage(guitarImage, 0, 0);

// Hooks

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  const refresh = () => {
    drawGuitar(ctx);
    drawScale(ctx);
    drawChord(ctx);
    if (!isBeingDestroyed) requestAnimationFrame(refresh)
  }

  refresh();
});

onBeforeUnmount(() => isBeingDestroyed = true);

// Initiation

guitarImage.src = guitarImagePng;
yellowHoop.src = yellowHoopPng;
orangeHoop.src = orangeHoopPng;
blueDot.src = blueDotPng;
redDot.src = redDotPng;
</script>

<template>
  <div>
    <canvas
      width="820"
      height="200"
      ref="canvas"
    ></canvas>
  </div>
</template>