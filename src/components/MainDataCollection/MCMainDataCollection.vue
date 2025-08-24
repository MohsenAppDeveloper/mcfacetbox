<script setup lang="ts">
import { useToast } from 'vue-toastification'
import MCDialogRepositorySearchHistory from '../dialogs/MCDialogRepositorySearchHistory.vue'
import type { GridResultFacet, IRootServiceError } from '@/types/baseModels'
import { DataBoxType, MessageType, QueryRequestModel, SearchConfig, SizeType } from '@/types/baseModels'
import type { ISearchResultItem, SearchResultConfigModel } from '@/types/SearchResult'
import { FacetBoxModel, SearchResultItemModel, TabSearchStateResultModel } from '@/types/SearchResult'
import { HadithSearchResultItemModel } from '@/types/hadithResult'
import { useSelectedTree, useTree } from '@/store/treeStore'
import { useDataShelfStateChanged } from '@/store/databoxStore'
import { AyahSearchResultItemModel } from '@/types/ayahResult'
import useRouterForGlobalVariables from '@/composables/useRouterVariables'

interface IMCSearchResultREF {
  element: any
  itemId: string
}

enum ChangeFilterType {
  ChangePageNumber = 'ChangePageNumber',
  ChangePageSize = 'ChangePageSize',
  SearchPhrase = 'SearchPhrase',
  Facet = 'Facet',
  Clear = 'Clear',
}
const { selectedNode } = useTree()
const selectedTreeItem = useSelectedTree()
const shelfState = useDataShelfStateChanged()
const ispaginationFullSize = ref(false)
const { t } = useI18n({ useScope: 'global' })
const loadmorestarthadith = shallowRef(null)
const loadmoreendhadith = shallowRef(null)
const loadmorestartquran = shallowRef(null)
const loadmoreendquran = shallowRef(null)
const mainDataResultHadith = shallowRef(null)
const mainDataResultQuran = shallowRef(null)
const dataTabValue = ref<DataBoxType>(DataBoxType.hadith)
const toast = useToast()
const allHadith = shallowRef(false)
const watchSearchFilters = shallowRef(false)
const dialogSearchConfigVisible = shallowRef(false)
const dialogSearchHistoryVisible = shallowRef(false)

const currentSearchConfig = ref(SearchConfig.All)

const apiQueryParamData = reactive<Record<DataBoxType, QueryRequestModel>>(
  {
    [DataBoxType.hadith]: (new QueryRequestModel()),
    [DataBoxType.quran]: (new QueryRequestModel()),
    [DataBoxType.vocabulary]: (new QueryRequestModel()),
    [DataBoxType.text]: (new QueryRequestModel()),
  },
)

const resultDataOnState = reactive<Record<DataBoxType, TabSearchStateResultModel>>({
  [DataBoxType.hadith]: new TabSearchStateResultModel(),
  [DataBoxType.quran]: new TabSearchStateResultModel(),
  [DataBoxType.vocabulary]: new TabSearchStateResultModel(),
  [DataBoxType.text]: new TabSearchStateResultModel(),
})

// const loading = ref(false)
const maximizBoxOverlay = shallowRef(false)
const currentitem = ref<ISearchResultItem>(new SearchResultItemModel())

// const loading = ref(false)
const { x: cursorX, y: cursorY } = usePointer()

const {
  routerTreeId,
} = useRouterForGlobalVariables()

const { stop } = useIntersectionObserver(
  [loadmorestarthadith, loadmoreendhadith, loadmoreendquran, loadmorestartquran],
  ([entrystarthadith, entryendhadith, entrystartquran, entryendquran], observerElement) => {
    if ((entrystarthadith?.isIntersecting || entryendhadith?.isIntersecting || entrystartquran?.isIntersecting || entryendquran?.isIntersecting)
    && (resultDataOnState[dataTabValue.value].results.length <= resultDataOnState[dataTabValue.value].totalItems))
      ispaginationFullSize.value = true
  },
)

/**
 * این کد حذف نشود، برای انتصاب رفرنس به هر ایتم جستجو و رهگیری نمایش آنها هنگام اسکرول کردن است
 */
// const setSearchResultElementRef = (elementParam: any, itemId: string) => {
//   const elementIndex = searchResultElement.value.findIndex(elementItem => elementItem.itemId === itemId)
//   if (elementIndex < 0) {
//     searchResultElement.value.push({ element: elementParam, itemId })

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting)
//           visibleItemIds.value.add(itemId)
//         else
//           visibleItemIds.value.delete(itemId)
//         console.log('entry', entry)
//         console.log('visibleItemIds', visibleItemIds.value)
//       },
//       { threshold: 0.1 },
//     )

