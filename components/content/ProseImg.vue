<template>
        <nuxt-img
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        placeholder
      />
  <!-- <span v-if="isCloudinary"> -->
    <!-- <figure> -->
      <!-- <img
        :src="modifyUrlWithSize(src, 640)"
        :srcset="srcSet"
        :alt="alt"
        :width="width"
        :height="height"
        loading="lazy"
      /> -->
    <!-- </figure> -->
  <!-- </span> -->
  <!-- <span v-else>
    <img :src="src" :alt="alt" :width="width" :height="height" loading="lazy" />
  </span> -->
</template>

<script setup>
import { isValidHttpUrl } from "~~/helpers";
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
});

const sizes = [640, 900, 1280, 1600];

// check whether src is linking to a res.cloudinary.com image
const isCloudinary = computed(() => {
  if (!props.src) return false;
  if (!isValidHttpUrl(props.src)) return false;
  const url = new URL(props.src);
  return url.hostname === "res.cloudinary.com";
});

function modifyUrlWithSize(url, width, srcset = false) {
  let mURL = new URL(url);
  if (!mURL) return false;
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
}

const srcSet = computed(() => {
  if (!isCloudinary.value) return null;
  const imgSrc = props.src;
  const srcSet = [];
  sizes.forEach((size) => {
    let nURL = modifyUrlWithSize(imgSrc, size, true);
    srcSet.push(nURL);
  });
  return srcSet.join(", \n");
});
</script>
