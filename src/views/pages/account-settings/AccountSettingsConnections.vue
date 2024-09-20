<script setup lang="ts">
import asana from '@images/icons/brands/asana.png'
import behance from '@images/icons/brands/behance.png'
import dribbble from '@images/icons/brands/dribbble.png'
import facebook from '@images/icons/brands/facebook.png'
import github from '@images/icons/brands/github.png'
import google from '@images/icons/brands/google.png'
import linkedin from '@images/icons/brands/linkedin.png'
import mailchimp from '@images/icons/brands/mailchimp.png'
import slack from '@images/icons/brands/slack.png'
import twitter from '@images/icons/brands/twitter.png'

const connectedAccounts = ref([
  {
    logo: google,
    name: 'Google',
    subtitle: 'Calendar and contacts',
    connected: true,
  },
  {
    logo: slack,
    name: 'Slack',
    subtitle: 'Communication',
    connected: false,
  },
  {
    logo: github,
    name: 'GitHub',
    subtitle: 'Manage your Git repositories',
    connected: true,
  },
  {
    logo: mailchimp,
    name: 'MailChimp',
    color: 'yellow',
    subtitle: 'Email marketing service',
    connected: true,
  },
  {
    logo: asana,
    name: 'Asana',
    subtitle: 'Task management',
    connected: false,
  },

])

const socialAccounts = ref([
  {
    logo: facebook,
    name: 'Facebook',
    connected: false,
  },
  {
    logo: twitter,
    name: 'Twitter',
    links: { username: '@Pixinvent', link: 'https://twitter.com/Pixinvents' },
    connected: true,
  },
  {
    logo: linkedin,
    name: 'LinkedIn',
    links: { username: '@Pixinvent', link: 'https://in.linkedin.com/in/pixinvent-creative-studio-561a4713b' },
    connected: true,
  },
  {
    logo: dribbble,
    name: 'Dribbble',
    connected: false,

  },
  {
    logo: behance,
    name: 'Behance',
    connected: false,
  },
])
</script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="6"
        class="pe-md-0 pb-0 pb-md-3"
      >
        <!-- 👉 Connected Accounts -->
        <VCard
          title="Connected Accounts"
          subtitle="Display content from your connected accounts on your site"
          flat
        >
          <VCardText>
            <VList class="card-list">
              <VListItem
                v-for="item in connectedAccounts"
                :key="item.logo"
              >
                <template #prepend>
                  <VAvatar start>
                    <img
                      :src="item.logo"
                      height="32"
                    >
                  </VAvatar>
                </template>
                <VListItemTitle>
                  <h6 class="text-h6">
                    {{ item.name }}
                  </h6>
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                  {{ item.subtitle }}
                </VListItemSubtitle>
                <template #append>
                  <VListItemAction>
                    <VSwitch
                      v-model="item.connected"
                      density="compact"
                      class="me-1"
                    />
                  </VListItemAction>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="ps-md-0 pt-0 pt-md-3"
      >
        <!-- 👉 Social Accounts -->
        <VCard
          title="Social Accounts"
          subtitle="Display content from social accounts on your site"
          flat
        >
          <VCardText>
            <VList class="card-list">
              <VListItem
                v-for="item in socialAccounts"
                :key="item.logo"
              >
                <template #prepend>
                  <VAvatar
                    rounded
                    start
                  >
                    <img
                      :src="item.logo"
                      height="32"
                    >
                  </VAvatar>
                </template>
                <VListItemTitle>
                  <h6 class="text-h6">
                    {{ item.name }}
                  </h6>
                </VListItemTitle>
                <VListItemSubtitle v-if="item.links?.link">
                  <a
                    :href="item.links.link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ item.links?.username }}</a>
                </VListItemSubtitle>
                <VListItemSubtitle
                  v-else
                  class="text-xs"
                >
                  Not Connected
                </VListItemSubtitle>
                <template #append>
                  <VListItemAction>
                    <IconBtn
                      variant="tonal"
                      :color="item.connected ? 'error' : 'secondary'"
                      class="rounded"
                    >
                      <VIcon
                        size="22"
                        :icon="item.connected ? 'tabler-trash' : 'tabler-link' "
                      />
                    </IconBtn>
                  </VListItemAction>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 16px;
}
</style>
