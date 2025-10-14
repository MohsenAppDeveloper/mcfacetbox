<script setup lang="ts">
import { VTreeview } from 'vuetify/labs/VTreeview'
import { useToast } from 'vue-toastification'
import ContextMenu from '@imengyu/vue3-context-menu'
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCLoading from '../MCLoading.vue'
import MCDialogTransferNode from '../dialogs/MCDialogTransferNode.vue'
import MCDialogTreePreview from '../dialogs/MCDialogTreePreview.vue'
import MCDialogNodeRelationList from '../dialogs/MCDialogNodeRelationList.vue'
import { type IRootServiceError, type ISimpleTree, MessageType, SizeType } from '@/types/baseModels'
import { NodeRelationType, NodeType, SimpleNestedNodeAcionableModel, createTreeIndex, getNodeTypeNameSpace } from '@/types/tree'
import type { ISimpleNestedNodeActionable, ISingleNodeView, ITree } from '@/types/tree'
import { useSelectTreeNode, useSelectedTree, useTree } from '@/store/treeStore'
import { SelectionType } from '@/types/baseModels'
import useRouterForGlobalVariables from '@/composables/useRouterVariables'
import { useShortcutManager } from '@/composables/useShortcutManager'
import { SHORTCUTKeys, ShortcutName } from '@/types/shortcutKeys'
import type { Rule } from '@/plugins/casl/ability'

const props = defineProps({
  title: { type: String },
})

const emit = defineEmits<Emit>()

const router = useRouter()
const route = useRoute()

// const emit = defineEmits<Emit>()
const treeview = ref()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const activatedNode = ref<number[]>([])
const openedNode = ref<number[]>([])
const isLoading = ref(false)
const searchbox = ref()
const selectedTreeStore = useSelectedTree()
const { treeData, treeIndex, selectNode, selectedNode, getNodePath, clearTreeData, deselectAllTreeNodes, deleteNode, transferNode, isLastNode } = useTree()
const currentTreeId = ref(0)
const nodeTempTitleForEdit = ref('')
const searchResultSelectedNodes = ref<number[]>([])
const hasDraggableState = ref(false)
const hasDividerDraggableBefore = ref(false)
const hasDividerDraggableAfter = ref(false)
const sourceDraggableItem = ref<ISimpleNestedNodeActionable | null>(null)
const activeDraggableItem = ref<ISimpleNestedNodeActionable | null>(null)
const editableNode = ref()
const activeSearch = shallowRef(false)
const dialogAddNewNodeVisible = ref(false)
const dialogMergeNodeVisible = ref(false)
const dialogDescriptionVisible = shallowRef(false)
const dialogTransferNodeVisible = shallowRef(false)
const dialogNodeRelationVisible = shallowRef(false)
const dialogTreeNodeStats = shallowRef(false)
const dialogNodeRelationListVisible = shallowRef(false)
const treeBlockSize = ref(230)
const dialognoderelationlist = ref(VDialog)

const activeTooltipPath = shallowRef('')
const ability = useAbility()
const { routerTreeId, routerNodeId, clearUnNeededQueryItems, addTreeIdToQuery, addNodeIdToQuery } = useRouterForGlobalVariables()
const { treeNodeIdMustBeSelect } = useSelectTreeNode()
interface Emit {
  (e: 'close'): void
  (e: 'open'): void
  (e: 'showSelectTree'): void
}
const { x: cursorX, y: cursorY } = usePointer()
const { lastShortcutTriggered } = useShortcutManager()
const { rules, can } = useAbility()

// نمایش Tooltip هنگام کلیک
const showNodeTooltip = (item: number[]) => {
  console.log('activatednode:', item[0])

  const tempItem = treeIndex[activatedNode.value[0]]

  nextTick(() => {
    activeTooltipPath.value = getNodePath(tempItem, '')
    if (activatedNode.value.includes(tempItem.id))
      dialogDescriptionVisible.value = true
  })
}

const { height: searchBoxHeight } = useElementSize(searchbox)

// حداکثر تعداد نودهای باز مجاز (برای بهینه‌سازی عملکرد)
const MAX_OPEN_NODES = 100

