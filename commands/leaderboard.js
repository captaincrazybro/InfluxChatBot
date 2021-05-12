const Discord = require('discord.js');
const leaderboard = require('../features/Leaderboard');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'leaderboard',
    aliases: ["lb", "gtop", "gexptop", "gexplb"],
    execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setColor('GOLD')

        if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setTitle("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))
        functions.setCooldown(5, message.author.id, message);
        leaderboard(message.channel.id, client);
        message.delete( {timeout: 4000} );
    }
}