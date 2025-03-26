<script setup lang="ts">
// !SECTION این فرم برای مدیریت پروژه ها در این سامانه میباشد
import { useToast } from 'vue-toastification'
import { VDialog } from 'vuetify/lib/components/index.mjs'
import MCDataTable from '@/components/MCDataTable.vue'
import type { ISimpleDTO } from '@/types/baseModels'

const { t } = useI18n({ useScope: 'global' })
const mcdatatableProject = ref(MCDataTable)
const mcdatatableTree = ref(MCDataTable)
const dialogProject = ref(VDialog)
const dialogTree = ref(VDialog)
const isAddNewProjectDialogVisible = ref(false)
const isAddNewTreeDialogVisible = ref(false)
const projectApiUrl = 'app/project'
const treeApiUrl = 'app/tree'
const router = useRoute('um-gate-id-project')

const currentGateId = computed((): number => {
  return useToNumber(router.params.id).value
})

const toast = useToast()

// GateHeaders
const projectHeaders = [
  { text: '0', value: 'num', sortable: false },
  { title: t('project.title'), key: 'title' },
  { title: t('role.trees'), key: 'trees', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
  { title: t('description'), key: 'description', sortable: false },
  { title: t('status'), key: 'isActive', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },
]

const treeHeaders = [
  { text: '0', value: 'num', sortable: false },
  { title: t('tree.title'), key: 'title' },
  { title: t('tree.autorizedbook'), key: 'book' },
  { title: t('description'), key: 'description', sortable: false },
  { title: t('createDate'), key: 'creationTime' },
  { title: t('status'), key: 'isActive', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false },

]

const projectEdit = (dataItem: Record<string, any>) => {
  isAddNewProjectDialogVisible.value = true
  nextTick(() => dialogProject.value.updateProject(dataItem.id))
}

const treeEdit = (dataItem: Record<string, any>) => {
  isAddNewTreeDialogVisible.value = true
  nextTick(() => dialogTree.value.updateTreeTitle(dataItem.id))
}

const projectDataAdded = () => {
  nextTick(() => mcdatatableProject.value.refreshData())
}

const treeTitleDataAdded = () => {
  console.log('treeTitleDataAdded')

  mcdatatableTree.value.refreshData()
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
            ref="mcdatatableProject" :headers="projectHeaders" :api-url="projectApiUrl" :gateid="currentGateId"
            @edit-item="projectEdit"
          >
            <template #item.trees="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.trees && value.trees.map((item: ISimpleDTO<number>) => `${item.title}`).join(' ,') }}
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
            ref="mcdatatableTree" :headers="treeHeaders" :api-url="treeApiUrl" :gateid="currentGateId"
            @edit-item="treeEdit"
          >
            <template #item.book="{ value }">
              <div class="d-flex align-center gap-x-4">
                {{ value.book && value.book.map((item: ISimpleDTO<number>) => `${item.title}`).join(' ,') }}
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
    <MCDialogProjectAdd
      v-if="isAddNewProjectDialogVisible" ref="dialogProject" v-model:is-dialog-visible="isAddNewProjectDialogVisible"
      :api-url="projectApiUrl" :gate-id="currentGateId" @project-data-added="projectDataAdded" @project-data-updated="projectDataAdded"
    />
    <MCDialogTreeAdd
      v-if="isAddNewTreeDialogVisible" ref="dialogTree" v-model:is-dialog-visible="isAddNewTreeDialogVisible"
      :api-url="treeApiUrl" :gate-id="currentGateId" @tree-title-data-added="treeTitleDataAdded" @tree-title-data-updated="treeTitleDataAdded"
    />
  </section>
</template>
