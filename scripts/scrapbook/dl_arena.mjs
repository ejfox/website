import Arena from 'are.na'
import * as fs from 'fs'
import path from 'path'
import ora from 'ora' // Add missing import for ora
import inquirer from 'inquirer'
import Bottleneck from 'bottleneck'
import dotenv from 'dotenv'
import { readManifest, updateManifest } from './manifestHelpers.js'

dotenv.config()

const limiter = new Bottleneck({ minTime: 333 })
const USER_SLUG = 'ej-fox' // Replace with your Are.na username
const ARENA_ACCESS_TOKEN = process.env.ARENA_ACCESS_TOKEN

const arena = new Arena({ accessToken: ARENA_ACCESS_TOKEN })

const fetchAllBlocks = async () => {
  const spinner = ora('Initializing download...').start()
  const manifest = await readManifest()
  let lastFetch = manifest.arena?.lastFetch || new Date(0).toISOString() // Default to epoch if no timestamp available
  let allBlocks = []

  try {
    const userChannels = await arena.user(USER_SLUG).channels()

    for (const channel of userChannels) {
      let page = 1
      let fetching = true

      while (fetching) {
        const response = await limiter.schedule(() =>
          arena
            .channel(channel.id)
            .contents({ page, per: 100, updated_after: lastFetch }),
        )
        const blocks = response || []
        allBlocks = allBlocks.concat(
          blocks.map((block) => ({ ...block, channel: channel.title })),
        )
        fetching = blocks.length > 0
        page += 1
        spinner.text = `Fetched ${allBlocks.length} blocks...`
      }
    }

    spinner.succeed(`Downloaded ${allBlocks.length} blocks`)
    await updateManifest('arena', { lastFetch: new Date().toISOString() }) // Update the timestamp in the manifest
    return allBlocks
  } catch (error) {
    spinner.fail('An error occurred')
    console.error(error)
    throw error // Rethrow to handle higher up if needed
  }
}

const isCI = process.env.CI === 'true'

if (isCI) {
  fetchAllBlocks().then(async (blocks) => {
    const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
    await fs.mkdir(dirPath, { recursive: true }) // This will create the directories if they don't exist
    const filePath = path.join(dirPath, 'arena.json')
    // create file if it doesn't exist
    if (!fs.existsSync(filePath)) {
      await fs.writeFile(filePath, JSON.stringify([], null, 2))
    }
    await fs.writeFile(filePath, JSON.stringify(blocks, null, 2))
  })
} else {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'fetchAll',
        message: 'Would you like to fetch all blocks?',
        default: true,
      },
    ])
    .then(async (answers) => {
      if (answers.fetchAll) {
        const blocks = await fetchAllBlocks()
        const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
        await fs.mkdir(dirPath, { recursive: true }) // This will create the directories if they don't exist
        const filePath = path.join(dirPath, 'arena.json')
        await fs.writeFile(filePath, JSON.stringify(blocks, null, 2))
      } else {
        console.log('Fetching canceled.')
      }
    })
}

export { fetchAllBlocks }
