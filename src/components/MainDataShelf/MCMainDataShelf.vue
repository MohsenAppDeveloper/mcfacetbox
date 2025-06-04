<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { isNumericString } from '@sindresorhus/is'
import { VBtn } from 'vuetify/lib/components/index.mjs'
import MCDataShelfBox from './MCDataShelfBox.vue'
import { useTree } from '@/store/treeStore'
import type { GridResultFacet, IRootServiceError } from '@/types/baseModels'
import { MessageType, QueryRequestModel, SelectAllState, SizeType } from '@/types/baseModels'
import type { IDataShelfBoxView } from '@/types/dataShelf'
import { DataShelfRouteQueryParams } from '@/types/dataShelf'
import { useDataShelfStateChanged } from '@/store/databoxStore'
import type { IFacetBox } from '@/types/SearchResult'

interface ISelectAllState {
  state: SelectAllState
  count: number
}
interface IMCDataShelfBoxREF {
  element: any
  dataBoxId: number
}
const loadmorestart = ref(null)
const loadmoreend = ref(null)
const mainDataResult = ref(null)
const activefilter = ref(false)

const totalItems = ref(0)
const currentNodeId = ref(0)
const currentTreeId = ref(0)
const searchQuery = ref('')
const selectAll = ref<ISelectAllState>({ state: SelectAllState.Deselect, count: 0 })
const resultdataItems = ref<IDataShelfBoxView[]>([])
const facetboxItems = ref<IFacetBox[]>([])
const databoxrefs = ref<IMCDataShelfBoxREF[]>([])
const increasebtn = ref<VBtn>()
const decreasebtn = ref<VBtn>()
const apiQueryParamtData = reactive<QueryRequestModel>(new QueryRequestModel())
const routeQueryParamData = reactive<DataShelfRouteQueryParams>(new DataShelfRouteQueryParams())
const isDialogDataShelfBoxEdit = ref(false)
const facettimeout: ReturnType<typeof setTimeout> | null = null
const facetinterval = ref(3000)
const { t } = useI18n({ useScope: 'global' })
const loadingdata = ref(false)

// const loadmore = ref(null)
const toast = useToast()
const { selectedNode } = useTree()
const shelfState = useDataShelfStateChanged()
const route = useRoute()
const router = useRouter()
const ispaginationFullSize = ref(false)

// const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(createUrl('app/excerpt', {
//   query: apiQueryParamtData,
// }), { immediate: false, refetch: false })

const { stop } = useIntersectionObserver(
  [loadmorestart, loadmoreend],
  ([entrystart, entryend]) => {
    if ((entrystart?.isIntersecting || entryend?.isIntersecting) && (resultdataItems.value.length <= totalItems.value))
      ispaginationFullSize.value = true
  },
)

const { isScrolling: isscrolling, arrivedState: scrollarriveState } = useScroll(mainDataResult)

watch(isscrolling, () => {
  if (isscrolling && !(scrollarriveState.bottom || scrollarriveState.top))
    ispaginationFullSize.value = false
})

watch(route, () => {
  checkRoute()
}, { immediate: true })
async function checkRoute() {
  /**
   * 1- بررسی وجود شناسه درخت و رمز گشایی آن
   * 2- مقدار دهی شناسه درخت
   * 3- بررسی وجود شناسه گره درخت و رمز گشایی آن
   * 4- مقداردهی شناسه گره جاری
   * 5-بررسی شماره صفحه و اندازه صفحه در Url
   * 6- در صورت وجود مقادیر در ظرف موقت ریخته میشود
   * 7- بررسی وجود فست در url ، رمز گشایی آنها و تبدیل به مدل مورد نیاز برای ارسال به سرویس دیتا
   * 8- انتقال ظرف موفت دیتای صفحه بندی و فست و شیء اصلی نگهداری این دیتا
   * Note : مقادیر دریافتی از url در متغیر های محلی مورد نیاز و یا در شیء مورد استفاده در دریافت دیتای لیست قرار میگیرند
   */
  try {
    if (!route.query.gtd)
      return
    const gtd = atob(route.query.gtd.toString())
    if (!isNumericString(gtd))
      return
    apiQueryParamtData.resetDynamicFields()
    currentNodeId.value = 0
    apiQueryParamtData.nodeId = 0
    currentTreeId.value = useToNumber(gtd).value
    apiQueryParamtData.treeId = currentTreeId.value

    if (route.query.snd) {
      const snd = atob(route.query.snd.toString())
      if (isNumericString(snd)) {
        currentNodeId.value = useToNumber(snd).value
        apiQueryParamtData.nodeId = currentNodeId.value
      }
    }

    const temprouteQueryParam = new DataShelfRouteQueryParams()
    if (route.query.dp) {
      const temppagenumber = atob(route.query.dp.toString())
      if (isNumericString(temppagenumber))
        temprouteQueryParam.pageNumber = apiQueryParamtData.PageNumber = useToNumber(temppagenumber).value
    }
    if (route.query.dps) {
      const temppagesize = atob(route.query.dps.toString())
      if (isNumericString(temppagesize))
        temprouteQueryParam.pageSize = apiQueryParamtData.PageSize = useToNumber(temppagesize).value
    }
    if (route.query.df) {
      const tempfacets = atob(route.query.df.toString())

      const facetlist = tempfacets.split('#')

      facetlist.forEach(facetitem => {
        if (facetitem.includes('=')) {
          temprouteQueryParam.selectedFacetItems[facetitem.split('=')[0]] = facetitem.split('=')[1].split(',')
          apiQueryParamtData[facetitem.split('=')[0]] = facetitem.split('=')[1].split(',')
        }
      })
    }
    Object.assign(routeQueryParamData, temprouteQueryParam)

    // console.log('facetbeforechange', routeQueryParamData.selectedFacetItems)

    refreshDataShelf()
  }
  catch (error) {
    console.log('checkrouteeroor', error)
  }
}

