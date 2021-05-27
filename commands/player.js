const Discord = require('discord.js');
const users = require('../users.json');
const functions = require('../Functions');
const fetch = require('node-fetch');
const index = require('../index');
require('dotenv').config();

module.exports = {
    name: 'player',
    aliases: ["minecraftaccount", "mcacc", "mc-acc"],
    async execute(message, args, bot) {
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD");

        //if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))
        //functions.setCooldown(5, message.author.id, message);
        //if(!users[message.author.id]) return message.reply(embed.setDescription("Your discord is not linked to any player. Please use `.link` to link your account!")).then(msg => msg.delete( {timeout: 3000} ));
        //if (index.currentlyCooldowned[message.author.id] === message.author.id) return message.reply(embed.setDescription("Please wait a few seconds before executing the command again!")).then(msg => msg.delete( {timeout: 3000} ).then(message.delete( {timeout: 2000} )))

        // gets the user
        let user = message.author;
        if(args.length > 0){
            user = message.mentions.users.first() || bot.users.cache.get(args[0])
        }

        // gets name and uuid from player
        let uuid = null;
        let name = null;
        if(user == null && args.length > 0) {
            let response = await functions.getUuid(args[0]);
            response = await response.json();

            if(response.error != undefined && response.error != null) return message.channel.send(embed.setDescription("Invalid user or player"));

            uuid = response.id;
            name = response.name;
        } else {
            uuid = users[user.id];
            name = await functions.getName(uuid);
        }

        // creates urls
        let guildIdUrl = `https://api.hypixel.net/findGuild?byUuid=${uuid}&key=${process.env.APIKEY}`;
        let playerUrl = `https://api.hypixel.net/player?uuid=${uuid}&key=${process.env.APIKEY}`

        // player stats
        let player =  await fetch(playerUrl);
        player = await player.json();
        player = player.player;

        // guild information
        let guildId = await fetch(guildIdUrl);
        guildId = await guildId.json();
        let gexp = null;
        let gMember = null;

        if(guildId.guild){
            guildId = guildId.guild;
            
            let guildUrl = `https://api.hypixel.net/guild?id=${guildId}&key=${process.env.APIKEY}`;

            let guild = await fetch(guildUrl);
            guild = await guild.json();

            gMember = guild.guild.members.filter(m => m.uuid == uuid);
            gMember = gMember.length > 0 ? gMember[0] : null;

            let gexpHistory = new Map(Object.entries(gMember.expHistory));
            gexp = gexpHistory.values().next().value;
        }
        
        // stats variables
        let bwStats = player.stats["Bedwars"];
        let duelsStats = player.stats["Duels"];
        let swStats = player.stats["SkyWars"];

        // create embed
        embed.setColor("BLUE")
            .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay=true`)
            .setAuthor(message.author.tag)
            .addField("Name", name)
            .addField("UUID", uuid)
            if(gexp != null) embed.addField("Guild Information", `GEXP: ${gexp}\n` + `Rank: ${gMember.rank}\n` +
            `Joined at: ${new Date(gMember.joined).toLocaleDateString()}`)

            // bedwars stats
            embed.addField("Bedwars Stats", `Level: ${player.achievements.bedwars_level}\n` + 
                `Winstreak: ${bwStats.winstreak}\n` +
                `Finals: ${bwStats.final_kills_bedwars}\n` +
                `FKDR: ${Number.parseFloat(bwStats.final_kills_bedwars/bwStats.final_deaths_bedwars).toFixed(2)}\n` +
                `Wins: ${bwStats.wins_bedwars}\n` + 
                `Beds: ${bwStats.beds_broken_bedwars}`)

            // duels stats
            embed.addField("Duels Stats", `Wins: ${duelsStats.wins}\n` + 
                `Kills: ${duelsStats.kills}\n` +
                `Winstreak: ${duelsStats.current_winstreak}\n` + 
                `Best Winstreak: ${duelsStats.best_overall_winstreak}\n` +
                `WLR: ${Number.parseFloat(duelsStats.wins/duelsStats.losses).toFixed(2)}\n` + 
                `KDR: ${Number.parseFloat(duelsStats.kills/duelsStats.deaths).toFixed(2)}`)

            // skywars stats
            embed.addField("Skywars Stats", `Level: ${player.achievements.skywars_you_re_a_star}\n` +
                `Wins: ${swStats.wins}\n` +
                `Kills: ${swStats.kills}\n` +
                `WLR: ${Number.parseFloat(swStats.wins/swStats.losses).toFixed(2)}\n` + 
                `KDR: ${Number.parseFloat(swStats.kills/swStats.deaths).toFixed(2)}`)

            // #InfluxOP
            embed.setFooter("#InfluxOP")

        await message.channel.send(embed);
        message.delete( {timeout: 2000} )
    }
}