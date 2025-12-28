<script setup lang="ts">
import { computed } from 'vue'
import { VTreeview } from 'vuetify/components'
import type { IFacetItem } from './types'
import {  convertFacetItemToFacetTree } from './types'


interface Props {
  items: IFacetItem[]
  modelValue?: string[]
  expandIcon?: string
  direction?: 'ltr' | 'rtl'
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

const treeItems = computed(() => convertFacetItemToFacetTree(props.items))

const expandIcon = computed(() => props.direction === 'rtl' ? 'mdi-menu-left' : 'mdi-menu-right')
</script>

<template>
  <div class="mc-data-scrolly-float" style="--block-size-offset:5px">
    <VTreeview v-model:activated="internalValue" :items="treeItems" :expand-icon="expandIcon"
      item-value="facetKey" item-title="title" min-height="300px" activatable density="compact"
      active-strategy="single-independent" />
  </div>
</template>
