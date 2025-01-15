<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import { useSelectedNode } from '@/store/treeStore'
import type { IDataShelfBox } from '@/types/dataShelf'

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const selectenode = useSelectedNode()
interface Props {
  databoxitem: IDataShelfBox
}
interface Emits {
  (e: 'addtag', dataBoxId: number): void
  (e: 'editdataboxcontent', dataBoxId: IDataShelfBox): void

}

const onContextMenu = (e: MouseEvent) => {
  // prevent the browser's default menu
  e.preventDefault()

  // show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: 'A menu item',
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: 'A submenu',
        children: [
          { label: 'Item1' },
          { label: 'Item2' },
          { label: 'Item3' },
        ],
      },
    ],
  })
}
</script>

<template>
  <VCard class="mc-data-shelf-box">
    <VCardText>
      <VRow no-gutters class="justify-start align-start box" @contextmenu="onContextMenu($event)">
        <VCheckbox density="compact" />
        <VCol class="data-box-content">
          <p class="text">
            {{ props.databoxitem.text }}
          </p>
          <div class="foot-note">
            این قسمت محل پاورقی
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VRow no-gutters class="border-t-sm" justify="space-between">
      <div>
        <VRow no-gutters class="btn-box data-box-toolbar">
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-pin" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-info-circle" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="$emit('editdataboxcontent', databoxitem)">
            <VIcon icon="tabler-edit" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-box-multiple" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-plug-connected-x" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-trash-x" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="$emit('addtag', databoxitem.id)">
            <VIcon icon="tabler-tag" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-square-plus" size="22" />
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-text-plus" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-layers-linked" size="22" />
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-refresh" size="22" />
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-history" size="22" />
          </VBtn>
        </VRow>
      </div>
      <div>
        <VRow no-gutters class="btn-box data-box-toolbar d-flex justify-content-between">
          <VIcon v-if="(databoxitem.connectedTreeNode?.id ?? 0) > 0" icon="tabler-plug-connected-x" size="12" />
          <VIcon v-if="(databoxitem.comment?.length ?? 0) > 0" icon="tabler-message" size="12" />
          <VIcon v-if="(databoxitem.tags?.length ?? 0) > 0" icon="tabler-tag" size="12" />
        </VRow>
      </div>
    </VRow>
  </VCard>
</template>

<style lang="css" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
