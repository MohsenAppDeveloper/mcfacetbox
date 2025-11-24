<script setup lang="ts">
import { useToast } from 'vue-toastification'
import ContextMenu from '@imengyu/vue3-context-menu'
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCLoading from '../MCLoading.vue'
import MCDialogTransferNode from '../dialogs/MCDialogTransferNode.vue'
import MCDialogNodeRelationList from '../dialogs/MCDialogNodeRelationList.vue'
import { NodeLocationType, NodeRelationType, NodeSelectionType, SimpleFlatNodeActionable, getNodeTypeNameSpace } from '../../types/tree'
import type { INodeChangePriority, ISimpleFlatNodeActionable, ISingleNodeView, ITree, ITreeFlat } from '../../types/tree'
import { type IRootServiceError, MessageType, SelectionType, SizeType } from '@/types/baseModels'
import { useSelectTreeNode, useTreeStoreV3 } from '@/store/treeStoreV3'
import useRouterForGlobalVariables from '@/composables/useRouterVariables'
import { useShortcutManager } from '@/composables/useShortcutManager'
import { SHORTCUTKeys, ShortcutName } from '@/types/shortcutKeys'
import type { Rule } from '@/plugins/casl/ability'

const props = defineProps({
  title: { type: String },
})

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'close'): void
  (e: 'open'): void
  (e: 'showSelectTree'): void
}

// ============================================
// COMPOSABLES & STORES
// ============================================
const router = useRouter()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const ability = useAbility()
const { rules, can } = useAbility()

// New optimized tree store
const treeStore = useTreeStoreV3()

// ============================================
// STATE
// ============================================

const searchbox = ref()

const isLoading = ref(false)
const treeElement = shallowRef()
const rootElement = shallowRef()

const searchResultSelectedNodes = ref<number[]>([])

// Dialog visibility
const activeSearch = shallowRef(false)
const dialogAddNewNodeVisible = shallowRef(false)
const dialogMergeNodeVisible = shallowRef(false)
const dialogDescriptionVisible = shallowRef(false)
const dialogTransferNodeVisible = shallowRef(false)
const dialogNodeRelationVisible = shallowRef(false)
const dialogTreeNodeStats = shallowRef(false)
const dialogNodeRelationListVisible = shallowRef(false)
const dialognoderelationlist = ref(VDialog)

const activeTooltipPath = shallowRef('')

// در بخش stateها اضافه کنید
const dragState = ref({
  isDragging: false,
  draggedNode: null as ISimpleFlatNodeActionable | null,
  dropTarget: null as ISimpleFlatNodeActionable | null,
  dropPosition: NodeLocationType.Children,
  validDrop: false,
})

const { height: searchBoxHeight } = useElementSize(searchbox)
const { height: rootElementHeight } = useElementSize(rootElement)

// Legacy store for tree selection (keeping for compatibility)
const { treeNodeIdMustBeSelect } = useSelectTreeNode()
const { routerTreeId, routerNodeId, clearUnNeededQueryItems, addTreeIdToQuery, addNodeIdToQuery } = useRouterForGlobalVariables()
const { lastShortcutTriggered } = useShortcutManager()
const { x: cursorX, y: cursorY } = usePointer()
const { focused: rootFocused } = useFocus(rootElement, { initialValue: true })

// ============================================
// COMPUTED
// ============================================

// ============================================
// LAZY LOADING
// ============================================

/**
 * Load children when node is expanded
 */
const toggleNodeExpansion = async (event: MouseEvent, item: ISimpleFlatNodeActionable): Promise<void> => {
  event.stopPropagation()
  event.preventDefault()
  treeStore.toggleNodeExpansion(item.id)
  await nextTick()
}

// ============================================
// TREE DATA MANAGEMENT
// ============================================

/**
 * Refresh tree from server
 */
