<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import type { GridResult, ISimpleSelectableDTO } from '@/types/baseModels'
import { SelectionType } from '@/types/baseModels'

interface Prop {
  apiUrl: string
  title: string
  selectionType: SelectionType
  seletedItems?: number[]
  maxHeight?: number
}

const props = defineProps<Prop>()

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'errorHasOccured', message: string): void
  (e: 'update:selectedItems', seletedItems: number[]): void
  (e: 'loadingStateChanged', loading: boolean, dataItemsCount: number): void

}
const itemsPerPage = ref(10)
const page = ref(1)
const selectedItemsLocal = ref<number[]>([])
const searchResult = reactive<ISimpleSelectableDTO[]>([])

const searchPhrase = ref('')

// const onReset = () => {
//   // Reset all predefined properties
// }
const selectionStrategy = computed(() => {
  switch (props.selectionType) {
    case SelectionType.Single:
      return 'single-independent'
    case SelectionType.Multiple:
      return 'independent'
    default:
      break;
  }
})

const { execute: fetchData, isFetching: loadingdata, data: searchResultFirst, onFetchResponse, onFetchError } = useApi<GridResult<ISimpleSelectableDTO>>(createUrl(props.apiUrl ?? '', {
  query: {
    phrase: searchPhrase,
    itemsPerPage,
    page,
  },
}), {
  refetch: false,
  immediate: false,
}).get()

onFetchResponse(response => {
  response.json().then(value => {
    searchResult.splice(0)
    if (searchResultFirst.value)
      searchResult.push(...searchResultFirst.value.items)
  })
})

onFetchError(() => {
  emit('errorHasOccured', 'probleminGetInformation')
})

const onReset = () => {
  searchPhrase.value = ''
  searchResult.splice(0)
}

watch(selectedItemsLocal, () => {
  emit('update:selectedItems', selectedItemsLocal.value)
})
watch(searchPhrase, () => {
  if (searchPhrase.value.length >= 2)
    fetchData(false)
  else
    searchResult.splice(0)
})
watch(searchResult, () => {
  emit('loadingStateChanged', loadingdata.value, searchResult.length)
})
</script>

<template>
  <VCard variant="flat">
    <!-- <MCLoading :showloading="loadingdata" /> -->
    <VCardTitle>{{ props.title }}</VCardTitle>
    <div class="search-container">
      <VTextField
        v-model:model-value="searchPhrase" :placeholder="$t('search')" append-inner-icon="tabler-search"
        clearable density="compact" :loading="loadingdata" @click:clear="onReset"
      />
    </div>

    <VList
      v-model:selected="selectedItemsLocal" item-value="key" item-title="title"
      lines="one"
      :select-strategy="selectionStrategy"
      :return-object="false"
      :max-height="`${props.maxHeight ?? 500}px`"
    >
      <!-- <VVirtualScroll :items="filteredItems" :height="(props.scrollItemCount ?? 10) * 20"> -->
      <VListItem v-for="item in searchResult" :key="item.id" :title="item.text" :value="item.id">
        <template #prepend="{ isSelected }">
          <VListItemAction start>
            <VCheckbox :model-value="isSelected" density="compact" />
          </VListItemAction>
        </template>
      </VListItem>
    </VList>
  </VCard>
  <!-- </PerfectScrollbar> -->
</template>
