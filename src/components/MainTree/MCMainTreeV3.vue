<script setup lang="ts">
import { useToast } from 'vue-toastification'
import ContextMenu from '@imengyu/vue3-context-menu'
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCLoading from '../MCLoading.vue'
import MCDialogTransferNode from '../dialogs/MCDialogTransferNode.vue'
import MCDialogNodeRelationList from '../dialogs/MCDialogNodeRelationList.vue'
import { type IRootServiceError, MessageType, SelectionType, SizeType } from '@/types/baseModels'
import { NodeSelectionType, NodeType, SimpleNestedNodeAcionableModel, getNodeTypeNameSpace } from '@/types/tree'
import type { ISimpleFlatNodeActionable, ISimpleNestedNodeActionable, ISingleNodeView, ITree, NodeRelationType } from '@/types/tree'
import { useTreeStoreV3 } from '@/store/treeStoreV3'
import { useSelectedTree } from '@/store/treeStore'
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
const editableNode = ref()

const activatedNode = ref<number[]>([])
const openedNode = ref<number[]>([])
const isLoading = ref(false)
const treeElement = shallowRef()
const rootElement = shallowRef()

const searchResultSelectedNodes = ref<number[]>([])

// Drag and drop state
const hasDraggableState = ref(false)
const hasDividerDraggableBefore = ref(false)
const hasDividerDraggableAfter = ref(false)
const sourceDraggableItem = ref<any | null>(null)
const activeDraggableItem = ref<any | null>(null)

// Dialog visibility
const activeSearch = shallowRef(false)
const dialogAddNewNodeVisible = ref(false)
const dialogMergeNodeVisible = ref(false)
const dialogDescriptionVisible = shallowRef(false)
const dialogTransferNodeVisible = shallowRef(false)
const dialogNodeRelationVisible = shallowRef(false)
const dialogTreeNodeStats = shallowRef(false)
const dialogNodeRelationListVisible = shallowRef(false)
const dialognoderelationlist = ref(VDialog)

const treeBlockSize = ref(500)
const activeTooltipPath = shallowRef('')

const { height: searchBoxHeight } = useElementSize(searchbox)
const { height: rootElementHeight } = useElementSize(rootElement)

// Legacy store for tree selection (keeping for compatibility)
const selectedTreeStore = useSelectedTree()

const { routerTreeId, routerNodeId, clearUnNeededQueryItems, addTreeIdToQuery, addNodeIdToQuery } = useRouterForGlobalVariables()
const { lastShortcutTriggered } = useShortcutManager()
const { x: cursorX, y: cursorY } = usePointer()
const { focused: rootFocused } = useFocus(rootElement, { initialValue: true })

// const activeElement = useActiveElement()

// watch(activeElement, el => {
//   console.log('focus changed to', el)
// })

// ============================================
// COMPUTED
// ============================================

// Tree data from store (reactive and optimized)
// const treeData = computed(() => treeStore.treeData)

// Currently selected node
const selectedNode = computed(() => treeStore.selectedNode)

// Tree view style
const treeViewStyle = computed(() => ({
  '--tree-block-size-offset': `${treeBlockSize.value}px`,
}))

// ============================================
// LAZY LOADING
// ============================================

/**
 * Load children when node is expanded
 */
const toggleNodeExpansion = async (item: ISimpleFlatNodeActionable): Promise<void> => {
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

    activatedNode.value.splice(0)

    selectedTreeStore.id = data.value.id
    selectedTreeStore.title = data?.value.title

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

  if (treeStore.currentTreeId === routerTreeId.value) {
    // if (deselectAll)
    //   treeStore.deselectAll()

    if (routerNodeId.value === 0)
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
    treeStore.selectNode(nodeId, treeElement.value?.$el.scrollTop ?? 0)

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
async function nodeEditProgress(nodeitem: any, nodetitle: string) {
  treeStore.setNodeLoading(nodeitem.id, true)

  try {
    await $api(`app/node/${nodeitem.id}/title`, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify({ title: nodetitle })),
      ignoreResponseError: false,
    })

    treeStore.completeEditing(nodeitem.id, nodetitle)

    setTimeout(() => {
      rootElement.value.$el.focus()
    }, 1000)
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
const deleteSelectedNode = async (nodeItem: any) => {
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
      clearActivateNode()
      toast.success(t('alert.deleteDataSuccess'))
    }
  }
}

/**
 * Add comment/description to node
 */
