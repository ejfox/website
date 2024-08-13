<template>
  <div class="p-4 lg:p-8 flex flex-wrap justify-between">
    <div v-for="scrap in tagData" :key="scrap.id" class="w-full md:w-1/2 p-4">
      <ScrapItem :scrap="scrap" />
    </div>
    <div v-if="loading" class="text-center">Loading...</div>

    <div v-if="!tag" class="text-center">No tag selected</div>
  </div>
</template>

<script setup>
// get the tag out of the route query with vueuse useRouteQuery
const tag = useRouteQuery('tag')

const loading = ref(false)
const tagData = ref(null)

// get all the scraps with the same tags from /api/scrap-tags
const fetchScraps = async () => {
  loading.value = true
  console.log(`Fetching scraps with tag: ${tag.value}...`)
  try {
    const tagsArray = tag.value.split(',')
    // console.log(tagsArray)
    const { data, error } = await useFetch('/api/scrap-tags', {
      method: 'POST',
      body: JSON.stringify({ tags: tagsArray }),
    })

    // console.log('error', error.value)

    // console.log('data', data.value)

    if (error.value) throw error.value

    if (data.value) {
      tagData.value = data.value
    }



  } catch (err) {
    console.error('Error fetching scraps:', err)
  } finally {
    loading.value = false
  }
}

fetchScraps()

</script>

<style scoped></style>