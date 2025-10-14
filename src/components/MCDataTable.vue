<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/lib/components/index.mjs'
import { boolean } from 'zod'
import type { GridResult, IRootServiceError, baseDataTableModel } from '@/types/baseModels'
import { QueryRequestModel } from '@/types/baseModels'

// const currentdate = ref('');

const props = defineProps({
  headers: Array<any>,
  apiUrl: { type: String, required: true },
  searchLabel: { type: String, default: '' },
  activeDeleteAction: { type: Boolean, default: true },
  activeEditAction: { type: Boolean, default: true },
  gateid: { type: Number, default: 0 },
  defaultPageSize: { type: Number, default: 10 },

  autostart: { type: Boolean, default: true },
  tableheight: { type: String, default: '' },
  showsearch: { type: Boolean, default: true },
  rowSelectable: { type: Boolean, default: true },
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
const highlightedItemIndex = ref(0)
const datatableItems = ref<Array<baseDataTableModel>>([])
const querymodel = reactive<QueryRequestModel>(new QueryRequestModel())
const pageSize = ref(10)
const pageNumber = ref(1)

// const sorting = ref()
const sortby = ref()

const serverURL = createUrl(() => props.apiUrl, {
  query: querymodel,
})

const { data: resultData, execute: fetchData, isFetching: loadingdata, onFetchResponse, onFetchError } = useApi(serverURL, { immediate: false, refetch: false })

setTimeout(async () => {
  if (props.autostart)
    await fetchData(false)
}, 1000)

const datatable = ref(VDataTableServer)

watch(querymodel, async newval => {
  await fetchData()
})
watch(pageSize, async () => {
  if (pageSize.value !== querymodel.PageSize)
    querymodel.PageSize = pageSize.value

  // await fetchData()
})
watch(pageNumber, async () => {
  if (pageNumber.value !== querymodel.PageNumber)
    querymodel.PageNumber = pageNumber.value

  // await fetchData()
})
watch(sortby, async () => {
  if (sortby.value[0])
    querymodel.Sorting = `${sortby.value[0].key} ${sortby.value[0].order}`
  else querymodel.Sorting = ''

//   await fetchData()
})
watch(searchQuery, () => {
  if ((searchQuery.value.length > 2 || searchQuery.value.length === 0) && (querymodel.Filter !== searchQuery.value)) {
    setTimeout(() => {
      querymodel.Filter = searchQuery.value
    }, 1000)
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
  if (pageSize.value !== props.defaultPageSize) {
    querymodel.PageSize = props.defaultPageSize
    pageSize.value = props.defaultPageSize
  }
  else { await fetchData(false) }
}

const updateAction = (dataModel: Record<string, any>) => {
  emit('editItem', dataModel)
}

const deleteAction = async (item: baseDataTableModel, index: number) => {
  selectedItem.value.splice(0)
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
  <VCard>
    <div class="d-flex flex-row gap-1 py-2">
      <!-- 👉 Search  -->
      <AppTextField
        v-if="props.showsearch"
        v-model="searchQuery"
        :placeholder="searchLabelDefault"
        style="inline-size: 15.625rem;"
        clearable
        @click:clear="() => { searchQuery = '';searchQueryFinal = '' }"
      />

      <!--
        <AppSelect
        v-model="selectedRole" placeholder="Select Role" :items="roles" clearable
        clear-icon="tabler-x" style="inline-size: 10rem;"
        />
      -->

      <div>
        <slot name="tools" />
      </div>
    </div>

    <VDivider />

    <VDataTableServer
      ref="datatable"
      v-model:sort-by="sortby"
      v-model="selectedItem"
      v-model:items-per-page="pageSize"
      v-model:page="pageNumber"
      item-selectable="selectable"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 30, title: '30' },
        { value: 50, title: '50' },
        { value: 75, title: '75' },
        { value: 100, title: '100' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
      fixed-header
      fixed-footer
      :items="datatableItems"
      item-value="id"
      :items-length="resultData?.totalCount === undefined ? 0 : resultData.totalCount"
      :headers="props.headers"
      class="text-no-wrap text-body-2"
      :height="props.tableheight"
      density="compact"
      :show-select="props.rowSelectable"
      :loading="loadingdata"
      select-strategy="single"
      hover
    >
      <!--
        <template v-for="slotName in Object.keys($slots)" #[slotName]="slotScope">
        <slot :name="slotName" :item="slotScope" />
        </template>
      -->
      <template
        v-for="slotName in Object.keys($slots).filter(s => !s.startsWith('item.'))"
        #[slotName]="slotScope"
        :key="slotName"
      >
        <slot :name="slotName" v-bind="slotScope" />
      </template>
      <template
        v-for="header in props.headers"
        #[`item.${header.key}`]="{ item, index, toggleExpand, internalItem, isExpanded } "
      >
        <slot
          :name="`item.${header.key}`"
          :value="item"
          :internal-item="internalItem"
          :is-expanded="isExpanded"
          @toggleExpand="toggleExpand(internalItem)"
        >
          <div v-if="header.key === 'actions' && (props.activeDeleteAction || props.activeEditAction)" :key="header.key">
            <div v-if="!item.isLoading">
              <IconBtn
                v-show="props.activeDeleteAction"
                @click="deleteAction(item, index)"
              >
                <VIcon icon="tabler-trash" color="error" />
                <!--
                  <VProgressCircular
                  v-else
                  size="20"
                  width="3"
                  indeterminate
                  />
                -->
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
                :internal-item="internalItem"
                :is-expanded="isExpanded(item)"
                @toggleExpand="toggleExpand(internalItem)"
              />
            </div>
            <VProgressCircular
              v-else
              size="20"
              width="3"
              indeterminate
            />
          </div>
          <span v-else>{{ item[header.key] }}</span>
        </slot>
      </template>
      <template #item.num="{ index }">
        {{ index + 1 + ((pageNumber - 1) * pageSize) }}
      </template>
      <template #bottom>
        <div class="d-flex flex-row">
          <TablePagination
            v-model:page="pageNumber"
            :items-per-page="pageSize"
            :total-items="resultData?.totalCount === undefined ? 0 : resultData?.totalCount"
          />
          <div class="d-flex gap-2 align-center ma-2 ms-auto ">
            <p class="text-body-1 mb-0">
              {{ $t('Show') }}
            </p>
            <AppSelect
              :model-value="pageSize"
              :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: 1000, title: '1000' },

              ]"
              style="inline-size: 5.5rem;"
              @update:model-value="pageSize = parseInt($event, 10)"
            />
          </div>
        </div>
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
  </VCard>
</template>

<style lang="scss">
.v-card-title {
  padding: 0;
}

.v-data-table__tr:has(td:first-child input[type="checkbox"]:checked) {
  background-color: #f2f2f2;
}
</style>
