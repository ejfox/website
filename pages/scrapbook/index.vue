<template>
  <div ref="scrapcontainer" class="container mx-auto px-4 py-8 max-h-screen overflow-y-auto monospace">
    <h1 class="text-3xl font-bold mb-4 lg:mb-8">Scrapbook</h1>
    <NuxtLink :to="`/scrapbook/verbose`" class="underline block">
      Verbose view</NuxtLink>
    <NuxtLink :to="`/scrapbook/graph`" class="underline block">
      Graph view</NuxtLink>
    <NuxtLink :to="`/scrapbook/graph`" class="underline block">
      Card view</NuxtLink>
    <div v-for="(group, groupIndex) in groupedScraps" :key="groupIndex" class="mb-4">
      <ScrapGallery v-if="group.type === 'gallery'" :scraps="group.items" />
      <ScrapPRBlock v-else-if="group.type === 'pr'" :scraps="group.items" />
      <ScrapItem v-else :scrap="group.items[0]" />

      <UButton v-if="scrapOnDeck.includes(group.items[0].scrap_id)" @click="removeScrapFromDeck(group.items[0])"
        color="red">Remove</UButton>
      <UButton v-else @click="addScrapToDeck(group.items[0])" color="green">Add to deck</UButton>
    </div>
    <div v-if="loading" class="text-center">Loading...</div>


    <!-- horizontally scrolling deck drawer -->
    <!-- <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-400 h-80 overflow-x-auto overflow-y-hidden"
      v-if="scrapOnDeck.length > 0">
      <div class="px-2 py-1 w-full">
        <h2 class="text-lg font-bold m-0 py-1">On Deck
          <span class="mr-2">
            <UBadge color="black">{{ scrapOnDeck.length }}</UBadge>
          </span>
          <UButton @click="clearDeck" color="red">Clear all</UButton>



        </h2>
        <div v-if="scrapOnDeck.length === 0" class="text-center text-gray-500">No scraps on deck</div>
        <div v-else class="flex flex-nowrap overflow-x-auto ">
          <div v-for="scrap in scrapOnDeckObjects" :key="scrapId"
            class="border-b border-gray-200 bg-gray-200 dark:bg-gray-800 rounded-sm min-h-48 min-w-48 mr-2">
            <ScrapVerboseScrapItem v-if="scrap" :scrap="scrap" class="min-h-32" />
            <UButton @click="removeScrapFromDeck(scrap.scrap_id)" color="red" variant="outline">Remove</UButton>
          </div>
        </div>
      </div>
    </div> -->

    <!-- vertically scrolling deck drawer -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-400 h-80 overflow-y-auto"
      v-if="scrapOnDeck.length > 0">
      <div class="px-2 py-1 w-full">
        <h2 class="text-lg font-bold m-0 py-1">On Deck
          <span class="mr-2">
            <UBadge color="black">{{ scrapOnDeck.length }}</UBadge>
          </span>
          <UButton @click="clearDeck" color="red" class="m-1">Clear all</UButton>

          <UButton @click="addScrapByIdMode = !addScrapByIdMode" color="yellow" class="m-1">Add by ID</UButton>

          <!-- save / load deck buttons -->
          <UButton @click="saveDeck" color="green" class="m-1">Save as deck
            {{ currentDeck + 1 }}
          </UButton>
          <div class="inline-flex flex-row">
            <UButton v-for="(deck, index) in savedDecks" @click="loadDeck(index)" color="blue" class="mx-1">
              Load deck {{ index }}

              <UIcon name="i-ic-baseline-delete-forever" @click="removeDeck(index)" class="ml-" />
            </UButton>
          </div>
          <!-- button to open up add by ID mode -->


          <div v-if="addScrapByIdMode" class="flex flex-row py-2">
            <UInput v-model="scrapIdToAdd" placeholder="Scrap ID" />
            <UButton @click="addScrapByIdToDeck(scrapIdToAdd)" color="green" class="mx-1">Add scrap</UButton>
          </div>
        </h2>
        <div v-if="scrapOnDeck.length === 0" class="text-center text-gray-500">No scraps on deck</div>
        <div v-else class="p-1 md:px-4 lg:px-8 ">
          <div v-for="scrap in scrapOnDeckObjects" :key="scrapId"
            class="border-b border-gray-200 bg-gray-200 dark:bg-gray-800 p-1 md:p-2 lg:px-4 rounded-sm w-full py-2 my-2 flex flex-row justify-between">
            <ScrapVerboseScrapItem v-if="scrap" :scrap="scrap" class="leading-none" />
            <UButton @click="removeScrapFromDeck(scrap.scrap_id)" color="red" variant="outline">Remove</UButton>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'
