const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require("fs");
const leaderboard = require("./features/Leaderboard");
const schedule = require('node-schedule');
const prefix = ".";
const index = require('./index');
const functions = require('./Functions');
require('dotenv').config();

module.exports = () => {

    // reads the commands folder
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    client.commands = new Discord.Collection();

    // function to schedule gtop
    function scheduleJob() {
        schedule.scheduleJob('55 5 * * *',function () {
            leaderboard("841715854181138462", client);
        });
    }

    // executes when the bot starts
    client.once('ready', function () {
        console.log(`[Discord] Logged in as ${client.user.tag}`);
        scheduleJob()
    });

    // registers all the commands in the commands folder
    for(const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);

        // registers aliases
        command.aliases.forEach(alias => {
            client.commands.set(alias, command);
        })
    }

    // message event handler that houses the command handler
    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        if (message.channel.type == "dm") return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        let embed = new Discord.MessageEmbed()
            .setColor("RED")

        if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))
        functions.setCooldown(5, message.author.id, message);
        if(!client.commands.has(command)) return;
        try {
            client.commands.get(command).execute(message, args, client);
        }
        catch(error) {
            console.error(error);
        }
    });

    client.login(process.env.TOKEN);

}
