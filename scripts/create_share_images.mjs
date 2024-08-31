import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import matter from 'gray-matter'
import pLimit from 'p-limit'
import { createCanvas } from 'canvas'
import * as d3 from 'd3'
// import date-fns
import { format } from 'date-fns'

const limit = pLimit(2)
const imageRegex = /!\[(?:.*?)\]\((.*?\.(?:png|jpg|jpeg|gif|webp|svg))\)/

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const sourceDirectory = path.join(__dirname, '../content/blog/')
const destinationDirectory = path.join(__dirname, '../public/images/share/')

if (!existsSync(destinationDirectory)) {
  mkdirSync(destinationDirectory, { recursive: true })
  console.log('Destination directory created:', destinationDirectory)
}

const customCSS = `
  body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
  .container { width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: space-between; padding: 92px; box-sizing: border-box; background-size: cover; background-position: center; color: white; position: relative; }
  .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); }
  .content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  .header { display: flex; align-items: center; margin-bottom: 24px; }
  .avatar { width: 36px; height: 36px; border-radius: 18px; margin-right: 12px; }
  .author { font-size: 18px; font-weight: bold; }
  .title { font-size: 52px; font-weight: bold; margin-bottom: 18px; word-wrap: break-word; overflow-wrap: break-word; }
  .dek { font-size: 28px; margin-bottom: 16px; word-wrap: break-word; overflow-wrap: break-word; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .footer { display: flex; justify-content: space-between; align-items: flex-start; }
  .tags { display: flex; flex-wrap: wrap; max-width: 70%; }
  .tag { background-color: rgba(59, 130, 246, 0.5); padding: 4px 8px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; }
  .meta { display: flex; }
  .meta-item { display: flex; align-items: center; margin-left: 16px; }
  .icon { width: 20px; height: 20px; margin-right: 8px; }
`

