'use strict'
require('dotenv').config()

const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const git = require('git-rev-sync')
const mime = require('mime-types')
const staticPath = './static/'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function uploadToCloudinary(file) {
  cloudinary.uploader.upload(file, (err, res) => {
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

const commitHash = git.long()
const commitFiles = git.diff(commitHash + '~1', commitHash).split('\n')

processFilesInStatic(commitFiles)