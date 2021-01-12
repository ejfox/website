<template>
<div class="slug-container tc pa2">
	<h2 class="tl mb5" >Darkroom Prints For Sale</h2>
	<!-- 
	TODO: Figure out a place to store information about products being sold
	CSV? Google sheets? 

	Need gumroad info and a photo (hosted on S3 / Cloudinary)
	-->
	<div
		class="pa1 pa4-ns"
		v-for="print in prints"
		v-bind:key="print.id">
		<a :href="'https://gumroad.com/l/' + print.id+'?wanted=true'" class="gumroad-button">Buy this print</a>
	</div>
</div>
</template>

<script>
export default {
  scrollToTop: true,
  components: {
  },
	data() {
		return {
			emojiIcon: '🖼️ '
		}
  },
	async asyncData ({params}) {
		let prints = await import('~/static/data/prints4sale.json')
		return { prints }
	},
  computed: {
  },
  head () {
    return {
      title: this.emojiIcon + ' Photos | EJ Fox',
      meta: [{
        'name': 'EJ Fox | Photos',
        'description': this.emojiIcon,
        'og:description': this.emojiIcon + ' prints for sale', 
        'og:title': this.title,
        'og:type': 'article',
        'twitter:title': this.title,
        'twitter:creator': 'mrejfox',
      }]
    }
  },
  created: function () {
  },
  activated: function () {
  },
  methods: {
    
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  h1, h2, h3, h4, h5 {
    word-wrap: break-word;
    hyphens: auto;
  }
}

.f-headline {
  @media (min-width: 640px) {
    font-size: 10rem;
  }
}

article li
  list-style-type circle

article.photos h1 {
  text-align: center;
}

article.photos img {
  margin: 3rem 0
}

article.photos img:first-child {
  margin-top: 0;
}

.article-pop {
  border-radius: 4px;
  border-top: 1px solid rgba(250,250,250,0.1);
  border-bottom: 1px solid rgba(25,25,25,0.1);
  box-shadow: 2px 2px 12px 0px rgba( 0, 0, 0, 0.15 );
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
