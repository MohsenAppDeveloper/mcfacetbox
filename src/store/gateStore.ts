import { createGlobalState, useStorage } from '@vueuse/core'
import type { ISimpleSelectableDTO } from '@/types/baseModels'

export const useGateList = createGlobalState(
  () => useStorage<ISimpleSelectableDTO[]>('gl', []),
)
