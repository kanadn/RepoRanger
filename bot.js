const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');  //used to download discord js and make the bot
const { Octokit } = require("@octokit/rest");  //used to connect with the github Rest api
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const octokit = new Octokit({
  auth: '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'  //this is the token from github for one individual
})

const token = process.env['token']

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    const num1 = interaction.options.getString('title');
    await interaction.reply(num1);
  }
  //getting infor about the issues in the given repo
  //only prints to console
  else if (interaction.commandName === 'issueinfo') {
    await interaction.reply('issue information was displayed!');
    const issueList = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'accept': 'application/json'
      }
    })

    // Create a new embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Issues on the board')
      .setDescription('List of issues from the RepoRanger project')
      .setTimestamp();

    // The issueList is already a JavaScript object. Now we need to figure out a way to properly print this data in an embed.
    console.log(issueList.data);
    issueList.data.forEach(issue => {
      console.log(typeof issue.title);
      //Needs proper error handling. This is temporary
      if (!issue.title) {
        issue.title = ' ';
      }
      if (!issue.body) {
        issue.body = ' ';
      }
      embed.addFields({ name: issue.title, value: issue.body },);
    });

    //Send the embed to a specific channel
    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send({ embeds: [embed] });
  }
  //creating a issue on github, takes in title and body
  else if (interaction.commandName === 'issuemake') {
    const titleinput = interaction.options.getString('title');
    const bodyinput = interaction.options.getString('body');
    await interaction.reply('Issue was made!');
    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      title: titleinput,
      body: bodyinput,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }
  else if (interaction.commandName === 'pullinfo') {
    await interaction.reply('List of pulls are avaliable');
    console.log(await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }))
  }
  else if (interaction.commandName === 'collaboratorinfo') {
    await interaction.reply('Collaborator info');
    console.log(await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }))
  }
});

client.login(token);