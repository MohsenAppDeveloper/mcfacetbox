<script setup lang="ts">
import { isUndefined } from '@sindresorhus/is'
import { SearchResultTabBoxModel } from '@/types/SearchResult'
import type { ISimpleSelectableDTO } from '@/types/baseModels'

const props = defineProps({
  dataitems: { type: SearchResultTabBoxModel, default: new SearchResultTabBoxModel() },
})

const tabdatamodel = ref()
const showcontextmenu = ref(false)
const contextmenuItems = [{ title: 'اتصال به نود ...', value: 'Option 1' }, { title: 'اتصال به نود چک نویس', value: 'Option 2' }, { title: 'کپی', value: 'Option 3' }]

// const emit = defineEmits<Emit>()

// interface Emit {
//   (e: 'close'): void // ایونت جدید close اضافه شد
//   (e: 'open'): void // ایونت جدید close اضافه شد
// }
const selecteText = (e: MouseEvent, resultItem: ISimpleSelectableDTO) => {
  showcontextmenu.value = true
}
</script>

<template>
  <VCard
    v-if="props.dataitems.content.length > 0"
    v-no-context-menu
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
                  class="d-flex justify-start align-start"
                >
                  <VCheckbox
                    v-if="(isUndefined(textData.raw.selectable) && item.content.length > 1) || (textData.raw.selectable)"
                    v-model="textData.raw.selected"
                  />
                  <p
                    class="pr-5"
                    @auxclick="selecteText($event, textData.raw)"
                  >
                    {{ textData.raw.text }}
                  </p>
                  <VMenu
                    v-model="showcontextmenu"
                    target="cursor"
                    :offset="[100, 200]"
                  >
                    <VList :items="contextmenuItems" />
                  </VMenu>
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
  <!--
    <VCard class="mc-search-result">
    <VTabsWindow v-model="tabdatamodel">
    <VTabsWindowItem
    v-for="item in dataitems.content"
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
    class="d-flex justify-start align-start"
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

    </vdataiterator>
    </vcardtext>
    </vcard>
    </vtabswindowitem>
    </vtabswindow>
    </vcard>
  -->
</template>
