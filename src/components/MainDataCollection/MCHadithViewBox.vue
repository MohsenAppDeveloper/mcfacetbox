<script setup lang="ts">
import type { MessageType } from '@/types/baseModels'
import type { IHadithSearchResultItem } from '@/types/SearchResult'

const props = defineProps<Props>()

// const emit = defineEmits<Emit>()
// const { t } = useI18n({ useScope: 'global' })
const loadinglocal = ref(false)

// const { selectedNode } = useTree()
interface Props {
  dataitem: IHadithSearchResultItem
  isExpanded: boolean
}
interface Emit {
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'contentToNodeAdded', connectednodeid: number): void
}

// const props = defineProps<>({
//   dataitems: {
//     type: SearchResultTabBoxModel,
//     required: true,
//     validator: value => {
//       return value instanceof SearchResultTabBoxModel // Ensure the instance is correct
//     },
//   },
// })
const dataTabValue = ref(1)

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
          {{ $t('translate') }}
        </VTab>
        <VTab :value="3" variant="elevated" rounded="sm">
          {{ $t('relatedhadith') }}
        </VTab>
      </VTabs>
    </VRow>
    <div class="overflow-y-auto mb-2">
      <VTabsWindow v-model="dataTabValue">
        <VTabsWindowItem :value="3" :transition="false">
          <VCardText />
        </VTabsWindowItem>

        <VTabsWindowItem :value="2" :transition="false">
          <VCardText />
        </VTabsWindowItem>
        <VTabsWindowItem :value="1" :transition="false">
          <div class="py-1 px-1">
            <VRow>
              <VCol>
                <div class="flex">
                  <div v-if="props.dataitem.qaelList.length > 1">
                    <span class="searchDataBoxInfoTitle"> {{ $t('qael') }}: </span><span class="searchDataBoxInfoText">{{ props.dataitem.qaelTitleList }}</span>
                  </div>
                  <div>  <span class="searchDataBoxInfoTitle"> {{ $t('address') }}: </span><span class="searchDataBoxInfoText">{{ `${props.dataitem.bookTitle}, ${`${$t('volume')} ${props.dataitem.vol}`}, ${`${$t('pagenum')} ${props.dataitem.pageNum}`}` }} </span></div>
                </div>
              </VCol>
            </VRow>
            <VRow no-gutters class="justify-start align-start">
              <VCol md="12">
                <div v-if="props.dataitem" class="hadithtext" v-html="props.dataitem.highlightText" />
              </VCol>
            </VRow>
          </div>
        </VTabsWindowItem>
      </VTabsWindow>
    </div>
    <!--
      <VCardText style="height: auto;">
      <VRow>
      <VCol>
      <div class="flex">
      <div v-if="props.dataitem.qaelList.length > 1">
      <span class="searchDataBoxInfoTitle"> {{ $t('qael') }}: </span><span class="searchDataBoxInfoText">{{ props.dataitem.qaelTitleList }}</span>
      </div>
      <div>  <span class="searchDataBoxInfoTitle"> {{ $t('address') }}: </span><span class="searchDataBoxInfoText">{{ `${props.dataitem.bookTitle}, ${`${$t('volume')} ${props.dataitem.vol}`}, ${`${$t('pagenum')} ${props.dataitem.pageNum}`}` }} </span></div>
      </div>
      </VCol>
      </VRow>
      <VRow no-gutters class="justify-start align-start">
      <VCol md="12">
      <div v-if="props.dataitem" class="hadithtext" v-html="props.dataitem.highlightText" />
      </VCol>
      </VRow>
      </VCardText>
    -->

    <!-- </VCard> -->
  </div>
</template>
