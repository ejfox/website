import * as d3 from 'd3'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Read the request body
  const body = await readBody(event)
  const { services = [], startDate, endDate, scrapId } = body

  // Define the paths to the JSON files
  const bookmarksPath = path.resolve('data/scrapbook/bookmarks.json')
  const mastodonPath = path.resolve('data/scrapbook/mastodon.json')
  const arenaPath = path.resolve('data/scrapbook/arena.json')
  const githubPath = path.resolve('data/scrapbook/github.json')

  // Function to filter data by date range
  const filterByDate = (data, startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return data.filter((item) => {
      const itemDate = new Date(item.time)
      return itemDate >= start && itemDate <= end
    })
  }

  // Function to filter data by services
  const filterByService = (data, services) => {
    if (services.length === 0) return data
    return data.filter((item) => services.includes(item.type))
  }

  // Function to find a scrap by ID
  const findById = (data, id) => {
    return data.find((item) => item.id.toString() === id.toString())
  }

  // Read and parse the JSON files
  const bookmarksData = JSON.parse(fs.readFileSync(bookmarksPath, 'utf-8'))
  const mastodonData = JSON.parse(fs.readFileSync(mastodonPath, 'utf-8'))
  const arenaData = JSON.parse(fs.readFileSync(arenaPath, 'utf-8'))
  const githubData = JSON.parse(fs.readFileSync(githubPath, 'utf-8'))

  // Combine the data from all sources
  let combinedData = [
    ...bookmarksData,
    ...mastodonData,
    ...arenaData,
    ...githubData.starredRepos,
    ...githubData.userRepos,
    ...githubData.userIssues,
  ].map((item) => ({
    ...item,
    time: item.created_at || item.updated_at || item.time,
    type: item.type || 'github', // Default type for GitHub items
  }))

  // Filter combined data based on query parameters
  if (startDate && endDate) {
    combinedData = filterByDate(combinedData, startDate, endDate)
  }
  if (services.length > 0) {
    combinedData = filterByService(combinedData, services)
  }
  if (scrapId) {
    const specificScrap = findById(combinedData, scrapId)
    combinedData = specificScrap ? [specificScrap] : []
  }

  // Group the combined data by week
  const scrapByWeek = d3.group(combinedData, (d) => {
    const date = new Date(d.time)
    const week = d3.timeWeek.floor(date)
    return week
  })

  // Return the combined and grouped data
  return { combinedData, scrapByWeek }
})

