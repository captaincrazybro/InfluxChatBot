const Discord = require('discord.js');
const moment = require('moment');

module.exports = function (message, args) {
    let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

    let embedFinal = new Discord.MessageEmbed()
        .setColor("GOLD")
    if (!message.guild.member(target)) return message.reply(embedFinal.setDescription("User doesn't exist!")).then(msg => msg.delete({timeout: 2000})).then(message.delete({timeout: 2000}))

    if (!args[0]) { // if the user HAS NOT inputted a member
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.tag}'s information`)
            .setColor("GOLD")
            .addField('Username & Tag', `${message.author.tag}`, true)
            .addField('Created at', `${moment.utc(message.author.createdAt).format('DD/MM/YY')}`, true)
            .addField('Joined at', `${moment.utc(message.member.joinedAt).format('DD/MM/YY')}`, true)
        message.channel.send(embed);
    } else { // if the user HAS inputted a member
        const embed = new Discord.MessageEmbed()
            .setTitle(`${target.user.tag}'s information`)
            .setColor("GOLD")
            .addField('Username & Tag', `${target.user.tag}`, true)
            .addField('Created at', `${moment.utc(target.user.createdAt).format('DD/MM/YY')}`, true)
            .addField('Joined at', `${moment.utc(target.joinedAt).format('DD/MM/YY')}`, true)
        message.channel.send(embed);
    }
}