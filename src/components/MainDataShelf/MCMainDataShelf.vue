<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { VBtn } from 'vuetify/lib/components/index.mjs'
import MCDataShelfBox from './MCDataShelfBox.vue'
import { useTree } from '@/store/treeStore'
import type { GridResultFacet, IRootServiceError } from '@/types/baseModels'
import { DataBoxType, MessageType, QueryRequestModel, SelectAllState, SizeType } from '@/types/baseModels'
import type { IDataShelfBoxView, LinkDetailModel, UnlinkDataModel } from '@/types/dataShelf'
import { DataShelfRouteQueryParams } from '@/types/dataShelf'
import useRouterForGlobalVariables from '@/composables/useRouterVariables'
import { useDataShelfStateChanged } from '@/store/databoxStore'
import { FacetBoxModel, SearchResultItemModel } from '@/types/SearchResult'
import type { IFacetBox, ISearchResultItem } from '@/types/SearchResult'
import { SHORTCUTKeys, ShortcutName } from '@/types/shortcutKeys'

interface ISelectAllState {
  state: SelectAllState
  count: number
}
interface IMCDataShelfBoxREF {
  element: any
  dataBoxId: number
}
const loadmorestart = shallowRef(null)
const loadmoreend = shallowRef(null)
const mainDataResult = ref(null)
const activefilter = shallowRef(false)
const totalItems = shallowRef(0)
const currentNodeId = ref(0)
const currentTreeId = ref(0)
const searchQuery = ref('')
const selectAll = ref<ISelectAllState>({ state: SelectAllState.Deselect, count: 0 })
const resultdataItems = ref<IDataShelfBoxView[]>([])
const facetboxItems = ref<IFacetBox[]>([])
const databoxrefs = ref<IMCDataShelfBoxREF[]>([])
const increasebtn = shallowRef<VBtn>()
const decreasebtn = shallowRef<VBtn>()
const apiQueryParamData = reactive<QueryRequestModel>(new QueryRequestModel())
const routeQueryParamData = reactive<DataShelfRouteQueryParams>(new DataShelfRouteQueryParams())
const isDialogDataShelfBoxEdit = ref(false)

const {
  routerTreeId, routerNodeId, routerExcerptPage, routerExcerptPageSize, routerExcerptFacet,
  excerptFacetQuery, excerptPageQuery, excerptPageSizeQuery, changeRouteQueryIfNeeded,
} = useRouterForGlobalVariables()

// const facettimeout: ReturnType<typeof setTimeout> | null = null
// const facetinterval = ref(3000)
const { t } = useI18n({ useScope: 'global' })
const loadingdata = shallowRef(false)
const lastscrolltopposition = shallowRef(0)
const { can } = useAbility()

/**
 * متغیرهای مرتبط با نمایش قسمت داده های مرتبط
 */
const relatedData_Overlay = shallowRef(false)
const relatedData_Type = shallowRef<DataBoxType>(DataBoxType.hadith)
const relatedData_CurrentItem = ref<ISearchResultItem>(new SearchResultItemModel())
const { lastShortcutTriggered } = useShortcutManager()

const toast = useToast()
const { selectedNode } = useTree()
const shelfState = useDataShelfStateChanged()
const route = useRoute()
const router = useRouter()
const ispaginationFullSize = ref(false)
const trackrouterparam = shallowRef(true)

// const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(createUrl('app/excerpt', {
//   query: apiQueryParamData,
// }), { immediate: false, refetch: false })

const { stop } = useIntersectionObserver(
  [loadmorestart, loadmoreend],
  ([entrystart, entryend]) => {
    if ((entrystart?.isIntersecting || entryend?.isIntersecting) && (resultdataItems.value.length <= totalItems.value))
      ispaginationFullSize.value = true
  },
)

const { y, isScrolling: isscrolling, arrivedState: scrollarriveState } = useScroll(mainDataResult)

watch(lastShortcutTriggered, newval => {
  if (newval === ShortcutName.excerptnew && !isDialogDataShelfBoxEdit.value)
    isDialogDataShelfBoxEdit.value = true
})
watch(isscrolling, () => {
  if (isscrolling && !(scrollarriveState.bottom || scrollarriveState.top))
    ispaginationFullSize.value = false
})
watch(y, newval => {
  if (newval > 0)
    lastscrolltopposition.value = y.value
})
watch(route, () => {
  checkRoute()
}, { immediate: true })

const resultdataItemsSort = computed(() => {
  return resultdataItems.value.sort((a, b) => b.priority - a.priority)
})

