import { fetchAllBlocks } from './dl_arena.mjs';
import { fetchStatuses, fetchUserId } from './dl_mastodon.mjs';
import { fetchBookmarks } from './dl_pinboard.mjs';
import { promises as fs } from 'fs';
import path from 'path';

const cleanupAndMergeData = async () => {
  const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook');
  await fs.mkdir(dirPath, { recursive: true }); // Ensure the directory exists

  // Fetch data from all sources
  const arenaBlocks = await fetchAllBlocks();
  const mastodonUserId = await fetchUserId();
  const mastodonStatuses = mastodonUserId ? await fetchStatuses(mastodonUserId) : [];
  const pinboardBookmarks = await fetchBookmarks();

  // Save each dataset to its own file
  await fs.writeFile(path.join(dirPath, 'arena.json'), JSON.stringify(arenaBlocks, null, 2));
  await fs.writeFile(path.join(dirPath, 'mastodon.json'), JSON.stringify(mastodonStatuses, null, 2));
  await fs.writeFile(path.join(dirPath, 'pinboard.json'), JSON.stringify(pinboardBookmarks, null, 2));

  // Optional: Perform any cleanup or additional processing here
  // For example, deduplicating entries across datasets, if applicable

  console.log('Data from Arena, Mastodon, and Pinboard has been fetched and saved.');
};

cleanupAndMergeData().catch(console.error);
