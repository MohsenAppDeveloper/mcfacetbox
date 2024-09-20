<script setup lang="ts">
import type { Course } from '@db/apps/academy/types'

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'Course Name', key: 'courseName' },
  { title: 'Time', key: 'time', sortable: false },
  { title: 'Progress', key: 'progress' },
  { title: 'Status', key: 'status', sortable: false },
]

// Fetch course Data
const { data: courseData } = await useApi<any>(createUrl('/apps/academy/courses', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const courses = computed((): Course[] => courseData.value.courses)
const totalCourse = computed(() => courseData.value.total)
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex flex-wrap justify-space-between align-center gap-4">
        <h5 class="text-h5 font-weight-medium">
          Courses you are taking
        </h5>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Course"
            style="max-inline-size: 300px;min-inline-size: 300px;"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 20, title: '20' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
      :headers="headers"
      :items="courses"
      :items-length="totalCourse"
      show-select
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Course Name -->
      <template #item.courseName="{ item }">
        <div class="d-flex align-center gap-x-4 py-2">
          <VAvatar
            variant="tonal"
            size="40"
            rounded
            :color="item.color"
          >
            <VIcon
              :icon="item.logo"
              size="28"
            />
          </VAvatar>

          <div>
            <div class="text-base font-weight-medium mb-1">
              <RouterLink
                :to="{ name: 'apps-academy-course-details' }"
                class="text-link d-inline-block"
              >
                {{ item.courseTitle }}
              </RouterLink>
            </div>
            <div class="d-flex align-center">
              <VAvatar
                size="22"
                :image="item.image"
              />
              <div class="text-body-2 text-high-emphasis ms-2">
                {{ item.user }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #item.time="{ item }">
        <h6 class="text-h6">
          {{ item.time }}
        </h6>
      </template>

      <!-- Progress -->
      <template #item.progress="{ item }">
        <div
          class="d-flex align-center gap-x-4"
          style="inline-size: 15.625rem;"
        >
          <div class="text-no-wrap font-weight-medium text-high-emphasis">
            {{ Math.floor((item.completedTasks / item.totalTasks) * 100) }}%
          </div>
          <div class="w-100">
            <VProgressLinear
              color="primary"
              height="8"
              :model-value="Math.floor((item.completedTasks / item.totalTasks) * 100)"
              rounded
            />
          </div>
          <div class="text-body-2">
            {{ item.completedTasks }}/{{ item.totalTasks }}
          </div>
        </div>
      </template>

      <!-- Status -->
      <template #item.status="{ item }">
        <div class="d-flex gap-x-5">
          <div class="d-flex gap-x-2 align-center">
            <VIcon
              icon="tabler-users"
              color="primary"
              size="24"
            />
            <div class="text-body-1">
              {{ item.userCount }}
            </div>
          </div>
          <div class="d-flex gap-x-2 align-center">
            <VIcon
              icon="tabler-book"
              color="info"
              size="24"
            />
            <span class="text-body-1">{{ item.note }}</span>
          </div>
          <div class="d-flex gap-x-2 align-center">
            <VIcon
              icon="tabler-brand-zoom"
              color="error"
              size="24"
            />
            <span class="text-body-1">{{ item.view }}</span>
          </div>
        </div>
      </template>

      <!-- Pagination -->
      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalCourse"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
