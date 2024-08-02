---
draft: true
dek: "In which we use Cloudinary both as a host and CMS to show photos that we took to our friends"
inprogress: true
date: "2022-12-05T23:34:09.000Z"
modified: "2024-07-18T18:30:19.000Z"
tags: null
hidden: true
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


### All media starts in `~/dump/`

I had a habit of creating new folders for a project, but then not really finishing that, and all of the media would grow cobwebs.

### Apple Shortcuts & Automator

The first step is getting my files organized on my local computer. This process usually starts with plugging in an SD card from my fujifilm camera, helmet cam, or field audio recorder.

#### Import SD card to `~/dump/`

First I use Applescript to show a dialog to ask myself whether to import or not.

```applescript
display dialog "New Volume connected- import to ~/dump?" buttons {"Yes", "No"} default button 2

if the button returned of the result is "No" then

error number -128 (* user cancelled *)

end if
```

If the user selects "Yes" we continue on to this shell script

```bash
#!/bin/bash

totalFiles=0
totalSize=0

handle_folder() {
    for aFile in "$1"/*; do
        if [ -d "$aFile" ]; then
            handle_folder "$aFile"
        elif [[ "$(echo $aFile | tr '[:upper:]' '[:lower:]')" =~ \.(jpe?g|mp[34]|raf|wav)$ ]]; then
            echo "Copying file $aFile"  # debugging line
            newFilePath=$HOME/dump/$(basename "$aFile")
            cp "$aFile" "$newFilePath"
                
            totalFiles=$((totalFiles + 1))
            totalSize=$((totalSize + $(du -k "$aFile" | cut -f1)))
        fi
    done
}

mkdir -p $HOME/dump

# List all volumes and handle each
for sdcard in /Volumes/*; do
    if [ "$sdcard" != "/Volumes/Macintosh HD" ] && [ -d "$sdcard" ]; then  # Exclude Macintosh HD, the main disk of macOS
        echo "Handling SD Card: $sdcard"  # debugging line
        handle_folder "$sdcard"
    fi
done

# Convert size to GB
totalSizeGB=$(echo "scale=2; $totalSize/1024/1024" | bc)

osascript -e "display notification \"Successfully copied $totalFiles files totaling $totalSizeGB GB to the dump folder\" with title \"File Operation Summary\""
```

#### Organize `~/dump/` into `~/media/`

Every once in a while, when the folder grows a little too big and unwieldy, I have a shell script as part of a shortcut (which means I can run it from an icon in my dock) that takes everything in `~/dump/` and organizes it into a folder structure by month, day, and media type.

Draft script to move from ~/dump/ into organized folders in ~/media/

```bash
#!/bin/bash

shopt -s globstar nullglob

# get creation date and format it to YYYY-MM-DD
getDate() {
    date -r "$1" +'%Y-%m-%d'
}

#iterate recursively over all files in the target directory.
for file in ~/dump/**/*.*; do
    # Ensure path is a file
    if [ -f "$file" ]; then
        #get creation date of file
        file_date=$(getDate "$file")

        #get mime-type of file
        mime_type=$(file --mime-type -b "$file" | awk -F'/' '{print $1}')
        
        #needs write permissions on /media/
        dir_name=~/media/"$file_date"/"$mime_type"

        #creating Target Directory
        mkdir -p "$dir_name"
        
        #move files
        mv "$file" "$dir_name"/

        echo "$file : moved to $dir_name" >> ~/dump/_logs.txt
    fi
done

#Emptying
rm -r ~/dump/*

#Logs
echo "Organizing Completed $(date +"%T")" >> ~/dump/_logs.txt
cat ~/dump/_logs.txt > ~/logs.txt
```

#### Upload to the web

The finder is an extremely powerful way to look at, organize, and tag files. Instead of recreating these things haphazardly in my own media library, I'd rather use one of the best ones in existence and augment it a bit to do my bidding.

I naturally found myself using a system of tagging photos with yellow for "maybe" and green for "publish". I'd import an SD card for a folder, scroll through it in finder, and slowly gather my picks. Then I'd select all the green files and drag them to another folder, or upload and publish them somewhere. I figured it would be best to try and automate what I was already doing.

So I created a very basic shortcut that uploads yellow/green files in the current directory to Cloudinary. This also allows you to right-click on a folder and upload all the green-tagged media to Cloudinary.

```bash
# Navigate to your media directory
cd ~/media/

# Find all yellow/green tagged files
for file in $(mdfind -onlyin . "kMDItemFSLabel == 2 || kMDItemFSLabel == 6")
do
  # Upload file to Cloudinary
  cloudinary upload $file --use_filename --unique_filename false
  
  # (Optional) To save the Cloudinary URL in the EXIF data, you would need an additional tool such as ExifTool.
done
```

### Get all Cloudinary photos for a week

Now that all of this content has been stored on Cloudinary, we want a way to get it back out. We are going to need to access the Cloudinary admin, and use our secret, so this has to be done on the server side instead of the client side.

Here's a rough mockup of what we are going to want to do:

```js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name: 'your_cloud_name',
   api_key: 'your_api_key',
   api_secret: 'your_api_secret'
});

async function getImagesByWeek(year, week) {
   // Use a library like date-fns to determine the start and end dates of the week
   const startDate = new Date(dateFns.startOfWeek(new Date(year, 0, 2 + (week - 1) * 7)));
   const endDate = new Date(dateFns.endOfWeek(new Date(year, 0, 2 + (week - 1) * 7)));

   let expression = `resource_type:image AND creation_date>=${startDate} AND creation_date<=${endDate}`;

   try {
       let result = await cloudinary.search
           .expression(expression)
           .sort_by('upload_date', 'desc')
           .execute();

       return result.resources;
   } 
   catch (err) {
        console.error(err);
        return [];
   }
}
```

I am creating my gallery as a [Nuxt app] (<https://github.com/ejfox/nuxt-template-2023>) so I think the best way to fetch my new photos is to create them as a [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server) so that when I go to `myapp/api/latest-photos` this script will run, fetch the latest photos, add them to the DB if necessary, and return the list so it can be displayed.
