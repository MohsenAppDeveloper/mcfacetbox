<script lang="ts" setup>
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پروژه میباشد
import type { IBookSearchResult } from '@/types/book'
import { BookSearchRequestModel } from '@/types/book'
import type { IProject } from '@/types/project'
import { ProjectModel } from '@/types/project'
import type { IFacetBox, IFacetItem } from '@/types/SearchResult'
import { useToast } from 'vue-toastification'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
  apiUrl: String,
})

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const resultbookItems = ref<IBookSearchResult>()
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'projectDataAdded', value: number): void
  (e: 'projectDataUpdated', value: number): void

}

const isloading = ref(false)
const projectData = reactive<IProject>(new ProjectModel())
const selectedFacetItems = reactive<Record<string, string[]>>({})
const searchbooktitle = ref('')
const selectedBooks = ref<number[]>([])
const resultStateMessage = ref('')
const bookSearchModel = reactive<BookSearchRequestModel>(new BookSearchRequestModel())

const { execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useFetch(createUrl('https://noorlib.ir/presentation/api/v2/library/getLibraryBookList', {
  query: bookSearchModel,
}), {
  immediate: false,
  refetch: true,
}).get()

const totalPageNumber = computed(() => {
  return ((((resultbookItems.value?.resultListTotalCount ?? 0) / (resultbookItems.value?.pageSize ?? 0)) | 0) + (((resultbookItems.value?.resultListTotalCount ?? 0) % (resultbookItems.value?.pageSize ?? 0)) > 0 ? 1 : 0))
})

// const { execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useMyFetch(createUrl('https://noorlib.ir/presentation/api/v2/library/getLibraryBookList'), {
//   immediate: false,
//   async beforeFetch({ url, options, cancel }) {
//     // console.log('url', url)
//     // console.log('body', options.body)
//     // console.log('header', options.headers)
//     options.headers = { ...options.headers, 'Content-Type': 'application/json' }
//     options.body = JSON.stringify(searchModel)

//     // console.log('bodyafter', options.body)
//     // console.log('headerafter', options.headers)

//     return { options }
//   },
// }).post()

onFetchResponse(response => {
  response.json().then(value => {
    resultbookItems.value = value.data
    if ((resultbookItems.value?.resultList.length ?? 0) === 0)
      resultStateMessage.value = t('resultNotFound')

    console.log('resultbookitems', resultbookItems.value)
  })
})

onFetchError(() => {
  resultStateMessage.value = t('dataActionFailed')
})

const onReset = () => {
  emit('update:isDialogVisible', false)
  searchbooktitle.value = ''
  resultbookItems.value = { facetList: [], pageNumber: 0, pageSize: 0, resultList: [], resultListTotalCount: 0 }

//   bookSearchModel.query = ''
//   bookSearchModel.page_number = 1
}

const prevPage = async () => {
  if (bookSearchModel.page_number > 1)
    bookSearchModel.page_number -= 1

  // await fetchData(false)
}

const nextPage = async () => {
  if (bookSearchModel.page_number < totalPageNumber.value)
    bookSearchModel.page_number += 1

  // await fetchData(false)
}

watch(bookSearchModel, () => {
  resultStateMessage.value = ''
})

const isTree = (items: IFacetBox) => {
  const map = new Map<string, IFacetItem>()

  // ایجاد یک مپ با کلید facetKey و مقدار آیتم
  items.itemList.forEach(item => {
    map.set(item.facetKey, item)
  })

  // بررسی هر آیتم برای یافتن پدر خود
  for (const item of items.itemList) {
    if (item.parent) {
      const parentItem = map.get(item.parent)
      if (parentItem?.facetKey === item.facetKey)
        return true

      // اگر پدر موجود نباشد، یا parent خود item برابر با facetKey خودش باشد (نداشتن پدر حقیقی)
      if (parentItem)
        return true
    }
  }

  return false
}

const searchinBook = async () => {
  if(searchbooktitle.value.length>2){
    bookSearchModel.query = searchbooktitle.value
  }
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <DialogCloseBtn :disabled="loadingdata" @click="onReset" />
    <VCard flat :title="$t('book.select')" :subtitle="$t('book.selectrequiredbook')">
      <VCardText>
        <!--
          <div v-if="loadingdata" class="loading-container">
          <VProgressCircular size="20" width="2" indeterminate />
          </div>
        -->
        <VRow>
          <VCol md="4">
            <MCFacetBox
              v-for="item in resultbookItems?.facetList" :key="item.facetboxKey" v-model:selected-items="selectedFacetItems[item.facetboxKey]" :istree="isTree(item)"
              :scroll-item-count="item.scrollSize" :searchable="item.hasSearchBox"
              :dataitems="item.itemList" :facettitle="item.title" class="mb-2"
            />
          </VCol>
          <VCol md="8">
            <VRow>
              <VCol md="12">
                <VTextField
                  v-model:model-value="searchbooktitle" :placeholder="$t('search')"
                  clearable density="compact" @keyup.enter="searchinBook"  
                >
                  <template #append-inner>
                    <VBtn icon size="small" variant="text" @click="searchinBook">
                      <VIcon icon="tabler-search" size="22" />
                    </VBtn>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
            <VRow>
              <VCol md="12">
                <VDataIterator
                  :items="resultbookItems?.resultList" :loading="loadingdata" :page="resultbookItems?.pageNumber" :items-per-page="resultbookItems?.pageSize"
                  class="w-100"
                >
                  <template #default="{ items }">
                    <VRow v-for="(item, i) in items" :key="i">
                      <VCol :md="4">
                        <VImg
                          :width="100"
                          assspect-ratio="4/3"
                          cover
                          :src="`https://noorlib.ir${item.raw.thumbnailUrl}`"
                        />
                      </VCol>
                      <VCol :md="8">
                        <div>
                          <div>
                            <span>{{ item.raw.title }}</span>
                            <div>
                              <p>نویسنده : {{ item.raw.creatorList?.map(element => element.name).join(',') }}</p> <p>ناشر : {{ item.raw.publisherList?.map(element => element.place).join(',') }}</p>
                            </div>
                            <div>
                              <p>زبان : {{ item.raw.languageList?.map(element => element.name).join(',') }}</p> <p>سال نشر : {{ item.raw.publishYearList?.map(element => element.year).join(',') }}</p>
                            </div>
                          </div>
                          <VCheckbox v-model="item.raw.selected" density="compact" />
                        </div>
                      </VCol>
                    </VRow>
                  </template>
                  <template #footer="">
                    <VFooter>
                      <div class="d-flex align-center justify-center pa-4">
                        <VBtn
                          :disabled="resultbookItems?.pageNumber == 1"
                          density="comfortable"
                          icon="mdi-arrow-left"
                          variant="tonal"
                          rounded
                          @click="prevPage"
                        />

                        <div class="mx-2 text-caption">
                          {{ $t('$vuetify.pagination.ariaLabel.page') }} {{ resultbookItems?.pageNumber }} {{ $t('of') }} {{ totalPageNumber }}
                        </div>

                        <VBtn
                          :disabled="resultbookItems?.pageNumber >= totalPageNumber"
                          density="comfortable"
                          icon="mdi-arrow-right"
                          variant="tonal"
                          rounded
                          @click="nextPage"
                        />
                      </div>
                    </VFooter>
                  </template>
                  <template #loader>
                    <VRow
                      v-for="(_, k) in [0, 1, 2, 3]"
                      :key="k"
                    >
                      <VCol cols="12">
                        <VSkeletonLoader
                          class="border"
                          type="image,article"
                        />
                      </VCol>
                    </VRow>
                  </template>
                </VDataIterator>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>