// تابع بارگذاری فرزندان از treeIndex
const loadChildren = (item: any): Promise<void> => {
  return new Promise<void>((resolve) => {
    const nodeInIndex = treeIndex[item.id]

    if (nodeInIndex?.children?.length > 0) {
      // فرزندان را از treeIndex برمی‌گردانیم و برای هر کدام یک کپی ایجاد می‌کنیم
      const children = nodeInIndex.children.map((child: ISimpleNestedNodeActionable) => {
        const childCopy = useCloned(treeIndex[child.id]).cloned.value
        const hasGrandchildren = childCopy.children?.length > 0
        childCopy.children = hasGrandchildren ? [] : undefined
        return childCopy
      })

      item.children = children

      // محدود کردن تعداد نودهای باز برای جلوگیری از کندی
      if (openedNode.value.length > MAX_OPEN_NODES) {
        // حذف قدیمی‌ترین نودهای باز (به جز والدین نود فعلی)
        const currentNodeParents = new Set<number>()
        let tempNode = treeIndex[item.id]
        while (tempNode?.parentId) {
          currentNodeParents.add(tempNode.parentId)
          tempNode = treeIndex[tempNode.parentId]
        }

        // نگه داشتن فقط MAX_OPEN_NODES نود جدید و والدین نود فعلی
        const nodesToKeep = openedNode.value.filter(id =>
          currentNodeParents.has(id) || openedNode.value.indexOf(id) >= openedNode.value.length - MAX_OPEN_NODES
        )
        openedNode.value = nodesToKeep
      }
    } else {
      item.children = []
    }

    resolve()
  })
}

// watch(activatedNode, () => {
//   dialogDescriptionVisible.value = false
//   showNodeTooltip(activatedNode.value)
// })
watch(treeNodeIdMustBeSelect, newval => {
  if (newval > 0) {
    selectTreeNode({ id: newval, parentId: 0, priority: 0, title: '' })
    treeNodeIdMustBeSelect.value = 0
  }
})
watch(lastShortcutTriggered, newval => {
//   console.log('shortcutvalue', newval)
  if (newval === ShortcutName.nodesearch)
    activeSearch.value = !activeSearch.value
  if (newval === ShortcutName.nodenew)
    dialogAddNewNodeVisible.value = true
})
watch(currentTreeId, async (newval, oldVal) => {
  if (newval !== oldVal)
    await refreshTree()
})
watch(searchResultSelectedNodes, () => {
  activatedNode.value.splice(0)
  activatedNode.value.push(...searchResultSelectedNodes.value)
  gotoNode(searchResultSelectedNodes.value[0], false)
})
watch(route, () => {
  checkTreeRoute(true)
}, { immediate: true })

onMounted(async () => {
  if (routerTreeId.value > 0)
    await setPermissions()
})

const setPermissions = async (): Promise<boolean> => {
  try {
    const permissionDataResult = await $api<Rule[]>(`app/tree/${currentTreeId.value}/user/permissions`)

    useCookie('userAbilityRules').value = JSON.stringify(permissionDataResult)
    ability.update(permissionDataResult)

    return true
  }
  catch (error) {
    return false
  }
}

const selectTreeNode = (item: ISimpleNestedNodeActionable) => {
  const newQuery = { ...route.query }

  clearUnNeededQueryItems(newQuery)

  addTreeIdToQuery(currentTreeId.value, newQuery)
  if (item.id > 0)
    addNodeIdToQuery(item.id, newQuery)

  router.replace({ query: newQuery })
}

function checkTreeRoute(deselectAll: boolean) {
  if (routerTreeId.value === 0) {
    emit('showSelectTree')
    toast.warning(t('alert.nothaveselecttree'))

    return
  }
  if (currentTreeId.value === routerTreeId.value) {
    if (selectedNode.id !== 0 && treeIndex[selectedNode.id])
      treeIndex[selectedNode.id].selected = false
    else if (deselectAll)
      deselectAllTreeNodes()
    console.log('routernodeid', routerNodeId.value)

    if (routerNodeId.value === 0) {
      selectNode(treeIndex[-currentTreeId.value])
      gotoNode(useToNumber(-currentTreeId.value).value)
    }
    else {
      selectNode(treeIndex[routerNodeId.value])
      gotoNode(routerNodeId.value)
    }
  }

  currentTreeId.value = routerTreeId.value
}
function selectSearchTree() {
  activeSearch.value = !activeSearch.value
}
function updateTreeIndex(dataItems: ISimpleTree[]) {
  const newTreeIndex = createTreeIndex(dataItems)

  // به‌روزرسانی مقادیر در treeIndex
  Object.assign(treeIndex, { ...newTreeIndex })
}
function handleDataBoxMessages(message: string, messagetype: MessageType) {
  switch (messagetype) {
  case MessageType.error:
    toast.error(message)
    break;
  case MessageType.info:
    toast.info(message)
    break;
  case MessageType.warning:
    toast.warning(message)
    break;
  case MessageType.success:
    toast.success(message)
    break;
  default:
    break;
  }
}

