<template>
  <div>
    <div class="flex md:justify-end">
      <UButton class="mx-4 md:m-4" color="gray" size="xs" :to="{ name: 'scrapbook' }">
        Back to Scrapbook
      </UButton>
    </div>

    <div v-if="isLoading" class="text-center py-8">Loading scrap data...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <template v-else-if="scrap">
      <div class="mx-auto p-4 lg:p-24 justify-center flex flex-col">
        <ScrapItem :scrap="scrap" />
      </div>

      <div class="mx-auto p-4 lg:p-24 md:min-h-screen justify-center flex flex-col monospace text-xs">
        <UTable :rows="scrapRows" />
      </div>
    </template>
    <div v-else class="text-center py-8">No scrap found</div>
  </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'

const route = useRoute()
const slug = route.params.slug
const scrap = ref(null)
const isLoading = ref(true)
const error = ref(null)

const config = useRuntimeConfig()
console.log(config, Object.keys(config))

const supabaseUrl = config.public.supabaseUrl
const supabaseKey = config.public.supabaseKey
console.log(`Connecting to ${supabaseUrl} with key ${supabaseKey}`)

if (!supabaseUrl || !supabaseKey) {
  error.value = 'Supabase credentials not found'
}
const supabase = createClient(supabaseUrl, supabaseKey)

const fetchScrap = async () => {
  if (!slug[0]) return

  isLoading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('scraps')
      .select('*')
      .eq('scrap_id', slug[0])
      .single()

    if (fetchError) throw fetchError

    scrap.value = data
  } catch (err) {
    console.error('Error fetching scrap:', err)
    error.value = 'Failed to load scrap data'
  } finally {
    isLoading.value = false
  }
}

// Fetch the scrap data when the component mounts
onMounted(fetchScrap)

const scrapRows = computed(() => {
  if (!scrap.value) return []

  return Object.entries(scrap.value).map(([key, value]) => ({
    name: key,
    value: JSON.stringify(value),
  }))
})
</script>

<style scoped></style>