<script setup lang="ts">
import { VCol } from 'vuetify/lib/components/index.mjs'
import { useToast } from 'vue-toastification'
import { z } from 'zod'
import MCDialogBookSelect from '../dialogs/MCDialogBookSelect.vue'
import type { GridResultFacet, IRootServiceError } from '@/types/baseModels'
import { DataBoxType, MessageType, QueryRequestModel, SizeType } from '@/types/baseModels'
import { HadithSearchResultItemModel, type IFacetBox, type IHadithSearchResultItem, type ISearchResultTabBox } from '@/types/SearchResult'
import { useSelectedTree, useTree } from '@/store/treeStore'
import { useDataShelfStateChanged } from '@/store/databoxStore'

const hadithPageNumber = ref(1)
const totalItemsHadith = ref(0)
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
const facetboxItemsHadith = ref<IFacetBox[]>([])
const resultdataItemsHadith = ref<IHadithSearchResultItem[]>([])
const loading = ref(false)

// const loading = ref(false)
const selectedBooks = ref<string[]>([])
const selectedFacetItemsHadith = reactive<Record<string, string[]>>({})

const { stop } = useIntersectionObserver(
  [loadmorestart, loadmoreend],
  ([entrystart, entryend], observerElement) => {
    if ((entrystart?.isIntersecting || entryend?.isIntersecting) && (resultdataItemsHadith.value.length <= totalItemsHadith.value))
      ispaginationFullSize.value = true
  },
)

const { isScrolling: isscrolling, arrivedState: scrollarriveState } = useScroll(mainDataResult)

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(createUrl(`app/source/${DataBoxType[dataTabValue.value]}`, {
  query: apiQueryParamData,
}), { immediate: false })

watch(isscrolling, () => {
  //   if (!isscrolling.value && (scrollarriveState.bottom || scrollarriveState.top) && !ispaginationFullSize.value)
  //     ispaginationFullSize.value = true
  //   else
  if (isscrolling && !(scrollarriveState.bottom || scrollarriveState.top))
    ispaginationFullSize.value = false
})
watch(() => apiQueryParamData.PageSize, async (newval, oldval) => {
  if (newval !== oldval)
    console.log('pagesize', hadithPageNumber, newval)

  await runSearch(false)
})
watch(hadithPageNumber, async newval => {
  if ((newval !== apiQueryParamData.PageNumber)) {
    apiQueryParamData.PageNumber = newval
    console.log('pagenumber', hadithPageNumber, newval)

    await runSearch(false)
  }
})
watch(selectedFacetItemsHadith, async newval => {
  let facetChange = false

  Object.keys(newval).forEach(key => {
    console.log('facetboxx', !apiQueryParamData[key], apiQueryParamData[key] !== newval[key], apiQueryParamData[key], newval[key])
    if (!apiQueryParamData[key] || JSON.stringify(apiQueryParamData[key]) !== JSON.stringify(newval[key])) {
      apiQueryParamData[key] = newval[key]
      facetChange = true
    }
  })
  if (facetChange)
    await runSearch(true)
}, { flush: 'post' })

onFetchResponse(() => {
  try {
    const resultTemp = resultData.value as GridResultFacet<IHadithSearchResultItem>

    console.log('result', resultTemp)

    totalItemsHadith.value = resultTemp.totalCount
    resetData()

    // resultdataItemsHadith.value = [...resultTemp.items]
    setTimeout(() => {
      resultTemp.items.forEach(element => {
        resultdataItemsHadith.value.push(new HadithSearchResultItemModel(element.highLight, element.id, element.qaelTitleList, element.noorLibLink, element.qaelList, element.bookTitle, element.bookTitleShort, element.sourceId, element.pageNum, element.vol))

      // console.log('text', element.highlightText)
      })
      resultTemp.facets.forEach(element => {
        if (element.itemList && element.itemList.length > 0)
          facetboxItemsHadith.value.push(element)

      // console.log('text', element.highlightText)
      })
      loading.value = false
    }, 500)
  }
  catch (error) {
    console.log('error', error)
  }
})
onFetchError(error => {
  if (isNullOrUndefined(error) || error.name === 'AbortError')
    return
  try {
    const result = resultData.value as IRootServiceError

    if (result && result.error && result.error.code)
      toast.error(result.error.message)
    else
      toast.error(t('alert.probleminGetExcerpt'))
  }
  catch {
    toast.error(t('alert.probleminLoadExcerpt'))
  }
  loading.value = false
})

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
  resultdataItemsHadith.value.splice(0)
  facetboxItemsHadith.value.splice(0)
}

