<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import type { GridResult, ISimpleDTO, ISimpleSelectableDTO } from '@/types/baseModels'
import { SelectionType } from '@/types/baseModels'

interface Prop {
  apiUrl: string
  selectionType: SelectionType
  seletedItems?: number[]
  maxHeight?: number
  fillSearchPhraseWithSelected?: boolean
}

const props = defineProps<Prop>()

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'errorHasOccured', message: string): void
  (e: 'update:selectedItems', seletedItems: number[]): void
  (e: 'loadingStateChanged', loading: boolean, dataItemsCount: number): void
  (e: 'searchPhraseChanged', searchPhrase: string): void

}
const itemsPerPage = ref(10)
const page = ref(1)
const selectedItemsLocal = ref<number[]>([])
const searchResult = reactive<ISimpleSelectableDTO<number>[]>([])
const searchPhrase = ref('')
const actionInprogress = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

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

const { execute: fetchData, isFetching: loadingdata, data: searchResultFirst, onFetchResponse, onFetchError } = useApi<GridResult<ISimpleSelectableDTO<number>>>(createUrl(props.apiUrl ?? '', {
  query: {
    filter: searchPhrase,
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
    actionInprogress.value = false
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
  if ((props.fillSearchPhraseWithSelected ?? false) && props.selectionType === SelectionType.Single)
    searchPhrase.value = searchResult.find(item => { return item.id === selectedItemsLocal.value[0] })?.title ?? ''
  emit('update:selectedItems', selectedItemsLocal.value)
})
watch(searchPhrase, () => {
  if (searchPhrase.value.length > 2) {
    if (timeout)
      clearTimeout(timeout)

    timeout = setTimeout(() => {
      fetchData(false)
    }, 2000)
  }

  emit('searchPhraseChanged', searchPhrase.value)
})
watch(searchResult, () => {
  emit('loadingStateChanged', loadingdata.value, searchResult.length)
})
</script>

<template>
  <VCard variant="flat">
    <!-- <MCLoading :showloading="loadingdata" /> -->
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
      <VListItem v-for="item in searchResult" :key="item.id" :title="item.title" :value="item.id">
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
