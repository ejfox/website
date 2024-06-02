import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from 'fs'
import path from 'path'
import frontMatter from 'front-matter'

const sourceDirectory =
  '/Users/ejfox/Library/Mobile Documents/iCloud~md~obsidian/Documents/ejfox/drafts/'
const destinationDirectory = '/Users/ejfox/code/website/content/blog/drafts/'

const processDrafts = process.argv.includes('--drafts')

if (!processDrafts) {
  console.log('Please specify --drafts to indicate which files to process.')
  process.exit(1)
}

try {
  const files = readdirSync(sourceDirectory)

  if (!existsSync(destinationDirectory)) {
    mkdirSync(destinationDirectory, { recursive: true })
    console.log('Draft folder created.')
  }

  /**
   * Process each markdown file in the source directory, updating frontmatter to include 'hidden: true'.
   */
  files.forEach((file) => {
    if (file.endsWith('.md')) {
      const sourceFilePath = path.join(sourceDirectory, file)
      const destinationFilePath = path.join(destinationDirectory, file)

      try {
        const data = readFileSync(sourceFilePath, 'utf8')
        const { attributes, body } = frontMatter(data)

        if (attributes.hidden) {
          console.log(
            `File already contains 'hidden: true', skipping: ${destinationFilePath}`,
          )
          return
        }

        // Update frontmatter to include 'hidden: true'
        const updatedContent = addFrontmatter(body, attributes)
        writeFileSync(destinationFilePath, updatedContent, 'utf8')
        console.log(`Frontmatter updated for file: ${destinationFilePath}`)
      } catch (error) {
        console.error(`Error processing file ${sourceFilePath}:`, error)
      }
    }
  })
} catch (error) {
  console.error('Error reading source directory:', error)
}

function addFrontmatter(body, attributes) {
  const updatedFrontmatter = {
    ...attributes,
    hidden: true,
    draft: true,
  }
  const updatedContent = `---\n${objToFrontmatter(
    updatedFrontmatter,
  )}---\n${body}`
  return updatedContent
}

function objToFrontmatter(attributes) {
  let frontmatterString = ''
  for (const key in attributes) {
    frontmatterString += `${key}: ${JSON.stringify(attributes[key])}\n`
  }
  return frontmatterString
}
