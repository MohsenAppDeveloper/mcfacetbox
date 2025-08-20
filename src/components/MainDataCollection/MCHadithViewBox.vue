<script setup lang="ts">
import type { GridResultFacet } from '@/types/baseModels'
import { DataBoxType, MessageType, SizeType } from '@/types/baseModels'
import type { IDataShelfBoxNew, IFootNote } from '@/types/dataShelf'
import type { IHadithSearchResultItem } from '@/types/hadithResult'
import { HadithSearchResultItemModel, HadithTranslateItemModel, IHadithTranslateItem } from '@/types/hadithResult'
import { DataShelfBoxModelNew } from '@/types/dataShelf'
import { createFootnoteTag, getSelectedTextWithinElement } from '@/utils/htmlUtils'
import type { ISearchResultItem } from '@/types/SearchResult'
import { NewUUID } from '@/utils/general'
import type { IReference } from '@/utils/refrenceUtils'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })

// const { t } = useI18n({ useScope: 'global' })
const loadinglocal = ref(false)
const loadingMore = ref(false)
const showfulltext = ref(false)
const translatelist = shallowReactive<HadithTranslateItemModel[]>([])
const relatedhadith = reactive<HadithSearchResultItemModel[]>([])
const relatedHadithPage = shallowRef(1)
const relatedHadithPageSize = shallowRef(10)
const relatedHadithTotalCount = shallowRef(0)

