const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const channelId = "813632918249275432";
const ownerId = "813603125641347083";
const cqptainId = "375452395733254144";
const users = require('../users.json');
const ms = require("ms");
var Filter = require('bad-words'),
    filter = new Filter();
const index = require('../index');
const filterWords = [
    "nig",
    "neg",
    "n6",
    "n9"
]
require('dotenv').config();

var client;

module.exports.run = async () => {

    const bot = new Discord.Client();

    // error handling
    bot.on("error", (err) => {
        console.log(`[Chat] ` + err);
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

            // get member
            let member = message.guild.members.cache.get(message.author.id);
            if(!member) member = message.guild.members.fetch(message.author.id);

            // parse nickname
            let nickname = member.nickname;
            if(!nickname) nickname = message.author.username;

            // sends discord chat to mc
            client.write("chat", {message:`/gc ${nickname}: ${filter.clean(message.content)}`});
        }
    })
}

function filterCheck(message){
    let outcome = false;
    filterWords.forEach(val => {
        if(message.includes(val)) outcome = true;
    })
    return outcome;
}

// function to set client
module.exports.setClient = (newClient) => {
    client = newClient;
}