<script setup lang="ts">
import type { Review } from '@db/apps/ecommerce/types'

const selectedStatus = ref('All')
const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Fetch Reviews
const { data: ReviewData, execute: fetchReviews } = await useApi<any>(createUrl('/apps/ecommerce/reviews', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    page,
    itemsPerPage,
    sortBy,
    orderBy,
  },
}))

const reviews = computed((): Review[] => ReviewData.value.reviews)
const totalReviews = computed(() => ReviewData.value.total)

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Delete Review
const deleteReview = async (id: number) => {
  await $api(`/apps/ecommerce/reviews/${id}`, {
    method: 'DELETE',
  })

  fetchReviews()
}

const reviewCardData = [
  { rating: 5, value: 124 },
  { rating: 4, value: 40 },
  { rating: 3, value: 12 },
  { rating: 2, value: 7 },
  { rating: 1, value: 2 },
]

// Data table Headers
const headers = [
  { title: 'Product', key: 'product' },
  { title: 'Reviewer', key: 'reviewer' },
  { title: 'Review', key: 'review', sortable: false },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Chart Configs
const labelColor = 'rgba(var(--v-theme-on-surface), var(--v-disabled-opacity))'

const config = {
  colorsLabel: {
    success: '#28c76f29',
  },
  colors: {
    success: '#28c76f',
  },
}

const reviewStatChartSeries = [
  {
    data: [20, 40, 60, 80, 100, 80, 60],
  },
]

const reviewStatChartConfig = {
  chart: {
    height: 160,
    width: 190,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    padding: {
      top: -25,
      bottom: -12,
    },
  },
  colors: [config.colorsLabel.success, config.colorsLabel.success, config.colorsLabel.success, config.colorsLabel.success, config.colors.success, config.colorsLabel.success, config.colorsLabel.success],
  plotOptions: {
    bar: {
      barHeight: '75%',
      columnWidth: '25%',
      borderRadius: 4,
      distributed: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: labelColor,
        fontSize: '13px',
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  responsive: [{
    breakpoint: 0,
    options: {
      chart: {
        width: '100%',
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 1440,
    options: {
      chart: {
        height: 150,
        width: 190,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 1400,
    options: {
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 1200,
    options: {
      chart: {
        height: 130,
        width: 190,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 992,
    chart: {
      height: 150,
      width: 190,
      toolbar: {
        show: !1,
      },
    },
    options: {
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 883,
    options: {
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 768,
    options: {
      chart: {
        height: 150,
        width: 190,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 600,
    options: {
      chart: {
        width: '100%',
        height: '200',
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '30% ',
        },
      },
    },
  }, {
    breakpoint: 420,
    options: {
      plotOptions: {
        chart: {
          width: '100%',
          height: '200',
          type: 'bar',
        },
        bar: {
          borderRadius: 4,
          columnWidth: '30%',
        },
      },
    },
  }],
}
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="6"
    >
      <!-- 👉 Total Review Card  -->
      <VCard>
        <VCardText>
          <div class="d-flex gap-6 flex-column flex-sm-row">
            <div>
              <div class="d-flex align-center gap-x-2">
                <h3 class="text-h3 text-primary">
                  4.89
                </h3>
                <VIcon
                  icon="tabler-star-filled"
                  color="primary"
                  size="32"
                />
              </div>
              <h6 class="my-2 text-h6">
                Total 187 reviews
              </h6>
              <div class="mb-2 text-wrap">
                All reviews are from genuine customers
              </div>
              <VChip
                color="primary"
                label
                size="small"
              >
                +5 This week
              </VChip>
            </div>

            <VDivider :vertical="$vuetify.display.smAndUp" />

            <div class="flex-grow-1">
              <div
                v-for="(review, index) in reviewCardData"
                :key="index"
                class="d-flex align-center gap-x-4"
                :class="index !== reviewCardData.length - 1 ? 'mb-3' : ''"
              >
                <div class="text-no-wrap text-sm">
                  {{ review.rating }} Star
                </div>

                <div
                  class="flex-grow-1"
                  style="min-inline-size: 150px;"
                >
                  <VProgressLinear
                    color="primary"
                    height="8"
                    :model-value="(review.value / 185) * 100"
                    rounded
                  />
                </div>

                <div class="text-sm">
                  {{ review.value }}
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText>
          <div class="d-flex justify-space-between flex-sm-row flex-column">
            <div>
              <h5 class="text-h5 mb-2">
                Reviews statistics
              </h5>
              <div class="mb-8 mb-sm-12">
                <div class="d-inline-block me-2">
                  12 New Reviews
                </div>
                <VChip
                  color="success"
                  size="small"
                  label
                >
                  +8.4%
                </VChip>
              </div>
              <div>
                <div class="text-high-emphasis text-body-1 mb-2">
                  <span class="text-success">87%</span> Positive Reviews
                </div>
                <div class="text-body-2">
                  Weekly Report
                </div>
              </div>
            </div>
            <div>
              <VueApexCharts
                id="shipment-statistics"
                type="bar"
                height="152"
                :options="reviewStatChartConfig"
                :series="reviewStatChartSeries"
              />
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex justify-space-between flex-wrap gap-6 ">
            <div>
              <AppTextField
                v-model="searchQuery"
                style="max-inline-size: 200px; min-inline-size: 200px;"
                placeholder="Search Review"
              />
            </div>
            <div class="d-flex flex-row gap-4 align-center flex-wrap">
              <AppSelect
                v-model="itemsPerPage"
                :items="[10, 25, 50, 100]"
                style="inline-size: 6.25rem;"
              />
              <AppSelect
                v-model="selectedStatus"
                style="max-inline-size: 7.5rem;min-inline-size: 7.5rem;"
                :items="[
                  { title: 'All', value: 'All' },
                  { title: 'Published', value: 'Published' },
                  { title: 'Pending', value: 'Pending' },
                ]"
              />
              <VBtn
                prepend-icon="tabler-upload"
                variant="tonal"
                color="default"
              >
                Export
              </VBtn>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="reviews"
          show-select
          :items-length="totalReviews"
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.product="{ item }">
            <div class="d-flex gap-x-4 align-center">
              <VAvatar
                :image="item.productImage"
                :size="38"
                variant="tonal"
                rounded
              />
              <div class="d-flex flex-column">
                <h6 class="text-h6">
                  {{ item.product }}
                </h6>
                <div class="text-body-2 text-wrap clamp-text">
                  {{ item.companyName }}
                </div>
              </div>
            </div>
          </template>

          <template #item.reviewer="{ item }">
            <div class="d-flex align-center gap-x-4">
              <VAvatar
                :image="item.avatar"
                size="34"
              />
              <div class="d-flex flex-column">
                <RouterLink
                  :to="{ name: 'apps-ecommerce-customer-details-id', params: { id: 478426 } }"
                  class="font-weight-medium"
                  style="line-height: 1.375rem;"
                >
                  {{ item.reviewer }}
                </RouterLink>
                <div class="text-body-2">
                  {{ item.email }}
                </div>
              </div>
            </div>
          </template>

          <template #item.review="{ item }">
            <div class="my-4">
              <VRating
                readonly
                :model-value="item.review"
                size="24"
                class="mb-1"
              />
              <h6 class="text-h6 mb-1">
                {{ item.head }}
              </h6>
              <p class="text-sm text-wrap mb-0">
                {{ item.para }}
              </p>
            </div>
          </template>

          <template #item.date="{ item }">
            {{ new Date(item.date).toDateString() }}
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="item.status === 'Published' ? 'success' : 'warning'"
              label
              size="small"
            >
              {{ item.status }}
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem
                    value="view"
                    :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.id } }"
                  >
                    View
                  </VListItem>
                  <VListItem
                    value="delete"
                    @click="deleteReview(item.id)"
                  >
                    Delete
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <!-- pagination -->
          <template #bottom>
            <TablePagination
              v-model:page="page"
              :items-per-page="itemsPerPage"
              :total-items="totalReviews"
            />
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