const refreshTree = async () => {
  try {
    isLoading.value = true

    const { data } = await useApi<ITree | any>(createUrl(`app/node/hierarchy/${treeStore.currentTreeId}`), { refetch: false })

    if (data.value && data.value.error) {
      const errorResult = data.value as IRootServiceError

      toast.error(errorResult.error.message)

      return
    }

    if (!data.value.nodes || data.value.nodes <= 0) {
      treeStore.clearTree()

      return
    }

    // Load tree into new optimized store
    await treeStore.loadTree(data.value)

    checkTreeRoute()
  }
  catch (error) {
    toast.error(t('alert.probleminGetInformation'))
  }
  finally {
    isLoading.value = false
  }
}

/**
 * Check and handle route-based navigation
 */
function checkTreeRoute() {
  if (routerTreeId.value === 0) {
    emit('showSelectTree')
    toast.warning(t('alert.nothaveselecttree'))

    return
  }

  console.log('routernodeid', routerNodeId.value)

  if (treeStore.currentTreeId === routerTreeId.value) {
    // if (deselectAll)
    //   treeStore.deselectAll()

    if (routerNodeId.value === -treeStore.currentTreeId)
      gotoNode(-treeStore.currentTreeId, NodeSelectionType.selected)

    else
      gotoNode(routerNodeId.value, NodeSelectionType.selected)
  }

  // Set current tree ID in store
  if (treeStore.currentTreeId !== routerTreeId.value)
    treeStore.currentTreeId = routerTreeId.value
}

/**
 * Navigate to a specific node (expand parents, scroll into view)
 */
async function gotoNode(nodeId: number, selectionType: NodeSelectionType, mustSelectNode: boolean = true) {
  const node = treeStore.getNode(nodeId)
  if (!node)
    return

  if (mustSelectNode)
    treeStore.selectNode(nodeId)

  const parentIds = treeStore.getAncestorIds(nodeId)

  // Expand all parents sequentially
  for (const parentId of parentIds)
    treeStore.expandNode(parentId)

  const isVisible = await isNodeVisibleWithObserver(nodeId)
  if (!isVisible)
    scrolltoNode(selectionType)

  // Scroll into view

  await nextTick()
}

function isNodeVisibleWithObserver(nodeId: number): Promise<boolean> {
  return new Promise(resolve => {
    const nodeElement = document.getElementById(`tree-node-${nodeId}`)
    if (!nodeElement) {
      resolve(false)

      return
    }

    const { stop } = useIntersectionObserver(
      nodeElement,
      ([{ isIntersecting }]) => {
        resolve(isIntersecting)
        stop()
      },
      {
        root: treeElement.value,
        threshold: 0.1, // 10% از المنت دیده شود
      },
    )
  })
}
function scrolltoNode(nodeselectionType: NodeSelectionType) {
  if (nodeselectionType === NodeSelectionType.highlighted) {
    const nodeIndex = treeStore.flatVisibleNodes.findIndex(item => item.highlighted)
    if (nodeIndex > 0)
      treeElement.value.scrollToIndex(nodeIndex)
  }
  if (nodeselectionType === NodeSelectionType.selected) {
    const nodeIndex = treeStore.flatVisibleNodes.findIndex(item => item.selected)
    if (nodeIndex > 0)
      treeElement.value.scrollToIndex(nodeIndex)
  }
}

// ============================================
// NODE EDITING
// ============================================

/**
 * Start editing node title
 */
function nodeEditStart() {
  if (!can('Update', 'Node') || !isValidActionOnNode(treeStore.highlightedNodeId))
    return false

  //   nodeTempTitleForEdit.value = node.title
  treeStore.startEditing(treeStore.highlightedNodeId)
  gotoNode(treeStore.highlightedNodeId, NodeSelectionType.highlighted, false)
}

/**
 * Cancel node editing
 */
function nodeEditCancel(nodeitem: any) {
  treeStore.cancelEditing(nodeitem.id)
  focusToRootElemet()
}

/**
 * Save node title edit
 */
