const Discord = require('discord.js');
const users = require('../users.json');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'link',
    aliases: ["linkaccount", "linkmc", "link-acc", "linkacc", "link-mc"],
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");
        if(users[message.author.id]) return message.channel.send(embed.setDescription("Your discord is already linked to a player. If you balieve this is a mistake, simply relink your account with `.link`!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete({timeout: 3000})));

        // generates number and adds it to the currentlyLinking
        let currentlyLinking = require('../index').currentlyLinking;
        let number = Math.floor((Math.random() * 9999) + 1000);
        currentlyLinking[number] = message.author.id;

        message.author.send(embed.setColor("GREEN").setDescription(`Your code is ${number}. Message InfluxBot on minecraft 'link ${number}' to link your account.`));
        message.delete( {timeout: 3000} )
    }
}