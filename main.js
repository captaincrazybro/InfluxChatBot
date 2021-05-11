const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const lb = require('./commands/leaderboard');
const {prefix, token} = require("./config.json");
const fs = require('fs')
const schedule = require('node-schedule');

const discordBot = require('./discordBot');
const minecraftBot = require('./minecraftBot');
const updateBlacklists = require('./updateBlacklists');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

function scheduleJob() {
    schedule.scheduleJob('5 30 **', function () {
        sendLeaderboard("838858986575888435");
    });
}

client.once('ready', function () {
    console.log("Hello World!");
    scheduleJob()
    discordBot.run();
});

client.login(token);

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.type == "dm") return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    }
    catch(error) {
        console.error(error);
    }
});






module.exports.setBot = (bot) => {
    /*setInterval(() => {
        updateBlacklists(bot);
    }, 43200000)*/
}

function sendLeaderboard(channelID) {
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
                embed = new Discord.MessageEmbed()
                    .setTitle("INFLUX DAILY GEXP LEADERBOARD")
                    .setColor("GOLD")
                    .setDescription(
                        '`1.`' + ` ${top1.username}` + ` ${top1.gexp}` + " Guild Experience\n" +
                        '`2.`' + ` ${top2.username}` + ` ${top2.gexp}` + " Guild Experience\n" +
                        '`3.`' + ` ${top3.username}` + ` ${top3.gexp}` + " Guild Experience\n" +
                        '`4.`' + ` ${top4.username}` + ` ${top4.gexp}` + " Guild Experience\n" +
                        '`5.`' + ` ${top5.username}` + ` ${top5.gexp}` + " Guild Experience\n" +
                        '`6.`' + ` ${top6.username}` + ` ${top6.gexp}` + " Guild Experience\n" +
                        '`7.`' + ` ${top7.username}` + ` ${top7.gexp}` + " Guild Experience\n" +
                        '`8.`'  + ` ${top8.username}` + ` ${top8.gexp}` + " Guild Experience\n" +
                        '`9.`' + ` ${top9.username}` + ` ${top9.gexp}` + " Guild Experience\n" +
                        '`10.`' + ` ${top10.username}` + ` ${top10.gexp}` + " Guild Experience"
                    )
                setTimeout(function () {
                    client.guild.channels.cache.get(channelID).send(embed);
                }, 1000);
            }, 2000);
        });
}