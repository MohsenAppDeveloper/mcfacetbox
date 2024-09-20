<script setup lang="ts">
interface Props {
  title: string
  color?: string
  icon: string
  stats: string
  height: number
  series: unknown[]
  chartOptions: unknown
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})
</script>

<template>
  <VCard>
    <VCardText class="d-flex flex-column pb-0">
      <VAvatar
        v-if="props.icon"
        size="42"
        variant="tonal"
        :color="props.color"
        rounded
        class="mb-2"
      >
        <VIcon
          :icon="props.icon"
          size="26"
        />
      </VAvatar>

      <h5 class="text-h5">
        {{ props.stats }}
      </h5>
      <div class="text-sm">
        {{ props.title }}
      </div>
    </VCardText>

    <VueApexCharts
      :series="props.series"
      :options="props.chartOptions"
      :height="props.height"
    />
  </VCard>
</template>
