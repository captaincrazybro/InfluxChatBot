const mc = require('minecraft-protocol');
const Discord = require('discord.js');
const axios = require('axios');
const channelId = "813632918249275432";
const discordBot = require('./discordChatBot');
const users = require('../users.json');
const fs = require('fs');
const guildId = "813586633252405258";
require('dotenv').config();
require('dotenv').config();

module.exports.run = async () => {

    // create connection to hypixel 

    let credentials = {
        host: "mc.hypixel.net",   // optional
        port: 25565,         // optional
        username: process.env.EMAIL,
        password: process.env.PASSWORD,
        auth: 'mojang' // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
    }

    var client = mc.createClient(credentials);

    console.log("[Chat] Chat Bot Started!");

    const bot = new Discord.Client();

    await bot.login(process.env.TOKEN);

    // gets the channel
    //let guild = bot.guilds.cache.get(guildId); 
    //console.log(guild);
    //if(!guild) guild = await bot.guilds.fetch(guildId, true);
    let channel = bot.channels.cache.get(channelId);
    if(!channel) channel = await bot.channels.fetch(channelId);

    module.exports.client = client;

    discordBot.setClient(client);

    client.on("error", (err) => {
        console.log(`[Chat] ` + err);
    });

    // sends bot to afk place so doesn't get spammed by
    setTimeout(() => {
        client.write('chat', {message:"/limbo"})
    }, 5000);
    
    client.on('chat', async function(packet) {

        // parses the message from the packet
        var jsonMsg = JSON.parse(packet.message);

        let message = jsonMsg.text;
        if(jsonMsg.extra){
            jsonMsg.extra.forEach(extra => {
                message += " " + extra.text;
            })
        }
        console.log(`[Chat] ` + message);

        // checks if the bot can get extra[0]
        if(jsonMsg.extra != undefined){

            // checks if it is a guild message
            if(jsonMsg.extra[0].text.startsWith("§2Guild > ")){

                // message is divided up with the spaces and it's the 4th string
                let username = jsonMsg.extra[0].text.split(" ")[2].startsWith("§7") ? jsonMsg.extra[0].text.split(" ")[2].replace("§7", "") : jsonMsg.extra[0].text.split(" ")[3];

                // makes sure username is not bot username
                if(username.toLowerCase() == client.username.toLowerCase()) return;

                // checks to see if it can get the actual message from the packet                
                if(jsonMsg.extra.length > 1){

                    // makes sure it's an actual guild message
                    if(jsonMsg.text == "Guild > " || !jsonMsg.extra[0].text.includes("§f:")) return;

                    let message = jsonMsg.extra[1].text;

                    if(message.includes("everyone")) return;

                    channel.send(`${username}: ${message}`)

                }

            }

            // dm commands
            if(jsonMsg.text == "From "){
                message = message.replace("From ", "");
                let sender;
                //if(message.split(":")[0].split(" ").length >= 2){
                  sender = message.split(":")[0].split(" ")[message.split(":")[0].split(" ").length - 2];
                //} else if(message.split(":")[0].split(" ").length == 3){
                //  
                //} else {
                //  sender = message.split(":")[0]
                //}
                
                let cmd = message.split(":")[1];
                let args = cmd.split(" ");
                args.shift();
                args.shift();

                //console.log(args)
                
                //if(args.length == 0) return sendMessage(client, sender, "Specify a command (message the bot 'help' for a list of commands)")

                if(args[0].toLowerCase() == "link"){

                    // makes sure the user included the code
                    if(args.length == 1) return sendMessage(client, sender, "Please specify a code.")

                    // makes sure the arg is a number
                    if(isNaN(args[1])) return sendMessage(client, sender, "Invalid code - Must be a number");
 
                    let code = parseInt(args[1]);
                    const currentlyLinking = require("./index").currentlyLinking;

                    // makes sure code exists
                    if(!currentlyLinking[code]) return sendMessage(client, sender, "Invalid code - Code does not exist");

                    let uuid = await getUuid(sender);

                    // links discord t o minecraft
                    users[currentlyLinking[code]] = uuid;

                    fs.writeFile('./users.json', JSON.stringify(users), err => {
                        if(err) console.log(`[Chat] ` + err);
                    })

                    sendMessage(client, sender, `Successfully linked your discord to your minecraft.`);

                    let guild = bot.guilds.cache.get(guildId); 
                    let member = await guild.members.fetch(currentlyLinking[code]);

                    member.setNickname(sender);

                }
                
            }
        }
    });

    // auto reconnect feature
    client.on('end', (packet) => {
        console.log(`[Chat] ` + packet);
        bot.destroy;
        module.exports.run();
    })

    client.on('disconnect', (packet) => {
        console.log(`[Chat] ` + packet);
        bot.destroy;
        module.exports.run();
    })

    client.on('kick_disconnect', (packet) => {
        console.log(`[Chat] ` + packet);
        bot.destroy;
        module.exports.run();
    })

}

async function getUuid(name) {
    if (name == null) return null;
    try {
        let { data } = await axios.post(`https://api.mojang.com/profiles/minecraft`, [name]);
        return data[0].id;

    }
    catch (e) {
        return undefined;
    }
}

function sendMessage(bot, username, message) {
    //console.log(`To ${username}: ${message}`)
    bot.write("chat", {message: `/msg ${username} ${message}`});
}