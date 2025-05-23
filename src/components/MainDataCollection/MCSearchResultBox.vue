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
  selectedTreeId: number
  selectedNode: ISimpleTreeActionable
  boxType: DataBoxType
  isExpanded?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'maximizeSearchTabBox', selectedItem: any): void
  (e: 'messageHasOccured', message: string, type: MessageType): void
  (e: 'contentToNodeAdded', connectednodeid: number): void
  (e: 'update:isExpanded', value: boolean): void
}
>()

const { t } = useI18n({ useScope: 'global' })

const loadinglocal = ref(false)

const dialogSelectNodeVisible = ref(false)
async function addContentToNode(datashelfbox: IDataShelfBoxNew) {
  loadinglocal.value = true
  try {
    await $api(`app/excerpt/${DataBoxType[props.boxType]}`, {
      method: 'POST',
      body: JSON.stringify(datashelfbox),
      ignoreResponseError: false,
    })
    emit('contentToNodeAdded', datashelfbox.nodeId)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code > 0)
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
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
      return ''
    case DataBoxType.vocabulary:
      return ''
  }
})

const onContextMenu = (e: MouseEvent) => {
  // prevent the browser's default menu
  e.preventDefault()

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        disabled: props.selectedNode.id <= 0,
        icon: h('i', {
          class: 'tabler-plug-connected icon iconfont',
          style: {
            width: '18px',
            height: '18px',
          },
        }),
        label: t('datagathering.connecttoselectednode'),
        onClick: () => {
          addContentToNode({ content: props.dataitem.text, description: '', labels: [], nodeId: props.selectedNode.id, treeId: 9, footNotes: [], id: 0, sourceId: props.dataitem.id.toString() })
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
          addContentToNode({ content: props.dataitem.text, description: '', labels: [], nodeId: 0, treeId: props.selectedTreeId, footNotes: [], id: 0, sourceId: props.dataitem.id.toString() })
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
          alert('You click a menu item')
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
  <VCard v-no-context-menu class="h-100 w-100 mc-search-result" :class="{ 'not-expanded': !isExpanded }">
    <MCLoading v-if="loadinglocal" :showloading="loadinglocal" :loadingsize="SizeType.MD" />

    <MCDialogSelectNode
      v-if="dialogSelectNodeVisible" v-model:is-dialog-visible="dialogSelectNodeVisible"
      :selected-tree-id="props.selectedTreeId" @nodehasbeenselected="(nodeid) => addContentToNode(new DataShelfBoxModelNew(0, props.selectedTreeId, nodeid, props.dataitem.text, '', [], [], props.dataitem.id.toString()))"
    />
    <div class="result-box-actions-container">
      <VBtn icon size="22" variant="text" @click="openBoxLink">
        <VIcon icon="tabler-external-link" size="18" />
      </VBtn>
      <VBtn v-if="!props.isExpanded" icon size="22" variant="text" @click="$emit('maximizeSearchTabBox', props.dataitem)">
        <VIcon icon="tabler-maximize" size="18" />
      </VBtn>
      <VBtn v-if="props.isExpanded" icon size="22" variant="text" @click="$emit('update:isExpanded', false)">
        <VIcon icon="tabler-x" size="18" />
      </VBtn>
    </div>
    <VCardText style="height: 95%;" class="w-100 py-1 px-1">
      <component :is="componentName" :dataitem="props.dataitem" :is-expanded="props.isExpanded ?? false" @contextmenu="onContextMenu($event)" />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.v-btn--disabled {
  opacity: 0.25;
}
@keyframes hadithCardGlow {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

.mc-search-result.not-expanded:hover {
  animation: hadithCardGlow 1.5s ease-out;
  border: 1px solid #4CAF50;
  transform: scale(1.01);
}

/* افکت نور پس‌زمینه */
// .mc-search-result:hover::after {
//   content: '';
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: radial-gradient(circle at center, rgba(76, 175, 80, 0.1) 0%, transparent 70%);
//   z-index: -1;
//   opacity: 0;
//   transition: opacity 0.4s ease;
// }

.mc-search-result.not-expanded:hover::after {
  opacity: 1;
}

/* تغییر رنگ متن حدیث هنگام هاور */
.mc-search-result.not-expanded:hover .text {
  color: #222;
}
/* استایل اصلی کارت */
.mc-search-result {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  width: 100%;
  transition: all 0.4s ease;
}

/* بخش اطلاعات (قالبین و آدرس) */
.flex {
  display: flex;
  flex-direction: row;
  gap: 6px;
  padding: 4px 4px 2px;
}
.searchDataBoxInfoTitle {
    font-size: .7em;
    font-weight: bold;
}

.searchDataBoxInfoText {
  color: #555;
  font-size: .7rem;
  line-height: 1.3;
  display: inline;
}
// .mc-search-result:hover {
//   box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
//   transform: translateY(-2px);
// }
/* متن حدیث */

.hadithtext {
  font-size: 1.4rem;
  line-height: 1.6;
  color: #333;
  padding: 2px 5px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-right: 3px solid #4CAF50;
  margin: 0;
  font-family: 'Amiri', 'Traditional Arabic', serif;

}

/* هایلایت کلمات جستجو شده */
.hadithtext em {
  font-style: normal;
  background-color: #FFF9C4;
  padding: 0 3px;
  border-radius: 3px;
  color: #D32F2F;
  font-weight: 500;
}

// .hadithtext em {
//   background-color: #fff9c4; /* پس‌زمینه زرد روشن */
//   color: #d32f2f; /* رنگ متن قرمز تیره */
//   font-style: normal; /* غیرایتالیک */
//   padding: 0.2em 0.4em; /* فاصله داخلی */
//   border-radius: 4px; /* لبه‌های گرد */
//   font-weight: bold; /* متن پررنگ */
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* سایه ملایم */
//   }
</style>
