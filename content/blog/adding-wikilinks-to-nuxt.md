---
dek: In which
inprogress: true
date: 2022-12-22T09:59:40-05:00
modified: 2024-04-25T17:24:18-04:00
---

#network

## Adding Obsidian-style wikilinks to Nuxt

So this was much harder than it should have been, I think.

### Adding a remark plugin to Nuxt

After some quick searching, I found the `remark-wiki-link` remark plugin that does exactly what I want to do. So I add it to `nuxt.config.ts` and pass some options.

```ts
markdown: {
      remarkPlugins: {
        // "remark-wikilinks": true,
        "remark-wiki-link": {
          hrefTemplate: (permalink: String) => `/${permalink}`,
          pageResolver: (slug) => {
            return 'page resolver?'
          },
          wikiLinkClassName: "IS-THIS-THING-ON",
          newClassName: "HELLLLOOOOOO"
        },
      }
    }
```

Unfortunately, while the `wikiLinkClassName` and `newClassName` options appear properly in the parsed wikilink, the `hrefTemplate` and `pageResolver` options, which pass a function, are not working.

I'm not sure if this is a problem with this specific remark plugin, with the way that `nuxt.config` passes options to remark plugins, or something else entirely.

But I really want wikilinks to work on my website so I can get a cool graph view like Obsidian, and most importantly, begin publishing views of the *links between ideas*. I'm especially interested in starting to work in public to synthesize the ideas and inspiration I [collect in different places](https://github.com/ejfox/scrapbook); are.na, pinboard, Twitter, Mastodon, and in links to friends.

I'm also beginning to start to take more structured weekly notes, and I want to do a better job of intertwining different things that interest me, and using technology to make it easier.

#### Why do the remark-wiki-link plugin options not work?

It's hard to debug exactly where the error is happening. We are also diving into layers of plugins built deeply into Nuxt Content.

One thing that would make this easier is to add some `console.log` at various points and see what is happening under the hood.

#### How to add a custom remark plugin to Nuxt

To better understand how plugins work under the hood, I want to create a custom plugin.

### Visualizing wikilink graph with Vue and D3

---

#### Reference
- [Markdown Configuration · Nuxt Content](https://content.nuxtjs.org/api/configuration#markdown)
- [Creating unified plugins for rehype/remark](https://unifiedjs.com/learn/guide/create-a-plugin/)
- [Transforming Markdown with Remark & Rehype Plugins](https://www.ryanfiller.com/blog/remark-and-rehype-plugins)
- [landakram/mdast-util-wiki-link](https://github.com/landakram/mdast-util-wiki-link/)
- [landakram/remark-wiki-link: Parse and render wiki links](https://github.com/landakram/remark-wiki-link)
- [Custom Rehype plugin import & module · Issue #1170 · nuxt/content · GitHub](https://github.com/nuxt/content/issues/1170)
