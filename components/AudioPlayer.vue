<template>
  <div class="">
    <div class="f3 pv3 f6 mb2 db ttu tracked o-40 barlowcondensed">Total duration: {{ Math.round(duration / 60)  }} minutes</div>
    <div class="f3 pv3">Progress: {{ (progress * 100) }}%</div>
    <div class="progress-bar"
      :style="{width: (progress * 100)+'%'}">

    </div>
    <div class="controls">
      <a class="f1 tc ph3 pa4 mb2 dib white bg-black w-100 br-pill"
      style="color: white !important;"
      @click="togglePlayback">
        <!-- {{ playing ? 'Pause' : 'Play' }} -->
        <ion-icon
        :name="playing ? 'Pause' : 'Play'"></ion-icon>
      </a>
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
.progress-bar {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  background-color: red;
}
</style>


<style>

</style>
