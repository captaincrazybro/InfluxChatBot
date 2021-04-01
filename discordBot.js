const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const channelId = "813632918249275432";
const ownerId = "813603125641347083";
const cqptainId = "375452395733254144";
const users = require('./users.json');
const ms = require("ms");
var Filter = require('bad-words'),
    filter = new Filter();
const updateNames = require('./updateNames');
const { MessageEmbed } = require('discord.js');
var blacklists = require("./blacklists.json");
const prefix = ".";
const filterWords = [
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

        // allows owners to execute commands from discord
        if((message.member.roles.cache.get(ownerId) || message.author.id == cqptainId) && message.content.startsWith("?") && message.channel.type == "text"){
            let content = message.content.replace("?","/");
            client.write("chat", {message:`${content}`})
            return;
        }

        if(message.channel.id == channelId){

            if(message.author.bot) return;

            // chat filter
            if(filterCheck(message.content)) return;

            // blacklists
            let outcome = false;
            
            blacklists.forEach(val => {
                if(val.id == message.author.id) outcome = true;
            })

            if(outcome) return;

            // sends discord chat to mc
            client.write("chat", {message:`/gc ${message.author.username}: ${filter.clean(message.content)}`});

        }

        // commands
        if(message.content.startsWith(prefix)){

            // parses command
            let messageArgs = message.content.split(" ");
            let cmd = messageArgs[0].replace(prefix, "");
            let args = messageArgs;
            args.shift();

            // command handler
            if((cmd.toLowerCase() == "link" || cmd.toLowerCase() == "linkminecraft" || messageArgs[0] == "link" || messageArgs[0] == "linkminecraft") && message.channel.type == "dm"){

                let embed = new MessageEmbed()
                    .setColor("GOLD");

                // generates number and adds it to the currentlyLinking
                let currentlyLinking = require('./index').currentlyLinking;
                let number = Math.floor((Math.random() * 9999) + 1000);
                currentlyLinking[number] = message.author.id;

                message.channel.send(embed.setColor("GREEN").setDescription(`Your code is ${number}. Message InfluxBot on minecraft 'link ${number}' to link your account.`));

            }
            
            if(cmd.toLowerCase() == "blacklist" || cmd.toLowerCase() == "addblacklist"){

                if(!message.member.hasPermission("MANAGE_CHANNELS")) return;
                
                let embed = new MessageEmbed()
                    .setColor("GOLD");

                if(args.length == 0) return message.channel.send(embed.setTitle("Specify a user"));

                let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

                if(!target) return message.channel.send(embed.setTitle("User doesn't exist"));

                if(blacklists.includes(target.id)) return message.channel.send(embed.setTitle("User is already blacklists"));

                let time = null;

                if(args.length > 1){
                    time = ms(args[1]);
                    if(!time) return message.channel.send(embed.setTitle("Invalid time"));
                }
                
                blacklists.push({id: target.id, time: time});

                fs.writeFile("./blacklists.json", JSON.stringify(blacklists), err => {
                    if(err) console.log(err);
                })

                embed
                    .setColor("BLUE")
                    .setDescription(`Successfully blacklisted <@${target.id}>`)

                message.channel.send(embed);

            } else if(cmd.toLowerCase() == "blacklists" || cmd.toLowerCase() == "listblacklists"){

                //if(!message.member.hasPermission("MANAGE_CHANNELS")) return;

                let embed = new MessageEmbed()
                    .setColor("BLUE");

                let description = "";

                blacklists.forEach(val => {
                    description += `<@${val.id}>\n`;
                })

                if(description == "") description = "There are currently no blacklists";

                embed.setDescription(description);
                
                message.channel.send(embed);

            } else if(cmd.toLowerCase() == "removeblacklist" || cmd.toLowerCase() == "remblacklist"){

                if(!message.member.hasPermission("MANAGE_CHANNELS")) return;

                let embed = new MessageEmbed()
                    .setColor("GOLD");

                if(args.length == 0) return message.channel.send(embed.setTitle("Specify a user"));

                let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

                if(!target) return message.channel.send(embed.setTitle("User doesn't exist"));

                let outcome = false;

                blacklists.forEach(val => {
                    if(val.id == target.id) outcome = true;
                })

                if(!outcome) return message.channel.send(embed.setTitle("User is not blacklisted"));

                blacklists = blacklists.filter(val => val.id != target.id);

                fs.writeFile("./blacklists.json", JSON.stringify(blacklists), err => {
                    if(err) console.log(err);
                })

                embed
                    .setColor("BLUE")
                    .setDescription(`Successfully unblacklisted <@${target.id}>`)

                message.channel.send(embed);

            } else if(cmd.toLowerCase() == "player" || cmd.toLowerCase() == "linkedplayer"){

                let embed = new MessageEmbed()
                    .setColor("GOLD");

                if(!users[message.author.id]) return message.channel.send(embed.setTitle("Your discord is not linked to any player."));

                let uuid = users[message.author.id];
                let name = await getName(uuid);

                embed.setColor("BLUE")
                    .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay=true`)
                    .setTitle(message.author.tag)
                    .addField("IGN", `${name}`)
                    .addField("UUID", uuid)

                message.channel.send(embed);

            }
            
            /*else if(cmd.toLowerCase() == "help" || cmd.toLowerCase() == "commands"){
                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("InfluxBot Command")
                    .addField(`${prefix}link <code>`, "Links your minecraft account.");

                message.channel.send(embed);
            }*/

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
    filterWords.forEach(val => {
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