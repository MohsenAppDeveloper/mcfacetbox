<script setup lang="ts">
import { useToast } from 'vue-toastification'
import MCDialogBookSelect from '../dialogs/MCDialogBookSelect.vue'
import type { GridResultFacet, IRootServiceError } from '@/types/baseModels'
import { DataBoxType, MessageType, QueryRequestModel, SizeType } from '@/types/baseModels'
import { HadithSearchResultItemModel, SearchResultItemModel } from '@/types/SearchResult'
import type { IFacetBox, IHadithSearchResultItem, ISearchResultItem, ITabSearchStateResult } from '@/types/SearchResult'
import { useSelectedTree, useTree } from '@/store/treeStore'
import { useDataShelfStateChanged } from '@/store/databoxStore'

// const hadithPageNumber = ref(1)
// const totalItemsHadith = ref(0)
const sortBy = ref()
const orderBy = ref()
const { selectedNode } = useTree()
const selectedTreeItem = useSelectedTree()
const shelfState = useDataShelfStateChanged()
const ispaginationFullSize = ref(false)
const { t } = useI18n({ useScope: 'global' })
const loadmorestart = ref(null)
const loadmoreend = ref(null)
const mainDataResult = ref(null)
const dataTabValue = ref<DataBoxType>(DataBoxType.hadith)
const toast = useToast()
const isDialogSelectBookVisible = ref(false)
const searchPhrase = ref('')
const apiQueryParamData = reactive<QueryRequestModel>(new QueryRequestModel())

// const facetboxItemsHadith = ref<IFacetBox[]>([])
// const resultdataItemsHadith = ref<IHadithSearchResultItem[]>([])

const resultDataOnState = reactive<Record<DataBoxType, ITabSearchStateResult>>({
  [DataBoxType.hadith]: {
    page: 1,
    totalItems: 0,
    facets: [],
    selectedFacets: {},
    results: [],
    loading: false,
  },
  [DataBoxType.quran]: {
    page: 1,
    totalItems: 0,
    facets: [],
    selectedFacets: {},
    results: [],
    loading: false,
  },
  [DataBoxType.vocabulary]: {
    page: 1,
    totalItems: 0,
    facets: [],
    selectedFacets: {},
    results: [],
    loading: false,
  },
  [DataBoxType.text]: undefined,
})

// const loading = ref(false)
const maximizBoxOverlay = ref(false)
const currentitem = ref<ISearchResultItem>(new SearchResultItemModel())

// const loading = ref(false)
const selectedBooks = ref<string[]>([])

// const selectedFacetItemsHadith = reactive<Record<string, string[]>>({})

const { stop } = useIntersectionObserver(
  [loadmorestart, loadmoreend],
  ([entrystart, entryend], observerElement) => {
    if ((entrystart?.isIntersecting || entryend?.isIntersecting) && (resultDataOnState[dataTabValue.value].results.length <= resultDataOnState[dataTabValue.value].totalItems))
      ispaginationFullSize.value = true
  },
)

const { isScrolling: isscrolling, arrivedState: scrollarriveState } = useScroll(mainDataResult)

// const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(createUrl(`app/source/${DataBoxType[dataTabValue.value]}`, {
//   query: apiQueryParamData,
// }), { immediate: false })

