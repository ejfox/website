<template>
  <div class="slug-container tc pa2">
    <h2>Hello world selling prints</h2>
    <!-- 
	TODO: Figure out a place to store information about products being sold
	CSV? Google sheets? 

	Need gumroad info and a photo (hosted on S3 / Cloudinary)
	-->
  </div>
</template>

<script>
import Photo from "~/components/Photo.vue";
import Chance from "chance";

export default {
  scrollToTop: true,
  components: {
    Photo,
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context("~/content/photos/", false, /\.json$/);

    let posts = context.keys().map((key) => ({
      ...context(key),
      _path: `/photos/${key.replace(".json", "").replace("./", "")}`,
    }));

    return {
      posts,
      emojiIcon: "📷",
    };
  },
  computed: {},
  head() {
    return {
      title: this.emojiIcon + " Photos | EJ Fox",
      meta: [
        {
          name: "EJ Fox | Photos",
          description: this.emojiIcon,
          "og:description":
            this.emojiIcon + "" + this.posts.length + " photoblog posts",
          "og:title": this.title,
          "og:type": "article",
          "twitter:title": this.title,
          "twitter:creator": "mrejfox",
        },
      ],
    };
  },
  created: function () {
    this.chance = new Chance();
  },
  activated: function () {},
  methods: {
    randomPhoto(files) {
      return this.chance.pick(files);
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  h1,
  h2,
  h3,
  h4,
  h5 {
    word-wrap: break-word;
    hyphens: auto;
  }
}

.f-headline {
  @media (min-width: 640px) {
    font-size: 10rem;
  }
}

article li list-style-type circle article.photos h1 {
  text-align: center;
}

article.photos img {
  margin: 3rem 0;
}

article.photos img:first-child {
  margin-top: 0;
}

.article-pop {
  border-radius: 4px;
  border-top: 1px solid rgba(250, 250, 250, 0.1);
  border-bottom: 1px solid rgba(25, 25, 25, 0.1);
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.15);
}

/* article.photos p {
  max-width: 32rem;
} */

img {
  max-width: 100%;
}

blockquote cite {
  /* font-family: "Knockout 66 A", "Knockout 66 B" !important; */
}

pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100vw;
  overflow: auto;
}

code {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.embed-container {
  margin-bottom: 2rem;
  margin-top: 2rem;
}
</style>