const resultdataItemsSort = computed(() => {
  return resultdataItems.value.sort((a, b) => b.priority - a.priority)
})

function resetData() {
//   Object.keys(facetQuery.value).forEach(key => {
//     delete facetQuery.value[key]
//   })
  selectAll.value.state = SelectAllState.Deselect
  selectAll.value.count = 0
  resultdataItems.value = []
  facetboxItems.value.splice(0)
  currentNodeId.value = selectedNode.id
}
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
  if (newVal === oldVal)
    return // از تغییرات مشابه جلوگیری می‌کنیم

  updateRouteIfNeeded({ dp: newVal })
})
watch(() => routeQueryParamData.pageSize, (newVal, oldVal) => {
  if (newVal === oldVal)
    return

  // اگر اندازه صفحه تغییر کرده باشد شماره صفحه باید 1 باشد
  updateRouteIfNeeded({ dps: newVal, dp: 1 })
})
watch(() => routeQueryParamData.rawFacets, (newVal, oldVal) => {
  if (newVal === oldVal)
    return

  // اگر فیلترها تغییر کرده باشند صفحه باید یک شود
  updateRouteIfNeeded({ df: newVal, dp: 1 })
})
function updateRouteIfNeeded(params: Record<string, any>) {
  const newQuery = { ...route.query }

  Object.keys(params).forEach(paramKey => {
    const newVal = params[paramKey]

    // 👉 - بررسی اینکه آیا تغییرات صفحه بندی و فست تکراری است یا نه؟ برای جلوگیری از ایجاد حلقه
    if (newQuery[paramKey] !== btoa(newVal.toString()))
      newQuery[paramKey] = btoa(newVal.toString())
  })

  router.replace({ query: newQuery })
}
watch(shelfState.lastState, async () => {
  try {
    if (currentNodeId.value === shelfState.connectednodeid.value)
      refreshDataShelf()
  }
  catch (error) {
  }
})

// onFetchResponse(() => {
// //   response.json().then(value => {
//   try {
//     const result = resultData.value as GridResultFacet<IDataShelfBoxView>

//     resetData()

//     totalItems.value = result.totalCount
//     setTimeout(() => {
//       facetboxItems.value.push(...result.facets)

//       resultdataItems.value = [...result.items]

//       //   activefilter.value = !activefilter.value

//     //   activefilter.value = !activefilter.value
//     }, 1000)

//     // if (isUndefined(resultdataItems.value))
//     //   toast.error(t('alert.probleminGetExcerpt'))

//     //   if ((result.items.length ?? 0) <= 0)
//     //     toast.info(t('alert.resultNotFound'))
//   }
//   catch (error) {
//     toast.error(t('alert.probleminLoadExcerpt'))
//   }

//   // loading.value = true
// //   })
// })

// onFetchError(error => {
//   if (isNullOrUndefined(error) || error.name === 'AbortError')
//     return

//   //   console.log('responseerror', error.name)

//   //   error.json().then(value => {
//   try {
//     const result = resultData.value as IRootServiceError

//     console.log('result', result)

//     if (result && result.error && result.error.message)
//       toast.error(result.error.message)
//     else
//       toast.error(t('alert.probleminGetExcerpt'))
//   }
//   catch {
//     toast.error(t('alert.probleminLoadSearchResult'))
//   }

//   // loading.value = true
// //   })
// })

