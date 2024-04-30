import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import frontMatter from 'front-matter';

const sourceDirectory = '/Users/ejfox/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/ejfox/drafts/';
const destinationDirectory = './content/blog/';

const processDrafts = process.argv.includes('--drafts');

if (!processDrafts) {
    console.log('Please specify --drafts to indicate which files to process.');
    process.exit(1);
}

const files = readdirSync(sourceDirectory);

/**
 * Process each markdown file in the source directory, updating frontmatter to include 'hidden: true'.
 */
files.forEach(file => {
    if (file.endsWith('.md')) {
        const sourceFilePath = path.join(sourceDirectory, file);
        const destinationFilePath = path.join(destinationDirectory, 'draft', file);

        // if the path does not exist, make the folder
        if (!existsSync(path.join(destinationDirectory, 'drafts'))) {
            mkdirSync(path.join(destinationDirectory, 'drafts'));
            console.log('Draft folder created.');
        }

        const data = readFileSync(sourceFilePath, 'utf8');
        const { attributes, body } = frontMatter(data);

        if (attributes.hidden) {
            console.log(`File already contains 'hidden: true', skipping: ${destinationFilePath}`);
            return;
        }

        // Update frontmatter to include 'hidden: true'
        const updatedContent = addFrontmatter(body, attributes);
        writeFileSync(destinationFilePath, updatedContent, 'utf8');
        console.log(`Frontmatter updated for file: ${destinationFilePath}`);
    }
});

function addFrontmatter(body, attributes) {
    const updatedFrontmatter = { 
        ...attributes, 
        hidden: true,
        draft: true };
    const updatedContent = `---\n${objToFrontmatter(updatedFrontmatter)}---\n${body}`;
    return updatedContent;
}

function objToFrontmatter(attributes) {
    let frontmatterString = '';
    for (const key in attributes) {
        frontmatterString += `${key}: ${JSON.stringify(attributes[key])}\n`;
    }
    return frontmatterString;
}