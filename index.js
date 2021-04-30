const discordBot = require('./discordBot');
const minecraftBot = require('./minecraftBot');
const updateNames = require('./updateNames');
const updateBlacklists = require('./updateBlacklists');

// starts bot the discord bot and minecraft bot
 
let doRunStuff = async () => {
    await minecraftBot.run();
    discordBot.run();
}

doRunStuff();

module.exports.currentlyLinking = {};

module.exports.setBot = (bot) => {
    /*setInterval(() => {
        updateBlacklists(bot);
    }, 43200000)*/
}