async function nodeEditProgress(nodeitem: ISimpleFlatNodeActionable, nodetitle: string) {
  treeStore.setNodeLoading(nodeitem.id, true)

  try {
    await $api(`app/node/${nodeitem.id}/title`, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify({ title: nodetitle })),
      ignoreResponseError: false,
    })

    treeStore.completeEditing(nodeitem.id, nodetitle)

    focusToRootElemet()
  }
  catch (error) {
    treeStore.setNodeLoading(nodeitem.id, false)
    treeStore.setNodeFailed(nodeitem.id, true)

    if (error instanceof CustomFetchError && error.message)
      toast.error(error.message)
    else
      toast.error(t('httpstatuscodes.0'))
  }
}

/**
 * Handle keyboard events during editing
 */
function handleEditableNodeKeydown(event: KeyboardEvent, item: ISimpleFlatNodeActionable) {
  switch (event.key) {
    case ' ':
      event.stopPropagation()
      break
    case 'Enter':
      event.stopPropagation()
      nodeEditProgress(item, item.tempData)
      break
    case 'Escape':
      if (item.loading)
      break
      nodeEditCancel(item)
      break
    default:
      break
  }
}

// ============================================
// NODE CRUD OPERATIONS
// ============================================

/**
 * Delete node (with confirmation)
 */
const deleteSelectedNode = async (nodeItem: ISimpleFlatNodeActionable) => {
  if (!can('Delete', 'Node') || !isValidActionOnNode(nodeItem.id))
    return false

  const title = formatString(t('alert.specificItemDeleted'), nodeItem.title)
  const serviceError = shallowRef()

  const result = await confirmSwal(
    title,
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true,
    'warning',
    async () => {
      try {
        await $api(`app/node/${nodeItem.id}`, {
          method: 'DELETE',
        })
        treeStore.deleteNode(nodeItem.id)
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
      else
        toast.error(t('httpstatuscodes.0'))
    }
    else {
      toast.success(t('alert.deleteDataSuccess'))
    }
  }
}

/**
 * Add comment/description to node
 */
const addcomment = async (nodeItem: ISimpleFlatNodeActionable) => {
  if (!can('Description', 'Node') || !isValidActionOnNode(nodeItem.id))
    return false
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
    else
      toast.error(t('httpstatuscodes.0'))

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
        treeStore.updateNode(resultTree.id, { hasDescription: desc.length > 0 })
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
      else
        toast.error(t('httpstatuscodes.0'))
    }
    else {
      toast.success(t('alert.dataActionSuccess'))
    }
  }
}

// ============================================
// NODE MOVEMENT (Drag & Drop)
// ============================================

/**
 * Transfer node with drag and drop
 */

// توابع جدید برای مدیریت Drag & Drop
function onDragStart(event: DragEvent, nodeItem: ISimpleFlatNodeActionable) {
  if (!can('Move', 'Node')) {
    event.preventDefault()

    return
  }

  dragState.value.isDragging = true
  dragState.value.draggedNode = nodeItem

  // ایجاد ghost element برای نمایش هنگام drag
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', nodeItem.id.toString())

    // ایجاد ghost element از المنت اصلی

    // حذف بعد از اتمام
    // setTimeout(() => {
    //   if (document.body.contains(ghostEl))
    //     document.body.removeChild(ghostEl)
    // }, 0)
  }
}

function onDragOver(event: DragEvent, nodeItem: ISimpleFlatNodeActionable) {
  if (!dragState.value.isDragging || !dragState.value.draggedNode)
    return

  event.preventDefault()

  // بررسی امکان جابجایی
  const canDrop = validateDrop(dragState.value.draggedNode, nodeItem)

  dragState.value.validDrop = canDrop

  if (canDrop && event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'

    // تعیین موقعیت drop (بالا، پایین، یا داخل)
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const mouseY = event.clientY
    const relativeY = mouseY - rect.top
    const heightThird = rect.height / 3

    if (relativeY < heightThird)
      dragState.value.dropPosition = NodeLocationType.SiblingBefore
    else if (relativeY > heightThird * 2)
      dragState.value.dropPosition = NodeLocationType.SiblingAfter
    else
      dragState.value.dropPosition = NodeLocationType.Children

    dragState.value.dropTarget = nodeItem
  }
  else if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'none'
  }
}

