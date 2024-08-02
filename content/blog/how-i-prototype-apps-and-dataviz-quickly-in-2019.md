---
type: words
hidden: false
inprogress: false
date: 2019-03-19T21:25:22-04:00
hidetimestamp: false
modified: 2024-08-01T10:21:39-04:00
---

## How I prototype apps and dataviz quickly

::table-of-contents

::

I’ve been really enjoying using Vue as a framework for my javascript applications. It allows me to quickly and easily lay out my data structure, some DOM-elements that are controlled by data, and handle any interactions / application state stuff I might need.

In years past, my development workflow usually started with me cloning my [@ejfox/starter](https://github.com/ejfox/starter) project, which has gulp, webpack, and a handful of other useful frameworks for making things quickly already set up.

Now, since it’s upgrade to 3.0, I pretty much exclusively use

`> vue create project-name` which gives you a little CLI wizard to create a new Vue project. Importantly, you can manually select the features you want and create your own project defaults.

Mine, for example, automatically pulls in the Router, Vuex, Linter, and Stylus.

I [recorded a video of myself spinning up a prototype](https://www.youtube.com/watch?v=Q6e4pQccMH4) of a D3 force layout using the techniques I describe below, it’s around 90 minutes but you can tell YouTube to play it double-speed and click around - if you’re curious.

### Pulling in data

In my old starter project, I would pull in data with [d3.queue](https://github.com/ejfox/starter/blob/master/src/coffee/app.coffee#L19) which was super easy and very little code.

With Vue as my default framework, I’ve moved over to using the [pattern of using axios to update objects in the component’s data](https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html) which is also super easy and very little code. Check out [this super-simple example of axios+vue](https://github.com/ejfox/website/blob/master/pages/vibes.vue#L42) which powers [ejfox.com/vibes](https://ejfox.com/vibes).

When I’m pulling data from an API, it’s as simple as setting up the keys, building the API call, looking at the returned data in the Vue Chrome Devtools Inspector, and then building out the DOM elements with Vue’s [v-if and v-for](https://vuejs.org/v2/guide/list.html) directives.

### Combining Vue and D3 for dataviz

Part of the reason that I really like using Vue is that it meshes with my understanding of D3, which I use to create a majority of my data visualization work both personally and professionally.

Vue makes it so that we no longer need our old, trusty friend `d3.select().enter().append().exit()` to bind data to various DOM elements, since Vue is doing it for us.

Before Vue, I would have an SVG already on the page and do something like

```js
const svg = d3.select("svg");
const circles = d3
  .selectAll("circle")
  .data(myData)
  .enter()
  .append("circle")
  .attr((d) => {
    return {
      r: d.radius,
      cx: d.x,
      cy: d.y,
    };
  });
```

But now with Vue, I just use the HTML declarations in the template like - because of the built-in reactivity, when the data changes the DOM elements are updated. No need for the old D3 select, enter, append pattern.

```html
<svg>
  <circle
    v-for="circle in myData"
    :r="circle.radius"
    :cx="circle.x"
    :cy="circle.y"
  />
</svg>
```

I still use a ton of D3 functions though, [topojson-client](https://github.com/topojson/topojson-client), all the D3 number and color scales, force layouts, etc.

#### Animating entering/exiting

If I want to fade elements in and out like you would do with `d3.select(selection).enter().transition(t).style(‘opacity’, 1)` I’ve been using [animate.css](https://daneden.github.io/animate.css/) in combination with [Vue’s custom transition classes](https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes). So I’ll do something like

```html
<circle
  v-for="circle in myData"
  enter-active-class="animated fadeIn"
  leave-active-class="animated fadeOut"
/>
```

It’s also easy enough to use this same pattern with custom-made CSS transitions or animations, but I don’t find myself doing that too often.

### Database and user authentication

Over the past 3 months or so, I’ve fallen head over heels for the combination of Vue and Firestore via the [vue-firestore](https://www.npmjs.com/package/vue-firestore) Vue binding. You set up your Firebase app, plug in all your auth keys, and then bind data objects to firestore collections. This binding is instantaneous and reactive, so if your Vue template references an object that is bound to a collection, the page automatically updates if an item is added, removed, or changed in firestore. You don’t have to do anything different. It feels like magic.

So far for me Vue + Firestore has been fast, easy, and scalable. It reminds me of working with Meteor.js way back when.

### Deploying

I’ve been really enjoying using Netlify, and the Netlify CLI makes things even easier and faster. Once I’m ready to show someone what I’ve been working on, I just do `npm run build; netlify deploy —dir=dist` and the CLI walks me through creating a URL.

If I end up working on a project for a few days, I’ll go ahead and set up [Netlify’s continuous deployment](https://www.netlify.com/docs/continuous-deployment/) with a GitHub repo so that every time I push to master netlify automatically re-builds production from the latest commit.

It doesn’t happen that often, but if I want to go even further, it is super easy to just buy a domain name from [Namecheap](https://namecheap.com) and point it at the Netlify DNS servers. Netlify delivers websites incredibly fast, especially [combined with Nuxt](https://nuxtjs.org/faq/netlify-deployment/).

If I need to host really big files that I don’t want to put into a git repo, I’ll put them on S3 and reference the uploaded URLs in the project. I’ve also been experimenting with using [Cloudinary](https://cloudinary.com/) for hosting my images.

From start to finish, I can do everything described in this guide in about 30 minutes.

The lack of friction with this workflow causes me to try and start new things more often. This is really important to me right now as I experiment with different technologies and approaches. I have definitely had ideas and hesitated to start giving them a try because I knew I would need to spin up a new project, set up my IDE, etc. Code that exists is better than a good idea. I’d rather have a dozen half-built prototypes than a hundred good ideas.
