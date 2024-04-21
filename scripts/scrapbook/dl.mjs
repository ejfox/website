import { fetchAllBlocks } from './dl_arena.mjs'
import { fetchStatuses, fetchUserId } from './dl_mastodon.mjs'
import { fetchGithubData } from './dl_github.mjs'
import { fetchBookmarks } from './dl_pinboard.mjs'
import { promises as fs } from 'fs'
import * as helpers from '../../helpers.js'
import path from 'path'

const cleanupAndMergeData = async () => {
  const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
  await fs.mkdir(dirPath, { recursive: true }) // Ensure the directory exists

  // Fetch data from all sources
  const arenaBlocks = await fetchAllBlocks()
  const mastodonUserId = await fetchUserId()
  const mastodonStatuses = mastodonUserId
    ? await fetchStatuses(mastodonUserId)
    : []
  const pinboardBookmarks = await fetchBookmarks()
  const githubData = await fetchGithubData()

  // We need to do some sort of merging / de-duplication here
  // So we don't have duplicate entries in the data
  // We can do this by checking if the data already exists in the file
  // If it does, we can skip it

  // Check if any of the arena blocks are already in arena.json
  const existingArenaBlocks = await fs.readFile(
    path.join(dirPath, 'arena.json'),
    'utf8',
  )
  const existingArenaBlocksJson = JSON.parse(existingArenaBlocks)
  const newArenaBlocks = arenaBlocks.filter(
    (block) => !existingArenaBlocksJson.includes(block),
  )
  await fs.writeFile(
    path.join(dirPath, 'arena.json'),
    JSON.stringify(newArenaBlocks, null, 2),
  )

  // Check if any of the mastodon statuses are already in mastodon.json
  const existingMastodonStatuses = await fs.readFile(
    path.join(dirPath, 'mastodon.json'),
    'utf8',
  )
  const existingMastodonStatusesJson = JSON.parse(existingMastodonStatuses)
  const newMastodonStatuses = mastodonStatuses.filter(
    (status) => !existingMastodonStatusesJson.includes(status),
  )
  await fs.writeFile(
    path.join(dirPath, 'mastodon.json'),
    JSON.stringify(newMastodonStatuses, null, 2),
  )

  // Check if any of the pinboard bookmarks are already in pinboard.json
  const existingPinboardBookmarks = await fs.readFile(
    path.join(dirPath, 'pinboard.json'),
    'utf8',
  )
  const existingPinboardBookmarksJson = JSON.parse(existingPinboardBookmarks)
  const newPinboardBookmarks = pinboardBookmarks.filter(
    (bookmark) => !existingPinboardBookmarksJson.includes(bookmark),
  )
  await fs.writeFile(
    path.join(dirPath, 'pinboard.json'),
    JSON.stringify(newPinboardBookmarks, null, 2),
  )

  // And finally, check if any of the github data are already in github.json
  const existingGithubData = await fs.readFile(
    path.join(dirPath, 'github.json'),
    'utf8',
  )
  const existingGithubDataJson = JSON.parse(existingGithubData)
  const newGithubData = githubData.filter(
    (data) => !existingGithubDataJson.includes(data),
  )
  await fs.writeFile(
    path.join(dirPath, 'github.json'),
    JSON.stringify(newGithubData, null, 2),
  )

  console.log(
    'Data from Arena, Mastodon, and Pinboard, and GitHub has been fetched and saved.',
  )

  // combine everything together into a single file now
  const combinedData = [
    ...(arenaBlocks || []), // arena blocks
    ...(mastodonStatuses || []), // mastodon statuses
    ...(pinboardBookmarks || []), // pinboard bookmarks
    ...(githubData || []), // github data
  ]

  // write the combined data to a file
  await fs.writeFile(
    path.join(dirPath, 'all_combined.json'),
    JSON.stringify(combinedData, null, 2),
  )
}

cleanupAndMergeData().catch(console.error)
