import type { App } from 'vue'
// Ensure Vuetify base styles are available when consumers import our CSS
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import MCFacetBox from './MCFacetBox.vue'
export * from './types'

export { MCFacetBox }

export default {
  install(app: App) {
    app.component('MCFacetBox', MCFacetBox)
  },
}
