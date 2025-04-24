<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import Swal from 'sweetalert2'
import { DataShelfBoxModelView, type IDataShelfBoxView } from '@/types/dataShelf'
import { MessageType } from '@/types/baseModels'

const props = defineProps<{ itemIndex: number;nextItemOrder: number;prevItemOrder: number }>()
const emits = defineEmits<Emits>()
const isDialogDataShelfBoxEdit = ref(false)
const dialogAddLabelVisible = ref(false)
const databoxItem = defineModel<IDataShelfBoxView>({ default: new DataShelfBoxModelView() })
const { t } = useI18n({ useScope: 'global' })
const showTools = ref(true)

// const toast = useToast()
const databox = ref()
const highlightClass = ref(['mc-data-shelf-box'])
const btnlabel = ref()

const { x: btnlabelX, y: btnlabelY }
        = useElementBounding(btnlabel)

// interface Props {
//   databoxitem: IDataShelfBox
// }
interface Emits {
  (e: 'editdataboxcontent', dataBoxId: IDataShelfBoxView): void
  (e: 'selectedchanged', isSelected: boolean): void
  (e: 'orderchanged', itemId: number): void
  (e: 'refreshdatashelf'): void

  (e: 'handlemessage', message: string, type: MessageType): void

}

const onContextMenu = (e: MouseEvent) => {
  // prevent the browser's default menu
  e.preventDefault()

  // show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: t('datagathering.connecttoselectednode'),
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('datagathering.connecttonewnode'),
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('datagathering.connecttoreserve'),
        onClick: () => {
          alert('You click a menu item')
        },
      },
      {
        label: t('datagathering.copy'),
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

const addlabels = () => {
  dialogAddLabelVisible.value = true
}

const deleteSelectedExcerpt = (excerptId: number) => {
  Swal.fire({
    titleText: formatString(t('alert.specificItemDeleted'), nodeItem.title),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    preConfirm: async () => {
      const serviceError = shallowRef()
      try {
        await $api(('app/node/').replace('//', '/') + nodeItem.id, {
          method: 'DELETE',
        })
        deleteNode(nodeItem, true)
      }
      catch (error) {
        serviceError.value = error
      }

      return { serviceError }
    },
    allowOutsideClick: false,
  }).then(value => {
    if (value.isConfirmed) {
      if (value.value?.serviceError.value) {
        if (value.value?.serviceError.value instanceof CustomFetchError && value.value?.serviceError.value.code > 0)
          toast.error(value.value?.serviceError.value.message)
        else toast.error(t('httpstatuscodes.0'))
      }
      else {
        clearActivateNode()
        toast.success(t('alert.deleteDataSuccess'))
      }
    }
  })
}

const addcomment = () => {
//   Swal.fire({
//     input: 'textarea',
//     inputLabel: t('datashelfbox.addcomment'),
//     inputValue: databoxItem.value?.comment ?? '',
//     inputPlaceholder: t('datashelfbox.enteryourcomment'),
//     confirmButtonText: t('$vuetify.confirmEdit.ok'),
//     cancelButtonText: t('$vuetify.confirmEdit.cancel'),
//     showConfirmButton: true,
//     showCancelButton: true,
//     showLoaderOnConfirm: true,
//     showCloseButton: true,
//     preConfirm: async value => {
//       console.log('text', value)

  //       //   const { serviceData, serviceError } = await serviceDelete(item.id, props.apiUrl)

  //       //   console.log('insidemethod', serviceData.value, serviceError.value)
  //       const serviceData = ref(value)
  //       const serviceError = ref()

  //       return { serviceData, serviceError }
  //     },
  //     allowOutsideClick: false,
  //   }).then(value => {
  //     if (value.isConfirmed) {
  //     //   console.log('deletevalue', value)

  //       if (value.value?.serviceError.value)
  //         emits('handlemessage', t('alert.dataActionFailed'), MessageType.error)

  //       if (value.value?.serviceData.value) {
  //         emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)

  //         if (databoxItem.value)
  //           databoxItem.value.comment = value.value?.serviceData.value
  //       }

//       // emit('deletedItem', true)
//     }
//     else {
//       emits('handlemessage', t('alert.dataActionSuccess'), MessageType.info)
//     }
//   })
}

const focuToElementAfterMove = () => {
  databox.value.$el.focus()
  highlightClass.value.push('fade-highlight')
  setTimeout(() => {
    highlightClass.value.splice(1, 1)
  }, 500) // زمان هم‌زمان با مدت انیمیشن
  emits('orderchanged', databoxItem.value?.id ?? 0)
}

const decreaseOrder = () => {
  if (props.prevItemOrder === -100)
    return

  if (databoxItem.value)
    databoxItem.value.order = props.prevItemOrder - 0.0000001
  databox.value.$el.scrollIntoView({ behavior: 'smooth', block: 'end' })

  //   console.log('prevorder', props.prevItemOrder, databoxItem.value?.order, lastPointerPos.value, x.value, y.value)

  focuToElementAfterMove()
}

const increaseOrder = () => {
  if (props.nextItemOrder === -100)
    return
  if (databoxItem.value)
    databoxItem.value.order = props.nextItemOrder + 0.0000001
  databox.value.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })

  //   console.log('nextorder', props.nextItemOrder, databoxItem.value?.order, lastPointerPos.value, x.value, y.value)s

  focuToElementAfterMove()
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
    emits('selectedchanged', newval)
  },

})

