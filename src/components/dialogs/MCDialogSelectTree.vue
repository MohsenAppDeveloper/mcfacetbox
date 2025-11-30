<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { useToast } from 'vue-toastification'
import type { VForm } from 'vuetify/components/VForm'

import type { IUserEdit } from '@/types/users'
import { UserEditModel } from '@/types/users'
import { type GridResult, type ISimpleDTO, SimpleDTOModel } from '@/types/baseModels'
import { useTreeStoreV3 } from '@/store/treeStoreV3'
import useRouterForGlobalVariables from '@/composables/useRouterVariables'
import type { Rule } from '@/plugins/casl/ability'

const props = defineProps({
  isDialogVisible: { type: Boolean, default: false },
  apiUrl: String,
  gateId: Number,
})

const emit = defineEmits<Emit>()
const { treeIdQuery } = useRouterForGlobalVariables()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'userTreeSelected', value: number): void

}
const ability = useAbility()
const refForm = ref<VForm>()
const isloading = ref(false)
const userData = reactive<IUserEdit>(new UserEditModel())
const selectedGate = ref<number>(0)

// const selectedProject = ref<number>(0)
const selectedTree = ref<ISimpleDTO<number>>(new SimpleDTOModel<number>(0, ''))

const gateList = ref<ISimpleDTO<number>[]>([])

// const projectList = ref<ISimpleDTO<number>[]>([])
const treeList = ref<ISimpleDTO<number>[]>([])

const router = useRouter()
const treeStore = useTreeStoreV3()

// watch(selectedGate, () => {
//   loadProjects()

// //   userData.role = rolesList.filter(item => selectedRoles.value.includes(item.id))
// })
watch(selectedGate, () => {
  loadTrees()
})

const loadGates = async () => {
  try {
    isloading.value = true

    const gateDataResult = await $api<GridResult<ISimpleDTO<number>>>('app/gate/simple')

    selectedGate.value = 0
    gateList.value.splice(0)
    gateList.value.push(...gateDataResult.items)

    if (gateList.value.length > 0)
      selectedGate.value = gateList.value[0].id

    isloading.value = false
  }
  catch (error) {
    isloading.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
}

const loadTrees = async () => {
  try {
    isloading.value = true

    const treeDataResult = await $api<GridResult<ISimpleDTO<number>>>(`app/tree/simple?gateid=${selectedGate.value}`)

    selectedTree.value.id = 0
    treeList.value.splice(0)
    treeList.value.push(...treeDataResult.items)

    if (treeList.value.length > 0)
      selectedTree.value = treeList.value[0]
    isloading.value = false
  }
  catch (error) {
    isloading.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
}

const setPermissions = async (): Promise<boolean> => {
  try {
    isloading.value = true

    const permissionDataResult = await $api<Rule[]>(`app/tree/${selectedTree.value.id}/user/permissions`)

    useCookie('userAbilityRules').value = JSON.stringify(permissionDataResult)
    ability.update(permissionDataResult)
    isloading.value = false

    return true
  }
  catch (error) {
    isloading.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('probleminSetPermissions'))

    return false
  }
}

const onReset = () => {
  userData.id = 0
  isloading.value = false
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}

onMounted(async () => {
  await loadGates()
})
async function startWorkWithTree() {
  const result = await setPermissions()
  if (result) {
    router.replace({ name: 'rs', query: { ...treeIdQuery(selectedTree.value.id) } })
    emit('update:isDialogVisible', false)
  }
}

// watch(userData.role, (newdata, olddata) => {
//     console.log('watchuserdata', newdata, olddata);
// })

const changeTree = async (userId: number) => {

}

defineExpose({ changeTree })
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading || selectedTree.id === 0" @click="onReset" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('tree.select')" :subtitle="$t('tree.selectyourtree')" class="pa-1">
      <VCardText>
        <!-- 👉 Form -->
        <VRow>
          <VCol cols="12">
            <AppAutocomplete
              v-model="selectedGate" :items="gateList" item-title="title" :loading="isloading && gateList.length === 0" hide-no-data
              item-value="id" :label="$t('gate.select')" :readonly="gateList.length === 0"
              :return-object="false"
            >
              <template #append>
                <VBtn v-if="!isloading && gateList.length === 0" icon size="small" variant="text" @click="loadGates">
                  <VIcon icon="tabler-refresh" size="22" />
                </VBtn>
              </template>
            </AppAutocomplete>
            <!--
              <AppAutocomplete
              v-model="selectedProject" :items="projectList" item-title="title" :loading="isloading && projectList.length === 0 && gateList.length > 0"
              :return-object="false"
              item-value="id" :label="$t('project.select')" :disabled="selectedGate === 0"
              >
              <template #append>
              <VBtn v-if="!isloading && projectList.length === 0 && gateList.length > 0 && selectedGate > 0" icon size="small" variant="text" @click="loadProjects">
              <VIcon icon="tabler-refresh" size="22" />
              </VBtn>
              </template>
              </AppAutocomplete>
            -->
            <AppAutocomplete
              v-model="selectedTree" :items="treeList" item-title="title" :loading="isloading && treeList.length === 0 && gateList.length > 0"
              return-object
              item-value="id" :label="$t('tree.select')" :disabled="selectedGate === 0"
            >
              <template #append>
                <VBtn v-if="!isloading && treeList.length === 0 && gateList.length > 0 && selectedGate > 0" icon size="small" variant="text" @click="loadTrees">
                  <VIcon icon="tabler-refresh" size="22" />
                </VBtn>
              </template>
            </AppAutocomplete>
          </VCol>

          <!-- 👉 Submit and Cancel -->
          <VCol cols="12">
            <VBtn type="submit" class="me-3" :disabled="isloading || selectedTree.id === 0" @click="startWorkWithTree">
              <span>
                {{ $t('accept') }}
              </span>
            </VBtn>
            <VBtn type="reset" variant="tonal" color="error" @click="onReset">
              {{ $t('cancel') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <!-- </PerfectScrollbar> -->
  </VDialog>
</template>
