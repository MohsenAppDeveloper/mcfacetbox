<script setup lang="ts">
// !SECTION این دیالوگ برای افزودن و یا ویرایش یک نقش میباشد

import { useToast } from 'vue-toastification'
import { VForm } from 'vuetify/components/VForm'
import { VTreeview } from 'vuetify/labs/VTreeview'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import type { IBasePermissionTree, IRoleEdit, IRoleView } from '@/types/rolePermission'
import { RoleEditModel } from '@/types/rolePermission'

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
  (e: 'roleDataAdded'): void
  (e: 'roleDataUpdated'): void

}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const isloading = ref(false)
const roleData = reactive<IRoleEdit>(new RoleEditModel())

// const projectList = reactive<ISimpleTree[]>([])
// const permissionList = reactive<ISimpleTree[]>([{ id: 1, title: 'ماژول درخت', children: [{ id: 2, title: 'افزودن نود' }, { id: 3, title: 'جابجایی نود' }] }, { id: 4, title: 'فیش نگار', children: [{ id: 5, title: 'افزودن فیش' }, { id: 6, title: 'اتصال فیش' }] }])

const projectList = reactive<IBasePermissionTree[]>([])
const permissionList = reactive<IBasePermissionTree[]>([])
const opening = ref(false)

const selectedPermissions = ref<string[]>([])
const selectedProjects = ref<string[]>([])

async function roleAdd() {
  roleData.gateId = props.gateId ?? 0
  console.log('roledata', roleData)

  try {
    await $api(props.apiUrl === undefined ? '' : props.apiUrl, {
      method: 'POST',
      body: JSON.parse(JSON.stringify(roleData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('roleDataAdded')
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

async function roleEdit() {
  roleData.gateId = props.gateId ?? 0
  try {
    await $api((`${props.apiUrl}/`).replace('//', '/') + roleData.id, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(roleData)),
      ignoreResponseError: false,
    })
    toast.success(t('alert.dataActionSuccess'))
    emit('roleDataUpdated')
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
      collectPermissionData()
      if (roleData.permissions.length === 0) {
        toast.warning(t('alert.youmustselectoneperm'))

        return
      }
      isloading.value = true
      if (roleData.id.length > 3)
        roleEdit()
      else
        roleAdd()
    }
  })
}

function collectPermissionData() {
  roleData.permissions.splice(0)
  selectedProjects.value.forEach(projecItem => {
    roleData.permissions.push(...selectedPermissions.value.map(item => `${projecItem}.${item}`))
  })
  console.log('permission', roleData)
}
function generateUniqueId(): number {
  return Math.floor(Math.random() * 1000000) // عددی تصادفی بین 0 و 999999 تولید می‌کند
}
function attachUniqueIds(tree: IBasePermissionTree[]): IBasePermissionTree[] {
  return tree.map(node => {
    const newNode: IBasePermissionTree = {
      ...node,

      //   id: generateUniqueId(),
      children: (node.children && node.children.length > 0) ? attachUniqueIds(node.children) : undefined, // بازگشت به فرزندان
    }

    return newNode
  })
}

const loadPermissions = async () => {
  const projectListResult = await $api<IBasePermissionTree[]>(`app/permissions?gateId=${props.gateId}`)
  const permissionListResult = await $api<IBasePermissionTree[]>('app/permissions/static')

  projectList.splice(0)
  permissionList.splice(0)

  projectList.push(...attachUniqueIds(projectListResult))
  permissionList.push(...attachUniqueIds(permissionListResult))

  //   permissionList.push(...result2)

//   Object.assign(projectList)
//   Object.assign(permissionList)
}

function onReset() {
  roleData.id = '0'
  isloading.value = false
  roleData.permissions.splice(0)
  selectedPermissions.value.splice(0)
  selectedProjects.value.splice(0)
  emit('update:isDialogVisible', false)
  refForm.value?.reset()
  refForm.value?.resetValidation()
}
onMounted(async () => {
  try {
    opening.value = true
    await loadPermissions()
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

const updateRole = async (roleId: string) => {
  try {
    opening.value = true

    const roleListResult = await $api<IRoleView>(`app/role/${roleId}`)

    selectedPermissions.value.splice(0)
    selectedProjects.value.splice(0)

    selectedPermissions.value.push(...roleListResult.permissions.map(item => item.name))
    selectedProjects.value.push(...roleListResult.trees.map(item => item.name))

    objectMap(roleData, useCloned(roleListResult))
    roleData.permissions.splice(0)
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code > 1)
      toast.error(error.message)
    else toast.error(t('httpstatuscodes.0'))
    emit('update:isDialogVisible', false)
  }

//   selectedPermissions.value = roleData.permissions.map(item => item.id)
//   selectedProjects.value = roleData.projects.map(item => item.id)
}

defineExpose({ updateRole })
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    persistent @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn :disabled="isloading" @click="onReset" />
    <VCard flat :title="$t('role.addedit')" :subtitle="$t('role.addeditsubtitle')" :loading="opening">
      <VCardText>
        <!--
          <VBtn type="reset" variant="tonal" color="error" @click="testvmodel" :disabled="isloading">
          {{ "تست" }}
          </VBtn>
        -->
        <VForm ref="refForm" v-model="isFormValid" :disabled="opening" @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="roleData.name"
                :rules="[requiredValidator(roleData.name, $t('validatorrequired'))]"
                :label="$t('role.title')" placeholder=""
              />
            </VCol>

            <VCol cols="12">
              <VRow>
                <VCol cols="6" sm="6">
                  <VTreeview
                    v-model:selected="selectedProjects" :items="projectList" :return-object="false"
                    expand-icon="mdi-menu-left" item-value="name" item-title="title"
                    select-strategy="leaf" density="compact" height="300px" lines="one" selectable
                  >
                    <template #title="{ item }">
                      <VTooltip :text="item.title">
                        <template #activator="{ props }">
                          <span v-bind="props"> {{ item.title }}</span>
                        </template>
                      </VTooltip>
                    </template>
                  </VTreeview>
                </VCol>
                <VCol cols="6" sm="6">
                  <VTreeview
                    v-model:selected="selectedPermissions" density="compact" :items="permissionList" height="300px"
                    width="100%" item-value="name" item-title="title" :return-object="false"
                    expand-icon="mdi-menu-left" select-strategy="classic" selectable
                  >
                    <template #header="{ props }">
                      <span>jsrs </span>
                    </template>
                    <template #title="{ item }">
                      <VTooltip :text="item.title">
                        <template #activator="{ props }">
                          <span v-bind="props"> {{ item.title }}</span>
                        </template>
                      </VTooltip>
                    </template>
                  </VTreeview>
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VRow>
                <VCol sm="12" cols="12" align-self="end">
                  <VSwitch v-model="roleData.isActive" :label="$t('active')" />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <AppTextarea
                v-model="roleData.description" :label="$t('description')"
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
              <VBtn
                type="reset" variant="tonal" color="error" :disabled="isloading"
                @click="onReset"
              >
                {{ $t('cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
