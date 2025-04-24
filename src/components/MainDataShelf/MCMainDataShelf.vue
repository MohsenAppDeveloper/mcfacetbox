<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { isNumericString, isUndefined } from '@sindresorhus/is'
import { VBtn } from 'vuetify/lib/components/index.mjs'
import MCDataShelfBox from './MCDataShelfBox.vue'
import { useTree } from '@/store/treeStore'
import { LoginState, MessageType, SelectAllState, SizeType } from '@/types/baseModels'
import type { GridResultFacet, IRootServiceError } from '@/types/baseModels'
import type { IDataShelfBoxView } from '@/types/dataShelf'
import { useDataShelfStateChanged } from '@/store/databoxStore'
import type { IFacetBox } from '@/types/SearchResult'
import { useLoginState } from '@/store/baseStore'

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
const itemsPerPage = ref(10)
const page = ref(1)
const totalItems = ref(0)
const sortBy = ref()
const orderBy = ref()
const currentNodeId = ref(0)
const currentTreeId = ref(0)
const searchQuery = ref('')
const selectAll = ref<ISelectAllState>({ state: SelectAllState.Deselect, count: 0 })
const resultdataItems = ref<IDataShelfBoxView[]>([])
const facetboxItems = ref<IFacetBox[]>([])
const databoxrefs = ref<IMCDataShelfBoxREF[]>([])
const increasebtn = ref<VBtn>()
const decreasebtn = ref<VBtn>()
const { t } = useI18n({ useScope: 'global' })

// const loadmore = ref(null)
const selectedFacetItems = reactive<Record<string, string[]>>({})
const toast = useToast()
const { selectedNode } = useTree()
const shelfState = useDataShelfStateChanged()
const { treeIndex } = useTree()

const route = useRoute()
const ispaginationFullSize = ref(false)

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(createUrl('app/excerpt', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
    nodeId: currentNodeId,
    treeId: currentTreeId,
  },
}), { immediate: false })

// const testfacetlist = ref<IFacetResult[]>([{ key: 'book', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }, { key: 'book1', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }])

// function scrollTo(view: Ref<HTMLElement | null>) {
//   if (view === undefined || view == null)
//     return
//   view.value?.scrollIntoView()
// }
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
  if (!route.query.gtd)
    return

  const gtd = atob(route.query.gtd.toString())
  if (!isNumericString(gtd))
    return
  currentTreeId.value = useToNumber(gtd).value

  if (currentTreeId.value === useToNumber(gtd).value && route.query.snd) {
    const snd = atob(route.query.snd.toString())

    if (isNumericString(snd) && treeIndex[snd]) {
      currentTreeId.value = useToNumber(gtd).value
      currentNodeId.value = useToNumber(snd).value
      refreshDataShelf()
      console.log('nodeid', snd, gtd)
    }
  }
}

const resultdataItemsSort = computed(() => {
  return resultdataItems.value.sort((a, b) => a.order - b.order)
})

function resetData() {
  selectAll.value.state = SelectAllState.Deselect
  selectAll.value.count = 0
  resultdataItems.value.splice(0)
  facetboxItems.value.splice(0)
  currentNodeId.value = selectedNode.id
}

// watch(selectedNode, async () => {
//   try {
//     refreshDataShelf('selectednode')
//   }
//   catch (error) {
//     console.log('fetchthrow', error)
//   }
// })
watch(shelfState.lastState, async () => {
  try {
    if (resultdataItems.value.length < itemsPerPage.value * page.value)
      refreshDataShelf()
  }
  catch (error) {
  }
}, { deep: true })
onFetchResponse(() => {
//   response.json().then(value => {
  try {
    const result = resultData.value as GridResultFacet<IDataShelfBoxView>

    resetData()
    totalItems.value = result.totalCount
    resultdataItems.value.splice(0)

    //   result.items.forEach(element => {
    facetboxItems.value.push(...result.facets)
    resultdataItems.value.push(...result.items)

    //   })
    if (isUndefined(resultdataItems.value))
      toast.error(t('alert.probleminGetExcerpt'))

    //   if ((result.items.length ?? 0) <= 0)
    //     toast.info(t('alert.resultNotFound'))
  }
  catch (error) {
    toast.error(t('alert.probleminLoadExcerpt'))
  }

  // loading.value = true
//   })
})

