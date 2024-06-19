import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import { createSSRApp, createApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import matter from 'gray-matter'
import pLimit from 'p-limit'

const limit = pLimit(2)

// const imageRegex = /!\[[^\]]*\]\(([^)]*)\)/g
const imageRegex = /\!\[[^\]]*\]\(([^)]+\.(?:png|jpg|jpeg|gif|webp|svg))/g

/**
 * Generate share images for blog posts.
 *
 * This script reads Markdown files from the specified source directory,
 * extracts frontmatter and content, and generates share images using Vue templates.
 * The generated images are saved in the specified destination directory.
 */

// Get the current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname)

// Define source and destination directories
const sourceDirectory = path.join(__dirname, '../content/blog/')
const destinationDirectory = path.join(__dirname, '../public/images/share/')

// Create destination directory if it doesn't exist
if (!existsSync(destinationDirectory)) {
  mkdirSync(destinationDirectory, { recursive: true })
  console.log('Destination directory created:', destinationDirectory)
}

// Process all files in the source directory by default
processFiles()

// Run the processFile function for a single file if the --file flag is provided
if (process.argv.includes('--file')) {
  const fileName = process.argv[process.argv.indexOf('--file') + 1]
  processFile(fileName)
}

/**
 * Process all Markdown files in the source directory, unless the --file flag is provided.
 */
function processFiles() {
  const files = readdirSync(sourceDirectory)
  files.forEach((file) => {
    if (file.endsWith('.md')) {
      if (
        !process.argv.includes('--file') ||
        file === process.argv[process.argv.indexOf('--file') + 1]
      ) {
        processFile(file)
      }
    }
  })
}

/**
 * Process a single Markdown file and generate a share image.
 * @param {string} fileName - The name of the Markdown file.
 */
async function processFile(fileName) {
  try {
    // Read the markdown file and extract frontmatter and content
    const sourceFilePath = path.join(sourceDirectory, fileName)
    const fileContents = readFileSync(sourceFilePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Create the destination file path
    const destinationFilePath = path.join(
      destinationDirectory,
      fileName.replace('.md', '.png'),
    )

    // Get the path to the Chrome executable
    const chromePath = getChromePath()

    // Generate the share image using Vue templates
    // await generateShareImage(data, content, destinationFilePath, chromePath)
    // use the limiter
    await limit(() =>
      generateShareImage(data, content, destinationFilePath, chromePath),
    )

    // console.log(`Share image generated for file: ${destinationFilePath}`)
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error)
  }
}

/**
 * Generate a share image using Vue templates.
 * @param {Object} frontmatter - The frontmatter data of the blog post.
 * @param {string} body - The content of the blog post.
 * @param {string} destinationFilePath - The path where the generated image will be saved.
 * @param {string} chromePath - The path to the Chrome executable.
 */
async function generateShareImage(
  frontmatter,
  body,
  destinationFilePath,
  chromePath,
) {
  // Extract the first image URL from the body
  const imageUrl = extractFirstImageUrl(body)

  if (imageUrl !== null && imageUrl !== undefined) {
    console.log(
      `First image extracted from post ${destinationFilePath}: ${imageUrl}`,
    )
  }

  // Create a Vue SSR app with the frontmatter, body, and image URL as data
  const app = createApp({
    head() {
      return {
        // add https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.js
        script: [
          {
            src: 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.js',
          },
        ],
        bodyAttrs: {
          class: 'h-screen bg-red-500',
        },
      }
    },
    data() {
      return {
        frontmatter,
        body,
        imageUrl,
      }
    },
    render() {
      return h(
        'div',
        {
          class: [
            'bg-red text-8xl text-white flex items-center justify-center',
          ],
          style: {
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
              16,
            )}`,
          },
        },
        [
          h('div', { class: { 'max-w-3xl': true, 'mx-auto': true } }, [
            h(
              'h1',
              {
                class: { 'f-headline': true, 'font-bold': true, 'mb-4': true },
              },
              this.frontmatter.title,
            ),
            h(
              'p',
              { class: { 'text-xl': true, 'mb-8': true } },
              this.frontmatter.dek,
            ),
            h('div', { class: { 'mb-8': true } }, [
              h(
                'p',
                { class: { 'text-gray-600': true } },
                `Read time: ${calculateReadTime(this.body)} min`,
              ),
              h(
                'p',
                { class: { 'text-gray-600': true } },
                `Total images: ${countImages(this.body)}`,
              ),
            ]),
            h('div', {
              class: { prose: true },
              domProps: { innerHTML: this.body },
            }),
          ]),
        ],
      )
    },
  })

  // Render the app to HTML
  let html = await renderToString(app)

  // Inject Tailwind CSS
  // const tailwindCss = `<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">`
  // html = html.replace('</head>', `${tailwindCss}</head>`)

  // inject as script
  // from   <script src="https://cdn.tailwindcss.com"></script>
  // const tailwindCss = `<script src="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.js"></script>`
  // const tailwindCss = `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script>`

  // html = html.replace('</head>', `${tailwindCss}</head>`)

  // lets use tachyons instead
  // https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.11.1/tachyons.min.css
  // const tachyonsCss = `<link href="https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.11.1/tachyons.min.css" rel="stylesheet">`
  // html = html.replace('</head>', `${tachyonsCss}</head>`)

  // Launch a headless browser instance
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true, // Set to false for debugging
  })

  // Create a new page in the browser
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 }) // Set viewport size for Twitter card

  // wait for the js to load an execute
  await page.goto('data:text/html;charset=UTF-8,' + html, {
    waitUntil: 'networkidle0',
  })

  // Set the HTML content of the page
  await page.setContent(html)

  // Save a screenshot of the page as a PNG image
  await page.screenshot({ path: destinationFilePath })

  // Close the browser
  await browser.close()
}

/**
 * Get the path to the Chrome executable based on the platform.
 * @returns {string} - The path to the Chrome executable.
 */
function getChromePath() {
  let browserPath

  switch (process.platform) {
    case 'win32':
      browserPath =
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      break
    case 'linux':
      browserPath = '/usr/bin/google-chrome'
      break
    case 'darwin':
      browserPath =
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      break
    default:
      throw new Error('Unsupported platform')
  }

  return browserPath
}

/**
 * Calculate the estimated read time of the content.
 * @param {string} content - The content of the blog post.
 * @returns {number} - The estimated read time in minutes.
 */
function calculateReadTime(content) {
  const wordsPerMinute = 200 // Assuming an average reading speed of 200 words per minute
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return readTime
}

/**
 * Count the number of images in the content.
 * @param {string} content - The content of the blog post.
 * @returns {number} - The number of images in the content.
 */
function countImages(content) {
  const matches = content.match(imageRegex)
  return matches ? matches.length : 0
}

/**
 * Extract the URL of the first image in the content.
 * @param {string} content - The content of the blog post.
 * @returns {string|null} - The URL of the first image, or null if no image is found.
 */
function extractFirstImageUrl(content) {
  const start = content.indexOf('](')
  if (start !== -1) {
    const end = content.indexOf(')', start + 2)
    if (end !== -1) {
      return content.substring(start + 2, end)
    }
  }
  return null
}
