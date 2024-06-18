<template>
  <div>
    <h2>
      Feeds I recommend
    </h2>
    <div v-for="feed in feeds">
      <div>{{ feed.title }}</div>
      <div>{{ feed.xmlUrl }}</div>
    </div>
  </div>
</template>

<script setup>


// parse an OPML file in the public folder
const opmlPath = "/rss_feeds.opml"
const podcastOpmlPath = "/podcast_feeds.opml"

const { data } = useFetch(opmlPath)
const { data: podcastData } = useFetch(podcastOpmlPath)

// parse the OPML data
const feeds = parseOpmlToFeed(data.value)
const podcastFeeds = parseOpmlToFeed(podcastData.value)

function parseOpmlToFeed(data) {
  // parse the OPML data
  // return an array of feed objects
  return []
}


</script>

<style scoped></style>