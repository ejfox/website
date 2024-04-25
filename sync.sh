# This script runs all of the necessary sub-scripts to update the blog from the local filesystem

# First import drafts
# node ./scripts/import_hide_drafts.mjs --drafts
npm run content:blog:drafts

# Then import the non-draft blog content
npm run content:blog

# Then re-download the scrapbook
npm run content:scrapbook