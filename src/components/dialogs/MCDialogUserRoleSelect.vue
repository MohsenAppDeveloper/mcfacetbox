<script lang="ts" setup>
import { VForm } from 'vuetify/components/VForm'
import type { GridResult, ISimpleDTO } from '@/types/baseModels'
import { SimpleDTOModel, SizeType } from '@/types/baseModels'
import type { IUserBase } from '@/types/users'

interface Prop {
  isDialogVisible: boolean
  gateId: number
  treeid: number
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = shallowRef(false)
const opening = shallowRef(false)
const { t } = useI18n({ useScope: 'global' })
const roles = reactive<ISimpleDTO<string>[]>([])
const users = reactive<ISimpleDTO<string>[]>([])
const selectedRoles = ref<string[]>([])
const selectedUser = ref<string>('')
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'errorHasOccured', message: string): void
  (e: 'userRoleHasBeenAdded', treeid: number): void
}

watch(() => selectedUser, () => {
  console.log('selecteduser', selectedUser.value)
})

const loadRoles = async () => {
  const roleDataResult = await $api<GridResult<ISimpleDTO<string>>>(`app/role/simple?gateId=${props.gateId}`)

  roles.splice(0)
  roles.push(...roleDataResult.items)
}

const loadUsers = async () => {
  const userDataResult = await $api<ISimpleDTO<string>[]>(`app/gate/${props.gateId}/user/simple`)

  users.splice(0)
  users.push(...userDataResult)
}

const addTreeUserRole = async () => {
  try {
    loading.value = true
    await $api(`app/tree/${props.treeid}/user`, {
      method: 'POST',
      body: {
        userId: selectedUser.value, roles: selectedRoles.value,
      },
    })
    emit('userRoleHasBeenAdded', props.treeid)
  }
  catch (error) {
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('errorHasOccured', error.message)
    else emit('errorHasOccured', t('httpstatuscodes.0'))

    // emit('update:isDialogVisible', false)
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    opening.value = true
    await loadRoles()
    await loadUsers()
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('errorHasOccured', error.message)
    else emit('errorHasOccured', t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }
})

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid)
      addTreeUserRole()
  })
}
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent
  >
    <DialogCloseBtn :disabled="loading" @click="emit('update:isDialogVisible', false)" />

    <VCard variant="flat" :loading="opening" :min-height="200" class="pa-1">
      <MCLoading :loadingsize="SizeType.MD" :showloading="opening" />
      <VCardTitle class="primary white--text">
        {{ $t('datashelfbox.about') }}
        <VSpacer />
      </VCardTitle>
      <VDivider />
      <VCardText class="pt-4">
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <div class="pb-2">
            <AppAutocomplete
              v-model="selectedUser" :items="users" item-title="title"
              item-value="id" :label="$t('role.select')"
              :rules="[requiredValidator(selectedUser, $t('validatorrequired'))]"
            />
          </div>
          <div class="pb-2">
            <AppAutocomplete
              v-model="selectedRoles" :items="roles" item-title="title"
              item-value="id" :label="$t('role.select')"
              :rules="[requiredValidator(selectedRoles, $t('validatorrequired'))]" chips
              closable-chips multiple
            />
          </div>

          <VBtn type="submit" class="me-3" :loading="loading">
            <span>
              {{ $t('accept') }}
            </span>
          </VBtn>
          <VBtn type="reset" variant="tonal" color="error" :disabled="loading" @click="emit('update:isDialogVisible', false)">
            {{ $t('cancel') }}
          </VBtn>
        </VForm>
        <!-- </VCardText> -->
      </VCardText>
    </VCard>
  </VDialog>
</template>
