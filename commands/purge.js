const Discord = require('discord.js');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'purge',
    aliases: ["p", "clear"],
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");
        if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))
        functions.setCooldown(5, message.author.id, message);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(embed.setDescription("You do not have permission to use this command.")).then(msg => msg.delete({timeout: 3000}))
        let amount = args[0];
        if (amount === null || amount === undefined) return message.reply(embed.setDescription('please input an amount (e.g. `.clear 100`).')).then(msg => msg.delete( {timeout: 3000} ));
        if (message.channel.messages.cache.size > amount) {
            let math = (amount - message.channel.messages.cache.size);
            await message.channel.bulkDelete(amount)
                .then(message.reply(embed.setDescription(`Successfully deleted ${math} messages!`)).then(msg => msg.delete({timeout: 2000})));
        }
        await message.channel.bulkDelete(amount)
            .then(message.reply(embed.setDescription(`Successfully deleted ${amount} messages!`)).then(msg => msg.delete({timeout: 2000})));
        message.delete({timeout: 2000});
    }
}