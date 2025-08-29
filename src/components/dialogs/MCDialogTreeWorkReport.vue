<script lang="ts" setup>
import { loadUsers } from '@/services/publicServices'
import type { ISimpleDTO } from '@/types/baseModels'
import { MessageType, SizeType } from '@/types/baseModels'

interface Prop {
  isDialogVisible: boolean
  gateid: number

  //   selectedDataBoxId: number
  serviceurl: string
}

const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const loading = ref(false)
const opening = ref(false)
const { t } = useI18n({ useScope: 'global' })
const mainCard = ref()
const startsolardate = ref('')
const endsolardate = ref('')
const startgregoriandate = ref('')
const endgregoriandate = ref('')
const users = reactive<ISimpleDTO<string>[]>([])
const selectedUser = ref<string>('-1')

// const apiUrl = ref('')
const { height: tableheight } = useElementSize(mainCard)
const { height: windowheight } = useWindowSize()
const mctree = ref()

const reportURL = computed(() => {
  if (selectedUser.value !== '-1') {
    return createUrl(props.serviceurl, {
      query: {
        From: startgregoriandate.value,
        To: endgregoriandate.value,
        Users: selectedUser.value,

      },
    }).value
  }
  else {
    return createUrl(props.serviceurl, {
      query: {
        From: startgregoriandate.value,
        To: endgregoriandate.value,
      },
    }).value
  }

//   return result
})

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void

  (e: 'handlemessage', message: string, type: MessageType): void
}

const tableHeaders = [
  { title: t('nameandfamily'), key: 'fullName', width: '300', nowrap: true, sortable: true },
  { title: t('workdomain'), key: 'domain', sortable: false },
  { title: t('createdcount'), key: 'createdCount', sortable: true },
  { title: t('updatedcount'), key: 'updatedCount', sortable: true },
  { title: t('deletedcount'), key: 'deletedCount', sortable: true },
]

// watch(tableheight, () => {
//   setTimeout(() => {
//     tableheightFinal.value = tableheight.value - 150
//   }, 5000)
// })
onMounted(async () => {
  try {
    opening.value = true

    const usersResult = await loadUsers(props.gateid)

    users.splice(0)
    users.push({ id: '-1', title: t('all') }, ...usersResult)
    selectedUser.value = '-1'
    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('handlemessage', error.message, MessageType.error)
    else emit('handlemessage', t('httpstatuscodes.0'), MessageType.error)
    emit('update:isDialogVisible', false)
  }
  nextTick(() => mctree.value.refreshData())
})
</script>

<template>
  <VDialog v-if="props.isDialogVisible" :model-value="props.isDialogVisible" :width="DialogSizeMD + 30" @update:model-value="emit('update:isDialogVisible', false)">
    <DialogCloseBtn :disabled="loading" @click="emit('update:isDialogVisible', false)" />

    <VCard ref="mainCard" variant="flat" :loading="opening" :height="windowheight - 20" class="pa-1">
      <MCLoading :loadingsize="SizeType.MD" :showloading="opening" />
      <VCardTitle class="primary white--text pa-2">
        {{ $t('workReport') }}
        <VSpacer />
      </VCardTitle>
      <VDivider />
      <!-- <div class="mc-data-scrolly-float" style="-block-size-offset: 4px"> -->
      <MCDataTable
        ref="mctree"
        :active-edit-action="false" :active-delete-action="false" :tableheight="`${tableheight - 150}px`"
        :default-page-size="50" :row-selectable="false" :autostart="false" :headers="tableHeaders" :api-url="reportURL" :gateid="0"
        :showsearch="false"
      >
        <template #tools>
          <div class="d-flex flex-row">
            <MCInputDatePicker v-model:solar-date="startsolardate" v-model:gregorian-date="startgregoriandate" :placeholder="$t('fromdate')" />
            <MCInputDatePicker v-model:solar-date="endsolardate" v-model:gregorian-date="endgregoriandate" :placeholder="$t('todate')" />
            <VAutocomplete
              v-model="selectedUser" style="width: 180px"
              class="px-1" :items="users" item-title="title"
              item-value="id"
              :label="$t('user.select')"
            />
            <VBtn class="me-3" @click="mctree.refreshData()">
              <span>
                {{ $t('accept') }}
              </span>
            </VBtn>
          </div>
        </template>
        <template #item.actions="{ value }">
          <VBtn size="small" variant="plain" @click="">
            <VTooltip
              activator="parent"
              location="top center"
            >
              {{ $t('showdetails') }}
            </VTooltip>

            <VIcon size="16" icon="tabler-details" />
          </VBtn>
        </template>
      </MCDataTable>
      <!-- </div> -->
    </VCard>
  </VDialog>
</template>
