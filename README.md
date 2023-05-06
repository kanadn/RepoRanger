# RepoRanger
Repository for hosting all the files related to CS-5704 Software Engineering final project.  

RepoRanger is a Discord bot that leverages GitHub and Discord API to allow team members to manage the project repository, CI/CD pipeline as well as issue tracking through a Discord channel. Using RepoRanger, team members can add new collaborators, review pull requests, create and list issues, and initiate workflows, as well as monitor project builds and deployments. Find out more about RepoRanger in the [report](FinalProjectReport.docx).

"The Bit Co." team members:  
1. Kanad Naleshwarkar (Email: kanadn@vt.edu GitHub: [kanadn](https://github.com/kanadn))  
2. Sarthak Banerjee (Email: sarthakb@vt.edu GitHub: [SarthakBan17](https://github.com/SarthakBan17))  
3. Sanket Bhujbal (Email: sanketb@vt.edu GitHub: [sanketmbhujbal](https://github.com/sanketmbhujbal))  

  
    
<br>
<br>
<br>

**Deployment Instructions:**  
Deploying this application on a Replit server is easy. Just follow these steps:  
1. Select "Create a Repl" option on Replit.
2. Select "Import from GitHub".
3. Copy the URL for this repo and paste it in the GitHub URL box on Replit.
4. Follow the instructions and setup your Repl.
5. Update access tokens in tools -> secrets. Also update the GitHub repo details for the repo where you want to deploy this bot.
6. Hit 'Run'!

(Note: Recently there was a GitHub credentials exposure from Replit so the 'Import from GitHub' option might not work for everyone. More info can be found [here](https://blog.replit.com/april-02-potential-github-credentials-exposure). In that case, this code can be pasted in Replit manually.)  

Once the code has been deployed, you can add the bot to your Discord server through this [link](https://discord.com/api/oauth2/authorize?client_id=1077756600439283793&permissions=414733244528&scope=bot) and start using it.  

Currently we have configured RepoRanger on a dummy repository called [RepoRanger-Playground](https://github.com/kanadn/RepoRanger-Playground). You can use this repo to test out the bot.

<br>

**Testing Instructions:**  
To test the features of this bot after proper deployment, you can set the AUTO_TEST flag present in the bot.js to true and hit 'Run'. This will run a series of tests on the bot and print the results in the console.
<br>

**Example use case: Creating an issue**  
1. Invoke the bot using the '/issuemake' command.
2. Enter the issue title and description.
3. The bot will create the issue and post the link to the issue in the channel.

<br>

The project board for this project can be found [here](https://github.com/users/kanadn/projects/2/views/1).
