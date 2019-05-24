<template>
  <article>
    <img :src="photo"
      srcset="srcset"
      sizes="sizes" />
    <caption>
      {{ dek }} 
    </caption>
  </article>
</template>

<script>
import URL from 'url-parse'

export default {
  data: function () {
    return {
    }
  },
  computed: {
    srcset: function () {
      if (url.hostname !== 'res.cloudinary.com') return false
      const imgSrc = this.photo
      const sizes = [320, 920, 1280]
      const srcSet = []
      _.each(sizes, (size) => {
        let nURL = modifyUrlWithSize(imgSrc, size)
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
    modifyUrlWithSize: function(url, width) {
      let mURL = new URL(url)
      let mURLPaths = mURL.pathname.split('/')
      let urlAppendString = 'fl_progressive:semi,c_scale,dpr_auto,w_'+width
      mURLPaths.splice(mURLPaths.length-2, 0, urlAppendString)
      mURL.pathname = mURLPaths.join('/')
      return mURL.toString() + ` ${width}w`
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
