'use strict'
require('dotenv').config()

const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const ExifReader = require('exifreader')
const exifErrors = ExifReader.errors
const _ = require('lodash')
const exifDate = require('exif-date').parse

// HOW TO USE THIS SCRIPT
// 1 - Set up Cloudinary, which is used to upload
//     the photos in the folder
//
// 2 - Get a bunch of photos, ideally from Lightroom
//     and with captions, and export them so their
//     max filesize is 10mb each, which is the max
//     filesize on Cloudinary's free plan
//
// 3 - Run `node folder-to-blogpost.js ~/photo-folder-path/ post-slug`
//
//

// console.log('process', JSON.stringify(process.env))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const photoFolderObject = {
  files: [],
}

if (process.argv.length < 3) {
  console.log('No arguments')
  process.exit()
}

// Okay, we are gonna pass in a folder path via CLI args
//
//const filePath = process.argv[2]
const folderPath = process.argv[2]
const splitPath = folderPath.split('/')
console.log('split path: ' + JSON.stringify(splitPath))
const folder = splitPath[splitPath.length - 2]

if (!process.argv[3]) {
  console.log(`No name provided, using the folder name: ${folder}`)
  photoFolderObject.title = folder
  photoFolderObject.slug = folder
} else {
  photoFolderObject.title = process.argv[3]
  photoFolderObject.slug = process.argv[3]
}

// Gonna read through every file in that folder
fs.readdir(folderPath, function (err, files) {
  if (err) {
    console.error('Error', err)
    process.exit(1)
  }

  files.forEach(function (file, i) {
    const filePath = path.join(folderPath, file)
    const fileType = filePath.split('.')[1]
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      // ignore
    } else if (fileType === 'jpg' || fileType === 'jpeg') {
      processFile(filePath)
    } else {
      // Don't process non jpg files
    }
  })

  // Okay now we should have built an array of JSON objects
  // Each JSON object should have:
  // + image path
  // + EXIF data in an object

  // console.log(JSON.stringify(photoFolderObject))

  //
  // Now we want to actually take those .jpgs and upload them to cloudinary
  // And actually, also to S3 if we could, and maybe some smaller versions to Dropbox
  photoFolderObject.files = uploadAllPhotosToCloudinary(
    photoFolderObject,
    function (newPhotoFolderObj) {
      console.log(newPhotoFolderObj)
      // let blogPostHtml = makeBlogPost(newPhotoFolderObj);
      // Write that html to a .json file with a bunch of cool stuff in it

      const photoPostDestination = 'content/photos/'

      newPhotoFolderObj.date = newPhotoFolderObj.files[0].date

      fs.writeFileSync(
        photoPostDestination + folder + '.json',
        JSON.stringify(photoFolderObject, null, '\t'),
      )

      const blogPostMarkdown = makeBlogPost(newPhotoFolderObj)
      fs.writeFileSync(
        photoPostDestination + folder + '.md',
        blogPostMarkdown,
      )

      process.exit(0)
    },
  )
  // Then we get our new uploaded URLs and put them back in the image objects
  // So now we have a local path and an uploaded path and EXIF data
  //
  // Now we need to make a blogpost style .json that has all of that stuff laid out
  // It's probably gonna need to generate HTML now that I think about it
  //
  // Then put that in /content/photo/ as a .json file and we are golden

  // console.log(photoFolderObject)
})

function makeBlogPost(photoFolderObject) {
  let postMarkdown = ''
  _.each(photoFolderObject.files, (p) => {
    let photoMarkdown = ''
    photoMarkdown += `![Image](${p.cloudinaryUrl})\n`
    if (p.caption) {
      photoMarkdown += `${p.caption}\n`
    }
    postMarkdown += photoMarkdown
  })
  return postMarkdown
}

function uploadAllPhotosToCloudinary(photoFolderObject, cb) {
  let uploadPromises = photoFolderObject.files.map((file, i) => {
    console.log('Uploading ', file.path)
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, (err, res) => {
        if (err) {
          console.log('Error uploading: ', err)
          reject(err)
        } else {
          photoFolderObject.files[i].cloudinaryUrl = res.url
          resolve()
        }
      })
    })
  })

  Promise.all(uploadPromises)
    .then(() => {
      console.log(`Successfully uploaded ${photoFolderObject.files.length} files`)
      cb(photoFolderObject)
    })
    .catch(err => {
      console.log('Error uploading files: ', err)
    })

  return photoFolderObject.files
}

// Then run that file through the EXIF reader and extract EXIF data
function processFile(filePath) {
  // console.log('Processing file: ', filePath)
  const fileData = fs.readFileSync(filePath)

  const tags = ExifReader.load(fileData.buffer)

  delete tags['MakerNote']

  // Mostly we want the date/time of capture
  // And also the GPS latitude and longitude, if they exist
  // Oh and also the aperture and shutter speed
  //
  // Almost forgot the most important part: the caption
  let photoObject = {}

  const {
    Model,
    DateTime,
    FNumber,
    ISOSpeedRatings,
    Description,
    FocalLengthIn35mmFilm,
    ShutterSpeedValue,
    ExposureTime,
  } = tags

  // photoObject.tags = tags
  photoObject.tags = {
    Model,
    DateTime,
    FNumber,
    ISOSpeedRatings,
    Description,
    FocalLengthIn35mmFilm,
    ShutterSpeedValue,
    ExposureTime,
  }
  if (tags['Caption/Abstract']) {
    photoObject.caption = tags['Caption/Abstract'].description
  }

  photoObject.date = exifDate(tags['DateTime'].value[0])
  photoObject.tags.date = photoObject.date
  photoObject.path = filePath

  photoFolderObject.files.push(photoObject)
}
