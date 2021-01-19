# ejfox

## Personal website & blog for EJ Fox

### <https://ejfox.com>

[![Netlify Status](https://api.netlify.com/api/v1/badges/ff495492-f06f-44e1-8986-fe4b47981237/deploy-status)](https://app.netlify.com/sites/ejfoxcom/deploys)

Currently powered by:

- Netlify for web hosting
- Cloudinary for image hosting
- Vue/Nuxt for the site
- Tachyons for layout and styling
- Markdown for text formatting

## Backups

<http://ejfox.keybase.pub>

## To do

- Add status tags for posts ("notes", "draft", "in progress", "finished" )
- Add way for people to submit anonymous feedback / tips
- Add mechanism for automatically archiving linked URLs [a la Gwern](https://www.gwern.net/Archiving-URLs)

### Books

To get book library for goodreads to the books page:

- Go to [this page](https://www.goodreads.com/review/import) and click "Export Library"
- Wait for library in email
- Copy the goodreads CSV to the data folder
- Run `npx csvtojson static/data/goodreads_library_export.csv > static/data/goodreads_library_export.json` to convert the CSV into json

To scrape [highlights](https://www.goodreads.com/notes/9273959-ej-fox):

- `scrape-highlights https://www.goodreads.com/notes/9273959-ej-fox > static/data/book_highlights.json`

### Markdown Blog Posts

```bash
# To convert all JSON blog posts to markdown:
processmd content/blog/posts/*.json --outputDir content/blog/md/ --convertMode source
# or
npm run blog:to-md

# To copy over all PUBLISHED markdown files in Dropbox writing folder to `md` folder in `~/content/blog/`
cp ~/Dropbox/Writing/PUBLISHED/*.md content/blog/md/
# or
npm run dropbox-import

# To convert all markdown posts to JSON files and copy them to the content directory
processmd content/blog/md/* --outputDir content/blog/posts/
# or
npm run blog:md-to-json
```

## How to make a new photo post

Make sure the following environment variables are set in your .env file:

- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

As of Jan 2021, all 3 of these values can be found by logging into
https://cloudinary.com

If starting in Lightroom, you want to go through each photo and make sure it
has a caption. You can add the caption in the Metadata section on the
right side of the screen when in Library mode. These captions will automatically
be displayed when processed with the script. This is basically the only way to
get text into photo blog posts. 

Once you have gathered all of the photos you would like to publish, select
them all and export them to a folder. Take note of the path of this folder
with a tool like `pwd`, as we will need to pass it to our script.

In the root of this website, you want to run
```bash
node folder-to-blogpost.js ~/PATH/TO/IMAGES/
```

This will take every photo and process it by uploading the image to
Cloudinary, and then writing the public uploaded Clouindary URL as well
as the relevant EXIF data (most importantly captions) and writes it to a 
JSON file. That JSON file will be moved to `content/photos/` so it can be
displayed as a post on the photoblog, which checks for all .json files
located in that directory.

## Build Setup

```bash
# install dependencies
npm install # Or yarn install

# serve with hot reload at localhost:3000
npm run dev

# build for production and launch server
npm run build
npm start

# generate static project
npm run generate

# generate static project and publish to keybase
npm run keybase

# pull in markdown from dropbox and generate static project and publish everywhere
npm run publish

# convert goodreads csv into json
npx csvtojson static/data/goodreads_library_export.csv > static/data/goodreads_library_export.json

# convert projects csv into json
npx csvtojson static/data/projects.csv > static/data/projects.json
```
