const discordBot = require('./discordBot');
const minecraftBot = require('./minecraftBot');

// starts bot the discord bot and minecraft bot

let doRunStuff = async () => {
    await minecraftBot.run();
    discordBot.run();
}

doRunStuff();