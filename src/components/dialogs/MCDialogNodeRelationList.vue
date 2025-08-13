<script lang="ts" setup>
import { useSelectTreeNode } from '@/store/treeStore'
import { MessageType, SizeType } from '@/types/baseModels'
import type { INodeRelation } from '@/types/tree'
import { NodeRelationType } from '@/types/tree'

interface Prop {
  isDialogVisible: boolean
}
const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const { treeNodeIdMustBeSelect } = useSelectTreeNode()
const relationList = shallowRef<INodeRelation<number>[]>([])
const loading = ref(false)
const opening = shallowRef(false)
const relationtypetitle = shallowRef('')
const currentRelationTypeTitle = shallowRef(NodeRelationType.relation)
const { t } = useI18n({ useScope: 'global' })

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'messageHasOccured', message: string, type: MessageType): void
}

const onReset = (closedialog: boolean = false) => {
  if (closedialog)
    emit('update:isDialogVisible', false)
}

const loadrelations = async (nodeid: number, relationtype: NodeRelationType) => {
  currentRelationTypeTitle.value = relationtype
  relationtypetitle.value = relationtype === NodeRelationType.relation ? 'relations' : 'references'
  opening.value = true

  try {
    const result = await $api <INodeRelation<number>[]>(`app/node/${nodeid}/${relationtypetitle.value}`, {
      method: 'GET',
    })

    if (result.length > 0)
      relationList.value.push(...result)

    opening.value = false
  }
  catch (error) {
    opening.value = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
    emit('update:isDialogVisible', false)
  }
}

const deleterelation = async (relationItem: INodeRelation<number>) => {
  relationtypetitle.value = currentRelationTypeTitle.value === NodeRelationType.relation ? 'relations' : 'references'
  relationItem.loading = true
  try {
    await $api(`app/node/${relationItem.nodeId}/${relationtypetitle.value}/${relationItem.id}`, {
      method: 'Delete',
    })
    relationList.value.splice(relationList.value.indexOf(relationItem), 1)
  }
  catch (error) {
    relationItem.loading = false
    if (error instanceof CustomFetchError && error.code !== '0')
      emit('messageHasOccured', error.message, MessageType.error)
    else emit('messageHasOccured', t('httpstatuscodes.0'), MessageType.error)
  }
}

function selectnodeintree(nodeid: number) {
  treeNodeIdMustBeSelect.value = nodeid
}

// onMounted(() => {
//   loadrelations()
// })

defineExpose({
  loadrelations,
})
</script>

<template>
  <VDialog
    v-if="props.isDialogVisible"
    :width="$vuetify.display.smAndDown ? 'auto' : DialogSizeSM" :model-value="props.isDialogVisible"
    @update:model-value="onReset(true)"
  >
    <!-- این تکه کد برای جابجایی جایگاه دیالوگ است، پاک نشود تا در صورت لزوم مراجعه شود -->
    <!-- :target="[locX, locY]" location-strategy="connected" @update:model-value="onReset(true)" -->
    <DialogCloseBtn icon-size="16px" :disabled="loading || opening" @click="onReset(true)" />
    <VCard variant="flat" class="v-card-md" :title="$t(relationtypetitle)" :height="400" :loading="opening">
      <VCardText class="pa-0 pt-3">
        <VList
          v-if="relationList.length > 0"
          :class="`v-list-${SizeType.SM}`" item-value="key" item-title="title"
          lines="one"
          select-strategy="single-independent"
          :return-object="false"
          max-height="400px"
        >
          <!-- <VVirtualScroll :items="filteredItems" :height="(props.scrollItemCount ?? 10) * 20"> -->
          <VListItem v-for="item in relationList" :key="item.id" :title="item.title" :value="item.id">
            <VDivider />
            <template #title>
              <div class=" w-100 px-3 pb-2 d-flex justify-space-between">
                <div>
                  <span v-if="item.parentTitle && item.parentTitle.length > 0" class="opacity-60">{{ item.parentTitle }} / </span>
                  <span>{{ item.title }}</span>
                </div>
                <div>
                  <VBtn size="small" variant="plain" @click="selectnodeintree(item.nodeId)">
                    <VTooltip
                      activator="parent"
                      location="top center"
                    >
                      {{ $t('selectintree') }}
                    </VTooltip>
                    <VIcon size="16" icon="tabler-eye-up" />
                  </VBtn>
                  <VBtn :loading="item.loading" size="small" variant="plain" @click="selectnodeintree(item.nodeId)">
                    <VTooltip
                      activator="parent"
                      location="top center"
                    >
                      {{ $t('selectintree') }}
                    </VTooltip>
                    <VIcon size="16" icon="tabler-trash" color="error" @click="deleterelation(item)" />
                  </VBtn>
                </div>
              </div>
            </template>
            <!--
              <template #prepend="{ isSelected }">
              <VListItemAction start>
              <VCheckbox :model-value="isSelected" density="compact" />
              </VListItemAction>
              </template>
            -->
          </VListItem>
        </VList>
      </VCardText>
      <VDivider />

      <!--
        <template #actions>
        <div class="w-100 d-flex justify-center py-1 px-1">
        <VBtn type="submit" class="me-3" :loading="loading" :disabled="!(searchPhrase.length > 0 || selectedLabels.length > 0)" @click="addlabels">
        <span>
        {{ $t('add') }}
        </span>
        </VBtn>
        </div>
        </template>
      -->
    </VCard>
  </VDialog>
</template>
