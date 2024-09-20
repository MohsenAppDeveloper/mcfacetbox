<script setup lang="ts">
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()

const series = [
  {
    data: [30, 40, 50, 60, 70, 80, 90],
  },
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    chart: {
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        columnWidth: '25%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
      },
    },
    colors: [`rgba(${hexToRgb(currentTheme.warning)}, 1)`],
    grid: {
      show: false,
      padding: {
        top: -30,
        left: -18,
        bottom: -13,
        right: -10,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: ['01', '02', '03', '04', '05', '06', '07'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`,
          fontSize: '13px',
          fontFamily: 'Public sans',
        },
        show: true,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1441,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 4,
            },
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '25%',
              borderRadius: 6,
            },
          },
        },
      },
      {
        breakpoint: 992,
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
        breakpoint: 836,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '30%',
            },
          },
        },
      },
      {
        breakpoint: 738,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%',
              borderRadius: 6,
            },
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '25%',
              borderRadius: 8,
            },
          },
        },
      },
      {
        breakpoint: 500,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '24%',
              borderRadius: 6,
            },
          },
        },
      },
      {
        breakpoint: 450,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
            },
          },
        },
      },
    ],
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between">
        <div>
          <h4 class="text-h4">
            2.84k
          </h4>
          <div class="text-subtitle-2">
            Avg Daily Traffic
          </div>
        </div>

        <VChip
          label
          color="success"
          size="small"
        >
          <span class="font-weight-medium">+15%</span>
        </VChip>
      </div>

      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="145"
      />
    </VCardText>
  </VCard>
</template>
