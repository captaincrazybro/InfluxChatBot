const Discord = require('discord.js');
const fetch = require('node-fetch');
const index = require('./index');

module.exports.getName = function (uuid) {
    const usernames = `https://api.mojang.com/user/profiles/${uuid}/names`
    return fetch(usernames)
        .then(username => username.json())
        .then(usernamesJson => {
            return usernamesJson[usernamesJson.length - 1].name;
        })
}

module.exports.setCooldown = function (seconds, user, message) {
    let time = seconds * 1000;
    if (time < 0) return message.reply("Please input a number greater than 0 (in seconds).").then(msg => msg.delete( {timeout: 3000} ))

    index.currentlyCooldowned[user] = user;
    setTimeout(function () {
        index.currentlyCooldowned[user] = null;
    }, time);
}