const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const channelId = "813632918249275432";
const ownerId = "770262647081402418";
const cqptainId = "375452395733254144";
const users = require('./users.json');
const updateNames = require('./updateNames');
const { MessageEmbed } = require('discord.js');
const prefix = ".";
const filter = [
    "nig",
    "neg",
    "n6",
    "n9"
]
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
    bot.on("message", async (message) => {

        if(message.channel.id == channelId){

            if(message.author.bot) return;

            // chat filter
            if(filterCheck(message.content)) return;

            // allows owners to execute commands from discord
            if((message.member.roles.cache.get(ownerId)/* || message.author.id == cqptainId*/) && message.content.startsWith("/")){
                client.write("chat", {message:`${message.content}`})
                return;
            }

            // sends discord chat to mc
            client.write("chat", {message:`/gc ${message.author.username}: ${message.content}`});

        }

        if(message.channel.type != "dm") return;

        // commands
        if(message.content.startsWith(prefix)){

            // parses command
            let messageArgs = message.content.split(" ");
            let cmd = messageArgs[0].replace(prefix, "");
            let args = messageArgs;
            args.shift();

            // command handler
            if(cmd.toLowerCase() == "link" || cmd.toLowerCase() == "linkminecraft" || messageArgs[0] == "link" || messageArgs[0] == "linkminecraft"){

                let embed = new MessageEmbed()
                    .setColor("GOLD");

                // generates number and adds it to the currentlyLinking
                let currentlyLinking = require('./index').currentlyLinking;
                let number = Math.floor((Math.random() * 9999) + 1000);
                currentlyLinking[number] = message.author.id;

                message.channel.send(embed.setColor("GREEN").setDescription(`Your code is ${number}. Message InfluxBot on minecraft 'link ${number}' to link your account.`));

            } else if(cmd.toLowerCase() == "help" || cmd.toLowerCase() == "commands"){
                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("InfluxBot Command")
                    .addField(`${prefix}link <code>`, "Links your minecraft account.");

                message.channel.send(embed);
            }

        }

    })

    setTimeout(async () => {
        await updateNames(bot);
    }, 86400000)

    // logs in the bot 
    bot.login(process.env.TOKEN);
}

function filterCheck(message){
    let outcome = false;
    filter.forEach(val => {
        if(message.includes(val)) outcome = true;
    })
    return outcome;
}

async function getName(uuid) {
    if (uuid == null) return null;
    let { data } = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);//`https://api.mojang.com/user/profiles/${uuid}/names`);
    return data.name
}

// function to set client
module.exports.setClient = (newClient) => {
    client = newClient;
}