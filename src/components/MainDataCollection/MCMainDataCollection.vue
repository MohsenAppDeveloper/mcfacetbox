<script setup lang="ts">
import { VCol } from 'vuetify/lib/components/index.mjs'
import MCDialogBookSelect from '../dialogs/MCDialogBookSelect.vue'
import { useSelectedNode } from '@/store/treeStore'
import type { GridResult } from '@/types/baseModels'
import type { IFacetBox, ISearchResultTabBox } from '@/types/SearchResult'

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
const isDialogSelectBookVisible = ref(false)
const infoSearch = ref()
const loading = ref(false)
const selectedBooks = ref<string[]>([])
const selectedFacetItems = reactive<Record<string, string[]>>({})
const testfacetlist = ref<IFacetBox[]>([{ key: 'book', title: 'کتاب', hasSearchBox: true, scrollSize: 5, itemList: [{ key: '1', title: 'پژوهشگر', count: 10 }, { key: '2', title: 'مدیر کل', count: 11 }, { key: '3', title: 'ناظر', count: 5 }, { key: '4', title: 'ارزیاب یک', count: 7 }, { key: '5', title: 'ارزیاب دو', count: 7 }] }, { key: 'book1', title: 'قرن', isTree: true, hasSearchBox: false, scrollSize: 5, itemList: [{ key: '1', title: 'پژوهشگر', count: 13 }, { key: '2', parent: 1, title: 'مدیر کل', count: 18 }, { key: '3', title: 'ناظر', count: 16 }, { key: '4', parent: 3, title: 'ارزیاب یک', count: 13 }, { key: '5', parent: 4, title: 'ارزیاب دو', count: 1 }] }])

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

  console.log('result', result, newval)
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
    <VRow dense class="align-center">
      <MCDialogBookSelect v-if="isDialogSelectBookVisible" v-model:is-dialog-visible="isDialogSelectBookVisible" />
      <VCol cols="12" md="3" />
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

      <VCol cols="12" md="3" class="number-found">
        موارد یافت شده
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
    <VBtn icon size="26" variant="text" @click="isDialogSelectBookVisible = true">
      <VIcon icon="tabler-book" size="22" />
    </VBtn>

    <VDivider />

    <VTabsWindow v-model="dataTabValue" class="mc-data-scroll">
      <VTabsWindowItem :value="1" :transition="false">
        <VRow dense>
          <VCol md="3">
            <div>
              <MCFacetBox
                v-for="item in testfacetlist" :key="item.key" v-model:selected-items="selectedFacetItems[item.key]" :istree="item.isTree"
                :scroll-item-count="item.scrollSize" :searchable="item.hasSearchBox"
                :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
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
