const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
require('dotenv').config();

module.exports = function (channelID, client) {
    // Date object initialized as per New Zealand timezone. Returns a datetime string
    let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

    today = nz_date_string.split(", ")[0];
    const guild = `https://api.hypixel.net/guild?name=Influx&key=${process.env.APIKEY}`
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
                    })
                    .then(() => {
                        if(data.length == guildInformation.guild.members.length){
                            let embed = new Discord.MessageEmbed()
                                .setTitle(`Influx Daily GEXP Leaderboard ${moment.utc(today).format('DD/MM/YY')}`)
                                .setColor("GOLD")

                            data.slice(0, 10)

                            let description = "";

                            for (let i = 0; i < 10; i++) {
                                let stat = data[i];
                                let newAmount = stat.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                if (stat.gexp !== 0) {
                                    description += `\`${i + 1}.\` ${stat.username} ${newAmount} Guild Experience\n`;
                                    //embed.setFooter("Rest could not be counted, as their daily GEXP is 0.")
                                }
                            }

                            embed.setDescription(description);

                            client.channels.fetch(channelID).then(channel => {
                                channel.send(embed);
                            });

                        }
                    })
            }
            /*try {
                setTimeout(function () {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Influx Daily GEXP Leaderboard ${moment.utc(today).format('DD/MM/YY')}`)
                        .setColor("GOLD")

                    data.slice(0, 10)

                    let description = "";

                    for (let i = 0; i < 10; i++) {
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
                }, 4000);
            } catch(err) {
                console.log("Failed" + err)
            }*/
        });
}