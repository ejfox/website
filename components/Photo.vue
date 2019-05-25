<template>
  <div>
    <img :src="modifyUrlWithSize(url, 320)"
      :srcset="srcset"
      :sizes="sizes" />
    <caption
      v-if="dek">
      {{ dek }} 
    </caption>
  </div>
</template>

<script>
import URL from 'url-parse'
import _ from 'lodash' 
export default {
  props: {
    url: String
  },
  data: function () {
    return {
    }
  },
  computed: {
    srcset: function () {
      let srcURL = new URL(this.url)
      if (srcURL.hostname !== 'res.cloudinary.com') return false
      const imgSrc = this.url
      const sizes = [320, 920, 1280]
      const srcSet = []
      _.each(sizes, (size) => {
        let nURL = this.modifyUrlWithSize(imgSrc, size, true)
        srcSet.push(nURL)
      })
      return srcSet.join(', \n')
    },
    sizes: function () {
      return `(max-width: 320px) 280px, 
        (max-width: 720px) 980px, 
        1000px`
    }
  },
  methods: {
    modifyUrlWithSize: function(url, width, srcset = false) {
      let mURL = new URL(url)
      console.log('EM URL 1', mURL, url)
      let mURLPaths = mURL.pathname.split('/')
      let urlAppendString = 'fl_progressive:semi,c_scale,dpr_auto,w_'+width
      mURLPaths.splice(mURLPaths.length-2, 0, urlAppendString)
      mURL.pathname = mURLPaths.join('/')
      console.log('EM URL', mURL)
      if (srcset) {
        return mURL.toString() + ` ${width}w`
      } else {
        return mURL.toString()
      }
    }
  },
  mounted: function() {
  }
};
</script>
<style scoped="true">
#navigation 
  font-size: 1rem !important;

ul {
  text-align: center;
}
ul li {
  display: inline-block;
  cursor: pointer;
}
</style>
