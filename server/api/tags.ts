export default defineEventHandler(async (event) => {
  try {
    const tags = await $fetch('https://ejfox.com/tags.json')
    return tags
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
})
