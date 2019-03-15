<template>
  <section class="center db f3 cf tc">
    <section id="header">
      <small class="db pa1">
        <a href="https://ejfox.com">&lt;- ejfox.com</a>
      </small>
    </section>

    <section v-if="!blocks">
      <h2>Loading!</h2>
    </section>
    <section v-for="block in blocks" :key="block.id" class="dib v-mid mw5 ma2">
      <a v-if="block.image"
        :href="block.source ? block.source.url : 'https://www.are.na/ej-fox/vibes-y7fex45foi4'">
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
const channelSlug = 'vibes-y7fex45foi4'

export default {
  components: {
  },
  data() {
    return {
      blocks: []
    }
  },
  created: function () {
  },
  mounted: function () {
    axios.get(`https://api.are.na/v2/channels/${channelSlug}?per=200`)
    .then((res) => {
      this.blocks = _.reverse(res.data.contents)
    })
  },
  activated: function () {
  },
  methods: {
  },
  asyncData ({ params }) {
    return axios.get(`https://api.are.na/v2/channels/${channelSlug}?per=200`)
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
