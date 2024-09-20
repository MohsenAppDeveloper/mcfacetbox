<script setup lang="ts">
const colors = {
  series1: '#7367F0',
  series2: '#8F85F3',
  series3: '#ABA4F6',
}

const bodyColor = 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))'
const labelColor = 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))'
const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

const series = [
  {
    name: 'Delivery rate',
    type: 'column',
    data: [5, 4.5, 4, 3],
  }, {
    name: 'Delivery time',
    type: 'column',
    data: [4, 3.5, 3, 2.5],
  }, {
    name: 'Delivery exceptions',
    type: 'column',
    data: [3.5, 3, 2.5, 2],
  },
]

const chartOptions = {

  chart: {
    type: 'bar',
    parentHeightOffset: 0,
    stacked: false,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadiusApplication: 'end',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    tickAmount: 10,
    categories: ['Carrier A', 'Carrier B', 'Carrier C', 'Carrier D'],
    labels: {
      style: {
        colors: labelColor,
        fontSize: '13px',
        fontFamily: 'Public Sans',
        fontWeight: 400,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    tickAmount: 4,
    max: 5,
    labels: {
      style: {
        colors: labelColor,
        fontSize: '13px',
        fontFamily: 'Public Sans',
        fontWeight: 400,
      },
      formatter(o: any) {
        return o
      },
    },
  },
  legend: {
    position: 'bottom',
    markers: {
      width: 8,
      height: 8,
      offsetX: -3,
      radius: 12,
    },
    height: 33,
    offsetY: 10,
    itemMargin: {
      horizontal: 10,
      vertical: 0,
    },
    fontSize: '13px',
    fontFamily: 'Public Sans',
    fontWeight: 400,
    labels: {
      colors: bodyColor,
      useSeriesColors: false,
    },
  },
  grid: {
    borderColor,
    strokeDashArray: 6,
  },
  colors: [colors.series1, colors.series2, colors.series3],
  fill: {
    opacity: 1,
  },
  responsive: [{
    breakpoint: 1400,
    options: {
      chart: {
        height: 275,
      },
      legend: {
        fontSize: '13px',
        offsetY: 10,
      },
    },
  }, {
    breakpoint: 576,
    options: {
      chart: {
        height: 300,
      },
      legend: {
        itemMargin: {
          vertical: 5,
          horizontal: 10,
        },
        offsetY: 7,
      },
    },
  }],
}

const moreList = [
  { title: 'View More', value: 'View More' },
  { title: 'Delete', value: 'Delete' },
]
</script>

<template>
  <VCard>
    <VCardItem class="pb-0">
      <VCardTitle>Carrier Performance</VCardTitle>

      <template #append>
        <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        height="300"
        class="carrier-chart my-2"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.carrier-chart {
  .apexcharts-legend {
    .apexcharts-legend-series {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;
      margin-block-end: 0.3125rem !important;
      margin-inline: 0 1rem !important;
      padding-inline: 0.75rem;

      &:last-child {
        margin-inline: 0 !important;
      }
    }
  }
}
</style>
