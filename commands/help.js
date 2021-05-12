const Discord = require('discord.js');
const prefix = "."
const index = require('../index');;
const functions = require('../Functions');

module.exports = {
    name: 'help',
    aliases: ["commands"],
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("InfluxBot Command")
            .addField(`${prefix}addblacklist <user>`, "Blacklists a user and prevents them from using the chat bot.")
            .addField(`${prefix}leaderboard`, "Shows the today's daily gexp leaderboard.")
            .addField(`${prefix}link <code>`, "Links your minecraft account.")
            .addField(`${prefix}listblacklists`, "Lists the currently blacklisted users.")
            .addField(`${prefix}player <user>`, "Gets a user's minecraft account information.")
            .addField(`${prefix}purge <amount>`, "Purges a certain number of messages in a channel.")
            .addField(`${prefix}removeblacklist <user>`, "Unblacklists a user.");

        if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))
        functions.setCooldown(5, message.author.id, message);
        message.channel.send(embed);
        message.delete( {timeout: 2000} )
    }
}