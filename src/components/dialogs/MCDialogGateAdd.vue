<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import { serviceAdd, serviceUpdate } from '@/services/genericServices'
import type { GateProperties, IGateNewItem } from '@/types/gate'
import { GateNewItemModel, GatePropMappedToNewItem } from '@/types/gate'

const props = defineProps({
  isDialogVisible: Boolean,
  gateApiUrl: String,
  gateId: Number,
})

const emit = defineEmits<Emit>()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'gateDataAdded'): void
  (e: 'gateDataUpdated'): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const opening = ref(false)
const gateData = reactive<IGateNewItem>(new GateNewItemModel())
const router = useRouter()

const onReset = () => {
  isloading.value = false
  gateData.id = 0
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

async function gateAdd() {
  const { serviceError } = await serviceAdd<IGateNewItem>(gateData, props.gateApiUrl === undefined ? '' : props.gateApiUrl)
  if (!serviceError.value) {
    toast.success(t('alert.dataActionSuccess'))
    emit('gateDataAdded')
    emit('update:isDialogVisible', false)
    nextTick(() => {
      onReset()
    })
  }
  else {
    if (serviceError.value instanceof CustomFetchError)
      toast.error(t(`httpstatuscodes.${serviceError.value.code}`))
    else toast.error(t('httpstatuscodes.0'))
  }
  isloading.value = false
}

async function gateEdit() {
  const { serviceError } = await serviceUpdate<IGateNewItem>(gateData, gateData.id, props.gateApiUrl === undefined ? '' : props.gateApiUrl)
  if (!serviceError.value) {
    toast.success(t('alert.dataActionSuccess'))
    emit('gateDataUpdated')
    emit('update:isDialogVisible', false)
    nextTick(() => {
      onReset()
    })
  }
  else {
    toast.error(t('alert.dataActionFailed'))
  }
  isloading.value = false
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      isloading.value = true
      if (gateData.id > 0)
        gateEdit()
      else
        gateAdd()
    }
  })
}

const updateGate = async (gateId: number) => {
  try {
    opening.value = true

    const gateDataItem = await $api(router)<GateProperties>(`app/gate/${gateId}`)

    Object.assign(gateData, GatePropMappedToNewItem(gateDataItem))

    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError)
      toast.error(t(`httpstatuscodes.${error.code}`))
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }

  //   gateData = GatePropMappedToNewItem(gateDataItem)
//   Object.assign(gateData, GatePropMappedToNewItem(gateDataItem))
}

defineExpose({ updateGate })
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('gate.addedit')" :subtitle="$t('gate.addeditsubtitle')" :loading="opening">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 Gate Title -->
            <VCol cols="12">
              <AppTextField
                v-model="gateData.title"
                :rules="[requiredValidator(gateData.title, $t('validatorrequired'))]"
                :label="$t('gate.title')" placeholder=""
              />
            </VCol>

            <VCol cols="12">
              <VRow>
                <!-- 👉 Contact -->
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="gateData.phoneNumber" type="number"
                    :rules="[requiredValidator(gateData.phoneNumber, $t('validatorrequired'))]"
                    :label="$t('mobilenumber')" placeholder="09xx-xxx-xx-xx"
                  />
                </VCol>
                <!-- 👉 Email -->
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="gateData.email"
                    :rules="[requiredValidator(gateData.email, $t('validatorrequired')), emailValidator(gateData.email, $t('validatoremail'))]"
                    :label="$t('email')" placeholder="ٍE-mail"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VRow>
                <!-- 👉 Name -->
                <!--
                  <VCol sm="6" cols="12">
                  <AppTextField
                  v-model="gateData.fullname"
                  :label="$t('nameandfamily')" placeholder=""
                  />
                  </VCol>
                -->
                <!-- :rules="[requiredValidator(gateData.nameFamily, $t('validatorrequired'))]" -->
                <!-- 👉 UserType -->
                <VCol sm="12" cols="12">
                  <AppSelect
                    v-model="gateData.gateTypeId" :label="$t('usertype')"
                    placeholder="Select Role"
                    :rules="[requiredValidator(gateData.gateTypeId, $t('validatorrequired'))]"
                    :items="[{ value: 1, title: 'حقیقی' }, { value: 2, title: 'حقوقی' }]"
                  />
                </VCol>
                <VCol sm="2" cols="12" align-self="end">
                  <VSwitch v-model="gateData.isActive" :label="$t('active')" />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <AppTextarea
                v-model="gateData.description" :label="$t('description')"
                :placeholder="$t('writenotehere')" :rows="4"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
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
