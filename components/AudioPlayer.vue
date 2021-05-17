<template>
  <div>
    <div class="f3 mv2 dib ttu tracked sans-serif">
      <div class="" v-if="duration === 0">Loading...</div>
      <div class="" v-else-if="Math.round(duration / 60) > 1">
        {{ Math.round(duration / 60) }} minutes
      </div>
      <div class="" v-else-if="Math.round(duration / 60) < 1">
        {{ Math.round(duration) }} seconds
      </div>
    </div>

    <!-- <div class="f3 pv3">Progress: {{ (progress * 100) }}%</div> -->
    <div
      :class="['progress-bar', bg]"
      :style="{ width: progress * 100 + '%' }"
    ></div>
    <div :class="['controls', duration === 0 ? 'loading-audio' : '']">
      <a
        :class="[
          'playpause-button f1 tc ph3 pa4 mb2 dib dark-gray w-100 br-pill ba bw3 b--gray',
          playing ? 'bg-black' : 'bg-white',
        ]"
        :style="[{ color: playing ? 'white !important' : 'black !important' }]"
        @click="togglePlayback"
      >
        <!-- {{ playing ? 'Pause' : 'Play' }} -->
        <i :class="['fas', playing ? 'fa-pause' : 'fa-play']"></i>
      </a>

      <a
        class="f2 db mv2 sans-serif ttu"
        v-if="duration !== 0"
        id="download-link"
        :href="url"
        target="_blank"
        >Download</a
      >

      <canvas id="canvas-viz" v-show="playing"> </canvas>

      <!-- <button class="f6 link dim ph3 pv2 mb2 dib white bg-black w-50"
      @click="stop">Stop</button> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fileUrl: { type: String, default: null },
    bg: { type: String, default: 'bg-light-gray' },
  },
  data: function () {
    return {
      url: this.sources[0],
    }
  },
  mixins: [VueHowler],
  mounted: function () {
    const sound = new Howl({
      src: [this.fileUrl],
      preload: true,
    })

    // const downloadLink = document.getElementById('download-link');
    // downloadLink.setAttribute('href', this.fileUrl)
    // downloadLink.setAttribute('href', this.fileUrl)

    const canvas = document.getElementById('canvas-viz')
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2

    const ctx = canvas.getContext('2d')

    let analyser = Howler.ctx.createAnalyser()
    // analyser.fftSize = 2048
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.95
    let bufferLength = analyser.frequencyBinCount
    let dataArray = new Uint8Array(bufferLength)
    Howler.masterGain.connect(analyser)

    function draw() {
      var drawVisual = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)
      // ctx.fillStyle = 'green'
      // ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.beginPath()

      let sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = (v * canvas.height) / 3.3

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }
      ctx.lineTo(canvas.width, canvas.height / 3.3)
      ctx.stroke()
    }

    draw()
  },
}
</script>
<style>
.controls {
  transition: all 1.2s ease-in-out;
}
.loading-audio {
  cursor: none;
  opacity: 0.2;
  filter: blur(4px);
}

.playpause-button {
  cursor: pointer;
}
.progress-bar {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  /* opacity: 0.25; */
  z-index: -1;
}
#canvas-viz {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
}
</style>

<style></style>
