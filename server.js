/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started.
*/
require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
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
var guild;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.cooldown = new Discord.Collection();
for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    if (command.aliases) {
        for (const alias of command.aliases) {
            bot.aliases.set(alias, command);
        }
    }
}
bot.on('ready', async () => {
    guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD);
    console.log('DISCORD | Online!');
});
bot.on('error', async (error) => {
    console.log(`DISCORD | Error ${error.name}: ${error.message} \n(File: ${error.fileName}, Line: ${error.lineNumber})\n${error.stack}`)
})
bot.on('message', async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(process.env.BOT_PREFIX)) return
    const args = message.content.slice(process.env.BOT_PREFIX.length).split(/ +/);
	const index = args.shift().toLowerCase();
    var command = bot.commands.get(index)
    if (!command) command = bot.aliases.get(index)
    if (!command) return
    if (command.guildOnly && !message.guild) {
        let ThisEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Command is Guild Only**')
            .setDescription('Please run `'+process.env.BOT_PREFIX+index+args.map(a => ' '+a)+'` in the Discord Server.')
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
        return
    }
    if (message.guild) {
        let upermission = message.member.permissionsIn(message.channel)
        var matching = []
        for (permission of command.userPermissions) {
            if (!upermission.has(permission, true)) matching.push('`'+permission+'`')
        }
        if (matching.length > 0) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Permission denied**')
                .setDescription('You are missing the following permissions: '+matching.join(', '))
                .setThumbnail(message.guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let mepermission = message.guild.me.permissionsIn(message.channel)
        var matching = []
        for (permission of command.clientPermissions) {
            if (!mepermission.has(permission, true)) matching.push('`'+permission+'`')
        }
        if (matching.length > 0) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Insufficient Guild Permissions**')
                .setDescription('I am missing the following permissions: '+matching.join(', '))
                .setThumbnail(message.guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
    }
    if (command.cooldown) {
        if (bot.cooldown.get(`${command.name}-${message.author.id}`)) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Cooldown**')
                .setDescription('Please wait `'+command.cooldown+'` seconds.')
                .setThumbnail(message.guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        bot.cooldown.set(`${command.name}-${message.author.id}`, true);
        setTimeout(() => {
            bot.cooldown.set(`${command.name}-${message.author.id}`, false);
        }, command.cooldown * 1000)
    }
    command.run(bot, message, args)
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
app.get('/user/:robloxid', async (request, response) => {
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