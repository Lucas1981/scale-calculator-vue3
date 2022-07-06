<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  keyIndex, romanNumerals, noteDisplayOptions, ringDisplayOptions,
  collectionTypes
} from './consts';
import { generateDrawTextFn, findRelationToRoot } from './helper-functions';
import pianoImagePng from '@/assets/piano.png';
import blueDotPng from '@/assets/blue-dot.png';
import redDotPng from '@/assets/red-dot.png';
import orangeHoopPng from '@/assets/orange-hoop.png';
import yellowHoopPng from '@/assets/yellow-hoop.png';

const pianoImage = new Image();
const blueDot = new Image();
const redDot = new Image();
const orangeHoop = new Image();
const yellowHoop = new Image();
const stepWidth = 27;
const stepHeight = 100;

// Consts

const pianoJumps = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26];
const pianoKeys = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const canvas = ref<any>(null);
const xOffset = 11;
const yOffset = 50;
const textOffsetX = 27;
const textOffsetY = 66;
const props = defineProps<{
  scale: Array<string>,
  chord: Array<string>,
  mode: number,
  noteDisplayOption: noteDisplayOptions,
  ringDisplayOption: ringDisplayOptions
}>()

// Variables

let isBeingDestroyed = false;

// Methods

const drawText = generateDrawTextFn(textOffsetX, textOffsetY, stepWidth, stepHeight);
const draw = (ctx, collection, primaryImage, secondaryImage, type, mode = 0) => {
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < collection.length; j++) {
      const pianoIndex = keyIndex.findIndex(arr => arr.includes(collection[j]));
      ctx.drawImage(
        j === mode ? primaryImage : secondaryImage,
        xOffset + (pianoJumps[pianoIndex + (i * 12)] * 27),
        yOffset + (pianoKeys[pianoIndex] * 100)
      );

      if(type === collectionTypes.scale && props.noteDisplayOption !== noteDisplayOptions.none) {
        // const index = collection.findIndex(note => notes.includes(note))
        const name = props.noteDisplayOption === noteDisplayOptions.notes ?
          collection[j] : romanNumerals[Math.abs(j - mode) % collection.length];
        drawText(
          ctx,
          name,
          pianoJumps[pianoIndex + (i * 12)],
          pianoKeys[pianoIndex]
        );
      }

      if(type === collectionTypes.chord && props.ringDisplayOption === ringDisplayOptions.relations) {
        const relation = findRelationToRoot(collection[0], collection[j], props.scale)
        drawText(
          ctx,
          relation === 0 ? 'R' : relation + 1,
          pianoJumps[pianoIndex + (i * 12)],
          pianoKeys[pianoIndex] + .12,
          'black'
        );
      }
    }
  }
}

const drawScale = ctx => draw(ctx, props.scale, redDot, blueDot, collectionTypes.scale, props.mode);
const drawChord = ctx => draw(ctx, props.chord, orangeHoop, yellowHoop, collectionTypes.chord)
const drawPiano = ctx => ctx.drawImage(pianoImage, 0, 0);

// Hooks

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  const refresh = () => {
    drawPiano(ctx);
    drawScale(ctx);
    drawChord(ctx);

    if (!isBeingDestroyed) requestAnimationFrame(refresh)
  }

  refresh();
});

onBeforeUnmount(() => isBeingDestroyed = true)

// Initiation

yellowHoop.src = yellowHoopPng;
orangeHoop.src = orangeHoopPng;
blueDot.src = blueDotPng;
redDot.src = redDotPng;
pianoImage.src = pianoImagePng;
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
