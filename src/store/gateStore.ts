import { createGlobalState, useStorage } from '@vueuse/core'
import type { ISimpleDTO, ISimpleSelectableDTO } from '@/types/baseModels'
import { SimpleDTOModel } from '@/types/baseModels'

export const useGateList = createGlobalState(
  () => useStorage<ISimpleSelectableDTO[]>('gl', []),
)

export const useSelectedGate = createGlobalState(() => {
  return useStorage<ISimpleDTO<number>>('sgi', new SimpleDTOModel(0, ''))
})
