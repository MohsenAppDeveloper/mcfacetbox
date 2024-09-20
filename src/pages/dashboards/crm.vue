<script setup lang="ts">
import CrmActiveProject from '@/views/dashboards/crm/CrmActiveProject.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import CrmAnalyticsSales from '@/views/dashboards/crm/CrmAnalyticsSales.vue'
import CrmEarningReportsYearlyOverview from '@/views/dashboards/crm/CrmEarningReportsYearlyOverview.vue'
import CrmOrderBarChart from '@/views/dashboards/crm/CrmOrderBarChart.vue'
import CrmProjectStatus from '@/views/dashboards/crm/CrmProjectStatus.vue'
import CrmRecentTransactions from '@/views/dashboards/crm/CrmRecentTransactions.vue'
import CrmRevenueGrowth from '@/views/dashboards/crm/CrmRevenueGrowth.vue'
import CrmSalesAreaCharts from '@/views/dashboards/crm/CrmSalesAreaCharts.vue'
import CrmSalesByCountries from '@/views/dashboards/crm/CrmSalesByCountries.vue'

const simpleStatisticsDemoCards = [
  {
    icon: 'tabler-credit-card',
    color: 'error',
    title: 'Total Profit',
    subTitle: 'Last week',
    stat: '1.28k',
    change: '-12.2%',
  },
  {
    icon: 'tabler-currency-dollar',
    color: 'success',
    title: 'Total Sales',
    subTitle: 'Last week',
    stat: '$4,673',
    change: '+25.2%',
  },
]
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
      sm="6"
      lg="2"
    >
      <CrmOrderBarChart />
    </VCol>

    <VCol
      cols="12"
      md="4"
      sm="6"
      lg="2"
    >
      <CrmSalesAreaCharts />
    </VCol>

    <VCol
      v-for="demo in simpleStatisticsDemoCards"
      :key="demo.title"
      cols="12"
      sm="6"
      md="4"
      lg="2"
    >
      <VCard>
        <VCardText>
          <VAvatar
            :color="demo.color"
            variant="tonal"
            rounded
            size="44"
          >
            <VIcon
              :icon="demo.icon"
              size="28"
            />
          </VAvatar>

          <h5 class="text-h5 mt-3">
            {{ demo.title }}
          </h5>
          <p class="my-1">
            {{ demo.subTitle }}
          </p>
          <p class="mb-3 text-high-emphasis">
            {{ demo.stat }}
          </p>
          <VChip
            :color="demo.color"
            label
            size="small"
          >
            {{ demo.change }}
          </VChip>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Revenue Growth -->
    <VCol
      cols="12"
      md="8"
      lg="4"
    >
      <CrmRevenueGrowth />
    </VCol>

    <!-- 👉 Earning Reports -->
    <VCol
      cols="12"
      md="8"
    >
      <CrmEarningReportsYearlyOverview />
    </VCol>

    <!-- 👉 Sales -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmAnalyticsSales />
    </VCol>

    <!-- 👉 Browser States -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmSalesByCountries />
    </VCol>

    <!-- 👉 Project Status -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmProjectStatus />
    </VCol>

    <!-- 👉 Active Project -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmActiveProject />
    </VCol>

    <!-- 👉 Recent Transactions -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmRecentTransactions />
    </VCol>

    <!-- 👉 Active timeline -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmActivityTimeline />
    </VCol>
  </VRow>
</template>
