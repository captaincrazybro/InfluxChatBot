const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const {prefix, token, myKey} = require("./config.json");
const fs = require('fs')
const fetch = require('node-fetch');
const leaderboard = require('/features/Leaderboard');

const discordBot = require('./Robots/discordBot');
const minecraftBot = require('./Robots/minecraftBot');
const updateBlacklists = require('./updateBlacklists');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

function scheduleJob() {
    setInterval(function () {
        let date = new Date();
        if (date.getHours() === 5 && date.getMinutes() === 30) {
            leaderboard("841715854181138462");
        }
    }, 60000);
}

client.once('ready', function () {
    console.log(`Logged in as ${client.user.tag}`);
    scheduleJob()
    discordBot.run();
});

client.login(token);

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.type == "dm") return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    }
    catch(error) {
        console.error(error);
    }
});

module.exports.setBot = (bot) => {
    /*setInterval(() => {
        updateBlacklists(bot);
    }, 43200000)*/
}