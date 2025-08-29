<script lang="ts" setup>
// !SECTION این دیالوگ برای جستجو لیست های تک سطحی و انتخاب یک یا چند مورد میباشد

import type { GridResult, ISimpleSelectableDTO } from '@/types/baseModels'
import { SelectionType } from '@/types/baseModels'

interface Prop {
  apiUrl: string
  selectionType: SelectionType
  seletedItems?: number[]
  maxHeight?: number
  fillSearchPhraseWithSelected?: boolean
  showParentTitle?: boolean
}

const props = defineProps<Prop>()

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'errorHasOccured', message: string): void
  (e: 'update:selectedItems', seletedItems: number[]): void
  (e: 'loadingStateChanged', loading: boolean, dataItemsCount: number): void
  (e: 'searchPhraseChanged', searchPhrase: string): void

}
const { t } = useI18n({ useScope: 'global' })

const page = ref(1)
const selectedItemsLocal = ref<number[]>([])
const searchResult = reactive<ISimpleSelectableDTO<number>[]>([])
const searchPhrase = ref('')
const replacePhrase = ref('')

const actionInprogress = ref(false)
const showReplace = ref(false)
const isRegex = ref(false)
const iswholeWord = ref(false)
const ismatchCase = ref(false)

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
    PageSize: 1000,
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
  emit('errorHasOccured', t('alert.probleminGetInformation'))
})

const onReset = () => {
  replacePhrase.value = searchPhrase.value = ''
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
  <VCard variant="elevated">
    <!-- <MCLoading :showloading="loadingdata" /> -->
    <div class="search-container mb-1 d-flex flex-column">
      <VTextField
        v-model:model-value="searchPhrase"
        class="mb-1" autofocus :placeholder="$t('search')" append-inner-icon="tabler-search"
        clearable persistent-clear density="compact" :loading="loadingdata" @click:clear="onReset" @keydown.esc="onReset"
      >
        <template #append>
          <VBtn :variant="isRegex ? 'tonal' : 'plain'" icon="tabler-regex" size="small" rounded="lg" @click="isRegex = !isRegex" />
          <!-- <VBtn :variant="ismatchCase ? 'tonal' : 'plain'" icon="tabler-abc" size="small" rounded="lg" @click="ismatchCase = !ismatchCase" /> -->
          <VBtn :variant="iswholeWord ? 'tonal' : 'plain'" icon="tabler-alphabet-latin" size="small" rounded="lg" @click="iswholeWord = !iswholeWord" />
          <VDivider vertical />
          <!-- <VBtn variant="plain" :icon="showReplace ? 'tabler-chevron-down' : 'tabler-chevron-right'" size="small" @click="showReplace = !showReplace" /> -->
        </template>
      </VTextField>
      <VExpandTransition>
        <VTextField
          v-if="showReplace"
          v-model:model-value="replacePhrase" :placeholder="$t('replace')"
          clearable density="compact" @click:clear="onReset"
        >
          <template #append>
            <VBtn variant="plain" icon="tabler-replace" rounded="lg" size="small" />
            <!-- <VBtn variant="plain" icon="tabler-replace-filled" rounded="lg" size="small" /> -->
          </template>
        </VTextField>
      </VExpandTransition>
    </div>

    <VList
      v-model:selected="selectedItemsLocal" item-value="key" item-title="title"
      lines="one" density="compact"
      :select-strategy="selectionStrategy"
      :return-object="false"
      :max-height="`${props.maxHeight ?? 400}px`"
    >
      <!-- <VVirtualScroll :items="filteredItems" :height="(props.scrollItemCount ?? 10) * 20"> -->
      <VListItem v-for="item in searchResult" :key="item.id" :title="item.title" :value="item.id">
        <template #title>
          <span v-if="item.parentTitle && item.parentTitle.length > 0" class="opacity-60">{{ item.parentTitle }} / </span>
          <div v-html="item.title" />
          <!-- <span>{{ item.title }}</span> -->
        </template>
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

<style lang="css">
.v-input--horizontal .v-input__append{
margin-inline-start: 0px !important;
}
</style>
