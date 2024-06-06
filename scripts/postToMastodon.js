const axios = require('axios')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

dotenv.config()

const [changedFiles, mastodonApiUrl, mastodonAccessToken] =
  process.argv.slice(2)

const blogPostFiles = changedFiles
  .split(',')
  .filter(
    (file) =>
      file.startsWith('content/blog/') &&
      !file.startsWith('content/blog/drafts/'),
  )

if (blogPostFiles.length > 0) {
  const blogPostFile = blogPostFiles[0]
  const blogPostContent = fs.readFileSync(
    path.join(__dirname, '..', blogPostFile),
    'utf8',
  )
  const { data, content } = matter(blogPostContent)

  const title = data.title
  const link = `https://ejfox.com/blog/${blogPostFile
    .replace('content/', '')
    .replace('.md', '/')}`

  const payload = {
    status: `Just published a new blog post: "${title}" ${link}`,
  }

  axios
    .post(mastodonApiUrl, payload, {
      headers: {
        Authorization: `Bearer ${mastodonAccessToken}`,
      },
    })
    .then(() => {
      console.log('Successfully posted to Mastodon')
    })
    .catch((error) => {
      console.error('Error occurred while posting to Mastodon:', error)
      process.exit(1)
    })
}
