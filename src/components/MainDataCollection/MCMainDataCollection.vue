<script setup lang="ts">
import { useToast } from 'vue-toastification'
import MCDialogBookSelect from '../dialogs/MCDialogBookSelect.vue'
import type { GridResultFacet } from '@/types/baseModels'
import { DataBoxType, MessageType, QueryRequestModel, SizeType } from '@/types/baseModels'
import { FacetBoxModel, SearchResultItemModel } from '@/types/SearchResult'
import { HadithSearchResultItemModel } from '@/types/hadithResult'
import type { ISearchResultItem, ITabSearchStateResult } from '@/types/SearchResult'
import { useSelectedTree, useTree } from '@/store/treeStore'
import { useDataShelfStateChanged } from '@/store/databoxStore'
import { AyahSearchResultItemModel } from '@/types/ayahResult'

interface IMCSearchResultREF {
  element: any
  itemId: string
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
const isDialogSelectBookVisible = ref(false)
const searchPhrase = ref('')

const apiQueryParamData = reactive<Record<DataBoxType, QueryRequestModel>>(
  {
    [DataBoxType.hadith]: (new QueryRequestModel()),
    [DataBoxType.quran]: (new QueryRequestModel()),
    [DataBoxType.vocabulary]: (new QueryRequestModel()),
    [DataBoxType.text]: (new QueryRequestModel()),
  },
)

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
const maximizBoxOverlay = shallowRef(false)
const currentitem = ref<ISearchResultItem>(new SearchResultItemModel())

// const loading = ref(false)
const selectedBooks = ref<string[]>([])

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
  if (newval === oldval)
    return
  console.log('datatabpagesize', dataTabValue.value)

