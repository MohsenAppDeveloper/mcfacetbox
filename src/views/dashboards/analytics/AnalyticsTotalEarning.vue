<script setup lang="ts">
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const series = [
  {
    name: 'Earning',
    data: [15, 10, 20, 8, 12, 18, 12, 5],
  },
  {
    name: 'Expense',
    data: [-7, -10, -7, -12, -6, -9, -5, -8],
  },
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors

  return {
    chart: {
      parentHeightOffset: 0,
      stacked: true,
      type: 'bar',
      toolbar: { show: false },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
      width: 6,
      lineCap: 'round',
      colors: [currentTheme.surface],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 8,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
      },
    },
    colors: ['rgba(var(--v-theme-primary),1)', 'rgba(var(--v-theme-secondary),1)'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
      padding: {
        top: -40,
        bottom: -20,
        left: -10,
        right: -2,
      },
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
      labels: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1600,
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
        breakpoint: 1468,
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
        breakpoint: 1279,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%',
              borderRadius: 8,
            },
          },
        },
      },
      {
        breakpoint: 1197,
        options: {
          chart: {
            height: 228,
          },
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '40%',
            },
          },
        },
      },
      {
        breakpoint: 912,
        options: {
          chart: {
            height: 232,
          },
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '55%',
            },
          },
        },
      },
      {
        breakpoint: 725,
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
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '40%',
            },
          },
        },
      },
      {
        breakpoint: 475,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '50%',
            },
          },
        },
      },
      {
        breakpoint: 381,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%',
              borderRadius: 8,
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

const totalEarnings = [
  {
    avatar: 'tabler-brand-paypal',
    avatarColor: 'primary',
    title: 'Total Revenue',
    subtitle: 'Client Payment',
    earning: '+$126',
  },
  {
    avatar: 'tabler-currency-dollar',
    avatarColor: 'secondary',
    title: 'Total Sales',
    subtitle: 'Total Sales',
    earning: '+$98',
  },
]

const moreList = [
  { title: 'View More', value: 'View More' },
  { title: 'Delete', value: 'Delete' },
]
</script>

<template>
  <VCard>
    <VCardItem class="pb-0">
      <VCardTitle>Total Earning</VCardTitle>

      <div class="d-flex align-center mt-2">
        <h2 class="text-h2 me-2">
          87%
        </h2>
        <div class="text-success">
          <VIcon
            size="20"
            icon="tabler-chevron-up"
          />
          <span class="text-base">25.8%</span>
        </div>
      </div>

      <template #append>
        <div class="mt-n10 me-n2">
          <MoreBtn
            size="small"
            :menu-list="moreList"
          />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        height="191"
        class="my-2"
      />

      <VList class="card-list">
        <VListItem
          v-for="earning in totalEarnings"
          :key="earning.title"
        >
          <VListItemTitle class="font-weight-medium">
            {{ earning.title }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ earning.subtitle }}
          </VListItemSubtitle>
          <template #prepend>
            <VAvatar
              size="38"
              :color="earning.avatarColor"
              variant="tonal"
              rounded
              class="me-1"
            >
              <VIcon
                :icon="earning.avatar"
                size="22"
              />
            </VAvatar>
          </template>

          <template #append>
            <span class="text-success font-weight-medium">{{ earning.earning }}</span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