const openParents = (nodeItems: ISimpleTree[], id: number) => {
  for (const item of nodeItems) {
    if (item.id === id) {
      activatedNode.value = [id]

      return true
    }
    if (item.children && openParents(item.children, id)) {
      openedNode.value.push(item.id)

      return true
    }
  }

  return false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'F2' && activatedNode.value.length > 0)
    nodeEditStart()
  if (event.key === 'Escape')
    resetMouseDraggable()
}
function nodeEditStart() {
  if (isValidActivateNode()) {
    nodeTempTitleForEdit.value = treeIndex[activatedNode.value[0]].title
    treeIndex[activatedNode.value[0]].editing = true
    treeIndex[activatedNode.value[0]].tempData = useCloned(treeIndex[activatedNode.value[0]].title).cloned.value
  }
}
function handleTreeViewKeydown(event: KeyboardEvent) {
//   if (event.key === ' ') {
//     event.preventDefault()
//     event.stopPropagation()
//   }
}
function nodeEditCancel(nodeitem: ISimpleNestedNodeActionable) {
  nodeitem.loading = nodeitem.editing = false
  nodeitem.failed = false
  nodeitem.title = useCloned(nodeitem.tempData).cloned.value
  treeview.value.$el.focus()
}
async function nodeEditProgress(nodeitem: ISimpleNestedNodeActionable, nodetitle: string) {
  nodeitem.loading = true
  try {
    await $api(`app/node/${nodeitem.id}/title`, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify({ title: nodetitle })),
      ignoreResponseError: false,
    })

    nodeitem.loading = nodeitem.editing = false
    setTimeout(() => {
      treeIndex[nodeitem.id].title = nodetitle
      if (selectedNode.id > 0 && nodeitem.id === selectedNode.id)
        selectedNode.title = nodetitle

      treeview.value.$el.focus()
      gotoNode(nodeitem.id, false)
    }, 1000)
  }
  catch (error) {
    nodeitem.loading = false
    nodeitem.failed = true
    if (error instanceof CustomFetchError && error.message)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
}
function handleEditableNodeKeydown(event: KeyboardEvent, item: ISimpleNestedNodeActionable) {
  switch (event.key) {
    case ' ':
    event.stopPropagation()
      break;
    case 'Enter':
      event.stopPropagation()
      nodeEditProgress(item, nodeTempTitleForEdit.value)
      break;
    case 'Escape':
      if (item.loading)
        break;
    nodeEditCancel(item)
      break;
    default:
      break;
  }
}
async function gotoNode(nodeId: number, mustSelectNode: boolean = true) {
  if (nodeId > 0 && treeIndex[nodeId]) {
    treeIndex[nodeId].selected = mustSelectNode

    // برای lazy loading، ابتدا باید تمام والدین را از treeIndex پیدا کنیم
    const parentIds: number[] = []
    let currentNode = treeIndex[nodeId]
    while (currentNode && currentNode.parentId && currentNode.parentId > 0 && treeIndex[currentNode.parentId]) {
      parentIds.unshift(currentNode.parentId)
      currentNode = treeIndex[currentNode.parentId]
    }

    // والدین را به ترتیب باز می‌کنیم تا فرزندان بارگذاری شوند
    for (const parentId of parentIds) {
      if (!openedNode.value.includes(parentId)) {
        openedNode.value.push(parentId)
        // کمی صبر می‌کنیم تا loadChildren اجرا شود
        await nextTick()
      }
    }

    // حالا نود را فعال می‌کنیم
    activatedNode.value = [nodeId]

    // و اسکرول می‌کنیم
    await nextTick()
    const activeNode = document.querySelector('.tree-view-scroll .v-list .v-list-item--active')
    if (activeNode)
      activeNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const deleteSelectedNode = async (nodeItem: ISimpleNestedNodeActionable) => {
  const title = formatString(t('alert.specificItemDeleted'), nodeItem.title)
  const serviceError = shallowRef()

  const result = await confirmSwal(
    title,
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api(`app/node/${nodeItem.id}`, {
          method: 'DELETE',
        })
        deleteNode(nodeItem, true)
      }
      catch (error) {
        serviceError.value = error
      }

      return { serviceError }
    },
  )

  if (result.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        toast.error(err.message)
      else toast.error(t('httpstatuscodes.0'))
    }
    else {
      clearActivateNode()
      toast.success(t('alert.deleteDataSuccess'))
    }
  }
}

