<template>
  <section class="center db f3 cf tc">
    <section v-if="!blocks">
      <h2>Loading!</h2>
    </section>

    <transition-group
      appear
      mode="out-in"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOutDown">
      <section v-for="block in blocks" :key="block.id" class="dib-l v-mid w-100 w-50-l ma0 pa2 pa4-l">
        <a v-if="block.image"
          :href="block.source ? block.source.url : 'https://www.are.na/block/'+block.id">
         <img :src="block.image.large.url" 
          :alt="block.generated_title" 
          loading="lazy">
        </a>
        <div
           v-if="block.description.length > 1"
           v-html="block.description_html" />
      </section>
    </transition-group>

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
import Nav from '~/components/Nav.vue'
const channelSlug = 'creations'

export default {
  components: {
    Nav
  },
  data() {
    return {
      blocks: [],
      title: '🌞 Creations',
      shortDescription: ''
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
  head () {
    return {
      title: this.title + ' | EJ Fox',
      meta: [{
        'name': 'EJ Fox | ' + this.title,
        'description': this.shortDescription,
        'og:description': this.shortDescription,
        'og:title': 'EJ Fox | ' + this.title,
        'og:type': 'article',
        'twitter:title': 'EJ Fox | ' + this.title,
        'twitter:creator': 'mrejfox',
        'twitter:description': this.shortDescription
      }]
    }
  },
  asyncData ({ params }) {
    return axios.get(`https://api.are.na/v2/channels/${channelSlug}?per=200`)
    .then((res) => {
      return { blocks: _.reverse(res.data.contents) }
    })
  }
};
</script>

<style scoped>
body {
  background-color: white !important;
}
a,a:link,a:hover,a:visited {
  color: black;
  text-decoration: none;
  border: 0;
  outline: none;
  /*cursor: default;*/
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
