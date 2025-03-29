<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { isUndefined } from '@sindresorhus/is'
import { VBtn } from 'vuetify/lib/components/index.mjs'
import MCDataShelfBox from './MCDataShelfBox.vue'
import { useTree } from '@/store/treeStore'
import { type GridResult, SelectAllState } from '@/types/baseModels'
import type { IDataShelfBox } from '@/types/dataShelf'
import { useApiFake } from '@/composables/useApi'

interface ISelectAllState {
  state: SelectAllState
  count: number
}
interface IMCDataShelfBoxREF {
  element: any
  dataBoxId: number
}
const itemsPerPage = ref(16)
const page = ref(1)
const totalItems = ref(0)
const sortBy = ref()
const orderBy = ref()
const currentNodeId = ref(0)
const searchQuery = ref('')
const selectAll = ref<ISelectAllState>({ state: SelectAllState.Deselect, count: 0 })
const resultdataItems = ref<IDataShelfBox[]>([])
const databoxrefs = ref<IMCDataShelfBoxREF[]>([])
const increasebtn = ref<VBtn>()
const decreasebtn = ref<VBtn>()
const { t } = useI18n({ useScope: 'global' })
const loadmore = ref(null)
const selectedFacetItems = reactive<Record<string, number[]>>({})
const toast = useToast()
const { selectedNode } = useTree()

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApiFake<GridResult<IDataShelfBox>>(createUrl('/apps/dataShelf', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
    nodeId: currentNodeId,
  },
}), { immediate: false })

setTimeout(async () => {

}, 1000)

// const testfacetlist = ref<IFacetResult[]>([{ key: 'book', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }, { key: 'book1', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }])

// function scrollTo(view: Ref<HTMLElement | null>) {
//   if (view === undefined || view == null)
//     return
//   view.value?.scrollIntoView()
// }
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

const resultdataItemsSort = computed(() => {
  return resultdataItems.value.sort((a, b) => a.order - b.order)
})

function resetData() {
  selectAll.value.state = SelectAllState.Deselect
  selectAll.value.count = 0
  resultdataItems.value.splice(0)
  currentNodeId.value = selectedNode.id
}
watch(selectedNode, async () => {
  try {
    resetData()
    await fetchData(false)
  }
  catch (error) {
    console.log('fetchthrow', error)
  }
})

onFetchResponse(response => {
  response.json().then(value => {
    totalItems.value = value.totalItems
    resultData.value?.items.forEach(element => {
      resultdataItems.value.push(element)
    })
    if (isUndefined(resultdataItems.value))
      toast.error(t('alert.probleminGetInformation'))
    if ((resultData.value?.items.length ?? 0) <= 0)
      toast.info(t('alert.resultNotFound'))
  })
})
onFetchError(response => {
  toast.error(t('alert.dataActionFailed'))
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
const setdataboxref = (elementParam: any, item: IDataShelfBox) => {
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
function dataBoxItemAddTag(databoxId: number) {
  console.log('addtag', databoxId)
}
</script>

<template>
  <VContainer class="mc-data-container mc-data-shelf">
    <VRow no-gutters>
      <VCol class="">
        <!--
          <VToolbar
          no-gutters class="btn-box data-shelf-toolbar" :title="selectenode.title" height="40"
          dir="rtl"
          >
        -->
        <VRow no-gutters class="btn-box data-shelf-toolbar d-flex">
          <div class="d-flex">
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
            <VBtn icon size="small" variant="text" @click="">
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
          <div class="ms-auto">
            <span class="ma-2">{{ selectedNode.title }}</span>
          </div>
        </VRow>
        <!-- </VToolbar> -->
      </VCol>
    </VRow>
    <VRow dense class="mc-data-scroll">
      <VCol md="3">
        <div>
          <!--
            <MCFacetBox
            v-for="item in testfacetlist" :key="item.key"
            v-model:selected-items="selectedFacetItems[item.key]" searchable :dataitems="item.facetGroups"
            :facettitle="$t('tree.autorizedbook')" class="mb-2"
            />
          -->
        </div>
      </VCol>
      <VCol md="9">
        <div>
          <MCDataShelfBox
            v-for="(item, i) in resultdataItemsSort" :key="item.id" :ref="(el) => setdataboxref(el, item)" v-model="resultdataItemsSort[i]" :item-index="i"
            :prev-item-order="i > 0 ? resultdataItemsSort[i - 1].order : -100"
            :next-item-order="i < resultdataItemsSort.length - 1 ? resultdataItemsSort[i + 1].order : -100" @addtag="dataBoxItemAddTag"
            @selectedchanged="checkSelectAllState" @orderchanged="databoxOrderChanged"
          />
          <div v-show="!loadingdata" ref="loadmore" />
        </div>
      </VCol>
    </VRow>

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
.orderdisable{
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
