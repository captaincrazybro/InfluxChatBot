const Discord = require('discord.js');
const {prefix} = require('../config.json');

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
            .addField(`${prefix}player <user>`, "Gets a user's minecraft account information.");
        message.channel.send(embed);
    }
}