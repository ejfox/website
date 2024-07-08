// useScrap.js
import { ref, watchEffect } from 'vue'
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
  } = $fetch('/api/scraps', { method: 'POST', body: { page: 1, limit: 10 } })

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
      console.log(`Processed ${sortedData.length} scraps`)
    }
  })

  // watchEffect(() => {
  //   isLoading.value = pending.value
  // })

  // watchEffect(() => {
  //   error.value = fetchError.value
  // })

  const fetchScraps = async (page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await $fetch('/api/scraps', {
        method: 'POST',
        body: { page, limit },
      })
      if (data.value) {
        const { sortedData, scrapByWeekMap } = processScrapData(data.value)
        combinedData.value = [...combinedData.value, ...sortedData]
        scrapByWeek.value = scrapByWeekMap
      }
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

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
    fetchScraps,
  }
}