function onDragLeave(event: DragEvent) {
  dragState.value.dropTarget = null
}

function onDrop(event: DragEvent, nodeItem: ISimpleFlatNodeActionable) {
  event.preventDefault()

  if (!dragState.value.draggedNode || !dragState.value.validDrop) {
    resetDragState()

    return
  }

  const sourceNode = dragState.value.draggedNode
  const targetNode = nodeItem

  // تعیین نوع انتقال بر اساس موقعیت
  let transferType: NodeLocationType

  switch (dragState.value.dropPosition) {
    case NodeLocationType.SiblingBefore:
      transferType = NodeLocationType.SiblingBefore
      break
    case NodeLocationType.SiblingAfter:
      transferType = NodeLocationType.SiblingAfter
      break
    case NodeLocationType.Children:
      transferType = NodeLocationType.Children
      break
  }

  // اجرای انتقال
  transferNodeWithDraggableMouse(transferType, sourceNode, targetNode)
  resetDragState()
}

function validateDrop(sourceNode: ISimpleFlatNodeActionable, targetNode: ISimpleFlatNodeActionable): boolean {
  if (!can('Move', 'Node') || !isValidActionOnNode(sourceNode.id) || !isValidActionOnNode(targetNode.id))
    return false

  // جلوگیری از انتقال به خود یا والدین
  if (sourceNode.id === targetNode.id)
    return false

  // جلوگیری از انتقال به فرزندان خود
  const isDescendant = treeStore.isDescendant(targetNode.id, sourceNode.id)
  if (isDescendant)
    return false

  // بررسی مجوزها

  return true
}

function resetDragState() {
  dragState.value.isDragging = false
  dragState.value.draggedNode = null
  dragState.value.dropTarget = null
  dragState.value.validDrop = false
}

async function transferNodeWithDraggableMouse(
  transfertype: NodeLocationType,
  sourceNodeItem: ISimpleFlatNodeActionable,
  destinationNodeItem: ISimpleFlatNodeActionable,
) {
  const title = formatString(
    t(`${transfertype === NodeLocationType.Children ? 'alert.transfernodeaschild' : (transfertype === NodeLocationType.SiblingAfter ? 'alert.transfernodeasbrotherafter' : 'alert.transfernodeasbrotherbefore')}`),
    sourceNodeItem.title,
    destinationNodeItem.title,
  )

  const serviceError = shallowRef()

  const result = await confirmSwal(
    title,
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true,
    'warning',
    async () => {
      try {
        const resultService = await $api<INodeChangePriority>(`app/node/${sourceNodeItem.id}/move/${getNodeTypeNameSpace(transfertype)}/${destinationNodeItem.id}`, {
          method: 'PUT',
          ignoreResponseError: false,
        })

        if (!treeStore.moveNode(sourceNodeItem.id, destinationNodeItem.id, resultService.priority, transfertype))
          toast.error(t('alert.probleminnodeaddrefreshpage'))
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
      else
        toast.error(t('alert.probleminnodeaddrefreshpage'))
    }
    else {
      resetDragState()
    }
  }
}

// ============================================
// CONTEXT MENU
// ============================================

const onContextMenu = (e: MouseEvent, nodeItem: ISimpleFlatNodeActionable) => {
  resetDragState()
  e.preventDefault()
  treeStore.highlightNode(nodeItem.id)
  if (!isValidActionOnNode(nodeItem.id))
    return
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        disabled: !can('Create', 'Node'),
        label: t('tree.newnode'),
        icon: 'tabler-plus',
        onClick: () => {
        //   selectTreeNode(nodeItem)
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
        //   selectTreeNode(nodeItem)
          dialogMergeNodeVisible.value = true
        },
      },
      {
        disabled: !can('Move', 'Node'),
        label: t('tree.transfernode'),
        icon: 'tabler-arrow-merge-alt-left',
        onClick: () => {
        //   selectTreeNode(nodeItem)
          dialogTransferNodeVisible.value = true
        },
      },
      {
        disabled: !can('Reference', 'Node'),
        label: t('tree.relation'),
        icon: 'tabler-affiliate',
        onClick: () => {
        //   selectTreeNode(nodeItem)
          dialogNodeRelationVisible.value = true
        },
      },
    ],
  })
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const isValidActionOnNode = (nodeId: number): boolean => {
  // this condition is for draft Node
  return !(nodeId === -treeStore.currentTreeId)
}

