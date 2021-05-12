const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'addblacklist',
    aliases: ["addbl", "add-blacklist"],
    async execute(message, args) {
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return;
                
        let embed = new MessageEmbed()
            .setColor("GOLD");

        if(args.length == 0) return message.channel.send(embed.setTitle("Specify a user"));

        let target = message.guild.members.cache.get(message.mentions.users.first()?.id) || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(e => console.log(`Error while fetching user ${args[0]}`));

        if(!target) return message.channel.send(embed.setTitle("User doesn't exist"));

        let blacklists = JSON.parse(fs.readFileSync("./blacklists.json"));

        let outcome = false;

        blacklists.forEach(val => {
            if(val.id == target.id) outcome = true;
        })

        if(outcome) return message.channel.send(embed.setTitle("User is already blacklists"));

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

        message.channel.send(embed);
    }
}