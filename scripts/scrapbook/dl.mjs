import { fetchAllBlocks } from './dl_arena.mjs'
import { fetchStatuses, fetchUserId } from './dl_mastodon.mjs'
import { fetchGithubData } from './dl_github.mjs'
import { fetchBookmarks } from './dl_pinboard.mjs'
import { promises as fs } from 'fs'
import * as helpers from '../../helpers.js'
import path from 'path'
import { group } from 'd3'
import { format } from 'date-fns'

const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
await fs.mkdir(dirPath, { recursive: true }) // Ensure the directory exists

const mergeAndDeduplicate = (data) => {
  const combinedData = []
  data.forEach((sourceData) => {
    sourceData.forEach((item) => {
      const existingItem = combinedData.find(
        (combinedItem) =>
          combinedItem.id === item.id && combinedItem.type === item.type,
      )
      if (existingItem) {
        Object.assign(existingItem, item)
      } else {
        combinedData.push(item)
      }
    })
  })
  return combinedData
}

const groupDataByWeek = (data) => {
  const groupedData = group(data, (d) => format(new Date(d.time), 'yyyy-ww'))
  return Object.fromEntries(
    Array.from(groupedData, ([week, data]) => [
      week,
      data.sort((a, b) => new Date(b.time) - new Date(a.time)),
    ]),
  )
}
const cleanupAndMergeData = async () => {
  // Fetch data from all sources
  let arenaBlocks = await fetchAllBlocks()
  let mastodonUserId = await fetchUserId()
  let mastodonStatuses = mastodonUserId
    ? await fetchStatuses(mastodonUserId)
    : []
  let pinboardBookmarks = await fetchBookmarks()
  let githubData = await fetchGithubData()

  // Tweak the shape of the data
  arenaBlocks = arenaBlocks.map((block) => ({
    id: block.id,
    href: `https://www.are.na/block/${block.id}`,
    description: block.description,
    time: block.created_at,
    type: 'arena',
    images: block.image ? [block.image.display.url] : [],
    channel: block.channel,
  }))
  mastodonStatuses = mastodonStatuses.map((status) => ({
    id: status.id,
    href: status.url,
    description: status.content.replace(/&[^;]+;/g, ''),
    time: status.created_at,
    type: 'mastodon',
    images: status.media_attachments
      .filter((attachment) => attachment.type === 'image')
      .map((attachment) => attachment.preview_url),
    videos: status.media_attachments
      .filter((attachment) => attachment.type === 'video')
      .map((attachment) => attachment.url),
  }))
  pinboardBookmarks = pinboardBookmarks.map((bookmark) => ({
    id: bookmark.id,
    href: bookmark.href,
    description: bookmark.description,
    time: bookmark.time,
    type: 'pinboard',
    ...bookmark,
  }))

  // TODO: Parse all markdown descriptions into HTML for newlines etc
  githubData = [
    ...(githubData.starredRepos || []).map((repo) => ({
      id: repo.id,
      description: repo.description,
      href: repo.html_url,
      // time: repo.updated_at,
      time: repo.created_at,
      type: 'github-star',
      images: [],
    })),
    // ...(githubData.userRepos || []).map(repo => ({
    //   id: repo.id,
    //   description: repo.name,
    //   href: repo.html_url,
    //   content: repo.description,
    //   time: repo.updated_at,
    //   type: 'github',
    //   images: [],
    // })),
    ...(githubData.userIssues || []).map((issue) => ({
      id: issue.id,
      description: issue.title,
      href: issue.html_url,
      content: `${issue.repository_url.split('/').slice(-2).join('/')}: ${
        issue.title
      } ${issue?.body ? issue.body : ''}`,
      time: issue.updated_at,
      type: issue.pull_request ? 'github-pr' : 'github-issue',
      images: [],
    })),
    ...(githubData.userGists || []).map((gist) => ({
      id: gist.id,
      description: gist.description,
      // a list of the files
      content: Object.keys(gist.files)
        .map((file) => gist.files[file].filename)
        .join(', '),
      href: gist.html_url,
      time: gist.updated_at,
      type: 'github-gist',
      images: [],
    })),
  ]

  // Merge and deduplicate the data
  const combinedData = mergeAndDeduplicate([
    arenaBlocks,
    mastodonStatuses,
    pinboardBookmarks,
    githubData,
  ])

  // Sort the combined data by time in descending order
  combinedData.sort((a, b) => new Date(b.time) - new Date(a.time))

  // Group the combined data by week
  const groupedData = groupDataByWeek(combinedData)

  // Save each week's data to a separate JSON file
  const weekFolderPath = path.join(dirPath, 'week')
  await fs.mkdir(weekFolderPath, { recursive: true }) // Ensure the week folder exists

  for (const [week, data] of Object.entries(groupedData)) {
    await fs.writeFile(
      path.join(weekFolderPath, `${week}.json`),
      JSON.stringify(data, null, 2),
    )
  }

  // Update the scraps.json file to include both the combinedData array and the grouped data object
  await fs.writeFile(
    path.join(dirPath, 'scraps.json'),
    JSON.stringify(combinedData, null, 2),
  )

  console.log(
    'Data from Arena, Mastodon, and Pinboard, and GitHub has been fetched, merged, and saved.',
  )
}

cleanupAndMergeData().catch(console.error)