const treeSizeHeight = computed(() => {
  const toolbarHeight = 38
  const treeStatusBar = 36
  const treeColumnHeader = 25

  return rootElementHeight.value - (toolbarHeight + treeStatusBar + searchBoxHeight.value + treeColumnHeader)
})

function focusToRootElemet() {
  rootElement.value.focus()
}

const selectTreeNode = (item: ISimpleFlatNodeActionable) => {
  const newQuery = { ...route.query }

  clearUnNeededQueryItems(newQuery)
  addTreeIdToQuery(treeStore.currentTreeId, newQuery)
  if (item.id > 0 || item.id === -treeStore.currentTreeId)
    addNodeIdToQuery(item.id, newQuery)
  router.replace({ query: newQuery })
}

function selectSearchTree() {
  activeSearch.value = !activeSearch.value
}

function handleTreeKeydown(event: KeyboardEvent) {
  if (event.key === 'F2' && treeStore.highlightedNodeId > 0)
    nodeEditStart()
  if (event.key === 'Escape')
    resetDragState()
}

function handleTreeNodeKeydown(event: KeyboardEvent) {

  // Reserved for future use
}

const nodeItemAdded = (nodeItem: ISimpleFlatNodeActionable) => {
  toast.success(formatString(t('alert.specificNodeAdded'), nodeItem.title))
}

const nodeaddfailed = (message: string) => {
  toast.error(message)
}

const parentNodeTitle = (nodeid: number | null): string => {
  if (!nodeid)
    return ''
  const parent = treeStore.getParentNode(nodeid)

  return parent?.title || ''
}

const nodeMerged = (sourceNodeId: number, destinationNodeID: number) => {
  if (treeStore.getNode(destinationNodeID))
    gotoNode(destinationNodeID, NodeSelectionType.highlighted)
}

const nodeTransfered = (sourceNodeId: number, destinationNodeID: number) => {
  // Optional: handle post-transfer actions
}

function showNodeRelationList(nodeid: number, relationtype: NodeRelationType) {
  dialogNodeRelationListVisible.value = true
  nextTick(() => {
    dialognoderelationlist.value.loadrelations(nodeid, relationtype)
  })
}

function handleDataBoxMessages(message: string, messagetype: MessageType) {
  switch (messagetype) {
    case MessageType.error:
      toast.error(message)
      break
    case MessageType.info:
      toast.info(message)
      break
    case MessageType.warning:
      toast.warning(message)
      break
    case MessageType.success:
      toast.success(message)
      break
    default:
      break
  }
}

const setPermissions = async (): Promise<boolean> => {
  try {
    const permissionDataResult = await $api<Rule[]>(`app/tree/${treeStore.currentTreeId}/user/permissions`)

    useCookie('userAbilityRules').value = JSON.stringify(permissionDataResult)
    ability.update(permissionDataResult)

    return true
  }
  catch (error) {
    return false
  }
}

