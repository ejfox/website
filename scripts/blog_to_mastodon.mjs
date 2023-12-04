const { execSync } = require('child_process');
const Mastodon = require('mastodon-api');
const fs = require('fs');

// Initialize Mastodon API client
const M = new Mastodon({
  access_token: process.env.MASTODON_ACCESS_TOKEN,
  api_url: process.env.MASTODON_API_URL
});

// Function to get a list of new .md files in /content/blog
function getNewBlogPosts() {
  const output = execSync('git diff --name-only HEAD^ HEAD').toString();
  const changedFiles = output.split('\n');
  return changedFiles.filter(file => file.startsWith('content/blog/') && file.endsWith('.md'));
}

// Function to create a Mastodon post
function postToMastodon(content) {
  M.post('statuses', { status: content }, (err, data) => {
    if (err) console.error(err);
    else console.log('Posted to Mastodon:', data.url);
  });
}

// Main logic
async function main() {
  const newPosts = getNewBlogPosts();
  if (newPosts.length > 0) {
    let content = '';
    if (newPosts.length <= 2) {
      // Handle one or two new posts
      newPosts.forEach(file => {
        const title = extractTitleFromFile(file); // Implement this function to extract title
        const url = generateUrlFromFile(file); // Implement this function to generate URL
        content += `New post: ${title} ${url}\n`;
      });
    } else {
      // Handle more than two posts (aggregate)
      content = 'Check out our latest blog posts:\n';
      newPosts.forEach(file => {
        const title = extractTitleFromFile(file);
        const url = generateUrlFromFile(file);
        content += `- ${title} ${url}\n`;
      });
    }
    postToMastodon(content);
  }
}

main();
