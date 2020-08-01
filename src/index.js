const Discord = require('discord.js');
const ping = require('minecraft-server-util');
const axios = require('axios');

require('dotenv').config();

const client = new Discord.Client();

// Set update interval time to 10 minute in production and 30 seconds for development
const interval = process.env.NODE_ENV === "production" ? 10 * 60 * 1000 : 30 * 1000;
let onlinePlayers = [];

client.once('ready', () => {
    console.log('Beep boop! I am ready!');
    // Check every minute to see if anyone is online
    update();
    setInterval(() => {
        update();
    }, interval);
})

client.login(process.env.BOT_TOKEN);

async function getServerData() {
    return await ping(process.env.MINECRAFT_SERVER, 25565);
}

async function update() {
    const serverData = await getServerData();
    console.log(serverData);

    // If no players are online, and no players were online on last check,
    //  then there is nothing to do
    if(serverData.onlinePlayers === 0 && onlinePlayers.length === 0) return;

    // Get an array of all players that are currently on the server
    let players = [];
    serverData.samplePlayers.forEach(player => {
        players.push(player.name);
    });

    // If nobody has joined or left the server, dop nothing
    if (players === onlinePlayers) return;

    // If a player is online, but is not in the onlinePlayers, then
    //  that player has just joined
    players.forEach(player => {
        if(!onlinePlayers.includes(player)) addPlayer(player);
    });
}