onFetchError(error => {
  if (isNullOrUndefined(error) || error.name === 'AbortError')
    return

  //   console.log('responseerror', error.name)

  //   error.json().then(value => {
  try {
    console.log('fetcherror2', resultData.value)

    const result = resultData.value as IRootServiceError

    console.log('fetcherror2', result)

    if (result && result.error && result.error.code)
      toast.error(result.error.message)
    else
      toast.error(t('alert.probleminGetExcerpt'))
  }
  catch {
    toast.error(t('alert.probleminLoadExcerpt'))
  }

  // loading.value = true
//   })
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

async function refreshDataShelf() {
  // resetData()
  await fetchData()

//   console.log('startfetching', entry)
}
function selectFilterDataShelf() {
  activefilter.value = !activefilter.value
}

// این تابع برای بررسی این است که آیا هر کدام از موارد انتخاب شده از انتخاب خارج شده اند یا نه؟
function checkSelectAllState(itemselected: boolean) {
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
      <MCLoading :showloading="loadingdata" :loadingsize="SizeType.MD" />
      <VCol class="">
        <!--
          <VToolbar
          no-gutters class="btn-box data-shelf-toolbar" :title="selectenode.title" height="40"
          dir="rtl"
          >
        -->
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
            <VBtn icon size="small" variant="text" @click="">
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
            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-list-tree" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.treemode') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-trash-x" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.deleteselecteditem') }}
              </VTooltip>
            </VBtn>

            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-filters" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.allnode') }}
              </VTooltip>
            </VBtn>

            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-pencil-plus" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.add') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" @click="">
              <VIcon icon="tabler-list-details" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.listdetail') }}
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
                  {{ $t('datashelfbox.movedown') }}
                </VTooltip>
              </VBtn>

              <VBtn ref="increasebtn" icon size="25" variant="text" @click="increaseOrder">
                <VIcon icon="tabler-arrow-down" size="22" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.moveup') }}
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
    <VRow ref="mainDataResult" class="mc-data-scroll">
      <MCLoading :showloading="loadingdata" :loadingsize="SizeType.MD" />
      <VCol md="12">
        <VRow v-if="resultdataItems.length > 0">
          <!-- <VSlideXReverseTransition> -->
          <VCol v-if="activefilter" md="3">
            <div>
              <MCFacetBox
                v-for="item in facetboxItems" :key="item.key"
                v-model:selected-items="selectedFacetItems[item.key]" :searchable="false" :dataitems="item.itemList"
                :facettitle="item.title" class="mb-2"
              />
            </div>
          </VCol>
          <!-- </VSlideXReverseTransition> -->
          <VCol :md="activefilter ? 9 : 12">
            <div>
              <div v-show="!loadingdata" ref="loadmorestart" />
              <MCDataShelfBox
                v-for="(item, i) in resultdataItemsSort" :key="item.id" :ref="(el) => setdataboxref(el, item)" v-model="resultdataItemsSort[i]" :item-index="i"
                :prev-item-order="i"
                :next-item-order="i"
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
        <!-- <VRow > -->

        <div v-else-if="!loadingdata" class="w-100 h-100 d-flex align-center justify-center">
          <p>{{ $t('datashelfbox.fishnotexist') }}</p>
        </div>

        <!-- </VRow> -->
      </VCol>
    </VRow>

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
          v-if="resultdataItems.length > 0"
          v-model:page="page"
          v-model:full-size="ispaginationFullSize" v-model:items-per-page="itemsPerPage"
          :divider="false"
          class="paging-container" :total-items="totalItems"
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
.orderdisable{
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
