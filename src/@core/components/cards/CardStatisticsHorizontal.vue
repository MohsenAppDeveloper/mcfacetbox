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
    <VCardText class="d-flex align-center justify-space-between">
      <div>
        <div class="d-flex align-center flex-wrap">
          <h5 class="text-h5">
            {{ props.stats }}
          </h5>
        </div>
        <div class="text-subtitle-1">
          {{ props.title }}
        </div>
      </div>

      <VAvatar
        :color="props.color"
        :size="42"
        rounded
        variant="tonal"
      >
        <VIcon
          :icon="props.icon"
          size="26"
        />
      </VAvatar>
    </VCardText>
  </VCard>
</template>
