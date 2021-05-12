const Discord = require('discord.js');
const {myKey} = require("../config.json");
const fetch = require('node-fetch');
const moment = require('moment');

module.exports = function (channelID, client) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    const guild = `https://api.hypixel.net/guild?name=Influx&key=${myKey}`
    let data = []
    fetch(guild)
        .then(guildInfo => guildInfo.json())
        .then(guildInformation => {
            for (let i = 0; i < guildInformation.guild.members.length; i++) {
                const usernames = `https://api.mojang.com/user/profiles/${guildInformation.guild.members[i].uuid}/names`
                fetch(usernames)
                    .then(username => username.json())
                    .then(usernamesJson => {
                        let array = {
                            username: usernamesJson[usernamesJson.length - 1].name,
                            gexp: guildInformation.guild.members[i].expHistory[today]
                        };
                        data.push(array);
                        data.sort((a, b) => b.gexp - a.gexp);
                    });
            }
            setTimeout(function () {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Influx Daily GEXP Leaderboard ${moment.utc(today).format('DD/MM/YY')}`)
                    .setColor("GOLD")

                data.slice(0, 10)

                let description = "";

                for(let i = 0; i < 10; i++){
                    let stat = data[i];
                    let newAmount = stat.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    if (stat.gexp !== 0) {
                        description += `\`${i + 1}.\` ${stat.username} ${newAmount} Guild Experience\n`;
                        embed.setFooter("Rest could not be counted, as their daily GEXP is 0.")
                    }
                }

                embed.setDescription(description);

                setTimeout(function () {
                    client.channels.fetch(channelID).then(channel => {
                        channel.send(embed);
                    });
                })
            }, 2000);
        });
}