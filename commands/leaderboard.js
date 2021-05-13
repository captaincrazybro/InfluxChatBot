const Discord = require('discord.js');
const leaderboard = require('../features/Leaderboard');
const index = require('../index');
const functions = require('../Functions');

module.exports = {
    name: 'leaderboard',
    aliases: ["lb", "gtop", "gexptop", "gexplb"],
    execute(message, args, client) {
        functions.setCooldown(5, message.author.id, message);
        leaderboard(message.channel.id, client);
        message.delete( {timeout: 3000} );
    }
}