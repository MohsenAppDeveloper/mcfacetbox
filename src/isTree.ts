import type { IFacetBox ,IFacetItem} from './types'
export const isTree = (items: IFacetBox) => {
  const map = new Map<string, IFacetItem>()

  // ایجاد یک مپ با کلید facetKey و مقدار آیتم
  items.itemList.forEach(item => {
    map.set(item.key, item)
  })

  // بررسی هر آیتم برای یافتن پدر خود
  for (const item of items.itemList) {
    if (item.parent) {
      const parentItem = map.get(item.parent.toString())
      if (parentItem?.key === item.key)
        return true

      // اگر پدر موجود نباشد، یا parent خود item برابر با facetKey خودش باشد (نداشتن پدر حقیقی)
      if (parentItem)
        return true
    }
  }

  return false
}