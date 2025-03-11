<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پروژه میباشد
import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import { serviceAdd, serviceUpdate } from '@/services/genericServices'
import type { IProject } from '@/types/project'
import { ProjectModel } from '@/types/project'
import type { ITreeTitle } from '@/types/tree'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
  apiUrl: String,
  treeList: { type: Array<ITreeTitle> },
})

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'projectDataAdded', value: number): void
  (e: 'projectDataUpdated', value: number): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const projectData = reactive<IProject>(new ProjectModel())

// const treeList = reactive([{ id: 1, title: 'پژوهشگر' }, { id: 2, title: 'مدیر کل' }, { id: 3, title: 'ناظر' }, { id: 4, title: 'ارزیاب یک' }, { id: 5, title: 'ارزیاب دو' }, { id: 6, title: 'مدیر نظارت' }, { id: 7, title: 'خواندنی' }])
const selectedTrees = ref<number[]>([])

// const selectedRoles = ref([5, 1])

watch(selectedTrees, (newvalue, oldvalue) => {
  projectData.trees = props.treeList?.filter(item => selectedTrees.value.includes(item.id)).map(item => item.id) ?? []
})

const onReset = () => {
  isloading.value = false
  projectData.id = 0
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

async function projectAdd() {
  projectData.gateId = 3

  const { serviceData, serviceError } = await serviceAdd<IProject>(projectData, props.apiUrl === undefined ? '' : props.apiUrl)
  if (serviceData.value) {
    toast.success(t('alert.dataActionSuccess'))
    emit('projectDataAdded', serviceData.value)
    emit('update:isDialogVisible', false)
    nextTick(() => {
      onReset()
    })
  }
  else if (serviceError.value) {
    toast.error(t('alert.dataActionFailed'))
  }
  isloading.value = false
}

async function projectEdit() {
  projectData.gateId = 3

  const { serviceData, serviceError } = await serviceUpdate<IProject>(projectData, projectData.id, props.apiUrl === undefined ? '' : props.apiUrl)
  if (serviceData.value) {
    toast.success(t('alert.dataActionSuccess'))
    emit('projectDataUpdated', serviceData.value)
    emit('update:isDialogVisible', false)
    nextTick(() => {
      onReset()
    })
  }
  else if (serviceError.value) {
    toast.error(t('alert.dataActionFailed'))
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

const updateProject = (projectDataItem: IProject) => {
  objectMap(projectData, useCloned(projectDataItem))
  selectedTrees.value = projectData.trees.map(item => item.id)
}

defineExpose({ updateProject })
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <VCard flat :title="$t('project.addedit')" :subtitle="$t('project.addeditsubtitle')">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
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
                    v-model="selectedTrees" :items="props.treeList" item-title="title"
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
                placeholder="Write note here..." :rows="4"
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
