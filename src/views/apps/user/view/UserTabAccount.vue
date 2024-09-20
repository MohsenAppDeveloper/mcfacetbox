<script lang="ts" setup>
import UserInvoiceTable from './UserInvoiceTable.vue'

// Images
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import figma from '@images/icons/project-icons/figma.png'
import html5 from '@images/icons/project-icons/html5.png'
import pdf from '@images/icons/project-icons/pdf.png'
import python from '@images/icons/project-icons/python.png'
import react from '@images/icons/project-icons/react.png'
import sketch from '@images/icons/project-icons/sketch.png'
import vue from '@images/icons/project-icons/vue.png'
import xamarin from '@images/icons/project-icons/xamarin.png'

// Project Table Header
const projectTableHeaders = [
  { title: 'PROJECT', key: 'project' },
  { title: 'LEADER', key: 'leader' },
  { title: 'Team', key: 'team' },
  { title: 'PROGRESS', key: 'progress' },
  { title: 'Action', key: 'Action', sortable: false },
]

const search = ref('')

const options = ref({ itemsPerPage: 5, page: 1 })

const projects = [
  {
    logo: react,
    name: 'BGC eCommerce App',
    project: 'React Project',
    leader: 'Eileen',
    progress: 78,
    hours: '18:42',
    team: [avatar1, avatar8, avatar6],
    extraMembers: 3,
  },
  {
    logo: figma,
    name: 'Falcon Logo Design',
    project: 'Figma Project',
    leader: 'Owen',
    progress: 25,
    hours: '20:42',
    team: [avatar5, avatar2],
  },
  {
    logo: vue,
    name: 'Dashboard Design',
    project: 'Vuejs Project',
    leader: 'Keith',
    progress: 62,
    hours: '120:87',
    team: [avatar8, avatar2, avatar1],
  },
  {
    logo: xamarin,
    name: 'Foodista mobile app',
    project: 'Xamarin Project',
    leader: 'Merline',
    progress: 8,
    hours: '120:87',
    team: [avatar3, avatar4, avatar7],
    extraMembers: 8,
  },
  {
    logo: python,
    name: 'Dojo Email App',
    project: 'Python Project',
    leader: 'Harmonia',
    progress: 51,
    hours: '230:10',
    team: [avatar4, avatar3, avatar1],
    extraMembers: 5,
  },
  {
    logo: sketch,
    name: 'Blockchain Website',
    project: 'Sketch Project',
    leader: 'Allyson',
    progress: 92,
    hours: '342:41',
    team: [avatar1, avatar8],
  },
  {
    logo: html5,
    name: 'Hoffman Website',
    project: 'HTML Project',
    leader: 'Georgie',
    progress: 80,
    hours: '12:45',
    team: [avatar1, avatar8, avatar6],
  },
]

const moreList = [
  { title: 'Download', value: 'Download' },
  { title: 'Delete', value: 'Delete' },
  { title: 'View', value: 'View' },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4">
          <h5 class="text-h5">
            User's Projects List
          </h5>

          <div style="inline-size: 250px;">
            <AppTextField
              v-model="search"
              placeholder="Search Project"
            />
          </div>
        </VCardText>
        <VDivider />
        <!-- 👉 User Project List Table -->

        <!-- SECTION Datatable -->

        <VDataTable
          v-model:page="options.page"
          :headers="projectTableHeaders"
          :items-per-page="options.itemsPerPage"
          :items="projects"
          item-value="name"
          hide-default-footer
          :search="search"
          show-select
          class="text-no-wrap"
        >
          <!-- projects -->
          <template #item.project="{ item }">
            <div class="d-flex align-center gap-x-3">
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
              v-model:page="options.page"
              :items-per-page="options.itemsPerPage"
              :total-items="projects.length"
            />
          </template>
        </VDataTable>
        <!-- !SECTION -->
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 User Activity timeline -->
      <VCard title="User Activity Timeline">
        <VCardText>
          <VTimeline
            side="end"
            align="start"
            line-inset="8"
            truncate-line="start"
            density="compact"
          >
            <!-- SECTION Timeline Item: Flight -->
            <VTimelineItem
              dot-color="primary"
              size="x-small"
            >
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                <span class="app-timeline-title">
                  12 Invoices have been paid
                </span>
                <span class="app-timeline-meta">12 min ago</span>
              </div>

              <!-- 👉 Content -->
              <div class="app-timeline-text mt-1">
                Invoices have been paid to the company
              </div>

              <div class="d-inline-flex align-center timeline-chip mt-2">
                <img
                  :src="pdf"
                  height="20"
                  class="me-2"
                  alt="img"
                >
                <span class="app-timeline-text font-weight-medium">
                  invoice.pdf
                </span>
              </div>
            </VTimelineItem>
            <!-- !SECTION -->

            <!-- SECTION Timeline Item: Interview Schedule -->
            <VTimelineItem
              size="x-small"
              dot-color="success"
            >
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center flex-wrap mb-2">
                <div class="app-timeline-title">
                  Client Meeting
                </div>
                <span class="app-timeline-meta">45 min ago</span>
              </div>

              <div class="app-timeline-text mt-1">
                Project meeting with john @10:15am
              </div>

              <!-- 👉 Person -->
              <div class="d-flex justify-space-between align-center flex-wrap">
                <!-- 👉 Avatar & Personal Info -->
                <div class="d-flex align-center mt-2">
                  <VAvatar
                    size="32"
                    class="me-2"
                    :image="avatar1"
                  />
                  <div class="d-flex flex-column">
                    <p class="text-sm font-weight-medium text-medium-emphasis mb-0">
                      Lester McCarthy (Client)
                    </p>
                    <span class="text-sm">CEO of ThemeSelection</span>
                  </div>
                </div>
              </div>
            </VTimelineItem>
            <!-- !SECTION -->

            <!-- SECTION Design Review -->
            <VTimelineItem
              size="x-small"
              dot-color="info"
            >
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center flex-wrap mb-2">
                <span class="app-timeline-title">
                  Create a new project for client
                </span>
                <span class="app-timeline-meta">2 Day Ago</span>
              </div>

              <!-- 👉 Content -->
              <p class="app-timeline-text mt-1 mb-2">
                6 team members in a project
              </p>

              <div class="v-avatar-group demo-avatar-group">
                <VAvatar :size="40">
                  <VImg :src="avatar1" />
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    John Doe
                  </VTooltip>
                </VAvatar>

                <VAvatar :size="40">
                  <VImg :src="avatar2" />
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    Jennie Obrien
                  </VTooltip>
                </VAvatar>

                <VAvatar :size="40">
                  <VImg :src="avatar3" />
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    Peter Harper
                  </VTooltip>
                </VAvatar>

                <VAvatar
                  :size="40"
                  :color="$vuetify.theme.current.dark ? '#373b50' : '#eeedf0'"
                >
                  +3
                </VAvatar>
              </div>
            </VTimelineItem>
            <!-- !SECTION -->
          </VTimeline>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
  </VRow>
</template>
