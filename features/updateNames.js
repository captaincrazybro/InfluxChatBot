const users = require('./users.json');
const axios = require('axios');
const guildId = "813586633252405258";

module.exports = async (bot) => {

    let map = new Map(Object.entries(users));

    map.forEach(async (k, v) => {
        let name = await getName(v);
        let guild = bot.guilds.cache.get(guildId);
        let member = guild.members.cache.get(k);
        if(!member) member = guild.members.fetch(k);
        if(member.nickName != name) member.setNickname(name);
    })

}

async function getName(uuid) {
    if (uuid == null) return null;
    let { data } = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);//`https://api.mojang.com/user/profiles/${uuid}/names`);
    return data.name
}