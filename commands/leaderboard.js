const Discord = require('discord.js');
const {token, prefix, myKey} = require('../config.json');
const fetch = require('node-fetch');

let data = [];

module.exports = {
    name: 'leaderboard',
    execute(message, args) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        const guild = `https://api.hypixel.net/guild?name=Influx&key=${myKey}`
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
                    let embed;
                    data.slice(0, 10)
                    let top1 = data[0];
                    let top2 = data[1];
                    let top3 = data[2];
                    let top4 = data[3];
                    let top5 = data[4];
                    let top6 = data[5];
                    let top7 = data[6];
                    let top8 = data[7];
                    let top9 = data[8];
                    let top10 = data[9];

                    let newAmount1 = top1.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount2 = top2.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount3 = top3.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount4 = top4.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount5 = top5.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount6 = top6.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount7 = top7.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount8 = top8.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount9 = top9.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let newAmount10 = top10.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    embed = new Discord.MessageEmbed()
                        .setTitle("INFLUX DAILY GEXP LEADERBOARD")
                        .setColor("GOLD")
                        .setDescription(
                            '`1.`' + ` ${top1.username}` + ` ${newAmount1}` + " Guild Experience\n" +
                            '`2.`' + ` ${top2.username}` + ` ${newAmount2}` + " Guild Experience\n" +
                            '`3.`' + ` ${top3.username}` + ` ${newAmount3}` + " Guild Experience\n" +
                            '`4.`' + ` ${top4.username}` + ` ${newAmount4}` + " Guild Experience\n" +
                            '`5.`' + ` ${top5.username}` + ` ${newAmount5}` + " Guild Experience\n" +
                            '`6.`' + ` ${top6.username}` + ` ${newAmount6}` + " Guild Experience\n" +
                            '`7.`' + ` ${top7.username}` + ` ${newAmount7}` + " Guild Experience\n" +
                            '`8.`'  + ` ${top8.username}` + ` ${newAmount8}` + " Guild Experience\n" +
                            '`9.`' + ` ${top9.username}` + ` ${newAmount9}` + " Guild Experience\n" +
                            '`10.`' + ` ${top10.username}` + ` ${newAmount10}` + " Guild Experience"
                        )
                        .setTimestamp()
                        .setFooter("Created with love by Frostingly™#6666");
                    setTimeout(function () {
                        message.guild.channels.cache.get("838858986575888435").send(embed);
                    }, 1000);
                }, 2000);
            });
    }
}