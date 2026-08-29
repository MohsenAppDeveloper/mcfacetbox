<script setup lang="ts">
import { computed } from 'vue'
import { VList, VListItem, VListItemAction, VCheckbox, VVirtualScroll, VListItemTitle } from 'vuetify/components'
import type { IFacetItem } from './types'

interface Props {
  items: IFacetItem[]
  modelValue?: string[]
  scrollItemCount?: number
}

interface Emit {
  (e: 'update:modelValue', val: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const internalValue = computed({
  get: () => props.modelValue ?? [],
  set: val => emit('update:modelValue', [...val])
})
</script>

<template>
  <!-- <VList v-model:selected="internalValue" item-value="key" item-title="title" lines="one" select-strategy="leaf"
    :return-object="false" :height="(items.length ?? 10) * 36" :max-height="(props.scrollItemCount ?? 10) * 35">
    <VListItem v-for="item in items" :key="item.key" :title="item.title" :value="item.key">
      <template #prepend="{ isSelected }">
        <VListItemAction start>
          <VCheckbox :model-value="isSelected" density="compact" hide-details />
        </VListItemAction>
      </template>
<template #append>
        <span class="px-2">{{ item.count }}</span>
      </template>
</VListItem>
</VList> -->

  <v-list v-model:selected="internalValue" item-value="key" item-title="title" lines="one" select-strategy="leaf"
    :return-object="false">
    <v-virtual-scroll :items="items" item-height="28" :height="Math.min(
      (items?.length ?? 0),
      (props.scrollItemCount ?? 10)
    ) * 28">
      <template #default="{ item }">
        <v-list-item :value="item.key">
          <template #prepend="{ isSelected, select }">
            <v-list-item-action start>
              <v-checkbox :model-value="isSelected" @update:model-value="select" density="compact" hide-details />
            </v-list-item-action>
          </template>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <template #append>
            <span class="px-2">{{ item.count }}</span>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-list>
</template>
