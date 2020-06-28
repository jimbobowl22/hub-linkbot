/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started.
*/
require('dotenv').config();
const Discord = require('discord.js');
const express = require('express');
const rateLimit = require("express-rate-limit");

// DISCORD CLIENT HANDLING
const bot = new Discord.Client({
    presence: {
        status: 'dnd',
        activity: {
            name: 'with some Products.',
            type: 'PLAYING'
        }
    }
});
bot.on('ready', async () => {
    console.log('DISCORD | Online!');
});
bot.on('error', async (error) => {
    console.log(`DISCORD | Error ${error.name}: ${error.message} \n(File: ${error.fileName}, Line: ${error.lineNumber})\n${error.stack}`)
})
bot.on('message', async (message) => {
    console.log(message.content);
});
bot.login(process.env.BOT_TOKEN)

// WEBAPP HANDLING
const app = express();
app.use(rateLimit({
  max: 60, // 60 requests max...
  windowMs: 0.5 * 60 * 1000, // ...for 0.5 minutes
  handler: async (request, response) => {
    response.status(403);
    response.json({ status: 'error', error: 'Too many requests' })
  }
}));
app.get('/', async (request, response) => {
    response.status(200);
    response.json({ status: 'ok', running: true })
});
app.use(async (request, response, next) => {
    response.status(404)
    response.json({ status: 'error', error: 'Path not found'})
});
const listener = app.listen(process.env.HUB_ACCESSPORT || 8080, async () => {
    console.log('WEB | Online!');
});

// PROCESS EXIT HANDLING
process.stdin.resume();
function exitHandler(options, exitCode) {
    if (bot.user) {
        bot.user.setPresence({
            status: 'invisible'
        });
        bot.destroy();
    }
    process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));