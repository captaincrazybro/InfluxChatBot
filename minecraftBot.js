const mc = require('minecraft-protocol');
const Discord = require('discord.js');
const channelId = "770264950915596320";
const guildId = "770262462070521857";
require('dotenv').config();

module.exports.run = async () => {

    // create connection to hypixel 
    var client = mc.createClient({
        host: "mc.hypixel.net",   // optional
        port: 25565,         // optional
        username: process.env.EMAIL,
        password: process.env.PASSWORD,
        auth: 'mojang' // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
    });

    console.log("Started!");

    const bot = new Discord.Client();

    await bot.login(process.env.TOKEN);

    // gets the channel
    let channel = bot.channels.get(channelId);

    // sends bot to afk place so doesn't get spammed by
    setTimeout(() => {
        client.write('chat', {message:"/limbo"})
    }, 3000);

    module.exports.client = client;

    client.on("error", (err) => {
        console.log(err);
        console.log(err.message.includes("ECON"))
    });
    
    client.on('chat', function(packet) {

        // parses the message from the packet
        var jsonMsg = JSON.parse(packet.message);

        // checks if the bot can get extra[0]
        if(jsonMsg.extra != undefined){

            // checks if it is a guild message
            if(jsonMsg.extra[0].text.startsWith("§2Guild > ")){

                // message is divided up with the spaces and it's the 4th string
                let username = jsonMsg.extra[0].text.split(" ")[3];

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

}