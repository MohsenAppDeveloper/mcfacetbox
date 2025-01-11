<script lang="ts" setup>
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پروژه میباشد
import type { IBookSearchResult, ISelectableBookInfo } from '@/types/book'
import { BookSearchRequestModel } from '@/types/book'
import type { IFacetBox, IFacetItem } from '@/types/SearchResult'
import { isUndefined } from '@sindresorhus/is'
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
  (e: 'selectedBookChanged', value: number): void

}

const selectedFacetItems = reactive<Record<string, string[]>>({})
const searchbooktitle = ref('')
const selectedBooks = ref<number[]>([])
const resultStateMessage = ref('')
const bookSearchModel = reactive<BookSearchRequestModel>(new BookSearchRequestModel())

const resetBookSearchModel = () => {
  // Reset all predefined properties
  bookSearchModel.language = 'fa'
  bookSearchModel.page_size = 20
  bookSearchModel.page_number = 1
  bookSearchModel.sort = 'title-asc'
  bookSearchModel.origin = 'noorlib.web.app'
  bookSearchModel.query = ''

  // Clear dynamic properties
  for (const key in bookSearchModel) {
    // Check if it's a property added to the instance
    if (!['language', 'page_size', 'page_number', 'sort', 'origin', 'query'].includes(key))
      delete bookSearchModel[key]
  }
}

const { execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useFetch(createUrl('https://noorlib.ir/presentation/api/v2/library/getLibraryBookList', {
  query: bookSearchModel,
}), {
  immediate: false,
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
    resultbookItems.value = { facetList: [], pageNumber: 0, pageSize: 0, resultList: [], resultListTotalCount: 0 }

    // setTimeout(() => {
    resultbookItems.value = value.data
    if ((resultbookItems.value?.resultList.length ?? 0) === 0) {
      toast.error(t('alert.resultNotFound'))
    }
    else {
      resultbookItems.value?.resultList.forEach(resultitem => {
        if (selectedBooks.value.includes(resultitem.bookId))
          resultitem.selected = true
      })
    }

    // }, 1000)

    // console.log('resultbookitems', resultbookItems.value)
  })
})

onFetchError(() => {
  toast.error(t('alert.dataActionFailed'))
})

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  bookSearchModel.query = ''
  searchbooktitle.value = ''
  resultbookItems.value = { facetList: [], pageNumber: 0, pageSize: 0, resultList: [], resultListTotalCount: 0 }
  selectedBooks.value.splice(0)
  resetBookSearchModel()
}

const prevPage = async () => {
  if (bookSearchModel.page_number > 1)
    bookSearchModel.page_number -= 1
}

const nextPage = async () => {
  if (bookSearchModel.page_number < totalPageNumber.value)
    bookSearchModel.page_number += 1

  // await fetchData(false)
}

watch(bookSearchModel, () => {
  resultStateMessage.value = ''
  if (bookSearchModel.query.length >= 2)
    fetchData(false)
})
watch(selectedFacetItems, newval => {
  const result = Object.keys(newval).map(key => ({
    titleKey: key,
    items: newval[key],
  }))

  result.forEach(item => {
    bookSearchModel[item.titleKey] = item.items
  })
  console.log('result', bookSearchModel)
})

const isTree = (items: IFacetBox) => {
  const map = new Map<string, IFacetItem>()

  // ایجاد یک مپ با کلید facetKey و مقدار آیتم
  items.itemList.forEach(item => {
    map.set(item.key, item)
  })

  // بررسی هر آیتم برای یافتن پدر خود
  for (const item of items.itemList) {
    if (item.parent) {
      const parentItem = map.get(item.parent.toString())
      if (parentItem?.key === item.key)
        return true

      // اگر پدر موجود نباشد، یا parent خود item برابر با facetKey خودش باشد (نداشتن پدر حقیقی)
      if (parentItem)
        return true
    }
  }

  return false
}

const searchinBook = async () => {
  bookSearchModel.query = searchbooktitle.value
}

const selectBook = (item: ISelectableBookInfo) => {
  item.selected = !(item.selected ?? false)
  if (item.selected)
    selectedBooks.value.push(item.bookId)
  else
    selectedBooks.value.splice(selectedBooks.value.indexOf(item.bookId), 1)
  console.log('selectbook', selectedBooks.value)
}

