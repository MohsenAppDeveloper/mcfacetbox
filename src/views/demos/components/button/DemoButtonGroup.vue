<script lang="ts" setup>
const toggleExclusive = ref(1)
</script>

<template>
  <VBtnToggle
    v-model="toggleExclusive"
    density="comfortable"
  >
    <VBtn icon="tabler-align-left" />
    <VBtn icon="tabler-align-center" />
    <VBtn icon="tabler-align-right" />
    <VBtn icon="tabler-align-justified" />
  </VBtnToggle>
</template>
