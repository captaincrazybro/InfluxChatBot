const Discord = require('discord.js');
const {prefix} = require('../config.json');

module.exports = {
    name: 'help',
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("InfluxBot Command")
            .addField(`${prefix}link <code>`, "Links your minecraft account.")
            .addField(`${prefix}leaderboard`, "Shows the today's daily gexp leaderboard.");
        message.channel.send(embed);
    }
}