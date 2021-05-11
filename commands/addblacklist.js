const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'addblacklist',
    async execute(message, args) {
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return;

        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        if(args.length === 0) return message.channel.send(embed.setTitle("Specify a user"));

        let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

        if(!target) return message.channel.send(embed.setTitle("User doesn't exist"));

        let outcome = false;

        blacklists.forEach(val => {
            if(val.id === target.id) outcome = true;
        })

        if(!outcome) return message.channel.send(embed.setTitle("User is not blacklisted"));

        blacklists = blacklists.filter(val => val.id !== target.id);

        fs.writeFile("./blacklists.json", JSON.stringify(blacklists), err => {
            if(err) console.log(err);
        })

        embed
            .setColor("BLUE")
            .setDescription(`Successfully unblacklisted <@${target.id}>`)

        message.channel.send(embed);
    }
}