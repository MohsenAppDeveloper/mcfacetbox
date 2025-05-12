<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import Swal from 'sweetalert2'
import { DataShelfBoxModelView } from '@/types/dataShelf'
import type { IDataShelfBoxView, IOrderChangedResponse } from '@/types/dataShelf'
import { MessageType, SizeType } from '@/types/baseModels'

const props = defineProps<{ itemIndex: number;nextItemOrder: number;prevItemOrder: number;nextItemPriority: number;prevItemPriority: number }>()
const emits = defineEmits<Emits>()
const isDialogDataShelfBoxEdit = ref(false)
const dialogAddLabelVisible = ref(false)
const dialogDataBoxInfo = ref(false)
const dialogSelectNodeVisible = ref(false)
const databoxItem = defineModel<IDataShelfBoxView>({ default: new DataShelfBoxModelView() })
const { t } = useI18n({ useScope: 'global' })
const showTools = ref(true)

// const toast = useToast()
const databox = ref()
const highlightClass = ref(['mc-data-shelf-box', 'w-100'])
const loadinglocal = ref(false)
const btnlabel = ref()

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

const focuToElementAfterMove = () => {
  databox.value.$el.focus()
  highlightClass.value.push('fade-highlight')
  setTimeout(() => {
    highlightClass.value.splice(2, 1)
  }, 500) // زمان هم‌زمان با مدت انیمیشن
  emits('orderchanged', databoxItem.value?.id ?? 0)
}

const changeOrder = async (orderNumber: number): Promise<boolean> => {
  try {
    loadinglocal.value = true

    const result = await $api<IOrderChangedResponse[]>(`app/excerpt/${databoxItem.value.id}/move/${orderNumber}`, {
      method: 'PUT',
      ignoreResponseError: false,
    })

    loadinglocal.value = false
    if (result && result.length > 0) {
      databoxItem.value.priority = result[0].priority

      return true
    }
    else { return false }
  }
  catch (error) {
    loadinglocal.value = false
    if (error instanceof CustomFetchError && error.code > 0)
      emits('handlemessage', error.message, MessageType.error)
    emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)

    return false
  }
}

const addlabels = () => {
  dialogAddLabelVisible.value = true
}

const updatedataboxItem = (databoxitemResult: IDataShelfBoxView) => {
  Object.assign(databoxItem.value, databoxitemResult)
}

const connecttoselectedNode = async (nodeid: number) => {
  loadinglocal.value = true
  try {
    await $api(`app/excerpt/${databoxItem.value.id}/connect/${nodeid}`, {
      method: 'PUT',
    })
    emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
    loadinglocal.value = false
  }
  catch (error) {
    loadinglocal.value = false

    if (error instanceof CustomFetchError && error.code > 0)
      emits('handlemessage', error.message, MessageType.error)
    else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
  }
}

