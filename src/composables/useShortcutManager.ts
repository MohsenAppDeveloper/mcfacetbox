import { SHORTCUTKeys, ShortcutName } from '@/types/shortcutKeys'

export const useShortcutState = createGlobalState(() => {
  const lastShortcutTriggered = ref<ShortcutName | null>(null)

  return { lastShortcutTriggered }
})

function isComboMatch(combo: string, e: KeyboardEvent): boolean {
  const parts = combo.split('+')

  //   console.log('parts', parts, e.ctrlKey, e.key)

  const keyPart = parts.find(part =>
    !['Ctrl', 'Shift', 'Alt', 'Meta'].includes(part),
  )

  // بررسی modifier keys (ctrl, shift, alt, meta)
  const modifiersMatch = [
    ['Ctrl', e.ctrlKey],
    ['Shift', e.shiftKey],
    ['Alt', e.altKey],
    ['Meta', e.metaKey],
  ].every(([mod, pressed]) =>
    parts.includes(mod as string) ? pressed : !pressed,
  )

  // بررسی کلید اصلی
  const keyMatch = keyPart
    ? e.code.toLowerCase() === keyPart.toLowerCase()
    : true

  return modifiersMatch && keyMatch
}

export function useShortcutManager() {
  const { lastShortcutTriggered } = useShortcutState()
  const activeElement = useActiveElement()

  const notUsingInput = computed(() =>
    activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA')

  const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
      // بررسی تمام میانبرها برای جلوگیری از پیشفرض
      Object.entries(SHORTCUTKeys).forEach(([_, config]) => {
        if (isComboMatch(config.combo, e)) {
          console.log('prevent', config, e.key)

          e.preventDefault()

          e.stopPropagation()
        }
      })
    },
  })

  function registerAllShortcuts() {
    Object.entries(SHORTCUTKeys).forEach(([name, config]) => {
      whenever(keys[config.combo], () => {
        lastShortcutTriggered.value = name as ShortcutName
        setTimeout(() => {
          lastShortcutTriggered.value = ShortcutName.none
        }, 1000)
      })
    })
  }

  return {
    registerAllShortcuts,
    lastShortcutTriggered,
    SHORTCUTKeys,
  }
}
