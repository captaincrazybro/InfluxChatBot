const Discord = require('discord.js');
const users = require('../users.json');
const functions = require('../Functions');
const index = require('../index');

module.exports = {
    name: 'player',
    aliases: ["minecraftaccount", "mcacc", "mc-acc"],
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        if(!users[message.author.id]) return message.reply(embed.setDescription("Your discord is not linked to any player. Please use `.link` to link your account!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})));
        if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})))

        let uuid = users[message.author.id];
        let name = await functions.getName(uuid);

        embed.setColor("BLUE")
            .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay=true`)
            .setTitle(message.author.tag)
            .addField("IGN", `${name}`)
            .addField("UUID", uuid)

        await message.channel.send(embed);
        message.delete( {timeout: 3000} )
    }
}