const formattedField = (list: Record<string, any>[], fieldName: string) => {
  if (list?.length > 0)
    return list.filter(element => element[fieldName] !== '').map(element => element[fieldName]).join(',')
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    class="mc-dialog-bookselect" persistent @update:model-value="onReset(true)"
  >
    <DialogCloseBtn :disabled="loadingdata" @click="onReset(true)" />
    <VCard flat :title="$t('book.select')" :subtitle="$t('book.selectrequiredbook')">
      <VCardText>
        <!--
          <div v-if="loadingdata" class="loading-container">
          <VProgressCircular size="20" width="2" indeterminate />
          </div>
        -->
        <VRow dense>
          <VCol md="4">
            <MCFacetBox
              v-for="item in resultbookItems?.facetList"
              v-show="!loadingdata" :key="item.key"
              v-model:selected-items="selectedFacetItems[item.key]" :istree="isTree(item)"
              :scroll-item-count="item.scrollSize" :searchable="item.hasSearchBox" :dataitems="item.itemList"
              :facettitle="item.title" class="mb-2"
            />
          </VCol>
          <VCol md="8">
            <VRow>
              <VCol md="12">
                <VTextField
                  v-model:model-value="searchbooktitle" :placeholder="$t('search')" clearable
                  density="compact" @keyup.enter="searchinBook" @click:clear="onReset(false)"
                >
                  <template #append-inner>
                    <VBtn icon size="small" variant="text" @click="searchinBook">
                      <VIcon icon="tabler-search" size="22" />
                    </VBtn>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
            <VRow dense>
              <VCol md="12">
                <VDataIterator
                  :items="resultbookItems?.resultList" :loading="loadingdata"
                  :page="resultbookItems?.pageNumber" :items-per-page="resultbookItems?.pageSize" class="w-100"
                >
                  <template #default="{ items }">
                    <VCard v-for="(item, i) in items" :key="i" class="book-item">
                      <VRow dense>
                        <VCol cols="auto">
                          <VImg
                            :width="90" assspect-ratio="4/3" cover
                            :src="`https://noorlib.ir${item.raw.thumbnailUrl}`"
                          />
                        </VCol>
                        <VCol align-self="center">
                          <div>
                            <div>
                              <VRow no-gutters>
                                <VCol>
                                  <span class="book-title" v-html="item.raw.title" />
                                </VCol>
                                <VCol cols="auto" class="check-box">
                                  <VBtn
                                    icon size="small" variant="tonal"
                                    @click="selectBook(item.raw)"
                                  >
                                    <VCheckbox v-model="item.raw.selected" density="compact" />
                                  </VBtn>
                                </VCol>
                              </VRow>

                              <div>
                                <p v-if="formattedField(item.raw.creatorList, 'name')">
                                  نویسنده : {{
                                    formattedField(item.raw.creatorList, 'name') }}
                                </p>
                                <p v-if="formattedField(item.raw.publisherList, 'title')">
                                  ناشر : {{
                                    formattedField(item.raw.publisherList, 'title') }}
                                </p>
                              </div>
                              <div>
                                <!--
                                  <p v-if="formattedField(item.raw.languageList, 'name')">
                                  زبان : {{
                                  formattedField(item.raw.languageList, 'name') }}
                                  </p>
                                -->
                                <p v-if="formattedField(item.raw.publishYearList, 'year')">
                                  سال نشر : {{
                                    formattedField(item.raw.publishYearList, 'year') }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </VCol>
                      </VRow>
                    </VCard>
                  </template>
                  <template #footer="">
                    <VFooter>
                      <div class="d-flex align-center justify-center pa-4">
                        <div>
                          <VBtn type="" class="me-3">
                            <span >
                              {{ $t('accept') }}
                            </span>
                          </VBtn>
                        </div>
                        <div>
                          <VBtn
                            :disabled="isUndefined(resultbookItems?.pageNumber) || resultbookItems?.pageNumber <= 1" density="comfortable" icon="tabler-arrow-right"
                            variant="tonal" rounded @click="prevPage"
                          />

                          <div class="mx-2 text-caption">
                            {{ $t('$vuetify.pagination.ariaLabel.page') }} {{ resultbookItems?.pageNumber }} {{ $t('of')
                            }} {{ totalPageNumber }}
                          </div>

                          <VBtn
                            :disabled="isUndefined(resultbookItems?.pageNumber) || resultbookItems?.pageNumber >= totalPageNumber" density="comfortable"
                            icon="tabler-arrow-left" variant="tonal" rounded @click="nextPage"
                          />
                        </div>
                      </div>
                    </VFooter>
                  </template>
                  <template #loader>
                    <VRow v-for="(_, k) in [0, 1, 2, 3]" :key="k">
                      <VCol cols="12">
                        <VSkeletonLoader class="border" type="image,article" />
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