// const { selectedNode } = useTree()
interface Props {
  dataitem: HadithSearchResultItemModel
  isExpanded: boolean
  searchPhrase: string
  showTools: boolean
}
interface Emit {
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'contentToNodeAdded', connectednodeid: number): void
  (e: 'dataitemchanged', value: HadithSearchResultItemModel): void
  (e: 'oncontextmenuselect', mouseEvent: MouseEvent, contenttype: DataBoxType, boxdata: IDataShelfBoxNew): void
}
async function selectmorelessHadith() {
  console.log('showfulltext', showfulltext.value, props.dataitem.text.length, props.dataitem.highlightText, props.dataitem.shortText)
  console.log('text', showfulltext.value, props.dataitem.text)

  console.log('highlightText', props.dataitem.highlightText)

  console.log('shortText', props.dataitem.shortText)

  if (showfulltext.value) {
    showfulltext.value = false

    return
  }
  if (!showfulltext.value && props.dataitem.text.length > 1) {
    showfulltext.value = true

    return
  }
  loadingMore.value = true
  await loadcompletehadith()
  loadingMore.value = false
}
async function loadcompletehadith() {
  try {
    const result = await $api <HadithSearchResultItemModel>(`app/source/hadith/${props.dataitem.id}${(props.searchPhrase && props.searchPhrase.length > 1) ? `?searchPhrase=${props.searchPhrase}` : ''}`, {
      method: 'GET',
    })

    if (result.id) {
      emit('dataitemchanged', new HadithSearchResultItemModel(result.highLight, result.id, result.text, result.shortText, result.qaelTitleList, result.noorLibLink, result.qaelList,
        result.bookTitle, result.bookTitleShort, result.pageNum, result.sourceId, result.vol, result.translateCount, result.hadithRelatedCount,
      ))
      showfulltext.value = true
    }
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
}
async function loadtranslate() {
  loadinglocal.value = true
  try {
    const result = await $api <HadithTranslateItemModel[]>(`app/source/hadith/${props.dataitem.id}/translate`, {
      method: 'GET',
    })

    translatelist.push(...result.map(item => {
      return new HadithTranslateItemModel(item.highLight, useToNumber(item.id).value, item.text, item.shortText, item.hadithId, item.noorLibLink, item.sourceMainTitle, item.sourceShortTitle, item.authorTitle, item.authorId, item.vol, item.pageNum)
    }))
    loadinglocal.value = false
  }
  catch (error) {
    loadinglocal.value = false

    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
}
async function loadrelated() {
  loadinglocal.value = true
  try {
    const result = await $api <GridResultFacet<IHadithSearchResultItem>>(`app/source/hadith/${props.dataitem.id}/related?PageNumber=${relatedHadithPage.value}&PageSize=${relatedHadithPageSize.value}`, {
      method: 'GET',
    })

    relatedhadith.splice(0)

    relatedhadith.push(...result.items.map(item => {
      return new HadithSearchResultItemModel(item.highLight, item.id, item.text, item.shortText, item.qaelTitleList, item.noorLibLink, item.qaelList, item.bookTitle, item.bookTitleShort, item.pageNum, item.sourceId, item.vol)
    }))
    relatedHadithTotalCount.value = result.totalCount
    loadinglocal.value = false
  }
  catch (error) {
    loadinglocal.value = false

    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
}
const dataTabValue = ref(1)

onMounted(async () => {
  if (props.isExpanded) {
    loadinglocal.value = true
    await loadcompletehadith()
    loadinglocal.value = false
  }
})
watch(dataTabValue, async newval => {
  switch (newval) {
    case 2:
      if (translatelist.length < 1)
        loadtranslate()
      break;
    case 3:
      if (relatedhadith.length < 1)
        loadrelated()
    break;
    default:
      break;
  }
})
function openBoxLink(linkPath: string) {
  window.open(linkPath, '_blank')
}
watch(relatedHadithPage, () => {
  loadrelated()
},
)

const onContextMenu = (e: MouseEvent, contentType: DataBoxType, contentdata: IDataShelfBoxNew, refrenceString?: string, refrenceModel?: IReference, htmlElement?: HTMLElement) => {
  // prevent the browser's default menu

  e.preventDefault()
  let selectedText = ''
  if (htmlElement)
    selectedText = getSelectedTextWithinElement(htmlElement)

  if (selectedText.length > 0)
    contentdata.content = selectedText
  const uuid = NewUUID()

  const footnoteTemp: IFootNote = {
    id: uuid,
    isReference: true,
    title: refrenceString ?? '',
    reference: refrenceModel,
    order: 1,
  }

  // NOTE - اگر کاربر متن هایلایت شده را بعنوان فیش جدید انتخاب کرده باشد، محتوا خالی به سرور ارسال میشود تا سرور خودش متن کامل را جایگزین کند
  // NOTE - با توجه به اینکه پاورقی بصورت دستی اضافه میشود، اگر محتوا درای پاورقی باشد به سرور اطلاع میدهیم که متن کامل نیست و در سرور متن کامل بعلاوه محتوای پاورقی میشود
  if (contentdata.content.length <= 0)
    contentdata.isContentComplete = false

  contentdata.content += createFootnoteTag(uuid, '1')
  contentdata.footNotes.push(footnoteTemp)
  emit('oncontextmenuselect', e, contentType, contentdata)
}

function relatedHadithItemChanged(searchresultItem: ISearchResultItem) {
  const index = relatedhadith.findIndex(item => item.id === searchresultItem.id)
  if (index !== -1)
    relatedhadith[index].text = searchresultItem.text
}

// onMounted(() => {
//   loadinglocal.value = true
// })
</script>

<template>
  <div v-no-context-menu class="w-100 h-100 d-flex flex-column justify-start">
    <!-- <VCard variant="text"> -->
    <MCLoading v-if="loadinglocal" :showloading="loadinglocal" :loadingsize="SizeType.MD" />

    <VRow v-if="props.isExpanded" no-gutters dense class="align-center flex-0-0">
      <VTabs v-model="dataTabValue" density="comfortable" hide-slider>
        <VTab :value="1" variant="elevated" rounded="sm">
          {{ $t('hadith') }}
        </VTab>
        <VTab :value="2" variant="elevated" rounded="sm">
          {{ $t('translate') }}<span class="pr-1">({{ props.dataitem.translateCount ?? 0 }})</span>
        </VTab>
        <VTab :value="3" variant="elevated" rounded="sm">
          {{ $t('relatedhadith') }}<span class="pr-1">({{ props.dataitem.hadithRelatedCount ?? 0 }})</span>
        </VTab>
      </VTabs>
    </VRow>
    <div class="overflow-y-auto mb-2">
      <VTabsWindow v-model="dataTabValue">
        <VTabsWindowItem :value="3" :transition="false">
          <div v-if="relatedhadith.length > 0 && dataTabValue === 3" class="d-flex flex-column position-relative">
            <div class="pl-2 py-2">
              <MCSearchResultBox
                v-for="(item) in relatedhadith"
                :key="item.id" nestedmode :box-type="DataBoxType.hadith" :expandable="false"
                :dataitem="item" :search-phrase="searchPhrase"
                @message-has-occured="(message, type) => $emit('messageHasOccured', message, type)" @oncontextmenuselect="($event, contenttype, contentdata) => emit('oncontextmenuselect', $event, contenttype, contentdata)" @dataitemhaschanged="relatedHadithItemChanged"
              />
            </div>
            <div class="paging-container-fixed">
              <TablePagination
                v-model:page="relatedHadithPage"
                density="compact"
                :items-per-page="relatedHadithPageSize"
                :total-items="relatedHadithTotalCount"
              />
            </div>
          </div>
        </VTabsWindowItem>

        <VTabsWindowItem :value="2" :transition="false">
          <div v-if="dataTabValue === 2">
            <div v-for="(item) in translatelist" :key="item.id" class="mc-search-result">
              <div
                class="py-1 px-1" @contextmenu="(e) => {
                  const textContainer = e.currentTarget.querySelector('.selectable-content') || e.currentTarget;
                  onContextMenu(e, DataBoxType.text, new DataShelfBoxModelNew(0, 0, 0, item.text, '', [], [], '0'), item.refrenceAsString, item.refrenceAsModel, textContainer)
                }"
              >
                <VRow>
                  <VCol>
                    <div class="flex">
                      <div>
                        <span class="searchDataBoxInfoTitle no-select"> {{ $t('address') }}: </span><span class="searchDataBoxInfoText">{{ `${item.sourceMainTitle}, ${`${$t('volume')} ${item.vol}`}, ${`${$t('pagenum')} ${item.pageNum}`}` }} </span>
                        <VBtn icon size="22" variant="text" class="mx-2" @click="openBoxLink(item.noorLibLink)">
                          <VIcon icon="tabler-external-link" size="18" />
                        </VBtn>
                      </div>
                    </div>
                  </VCol>
                </VRow>
                <!-- @contextmenu="onContextMenu($event, DataBoxType.text, new DataShelfBoxModelNew(0, 0, 0, item.text, '', [], [], '0'), ($event.currentTarget as HTMLElement))" -->
                <VRow no-gutters class="justify-start align-start">
                  <VCol md="12">
                    <div class="selectable-content" v-html="item.text" />
                  </VCol>
                </VRow>
              </div>
            </div>
          </div>
        </VTabsWindowItem>
        <VTabsWindowItem :value="1" :transition="false">
          <div v-if="dataTabValue === 1" class="py-1 px-1">
            <VRow>
              <VCol>
                <div class="d-flex no-select">
                  <div v-if="props.dataitem.qaelList && props.dataitem.qaelList.length > 1" class="pl-2">
                    <span class="searchDataBoxInfoTitle"> {{ $t('qael') }}: </span><span class="searchDataBoxInfoText">{{ props.dataitem.qaelTitleList }}</span>
                  </div>
                  <div v-if="props.dataitem.bookTitle && props.dataitem.bookTitle.length > 1">
                    <span class="searchDataBoxInfoTitle"> {{ $t('address') }}: </span><span class="searchDataBoxInfoText">{{ `${props.dataitem.bookTitle}, ${`${$t('volume')} ${props.dataitem.vol}`}, ${`${$t('pagenum')} ${props.dataitem.pageNum}`}` }} </span>
                  </div>
                </div>
              </VCol>
            </VRow>
            <!-- @contextmenu="onContextMenu($event, DataBoxType.hadith, new DataShelfBoxModelNew(0, 0, 0, props.dataitem.text, '', [], [], props.dataitem.id.toString()), ($event.currentTarget as HTMLElement))" -->
            <VRow
              no-gutters class="d-flex justify-start align-start hadithtext"

              @contextmenu="(e) => {
                const textContainer = e.currentTarget.querySelector('.selectable-content') || e.currentTarget;
                onContextMenu(e, DataBoxType.hadith, new DataShelfBoxModelNew(0, 0, 0, props.dataitem.text, '', [], [], props.dataitem.id.toString()), props.dataitem.refrenceAsString, props.dataitem.refrenceAsModel, textContainer)
              }"
            >
              <VCol md="12" class="d-flex flex-column hadith-container">
                <div class="selectable-content" v-html="(props.dataitem.text.length > 1 && (showfulltext || props.isExpanded)) ? props.dataitem.text : ((props.dataitem.highLight && props.dataitem.highLight.length > 0) ? props.dataitem.highlightText : props.dataitem.shortText)" />
                <!-- test: {{ (props.dataitem.highLight) ? 'true' : 'false' }} -->
                <div class="button-container">
                  <VBtn v-if="!props.isExpanded && !showfulltext && props.dataitem.hasShortText" class="no-select h-100 action-btn" style="font-size: large;" variant="text" :loading="loadingMore" @click="selectmorelessHadith">
                    {{ $t('more') }}
                  </VBtn>
                  <VBtn v-if="showfulltext && !props.isExpanded" class="no-select action-btn" style="font-size: large;" variant="text" :loading="loadingMore" @click="selectmorelessHadith">
                    {{ $t('less') }}
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </div>
        </VTabsWindowItem>
      </VTabsWindow>
    </div>
  </div>
</template>