//     console.log('element', itemId)

//     observer.observe(elementParam)
//     observers.push(observer)
//   }
// }

/**
 * !SECTION
 * تعریف نمونه های تشخیص اسکرول، این تعریف ها بازای هر تب اینجا باشد
 */
const { isScrolling: isscrollingHadith, arrivedState: scrollarriveStateHadith } = useScroll(mainDataResultHadith)
const { isScrolling: isscrollingQuran, arrivedState: scrollarriveStateQuran } = useScroll(mainDataResultQuran)

/**
 * !SECTION
 * واچ های مرتب با تشخیص اسکرول تب ها، بهتر است یکجا باشد
 */
watch(isscrollingHadith, () => {
  if (isscrollingHadith && !(scrollarriveStateHadith.bottom || scrollarriveStateHadith.top))
    ispaginationFullSize.value = false
})
watch(isscrollingQuran, () => {
  if (isscrollingQuran && !(scrollarriveStateQuran.bottom || scrollarriveStateQuran.top))
    ispaginationFullSize.value = false
})

watch(() => apiQueryParamData[dataTabValue.value].PageSize, async (newval, oldval) => {
  if (newval === oldval || !watchSearchFilters.value)
    return
  await runSearch(ChangeFilterType.ChangePageSize)
})
watch(() => resultDataOnState[dataTabValue.value].page, async newval => {
  if (!watchSearchFilters.value)
    return
  if ((newval !== apiQueryParamData[dataTabValue.value].PageNumber)) {
    apiQueryParamData[dataTabValue.value].PageNumber = newval

    await runSearch(ChangeFilterType.ChangePageNumber)
  }
})
watch(() => resultDataOnState[dataTabValue.value].selectedFacets, async newval => {
  if (!watchSearchFilters.value)
    return
  let facetChange = false

  Object.keys(newval).forEach(key => {
    if (!apiQueryParamData[dataTabValue.value][key] || JSON.stringify(apiQueryParamData[dataTabValue.value][key]) !== JSON.stringify(newval[key])) {
      apiQueryParamData[dataTabValue.value][key] = newval[key]
      facetChange = true
    }
  })

  if (facetChange)
    await runSearch(ChangeFilterType.Facet)
}, { deep: true })

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
async function handleSearchKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case ' ':
      event.stopPropagation()
      break;
    case 'Enter':
      event.stopPropagation()
      if (apiQueryParamData[dataTabValue.value].Filter.length < 2)
        return
      allHadith.value = false
      await runSearch(ChangeFilterType.SearchPhrase)
      break;
    default:
      break;
  }
}
function searchResultItemChaneged(searchresultItem: SearchResultItemModel) {
  const index = resultDataOnState[dataTabValue.value].results.findIndex(item => item.id === searchresultItem.id)
  if (index !== -1)
    resultDataOnState[dataTabValue.value].results[index].text = searchresultItem.text
}
function resetData(filterType: ChangeFilterType, deactiveWatchFilters: boolean = true) {
//   console.log('refreshdata1', filterType, deactiveWatchFilters)

  if (deactiveWatchFilters)
    watchSearchFilters.value = false

  ispaginationFullSize.value = false
  switch (filterType) {
    case ChangeFilterType.Facet:
      resultDataOnState[dataTabValue.value].resetCollections()
      resultDataOnState[dataTabValue.value].page = 1
      apiQueryParamData[dataTabValue.value].PageNumber = 1

      break;
    case ChangeFilterType.ChangePageSize:
    case ChangeFilterType.ChangePageNumber:
      resultDataOnState[dataTabValue.value].resetCollections()
      break;
    case ChangeFilterType.SearchPhrase:
      resultDataOnState[dataTabValue.value].selectedFacets = {}
      apiQueryParamData[dataTabValue.value].resetDynamicFields()
      apiQueryParamData[dataTabValue.value].IsFullText = false
      apiQueryParamData[dataTabValue.value].PageNumber = 1
      apiQueryParamData[dataTabValue.value].SearchIn = 1
      resultDataOnState[dataTabValue.value].resetCollections()
      resultDataOnState[dataTabValue.value].page = 1

      break;
    case ChangeFilterType.Clear:
      resultDataOnState[dataTabValue.value].resetAll()
      apiQueryParamData[dataTabValue.value].resetAll()
      currentSearchConfig.value = SearchConfig.All
    break;
    default:
      break;
  }

  if (deactiveWatchFilters)
    watchSearchFilters.value = true

// { facets: [], results: [], totalItems: 0, page: 0, selectedFacets: {}, loading: false }
//   resultDataOnState[dataTabValue.value].results.splice(0)
//   resultDataOnState[dataTabValue.value].facets.splice(0)
}

