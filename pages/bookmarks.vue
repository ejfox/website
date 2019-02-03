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

    <h2 class="mv4">Recent Bookmarks</h2>

    <section v-for="block in blocks" :key="block.$.hash" class="sans-serif mb4 tl dib v-top w-100 w-third-l pa3 pa4-l pb0 lh-copy overflow-scroll f6">
      <a :href="block.$.href">
        <span class="o-20">
          <i v-if="linkDomain(block.$.href) === 'youtube.com'" :class="['fab fa-youtube']" />
          <i v-else-if="linkDomain(block.$.href) === 'twitter.com'" :class="['fab fa-twitter']" />
          <i v-else-if="linkDomain(block.$.href) === 'instagram.com'" :class="['fab fa-instagram']" />
          <i v-else-if="linkDomain(block.$.href) === 'reddit.com'" :class="['fab fa-reddit']" />
          <i v-else-if="linkDomain(block.$.href) === 'twitch.com'" :class="['fab fa-twitch']" />
          <i v-else-if="linkDomain(block.$.href) === 'vimeo.com'" :class="['fas fa-vimeo']" />
          <i v-else-if="linkDomain(block.$.href) === 'twitch.com'" :class="['fab fa-twitch']" />
          <i v-else-if="linkDomain(block.$.href) === 'medium.com'" :class="['fab fa-medium-m']" />
          <i v-else-if="linkDomain(block.$.href) === 'codepen.com'" :class="['fab fa-codepen']" />
          <i v-else-if="linkDomain(block.$.href) === 'dribbble.com'" :class="['fab fa-dribbble']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('video') > 0" :class="['fas fa-video']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('github') > 0" :class="['fab fa-github-alt']" />
          <!-- <i v-else-if="block.$.tag.split(' ').indexOf('watercolor') > 0" :class="['fas fa-paint-brush']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('painting') > 0" :class="['fas fa-paint-brush']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('art') > 0" :class="['fas fa-paint-brush']" /> -->
          <i v-else-if="block.$.tag.split(' ').indexOf('machinelearning') > 0" :class="['fas fa-cog']" />
          <!-- <i v-else-if="block.$.tag.split(' ').indexOf('music') > 0" :class="['fas fa-music']" /> -->
          <i v-else-if="block.$.tag.split(' ').indexOf('technique') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('howto') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('resource') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('reference') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.$.tag.split(' ').indexOf('facebook') > 0" :class="['fab fa-facebook']" />
        </span>

        <span class="b lh-title">
          {{block.$.description}}
        </span>

        <small class="db ttu f8 o-20 mt1 code">
          {{block.$.tag}}
        </small>

        <small v-if="!block.$.extended" class="db ttu f8 o-20 mt1 word-wrap">
          {{block.$.href}}
        </small>

        <div class="measure lh-copy">
          <small v-if="block.$.extended" class="bg-light-yellow i">{{block.$.extended}}</small>
        </div>
      </a>
    </section>

    <h2 class="mv4">
      <a href="https://pinboard.in/u:ejfox/">
        View All Bookmarks
        <i :class="['fas fa-arrow-alt-circle-right']" />
      </a>
    </h2>

    <section id="footer">
      <small class="db">
        Powered by <a href="https://pinboard.in/u:ejfox/">pinboard</a>
      </small>
    </section>
  </section>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import xml2js from 'xml2js'
import * as URI from 'uri-js'
const parseString = xml2js.parseString
const stripPrefix = xml2js.processors.stripPrefix;

const pinboardURI = 'https://api.pinboard.in/v1/posts/all?auth_token=ejfox:6BCADA7AD389C5F5D7CE&results=50'

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
    axios.get(pinboardURI)
    .then((res) => {
      this.blocks = this.parseXML(res.data)
    })
  },
  methods: {
    linkDomain: function(urlString) {
      let uri = URI.parse(urlString)
      return uri.domain
    },
    parseXML: function(xmlString) {
      let parsedXMLContent
      const parsedXML = parseString(res.data, { tagNameProcessors: [ stripPrefix ] }, (err, result) => {
        const links = result.posts.post
      })
      return links
    }
  },
  asyncData ({ params }) {
    return axios.get(pinboardURI)
    .then((res) => {
      let parsedXMLContent
      const parsedXML = parseString(res.data, { tagNameProcessors: [ stripPrefix ] }, (err, result) => {
        const links = result.posts.post
        parsedXMLContent = { blocks: links }
      })

      return parsedXMLContent
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
  /* cursor: default; */
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

.word-wrap {
  word-wrap: break-word;
}
</style>
