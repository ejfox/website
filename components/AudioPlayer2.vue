<template>
<div>
  <audio controls class="w-100 ba b--dark-gray bw1 br4 mv0">
    <source :src="fileUrl" type="audio/mpeg">
    <p>
      Your browser doesn't support HTML5 audio so this audio can't be streamed.
      Here is a <a :href="fileUrl">link to download the audio</a> instead.
    </p>
  </audio>
</div>
</template>

<script>
export default {
  name: 'AudioPlayer2',
  props: {
    fileUrl: { type: String, default: null }
  },
  data: function () {
    return {
    }
  },
  mounted: function() {

  }
};
</script>
<style>
audio {
  outline: none;
}

</style>