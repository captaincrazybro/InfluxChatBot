const discordClient = require('./discordClient');
const discordChatBot = require('./chatBots/discordChatBot');
const minecraftChatBot = require('./chatBots/minecraftChatBot');
const updateBlacklists = require('./features/updateBlacklists');

module.exports.currentlyLinking = {};
module.exports.currentlyCooldowned = {};

async function start() {
    // starts the regular discord bot
    discordClient();

    // starts the chat bots
    await minecraftChatBot.run();
    discordChatBot.run();
}

// starts the program
start();

module.exports.setBot = (bot) => {
    /*setInterval(() => {
        updateBlacklists(bot);
    }, 43200000)*/
}