const Discord = require('discord.js');

/*
module.exports = {
    name: 'link',
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        // generates number and adds it to the currentlyLinking
        let currentlyLinking = require('../index').currentlyLinking;
        let number = Math.floor((Math.random() * 9999) + 1000);
        currentlyLinking[number] = message.author.id;

        message.channel.send(embed.setColor("GREEN").setDescription(`Your code is ${number}. Message InfluxBot on minecraft 'link ${number}' to link your account.`));
    }
}

 */