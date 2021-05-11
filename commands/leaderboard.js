const Discord = require('discord.js');
const {token, prefix, myKey} = require('../config.json');
const fetch = require('node-fetch');
const leaderboard = require('../features/Leaderboard');

let data = [];

module.exports = {
    name: 'leaderboard',
    execute(message, args) {
        leaderboard("841715854181138462");
    }
}