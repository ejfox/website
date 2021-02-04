<template>
  <section class="pa3 pa4-ns db cf mb4">
    <h2 class="mb4">Services</h2>
    <p class="measure">
      Hire me to do work for you! Just shoot me an email at
      <a href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a> or <a href="https://calendly.com/ejfox/sync">grab a spot on my calendar</a>.
    </p>
    <section class="w-50-ns dib v-top pr2">
      <h3>Data Visualization Design</h3>
      <p>
        I make responsive infographics quickly. I started my career making
        static infographics in Illustrator, and after a decade of client work it
        still brings me a lot of pleasure. These static graphics are used to add
        context to a written piece, and I love partnering with journalists to
        help them tell their story. I like every step of the process, from
        scraping and data gathering, exploratory analysis and visualization to
        creating a beautiful responsive final product.
      </p>
    </section>

    <section class="w-50-ns dib v-top pr2">
      <h3>Interactive Development</h3>
      <p>
        Sometimes to tell a data story, it's easier to make understandable
        through interactive graphics. I've spent the last 10 years or so working
        in D3 to create interactive data visualizations for mobile, desktop, and
        broadcast.
      </p>
    </section>
    <section class="w-50-ns dib v-top pr2">
      <h3>Cartography</h3>
      <p>
        I love making both static and interactive maps. Mostly I use QGIS,
        Mapbox, and Cinema 4D. I enjoy making maps with election data, and
        exploring alternatives to choropleths.
      </p>
    </section>
    <section class="w-50-ns dib v-top pr2">
      <h3>Prototyping</h3>
      <p>
        I really love the challenge of making ideas exist quickly in new spaces,
        frameworks, or technologies. I pride myself in getting myself up to
        speed in new systems quickly. These prototypes might be little scripts,
        Observable notebooks, or pitch decks. But I pride myself in creating
        focused and comprehensive minimum viable products.
      </p>
    </section>
    <section class="w-50-ns dib v-top pr2">
      <h3>Video Production &amp; Motion Graphics</h3>
      <p>
        For the past year, I have been working more to create motion graphics
        for explanation and data visualization. Videos are a really cool
        opportunity to combine lots of different skills towards one goal:
        scriptwriting, data visualization, animation, data sonification. It is
        really challenging and rewarding, and a place I would like to continue
        to practice and grow.
      </p>
    </section>

    <section class="w-50-ns dib v-top pr2">
      <h3>Livestream Production</h3>
      <p>
        I co-host the livecoding stream <strong>Coding With Fire</strong> with
        my friend Ian Johnson
        <a href="https://twitch.tv/enjalot">on his Twitch</a>. I really enjoy
        the process of livestream production, from creating graphics and scenes
        in OBS to helping produce segments and prepare guests.
      </p>
    </section>
    <p class="measure pt4">
      I call myself a <strong>hacker-journalist</strong>. I am a
      <strong>hacker</strong> in the sense that much of my time is spent
      convincing various computers to do my bidding, and I am a
      <strong>journalist</strong> in the sense that my bidding is often to
      discover, explore, or tell truthful stories about the world. Not all of my
      work pulls from these backgrounds equally, and there are times where I am
      mostly journalist or mostly hacker.
    </p>

    <p class="measure">
      My favorite moments are when someone says "I am not sure this is possible,
      but..." and then I can dive into the puzzle of unlocking the thing they
      don't totally believe can be done.
    </p>

    <p class="measure">
      I like creating things from nothing, making things exist. I love the
      challenge of making things exist on a deadline. I love the inherent
      deadlines in news, the need for speed and pragmatism and hard choices.
    </p>

    <p class="measure">
      A lot of people hire me to take an idea they have and make it exist with
      code. Because of this, and because every project is different, I find
      myself working up and down the stack, depending on the team and
      infrastructure I am working with. I am comfortable spinning up my own
      servers or SSH'ing into yours. I am comfortable hand-coding my own static
      webpages from scratch, or hacking your CMS to get everything working
      perfectly.
    </p>

    <p class="measure">
      I like working with teams of all sizes and disciplines. I really enjoy the
      process of learning new things and working with unique and diverse
      collaborators.
    </p>
  </section>
</template>

<script>
import Nav from "~/components/Nav.vue";
import Footer from "~/components/Footer.vue";

export default {
  components: {
    Nav,
    Footer,
  },
  methods: {},
  data() {
    return {};
    // Using webpacks context to gather all files from a folder
    // const context = require.context("~/content/blog/posts/", false, /\.json$/);
    // let posts = context.keys().map((key) => ({
    //   ...context(key),
    //   _path: `/blog/${key.replace(".json", "").replace("./", "")}`,
    // }));
    // posts = posts.sort(function(a, b) {
    //   return new Date(b.date) - new Date(a.date);
    // });
    // posts = posts.filter((post) => !post.hidden);
    // return { posts };
  },
};
</script>

<style scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  word-wrap: break-word;
}

p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

ul {
  padding: 0;
}
/* li { list-style-type: none } */

.intro a:link,
.intro a:hover {
  color: black;
  text-decoration: underline;
}

.intro a:visited,
.intro a:focus {
  color: #414346;
  /*text-decoration: none;*/
}
</style>
