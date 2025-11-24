<script setup lang="ts">

// NOTE: این یک اسکافولد اولیه است. به تدریج منطق از MCMainTreeV3 منتقل می‌شود.

// TODO مرحله‌ای: انتقال تدریجی (Expansion, Selection, Editing, DnD, ContextMenu)

import { type ISimpleFlatNodeActionable, NodeLocationType } from '@/types/tree'
import type { TreeServiceAdapter } from '@/services/treeServiceAdapter'
import { createDefaultTreeServiceAdapter } from '@/services/treeServiceAdapter'
import { useTreeStoreV3 } from '@/store/treeStoreV3'

// ------------------ Props ------------------
interface PermissionsFlags {
  create?: boolean
  delete?: boolean
  update?: boolean
  move?: boolean
  description?: boolean
  merge?: boolean
  reference?: boolean
}

const props = defineProps({
  treeId: { type: Number, required: true },
  serviceAdapter: { type: Object as () => TreeServiceAdapter, default: () => createDefaultTreeServiceAdapter() },
  permissions: { type: Object as () => (PermissionsFlags), default: () => ({}) },
  virtualItemHeight: { type: Number, default: 30 },
  treeHeight: { type: Number, default: 400 },
  labels: { type: Object as () => Record<string, string>, default: () => ({ selectedNode: 'Selected Node' }) },
  contextMenuBuilder: { type: Function as PropType<(node: ISimpleFlatNodeActionable) => Array<any>>, default: () => () => [] },
  i18nFn: { type: Function as PropType<(key: string) => string>, default: () => (key: string) => key },
})

const emit = defineEmits<{
  (e: 'nodeHighlight', node: ISimpleFlatNodeActionable): void
  (e: 'nodeSelect', node: ISimpleFlatNodeActionable): void
  (e: 'nodeEditStart', node: ISimpleFlatNodeActionable): void
  (e: 'nodeEditCommit', nodeId: number, title: string): void
  (e: 'nodeEditCancel', nodeId: number): void
  (e: 'nodeDragStart', node: ISimpleFlatNodeActionable): void
  (e: 'nodeDragUpdate', source: ISimpleFlatNodeActionable, target: ISimpleFlatNodeActionable | null, location: NodeLocationType | null, valid: boolean): void
  (e: 'nodeDragEnd'): void
  (e: 'nodeDrop', sourceId: number, destinationId: number, location: NodeLocationType): void

  // New pre/post drop events
  (e: 'nodedrop', payload: NodeDropIntentPayload): void
  (e: 'nodedropped', payload: NodeDroppedPayload): void
  (e: 'nodeContextMenu', node: ISimpleFlatNodeActionable, ev: MouseEvent): void
  (e: 'requestAddNode', parentNode: ISimpleFlatNodeActionable | null): void
  (e: 'requestDeleteNode', node: ISimpleFlatNodeActionable): void
  (e: 'requestMergeNode', node: ISimpleFlatNodeActionable): void
  (e: 'requestTransferNode', node: ISimpleFlatNodeActionable): void
  (e: 'requestRelationNode', node: ISimpleFlatNodeActionable): void
  (e: 'error', err: unknown): void
  (e: 'loaded', treeId: number): void
}>()

// ------------------ Emits ------------------
interface NodeDropIntentPayload {
  sourceNode: ISimpleFlatNodeActionable
  destinationNode: ISimpleFlatNodeActionable
  location: NodeLocationType
  preventDefault: () => void
  proceed: () => void
  cancel: () => void
}

interface NodeDroppedPayload {
  sourceId: number
  destinationId: number
  location: NodeLocationType
  sourceNode: ISimpleFlatNodeActionable
  destinationNode: ISimpleFlatNodeActionable
}

// ------------------ State / Store ------------------
const treeStore = useTreeStoreV3()
const rootEl = ref() as Ref<HTMLElement | undefined>
const treeEl = ref() as Ref<any>
const isLoading = ref(false)

// Helper cast برای رفع خطای نوع در template
const cast = (n: unknown) => n as ISimpleFlatNodeActionable

// Drag & Drop state
const dragState = ref({
  isDragging: false,
  draggedNode: null as ISimpleFlatNodeActionable | null,
  dropTarget: null as ISimpleFlatNodeActionable | null,
  dropPosition: null as NodeLocationType | null,
  validDrop: false,
})

// ------------------ Lifecycle ------------------
onMounted(async () => {
  if (props.treeId > 0) {
    treeStore.currentTreeId = props.treeId
    await refreshTree()
  }
})

// ------------------ Methods ------------------
async function refreshTree() {
  try {
    isLoading.value = true

    const data = await props.serviceAdapter.fetchTree(treeStore.currentTreeId)
    if (!data.nodes || data.nodes.length === 0) {
      treeStore.clearTree()
      emit('loaded', treeStore.currentTreeId)

      return
    }
    await treeStore.loadTree(data)
    emit('loaded', treeStore.currentTreeId)
  }
  catch (err) {
    emit('error', err)
  }
  finally {
    isLoading.value = false
  }
}