defineExpose({ increaseOrder, decreaseOrder })

// mc-data-shelf-box
</script>

<template>
  <div class="d-flex" @mouseenter="showTools = true" @mouseleave="">
    <VCard ref="databox" :class="`${[highlightClass]}` " style="overflow: visible !important;">
      <VCardText class="h-auto">
        <VRow no-gutters class="justify-start align-start box">
          <VCheckbox v-model="isSelected" density="compact" />
          <VCol>
            <div class="text pb-1" v-html="databoxItem?.content" />
            <VDivider v-if="((databoxItem?.footnotes && databoxItem?.footnotes.length) ?? 0) > 0" />
            <div v-for="item in databoxItem?.footnotes" :key="item.id" class="d-flex flex-column">
              <div>
                <span class="footenote-index">{{ item.index }} -</span>
                <span class="no-select foot-note">{{ item.title }}</span>
                <!--
                  <VBtn icon size="small" variant="text" @click.left="deletefootnote">
                  <VIcon icon="tabler-trash" color="error" size="20" />
                  </VBtn>
                -->
              </div>
            </div>
          </VCol>
          <!-- position-absolute px-2 d-flex flex-column top-0 left-0 -->
        </VRow>
      </VCardText>
      <div class="box-state-container">
        <VTooltip location="right center">
          <template #activator="{ props }">
            <VIcon v-if="(databoxItem?.node?.id ?? 0) > 0" icon="tabler-plug-connected-x" size="12" class="mb-1" v-bind="props" />
          </template>
          {{ $t(formatString(t('datashelfbox.connectednode'), databoxItem?.node?.title)) }}
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
          {{ $t(formatString(t('datashelfbox.labelscount'), databoxItem?.labelCount.toString())) }}
        </VTooltip>
      </div>
      <VExpandTransition>
        <VRow v-if="showTools" no-gutters class="border-t-sm tools" justify="space-between">
          <div>
            <VRow no-gutters class="btn-box data-box-toolbar">
              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-pin" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.pintotop') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-info-circle" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.about') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" @click="isDialogDataShelfBoxEdit = true">
                <VIcon icon="tabler-edit" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.edit') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-box-multiple" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.duplicate') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-plug-connected" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.connecttonode') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" color="error" @click="">
                <VIcon icon="tabler-trash-x" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.delete') }}
                </VTooltip>
              </VBtn>
              <VBtn ref="btnlabel" icon size="25" variant="text" @click="addlabels">
                <VIcon icon="tabler-tag" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.addlabel') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" @click="addcomment">
                <VIcon icon="tabler-square-plus" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.addcomment') }}
                </VTooltip>
              </VBtn>

              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-circles-relation" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.showrelateddata') }}
                </VTooltip>
              </VBtn>

              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-refresh" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.refreshtobase') }}
                </VTooltip>
              </VBtn>

              <VBtn icon size="25" variant="text" @click="">
                <VIcon icon="tabler-history" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.showhistory') }}
                </VTooltip>
              </VBtn>

              <span>
                {{ databoxItem?.order }}
              </span>
            </VRow>
          </div>

        <!-- @node-added="nodeItemAdded" @node-added-failed="nodeaddfailed" -->
        </VRow>
      </VExpandTransition>
    </VCard>
    <MCDialogDataShelfBoxEdit v-if="isDialogDataShelfBoxEdit" v-model:is-dialog-visible="isDialogDataShelfBoxEdit" v-model:databox-item="databoxItem" />
    <MCDialogAddLabel
      v-if="dialogAddLabelVisible" v-model:is-dialog-visible="dialogAddLabelVisible" :tree-id="databoxItem?.treeId ?? 0" :selected-data-box-id="databoxItem.id ?? 0"
      :loc-x="btnlabelX" :loc-y="btnlabelY - 200" @error-has-occured="emits('handlemessage', $event, MessageType.error)" @label-added="labelhasbeenadded"
    />
  </div>
</template>

<style lang="scss" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