// ============================================
// WATCHERS
// ============================================
watch(activeSearch, (newval, oldVal) => {
  if ((newval !== oldVal) && !newval)
    focusToRootElemet()
})

// watch(rootFocused, () => {
//   if (rootFocused.value)
//     console.log('tree element focused')
//   else console.log('input element has lost focus')
// })
watch(treeNodeIdMustBeSelect, newval => {
  if (newval > 0) {
    treeStore.highlightNode(newval)
    gotoNode(newval, NodeSelectionType.highlighted, false)
    treeNodeIdMustBeSelect.value = 0
  }
})
watch(lastShortcutTriggered, newval => {
  if (newval === ShortcutName.nodesearch)
    activeSearch.value = !activeSearch.value
  if (newval === ShortcutName.nodenew)
    dialogAddNewNodeVisible.value = true
})

watch(() => treeStore.currentTreeId, async (newval, oldVal) => {
  if (newval !== oldVal && newval > 0)
    await refreshTree()
})

watch(searchResultSelectedNodes, () => {
  treeStore.highlightNode(searchResultSelectedNodes.value[0])
  gotoNode(searchResultSelectedNodes.value[0], NodeSelectionType.highlighted, false)
})

watch(route, () => {
  checkTreeRoute()
}, { immediate: true })

// ============================================
// LIFECYCLE
// ============================================

onMounted(async () => {
  if (routerTreeId.value > 0) {
    treeStore.currentTreeId = routerTreeId.value
    await setPermissions()
  }
})
</script>

