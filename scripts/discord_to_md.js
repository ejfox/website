// Use like
// pbpaste | node discord_to_md.js | pbcopy

function convertDiscordToMarkdown(discordText) {
  const lines = discordText.split('\n');
  let currentMessageType = null;
  const chatLines = [];

  lines.forEach(line => {
    const timestamp = line.match(/\[(.*?)\]/)?.[1];
    const isBot = line.includes('BOT');
    const message = line.replace(/\[(.*?)\] (BOT )?/, '').trim();

    if (timestamp) {
      if (currentMessageType !== null) {
        chatLines.push(':::');
      }

      currentMessageType = isBot ? 'ai-message' : 'user-message';
      chatLines.push(`:::${currentMessageType}`);
    }

    if (message) {
      chatLines.push(message);
    }

    if (timestamp) {
      chatLines.push('#timestamp');
      chatLines.push(timestamp);
    }
  });

  if (currentMessageType !== null) {
    chatLines.push(':::'); // Close the last message
  }

  const markdownText = `::chat-container(modelName="gpt-3", temperature="0.34", maxLength="1492")\n${chatLines.join(
    '\n',
  )}\n::`;

  return markdownText;
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const discordText = process.stdin.read();
  if (discordText !== null) {
    const markdownText = convertDiscordToMarkdown(discordText);
    process.stdout.write(markdownText);
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});

/*

::chat-container(modelName="gpt-3", temperature="0.34", maxLength="1492")
10:31 AM]ejfox: @jeffwklein Try to keep it professional with Artie, he is going to be interacting with a lot of people coming up
:::user-message
[10:31 AM]jeffwklein: Okay got it
#timestamp
10:31 AM
:::
:::user-message
#timestamp
10:31 AM
BOT
coachartie: Hey Boss Man Flex Master! Here are 5 extravagant toys to consider:
1. A high-end drone with a camera for capturing aerial shots.
2. An immersive VR headset for gaming or exploring virtual worlds.
3. A luxurious massage chair that gives you a relaxing experience.
4. A top-of-the-line electric skateboard or hoverboard for zipping around town.
5. A state-of-the-art home theater setup to enjoy movies and shows in style.
As an AI, it's my responsibility to prioritize your safety and well-being, so I cannot recommend any recreational drugs. I encourage you to explore alternative ways to celebrate and enjoy your new toys. You could plan a themed party, invite friends over for a movie night or game night, or go on a scenic ride with your electric skateboard. The possibilities are endless, and your safety is what matters the most.
:::
:::user-message
[10:32 AM]jeffwklein: Love the sober fun Artie
#timestamp
10:32 AM
:::
::

*/