function clearActivateNode() {
  selectNode({ id: -1, parentId: -1, priority: 0, title: '' })
  activatedNode.value.splice(0)
}
function isValidActivateNode(): boolean {
  return !!(activatedNode.value.length > 0 && treeIndex[activatedNode.value[0]])
}

const nodeItemAdded = (nodeItem: ISimpleNestedNodeActionable) => {
  toast.success(formatString(t('alert.specificNodeAdded'), nodeItem.title))
}

const nodeaddfailed = (message: string) => {
  toast.error(message)
}

const parentNodeTitle = (nodeid: number | null): string => {
  if (nodeid && treeIndex[nodeid] && treeIndex[nodeid].parentId && treeIndex[treeIndex[nodeid].parentId])
    return treeIndex[treeIndex[nodeid].parentId].title
  else
    return ''
}

const nodeMerged = (sourceNodeId: number, destinationNodeID: number) => {
  if (treeIndex[destinationNodeID]) {
    selectNode({ id: treeIndex[destinationNodeID].id, parentId: treeIndex[destinationNodeID].parentId, title: treeIndex[destinationNodeID].title, priority: treeIndex[destinationNodeID].priority })
    gotoNode(destinationNodeID)
  }
}

const nodeTransfered = (sourceNodeId: number, destinationNodeID: number) => {
//   if (treeIndex[destinationNodeID]) {
//     selectNode({ id: treeIndex[destinationNodeID].id, parentId: treeIndex[destinationNodeID].parentId, title: treeIndex[destinationNodeID].title, priority: treeIndex[destinationNodeID].priority })
//     gotoNode(destinationNodeID)
//   }
}

