<script setup lang="ts">
interface Props {
  page: number
  itemsPerPage: number
  totalItems: number
}

interface Emit {
  (e: 'update:page', value: number): void
}

defineProps<Props>()

const emit = defineEmits<Emit>()

const updatePage = (value: number) => {
  emit('update:page', value)
}
</script>

<template>
  <div>
    <VDivider />

    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 px-6 py-3">
      <p class="text-disabled mb-0">
        {{ paginationMeta({ page, itemsPerPage }, totalItems) }}
      </p>

      <VPagination
        :model-value="page"
        active-color="primary"
        :length="Math.ceil(totalItems / itemsPerPage)"
        :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalItems / itemsPerPage), 5)"
        @update:model-value="updatePage"
      />
    </div>
  </div>
</template>