function generateHTMLContent(
  frontmatter,
  title,
  imageUrl,
  readTime,
  wordCount,
  imageCount,
  linkCount,
  href,
) {
  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.slice(0, 5)
    : []

  let publishDate = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(frontmatter.modified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  // if publishDate is undefined, make it an empty string
  publishDate = publishDate ? publishDate : ''
  return `
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <div class="container" style="background-image: url('${
          imageUrl || ''
        }');">
          <div class="overlay"></div>
          <div class="content">
            <div>
              <div class="header">
                <img src="https://avatars.githubusercontent.com/u/530073?v=4" alt="EJ Fox" class="avatar">
                <span class="author">EJ Fox</span>
              </div>
              <h1 class="title">${title}</h1>
              <p class="dek">${frontmatter.dek || ''}</p>
            </div>
            <div class="footer">
              <div class="tags">
                ${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
              </div>
              <div class="meta">

          
                <span class="meta-item" style="opacity: 0.5">

                  ${href}
                  </span>

                <span class="meta-item"><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${readTime} min (${formatNumber(
    wordCount,
  )} words)</span>
                ${
                  imageCount > 0
                    ? `<span class="meta-item"><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${formatNumber(
                        imageCount,
                      )}</span>`
                    : ''
                }
                <span class="meta-item"><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>${formatNumber(
                  linkCount,
                )}</span>

                <span class="meta-item">${publishDate}</span>
                

              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

function formatDate(date) {
  if (!date) {
    return ''
  }
  // use date-fns
  format(date, 'MMMM dd, yyyy')
}

// use d3 to format numbers
function formatNumber(number) {
  const formatter = d3.format(',')
  return formatter(number)
}

function countLinks(content) {
  const linkRegex = /\[(?!!\[).*?\]\(.*?\)/g
  const matches = content.match(linkRegex)
  return matches ? matches.length : 0
}

// function generateBackgroundArt({
//   wordCount,
//   readTime,
//   imageCount,
//   linkCount,
//   text,
// }) {
//   // set sane defaults for the arguments
//   wordCount = wordCount || 500
//   readTime = readTime || 2
//   imageCount = imageCount || 3
//   linkCount = linkCount || 2

//   const canvasWidth = 1200
//   const canvasHeight = 630
//   const padding = 24 // Padding from the edges
//   const canvas = createCanvas(canvasWidth, canvasHeight)
//   const ctx = canvas.getContext('2d')

//   // Background color
//   ctx.fillStyle = 'rgb(50, 50, 50)'
//   ctx.fillRect(0, 0, canvasWidth, canvasHeight)

//   // Process text to extract sentences, code blocks, images, and links
//   const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g) // Simple sentence splitter
//   const codeBlocks = text.match(/```[\s\S]*?```/g) || [] // Match code blocks
//   const imageLinks = text.match(/<img.*?src="(.*?)".*?>/g) || []
//   const regularLinks = text.match(/\[.*?\]\(.*?\)/g) || [] // Match regular links

//   // Combine all elements into a single array, keeping their original order
//   const combinedText = text
//     .replace(/```[\s\S]*?```/g, '###CODE###')
//     .replace(/!\[.*?\]\(.*?\)/g, '###IMAGE###')
//     .replace(/\[.*?\]\(.*?\)/g, '###LINK###')

//     // split the text into sentences
//     .split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g)

//   const elements = combinedText.map((fragment) => {
//     if (fragment.includes('###CODE###')) {
//       return { type: 'triangle', content: codeBlocks.shift() }
//     } else if (fragment.includes('###IMAGE###')) {
//       return { type: 'square', content: imageLinks.shift() }
//     } else if (fragment.includes('###LINK###')) {
//       return { type: 'stroked-circle', content: regularLinks.shift() }
//     } else {
//       return { type: 'circle', content: fragment }
//     }
//   })

//   // Grid calculation
//   const gridColumns = 32 // Number of elements per row (adjust as needed)
//   const gridRows = Math.ceil(elements.length / gridColumns)
//   const xSpacing = (canvasWidth - padding * 2) / gridColumns
//   const ySpacing = (canvasHeight - padding * 2) / gridRows

//   const minSize = 4
//   const maxSize = 32
//   const sizeScale = d3.scaleSqrt().domain([0, 500]).range([minSize, maxSize])

//   elements.forEach((element, i) => {
//     // Calculate grid position with padding
//     const x = padding + (i % gridColumns) * xSpacing + xSpacing / 2
//     const y = padding + Math.floor(i / gridColumns) * ySpacing + ySpacing / 2

//     // Determine size based on content length (adjust the multiplier as needed)

//     const contentLength = element.content.length
//     // const size = Math.min(maxSize, Math.max(minSize, contentLength * 0.5))
//     // we wanna use a d3 linear scale instead of a simple multiplication
//     // const size = sizeScale(contentLength)
//     // we need to make sure it does not exceed maxSize
//     const size = Math.min(sizeScale(contentLength), maxSize)

//     const sizeTriangle = 24
//     const sizeSquare = 24
//     // Draw shape based on type
//     ctx.fillStyle = 'rgba(250,250,250, 0.8)'
//     ctx.strokeStyle = 'rgba(250,250,250, 0.92)'

//     switch (element.type) {
//       case 'circle':
//         ctx.beginPath()
//         ctx.arc(x, y, size, 0, Math.PI * 2)
//         ctx.fill()
//         break
//       case 'triangle':
//         ctx.beginPath()
//         ctx.moveTo(x, y - sizeTriangle)
//         ctx.lineTo(x - sizeTriangle, y + sizeTriangle)
//         ctx.lineTo(x + sizeTriangle, y + sizeTriangle)
//         ctx.closePath()
//         ctx.fill()
//         break
//       case 'square':
//         // ctx.fillStyle = 'red' // Different color for images
//         ctx.beginPath()
//         ctx.rect(x - sizeSquare / 2, y - sizeSquare / 2, sizeSquare, sizeSquare)
//         ctx.fill()
//         break
//       case 'stroked-circle':
//         // ctx.strokeStyle = 'red' // Different color for links
//         ctx.beginPath()
//         ctx.arc(x, y, size, 0, Math.PI * 2)
//         ctx.stroke()
//         break
//     }
//   })

//   return canvas.toDataURL()
// }

function generateBackgroundArt({
  wordCount,
  readTime,
  imageCount,
  linkCount,
  text,
}) {
  const canvasWidth = 1200
  const canvasHeight = 630
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')

  // Set background
  ctx.fillStyle = 'rgb(30, 30, 30)'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  const elements = processText(text)
  const totalLength = elements.reduce((sum, el) => sum + el.content.length, 0)
  const baselineY = canvasHeight / 2
  const maxAmplitude = canvasHeight //* 0.75

  let x = 0
  ctx.beginPath()
  ctx.moveTo(0, baselineY)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.lineWidth = 1.5

  const drawSinWave = (startX, width, amplitude, frequency) => {
    const points = 100
    for (let i = 0; i <= points; i++) {
      const x = startX + (i / points) * width
      const y =
        baselineY + Math.sin((i / points) * Math.PI * 2 * frequency) * amplitude
      ctx.lineTo(x, y)
    }
  }

  const drawTriWave = (startX, width, amplitude, frequency) => {
    const points = 100
    for (let i = 0; i <= points; i++) {
      const x = startX + (i / points) * width
      const y =
        baselineY + Math.sin((i / points) * Math.PI * 2 * frequency) * amplitude
      ctx.lineTo(x, y)
    }
  }

  const drawCodeSquiggle = (startX, width, amplitude) => {
    const points = 200
    for (let i = 0; i <= points; i++) {
      const x = startX + (i / points) * width
      const y = baselineY + Math.sin((i / points) * Math.PI * 20) * amplitude
      ctx.lineTo(x, y)
    }
  }

  elements.forEach((element) => {
    const elementWidth = (element.content.length / totalLength) * canvasWidth

    switch (element.type) {
      case 'header':
        // drawSinWave(x, elementWidth, maxAmplitude * 0.4, 1)
        // just draw a straight line for headers
        ctx.lineTo(x + elementWidth, baselineY)
        break
      case 'paragraph':
        drawSinWave(x, elementWidth, maxAmplitude * 0.15, 2)
        break
      case 'code':
        drawCodeSquiggle(x, elementWidth, maxAmplitude * 0.1)
        break
      case 'image':
        drawTriWave(x, elementWidth, maxAmplitude * 0.01, 0.5)
        break
      default:
        // For images, links, and any other types, just continue the last wave
        ctx.lineTo(x + elementWidth, ctx.lastPathY || baselineY)
        break
    }

    x += elementWidth
  })

  ctx.stroke()

  // Add start and end markers
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(0, baselineY, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(canvasWidth, baselineY, 5, 0, Math.PI * 2)
  ctx.fill()

  return canvas.toDataURL()
}

function processText(text) {
  const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g)
  const codeBlocks = text.match(/```[\s\S]*?```/g) || []
  const imageLinks = text.match(/!\[(?:.*?)\]\((.*?)\)/g) || []
  const regularLinks = text.match(/\[(?!!\[).*?\]\(.*?\)/g) || []

  const elements = []

  sentences.forEach((sentence) => {
    if (sentence.startsWith('#')) {
      elements.push({ type: 'header', content: sentence })
    } else {
      elements.push({ type: 'paragraph', content: sentence })
    }
  })

  codeBlocks.forEach((block) => {
    elements.push({ type: 'code', content: block })
  })

  imageLinks.forEach((link) => {
    elements.push({ type: 'image', content: link })
  })

  regularLinks.forEach((link) => {
    elements.push({ type: 'link', content: link })
  })

  return elements.sort(
    (a, b) => text.indexOf(a.content) - text.indexOf(b.content),
  )
}

async function generateShareImage(
  frontmatter,
  body,
  destinationFilePath,
  fileName,
) {
  const title = getTitle(body)
  const wordCount = body.split(/\s+/).length
  const readTime = calculateReadTime(body)
  const imageCount = countImages(body)
  const linkCount = countLinks(body)
  const imageUrl =
    extractFirstImageUrl(body) ||
    generateBackgroundArt({
      wordCount,
      readTime,
      imageCount,
      linkCount,
      text: body,
    })

  const nameSlug = fileName.replace('.md', '')

  // the href is made from the filename slug
  // we don't get it in the frontmatter slug
  const href = `https://ejfox.com/blog/${nameSlug}`

  const htmlContent = generateHTMLContent(
    frontmatter,
    title,
    imageUrl,
    readTime,
    wordCount,
    imageCount,
    linkCount,
    href,
  )

  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 630 })

    await page.setContent(htmlContent)
    await page.evaluate((css) => {
      const style = document.createElement('style')
      style.textContent = css
      document.head.appendChild(style)
    }, customCSS)

    await page.waitForSelector('.container')

    await page.screenshot({ path: destinationFilePath, type: 'png' })
  } finally {
    await browser.close()
  }
}

