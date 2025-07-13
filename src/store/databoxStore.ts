import type { IOrderChangedResponse } from '@/types/dataShelf'

/**
 * این کامپوزیبل برای پیتشبانی از رصد تغییرات اتصال فیش به نود استفاده میشود
 * اگر فیش جدیدی به نود یا به درخت متصل شود مقدار تغییر میکند
 */
export const useDataShelfStateChanged = createGlobalState(
  () => {
    const lastState = ref(false)
    const connectednodeid = ref(0)

    return { lastState, connectednodeid }
  },
)

type priorityDirection = 'Top' | 'Down' | 'Never'

export const useDataShelfPriorityChanged = createGlobalState(
  () => {
    const items = ref<IOrderChangedResponse[]>([])

    const prioritydirection = ref<priorityDirection>('Never')

    return { items, prioritydirection }
  },
)