function treeDividerMouseLeave(mouseEvent: MouseEvent, transfertype: NodeType) {
  if (transfertype === NodeType.SiblingBefore)
    hasDividerDraggableBefore.value = false

  if (transfertype === NodeType.SiblingAfter)
    hasDividerDraggableAfter.value = false
}
function treeDividerMouseEnter(transfertype: NodeType) {
  if (transfertype === NodeType.SiblingBefore)
    hasDividerDraggableBefore.value = true

  if (transfertype === NodeType.SiblingAfter)
    hasDividerDraggableAfter.value = true
}
function treeDividerMouseUp(mouseEvent: MouseEvent, treeItem: ISimpleNestedNodeActionable, transfertype: NodeType) {
  if (sourceDraggableItem.value && sourceDraggableItem.value.id !== treeItem.id && activeDraggableItem.value)
    transferNodeWithDraggableMouse(transfertype, sourceDraggableItem.value, activeDraggableItem.value)
}
function treeItemMouseDown(mouseEvent: MouseEvent, treeItem: ISimpleNestedNodeActionable) {
  hasDraggableState.value = true

  sourceDraggableItem.value = treeItem
}
function treeItemMouseLeave(mouseEvent: MouseEvent, treeItem: ISimpleNestedNodeActionable) {
  if (mouseEvent.buttons === 0)
    resetMouseDraggable()

  if (sourceDraggableItem.value && sourceDraggableItem.value.id === treeItem.id) {
    activatedNode.value.splice(0)
    activatedNode.value.push(treeItem.id)
  }
}
function treeItemMouseEnter(mouseEvent: MouseEvent, treeItem: ISimpleNestedNodeActionable) {
  if (mouseEvent.buttons === 0)
    resetMouseDraggable()
  if (!can('Move', 'Node'))
    return
  if (hasDraggableState.value) {
    activeDraggableItem.value = treeItem
    setTimeout(() => {
      if (activeDraggableItem.value?.id === treeItem.id && !openedNode.value.includes(treeItem.id))
        openedNode.value.push(treeItem.id)
    }, 2000)
  }
}
function treeItemMouseUp(mouseEvent: MouseEvent, treeItem: ISimpleNestedNodeActionable) {
  if (sourceDraggableItem.value && sourceDraggableItem.value.id !== treeItem.id && activeDraggableItem.value)
    transferNodeWithDraggableMouse(NodeType.Children, sourceDraggableItem.value, activeDraggableItem.value)
}
async function transferNodeWithDraggableMouse(transfertype: NodeType, sourceNodeItem: ISimpleNestedNodeActionable, destinationNodeItem: ISimpleNestedNodeActionable) {
  const title = formatString(t(`${transfertype === NodeType.Children ? 'alert.transfernodeaschild' : (transfertype === NodeType.SiblingAfter ? 'alert.transfernodeasbrotherafter' : 'alert.transfernodeasbrotherbefore')}`), sourceNodeItem.title, destinationNodeItem.title)
  const serviceError = shallowRef()

  const result = await confirmSwal(
    title,
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api(`app/node/${sourceNodeItem.id}/move/${getNodeTypeNameSpace(transfertype)}/${destinationNodeItem.id}`, {
          method: 'PUT',
          ignoreResponseError: false,
        })
        transferNode(sourceNodeItem.id, destinationNodeItem.id, transfertype)
      }
      catch (error) {
        serviceError.value = error
      }

      return { serviceError }
    },
  )

  if (result.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        toast.error(err.message)
      else toast.error(t('alert.probleminnodeaddrefreshpage'))
    }
    else {
      resetMouseDraggable()
    }
  }
}
function resetMouseDraggable() {
  hasDraggableState.value = false
  hasDividerDraggableBefore.value = false
  hasDividerDraggableAfter.value = false
  sourceDraggableItem.value = null
  activeDraggableItem.value = null
}

const refreshTree = async () => {
  try {
    isLoading.value = true

    const { data } = await useApi<ITree | any>(createUrl(`app/node/hierarchy/${currentTreeId.value}`), { refetch: false })

    if (data.value && data.value.error) {
      const errorResult = data.value as IRootServiceError

      toast.error(errorResult.error.message)

      return
    }

    activatedNode.value.splice(0)
    clearTreeData()

    selectedTreeStore.id = data.value.id
    selectedTreeStore.title = data?.value.title
    if (!data.value.nodes || data.value.nodes <= 0)
      return

    // ابتدا treeIndex را با تمام نودها پر می‌کنیم
    updateTreeIndex(data.value.nodes)

    // سپس فقط نودهای ریشه را به treeData اضافه می‌کنیم
    // از useCloned استفاده می‌کنیم تا رفرنس جدید ایجاد شود و treeIndex تغییر نکند
    data.value.nodes.forEach((node: ISimpleNestedNodeActionable) => {
      const nodeFromIndex = useCloned(treeIndex[node.id]).cloned.value
      if (nodeFromIndex) {
        // اگر فرزند دارد، یک آرایه خالی قرار می‌دهیم تا آیکون expand نمایش داده شود
        const hasChildren = nodeFromIndex.children && nodeFromIndex.children.length > 0
        nodeFromIndex.children = hasChildren ? [] : undefined
        treeData.push(nodeFromIndex)
      }
    })

    checkTreeRoute(false)
  }
  catch (error) {
    toast.error(t('alert.probleminGetInformation'))
  }
  finally {
    isLoading.value = false
  }

//   await fetchData()
}