  await runSearch(false)
})
watch(() => resultDataOnState[dataTabValue.value].page, async newval => {
  if ((newval !== apiQueryParamData[dataTabValue.value].PageNumber)) {
    apiQueryParamData[dataTabValue.value].PageNumber = newval

    await runSearch(false)
  }
})
watch(() => resultDataOnState[dataTabValue.value].selectedFacets, async newval => {
  let facetChange = false

  console.log('selectedfacet', resultDataOnState[dataTabValue.value])
  Object.keys(newval).forEach(key => {
    if (!apiQueryParamData[dataTabValue.value][key] || JSON.stringify(apiQueryParamData[dataTabValue.value][key]) !== JSON.stringify(newval[key])) {
      apiQueryParamData[dataTabValue.value][key] = newval[key]
      facetChange = true
    }
  })
  console.log('newfacetkey', facetChange)

  if (facetChange)
    await runSearch(true)
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
function resetData(resetSearcPhrase: boolean) {
  // apiQueryParamData.resetDynamicFields()
  if (resetSearcPhrase)
    searchPhrase.value = ''

  ispaginationFullSize.value = false
  resultDataOnState[dataTabValue.value] = { facets: [], results: [], totalItems: 0, page: 0, selectedFacets: {}, loading: false }

//   resultDataOnState[dataTabValue.value].results.splice(0)
//   resultDataOnState[dataTabValue.value].facets.splice(0)
}

function searchResultItemChaneged(searchresultItem: SearchResultItemModel) {
  const index = resultDataOnState[dataTabValue.value].results.findIndex(item => item.id === searchresultItem.id)
  if (index !== -1)
    resultDataOnState[dataTabValue.value].results[index].text = searchresultItem.text
}
async function runSearch(resetToDefault: boolean) {
  if (searchPhrase.value.length < 2)
    return
  const contentType = dataTabValue.value

  if (resetToDefault) {
    /** مقادیر فست ها و صفحه بندی را به حالت اولیه برمیگرداند */
    if (apiQueryParamData[dataTabValue.value].Filter !== searchPhrase.value)
      apiQueryParamData[dataTabValue.value].resetDynamicFields()
    apiQueryParamData[dataTabValue.value].SearchIn = 1
    apiQueryParamData[dataTabValue.value].IsFullText = false
    apiQueryParamData[dataTabValue.value].Filter = searchPhrase.value
    apiQueryParamData[dataTabValue.value].PageNumber = 1
    resultDataOnState[contentType].page = 1
  }

  apiQueryParamData[dataTabValue.value].PageNumber = resultDataOnState[contentType].page
  resultDataOnState[contentType].loading = true
  try {
    const { data } = await useApi(createUrl(`app/source/${DataBoxType[contentType]}`, {
      query: apiQueryParamData[dataTabValue.value],
    }), { refetch: false })

    const resultCastedData = data.value as GridResultFacet<ISearchResultItem>

    resetData(false)
    resultDataOnState[contentType].totalItems = resultCastedData.totalCount
    if (resultCastedData.items.length > 0) {
      resultDataOnState[contentType].results = resultCastedData.items.map(item => {
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
      })
      resultDataOnState[contentType].facets = resultCastedData.facets.map(f => new FacetBoxModel(f)) || []
    }
    resultDataOnState[contentType].loading = false
  }
  catch (error) {
    resultDataOnState[contentType].loading = false

    // const result = resultDataOnState as IRootServiceError

    // if (result && result.error && result.error.message)
    //   toast.error(result.error.message)
    // else
    //   toast.error(t('alert.probleminGetExcerpt'))
    toast.error(t('alert.probleminSearch'))
  }
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
            v-model:is-expanded="maximizBoxOverlay" :box-type="dataTabValue" :search-phrase="searchPhrase" expandable :dataitem="currentitem" :selected-tree-id="selectedTreeItem.id"
            :selected-node="selectedNode" @content-to-node-added="contentToNodeAdded" @message-has-occured="searchResultBoxMessageHandle"
            @dataitemhaschanged="(value) => { currentitem = value }"
          />
        </div>
      </template>
    </VOverlay>
    <VRow dense class="align-center">
      <MCDialogBookSelect v-if="isDialogSelectBookVisible" v-model:is-dialog-visible="isDialogSelectBookVisible" />
      <VCol cols="12" md="3" />
      <VCol cols="12" md="6" class="mx-auto">
        <VTextField
          v-model="searchPhrase" :placeholder="$t('search')" class="search-bar" single-line clearable persistent-clear
          :loading="resultDataOnState[dataTabValue].loading"
          @keydown="handleSearchKeydown" @click:clear="resetData(true)" @keydown.esc="resetData(true)"
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
          {{ $t('hadith') }} <span v-if="resultDataOnState[DataBoxType.hadith].totalItems > 0" class="pr-1">({{ resultDataOnState[DataBoxType.hadith].totalItems.toString() }})</span>
        </VTab>
        <VTab :value="DataBoxType.quran" variant="elevated" rounded="sm">
          {{ $t('ayah') }} <span v-if="resultDataOnState[DataBoxType.quran].totalItems > 0" class="pr-1">({{ resultDataOnState[DataBoxType.quran].totalItems.toString() }})</span>
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
    <!-- class="mc-data-scroll" -->
    <VRow dense style="padding-block-end: 5px;height: 100%;">
      <VTabsWindow v-model="dataTabValue" class="h-100">
        <VTabsWindowItem :value="DataBoxType.hadith" :transition="false" class="h-100">
          <VFadeTransition>
            <div v-if="dataTabValue === DataBoxType.hadith" ref="mainDataResultHadith" class="mc-data-scrolly">
              <VRow v-if="resultDataOnState[DataBoxType.hadith].results.length > 0 && !resultDataOnState[DataBoxType.hadith].loading" dense>
                <VCol md="3">
                  <div v-if="resultDataOnState[DataBoxType.hadith].facets.length > 0">
                    <MCFacetBox
                      v-for="item in resultDataOnState[DataBoxType.hadith].facets"
                      :key="item.key" v-model:selected-items="resultDataOnState[DataBoxType.hadith].selectedFacets[item.key]" :istree="item.isTree"
                      :scroll-item-count="item.scrollSize" :searchable="item.itemList.length > 5 ? true : false"
                      :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
                    />
                  </div>
                </VCol>
                <VCol md="9">
                  <div class="pl-2 py-2">
                    <div v-show="!resultDataOnState[DataBoxType.hadith].loading" ref="loadmorestarthadith" />
                    <MCSearchResultBox
                      v-for="item in resultDataOnState[DataBoxType.hadith].results"
                      :key="item.id" :box-type="DataBoxType.hadith" expandable
                      :selected-node="selectedNode" :selected-tree-id="selectedTreeItem.id" :dataitem="item" :search-phrase="searchPhrase"
                      @message-has-occured="searchResultBoxMessageHandle" @content-to-node-added="contentToNodeAdded" @maximize-search-tab-box="maximizeSearchTabBox" @dataitemhaschanged="searchResultItemChaneged"
                    />
                    <div v-show="!resultDataOnState[DataBoxType.hadith].loading" ref="loadmoreendhadith" />
                  </div>
                </VCol>
              </VRow>
            </div>
          </VFadeTransition>
        </VTabsWindowItem>
        <VTabsWindowItem :value="DataBoxType.quran" :transition="false" class="h-100">
          <VFadeTransition>
            <div v-if="dataTabValue === DataBoxType.quran" ref="mainDataResultQuran" class="mc-data-scrolly">
              <VRow v-if="resultDataOnState[DataBoxType.quran].results.length > 0 && !resultDataOnState[DataBoxType.quran].loading" dense>
                <VCol md="3">
                  <div v-if="resultDataOnState[DataBoxType.quran].facets.length > 0">
                    <MCFacetBox
                      v-for="item in resultDataOnState[DataBoxType.quran].facets"
                      :key="item.key" v-model:selected-items="resultDataOnState[DataBoxType.quran].selectedFacets[item.key]" :istree="item.isTree"
                      :scroll-item-count="item.scrollSize" :searchable="item.itemList.length > 5 ? true : false"
                      :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
                    />
                  </div>
                </VCol>
                <VCol md="9">
                  <div class="pl-2 py-2">
                    <div v-show="!resultDataOnState[DataBoxType.quran].loading" ref="loadmorestartquran" />
                    <MCSearchResultBox
                      v-for="item in resultDataOnState[DataBoxType.quran].results"
                      :key="item.id" :box-type="DataBoxType.quran" expandable
                      :selected-node="selectedNode" :selected-tree-id="selectedTreeItem.id" :dataitem="item" :search-phrase="searchPhrase"
                      @message-has-occured="searchResultBoxMessageHandle" @content-to-node-added="contentToNodeAdded" @maximize-search-tab-box="maximizeSearchTabBox" @dataitemhaschanged="searchResultItemChaneged"
                    />
                    <div v-show="!resultDataOnState[DataBoxType.quran].loading" ref="loadmoreendquran" />
                  </div>
                </VCol>
              </VRow>
            </div>
          </VFadeTransition>
        </VTabsWindowItem>
        <VTabsWindowItem :value="DataBoxType.vocabulary" :transition="false" />
      </VTabsWindow>
    </VRow>
    <VRow dense>
      <VCol md="12">
        <MCTablePagination
          v-if="resultDataOnState[dataTabValue].results.length > 0"
          v-model:page="resultDataOnState[dataTabValue].page"
          v-model:full-size="ispaginationFullSize" v-model:items-per-page="apiQueryParamData[dataTabValue].PageSize"
          :divider="false"
          class="paging-container" :total-items="resultDataOnState[dataTabValue].totalItems"
        />
      </VCol>
    </VRow>
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