watch(selectAll.value, () => {
  switch (selectAll.value.state) {
  case SelectAllState.Select:
  case SelectAllState.Deselect:
    resultdataItemsSort.value.forEach(dataItem => {
      dataItem.selected = selectAll.value.state === SelectAllState.Select
    })
    break;
  default:
    break;
  }
  selectAll.value.count = resultdataItemsSort.value.filter(item => item.selected).length
})
watch(() => routeQueryParamData.pageNumber, (newVal, oldVal) => {
  if (newVal === oldVal || !trackrouterparam.value)
    return // از تغییرات مشابه جلوگیری می‌کنیم
  updateRouteIfNeeded(excerptPageQuery(newVal))
})
watch(() => routeQueryParamData.pageSize, (newVal, oldVal) => {
  if (newVal === oldVal || !trackrouterparam.value)
    return

  // اگر اندازه صفحه تغییر کرده باشد شماره صفحه باید 1 باشد
  updateRouteIfNeeded({ ...excerptPageSizeQuery(newVal), ...excerptPageQuery(1) })
})
watch(() => routeQueryParamData.rawFacets, (newVal, oldVal) => {
  if (newVal === oldVal || !trackrouterparam.value)
    return
  console.log('facetwatch', newVal, 'oldval', oldVal)

  // اگر فیلترها تغییر کرده باشند صفحه باید یک شود
  updateRouteIfNeeded({ ...excerptFacetQuery(newVal), ...excerptPageQuery(1) })
})
watch(shelfState.lastState, async () => {
  try {
    if (currentNodeId.value === shelfState.connectednodeid.value)
      refreshDataShelf(true)
  }
  catch (error) {
  }
})

async function checkRoute() {
  /**
   * 1- بررسی وجود شناسه درخت
   * 2- مقدار دهی شناسه درخت
   * 3- بررسی وجود شناسه گره درخت
   * 4- مقداردهی شناسه گره جاری
   * 5-بررسی شماره صفحه و اندازه صفحه در Url
   * 6- در صورت وجود مقادیر در ظرف موقت ریخته میشود
   * 7- بررسی وجود فست در url ، رمز گشایی آنها و تبدیل به مدل مورد نیاز برای ارسال به سرویس دیتا
   * 8- انتقال ظرف موفت دیتای صفحه بندی و فست و شیء اصلی نگهداری این دیتا
   * Note : مقادیر دریافتی از url در متغیر های محلی مورد نیاز و یا در شیء مورد استفاده در دریافت دیتای لیست قرار میگیرند
   */
  try {
    if (routerTreeId.value === 0)
      return
    trackrouterparam.value = false
    apiQueryParamData.resetDynamicFields()

    currentNodeId.value = 0
    apiQueryParamData.nodeId = 0
    currentTreeId.value = routerTreeId.value
    apiQueryParamData.treeId = currentTreeId.value
    if (routerNodeId.value > 0) {
      currentNodeId.value = routerNodeId.value
      apiQueryParamData.nodeId = routerNodeId.value
    }
    const temprouteQueryParam = new DataShelfRouteQueryParams()
    if (routerExcerptPage.value > 0)
      temprouteQueryParam.pageNumber = apiQueryParamData.PageNumber = routerExcerptPage.value
    if (routerExcerptPageSize.value > 0)
      temprouteQueryParam.pageSize = apiQueryParamData.PageSize = routerExcerptPageSize.value
    if (routerExcerptFacet.value.length > 0) {
      const facetlist = routerExcerptFacet.value.split('#')

      facetlist.forEach(facetitem => {
        if (facetitem.includes('=')) {
          temprouteQueryParam.selectedFacetItems[facetitem.split('=')[0]] = facetitem.split('=')[1].split(',')
          apiQueryParamData[facetitem.split('=')[0]] = facetitem.split('=')[1].split(',')
        }
      })
    }

    // console.log('temp:', temprouteQueryParam.rawFacets, 'routequery:', routeQueryParamData.rawFacets)
    Object.assign(routeQueryParamData, temprouteQueryParam)
    refreshDataShelf(false)
  }
  catch (error) {
    // console.log('checkrouteeroor', error)
  }
}
function updateRouteIfNeeded(params: Record<string, any>) {
  const newQuery = { ...route.query }

  changeRouteQueryIfNeeded(params, newQuery)

  router.replace({ query: newQuery })
}

