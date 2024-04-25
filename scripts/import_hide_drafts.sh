#!/bin/bash

# Empty the drafts folder
rm -rf ./content/blog/draft/

# Sync the drafts
rsync -avz --delete --exclude='/drafts/' --include='*.md' --exclude='*' /Users/ejfox/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/ejfox/drafts/ ./content/blog/draft/

# Add the hidden property to the YAML frontmatter
find ./content/blog/ -type f -name "*.md" -exec sed -i '' '/^---$/ { N; /---\n/ a hidden: true' {} \;