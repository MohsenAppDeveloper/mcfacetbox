import { SimpleTreeModel } from '@/types/baseModels'
import { createGlobalState, useStorage } from '@vueuse/core'

export const useSelectedNode = createGlobalState(
    () => useStorage('selected-node', new SimpleTreeModel()),
)
