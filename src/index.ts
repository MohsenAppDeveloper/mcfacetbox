import type { App } from 'vue'
import MCFacet from './MCFacet.vue'
export * from './types'

export { MCFacet }

export default {
  install(app: App) {
    app.component('MCFacet', MCFacet)  
  },
}
