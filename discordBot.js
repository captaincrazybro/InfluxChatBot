const Discord = require("discord.js");
const channelId = "770264950915596320";
const guildId = "770262462070521857";
require('dotenv').config();

module.exports.run = async () => {

    // imports minecraft client
    const client = require('./minecraftBot').client;

    // creates bot
    const bot = new Discord.Client();

    // error handling
    bot.on("error", (err) => {
        console.log(err);
    });

    bot.on("message", (message) => {

        // checks it it's the right channel
        if(message.channel.id != channelId) return;
        if(message.author.bot) return;

        client.write("chat", {message:`/gc ${message.author.username}: ${message.content}`});

    })

    // logs in the bot 
    bot.login(process.env.TOKEN);
}