import App from '@/App.vue';
import { registerPlugins } from '@core/utils/plugins';
import { createApp } from 'vue';
import Toast, { PluginOptions, POSITION } from "vue-toastification";
import noContextMenu from './utils/directives';

// Styles
import "@/assets/fonts/Vazir/vazirfont.css";
import '@core/scss/template/index.scss';
import '@styles/styles.scss';
import "vue-toastification/dist/index.css";




const options: PluginOptions = {
    rtl: true, timeout: 3000, position: POSITION.TOP_RIGHT,
    transition: "Vue-Toastification__fade", hideProgressBar: true
    // You can set your default options here
};


// Create vue app
const app = createApp(App)
// Register plugins
app.directive('no-context-menu', noContextMenu);
app.use(Toast, options)
registerPlugins(app)

// Mount vue app
app.mount('#app')
