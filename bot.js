const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');  //used to download discord js 
const { Octokit } = require("@octokit/rest");  //used to connect with the github Rest api
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const octokit = new Octokit({
  //this is the token from github for one individual
  auth: process.env['GITHUB_ACCESS_TOKEN']
})

const token = process.env['token']  //part of the secret key containing bot token

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  //just a trial command to test systems 
  if (interaction.commandName === 'ping') {
    const num1 = interaction.options.getString('title');
    await interaction.reply(num1);
  }

  else if (interaction.commandName === 'help') {
    await interaction.reply('Please use commands below');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Help Command')
      .setDescription('List of commands used by the bot')
      .addFields({ name: "issueinfo", value: "Displays the information about issues" },
        { name: "issuemake", value: "Creates a new issue, requires Title and Body" },
        { name: "pullinfo", value: "List all pull requests" },
        { name: "collaboratorinfo", value: "Lists information of all collaborators" },
        { name: "collaboratoradd", value: "Adds a user as a collaborator" },
        { name: "workflowinfo", value: "Replies with a list of workflows" },
        { name: "triggerworkflow", value: "Manually triggers a workflow" },
        { name: "branchinfo", value: "Replies with list of all branches in the repo" })
      .setTimestamp();

    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send({ embeds: [embed] });
  }

  //getting info about the issues in the given repo
  else if (interaction.commandName === 'issueinfo') {
    await interaction.reply('Issue information was displayed!');
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

    issueList.data.forEach(issue => {
      //Needs proper error handling. This is temporary
      if (!issue.title) {
        issue.title = ' ';
      }
      if (!issue.body) {
        issue.body = ' ';
      }
      embed.addFields({ name: issue.title, value: issue.body + '\n' + issue.html_url },);

    });

    //Send the embed to a specific channel
    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send({ embeds: [embed] });
  }

  //creating a issue on github, takes in title and body
  else if (interaction.commandName === 'issuemake') {
    const titleinput = interaction.options.getString('title');
    const bodyinput = interaction.options.getString('body');
    await interaction.reply('Issue was created!');
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
    const collablist = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'accept': 'application/json'
      }
    })

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Collaborators present in the repo')
      .setDescription('List of collaborators from the RepoRanger project')
      .setTimestamp();

    collablist.data.forEach(collab => {
      console.log(typeof collab.login);
      //Needs proper error handling. This is temporary
      if (!collab.login) {
        collab.login = ' ';
      }
      //embed.addFields({ name: " ", value:" "+[collab.login](collab.html_url)})not working
      embed.addFields({ name: collab.login, value: collab.html_url },);
    });
    //Send the embed to a specific channel
    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send({ embeds: [embed] });
  }
  else if (interaction.commandName === 'workflowinfo') {
    const worflow_info = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      workflow_id: 'github-actions-demo.yml',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    console.log('Get workflow request dump:', worflow_info);

    const wf_embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Workflow info for Reporanger-playground')
      .setTimestamp();
    
    wf_embed.addFields({ name: worflow_info.data.name, value: worflow_info.data.state + '\n' + worflow_info.data.html_url });

    //Send the embed to a specific channel
    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send({ embeds: [wf_embed] });
  }

  else if (interaction.commandName === 'triggerworkflow') {
    const triggerWF = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      workflow_id: 'github-actions-demo.yml',
      ref: 'main',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if(triggerWF.status == 204){
      await interaction.reply('Workflow trigger successful!');
    }
  }
    
  else if (interaction.commandName === 'branchinfo') {
    await interaction.reply('All branches in the repo');
    const collablist = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Branches')
      .setDescription('List of all branches in the repository')
      .setTimestamp();

    collablist.data.forEach(collab => {
      //Needs proper error handling. This is temporary
      if (!collab.name) {
        collab.name = ' ';
      }
      embed.addFields({ name: collab.name, value: " " },);
    });
    //Send the embed to a specific channel
    const channel = client.channels.cache.find(channel => channel.name === 'general');
    channel.send({ embeds: [embed] });
  }
    
  if (interaction.commandName === 'collaboratoradd') {
    const username = interaction.options.getString('username');
    console.log('Got username:', username);
    await interaction.reply('Collaborator has been added');
    console.log(await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
      owner: 'kanadn',
      repo: 'RepoRanger-Playground',
      username: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }))
  }
});

client.login(token);