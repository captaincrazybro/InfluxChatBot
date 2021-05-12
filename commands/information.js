const Discord = require('discord.js');
const information = require('../features/Information');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'information',
    aliases: ["info"],
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor('GOLD')

        if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))
        functions.setCooldown(5, message.author.id, message);
        information(message, args);
        message.delete( {timeout: 2000} )
    }
}