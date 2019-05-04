<template>
  <section class="center db f3 cf tc">
    <section v-if="!blocks">
      <h2>Loading!</h2>
    </section>

    <h2 class="mv4 moon-gray">Recent Bookmarks</h2>

    <section v-for="(block, i) in blocks" :key="block.u" class="sans-serif mb1 tl dib v-top w-100 w-third-l pa3 pa4-l pb0 lh-title overflow-scroll f2">
      <a :href="block.u"
        class="lh-title f3 dark-gray link">
        <div class="b ttu lh-title ma0">
          {{block.d}}
        </div>

        <!-- <span class="o-20">
          <i v-if="linkDomain(block.u) === 'youtube.com'" :class="['fab fa-youtube']" />
          <i v-else-if="linkDomain(block.u) === 'twitter.com'" :class="['fab fa-twitter']" />
          <i v-else-if="linkDomain(block.u) === 'instagram.com'" :class="['fab fa-instagram']" />
          <i v-else-if="linkDomain(block.u) === 'reddit.com'" :class="['fab fa-reddit']" />
          <i v-else-if="linkDomain(block.u) === 'twitch.com'" :class="['fab fa-twitch']" />
          <i v-else-if="linkDomain(block.u) === 'vimeo.com'" :class="['fas fa-vimeo']" />
          <i v-else-if="linkDomain(block.u) === 'twitch.com'" :class="['fab fa-twitch']" />
          <i v-else-if="linkDomain(block.u) === 'medium.com'" :class="['fab fa-medium-m']" />
          <i v-else-if="linkDomain(block.u) === 'codepen.com'" :class="['fab fa-codepen']" />
          <i v-else-if="linkDomain(block.u) === 'dribbble.com'" :class="['fab fa-dribbble']" />
          <i v-else-if="block.t.indexOf('video') > 0" :class="['fas fa-video']" />
          <i v-else-if="block.t.indexOf('github') > 0" :class="['fab fa-github-alt']" />
          <i v-else-if="block.t.indexOf('machinelearning') > 0" :class="['fas fa-cog']" />
          <i v-else-if="block.t.indexOf('technique') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('howto') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('resource') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('reference') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('facebook') > 0" :class="['fab fa-facebook']" />
        </span> -->

        <div class="tags lh-copy ma0 pa0">
          <small v-if="block.t.length > 1" v-for="tag in block.t" class="ttu f8 o-20 mv0 mr1 lh-title pa0">
            {{tag}}
          </small>
        </div>


        <small v-if="!block.n" class="db f6 word-wrap moon-gray">
          {{block.u}}
        </small>

        <div class="measure f5 lh-copy bookmark-description mt2">
          <small v-if="block.n" class="i" v-html="parseMarkdown(block.n)" />
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
import marked from 'marked'
const parseString = xml2js.parseString
const stripPrefix = xml2js.processors.stripPrefix;

// const pinboardURI = 'https://api.pinboard.in/v1/posts/all?auth_token=ejfox:6BCADA7AD389C5F5D7CE&results=50'
const pinboardURI = 'https://pinboard-api.now.sh/json/u:ejfox/?results=50'

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
      this.blocks = res.data
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
    },
    parseMarkdown: function(markdown) {
      // console.log('Parsing markdown...')
      // Build markdown parser
      const markdownRenderer = marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        tables: false,
        breaks: false,
        sanitize: true,
        smartLists: true,
        smartypants: true,
        xhtml: true
      })
      return markdownRenderer(markdown)
    }
  },
  asyncData ({ params }) {
    return axios.get(pinboardURI)
    .then((res) => {
      return { blocks: res.data }
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

.bookmark-description {
  font-family: "Hoefler Text A", "Hoefler Text B";
  font-style: normal;
  font-weight: 700;
}

.bookmark-description p {
  display: inline-block;
  /* border-top: #fbf1a9; */
}

.bookmark-description code {
  background-color: black;
  color: white;
}
</style>
