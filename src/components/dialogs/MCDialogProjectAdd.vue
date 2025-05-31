<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پروژه میباشد
import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import type { IProject, IProjectEdit, IProjectView } from '@/types/project'
import { ProjectEditModel, ProjectModel } from '@/types/project'
import type { GridResult, ISimpleDTO } from '@/types/baseModels'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
  apiUrl: String,
  gateId: Number,
})

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'projectDataAdded'): void
  (e: 'projectDataUpdated'): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const opening = ref(false)
const projectData = reactive<IProjectEdit>(new ProjectEditModel())
const selectedTrees = ref<number[]>([])
const treeList = ref<ISimpleDTO<number>[]>([])

// const selectedRoles = ref([5, 1])

watch(selectedTrees, () => {
  projectData.trees = treeList.value.filter(item => selectedTrees.value.includes(item.id)).map(item => item.id) ?? []
})

const onReset = () => {
  isloading.value = false
  projectData.id = 0
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

async function projectAdd() {
  projectData.gateId = props.gateId ?? 0
  projectData.isActive = isNullOrUndefined(projectData.isActive) ? false : projectData.isActive
  try {
    await $api(props.apiUrl === undefined ? '' : props.apiUrl, {
      method: 'POST',
      body: JSON.parse(JSON.stringify(projectData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('projectDataAdded')
    emit('update:isDialogVisible', false)
    nextTick(() => {
      onReset()
    })
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
  isloading.value = false
}

const loadTreeTitles = async () => {
  const treeDataResult = await $api<GridResult<ISimpleDTO<number>>>(`app/tree/simple?GateId=${props.gateId}`)

  treeList.value.splice(0)
  treeList.value.push(...treeDataResult.items.map<ISimpleDTO<number>>(item => ({ id: item.id, title: item.title })))
}

onMounted(async () => {
  try {
    opening.value = true
    await loadTreeTitles()
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }
})
async function projectEdit() {
  projectData.gateId = props.gateId ?? 0
  try {
    await $api((`${props.apiUrl}/`).replace('//', '/') + projectData.id, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(projectData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('projectDataUpdated')
    emit('update:isDialogVisible', false)
    nextTick(() => {
      onReset()
    })
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
  isloading.value = false
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      isloading.value = true
      if (projectData.id > 0)
        projectEdit()

      else
        projectAdd()
    }
  })
}

// watch(userData.role, (newdata, olddata) => {
//     console.log('watchuserdata', newdata, olddata);
// })

const updateProject = async (projectId: number) => {
  try {
    opening.value = true

    const projectDataResult = await $api<IProjectView>(`app/project/${projectId}`)

    // await loadTreeTitles()

    projectData.id = projectDataResult.id
    projectData.description = projectDataResult.description
    projectData.title = projectDataResult.title
    projectData.isActive = projectDataResult.isActive
    projectData.trees = projectDataResult.trees.map(item => item.id)
    selectedTrees.value.splice(0)
    selectedTrees.value.push(...projectData.trees)
    console.log('projecttree', projectData.trees)
    console.log('selectedTrees', selectedTrees.value)

    // Object.assign(projectData, projectDataResult)

    opening.value = false
  }
  catch (error) {
    console.log('treedataerror', error)

    opening.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }
}

defineExpose({ updateProject })
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <VCard flat :title="$t('project.addedit')" :subtitle="$t('project.addeditsubtitle')" :loading="opening">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="projectData.title"
                :rules="[requiredValidator(projectData.title, $t('validatorrequired'))]"
                :label="$t('project.title')" placeholder=""
              />
            </VCol>
            <VCol cols="12">
              <VRow>
                <!-- 👉 Name -->
                <VCol sm="10" cols="12">
                  <AppAutocomplete
                    v-model="selectedTrees" :items="treeList" item-title="title"
                    item-value="id" :label="$t('role.treeselect')"
                    :rules="[requiredValidator(projectData.trees, $t('validatorrequired'))]" chips
                    closable-chips multiple
                  />
                  <!-- :rules="[requiredValidator(userData.role, $t('validatorrequired'))]"  -->
                </VCol>

                <VCol sm="2" cols="12" align-self="end">
                  <VSwitch v-model="projectData.isActive" :label="$t('active')" />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <AppTextarea
                v-model="projectData.description" :label="$t('description')"
                :placeholder="$t('writenotehere')" :rows="4"
              />
            </VCol>
            <VCol cols="12">
              <VBtn type="submit" class="me-3" :loading="isloading">
                <span>
                  {{ $t('accept') }}
                </span>
              </VBtn>
              <VBtn type="reset" variant="tonal" color="error" :disabled="isloading" @click="onReset">
                {{ $t('cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>
