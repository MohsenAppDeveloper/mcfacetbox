<script lang="ts" setup>
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/lib/components/index.mjs'
import type { FetchError } from 'ofetch'
import type { GridResult, baseDataTableModel } from '@/types/baseModels'
import { serviceDelete } from '@/services/genericServices'

// const currentdate = ref('');

const props = defineProps({
  headers: Array<any>,
  apiUrl: { type: String, required: true },
  searchLabel: { type: String, default: '' },
  activeDeleteAction: { type: Boolean, default: true },
  activeEditAction: { type: Boolean, default: true },
  gateid: { type: Number, default: 0 },
})

const emit = defineEmits<Emit>()
const toast = useToast()
interface Emit {
  (e: 'deletedItem', value: boolean): void
  (e: 'editItem', value: Record<string, any>): void
  (e: 'loadCompleted', value: Record<string, any>): void
}

// import {useTemplateRef} from vue

const { t } = useI18n({ useScope: 'global' })
const searchQuery = ref('')
const selectedItem = ref<Array<number>>([])
const selectedPlan = ref()
const selectedStatus = ref()
const highlightedItemIndex = ref(0)
const datatableItems = ref<Array<baseDataTableModel>>([])

const pageSize = ref(10)
const pageNumber = ref(1)
const sorting = ref()

const updateOptions = (options: any) => {
  if (options.sortBy && options.sortBy[0])
    sorting.value = `${options.sortBy[0].key} ${options.sortBy[0].order}`

//   orderBy.value = options.sorting[0]?.order
}

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi<GridResult<baseDataTableModel>>(createUrl(props.apiUrl, {
  query: {
    q: searchQuery,
    status: selectedStatus,
    plan: selectedPlan,
    pageSize,
    pageNumber,
    sorting,
    GateId: props.gateid,
  },
}), { immediate: false })

setTimeout(async () => {
  await fetchData(false)
}, 1000)

const datatable = ref(VDataTableServer)

onFetchResponse(response => {
//   response.json().then(value => {
  datatableItems.value.splice(0)
  resultData.value?.items.forEach(element => {
    element.disabled = false
    element.isLoading = false
    element.isSelected = false
    element.selectable = true
    datatableItems.value.push(element)
  })
  emit('loadCompleted', resultData.value?.items ?? [])
})

// })

onFetchError(response => {
  toast.error(t('alert.probleminGetInformation'))
})

const searchLabelDefault = computed(() => {
  if (props.searchLabel.length > 0)
    return props.searchLabel

  else
    return t('search')
})

const refreshData = () => {
  fetchData(false)
}

const updateAction = (dataModel: Record<string, any>) => {
  emit('editItem', dataModel)
}

const deleteAction = async (item: baseDataTableModel, index: number) => {
  selectedItem.value.push(item.id)
  Swal.fire({
    titleText: t('alert.deleteSelectedItem?'),
    confirmButtonText: t('$vuetify.confirmEdit.ok'),
    cancelButtonText: t('$vuetify.confirmEdit.cancel'),
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: true,
    preConfirm: async () => {
    //   const { serviceError } = await serviceDelete(item.id, props.apiUrl)
      const serviceError = shallowRef()
      try {
        await $api((`${props.apiUrl}/`).replace('//', '/') + item.id, {
          method: 'DELETE',
        })
      }
      catch (error) {
        serviceError.value = error

        // if (error instanceof CustomFetchError && error.code > 0)
        //   toast.error(error.message)
        // else toast.error(t('httpstatuscodes.0'))
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

        // toast.error(t('alert.deleteDataFailed'))
        emit('deletedItem', false)
      }
      else {
        refreshData()
        toast.success(t('alert.deleteDataSuccess'))
        emit('deletedItem', true)
      }
      selectedItem.value.splice(index, 1)
    }
    else {
      selectedItem.value.splice(index, 1)
    }
  })
}

const updateHighlightedItem = (index: number) => {
  highlightedItemIndex.value = index // به‌روزرسانی ایندکس هایلایت شده
}

