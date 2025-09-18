<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import { VFadeTransition } from 'vuetify/lib/components/index.mjs'
import MCDialogSupervisionCommentHistory from '../dialogs/MCDialogSupervisionCommentHistory.vue'
import { DataShelfBoxModelNew, DataShelfBoxModelView } from '@/types/dataShelf'
import { resolveSupervisionStatus } from '@/utils/dataResolver'
import type { IDataShelfBoxNew, IDataShelfBoxView, IOrderChangedResponse, LinkDetailModel, UnlinkDataModel } from '@/types/dataShelf'
import { DataBoxType, MessageType, SizeType, SupervisionStatus } from '@/types/baseModels'
import { type ISearchResultItem, SearchResultItemModel } from '@/types/SearchResult'
import { useDataShelfPriorityChanged } from '@/store/databoxStore'
import PropertyArea from '@/views/wizard-examples/property-listing/PropertyArea.vue'

const props = defineProps<{
  itemIndex: number
  nextItemOrder: number
  prevItemOrder: number
  nextItemPriority: number
  prevItemPriority: number
  hasFiltered: boolean
  readonlyMode?: boolean }>()

const emits = defineEmits<Emits>()
const isDialogDataShelfBoxEdit = ref(false)
const dialogAddLabelVisible = ref(false)
const dialogDataBoxInfo = ref(false)
const dialogResourceHistory = ref(false)
const dialogStateHistory = ref(false)

const dialogSupervisionHistory = ref(false)

const dialogSelectNodeVisible = ref(false)
const databoxItem = defineModel<IDataShelfBoxView>({ default: new DataShelfBoxModelView() })
const { t } = useI18n({ useScope: 'global' })
const showTools = ref(false)
const marginbottom = ref('10px')
const { can } = useAbility()
const priorityChangedData = useDataShelfPriorityChanged()
const copytoNodeAction = shallowRef(false)
const transfertoNodeAction = shallowRef(false)

/**
 * هر زمان که یک اکشن روی این کامپوننت اتفاق بیفتد که منجر به نمایش یک دیالوگ دیگر و وابسته با این کامپوننت باشد باید این متغییر تحت تاثیر قرار بگیرد
 */
const selectedbox = shallowRef(false)

// const toast = useToast()
const databox = ref()
const highlightClass = ref([`mc-data-shelf-box${props.readonlyMode ? 'mc-data-shelf-box--readonly' : ''}`])
const loadinglocal = ref(false)
const btnlabel = ref()

const rowFontSize = (rowindex: number) => {
  if (rowindex < 100)
    return '12px'
  else if (rowindex < 1000)
    return '10px'
  else
    return '8px'
}

const { x: btnlabelX, y: btnlabelY }
        = useElementBounding(btnlabel)

// interface Props {
//   databoxitem: IDataShelfBox
// }
interface Emits {
  (e: 'editdataboxcontent', dataBoxId: IDataShelfBoxView): void
  (e: 'selectedchanged', isSelected: boolean, databoxitem: IDataShelfBoxView): void
  (e: 'orderchanged', itemId: number): void
  (e: 'refreshdatashelf'): void
  (e: 'showrelateddata', selectedItem: ISearchResultItem, datatype: DataBoxType): void
  (e: 'handlemessage', message: string, type: MessageType): void
  (e: 'linkdatabox', linkdata: LinkDetailModel[]): void
  (e: 'unlinkdatabox', unlinkdata: UnlinkDataModel): void

}

