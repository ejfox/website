// server/routes/rss.ts
import RSS from 'rss'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  // wrap everything in a try catch block
  try {
    const docs = await serverQueryContent(event)
      .sort({ date: -1 })
      .where({ _partial: false })
      .find()

    const blogPosts = docs
      .filter((doc) => doc?._path?.includes('/blog'))
      // filter out any with _draft set to true
      // or hidden: true
      .filter((doc) => !doc._draft && !doc.hidden)
      .slice(0, 12)

    // create new rss feed this will be our channel tag with website title and url
    const feed = new RSS({
      title: 'EJ Fox',
      site_url: 'https://ejfox.com', // link to your website/blog
      feed_url: `https://ejfox.com/rss.xml`, // path to your rss feed
    })

    // loop over each posts
    for (const post of blogPosts) {
      // console.log({ post })

      feed.item({
        title: post.title, // title from post to item title
        url: `https://ejfox.com${post._path}`, // full path to where our article is hosted
        //description: '', // dev.to APIs doesn't return a description, if you have one you can add it here
        // description: post.readingTime.text + ' ' + post.description, // description from post to item description
        description: `${post.readingTime.text} – ${post.description}`,
        // we should actually fill the description with the entire article
        // description: post.content, // content from post to item description
        date: post.published_at_int, // date post was created
        categories: post.tag_list, // list of tags
      })
    }
    const feedString = feed.xml({ indent: true }) //This returns the XML as a string.

    event.node.res.setHeader('content-type', 'text/xml') // we need to tell nitro to return this as a xml file
    event.node.res.end(feedString) // send the HTTP response
  } catch (e) {
    // return an error
    return e
  }
})