function highlightNode(id: number) {
  treeStore.highlightNode(id)

  const n = treeStore.getNode(id)
  if (n)
    emit('nodeHighlight', n)
}

function selectNode(id: number) {
  treeStore.selectNode(id)

  const n = treeStore.getNode(id)
  if (n)
    emit('nodeSelect', n)
}

function toggleNodeExpansion(event: MouseEvent, node: ISimpleFlatNodeActionable) {
  event.stopPropagation()
  treeStore.toggleNodeExpansion(node.id)
}

function startEditing(node: ISimpleFlatNodeActionable) {
  treeStore.startEditing(node.id)
  emit('nodeEditStart', node)
}

async function commitEdit(node: ISimpleFlatNodeActionable) {
  try {
    treeStore.setNodeLoading(node.id, true)
    await props.serviceAdapter.updateTitle(node.id, node.tempData)
    treeStore.completeEditing(node.id, node.tempData)
    emit('nodeEditCommit', node.id, node.tempData)
  }
  catch (err) {
    treeStore.setNodeFailed(node.id, true)
    emit('error', err)
  }
  finally {
    treeStore.setNodeLoading(node.id, false)
  }
}

function cancelEdit(node: ISimpleFlatNodeActionable) {
  treeStore.cancelEditing(node.id)
  emit('nodeEditCancel', node.id)
}

// --- Drag & Drop (generic) ---
function validateGenericDrop(source: ISimpleFlatNodeActionable, target: ISimpleFlatNodeActionable): boolean {
  const notSame = source.id !== target.id
  const notDescendant = !treeStore.isDescendant(target.id, source.id)

  return notSame && notDescendant
}

function onDragStart(e: DragEvent, node: ISimpleFlatNodeActionable) {
  dragState.value.isDragging = true
  dragState.value.draggedNode = node
  dragState.value.dropTarget = null
  dragState.value.dropPosition = null
  dragState.value.validDrop = false
  e.dataTransfer?.setData('text/plain', String(node.id))
  e.dataTransfer && (e.dataTransfer.effectAllowed = 'move')
  emit('nodeDragStart', node)
}

function onDragOver(e: DragEvent, node: ISimpleFlatNodeActionable) {
  if (!dragState.value.isDragging || !dragState.value.draggedNode)
    return
  e.preventDefault()

  const source = dragState.value.draggedNode
  const canDrop = validateGenericDrop(source, node)

  dragState.value.validDrop = canDrop
  dragState.value.dropTarget = node

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const relY = e.clientY - rect.top
  const third = rect.height / 3
  let position: NodeLocationType
  if (relY < third)
    position = NodeLocationType.SiblingBefore
  else if (relY > third * 2)
    position = NodeLocationType.SiblingAfter
  else position = NodeLocationType.Children
  dragState.value.dropPosition = position
  e.dataTransfer && (e.dataTransfer.dropEffect = canDrop ? 'move' : 'none')
  emit('nodeDragUpdate', source, node, canDrop ? position : null, canDrop)
}

function onDragLeave() {
  dragState.value.dropTarget = null
  dragState.value.dropPosition = null
  dragState.value.validDrop = false
}

function onDrop(e: DragEvent, node: ISimpleFlatNodeActionable) {
  e.preventDefault()
  if (!dragState.value.isDragging || !dragState.value.draggedNode || !dragState.value.validDrop || !dragState.value.dropPosition)
    return resetDrag()

  const source = dragState.value.draggedNode
  const location = dragState.value.dropPosition

  if (!source || !location)
    return resetDrag()

  let prevented = false
  let settled = false

  const proceed = () => {
    if (settled)
      return
    settled = true
    emit('nodeDrop', source.id, node.id, location) // backward compatibility
    emit('nodedropped', {
      sourceId: source.id,
      destinationId: node.id,
      location,
      sourceNode: source,
      destinationNode: node,
    })
    resetDrag()
  }

  const cancel = () => {
    prevented = true
    settled = true
    resetDrag()
  }

  const preventDefault = () => {
    prevented = true
  }

  emit('nodedrop', { sourceNode: source, destinationNode: node, location, preventDefault, proceed, cancel })

  if (!prevented)
    proceed()
}

function resetDrag() {
  if (dragState.value.isDragging)
    emit('nodeDragEnd')
  dragState.value.isDragging = false
  dragState.value.draggedNode = null
  dragState.value.dropTarget = null
  dragState.value.dropPosition = null
  dragState.value.validDrop = false
}

function emitContextMenu(ev: MouseEvent, node: ISimpleFlatNodeActionable) {
  emit('nodeContextMenu', node, ev)
}

// ------------------ Expose (اختیاری برای مصرف‌کننده) ------------------
defineExpose({ refreshTree, highlightNode, selectNode })
</script>

