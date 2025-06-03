<script setup lang="ts">
import type { GridResultFacet } from '@/types/baseModels'
import { DataBoxType, MessageType, SizeType } from '@/types/baseModels'
import { type IDataShelfBoxNew } from '@/types/dataShelf'
import { HadithSearchResultItemModel } from '@/types/SearchResult'
import { DataShelfBoxModelNew } from '@/types/dataShelf'
import { getSelectedTextWithinElement } from '@/utils/htmlUtils'

import type { IHadithSearchResultItem, IHadithTranslateItem, ISearchResultItem } from '@/types/SearchResult'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })

// const { t } = useI18n({ useScope: 'global' })
const loadinglocal = ref(false)
const loadingMore = ref(false)
const showfulltext = ref(false)
const translatelist = reactive<IHadithTranslateItem[]>([])
const relatedhadith = reactive<IHadithSearchResultItem[]>([])
const relatedHadithPage = ref(1)
const relatedHadithPageSize = ref(5)
const relatedHadithTotalCount = ref(0)

// const { selectedNode } = useTree()
interface Props {
  dataitem: IHadithSearchResultItem
  isExpanded: boolean
  searchPhrase: string
}
interface Emit {
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'contentToNodeAdded', connectednodeid: number): void
  (e: 'dataitemchanged', value: IHadithSearchResultItem): void
  (e: 'oncontextmenuselect', mouseEvent: MouseEvent, contenttype: DataBoxType, boxdata: IDataShelfBoxNew): void
}
async function selectmorelessHadith() {
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
    const result = await $api <IHadithSearchResultItem>(`app/source/hadith/${props.dataitem.id}${(props.searchPhrase && props.searchPhrase.length > 1) ? `?searchPhrase=${props.searchPhrase}` : ''}`, {
      method: 'GET',
    })

    emit('dataitemchanged', result)
    showfulltext.value = true
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
    const result = await $api <IHadithTranslateItem[]>(`app/source/hadith/${props.dataitem.id}/translate`, {
      method: 'GET',
    })

    translatelist.push(...result)
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

const onContextMenu = (e: MouseEvent, contentType: DataBoxType, contentdata: IDataShelfBoxNew, htmlElement?: HTMLElement) => {
  // prevent the browser's default menu

  e.preventDefault()

  let selectedText = ''
  if (htmlElement)
    selectedText = getSelectedTextWithinElement(htmlElement)

  if (selectedText.length > 0)
    contentdata.content = selectedText

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
          {{ $t('translate') }}<span class="pr-1">({{ props.dataitem.translateCount.toString() }})</span>
        </VTab>
        <VTab :value="3" variant="elevated" rounded="sm">
          {{ $t('relatedhadith') }}<span class="pr-1">({{ props.dataitem.hadithRelatedCount.toString() }})</span>
        </VTab>
      </VTabs>
    </VRow>
    <div class="overflow-y-auto mb-2">
      <VTabsWindow v-model="dataTabValue">
        <VTabsWindowItem :value="3" :transition="false">
          <div v-if="relatedhadith.length > 0" class="d-flex flex-column position-relative">
            <div class="pl-2 py-2">
              <MCSearchResultBox
                v-for="(item) in relatedhadith"
                :key="item.id" nestedmode :box-type="DataBoxType.hadith" :expandable="false"
                :dataitem="item" :search-phrase="searchPhrase"
                @message-has-occured="(message, type) => $emit('messageHasOccured', message, type)" @oncontextmenuselect="onContextMenu" @dataitemhaschanged="relatedHadithItemChanged"
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
          <div v-for="(item) in translatelist" :key="item.id" class="mc-search-result">
            <div
              class="py-1 px-1" @contextmenu="(e) => {
                const textContainer = e.currentTarget.querySelector('.selectable-content') || e.currentTarget;
                onContextMenu(e, DataBoxType.text, new DataShelfBoxModelNew(0, 0, 0, item.text, '', [], [], '0'), textContainer)
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
        </VTabsWindowItem>
        <VTabsWindowItem :value="1" :transition="false">
          <div class="py-1 px-1">
            <VRow>
              <VCol>
                <div class="flex no-select">
                  <div v-if="props.dataitem.qaelList && props.dataitem.qaelList.length > 1">
                    <span class="searchDataBoxInfoTitle"> {{ $t('qael') }}: </span><span class="searchDataBoxInfoText">{{ props.dataitem.qaelTitleList }}</span>
                  </div>
                  <div>  <span class="searchDataBoxInfoTitle"> {{ $t('address') }}: </span><span class="searchDataBoxInfoText">{{ `${props.dataitem.bookTitle}, ${`${$t('volume')} ${props.dataitem.vol}`}, ${`${$t('pagenum')} ${props.dataitem.pageNum}`}` }} </span></div>
                </div>
              </VCol>
            </VRow>
            <!-- @contextmenu="onContextMenu($event, DataBoxType.hadith, new DataShelfBoxModelNew(0, 0, 0, props.dataitem.text, '', [], [], props.dataitem.id.toString()), ($event.currentTarget as HTMLElement))" -->
            <VRow
              no-gutters class="justify-start align-start hadithtext"

              @contextmenu="(e) => {
                const textContainer = e.currentTarget.querySelector('.selectable-content') || e.currentTarget;
                onContextMenu(e, DataBoxType.hadith, new DataShelfBoxModelNew(0, 0, 0, props.dataitem.text, '', [], [], props.dataitem.id.toString()), textContainer)
              }"
            >
              <VCol md="12">
                <div class="selectable-content" v-html="(props.dataitem.text.length > 1 && (showfulltext || props.isExpanded)) ? props.dataitem.text : ((props.dataitem.highLight && props.dataitem.highLight.length > 0) ? props.dataitem.highlightText : props.dataitem.shortText)" />
                <!-- test: {{ (props.dataitem.highLight) ? 'true' : 'false' }} -->
                <VBtn v-if="!props.isExpanded && !showfulltext && props.dataitem.hasShortText" class="no-select" style="font-size: large;" variant="text" :loading="loadingMore" @click="selectmorelessHadith">
                  {{ $t('more') }}
                </VBtn>
                <VBtn v-if="showfulltext && !props.isExpanded" class="no-select" style="font-size: large;" variant="text" :loading="loadingMore" @click="selectmorelessHadith">
                  {{ $t('less') }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </VTabsWindowItem>
      </VTabsWindow>
    </div>
  </div>
</template>