function resetData() {
//   Object.keys(facetQuery.value).forEach(key => {
//     delete facetQuery.value[key]
//   })
  ispaginationFullSize.value = false
  selectAll.value.state = SelectAllState.Deselect
  selectAll.value.count = 0
  resultdataItems.value.splice(0)
  facetboxItems.value.splice(0)
  currentNodeId.value = selectedNode.id
}
async function refreshDataShelf(changescroll: boolean) {
  loadingdata.value = true
  try {
    const { data } = await useApi(createUrl('app/excerpt', {
      query: apiQueryParamData,
    }), { refetch: false })

    if (data.value && data.value.error) {
      const errorResult = data.value as IRootServiceError

      toast.error(errorResult.error.message)

      return
    }
    const resultCastedData = data.value as GridResultFacet<IDataShelfBoxView>

    resetData()
    totalItems.value = resultCastedData.totalCount

    if (resultCastedData.items.length > 0 || resultCastedData.facets.length > 0) {
      await setTimeout(() => {
        facetboxItems.value.push(...resultCastedData.facets.map(f => new FacetBoxModel(f)))

        // console.log('facetboxitems', facetboxItems.value)

        resultdataItems.value.push(...resultCastedData.items)
        nextTick(() => {
          if (changescroll && mainDataResult.value)
            mainDataResult.value.$el.scrollTop = lastscrolltopposition.value
        })
      }, 1000)
    }
  }
  catch (error) {
    toast.error(t('alert.probleminLoadExcerpt'))
  }
  finally {
    loadingdata.value = false
    trackrouterparam.value = true
  }

//   await fetchData()
}
function selectFilterDataShelf() {
  activefilter.value = !activefilter.value
}

// این تابع برای بررسی این است که آیا هر کدام از موارد انتخاب شده از انتخاب خارج شده اند یا نه؟
function checkSelectAllState(itemselected: boolean, selecteddataboxitem: IDataShelfBoxView) {
  if (itemselected && !resultdataItemsSort.value.find(item => item.selected === false || item.selected === undefined))
    selectAll.value.state = SelectAllState.Select

  else if (!itemselected && !resultdataItemsSort.value.find(item => item.selected === true))
    selectAll.value.state = SelectAllState.Deselect
  else selectAll.value.state = SelectAllState.Combine
  selectAll.value.count = resultdataItemsSort.value.filter(item => item.selected).length
}
function changeselectAllState() {
  if (selectAll.value.state === SelectAllState.Select)
    selectAll.value.state = SelectAllState.Deselect
  else if (selectAll.value.state === SelectAllState.Deselect)
    selectAll.value.state = SelectAllState.Select
  else
    selectAll.value.state = SelectAllState.Select
}
async function deleteSelectedItem() {
  if (!can('Delete', 'Excerpt'))
    return
  const serviceError = shallowRef()

  const result = await confirmSwal(
    t('datashelfbox.deleteselecteditem'),
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api(('app/excerpt'), {
          method: 'DELETE',
          body: JSON.stringify(resultdataItemsSort.value.filter(item => item.selected === true).map(a => a.id)),
        })
      }
      catch (error) {
        serviceError.value = error
      }

      return { serviceError }
    },
  )

  if (result.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        handleDataBoxMessages(serviceError.value.message, MessageType.error)
      else handleDataBoxMessages(t('httpstatuscodes.0'), MessageType.error)
    }
    else {
      handleDataBoxMessages(t('alert.deleteDataSuccess'), MessageType.success)
      refreshDataShelf(true)
    }
  }
}

// برای کار کردن با متدهای داخلی حعبه های داده انتخاب شده آنها را در یک لیست ذخیره می کنیم
const setdataboxref = (elementParam: any, item: IDataShelfBoxView) => {
  const elementIndex = databoxrefs.value.findIndex(elementItem => elementItem.dataBoxId === item.id)
  if (item.selected && elementIndex < 0) {
    databoxrefs.value.push({ element: elementParam, dataBoxId: item.id })
  }
  else if (!item.selected && elementIndex > -1) {
    if (elementIndex > -1)
      databoxrefs.value.splice(elementIndex, 1)
  }
}

// تابع داخلی جعبه داده برای تغییر اولویت را صدا میزنذ، ابتدا جعبه داده انتخاب شده را پیدا میکند و بعد ارجاع مرتبط با آن را استفاده میکند
const increaseOrder = () => {
  if (!can('Move', 'Excerpt'))
    return

  // با توجه به اینکه تغییر اولویت فقط در حالت انتخاب یک جعبه داده فعال میشود
  const dataItemResult = resultdataItemsSort.value.find(dataItem => dataItem.selected === true)
  if (dataItemResult) {
    const databoxrefResult = databoxrefs.value.find(refItem => refItem.dataBoxId === dataItemResult.id)
    if (databoxrefResult)
      databoxrefResult.element.increaseOrder()
  }
}

