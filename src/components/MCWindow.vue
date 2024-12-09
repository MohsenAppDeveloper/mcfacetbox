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
    <div class="content">
      <VRow no-gutters justify="space-between" align="center" class="tool-bar">
        <div class="title">
          {{ props.title }}
        </div>
        <div>
          <VRow no-gutters class="btn-box">
            <IconBtn size="small" @click="emit('move')">
              <VIcon icon="tabler-arrows-down-up" size="18" />
            </IconBtn>
            <IconBtn size="small" @click="emit('open')">
              <VIcon icon="tabler-settings" size="18" />
            </IconBtn>
            <IconBtn size="small" @click="emit('close')">
              <VIcon icon="tabler-x" size="18" />
            </IconBtn>

          </VRow>
        </div>
      </VRow>
      <slot name="default" />
    </div>
  </div>
</template>
