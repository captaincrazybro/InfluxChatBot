const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'listblacklists',
    aliases: ["listbl", "list-blacklists", "lsbl", "ls-bl", "listbls", "lsbls"],
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("BLUE");

        let description = "";

        let blacklists = JSON.parse(fs.readFileSync("./blacklists.json"));

        blacklists.forEach(val => {
            description += `<@${val.id}>\n`;
        })

        if(description == "") description = "There are currently no blacklists";

        embed.setDescription(description);

        message.channel.send(embed);
    }
}