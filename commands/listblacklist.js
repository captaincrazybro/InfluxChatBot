const Discord = require('discord.js');

module.exports = {
    name: 'listblacklist',
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("BLUE");

        let description = "";

        blacklists.forEach(val => {
            description += `<@${val.id}>\n`;
        })

        if(description == "") description = "There are currently no blacklists";

        embed.setDescription(description);

        message.channel.send(embed);
    }
}