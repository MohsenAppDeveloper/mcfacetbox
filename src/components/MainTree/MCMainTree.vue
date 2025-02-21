<script setup lang="ts">
import { VTreeview } from 'vuetify/labs/VTreeview'
import { isUndefined } from '@sindresorhus/is'
import { useToast } from 'vue-toastification'
import MCLoading from '../MCLoading.vue'
import type { GridResult, ISimpleTree, ISimpleTreeActionable } from '@/types/baseModels'
import { createTreeIndex } from '@/types/tree'
import { useSelectedNode } from '@/store/treeStore'

// watch(activatedNode, (newvalue, oldvalue) => {
//     roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => activatedNode.value.includes(item.id))
// })
const props = defineProps({
  title: { type: String },
})

const emit = defineEmits<Emit>()
const treeview = ref()
const items = [{ title: 'Option 1', value: 'Option 1' }, { title: 'Option 2', value: 'Option 2' }, { title: 'Option 3', value: 'Option 3' }]
const treeData = reactive<ISimpleTreeActionable[]>([])
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

// const { F2, alt_s } = useMagicKeys()
const activatedNode = ref<number[]>([])
const openedNode = ref<number[]>([])
const treeIndex = reactive<Record<number, ISimpleTreeActionable>>({})
const editableNode = ref()
const disabledSelection = ref(false)

interface Emit {
  (e: 'close'): void // ایونت جدید close اضافه شد
  (e: 'open'): void // ایونت جدید close اضافه شد
}
const selectenode = useSelectedNode()
const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi<GridResult<ISimpleTreeActionable>>(createUrl('/apps/maintree'), { immediate: false })

onFetchResponse(response => {
  response.json().then(value => {
    if (resultData.value) {
      treeData.push(resultData.value.items)
      updateTreeIndex(treeData)
    }
    if (isUndefined(treeData))
      toast.error(t('alert.probleminGetInformation'))

    // if ((resultData.value?.items ?? 0) <= 0)
    //   toast.info(t('alert.resultNotFound'))
  })
})
onFetchError(response => {
  toast.error(t('alert.dataActionFailed'))
})

// watch(F2, v => {
//   if (v && activatedNode.value[0])
//     treeIndex[activatedNode.value[0]].editing = true
// })
// watch(alt_s, v => {
//   if (v)
//     console.log('Control+A+B have been pressed')
// })
function updateTreeIndex(dataItems: ISimpleTree[]) {
  // اینجا فرض می‌شود که createTreeIndex(tree) یک شیء جدید برمی‌گرداند
  const newTreeIndex = createTreeIndex(dataItems)

  // به‌روزرسانی مقادیر در treeIndex
  Object.assign(treeIndex, { ...newTreeIndex })
}
watch(openedNode, () => {
  console.log('openednode', openedNode.value)
})

const selectTreeNode = (item: ISimpleTree) => {
  if (selectenode.simpleTreeModelStored.id > 0)
    treeIndex[selectenode.simpleTreeModelStored.id].selected = false

  //   treeNodeDeselectAll(projectList)
  item.selected = true
  selectenode.simpleTreeModelStored.id = item.id
  selectenode.simpleTreeModelStored.title = item.title
  selectenode.simpleTreeModelStored.selected = item.selected
  selectenode.simpleTreeModelStored.children = item.children
}

onMounted(() => {
  setTimeout(() => {
    fetchData()
  }, 1000)
})

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
  if (event.key === 'F2' && activatedNode.value.length > 0) {
    disabledSelection.value = true
    treeIndex[activatedNode.value[0]].editing = true
    treeIndex[activatedNode.value[0]].tempData = treeIndex[activatedNode.value[0]].title
  }
}
function handleTreeViewKeydown(event: KeyboardEvent) {
  console.log('pressetree', event.key)

//   if (event.key === ' ') {
//     event.preventDefault()
//     event.stopPropagation()
//   }
}
function handleEditableNodeKeydown(event: KeyboardEvent, item: ISimpleTreeActionable) {
  console.log('pressetextbox', event.key)

  switch (event.key) {
    case ' ':
    event.stopPropagation()
      break;
    case 'Enter':
      event.stopPropagation()
      item.loading = true
      setTimeout(() => {
        item.loading = false
      }, 3000)
      break;
    case 'Escape':
      if (item.loading)
        break;
      item.loading = item.editing = false
      item.title = item.tempData
      break;
    default:
      break;
  }
}
function gotoNode(nodeId: number) {
  if (nodeId > 0) {
    treeIndex[nodeId].selected = true
    openParents(treeData, nodeId)
    setTimeout(() => {
      const activeNode = document.querySelector('.v-list-item--active')
      if (activeNode)
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 1000)
  }
}

// watch(selectenode.simpleTreeModelStored, newval => {
//   console.log('storechange', newval)
// })
</script>

<template>
  <div class="mc-main-tree" @keydown="handleKeydown">
    <MCLoading :showloading="loadingdata" />
    <VRow no-gutters class="btn-box toolbar">
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-search" size="22" />
      </IconBtn>
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-box-multiple" size="22" />
      </IconBtn>
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-select" size="22" />
      </IconBtn>
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-trash-x" size="22" />
      </IconBtn>
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-plug-connected" size="22" />
      </IconBtn>
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-brand-openai" size="22" />
      </IconBtn>
      <IconBtn size="small" @click="">
        <VIcon icon="tabler-eraser" size="22" />
      </IconBtn>
    </VRow>

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
            :class="`no-select ${item.selected ? 'selected' : ''}`" :style="item.selected ? 'color:red' : ''"
            @dblclick="selectTreeNode(item)"
          >
            <!--
              <VTooltip :text="item.title">
              <template #activator="{ props }">
            -->
            <VRow dense class="mx-0">
              <VCol class="tree-title">
                <span v-if="!(item.editing ?? false)">{{ item.title }}</span>
                <VTextField
                  v-else ref="editableNode" v-model:model-value="item.title" autofocus :placeholder="item.title" :loading="item.loading"
                  :focused="!(item.loading ?? false)" :readonly="item.loading ?? false" @keydown="handleEditableNodeKeydown($event, item)"
                />
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
    <VBtn v-if="selectenode.simpleTreeModelStored.id > 0" class="selected-node pr-1 pl-1 pb-1" variant="text" @click="gotoNode(selectenode.simpleTreeModelStored.id)">
      <p>
        {{ $t('tree.selectednode') }}: <span>
          {{ selectenode.simpleTreeModelStored.title }}
        </span>
      </p>
    </VBtn>
    <!--
      <Loading
      v-model:active="isLoading"
      can-cancel
      :is-full-page="false"
      />
    -->
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
