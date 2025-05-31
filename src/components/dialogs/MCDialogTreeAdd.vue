<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پروژه میباشد
import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import type { ITreeTitle } from '@/types/tree'
import { TreeTitleModel } from '@/types/tree'

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
  (e: 'treeTitleDataAdded'): void
  (e: 'treeTitleDataUpdated'): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const opening = ref(false)
const treeTitleData = reactive<ITreeTitle>(new TreeTitleModel())

const onReset = () => {
  isloading.value = false
  treeTitleData.id = 0
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

async function projectAdd() {
  treeTitleData.gateId = props.gateId ?? 0
  try {
    await $api(props.apiUrl === undefined ? '' : props.apiUrl, {
      method: 'POST',
      body: JSON.parse(JSON.stringify(treeTitleData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('treeTitleDataAdded')
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

async function projectEdit() {
  treeTitleData.gateId = props.gateId ?? 0
  try {
    await $api((`${props.apiUrl}/`).replace('//', '/') + treeTitleData.id, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(treeTitleData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('treeTitleDataUpdated')
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
      if (treeTitleData.id > 0)
        projectEdit()

      else
        projectAdd()
    }
  })
}

const updateTreeTitle = async (treeId: number) => {
  try {
    opening.value = true

    const treeDataItem = await $api<ITreeTitle>(`app/tree/${treeId}`)

    Object.assign(treeTitleData, treeDataItem)

    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }
}

defineExpose({ updateTreeTitle })
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <VCard flat :title="$t('tree.addedit')" :subtitle="$t('tree.addeditsubtitle')" :loading="opening">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="treeTitleData.title" autofocus
                :rules="[requiredValidator(treeTitleData.title, $t('validatorrequired'))]"
                :label="$t('tree.title')" placeholder=""
              />
            </VCol>
            <VCol cols="12">
              <VRow>
                <VCol cols="12" align-self="end">
                  <VSwitch v-model="treeTitleData.isActive" :label="$t('active')" />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <AppTextarea
                v-model="treeTitleData.description" :label="$t('description')"
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
