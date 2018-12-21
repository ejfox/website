<template>
  <section class="center db f3 cf tc">
    <section id="header">
      <small class="db">
        <a href="https://ejfox.com">&lt;- ejfox.com</a>
      </small>
    </section>

    <section v-if="!blocks">
      <h2>Loading!</h2>
    </section>
    <section v-for="block in blocks" :key="block.id" class="dib v-mid mw5 ma2">
      <a :href="block.source ? block.source.url : 'https://www.are.na/ej-fox/vibes-wus2iiyauzg'">
        <img :src="block.image.display.url" :alt="block.generated_title">
      </a>
    </section>

    <section id="footer">
      <small class="db">
        Powered by <a href="https://www.are.na/ej-fox">are.na</a>
      </small>
    </section>
  </section>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  components: {
  },
  data() {
    return {
      channelSlug: 'vibes-wus2iiyauzg',
      blocks: []
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  methods: {
  },
  asyncData ({ params }) {
    return axios.get(`https://api.are.na/v2/channels/vibes-wus2iiyauzg`)
    .then((res) => {
      return { blocks: _.reverse(res.data.contents) }
    })
  }
};
</script>

<style>
body {
  background-color: white !important;
}
a,a:link,a:hover,a:visited {
  color: black;
  text-decoration: none;
  border: 0;
  outline: none;
  cursor: default;
}
img {
  width: 100%;
  height: auto;
  /* border: 1px solid rgba(0,0,0,0.1); */
}

#footer, #header {
  font-size: 14px;
  font-family: Courier, 'Courier New', monospace;
}

#header a {
  cursor: pointer;
}
</style>
