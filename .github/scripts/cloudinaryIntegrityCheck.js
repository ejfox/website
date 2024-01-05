const fs = require('fs');
const { unified } = require('unified');
const parse = require('remark-parse');
const visit = require('unist-util-visit');
const axios = require('axios');
const glob = require('glob');

const isCloudinaryUrl = url => url.includes('cloudinary.com');

const verifyLiveUrl = async url => {
  try {
    const response = await axios.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const processMarkdownForCloudinaryLinks = async (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const processor = unified().use(parse);

  const ast = processor.parse(content);

  visit(ast, 'image', async (node) => {
    const url = node.url;
    if (isCloudinaryUrl(url)) {
      const isLive = await verifyLiveUrl(url);
      if (!isLive) {
        console.error(`Broken Cloudinary link in ${filePath}: ${url}`);
        process.exit(1);
      }
    } else {
      console.warn(`Non-Cloudinary link detected in ${filePath}: ${url}`);
    }
  });
};

glob("**/*.md", async (err, files) => {
  if (err) {
    console.error("Error finding markdown files: ", err);
    process.exit(1);
  }

  for (const file of files) {
    await processMarkdownForCloudinaryLinks(file);
  }
});