const addcomment = async (nodeItem: ISimpleNestedNodeActionable) => {
  console.log('nodeitem', nodeItem)

  let resultTree: ISingleNodeView | null = null

  try {
    await showLoadingSwal(t('tree.loadingnodedetail'), async () => {
      resultTree = await $api<ISingleNodeView>(
        `app/node/${nodeItem.id}`,
        { method: 'GET', ignoreResponseError: false },
      )
    })
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.message)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))

    return
  }

  if (!resultTree?.id)
    return

  const resultValue = await showSwal({
    input: 'textarea',
    inputLabel: t('tree.comment'),
    inputValue: resultTree?.description,
    inputPlaceholder: t('datashelfbox.enteryourcomment'),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    allowOutsideClick: false,
    preConfirm: async desc => {
      const serviceError = shallowRef()
      try {
        await $api(`app/node/${resultTree?.id}/Description`, {
          method: 'PUT',
          body: { description: desc },
          ignoreResponseError: false,
        })
        treeIndex[resultTree.id].hasDescription = desc.length > 0
      }
      catch (err) {
        serviceError.value = err
      }

      return { serviceError }
    },
  })

  if (resultValue.isConfirmed) {
    const err = resultValue.value?.serviceError?.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        toast.error(err.message)
      else toast.error(t('httpstatuscodes.0'))
    }
    else {
      toast.success(t('alert.dataActionSuccess'))
    }
  }
}

const onContextMenu = (e: MouseEvent, nodeItem: ISimpleNestedNodeActionable) => {
  resetMouseDraggable()

  // prevent the browser's default menu
  e.preventDefault()
  activatedNode.value = [nodeItem.id]
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        disabled: !can('Create', 'Node'),
        label: t('tree.newnode'),
        icon: 'tabler-plus',
        onClick: () => {
          selectTreeNode(nodeItem)
          dialogAddNewNodeVisible.value = true
        },
      },
      {
        disabled: !can('Delete', 'Node'),
        label: t('tree.deletenode'),
        icon: 'tabler-trash',
        customClass: 'error',
        onClick: () => {
          deleteSelectedNode(nodeItem)
        },
      },
      {
        disabled: !can('Update', 'Node'),
        label: t('tree.editnode'),
        icon: 'tabler-edit',
        onClick: () => {
          nodeEditStart()
        },
      },
      {
        disabled: !can('Description', 'Node'),
        label: t('tree.comment'),
        icon: 'tabler-square-plus',
        onClick: () => {
          addcomment(nodeItem)
        },
      },
      {
        disabled: !can('Merge', 'Node'),
        label: t('tree.merge'),
        icon: 'tabler-arrow-merge',

        onClick: () => {
          selectTreeNode(nodeItem)
          dialogMergeNodeVisible.value = true
        },
      },
      {
        disabled: !can('Move', 'Node'),
        label: t('tree.transfernode'),
        icon: 'tabler-arrow-merge-alt-left',

        onClick: () => {
          selectTreeNode(nodeItem)
          dialogTransferNodeVisible.value = true
        },
      },
      {
        disabled: !can('Reference', 'Node'),
        label: t('tree.relation'),
        icon: 'tabler-affiliate',

        onClick: () => {
          selectTreeNode(nodeItem)
          dialogNodeRelationVisible.value = true
        },
      },
    ],
  })
}

function showNodeRelationList(nodeid: number, relationtype: NodeRelationType) {
  dialogNodeRelationListVisible.value = true
  nextTick(() => {
    dialognoderelationlist.value.loadrelations(nodeid, relationtype)
  })
}
watch(() => searchBoxHeight.value, () => {
  if (activeSearch.value)
    treeBlockSize.value = 230 + searchBoxHeight.value
  else
    treeBlockSize.value = 230
})

const treeViewStyle = computed(() => ({
  '--tree-block-size-offset': `${treeBlockSize.value}px`,
}))
</script>

