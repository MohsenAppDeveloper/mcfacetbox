<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import HadithView from './MCHadithViewBox.vue'
import QuranView from './MCAyahViewBox.vue'
import VocabView from './MCVocabViewBox.vue'
import type { ISimpleTreeActionable } from '@/types/baseModels'
import { DataBoxType, MessageType, SizeType } from '@/types/baseModels'
import { DataShelfBoxModelNew } from '@/types/dataShelf'
import type { IDataShelfBoxNew } from '@/types/dataShelf'
import type { ISearchResultItem } from '@/types/SearchResult'

interface Props {
  dataitem: ISearchResultItem // در حالت واقعی بهتر است این از یک interface عمومی مثل ISearchResultItem باشد
  selectedTreeId?: number
  selectedNode?: ISimpleTreeActionable
  searchPhrase?: string
  boxType: DataBoxType
  isExpanded?: boolean
  expandable: boolean
  nestedmode?: boolean// در این حالت کامپوننت بعنوان فرزند خود در انواع حدیث یا ایه استفاده میشود و به همین علت یکسری اکشن های مورد نظر در ان غیر فعال است
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'maximizeSearchTabBox', selectedItem: any): void
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'contentToNodeAdded', connectednodeid: number): void
  (e: 'update:isExpanded', value: boolean): void
  (e: 'dataitemhaschanged', value: ISearchResultItem): void
  (e: 'oncontextmenuselect', mouseEvent: MouseEvent, contenttype: DataBoxType, boxdata: IDataShelfBoxNew, element: HTMLElement): void

}
>()

const showTools = ref(false)
const currentDataboxTypeToConnectToNode = ref(DataBoxType.text)
const currentContentToConnectToNode = reactive(new DataShelfBoxModelNew(0, props.selectedTreeId ?? 0, props.selectedNode?.id ?? 0, ''))
const { t } = useI18n({ useScope: 'global' })

const loadinglocal = ref(false)

const dialogSelectNodeVisible = ref(false)
async function addContentToNode(datashelfbox: IDataShelfBoxNew, duplicate: boolean) {
  loadinglocal.value = true

  try {
    await $api(`app/excerpt/${DataBoxType[currentDataboxTypeToConnectToNode.value]}`, {
      method: 'POST',
      body: JSON.stringify({ ignoreDuplicate: duplicate, ...datashelfbox }),
      ignoreResponseError: false,
    })

    emit('contentToNodeAdded', datashelfbox.nodeId)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0') {
      if (error.code === 'Encyclopedia.ErrorCode:010004') {
        const title = formatString(t('alert.contentisduplicate'), t(DataBoxType[currentDataboxTypeToConnectToNode.value]))

        await confirmSwal(
          title,
          '',
          t('$vuetify.confirmEdit.ok'),
          t('$vuetify.confirmEdit.cancel'),
          true, 'warning',
          async () => {
            await addContentToNode(datashelfbox, true)
          },
        )
      }
      else { emit('messageHasOccured', error.message, MessageType.error) }
    }
    else { emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error) }
  }
  loadinglocal.value = false
}

const componentName = computed(() => {
  switch (props.boxType) {
    case DataBoxType.hadith:
      return HadithView
    case DataBoxType.quran:
      return QuranView
    case DataBoxType.vocabulary:
      return VocabView
  }
})

const boxUrl = computed(() => {
  switch (props.boxType) {
    case DataBoxType.hadith:
      return createHadithURL(props.dataitem.id.toString())
    case DataBoxType.quran:
      return createAyahUrl(props.dataitem.id.toString().split('-')[0], props.dataitem.id.toString().split('-')[1])
    case DataBoxType.vocabulary:
      return ''
  }
})

