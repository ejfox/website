---
dek: "In which we use Cloudinary both as a host and CMS to show photos that we took to our friends"
inprogress: true
date: "2022-12-05T23:34:09.000Z"
modified: "2024-05-28T06:44:34.000Z"
tags: null
hidden: true
draft: true
---
## Creating a photoblog with Cloudinary and Nuxt

1. I upload files to Cloudinary through automator actions paired with bash scripts
2. I use the Cloudinary JS SDK to query the most recent photos, EXIF data, and add/remove tags
3. I use Nuxt to query the API and display the images on my Netlify-hosted website

## Automator Actions

### Automatically uploading screenshots

![The automator configuration that sits outside the following bash scripts: the first is a folder action that passes all green-tagged files/folders, and the other is a folder action that watches the screenshot folder for changes and runs the bash script when a new file is added](http://res.cloudinary.com/ejf/image/upload/v1715186716/Screenshot_2024-05-08_at_12.45.05_PM.png)

```bash
#!/bin/bash

# API keys for Cloudinary
export CLOUDINARY_URL=cloudinary://THIS_IS_SECRET@NAME

# Iterate over each passed argument
for file in "$@"
do
  # Check if the file exists
  if [ -f "$file" ]; then
    # Upload to Cloudinary and capture output
    upload_output=$(/opt/homebrew/bin/cld uploader upload "$file" use_filename=true unique_filename=false 2>&1)
    upload_exit_status=$?

    # Check if the upload was successful
    if [ $upload_exit_status -eq 0 ]; then
      # Attempt to extract the URL using the absolute path for jq
      url=$(echo "$upload_output" | /opt/homebrew/bin/jq -r '.url' 2>/dev/null)

      # Check if the URL is non-empty
      if [ -n "$url" ]; then
        echo "$url" | pbcopy
        # Display success notification with the URL
        osascript -e "display notification \"Uploaded $file to Cloudinary and URL copied to clipboard: $url\" with title \"Screenshot Upload\""
      else
        # Display notification for empty URL
        osascript -e "display notification \"Failed to extract URL from output\" with title \"Debug\""
      fi
    else
      # Display notification for upload failure
      osascript -e "display notification \"Failed to upload $file to Cloudinary. Error: $upload_output\" with title \"Screenshot Upload\""
    fi
  else
    # Display notification for file not found
    osascript -e "display notification \"File does not exist: $file\" with title \"Debug\""
  fi
done

```

## Upload all green-tagged files to Cloudinary through Folder Action

```bash
#!/bin/bash

# Ensure Cloudinary CLI is available
/opt/homebrew/bin/cld >/dev/null 2>&1 || { echo >&2 "Cloudinary CLI required but not installed. Aborting."; exit 1; }

# API keys for cloudinary
export CLOUDINARY_URL=cloudinary://THIS_IS_SECRET@NAME

# Iterate over all green tagged files 
for folder in "$@"
do
  # Find all green tagged files
  green_files=$(mdfind -onlyin "$folder" 'kMDItemUserTags == Green')

  # Count the number of green tagged files
  num_green_files=$(echo "$green_files" | wc -l)
  osascript -e "display notification \"$num_green_files green files found.\" with title \"Upload Green Media\""

  # Initialize counter for successful uploads
  successful_uploads=0

  # Read each file
  echo "$green_files" | while read -r file
  do
    # Check if file is not an empty string
    if [[ -n "$file" ]]
    then
      # Use Cloudinary CLI to upload file
      upload_output=$(/opt/homebrew/bin/cld uploader upload "$file" 2>&1)

      if [ $? -eq 0 ]
      then
        successful_uploads=$((successful_uploads + 1))
        # Notify every 25% for less than 10 files, otherwise only on errors
        if [ $num_green_files -le 10 ] || [ $((successful_uploads % (num_green_files / 4))) -eq 0 ]
        then
          osascript -e "display notification \"Uploaded $successful_uploads of $num_green_files files to Cloudinary.\" with title \"Upload Green Media\""
        fi
      else
        # Display the error message from Cloudinary in the notification
        osascript -e "display notification \"Failed to upload $file to Cloudinary. Error: $upload_output\" with title \"Upload Green Media\""
      fi
    else
      osascript -e "display notification \"Skipped an empty filename.\" with title \"Upload Green Media\""
    fi
  done
done

osascript -e "display notification \"Done uploading files.\" with title \"Upload Green Media\""
```


### Getting EXIF data from a resource
```js
// Fetch the resource details with EXIF data

const result = await cloudinary.api.resource(resourceId, { exif: true });
```

#### Getting last X photos uploaded
```js    
// Fetch the last 100 images uploaded
    const result = await cloudinary.search
      .expression("resource_type:image")
      .sort_by("uploaded_at", "desc")
      .with_field("tags")
      .max_results(100)
      .execute();
```
#### Nuxt API endpoint: `/server/api/cloudinary.ts`
```ts
import { defineEventHandler } from "h3";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

	export default defineEventHandler(async (event) => {
	// readBody is auto-imported by Nuxt from h3
	const body = await readBody(event);
	const numPhotos = +body.numPhotos
  try {
    const result = await cloudinary.search
      .expression("resource_type:image")
      .sort_by("uploaded_at", "desc")
      .max_results(100) // or numPhotos
      .execute();

    const photos = result.resources.map((resource) => ({
      href: resource.secure_url,
      public_id: resource.public_id,
      uploaded_at: resource.created_at,
    }));

    return photos;
  } catch (err) {
    console.error("Error fetching photos from Cloudinary: ", err);
    return { error: "An error occurred while fetching photos." };
  }
});
```


#### Fetching photos through Nuxt API
```js
const { data: photos } = await useFetch('/api/cloudinary', {
  method: 'POST',
  body: JSON.stringify({ numPhotos: numPhotos.value })
})
```

#### Adding `photo-blog` tag
```js
const result = await cloudinary.uploader.add_tag('photo-blog', [resourceId]);
```
