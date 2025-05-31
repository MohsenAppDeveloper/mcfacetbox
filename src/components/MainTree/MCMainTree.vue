<script setup lang="ts">
import { VTreeview } from 'vuetify/labs/VTreeview'
import { isNumericString, isUndefined } from '@sindresorhus/is'
import { useToast } from 'vue-toastification'
import ContextMenu from '@imengyu/vue3-context-menu'
import Swal from 'sweetalert2'
import MCLoading from '../MCLoading.vue'
import MCDialogTransferNode from '../dialogs/MCDialogTransferNode.vue'
import { type ISimpleDTO, type ISimpleTree, type ISimpleTreeActionable, SimpleTreeAcionableModel, SizeType } from '@/types/baseModels'
import type { INodeView } from '@/types/tree'
import { NodeType, createTreeIndex, getNodeTypeNameSpace } from '@/types/tree'
import { useSelectedTree, useTree } from '@/store/treeStore'
import { SelectionType } from '@/types/baseModels'

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
const selecteTreeStore = useSelectedTree()
const { treeData, treeIndex, selectNode, selectedNode, clearTreeData, deselectAllTreeNodes, deleteNode, transferNode, isLastNode } = useTree()
const currentTreeId = ref(0)
const nodeTempTitleForEdit = ref('')
const searchResultSelectedNodes = ref<number[]>([])
const hasDraggableState = ref(false)
const hasDividerDraggableBefore = ref(false)
const hasDividerDraggableAfter = ref(false)
const sourceDraggableItem = ref<ISimpleTreeActionable | null>(null)
const activeDraggableItem = ref<ISimpleTreeActionable | null>(null)
const editableNode = ref()
const activeSearch = ref(false)
const showDisconnectedDatabox = ref(false)
const dialogAddNewNodeVisible = ref(false)
const dialogMergeNodeVisible = ref(false)
const dialogTransferNodeVisible = ref(false)

interface Emit {
  (e: 'close'): void
  (e: 'open'): void
  (e: 'showSelectTree'): void
}

// watch(activatedNode, (newvalue, oldvalue) => {
//   console.log('activenode', activatedNode.value)
// })

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi<ISimpleTreeActionable[]>(createUrl('app/node/hierarchy',
  { query: { treeid: currentTreeId } }), { immediate: false })

onFetchResponse(() => {
  if (resultData.value) {
    activatedNode.value.splice(0)
    clearTreeData()
    treeData.push(...resultData.value)
    updateTreeIndex(treeData)

    // console.log('loadtree')
    checkTreeRoute(false)
  }
  if (isUndefined(treeData))
    toast.error(t('alert.probleminGetInformation'))
  isLoading.value = false
})
onFetchError(() => {
  toast.error(t('alert.dataActionFailed'))
  isLoading.value = false
})
watch(loadingdata, () => {
  if (loadingdata.value)
    isLoading.value = true
})
watch(currentTreeId, async () => {
  try {
    if (currentTreeId.value !== selecteTreeStore.value.id) {
      const treeDataResult = await $api<ISimpleDTO<number>>(`app/tree/${currentTreeId.value}`)

      selecteTreeStore.value.id = treeDataResult.id
      selecteTreeStore.value.title = treeDataResult.title
    }
  }
  catch (error) {

  }
})
watch(searchResultSelectedNodes, () => {
  activatedNode.value.splice(0)
  activatedNode.value.push(...searchResultSelectedNodes.value)
  gotoNode(searchResultSelectedNodes.value[0], false)
})
watch(route, () => {
  checkTreeRoute(true)
}, { immediate: true })

const selectTreeNode = (item: ISimpleTreeActionable) => {
  const newQuery = { ...route.query }

  Object.keys(newQuery).forEach(key => {
    delete newQuery[key]
  })

  //   router.push({ name: 'rs', query: { gtd: btoa(currentTreeId.value.toString()), snd: btoa(item.id.toString()) } })
  newQuery.gtd = btoa(currentTreeId.value.toString())
  if (item.id > 0)
    newQuery.snd = btoa(item.id.toString())

  router.push({ query: newQuery })
}

