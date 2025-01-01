<script setup lang="ts">
import { isNull, isUndefined } from '@sindresorhus/is'
import { VTreeview } from 'vuetify/labs/VTreeview'

import type { IFacetItem, IFacetTreeItem } from '@/types/SearchResult'
import { convertFacetItemToFacetTree } from '@/types/SearchResult'

interface Props {
  dataitems: IFacetItem[]
  searchable: boolean
  facettitle: string
  istree?: boolean
  scrollItemCount?: number
  selectedItems?: string[]
}
interface Emit {
  (e: 'update:selectedItems', selectdItems: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const treeItems = computed(() =>
  convertFacetItemToFacetTree(props.dataitems),
)

const selectedTreeFacetItems = reactive<string[]>([])
const selectedFacetItems = ref<string[]>([])

const searchText = ref('')
const filteredItems = ref<IFacetItem[]>(props.dataitems)

watch((selectedTreeFacetItems), newval => {
  emit('update:selectedItems', newval)
})
watch((selectedFacetItems), newval => {
  console.log('changevalue2', newval)
  emit('update:selectedItems', newval)
})

// if (selectedTreeFacetItems.find(element => element === item.facetKey))

const selectTreeNode = (item: IFacetTreeItem) => {
  if (selectedTreeFacetItems.includes(item.facetKey)) { selectedTreeFacetItems.splice(0) }
  else {
    selectedTreeFacetItems.splice(0)
    selectedTreeFacetItems.push(item.facetKey)
  }
}

// فیلتر کردن آیتم‌ها بر اساس متن جستجو
function filterItems() {
  if (searchText.value.trim() === '') {
    // اگر ورودی خالی است، نمایش همه آیتم‌ها
    filteredItems.value = props.dataitems
  }
  else {
    // در غیر اینصورت، فیلتر کردن آرایه بر اساس متن
    filteredItems.value = searchItems<IFacetItem>(props.dataitems, searchText.value, 'title')
  }
}

function searchinfacet(e: any) {
  searchText.value = (isNull(e) || isUndefined(e)) ? '' : e
  filterItems()
}
</script>

<template>
  <VCard class="mc-facet-box" variant="flat">
    <VCardTitle>{{ props.facettitle }}</VCardTitle>
    <div class="search-container">
      <VTextField
        v-show="props.searchable" :placeholder="$t('search')" append-inner-icon="tabler-search" clearable
        density="compact" @update:model-value="searchinfacet"
      />
    </div>

    <VList
      v-if="!(props.istree ?? false)" v-model:selected="selectedFacetItems" item-value="facetKey" lines="one"
      select-strategy="leaf"
      :return-object="false"
    >
      <!-- v-for="item in filteredItems" :key="item.facetKey" -->
      <VVirtualScroll :items="filteredItems" :height="(props.scrollItemCount ?? 10) * 20">
        <template #default="{ item }">
          <VListItem :title="item.title" :value="item.facetKey">
            <template #prepend="{ isSelected }">
              <VListItemAction start>
                <VCheckbox :model-value="isSelected" density="compact" />
              </VListItemAction>
            </template>
          </VListItem>
        </template>
      </VVirtualScroll>
    </VList>

    <VTreeview
      v-else
      v-model:selected="selectedTreeFacetItems" :items="treeItems" expand-icon="mdi-menu-left" item-value="facetKey"
      item-title="title" min-height="300px" activatable
      density="compact"
    >
      <template #title="{ item }">
        <div @click="selectTreeNode(item)">
          <!-- <VTooltip :text="item.title"> -->
          <!-- <template #activator="{ props }"> -->
          <span v-bind="props"> {{ item.title }}</span>
          <!-- </template> -->
          <!-- </VTooltip> -->
        </div>
      </template>
    </VTreeview>
  </VCard>
</template>
