const Discord = require("discord.js");
const fs = require('fs');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: "removeblacklist",
    aliases: ["rmbl", "removebl", "remove-blacklist", "rm-bl", "remove-bl"],
    async execute(message, args){
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(embed.setDescription("You do not have permission to execute this command!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})));

        if(args.length === 0) return message.channel.send(embed.setDescription("Specify a user"));

        let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

        if(!target) return message.channel.send(embed.setDescription("User doesn't exist"));

        let outcome = false;

        let blacklists = JSON.parse(fs.readFileSync("./blacklists.json"));

        blacklists.forEach(val => {
            if(val.id === target.id) outcome = true;
        })

        if(!outcome) return message.channel.send(embed.setDescription("User is not blacklisted"));

        blacklists = blacklists.filter(val => val.id !== target.id);

        fs.writeFile("./blacklists.json", JSON.stringify(blacklists), err => {
            if(err) console.log(err);
        })

        embed
            .setColor("BLUE")
            .setDescription(`Successfully unblacklisted <@${target.id}>`)

        await message.channel.send(embed);
        message.delete( {timeout: 3000} )
    }
}