const disconnectSelectedExcerpt = () => {
  Swal.fire({
    titleText: t('datashelfbox.disconnectselecteditem'),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    preConfirm: async () => {
      const serviceError = shallowRef()
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
    allowOutsideClick: false,
  }).then(value => {
    if (value.isConfirmed) {
      if (value.value?.serviceError.value) {
        if (value.value?.serviceError.value instanceof CustomFetchError && value.value?.serviceError.value.code > 0)
          emits('handlemessage', value.value?.serviceError.value.message, MessageType.error)
        else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
      }
      else {
        emits('handlemessage', t('alert.deleteDataSuccess'), MessageType.success)
        emits('refreshdatashelf')
      }
    }
  })
}

const deleteSelectedExcerpt = () => {
  Swal.fire({
    titleText: t('datashelfbox.deleteselecteditem'),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    preConfirm: async () => {
      const serviceError = shallowRef()
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
    allowOutsideClick: false,
  }).then(value => {
    if (value.isConfirmed) {
      if (value.value?.serviceError.value) {
        if (value.value?.serviceError.value instanceof CustomFetchError && value.value?.serviceError.value.code > 0)
          emits('handlemessage', value.value?.serviceError.value.message, MessageType.error)
        else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
      }
      else {
        emits('handlemessage', t('alert.deleteDataSuccess'), MessageType.success)
        emits('refreshdatashelf')
      }
    }
  })
}

const addcomment = () => {
  let description: ''
  let haserror = false

  Swal.fire({
    title: t('datashelfbox.loadingdesc'),
    showCloseButton: false,
    allowOutsideClick: false,
    didOpen: async () => {
      Swal.showLoading()
      try {
        description = await $api(`app/excerpt/${databoxItem.value.id}/description`, {
          method: 'GET',
          ignoreResponseError: false,
        })

        Swal.hideLoading()
        Swal.close()
      }
      catch (error) {
        if (error instanceof CustomFetchError && error.code > 0)
          emits('handlemessage', error.message, MessageType.error)
        emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
        haserror = true
      }
    },
  }).then(() => {
    if (haserror)
      return
    Swal.fire({
      input: 'textarea',
      inputLabel: t('datashelfbox.comment'),
      inputValue: description,
      inputPlaceholder: t('datashelfbox.enteryourcomment'),
      confirmButtonText: t('$vuetify.confirmEdit.ok'),
      cancelButtonText: t('$vuetify.confirmEdit.cancel'),
      showConfirmButton: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      showCloseButton: true,
      preConfirm: async value => {
        const serviceError = ref()
        try {
          await $api(`app/excerpt/${databoxItem.value.id}/description`, {
            method: 'PUT',
            body: { description: value },
            ignoreResponseError: false,
          })
          databoxItem.value.hasDescription = value.length > 0
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
            emits('handlemessage', value.value?.serviceError.value.message, MessageType.error)
          else emits('handlemessage', t('httpstatuscodes.0'), MessageType.error)
        }
        else {
          emits('handlemessage', t('alert.dataActionSuccess'), MessageType.success)
        }
      }
    })
  })
}

const decreaseOrder = async () => {
  if (props.prevItemPriority === -1)
    return

  const result = await changeOrder(props.prevItemOrder + 1)

  if (result) {
    databox.value.$el.scrollIntoView({ behavior: 'smooth', block: 'end' })
    focuToElementAfterMove()
  }
}

const increaseOrder = async () => {
  if (props.nextItemPriority === -1)
    return
  const result = await changeOrder(props.nextItemOrder + 1)
  if (result) {
    databox.value.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    focuToElementAfterMove()
  }
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

defineExpose({ increaseOrder, decreaseOrder })

// mc-data-shelf-box
</script>

<template>
  <div class="d-flex" @mouseenter="showTools = true" @mouseleave="">
    <VCard ref="databox" :class="[highlightClass]" style="overflow: visible !important;">
      <MCLoading :showloading="loadinglocal" :loadingsize="SizeType.MD" />

      <VCardText class="h-auto">
        <VRow no-gutters class="justify-start align-start box">
          <span>{{ props.itemIndex + 1 }}</span>
          <VCheckbox v-model="isSelected" density="compact" />
          <VCol>
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
          </VCol>
          <!-- position-absolute px-2 d-flex flex-column top-0 left-0 -->
        </VRow>
      </VCardText>
      <div class="box-state-container">
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
              <VBtn icon size="25" variant="text" @click="dialogDataBoxInfo = true">
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
              <VBtn v-if="databoxItem.node && databoxItem.node.id > 0" icon size="25" variant="text" @click="disconnectSelectedExcerpt">
                <VIcon icon="tabler-plug-connected-x" size="20" color="error" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.disconnect') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" @click="dialogSelectNodeVisible = true">
                <VIcon icon="tabler-plug-connected" size="20" />
                <VTooltip
                  activator="parent"
                  location="top center"
                >
                  {{ $t('datashelfbox.connecttonode') }}
                </VTooltip>
              </VBtn>
              <VBtn icon size="25" variant="text" color="error" @click="deleteSelectedExcerpt">
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
                {{ databoxItem?.priority }}
              </span>
            </VRow>
          </div>

        <!-- @node-added="nodeItemAdded" @node-added-failed="nodeaddfailed" -->
        </VRow>
      </VExpandTransition>
    </VCard>
    <MCDialogSelectNode
      v-if="dialogSelectNodeVisible" v-model:is-dialog-visible="dialogSelectNodeVisible"
      :selected-tree-id="databoxItem.treeId" @nodehasbeenselected="(nodeid) => connecttoselectedNode(nodeid)"
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
  </div>
</template>

<style lang="scss" scoped>
.v-btn--disabled {
  opacity: 0.25;
}
</style>
