<template>
  <div>
    <canvas
      ref="canvas"
      id="canvas-viz"
      style="
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
      "
    >
    </canvas>
    <audio
      id="audio"
      ref="audio"
      controls
      class="w-100 ba b--dark-gray bw1 br4 mv0"
      crossOrigin="anonymous"
    >
      <source :src="fileUrl" type="audio/mpeg" />
      <p>
        Your browser doesn't support HTML5 audio so this audio can't be
        streamed. Here is a
        <a :href="fileUrl">link to download the audio</a> instead.
      </p>
    </audio>
  </div>
</template>

<script>
export default {
  name: "AudioPlayer2",
  props: {
    fileUrl: { type: String, default: null },
  },
  data: function () {
    return {};
  },
  mounted: function () {
    const canvas = document.getElementById("canvas-viz");
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    const ctx = this.$refs.canvas.getContext("2d");

    // const audioCtx = new AudioContext()
    let audioCtx;
    let analyser;
    let dataArray;
    let darkMode;
    let bufferLength;
    // const audio = document.getElementById('audio')

    // const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    // const myAudio = document.getElementById('audio')
    const myAudio = this.$refs.audio;

    let firstPlay = true;
    myAudio.addEventListener("click", (event) => {
      if (firstPlay) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const audioSrc = audioCtx.createMediaElementSource(myAudio);
        analyser = audioCtx.createAnalyser();
        audioSrc.connect(analyser);
        audioSrc.connect(audioCtx.destination);

        analyser.fftSize = 2048;
        // analyser.fftSize = 1024
        analyser.smoothingTimeConstant = 0.95;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        darkMode = true;

        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          darkMode = true;
        } else {
          darkMode = false;
        }

        firstPlay = false;
        draw();
      }

      let t = 0;
      function draw() {
        t++;
        // console.log('drawing')
        var drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        // analyser.getByteFrequencyData(dataArray)
        // console.log('dataArray', dataArray)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = 'rgba(0,0,0,0.02)'
        if (darkMode) {
          ctx.fillStyle = "rgba(41, 42, 43, 0.02)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
        }

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        if (darkMode) {
          ctx.strokeStyle = "rgb(127, 127, 127)";
        } else {
          ctx.strokeStyle = "rgb(24, 24, 24)";
        }

        ctx.beginPath();

        let sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * (canvas.height * 0.5);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 3);
        ctx.stroke();
      }
      // draw()
    });
  },
};
</script>
<style>
audio {
  outline: none;
}

.bg-near-white {
  background-color: transparent !important;
}
</style>
