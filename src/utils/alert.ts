// src/utils/alert.ts
import Swal from 'sweetalert2'
import type { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import { i18nGlobal } from '@/plugins/i18n'

const t = i18nGlobal().t

const defaultSwalOptions: Partial<SweetAlertOptions> = {
  customClass: {
    popup: 'my-swal-popup',
    title: 'my-swal-title',
    confirmButton: 'my-swal-confirm',
    cancelButton: 'my-swal-cancel',
  },
  buttonsStyling: false,
}

export function showSwal(options: SweetAlertOptions): Promise<SweetAlertResult> {
  return Swal.fire({ ...defaultSwalOptions, ...options })
}

export const showLoadingSwal = (title: string, callback: () => Promise<void>) => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    showCloseButton: false,
    didOpen: async () => {
      Swal.showLoading()
      try {
        await callback()
        Swal.hideLoading()
        Swal.close()
      }
      catch (err) {
        Swal.hideLoading()
        Swal.close()
        throw err
      }
    },
  })
}

export const confirmSwal = (
  title: string,
  text: string,
  confirmText?: string,
  cancelText?: string,
  showLoaderOnConfirm?: boolean,
  icon: SweetAlertIcon = 'info',
  preConfirm?: () => Promise<any>,
): Promise<SweetAlertResult> => {
  return showSwal({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText || t('accept'),
    cancelButtonText: cancelText || t('cancel'),
    showLoaderOnConfirm,
    preConfirm,
  })
}
