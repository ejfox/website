<template>
  <div>
  <figure class="pa1 pa2-ns pa4-l mv1 mv3-ns">
    <img :src="modifyUrlWithSize(url, 320)"
      :srcset="srcset"
      :sizes="sizes"
      :class="photoClass"
      loading="lazy"/>
    <div v-if="tags" class="photo-tags ma0 mh0 courier ttu tr o-20">
      <span class="mr1 mr2-ns b">{{tags.Model.description}}</span>
      <span v-if="exposureNumberFormat" class="mr1 mr2-ns">1/{{exposureNumberFormat(+tags.ExposureTime.description)}}</span>
      <span class="mr1 mr2-ns">f{{tags.FNumber.description}}</span>
      <span class="mr1 mr2-ns">ISO {{tags.ISOSpeedRatings.description}}</span>
      <span class="mr1 mr2-ns">{{tags.FocalLengthIn35mmFilm.description}}mm lens</span>
      <span class="">
        {{ tags.date| moment("MMM Do YYYY") }}
        {{ tags.date| moment("ha") }}
      </span>
    </div>
    <figcaption v-if="caption" class="f7 lh-copy b tr measure mt2 mb4 ml-auto near-black">
      {{caption}}
    </figcaption>
  </figure>
  </div>
</template>

<script>
import URL from 'url-parse'
import each from 'lodash/each'
export default {
  props: {
    url: String,
    caption: String,
    photoClass: String,
    tags: Object
  },
  data: function () {
    return {
      exposureFormat: null,
    }
  },
  computed: {
    srcset: function () {
      let srcURL = new URL(this.url)
      if (srcURL.hostname !== 'res.cloudinary.com') return false
      const imgSrc = this.url

      // TO ADD A NEW SIZE, ADD IT HERE
      const sizes = [320, 640, 1280, 1600]
      const srcSet = []
      each(sizes, (size) => {
        let nURL = this.modifyUrlWithSize(imgSrc, size, true)
        srcSet.push(nURL)
      })
      return srcSet.join(', \n')
    },
    sizes: function () {
      // AND ALSO ADD THE NEW SIZE HERE
      return `(max-width: 320px) 320px,
        (max-width: 640px) 640px,
        (max-width: 1280px) 1280px,
        1600px`
    }
  },
  methods: {
    exposureNumberFormat(exp){
      const speed = 1/exp
      return speed
    },
    modifyUrlWithSize: function(url, width, srcset = false) {
      let mURL = new URL(url)
      let mURLPaths = mURL.pathname.split('/')
      mURL.protocol = 'https'
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
#navigation {
  font-size: 1rem !important;
}
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
  color: #ffffff;
  margin: 0;
  line-height: 1em;
  /* text-shadow: 0 1px 1px 2px black; */  
  transition: color 0.5s ease-in-out;
  cursor: default;
}
/* .photo-tags:hover {
  color: black !important;
} */

@media screen and (min-width: 600px) {
  .photo-tags {
    font-size: 0.4em;
    padding-left: 0.4em;
    position: absolute;  
    transform: rotateZ(90deg);
    transform-origin: top left;
    top: 2.3em;
    /* left: 2.72em; */
    left:3.3em;
  }
}

@media screen and (min-width: 1200px) {
  .photo-tags {
    font-size: 0.6em;
    padding-left: 0.4em;
    position: absolute;  
    transform: rotateZ(90deg);
    transform-origin: top left;
    top: 3.2em;
    left: 2.em;
  }
}
</style>
