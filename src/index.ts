import type { App } from 'vue'
import MCFacetBox from './MCFacetBox.vue'
export * from './types'

export { MCFacetBox }

export default {
  install(app: App) {
    app.component('MCFacetBox', MCFacetBox)  
  },
}
