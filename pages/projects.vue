<template>
  <main class="pt4">
    <Head>
      <Title>EJ Fox: Projects</Title>
    </Head>
    <table id="projects" class="w-100 collapse f3 pa1" ref="projectRoot">
      <!-- projects have Client, Project Name, Role, Year, and URL-->
      <tr
        v-for="(project, index) in data.body"
        :key="project['Project Name']"
        :data-index="index"
        :id="nameToId(project['Project Name'], index)"
        :class="['', project.screenshot ? 'screenshot-row' : '']"
      >
        <td class="dn dtc-l v-mid w-10 gray">
          <div class="flex ph2 items-center in-project-client-info">
            {{ project.Client }}
          </div>
        </td>

        <td
          :class="[
            'bn ma0 pa0 dtc-l v-mid',
            project.screenshot ? 'screenshot-bg' : '',
          ]"
          :style="
            project.screenshot
              ? 'background-image: url(' +
                processProjectCloudinaryUrl(project.screenshot) +
                ')'
              : ''
          "
        >
          <div class="wrapper-div flex items-left flex-column justify-center">
            <div
              class="in-project-client-info db dn-l f6 pl3 pt2 pb0 mv0 ttu fw1 w-100"
            >
              {{ project.Client }}
            </div>

            <a
              :href="project.URL"
              class="project-name link b near-black db pv2 pv5-l f2 f-subheadline-l lh-solid-l headline-sans-serif ttu tl tc-l pl3 pl0-l ph4-l"
              >{{ project["Project Name"] }}</a
            >
            <div
              class="project-role db dn-l f7 pl3 pv2 pb0 mv0 ttu fw1 in-project-client-info tracked"
            >
              {{ project.Role }}
            </div>

            <div v-if="project.blogpost" class="db mv0 pv0 tl tc-l">
              <NuxtLink
                :to="project.blogpost"
                class="dib link mv0 pv0 black f5 o-80 pa2 pv2 mv2 ml3 ml0-l bg-white br2"
              >
                📝 <span class="underline pv5">Process blog post</span>
              </NuxtLink>
            </div>
          </div>
        </td>

        <td class="dn dtc-l v-mid w-10 gray">
          <div class="flex ph2 f5 items-center in-project-client-info">
            {{ project.Role }}
          </div>
        </td>

        <td class="dtc-l v-mid w-10 gray">
          <div class="project-year flex ph2 f5">
            {{ project.Year }}
          </div>
        </td>
      </tr>
    </table>
  </main>
</template>
<script setup>
import anime from "animejs/lib/anime.es.js";
import slugify from "slugify";
import scrollama from "scrollama";

const projectRoot = ref(null);
const animationDuration = 800;
const scroller = ref(null)

const { data } = await useAsyncData("projects", () =>
  queryContent("/projects").findOne()
);

function nameToId(name, index) {
  if (!name) return index;
  return slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true, trim: true });
}


function processProjectCloudinaryUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) return "";
  // first parse the URL
  const url = new URL(cloudinaryUrl);

  // check if the URL is a Cloudinary URL
  if (url.hostname !== "res.cloudinary.com") {
    return cloudinaryUrl; // if not, send it back
  }

  // if it is, then we process it
  // now add b_blurred:400 to the project parameters
  // like https://res.cloudinary.com/demo/video/upload/c_scale,h_320/b_blurred:400:15,c_pad,h_320,w_480/e_volume:mute/e_accelerate:100/cld_rubiks_guy.mp4

  let w_string = "w_900";

  // check if there is a window, if there is, set the width string to the window width
  if (typeof window !== "undefined") {
    // w_string = 'w_' + Math.round(window.innerWidth)
    const breakPoints = [320, 640, 900, 1080, 1440, 1920];
    const windowWidth = window.innerWidth;
    const closestBreakPoint = breakPoints.reduce((prev, curr) => {
      return Math.abs(curr - windowWidth) < Math.abs(prev - windowWidth)
        ? curr
        : prev;
    });
    w_string = "w_" + closestBreakPoint;
  }

  // first, get the path
  const path = url.pathname;

  // then add our blur to the path
  const newPath = path.replace(
    "upload",
    `upload/q_auto:eco/f_auto/e_grayscale/e_blur:600/${w_string}`
  );

  // then add the new path to the URL
  url.pathname = newPath;

  // then return the new URL

  return url.toString();
}

function animateProjects() {
  // anime({
  //   targets: "#projects tr",
  //   opacity: [0, 1],
  //   // translateY: [10, 0],
  //   easing: "easeInOutQuad",
  //   duration: animationDuration,
  //   delay: anime.stagger(animationDuration / 2.5),
  // });
}

onMounted(() => {
  nextTick(() => {
    // setTimeout(() => {
    animateProjects();
    // }, 50)
  });

  scroller.value = scrollama();

  scroller.value.setup({
    step: "#projects tr",
    offset: 0.33,
    // debug: true,
    threshold: 10,
  })
  .onStepEnter((response) => {
    const id = response.element.id;
    const project = document.getElementById(id);
    project.classList.add("active-project");
  })
  .onStepExit((response) => {
    const project = response.element
    project.classList.remove("active-project");
  });
});

// destroy scrollama on unmounted
onUnmounted(() => {
  scroller.value.destroy();
});

// also animate the projects when the route changes
// this is a hacky way to do it, but it works
const router = useRoute();
watch(router, (oldVal, newVal) => {
  if (oldVal.path !== newVal.path) {
    animateProjects();
  }
});
</script>
<style scoped>
table {
  border-collapse: collapse;
}

th {
  text-align: left;
}

tr {
  padding: 0;
  margin: 0;
}

td {
  opacity: 0.72;
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
    background-color 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.stripe-dark:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.1);
}

.headline-sans-serif {
  font-family: "Fjalla One", sans-serif;
}

.screenshot-bg {
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.screenshot-bg .wrapper-div {
  padding: 0;
  margin: 0;
  transition: background-color 1.02s cubic-bezier(0.5, 1, 0.89, 1);
  transition-delay: 33ms;
}

.screenshot-bg:hover .wrapper-div {
  /* background-color: rgba(0, 0, 0, .2); */
  background-color: rgba(255, 255, 255, 0.25);
}

/* projects in the viewport get an active class from intersection observer */

.screenshot-row td .wrapper-div {
  min-height: 36vh;
  /* background-color: rgba(0, 0, 0, .5);   */
  background-color: rgba(255, 255, 255, 0.98);
}

.active-project .wrapper-div {
  background-color: rgba(255, 255, 255, 0.25) !important;
}

.active-project td {
  opacity: 1;
}

td .wrapper-div {
  /* min-height: 22vh; */
  /* min-height: 360px; */
}

.screenshot-row {
  padding: 0;
  margin: 0;
}
</style>