async function runSearch(resetToDefault: boolean) {
  if (searchPhrase.value.length < 2)
    return
  if (resetToDefault) {
    /** مقادیر فست ها و صفحه بندی را به حالت اولیه برمیگرداند */
    if (apiQueryParamData.Filter !== searchPhrase.value)
      apiQueryParamData.resetDynamicFields()
    apiQueryParamData.SearchIn = 1
    apiQueryParamData.Filter = searchPhrase.value
    apiQueryParamData.PageNumber = 1
    hadithPageNumber.value = 1
  }
  loading.value = true
  await fetchData()
}
</script>

<template>
  <VContainer class="mc-data-container">
    <VRow dense class="align-center">
      <MCDialogBookSelect v-if="isDialogSelectBookVisible" v-model:is-dialog-visible="isDialogSelectBookVisible" />
      <VCol cols="12" md="3" />
      <VCol cols="12" md="6" class="mx-auto">
        <VTextField
          v-model="searchPhrase" :placeholder="$t('search')" class="search-bar" single-line clearable :loading="loading"
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
          {{ $t('hadith') }} <span v-if="totalItemsHadith > 0" class="pr-1">({{ totalItemsHadith.toString() }})</span>
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
    <MCLoading :showloading="loading" :loadingsize="SizeType.MD" />

    <VTabsWindow ref="mainDataResult" v-model="dataTabValue" class="mc-data-scroll">
      <VTabsWindowItem :value="DataBoxType.hadith" :transition="false">
        <VFadeTransition>
          <VRow v-if="resultdataItemsHadith.length > 0 && !loading" dense>
            <VCol md="3">
              <div v-if="facetboxItemsHadith.length > 0">
                <MCFacetBox
                  v-for="item in facetboxItemsHadith"
                  :key="item.key" v-model:selected-items="selectedFacetItemsHadith[item.key]" :istree="item.isTree"
                  :scroll-item-count="item.scrollSize" :searchable="item.itemList.length > 5 ? true : false"
                  :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
                />
              </div>
            </VCol>
            <VCol md="9">
              <!-- <VInfiniteScroll side="end" height="500px" @load="loadMoreCollectingData"> -->
              <div class="pl-2 py-2">
                <!-- <template v-for="(item, index) in resultdataItems" :key="item"> -->
                <div v-show="!loading" ref="loadmorestart" />

                <MCSearchResultTabBox
                  v-for="(item) in resultdataItemsHadith" :key="item.id" :box-type="dataTabValue"
                  :selected-node="selectedNode" :selected-tree-id="selectedTreeItem.id" :dataitem-hadith="item"
                  @message-has-occured="searchResultBoxMessageHandle" @content-to-node-added="contentToNodeAdded"
                />
                <!-- </template> -->

                <div v-show="!loading" ref="loadmoreend" />
              </div>
            <!-- </VInfiniteScroll> -->
            </VCol>
          </VRow>
          <!--
            <VRow v-else style="height: 200px;" class="d-flex justify-center align-center">
            <div v-if="!loading" class="pt-5">
            <span class="ml-3">{{ $t('$vuetify.noDataText') }}</span>
            <IconBtn size="medium" @click="runSearch(false)">
            <VIcon icon="tabler-refresh" size="32" />
            </IconBtn>
            </div>
            </VRow>
          -->
        </VFadeTransition>
        <!-- </VFadeTransition> -->
      </VTabsWindowItem>
      <VTabsWindowItem :value="DataBoxType.quran" :transition="false" />
      <VTabsWindowItem :value="2" :transition="false" />
    </VTabsWindow>
    <!--
      <VRow dense>
      <div v-show="loadingdata" class="loading-container">
      <VProgressCircular size="20" width="2" indeterminate />
      </div>
      </VRow>
    -->
    <VRow dense>
      <VCol md="12">
        <MCTablePagination
          v-if="resultdataItemsHadith.length > 0"
          v-model:page="hadithPageNumber"
          v-model:full-size="ispaginationFullSize" v-model:items-per-page="apiQueryParamData.PageSize"
          :divider="false"
          class="paging-container" :total-items="totalItemsHadith === undefined ? 0 : totalItemsHadith"
        />
      </VCol>
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
