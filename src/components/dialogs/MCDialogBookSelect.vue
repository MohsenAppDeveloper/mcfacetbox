<script lang="ts" setup>
import { isUndefined } from '@sindresorhus/is'
import type { IBookSearchResult, ISelectableBookInfo } from '@/types/book'
import { BookSearchRequestModel, SelectableBookInfo } from '@/types/book'
import type { IFacetBox, IFacetItem } from '@/types/SearchResult'
import { removeHtmlTags } from '@/utils/htmlUtils'
import { MessageType } from '@/types/baseModels'
import type { IRootServiceError, ISimpleDTO } from '@/types/baseModels'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
  apiUrl: String,
  treeid: Number,
  userId: String,
})

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const resultbookItems = ref<IBookSearchResult>()
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'setBookPermissionHasOccured', value: number): void
  (e: 'handlemessage', message: string, type: MessageType): void

}

const selectedFacetItems = reactive<Record<string, string[]>>({})
const searchbooktitle = ref('')
const selectedBooks = ref<Record<number, ISelectableBookInfo>>({})
const resultStateMessage = ref('')
const bookSearchModel = reactive<BookSearchRequestModel>(new BookSearchRequestModel())
const loading = shallowRef(false)

const resetBookSearchModel = () => {
  // Reset all predefined properties
  bookSearchModel.language = 'fa'
  bookSearchModel.page_size = 20
  bookSearchModel.page_number = 1
  bookSearchModel.sort = 'title-asc'
  bookSearchModel.origin = 'noorlib.web.app'
  bookSearchModel.query = ''
  bookSearchModel['sp.special_ids'] = 399
  bookSearchModel['sp.display_type'] = 'tiles'

  // Clear dynamic properties
  for (const key in bookSearchModel) {
    // Check if it's a property added to the instance
    if (!['language', 'page_size', 'page_number', 'sort', 'origin', 'query', 'sp.special_ids', 'sp.display_type'].includes(key))
      delete bookSearchModel[key]
  }
}

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useFetch(createUrl('https://noorlib.ir/presentation/api/v2/library/getLibraryBookList', {
  query: bookSearchModel,
}), {
  immediate: false, refetch: false,
}).json()

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

onFetchResponse(() => {
  try {
    //   response.json().then(value => {
    resultbookItems.value = { facetList: [], pageNumber: 0, pageSize: 0, resultList: [], resultListTotalCount: 0 }

    const result = resultData.value.data as IBookSearchResult

    resultbookItems.value = { facetList: result.facetList, pageNumber: result.pageNumber, pageSize: result.pageSize, resultList: result.resultList, resultListTotalCount: result.resultListTotalCount }

    // setTimeout(() => {
    //   resultbookItems.value = resultData.value
    if ((resultbookItems.value?.resultList.length ?? 0) === 0) {
      emit('handlemessage', t('alert.resultNotFound'), MessageType.error)
    }
    else {
      resultbookItems.value?.resultList.forEach(resultitem => {
        if (selectedBooks.value[resultitem.bookId])
          resultitem.selected = true
      })
    }
  }
  catch (error) {
    emit('handlemessage', t('alert.probleminLoadInformation'), MessageType.error)
  }

  // }, 1000)

  // console.log('resultbookitems', resultbookItems.value)
//   })
})

onFetchError(() => {
  try {
    const result = resultData.value as IRootServiceError
    if (result && result.error && result.error.message)
      emit('handlemessage', result.error.message, MessageType.error)
    else
      emit('handlemessage', t('alert.probleminGetInformation'), MessageType.error)
  }
  catch (customerror) {
    emit('handlemessage', t('alert.probleminLoadInformation'), MessageType.error)
  }
})

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
  bookSearchModel.query = ''
  searchbooktitle.value = ''
  resultbookItems.value = { facetList: [], pageNumber: 0, pageSize: 0, resultList: [], resultListTotalCount: 0 }
  for (const key in selectedFacetItems) {
    // Check if it's a property added to the instance
    delete selectedFacetItems[key]
  }

  //   selectedBooks.value = {}
  resetBookSearchModel()
}

const searchinBook = async () => {
  if (searchbooktitle.value.length < 2)
    return
  bookSearchModel.query = searchbooktitle.value
  await fetchData(false)
}

const prevPage = async () => {
  if (bookSearchModel.page_number > 1)
    bookSearchModel.page_number -= 1
  await searchinBook()
}

const nextPage = async () => {
  if (bookSearchModel.page_number < totalPageNumber.value)
    bookSearchModel.page_number += 1
  await searchinBook()
}

