const Discord = require('discord.js');
const fs = require('fs');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'listblacklists',
    aliases: ["listbl", "list-blacklists", "lsbl", "ls-bl", "listbls", "lsbls"],
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("BLUE");

        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(embed.setDescription("You do not have permission to execute this command!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})));

        let description = "";

        let blacklists = JSON.parse(fs.readFileSync("./blacklists.json"));

        blacklists.forEach(val => {
            description += `<@${val.id}>\n`;
        })

        if (description === "") description = "There are currently no blacklists";

        embed.setDescription(description);

        message.channel.send(embed);
        message.delete( {timeout: 3000} )
    }
}