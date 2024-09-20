<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue'
import type { CourseDetails } from '@db/apps/academy/types'
import InstructorPoster from '@images/pages/instructor-poster.png'
import 'video.js/dist/video-js.css'

const courseDetails = ref<CourseDetails>()

const { data, error } = await useApi<CourseDetails>('/apps/academy/course-details')

if (error.value)
  console.log(error.value)
else if (data.value)
  courseDetails.value = data.value

const panelStatus = ref(0)
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="8"
    >
      <VCard>
        <VCardItem
          title="UI/UX Basic Fundamentals"
          class="pb-6"
        >
          <template #subtitle>
            <div class="text-body-1">
              Prof. <span class="text-h6 d-inline-block">{{ courseDetails?.instructor }}</span>
            </div>
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip
                variant="tonal"
                color="error"
                size="small"
              >
                UI/UX
              </VChip>
              <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-share"
              />
              <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-bookmarks"
              />
            </div>
          </template>
        </VCardItem>
        <VCardText>
          <VCard
            flat
            border
          >
            <div class="px-2 pt-2">
              <VideoPlayer
                src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                :poster="InstructorPoster"
                controls
                plays-inline
                :height="$vuetify.display.mdAndUp ? 440 : 250"
                class="w-100 rounded"
              />
            </div>
            <VCardText>
              <h5 class="text-h5 mb-4">
                About this course
              </h5>
              <p class="text-body-1">
                {{ courseDetails?.about }}
              </p>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                By the numbers
              </h5>
              <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                <div>
                  <VList class="card-list text-medium-emphasis">
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-check"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Skill Level: {{ courseDetails?.skillLevel }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-users"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Students: {{ courseDetails?.totalStudents }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-world"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Languages: {{ courseDetails?.language }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-file"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Captions: {{ courseDetails?.isCaptions }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </div>

                <div>
                  <VList class="card-list text-medium-emphasis">
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-video"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Lectures: {{ courseDetails?.totalLectures }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-clock"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Video: {{ courseDetails?.length }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
              </div>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Description
              </h5>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="courseDetails?.description" />

              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Instructor
              </h5>
              <div class="d-flex align-center gap-x-4">
                <VAvatar
                  :image="courseDetails?.instructorAvatar"
                  size="38"
                />
                <div>
                  <h6 class="text-h6 mb-1">
                    {{ courseDetails?.instructor }}
                  </h6>
                  <div class="text-body-2">
                    {{ courseDetails?.instructorPosition }}
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <div class="course-content">
        <VExpansionPanels
          v-model="panelStatus"
          variant="accordion"
          class="expansion-panels-width-border"
        >
          <template
            v-for="(section, index) in courseDetails?.content"
            :key="index"
          >
            <VExpansionPanel
              elevation="0"
              :value="index"
              expand-icon="tabler-chevron-right"
              collapse-icon="tabler-chevron-down"
            >
              <template #title>
                <div>
                  <h5 class="text-h5 mb-1">
                    {{ section.title }}
                  </h5>
                  <div class="text-medium-emphasis font-weight-normal">
                    {{ section.status }} | {{ section.time }}
                  </div>
                </div>
              </template>
              <template #text>
                <VList class="card-list">
                  <VListItem
                    v-for="(topic, id) in section.topics"
                    :key="id"
                    class="py-4"
                  >
                    <template #prepend>
                      <VCheckbox
                        :model-value="topic.isCompleted"
                        class="me-1"
                      />
                    </template>
                    <VListItemTitle class="text-high-emphasis font-weight-medium">
                      {{ id + 1 }} . {{ topic.title }}
                    </VListItemTitle>
                    <VListItemSubtitle>
                      <div class="text-body-2">
                        {{ topic.time }}
                      </div>
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </template>
            </VExpansionPanel>
          </template>
        </VExpansionPanels>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.course-content {
  position: sticky;
  inset-block: 4rem 0;
}

.card-list {
  --v-card-list-gap: 16px;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutsMixins;

body .v-layout .v-application__wrap {
  .course-content {
    .v-expansion-panels {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;

      .v-expansion-panel {
        &--active {
          .v-expansion-panel-title--active {
            border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }
        }

        .v-expansion-panel-title {
          .v-expansion-panel-title__overlay {
            background-color: rgba(var(--v-theme-on-surface));
            opacity: var(--v-hover-opacity) !important;
          }

          &:hover {
            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }

          &__icon {
            .v-icon {
              block-size: 1.5rem !important;
              color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
              font-size: 1.5rem !important;
              inline-size: 1.5rem !important;

              @include layoutsMixins.rtl {
                transform: scaleX(-1);
              }
            }
          }
        }

        .v-expansion-panel-text {
          &__wrapper {
            padding-block: 1rem;
            padding-inline: 0.75rem;
          }
        }
      }
    }
  }

  .card-list {
    .v-list-item__prepend {
      .v-list-item__spacer {
        inline-size: 8px !important;
      }
    }
  }
}
</style>
