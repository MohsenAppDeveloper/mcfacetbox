<script setup lang="ts">
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const series = [
  {
    name: 'PRODUCT A',
    data: [4, 3, 6, 4, 3],
  },
  {
    name: 'PRODUCT B',
    data: [-3, -4, -3, -2, -3],
  },
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors

  return {
    chart: {
      type: 'bar',
      height: 90,
      parentHeightOffset: 0,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'PRODUCT A',
        data: [4, 3, 6, 4, 3],
      },
      {
        name: 'PRODUCT B',
        data: [-3, -4, -3, -2, -3],
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 5,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round',
      colors: [currentTheme.surface],
    },
    legend: {
      show: false,
    },
    colors: ['rgba(var(--v-theme-primary),1)', 'rgba(var(--v-theme-success),1)'],
    grid: {
      show: false,
      padding: {
        top: -50,
        right: -10,
        left: -8,
        bottom: -30,
      },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 1441,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '50%',
              borderRadius: 4,
            },
          },
        },
      },
      {
        breakpoint: 1300,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%',
              borderRadius: 4,
            },
          },
        },
      },
      {
        breakpoint: 1280,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '30%',
            },
          },
        },
      },
      {
        breakpoint: 1025,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '30%',
            },
          },
          chart: {
            height: 110,
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '25%',
            },
          },
        },
      },
      {
        breakpoint: 782,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '30%',
              borderRadius: 6,
            },
          },
        },
      },
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '20%',
            },
          },
          chart: {
            height: 160,
          },
        },
      },
      {
        breakpoint: 426,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '30%',
            },
          },
        },
      },
      {
        breakpoint: 385,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
            },
          },
        },
      },
    ],
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
  }
})
</script>

<template>
  <VCard>
    <VCardItem class="pb-3">
      <VCardTitle>
        Sessions
      </VCardTitle>
      <VCardSubtitle>
        This Month
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="68"
      />

      <div class="d-flex align-center justify-space-between gap-x-2 mt-3">
        <h4 class="text-h4">
          45.1k
        </h4>
        <div class="text-sm text-success">
          +12.6%
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
