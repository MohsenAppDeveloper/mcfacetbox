import type { App } from 'vue'
import Notify from './MCNotify.vue'

const NotifyPlugin = {
  install(app: App, options = {}) {
    // ایجاد یک عنصر DOM برای نوتیفیکیشن
    const notifyElement = document.createElement('div')

    document.body.appendChild(notifyElement)

    // ایجاد یک اپلیکیشن محلی برای نوتیفیکیشن
    const notifyApp = createApp({
      render: () => h(Notify, { options }),
    })

    // نصب کامپوننت Notify و اضافه کردن آن به DOM
    notifyApp.mount(notifyElement)

    // تعریف متد $notify به عنوان متد جهانی
    app.config.globalProperties.$notify = (
      type: string = 'success',
      title: string | null = null,
      message: string | null = null,
      options: Record<string, any> = {},
    ) => {
      notifyApp.config.globalProperties.$notify.addItem(type, title, message, options)
    }
  },
}

export default NotifyPlugin