watch(isscrolling, () => {
  //   if (!isscrolling.value && (scrollarriveState.bottom || scrollarriveState.top) && !ispaginationFullSize.value)
  //     ispaginationFullSize.value = true
  //   else
  if (isscrolling && !(scrollarriveState.bottom || scrollarriveState.top))
    ispaginationFullSize.value = false
})
watch(() => apiQueryParamData.PageSize, async (newval, oldval) => {
  if (newval === oldval)
    return
  await runSearch(false)
})
watch(() => resultDataOnState[dataTabValue.value].page, async newval => {
  if ((newval !== apiQueryParamData.PageNumber)) {
    apiQueryParamData.PageNumber = newval
    console.log('pagenumber', resultDataOnState[dataTabValue.value].page, newval)

    await runSearch(false)
  }
})
watch(resultDataOnState[dataTabValue.value].selectedFacets, async newval => {
  let facetChange = false
  console.log('selectedfacet', resultDataOnState[dataTabValue.value])
  Object.keys(newval).forEach(key => {
    // console.log('facetboxx', !apiQueryParamData[key], JSON.stringify(apiQueryParamData[key]) !== JSON.stringify(newval[key]), JSON.stringify(apiQueryParamData[key]), JSON.stringify(newval[key]))
    if (!apiQueryParamData[key] || JSON.stringify(apiQueryParamData[key]) !== JSON.stringify(newval[key])) {
      apiQueryParamData[key] = newval[key]
      facetChange = true
    }
  })
  console.log('newfacetkey', facetChange)

  if (facetChange)
    await runSearch(true)
})

// onFetchResponse(() => {
//   try {
//     const resultTemp = resultData.value as GridResultFacet<ISearchResultItem>

//     console.log('result', resultTemp)

//     totalItemsHadith.value = resultTemp.totalCount
//     resetData()

//     // resultdataItemsHadith.value = [...resultTemp.items]
//     setTimeout(() => {
//       resultTemp.items.forEach(element => {
//         resultdataItemsHadith.value.push(new HadithSearchResultItemModel(element.highLight, element.id, element.qaelTitleList, element.noorLibLink, element.qaelList, element.bookTitle, element.bookTitleShort, element.sourceId, element.pageNum, element.vol))

//       // console.log('text', element.highlightText)
//       })
//       resultTemp.facets.forEach(element => {
//         if (element.itemList && element.itemList.length > 0)
//           facetboxItemsHadith.value.push(element)

//       // console.log('text', element.highlightText)
//       })
//       loading.value = false
//     }, 500)
//   }
//   catch (error) {
//     console.log('error', error)
//   }
// })

// onFetchError(error => {
//   if (isNullOrUndefined(error) || error.name === 'AbortError')
//     return
//   try {
//     const result = resultData.value as IRootServiceError

//     if (result && result.error && result.error.message)
//       toast.error(result.error.message)
//     else
//       toast.error(t('alert.probleminGetExcerpt'))
//   }
//   catch {
//     toast.error(t('alert.probleminLoadExcerpt'))
//   }
//   loading.value = false
// })

// function loadMoreCollectingData(options: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) {
//   if (options.side === InfiniteScrollSide.start) {
//     if (page.value > 1)
//       page.value -= 1
//     else
//       options.done(InfiniteScrollStatus.ok)
//   }
//   else {
//     if (resultdataItems.value.length < totalItems.value)
//       page.value += 1
//     else
//       options.done(InfiniteScrollStatus.ok)
//   }
// }
function contentToNodeAdded(connectednodeid: number) {
  toast.success(t('datashelfbox.yourfishadded'))
  shelfState.connectednodeid.value = connectednodeid
  shelfState.lastState.value = !shelfState.lastState.value
}
function searchResultBoxMessageHandle(message: string, messagetype: MessageType) {
  switch (messagetype) {
    case MessageType.error:
      toast.error(message)
      break;
    case MessageType.info:
      toast.info(message)
      break;
    case MessageType.warning:
      toast.warning(message)
      break;
    case MessageType.success:
      toast.success(message)
      break;
    default:
      break;
  }
}
function handleSearchKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case ' ':
      event.stopPropagation()
      break;
    case 'Enter':
      event.stopPropagation()
      runSearch(true)
      break;
    default:
      break;
  }
}
function resetData() {
  // apiQueryParamData.resetDynamicFields()
  resultDataOnState[dataTabValue.value].results.splice(0)
  resultDataOnState[dataTabValue.value].facets.splice(0)
}