const onContextMenu = (e: MouseEvent) => {
  // prevent the browser's default menu
  e.preventDefault()
  if (databoxItem.value.state.id === SupervisionStatus.accept)
    return

  // show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        disabled: !(databoxItem.value.excerptType.id === DataBoxType.quran || databoxItem.value.excerptType.id === DataBoxType.hadith),
        label: t('datashelfbox.refreshtobase'),
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('datashelfbox.showhistory'),
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

const focuToElementAfterMove = () => {
  databox.value.focus()
  highlightClass.value.push('fade-highlight')
  setTimeout(() => {
    highlightClass.value.splice(1, 1)
  }, 500) // زمان هم‌زمان با مدت انیمیشن
  emits('orderchanged', databoxItem.value?.id ?? 0)
}

const changeOrder = async (direction: 'next' | 'prev'): Promise<IOrderChangedResponse[] | null> => {
  try {
    loadinglocal.value = true

    const result = await $api<IOrderChangedResponse[]>(`app/excerpt/${databoxItem.value.id}/move/${direction}`, {
      method: 'PUT',
      ignoreResponseError: false,
    })

    loadinglocal.value = false
    if (result && result.length > 0) {
      databoxItem.value.priority = result[0].priority

      return result
    }
    else { return null }
  }
  catch (error) {
    loadinglocal.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)

    return null
  }
}

const addlabels = () => {
  if (!can('Update', 'Excerpt'))
    return
  dialogAddLabelVisible.value = true
}

const updatedataboxItem = (databoxitemResult: IDataShelfBoxView) => {
  Object.assign(databoxItem.value, databoxitemResult)
}

const changeSupervisionStatus = async (statusId: SupervisionStatus) => {
//   loadinglocal.value = true
  if ((statusId === SupervisionStatus.accept || statusId === SupervisionStatus.review) && !can('Supervision', 'Excerpt'))
    return

  const serviceError = shallowRef()

  const resultValue = await showSwal({
    input: 'textarea',
    inputLabel: t('tree.comment'),
    inputPlaceholder: t('datashelfbox.enteryourcomment'),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    allowOutsideClick: false,
    preConfirm: async desc => {
      try {
        await $api(`app/excerpt/${databoxItem.value.id}/${SupervisionStatus[statusId]}`, {
          method: 'PUT',
          body: { description: desc },
          ignoreResponseError: false,
        })
        databoxItem.value.hasDescription = desc.length > 0
      }
      catch (err) {
        serviceError.value = err
      }

      return { serviceError }
    },
  })

  if (resultValue.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        emits('handlemessage', err.message, MessageType.error)
      else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    }
    else {
      databoxItem.value.state.id = statusId
      emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
    }
  }
  selectedbox.value = false

  //   try {
  //     await $api(`app/excerpt/${databoxItem.value.id}/${SupervisionStatus[statusId]}`, {
  //       method: 'PUT',
  //     })

  //     loadinglocal.value = false
  //     emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
  //   }
  //   catch (error) {
  //     loadinglocal.value = false

//     if (error instanceof CustomFetchError && error.code !== '0')
//       emits('handlemessage', error.message, MessageType.error)
//     else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
//   }
}

async function copyToNode(datashelfbox: IDataShelfBoxNew, duplicate: boolean) {
  loadinglocal.value = true

  try {
    await $api('app/excerpt/copy', {
      method: 'POST',
      body: JSON.stringify({ ignoreDuplicate: duplicate, ...datashelfbox }),
      ignoreResponseError: false,
    })

    emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0') {
      if (error.code === 'Encyclopedia.ErrorCode:010004') {
        const title = formatString(t('alert.contentisduplicate'), t(DataBoxType[databoxItem.value.excerptType.id]))

        await confirmSwal(
          title,
          '',
          t('$vuetify.confirmEdit.ok'),
          t('$vuetify.confirmEdit.cancel'),
          true, 'warning',
          async () => {
            await copyToNode(datashelfbox, true)
          },
        )
      }
      else { emits('handlemessage', error.message, MessageType.error) }
    }
    else { emits('handlemessage', t('httpstatuscodes.0'), MessageType.error) }
  }
  finally {
    copytoNodeAction.value = false
    loadinglocal.value = false
  }
}

