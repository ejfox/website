<template>
  <section class="center db cf tc">
    <section v-if="!blocks">
      <h2>Loading bookmarks</h2>
    </section>

    <h2 class="mv4 moon-gray">Recent Bookmarks</h2>

    <li
      v-for="(block, i) in blocks"
      :key="block.href"
      class="sans-serif mb1 tl dib v-top w-100 w-third-l pa3 pa4-l pb0 lh-title overflow-scroll-l f2"
    >
      <a :href="block.href" class="lh-copy f5 dark-gray link">
        <h3
          :class="[
            'sans-serif lh-solid ma0 dark-gray',
            block.description.length < 18 ? 'f2 ' : 'f3 ',
          ]"
        >
          {{ block.description }}
        </h3>

        <!-- <span class="o-20">
          <i v-if="linkDomain(block.u) === 'youtube.com'" :class="['fab fa-youtube']" />
          <i v-else-if="linkDomain(block.u) === 'twitter.com'" :class="['fab fa-twitter']" />
          <i v-else-if="linkDomain(block.u) === 'instagram.com'" :class="['fab fa-instagram']" />
          <i v-else-if="linkDomain(block.u) === 'reddit.com'" :class="['fab fa-reddit']" />
          <i v-else-if="linkDomain(block.u) === 'twitch.com'" :class="['fab fa-twitch']" />
          <i v-else-if="linkDomain(block.u) === 'vimeo.com'" :class="['fas fa-vimeo']" />
          <i v-else-if="linkDomain(block.u) === 'twitch.com'" :class="['fab fa-twitch']" />
          <i v-else-if="linkDomain(block.u) === 'medium.com'" :class="['fab fa-medium-m']" />
          <i v-else-if="linkDomain(block.u) === 'codepen.com'" :class="['fab fa-codepen']" />
          <i v-else-if="linkDomain(block.u) === 'dribbble.com'" :class="['fab fa-dribbble']" />
          <i v-else-if="block.t.indexOf('video') > 0" :class="['fas fa-video']" />
          <i v-else-if="block.t.indexOf('github') > 0" :class="['fab fa-github-alt']" />
          <i v-else-if="block.t.indexOf('machinelearning') > 0" :class="['fas fa-cog']" />
          <i v-else-if="block.t.indexOf('technique') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('howto') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('resource') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('reference') > 0" :class="['fas fa-book']" />
          <i v-else-if="block.t.indexOf('facebook') > 0" :class="['fab fa-facebook']" />
        </span> -->

        <!-- If there isn't a description, show URL -->
        <small v-if="!block.extended" class="db f7 word-wrap moon-gray mv2">
          {{ block.href }}
        </small>

        <div class="serif measure f5 lh-copy bookmark-description ma0 mt2 gray">
          <small
            v-if="block.extended"
            class="i"
            v-html="parseMarkdown(block.extended)"
          />
        </div>

        <div class="tags lh-solid ma0 pa0">
          <small class="ttu f8 o-20 mv0 mr1 lh-title pa0">
            {{ block.tags }}
          </small>
        </div>
      </a>
    </li>

    <h2 class="mv4 f2">
      <a href="https://pinboard.in/u:ejfox/">
        View All Bookmarks
        <i :class="['fas fa-arrow-alt-circle-right']" />
      </a>
    </h2>

    <section id="footer">
      <small class="db">
        Powered by <a href="https://pinboard.in/u:ejfox/">pinboard</a>
      </small>
    </section>
  </section>
</template>

<script>
import axios from "axios";
import insane from "insane";
import * as URI from "uri-js";
import marked from "marked";
import Nav from "~/components/Nav.vue";

const pinboardURI = `https://api.pinboard.in/v1/posts/all?auth_token=ejfox:6BCADA7AD389C5F5D7CE&results=72&format=json`;
// const pinboardURI = 'https://pinboard-api.now.sh/json/u:ejfox/?results=50'

export default {
  components: {
    Nav,
  },
  data() {
    return {
      blocks: [],
    };
  },
  created: function() {},
  mounted: function() {
    axios.get(pinboardURI).then((res) => {
      console.log({
        res,
      });
      console.lot(res.data[0]);
      this.blocks = res.data;
    });
  },
  methods: {
    linkDomain: function(urlString) {
      let uri = URI.parse(urlString);
      return uri.domain;
    },
    parseMarkdown: function(markdown) {
      // console.log('Parsing markdown...')
      // Build markdown parser
      const markdownRenderer = marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        tables: false,
        breaks: false,
        smartLists: true,
        smartypants: true,
        xhtml: true,
      });
      return insane(markdownRenderer(markdown), {
        allowedTags: ["h2", "h3", "h4", "ul", "li", "p"],
      });
    },
  },
  asyncData({ params }) {
    return axios.get(pinboardURI).then((res) => {
      return { blocks: res.data };
    });
  },
};
</script>

<style scoped>
body {
  background-color: white !important;
}
a,
a:link,
a:hover,
a:visited {
  color: black;
  text-decoration: none;
  border: 0;
  outline: none;
  /* cursor: default; */
}
img {
  width: 100%;
  height: auto;
  /* border: 1px solid rgba(0,0,0,0.1); */
}

#footer,
#header {
  font-size: 14px;
  font-family: Courier, "Courier New", monospace;
}

#header a {
  cursor: pointer;
}

.word-wrap {
  word-wrap: break-word;
}

.bookmark-description {
  font-family: "Hoefler Text A", "Hoefler Text B";
  font-style: normal;
  font-weight: 700;
}

.bookmark-description p {
  display: inline-block;
  /* border-top: #fbf1a9; */
}

.bookmark-description code {
  font-size: 14px;
  font-family: "Inconsolata", Courier, monospace;
  line-height: 1em !important;
  background-color: black;
  color: white;
}
pre,
code {
  line-height: 1em;
}
</style>