const decreaseOrder = () => {
  if (!can('Move', 'Excerpt'))
    return
  const dataItemResult = resultdataItemsSort.value.find(dataItem => dataItem.selected === true)
  if (dataItemResult) {
    const databoxrefResult = databoxrefs.value.find(refItem => refItem.dataBoxId === dataItemResult.id)
    if (databoxrefResult)
      databoxrefResult.element.decreaseOrder()
  }
}

function handleDataBoxMessages(message: string, messagetype: MessageType) {
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
function databoxOrderChanged(databoxItemId: number) {
  const itemIndex = resultdataItemsSort.value.findIndex(item => item.id === databoxItemId)
  if (decreasebtn.value && increasebtn.value) {
    decreasebtn.value.$el.classList.remove('orderdisable')
    increasebtn.value.$el.classList.remove('orderdisable')
  }

  if (itemIndex === 0 && decreasebtn.value)
    decreasebtn.value.$el.classList.add('orderdisable')
  if (itemIndex === resultdataItemsSort.value.length - 1 && increasebtn.value)
    increasebtn.value.$el.classList.add('orderdisable')
}

function contentToNodeAdded(connectednodeid: number) {
  toast.success(t('datashelfbox.yourfishadded'))
  shelfState.connectednodeid.value = connectednodeid
  shelfState.lastState.value = !shelfState.lastState.value
}
function showrelatedData(selectedItem: ISearchResultItem, datatype: DataBoxType) {
  relatedData_Type.value = datatype
  relatedData_CurrentItem.value = selectedItem
  relatedData_Overlay.value = true
}

function linkdatabox(linkdata: LinkDetailModel[]) {
  linkdata.sort((a, b) => b.priority - a.priority)
  resultdataItems.value.forEach(element => {
    const hasitem = linkdata.find(a => a.id === element.id)
    if (hasitem) {
      element.linkId = hasitem.linkId
      element.hasLink = true
      if (linkdata[linkdata.length - 1].id === hasitem.id)
        element.hasLink = false
    }
  })
}
function unlinkdatabox(unlinkdata: UnlinkDataModel) {
  unlinkdata.split1.sort((a, b) => b.priority - a.priority)
  unlinkdata.split2.sort((a, b) => b.priority - a.priority)

  resultdataItems.value.forEach(element => {
    const hasitemsplite1 = unlinkdata.split1.find(a => a.id === element.id)
    const hasitemsplite2 = unlinkdata.split2.find(a => a.id === element.id)

    if (hasitemsplite1) {
      element.linkId = hasitemsplite1.linkId
      element.hasLink = true
      if (unlinkdata.split1[unlinkdata.split1.length - 1].id === hasitemsplite1.id)
        element.hasLink = false
    }
    if (hasitemsplite2) {
      element.linkId = hasitemsplite2.linkId
      element.hasLink = true
      if (unlinkdata.split2[unlinkdata.split2.length - 1].id === hasitemsplite2.id)
        element.hasLink = false
    }
  })
}
</script>

<template>
  <VContainer class="mc-data-container mc-data-shelf">
    <VOverlay v-model="relatedData_Overlay" :close-on-back="false" contained class="maximizeSearchBox d-flex justify-center">
      <template #default>
        <div v-if="relatedData_Overlay" class="flex flex-col justify-center my-2 mx-3 h-100 w-100">
          <MCSearchResultBox
            v-model:is-expanded="relatedData_Overlay" search-phrase="" :box-type="relatedData_Type" expandable :dataitem="relatedData_CurrentItem" :selected-tree-id="currentTreeId"
            :selected-node="selectedNode" @content-to-node-added="contentToNodeAdded"
            @dataitemhaschanged="(value) => { relatedData_CurrentItem = value }"
          />
        </div>
      </template>
    </VOverlay>
    <VRow no-gutters>
      <VCol class="">
        <VRow no-gutters class="btn-box data-shelf-toolbar d-flex align-center justify-space-between">
          <!-- <VCol md="12" > -->
          <div class="d-flex toolbar">
            <VBtn icon size="small" :variant="selectAll.state === SelectAllState.Select ? 'elevated' : 'text'" @click="changeselectAllState">
              <VIcon :icon="selectAll.state === SelectAllState.Combine ? 'tabler-squares-selected' : 'tabler-select-all'" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.selectall') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text">
              <VIcon icon="tabler-search" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.search') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" :variant="activefilter ? 'elevated' : 'text'" @click="selectFilterDataShelf">
              <VIcon icon="tabler-filter" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.filter') }}
              </VTooltip>
            </VBtn>

            <VBtn icon size="small" :disabled="!can('Delete', 'Excerpt')" variant="text" @click="deleteSelectedItem">
              <VIcon icon="tabler-trash-x" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.deleteselecteditem') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" :disabled="!can('Create', 'Excerpt')" @click="isDialogDataShelfBoxEdit = (true && (can('Create', 'Excerpt') ?? false))">
              <VIcon icon="tabler-pencil-plus" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ `${$t('datashelfbox.add')} ${SHORTCUTKeys.excerptnew.keyTitle}` }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" @click="refreshDataShelf(false)">
              <VIcon icon="tabler-refresh" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('refresh') }}
              </VTooltip>
            </VBtn>
            <div v-if="selectAll.count === 1" :disabled="!can('Move', 'Excerpt')" class="border-thin rounded d-flex align-center">
              <VBtn ref="decreasebtn" icon size="25" variant="text" @click="decreaseOrder">
                <VIcon icon="tabler-arrow-up" size="22" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.moveup') }}
                </VTooltip>
              </VBtn>

              <VBtn ref="increasebtn" icon size="25" :disabled="!can('Move', 'Excerpt')" variant="text" @click="increaseOrder">
                <VIcon icon="tabler-arrow-down" size="22" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.movedown') }}
                </VTooltip>
              </VBtn>
            </div>
          </div>
          <div class="right-0">
            <span class="ma-2">{{ selectedNode.title }}
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('tree.selectednode') }}
              </VTooltip>
            </span>
          </div>
          <!-- </VCol> -->
        </VRow>
        <!-- </VToolbar> -->
      </VCol>
    </VRow>
    <VRow ref="mainDataResult" class="mc-data-scrolly">
      <MCLoading :showloading="loadingdata" :loadingsize="SizeType.MD" />
      <VCol md="12">
        <VFadeTransition>
          <VRow v-if="resultdataItems.length > 0 || facetboxItems.length > 0" style="padding-block-end: 5px;">
            <VCol v-if="activefilter" md="3">
              <div v-if="facetboxItems.length > 0">
                <MCFacetBox
                  v-for="item in facetboxItems" :key="item.key"
                  v-model:selected-items="routeQueryParamData.selectedFacetItems[item.key]" :searchable="false" :dataitems="item.itemList"
                  :facettitle="item.title" class="mb-2" :facettype="item.type"
                />
              </div>
            </VCol>
            <VCol :md="activefilter ? 9 : 12">
              <div v-if="resultdataItems.length > 0" style="position: relative;">
                <div v-show="!loadingdata" ref="loadmorestart" />
                <MCDataShelfBox
                  v-for="(item, i) in resultdataItemsSort" :key="item.id" :ref="(el) => setdataboxref(el, item)" v-model="resultdataItemsSort[i]" :item-index="i"
                  :prev-item-order="i - 1"
                  :next-item-order="i + 1"
                  :prev-item-priority="i > 0 ? resultdataItemsSort[i - 1].priority : -1"
                  :next-item-priority="i < resultdataItemsSort.length - 1 ? resultdataItemsSort[i + 1].priority : -1"
                  @selectedchanged="checkSelectAllState" @orderchanged="databoxOrderChanged" @handlemessage="handleDataBoxMessages" @refreshdatashelf="refreshDataShelf(true)"
                  @showrelateddata="showrelatedData" @linkdatabox="linkdatabox" @unlinkdatabox="unlinkdatabox"
                />
                <div v-show="!loadingdata" ref="loadmoreend" />
              </div>

              <div v-else-if="totalItems === 0 && !loadingdata" class="w-100 h-100 d-flex align-top justify-center">
                <p style="position: absolute;">
                  {{ $t('datashelfbox.fishnotexist') }}
                </p>
              </div>
            </VCol>
          </VRow>
        </VFadeTransition>
      </VCol>
    </VRow>

    <VRow dense>
      <VCol md="12">
        <MCTablePagination
          v-if="resultdataItems.length > 0"
          v-model:page="routeQueryParamData.pageNumber"
          v-model:full-size="ispaginationFullSize" v-model:items-per-page="routeQueryParamData.pageSize"
          :divider="false"
          class="paging-container" :total-items="totalItems"
        />
      </VCol>
    </VRow>
    <MCDialogDataShelfBoxEdit
      v-if="isDialogDataShelfBoxEdit" v-model:is-dialog-visible="isDialogDataShelfBoxEdit" :treeid="currentTreeId" :nodeid="currentNodeId" :datashelfboxid="0" @insertdatabox-item="refreshDataShelf(true)"
      @handlemessage="handleDataBoxMessages"
    />
  </VContainer>
</template>

<style lang="css">
.v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
  padding: 0 !important;
}

.v-list-item-action--start {
  margin-inline: 0 0;
}
.orderdisable{
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
