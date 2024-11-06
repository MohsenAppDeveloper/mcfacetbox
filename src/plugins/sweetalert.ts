import 'sweetalert2/dist/sweetalert2.min.css';
import type { App } from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';

// Styles
// const { t } = useI18n({ useScope: 'global' })
const options = {
    showCancelButton: true,
    showConfirmButton: true
};
export default function (app: App) {
    app.use(VueSweetalert2, options)
}
