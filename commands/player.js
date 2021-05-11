const Discord = require('discord.js');
const users = require('../users.json');

module.exports = {
    name: 'player',
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        if(!users[message.author.id]) return message.channel.send(embed.setTitle("Your discord is not linked to any player."));

        let uuid = users[message.author.id];
        let name = await getName(uuid);

        embed.setColor("BLUE")
            .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay=true`)
            .setTitle(message.author.tag)
            .addField("IGN", `${name}`)
            .addField("UUID", uuid)

        message.channel.send(embed);
    }
}