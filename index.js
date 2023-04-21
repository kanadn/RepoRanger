const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env['token']
const CLIENT_ID = process.env['client_id']
const GUILD_ID = process.env['guild_id']

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!',
  options: [
    {
      name: "title",
      description: "Enter a number choice",
      type: 3
    }
  ]
},{
  name: 'help',
  description: 'Replies with the list of all possible commands'
}, {
  name: 'issueinfo',
  description: 'Replies with info of issue!'
}, {
  name: 'issuemake',
  description: 'Creates the issue for the user!',
  options: [
    {
      name: "title",
      description: "Enter the title of the issue",
      type: 3,
      required: true
    }, {
      name: "body",
      description: "Enter the description of the issue",
      type: 3,
      required: true
    }
  ]
}, {
  name: 'collaboratorinfo',
  description: 'Replies with info of collaborators!'
}, {
  name: 'collaboratoradd',
  description: 'Replies by adding the new collaborators!',
  options: [
    {
      name: "username",
      description: "Enter the username of the collaborator",
      type: 3,
      required: true
    }
  ]
}, {
  name: 'pullinfo',
  description: 'Replies with list of pull requests'
}];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();