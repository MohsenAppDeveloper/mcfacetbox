import 'sweetalert2/dist/sweetalert2.min.css'
import type { App } from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'

// Styles
// const { t } = useI18n({ useScope: 'global' })
const defaultSwalOptions = {
  customClass: {
    popup: 'my-swal-popup',
    title: 'my-swal-title',
    confirmButton: 'my-swal-confirm',
    cancelButton: 'my-swal-cancel',
  },
  buttonsStyling: false,
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
}

// const options = {
//   showCancelButton: true,
//   showConfirmButton: true,
// }

export default function (app: App) {
  app.use(VueSweetalert2, defaultSwalOptions)
}
