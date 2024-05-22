// import { group } from 'd3'
// Load up the bookmarks JSON data
import { fetchAndSummarizeUrl } from '@ejfox/gpt-browser'

const USER_TAGS = `3d, art, cli, data, dataviz, design, elections, hackers, howto, javascript, journalism, machine learning / AI, mapping/cartography, music, police, politics, protest, tech, tool, video, vj, web development, creative coding, outdoors, motorcycles, or travel`

// const fs = require('fs')
import fs from 'fs'
const scrapData = JSON.parse(
  fs.readFileSync('./public/data/scrapbook/scraps.json', 'utf8'),
)
const bookmarksData = scrapData.filter((d) => d.type === 'pinboard')
import * as d3 from 'd3'
import OpenAi from 'openai'
const openai = new OpenAi()

// group the data by week
const groupedData = d3.group(bookmarksData, (d) =>
  d3.timeWeek(new Date(d.time)),
)

/**
 * Add a summary to each bookmark
 * @returns {Promise<void>}
 */
async function addSummaryToBookmarks() {
  for (const bookmark of bookmarksData) {
    console.log(`Summarizing ${bookmark.href}...`)
    if (bookmark.summary) {
      console.log('Summary already exists, skipping', bookmark.href)
      continue
    }

    // if the date is before 2024, skip it
    if (new Date(bookmark.time) < new Date('2024-01-01')) {
      console.log('pre-2020 bookmark, skipping')
      continue
    }

    let summary
    try {
      // fetch the URL and summarize it
      summary = await fetchAndSummarizeUrl(bookmark.href)
    } catch (error) {
      console.error('Error fetching and summarizing URL:', error)
    }

    // check if the bookmark already has a summary

    // add the summary to the bookmark
    bookmark.summary = summary

    console.log(bookmark)

    // write the updated bookmarks data to a file
    // fs.writeFileSync(
    //   './public/data/scrapbook/bookmarks.json',
    //   JSON.stringify(bookmarksData, null, 2),
    // )

    // write the updated scraps back to scraps.json- but don't mess up the other data
    const updatedScrapData = scrapData.map((d) =>
      d.id === bookmark.id ? { ...d, summary } : d,
    )
    fs.writeFileSync(
      './public/data/scrapbook/scraps.json',
      JSON.stringify(updatedScrapData, null, 2),
    )
  }
}

/**
 * Adds a meta summary to bookmarks, which is a summary of all the bookmarks from the week
 * @returns
 */
async function addMetaSummaryToBookmarks() {
  // This regenerates the bookmark summary, but taking into context the summaries of *all* bookmarks from the week
  // This is useful for generating a summary of the week's research

  const completionService = 'openai' // or 'anthropic'

  for (const bookmark of bookmarksData) {
    // now we need to re-summarize given the context of the other bookmarks from this week
    const timeDate = new Date(bookmark.time)
    const week = d3.timeWeek(timeDate)
    const bookmarksThisWeek = groupedData.get(week)

    // if there is no summary, skip
    if (!bookmark.summary) {
      console.log('No summary for', bookmark.href)
      continue
    }

    if (new Date(bookmark.time) < new Date('2020-01-01')) {
      console.log('pre-2020 bookmark, skipping')
      continue
    }

    // combine all the summaries for this week
    const allSummaries = bookmarksThisWeek
      .map((b) => `# <${b.href}> ${b.description}\n\n${b.summary}`)
      .join(`\n`)

    console.log(`${bookmarksThisWeek.length} summaries combined for ${week}`)

    // console.log('allSummaries: ', allSummaries)

    const resummarizeMessages = [
      {
        role: 'system',
        content: `You are an AI research assistant. Your task is to read the web pages provided by the user and extract relevant facts from them. Organize these facts into clear and concise lists, categorizing them as appropriate. Aim to provide a comprehensive yet succinct overview of the key information contained in the web pages. If asked to summarize your findings, do so in a neutral, objective tone.`,
      },
      {
        role: 'user',
        content: `Pollow these steps:

1. Read about this article I bookmarked.
2. Identify the main topics and key points of the article based on the summary.
3. Determine if the article fits into one of the existing research tags: ${USER_TAGS}. If it covers a new topic, suggest a new tag.
4. Provide a concise summary of the article in 1-2 sentences, highlighting the main points and how they relate to my existing or potential research topics.
5. Use a neutral, objective tone in your summary- use direct quotes, and transparently represent the content of the article.

Here are some examples of good summaries:
- "An investigation by Mission Local into the influence of tech and real estate "big money" on San Francisco - ties into recent research on the emerging right-wing tech industry and the dystopian impact of tech on society"
- "A GitHub repo that helps users create a custom map of their own city, tying into ongoing research on mapping tools, potentially related to recent research on San Francisco's housing crisis"
        
## This week's research\n\n${allSummaries}\n\n## Article Summary\n\n${bookmark.summary}\n\n## Research question\n\nPlease summarize this information and tie it into the ongoing research for the week, if possible. Try to be short, factual, and concise, with the tone of a journalist. Please keep your responses as short as possible, under 2 short sentences. Never repeat the week's theme, focus on the Article Summary and relating it to the ongoing research or the tags I use. No chit-chat or preamble, skip directly into the description. Never talk about "this week" - focus on the bookmark. Stick to the facts.

Use this template:
Main topic: [Insert main topic here]

Key points:
1. [Insert key point 1]
2. [Insert key point 2]
3. [Insert key point 3]
(as many as needed)

#[Insert existing or new research tag]

Summary:
[Insert a 3-4 sentence summary of the article, highlighting the main points and how they relate to the user's existing or potential research topics. Use a neutral, objective tone.]`,
      },
    ]

    let summaryAgainCompletion
    if (completionService === 'openai') {
      summaryAgainCompletion = await openai.chat.completions.create({
        messages: resummarizeMessages,
        model: 'gpt-4-turbo-preview',
      }).choices[0]
    } else if (completionService === 'anthropic') {
      // anthropic requires alternating user/assistant messages ONLY
      // so we need to turn any system messages into user messages
      // and collapse any user/system messages that are back-to-back
      const messages = resummarizeMessages.reduce((acc, msg) => {
        if (msg.role === 'system') {
          acc.push({ role: 'user', content: msg.content })
        } else if (acc.length > 0 && acc[acc.length - 1].role === 'user') {
          acc[acc.length - 1].content += '\n\n' + msg.content
        } else {
          acc.push({ role: 'assistant', content: msg.content })
        }
        return acc
      }, [])

      const msg = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages,
      })

      summaryAgainCompletion = msg
    }

    console.log(summaryAgainCompletion)

    // const summaryCompletion = summaryAgainCompletion.choices[0]

    // add the new summary to the bookmark
    bookmark.summaryAgain = summaryCompletionAgainCompletion

    // write the updated bookmarks data to a file
    // fs.writeFileSync(
    //   './public/data/scrapbook/bookmarks.json',
    //   JSON.stringify(bookmarksData, null, 2),
    // )

    // THIS IS DUMB, overwrites the SAME SUMMARY ON EVERY BOOKMARK
    // const updatedScrapData = scrapData.map((d) =>
    //   d.id === bookmark.id ? { ...d, summaryAgain } : d,
    // )

    // WE NEED TO DO IT SMART, ONLY UPDATE THE BOOKMARK WE'RE WORKING ON
    const updatedScrapData = scrapData.map((d) =>
      d.scrap_id === bookmark.scrap_id ? { ...d, summaryAgain } : d,
    )

    fs.writeFileSync(
      './public/data/scrapbook/scraps.json',
      JSON.stringify(updatedScrapData, null, 2),
    )
  }

  // make sure bookmarksData isn't an empty array
  if (bookmarksData.length === 0) {
    console.error('No bookmarks found')
    return
  }
}

