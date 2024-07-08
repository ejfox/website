import { ref, watchEffect, watch } from 'vue'
import * as d3 from 'd3'

export default function useScrap() {
  const combinedData = ref([])
  const scrapByWeek = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const {
    data: scrapData,
    pending,
    error: fetchError,
    refresh,
  } = useFetch('/api/scraps', { method: 'POST' })

  function processScrapData(scrapData) {
    const filteredData = scrapData.filter((d) => d.time && d.id)
    const sortedData = filteredData.sort(
      (a, b) => new Date(b.time) - new Date(a.time),
    )
    const scrapByWeekMap = scrapbookDataToWeeks(sortedData)
    return { sortedData, scrapByWeekMap }
  }

  watchEffect(() => {
    if (scrapData.value) {
      const { sortedData, scrapByWeekMap } = processScrapData(scrapData.value)
      combinedData.value = sortedData
      scrapByWeek.value = scrapByWeekMap
    }
  })

  watch(pending, (value) => {
    isLoading.value = value
  })

  watch(fetchError, (value) => {
    error.value = value
    if (value) console.error('Error fetching scraps:', value)
  })

  function scrapbookDataToWeeks(data) {
    if (!data.length) return null
    return d3.group(data, (d) => d3.timeWeek.floor(new Date(d.time)))
  }

  return {
    combinedData,
    scrapByWeek,
    isLoading,
    error,
    refresh,
  }
}
