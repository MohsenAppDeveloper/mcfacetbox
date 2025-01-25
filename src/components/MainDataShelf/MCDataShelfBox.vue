<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import { useSelectedNode } from '@/store/treeStore'
import { type IDataShelfBox } from '@/types/dataShelf'

// const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const isDialogDataShelfBoxEdit = ref(false)
const databoxItem = defineModel<IDataShelfBox>()

const selectenode = useSelectedNode()

// interface Props {
//   databoxitem: IDataShelfBox
// }
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
    <VCardText class="h-auto">
      <VRow no-gutters class="justify-start align-start box" @contextmenu="onContextMenu($event)">
        <VCheckbox density="compact" />
        <VCol>
          <div class="text pb-1" v-html="databoxItem?.text" />
          <VDivider v-if="databoxItem?.footnotes.length ?? 0 > 0" />
          <div v-for="item in databoxItem?.footnotes" :key="item.id" class="d-flex flex-column">
            <div>
              <span class="footenote-index">{{ item.index }} -</span>
              <span class="no-select foot-note">{{ item.title }}</span>
              <!--
                <VBtn icon size="small" variant="text" @click.left="deletefootnote">
                <VIcon icon="tabler-trash" color="error" size="16" />
                </VBtn>
              -->
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VRow no-gutters class="border-t-sm" justify="space-between">
      <div>
        <VRow no-gutters class="btn-box data-box-toolbar">
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-pin" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.pintotop') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-info-circle" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.about') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="isDialogDataShelfBoxEdit = true">
            <VIcon icon="tabler-edit" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.edit') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-box-multiple" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.duplicate') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-plug-connected" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.connecttonode') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-trash-x" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.delete') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="$emit('addtag', databoxItem?.id ?? 0)">
            <VIcon icon="tabler-tag" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.addtag') }}
            </VTooltip>
          </VBtn>
          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-square-plus" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.addcomment') }}
            </VTooltip>
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-circles-relation" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.showrelateddata') }}
            </VTooltip>
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-refresh" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.refreshtobase') }}
            </VTooltip>
          </VBtn>

          <VBtn icon size="25" variant="text" @click="">
            <VIcon icon="tabler-history" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('datashelfbox.showhistory') }}
            </VTooltip>
          </VBtn>
        </VRow>
      </div>
      <div>
        <VRow no-gutters class="btn-box data-box-toolbar d-flex justify-content-between">
          <VIcon v-if="(databoxItem?.connectedTreeNode?.id ?? 0) > 0" icon="tabler-plug-connected-x" size="12" />
          <VIcon v-if="(databoxItem?.comment?.length ?? 0) > 0" icon="tabler-message" size="12" />
          <VIcon v-if="(databoxItem?.tags?.length ?? 0) > 0" icon="tabler-tag" size="12" />
        </VRow>
      </div>
      <MCDialogDataShelfBoxEdit v-if="isDialogDataShelfBoxEdit" v-model:is-dialog-visible="isDialogDataShelfBoxEdit" v-model:databox-item="databoxItem" />
    </VRow>
  </VCard>
</template>

<style lang="css" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