const transfertoNode = async (nodeid: number) => {
  loadinglocal.value = true
  try {
    await $api(`app/excerpt/${databoxItem.value.id}/connect/${nodeid}`, {
      method: 'PUT',
    })
    emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
  }
  finally {
    transfertoNodeAction.value = false
    loadinglocal.value = false
  }
}

function nodehasbeenselected(nodeid: number) {
  if (transfertoNodeAction.value)
    transfertoNode(nodeid)

  if (copytoNodeAction.value)
    copyToNode(new DataShelfBoxModelNew(databoxItem.value.id, 0, nodeid, ''), false)
}

const disconnectSelectedExcerpt = async () => {
  if (!can('Delete', 'Excerpt'))
    return
  selectedbox.value = true

  const serviceError = shallowRef()

  const result = await confirmSwal(
    t('datashelfbox.disconnectselecteditem'),
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api(`app/excerpt/${databoxItem.value.id}/disconnect`, {
          method: 'DELETE',
        })
      }
      catch (error) {
        serviceError.value = error
      }

      return { serviceError }
    },
  )

  if (result.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        emits('handlemessage', serviceError.value.message, MessageType.error)
      else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    }
    else {
      emits('handlemessage', t('alert.deleteDataSuccess'), MessageType.success)
      emits('refreshdatashelf')
    }
  }
  selectedbox.value = false
}

const deleteSelectedExcerpt = async () => {
  if (!can('Delete', 'Excerpt'))
    return
  selectedbox.value = true

  const serviceError = shallowRef()

  const result = await confirmSwal(
    t('datashelfbox.deleteselecteditem'),
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api(('app/excerpt/').replace('//', '/') + databoxItem.value.id, {
          method: 'DELETE',
        })
      }
      catch (error) {
        serviceError.value = error
      }

      return { serviceError }
    },
  )

  if (result.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        emits('handlemessage', serviceError.value.message, MessageType.error)
      else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    }
    else {
      emits('handlemessage', t('alert.deleteDataSuccess'), MessageType.success)
      emits('refreshdatashelf')
    }
  }
  selectedbox.value = false
}

const linkdatabox = async () => {
  try {
    if (!can('Link', 'Excerpt') || props.hasFiltered)
      return
    loadinglocal.value = true

    const result = await $api<LinkDetailModel[]>(`app/excerpt/${databoxItem.value.id}/link`, {
      method: 'PUT',
      ignoreResponseError: false,
    })

    emits('linkdatabox', result)
    databoxItem.value.hasLink = true
    loadinglocal.value = false
  }
  catch (error) {
    loadinglocal.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)

    return false
  }
}

const unlinkdatabox = async () => {
  try {
    if (!can('Link', 'Excerpt') || props.hasFiltered)
      return
    loadinglocal.value = true

    const result = await $api<UnlinkDataModel>(`app/excerpt/${databoxItem.value.id}/unlink`, {
      method: 'PUT',
      ignoreResponseError: false,
    })

    emits('unlinkdatabox', result)
    databoxItem.value.hasLink = false
    loadinglocal.value = false
  }
  catch (error) {
    loadinglocal.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)

    return false
  }
}

const addcomment = async () => {
  if (!can('Description', 'Excerpt'))
    return
  selectedbox.value = true
  let description = ''
  let haserror = false
  const serviceError = shallowRef()

  try {
    await showLoadingSwal(t('tree.loadingnodedetail'), async () => {
      description = await $api(`app/excerpt/${databoxItem.value.id}/description`,
        { method: 'GET', ignoreResponseError: false },
      )
    })
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emits('handlemessage', error.message, MessageType.error)
    emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    haserror = true

    return
  }

  if (haserror)
    return

  const resultValue = await showSwal({
    input: 'textarea',
    inputLabel: t('tree.comment'),
    inputValue: description,
    inputPlaceholder: t('datashelfbox.enteryourcomment'),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    allowOutsideClick: false,
    preConfirm: async desc => {
      try {
        await $api(`app/excerpt/${databoxItem.value.id}/description`, {
          method: 'PUT',
          body: { description: desc },
          ignoreResponseError: false,
        })
        databoxItem.value.hasDescription = desc.length > 0
      }
      catch (err) {
        serviceError.value = err
      }

      return { serviceError }
    },
  })

  if (resultValue.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        emits('handlemessage', err.message, MessageType.error)
      else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    }
    else {
      emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
    }
  }
  selectedbox.value = false
}

