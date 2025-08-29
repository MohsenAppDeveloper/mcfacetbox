<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCDataTable from '@/components/MCDataTable.vue'
import { MessageType } from '@/types/baseModels'
import type { ISimpleDTO, baseDataTableModel } from '@/types/baseModels'
import type { TreeUserRoleModel } from '@/types/tree'
import MCDialogUserRoleSelect from '@/components/dialogs/MCDialogUserRoleSelect.vue'

const { t } = useI18n({ useScope: 'global' })
const mcdatatableTree = ref(MCDataTable)
const dialogTree = ref(VDialog)
const isAddNewTreeDialogVisible = shallowRef(false)
const dialogAddTreeUserRole = shallowRef(false)
const dialogSelectBookVisible = shallowRef(false)
const dialogTreeWordReport = shallowRef(false)

const treeApiUrl = 'app/tree'
const router = useRoute('um-gate-id-project')

const expandedDetails = ref<Record<number, { loading: boolean; data?: TreeUserRoleModel[] }>>({})

const currentGateId = computed((): number => {
  return useToNumber(router.params.id).value
})

const currentTreeId = shallowRef<number>(0)
const currentUserId = shallowRef<string>('0')
const toast = useToast()
const selectedFile = ref(null)

const treeHeaders = [
  { text: '0', value: 'num', sortable: false },
  { title: t('tree.title'), key: 'title' },
  { title: t('tree.autorizedbook'), key: 'book' },
  { title: t('description'), key: 'description', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
  { title: t('status'), key: 'isActive', sortable: false },
  { width: 1, key: 'data-table-expand', align: 'end' },
  { title: t('actions'), key: 'actions', sortable: false },

]

const treeEdit = (dataItem: Record<string, any>) => {
  isAddNewTreeDialogVisible.value = true
  nextTick(() => dialogTree.value.updateTreeTitle(dataItem.id))
}

function handleMessages(message: string, messagetype: MessageType) {
  switch (messagetype) {
  case MessageType.error:
    toast.error(message)
    break;
  case MessageType.info:
    toast.info(message)
    break;
  case MessageType.warning:
    toast.warning(message)
    break;
  case MessageType.success:
    toast.success(message)
    break;
  default:
    break;
  }
}

const tableHeight = computed(() => {
  // اینجا مثلا 100% ارتفاع parent - فضای header و title
  return 'calc(100vh - 300px)' // عدد رو متناسب با هدر صفحه‌ات بزن
})

const treeTitleDataAdded = () => {
  mcdatatableTree.value.refreshData()
}

const fileInput = ref()

const exportword = async (item: baseDataTableModel) => {
  item.isLoading = true
  try {
    await $api(`app/tree/${item.id}/word`, {
      method: 'PUT',
    })
    item.wordCreationTime = Date.now().toString()
    window.open(`${import.meta.env.VITE_API_URL}app/tree/${item.id}/word`, '_blank')
    toast.success(t('alert.dataActionSuccess'))
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
  finally {
    item.isLoading = false
  }
}

const openword = (item: baseDataTableModel) => {
  window.location.href = `${import.meta.env.VITE_API_URL}app/tree/${item.id}/word`
}

const importword = async (myevent: Event, item: baseDataTableModel) => {
  if (myevent?.target?.files[0]) {
    selectedFile.value = myevent?.target?.files[0]

    item.isLoading = true
    try {
      const formData = new FormData()

      formData.append('file', selectedFile.value)

      await $api(`app/tree/${item.id}/word`, {
        method: 'POST',
        body: formData,
      })

      toast.success(t('alert.creationtreehasbeensucceded'))
    }
    catch (error) {
      if (error instanceof CustomFetchError && error.code !== '0')
        toast.error(error.message)
      else toast.error(t('httpstatuscodes.0'))
    }
    finally {
      item.isLoading = false
    }
  }

//   open()
}

const deleteUserRole = async (item: baseDataTableModel, userid: string) => {
  const serviceError = shallowRef()

  const result = await confirmSwal(
    t('alert.deleteSelectedItem?'),
    '',
    t('$vuetify.confirmEdit.ok'),
    t('$vuetify.confirmEdit.cancel'),
    true, 'warning',
    async () => {
      try {
        await $api(`app/tree/${item.id}/user/${userid}`, {
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
      onToggleExpandRow(item, true, true)
      toast.success(t('alert.deleteDataSuccess'))
    }
  }

//   open()
}

async function fetchRowDetails(id: number) {
  expandedDetails.value[id] = { loading: true }
  try {
    const res = await $api<TreeUserRoleModel[]>(`app/tree/${id}/user`)

    expandedDetails.value[id] = { loading: false, data: res }
  }
  catch (err) {
    expandedDetails.value[id] = { loading: false, data: undefined }
  }
  finally {
    // item.isLoading = false
  }
}

function onToggleExpandRow(item: baseDataTableModel, isExpanded: boolean, reset: boolean) {
  if (reset && expandedDetails.value[item.id])
    delete expandedDetails.value[item.id]

  if (isExpanded && !expandedDetails.value[item.id])
    fetchRowDetails(item.id)
}
function triggerFileInput() {
  fileInput.value.click()
}
function userRoleHasBeenAdded(treeid: number) {
  fetchRowDetails(treeid)
}
</script>

<template>
  <div style="height: 95%;">
    <VRow no-gutters justify="space-between" align="center" class="mt-6" style="height: 5%;">
      <div class="page-title">
        {{ $t('tree.pageTitle') }}
      </div>
      <VBtn prepend-icon="tabler-plus" @click="isAddNewTreeDialogVisible = true">
        {{ $t('tree.add') }}
      </VBtn>
      <!-- <MCInputDatePicker v-model:selected-date="currentdate" /> -->
    </VRow>
    <VRow style="height: 95%;">
      <VCol cols="12" style="height: 100%;">
        <MCDataTable
          ref="mcdatatableTree" height="100%" :headers="treeHeaders" :api-url="treeApiUrl" :gateid="currentGateId" :tableheight="tableHeight"
          @edit-item="treeEdit"
        >
          <template #item.book="{ value }">
            <div class="d-flex align-center gap-x-4">
              {{ value.book && value.book.map((item: ISimpleDTO<number>) => `${item.title}`).join(' ,') }}
            </div>
          </template>
          <template #item.creationTime="{ value }">
            <div class="d-flex align-center gap-x-4">
              {{ usePersianDate(value.creationTime) }}
            </div>
          </template>
          <template #item.isActive="{ value }">
            <VChip
              :color="resolveActiveColor(value.isActive)"
              :class="`text-${resolveActiveColor(value.isActive)}`" size="small"
              class="font-weight-medium"
            >
              {{ $t(resolveActiveTitle(value.isActive)) }}
            </VChip>
          </template>
          <template #action="{ value }">
            <!--
              <IconBtn @click="selectBook(value.id)">
              <VIcon icon="tabler-books" />
              </IconBtn>
            -->
            <IconBtn @click="exportword(value)">
              <VTooltip location="right center">
                <template #activator="{ props }">
                  <VIcon icon="tabler-table-export" v-bind="props" />
                </template>
                {{ formatString($t('tree.exportword')) }}
              </VTooltip>
            </IconBtn>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              accept=".doc,.docx"
              @change="importword($event, value)"
            >
            <IconBtn @click="triggerFileInput">
              <VTooltip location="right center">
                <template #activator="{ props }">
                  <VIcon icon="tabler-table-import" v-bind="props" />
                </template>
                {{ formatString($t('tree.importword')) }}
              </VTooltip>
            </IconBtn>
            <IconBtn v-if="value.wordCreationTime" @click="openword(value)">
              <VTooltip location="right center">
                <template #activator="{ props }">
                  <VIcon icon="tabler-cloud-download" v-bind="props" />
                </template>
                {{ `${formatString($t('tree.getlastword'))} ${usePersianDate(value.wordCreationTime)}` }}
              </VTooltip>
            </IconBtn>
            <IconBtn @click="() => { currentTreeId = value.id, dialogTreeWordReport = true }">
              <VTooltip location="right center">
                <template #activator="{ props }">
                  <VIcon icon="tabler-chart-bar" v-bind="props" />
                </template>
                {{ $t('workReport') }}
              </VTooltip>
            </IconBtn>
          </template>

          <template #item.data-table-expand="{ value, internalItem, isExpanded, onToggleExpand }">
            <IconBtn @click="() => { onToggleExpand(internalItem); onToggleExpandRow(value, isExpanded(internalItem), false) }">
              <VTooltip location="right center">
                <template #activator="{ props }">
                  <VIcon :icon="isExpanded(internalItem) ? 'tabler-lock-open' : 'tabler-lock'" v-bind="props" />
                </template>
                {{ `${formatString($t('project.permissions'))}` }}
              </VTooltip>
            </IconBtn>
          </template>
          <template #expanded-row="{ columns, item, isExpanded }">
            <tr>
              <td :colspan="columns.length" class="py-2">
                <div v-if="expandedDetails[item.id]?.loading" class="w-100 d-flex" style="justify-content: center;">
                  <VProgressCircular indeterminate size="16" width="2" />
                </div>
                <div v-else-if="isNullOrUndefined(expandedDetails[item.id]?.data)" class="w-100 d-flex" style="justify-content: center;">
                  <span class="ml-3">{{ $t('$vuetify.noDataText') }}</span>
                  <IconBtn size="medium" @click="onToggleExpandRow(item, true, true)">
                    <VIcon icon="tabler-refresh" size="22" />
                  </IconBtn>
                </div>
                <VSheet v-else rounded="lg" border>
                  <VTable density="compact">
                    <tbody class="bg-surface-light">
                      <tr>
                        <th>{{ $t('user.name') }}</th>
                        <th :colspan="columns.length - 1">
                          {{ $t('role.pageTitle') }}
                        </th>
                        <th />
                        <th class="text-end">
                          <VBtn append-icon="tabler-plus" size="small" variant="text" @click="() => { currentTreeId = item.id, dialogAddTreeUserRole = true }">
                            {{ $t('user.add') }}
                          </VBtn>
                        </th>
                      </tr>
                    </tbody>

                    <tbody>
                      <tr v-for="detailItem in expandedDetails[item.id].data" :key="detailItem.id">
                        <td>
                          {{ detailItem.fullName }}
                        </td>
                        <td>
                          {{ detailItem.roles.map((role) => role.title).join(' , ') }}
                        </td>
                        <td>
                          <div v-if="!item.isLoading">
                            <IconBtn @click="deleteUserRole(item, detailItem.id.toString())">
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
                            <IconBtn :color="detailItem.bookCount > 0 ? 'warning' : ''" @click="() => { currentTreeId = item.id, currentUserId = detailItem.userId, dialogSelectBookVisible = true }">
                              <VTooltip location="top center">
                                <template #activator="{ props }">
                                  <VIcon icon="tabler-books" v-bind="props" />
                                </template>
                                {{ formatString($t('bookrangelimit')) }}
                              </VTooltip>
                            </IconBtn>

                            <!--
                              <IconBtn @click="editUserRole(item)">
                              <VIcon icon="tabler-pencil" />
                              </IconBtn>
                            -->
                          </div>
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </vtable>
                </vsheet>
              </td>
            </tr>
          </template>
        </MCDataTable>
      </VCol>
    </VRow>
    <MCDialogTreeAdd
      v-if="isAddNewTreeDialogVisible" ref="dialogTree" v-model:is-dialog-visible="isAddNewTreeDialogVisible"
      :api-url="treeApiUrl" :gate-id="currentGateId" @tree-title-data-added="treeTitleDataAdded" @tree-title-data-updated="treeTitleDataAdded"
    />
    <MCDialogUserRoleSelect v-if="dialogAddTreeUserRole" v-model:is-dialog-visible="dialogAddTreeUserRole" :gate-id="currentGateId" :treeid="currentTreeId" @user-role-has-been-added="userRoleHasBeenAdded" @error-has-occured="(message) => toast.error(message)" />
    <MCDialogBookSelect
      v-if="dialogSelectBookVisible" v-model:is-dialog-visible="dialogSelectBookVisible" :treeid="currentTreeId" :user-id="currentUserId"
      @set-book-permission-has-occured="fetchRowDetails" @handlemessage="handleMessages"
    />
    <MCDialogTreeWorkReport v-if="dialogTreeWordReport" v-model:is-dialog-visible="dialogTreeWordReport" :gateid="currentGateId" :serviceurl="`app/tree/${currentTreeId}/user/activity`" @handlemessage="handleMessages" />
  </div>
</template>
