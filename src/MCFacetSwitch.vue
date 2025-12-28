<!-- <script setup lang="ts">
import { computed } from 'vue'
import { VSwitch } from 'vuetify/components'

interface Props {
  modelValue?: boolean
  label?: string
}

interface Emit {
  (e: 'update:modelValue', val: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const internalValue = computed({
  get: () => props.modelValue ?? false,
  set: val => emit('update:modelValue', val)
})
</script>

<template>
  <div class="d-flex align-center justify-space-between">
    <span class="mx-2">{{ label }}</span>
    <VSwitch v-model="internalValue" class="pl-2" />
  </div>
</template> -->

<script setup lang="ts">
import { computed } from 'vue'
import type { IFacetItem } from './types'

const props = defineProps<{
  items: IFacetItem[]
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const trueItem = computed(() =>
  props.items.find(i => i.key === 'true')
)

const internalValue = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <div class="d-flex align-center justify-space-between">
    <span>
      {{ trueItem?.title }}
      <span v-if="trueItem">({{ trueItem.count }})</span>
    </span>
    <VSwitch v-model="internalValue" />
  </div>
</template>