const decreaseOrder = async () => {
  if (props.prevItemPriority === -1)
    return

  const result = await changeOrder('prev')
  if (result) {
    priorityChangedData.items.value.splice(0)
    priorityChangedData.prioritydirection.value = 'Down'
    priorityChangedData.items.value = result

    await nextTick()
    databox.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    focuToElementAfterMove()
  }
}

const increaseOrder = async () => {
  if (props.nextItemPriority === -1)
    return
  const result = await changeOrder('next')

  if (result) {
    priorityChangedData.items.value.splice(0)
    priorityChangedData.prioritydirection.value = 'Top'
    priorityChangedData.items.value = result

    await nextTick()
    databox.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    focuToElementAfterMove()
  }
}

function showrelatedData() {
  emits('showrelateddata', new SearchResultItemModel([], databoxItem.value.sourceId, databoxItem.value.content, ''), databoxItem.value.excerptType.id)
}
function labelhasbeenadded(nodeid: number, labelcount: number) {
  databoxItem.value.labelCount = labelcount
  emits('handlemessage', t('datashelfbox.labeladded'), MessageType.success)
  emits('refreshdatashelf')
}

const isSelected = computed({
  get(): boolean {
    return databoxItem.value?.selected ?? false
  },
  set(newval: boolean) {
    if (databoxItem.value)
      databoxItem.value.selected = newval
    emits('selectedchanged', newval, databoxItem.value)
  },

})

const itemsHasLink = computed(() => {
  if (props.readonlyMode)
    return false

  return databoxItem.value.hasLink || databoxItem.value.linkId
})

defineExpose({ increaseOrder, decreaseOrder })
watch(priorityChangedData.items, newval => {
  console.log('newval', priorityChangedData)

  const result = newval.findLast(a => a.id === databoxItem.value.id)
  if (!result)
    return
  databoxItem.value.priority = result.priority

//   if (priorityChangedData.prioritydirection.value === 'Top') {
//  databox.value.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     focuToElementAfterMove()
//   }
//   else if (priorityChangedData.prioritydirection.value === 'Down') {
//     databox.value.$el.scrollIntoView({ behavior: 'smooth', block: 'end' })
//     focuToElementAfterMove()
//   }
})
watch(dialogAddLabelVisible, () => {
  selectedbox.value = dialogAddLabelVisible.value
}, { deep: false })
watch(dialogDataBoxInfo, () => {
  selectedbox.value = dialogDataBoxInfo.value
}, { deep: false })
watch(dialogSelectNodeVisible, () => {
  selectedbox.value = dialogSelectNodeVisible.value
}, { deep: false })
watch(isDialogDataShelfBoxEdit, () => {
  selectedbox.value = isDialogDataShelfBoxEdit.value
}, { deep: false })

// watch(showTools, () => {
//   selectedbox.value = showTools.value
// })

// mc-data-shelf-box
</script>

