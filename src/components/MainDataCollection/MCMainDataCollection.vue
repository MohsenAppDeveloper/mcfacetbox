<script setup lang="ts">
import { useSelectedNode } from '@/store/treeStore'
import type { GridResult } from '@/types/baseModels'
import type { IFacetResult, ISearchResultTabBox } from '@/types/SearchResult'

const itemsPerPage = ref(5)
const page = ref(1)
const totalItems = ref(0)
const sortBy = ref()
const orderBy = ref()
const searchQuery = ref('')
const resultdataItems = ref<ISearchResultTabBox[]>([])

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse } = useApi<GridResult<ISearchResultTabBox>>(createUrl('/apps/DC', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}), { immediate: false })

setTimeout(async () => {
  try {
    await fetchData(false)
  }
  catch (error) {
    console.log('fetchthrow', error)
  }
}, 1000)

const loadmore = ref(null)
const infoSearch = ref()
const loading = ref(false)
const selectedFacetItems = reactive<Record<string, number[]>>({})
const testfacetlist = ref<IFacetResult[]>([{ key: 'book', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }, { key: 'book1', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }])

const selectenode = useSelectedNode()

const { stop } = useIntersectionObserver(
  loadmore,
  ([entry], observerElement) => {
    if (entry?.isIntersecting) {
      if (resultdataItems.value.length === totalItems.value)
        return
      page.value += 1
    }
  },
)

// function scrollTo(view: Ref<HTMLElement | null>) {
//   if (view === undefined || view == null)
//     return
//   view.value?.scrollIntoView()
// }

watch(selectedFacetItems, newval => {
  const result = Object.keys(newval).map(key => ({
    titleKey: key,
    items: newval[key],
  }))
})

onFetchResponse(response => {
  response.json().then(value => {
    totalItems.value = value.totalItems
    resultData.value?.items.forEach(element => {
      resultdataItems.value.push(element)
    })
    loading.value = true
  })
})

function getInfoSearch() { }

const dataTabValue = ref(null)
</script>

<template>
  <VContainer class="mc-data-container">
    <VRow dense>
      <VCol cols="12" md="6" class="mx-auto">
        <VTextField v-model="infoSearch" :placeholder="$t('search')" class="search-bar" single-line>
          <template #append-inner>
            <VBtn icon size="small" variant="text" @click="getInfoSearch">
              <VIcon icon="tabler-search" size="22" />
            </VBtn>
            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-settings" size="22" />
            </VBtn>
            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-history" size="22" />
            </VBtn>
          </template>
          <!--
            <template #append>
            <VBtn icon size="small" @click="">
            ai
            </VBtn>
            </template>
          -->
        </VTextField>
      </VCol>
    </VRow>
    <!-- v-for="(item, i) in testfacetlist" :key="i"  -->

    <VTabs v-model="dataTabValue" density="compact" hide-slider class="data-collection-tabs">
      <VTab :value="1" variant="elevated" rounded="sm">
        {{ $t('hadith') }}
      </VTab>
      <VTab :value="2" variant="elevated" rounded="sm">
        {{ $t('ayah') }}
      </VTab>
      <VTab :value="3" variant="elevated" rounded="sm">
        {{ $t('word') }}
      </VTab>
    </VTabs>

    <VTabsWindow v-model="dataTabValue" class="mc-data-scroll">
      <VTabsWindowItem :value="1" :transition="false">
        <VRow dense>
          <VCol md="3">
            <div>
              <MCFacetBox
                v-for="item in testfacetlist" :key="item.key"
                v-model:selected-items="selectedFacetItems[item.key]" searchable
                :dataitems="item.facetGroups" :facettitle="$t('tree.autorizedbook')" class="mb-2"
              />
            </div>
          </VCol>
          <VCol md="9">
            <div>
              <MCSearchResultTabBox v-for="(item, i) in resultdataItems" :key="i" :dataitems="item" />
              <div v-show="!loadingdata" ref="loadmore" />
            </div>
          </VCol>
        </VRow>
      </VTabsWindowItem>
      <VTabsWindowItem :value="2" :transition="false" />
      <VTabsWindowItem :value="2" :transition="false" />
    </VTabsWindow>

    <VRow dense>
      <div v-show="loadingdata" class="loading-container">
        <VProgressCircular size="20" width="2" indeterminate />
      </div>
    </VRow>
  </VContainer>
</template>

<style lang="css">
.v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
  padding: 0 !important;
}

.v-list-item-action--start {
  margin-inline: 0 0;
}
</style>
