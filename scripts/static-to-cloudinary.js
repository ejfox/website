'use strict'
require('dotenv').config()

const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const git = require('git-rev-sync')
const mime = require('mime-types')
const staticPath = 'static/'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function uploadToCloudinary(file) {
  const fileName = path.basename(file, path.extname(file))
  const options = {
    public_id: fileName,
  }

  cloudinary.uploader.upload(file, options, (err, res) => {
    if (err) {
      console.log(`Error uploading ${file}:`, err)
    } else {
      console.log(`Uploaded ${file} to Cloudinary:`, res.url)
    }
  })
}

function checkAndUploadFile(filePath) {
  let mimeType = mime.lookup(filePath)
  if (
    mimeType &&
    (mimeType.startsWith('image/') ||
      mimeType.startsWith('video/') ||
      mimeType.startsWith('audio/'))
  ) {
    uploadToCloudinary(filePath)
  }
}

function processFilesInStatic(commitFiles) {
  commitFiles.forEach((file) => {
    let fullPath = path.join(staticPath, file)
    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
      checkAndUploadFile(fullPath)
    }
  })
}

// If we only want to upload files that have changed in the last commit
// const commitHash = git.long()
// const commitFiles = git.diff(commitHash + '~1', commitHash).split('\n')
// processFilesInStatic(commitFiles)

// If we want to upload all acceptable files in the static folder
function processAllFilesInStatic(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dirPath}:`, err)
      return
    }
    files.forEach((file) => {
      let fullPath = path.join(dirPath, file)
      if (fs.existsSync(fullPath)) {
        let stat = fs.lstatSync(fullPath)
        if (stat.isFile()) {
          checkAndUploadFile(fullPath)
        } else if (stat.isDirectory()) {
          processAllFilesInStatic(fullPath)
        }
      }
    })
  })
}

// Call the function to process all acceptable files in the static folder
processAllFilesInStatic(staticPath)