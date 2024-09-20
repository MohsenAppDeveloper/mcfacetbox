<script setup lang="ts">
const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

const topicsChartConfig = {
  chart: {
    height: 270,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },

  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%',
      distributed: true,
      borderRadius: 7,
      borderRadiusApplication: 'end',
    },
  },

  colors: [
    'rgba(var(--v-theme-primary),1)', 'rgba(var(--v-theme-info),1)', 'rgba(var(--v-theme-success),1)', 'rgba(var(--v-theme-secondary),1)', 'rgba(var(--v-theme-error),1)', 'rgba(var(--v-theme-warning),1)',
  ],

  grid: {
    borderColor,
    strokeDashArray: 10,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: -35,
      bottom: -12,
    },
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff'],
      fontWeight: 200,
      fontSize: '13px',

    },
    offsetX: 0,
    dropShadow: {
      enabled: false,
    },
    formatter(val: string, opt: any) {
      return topicsChartConfig.labels[opt.dataPointIndex]
    },
  },
  labels: ['UI Design', 'UX Design', 'Music', 'Animation', 'Vue', 'SEO'],

  xaxis: {
    categories: ['6', '5', '4', '3', '2', '1'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
      formatter(val: string) {
        return `${val}%`
      },
    },
  },

  yaxis: {
    max: 35,
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
    },
  },

  tooltip: {
    enabled: true,
    style: {
      fontSize: '12px',
    },
    onDatasetHover: {
      highlightDataSeries: false,
    },
  },
  legend: {
    show: false,
  },

}

const topicsChartSeries = [
  {
    data: [35, 20, 14, 12, 10, 9],
  },
]

const topicsData = [
  { title: 'UI Design', value: 35, color: 'primary' },
  { title: 'UX Design', value: 20, color: 'info' },
  { title: 'Music', value: 14, color: 'success' },
  { title: 'Animation', value: 12, color: 'secondary' },
  { title: 'Vue', value: 10, color: 'error' },
  { title: 'SEO', value: 9, color: 'warning' },
]
</script>

<template>
  <!-- 👉 Topic You are Interested in -->
  <VCard>
    <VCardItem title="Topic you are interested in">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
          xl="8"
          lg="7"
        >
          <div>
            <VueApexCharts
              type="bar"
              height="260"
              :options="topicsChartConfig"
              :series="topicsChartSeries"
            />
          </div>
        </VCol>

        <VCol
          cols="12"
          md="6"
          lg="5"
          xl="4"
        >
          <div class="topic-progress d-flex flex-wrap gap-x-6 gap-y-10 ms-auto">
            <div
              v-for="topic in topicsData"
              :key="topic.title"
              class="d-flex gap-x-2"
            >
              <VBadge
                dot
                inline
                class="mt-1 custom-badge"
                :color="topic.color"
              />
              <div>
                <div
                  class="text-body-1"
                  style="min-inline-size: 90px;"
                >
                  {{ topic.title }}
                </div>
                <h5 class="text-h5">
                  {{ topic.value }}%
                </h5>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

@media screen and (min-width: 960px) {
  .topic-progress {
    inline-size: 17rem;
  }
}
</style>
