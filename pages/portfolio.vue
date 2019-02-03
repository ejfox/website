<template>
  <section class="center db f3 cf tc">
    <h2>Sup, portfolio</h2>
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
