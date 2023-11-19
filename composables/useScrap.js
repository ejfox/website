import * as d3 from 'd3';
import hash from 'object-hash';

export default function useScrap() {
  const combinedData = ref([]);
  const scrapByWeek = ref(null);

  const { data: bookmarksData } = useFetch('/data/scrapbook/bookmarks.json', {
    server: false
  });

  const { data: mastodonData } = useFetch('/data/scrapbook/mastodon.json', {
    server: false
  });

  const { data: arenaData } = useFetch('/data/scrapbook/arena.json', {
    server: false
  });

  const { data: githubData } = useFetch('/data/scrapbook/github.json', {
    server: false
  });

  watchEffect(() => {
    if (bookmarksData.value && mastodonData.value && arenaData.value && githubData.value) {
      combinedData.value = [
        ...bookmarksData.value.map((bookmark) => ({
          id: bookmark.id,
          href: bookmark.href,
          description: bookmark.description,
          content: bookmark.extended,
          time: bookmark.time,
          type: 'pinboard',
          ...bookmark,
        })),
        ...mastodonData.value.map((status) => ({
          id: status.id,
          href: status.url,
          description: status.content.replace(/<[^>]*>?/gm, ''),
          time: status.created_at,
          type: 'mastodon',
          images: status.media_attachments.filter((attachment) => attachment.type === 'image').map((attachment) => attachment.preview_url),
          videos: status.media_attachments.filter((attachment) => attachment.type === 'video').map((attachment) => attachment.url),
        })),
        ...arenaData.value.map((block) => ({
          id: block.id,
          href: `https://www.are.na/block/${block.id}`,
          content: block.description,
          time: block.created_at,
          type: 'arena',
          images: block.image ? [block.image.display.url] : [],
        })),
        ...githubData.value.starredRepos.map((repo) => ({
          id: repo.id,
          content: repo.name,
          href: repo.html_url,
          description: repo.description,
          time: repo.updated_at,
          type: 'github-star',
          images: [],
        })),
        ...githubData.value.userRepos.map((repo) => ({
          id: repo.id,
          description: repo.name,
          href: repo.html_url,
          content: repo.description,
          time: repo.updated_at,
          type: 'user-github',
          images: [],
        })),
        ...githubData.value.userIssues.map((issue) => ({
          id: issue.id,
          description: issue.title,
          href: issue.html_url,
          content: `${issue.repository_url.split('/').slice(-2).join('/')}: ${issue.title} ${issue?.body ? issue.body : ''}`,
          time: issue.updated_at,
          type: 'user-github-issue',
          images: [],
        })),
      ];
      scrapByWeek.value = scrapbookDataToWeeks(combinedData.value);
    }
  });

  function scrapbookDataToWeeks(data) {
    if (!data.length) return null;
    const scrapByWeekMap = d3.group(data, (d) => {
      const date = new Date(d.time);
      const week = d3.timeWeek.floor(date);
      return week;
    });
    return scrapByWeekMap;
  }

  return {
    combinedData,
    scrapByWeek
  }
}