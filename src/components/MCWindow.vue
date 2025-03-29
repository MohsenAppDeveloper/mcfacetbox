<script setup lang="ts">
const props = defineProps({
  title: { type: String },
})

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'close'): void // ایونت جدید close اضافه شد
  (e: 'open'): void // ایونت جدید close اضافه شد
  (e: 'move'): void
}
</script>

<template>
  <div class="content-box">
    <VCard class="elevation-1 content">
      <VRow no-gutters justify="space-between" align="center" class="tool-bar">
        <div class="title">
          {{ props.title }}
        </div>

        <div>
          <VRow no-gutters class="btn-box">
            <!-- <IconBtn size="small" @click="emit('move')"> -->
            <VIcon icon="tabler-arrows-down-up" size="18" @click="emit('move')" />
            <!-- </IconBtn> -->
            <VIcon icon="tabler-settings" size="18" @click="emit('open')" />
            <VIcon icon="tabler-x" size="18" @click="emit('close')" />
            <slot name="actions" />
          </VRow>
        </div>
      </VRow>
      <slot name="default" />
    </VCard>
  </div>
</template>
