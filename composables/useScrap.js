import * as d3 from 'd3'
import { scrapToUUID } from '~/helpers'

export default function useScrap() {
  const combinedData = ref([])
  const scrapByWeek = ref(null)

  const { data: bookmarksData } = useFetch('/data/scrapbook/bookmarks.json', {
    server: false,
  })

  const { data: mastodonData } = useFetch('/data/scrapbook/mastodon.json', {
    server: false,
  })

  const { data: arenaData } = useFetch('/data/scrapbook/arena.json', {
    server: false,
  })

  const { data: githubData } = useFetch('/data/scrapbook/github.json', {
    server: false,
  })

  watchEffect(() => {
    if (bookmarksData.value) {
      bookmarksData.value.forEach((bookmark) => {
        const existingBookmarkIndex = combinedData.value.findIndex(
          (item) => item.id === bookmark.id && item.type === 'pinboard',
        )
        if (existingBookmarkIndex !== -1) {
          combinedData.value[existingBookmarkIndex] = {
            id: bookmark.id,
            href: bookmark.href,
            description: bookmark.description,
            content: bookmark.extended,
            time: bookmark.time,
            type: 'pinboard',
            ...bookmark,
          }
        } else {
          combinedData.value.push({
            id: bookmark.id,
            href: bookmark.href,
            description: bookmark.description,
            content: bookmark.extended,
            time: bookmark.time,
            type: 'pinboard',
            ...bookmark,
          })
        }
      })
    }

    if (mastodonData.value) {
      mastodonData.value.forEach((status) => {
        const existingStatusIndex = combinedData.value.findIndex(
          (item) => item.id === status.id && item.type === 'mastodon',
        )

        // sometimes the status content contains
        // encoded characters like nailguns exist alongside hammers, let&#39;s be real

        // we need to remove any &char; entities
        const mastodonCleanedString = status.content.replace(/&[^;]+;/g, '')

        if (existingStatusIndex !== -1) {
          combinedData.value[existingStatusIndex] = {
            id: status.id,
            href: status.url,
            description: mastodonCleanedString,
            time: status.created_at,
            type: 'mastodon',
            images: status.media_attachments
              .filter((attachment) => attachment.type === 'image')
              .map((attachment) => attachment.preview_url),
            videos: status.media_attachments
              .filter((attachment) => attachment.type === 'video')
              .map((attachment) => attachment.url),
          }
        } else {
          combinedData.value.push({
            id: status.id,
            href: status.url,
            description: mastodonCleanedString,
            time: status.created_at,
            type: 'mastodon',
            images: status.media_attachments
              .filter((attachment) => attachment.type === 'image')
              .map((attachment) => attachment.preview_url),
            videos: status.media_attachments
              .filter((attachment) => attachment.type === 'video')
              .map((attachment) => attachment.url),
          })
        }
      })
    }

    if (arenaData.value) {
      arenaData.value.forEach((block) => {
        const existingBlockIndex = combinedData.value.findIndex(
          (item) => item.id === block.id && item.type === 'arena',
        )
        if (existingBlockIndex !== -1) {
          combinedData.value[existingBlockIndex] = {
            id: block.id,
            href: `https://www.are.na/block/${block.id}`,
            content: block.description,
            time: block.created_at,
            type: 'arena',
            images: block.image ? [block.image.display.url] : [],
            channel: block.channel,
          }
        } else {
          combinedData.value.push({
            id: block.id,
            href: `https://www.are.na/block/${block.id}`,
            content: block.description,
            time: block.created_at,
            type: 'arena',
            images: block.image ? [block.image.display.url] : [],
            channel: block.channel,
          })
        }
      })
    }

    // if (githubData.value) {
    //   githubData.value.starredRepos.forEach((repo) => {
    //     const existingRepoIndex = combinedData.value.findIndex(
    //       (item) => item.id === repo.id && item.type === 'github-star',
    //     )
    //     if (existingRepoIndex !== -1) {
    //       combinedData.value[existingRepoIndex] = {
    //         id: repo.id,
    //         content: repo.name,
    //         href: repo.html_url,
    //         description: repo.description,
    //         time: repo.updated_at,
    //         type: 'github-star',
    //         images: [],
    //       }
    //     } else {
    //       combinedData.value.push({
    //         id: repo.id,
    //         content: repo.name,
    //         href: repo.html_url,
    //         description: repo.description,
    //         time: repo.updated_at,
    //         type: 'github-star',
    //         images: [],
    //       })
    //     }
    //   })

    //   githubData.value.userRepos.forEach((repo) => {
    //     const existingRepoIndex = combinedData.value.findIndex(
    //       (item) => item.id === repo.id && item.type === 'user-github',
    //     )
    //     if (existingRepoIndex !== -1) {
    //       combinedData.value[existingRepoIndex] = {
    //         id: repo.id,
    //         description: repo.name,
    //         href: repo.html_url,
    //         content: repo.description,
    //         time: repo.updated_at,
    //         type: 'user-github',
    //         images: [],
    //       }
    //     } else {
    //       combinedData.value.push({
    //         id: repo.id,
    //         description: repo.name,
    //         href: repo.html_url,
    //         content: repo.description,
    //         time: repo.updated_at,
    //         type: 'user-github',
    //         images: [],
    //       })
    //     }
    //   })

    //   githubData.value.userIssues.forEach((issue) => {
    //     const existingIssueIndex = combinedData.value.findIndex(
    //       (item) => item.id === issue.id && item.type === 'user-github-issue',
    //     )
    //     if (existingIssueIndex !== -1) {
    //       combinedData.value[existingIssueIndex] = {
    //         id: issue.id,
    //         description: issue.title,
    //         href: issue.html_url,
    //         content: `${issue.repository_url.split('/').slice(-2).join('/')}: ${
    //           issue.title
    //         } ${issue?.body ? issue.body : ''}`,
    //         time: issue.updated_at,
    //         type: 'user-github-issue',
    //         images: [],
    //       }
    //     } else {
    //       combinedData.value.push({
    //         id: issue.id,
    //         description: issue.title,
    //         href: issue.html_url,
    //         content: `${issue.repository_url.split('/').slice(-2).join('/')}: ${
    //           issue.title
    //         } ${issue?.body ? issue.body : ''}`,
    //         time: issue.updated_at,
    //         type: 'user-github-issue',
    //         images: [],
    //       })
    //     }
    //   })
    // }

    // properly sort the combinedData by time
    combinedData.value.sort((a, b) => new Date(b.time) - new Date(a.time))

    scrapByWeek.value = scrapbookDataToWeeks(combinedData.value)
  })

  function scrapbookDataToWeeks(data) {
    if (!data.length) return null
    const scrapByWeekMap = d3.group(data, (d) => {
      const date = new Date(d.time)
      const week = d3.timeWeek.floor(date)
      return week
    })
    return scrapByWeekMap
  }

  return {
    combinedData,
    scrapByWeek,
  }
}