function openContextMenu(e: MouseEvent, connectedboxType: DataBoxType, contentdata: IDataShelfBoxNew, element: HTMLElement) {
  if (props.nestedmode) {
    /**
     * اگر در حالت فرزند قرار داشته باشد، منوی راست کلیک باز نمیشود و مقادیر را به کامپوننت پدر ارسال میکند
     */
    emit('oncontextmenuselect', e, connectedboxType, contentdata, element)

    return
  }
  currentDataboxTypeToConnectToNode.value = connectedboxType
  contentdata.treeId = props.selectedTreeId ?? 0
  contentdata.nodeId = props.selectedNode?.id ?? 0

  //   { content: props.dataitem.text, description: '', labels: [], nodeId: props.selectedNode?.id ?? 0, treeId: 9, footNotes: [], id: 0, sourceId: props.dataitem.id.toString() }
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        disabled: !props.selectedNode || props.selectedNode.id <= 0,
        icon: h('i', {
          class: 'tabler-plug-connected icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        label: t('datagathering.connecttoselectednode'),
        onClick: () => {
          addContentToNode(contentdata, false)
        },
      },
      {
        label: t('datagathering.connecttocustomnode'),
        icon: h('i', {
          class: 'tabler-plug icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        onClick: () => {
        //   tempSelectedTabBoxItem.content = selectedItem.title
          currentContentToConnectToNode.sourceId = contentdata.sourceId
          currentContentToConnectToNode.content = contentdata.content
          dialogSelectNodeVisible.value = true
        },
      },
      {
        icon: h('i', {
          class: 'tabler-plug-off icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        label: t('datagathering.connecttotree'),
        onClick: () => {
          contentdata.nodeId = 0
          addContentToNode(contentdata, false)
        },
      },
      {
        label: t('datagathering.copy'),
        icon: h('i', {
          class: 'tabler-copy icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        onClick: () => {
        //   alert('You click a menu item')
        },
      },

    //   {
    //     label: 'A submenu',
    //     children: [
    //       { label: 'Item1' },
    //       { label: 'Item2' },
    //       { label: 'Item3' },
    //     ],
    //   },
    ],
  })
}

function openBoxLink() {
  window.open(boxUrl.value, '_blank')
}
</script>

<template>
  <VCard
    v-no-context-menu class="h-100 w-100 mc-search-result" :class="[
      { 'not-expanded': !isExpanded },
      boxType === DataBoxType.hadith ? 'hadith-card' : 'quran-card',
    ]" @mouseenter="showTools = true" @mouseleave="showTools = false"
  >
    <MCLoading v-if="loadinglocal" :showloading="loadinglocal" :loadingsize="SizeType.MD" />

    <MCDialogSelectNode
      v-if="dialogSelectNodeVisible" v-model:is-dialog-visible="dialogSelectNodeVisible"
      :selected-tree-id="props.selectedTreeId ?? 0" @nodehasbeenselected="(nodeid) => addContentToNode(new DataShelfBoxModelNew(0, props.selectedTreeId ?? 0, nodeid, currentContentToConnectToNode.content, '', [], [], currentContentToConnectToNode.sourceId), false)"
    />
    <!-- <VFadeTransition> -->
    <div v-if="showTools" class="result-box-actions-container">
      <VBtn icon size="22" variant="text" @click="openBoxLink">
        <VIcon icon="tabler-external-link" size="18" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('openlink') }}
        </VTooltip>
      </VBtn>
      <VBtn v-if="!props.isExpanded && props.expandable" icon size="22" variant="text" @click="$emit('maximizeSearchTabBox', props.dataitem)">
        <VIcon icon="tabler-maximize" size="18" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('showdetails') }}
        </VTooltip>
      </VBtn>
      <VBtn v-if="props.isExpanded && props.expandable" icon size="22" variant="text" @click="$emit('update:isExpanded', false)">
        <VIcon icon="tabler-x" size="18" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('$vuetify.close') }}
        </VTooltip>
      </VBtn>
    </div>
    <!-- </VFadeTransition> -->
    <VCardText style="height: 95%;" class="w-100 py-1 px-1">
      <component
        :is="componentName" :dataitem="props.dataitem" :is-expanded="props.isExpanded ?? false" :show-tools="showTools" :search-phrase="props.searchPhrase" @oncontextmenuselect="(event, contenttype, contentdata, element) => openContextMenu(event, contenttype, contentdata, element)"
        @dataitemchanged="(value) => $emit('dataitemhaschanged', value)"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.v-btn--disabled {
  opacity: 0.25;
}
/* انیمیشن گلوی مشترک */
@keyframes cardGlowHadith {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}
@keyframes cardGlowQuran {
  0% { box-shadow: 0 0 0 0 rgba(33, 150, 243,.4); }
   70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}
/* استایل‌های مشترک برای هر دو نوع کارت */
.mc-search-result {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  width: 100%;
  transition: all 0.4s ease;
}

/* استایل مخصوص کارت‌های حدیث (سبز) */
.mc-search-result.hadith-card {

  border-color: #c8e6c9; /* سبز روشن */

  &.not-expanded:hover {
    animation: cardGlowHadith 1.5s ease-out;
    border: 1px solid #4CAF50; /* سبز اصلی */
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .hadithtext {
    border-right: 3px solid #4CAF50; /* سبز اصلی */
    background-color: #f5faf5; /* سبز بسیار روشن */
  }
}

/* استایل مخصوص کارت‌های آیه (آبی) */
.mc-search-result.quran-card {

  border-color: #bbdefb; /* آبی روشن */

  &.not-expanded:hover {
    animation: cardGlowQuran 1.5s ease-out;
    border: 1px solid rgb(33, 150, 243); /* آبی اصلی */
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }

  .hadithtext {
    border-right: 3px solid #2196F3; /* آبی اصلی */
   background-color: #f5f9ff; /* آبی بسیار روشن */
  }
}
.hadithtext {

  font-size: 1.4rem;
  line-height: 1.6;
  color: #333;
  padding: 2px 5px;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin: 0;
  font-family: 'Amiri', 'Traditional Arabic', serif;
}

.hadithtext em {
  font-style: normal;
  background-color: #FFF9C4;
  padding: 0 3px;
  border-radius: 3px;
  color: #D32F2F;
  font-weight: 500;
}
</style>
