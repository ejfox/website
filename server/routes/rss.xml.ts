import { serverQueryContent } from '#content/server'
import RSS from 'rss'

export default defineEventHandler(async (event) => {
  // const body = await readBody(event)

  const feed = new RSS({
    title: 'EJ Fox',
    site_url: 'https://ejfox.com',
    feed_url: `https://ejfox.com/rss.xml`,
  })
  
  const docs = await serverQueryContent(event).sort({ date: -1 }).where({ _partial: false }).find()

  const blogPosts = docs.filter((doc) => doc?._path?.includes('/blog'))

  for (const doc of blogPosts) {
    feed.item({
      title: doc.title ?? '-',
      url: `https://ejfox.com/${doc._path}`,
      date: doc.date,
      description: doc.description,
    })
  }

  const feedString = feed.xml({ indent: true })

  return feedString
})