<template>
  <div
    ref="databox" :class="[highlightClass]"
    :style="{ 'overflow': 'visible !important', 'margin-block-end': itemsHasLink ? '3px' : '10px', 'margin-right': itemsHasLink ? '10px' : '0px', 'background-color': itemsHasLink ? 'rgba(var(--v-shadow-key-umbra-color), 0.10)' : '' }" @mouseenter="showTools = true"
    @mouseleave="showTools = false" @contextmenu="onContextMenu"
  >
    <MCLoading :showloading="loadinglocal" :loadingsize="SizeType.MD" />

    <div :class="`${selectedbox ? 'selectedbox h-auto shelf-box-body' : 'h-auto shelf-box-body'}`">
      <!-- <VRow no-gutters class="justify-start align-start box"> -->
      <div class="d-flex flex-column align-center justify-center" :style="{ 'border-radius': '0 6px 6px 0', 'cursor': 'pointer', 'background': isSelected ? 'rgba(var(--v-theme-primary), 0.40)' : '', 'width': '20px', 'max-width': '20px', 'min-width': '20px', 'fontSize': rowFontSize((props.itemIndex + 1)) }" @click.left="isSelected = !isSelected">
        <span v-if="!readonlyMode" :class="`${isSelected ? 'font-weight-black' : ''}`">{{ props.itemIndex + 1 }}</span>
        <!-- <VCheckbox v-if="!readonlyMode" v-model="isSelected" max-width="10" density="compact" /> -->
      </div>
      <VDivider vertical />
      <div class="pa-2">
        <div class="text pb-1" v-html="databoxItem?.content" />
        <VDivider v-if="((databoxItem?.footNotes && databoxItem?.footNotes.length) ?? 0) > 0" class="w-50" />
        <div v-for="(item, index) in databoxItem?.footNotes" :key="item.id" class="d-flex flex-column">
          <div>
            <span class="footenote-index">{{ item.order === undefined ? index + 1 : item.order }} -</span>
            <span class="no-select foot-note">{{ item.title }}</span>
            <!--
              <VBtn icon size="small" variant="text" @click.left="deletefootnote">
              <VIcon icon="tabler-trash" color="error" size="20" />
              </VBtn>
            -->
          </div>
        </div>
      </div>
      <!-- position-absolute px-2 d-flex flex-column top-0 left-0 -->
      <!-- </VRow> -->
    </div>
    <div v-if="!readonlyMode">
      <VBtn
        v-if="databoxItem.hasLink" icon size="25" color="error" :disabled="!can('Link', 'Excerpt') || props.hasFiltered"
        variant="text" class="box-unpin-item" @click="unlinkdatabox"
      >
        <VIcon icon="tabler-link-minus" size="20" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('datashelfbox.unlink') }}
        </VTooltip>
      </VBtn>
    </div>
    <VFabTransition>
      <div v-if="showTools && !readonlyMode" class="box-state-container">
        <VTooltip location="right center">
          <template #activator="{ props }">
            <VIcon v-if="(databoxItem?.node?.id ?? 0) > 0" icon="tabler-plug-connected-x" size="12" class="mb-1" v-bind="props" />
          </template>
          {{ formatString($t('datashelfbox.connectednode'), databoxItem?.node?.title) }}
        </VTooltip>

        <VIcon v-if="databoxItem?.hasDescription" icon="tabler-message" size="12" class="mb-1" />
        <VTooltip location="right center">
          <template #activator="{ props }">
            <VIcon
              v-if="(databoxItem?.labelCount ?? 0) > 0"
              icon="tabler-tag"
              size="12"
              class="mb-1"
              v-bind="props"
            />
          </template>
          {{ formatString($t('datashelfbox.labelscount'), databoxItem?.labelCount.toString()) }}
        </VTooltip>
      </div>
    </VFabTransition>
    <!-- <VFadeTransition> -->
    <div v-if="showTools && !readonlyMode" class="box-state-toolbar">
      <div :style="databoxItem.state.id === SupervisionStatus.accept ? { pointerEvents: 'none', opacity: '0.5' } : {}">
        <VBtn v-if="!databoxItem.hasLink" icon size="25" variant="text" :disabled="!can('Link', 'Excerpt') || props.hasFiltered" @click="linkdatabox">
          <VIcon icon="tabler-link-plus" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.link') }}
          </VTooltip>
        </VBtn>
        <VBtn icon size="25" variant="text" @click="dialogDataBoxInfo = true">
          <VIcon icon="tabler-info-circle" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.about') }}
          </VTooltip>
        </VBtn>
        <VBtn icon size="25" variant="text" :disabled="!can('Update', 'Excerpt')" @click="isDialogDataShelfBoxEdit = (true && (can('Link', 'Excerpt') ?? false))">
          <VIcon icon="tabler-edit" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.edit') }}
          </VTooltip>
        </VBtn>
        <VBtn v-if="databoxItem.node && databoxItem.node.id > 0" :disabled="!can('Delete', 'Excerpt')" icon size="25" variant="text" @click="disconnectSelectedExcerpt">
          <VIcon icon="tabler-plug-connected-x" size="20" color="error" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.disconnect') }}
          </VTooltip>
        </VBtn>
        <VBtn icon size="25" variant="text" :disabled="!can('Connect', 'Excerpt')" @click="() => { if (!can('Connect', 'Excerpt')) return; dialogSelectNodeVisible = true;transfertoNodeAction = true }">
          <VIcon icon="tabler-plug-connected" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.transfertonode') }}
          </VTooltip>
        </VBtn>
        <VBtn icon size="25" variant="text" :disabled="!can('Delete', 'Excerpt')" color="error" @click="deleteSelectedExcerpt">
          <VIcon icon="tabler-trash-x" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.delete') }}
          </VTooltip>
        </VBtn>
        <VBtn ref="btnlabel" icon size="25" variant="text" :disabled="!can('Update', 'Excerpt')" @click="addlabels">
          <VIcon icon="tabler-tag" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.addlabel') }}
          </VTooltip>
        </VBtn>
        <VBtn icon size="25" variant="text" :disabled="!can('Description', 'Excerpt')" @click="addcomment">
          <VIcon icon="tabler-square-plus" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.addcomment') }}
          </VTooltip>
        </VBtn>

        <VBtn v-if="databoxItem.excerptType.id === DataBoxType.quran || databoxItem.excerptType.id === DataBoxType.hadith" icon size="25" variant="text" @click="showrelatedData">
          <VIcon icon="tabler-circles-relation" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.showrelateddata') }}
          </VTooltip>
        </VBtn>
        <VBtn v-if="databoxItem.excerptType.id === DataBoxType.quran || databoxItem.excerptType.id === DataBoxType.hadith" icon size="25" variant="text" @click="dialogResourceHistory = true">
          <VIcon icon="tabler-history-toggle" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ `${$t('datashelfbox.otherusage')} ${$t(DataBoxType[databoxItem.excerptType.id])}` }}
          </VTooltip>
        </VBtn>
        <VBtn icon size="25" variant="text" :disabled="!can('Copy', 'Excerpt')" @click="() => { if (!can('Copy', 'Excerpt')) { return; } dialogSelectNodeVisible = true ;copytoNodeAction = true }">
          <VIcon icon="tabler-box-multiple" size="20" />
          <VTooltip
            activator="parent"
            location="top center"
          >
            {{ $t('datashelfbox.copytonode') }}
          </VTooltip>
        </VBtn>
      </div>
      <VDivider vertical class="mx-2" color="primary" thickness="2" />
      <VBtn :disabled="(databoxItem.stateCount ?? 0) === 0" icon size="25" variant="text" @click="dialogStateHistory = true">
        <VIcon icon="tabler-timeline-event-text" size="20" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('supervision.comment') }}
        </VTooltip>
      </VBtn>

      <VBtn v-if="resolveSupervisionStatus(databoxItem.state?.id ?? SupervisionStatus.primary, SupervisionStatus.primary)" icon size="25" variant="text" @click="changeSupervisionStatus(SupervisionStatus.primary)">
        <VIcon icon="tabler-arrow-capsule" size="20" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('supervision.primary') }}
        </VTooltip>
      </VBtn>

      <VBtn v-if="resolveSupervisionStatus(databoxItem.state?.id ?? SupervisionStatus.primary, SupervisionStatus.ready)" icon size="25" variant="text" color="primary" @click="changeSupervisionStatus(SupervisionStatus.ready)">
        <VIcon icon="tabler-checklist" size="20" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('supervision.ready') }}
        </VTooltip>
      </VBtn>
      <VBtn
        v-if="resolveSupervisionStatus(databoxItem.state?.id ?? SupervisionStatus.primary, SupervisionStatus.review)" :disabled="!can('Supervision', 'Excerpt')" icon size="25" variant="text" color="warning"
        @click="changeSupervisionStatus(SupervisionStatus.review)"
      >
        <VIcon icon="tabler-zoom-check" size="20" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('supervision.review') }}
        </VTooltip>
      </VBtn>
      <VBtn
        v-if="resolveSupervisionStatus(databoxItem.state?.id ?? SupervisionStatus.primary, SupervisionStatus.accept)" icon :disabled="!can('Supervision', 'Excerpt')" size="25" variant="text" color="success"
        @click="changeSupervisionStatus(SupervisionStatus.accept)"
      >
        <VIcon icon="tabler-pencil-check" size="20" />
        <VTooltip
          activator="parent"
          location="top center"
        >
          {{ $t('supervision.accept') }}
        </VTooltip>
      </VBtn>
    </div>
    <!-- </VFadeTransition> -->
  </div>
  <MCDialogSelectNode
    v-if="dialogSelectNodeVisible" v-model:is-dialog-visible="dialogSelectNodeVisible"
    :selected-tree-id="databoxItem.treeId" @nodehasbeenselected="(nodeid) => nodehasbeenselected(nodeid)"
  />
  <MCDialogDataShelfBoxEdit v-if="isDialogDataShelfBoxEdit" v-model:is-dialog-visible="isDialogDataShelfBoxEdit" :datashelfboxid="databoxItem.id" @updatedatabox-item="updatedataboxItem" @handlemessage="(message, type) => emits('handlemessage', message, type)" />
  <MCDialogAddLabel
    v-if="dialogAddLabelVisible" v-model:is-dialog-visible="dialogAddLabelVisible" :tree-id="databoxItem?.treeId ?? 0" :selected-data-box-id="databoxItem.id ?? 0"
    :loc-x="btnlabelX" :loc-y="btnlabelY - 200" @error-has-occured="emits('handlemessage', $event, MessageType.error)" @label-added="labelhasbeenadded"
  />
  <MCDialogDataBoxInfo
    v-if="dialogDataBoxInfo" v-model:is-dialog-visible="dialogDataBoxInfo" :selected-data-box-id="databoxItem.id ?? 0"
    @error-has-occured="emits('handlemessage', $event, MessageType.error)"
  />
  <MCDialogResourceHistory
    v-if="dialogResourceHistory" v-model:is-dialog-visible="dialogResourceHistory" :selected-data-box-id="databoxItem.id ?? 0" :serviceurl="`app/excerpt/${DataBoxType[databoxItem.excerptType.id]}?SourceId=${databoxItem.sourceId}`"
    @error-has-occured="emits('handlemessage', $event, MessageType.error)"
  />
  <MCDialogStateHistory
    v-if="dialogStateHistory" v-model:is-dialog-visible="dialogStateHistory" :selected-data-box-id="databoxItem.id ?? 0" :serviceurl="`app/excerpt/${databoxItem.id}/states`"
    @error-has-occured="emits('handlemessage', $event, MessageType.error)"
  />
  <MCDialogSupervisionCommentHistory
    v-if="dialogSupervisionHistory" v-model:is-dialog-visible="dialogSupervisionHistory" :selected-data-box-id="databoxItem.id ?? 0" :serviceurl="`app/excerpt/${DataBoxType[databoxItem.excerptType.id]}?SourceId=${databoxItem.sourceId}`"
    @error-has-occured="emits('handlemessage', $event, MessageType.error)"
  />
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
