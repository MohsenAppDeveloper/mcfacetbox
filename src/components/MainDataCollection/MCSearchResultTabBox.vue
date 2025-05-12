<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import type { ISimpleTreeActionable } from '@/types/baseModels'
import { DataBoxType, MessageType, SizeType } from '@/types/baseModels'
import { DataShelfBoxModelNew, type IDataShelfBoxNew } from '@/types/dataShelf'
import type { IHadithSearchResultItem } from '@/types/SearchResult'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const tempSelectedTabBoxItem = reactive<DataShelfBoxModelNew>(new DataShelfBoxModelNew(0, props.selectedTreeId, 0, ''))

// const { selectedNode } = useTree()
const dialogSelectNodeVisible = ref(false)
const loadinglocal = ref(false)
interface Props {
  dataitemHadith?: IHadithSearchResultItem
  dataitemQuran?: any
  dataitemVocab?: any
  selectedTreeId: number
  selectedNode: ISimpleTreeActionable
  boxType: DataBoxType
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

const tabdatamodel = ref()
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

const selectedHighlight = computed(() => {
  if (props.dataitemHadith && props.dataitemHadith.id > 0)
    return props.dataitemHadith.highlightText

  else if (props.dataitemQuran && props.dataitemQuran.id > 0)
    return props.dataitemQuran.highlightText
})

const selectedId = computed(() => {
  if (props.dataitemHadith && props.dataitemHadith.id > 0)
    return props.dataitemHadith.id

  else if (props.dataitemQuran && props.dataitemQuran.id > 0)
    return props.dataitemQuran.id
})

// interface Emit {
//   (e: 'close'): void // ایونت جدید close اضافه شد
//   (e: 'open'): void // ایونت جدید close اضافه شد
// }
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
          addContentToNode({ content: selectedHighlight.value, description: '', labels: [], nodeId: props.selectedNode.id, treeId: 9, footNotes: [], id: 0, sourceId: selectedId.value.toString() })
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
          addContentToNode({ content: selectedHighlight.value, description: '', labels: [], nodeId: 0, treeId: props.selectedTreeId, footNotes: [], id: 0, sourceId: selectedId.value.toString() })
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
</script>

<template>
  <VCard v-no-context-menu class="mc-search-result">
    <MCLoading :showloading="loadinglocal" :loadingsize="SizeType.MD" />
    <!-- <VCard variant="text"> -->
    <VCardText style="height: auto;" @contextmenu="onContextMenu($event)">
      <MCDialogSelectNode
        v-if="dialogSelectNodeVisible" v-model:is-dialog-visible="dialogSelectNodeVisible" :selected-item="selectedHighlight"
        :selected-tree-id="props.selectedTreeId" @nodehasbeenselected="(nodeid) => addContentToNode(new DataShelfBoxModelNew(0, props.selectedTreeId, nodeid, selectedHighlight, '', [], [], selectedId.toString()))"
      />
      <VRow>
        <VCol>
          <div v-if="props.dataitemHadith && props.dataitemHadith.id > 0" class="flex">
            <div v-if="props.dataitemHadith.qaelList.length > 1">
              <span class="searchDataBoxInfoTitle"> {{ $t('qael') }}: </span><span class="searchDataBoxInfoText">{{ props.dataitemHadith.qaelTitleList }}</span>
            </div>
            <div>  <span class="searchDataBoxInfoTitle"> {{ $t('address') }}: </span><span class="searchDataBoxInfoText">{{ `${props.dataitemHadith.bookTitle}, ${`${$t('volume')} ${props.dataitemHadith.vol}`}, ${`${$t('pagenum')} ${props.dataitemHadith.pageNum}`}` }} </span></div>
          </div>
        </VCol>
      </VRow>
      <VRow no-gutters class="justify-start align-start">
        <!--
          <VCheckbox
          v-if="(isUndefined(textData.raw.selectable) && item.content.length > 1) || (textData.raw.selectable)"
          v-model="textData.raw.selected" density="compact"
          />
        -->

        <VCol md="12">
          <div v-if="props.dataitemHadith" class="hadithtext" v-html="props.dataitemHadith.highlightText" />
          <!-- <div class="foot-note">این قسمت محل پاورقی</div> -->
        </VCol>
      </VRow>
    </VCardText>
    <!-- </VCard> -->
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

.mc-search-result:hover {
  animation: hadithCardGlow 1.5s ease-out;
  border: 1px solid #4CAF50;
  transform: scale(1.01);
}

/* افکت نور پس‌زمینه */
.mc-search-result:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(76, 175, 80, 0.1) 0%, transparent 70%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.mc-search-result:hover::after {
  opacity: 1;
}

/* تغییر رنگ متن حدیث هنگام هاور */
.mc-search-result:hover .text {
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