async function showAllHadith() {
  allHadith.value = true
  apiQueryParamData[dataTabValue.value].Filter = ''

  await runSearch(ChangeFilterType.SearchPhrase)
}
async function runSearch(filterType: ChangeFilterType) {
  watchSearchFilters.value = false

  const contentType = dataTabValue.value

  resetData(filterType, false)
  apiQueryParamData[dataTabValue.value].TreeId = routerTreeId.value
  apiQueryParamData[dataTabValue.value].SearchType = currentSearchConfig.value

  //   console.log('refreshdata2', filterType)

  resultDataOnState[contentType].loading = true
  try {
    const { data } = await useApi<any>(createUrl(`app/source/${DataBoxType[contentType]}`, {
      query: apiQueryParamData[contentType],
    }), { refetch: false })

    if (data.value && data.value.error) {
      const errorResult = data.value as IRootServiceError

      toast.error(errorResult.error.message)

      return
    }
    const resultCastedData = data.value as GridResultFacet<ISearchResultItem>

    resultDataOnState[contentType].totalItems = resultCastedData.totalCount
    if (resultCastedData.items.length > 0) {
      resultDataOnState[contentType].results.push(...resultCastedData.items.map(item => {
        switch (contentType) {
          case DataBoxType.hadith:
          return new HadithSearchResultItemModel(item.highLight, item.id, item.text ?? '', item.shortText ?? '', item.qaelTitleList, item.noorLibLink, item.qaelList,
              item.bookTitle, item.bookTitleShort, item.pageNum, item.sourceId, item.vol, item.translateCount, item.hadithRelatedCount)
        case DataBoxType.quran:
          return new AyahSearchResultItemModel(item.highLight, item.id, item.ayahNumber, item.link, item.shortText, item.text, item.surahTitle, item.surahId)
        case DataBoxType.vocabulary:
          return new HadithSearchResultItemModel()
          default:
            return item
        }
      }))
      resultDataOnState[contentType].facets.push(...resultCastedData.facets.map(f => new FacetBoxModel(f)) || [])
    }

    // console.log('refreshdata3', filterType)
  }
  catch (error) {
    toast.error(t('alert.probleminSearch'))
  }
  finally {
    resultDataOnState[contentType].loading = false
    watchSearchFilters.value = true

    // console.log('refreshdata4', filterType)
  }
}

