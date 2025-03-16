<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import { serviceAdd, serviceUpdate } from '@/services/genericServices'
import type { IUser } from '@/types/users'
import { UserModel } from '@/types/users'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
  apiUrl: String,
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
const userData = reactive<IUser>(new UserModel())
const rolesList = reactive([{ id: 1, title: 'پژوهشگر' }, { id: 2, title: 'مدیر کل' }, { id: 3, title: 'ناظر' }, { id: 4, title: 'ارزیاب یک' }, { id: 5, title: 'ارزیاب دو' }, { id: 6, title: 'مدیر نظارت' }, { id: 7, title: 'خواندنی' }])
const selectedRoles = ref<number[]>([])
const router = useRouter()

watch(selectedRoles, () => {
  userData.role = rolesList.filter(item => selectedRoles.value.includes(item.id))
})

const onReset = () => {
  userData.id = 0
  isloading.value = false
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

async function userAdd() {
  const { serviceError } = await serviceAdd<IUser>(userData, props.apiUrl == undefined ? '' : props.apiUrl)
  if (!serviceError.value) {
    toast.success(t('alert.dataActionSuccess'))
    emit('userDataAdded')
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
}

async function userEdit() {
  const { serviceError } = await serviceUpdate<IUser>(userData, userData.id, props.apiUrl == undefined ? '' : props.apiUrl)
  if (!serviceError.value) {
    toast.success(t('alert.dataActionSuccess'))
    emit('userDataUpdated')
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
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      isloading.value = true
      if (userData.id > 0)
        userEdit()

      else
        userAdd()
    }
  })
}

const loadRoles = async () => {

}

// watch(userData.role, (newdata, olddata) => {
//     console.log('watchuserdata', newdata, olddata);
// })

const updateUser = async (userId: number) => {
  try {
    opening.value = true

    const userDataResult = await $api(router)<IUser>(`app/gate/3/user/${userId}`)

    await loadRoles()

    // selectedTrees.value.push(...projectDataResult.trees)
    Object.assign(userData, userDataResult)

    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError)
      toast.error(t(`httpstatuscodes.${error.code}`))
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }

//   objectMap(userData, useCloned(userDataItem))
//   selectedRoles.value = userData.role.map(item => item.id)
}

defineExpose({ updateUser })
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('user.addedit')" :subtitle="$t('user.addeditsubtitle')" :loading="opening">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 Gate Title -->
            <VCol cols="12">
              <AppTextField
                v-model="userData.fullName"
                :rules="[requiredValidator(userData.fullName, $t('validatorrequired'))]"
                :label="$t('nameandfamily')" placeholder=""
              />
            </VCol>

            <VCol cols="12">
              <VRow>
                <!-- 👉 Contact -->
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="userData.contact" type="number"
                    :rules="[requiredValidator(userData.contact, $t('validatorrequired'))]"
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
                <!-- 👉 Name -->
                <VCol sm="10" cols="12">
                  <AppAutocomplete
                    v-model="selectedRoles" :items="rolesList" item-title="title"
                    item-value="id" :label="$t('role.select')"
                    :rules="[requiredValidator(userData.role, $t('validatorrequired'))]" chips
                    closable-chips multiple
                  />
                  <!-- :rules="[requiredValidator(userData.role, $t('validatorrequired'))]"  -->
                </VCol>

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
