<script setup lang="ts">
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()

const series = {
  bar: [
    {
      name: 'Earning',
      data: [270, 210, 180, 200, 250, 280, 250, 270, 150],
    },
    {
      name: 'Expense',
      data: [-140, -160, -180, -150, -100, -60, -80, -100, -180],
    },
  ],
  line: [
    {
      name: 'Last Month',
      data: [20, 10, 30, 16, 24, 5, 40, 23, 28, 5, 30],
    },
    {
      name: 'This Month',
      data: [50, 40, 60, 46, 54, 35, 70, 53, 58, 35, 60],
    },
  ],
}

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`
  const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`

  return {
    bar: {
      chart: {
        parentHeightOffset: 0,
        stacked: true,
        type: 'bar',
        toolbar: { show: false },
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          borderRadius: 8,
          borderRadiusApplication: 'around',
          borderRadiusWhenStacked: 'all',
        },
      },
      colors: ['rgba(var(--v-theme-primary),1)', 'rgba(var(--v-theme-warning),1)'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 6,
        lineCap: 'round',
        colors: [currentTheme.surface],
      },
      legend: {
        show: true,
        horizontalAlign: 'right',
        position: 'top',
        fontFamily: 'Public Sans',
        fontSize: '13px',
        markers: {
          height: 12,
          width: 12,
          radius: 12,
          offsetX: -3,
          offsetY: 2,
        },
        labels: {
          colors: legendColor,
        },
        itemMargin: {
          horizontal: 5,
        },
      },
      grid: {
        show: false,
        padding: {
          bottom: -8,
          top: 20,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          style: {
            fontSize: '13px',
            colors: labelColor,
            fontFamily: 'Public Sans',
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          offsetX: -16,
          style: {
            fontSize: '13px',
            colors: labelColor,
            fontFamily: 'Public Sans',
          },
        },
        min: -200,
        max: 300,
        tickAmount: 5,
      },
      responsive: [
        {
          breakpoint: 1700,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '43%',
              },
            },
          },
        },
        {
          breakpoint: 1526,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '52%',
                borderRadius: 8,
              },
            },
          },
        },
        {
          breakpoint: 1359,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '60%',
                borderRadius: 8,
              },
            },
          },
        },
        {
          breakpoint: 1280,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '40%',
                borderRadius: 10,
              },
            },
          },
        },
        {
          breakpoint: 1025,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '40%',
                borderRadius: 8,
              },
            },
            chart: {
              height: 390,
            },
          },
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '40%',
                borderRadius: 8,
              },
            },
          },
        },
        {
          breakpoint: 850,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '50%',
                borderRadius: 8,
              },
            },
          },
        },
        {
          breakpoint: 776,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '50%',
                borderRadius: 6,
              },
            },
          },
        },
        {
          breakpoint: 731,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '70%',
                borderRadius: 8,
              },
            },
          },
        },
        {
          breakpoint: 599,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '50%',
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
                columnWidth: '55%',
                borderRadius: 6,
              },
            },
          },
        },
        {
          breakpoint: 449,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '65%',
                borderRadius: 6,
              },
            },
            chart: {
              height: 360,
            },
            xaxis: {
              labels: {
                offsetY: -5,
              },
            },
          },
        },
        {
          breakpoint: 394,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '80%',
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
    },
    line: {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
      },
      stroke: {
        curve: 'smooth',
        dashArray: [5, 0],
        width: [1, 2],
      },
      legend: {
        show: false,
      },
      colors: [borderColor, currentTheme.primary],
      grid: {
        show: false,
        borderColor,
        padding: {
          top: -30,
          bottom: -15,
          left: 25,
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  }
})
</script>

<template>
  <VCard class="revenue-report">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="8"
        lg="8"
        :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
      >
        <VCardText>
          <h6 class="text-h5 mb-sm-n8">
            Revenue Report
          </h6>

          <VueApexCharts
            :options="chartOptions.bar"
            :series="series.bar"
            height="365"
          />
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        sm="4"
      >
        <VCardText class="d-flex flex-column justify-center align-center text-center h-100">
          <VBtn
            variant="tonal"
            size="small"
            class="d-flex mx-auto"
          >
            <span>2022</span>
            <template #append>
              <VIcon
                size="16"
                icon="tabler-chevron-down"
              />
            </template>
            <VMenu activator="parent">
              <VList>
                <VListItem
                  v-for="(item, index) in ['2021', '2020', '2019']"
                  :key="index"
                  :value="index"
                >
                  <VListItemTitle>{{ item }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>

          <div class="d-flex flex-column my-8">
            <h5 class="font-weight-medium text-h3">
              $25,825
            </h5>
            <p class="mb-0">
              <span class="text-high-emphasis font-weight-medium me-1">Budget:</span>
              <span>56,800</span>
            </p>
          </div>

          <VueApexCharts
            :options="chartOptions.line"
            :series="series.line"
            height="100"
          />

          <VBtn class="mt-8">
            Increase Budget
          </VBtn>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss">
.revenue-report {
  .apexcharts-legend {
    gap: 1rem;
  }

  @media (max-width: 599px) {
    .apexcharts-legend.apx-legend-position-top.apexcharts-align-right {
      justify-content: flex-start;
      padding: 0;
    }
  }
}
</style>
