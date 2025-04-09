import { createGlobalState, useStorage } from '@vueuse/core'
import type { ISimpleDTO, ISimpleTreeActionable } from '@/types/baseModels'
import { SimpleDTOModel, SimpleTreeAcionableModel, SimpleTreeModel } from '@/types/baseModels'
import { NodeType } from '@/types/tree'

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
    if (nodeItem.parentId && nodeItem.parentId !== -1) {
      if (!treeIndex[nodeItem.parentId].children)
        treeIndex[nodeItem.parentId].children = []

      treeIndex[nodeItem.parentId].children?.push(nodeItem)
    }
    else { treeData.push(nodeItem) }
    treeIndex[nodeItem.id] = nodeItem

    return true
  }

  function createTreeIndex(tree: ISimpleTreeActionable[]) {
    function populateIndex(nodes: ISimpleTreeActionable[]) {
      for (const node of nodes) {
        treeIndex[node.id] = node
        if (node.children)
          populateIndex(node.children)
      }
    }
    populateIndex(tree)
  }

  const deleteSingleLevelNodeFromParent = (nodeItem: ISimpleTreeActionable) => {
    if (nodeItem.parentId && nodeItem.parentId > 0 && treeIndex[nodeItem.parentId].children) {
      const findindex = treeIndex[nodeItem.parentId].children?.findIndex(item => item.id === nodeItem.id)

      if (treeIndex[nodeItem.parentId].children?.length === 1)
        treeIndex[nodeItem.parentId].children?.splice(0)
      else
        treeIndex[nodeItem.parentId].children?.splice(findindex ?? 0, 1)
      console.log('deletefromparent', findindex, nodeItem, treeIndex)

      if (treeIndex[nodeItem.parentId].children?.length === 0)
        treeIndex[nodeItem.parentId].children = null
    }
    else if (!nodeItem.parentId && nodeItem.parentId < 1) {
      const findindex = treeData.findIndex(item => item.id === nodeItem.id)

      treeData.splice(findindex ?? 0, 1)
    }
  }

  const deleteSingleLevelNode = (nodeItem: ISimpleTreeActionable) => {
    deleteSingleLevelNodeFromParent(nodeItem)
    delete treeIndex[nodeItem.id]
  }

  const deleteNode = (nodeItem: ISimpleTreeActionable, isRoot: boolean) => {
    // NOTE - 1- بررسی موجود بودن نود
    // NOTE - 2- بررسی اینکه نود پدر دارد یا نه
    // NOTE - 3- اگر پدر داشته باشد از فرزندان آن پدر حذف میشود در treeIndex
    // NOTE - 4- اگر پدر نداشته باشد از treeDataحذف  میشود
    // NOTE - 5- نهایتا نود از treeindex حذف میشود
    if (treeIndex[nodeItem.id]) {
      if (!isRoot) {
        if (treeIndex[nodeItem.id].children) {
          for (let itemIndex = 0; itemIndex < treeIndex[nodeItem.id].children.length; itemIndex++) {
            deleteNode(treeIndex[nodeItem.id].children[itemIndex], false)
            treeIndex[nodeItem.id].children?.splice(itemIndex, 1)
          }
          treeIndex[nodeItem.id].children = null
        }
        delete treeIndex[nodeItem.id]
      }
      else {
        deleteSingleLevelNode(nodeItem)
      }
    }
  }

  function countNodesAndFindDuplicates(
    nodes: ISimpleTreeActionable[],
  ): { count: number; duplicates: Set<number> } {
    const seen = new Set<number>()
    const duplicates = new Set<number>()

    function traverse(node: ISimpleTreeActionable) {
      // اگر نود قبلاً دیده شده باشد، آن را به دابلیکت‌ها اضافه کن
      if (seen.has(node.id))
        duplicates.add(node.id)
      else
        seen.add(node.id)

      // اگر نود فرزند داشته باشد، آن‌ها را نیز بررسی کن
      if (node.children) {
        for (const child of node.children)
          traverse(child)
      }
    }

    for (const node of nodes)
      traverse(node)

    return { count: seen.size, duplicates }
  }

  const mergeNode = (sourceNodeID: number, destinationNodeID: number) => {
    // NOTE - 1- چک کردن اینکه مبدا و مقصد وجود داشته باشند
    // NOTE - 2- چک کردن اینکه مقصد بچه داشته باشد
    // NOTE - 3- بررسی اینکه مبدا بچه داشته باشد
    // NOTE - 4-تغییر شناسه پدر فرزندان نود مبدا
    // NOTE - 4- افزودن بچه ها مبدا به مقصد
    // NOTE - 5- حذف نود مبدا
    // console.log('countmergebefore: ', countNodesAndFindDuplicates(treeData))
    if (treeIndex[sourceNodeID] && treeIndex[destinationNodeID]) {
      if (!treeIndex[destinationNodeID].children)
        treeIndex[destinationNodeID].children = []
      if (treeIndex[sourceNodeID].children) {
        // const tempdata = useCloned(treeIndex[sourceNodeID].children).cloned.value

        // deleteNode(treeIndex[sourceNodeID], true)
        // tempdata.forEach(item => item.parentId = destinationNodeID)
        treeIndex[sourceNodeID].children.forEach(item => item.parentId = destinationNodeID)

        setTimeout(() => {
        //   createTreeIndex(tempdata)
          treeIndex[destinationNodeID].children?.push(...treeIndex[sourceNodeID].children)

          deleteSingleLevelNode(treeIndex[sourceNodeID])

        //   console.log('countmergeafter: ', countNodesAndFindDuplicates(treeData))
        }, 1000)
      }
    }
  }

  const transferNode = (sourceNodeID: number, destinationNodeID: number, transfertype: NodeType) => {
    // NOTE - 1- چک کردن اینکه مبدا و مقصد وجود داشته باشند
    // NOTE - 2- چک کردن اینکه مقصد بچه داشته باشد
    // NOTE - 4- افزودن نود مبدا به بچه های مقصد
    // NOTE - 5- چک کردن پدر دار بودن نود مبدا
    // NOTE - 6- حذف نود مبدا از پدر
    // NOTE - 7- تغییر شناسه پدر نود مبدا
    // NOTE - 5- حذف نود مبدا
    if (sourceNodeID > 0 && destinationNodeID > 0 && treeIndex[destinationNodeID] && treeIndex[sourceNodeID]) {
    //   if (treeIndex[sourceNodeID].parentId === treeIndex[destinationNodeID].parentId) {
    //   let sourceArrayIndex = 0
      let destArrayIndex = 0

      //   let itemSourceTemp: ISimpleTreeActionable | undefined
      //   if (sourceArrayIndex === destArrayIndex - 1)
      //     return

      //   console.log('transferindex', sourceArrayIndex, destArrayIndex, Math.abs(sourceArrayIndex - destArrayIndex))

      deleteSingleLevelNodeFromParent(treeIndex[sourceNodeID])

      //   if (treeIndex[sourceNodeID].parentId && treeIndex[sourceNodeID].parentId > 0)
      //     sourceArrayIndex = treeIndex[treeIndex[sourceNodeID].parentId].children?.findIndex(item => item.id === sourceNodeID) ?? 0

      // itemSourceTemp = treeIndex[treeIndex[sourceNodeID].parentId].children?.splice(sourceArrayIndex, 1)[0]
      //   setTimeout(() => {
      if (treeIndex[destinationNodeID].parentId && treeIndex[destinationNodeID].parentId > 0 && treeIndex[sourceNodeID]) {
        destArrayIndex = treeIndex[treeIndex[destinationNodeID].parentId].children?.findIndex(item => item.id === destinationNodeID) ?? 0

        if (transfertype === NodeType.Children) {
          if (!treeIndex[destinationNodeID].children)
            treeIndex[destinationNodeID].children = []
          treeIndex[destinationNodeID].children?.push(treeIndex[sourceNodeID])
          treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].id
        }
        else { treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].parentId }
        if (transfertype === NodeType.SiblingAfter)
          treeIndex[treeIndex[destinationNodeID].parentId].children?.splice(destArrayIndex + 1, 0, treeIndex[sourceNodeID])
        if (transfertype === NodeType.SiblingBefore)
          treeIndex[treeIndex[destinationNodeID].parentId].children?.splice(destArrayIndex, 0, treeIndex[sourceNodeID])
      }
      else {
        destArrayIndex = treeData.findIndex(item => item.id === destinationNodeID) ?? 0

        if (transfertype === NodeType.Children) {
          if (!treeData[destArrayIndex].children)
            treeData[destArrayIndex].children = []
          treeData[destArrayIndex].children?.push(treeIndex[sourceNodeID])
          treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].id
        }
        else { treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].parentId }
        if (transfertype === NodeType.SiblingAfter)
          treeData.splice(destArrayIndex + 1, 0, treeIndex[sourceNodeID])
        if (transfertype === NodeType.SiblingBefore)
          treeData.splice(destArrayIndex, 0, treeIndex[sourceNodeID])
      }

      //   setTimeout(() => {
      //     console.log('countmergebefore: ', countNodesAndFindDuplicates(treeData))
      //   }, 2000)

      //   }, 1000)
    }
  }

  function isLastNode(nodeItem: ISimpleTreeActionable): boolean {
    if (nodeItem.parentId && nodeItem.parentId > 0 && treeIndex[nodeItem.parentId] && treeIndex[nodeItem.parentId].children)
      return treeIndex[nodeItem.parentId].children[treeIndex[nodeItem.parentId].children?.length - 1].id === nodeItem.id
    if (nodeItem.parentId == null || nodeItem.parentId <= 0)
      return treeData[treeData.length - 1].id === nodeItem.id

    return false
  }

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
    if (treeIndex[nodeItem.id])
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
    mergeNode,
    transferNode,
    createTreeIndex,
    isLastNode,
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
