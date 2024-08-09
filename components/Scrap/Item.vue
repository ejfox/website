<template>
  <div class="max-w-screen-md border border-gray-100 dark:border-gray-800 rounded mb-8">
    <!-- Scrap components based on source -->
    <ScrapArena v-if="scrap.source === 'arena'" :scrap="scrap" />
    <ScrapPinboard v-if="scrap.source === 'pinboard'" :scrap="scrap" />
    <ScrapMastodon v-if="scrap.source === 'mastodon'" :scrap="scrap" />
    <ScrapGitHub v-else-if="scrap.source === 'github'" :scrap="scrap" />



    <!-- Relationships -->
    <div v-show="hasRelationships && showRelationships" class="mt-4 text-xs">

      <ClientOnly>
        <svg ref="relationshipGraph" class="w-full h-96">

          <g v-for="edge in edges" :key="`${edge.source}-${edge.target}`" class="group">
            <line :x1="edge.source.x" :y1="edge.source.y" :x2="edge.target.x" :y2="edge.target.y"
              :stroke="isDark ? '#999' : '#ccc'" />
            class="group-line" />
            <!-- edge label, rotated to match the line -->
            <text :transform="calcLineLabelTransform(edge)" fill="red" font-size="8" text-anchor="middle">{{ edge.type
              }}</text>
          </g>
          <g v-for="node in nodes" :key="node.name">
            <foreignObject :x="node.x" :y="node.y - 16" width="128" height="64">
              <div class="text-xs p-1 leading-none rounded w-full break-words text-balance">
                <p class="text-black dark:text-white">{{ node.name }}</p>
              </div>
            </foreignObject>
          </g>
        </svg>
      </ClientOnly>


      <!-- <h3 class="font-bold text-gray-500">Relationships</h3>
<div class="flex flex-wrap items-center" v-if="relationshipEdges.length > 0">
  <div v-for="edge in relationshipEdges" :key="`${edge.source.name}-${edge.target.name}`"
    class="flex w-full items-center space-x-2">
    <span class="bg-gray-200 text-gray-800 rounded-md mr-0.5 mb-0.5 py-0.5 px-1 max-w-2/6">
      {{ edge.source }}
    </span>
    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
    {{ edge.type }}
    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
    <span class="bg-gray-200 text-gray-800 rounded-md mr-0.5 mb-0.5 py-0.5 px-1 max-w-2/6">
      {{ edge.target }}
    </span>
  </div>
</div> -->
    </div>

    <div class="flex items-center justify-between text-[10px] text-gray-500 px-2">

      <div class="flex items-center space-x-2 justify-center">
        <UIcon :name="getIconName(scrap.source)" class="w-4 h-4" />
        <span>{{ scrap.source }}</span>
        <span class="text-gray-300 dark:text-gray-700">{{ scrap.scrap_id }}</span>
      </div>

      <p class="timestamp">{{ formatDate(scrap.created_at) }}</p>

      <div v-if="hasLocation" class="opacity-50 hover:opacity-100 transition-opacity">
        {{ scrap.metadata.latitude }}, {{ scrap.metadata.longitude }}
      </div>

      <UButton :to="scrap.href" target="_blank" color="primary" variant="ghost" icon="i-heroicons-link" size="xs">
        Link
      </UButton>

      <div class="flex items-center space-x-2">
        <span>Raw</span>
        <UToggle v-model="showRaw" size="xs" />
      </div>

      <div v-if="hasRelationships" class="flex items-center space-x-2">
        <span>Relationships</span>
        <UToggle v-model="showRelationships" size="xs" />
      </div>
    </div>


    <!-- Tags -->
    <div v-if="hasTags" class="flex flex-wrap gap-2 p-2">
      <NuxtLink v-for="tag in parsedTags" :key="tag" :to="`/scrapbook/tags?tag=${tag}`">
        <UBadge :color="isDark ? 'white' : 'black'" size="sm"
          :class="{ 'dark:border-white border-black border': isMainTag(tag) }">
          {{ tag }}
        </UBadge>
      </NuxtLink>
    </div>



    <!-- Raw Data -->
    <pre v-if="showRaw" class="text-[9px] max-h-48 overflow-auto bg-gray-950 text-white p-1">
      {{ scrap }}
    </pre>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import useScrapTags from '~/composables/useScrapTags'
