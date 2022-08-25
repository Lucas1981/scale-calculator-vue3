import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChordsPerNote from '../views/ChordsPerNote.vue';
import ChordForAllNotes from '../views/ChordForAllNotes.vue';
import Sequencer from '../views/Sequencer.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/chords-per-note',
      name: 'chordsPerNote',
      component: ChordsPerNote
    },
    {
      path: '/chord-for-all-notes',
      name: 'chordForAllNotes',
      component: ChordForAllNotes
    },
    {
      path: '/sequencer',
      name: 'sequencer',
      component: Sequencer
    }
  ]
})

export default router
