/**

  For the functionality of this app, I actually don't need a store at this moment, but
  I'll keep it around in case I do and it's good to play around with it to understand how
  Pinia works.

*/

import { defineStore } from 'pinia'

export const useConfigStore = defineStore({
  id: 'config',
  state: () => ({
    thirdsInversion: 0,
    susInversion: 0,
    seventhInversion: 0,
    altInversion: 0
  }),
  actions: {
    setThirdsInversion(thirdsInversion) { this.thirdsInversion = thirdsInversion },
    setSusInversion(susInversion) { this.susInversion = susInversion },
    setSeventhInversion(seventhInversion) { this.seventhInversion = seventhInversion },
    setAltInversion(altInversion) { this.altInversion = altInversion }
  }
})
