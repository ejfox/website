<template>
  <div class="max-w-screen-md border border-gray-500 rounded mb-8 text-[10px]">
    <!-- pull the right scrap component based on the source -->
    <!-- <ScrapArena v-if="scrap.source === 'arena'" :scrap="scrap" class="" />
    <ScrapPinboard v-if="scrap.source === 'pinboard'" :scrap="scrap" class="" />
    <ScrapMastodon v-if="scrap.source === 'mastodon'" :scrap="scrap" class="" />
    <ScrapGitHub v-else-if="scrap.source === 'github'" :scrap="scrap" class="" /> -->
    <p class="p-0.5" v-html="scrap.content" />

    <div class="flex items-center space-x-2">
      <UIcon :name="getIconName(scrap.source)" class="w-2 h-2" />

      <!-- <p class="timestamp">{{ scrap.created_at }}</p> -->
      <!-- <div v-if="scrap.metadata.latitude && scrap.metadata.longitude" class="">
        {{ scrap.metadata.latitude }}, {{ scrap.metadata.longitude }}
      </div> -->
      <NuxtLink :to="scrap.href" target="_blank" color="primary" class="inline-block">
        <UIcon name="i-heroicons-link" class="w-2 h-2" />
        Link
      </NuxtLink>
      <!-- <div>
        Raw
        <UToggle v-model="showRaw" label="Show Raw" size="xs" />
      </div>

      <div v-if="relationshipNodes.length">
        Relationships
        <UToggle v-model="showRelationships" label="Show Relationships" size="xs" />
      </div> -->

    </div>

    <!-- Tags -->
    <!-- <div v-if="scrap.tags.length > 3" class="flex flex-wrap gap-2">
      <NuxtLink v-for="tag in JSON.parse(scrap.tags)" :key="tag" :to="`/scrapbook/tags?tag=${tag}`">
        <UBadge color="gray" size="sm">{{ tag }}</UBadge>
      </NuxtLink>
    </div> -->

    <!-- relationship nodes -->
    <div v-if="relationshipNodes.length && showRelationships" class="">
      <h3 class="font-bold text-gray-500">Relationships</h3>
      <div class="flex flex-wrap items-center">
        <!-- <div v-for="node in relationshipNodes" :key="node.name" class="flex items-center space-x-2">
          <span class="bg-gray-200 text-gray-800 rounded-md mr-0.5 mb-0.5 py-0.5 px-1">{{ node }}</span>
        </div> -->

        <!-- and the edges -->
        <div v-for="edge in relationshipEdges" :key="edge.source + edge.target"
          class="flex w-full items-center space-x-2">
          <span class="bg-gray-200 text-gray-800 rounded-md mr-0.5 mb-0.5 py-0.5 px-1 max-w-2/6">{{ edge.source
            }}</span>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          {{ edge.type }}
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          <span class="bg-gray-200 text-gray-800 rounded-md mr-0.5 mb-0.5 py-0.5 px-1 max-w-2/6">{{ edge.target
            }}</span>
        </div>

      </div>
    </div>

    <pre v-if="showRaw" class="text-xs max-h-48 overflow-auto bg-gray-950 text-white p-1">{{ scrap }}</pre>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const showRaw = ref(false)
const showRelationships = ref(false)

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})



const relationshipNodes = computed(() => {
  const nodes = []
  // check if we have relationships in the metadata
  if (props.scrap.relationships) {
    // go through each relationship and add the source and target to the nodes
    props.scrap.relationships.forEach((relationship) => {
      nodes.push(relationship.source.name)
      nodes.push(relationship.target.name)
    })
  }


  // return unique nodes
  const uniqueNodes = [...new Set(nodes)]


  return uniqueNodes
})

// to show a graph we need to compute
// the nodes and edges
// in a format that we can feed to d3 force simulation
// we can use the relationshipNodes computed property
// to get the nodes
// and the relationships in the metadata to get the edges
const relationshipEdges = computed(() => {
  const edges = []
  // check if we have relationships in the metadata
  if (props.scrap.relationships) {
    // go through each relationship and add the source and target to the nodes
    props.scrap.relationships.forEach((relationship) => {
      edges.push({
        source: relationship.source.name,
        target: relationship.target.name,
        type: relationship.type,
      })
    })
  }

  return edges
})


const formatDate = (date) => format(new Date(date), 'MMM d')

const getIconName = (type) => {
  const iconMap = {
    'github-pr': 'i-ph-git-pull-request-fill',
    'github-star': 'i-material-symbols-light-kid-star-outline',
    'mastodon': 'i-mingcute-thought-fill',
    'user-github-issue': 'i-octicon-issue-opened-16',
    'github-gist': 'i-material-symbols-code-blocks-outline-sharp',
    'pinboard': 'i-cib-pinboard',
  }
  return iconMap[type] || 'i-heroicons-document'
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
</script>