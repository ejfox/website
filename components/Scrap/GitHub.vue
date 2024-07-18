<template>
  <div class="p-2 md:p-4">
    <div class="text-xs">
      {{ scrap.metadata.href }}
    </div>
    <div v-if="scrap.metadata.type === 'starred'">
      ⭐️
    </div>



    <div class="inline-block">
      {{ scrap.summary }}
    </div>

    <NuxtLink :to="scrap.metadata.href" target="_blank" class="">
      <h2 class="text-lg leading-none">
        <span v-if="scrap.metadata.number" class="text-primary-500">
          #{{ scrap.metadata.number }}
        </span>
        {{ scrap.metadata.name }}
      </h2>
      <p class="text-xs py-2 leading-4">{{ scrap.content }}</p>
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

/* github scraps look like 

New Issue:

{
  "id": "fd49ed95-1aeb-4c03-9831-9526b7034d3e",
  "source": "github",
  "content": "It's annoying to set up, should be able to be like \"@coachartie, can you pipe the webhooks from ejfox/test to this Discord channel, please?\" ",
  "summary": null,
  "created_at": "2024-07-08T15:46:28",
  "updated_at": "2024-07-08T15:46:28",
  "tags": "[]",
  "relationships": null,
  "metadata": {
    "href": "https://github.com/room302studio/coachartie/issues/143",
    "name": "Give Artie ability to set up sending GH webhooks from a repo to a specific Discord channel",
    "repo": null,
    "type": "issue",
    "user": {
      "id": 530073,
      "url": "https://api.github.com/users/ejfox",
      "type": "User",
      "login": "ejfox",
      "node_id": "MDQ6VXNlcjUzMDA3Mw==",
      "html_url": "https://github.com/ejfox",
      "gists_url": "https://api.github.com/users/ejfox/gists{/gist_id}",
      "repos_url": "https://api.github.com/users/ejfox/repos",
      "avatar_url": "https://avatars.githubusercontent.com/u/530073?v=4",
      "events_url": "https://api.github.com/users/ejfox/events{/privacy}",
      "site_admin": false,
      "gravatar_id": "",
      "starred_url": "https://api.github.com/users/ejfox/starred{/owner}{/repo}",
      "followers_url": "https://api.github.com/users/ejfox/followers",
      "following_url": "https://api.github.com/users/ejfox/following{/other_user}",
      "organizations_url": "https://api.github.com/users/ejfox/orgs",
      "subscriptions_url": "https://api.github.com/users/ejfox/subscriptions",
      "received_events_url": "https://api.github.com/users/ejfox/received_events"
    },
    "state": "open",
    "images": [],
    "number": 143,
    "full_name": null
  },
  "scrap_id": "PykVSJGi",
  "embedding": null,
  "title": null
}


 */
</script>

<style scoped></style>