defineExpose({ refreshData })
</script>

<template>
  <section>
    <VCard>
      <VCardTitle class="d-flex flex-wrap gap-1">
        <div class="d-flex align-center flex-wrap gap-4 ma-2">
          <!-- 👉 Search  -->
          <AppTextField
            v-model="searchQuery"
            :placeholder="searchLabelDefault"
            style="inline-size: 15.625rem;"
          />

          <!-- 👉 Add user button -->
          <!--
            <AppSelect v-model="selectedRole" placeholder="Select Role" :items="roles" clearable
            clear-icon="tabler-x" style="inline-size: 10rem;" />
            <MCInputDatePicker v-model:selected-date="currentdate"></MCInputDatePicker>
          -->

          <VSpacer />
        </div>

        <div class="d-flex gap-2 align-center ma-2 ms-auto ">
          <p class="text-body-1 mb-0">
            {{ $t('Show') }}
          </p>
          <AppSelect
            :model-value="pageSize"
            :items="[
              { value: 5, title: '5' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 5.5rem;"
            @update:model-value="pageSize = parseInt($event, 10)"
          />
        </div>
      </VCardTitle>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        ref="datatable"
        v-model="selectedItem"
        v-model:items-per-page="pageSize"
        v-model:page="pageNumber"
        item-selectable="selectable"
        :items-per-page-options="[
          { value: 5, title: '5' },
          { value: 20, title: '20' },
          { value: 50, title: '50' },
          { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
        ]"
        :items="datatableItems"
        item-value="id"
        :items-length="resultData?.totalCount === undefined ? 0 : resultData.totalCount"
        :headers="props.headers"
        class="text-no-wrap"
        height="300"
        density="compact"
        fixed-header
        show-select
        :loading="loadingdata"
        select-strategy="single"
        hover
        @update:options="updateOptions"
      >
        <!--
          <template v-for="slotName in Object.keys($slots)" #[slotName]="slotScope">
          <slot :name="slotName" :item="slotScope" />
          </template>
        -->
        <template
          v-for="header in props.headers"
          #[`item.${header.key}`]="{ item, index } "
        >
          <slot
            :name="`item.${header.key}`"
            :value="item"
          >
            <div v-if="header.key === 'actions' && (props.activeDeleteAction || props.activeEditAction)">
              <IconBtn
                v-show="props.activeDeleteAction"
                @click="deleteAction(item, index)"
              >
                <VIcon
                  v-if="!item.isLoading"
                  icon="tabler-trash"
                />
                <VProgressCircular
                  v-else
                  size="20"
                  width="3"
                  indeterminate
                />
              </IconBtn>
              <IconBtn
                v-show="props.activeEditAction"
                @click="updateAction(item)"
              >
                <VIcon icon="tabler-pencil" />
              </IconBtn>
              <slot
                name="action"
                :value="item"
              />
            </div>
            <span v-else>{{ item[header.key] }}</span>
          </slot>
        </template>
        <template #item.num="{ index }">
          {{ index + 1 + ((pageNumber - 1) * pageSize) }}
        </template>
        <template #bottom>
          <TablePagination
            v-model:page="pageNumber"
            :items-per-page="pageSize"
            :total-items="resultData?.totalCount === undefined ? 0 : resultData?.totalCount"
          />
        </template>
        <template #no-data>
          <div class="pt-5">
            <span class="ml-3">{{ $t('$vuetify.noDataText') }}</span>
            <IconBtn size="medium" @click="refreshData">
              <VIcon icon="tabler-refresh" size="32" />
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>

    <!-- 👉 Add New User -->
    <!-- <MCDialogGateAdd v-model:is-dialog-visible="isAddNewGateDialogVisible" @user-data="addNewUser" /> -->
  </section>
</template>

<style lang="scss">
.v-card-title {
  padding: 0;
}

.v-data-table__tr:has(td:first-child input[type="checkbox"]:checked) {
  background-color: #f2f2f2;
}
</style>
