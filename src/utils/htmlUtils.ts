export function getSelectedTextWithinElement(element: HTMLElement): string {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return ''

  const range = selection.getRangeAt(0)
  const clonedRange = range.cloneRange()

  //   element.querySelectorAll<HTMLElement>('.no-select').forEach(el => el.remove())

  // بررسی اینکه آیا انتخاب در المان است
  if (!element.contains(range.startContainer) && !element.contains(range.endContainer))
    return ''

  // اگر شروع انتخاب قبل از المان باشد
  if (!element.contains(range.startContainer))
    clonedRange.setStart(element, 0)

  // اگر پایان انتخاب بعد از المان باشد
  if (!element.contains(range.endContainer))
    clonedRange.setEnd(element, element.childNodes.length)

  return clonedRange.toString().trim()
}
