const Discord = require('discord.js');
const axios = require('axios');

require('dotenv').config();

const client = new Discord.Client();

// Set update interval time to 10 minute in production and 1 minute for development
const interval = if process.env.NODE_ENV === "production" ? 10 * 60 * 1000 : 60 * 1000;

client.once('ready', () => {
    console.log('Beep boop! I am ready!');

    // Check every minute to see if anyone is online
    setInterval(() => {
        getStatus();
    }, interval);
})

client.login(process.env.BOT_TOKEN)

// Gets the current number of players who are online, as well as their usernames
async function getStatus() {
    try {
        const { data: { players} } = await axios.get(`${process.env.STATUS_URL}`);
        console.log(players);
    } catch (error) {
        console.error(error);
    }
}