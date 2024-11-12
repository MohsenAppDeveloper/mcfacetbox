<script setup lang="ts">
const props = defineProps({
  title: { type: String },
})

interface Emit {
  (e: 'close'): void; // ایونت جدید close اضافه شد  
  (e: 'open'): void; // ایونت جدید close اضافه شد  
}

const emit = defineEmits<Emit>();
</script>

<template>
  <div class='content'>
    <VRow no-gutters justify="space-between" align="center" class="tool-bar">
      <div class='title'>
        {{ title }}
      </div>
      <div>
        <VRow no-gutters class="btn-box">
          <IconBtn @click="emit('open')">
            <VIcon icon="tabler-settings" />
          </IconBtn>
          <IconBtn @click="emit('close')">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VRow>
      </div>
    </VRow>
    <slot></slot>
  </div>
</template>

<style lang="scss">
.tool-bar {
  border-bottom: 1px solid #7F56D9;
  padding: 0 15px;
}

.title {
  font-weight: bold;
}

.content {
  background-color: white;
  border-radius: 5px;
  // padding: 10px;
}
</style>
