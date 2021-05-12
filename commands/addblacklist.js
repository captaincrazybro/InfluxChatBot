const Discord = require('discord.js');
const fs = require('fs');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'addblacklist',
    aliases: ["addbl", "add-blacklist"],
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(embed.setDescription("You do not have permission to execute this command!")).then(msg => msg.delete( {timeout: 3000} ));

        if(args.length == 0) return message.reply(embed.setDescription("Specify a user"));

        let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

        if(!target) return message.channel.reply(embed.setDescription("User doesn't exist"));

        let blacklists = JSON.parse(fs.readFileSync("./blacklists.json"));

        let outcome = false;

        blacklists.forEach(val => {
            if(val.id == target.id) outcome = true;
        })

        if(outcome) return message.channel.reply(embed.setTitle("User is already blacklists"));

        let time = null;

        if(args.length > 1){
            time = ms(args[1]);
            let date = new Date(Date.now() + time) 
            if(!time) return message.channel.send(embed.setTitle("Invalid time"));
        }
        
        let date = new Date();

        blacklists.push({id: target.id, date: date});

        fs.writeFile("./blacklists.json", JSON.stringify(blacklists), err => {
            if(err) console.log(err);
        })

        embed
            .setColor("BLUE")
            .setDescription(`Successfully blacklisted <@${target.id}>`)

        await message.channel.send(embed);
        message.delete( {timeout: 2000} )
    }
}