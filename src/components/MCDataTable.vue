<script lang="ts" setup>
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/lib/components/index.mjs'
import { destr } from 'destr'
import type { GridResult, IRootServiceError, baseDataTableModel } from '@/types/baseModels'

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
const searchQueryFinal = ref('')
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

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(createUrl(props.apiUrl, {
  query: {
    Filter: searchQueryFinal,
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

watch(searchQuery, () => {
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    setTimeout(() => {
      searchQueryFinal.value = searchQuery.value
    }, 2000)
  }
})
onFetchResponse(() => {
//   response.json().then(value => {
  try {
    const result = resultData.value as GridResult<baseDataTableModel>

    datatableItems.value.splice(0)
    result.items.forEach(element => {
      element.disabled = false
      element.isLoading = false
      element.isSelected = false
      element.selectable = true
      datatableItems.value.push(element)
    })
    emit('loadCompleted', result.items ?? [])
  }
  catch (error) {
    toast.error(t('alert.probleminLoadInformation'))
  }
})

// })

onFetchError(() => {
  try {
    const result = resultData.value as IRootServiceError
    if (result && result.error && result.error.message)
      toast.error(result.error.message)
    else
      toast.error(t('alert.probleminGetInformation'))
  }
  catch (error) {
    toast.error(t('alert.probleminLoadInformation'))
  }
})

const searchLabelDefault = computed(() => {
  if (props.searchLabel.length > 0)
    return props.searchLabel

  else
    return t('search')
})

const refreshData = async () => {
  await fetchData(false)
}

const updateAction = (dataModel: Record<string, any>) => {
  emit('editItem', dataModel)
}

const deleteAction = async (item: baseDataTableModel, index: number) => {
  selectedItem.value.push(item.id)

  const serviceError = shallowRef()

  const result = await confirmSwal(
    t('alert.deleteSelectedItem?'),
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api((`${props.apiUrl}/`).replace('//', '/') + item.id, {
          method: 'DELETE',
        })
      }
      catch (error) {
        serviceError.value = error
      }
    },
  )

  if (result.isConfirmed) {
    const err = serviceError.value
    if (err) {
      if (err instanceof CustomFetchError && err.message)
        toast.error(err.message)
      else toast.error(t('httpstatuscodes.0'))
    }
    else {
      refreshData()
      toast.success(t('alert.deleteDataSuccess'))
      emit('deletedItem', true)
    }
  }
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
            clearable
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
