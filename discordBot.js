const Discord = require("discord.js");
const channelId = "770264950915596320";
const ownerId = "770262647081402418";
const cqptainId = "375452395733254144";
require('dotenv').config();

var client;

module.exports.run = async () => {

    // creates bot
    const bot = new Discord.Client();

    // error handling
    bot.on("error", (err) => {
        console.log(err);
    });

    // message handler 
    bot.on("message", (message) => {

        // checks it it's the right channel
        if(message.channel.id != channelId) return;
        if(message.author.bot) return;

        // allows owners to execute commands from discord
        if((message.guild.member(message.author).roles.get(ownerId)/* || message.author.id == cqptainId*/) && message.content.startsWith("/")){
            client.write("chat", {message:`${message.content}`})
            return;
        }

        // sends discord chat to mc
        client.write("chat", {message:`/gc ${message.author.username}: ${message.content}`});

    })

    // logs in the bot 
    bot.login(process.env.TOKEN);
}

// function to set client
module.exports.setClient = (newClient) => {
    client = newClient;
}