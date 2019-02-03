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

export default {
  props: {
    bodyMarkdown: String
  },
  data: function () {
    return {
      bodyHtml: null
    }
  },
  created: function () {
    this.bodyHtml = this.parseMarkdown(this.bodyMarkdown)
  },
  methods: {
    parseMarkdown: function(markdown) {
      let parsedMarkdown = this.$md.render(markdown)
      const $ = cheerio.load(parsedMarkdown)

      $('p').each(function(i, el){
        $(el).addClass('lh-copy measure center pv3 ph3 ph0-m ph0-l')
      })

      $('ul').each(function(i, el){
        $(el).addClass('measure pv1 center pa4 pa0-m pa0-l')
      })

      $('img').each(function(i, el){ $(el).addClass('center mv4') })

      $('li').each(function(i, el){ $(el).addClass('mb2') })

      $('li > p').each(function(i, el){ $(el).removeClass('measure') })

      $('h2').each(function(i, el){ $(el).addClass('tc mv4') })

      $('h3').each(function(i, el){ $(el).addClass('tc mv3 tracked ttu') })

      $('h4').each(function(i, el){ $(el).addClass('tc mv2 tracked') })

      $('blockquote').each(function(i, el){ $(el).addClass('mv3 f3-l ph2 ph4-ns lh-copy measure center') })
      $('blockquote > p').each(function(i, el){
        $(el).removeClass('lh-copy measure center pv3 ph3 ph0-m ph0-l')
        $(el).addClass('i b')
      })

      $('a').each(function(i, el){
        let $link = $(this)
        const linkSrc = $link.attr('href')
        const url = new URL(linkSrc)

        if (url.hostname === 'api.observablehq.com') {

        }
      })

      $('img').each(function(i, el){
        let $image = $(this)
        const imgSrc = $image.attr('src')
        const url = new URL(imgSrc)

        /*
        Full size: https://res.cloudinary.com/ejf/image/upload/v1526535166/20161227-untitled_shoot-527.jpg

        Scaled to 1290 width http://res.cloudinary.com/ejf/image/upload/c_scale,dpr_auto,w_1290,q_auto:best/v1526535166/20161227-untitled_shoot-527.jpg
        Scaled to 920 width https://res.cloudinary.com/ejf/image/upload/c_scale,dpr_auto,w_920/v1526535166/20161227-untitled_shoot-527.jpg
                            https://res.cloudinary.com/ejf/image/upload/v1526535161/c_scale,dpr_auto,w_1080/20161119-untitled_shoot-007.jpg


        <img srcset="elva-fairy-320w.jpg 320w,
                   elva-fairy-480w.jpg 480w,
                   elva-fairy-800w.jpg 800w"
           sizes="(max-width: 320px) 280px,
                  (max-width: 480px) 440px,
                  800px"
           src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">

        */

        if (url.hostname === 'res.cloudinary.com') {
          // c_scale,dpr_auto,w_1080,q_auto:best

          let urlS = new URL(imgSrc)
          let urlSPaths = urlS.pathname.split('/')
          urlSPaths.splice(urlSPaths.length-2, 0, 'c_scale,dpr_auto,w_320')
          urlS.pathname = urlSPaths.join('/')

          let urlM = new URL(imgSrc)
          let urlMPaths = urlM.pathname.split('/')
          urlMPaths.splice(urlMPaths.length-2, 0, 'c_scale,dpr_auto,w_920')
          urlM.pathname = urlMPaths.join('/')

          let urlL = new URL(imgSrc)
          let urlLPaths = urlL.pathname.split('/')
          urlLPaths.splice(urlLPaths.length-2, 0, 'c_scale,dpr_auto,w_1280')
          urlL.pathname = urlLPaths.join('/')

          // url.pathname = paths
          // $image.attr('src', url.toString())

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

          // url.pathname = paths.join('/')
          $image.attr('srcset', srcSet.join(', \n'))
          $image.attr('sizes', sizes.join(', \n'))
          $image.attr('src', urlM.toString())
          $image.addClass('shadow-4-l')
        } else {
          $image.attr('src', url.toString())
        }

        // let newUrl = cloudinary.url(imgSrc, {width: 720, crop: "scale"})
        // let newUrl = 'http://via.placeholder.com/350x150'

      })
      // return markdown
      return $.html()
    }
  }
};
</script>
