import * as fs from 'fs'
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

const processBookmarks = async () => {
  const spinner = ora('Initializing download...').start()
  try {
    const bookmarks = await fetchBookmarks()
    const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
    await fs.mkdir(dirPath, { recursive: true }, () => {}) // Ensure directory exists
    const filePath = path.join(dirPath, 'bookmarks.json')

    let existingBookmarks = []
    try {
      existingBookmarks = JSON.parse(
        await fs.readFile(filePath, 'utf8', () => {}),
      )
    } catch (error) {
      console.error('Failed to read existing bookmarks, assuming none.', error)
      await fs.writeFile(filePath, '[]', () => {}) // Ensure the file exists
    }

    const mergedBookmarks = [...existingBookmarks, ...bookmarks]
    await fs.writeFile(
      filePath,
      JSON.stringify(mergedBookmarks, null, 2),
      () => {},
    )
    spinner.succeed('Bookmarks processed and saved.')
    return mergedBookmarks
  } catch (error) {
    spinner.fail('Failed to process bookmarks.')
    console.error(error)
    throw error // Rethrow or handle as needed
  }
}

if (isCI) {
  console.time('Time elapsed')
  processBookmarks()
    .then((bookmarks) => {
      console.timeEnd('Time elapsed')
      console.log('Bookmarks processed:', bookmarks.length)
    })
    .catch(console.error)
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
      if (answers.fetchAll) {
        console.time('Time elapsed')
        const mergedBookmarks = await processBookmarks()
        console.log('Bookmarks processed:', mergedBookmarks.length)
        console.timeEnd('Time elapsed')
      } else {
        console.log('Fetching canceled.')
      }
    })
}

export { fetchBookmarks }
