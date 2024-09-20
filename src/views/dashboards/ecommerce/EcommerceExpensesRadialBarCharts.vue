<script setup lang="ts">
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()

const series = [78]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    chart: {
      sparkline: {
        enabled: true,
      },
      parentHeightOffset: 0,
      type: 'radialBar',
    },
    colors: ['rgba(var(--v-theme-warning), 1)'],
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '65%',
        },
        track: {
          strokeWidth: '45%',
          background: 'rgba(var(--v-track-bg))',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '24px',
            color: `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`,
            fontWeight: 600,
            offsetY: -5,
          },
        },
      },
    },
    grid: {
      show: false,
      padding: {
        bottom: 5,
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
    responsive: [
      {
        breakpoint: 1442,
        options: {
          chart: {
            height: 140,
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                value: {
                  fontSize: '24px',
                },
              },
              hollow: {
                size: '60%',
              },
            },
          },
        },
      },
      {
        breakpoint: 1370,
        options: {
          chart: {
            height: 120,
          },
        },
      },
      {
        breakpoint: 1280,
        options: {
          chart: {
            height: 200,
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                value: {
                  fontSize: '18px',
                },
              },
              hollow: {
                size: '70%',
              },
            },
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          chart: {
            height: 250,
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '70%',
              },
              dataLabels: {
                value: {
                  fontSize: '24px',
                },
              },
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
    <VCardItem class="pb-3">
      <VCardTitle>
        82.5K
      </VCardTitle>
      <VCardSubtitle>
        Expenses
      </VCardSubtitle>
    </VCardItem>
    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        type="radialBar"
        :height="135"
      />

      <div class="text-sm text-center clamp-text text-disabled mt-3">
        $21k Expenses more than last month
      </div>
    </VCardText>
  </VCard>
</template>
