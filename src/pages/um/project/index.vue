<script setup lang="ts">
// !SECTION این فرم برای مدیریت پروژه ها در این سامانه میباشد
import { useToast } from 'vue-toastification'
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCDataTable from '@/components/MCDataTable.vue'
import type { ISimpleDTO } from '@/types/baseModels'
import type { ITreeTitle } from '@/types/tree'

const { t } = useI18n({ useScope: 'global' })
const mcdatatableProject = ref(MCDataTable)
const mcdatatableTree = ref(MCDataTable)
const dialogProject = ref(VDialog)
const dialogTree = ref(VDialog)
const isAddNewProjectDialogVisible = ref(false)
const isAddNewTreeDialogVisible = ref(false)
const projectApiUrl = 'app/project'
const treeApiUrl = 'app/tree'
const treeDataItems = ref<ITreeTitle[]>([])

const toast = useToast()

// GateHeaders
const projectHeaders = [
  { title: t('project.title'), key: 'title' },
  { title: t('role.trees'), key: 'trees', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
  { title: t('description'), key: 'description', sortable: false },
  { title: t('status'), key: 'isActive', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },
]

const treeHeaders = [
  { title: t('tree.title'), key: 'title' },
  { title: t('tree.autorizedbook'), key: 'book' },
  { title: t('description'), key: 'description', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
  { title: t('status'), key: 'isActive', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },

]

const projectEdit = (dataItem: Record<string, any>) => {
  isAddNewProjectDialogVisible.value = true
  dialogProject.value.updateProject({ ...dataItem })
}

const treeEdit = (dataItem: Record<string, any>) => {
  isAddNewTreeDialogVisible.value = true
  dialogTree.value.updateTreeTitle({ ...dataItem })
}

const projectDataAdded = (projectDataId: number) => {
  mcdatatableProject.value.refreshData()
}

const treeTitleDataAdded = (treeDataId: number) => {
  mcdatatableTree.value.refreshData()
}

const treeLoadCompleted = (dataItems: ITreeTitle[]) => {
  console.log('treedatabefor', dataItems)

  treeDataItems.value.splice(0)
  treeDataItems.value.push(...dataItems)
  console.log('treedataafter', treeDataItems)
}

const selectBook = (treeid: number) => {

}
</script>

<template>
  <section>
    <VRow no-gutters justify="space-between" align="center">
      <div class="page-title">
        {{ $t('project.pageTitle') }}
      </div>

      <VBtn prepend-icon="tabler-plus" @click="isAddNewProjectDialogVisible = true">
        {{ $t('project.add') }}
      </VBtn>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VDivider />
          <MCDataTable
            ref="mcdatatableProject" :headers="projectHeaders" :api-url="projectApiUrl"
            @edit-item="projectEdit"
          >
            <template #item.trees="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.trees && value.trees.map((item: ISimpleDTO) => `${item.title}`).join(' ,') }}
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
          </MCDataTable>
        </VCard>
      </VCol>
    </VRow>

    <VRow no-gutters justify="space-between" align="center" class="mt-6">
      <div class="page-title">
        {{ $t('tree.pageTitle') }}
      </div>
      <VBtn prepend-icon="tabler-plus" @click="isAddNewTreeDialogVisible = true">
        {{ $t('tree.add') }}
      </VBtn>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard>
          <MCDataTable
            ref="mcdatatableTree" :headers="treeHeaders" :api-url="treeApiUrl"
            @edit-item="treeEdit" @load-completed="treeLoadCompleted"
          >
            <template #item.book="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.book && value.book.map((item: ISimpleDTO) => `${item.title}`).join(' ,') }}
              </div>
            </template>
            <template #action="{ value }">
              <IconBtn @click="selectBook(value.id)">
                <VIcon icon="tabler-books" />
              </IconBtn>
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
          </MCDataTable>
        </VCard>
      </VCol>
    </VRow>
    <!-- 👉 Add New User -->
    <MCDialogProjectAdd
      ref="dialogProject" v-model:is-dialog-visible="isAddNewProjectDialogVisible"
      :api-url="projectApiUrl" :tree-list="treeDataItems" @project-data-added="projectDataAdded"
    />
    <MCDialogTreeAdd
      ref="dialogTree" v-model:is-dialog-visible="isAddNewTreeDialogVisible"
      :api-url="treeApiUrl" @tree-title-data-added="treeTitleDataAdded"
    />
  </section>
</template>
