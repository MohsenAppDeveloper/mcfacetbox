<script setup lang="ts">
import { isNull, isUndefined } from '@sindresorhus/is'
import { VTreeview } from 'vuetify/labs/VTreeview'
import type { IFacetItem } from '@/types/SearchResult'
import { convertFacetItemToFacetTree } from '@/types/SearchResult'
import { FacetType } from '@/types/baseModels'

interface Props {
  dataitems: IFacetItem[]
  searchable: boolean
  facettitle: string
  istree?: boolean
  scrollItemCount?: number
  selectedItems?: string[]
  facettype?: FacetType
}
interface Emit {
  (e: 'update:selectedItems', selectdItems: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const treeItems = computed(() =>
  convertFacetItemToFacetTree(props.dataitems),
)

const selectedTreeFacetItems = ref<string[]>([])
const selectedFacetItems = ref<string[]>([])

const switchState = ref<boolean>(props.dataitems[0].key === 'false')
const searchText = ref('')
const filteredItems = ref<IFacetItem[]>(props.dataitems)

watch(() => props.selectedItems, newVal => {
  if (!newVal || newVal.length === 0)
    return
  if (props.facettype === FacetType.switch) {
    const boolVal = (newVal[0] === 'true')
    if (switchState.value !== boolVal)
      switchState.value = boolVal
  }
  else if (props.facettype === FacetType.tree) {
    if (JSON.stringify(selectedTreeFacetItems.value) !== JSON.stringify(newVal.map(item => item)))
      selectedTreeFacetItems.value = [...newVal].map(item => item)
  }
  else { // Flat list
    if (JSON.stringify(selectedFacetItems.value) !== JSON.stringify(newVal.map(item => item)))
      selectedFacetItems.value = [...newVal].map(item => item)
  }
}, { immediate: true })

onMounted(() => {
  if (!props.selectedItems || props.selectedItems.length === 0)
    return
  if (props.facettype === FacetType.switch) {
    const boolVal = (props.selectedItems[0] === 'true')

    if (switchState.value !== boolVal)
      switchState.value = boolVal
  }
  else if (props.facettype === FacetType.tree) {
    if (JSON.stringify(selectedTreeFacetItems.value) !== JSON.stringify(props.selectedItems))
      selectedTreeFacetItems.value = [...props.selectedItems].map(item => item)
  }
  else { // Flat list
    if (JSON.stringify(selectedFacetItems.value) !== JSON.stringify(props.selectedItems))
      selectedTreeFacetItems.value = [...props.selectedItems].map(item => item)
  }
})
watch(filteredItems, () => {
  if ((props.selectedItems?.length ?? 0) > 0)
    !(props.istree ?? false) ? selectedFacetItems.value.push(...(props.selectedItems?.map(item => item.toString()) ?? [])) : selectedTreeFacetItems.value.push(...(props.selectedItems?.map(item => item.toString()) ?? []))
}, { immediate: true })
watch((selectedTreeFacetItems), newval => {
  emit('update:selectedItems', newval.map(item => item.toString()))
})
watch((selectedFacetItems), newval => {
  emit('update:selectedItems', newval.map(item => item.toString()))
})
watch(switchState, () => {
  emit('update:selectedItems', [String(switchState.value)])
})

// if (selectedTreeFacetItems.find(element => element === item.facetKey))

// const selectTreeNode = (item: IFacetTreeItem) => {
//   if (selectedTreeFacetItems.includes(item.facetKey)) { selectedTreeFacetItems.splice(0) }
//   else {
//     selectedTreeFacetItems.splice(0)
//     selectedTreeFacetItems.push(item.facetKey)
//   }
// }

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
function chagenSwitchValue(value: boolean | null) {
  console.log('swith', value)
}
function searchinfacet(e: any) {
  searchText.value = (isNull(e) || isUndefined(e)) ? '' : e
  filterItems()
}
</script>

<template>
  <VCard class="mc-facet-box" variant="flat">
    <VCardTitle v-if="props.facettype !== FacetType.switch">
      {{ props.facettitle }}
    </VCardTitle>
    <div class="search-container">
      <VTextField
        v-show="props.searchable" :placeholder="$t('search')" append-inner-icon="tabler-search" clearable
        density="compact" @update:model-value="searchinfacet"
      />
    </div>

    <VList
      v-if="!(props.istree ?? false) && (isNullOrUndefined(props.facettype) || props.facettype === FacetType.flat)" v-model:selected="selectedFacetItems" item-value="key" item-title="title"
      lines="one"
      select-strategy="leaf"
      :return-object="false" :height="(filteredItems.length ?? 10) * 35" :max-height="(props.scrollItemCount ?? 10) * 35"
    >
      <!-- <VVirtualScroll :items="filteredItems" :height="(props.scrollItemCount ?? 10) * 20"> -->
      <VListItem v-for="item in filteredItems" :key="item.key" :title="item.title" :value="item.key">
        <template #prepend="{ isSelected }">
          <VListItemAction start>
            <VCheckbox :model-value="isSelected" density="compact" />
          </VListItemAction>
        </template>
        <template #append="">
          <span class="px-2">{{ item.count }}</span>
        </template>
      </VListItem>
    </VList>

    <VTreeview
      v-else-if="(props.facettype === FacetType.tree)"
      v-model:activated="selectedTreeFacetItems" :items="treeItems" expand-icon="mdi-menu-left" item-value="facetKey"
      item-title="title" min-height="300px" activatable
      density="compact" active-strategy="single-independent"
    />
    <div v-else class="d-flex align-center justify-space-between">
      <span class="mx-2">
        {{ `${dataitems[0].title}(${dataitems[0].count})` }}
      </span>
      <VSwitch v-model="switchState" class="pl-2" @update:model-value="chagenSwitchValue" />
    </div>
    <!--
      <template #title="{ item }">
      <VTreeviewItem>
      <template #default="{ isActive, isSelected }">
      <div @click="selectTreeNode(item)">
      <span v-bind="props"> {{ item.title }}--{{ isSelected ?? 0 }}--{{ isActive ?? 0 }}</span>
      </div>
      </template>
      </VTreeviewItem>
      </template>
    -->

    <!--
      <template #title="{ item }">
      <div @click="selectTreeNode(item)">
      <span v-bind="props"> {{ item.title }}</span>
      </div>
      </template>
    -->
    <!-- </VTreeview> -->
  </VCard>
</template>