const addcomment = async (nodeItem: any) => {
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
async function transferNodeWithDraggableMouse(
  transfertype: NodeType,
  sourceNodeItem: any,
  destinationNodeItem: any,
) {
  const title = formatString(
    t(`${transfertype === NodeType.Children ? 'alert.transfernodeaschild' : (transfertype === NodeType.SiblingAfter ? 'alert.transfernodeasbrotherafter' : 'alert.transfernodeasbrotherbefore')}`),
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
        await $api(`app/node/${sourceNodeItem.id}/move/${getNodeTypeNameSpace(transfertype)}/${destinationNodeItem.id}`, {
          method: 'PUT',
          ignoreResponseError: false,
        })
        treeStore.moveNode(sourceNodeItem.id, destinationNodeItem.id, transfertype)
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
      resetMouseDraggable()
    }
  }
}

// ============================================
// DRAG & DROP HANDLERS
// ============================================

function treeItemMouseDown(mouseEvent: MouseEvent, treeItem: any) {
  hasDraggableState.value = true
  sourceDraggableItem.value = treeItem
}

function treeItemMouseLeave(mouseEvent: MouseEvent, treeItem: any) {
  if (mouseEvent.buttons === 0)
    resetMouseDraggable()

  if (sourceDraggableItem.value && sourceDraggableItem.value.id === treeItem.id) {
    activatedNode.value.splice(0)
    activatedNode.value.push(treeItem.id)
  }
}