async function runSearch(resetToDefault: boolean) {
  console.log('runsearch', resetToDefault)

  if (searchPhrase.value.length < 2)
    return
  const contentType = dataTabValue.value

  if (resetToDefault) {
    /** مقادیر فست ها و صفحه بندی را به حالت اولیه برمیگرداند */
    if (apiQueryParamData.Filter !== searchPhrase.value)
      apiQueryParamData.resetDynamicFields()
    apiQueryParamData.SearchIn = 1
    apiQueryParamData.Filter = searchPhrase.value
    apiQueryParamData.PageNumber = 1
    resultDataOnState[contentType].page = 1
  }

  apiQueryParamData.PageNumber = resultDataOnState[contentType].page
  resultDataOnState[contentType].loading = true
  try {
    const { data } = await useApi(createUrl(`app/source/${DataBoxType[contentType]}`, {
      query: apiQueryParamData,
    }), { refetch: false })

    const resultCastedData = data.value as GridResultFacet<ISearchResultItem>

    resetData()
    resultDataOnState[contentType].totalItems = resultCastedData.totalCount
    if (resultCastedData.items.length > 0) {
      resultDataOnState[contentType].results = resultCastedData.items.map(item => {
        switch (contentType) {
          case DataBoxType.hadith:
          return new HadithSearchResultItemModel(item.highLight, item.id, item.qaelTitleList, item.noorLibLink, item.qaelList, item.bookTitle, item.bookTitleShort, item.sourceId, item.pageNum, item.vol)
        case DataBoxType.quran:
          return new HadithSearchResultItemModel()
        case DataBoxType.vocabulary:
          return new HadithSearchResultItemModel()
          default:
            return item
        }
      })
      resultDataOnState[contentType].facets = resultCastedData.facets || []
    }
    resultDataOnState[contentType].loading = false
  }
  catch (error) {
    // console.log('error', error, resultDataOnState)
    resultDataOnState[contentType].loading = false

    // const result = resultDataOnState as IRootServiceError

    // if (result && result.error && result.error.message)
    //   toast.error(result.error.message)
    // else
    //   toast.error(t('alert.probleminGetExcerpt'))
    toast.error(t('alert.probleminSearch'))
  }

//   if (resetToDefault) {
//     /** مقادیر فست ها و صفحه بندی را به حالت اولیه برمیگرداند */
//     if (apiQueryParamData.Filter !== searchPhrase.value)
//       apiQueryParamData.resetDynamicFields()
//     apiQueryParamData.SearchIn = 1
//     apiQueryParamData.Filter = searchPhrase.value
//     apiQueryParamData.PageNumber = 1
//     hadithPageNumber.value = 1
//   }
//   loading.value = true
//   await fetchData()
}

const maximizeSearchTabBox = (tabBoxItem: ISearchResultItem) => {
  currentitem.value = tabBoxItem
  maximizBoxOverlay.value = true
}
</script>