import ScrapItem from '~/components/Scrap/Item.vue'
import ScrapGallery from '~/components/Scrap/Gallery.vue'







const scrapcontainer = ref(null)
const { combinedData } = useScrap()
const displayedData = ref([])
const loading = ref(false)
const PAGE_SIZE = 20

const scrapIdToAdd = ref('')
const addScrapByIdMode = ref(false)


// we are gonna make a sort of, ya know, scrap shopping cart
// in the first step of letting the user put together threads
// first we want an easy way to like, accumulate an "on deck" list
// in a drawer some where (probably at the bottom of the screen)
// and we will store the scraps we grab by their ID in local storage
// so we can grab it on other pages

const scrapOnDeck = useLocalStorage('scrapOnDeck', [])
const scrapOnDeckObjects = ref([])

// and finally, an array to save our decks to and load them from later
const savedDecks = useLocalStorage('savedDecks', [])

// decks don't have names, they just auto-increment
const currentDeck = useLocalStorage('currentDeck', 0)

const saveDeck = () => {
  savedDecks.value.push(scrapOnDeck.value)
  currentDeck.value = savedDecks.value.length - 1
  scrapOnDeck.value = []
}

const loadDeck = (deckIndex) => {
  scrapOnDeck.value = savedDecks.value[deckIndex]
  currentDeck.value = deckIndex
}

const removeDeck = (deckIndex) => {
  savedDecks.value.splice(deckIndex, 1)
}


watchEffect(() => {
  if (!combinedData.value) return
  scrapOnDeckObjects.value = scrapOnDeck.value.map(scrapId => {
    return combinedData.value.find(scrap => scrap.scrap_id === scrapId)
  })
})

// now we need some mutation functions to add and remove scraps from the on deck list

const addScrapToDeck = (scrapId) => {
  // if its an object, maybe we accidentally passed the whole scrap object
  // lets just grab the ID
  if (typeof scrapId === 'object') {
    scrapId = scrapId.scrap_id
  }
  scrapOnDeck.value.push(scrapId)
}

function addScrapByIdToDeck(scrapId) {
  // this should close the add by ID mode as well as add the scrap to the deck
  addScrapToDeck(scrapId)
  addScrapByIdMode.value = false
  scrapIdToAdd.value = ''

}

const removeScrapFromDeck = (scrapId) => {
  // if its an object, maybe we accidentally passed the whole scrap object
  // lets just grab the ID
  if (typeof scrapId === 'object') {
    scrapId = scrapId.scrap_id
  }
  const index = scrapOnDeck.value.indexOf(scrapId)
  if (index > -1) {
    scrapOnDeck.value.splice(index, 1)
  }
}

const clearDeck = () => {
  scrapOnDeck.value = []
}



const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    const startIndex = displayedData.value.length
    const endIndex = startIndex + PAGE_SIZE
    const newData = combinedData.value.slice(startIndex, endIndex)
    displayedData.value.push(...newData)
    loading.value = false
  }, 500)
}

useInfiniteScroll(scrapcontainer, loadMore, { distance: 10 })

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const groupedScraps = computed(() => {
  // Create an empty array to store the grouped scraps
  const groups = []

  // Create a variable to keep track of the current gallery group
  let currentGalleryGroup = null

  // Create a variable to keep track of the current PR group
  let currentPRGroup = null

  // Iterate over each scrap in the displayedData array
  displayedData.value.forEach((scrap, index) => {
    let scrapHasContent = false
    if (scrap.content) {
      scrapHasContent = true
    } else if (scrap.description) {
      scrapHasContent = true
    }
    // Check if the current scrap has images
    if (scrap.images?.length > 0 && !scrapHasContent) {
      // If there is no current gallery group, create a new one
      if (!currentGalleryGroup) {
        currentGalleryGroup = {
          type: 'gallery',
          items: [],
        }
        // Add the newly created gallery group to the groups array
        groups.push(currentGalleryGroup)
      }
      // Add the current scrap to the current gallery group
      currentGalleryGroup.items.push(scrap)
    } else if (scrap.type === 'user-github-pr') {
      // If the current scrap type is 'user-github-pr', add it to the current PR group
      if (!currentPRGroup) {
        currentPRGroup = {
          type: 'pr',
          items: [],
        }
        // Add the newly created PR group to the groups array
        groups.push(currentPRGroup)
      }
      // Add the current scrap to the current PR group
      currentPRGroup.items.push(scrap)
    } else {
      // If the current scrap doesn't have images and is not a PR, add it as an individual item
      groups.push({
        type: 'single',
        items: [scrap],
      })
      // Reset the current gallery group and PR group to null
      currentGalleryGroup = null
      currentPRGroup = null
    }
  })

  // Return the array of grouped scraps
  return groups
})
</script>
