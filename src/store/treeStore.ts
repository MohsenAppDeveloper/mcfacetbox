import { SimpleTreeModel } from '@/types/baseModels'
import { createGlobalState } from '@vueuse/core'

export const useSelectedNode = createGlobalState(
    () => {
        const simpleTreeModelStored = reactive<SimpleTreeModel>(new SimpleTreeModel())
        return { simpleTreeModelStored }
    },
)

// export const useSelectedNode = createGlobalState(
//     () => useStorage('selected-node', new SimpleTreeModel()),
// )
