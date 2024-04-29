import fs from 'fs/promises';
import path from 'path';

const manifestPath = path.join(process.cwd(), 'public', 'data', 'scrapbook', 'manifest.json');

export async function readManifest() {
    try {
        // Attempt to read the manifest file if it exists
        const data = await fs.readFile(manifestPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file does not exist or an error occurs, return a default structure
        console.error('Failed to read manifest:', error);
        return {
            arena: { lastFetch: null, errors: [] },
            github: { lastFetch: null, errors: [] },
            mastodon: { lastFetch: null, errors: [] },
            pinboard: { lastFetch: null, errors: [] }
        };
    }
}

export async function updateManifest(service, { lastFetch, errors = [] }) {
  try {
      let data = {};
      try {
          // Read the current manifest data
          data = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
      } catch (readError) {
          // If reading fails, initialize data with empty structure for all services
          console.error('Error reading the manifest, initializing new data:', readError);
          data = {
              arena: { lastFetch: null, errors: [] },
              github: { lastFetch: null, errors: [] },
              mastodon: { lastFetch: null, errors: [] },
              pinboard: { lastFetch: null, errors: [] }
          };
      }

      // Update the specific service data
      if (!data[service]) {
          data[service] = { lastFetch: null, errors: [] };
      }
      data[service].lastFetch = lastFetch;
      if (errors.length) {
          data[service].errors.push(...errors);
      }

      // Write the updated data back to the manifest file
      await fs.writeFile(manifestPath, JSON.stringify(data, null, 2));
      console.log(`Manifest updated successfully for ${service}`);
  } catch (updateError) {
      console.error(`Failed to update manifest for ${service}:`, updateError);
      throw updateError; // Rethrow to allow higher level handling if necessary
  }
}