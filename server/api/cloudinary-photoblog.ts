// server/api/latest-photos.ts
import { defineEventHandler } from 'h3'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with your Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// console.log('Cloudinary configuration setup.')

export default defineEventHandler(async (event) => {
  console.log('Fetching the latest photos from Cloudinary...')
  // read the body from the event
  const body = await readBody(event)

  const numPhotos = +body.numPhotos || 420

  try {
    console.log(
      `Fetching the last ${numPhotos} photos with the 'photo-blog' tag from Cloudinary...`,
    )

    // Fetch the last numPhotos images with the 'photo-blog' tag
    const result = await cloudinary.search
      .expression('resource_type:image AND tags:photo-blog')
      .sort_by('uploaded_at', 'desc')
      .with_field('tags')
      .execute()

    console.log('result', result)

    // Log results
    console.log(
      "Number of images with the 'photo-blog' tag: ",
      result.resources.length,
    )

    // Create a simplified collection of information about the photos to send back to the client
    const photos = result.resources.map((resource) => ({
      href: resource.secure_url,
      public_id: resource.public_id,
      uploaded_at: resource.created_at,
      // potentially add other relevant fields here
      ...resource,
    }))

    return photos
  } catch (err) {
    console.error('Error fetching photos from Cloudinary: ', err)
    // Return an HTTP error code here for better error handling
    return { error: 'An error occurred while fetching photos.' }
  }
})
