import { ref, computed } from 'vue'
import * as d3 from 'd3'

export default function useScrap() {
  // console.log('useScrap composable initialized')
  const combinedData = ref([])
  const scrapByWeek = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  const currentPage = ref(1)
  const hasMorePages = ref(true)

  const fetchScraps = async (page = 1, limit = 20) => {
    // console.log(`Fetching scraps: page ${page}, limit ${limit}`)
    if (!hasMorePages.value) return

    isLoading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/scraps', {
        method: 'POST',
        body: { page, limit },
      })
      // console.log('Fetched data:', data)
      if (data && data.scraps && data.scraps.length > 0) {
        const { sortedData, scrapByWeekMap } = processScrapData(data.scraps)
        combinedData.value = [...combinedData.value, ...sortedData]
        scrapByWeek.value = scrapByWeekMap
        currentPage.value = page
        // console.log(`Processed ${sortedData.length} scraps`)
        if (data.scraps.length < limit) {
          hasMorePages.value = false
          console.log('No more scraps to fetch')
        }
      } else {
        hasMorePages.value = false
        console.log('No more scraps to fetch')
      }
    } catch (err) {
      error.value = err
      console.error('Error fetching scraps:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadMore = () => {
    if (!isLoading.value && hasMorePages.value) {
      fetchScraps(currentPage.value + 1)
    }
  }

  const prefetchNextPage = () => {
    if (
      combinedData.value.length > 0 &&
      !isLoading.value &&
      hasMorePages.value
    ) {
      const threshold = combinedData.value.length - 5
      if (combinedData.value.length >= threshold) {
        fetchScraps(currentPage.value + 1)
      }
    }
  }

  function processScrapData(scrapData) {
    console.log('Processing scrap data:', scrapData)
    const filteredData = scrapData.filter((d) => d.created_at && d.id)
    const sortedData = filteredData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    )
    const scrapByWeekMap = scrapbookDataToWeeks(sortedData)
    return { sortedData, scrapByWeekMap }
  }

  function scrapbookDataToWeeks(data) {
    if (!data.length) return null
    return d3.group(data, (d) => d3.timeWeek.floor(new Date(d.created_at)))
  }

  // Initial fetch
  fetchScraps()

  return {
    combinedData,
    scrapByWeek,
    isLoading,
    error,
    loadMore,
    prefetchNextPage,
    hasMorePages,
    fetchScraps,
  }
}
