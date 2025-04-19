<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import { isUndefined } from '@sindresorhus/is'
import type { ISearchResultTabBox } from '@/types/SearchResult'
import type { ISimpleDTO, ISimpleTreeActionable } from '@/types/baseModels'
import { MessageType, SizeType } from '@/types/baseModels'
import type { IDataShelfBoxNew } from '@/types/dataShelf'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })

// const { selectedNode } = useTree()
const dialogSelectNodeVisible = ref(false)
const loadinglocal = ref(false)
interface Props {
  dataitems: ISearchResultTabBox
  selectedTreeId: number
  selectedNode: ISimpleTreeActionable
}
interface Emit {
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'contentToNodeAdded'): void
}

// const props = defineProps<>({
//   dataitems: {
//     type: SearchResultTabBoxModel,
//     required: true,
//     validator: value => {
//       return value instanceof SearchResultTabBoxModel // Ensure the instance is correct
//     },
//   },
// })

const tabdatamodel = ref()
async function addContentToNode(datashelfbox: IDataShelfBoxNew) {
  try {
    await $api('app/excerpt', {
      method: 'POST',
      body: datashelfbox,
      ignoreResponseError: false,
    })
    emit('contentToNodeAdded')
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code > 0)
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
  loadinglocal.value = false
}

// interface Emit {
//   (e: 'close'): void // ایونت جدید close اضافه شد
//   (e: 'open'): void // ایونت جدید close اضافه شد
// }
const onContextMenu = (e: MouseEvent, selectedItem: ISimpleDTO<number>) => {
  // prevent the browser's default menu
  e.preventDefault()

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        disabled: props.selectedNode.id <= 0,
        icon: h('i', {
          class: 'tabler-plug-connected icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        label: t('datagathering.connecttoselectednode'),
        onClick: () => {
          loadinglocal.value = true
          addContentToNode({ content: selectedItem.title, description: '', labels: [], nodeId: props.selectedNode.id, treeId: 0, footNotes: [], id: 0 })
        },
      },
      {
        label: t('datagathering.connecttocustomnode'),
        icon: h('i', {
          class: 'tabler-plug icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        onClick: () => {
          dialogSelectNodeVisible.value = true
        },
      },
      {
        icon: h('i', {
          class: 'tabler-plug-off icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        label: t('datagathering.connecttoreserve'),
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('datagathering.copy'),
        icon: h('i', {
          class: 'tabler-copy icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
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
  <VCard v-if="props.dataitems.content.length > 0" v-no-context-menu class="mc-search-result">
    <MCLoading :showloading="loadinglocal" :loadingsize="SizeType.MD" />
    <VTabsWindow v-model="tabdatamodel">
      <VTabsWindowItem v-for="item in props.dataitems.content" :key="item.id" :value="item.id">
        <VCard variant="text">
          <VCardText>
            <MCDialogSelectNode v-if="dialogSelectNodeVisible" v-model:is-dialog-visible="dialogSelectNodeVisible" />
            <VDataIterator :items="item.content" :items-per-page="1">
              <template #default="{ items }">
                <VRow
                  v-for="(textData, j) in items" :key="j" no-gutters class="justify-start align-start box"
                  @contextmenu="onContextMenu($event, { id: j, title: textData.raw.text })"
                >
                  <VCheckbox
                    v-if="(isUndefined(textData.raw.selectable) && item.content.length > 1) || (textData.raw.selectable)"
                    v-model="textData.raw.selected" density="compact"
                  />

                  <VCol>
                    <p class="text">
                      {{ textData.raw.text }}
                    </p>
                    <!-- <div class="foot-note">این قسمت محل پاورقی</div> -->
                  </VCol>
                </VRow>
              </template>

              <template #footer="{ page, pageCount, prevPage, nextPage }">
                <VFooter v-if="item.content.length > 1">
                  <div class="d-flex justify-end w-100">
                    <span class="ml-2">{{ page }} {{ $t('of') }} {{ pageCount }}</span>
                    <VBtn
                      variant="plain" :disabled="page === 1" class="me-2" icon="mdi-chevron-right"
                      size="xsmall"
                      @click="prevPage"
                    />
                    <VBtn
                      variant="plain" :disabled="page === pageCount" icon="mdi-chevron-left" size="xsmall"
                      @click="nextPage"
                    />
                  </div>
                </VFooter>
              </template>
            </VDataIterator>
          </VCardText>
        </VCard>
      </VTabsWindowItem>
    </VTabsWindow>
    <VTabs v-model="tabdatamodel" align-tabs="start" density="compact" class="border-t-sm">
      <VTab
        v-for="item in props.dataitems.content" :key="item.id" :text="item.title" :value="item.id"
        variant="elevated" size="small" elevation="5"
      />
    </VTabs>
  </VCard>
</template>

<style lang="css" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
