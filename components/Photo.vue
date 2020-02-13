<template>
  <div>
  <figure class="pa1 pa2-ns pa4-l mv1 mv3-ns">
    <img :src="modifyUrlWithSize(url, 320)"
      :srcset="srcset"
      :sizes="sizes"
      :class="photoClass"
      loading="lazy"/>
    <div v-if="tags" class="photo-tags ma0 mh0 courier ttu tr">
      <span class="mr1 mr2-ns b">{{tags.Model.description}}</span>
      <span class="mr1 mr2-ns">ISO {{tags.ISOSpeedRatings.description}}</span>
      <span class="mr1 mr2-ns">{{tags.FocalLengthIn35mmFilm.description}}mm</span>
      <span class="mr1 mr2-ns">f{{tags.FNumber.description}}</span>
      <!-- <span class="mr1 mr2-ns">{{+tags.ExposureTime.description}}</span> -->
      <span class="">
        {{ tags.date| moment("MMM Do YYYY") }}
        – {{ tags.date| moment("ha") }}
      </span>
    </div>
    <figcaption v-if="caption" class="f6 lh-copy b tr measure mt2 mb4 ml-auto near-black">
      {{caption}}
    </figcaption>
  </figure>
  </div>
</template>

<script>
import URL from 'url-parse'
import _ from 'lodash'
export default {
  props: {
    url: String,
    caption: String,
    photoClass: String,
    tags: Object
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
      let mURLPaths = mURL.pathname.split('/')
      let urlAppendString = 'fl_progressive:semi,c_scale,dpr_auto,w_'+width
      mURLPaths.splice(mURLPaths.length-2, 0, urlAppendString)
      mURL.pathname = mURLPaths.join('/')
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

figure {
  position: relative;
}

.photo-tags {
  font-size: 0.33em;  
  color: #565656;
  margin: 0;
  line-height: 1em;
  /* text-shadow: 0 1px 1px 2px black; */  
  transition: color 0.5s ease-in-out;
  cursor: default;
}
.photo-tags:hover {
  color: black !important;
}

@media screen and (min-width: 600px) {
  .photo-tags {
    font-size: 0.4em;
    padding-left: 0.4em;
    position: absolute;  
    transform: rotateZ(90deg);
    transform-origin: top left;
    top: 0.8em;
    left: 1.1em;
  }
}

@media screen and (min-width: 1200px) {
  .photo-tags {
    font-size: 0.42em;
    padding-left: 0.4em;
    position: absolute;  
    transform: rotateZ(90deg);
    transform-origin: top left;
    top: 4.3em;
    left: 2.72em;
  }
}
</style>
