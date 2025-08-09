<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import type { IUser, IUserEdit } from '@/types/users'
import { UserEditModel } from '@/types/users'

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
  (e: 'userDataAdded'): void
  (e: 'userDataUpdated'): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const opening = ref(false)
const userData = reactive<IUserEdit>(new UserEditModel())

const onReset = () => {
  userData.id = 0
  isloading.value = false
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

async function userAdd() {
  try {
    await $api(props.apiUrl === undefined ? '' : props.apiUrl, {
      method: 'POST',
      body: JSON.parse(JSON.stringify(userData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('userDataAdded')
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

async function userEdit() {
  try {
    await $api((`${props.apiUrl}/`).replace('//', '/') + userData.id, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(userData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('userDataUpdated')
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
      if (useToNumber(userData.id.toString()).value > 0)
        userEdit()

      else
        userAdd()
    }
  })
}

// watch(userData.role, (newdata, olddata) => {
//     console.log('watchuserdata', newdata, olddata);
// })

const updateUser = async (userId: number) => {
  try {
    opening.value = true

    const userDataResult = await $api<IUser>(`${props.apiUrl}/${userId}`)

    Object.assign(userData, userDataResult)

    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }

//   objectMap(userData, useCloned(userDataItem))
}

defineExpose({ updateUser })
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('user.addedit')" :subtitle="$t('user.addeditsubtitle')" :loading="opening" class="pa-1">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 Gate Title -->
            <!--
              <VCol cols="12">
              <AppTextField
              v-model="userData.fullName"
              :rules="[requiredValidator(userData.fullName, $t('validatorrequired'))]"
              :label="$t('nameandfamily')" placeholder=""
              />
              </VCol>
            -->

            <VCol cols="12">
              <VRow>
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="userData.phoneNumber" type="number"
                    :rules="[requiredValidator(userData.phoneNumber, $t('validatorrequired'))]"
                    :label="$t('mobilenumber')" placeholder="09xx-xxx-xx-xx"
                  />
                </VCol>
                <!-- 👉 Email -->
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="userData.email"
                    :rules="[requiredValidator(userData.email, $t('validatorrequired')), emailValidator(userData.email, $t('validatoremail'))]"
                    :label="$t('email')" placeholder="ٍE-mail"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VRow>
                <VCol sm="2" cols="12" align-self="end">
                  <VSwitch v-model="userData.isActive" :label="$t('active')" />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <AppTextarea
                v-model="userData.description" :label="$t('description')"
                placeholder="Write note here..." :rows="4"
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
