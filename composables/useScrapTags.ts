// composables/useScrapTags.js
import { ref, computed } from 'vue'
import { useAsyncData, useFetch } from '#app'

export default function useScrapTags() {
  const allTags = ref([])
  const mainTags = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchTags = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Fetch all tags from Supabase
      const { data: scrapData } = await useAsyncData('scraps', () =>
        $fetch('/api/scraps', {
          method: 'GET',
          params: { select: 'tags' },
        }),
      )

      if (scrapData.value) {
        const tagSet = new Set(
          scrapData.value.flatMap((scrap) => {
            try {
              return JSON.parse(scrap.tags || '[]')
            } catch (e) {
              console.error('Error parsing tags:', e)
              return []
            }
          }),
        )
        allTags.value = Array.from(tagSet)
      } else {
        console.warn('No scrap data received')
      }

      // Fetch main tags
      const { data: fetchedMainTags } = await useFetch('/api/tags')
      if (fetchedMainTags.value) {
        mainTags.value = fetchedMainTags.value
      } else {
        console.warn('No main tags received')
      }
    } catch (err) {
      console.error('Error fetching tags:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const aiTags = computed(() => {
    return allTags.value.filter((tag) => !mainTags.value.includes(tag))
  })

  // Call fetchTags immediately
  fetchTags()

  return {
    allTags,
    mainTags,
    aiTags,
    isLoading,
    error,
    fetchTags,
  }
}