<template>
  <div ref="rootEl" class="mctree-view d-flex flex-column h-100">
    <!-- Loader Slot / یا حالت پیش فرض -->
    <slot name="loader" :loading="isLoading">
      <div v-if="isLoading" class="pa-2 text-caption">
        Loading...
      </div>
    </slot>

    <!-- Tree Column Header -->
    <div class="d-flex flex-row justify-space-between flex-shrink-0 w-100">
      <div>&nbsp;</div>
      <div class="excerpt-count--header">
        {{ $t('excerptcount') }}
      </div>
    </div>
    <div class="tree-container">
      <!-- Virtual Tree -->
      <VVirtualScroll
        ref="treeEl"
        :items="treeStore.flatVisibleNodes"
        :height="treeHeight" :item-height="virtualItemHeight"
      >
        <template #default="{ item }">
          <!-- Cast item to expected type for TS in template -->
          <!-- placeholder retained intentionally for ts casting; can be removed -->
          <div
            :id="`mctree-node-${cast(item).id}`"
            class="mctree-node d-flex flex-row align-center"
            :class="{
              'is-highlighted': cast(item).highlighted,
              'is-selected': cast(item).selected,
              'drag-source': dragState.isDragging && dragState.draggedNode?.id === cast(item).id,
              'drag-target': dragState.isDragging && dragState.dropTarget?.id === cast(item).id,
              'drop-valid': dragState.isDragging && dragState.dropTarget?.id === cast(item).id && dragState.validDrop,
              'drop-before': dragState.isDragging && dragState.dropTarget?.id === cast(item).id && dragState.dropPosition === NodeLocationType.SiblingBefore,
              'drop-after': dragState.isDragging && dragState.dropTarget?.id === cast(item).id && dragState.dropPosition === NodeLocationType.SiblingAfter,
              'drop-inside': dragState.isDragging && dragState.dropTarget?.id === cast(item).id && dragState.dropPosition === NodeLocationType.Children,
            }"
            :style="{ paddingRight: `${cast(item).depth * 14}px` }"
            draggable="true"
            @click="highlightNode(cast(item).id)"
            @dblclick="selectNode(cast(item).id)"
            @dragstart="onDragStart($event, cast(item))"
            @dragover="onDragOver($event, cast(item))"
            @dragleave="onDragLeave"
            @drop="onDrop($event, cast(item))"
            @dragend="resetDrag"
            @contextmenu.prevent="emitContextMenu($event, cast(item))"
          >
            <!-- Prefix Slot -->
            <div class="node-prefix" @click.stop="toggleNodeExpansion($event, cast(item))">
              <slot name="node-prefix" :node="item">
                <VIcon size="16">
                  {{ cast(item).hasChildren ? (cast(item).isExpanded ? 'tabler-chevron-down' : 'tabler-chevron-left') : '' }}
                </VIcon>
              </slot>
            </div>

            <!-- Title / Editing -->
            <div class="flex-grow-1">
              <slot name="node-title" :node="item">
                <span v-if="!cast(item).editing">{{ cast(item).title }}</span>
                <VTextField
                  v-else
                  v-model="cast(item).tempData"
                  density="compact"
                  variant="outlined"
                  autofocus
                  @blur="cancelEdit(cast(item))"
                  @keydown.enter.prevent="commitEdit(cast(item))"
                  @keydown.esc.prevent="cancelEdit(cast(item))"
                />
              </slot>
            </div>

            <!-- Suffix Slot (Meta / Actions) -->
            <div class="node-suffix d-flex flex-row gap-1">
              <slot name="node-suffix" :node="item">
                <VBtn
                  v-if="permissions.update && !cast(item).editing"
                  size="x-small" variant="text"
                  @click.stop="startEditing(cast(item))"
                >
                  E
                </VBtn>
              </slot>
            </div>
          </div>
        </template>
      </VVirtualScroll>
    </div>
    <!-- Selected Node Indicator -->
    <div v-if="treeStore.selectedNode" class="selected-node mt-2">
      {{ labels.selectedNode }}: {{ treeStore.selectedNode.title }}
    </div>

    <!-- Empty State -->
    <slot v-if="!isLoading && treeStore.flatVisibleNodes.length === 0" name="empty">
      <div class="text-caption text-disabled pa-2">
        Empty
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.mctree-view {
  font-size: 13px;
}

.mctree-node {
  block-size: 30px;
  user-select: none;
}

.mctree-node.is-highlighted {
  background: rgba(0, 0, 0, 6%);
}

.mctree-node.is-selected {
  background: rgba(0, 123, 255, 15%);
}

.mctree-node.drag-target.drop-valid.drop-before {
  box-shadow: inset 0 4px 0 0 var(--v-primary-base);
  outline: 2px dashed var(--v-primary-base);
  outline-offset: -2px;
}

.mctree-node.drag-target.drop-valid.drop-after {
  box-shadow: inset 0 -4px 0 0 var(--v-primary-base);
  outline: 2px dashed var(--v-primary-base);
  outline-offset: -2px;
}

.mctree-node.drag-target.drop-valid.drop-inside {
  outline: 2px solid var(--v-primary-base);
  outline-offset: -2px;
}

.selected-node {
  font-size: 12px;
}

.node-prefix {
  inline-size: 16px;
}
</style>
