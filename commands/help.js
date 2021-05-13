const Discord = require('discord.js');
const prefix = "."
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'help',
    aliases: ["commands"],
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("Influx Bot Commands")
            .addField(`${prefix}addblacklist <user>`, "Blacklists a user and prevents them from using the chat bot.")
            .addField(`${prefix}information [<user>]`, "Gets information about a server member.")
            .addField(`${prefix}leaderboard`, "Shows the today's daily gexp leaderboard.")
            .addField(`${prefix}link <code>`, "Links your minecraft account.")
            .addField(`${prefix}listblacklists`, "Lists the currently blacklisted users.")
            .addField(`${prefix}player <user>`, "Gets a user's minecraft account information.")
            .addField(`${prefix}purge <amount>`, "Purges a certain number of messages in a channel.")
            .addField(`${prefix}removeblacklist <user>`, "Unblacklists a user.")

        message.channel.send(embed);
        message.delete( {timeout: 3000} )
    }
}