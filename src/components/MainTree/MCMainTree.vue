<script setup lang="ts">
import { VTreeview } from 'vuetify/labs/VTreeview'
import type { ISimpleTree } from '@/types/baseModels'
import { useSelectedNode } from '@/store/treeStore'

// watch(selectedProjects, (newvalue, oldvalue) => {
//     roleData.projects = convertSimpleTreeToSimpleDtoArray(projectList).filter((item) => selectedProjects.value.includes(item.id))
// })
const props = defineProps({
  title: { type: String },
})

const emit = defineEmits<Emit>()
const items = [{ title: 'Option 1', value: 'Option 1' }, { title: 'Option 2', value: 'Option 2' }, { title: 'Option 3', value: 'Option 3' }]
const projectList = reactive<ISimpleTree[]>([{ id: 1, title: 'موسوعه یک', children: [{ id: 2, title: 'درخت یک' }, { id: 3, title: 'درخت دو' }] }, { id: 4, title: 'موسوعه دو', children: [{ id: 5, title: 'درخت سه' }, { id: 6, title: 'درخت چهار', children: [{ id: 7, title: 'درخت پنج' }, { id: 8, title: 'درخت ثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثشش', children: [{ id: 51, title: 'درخت 9', children: [{ id: 65, title: 'درخت 9', children: [{ id: 21, title: 'درخت 9', children: [{ id: 54, title: 'درخت 9', children: [{ id: 80, title: 'درخت 9', children: [{ id: 90, title: 'درخت 9', children: [{ id: 19, title: 'درخت 9', children: [{ id: 91, title: 'درخت 9' }] }] }] }] }] }] }] }] }] }] }])
const selectedProjects = ref<number[]>([])

interface Emit {
  (e: 'close'): void // ایونت جدید close اضافه شد
  (e: 'open'): void // ایونت جدید close اضافه شد
}

const selectenode = useSelectedNode()

const selectTreeNode = (item: ISimpleTree) => {
  treeNodeDeselectAll(projectList)
  item.selected = true
  selectenode.value = item
}
</script>

<template>
  <div>
    <VRow no-gutters class="btn-box family-tree-toolbar">
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

    <VTreeview
      v-model:selected="selectedProjects" :items="projectList" expand-icon="mdi-menu-left" item-value="id"
      item-title="title" style="block-size: calc(100vh - 267px);cursor: default;"
      density="compact"
    >
      <template #title="{ item }">
        <div @dblclick="selectTreeNode(item)">
          <VTooltip :text="item.title">
            <template #activator="{ props }">
              <span v-bind="props" class="no-select" :style="item.selected ? 'color:red' : 'color:black'"> {{ item.title }}</span>
            </template>
          </VTooltip>
        </div>
      </template>
    </VTreeview>
  </div>
</template>

<style lang="css" scoped>
.v-list-item--link {
  cursor: default !important;
}
</style>