// await addSummaryToBookmarks()
// await addMetaSummaryToBookmarks()

async function summarizeWeeks() {
  const weekSummaryFile =
    './public/data/scrapbook/bookmarks_week-summaries.json'
  const weekSummaries = []

  for (const [week, bookmarks] of groupedData) {
    console.log('Summarizing week:', week)

    // if week is before 2020, skip it
    if (new Date(week) < new Date('2020-01-01')) {
      console.log('pre-2020 week, skipping')
      continue
    }

    // combine all the summaries
    const allSummaries = bookmarks
      .map(
        (b) =>
          `# <${b.href}> ${b.description}\n\n${b.summaryAgain}\n\n${b.summary}`,
      )
      .join(`\n`)

    const messages = [
      {
        role: 'system',
        content: `You are an AI research assistant tasked with identifying overarching themes and connections between the user's bookmarks for the week. Follow these steps:

  1. Review the summaries of the bookmarks provided by the user.
  2. Identify common themes, topics, or patterns that emerge across the bookmarks.
  3. Determine if the identified themes fit into one of the existing research tags: ${USER_TAGS}. If a new theme emerges, suggest a new tag.
  4. Synthesize the information into a concise, 4-6 sentence narrative that highlights the main research themes and connections for the week.
  5. Use a neutral, objective tone and avoid unnecessary adjectives or self-aggrandizing language.
  
  Here are some examples of effective research theme summaries:
  - "This week's research focused on logistics, with an emphasis on radios and knots. A story about a new tool for creating custom maps was also found, and might be related to the logistics theme. Many articles tie into outdoors and travel."
  - "This week's research primarily focused on elections and politics, with a few articles about police and protest, including one about an officer who was fired for speaking out against police brutality. On Wednesday, 2 new mapping tools were identified."`,
      },
      {
        role: 'user',
        content: `
        ## This week's research
  ${allSummaries}
        
  ## Research question
  Please summarize this information and identify the research themes of the week. Skip directly into the description, keeping it short, concise, and information-dense. Avoid lists, adjectives, or self-aggrandizing language. Stick to the facts`,
      },
    ]

    // re-summarize
    const summaryAgainCompletion = await openai.chat.completions.create({
      messages,
      // n: 3, // get
      // model: 'gpt-4-turbo-preview',
      model: 'gpt-4o',
    })

    // console log all the completions
    console.log(summaryAgainCompletion.choices)

    // write the completion to the week summaries
    weekSummaries.push({
      week,
      summary: summaryAgainCompletion.choices[0].message.content,
      urls: bookmarks.map((b) => b.href),
    })

    // write the updated week summaries to a file
    // fs.writeFileSync(weekSummaryFile, JSON.stringify(weekSummaries, null, 2))

    const updatedScrapData = scrapData.map((d) =>
      d.scrap_id === bookmark.scrap_id ? { ...d, summaryAgain } : d,
    )
    fs.writeFileSync(
      './public/data/scrapbook/scraps.json',
      JSON.stringify(updatedScrapData, null, 2),
    )
  }
}

await addSummaryToBookmarks()
  .then(() => addMetaSummaryToBookmarks())
  .then(() => summarizeWeeks())
