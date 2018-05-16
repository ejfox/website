<template>
  <div class="">
    <div class="f3 pv3 f6 mb2 db ttu tracked o-40 barlowcondensed">Total duration: {{ Math.round(duration / 60)  }} minutes</div>
    <div class="f3 pv3">Progress: {{ (progress * 100) }}%</div>
    <div class="controls">
      <button class="f1 link dim ph3 pa4 mb2 dib white bg-black w-100"
      @click="togglePlayback">
        <!-- {{ playing ? 'Pause' : 'Play' }} -->
        <ion-icon
        :name="playing ? 'Pause' : 'Play'"></ion-icon>
      </button>
      <!-- <button class="f6 link dim ph3 pv2 mb2 dib white bg-black w-50"
      @click="stop">Stop</button> -->
    </div>
  </div>
</template>

<script>
import VueHowler from 'vue-howler'

export default {
  props: {
    fileUrl: { type: String, default: null }
  },
  mixins: [
    VueHowler
  ],
  onMounted: function() {
    const sound = new Howl({
      src: [this.fileUrl]
    });
  }
};
</script>


<style>

</style>
