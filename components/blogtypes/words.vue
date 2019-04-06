<template>
  <div class="">
    <div
      v-if="bodyHtml"
      class="words contentWrapper content" v-html="bodyHtml">
    </div>

    <div
      v-if="!bodyHtml"
      class="words contentWrapper content measure"
      v-html="bodyMarkdown">
    </div>
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
  data: function  () {
    return {
      bodyHtml: null
    }
  },
  props: {
    bodyMarkdown: String,
    // bodyHtml: String
  },
  computed: {
  },
  mounted: function () {
    const parsedMarkdown = this.parseMarkdown(this.bodyMarkdown)
    this.bodyHtml = this.processMarkdownHtml(parsedMarkdown)
  },
  methods: {
    processMarkdownHtml: function(markdownHtml) {
      // Load parsed markdown into cheerio so we can do
      // jquery-style manipulations on the HTML
      const $ = cheerio.load(markdownHtml)

      $('p').each(function(i, el){ $(el).addClass('lh-copy measure pa3') })
      $('ul').each(function(i, el){ $(el).addClass('measure ph3') })
      $('img').each(function(i, el){ $(el).addClass('center mt4 pa0 w-100') })
      $('pre').each(function(i, el){ $(el).addClass('pa1 bg-dark-gray white br1 pv2-ns ph4-ns') })
      $('code').each(function(i, el){ $(el).addClass('bg-dark-gray white br1 f6') })
      $('li').each(function(i, el){ $(el).addClass('mb2') })
      $('li > p').each(function(i, el){ $(el).removeClass('measure') })
      $('h2').each(function(i, el){ $(el).addClass('ph3 mv2 dark-gray') })
      $('h3').each(function(i, el){ $(el).addClass('ph3 mv0 ttu gray') })
      $('h4').each(function(i, el){ $(el).addClass('ph3 mv0 gray') })
      $('cite').each(function(i, el){ $(el).addClass('db sans-serif ttu gray tracked mt2') })
      $('blockquote').each(function(i, el){ $(el).addClass('dark-gray mv3 f3-l ph2 ph4-ns lh-copy measure center') })
      $('blockquote > p').each(function(i, el){
        $(el).removeClass('lh-copy measure center pv3 ph3 ph0-m ph0-l')
        $(el).addClass('i b')
      })

      // If we wanted to do something special for different links
      // $('a').each(function(i, el){
      //   let $link = $(this)
      //   const linkSrc = $link.attr('href')
      //   const url = new URL(linkSrc)
      //
      //   if (url.hostname === 'api.observablehq.com') {
      //
      //   }
      // })

      // Here we go through each image, which is just a link to the fullsize in the CMS
      // We build a responsive srcset and the right queries in the URL so it works well on mobile
      $('img').each(function(i, el){
        let $image = $(this)
        const imgSrc = $image.attr('src')
        const url = new URL(imgSrc)

        // If it's a link to cloudinary, perform our operations, otherwise we leave it alone
        // c_scale,dpr_auto,w_1080,q_auto:best
        if (url.hostname === 'res.cloudinary.com') {
          // Generate SMALL image URL
          let urlS = new URL(imgSrc)
          let urlSPaths = urlS.pathname.split('/')
          urlSPaths.splice(urlSPaths.length-2, 0, 'fl_progressive:semi,q_jpegmini,c_scale,dpr_auto,w_320')
          urlS.pathname = urlSPaths.join('/')
          // Generate MEDIUM image URL
          let urlM = new URL(imgSrc)
          let urlMPaths = urlM.pathname.split('/')
          urlMPaths.splice(urlMPaths.length-2, 0, 'fl_progressive:semi,c_scale,dpr_auto,w_920')
          urlM.pathname = urlMPaths.join('/')
          // Generate LARGE image URL
          let urlL = new URL(imgSrc)
          let urlLPaths = urlL.pathname.split('/')
          urlLPaths.splice(urlLPaths.length-2, 0, 'fl_progressive:semi,c_scale,dpr_auto,w_1280')
          urlL.pathname = urlLPaths.join('/')

          let srcSet = [
            urlS.toString() + ' 320w',
            urlM.toString() + ' 920w',
            urlL.toString() + ' 1280w',
          ]

          let sizes = [
            '(max-width: 320px) 280px',
            '(max-width: 720px) 980px',
            '1000px'
          ]

          $image.attr('srcset', srcSet.join(', \n'))
          $image.attr('sizes', sizes.join(', \n'))
          $image.attr('src', urlM.toString())
          // $image.addClass('shadow-4-l')
        }
      })

      // return parsed, sliced, and diced markdown
      return $.html()
    },
    parseMarkdown: function(markdown) {
      // console.log('Parsing markdown...')
      // Build markdown parser
      const markdownRenderer = marked.setOptions({
        renderer: new marked.Renderer(),
        // highlight: function (code) {
        //   return require('highlight.js').highlightAuto(code).value
        // }
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        xhtml: true
      })
      return markdownRenderer(markdown)
    }
  }
};
</script>

<style scoped="true">

</style>
