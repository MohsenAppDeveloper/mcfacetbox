<script setup lang="ts">
import type { GridResult } from '@/types/baseModels';
import type { ISearchResultTabBox } from '@/types/SearchResult';

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

// watch(loadingdata, (newval, oldval) => {
//   console.log('loading', newval, oldval)
// })

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
</script>

<template>
  <VContainer class="mc-data-container">
    <VRow>
      <VCol cols="12" md="6" class="mx-auto">
        <VTextField v-model="infoSearch" placeholder="جستجو" append-inner-icon="mdi-magnify" class="search-bar"
          single-line @click:append-inner="getInfoSearch" />
      </VCol>
    </VRow>

    <VRow class="mc-data-scroll">
      <VCol>
        <div>
          <MCSearchResultTabBox v-for="(item, i) in resultdataItems" :key="i" :dataitems="item" />
          <div v-show="!loadingdata" ref="loadmore" />
        </div>

        <!--
          <VDataIterator
          :items="resultdataItems"
          items-per-page="100000"
          :loading="loadingdata"
          @update:current-items="updatecurrentitems"
          >
          <template #default="{ items }">
          <MCSearchResultTabBox
          v-for="(item, i) in items"
          :key="i"
          ref="dcItemsRef"
          :dataitems="item.raw"
          />
          <div
          v-show="!loadingdata"
          ref="loadmore"
          />
          </template>
<template #loader>
          <VProgressCircular
          size="40"
          indeterminate
          />
          </template>
-->
        <!-- </VDataIterator> -->
      </VCol>
    </VRow>
    <VRow>
      <div v-show="loading" class="loading-container">
        <VProgressCircular size="40" indeterminate />
      </div>
    </VRow>
  </VContainer>
</template>
