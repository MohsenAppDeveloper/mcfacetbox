<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import { isUndefined } from '@sindresorhus/is'
import { SearchResultTabBoxModel } from '@/types/SearchResult'

const props = defineProps({
  dataitems: { type: SearchResultTabBoxModel, default: new SearchResultTabBoxModel() },
})

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
  <VCard
    v-if="props.dataitems.content.length > 0"
    v-no-context-menu
    class="mc-search-result"
  >
    <VTabsWindow v-model="tabdatamodel">
      <VTabsWindowItem
        v-for="item in props.dataitems.content"
        :key="item.id"
        :value="item.id"
      >
        <VCard>
          <VCardText class="pa-2 border-sm rounded-lg">
            <VDataIterator
              :items="item.content"
              :items-per-page="1"
            >
              <template #default="{ items }">
                <div
                  v-for="(textData, j) in items"
                  :key="j"
                  class="d-flex justify-start align-start box"
                  @contextmenu="onContextMenu($event)"
                >
                  <VCheckbox
                    v-if="(isUndefined(textData.raw.selectable) && item.content.length > 1) || (textData.raw.selectable)"
                    v-model="textData.raw.selected"
                  />

                  <p class="pr-5">
                    {{ textData.raw.text }}
                  </p>
                </div>
              </template>

              <template #footer="{ page, pageCount, prevPage, nextPage }">
                <VFooter v-if="item.content.length > 1">
                  <div class="d-flex justify-end w-100">
                    <span class="ml-2">Page {{ page }} of {{ pageCount }}</span>
                    <VBtn
                      :disabled="page === 1"
                      class="me-2"
                      icon="tabler-arrow-right"
                      size="xsmall"
                      @click="prevPage"
                    />
                    <VBtn
                      :disabled="page === pageCount"
                      icon="tabler-arrow-left"
                      size="xsmall"
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
    <VTabs
      v-model="tabdatamodel"
      align-tabs="start"
    >
      <VTab
        v-for="item in props.dataitems.content"
        :key="item.id"
        :text="item.title"
        :value="item.id"
      />
    </VTabs>
  </VCard>
</template>
