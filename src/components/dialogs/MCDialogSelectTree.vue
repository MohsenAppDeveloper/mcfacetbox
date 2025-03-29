<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک پنل یا درگاه کاربری میباشد

import { useToast } from 'vue-toastification'
import type { VForm } from 'vuetify/components/VForm'
import Placeholder from '@tiptap/extension-placeholder'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import type { IUser, IUserEdit } from '@/types/users'
import { UserEditModel } from '@/types/users'
import { type GridResult, type ISimpleDTO, SimpleDTOModel } from '@/types/baseModels'
import { useSelectedTree } from '@/store/treeStore'

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
  (e: 'userTreeSelected', value: number): void

}

const refForm = ref<VForm>()
const isloading = ref(false)
const userData = reactive<IUserEdit>(new UserEditModel())
const selectedGate = ref<number>(0)
const selectedProject = ref<number>(0)
const selectedTree = ref<ISimpleDTO<number>>(new SimpleDTOModel<number>(0, ''))

const gateList = ref<ISimpleDTO<number>[]>([])
const projectList = ref<ISimpleDTO<number>[]>([])
const treeList = ref<ISimpleDTO<number>[]>([])

const router = useRouter()
const selectedTreeItem = useSelectedTree()

watch(selectedGate, () => {
  loadProjects()

//   userData.role = rolesList.filter(item => selectedRoles.value.includes(item.id))
})
watch(selectedProject, () => {
  loadTrees()
})

const loadGates = async () => {
  try {
    isloading.value = true

    const gateDataResult = await $api<GridResult<ISimpleDTO<number>>>('app/gate/simple')

    selectedGate.value = 0
    gateList.value.splice(0)
    gateList.value.push(...gateDataResult.items)
    isloading.value = false
  }
  catch (error) {
    isloading.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
  }
}

const loadProjects = async () => {
  try {
    isloading.value = true

    const projectDataResult = await $api<GridResult<ISimpleDTO<number>>>(`app/project/simple?gateid=${selectedGate.value}`)

    selectedProject.value = 0
    projectList.value.splice(0)
    projectList.value.push(...projectDataResult.items)
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
    isloading.value = false
  }
  catch (error) {
    isloading.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
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
function startWorkWithTree() {
  selectedTreeItem.value.id = selectedTree.value.id
  selectedTreeItem.value.title = selectedTree.value.title
  router.replace({ name: 'rs', query: { gtd: btoa(selectedTree.value.id.toString()) } })
  emit('update:isDialogVisible', false)
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
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading || selectedTree === 0" @click="onReset" />
    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
    <VCard flat :title="$t('tree.select')" :subtitle="$t('tree.selectyourtree')">
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
            <AppAutocomplete
              v-model="selectedTree" :items="treeList" item-title="title" :loading="isloading && treeList.length === 0 && projectList.length > 0"
              return-object
              item-value="id" :label="$t('tree.select')" :disabled="selectedProject === 0"
            >
              <template #append>
                <VBtn v-if="!isloading && treeList.length === 0 && projectList.length > 0 && selectedProject > 0" icon size="small" variant="text" @click="loadTrees">
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
