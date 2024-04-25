import { promises as fs } from 'fs'
import path from 'path'
import axios from 'axios'
import ora from 'ora'
import inquirer from 'inquirer'
import Bottleneck from 'bottleneck'
import dotenv from 'dotenv'

dotenv.config()

const limiter = new Bottleneck({ minTime: 333 })
const apiToken = process.env.PINBOARD_TOKEN

const fetchBookmarks = async () => {
  const spinner = ora('Initializing download...').start()
  let allBookmarks = []
  let start = 0
  let fetching = true

  const resultCount = 100
  while (fetching) {
    const response = await limiter.schedule(() =>
      axios.get('https://api.pinboard.in/v1/posts/all', {
        params: {
          auth_token: apiToken,
          format: 'json',
          start,
          results: resultCount,
        },
      }),
    )
    allBookmarks = allBookmarks.concat(response.data)
    start += resultCount
    fetching = response.data.length === resultCount
    spinner.text = `Fetched ${allBookmarks.length} bookmarks...`
  }

  spinner.succeed(`Downloaded ${allBookmarks.length} bookmarks`)
  return allBookmarks
}

const isCI = process.env.CI === 'true'

if (isCI) {
  console.time('Time elapsed')
  const bookmarks = await fetchBookmarks()
  const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
  const filePath = path.join(dirPath, 'bookmarks.json')
  const existingBookmarks = await fs
    .readFile(filePath, 'utf8')
    .catch(() => '[]')
  const mergedBookmarks = JSON.stringify(
    [...JSON.parse(existingBookmarks), ...bookmarks],
    null,
    2,
  )
  await fs.mkdir(dirPath, { recursive: true }) // This will create the directories if they don't exist
  if (!fs.existsSync(filePath)) {
    await fs.writeFile(filePath, '[]')
  }
  await fs.writeFile(filePath, mergedBookmarks)
  console.timeEnd('Time elapsed')
} else {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'fetchAll',
        message: 'Would you like to fetch all bookmarks?',
        default: true,
      },
    ])
    .then(async (answers) => {
      console.time('Time elapsed')
      if (answers.fetchAll) {
        const bookmarks = await fetchBookmarks()
        const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
        const filePath = path.join(dirPath, 'bookmarks.json')
        const existingBookmarks = await fs
          .readFile(filePath, 'utf8')
          .catch(() => '[]')
        const mergedBookmarks = JSON.stringify(
          [...JSON.parse(existingBookmarks), ...bookmarks],
          null,
          2,
        )
        await fs.mkdir(dirPath, { recursive: true }) // This will create the directories if they don't exist
        if (!fs.existsSync(filePath)) {
          await fs.writeFile(filePath, '[]')
        }
        await fs.writeFile(filePath, mergedBookmarks)
      } else {
        console.log('Fetching canceled.')
      }
      console.timeEnd('Time elapsed')
    })
}

export { fetchBookmarks }
