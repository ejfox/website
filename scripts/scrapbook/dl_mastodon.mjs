import * as fs from 'fs'
import path from 'path'
import axios from 'axios'
import ora from 'ora'
import Bottleneck from 'bottleneck'
import dotenv from 'dotenv'
import { readManifest } from './manifestHelpers.js'

dotenv.config()

const MASTODON_API_URL = 'https://mastodon.social/api/v1/'
const USERNAME = 'ejfox' // Replace with your Mastodon username
const ACCESS_TOKEN = process.env.MASTODON_TOKEN
const limiter = new Bottleneck({ minTime: 333 })

const fetchUserId = async () => {
  const response = await axios.get(`${MASTODON_API_URL}accounts/search`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    params: {
      q: USERNAME,
      resolve: true,
    },
  })
  const user = response.data.find((user) => user.username === USERNAME)
  return user ? user.id : null
}

const fetchStatuses = async (userId) => {
  const spinner = ora('Initializing download...').start()
  let allStatuses = []
  let fetching = true
  let maxId = null

  const resultCount = 40 // Adjust the resultCount per your needs, maximum is 40
  while (fetching) {
    const response = await limiter.schedule(() =>
      axios.get(`${MASTODON_API_URL}accounts/${userId}/statuses`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        params: {
          limit: resultCount,
          max_id: maxId,
        },
      }),
    )
    allStatuses = allStatuses.concat(response.data)
    fetching = response.data.length === resultCount
    if (fetching) {
      maxId = response.data[resultCount - 1].id
    }
    spinner.text = `Fetched ${allStatuses.length} statuses...`
  }

  spinner.succeed(`Downloaded ${allStatuses.length} statuses`)
  return allStatuses
}

;(async () => {
  const userId = await fetchUserId()
  if (userId) {
    const statuses = await fetchStatuses(userId)
    const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook')
    const filePath = path.join(dirPath, 'mastodon.json')
    await fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directories:', err)
      }
    })
    await fs.writeFile(filePath, JSON.stringify(statuses, null, 2))
  } else {
    console.error('User ID could not be found for the specified username.')
  }
})()

export { fetchStatuses, fetchUserId }
