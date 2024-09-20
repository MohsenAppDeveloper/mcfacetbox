<script setup lang="ts">
interface Props {
  title: string
  color?: string
  icon: string
  stats: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})
</script>

<template>
  <VCard>
    <VCardText class="d-flex flex-column align-center justify-center">
      <VAvatar
        v-if="props.icon"
        size="40"
        variant="tonal"
        rounded
        :color="props.color"
      >
        <VIcon :icon="props.icon" />
      </VAvatar>

      <h5 class="text-h5 pt-2 mb-1">
        {{ props.stats }}
      </h5>
      <div class="text-body-1">
        {{ props.title }}
      </div>
    </VCardText>
  </VCard>
</template>
