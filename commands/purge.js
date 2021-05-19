const Discord = require('discord.js');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'purge',
    aliases: ["p", "clear"],
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(embed.setDescription("You do not have permission to use this command.")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})))
        let amount = args[0];
        if (amount === null || amount === undefined || isNaN(amount)) return message.reply(embed.setDescription('Please input an amount (e.g. `.clear 100`).')).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})));
        amount = parseInt(amount);

        let messageCount = (await message.channel.messages.fetch()).size;

        let math = amount <= messageCount ? amount : messageCount;

        await message.channel.bulkDelete(math)
            .then(message.reply(embed.setDescription(`Successfully deleted ${math} messages!`)).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000}))));
            
        message.delete({timeout: 3000});
    }
}