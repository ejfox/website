<template>
  <figure :class="containerClass" >
    <img
      :class="cssClass"
      :src="modifyUrlWithSize(url, 320)"
      :srcset="srcset"
      :sizes="sizes"
      loading="lazy"
    />
    <figcaption v-if="caption" class="measure">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script>
import URL from "url-parse";
import each from "lodash/each";
export default {
  props: {
    src: String,
    caption: String,
    cssClass: String,
    tags: Object,
    containerClass: String
  },
  data: function() {
    return {
      url: ''
    };
  },
  computed: {
    srcset: function() {
      let srcURL = new URL(this.src);
      if (srcURL.hostname !== "res.cloudinary.com") return false;
      const imgSrc = this.src;

      // TO ADD A NEW SIZE, ADD IT HERE
      const sizes = [320, 640, 1280, 1600];
      const srcSet = [];
      each(sizes, (size) => {
        let nURL = this.modifyUrlWithSize(imgSrc, size, true);
        srcSet.push(nURL);
      });
      return srcSet.join(", \n");
    },
    sizes: function() {
      // AND ALSO ADD THE NEW SIZE HERE
      return `(max-width: 320px) 320px,
        (max-width: 640px) 640px,
        (max-width: 1280px) 1280px,
        1600px`;
    },
  },
  methods: {
    modifyUrlWithSize: function(url, width, srcset = false) {
      let mURL = new URL(url);
      let mURLPaths = mURL.pathname.split("/");
      mURL.protocol = "https";
      let urlAppendString = "fl_progressive:semi,c_scale,dpr_auto,w_" + width;
      mURLPaths.splice(mURLPaths.length - 2, 0, urlAppendString);
      mURL.pathname = mURLPaths.join("/");
      if (srcset) {
        return mURL.toString() + ` ${width}w`;
      } else {
        return mURL.toString();
      }
    },
  },
  mounted: function() {},
};
</script>
<style scoped="true"></style>
