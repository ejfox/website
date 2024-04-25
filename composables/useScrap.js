import { ref } from 'vue'
import * as d3 from 'd3'

export default function useScrap() {
  const combinedData = ref([])
  const scrapByWeek = ref(null)

  const { data: scrapData } = useFetch('/data/scrapbook/scraps.json', {
    server: false,
  })

  watchEffect(() => {
    if (scrapData.value) {
      combinedData.value = scrapData.value
      scrapByWeek.value = scrapbookDataToWeeks(combinedData.value)
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