const loadSearchHistory = async (historySetting: SearchResultConfigModel) => {
  watchSearchFilters.value = false
  Object.keys(historySetting.setting).forEach(settingitem => {
    // console.log('settingitem', settingitem, apiQueryParamData[dataTabValue.value][settingitem], historySetting.setting[settingitem])
    apiQueryParamData[dataTabValue.value][settingitem] = historySetting.setting[settingitem]
  })

  resultDataOnState[dataTabValue.value].page = apiQueryParamData[dataTabValue.value].PageNumber

  Object.keys(apiQueryParamData[dataTabValue.value].getDynamicProperties()).forEach(settingitem => {
    resultDataOnState[dataTabValue.value].selectedFacets[settingitem] = apiQueryParamData[dataTabValue.value].getDynamicProperties()[settingitem]
  })
  currentSearchConfig.value = apiQueryParamData[dataTabValue.value].SearchType
  await runSearch(ChangeFilterType.ChangePageSize)
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
        <div v-if="maximizBoxOverlay" class="flex flex-col justify-center my-2 mx-3 h-100 w-100">
          <MCSearchResultBox
            v-model:is-expanded="maximizBoxOverlay" :box-type="dataTabValue" :search-phrase="apiQueryParamData[dataTabValue].Filter" expandable :dataitem="currentitem" :selected-tree-id="selectedTreeItem.id"
            :selected-node="selectedNode" @content-to-node-added="contentToNodeAdded" @message-has-occured="searchResultBoxMessageHandle"
            @dataitemhaschanged="(value) => { currentitem = value }"
          />
        </div>
      </template>
    </VOverlay>
    <!--
      <VRow dense class="align-center">
      <VCol cols="12" md="3" />
      <VCol cols="12" md="6" class="mx-auto" />
      <VCol cols="12" md="3" />
      </VRow>
    -->
    <!-- v-for="(item, i) in testfacetlist" :key="i"  -->
    <VRow no-gutters dense class="align-center " justify="space-between">
      <VTabs v-model="dataTabValue" density="compact" hide-slider class="data-collection-tabs" slider-color="transparent">
        <VTab :value="DataBoxType.hadith" variant="elevated" rounded="sm">
          {{ $t('hadith') }} <span v-if="resultDataOnState[DataBoxType.hadith].totalItems > 0" class="pr-1">({{ resultDataOnState[DataBoxType.hadith].totalItems.toString() }})</span>
        </VTab>
        <VTab :value="DataBoxType.quran" variant="elevated" rounded="sm">
          {{ $t('ayah') }} <span v-if="resultDataOnState[DataBoxType.quran].totalItems > 0" class="pr-1">({{ resultDataOnState[DataBoxType.quran].totalItems.toString() }})</span>
        </VTab>
        <VTab :value="DataBoxType.vocabulary" variant="elevated" rounded="sm">
          {{ $t('word') }}
        </VTab>
      </VTabs>
      <VTextField
        v-model.lazy="apiQueryParamData[dataTabValue].Filter" :placeholder="$t('search')" class="pr-5 pb-1 pl-2" single-line clearable
        persistent-clear
        :loading="resultDataOnState[dataTabValue].loading"
        @keydown="handleSearchKeydown" @click:clear="resetData(ChangeFilterType.Clear)" @keydown.esc="resetData(ChangeFilterType.Clear)"
      >
        <template #append-inner>
          <VBtn icon size="small" variant="text" @click="() => { if (apiQueryParamData[dataTabValue].Filter.length > 1) runSearch(ChangeFilterType.SearchPhrase) }">
            <VIcon icon="tabler-search" size="22" />
          </VBtn>
          <VBtn icon size="small" :color="currentSearchConfig !== SearchConfig.All ? 'success' : 'primary'" variant="text" @click="dialogSearchConfigVisible = true">
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t(`searchconfig.${SearchConfig[currentSearchConfig]}`) }}
            </VTooltip>
            <VIcon icon="tabler-settings" size="22" />
          </VBtn>
          <VBtn icon size="small" variant="text" @click="dialogSearchHistoryVisible = true">
            <VIcon icon="tabler-history" size="22" />
          </VBtn>
          <VBtn v-if="dataTabValue === DataBoxType.hadith" icon size="small" variant="text" @click="showAllHadith">
            <VIcon icon="tabler-book" size="22" />
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('allHadith') }}
            </VTooltip>
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
    </VRow>
    <VDivider />
    <MCLoading :showloading="resultDataOnState[dataTabValue].loading" :loadingsize="SizeType.MD" />
    <!-- class="mc-data-scroll" -->
    <VRow dense style="padding-block-end: 5px;height: 100%;width: 100%;">
      <VTabsWindow v-model="dataTabValue" class="h-100 w-100">
        <VTabsWindowItem :value="DataBoxType.hadith" :transition="false" class="h-100">
          <VFadeTransition>
            <div v-if="dataTabValue === DataBoxType.hadith && resultDataOnState[DataBoxType.hadith].results.length > 0 && !resultDataOnState[DataBoxType.hadith].loading" class="d-flex flex-row overflow-hidden h-100">
              <div v-if="resultDataOnState[DataBoxType.hadith].facets.length > 0" style="width:25%" class="mc-data-scrolly">
                <MCFacetBox
                  v-for="item in resultDataOnState[DataBoxType.hadith].facets"
                  :key="item.key" v-model:selected-items="resultDataOnState[DataBoxType.hadith].selectedFacets[item.key]" :istree="item.isTree"
                  :scroll-item-count="item.scrollSize" :searchable="item.itemList.length > 5 ? true : false"
                  :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
                />
              </div>
              <div ref="mainDataResultHadith" style="width:75%" class="mc-data-scrolly ">
                <div class="pl-2 py-2">
                  <div v-show="!resultDataOnState[DataBoxType.hadith].loading" ref="loadmorestarthadith" />
                  <MCSearchResultBox
                    v-for="item in resultDataOnState[DataBoxType.hadith].results"
                    :key="item.id" :box-type="DataBoxType.hadith" expandable
                    :selected-node="selectedNode" :selected-tree-id="selectedTreeItem.id" :dataitem="item" :search-phrase="apiQueryParamData[dataTabValue].Filter"
                    @message-has-occured="searchResultBoxMessageHandle" @content-to-node-added="contentToNodeAdded" @maximize-search-tab-box="maximizeSearchTabBox" @dataitemhaschanged="searchResultItemChaneged"
                  />
                  <div v-show="!resultDataOnState[DataBoxType.hadith].loading" ref="loadmoreendhadith" />
                </div>
              </div>
            </div>
          </VFadeTransition>
        </VTabsWindowItem>
        <VTabsWindowItem :value="DataBoxType.quran" :transition="false" class="h-100">
          <VFadeTransition>
            <!--
              <div v-if="dataTabValue === DataBoxType.quran" ref="mainDataResultQuran" class="mc-data-scrolly">
              <VRow v-if="resultDataOnState[DataBoxType.quran].results.length > 0 && !resultDataOnState[DataBoxType.quran].loading" dense>
              <VCol md="3">
              <div v-if="resultDataOnState[DataBoxType.quran].facets.length > 0">
            -->
            <div v-if="dataTabValue === DataBoxType.quran && resultDataOnState[DataBoxType.quran].results.length > 0 && !resultDataOnState[DataBoxType.quran].loading" class="d-flex flex-row overflow-hidden h-100">
              <div v-if="resultDataOnState[DataBoxType.quran].facets.length > 0" style="width:25%" class="mc-data-scrolly">
                <MCFacetBox
                  v-for="item in resultDataOnState[DataBoxType.quran].facets"
                  :key="item.key" v-model:selected-items="resultDataOnState[DataBoxType.quran].selectedFacets[item.key]" :istree="item.isTree"
                  :scroll-item-count="item.scrollSize" :searchable="item.itemList.length > 5 ? true : false"
                  :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
                />
              </div>
              <div ref="mainDataResultQuran" style="width:75%" class="mc-data-scrolly ">
                <div class="pl-2 py-2">
                  <div v-show="!resultDataOnState[DataBoxType.quran].loading" ref="loadmorestartquran" />
                  <MCSearchResultBox
                    v-for="item in resultDataOnState[DataBoxType.quran].results"
                    :key="item.id" :box-type="DataBoxType.quran" expandable
                    :selected-node="selectedNode" :selected-tree-id="selectedTreeItem.id" :dataitem="item" :search-phrase="apiQueryParamData[dataTabValue].Filter"
                    @message-has-occured="searchResultBoxMessageHandle" @content-to-node-added="contentToNodeAdded" @maximize-search-tab-box="maximizeSearchTabBox" @dataitemhaschanged="searchResultItemChaneged"
                  />
                  <div v-show="!resultDataOnState[DataBoxType.quran].loading" ref="loadmoreendquran" />
                </div>
              </div>
            </div>
          </VFadeTransition>
        </VTabsWindowItem>
        <VTabsWindowItem :value="DataBoxType.vocabulary" :transition="false" />
      </VTabsWindow>
    </VRow>
    <!--
      <VRow dense>
      <VCol md="12">
    -->
    <MCTablePagination
      v-if="resultDataOnState[dataTabValue].results.length > 0"
      v-model:page="resultDataOnState[dataTabValue].page"
      v-model:full-size="ispaginationFullSize" v-model:items-per-page="apiQueryParamData[dataTabValue].PageSize"
      :divider="false"
      class="paging-container" :total-items="resultDataOnState[dataTabValue].totalItems"
    />
    <!--
      </VCol>
      </VRow>
    -->
    <MCDialogRepositorySearchHistory
      v-if="dialogSearchHistoryVisible" v-model:is-dialog-visible="dialogSearchHistoryVisible"
      :loc-x="cursorX" :loc-y="cursorY" :search-result-config="{ category: dataTabValue.toString(), setting: apiQueryParamData[dataTabValue], title: '' }"
      @message-has-occured="searchResultBoxMessageHandle" @settinghasbeenselected="loadSearchHistory"
    />
    <MCDialogSearchConfig
      v-if="dialogSearchConfigVisible" v-model:is-dialog-visible="dialogSearchConfigVisible"
      v-model:model-value="currentSearchConfig" :loc-x="cursorX" :loc-y="cursorY"
    />
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
    height: 95%;
    width: 95%;
}
</style>
