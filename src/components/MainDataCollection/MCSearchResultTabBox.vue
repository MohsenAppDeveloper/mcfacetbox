<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import { isUndefined } from '@sindresorhus/is'
import type { ISearchResultTabBox } from '@/types/SearchResult'

interface Props {
  dataitems: ISearchResultTabBox
}

const props = defineProps<Props>()

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

// const menusearchResultBox = ref(VMenu)
// const showcontextmenu = ref(false)
// const contextmenuItems = [{ title: 'اتصال به نود ...', value: 'Option 1' }, { title: 'اتصال به نود چک نویس', value: 'Option 2' }, { title: 'کپی', value: 'Option 3' }]
// const xpos = ref(0)
// const ypos = ref(0)

// const emit = defineEmits<Emit>()

// interface Emit {
//   (e: 'close'): void // ایونت جدید close اضافه شد
//   (e: 'open'): void // ایونت جدید close اضافه شد
// }
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
  <VCard v-if="props.dataitems.content.length > 0" v-no-context-menu class="mc-search-result">
    <VTabsWindow v-model="tabdatamodel">
      <VTabsWindowItem v-for="item in props.dataitems.content" :key="item.id" :value="item.id">
        <VCard variant="text">
          <VCardText>
            <VDataIterator :items="item.content" :items-per-page="1">
              <template #default="{ items }">
                <VRow
                  v-for="(textData, j) in items" :key="j" no-gutters class="justify-start align-start box"
                  @contextmenu="onContextMenu($event)"
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
