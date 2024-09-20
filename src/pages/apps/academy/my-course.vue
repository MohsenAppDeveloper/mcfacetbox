<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue'
import AcademyMyCourses from '@/views/apps/academy/AcademyMyCourses.vue'
import boyAppAcademy from '@images/illustrations/boy-app-academy.png'
import girlAppAcademy from '@images/illustrations/girl-app-academy.png'
import academyCourseIllustration1 from '@images/pages/academy-course-illustration1.png'
import academyCourseIllustration2 from '@images/pages/academy-course-illustration2.png'
import guitarCoursePoster from '@images/pages/guitar-course-poster.png'
import singingCoursePoster from '@images/pages/singing-course-poster.png'

const searchQuery = ref('')
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
        >
          <h4
            class="text-h4 text-center text-wrap mx-auto"
            :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'"
          >
            Education, talents, and career
            opportunities. <span class="text-primary text-no-wrap"> All in one place.</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            Grow your skill with the most reliable online courses and certifications in marketing, information technology, programming, and data science.
          </p>
          <div class="d-flex justify-center align-center gap-4 flex-wrap">
            <div
              class="flex-grow-1"
              style="max-inline-size: 350px;"
            >
              <AppTextField
                v-model="searchQuery"
                placeholder="Find your course"
              />
            </div>
            <VBtn
              color="primary"
              density="comfortable"
              icon="tabler-search"
              class="rounded"
            />
          </div>
        </div>
        <img
          :src="academyCourseIllustration1"
          class="illustration1 d-none d-md-block"
          height="180"
        >
        <img
          :src="academyCourseIllustration2"
          class="illustration2 d-none d-md-block"
          height="100"
        >
      </VCardText>
    </VCard>

    <AcademyMyCourses :search-query="searchQuery" />

    <div class="mb-6">
      <VRow>
        <VCol
          v-for="{ title, btnText, color, description, image } in [
            { title: 'Earn a Certificate', description: 'Get the right professional certificate program for you.', btnText: 'View Programs', color: 'primary', image: boyAppAcademy },
            { title: 'Best Rated Courses', description: 'Enroll now in the most popular and best rated courses.', btnText: 'View Courses', color: 'error', image: girlAppAcademy },
          ]"
          :key="title"
          cols="12"
          md="6"
        >
          <VCard

            flat
            :color="`rgba(var(--v-theme-${color}), var(--v-selected-opacity))`"
          >
            <VCardText>
              <div class="d-flex justify-space-between gap-4 flex-column-reverse flex-sm-row">
                <div class="text-center text-sm-start">
                  <h5
                    class="text-h5 mb-1"
                    :class="`text-${color}`"
                  >
                    <div class="d-flex justify-space-between gap-4 flex-column-reverse flex-sm-row">
                      <div class="text-center text-sm-start">
                        <h5
                          class="text-h5 mb-1"
                          :class="`text-${color}`"
                        >
                          {{ title }}
                        </h5>
                      </div>
                    </div>
                  </h5>
                  <p
                    class="text-body-1 mx-auto"
                    style="max-inline-size: 300px;"
                  >
                    {{ description }}
                  </p>
                  <VBtn :color="color">
                    {{ btnText }}
                  </VBtn>
                </div>

                <div class="align-self-center">
                  <div class="align-self-center">
                    <img
                      :src="image"
                      height="127"
                      class="flip-in-rtl"
                    >
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <div class="d-flex flex-column align-center gap-y-4 h-100 justify-center">
              <VAvatar
                variant="tonal"
                size="52"
                rounded
                color="primary"
              >
                <VIcon
                  icon="tabler-gift"
                  size="36"
                />
              </VAvatar>
              <h4 class="text-h4 font-weight-medium">
                Today's Free Courses
              </h4>
              <p class="text-body-1 text-center mb-0">
                We offers 284 Free Online courses from top tutors and companies to help you start or advance your career skills. Learn online for free and fast today!
              </p>
              <VBtn>Get Premium Courses</VBtn>
            </div>
          </VCol>
          <VCol
            cols="12"
            md="4"
            sm="6"
          >
            <VCard
              flat
              border
            >
              <div class="px-2 pt-2">
                <VideoPlayer
                  src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                  :poster="guitarCoursePoster"
                  controls
                  plays-inline
                  :height="$vuetify.display.mdAndUp ? 200 : 150"
                  class="w-100 rounded"
                />
              </div>
              <VCardText>
                <h5 class="text-h5 mb-2">
                  Your First Singing Lesson
                </h5>
                <p class="text-body-1 mb-0">
                  In the same way as any other artistic domain, singing lends itself perfectly to self-teaching.
                </p>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            md="4"
            sm="6"
          >
            <VCard
              flat
              border
            >
              <div class="px-2 pt-2">
                <VideoPlayer
                  src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                  :poster="singingCoursePoster"
                  controls
                  plays-inline
                  :height="$vuetify.display.mdAndUp ? 200 : 150"
                  class="w-100 rounded"
                />
              </div>
              <VCardText>
                <h5 class="text-h5 mb-2">
                  Guitar for Beginners
                </h5>
                <p class="text-body-1 mb-0">
                  The Fender Acoustic Guitar is best choice for beginners and professionals.
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@import "video.js/dist/video-js.css";

.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 2rem;
  inset-inline-start: 2.5rem;
}
</style>
