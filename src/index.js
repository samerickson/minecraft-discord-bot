/* eslint-disable no-undef */
/*global require */
const Discord = require('discord.js');
const ping = require('minecraft-server-util');

require('dotenv').config();

const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

// Set update interval
const interval = process.env.INTERVAL;
let serverDown = false;
let playersChanged = false;
let onlinePlayers = [];

client.once('ready', () => {
    console.log('Beep boop! I am ready!');
    // Check every minute to see if anyone is online
    update();
    setInterval(() => {
        update();
    }, interval);
});

async function update() {
    const date = new Date( Date.now()).toUTCString();
    let serverData;

    // Ping minecraft server to get current online players
    //  or return if server is down
    try {
        serverData = await ping(process.env.MINECRAFT_SERVER, 25565);
    } catch(error) {
        if(!serverDown) {
            serverDown = true;
            sendMessage('🧨💥 The server has crashed...');
            console.log( date, ':: Server is offline');
        }
        return;
    }

    // If the server was down before, but is now back online, send a message!
    if(serverDown) {
        serverDown = false;
        sendMessage('😁 the server is back online!');
    }

    // If no players are online, and no players were online on last check,
    //  then there is nothing to do
    if(serverData.onlinePlayers === 0 && onlinePlayers.length === 0) return;

    // Get an array of all players that are currently on the server
    let players = [];
    if (serverData.samplePlayers != null) {
        serverData.samplePlayers.forEach(player => {
            players.push(player.name);
        });
    }

    // If nobody has joined or left the server, dop nothing
    if (players === onlinePlayers) return;

    // If a player is online, but is not in the onlinePlayers, then
    //  that player has just joined
    players.forEach(player => {
        if(!onlinePlayers.includes(player)) {
            addPlayer(player);
            playersChanged = true;
        }
    });

    // Check to make sure that all players that were online last update,
    //  are still online. If not remove them from onlinePlayers
    onlinePlayers.forEach(player => {
        if(!players.includes(player)) {
            removePlayer(player);
            playersChanged = true;
        }
    });

    // Only log output if there was a change in player activity
    if(playersChanged) {
        playersChanged = false;
        console.log(date, ':: Online Players = ', onlinePlayers);
    }
}

// Handles adding a player to onlinePlayers array and sending player joined message
//  to discord server
function addPlayer(player) {
    onlinePlayers.push(player);;
    sendMessage(`🎉 ${player} has hopped on the minecraft server`);
}

// Handles removing a player from onlinePlayers array and sends a respective,
//  message to discord server
function removePlayer(player) {
    onlinePlayers.splice(onlinePlayers.indexOf(player), 1);
    sendMessage(`😿 ${player} has left the minecraft server`);
}

// Sends a message to channel specified in process.env.DISCORD_CHANNEL_NAME
async function sendMessage(message) {
    await client.channels.fetch('739174083228598343').then((channel) => {
        const date = new Date( Date.now());
        
        channel.send(message);
        console.log(date.toUTCString(), `:: Sent message: "${message}"`);
    });
}
