'use strict';

const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const ExifReader = require('exifreader')
const exifErrors = ExifReader.errors
const _ = require('lodash')
const exifDate = require('exif-date').parse

// TODO: Get this from .env
cloudinary.config({
  cloud_name: 'ejf',
  api_key: '772121974764543',
  api_secret: 'OaPOrn409H_wXnhS3eR6Y8B-4WY'
})

const photoFolderObject = {
  files: []
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
const folder = splitPath[splitPath.length - 2]

if (!process.argv[3]) {
  photoFolderObject.title = folder
} else {
  photoFolderObject.title = process.argv[3]
}

photoFolderObject.slug = folder

// Gonna read through every file in that folder
fs.readdir(folderPath, function(err, files) {
  if (err) {
    console.error('Error', err)
    process.exit(1)
  }

  files.forEach( function(file, i) {
    const filePath = path.join(folderPath, file)
    const fileType = filePath.split('.')[1] 
    /*fs.statSync(filePath, function(error, stat) {
     
    })*/

     const stat = fs.statSync(filePath)
     if (stat && stat.isDirectory()) {
        // ignore
      } else if (fileType === 'jpg' || fileType === 'jpeg' ) {
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
  photoFolderObject.files = uploadAllPhotosToCloudinary(photoFolderObject, function(newPhotoFolderObj){
    console.log(newPhotoFolderObj)
    let blogPostHtml = makeBlogPost(newPhotoFolderObj)
    // Write that html to a .json file with a bunch of cool stuff in it

    const photoPostDestination = 'content/photos/'

    newPhotoFolderObj.date = newPhotoFolderObj.files[0].date

    fs.writeFileSync(photoPostDestination + folder + '.json', JSON.stringify(newPhotoFolderObj, null, '\t'))

    process.exit(0)
  })
  // Then we get our new uploaded URLs and put them back in the image objects
  // So now we have a local path and an uploaded path and EXIF data
  //
  // Now we need to make a blogpost style .json that has all of that stuff laid out
  // It's probably gonna need to generate HTML now that I think about it
  //
  // Then put that in /content/photo/ as a .json file and we are golden

  // console.log(photoFolderObject)

})

function makeBlogPost (photoFolderObject) {
  let postHtml = ''
  _.each(photoFolderObject.files, (p) => {
    let photoHtml = ''
    photoHtml += `

      <figure>
        <img src="${p.cloudinaryUrl}" />      
    `
    if(p.caption) {
      photoHtml += `
        <figcaption>
          ${p.caption}
        </figcaption>
      `
    }

    photoHtml += '</figure>'
    postHtml += photoHtml
  })

  return postHtml
}

function uploadAllPhotosToCloudinary(photoFolderObject, cb) {
  let filesUploaded = 0
  let filesWithUrls = photoFolderObject.files
  filesWithUrls.forEach(function(file, i){ 
    console.log('Uploading ', file.path)
    // console.log('')    
    cloudinary.uploader.upload(file.path, (err, res) => {
      photoFolderObject.files[i].cloudinaryUrl = res.url     
      if(err) console.log('Error uploading: ', err)
      // console.log('Files uploaded: ', filesUploaded)
      // console.log('Length: ', filesWithUrls.length)
      if (filesUploaded === filesWithUrls.length - 1) {
        console.log(`Successfully uploaded ${filesUploaded} files`)
        cb(photoFolderObject)
      }
      filesUploaded++
    })
    
  })

  return filesWithUrls
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
    ExposureTime
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
    ExposureTime
  }
  photoObject.caption = tags['Caption/Abstract'].description
  photoObject.date = exifDate(tags['DateTime'].value[0])
  photoObject.tags.date = photoObject.date
  photoObject.path = filePath

  photoFolderObject.files.push(photoObject)
 
}