function treeItemMouseEnter(mouseEvent: MouseEvent, treeItem: any) {
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

function treeItemMouseUp(mouseEvent: MouseEvent, treeItem: any) {
  if (sourceDraggableItem.value && sourceDraggableItem.value.id !== treeItem.id && activeDraggableItem.value)
    transferNodeWithDraggableMouse(NodeType.Children, sourceDraggableItem.value, activeDraggableItem.value)
}

function treeDividerMouseEnter(transfertype: NodeType) {
  if (transfertype === NodeType.SiblingBefore)
    hasDividerDraggableBefore.value = true

  if (transfertype === NodeType.SiblingAfter)
    hasDividerDraggableAfter.value = true
}

function treeDividerMouseLeave(mouseEvent: MouseEvent, transfertype: NodeType) {
  if (transfertype === NodeType.SiblingBefore)
    hasDividerDraggableBefore.value = false

  if (transfertype === NodeType.SiblingAfter)
    hasDividerDraggableAfter.value = false
}

function treeDividerMouseUp(mouseEvent: MouseEvent, treeItem: any, transfertype: NodeType) {
  if (sourceDraggableItem.value && sourceDraggableItem.value.id !== treeItem.id && activeDraggableItem.value)
    transferNodeWithDraggableMouse(transfertype, sourceDraggableItem.value, activeDraggableItem.value)
}

function resetMouseDraggable() {
  hasDraggableState.value = false
  hasDividerDraggableBefore.value = false
  hasDividerDraggableAfter.value = false
  sourceDraggableItem.value = null
  activeDraggableItem.value = null
}

// ============================================
// CONTEXT MENU
// ============================================

const onContextMenu = (e: MouseEvent, nodeItem: ISimpleFlatNodeActionable) => {
  resetMouseDraggable()
  e.preventDefault()
  treeStore.highlightNode(nodeItem.id)

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

const treeSizeHeight = computed(() => {
  const toolbarHeight = 38
  const treeStatusBar = 36
  const treeColumnHeader = 25

  return rootElementHeight.value - (toolbarHeight + treeStatusBar + searchBoxHeight.value + treeColumnHeader)
})

function focusToRootElemet() {
  rootElement.value.focus()
}
function isValidActivateNode(): boolean {
  return !!(activatedNode.value.length > 0 && treeStore.getNode(activatedNode.value[0]))
}

function clearActivateNode() {
  treeStore.deselectAll()
  activatedNode.value.splice(0)
}

const selectTreeNode = (item: ISimpleFlatNodeActionable) => {
  const newQuery = { ...route.query }

  clearUnNeededQueryItems(newQuery)
  addTreeIdToQuery(treeStore.currentTreeId, newQuery)
  if (item.id > 0)
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
    resetMouseDraggable()
}

function handleTreeNodeKeydown(event: KeyboardEvent) {

  // Reserved for future use
}

const nodeItemAdded = (nodeItem: ISimpleNestedNodeActionable) => {
  toast.success(formatString(t('alert.specificNodeAdded'), nodeItem.title))
}

const nodeaddfailed = (message: string) => {
  toast.error(message)
}

const parentNodeTitle = (nodeid: number | null): string => {
  if (!nodeid)
    return ''
  const node = treeStore.getNode(nodeid)
  if (!node || !node.parentId)
    return ''
  const parent = treeStore.getNode(node.parentId)

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
watch(() => searchBoxHeight.value, () => {
  if (activeSearch.value)
    treeBlockSize.value = 500 + searchBoxHeight.value
  else
    treeBlockSize.value = 500
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
  activatedNode.value.splice(0)
  activatedNode.value.push(...searchResultSelectedNodes.value)
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
  <div ref="rootElement" class="mc-main-tree d-flex flex-column justify-start no-outline h-100" tabindex="0" @keydown="handleTreeKeydown">
    <MCLoading :showloading="isLoading" :loadingsize="SizeType.XL" />

    <!-- Dialogs -->
    <MCDialogAddNewNode
      v-if="dialogAddNewNodeVisible"
      v-model:is-dialog-visible="dialogAddNewNodeVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :selected-node="isValidActivateNode() ? treeStore.getNode(activatedNode[0]) : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @node-added="nodeItemAdded"
      @node-added-failed="nodeaddfailed"
    />

    <MCDialogMergeNode
      v-if="dialogMergeNodeVisible"
      v-model:is-dialog-visible="dialogMergeNodeVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)"
      :selected-node="isValidActivateNode() ? treeStore.getNode(activatedNode[0]) : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @nodemerged="nodeMerged"
      @node-merge-failed="nodeaddfailed"
    />

    <MCDialogTransferNode
      v-if="dialogTransferNodeVisible"
      v-model:is-dialog-visible="dialogTransferNodeVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)"
      :selected-node="isValidActivateNode() ? treeStore.getNode(activatedNode[0]) : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @node-transfered="nodeTransfered"
      @node-transfer-faild="nodeaddfailed"
    />

    <MCDialogNodeRelation
      v-if="dialogNodeRelationVisible"
      v-model:is-dialog-visible="dialogNodeRelationVisible"
      :selected-tree-id="treeStore.currentTreeId"
      :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)"
      :selected-node="isValidActivateNode() ? treeStore.getNode(activatedNode[0]) : new SimpleNestedNodeAcionableModel(-1, '', -1)"
      @message-has-occured="handleDataBoxMessages"
    />

    <MCDialogNodeRelationList
      v-if="dialogNodeRelationListVisible"
      ref="dialognoderelationlist"
      v-model:is-dialog-visible="dialogNodeRelationListVisible"
      @message-has-occured="handleDataBoxMessages"
    />

    <!-- Toolbar -->
    <div class="btn-box toolbar">
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
      <div style="height: 90%;" />
      <div class="header">
        {{ $t('tree.nodes') }}
      </div>
    </div>

    <!-- Tree View -->
    <div>
      <VVirtualScroll ref="treeElement" :items="treeStore.flatVisibleNodes" :height="treeSizeHeight" item-height="30">
        <template #default="{ item }">
          <div
            :id="`tree-node-${item.id}`"
            :class="{
              'tree-node--highlighted': item.highlighted,
              'tree-node--selected': item.selected,
              'tree-node--inactive': !rootFocused,
            }"
            class="tree-node"
            :style="{ paddingRight: `${item.depth * 15}px`, cursor: 'default' }"
            @keydown="handleTreeNodeKeydown" @contextmenu="onContextMenu($event, item)"
          >
            <div class="tree-node__icon" :style="{ width: '16px', cursor: item.hasChildren ? 'pointer' : 'default' }" @click="toggleNodeExpansion(item)">
              <!--
                <VProgressCircular
                v-if="loading.has(item.id)"
                indeterminate
                size="14"
                width="2"
                />
              -->
              <VIcon size="16">
                {{ item.isExpanded ? 'tabler-chevron-down' : (item.hasChildren ? 'tabler-chevron-left' : '') }}
              </VIcon>
            </div>
            <div class="w-100" @click="treeStore.highlightNode(item.id)" @dblclick="selectTreeNode(item)">
              <div>
                <span v-if="!item.editing" class="tree-node__title no-select">{{ item.title }}</span>
                <VTextField
                  v-else
                  ref="editableNode"
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
            </div>
          </div>
        </template>
      </VVirtualScroll>
    </div>
    <!-- Selected Node Info -->
    <div>
      <VBtn
        v-if="selectedNode && selectedNode.id > 0"
        class="selected-node pr-1 pl-1 text-body-2"
        variant="text"
        @click="gotoNode(selectedNode.id, NodeSelectionType.selected, false)"
      >
        <p>
          {{ $t('tree.selectednode') }}: <span>{{ selectedNode.title }}</span>
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