watch(showDisconnectedDatabox, newval => {
  if (newval)
    selectTreeNode(new SimpleTreeAcionableModel(0))
})
function checkTreeRoute(deselectAll: boolean) {
  if (!route.query.gtd) {
    emit('showSelectTree')
    toast.warning(t('alert.nothaveselecttree'))

    return
  }
  const gtd = atob(route.query.gtd.toString())
  if (!isNumericString(gtd)) {
    toast.warning(t('alert.nothaveselecttree'))

    return
  }

  if (currentTreeId.value === useToNumber(gtd).value) {
    const snd = route.query.snd ? atob(route.query.snd.toString()) : '0'

    // && selectedNode.id.toString() !== snd
    if (isNumericString(snd)) {
      if (selectedNode.id > 0)
        treeIndex[selectedNode.id].selected = false
      else if (deselectAll)
        deselectAllTreeNodes()
      if (snd === '0') {
        showDisconnectedDatabox.value = true
        selectNode(new SimpleTreeAcionableModel())
      }
      else {
        showDisconnectedDatabox.value = false
        selectNode(treeIndex[snd])
        gotoNode(useToNumber(snd).value)
      }
    }
  }

  currentTreeId.value = useToNumber(gtd).value
}
function selectSearchTree() {
  activeSearch.value = !activeSearch.value
}
function updateTreeIndex(dataItems: ISimpleTree[]) {
  const newTreeIndex = createTreeIndex(dataItems)

  // به‌روزرسانی مقادیر در treeIndex
  Object.assign(treeIndex, { ...newTreeIndex })
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
function nodeEditCancel(nodeitem: ISimpleTreeActionable) {
  nodeitem.loading = nodeitem.editing = false
  nodeitem.failed = false
  nodeitem.title = useCloned(nodeitem.tempData).cloned.value
  treeview.value.$el.focus()
}
async function nodeEditProgress(nodeitem: ISimpleTreeActionable) {
  nodeitem.loading = true
  try {
    await $api(`app/node/${nodeitem.id}/title`, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify({ title: nodeTempTitleForEdit.value })),
      ignoreResponseError: false,
    })

    nodeitem.loading = nodeitem.editing = false
    setTimeout(() => {
      treeIndex[nodeitem.id].title = nodeTempTitleForEdit.value
      if (selectedNode.id > 0)
        selectedNode.title = nodeTempTitleForEdit.value

      treeview.value.$el.focus()
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
function handleEditableNodeKeydown(event: KeyboardEvent, item: ISimpleTreeActionable) {
  switch (event.key) {
    case ' ':
    event.stopPropagation()
      break;
    case 'Enter':
      event.stopPropagation()
      nodeEditProgress(item)
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
function gotoNode(nodeId: number, mustSelectNode: boolean = true) {
  if (nodeId > 0) {
    treeIndex[nodeId].selected = mustSelectNode
    openParents(treeData, nodeId)
    nextTick(() => {
      const activeNode = document.querySelector('.v-list-item--active')
      if (activeNode)
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }
}

const deleteSelectedNode = async (nodeItem: ISimpleTreeActionable) => {
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
    console.log('error', serviceError.value)

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

const nodeItemAdded = (nodeItem: ISimpleTreeActionable) => {
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

function treeDividerMouseDown(mouseEvent: MouseEvent) {
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
function treeDividerMouseUp(mouseEvent: MouseEvent, treeItem: ISimpleTreeActionable, transfertype: NodeType) {
  if (sourceDraggableItem.value && sourceDraggableItem.value.id !== treeItem.id && activeDraggableItem.value)
    transferNodeWithDraggableMouse(transfertype, sourceDraggableItem.value, activeDraggableItem.value)
}
function treeItemMouseDown(mouseEvent: MouseEvent, treeItem: ISimpleTreeActionable) {
  hasDraggableState.value = true

  sourceDraggableItem.value = treeItem
}
function treeItemMouseLeave(mouseEvent: MouseEvent, treeItem: ISimpleTreeActionable) {
  if (mouseEvent.buttons === 0)
    resetMouseDraggable()

  if (sourceDraggableItem.value && sourceDraggableItem.value.id === treeItem.id) {
    activatedNode.value.splice(0)
    activatedNode.value.push(treeItem.id)
  }
}
function treeItemMouseEnter(mouseEvent: MouseEvent, treeItem: ISimpleTreeActionable) {
  if (mouseEvent.buttons === 0)
    resetMouseDraggable()
  if (hasDraggableState.value) {
    activeDraggableItem.value = treeItem
    setTimeout(() => {
      if (activeDraggableItem.value?.id === treeItem.id && !openedNode.value.includes(treeItem.id))
        openedNode.value.push(treeItem.id)
    }, 2000)
  }
}
function treeItemMouseUp(mouseEvent: MouseEvent, treeItem: ISimpleTreeActionable) {
  if (sourceDraggableItem.value && sourceDraggableItem.value.id !== treeItem.id && activeDraggableItem.value)
    transferNodeWithDraggableMouse(NodeType.Children, sourceDraggableItem.value, activeDraggableItem.value)
}
async function transferNodeWithDraggableMouse(transfertype: NodeType, sourceNodeItem: ISimpleTreeActionable, destinationNodeItem: ISimpleTreeActionable) {
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
  await fetchData()
}

const addcomment = async (nodeItem: ISimpleTreeActionable) => {
  let resultTree: INodeView | null = null

  try {
    await showLoadingSwal(t('tree.loadingnodedetail'), async () => {
      resultTree = await $api<INodeView>(
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

const onContextMenu = (e: MouseEvent, nodeItem: ISimpleTreeActionable) => {
  resetMouseDraggable()

  // prevent the browser's default menu
  e.preventDefault()
  activatedNode.value = [nodeItem.id]

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: t('tree.newnode'),
        icon: 'tabler-plus',
        onClick: () => {
          selectTreeNode(nodeItem)
          dialogAddNewNodeVisible.value = true
        },
      },
      {
        label: t('tree.deletenode'),
        icon: 'tabler-trash',
        customClass: 'error',
        onClick: () => {
          deleteSelectedNode(nodeItem)
        },
      },
      {
        label: t('tree.editnode'),
        icon: 'tabler-edit',
        onClick: () => {
          nodeEditStart()
        },
      },
      {
        label: t('tree.comment'),
        icon: 'tabler-square-plus',
        onClick: () => {
          addcomment(nodeItem)
        },
      },
      {
        label: t('tree.merge'),
        icon: 'tabler-arrow-merge',

        onClick: () => {
          selectTreeNode(nodeItem)
          dialogMergeNodeVisible.value = true
        },
      },
      {
        label: t('tree.transfernode'),
        icon: 'tabler-arrow-merge-alt-left',

        onClick: () => {
          console.log('treeindex', treeIndex)

          selectTreeNode(nodeItem)
          dialogTransferNodeVisible.value = true
        },
      },
      {
        label: t('tree.relation'),
        icon: 'tabler-affiliate',

        onClick: () => {
          alert('You click a menu item')
        },
      },
    ],
  })
}
</script>

<template>
  <div class="mc-main-tree" @keydown="handleKeydown">
    <MCLoading :showloading="isLoading" :loadingsize="SizeType.XL" />
    <MCDialogAddNewNode
      v-if="dialogAddNewNodeVisible" v-model:is-dialog-visible="dialogAddNewNodeVisible" :selected-tree-id="currentTreeId" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleTreeAcionableModel(-1, '', -1)"
      @node-added="nodeItemAdded" @node-added-failed="nodeaddfailed"
    />
    <MCDialogMergeNode
      v-if="dialogMergeNodeVisible" v-model:is-dialog-visible="dialogMergeNodeVisible" :selected-tree-id="currentTreeId" :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleTreeAcionableModel(-1, '', -1)"
      @nodemerged="nodeMerged" @node-merge-failed="nodeaddfailed"
    />
    <MCDialogTransferNode
      v-if="dialogTransferNodeVisible" v-model:is-dialog-visible="dialogTransferNodeVisible" :selected-tree-id="currentTreeId" :parent-node-title="parentNodeTitle(activatedNode.length > 0 ? activatedNode[0] : null)" :selected-node="isValidActivateNode() ? treeIndex[activatedNode[0]] : new SimpleTreeAcionableModel(-1, '', -1)"
      @node-transfered="nodeTransfered" @node-transfer-faild="nodeaddfailed"
    />
    <VRow no-gutters class="btn-box toolbar">
      <VCol md="12">
        <div class="d-flex toolbar">
          <VBtn size="small" variant="text" @click=" dialogAddNewNodeVisible = true">
            <VIcon icon="tabler-plus" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.selectall') }}
            </VTooltip>
          </VBtn>

          <VBtn size="small" :variant="activeSearch ? 'elevated' : 'text'" @click="selectSearchTree">
            <VIcon icon="tabler-search" size="22" />

            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('search') }}
            </VTooltip>
          </VBtn>
          <VBtn size="small" variant="text">
            <VIcon icon="tabler-box-multiple" size="22" />

            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('tree.duplicate') }}
            </VTooltip>
          </VBtn>
          <!-- <VBtn icon="tabler-select" size="small" variant="text" /> -->

          <VBtn size="small" :variant="showDisconnectedDatabox ? 'elevated' : 'text'" @click="showDisconnectedDatabox = !showDisconnectedDatabox">
            <VIcon icon="tabler-arrow-capsule" size="22" />

            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('showdisconnectedfish') }}
            </VTooltip>
          </VBtn>

          <VBtn size="small" variant="text">
            <VIcon icon="tabler-eraser" size="22" />

            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('tree.treecleaning') }}
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
        </div>
      </VCol>
    </VRow>
    <VExpandTransition>
      <VRow v-if="activeSearch" class="mt-0 mb-2">
        <VCol md="12">
          <MCSearchApiTree
            v-model:selected-items="searchResultSelectedNodes"
            auto-focus :max-height="300" :api-url="`app/node/simple?treeid=${currentTreeId}`" :selection-type="SelectionType.Single" class="pt-1"
          />
          <VDivider thickness="2" color="primary" />
        </VCol>
      </VRow>
    </VExpandTransition>

    <VRow dense class="header">
      <VCol />
      <VCol cols="auto">
        {{ $t('tree.nodes') }}
      </VCol>
    </VRow>

    <div class="tree-view-scroll ">
      <VTreeview
        ref="treeview" v-model:activated="activatedNode" v-model:opened="openedNode"
        activatable :items="treeData" expand-icon="mdi-menu-left" item-value="id"
        item-title="title" density="compact" :lines="false" @keydown="handleTreeViewKeydown"
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
              <VCol class="tree-title d-flex flex-column">
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
                  <div style="width: 95%;">
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
              <VCol cols="auto" class="tree-node">
                <template v-if="item.children && item.children.length > 0">
                  {{ item.children.length }}
                </template>
              </VCol>
            </VRow>
            <!--
              </template>
              </VTooltip>
            -->
          </div>
        </template>
      </VTreeview>
    </div>
    <VBtn
      v-if="selectedNode.id
        > 0" class="selected-node pr-1 pl-1 pb-1" variant="text" @click="gotoNode(selectedNode.id)"
    >
      <p>
        {{ $t('tree.selectednode') }}: <span>
          {{ selectedNode.title }}
        </span>
      </p>
    </VBtn>
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
