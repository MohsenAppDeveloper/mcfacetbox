import { createGlobalState } from '@vueuse/core'
import { isUndefined } from '@antfu/utils'
import type { ISimpleTreeActionable } from '@/types/baseModels'
import { SimpleTreeAcionableModel, SimpleTreeModel } from '@/types/baseModels'

export const useSelectedNode = createGlobalState(
  () => {
    const simpleTreeModelStored = reactive<SimpleTreeModel>(new SimpleTreeModel())

    return { simpleTreeModelStored }
  },
)
const treeData = reactive<ISimpleTreeActionable[]>([])
const treeIndex = reactive<Record<number, ISimpleTreeActionable>>({})
const selectedNode = reactive<ISimpleTreeActionable>(new SimpleTreeAcionableModel())
export function useTree() {
  const addNode = (nodeItem: ISimpleTreeActionable): boolean => {
    if (nodeItem.parentId === -1)
      return false
    if (isUndefined(treeIndex[nodeItem.parentId].children))
      treeIndex[nodeItem.parentId].children = []

    treeIndex[nodeItem.parentId].children?.push(nodeItem)
    treeIndex[nodeItem.id] = nodeItem

    return true
  }

  const selectNode = (nodeItem: ISimpleTreeActionable) => {
    selectedNode.id = nodeItem.id
    selectedNode.title = nodeItem.title
    selectedNode.parentId = nodeItem.parentId
  }

  return {
    treeData,
    treeIndex,
    selectedNode,
    addNode,
    selectNode,
  }
}

// const treeData = reactive<ISimpleTreeActionable[]>([])
// const treeIndex = reactive<Record<number, ISimpleTreeActionable>>({})

// export function useTreeData() {
//   return treeData
// }
// export function useTreeIndex() {
//   return treeIndex
// }

// export function addNode(nodeItem: ISimpleTreeActionable): boolean {
//   if (nodeItem.parentId === -1)
//     return false

//   if (isUndefined(treeIndex[nodeItem.parentId].children))
//     treeIndex[nodeItem.parentId].children = []
//   treeIndex[nodeItem.parentId].children?.push(nodeItem)
//   treeIndex[nodeItem.id] = nodeItem

//   return true
// }

// export function addNodeSibling(nodeItem: ISimpleTreeActionable, parentId: number): boolean {
//   if (nodeItem.parentId === -1)
//     return false
//   if (isUndefined(treeIndex[parentId].children))
//     treeIndex[parentId].children = []
//   treeIndex[parentId].children?.push(nodeItem)

//   return true
// }

// export const useSelectedNode = createGlobalState(
//     () => useStorage('selected-node', new SimpleTreeModel()),
// )
