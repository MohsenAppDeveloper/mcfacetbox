import { createGlobalState } from '@vueuse/core'
import type { ISimpleDTO } from '@/types/baseModels'
import { SimpleDTOModel, SimpleTreeModel } from '@/types/baseModels'
import { NodeRelationType, NodeType, SimpleNestedNodeAcionableModel } from '@/types/tree'
import type { type ISimpleNestedNodeActionable } from '@/types/tree'

export const useSelectedNode = createGlobalState(
  () => {
    const simpleTreeModelStored = reactive<SimpleTreeModel>(new SimpleTreeModel())

    return { simpleTreeModelStored }
  },
)
export const useSelectTreeNode = createGlobalState(
  () => {
    const treeNodeIdMustBeSelect = ref<number>(0)

    return { treeNodeIdMustBeSelect }
  },
)
export const useSelectedTree = createGlobalState(() => {
  return reactive<ISimpleDTO<number>>(new SimpleDTOModel(0, ''))
})

const treeData = reactive<ISimpleNestedNodeActionable[]>([])
const treeIndex = reactive<Record<number, ISimpleNestedNodeActionable>>({})
const selectedNode = reactive<ISimpleNestedNodeActionable>(new SimpleNestedNodeAcionableModel())

// const selecedTree = reactive<ISimpleDTO<number>>({id:0,title:0})
export function useTree() {
  const addNewNode = (nodeItem: ISimpleNestedNodeActionable, destinationNodeID: number, newNodeType: NodeType) => {
    /**
     * در مرحله اول بررسی میشود که نود جدید میخواد در ریشه اضافه شود و یا در فرزندان نودهای ریشه
     * اگر در ریشه باشد از treeData برای مدیریت استفاده میکنیم وگرنه از treeIndex استفاده میکنیم
     * مراحل زیر برای حالت افزودن نود به غیر از ریشه است :
     * 1- ایندکس نود مقصد برای افزودن شدن نود جدید پیرامون آن مشخص میشود
     * 2-اگر حال افزودن بعنوان فرزند باشد بررسی میشود که آیا نود مقصد دارای فرزند است یا نه، اگر نبود آرایه فرزندان آماده سازی میشود
     * 3-نود مبدا بعنوان مقصد نود فرزند افزوده میشود و شناسه پدر آن متناسب با نود جدید تغییر میکند
     * 4-اگر بعنوان فرزند نباشد شناسه پدر نود مبدا برابر با شناسه پدر نود مقصد میشود
     * 5-اگر حالت افزودن بعد از نود مقصد باشد ایندکس را بعلاوه یک میکنیم وگرنه در همان ایندکس اضافه میکنیم
     * مراحل زیر برای حالت افزودن نود در ریشه میباشد :
     * 1-تفاوت این حالت با حالت قبلی فقط این است که پدری وجود ندارد
     * 2-در این حالت اگر بعنوان فرزند اضافه شود در احرین ایندکس اضافه میشود
     * 3- اگر بعنوان قبل از اضافه شود بعنوان اولین نود ریشه اضافه میشود
     * 4-اگر بعنوان بعد از اضافه شود در جایگاه آخر بچه ها اضافه میشود
     */
    let destArrayIndex = 0

    if (destinationNodeID >= 1 && treeIndex[destinationNodeID].parentId && treeIndex[destinationNodeID].parentId > 0) {
      destArrayIndex = treeIndex[treeIndex[destinationNodeID].parentId].children?.findIndex(item => item.id === destinationNodeID) ?? 0

      if (newNodeType === NodeType.Children) {
        if (!treeIndex[destinationNodeID].children)
          treeIndex[destinationNodeID].children = []
        treeIndex[destinationNodeID].children?.push(nodeItem)
        nodeItem.parentId = treeIndex[destinationNodeID].id
      }
      else { nodeItem.parentId = treeIndex[destinationNodeID].parentId }
      if (newNodeType === NodeType.SiblingAfter)
        treeIndex[treeIndex[destinationNodeID].parentId].children?.splice(destArrayIndex + 1, 0, nodeItem)
      if (newNodeType === NodeType.SiblingBefore)
        treeIndex[treeIndex[destinationNodeID].parentId].children?.splice(destArrayIndex, 0, nodeItem)
    }
    else {
      destArrayIndex = treeData.findIndex(item => item.id === destinationNodeID) ?? 0

      //   console.log('destarray', destArrayIndex, destinationNodeID)
      if (newNodeType === NodeType.Children) {
        if (!treeData[destArrayIndex].children)
          treeData[destArrayIndex].children = []
        treeData[destArrayIndex].children?.push(nodeItem)
        nodeItem.parentId = destinationNodeID >= 0 ? treeIndex[destinationNodeID].id : -1
      }
      else { nodeItem.parentId = destinationNodeID >= 0 ? treeIndex[destinationNodeID].parentId : -1 }
      if (newNodeType === NodeType.SiblingAfter)
        treeData.splice(destArrayIndex > 0 ? destArrayIndex + 1 : treeData.length, 0, nodeItem)
      if (newNodeType === NodeType.SiblingBefore)
        treeData.splice(destArrayIndex > 0 ? destArrayIndex : 0, 0, nodeItem)
    }
  }

  const addNode = (nodeItem: ISimpleNestedNodeActionable, destinationNodeID: number, newNodeType: NodeType): boolean => {
    // console.log('nodeitem', nodeItem)

    // if (nodeItem.parentId && nodeItem.parentId > 0) {
    //   if (!treeIndex[nodeItem.parentId].children)
    //     treeIndex[nodeItem.parentId].children = []

    //   treeIndex[nodeItem.parentId].children?.push(nodeItem)
    // }
    // else { treeData.push(nodeItem) }
    addNewNode(nodeItem, destinationNodeID, newNodeType)
    treeIndex[nodeItem.id] = nodeItem

    return true
  }

  function createTreeIndex(tree: ISimpleNestedNodeActionable[]) {
    function populateIndex(nodes: ISimpleNestedNodeActionable[]) {
      for (const node of nodes) {
        treeIndex[node.id] = node
        if (node.children)
          populateIndex(node.children)
      }
    }
    populateIndex(tree)
  }

  const deleteSingleLevelNodeFromParent = (nodeItem: ISimpleNestedNodeActionable) => {
    /**
     * !SECTION
     * 1- بررسی میشود که آیا نود مورد نظر در یک parent وجود دارد یا نه؟
     * 1.5-اگر نود دارای پدر باشد از treeIndex استفاده میکنیم
     * 2- اگر نود پدر فقط همین یک فرزند را داشته باشد کلا آرایه فرزندان حذف میشود وگرنه قرزند مورد نظر از فرزند حذف میشود
     * 3- اگر بعد از حذف نود پدر دیگر دارای فرزند نباشد شیء children برابر با null میشود
     * 4-اگر نود مورد نظر پدر نداشته باشد به سراغ treedataمیرویم و از آن نود را حذف میکنیم
     */
    if (nodeItem.parentId && nodeItem.parentId > 0 && treeIndex[nodeItem.parentId].children) {
      const findindex = treeIndex[nodeItem.parentId].children?.findIndex(item => item.id === nodeItem.id)

      if (treeIndex[nodeItem.parentId].children?.length === 1)
        treeIndex[nodeItem.parentId].children?.splice(0)
      else
        treeIndex[nodeItem.parentId].children?.splice(findindex ?? 0, 1)

      //   console.log('deletefromparent', findindex, nodeItem, treeIndex)

      if (treeIndex[nodeItem.parentId].children?.length === 0)
        treeIndex[nodeItem.parentId].children = null
    }
    else if (!nodeItem.parentId && nodeItem.parentId < 1) {
      const findindex = treeData.findIndex(item => item.id === nodeItem.id)

      treeData.splice(findindex ?? 0, 1)
    }
  }

  const deleteSingleLevelNode = (nodeItem: ISimpleNestedNodeActionable) => {
    deleteSingleLevelNodeFromParent(nodeItem)
    delete treeIndex[nodeItem.id]
  }

  const deleteNode = (nodeItem: ISimpleNestedNodeActionable, isRoot: boolean) => {
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
    nodes: ISimpleNestedNodeActionable[],
  ): { count: number; duplicates: Set<number> } {
    const seen = new Set<number>()
    const duplicates = new Set<number>()

    function traverse(node: ISimpleNestedNodeActionable) {
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

  const increaseRelatedNode = (nodeid: number, relationtype: NodeRelationType) => {
    if (relationtype === NodeRelationType.relation)
      treeIndex[nodeid].relationCount = (treeIndex[nodeid].relationCount ?? 0) + 1

    else
      treeIndex[nodeid].referenceCount = (treeIndex[nodeid].referenceCount ?? 0) + 1
  }

  const decreaseRelatedNode = (nodeid: number, relationtype: NodeRelationType) => {
    if (relationtype === NodeRelationType.relation)
      treeIndex[nodeid].relationCount = (treeIndex[nodeid].relationCount ?? 0) === 0 ? treeIndex[nodeid].relationCount : treeIndex[nodeid].relationCount - 1

    else
      treeIndex[nodeid].referenceCount = (treeIndex[nodeid].referenceCount ?? 0) === 0 ? treeIndex[nodeid].referenceCount : treeIndex[nodeid].referenceCount - 1
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
    // NOTE - 2- حذف نود مبدا
    // NOTE - 4- افزودن نود مبدا به بچه ها یا برادر مقصد
    if (sourceNodeID > 0 && destinationNodeID > 0 && treeIndex[destinationNodeID] && treeIndex[sourceNodeID]) {
    //   if (treeIndex[sourceNodeID].parentId === treeIndex[destinationNodeID].parentId) {
    //   let sourceArrayIndex = 0
    //   const destArrayIndex = 0

      //   console.log('transferindex', sourceArrayIndex, destArrayIndex, Math.abs(sourceArrayIndex - destArrayIndex))

      deleteSingleLevelNodeFromParent(treeIndex[sourceNodeID])

      addNewNode(treeIndex[sourceNodeID], destinationNodeID, transfertype)

      //   if (treeIndex[destinationNodeID].parentId && treeIndex[destinationNodeID].parentId > 0 && treeIndex[sourceNodeID]) {
      //     destArrayIndex = treeIndex[treeIndex[destinationNodeID].parentId].children?.findIndex(item => item.id === destinationNodeID) ?? 0

      //     if (transfertype === NodeType.Children) {
      //       if (!treeIndex[destinationNodeID].children)
      //         treeIndex[destinationNodeID].children = []
      //       treeIndex[destinationNodeID].children?.push(treeIndex[sourceNodeID])
      //       treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].id
      //     }
      //     else { treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].parentId }
      //     if (transfertype === NodeType.SiblingAfter)
      //       treeIndex[treeIndex[destinationNodeID].parentId].children?.splice(destArrayIndex + 1, 0, treeIndex[sourceNodeID])
      //     if (transfertype === NodeType.SiblingBefore)
      //       treeIndex[treeIndex[destinationNodeID].parentId].children?.splice(destArrayIndex, 0, treeIndex[sourceNodeID])
      //   }
      //   else {
      //     destArrayIndex = treeData.findIndex(item => item.id === destinationNodeID) ?? 0

      //     if (transfertype === NodeType.Children) {
      //       if (!treeData[destArrayIndex].children)
      //         treeData[destArrayIndex].children = []
      //       treeData[destArrayIndex].children?.push(treeIndex[sourceNodeID])
      //       treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].id
      //     }
      //     else { treeIndex[sourceNodeID].parentId = treeIndex[destinationNodeID].parentId }
      //     if (transfertype === NodeType.SiblingAfter)
      //       treeData.splice(destArrayIndex + 1, 0, treeIndex[sourceNodeID])
      //     if (transfertype === NodeType.SiblingBefore)
      //       treeData.splice(destArrayIndex, 0, treeIndex[sourceNodeID])
      //   }

      //   setTimeout(() => {
      //     console.log('countmergebefore: ', countNodesAndFindDuplicates(treeData))
      //   }, 2000)

      //   }, 1000)
    }
  }

  function isLastNode(nodeItem: ISimpleNestedNodeActionable): boolean {
    if (nodeItem.parentId && nodeItem.parentId > 0 && treeIndex[nodeItem.parentId] && treeIndex[nodeItem.parentId].children)
      return treeIndex[nodeItem.parentId].children[treeIndex[nodeItem.parentId].children?.length - 1].id === nodeItem.id
    if (nodeItem.parentId == null || nodeItem.parentId <= 0)
      return treeData[treeData.length - 1].id === nodeItem.id

    return false
  }

  const clearTreeData = () => {
    treeData.splice(0)
    Object.assign(treeIndex, [])
    Object.assign(selectedNode, new SimpleNestedNodeAcionableModel())
  }

  const deselectAllTreeNodes = () => {
    for (const key in treeIndex) {
      if (treeIndex[key].selected)
        treeIndex[key].selected = false
    }
  }

  const getNodePath = (nodeItem: ISimpleNestedNodeActionable, nodepath: string = ''): string => {
    if (!nodeItem)
      return nodepath

    if (nodeItem.parentId && treeIndex[nodeItem.parentId]) {
      const parentPath = getNodePath(treeIndex[nodeItem.parentId])

      return `${parentPath} \\ ${nodeItem.title}`
    }

    return nodeItem.title
  }

  const selectNode = (nodeItem: ISimpleNestedNodeActionable) => {
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
    getNodePath,
    increaseRelatedNode,
    decreaseRelatedNode,
  }
}

// const treeData = reactive<ISimpleNestedNodeActionable[]>([])
// const treeIndex = reactive<Record<number, ISimpleNestedNodeActionable>>({})

// export function useTreeData() {
//   return treeData
// }
// export function useTreeIndex() {
//   return treeIndex
// }

// export function addNode(nodeItem: ISimpleNestedNodeActionable): boolean {
//   if (nodeItem.parentId === -1)
//     return false

//   if (isUndefined(treeIndex[nodeItem.parentId].children))
//     treeIndex[nodeItem.parentId].children = []
//   treeIndex[nodeItem.parentId].children?.push(nodeItem)
//   treeIndex[nodeItem.id] = nodeItem

//   return true
// }

// export function addNodeSibling(nodeItem: ISimpleNestedNodeActionable, parentId: number): boolean {
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