async function refreshDataShelf() {
  loadingdata.value = true
  try {
    const { data } = await useApi(createUrl('app/excerpt', {
      query: apiQueryParamtData,
    }), { refetch: false })

    const resultCastedData = data.value as GridResultFacet<IDataShelfBoxView>

    resetData()
    totalItems.value = resultCastedData.totalCount

    if (resultCastedData.items.length > 0) {
      setTimeout(() => {
        loadingdata.value = false
        facetboxItems.value.push(...resultCastedData.facets)

        resultdataItems.value = [...resultCastedData.items]
      }, 1000)
    }
    else { loadingdata.value = false }
  }
  catch (error) {
    loadingdata.value = false
    toast.error(t('alert.probleminSearch'))
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
function deleteSelectedItem() {
//   const serviceError = shallowRef()

  //   const result = await confirmSwal(
  //     t('datashelfbox.deleteselecteditem'),
  //     '',
  //     t('$vuetify.confirmEdit.ok'),
  //     t('$vuetify.confirmEdit.cancel'),
  //     true, 'warning',
  //     async () => {
  //       try {
  //         await $api(('app/excerpt/').replace('//', '/') + databoxItem.value.id, {
  //           method: 'DELETE',
  //         })
  //       }
  //       catch (error) {
  //         serviceError.value = error
  //       }

  //       return { serviceError }
  //     },
  //   )

  //   if (result.isConfirmed) {
  //     const err = serviceError.value
  //     if (err) {
  //       if (err instanceof CustomFetchError && err.message)
  //         emits('handlemessage', serviceError.value.message, MessageType.error)
  //       else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
  //     }
  //     else {
  //       emits('handlemessage', t('alert.deleteDataSuccess'), MessageType.success)
  //       emits('refreshdatashelf')
  //     }
  //   }

// resultdataItemsSort.value.find(item => item.selected === true)
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
// با توجه به اینکه تغییر اولویت فقط در حالت انتخاب یک جعبه داده فعال میشود
  const dataItemResult = resultdataItemsSort.value.find(dataItem => dataItem.selected === true)
  if (dataItemResult) {
    const databoxrefResult = databoxrefs.value.find(refItem => refItem.dataBoxId === dataItemResult.id)
    if (databoxrefResult)
      databoxrefResult.element.increaseOrder()
  }
}

const decreaseOrder = () => {
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
</script>

<template>
  <VContainer class="mc-data-container mc-data-shelf">
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
            <VBtn icon size="small" variant="text">
              <VIcon icon="tabler-list-tree" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.treemode') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text">
              <VIcon icon="tabler-trash-x" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.deleteselecteditem') }}
              </VTooltip>
            </VBtn>

            <!--
              <VBtn icon size="small" variant="text">
              <VIcon icon="tabler-filters" size="22" />
              <VTooltip
              activator="parent"
              location="top center"
              >
              {{ $t('datashelfbox.allnode') }}
              </VTooltip>
              </VBtn>
            -->

            <VBtn icon size="small" variant="text" @click="isDialogDataShelfBoxEdit = true">
              <VIcon icon="tabler-pencil-plus" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.add') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" @click="refreshDataShelf">
              <VIcon icon="tabler-refresh" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('refresh') }}
              </VTooltip>
            </VBtn>
            <div v-if="selectAll.count === 1" class="border-thin rounded d-flex align-center">
              <VBtn ref="decreasebtn" icon size="25" variant="text" @click="decreaseOrder">
                <VIcon icon="tabler-arrow-up" size="22" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.moveup') }}
                </VTooltip>
              </VBtn>

              <VBtn ref="increasebtn" icon size="25" variant="text" @click="increaseOrder">
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
          <VRow v-if="resultdataItems.length > 0">
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
              <div>
                <div v-show="!loadingdata" ref="loadmorestart" />
                <MCDataShelfBox
                  v-for="(item, i) in resultdataItemsSort" :key="item.id" :ref="(el) => setdataboxref(el, item)" v-model="resultdataItemsSort[i]" :item-index="i"
                  :prev-item-order="i - 1"
                  :next-item-order="i + 1"
                  :prev-item-priority="i > 0 ? resultdataItemsSort[i - 1].priority : -1"
                  :next-item-priority="i < resultdataItemsSort.length - 1 ? resultdataItemsSort[i + 1].priority : -1"
                  @selectedchanged="checkSelectAllState" @orderchanged="databoxOrderChanged" @handlemessage="handleDataBoxMessages" @refreshdatashelf="refreshDataShelf"
                />
                <!--
                  :prev-item-order="i > 0 ? resultdataItemsSort[i - 1].order : -100"
                  :next-item-order="i < resultdataItemsSort.length - 1 ? resultdataItemsSort[i + 1].order : -100"
                -->
                <div v-show="!loadingdata" ref="loadmoreend" />
              </div>
            </VCol>
          </VRow>
          <div v-else-if="!loadingdata" class="w-100 h-100 d-flex align-center justify-center">
            <p>{{ $t('datashelfbox.fishnotexist') }}</p>
          </div>
        </VFadeTransition>
        <!-- <VRow > -->

        <!-- </VRow> -->
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
      v-if="isDialogDataShelfBoxEdit" v-model:is-dialog-visible="isDialogDataShelfBoxEdit" :treeid="currentTreeId" :nodeid="currentNodeId" :datashelfboxid="0" @insertdatabox-item="refreshDataShelf"
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