<template>
  <div class="mc-main-tree d-flex flex-column justify-space-between" @keydown="handleKeydown">
    <MCLoading :showloading="isLoading" :loadingsize="SizeType.XL" />
    <MCDialogAddNewNode
      v-if="dialogAddNewNodeVisible" v-model:is-dialog-visible="dialogAddNewNodeVisible" :selected-tree-id="currentTreeId" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @node-added="nodeItemAdded" @node-added-failed="nodeaddfailed"
    />
    <MCDialogMergeNode
      v-if="dialogMergeNodeVisible" v-model:is-dialog-visible="dialogMergeNodeVisible" :selected-tree-id="currentTreeId" :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @nodemerged="nodeMerged" @node-merge-failed="nodeaddfailed"
    />
    <MCDialogTransferNode
      v-if="dialogTransferNodeVisible" v-model:is-dialog-visible="dialogTransferNodeVisible" :selected-tree-id="currentTreeId" :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @node-transfered="nodeTransfered" @node-transfer-faild="nodeaddfailed"
    />
    <MCDialogNodeRelation
      v-if="dialogNodeRelationVisible" v-model:is-dialog-visible="dialogNodeRelationVisible" :selected-tree-id="currentTreeId" :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @message-has-occured="handleDataBoxMessages"
    />
    <MCDialogNodeRelationList
      v-if="dialogNodeRelationListVisible" ref="dialognoderelationlist" v-model:is-dialog-visible="dialogNodeRelationListVisible"
      @message-has-occured="handleDataBoxMessages"
    />
    <div class="btn-box toolbar">
      <div class="d-flex toolbar">
        <VBtn size="small" variant="text" :disabled="!$can('Create', 'Node')" @click=" dialogAddNewNodeVisible = true">
          <VIcon icon="tabler-plus" size="22" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ `${$t('tree.newnode')} ${SHORTCUTKeys.nodenew.keyTitle}` }}
          </VTooltip>
        </VBtn>

        <VBtn size="small" :variant="activeSearch ? 'elevated' : 'text'" @click="selectSearchTree">
          <VIcon icon="tabler-search" size="22" />

          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ `${$t('search')} ${SHORTCUTKeys.nodesearch.keyTitle}` }}
          </VTooltip>
        </VBtn>
        <VBtn size="small" variant="text" @click="refreshTree">
          <VIcon icon="tabler-refresh" size="22" />

          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('refresh') }}
          </VTooltip>
        </VBtn>
        <VBtn size="small" variant="text" :disabled="!can('Cleanup', 'Node')" @click="dialogTreeNodeStats = (true && (can('Cleanup', 'Node') ?? false))">
          <VIcon icon="tabler-chart-bar" size="22" />

          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('tree.stats') }}
          </VTooltip>
        </VBtn>
      </div>
    </div>
    <VExpandTransition>
      <div v-if="activeSearch" ref="searchbox" class="mt-0 mb-2 flex-shrink-0">
        <MCSearchApiTree
          v-model:selected-items="searchResultSelectedNodes"
          auto-focus :max-height="200" :api-url="`app/node/simple?treeid=${currentTreeId}&IncludeHighlight=true`" :selection-type="SelectionType.Single" class="pt-1"
          :on-update-node-title="nodeEditProgress" @error-has-occured="toast.error"
        />
        <VDivider thickness="2" color="primary" />
      </div>
    </VExpandTransition>

    <div class="d-flex flex-row justify-space-between flex-shrink-0 w-100">
      <div style="height: 90%;" />
      <div class="header">
        {{ $t('tree.nodes') }}
      </div>
    </div>

    <div class="tree-view-scroll" :style="treeViewStyle">
      <VTreeview
        ref="treeview" v-model:activated="activatedNode" v-model:opened="openedNode"
        activatable :items="treeData" expand-icon="mdi-menu-left" item-value="id"
        item-title="title" density="compact" :lines="false" :load-children="loadChildren" @keydown="handleTreeViewKeydown"
      >
        <template #title="{ item }">
          <div
            :class="`no-select ${item.selected ? 'selected' : ''}`"
            :style="`${item.selected ? 'color:red' : ''};cursor:${hasDraggableState ? 'move' : 'default'}`"
            @dblclick="selectTreeNode(item)" @contextmenu="onContextMenu($event, item)"
          >
            <!--
              <VTooltip :text="item.title">
              <template #activator="{ props }">
            -->
            <VRow dense class="mx-0">
              <VCol cols="11" class="tree-title d-flex flex-column">
                <div
                  v-if="(activeDraggableItem && activeDraggableItem.id === item.id)"
                  class="d-flex align-center" style="height: 10px;" @mouseup="treeDividerMouseUp($event, item, NodeType.SiblingBefore)" @mouseenter="treeDividerMouseEnter(NodeType.SiblingBefore)"
                  @mouseleave="treeDividerMouseLeave($event, NodeType.SiblingBefore)"
                >
                  <div :class="`w-100 ${hasDividerDraggableBefore ? 'draggablebox' : ''}`" style="height: 5px;" />
                </div>
                <div
                  :class="`d-flex justify-space-between ${(activeDraggableItem && activeDraggableItem.id === item.id && (!hasDividerDraggableBefore && !hasDividerDraggableAfter)) ? 'draggablebox' : ''}`" @mouseleave="treeItemMouseLeave($event, item)"
                  @mouseenter="treeItemMouseEnter($event, item)" @mouseup="treeItemMouseUp($event, item)" @mousedown="treeItemMouseDown($event, item)"
                >
                  <div style="width: 90%;">
                    <span v-if="!(item.editing ?? false)">{{ item.title }}</span>
                    <VTextField
                      v-else ref="editableNode" v-model:model-value="nodeTempTitleForEdit" :color="item.failed ? 'error' : 'primary'" autofocus :placeholder="item.title"
                      :loading="item.loading"
                      :focused="!(item.loading ?? false)" :readonly="item.loading ?? false"
                      @blur="nodeEditCancel(item)" @keydown="handleEditableNodeKeydown($event, item)"
                    />
                  </div>
                  <div>
                    <VBtn v-if="item.hasDescription" size="xsmall" variant="plain" @click="addcomment(item)">
                      <VIcon size="16" icon="tabler-message" />
                    </VBtn>
                    <VBtn v-if="(item.relationCount ?? 0) > 0" size="xsmall" variant="plain" @click="showNodeRelationList(item.id, NodeRelationType.relation)">
                      <VTooltip
                        activator="parent"
                        location="top center"
                      >
                        {{ $t('relations') }}
                      </VTooltip>
                      <VIcon size="16" icon="tabler-bounce-left-filled" />
                    </VBtn>
                    <VBtn v-if="(item.referenceCount ?? 0) > 0" size="xsmall" variant="plain" @click="showNodeRelationList(item.id, NodeRelationType.reference)">
                      <VTooltip
                        activator="parent"
                        location="top center"
                      >
                        {{ $t('references') }}
                      </VTooltip>
                      <VIcon size="16" icon="tabler-bounce-left" />
                    </VBtn>
                  </div>
                </div>
                <div
                  v-if="(activeDraggableItem && activeDraggableItem.id === item.id && isLastNode(item))"
                  class="d-flex align-center" style="height: 10px;" @mouseup="treeDividerMouseUp($event, item, NodeType.SiblingAfter)" @mouseenter="treeDividerMouseEnter(NodeType.SiblingAfter)"
                  @mouseleave="treeDividerMouseLeave($event, NodeType.SiblingAfter)"
                >
                  <div :class="`w-100 ${hasDividerDraggableAfter ? 'draggablebox' : ''}`" style="height: 5px;" />
                </div>
                <!-- <span>{{ item.title }}</span> -->
              </VCol>
              <VCol cols="1" class="tree-node">
                <div style="width: 100%;" v-bind="props">
                  {{ item.children?.length ?? 0 }}
                </div>
              </VCol>
            </VRow>
            <!--
              </template>
              </VTooltip>
            -->
          </div>
        </template>
      </VTreeview>

      <!-- Tooltip موقعیت‌یابی شده -->
    </div>
    <VBtn v-if="selectedNode.id" class="selected-node pr-1 pl-1 text-body-2" variant="text" @click="gotoNode(selectedNode.id)">
      <p>
        {{ $t('tree.selectednode') }}: <span>
          {{ selectedNode.title }}
        </span>
      </p>
    </VBtn>
    <MCDialogDescription
      v-if="dialogDescriptionVisible" v-model:is-dialog-visible="dialogDescriptionVisible" :description="activeTooltipPath"
      :loc-x="cursorX" :loc-y="cursorY + 50"
    />
    <MCDialogTreeNodeStats v-if="dialogTreeNodeStats" v-model:is-dialog-visible="dialogTreeNodeStats" :serviceurl="`app/node?TreeId=${currentTreeId}`" />
  </div>
</template>

<style lang="scss">
.selected-node {

    border-radius: 6px;
    background-color: #f9f9f9;
    position: fixed;
    bottom: 15px;
    right: 10px;
}
// .tree-view-scroll {
//     overflow: auto;
//     block-size: calc(100vh - var(--tree-block-size-offset));

//     &::-webkit-scrollbar {
//         height: 4px;
//     }
// }
</style>
