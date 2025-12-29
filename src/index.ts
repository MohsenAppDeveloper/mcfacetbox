import type { App } from 'vue'
import MCFacetBox from './MCFacetBox.vue'
export * from './types'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export { MCFacetBox }

export default {
  install(app: App) {
    app.component('MCFacetBox', MCFacetBox)  
  },
}