import * as d3 from 'd3'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

const showRaw = ref(false)
const showRelationships = ref(false)

const isDark = useDark()

const { mainTags } = useScrapTags()

const hasLocation = computed(() => props.scrap.metadata?.latitude && props.scrap.metadata?.longitude)
const hasRelationships = computed(() => props.scrap.relationships?.length > 0)
const hasTags = computed(() => props.scrap.tags && JSON.parse(props.scrap.tags).length > 0)
const parsedTags = computed(() => JSON.parse(props.scrap.tags || '[]'))

function calcLineLabelTransform(edge) {
  const dx = edge.target.x - edge.source.x
  const dy = edge.target.y - edge.source.y
  let angle = Math.atan2(dy, dx) * 180 / Math.PI
  if (angle > 90) angle -= 180
  if (angle < -90) angle += 180
  const x = (edge.source.x + edge.target.x) / 2
  const y = (edge.source.y + edge.target.y) / 2 - 5 // Adjust the y-coordinate to be 5px above the midpoint
  return `translate(${x}, ${y}) rotate(${angle})`
}


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

const isMainTag = (tag) => mainTags.value.includes(tag)



// set up the relationship graph
const relationshipEdges = computed(() => {
  if (!hasRelationships.value) return []
  return props.scrap.relationships.map(rel => ({
    source: rel.source.name,
    target: rel.target.name,
    type: rel.type,
  }))
})

const relationshipNodes = computed(() => {
  if (!hasRelationships.value) return []
  const nodes = new Set()
  props.scrap.relationships.forEach(rel => {
    nodes.add(rel.source.name)
    nodes.add(rel.target.name)
  })
  return Array.from(nodes).map(name => ({ id: name }))
})


const relationshipGraph = ref(null)

const { width: graphWidth, height: graphHeight } = useElementSize(relationshipGraph)

// Simulation setup
const simulation = ref(null)
const nodes = ref([])
const edges = ref([])
onMounted(async () => {
  // console.log(relationshipNodes.value)

  await nextTick()

  // minimum width of 320px
  const width = Math.max(graphWidth.value, 700)
  const height = Math.max(graphHeight.value, 320)

  nodes.value = unref(relationshipNodes).map(d => {
    return {
      name: d.id,
      x: Math.random() * width,
      y: Math.random() * height
    }
  })
    // remove any orphan nodes
    .filter(d => relationshipEdges.value.some(e => e.source === d.name || e.target === d.name))


  edges.value = relationshipEdges.value.map(d => {
    return {
      source: nodes.value.find(n => n.name === d.source),
      target: nodes.value.find(n => n.name === d.target),
      type: d.type
    }
  })




  // Initialize the simulation
  simulation.value = d3.forceSimulation(nodes.value)
    .force('center', d3.forceCenter(width / 2, height / 2).strength(2))
    .force('link', d3.forceLink(edges.value).id(d => d.name).distance(92).strength(0.35))
    .force('charge', d3.forceManyBody().strength(-1000).distanceMax(200))
    .force('collide', d3.forceCollide().radius(132).strength(0.52))
    // a new force to contain the nodes within the bounds of the svg
    // with a % padding
    .force('box', () => {
      for (const node of nodes.value) {
        node.x = Math.max(node.x, 92)
        node.x = Math.min(node.x, width - 320)
        node.y = Math.max(node.y, 124)
        node.y = Math.min(node.y, height - 92)
      }
    })

})


</script>
<style scoped>
svg .group text {
  opacity: 0;
}

svg .group:hover text {
  opacity: 1;
}
</style>