<template>
  <VContainer class="mc-data-container">
    <VOverlay v-model="maximizBoxOverlay" :close-on-back="false" contained class="maximizeSearchBox d-flex justify-center">
      <template #default>
        <VFadeTransition>
          <div v-if="maximizBoxOverlay" class="flex flex-col justify-center my-2 mx-3 h-100 w-100">
            <MCSearchResultBox v-model:is-expanded="maximizBoxOverlay" :box-type="DataBoxType.hadith" :dataitem="currentitem" :selected-tree-id="selectedTreeItem.id" :selected-node="selectedNode" />
          </div>
        </VFadeTransition>
      </template>
    </VOverlay>
    <VRow dense class="align-center">
      <MCDialogBookSelect v-if="isDialogSelectBookVisible" v-model:is-dialog-visible="isDialogSelectBookVisible" />
      <VCol cols="12" md="3" />
      <VCol cols="12" md="6" class="mx-auto">
        <VTextField
          v-model="searchPhrase" :placeholder="$t('search')" class="search-bar" single-line clearable :loading="resultDataOnState[dataTabValue].loading"
          @keydown="handleSearchKeydown"
        >
          <template #append-inner>
            <VBtn icon size="small" variant="text" @click="runSearch(true)">
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
      <VCol cols="12" md="3" />
    </VRow>
    <!-- v-for="(item, i) in testfacetlist" :key="i"  -->
    <VRow no-gutters dense class="align-center" justify="space-between">
      <VTabs v-model="dataTabValue" density="compact" hide-slider class="data-collection-tabs">
        <VTab :value="DataBoxType.hadith" variant="elevated" rounded="sm">
          {{ $t('hadith') }} <span v-if="resultDataOnState[dataTabValue].totalItems > 0" class="pr-1">({{ resultDataOnState[dataTabValue].totalItems.toString() }})</span>
        </VTab>
        <VTab :value="DataBoxType.quran" variant="elevated" rounded="sm">
          {{ $t('ayah') }}
        </VTab>
        <VTab :value="DataBoxType.vocabulary" variant="elevated" rounded="sm">
          {{ $t('word') }}
        </VTab>
      </VTabs>
      <VBtn icon size="26" variant="text" @click="isDialogSelectBookVisible = true">
        <VIcon icon="tabler-book" size="22" />
      </VBtn>
    </VRow>
    <VDivider />
    <MCLoading :showloading="resultDataOnState[dataTabValue].loading" :loadingsize="SizeType.MD" />

    <VTabsWindow ref="mainDataResult" v-model="dataTabValue" class="mc-data-scroll">
      <VTabsWindowItem :value="DataBoxType.hadith" :transition="false">
        <!-- <VFadeTransition> -->
        <VRow v-if="resultDataOnState[dataTabValue].results.length > 0 && !resultDataOnState[dataTabValue].loading" dense>
          <VCol md="3">
            <div v-if="resultDataOnState[dataTabValue].facets.length > 0">
              <MCFacetBox
                v-for="item in resultDataOnState[dataTabValue].facets"
                :key="item.key" v-model:selected-items="resultDataOnState[dataTabValue].selectedFacets[item.key]" :istree="item.isTree"
                :scroll-item-count="item.scrollSize" :searchable="item.itemList.length > 5 ? true : false"
                :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
              />
            </div>
          </VCol>
          <VCol md="9">
            <div class="pl-2 py-2">
              <div v-show="!resultDataOnState[dataTabValue].loading" ref="loadmorestart" />
              <MCSearchResultBox
                v-for="(item) in resultDataOnState[dataTabValue].results" :key="item.id" :box-type="dataTabValue"
                :selected-node="selectedNode" :selected-tree-id="selectedTreeItem.id" :dataitem="item"
                @message-has-occured="searchResultBoxMessageHandle" @content-to-node-added="contentToNodeAdded" @maximize-search-tab-box="maximizeSearchTabBox"
              />
              <div v-show="!resultDataOnState[dataTabValue].loading" ref="loadmoreend" />
            </div>
          </VCol>
        </VRow>

        <!-- </VFadeTransition> -->
      </VTabsWindowItem>
      <VTabsWindowItem :value="DataBoxType.quran" :transition="false" />
      <VTabsWindowItem :value="DataBoxType.vocabulary" :transition="false" />
    </VTabsWindow>
    <VRow dense>
      <VCol md="12">
        <MCTablePagination
          v-if="resultDataOnState[dataTabValue].results.length > 0"
          v-model:page="resultDataOnState[dataTabValue].page"
          v-model:full-size="ispaginationFullSize" v-model:items-per-page="apiQueryParamData.PageSize"
          :divider="false"
          class="paging-container" :total-items="resultDataOnState[dataTabValue].totalItems"
        />
      </VCol>
    </VRow>
    <!--
      <VRow dense>
      <div v-show="loadingdata" class="loading-container">
      <VProgressCircular size="20" width="2" indeterminate />
      </div>
      </VRow>
    -->
  </VContainer>
</template>

<style lang="scss">
.v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
  padding: 0 !important;
}

.v-list-item-action--start {
  margin-inline: 0 0;
}
.maximizeSearchBox .v-overlay__content{
    height: 90%;
    width: 95%;
}
</style>
