import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import matter from 'gray-matter'
import pLimit from 'p-limit'

const limit = pLimit(2)
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

// we need to get the title from the first header
// which will be like \n## Title\n
// or \n# Title\n
function getTitle(contentString) {
  const h1TitleRegex = /\n#\s(.*)\n/
  const h2TitleRegex = /\n##\s(.*)\n/

  if (h1TitleRegex.test(contentString)) {
    return contentString.match(h1TitleRegex)[1]
  }

  if (h2TitleRegex.test(contentString)) {
    return contentString.match(h2TitleRegex)[1]
  }

  return ''
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

    // Generate the share image using Vue templates with the limiter
    await limit(() =>
      generateShareImage(data, content, destinationFilePath, chromePath),
    )
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

  // get the title from the first header
  const title = getTitle(body)

  if (imageUrl !== null && imageUrl !== undefined) {
    console.log(
      `First image extracted from post ${destinationFilePath}: ${imageUrl}`,
    )
  } else {
    console.log(`No image found in post ${destinationFilePath}`)
  }

  // if there IS an image, we will use it as the background
  // otherwise we will pick a random color
  const computedBgStyle = imageUrl
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
          16,
        )}`,
      }

  // Create a Vue SSR app with the frontmatter, body, and image URL as data
  const app = createSSRApp({
    data() {
      return {
        frontmatter,
        body,
        imageUrl,
        title,
      }
    },
    render() {
      return h(
        'div',
        {
          style: {
            ...computedBgStyle,
            height: '100vh',
            fontSize: '48px',
          },
        },
        [
          h(
            'div',
            {
              style: {
                // maxWidth: '960px',
                margin: '0 auto',
                position: 'fixed',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '48px',
              },
            },
            [
              // Background image element
              h('img', {
                src: imageUrl,
                style: {
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: '-1',
                  // filter: 'blur(24px)', // Apply blur to the background image
                  // make it grayscale AND blurred
                  filter: 'grayscale(100%) blur(24px)',
                },
              }),
              h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    borderRadius: '8px',
                    position: 'relative',
                    top: '0',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                },
                [
                  h('img', {
                    src: 'https://avatars.githubusercontent.com/u/530073?v=4',
                    style: {
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      marginRight: '16px',
                    },
                  }),
                  h(
                    'div',
                    {
                      style: {
                        fontSize: '48px',
                        color: 'white',
                      },
                    },
                    'EJ Fox',
                  ),
                  // add the title to the image
                  h(
                    'div',
                    {
                      style: {
                        fontSize: '42px',
                        marginLeft: '32px',
                        color: 'white',
                      },
                    },
                    title,
                  ),
                ],
              ),
              h(
                'p',
                {
                  style: {
                    fontSize: '52px',
                    marginBottom: '32px',
                    paddingLeft: '64px',
                    paddingRight: '64px',
                    borderRadius: '8px',
                    textShadow: '0 2px 1rem white',
                    color: 'black',
                    position: 'relative',
                  },
                },
                this.frontmatter.dek,
              ),
              h(
                'div',
                {
                  style: {
                    marginBottom: '32px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'relative',
                  },
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        padding: '16px',
                        borderRadius: '8px',
                        flex: '1',
                        marginRight: '8px',
                        position: 'fixed',
                        bottom: '0',
                        left: '0',
                      },
                    },
                    `Read time: ${calculateReadTime(this.body)} min`,
                  ),
                  countImages(this.body) > 1 &&
                    h(
                      'div',
                      {
                        style: {
                          padding: '16px',
                          borderRadius: '8px',
                          flex: '1',
                          marginLeft: '8px',
                          position: 'fixed',
                          bottom: '0',
                          right: '0',
                        },
                      },
                      `Total images: ${countImages(this.body)}`,
                    ),
                ],
              ),
              h('div', {
                style: { fontSize: '18px', position: 'relative' },
                domProps: { innerHTML: this.body },
              }),
            ],
          ),
        ],
      )
    },
  })

  // Render the app to HTML
  let html = await renderToString(app)

  // Launch a headless browser instance
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    // headless: false,
  })

  // Create a new page in the browser
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 }) // Set viewport size for Twitter card

  // set some CSS on the root
  // like body * { box-sizing: border-box; margin: 0; padding: 0; }
  // await page.addStyleTag({
  //   content: `
  //     body *, html {
  //       box-sizing: border-box;
  //       margin: 0;
  //       padding: 0;
  //       font-family: 'Inter', sans-serif;
  //     }
  //   `,
  // })

  // this doesn't work
  // we need to remove the default margin and padding from the body
  // we will add them inline to the body with javascript
  page.on('load', async () => {
    await page.evaluate(() => {
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.fontFamily = 'Inter, sans-serif'
    })
  })

  // add Inter google web font
  await page.addStyleTag({
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  })

  // Set the HTML content of the page
  await page.setContent(html)

  // Wait for the page to finish rendering
  // await page.evaluate(() => {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, 600)
  //   })
  // })

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
