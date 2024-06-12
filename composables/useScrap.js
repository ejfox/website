import { ref } from 'vue'
import * as d3 from 'd3'

export default function useScrap() {
  const combinedData = ref([])
  const scrapByWeek = ref(null)

  const { data: scrapData } = useFetch('/data/scrapbook/scraps.json', {
    server: false,
  })

  function processScrapData(scrapData) {
    const filteredData = scrapData.filter((d) => d.time && d.id)
    const sortedData = filteredData.sort((a, b) => {
      const dateA = new Date(a.time)
      const dateB = new Date(b.time)
      return dateB - dateA
    })
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

  function scrapbookDataToWeeks(data) {
    if (!data.length) return null
    const scrapByWeekMap = d3.group(data, (d) => {
      const date = new Date(d.time)
      const week = d3.timeWeek.floor(date)
      return week
    })
    return scrapByWeekMap
  }

  return {
    combinedData,
    scrapByWeek,
  }
}
