import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import ora from 'ora';
import dotenv from 'dotenv';

dotenv.config();

const username = 'ejfox';
const token = process.env.GITHUB_TOKEN;

const fetchGithubData = async () => {
  const spinner = ora('Initializing download...').start();

  const starredRepos = await axios.get(`https://api.github.com/users/${username}/starred`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });

  const userRepos = await axios.get(`https://api.github.com/users/${username}/repos`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });

  const userIssues = await axios.get(`https://api.github.com/search/issues?q=author:${username}`, {
    headers: {
      'Authorization': `token ${token}`
    }
  });

  spinner.succeed('Downloaded GitHub data');
  return {
    starredRepos: starredRepos.data,
    userRepos: userRepos.data,
    userIssues: userIssues.data.items
  };
};

const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook');
const filePath = path.join(dirPath, 'github.json');

console.time('Time elapsed');
const githubData = await fetchGithubData();
await fs.mkdir(dirPath, { recursive: true });  // This will create the directories if they don't exist
await fs.writeFile(filePath, JSON.stringify(githubData, null, 2));
console.timeEnd('Time elapsed');

export {
  fetchGithubData,
};