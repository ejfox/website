<template>
  <div class="words contentWrapper content" v-html="bodyHtml">
  </div>
</template>

<style>
</style>

<script>
import cheerio from 'cheerio'
import URL from 'url-parse'
import _ from 'lodash'
import marked from 'marked'
import truncate from 'truncate'


export default {
  props: {
    // bodyMarkdown: String,
    bodyHtml: String
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped="true">
</style>
