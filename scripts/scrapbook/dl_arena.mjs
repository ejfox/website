import Arena from 'are.na';
import { promises as fs } from 'fs';
import path from 'path';
// import ora from 'ora';
import inquirer from 'inquirer';
import Bottleneck from 'bottleneck';
import dotenv from 'dotenv';


dotenv.config();

const limiter = new Bottleneck({ minTime: 333 });
const USER_SLUG = 'ej-fox';  // Replace with your Are.na username
const ARENA_ACCESS_TOKEN = process.env.ARENA_ACCESS_TOKEN;

const arena = new Arena({ accessToken: ARENA_ACCESS_TOKEN });

const fetchAllBlocks = async () => {
  // const spinner = ora('Initializing download...').start();
  let allBlocks = [];

  try {
    const userChannels = await arena.user(USER_SLUG).channels();
    
    for (const channel of userChannels) {
      let page = 1;
      let fetching = true;
      
      while (fetching) {
        const response = await limiter.schedule(() => 
          arena.channel(channel.id).contents({ page, per: 100 })
        );
        const blocks = response || [];
        allBlocks = allBlocks.concat(blocks);
        fetching = blocks.length > 0;
        page += 1;
        spinner.text = `Fetched ${allBlocks.length} blocks...`;
      }
    }

    spinner.succeed(`Downloaded ${allBlocks.length} blocks`);
    return allBlocks;

  } catch (error) {
    spinner.fail('An error occurred');
    console.error(error);
  }
};


const isCI = process.env.CI === 'true';

if (isCI) {
  console.time('Time elapsed');
  fetchAllBlocks().then(async (blocks) => {
    const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook');
    const filePath = path.join(dirPath, 'arena.json');
    await fs.mkdir(dirPath, { recursive: true });  // This will create the directories if they don't exist
    await fs.writeFile(filePath, JSON.stringify(blocks, null, 2));
    console.timeEnd('Time elapsed');
  });
} else {
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'fetchAll',
      message: 'Would you like to fetch all blocks?',
      default: true,
    },
  ]).then(async (answers) => {
    console.time('Time elapsed');
    if (answers.fetchAll) {
      const blocks = await fetchAllBlocks();
      const dirPath = path.join(process.cwd(), 'public', 'data', 'scrapbook');
      const filePath = path.join(dirPath, 'arena.json');
      await fs.mkdir(dirPath, { recursive: true });  // This will create the directories if they don't exist
      await fs.writeFile(filePath, JSON.stringify(blocks, null, 2));
    } else {
      console.log('Fetching canceled.');
    }
    console.timeEnd('Time elapsed');
  });
}

export {
  fetchAllBlocks,
};
