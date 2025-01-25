<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { isUndefined } from '@sindresorhus/is'
import { useSelectedNode } from '@/store/treeStore'
import type { GridResult } from '@/types/baseModels'
import type { IDataShelfBox } from '@/types/dataShelf'

const itemsPerPage = ref(16)
const page = ref(1)
const totalItems = ref(0)
const sortBy = ref()
const orderBy = ref()
const searchQuery = ref('')
const resultdataItems = ref<IDataShelfBox[]>([])
const { t } = useI18n({ useScope: 'global' })

const toast = useToast()

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi<GridResult<IDataShelfBox>>(createUrl('/apps/dataShelf', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}), { immediate: false })

setTimeout(async () => {

}, 1000)

const loadmore = ref(null)
const selectedFacetItems = reactive<Record<string, number[]>>({})

// const testfacetlist = ref<IFacetResult[]>([{ key: 'book', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }, { key: 'book1', facetGroups: [{ id: 1, text: 'پژوهشگر' }, { id: 2, text: 'مدیر کل' }, { id: 3, text: 'ناظر' }, { id: 4, text: 'ارزیاب یک' }, { id: 5, text: 'ارزیاب دو' }] }])

const selectenode = useSelectedNode()

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

function resetData() {
  resultdataItems.value.splice(0)
}
watch(selectenode.simpleTreeModelStored, async newval => {
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
      toast.error(t('probleminGetInformation'))
    if ((resultData.value?.items.length ?? 0) <= 0)
      toast.info(t('resultNotFound'))
  })
})
onFetchError(() => {
  toast.error(t('alert.dataActionFailed'))
})
function dataBoxItemAddTag(databoxId: number) {
  console.log('addtag', databoxId)
}

function getInfoSearch() { }
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
          <div>
            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-select-all" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.selectall') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-search" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.search') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-filter" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.filter') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-list-tree" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.treemode') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-trash-x" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.deleteselecteditem') }}
              </VTooltip>
            </VBtn>

            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-filters" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.allnode') }}
              </VTooltip>
            </VBtn>

            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-pencil-plus" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.add') }}
              </VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="tonal" @click="">
              <VIcon icon="tabler-list-details" size="22" />
              <VTooltip
                activator="parent"
                location="top center"
              >
                {{ $t('datashelfbox.listdetail') }}
              </VTooltip>
            </VBtn>
          </div>
          <div class="ms-auto">
            <span class="ma-2">{{ selectenode.simpleTreeModelStored.title }}</span>
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
          <MCDataShelfBox v-for="(item, i) in resultdataItems" :key="item.id" v-model="resultdataItems[i]" @addtag="dataBoxItemAddTag" />
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
</style>
