<script setup lang="ts">
import type { ProjectAnalytics } from '@db/dashboard/type'

const projectTableHeaders = [
  { title: 'PROJECT', key: 'project' },
  { title: 'LEADER', key: 'leader' },
  { title: 'Team', key: 'team', sortable: false },
  { title: 'PROGRESS', key: 'progress' },
  { title: 'Action', key: 'Action', sortable: false },
]

const search = ref('')

const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const { data: projectsData } = await useApi<any>(createUrl('/dashboard/analytics/projects', {
  query: {
    q: search,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const projects = computed((): ProjectAnalytics[] => projectsData.value?.projects)
const totalProjects = computed(() => projectsData.value?.totalProjects)

const moreList = [
  { title: 'Download', value: 'Download' },
  { title: 'Delete', value: 'Delete' },
  { title: 'View', value: 'View' },
]
</script>

<template>
  <VCard v-if="projects">
    <VCardItem class="project-header d-flex flex-wrap justify-space-between gap-4">
      <VCardTitle>Project List</VCardTitle>

      <template #append>
        <div style="inline-size: 250px;">
          <AppTextField
            v-model="search"
            placeholder="Search Project"
          />
        </div>
      </template>
    </VCardItem>

    <VDivider />

    <!-- SECTION Table -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :items="projects"
      :items-length="totalProjects"
      item-value="name"
      :headers="projectTableHeaders"
      class="text-no-wrap"
      show-select
      @update:options="updateOptions"
    >
      <!-- projects -->
      <template #item.project="{ item }">
        <div
          class="d-flex align-center gap-x-3"
          style="padding-block: 7px;"
        >
          <VAvatar
            :size="34"
            :image="item.logo"
          />
          <div>
            <h6 class="text-h6 text-no-wrap">
              {{ item.name }}
            </h6>
            <div class="text-body-2">
              {{ item.project }}
            </div>
          </div>
        </div>
      </template>

      <template #item.leader="{ item }">
        <div class="text-base text-high-emphasis">
          {{ item.leader }}
        </div>
      </template>

      <!-- Team -->
      <template #item.team="{ item }">
        <div class="d-flex">
          <div class="v-avatar-group">
            <VAvatar
              v-for="(data, index) in item.team"
              :key="index"
              size="26"
            >
              <VImg :src="data" />
            </VAvatar>
            <VAvatar
              v-if="item.extraMembers"
              :color="$vuetify.theme.current.dark ? '#373b50' : '#eeedf0'"
              :size="26"
            >
              <div class="text-caption text-high-emphasis">
                +{{ item.extraMembers }}
              </div>
            </VAvatar>
          </div>
        </div>
      </template>

      <!-- Progress -->
      <template #item.progress="{ item }">
        <div class="d-flex align-center gap-3">
          <div class="flex-grow-1">
            <VProgressLinear
              :height="6"
              :model-value="item.progress"
              color="primary"
              rounded
            />
          </div>
          <div class="text-body-1 text-high-emphasis">
            {{ item.progress }}%
          </div>
        </div>
      </template>

      <!-- Action -->
      <template #item.Action>
        <MoreBtn :menu-list="moreList" />
      </template>

      <!-- TODO Refactor this after vuetify provides proper solution for removing default footer -->
      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalProjects"
        />
      </template>
    </VDataTableServer>
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
.project-header .v-card-item__append {
  padding-inline-start: 0;
}
</style>
