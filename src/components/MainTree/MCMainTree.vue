<script setup lang="ts">
import { VTreeview } from 'vuetify/labs/VTreeview'
import { isNumericString, isUndefined } from '@sindresorhus/is'
import { useToast } from 'vue-toastification'
import ContextMenu from '@imengyu/vue3-context-menu'
import MCLoading from '../MCLoading.vue'
import type { GridResult, ISimpleDTO, ISimpleTree, ISimpleTreeActionable } from '@/types/baseModels'
import { createTreeIndex } from '@/types/tree'
import { useSelectedTree, useTree } from '@/store/treeStore'
import { useApiFake } from '@/composables/useApi'

// watch(activatedNode, (newvalue, oldvalue) => {
//     roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => activatedNode.value.includes(item.id))
// })
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
const isLoading = ref(true)
const selecteTreeStore = useSelectedTree()
const { treeData, treeIndex, selectNode, selectedNode, clearTreeData, deselectAllTreeNodes } = useTree()
const currentTreeId = ref(0)

// const currentNodeId = ref(0)

// const treeIndex = useTreeIndex()

const editableNode = ref()
const disabledSelection = ref(false)
const dialogAddNewNodeVisible = ref(false)
interface Emit {
  (e: 'close'): void
  (e: 'open'): void
  (e: 'showSelectTree'): void
}

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApiFake<GridResult<ISimpleTreeActionable>>(createUrl('/apps/maintree',
  { query: { treeid: currentTreeId } }), { immediate: false })

onFetchResponse(() => {
  if (resultData.value) {
    clearTreeData()
    treeData.push(resultData.value.items)
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
watch(route, newval => {
  checkTreeRoute(true)
  console.log('currentroute1', newval.query.snd)
}, { immediate: true })

function checkTreeRoute(deselectAll: boolean) {
  if (!route.query.gtd) {
    emit('showSelectTree')
    toast.error(t('alert.nothaveselecttree'))

    return
  }
  const gtd = atob(route.query.gtd.toString())
  if (!isNumericString(gtd)) {
    toast.error(t('alert.nothaveselecttree'))

    return
  }
  console.log('checkroute2', gtd, currentTreeId.value)

  if (currentTreeId.value === useToNumber(gtd).value && route.query.snd) {
    const snd = atob(route.query.snd.toString())
    if (isNumericString(snd) && selectedNode.id.toString() !== snd && treeIndex[snd]) {
      if (selectedNode.id > 0)
        treeIndex[selectedNode.id].selected = false
      else if (deselectAll)
        deselectAllTreeNodes()

      //   treeNodeDeselectAll(projectList)
      //   item.selected = true
      //   selectNode(item)
      selectNode(treeIndex[snd])
      gotoNode(useToNumber(snd).value)
    }
  }
  currentTreeId.value = useToNumber(gtd).value
}

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

// watch(openedNode, () => {
//   console.log('openednode', openedNode.value)
// })

const selectTreeNode = (item: ISimpleTreeActionable) => {
  router.push({ name: 'rs', query: { gtd: btoa(currentTreeId.value.toString()), snd: btoa(item.id.toString()) } })
}

// onMounted(() => {
//   setTimeout(() => {
//     fetchData()
//   }, 1000)
// })

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
    editNodeItem()
}
function editNodeItem() {
  if (activatedNode.value.length > 0) {
    disabledSelection.value = true
    treeIndex[activatedNode.value[0]].editing = true
    treeIndex[activatedNode.value[0]].tempData = treeIndex[activatedNode.value[0]].title
  }
}
function handleTreeViewKeydown(event: KeyboardEvent) {
//   if (event.key === ' ') {
//     event.preventDefault()
//     event.stopPropagation()
//   }
}
async function editNodeITem(nodeitem: ISimpleTreeActionable) {
  await setTimeout(() => {
    nodeitem.loading = nodeitem.editing = false
  }, 5000)
}

function handleEditableNodeKeydown(event: KeyboardEvent, item: ISimpleTreeActionable) {
  switch (event.key) {
    case ' ':
    event.stopPropagation()
      break;
    case 'Enter':
      event.stopPropagation()
      item.loading = true
      editNodeITem(item)
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
    nextTick(() => {
      const activeNode = document.querySelector('.v-list-item--active')
      if (activeNode)
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }
}

const nodeItemAdded = (nodeItem: ISimpleTreeActionable) => {
  toast.success(formatString(t('alert.specificNodeAdded'), nodeItem.title))
}

const onContextMenu = (e: MouseEvent, nodeItem: ISimpleTreeActionable) => {
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
          dialogAddNewNodeVisible.value = true
        },
      },
      {
        label: t('tree.editnode'),
        icon: 'tabler-edit',
        onClick: () => {
          editNodeItem()
        },
      },
      {
        label: t('tree.addcomment'),
        icon: 'tabler-square-plus',

        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('tree.merge'),
        icon: 'tabler-arrow-merge',

        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('tree.transfernode'),
        icon: 'tabler-arrow-merge-alt-left',

        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('tree.relation'),
        icon: 'tabler-affiliate',

        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('tree.duplicate'),
        icon: 'tabler-corner-down-right-double',

        onClick: () => {
          alert('You click a menu item')
        },
      },

    //   {
    //     label: 'A submenu',
    //     children: [
    //       { label: 'Item1' },
    //       { label: 'Item2' },
    //       { label: 'Item3' },
    //     ],
    //   },
    ],
  })
}
</script>

<template>
  <div class="mc-main-tree" @keydown="handleKeydown">
    <MCLoading :showloading="isLoading" />
    <MCDialogAddNewNode v-if="dialogAddNewNodeVisible" v-model:is-dialog-visible="dialogAddNewNodeVisible" :selected-node="treeIndex[activatedNode[0]]" @node-added="nodeItemAdded" />

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
            @dblclick="selectTreeNode(item)" @contextmenu="onContextMenu($event, item)"
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
    <VBtn v-if="selectedNode.id > 0" class="selected-node pr-1 pl-1 pb-1" variant="text" @click="gotoNode(selectedNode.id)">
      <p>
        {{ $t('tree.selectednode') }}: <span>
          {{ selectedNode.title }}
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
