const mc = require('minecraft-protocol');
const Discord = require('discord.js');
const channelId = "770264950915596320";
const discordBot = require('./discordBot');
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

    console.log("Started!");

    const bot = new Discord.Client();

    await bot.login(process.env.TOKEN);

    // gets the channel
    let channel = bot.channels.get(channelId);

    module.exports.client = client;

    discordBot.setClient(client);

    client.on("error", (err) => {
        console.log(err);
    });

    // sends bot to afk place so doesn't get spammed by
    setTimeout(() => {
        client.write('chat', {message:"/limbo"})
    }, 5000);
    
    client.on('chat', function(packet) {

        // parses the message from the packet
        var jsonMsg = JSON.parse(packet.message);

        let messageToLog = jsonMsg.text;
        if(jsonMsg.extra){
            jsonMsg.extra.forEach(extra => {
                messageToLog += " " + extra.text;
            })
        }
        console.log(messageToLog);

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

                    channel.send(`${username}: ${message}`)

                }

            }
        }
    });

    // auto reconnect feature
    client.on('end', (packet) => {
        console.log(packet);
        bot.destroy;
        module.exports.run();
    })

    client.on('disconnect', (packet) => {
        console.log(packet);
        bot.destroy;
        module.exports.run();
    })

    client.on('kick_disconnect', (packet) => {
        console.log(packet);
        bot.destroy;
        module.exports.run();
    })

}