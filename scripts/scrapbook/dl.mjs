import { fetchAllBlocks } from './dl_arena.mjs'
import { fetchStatuses, fetchUserId } from './dl_mastodon.mjs'
import { fetchGithubData } from './dl_github.mjs'
import { fetchBookmarks } from './dl_pinboard.mjs'
import { promises as fs } from 'fs'
import * as helpers from '../../helpers.js'
import path from 'path'
import { group } from 'd3'
import { format } from 'date-fns'
import { updateManifest } from './manifestHelpers.js'

const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
await fs.mkdir(dirPath, { recursive: true }) // Ensure the directory exists

function createScrap({
  id,
  type,
  href,
  description,
  time,
  images = [],
  additionalProps = {},
}) {
  const effectiveId = id || href
  const scrap_id = helpers.scrapToUUID(`${type}${effectiveId}`)

  return {
    id,
    scrap_id,
    href,
    description,
    time,
    type,
    images,
    ...additionalProps,
  }
}

const mergeAndDeduplicate = (data) => {
  const combinedData = []
  data.forEach((sourceData) => {
    sourceData.forEach((item) => {
      const existingItem = combinedData.find(
        (combinedItem) =>
          combinedItem.id === item.scrap_id && combinedItem.type === item.type,
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

function safeFetch(promise) {
  return promise.catch((error) => ({ error, data: null }))
}

const cleanupAndMergeData = async () => {
  // Fetch data from all sources
  // let arenaBlocks = await fetchAllBlocks()
  let mastodonUserId = await fetchUserId()
  // let mastodonStatuses = mastodonUserId
  //   ? await fetchStatuses(mastodonUserId)
  //   : []
  // let pinboardBookmarks = await fetchBookmarks()
  // let githubData = await fetchGithubData()

  const fetchPromises = [
    safeFetch(fetchAllBlocks()),
    safeFetch(fetchUserId().then(fetchStatuses)),
    safeFetch(fetchBookmarks()),
    // safeFetch(fetchGithubData())
  ]

  // let [arenaBlocks, mastodonStatuses, pinboardBookmarks, githubData] = await Promise.all(fetchPromises);
  let githubData = null // TODO: Right now the github action is having trouble using the github token secret, so we are gonna skip it for now
  let [arenaBlocks, mastodonStatuses, pinboardBookmarks] = await Promise.all(
    fetchPromises,
  )

  // Update manifest for each successful fetch
  const now = new Date().toISOString()
  if (arenaBlocks) await updateManifest('arena', { lastFetch: now })
  if (mastodonUserId) await updateManifest('mastodon', { lastFetch: now })
  if (pinboardBookmarks) await updateManifest('pinboard', { lastFetch: now })
  if (githubData) await updateManifest('github', { lastFetch: now })

  // are.na
  arenaBlocks = arenaBlocks.map((block) =>
    createScrap({
      id: block.id,
      scrap_id: helpers.scrapToUUID(`${block.type}${block.id}`),
      href: `https://www.are.na/block/${block.id}`,
      description: block.description,
      time: block.created_at,
      type: 'arena',
      images: block.image ? [block.image.display.url] : [],
      channel: block.channel,
    }),
  )

  // mastodon
  mastodonStatuses = mastodonStatuses.map((status) =>
    createScrap({
      id: status.id,
      type: 'mastodon-post',
      href: status.url,
      description: status.content.replace(/&[^;]+;/g, ''),
      time: status.created_at,
      images: status.media_attachments
        .filter((attachment) => attachment.type === 'image')
        .map((attachment) => attachment.preview_url),
      videos: status.media_attachments
        .filter((attachment) => attachment.type === 'video')
        .map((attachment) => attachment.url),
    }),
  )

  // pinboard
  pinboardBookmarks = pinboardBookmarks.map((bookmark) =>
    createScrap({
      id: bookmark.id,
      type: 'pinboard',
      href: bookmark.href,
      description: bookmark.description,
      time: bookmark.time,
      additionalProps: {
        tags: bookmark.tags, // Assuming you have tags and want to keep them
        extended: bookmark.extended, // Assuming you want to keep the extended description
      },
    }),
  )

  // github
  // TODO: Parse all markdown descriptions into HTML for newlines etc
  const processedStarredRepos = (githubData.starredRepos || []).map((repo) =>
    createScrap({
      id: repo.id,
      type: 'github-star',
      description: repo.description,
      href: repo.html_url,
      time: repo.created_at,
    }),
  )

  const processedIssues = (githubData.userIssues || []).map((issue) =>
    createScrap({
      id: issue.id,
      type: issue.pull_request ? 'github-pr' : 'github-issue',
      description: `${issue.repository_url.split('/').slice(-2).join('/')}: ${
        issue.title
      }`,
      href: issue.html_url,
      time: issue.updated_at,
      content: issue.body || '',
    }),
  )

  const processedGists = (githubData.userGists || []).map((gist) =>
    createScrap({
      id: gist.id,
      type: 'github-gist',
      description: gist.description,
      href: gist.html_url,
      time: gist.updated_at,
      content: Object.keys(gist.files)
        .map((file) => gist.files[file].filename)
        .join(', '),
    }),
  )

  githubData = [...processedStarredRepos, ...processedIssues, ...processedGists]

  // Merge and deduplicate the data
  const combinedData = mergeAndDeduplicate([
    arenaBlocks,
    mastodonStatuses,
    pinboardBookmarks,
    githubData,
  ])

  console.log(`${arenaBlocks.length} are.na blocks`)
  console.log(`${mastodonStatuses.length} mastodon posts`)
  console.log(`${pinboardBookmarks.length} pinboard bookmarks`)
  console.log(`${processedStarredRepos.length} starred github repos`)
  console.log(`${processedIssues.length} github issues`)
  console.log(`${processedGists.length} github gists`)

  // Sort the combined data by time in descending order
  combinedData.sort((a, b) => new Date(b.time) - new Date(a.time))

  console.log(`${combinedData.length} total scraps processed`)

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
