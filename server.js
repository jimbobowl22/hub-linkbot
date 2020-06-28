/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started.
*/
require('dotenv').config();
const express = require('express');
const Discord = require('discord.js');



const bot = new Discord.Client({
    presence: {
        status: 'dnd',
        activity: {
            name: 'with some Products.',
            type: 'PLAYING',
            url: process.env.HUB_URL
        }
    }
});
bot.on('ready', async () => {
    console.log('DISCORD | Online!')
    process.on('beforeExit', (code) => {
        client.setPresence({
            status: 'offline'
        })
        console.log('DISCORD | Offline!');
    });
});
bot.on('error', async (error) => {
    console.log(`DISCORD | Error ${error.name}: ${error.message} \n(File: ${error.fileName}, Line: ${error.lineNumber})\n${error.stack}`)
})
bot.on('message', async (message) => {
    console.log(message.content);
});
bot.login(process.env.BOT_TOKEN)

const app = express();
app.get('/', async (request, response) => {
    response.status(200);
    response.json({ status: 'ok', running: true })
})
const listener = app.listen(process.env.HUB_ACCESSPORT || 8080, async () => {
    console.log('WEB | Online!')
})