import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import matter from 'gray-matter'
import pLimit from 'p-limit'
import { createCanvas } from 'canvas'
import * as d3 from 'd3'

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
  .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); }
  .content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  .header { display: flex; align-items: center; margin-bottom: 24px; }
  .avatar { width: 36px; height: 36px; border-radius: 18px; margin-right: 12px; }
  .author { font-size: 18px; font-weight: bold; }
  .title { font-size: 48px; font-weight: bold; margin-bottom: 16px; word-wrap: break-word; overflow-wrap: break-word; }
  .dek { font-size: 24px; margin-bottom: 16px; word-wrap: break-word; overflow-wrap: break-word; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; }
  .tags { display: flex; flex-wrap: wrap; max-width: 70%; }
  .tag { background-color: rgba(59, 130, 246, 0.6); padding: 4px 8px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; }
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
) {
  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.slice(0, 5)
    : []
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
                <span class="meta-item"><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${readTime} min (${wordCount} words)</span>
                ${
                  imageCount > 0
                    ? `<span class="meta-item"><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${imageCount}</span>`
                    : ''
                }
                <span class="meta-item"><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>${linkCount}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

function countLinks(content) {
  const linkRegex = /\[(?!!\[).*?\]\(.*?\)/g
  const matches = content.match(linkRegex)
  return matches ? matches.length : 0
}

function generateBackgroundArt({
  wordCount,
  readTime,
  imageCount,
  linkCount,
  text,
}) {
  // set sane defaults for the arguments
  wordCount = wordCount || 500
  readTime = readTime || 2
  imageCount = imageCount || 3
  linkCount = linkCount || 2

  const canvasWidth = 1200
  const canvasHeight = 630
  const padding = 24 // Padding from the edges
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')

  // Background color
  ctx.fillStyle = 'rgb(50, 50, 50)'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Process text to extract sentences, code blocks, images, and links
  const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g) // Simple sentence splitter
  const codeBlocks = text.match(/```[\s\S]*?```/g) || [] // Match code blocks
  const imageLinks = text.match(/<img.*?src="(.*?)".*?>/g) || []
  const regularLinks = text.match(/\[.*?\]\(.*?\)/g) || [] // Match regular links

  // Combine all elements into a single array, keeping their original order
  const combinedText = text
    .replace(/```[\s\S]*?```/g, '###CODE###')
    .replace(/!\[.*?\]\(.*?\)/g, '###IMAGE###')
    .replace(/\[.*?\]\(.*?\)/g, '###LINK###')

    // split the text into sentences
    .split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g)

  const elements = combinedText.map((fragment) => {
    if (fragment.includes('###CODE###')) {
      return { type: 'triangle', content: codeBlocks.shift() }
    } else if (fragment.includes('###IMAGE###')) {
      return { type: 'square', content: imageLinks.shift() }
    } else if (fragment.includes('###LINK###')) {
      return { type: 'stroked-circle', content: regularLinks.shift() }
    } else {
      return { type: 'circle', content: fragment }
    }
  })

  // Grid calculation
  const gridColumns = 32 // Number of elements per row (adjust as needed)
  const gridRows = Math.ceil(elements.length / gridColumns)
  const xSpacing = (canvasWidth - padding * 2) / gridColumns
  const ySpacing = (canvasHeight - padding * 2) / gridRows

  const minSize = 4
  const maxSize = 32
  const sizeScale = d3.scaleSqrt().domain([0, 500]).range([minSize, maxSize])

  elements.forEach((element, i) => {
    // Calculate grid position with padding
    const x = padding + (i % gridColumns) * xSpacing + xSpacing / 2
    const y = padding + Math.floor(i / gridColumns) * ySpacing + ySpacing / 2

    // Determine size based on content length (adjust the multiplier as needed)

    const contentLength = element.content.length
    // const size = Math.min(maxSize, Math.max(minSize, contentLength * 0.5))
    // we wanna use a d3 linear scale instead of a simple multiplication
    // const size = sizeScale(contentLength)
    // we need to make sure it does not exceed maxSize
    const size = Math.min(sizeScale(contentLength), maxSize)

    const sizeTriangle = 24
    const sizeSquare = 24
    // Draw shape based on type
    ctx.fillStyle = 'rgba(250,250,250, 0.8)'
    ctx.strokeStyle = 'rgba(250,250,250, 0.92)'

    switch (element.type) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(x, y - sizeTriangle)
        ctx.lineTo(x - sizeTriangle, y + sizeTriangle)
        ctx.lineTo(x + sizeTriangle, y + sizeTriangle)
        ctx.closePath()
        ctx.fill()
        break
      case 'square':
        // ctx.fillStyle = 'red' // Different color for images
        ctx.beginPath()
        ctx.rect(x - sizeSquare / 2, y - sizeSquare / 2, sizeSquare, sizeSquare)
        ctx.fill()
        break
      case 'stroked-circle':
        // ctx.strokeStyle = 'red' // Different color for links
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.stroke()
        break
    }
  })

  return canvas.toDataURL()
}

async function generateShareImage(frontmatter, body, destinationFilePath) {
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

  const htmlContent = generateHTMLContent(
    frontmatter,
    title,
    imageUrl,
    readTime,
    wordCount,
    imageCount,
    linkCount,
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
      generateShareImage(frontmatter, content, destinationFilePath),
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
