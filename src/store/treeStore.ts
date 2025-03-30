import { createGlobalState, useStorage } from '@vueuse/core'
import { isUndefined } from '@antfu/utils'
import type { ISimpleDTO, ISimpleTreeActionable } from '@/types/baseModels'
import { SimpleDTOModel, SimpleTreeAcionableModel, SimpleTreeModel } from '@/types/baseModels'

export const useSelectedNode = createGlobalState(
  () => {
    const simpleTreeModelStored = reactive<SimpleTreeModel>(new SimpleTreeModel())

    return { simpleTreeModelStored }
  },
)
export const useSelectedTree = createGlobalState(() => {
  return useStorage<ISimpleDTO<number>>('gtd', new SimpleDTOModel(0, ''))
})

const treeData = reactive<ISimpleTreeActionable[]>([])
const treeIndex = reactive<Record<number, ISimpleTreeActionable>>({})
const selectedNode = reactive<ISimpleTreeActionable>(new SimpleTreeAcionableModel())
export function useTree() {
  const addNode = (nodeItem: ISimpleTreeActionable): boolean => {
    console.log('newnode', nodeItem)

    // console.log('treeindex', treeIndex)
    if (nodeItem.parentId && nodeItem.parentId !== -1) {
      if (!treeIndex[nodeItem.parentId].children)
        treeIndex[nodeItem.parentId].children = []

      treeIndex[nodeItem.parentId].children?.push(nodeItem)
    }
    else { treeData.push(nodeItem) }
    treeIndex[nodeItem.id] = nodeItem
    console.log('treedata', treeData)
    console.log('treeindex', treeIndex)

    return true
  }

  const deleteNode = (nodeItem: ISimpleTreeActionable) => {
    if (treeIndex[nodeItem.id]) {
      if (nodeItem.parentId && nodeItem.parentId > 1 && treeIndex[nodeItem.parentId].children) {
        const findindex = treeIndex[nodeItem.parentId].children?.findIndex(item => item.id === nodeItem.id)

        treeIndex[nodeItem.parentId].children?.splice(findindex ?? 0, 1)
        if (treeIndex[nodeItem.parentId].children?.length === 0)
          treeIndex[nodeItem.parentId].children = null
      }
      else if (!nodeItem.parentId && nodeItem.parentId < 1) {
        const findindex = treeData.findIndex(item => item.id === nodeItem.id)

        treeData.splice(findindex ?? 0, 1)
      }
      delete treeIndex[nodeItem.id]
    }
    console.log('treedata', treeData)
    console.log('treeindex', treeIndex)
  }

  //   function createTreeIndex(tree: ISimpleTree[]): Record<number, ISimpleTree> {
  //     const index: Record<number, ISimpleTree> = {}

  //     function populateIndex(nodes: ISimpleTree[]) {
  //       for (const node of nodes) {
  //         index[node.id] = node
  //         if (node.children)
  //           populateIndex(node.children)
  //       }
  //     }
  //     populateIndex(tree)

  //     return index
  //   }

  const clearTreeData = () => {
    treeData.splice(0)
    Object.assign(treeIndex, [])
    Object.assign(selectedNode, new SimpleTreeAcionableModel())
  }

  const deselectAllTreeNodes = () => {
    for (const key in treeIndex) {
      if (treeIndex[key].selected)
        treeIndex[key].selected = false
    }
  }

  const selectNode = (nodeItem: ISimpleTreeActionable) => {
    treeIndex[nodeItem.id].selected = true
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
    clearTreeData,
    deselectAllTreeNodes,
    deleteNode,
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