function getTitle(contentString) {
  const titleRegex = /\n#+\s(.*)\n/
  const match = contentString.match(titleRegex)
  return match ? match[1] : 'Untitled'
}

function calculateReadTime(content) {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function countImages(content) {
  const matches = content.match(imageRegex)
  return matches ? matches.length : 0
}

function extractFirstImageUrl(content) {
  const match = content.match(imageRegex)
  return match ? match[1] : null
}

async function processFile(fileName) {
  try {
    const sourceFilePath = path.join(sourceDirectory, fileName)
    const fileContents = readFileSync(sourceFilePath, 'utf8')
    const { data: frontmatter, content } = matter(fileContents)

    const destinationFilePath = path.join(
      destinationDirectory,
      fileName.replace('.md', '.png'),
    )

    await limit(() =>
      generateShareImage(frontmatter, content, destinationFilePath, fileName),
    )
    console.log(`Successfully processed ${fileName}`)
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error)
  }
}

async function processFiles() {
  const files = readdirSync(sourceDirectory)
  for (const file of files) {
    if (file.endsWith('.md')) {
      if (
        !process.argv.includes('--file') ||
        file === process.argv[process.argv.indexOf('--file') + 1]
      ) {
        await processFile(file)
      }
    }
  }
}

// Main execution
if (process.argv.includes('--file')) {
  const fileName = process.argv[process.argv.indexOf('--file') + 1]
  processFile(fileName)
} else {
  processFiles()
}
