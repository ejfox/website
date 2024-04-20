// import { group } from 'd3'
// Load up the bookmarks JSON data
import { fetchAndSummarizeUrl } from '@ejfox/gpt-browser'

const USER_TAGS = `3d, art, cli, data, dataviz, design, elections, hackers, howto, javascript, journalism, machine learning / AI, mapping/cartography, music, police, politics, protest, tech, tool, video, vj, web development, creative coding, outdoors, motorcycles, or travel`

// const fs = require('fs')
import fs from 'fs'
const bookmarksData = JSON.parse(
  fs.readFileSync('./public/data/scrapbook/bookmarks.json', 'utf8'),
)
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

    // if the bookmark is before 2020, skip it
    if (new Date(bookmark.time) < new Date('2020-01-01')) {
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
    fs.writeFileSync(
      './public/data/scrapbook/bookmarks.json',
      JSON.stringify(bookmarksData, null, 2),
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


  const completionService = 'openai'; // or 'anthropic'

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

    // combine all the summaries for this week
    const allSummaries = bookmarksThisWeek
      .map((b) => `# <${b.href}> ${b.description}\n\n${b.summary}`)
      .join(`\n`)

    console.log(`${bookmarksThisWeek.length} summaries combined for ${week}`)

    // console.log('allSummaries: ', allSummaries)

    const resummarizeMessages = [
      {
        role: 'system',
        content: `Embrace the archives of the user's digital journey, sifting through bookmarked realms to distill essences of knowledge and inspiration.`,
      },
      {
        role: 'user',
        content: `Can you help me summarize an article, tying it into my ongoing research for the week? Usually it fits into one of these tags: ${USER_TAGS}. If it's a new topic, I'll add a new tag.
        
        Here are some examples of good summaries:
        - "An investigation by Mission Local into the influence of tech and real estate "big money" on San Francisco- ties into recent research on the emerging right-wing tech industry and the dystopian impact of tech on society"
        - "A GitHub repo that helps users create a custom map of their own city, typing into ongoing research on mapping tools, potentially related to recent research on San Francisco's housing crisis"
        `,
      },
      {
        role: 'assistant',
        content: `Absolutely! Please send along the article summary and all of the bookmark and I'll do my best to summarize the topic and tie it into the ongoing research for the week.`,
      },
      {
        role: 'user',
        content: `## This week's research\n\n${allSummaries}\n\n## Article Summary\n\n${bookmark.summary}\n\n## Research question\n\nPlease summarize this information and tie it into the ongoing research for the week, if possible. Try to be short, factual, and concise, with the tone of a journalist. Please keep your responses as short as possible, under 2 short sentences. Never repeat the week's theme, focus on the Article Summary and relating it to the ongoing research or the tags I use. No chit-chat or preamble, skip directly into the description. Never talk about "this week" - focus on the bookmark. Stick to the facts.`,
      },
    ]

    let summaryAgainCompletion;
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
          acc.push({ role: 'user', content: msg.content });
        } else if (acc.length > 0 && acc[acc.length - 1].role === 'user') {
          acc[acc.length - 1].content += '\n\n' + msg.content;
        } else {
          acc.push({ role: 'assistant', content: msg.content });
        }
        return acc;
      }, []);


      const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages,
      });

      summaryAgainCompletion = msg;
    }

    console.log(summaryAgainCompletion)

    // const summaryCompletion = summaryAgainCompletion.choices[0]

    // add the new summary to the bookmark
    bookmark.summaryAgain = summaryCompletionAgainCompletion

    // write the updated bookmarks data to a file
    fs.writeFileSync(
      './public/data/scrapbook/bookmarks.json',
      JSON.stringify(bookmarksData, null, 2),
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
        content: `Embrace the archives of the user's digital journey, sifting through bookmarked realms to distill essences of knowledge and inspiration- help the user identify the sometimes hidden threads in their research, looking for small connections to big ideas and surfacing details that tie everything together.`,
      },
      {
        role: 'user',
        content: `Can you help me identify the over-arching threads between a bunch of bookmarks I made this week? Usually it fits into one of these tags: ${USER_TAGS}. 

        Try to use a narrative approach:
        "This week's research focused on logistics, with an emphasis on radios and knots. A story about a new tool for creating custom maps was also found, and might be related to the logistics theme. Many articles tie into outdoors and travel."

        "This week's research primarily focused on elections and politics, with a few articles about police and protest, including one about an officer who was fired for speaking out against police brutality. On Wednesday, 2 new mapping tools were identified."
        `,
      },
      {
        role: 'assistant',
        content: `Absolutely! Please send along the article summaries from your bookmarks this week and I can get to synthesizing the information.`,
      },
      {
        role: 'user',
        content: `## This week's research\n\n${allSummaries}\n\n## Research question\n\nPlease summarize this information and identify the research themes of the week. No chit-chat or preamble, skip directly into the description. Keep it short, concise, and information-dense. Do not respond in the form of a list- try to keep it to 4-6 sentences. Avoid adjectives or self-aggandizing language. Stick to the facts.`,
      },
    ]

    // re-summarize
    const summaryAgainCompletion = await openai.chat.completions.create({
      messages,
      // n: 3, // get
      model: 'gpt-4-turbo-preview',
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
    fs.writeFileSync(weekSummaryFile, JSON.stringify(weekSummaries, null, 2))
  }
}

await addSummaryToBookmarks().then(() => addMetaSummaryToBookmarks()).then(() => summarizeWeeks())