// watch(bookSearchModel, async () => {
//   resultStateMessage.value = ''
//   if (bookSearchModel.query.length >= 2)
//     await fetchData(false)
// })
watch(selectedFacetItems, async newval => {
  const result = Object.keys(newval).map(key => ({
    titleKey: key,
    items: newval[key],
  }))

  result.forEach(item => {
    bookSearchModel[item.titleKey] = item.items
  })

  if (!loadingdata.value)
    await searchinBook()
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

const selectBook = (item: ISelectableBookInfo) => {
  item.selected = !(item.selected ?? false)
  if (item.selected)
    selectedBooks.value[item.bookId] = item
  else
    delete selectedBooks.value[item.bookId]
}

const saveBookPermission = async () => {
  loading.value = true
  try {
    await $api(`app/tree/${props.treeid}/user/${props.userId}/book`, {
      method: 'PUT',
      body: Object.values(selectedBooks.value).map(item => ({ id: item.bookId, title: item.title })),
    })
    emit('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
    emit('setBookPermissionHasOccured', props.treeid ?? 0)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('handlemessage', error.message, MessageType.error)
    else emit('handlemessage', t('httpstatuscodes.0'), MessageType.error)
  }
  finally {
    loading.value = false
  }
}

const getBookPermission = async () => {
  loading.value = true
  try {
    const result = await $api<ISimpleDTO<number>[]>(`app/tree/${props.treeid}/user/${props.userId}/book`, {
      method: 'GET',
    })

    if (result.length > 0) {
      result.forEach(resultItem => {
        selectedBooks.value[resultItem.id] = new SelectableBookInfo(resultItem.id, resultItem.title, true)
      })
    }
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('handlemessage', error.message, MessageType.error)
    else emit('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    emit('update:isDialogVisible', false)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getBookPermission()
})

const formattedField = (list: Record<string, any>[], fieldName: string) => {
  if (list?.length > 0)
    return list.filter(element => element[fieldName] !== '').map(element => element[fieldName]).join(',')
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    class="mc-dialog-bookselect" persistent :scrollable="false" @update:model-value="onReset(true)"
  >
    <DialogCloseBtn :disabled="loadingdata" @click="onReset(true)" />
    <VCard flat :title="$t('book.select')" :subtitle="$t('book.selectedbooks')" class="pa-2" :height="700" :loading="loading || loadingdata">
      <div class="d-flex flex-column justify-space-between" style="height: 90%;">
        <!--
          <div v-if="loadingdata" class="loading-container">
          <VProgressCircular size="20" width="2" indeterminate />
          </div>
        -->
        <div class="d-flex flex-column">
          <div class="pa-2">
            <VChip
              v-for="(item, i) in selectedBooks" :key="i"
              class="mr-1 mb-1"
              closable
              @click:close="selectBook(item)"
            >
              {{ removeHtmlTags(item.title) }}
            </VChip>
          </div>
          <div style="justify-items: center;">
            <VTextField
              v-model:model-value="searchbooktitle"
              class="pb-1"
              :width="400"
              :placeholder="$t('search')" clearable
              density="compact" @keyup.enter="searchinBook" @click:clear="onReset(false)"
            >
              <template #append-inner>
                <VBtn icon size="small" variant="text" @click="searchinBook">
                  <VIcon icon="tabler-search" size="22" />
                </VBtn>
              </template>
            </VTextField>
          </div>
        </div>
        <div class="d-flex flex-row overflow-hidden" style="height:80%">
          <div v-show="(resultbookItems?.facetList.length ?? 0 > 0) && !loadingdata" class="mc-data-scrolly-float flex-shrink-1" style="width:35%;--block-size-offset: 4px">
            <MCFacetBox
              v-for="item in resultbookItems?.facetList"
              :key="item.key"
              v-model:selected-items="selectedFacetItems[item.key]" :istree="isTree(item)"
              :scroll-item-count="item.scrollSize" :searchable="item.hasSearchBox" :dataitems="item.itemList"
              :facettitle="item.title" class="mb-2 w-100"
            />
          </div>
          <div class="flex-grow-1 mc-data-scrolly-float" style="width:65%;--block-size-offset: 4px">
            <VDataIterator
              :items="resultbookItems?.resultList" :loading="loadingdata"
              :page="resultbookItems?.pageNumber" :items-per-page="resultbookItems?.pageSize"
            >
              <template #default="{ items }">
                <VCard v-for="(item, i) in items" :key="i" class="book-item">
                  <VRow dense>
                    <VCol cols="auto">
                      <VImg
                        :width="90" assspect-ratio="4/3" cover lazy
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
                              {{ $t('book.creator') }} : {{
                                formattedField(item.raw.creatorList, 'name') }}
                            </p>
                            <p v-if="formattedField(item.raw.publisherList, 'place')">
                              {{ $t('book.publisher') }} : {{
                                formattedField(item.raw.publisherList, 'place') }}
                            </p>
                          </div>
                          <div>
                            <p v-if="formattedField(item.raw.languageList, 'name')">
                              {{ $t('book.language') }} : {{
                                formattedField(item.raw.languageList, 'name') }}
                            </p>
                            <p v-if="formattedField(item.raw.publishYearList, 'year')">
                              {{ $t('book.publishYear') }} : {{
                                formattedField(item.raw.publishYearList, 'year') }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </VCol>
                  </vrow>
                </VCard>
              </template>
              <template #footer="">
                <VFooter>
                  <div v-show="resultbookItems?.resultListTotalCount ?? 0 > 0" class="d-flex align-center justify-center pa-4 w-100">
                    <div class="d-flex align-center">
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
          </div>
        </div>

        <div class="flex-grow-0">
          <VBtn class="ma-3" variant="flat" :disabled="loading" @click="saveBookPermission">
            <span>
              {{ $t('accept') }}
            </span>
          </VBtn>
        </div>
      </div>
    </VCard>
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>

<style>
.mc-data-scrolly {
    block-size: calc(100% - 40px);
    margin-block-start: 1.5px;
    overflow-y: scroll;
    overflow-x: auto;
}
.v-card--density-default {
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