<template>
  <div ref="rootElement" class="d-flex flex-column justify-start no-outline h-100" tabindex="0" @keydown="handleTreeKeydown">
    <MCLoading :showloading="isLoading" :loadingsize="SizeType.XL" />

    <!-- Dialogs -->
    <MCDialogAddNewNode
      v-if="dialogAddNewNodeVisible"
      v-model:is-dialog-visible="dialogAddNewNodeVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :selected-node="treeStore.highlightedNodeId > 0 ? treeStore.getNode(treeStore.highlightedNodeId) : new SimpleFlatNodeActionable(-1, '', null)"
      @node-added="nodeItemAdded"
      @node-added-failed="nodeaddfailed"
    />

    <MCDialogMergeNode
      v-if="dialogMergeNodeVisible"
      v-model:is-dialog-visible="dialogMergeNodeVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :parent-node-title="parentNodeTitle(treeStore.highlightedNodeId)"
      :selected-node="treeStore.highlightedNodeId > 0 ? treeStore.getNode(treeStore.highlightedNodeId) : new SimpleFlatNodeActionable(-1, '', null)"
      @nodemerged="nodeMerged"
      @node-merge-failed="nodeaddfailed" @message-has-occured="handleDataBoxMessages"
    />

    <MCDialogTransferNode
      v-if="dialogTransferNodeVisible"
      v-model:is-dialog-visible="dialogTransferNodeVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :parent-node-title="parentNodeTitle(treeStore.highlightedNodeId)"
      :selected-node="treeStore.highlightedNodeId > 0 ? treeStore.getNode(treeStore.highlightedNodeId) : new SimpleFlatNodeActionable(-1, '', null)"
      @node-transfered="nodeTransfered"
      @node-transfer-faild="nodeaddfailed" @message-has-occured="handleDataBoxMessages"
    />

    <MCDialogNodeRelation
      v-if="dialogNodeRelationVisible"
      v-model:is-dialog-visible="dialogNodeRelationVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :parent-node-title="parentNodeTitle(treeStore.highlightedNodeId)"
      :selected-node="treeStore.highlightedNodeId > 0 ? treeStore.getNode(treeStore.highlightedNodeId) : new SimpleFlatNodeActionable(-1, '', null)"
      @message-has-occured="handleDataBoxMessages"
    />

    <MCDialogNodeRelationList
      v-if="dialogNodeRelationListVisible"
      ref="dialognoderelationlist"
      v-model:is-dialog-visible="dialogNodeRelationListVisible"
      @message-has-occured="handleDataBoxMessages"
    />

    <!-- Toolbar -->
    <div class="btn-box tree-toolbar">
      <div class="d-flex toolbar">
        <VBtn size="small" variant="text" :disabled="!$can('Create', 'Node')" @click="dialogAddNewNodeVisible = true">
          <VIcon icon="tabler-plus" size="22" />
          <VTooltip activator="parent" location="top center">
            {{ `${$t('tree.newnode')} ${SHORTCUTKeys.nodenew.keyTitle}` }}
          </VTooltip>
        </VBtn>

        <VBtn size="small" :variant="activeSearch ? 'elevated' : 'text'" @click="selectSearchTree">
          <VIcon icon="tabler-search" size="22" />
          <VTooltip activator="parent" location="top center">
            {{ `${$t('search')} ${SHORTCUTKeys.nodesearch.keyTitle}` }}
          </VTooltip>
        </VBtn>

        <VBtn size="small" variant="text" @click="refreshTree">
          <VIcon icon="tabler-refresh" size="22" />
          <VTooltip activator="parent" location="top center">
            {{ $t('refresh') }}
          </VTooltip>
        </VBtn>

        <VBtn size="small" variant="text" :disabled="!can('Cleanup', 'Node')" @click="dialogTreeNodeStats = (true && (can('Cleanup', 'Node') ?? false))">
          <VIcon icon="tabler-chart-bar" size="22" />
          <VTooltip activator="parent" location="top center">
            {{ $t('tree.stats') }}
          </VTooltip>
        </VBtn>
      </div>
    </div>

    <!-- Search Box -->
    <VExpandTransition>
      <div v-if="activeSearch" ref="searchbox" class="mt-0 mb-2 flex-shrink-0">
        <MCSearchApiTree
          v-model:selected-items="searchResultSelectedNodes"
          auto-focus
          :max-height="200"
          :api-url="`app/node/simple?treeid=${treeStore.currentTreeId}&IncludeHighlight=true`"
          :selection-type="SelectionType.Single"
          class="pt-1"
          :on-update-node-title="nodeEditProgress"
          @error-has-occured="toast.error"
        />
        <VDivider thickness="2" color="primary" />
      </div>
    </VExpandTransition>

    <!-- Header -->
    <div class="d-flex flex-row justify-space-between flex-shrink-0 w-100">
      <div>&nbsp;</div>
      <div class="excerpt-count--header">
        {{ $t('excerptcount') }}
      </div>
    </div>

    <!-- Tree View -->
    <div class="tree-container">
      <VVirtualScroll ref="treeElement" :items="treeStore.flatVisibleNodes" :height="treeSizeHeight" item-height="30">
        <template #default="{ item }">
          <div
            :id="`tree-node-${item.id}`"
            :class="{
              'tree-node--highlighted': item.highlighted,
              'tree-node--selected': item.selected,
              'tree-node--inactive': !rootFocused,
              'tree-node--dragging': dragState.isDragging && dragState.draggedNode?.id === item.id,
              'tree-node--drop-zone': dragState.dropTarget?.id === item.id && dragState.validDrop,
              'tree-node--drop-before': dragState.dropTarget?.id === item.id && dragState.validDrop && dragState.dropPosition === NodeLocationType.SiblingBefore,
              'tree-node--drop-after': dragState.dropTarget?.id === item.id && dragState.validDrop && dragState.dropPosition === NodeLocationType.SiblingAfter,
              'tree-node--drop-inside': dragState.dropTarget?.id === item.id && dragState.validDrop && dragState.dropPosition === NodeLocationType.Children,
            }"
            class="tree-node"
            :style="{ paddingRight: `${item.depth * 15}px`, cursor: 'default' }"
            draggable="true" @keydown="handleTreeNodeKeydown"
            @contextmenu="onContextMenu($event, item)"
            @dragstart="onDragStart($event, item)"
            @dragover="onDragOver($event, item)"
            @dragleave="onDragLeave"
            @drop="onDrop($event, item)"
            @dragend="resetDragState"
            @click="treeStore.highlightNode(item.id)" @dblclick="selectTreeNode(item)"
          >
            <div class="tree-node__content">
              <div class="tree-node__icon" :style="{ width: '16px', cursor: item.hasChildren ? 'pointer' : 'default' }" @click="toggleNodeExpansion($event, item)">
                <!--
                  <VProgressCircular
                  v-if="loading.has(item.id)"
                  indeterminate
                  size="14"
                  width="2"
                  />
                -->
                <VIcon size="16">
                  {{ item.hasChildren ? (item.isExpanded ? 'tabler-chevron-down' : 'tabler-chevron-left') : '' }}
                </VIcon>
              </div>
              <!-- <div class="w-100 tree-node__title-wrapper"> -->
              <div class="w-100 tree-node__title-wrapper">
                <span v-if="!item.editing" class="tree-node__title no-select">{{ item.title }}

                </span>
                <VTextField
                  v-else
                  v-model:model-value="item.tempData"
                  :color="item.failed ? 'error' : 'primary'"
                  autofocus
                  :placeholder="item.title"
                  :loading="item.loading"
                  :focused="!(item.loading ?? false)"
                  :readonly="item.loading ?? false"
                  @blur="nodeEditCancel(item)"
                  @keydown="handleEditableNodeKeydown($event, item)"
                />
              </div>
              <!-- </div> -->
            </div>
            <div class="tree-node__state-column">
              <VBtn v-if="item.hasDescription" size="xsmall" variant="plain" @click="addcomment(item)">
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('tree.comment') }}
                </VTooltip>
                <VIcon size="16" icon="tabler-message" />
              </VBtn>
              <VBtn v-if="(item.relationCount ?? 0) > 0" size="xsmall" variant="plain" @click="showNodeRelationList(item.id, NodeRelationType.relation)">
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('relations') }}
                </VTooltip>
                <VIcon size="16" icon="tabler-paperclip" />
              </VBtn>
              <VBtn v-if="(item.referenceCount ?? 0) > 0" size="xsmall" variant="plain" @click="showNodeRelationList(item.id, NodeRelationType.reference)">
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('references') }}
                </VTooltip>
                <VIcon size="16" icon="tabler-arrow-bounce" />
              </VBtn>
            </div>
            <div class="tree-node__excerpt-column">
              <div class="tree-node__excerpt-column.excerpt-count" :data-length="String(item.excerptCount?.total || 0).length">
                <div style="width: 100%;" v-bind="props">
                  {{ item.excerptCount?.total || 0 }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </VVirtualScroll>
    </div>
    <!-- Selected Node Info -->
    <div>
      <VBtn
        v-if="treeStore.selectedNode && (treeStore.selectedNode.id > 0 || treeStore.selectedNode.id === -treeStore.currentTreeId) "
        class="selected-node pr-1 pl-1 text-body-2"
        variant="text"
        @click="gotoNode(treeStore.selectedNode.id, NodeSelectionType.selected, false)"
      >
        <p>
          {{ $t('tree.selectednode') }}: <span>{{ treeStore.selectedNode.title }}</span>
        </p>
      </VBtn>
    </div>
    <!-- Dialogs (continued) -->
    <MCDialogDescription
      v-if="dialogDescriptionVisible"
      v-model:is-dialog-visible="dialogDescriptionVisible"
      :description="activeTooltipPath"
      :loc-x="cursorX"
      :loc-y="cursorY + 50"
    />

    <MCDialogTreeNodeStats
      v-if="dialogTreeNodeStats"
      v-model:is-dialog-visible="dialogTreeNodeStats"
      :serviceurl="`app/node?TreeId=${treeStore.currentTreeId}`"
    />
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
</style>
