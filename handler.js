/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started. (Please run node server.js when starting up the bot, not node handler.js.)
*/
require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const express = require('express');
const request = require('request');
const requestIp = require('request-ip');
const rateLimit = require("express-rate-limit");
const editJsonFile = require('edit-json-file');
const { v5 } = require('uuid');
const rbx = require('noblox.js');
var http = require('http');
// var https = require('https');

// FILE CREATION HANDLING
fs.open(`database.json`,'r',function(err, fd){
    if (err) {
        console.log("PROCESS | No database found! Creating a new one...");
        fs.writeFile(`database.json`, '{}', function(err) {
            if(err) {
                console.log(err);
            }
            console.log("PROCESS | Database creation complete!");
        });
    } else {
        if (process.argv[2] !== '--restarted') console.log("PROCESS | Database found!");
    }
});
var dir = 'product-files';
if (!fs.existsSync(dir)){
    console.log("PROCESS | No Product-Files Folder! Creating a new one...");
    fs.mkdirSync(dir);
    console.log("PROCESS | Product-Files Folder creation complete!");
} else {
    if (process.argv[2] !== '--restarted') console.log("PROCESS | Product-Files Folder found!");
}

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
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.cooldown = new Discord.Collection();
bot.functions = {};
bot.functions.sendFile = async (member, pid) => {
    var database = editJsonFile('database.json', {autosave: true})
    let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
    let { name, path } = database.get('products.'+pid)
    let ThisEmbed = new Discord.MessageEmbed()
        .setColor(Number(process.env.BOT_EMBEDCOLOR))
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setTitle('**Product Received**')
        .addField('Product', name, true)
        .setThumbnail(guild.iconURL())
    var sent = true
    await member.send(ThisEmbed).catch(err => {
        sent = false
    })
    let file = new Discord.MessageAttachment(path, member.user.id+'-'+pid+'.'+path.split('.')[path.split('.').length - 1])
    await member.send(file).catch(err => {
        sent = false
    })
    return sent
};
bot.functions.updateMember = async (member) => {
    let guild = member.guild
    let roleResolved = guild.roles.cache.get(process.env.BOT_VERIFIEDROLEID)
    if (!guild.me.hasPermission('MANAGE_ROLES', true)) return false
    if (member.roles.highest.position >= guild.me.roles.highest.position) return false
    if (roleResolved.position >= guild.me.roles.highest.position) return false
    var database = editJsonFile('database.json', {autosave: true})
    let users = database.get('users')
    if (!users) return false
    let format = Object.entries(users)
    let the = format.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == member.user.id} else {return false}})
    if (the) {
        var NotFound = false
        let robloxUser = await rbx.getPlayerInfo(the[1].robloxId)
            .catch(err => {if (err) {NotFound = true}})
        if (NotFound) return false
        if (database.get('users.'+the[0]+'.robloxUsername') || database.get('users.'+the[0]+'.robloxUsername') !== robloxUser.username) database.set('users.'+the[0]+'.robloxUsername', robloxUser.username)
        if (!member.roles.cache.get(process.env.BOT_VERIFIEDROLEID)) await member.roles.add(roleResolved); 
        return robloxUser.username
    }
    else {if (member.roles.cache.get(process.env.BOT_VERIFIEDROLEID)) await member.roles.remove(roleResolved); return false}
};
bot.functions.giveProduct = async (member, pid) => {
    var database = editJsonFile('database.json', {autosave: true})
    let users = database.get('users')
    let format = Object.entries(users)
    let the = format.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == member.user.id} else {return false}})
    let index = the[0]
    let user = the[1]
    user.products.push(pid)
    database.set('users.'+index+'.products', user.products)
    return await bot.functions.sendFile(member, pid)
};
bot.functions.revokeProduct = (uid, pid) => {
    var database = editJsonFile('database.json', {autosave: true})
    let users = database.get('users')
    let format = Object.entries(users)
    let the = format.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == uid} else {return false}})
    let index = the[0]
    let user = the[1]
    user.products.splice(user.products.indexOf(pid), 1)
    database.set('users.'+index, user)
};
for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    if (command.aliases) {
        for (const alias of command.aliases) {
            bot.aliases.set(alias, command);
        }
    }
}
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
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Command is Guild Only**')
            .setDescription('Please run `'+process.env.BOT_PREFIX+index+args.map(a => ' '+a)+'` in the Discord Server.')
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed).then(m => m.delete({timeout: 3000}))
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
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
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
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Insufficient Guild Permissions**')
                .setDescription('I am missing the following permissions: '+matching.join(', '))
                .setThumbnail(message.guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
    }
    if (command.cooldown) {
        let current = bot.cooldown.get(`${command.name}-${message.author.id}`)
        if (!isNaN(current) && current > 0) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Cooldown**')
                .setDescription('Please wait `'+current+'` seconds.')
                .setThumbnail(message.guild.iconURL())
            await message.channel.send(ThisEmbed).then(m => m.delete({timeout: 3000}))
            return
        } else {
            bot.cooldown.set(`${command.name}-${message.author.id}`, command.cooldown);
            let cooldown = setInterval(async () => {
                let thecurrent = bot.cooldown.get(`${command.name}-${message.author.id}`)
                if (thecurrent <= 0) {
                    bot.cooldown.set(`${command.name}-${message.author.id}`, 0);
                    clearInterval(cooldown)
                    return
                }
                bot.cooldown.set(`${command.name}-${message.author.id}`, thecurrent - 0.5);
            }, 500)
        }
    }
    await command.run(bot, message, args)
});
bot.on('guildMemberAdd', async (member) => {
    await bot.functions.updateMember(member)
})
bot.on('error', async (error) => {
    console.error(error)
})

// WEBAPP HANDLING
const app = express();
app.use(rateLimit({
    max: 120, // 120 requests max...
    windowMs: 1 * 60 * 1000, // ...for 1 minute
    handler: async (request, response) => {
        response.status(403);
        response.json({ status: 'error', error: 'Request limit reached' })
    }
}));
app.use(async (request, response, next) => {
    if (!bot.user) {
        response.status(500)
        response.json({ status: 'error', error: 'Service unavailable'})
    } else next()
});
app.get('/', async (request, response) => {
    response.status(200);
    response.json({ status: 'ok', running: true })
});
app.get('/user/:robloxid/', async (request, response) => {
    if (!request.query.key || request.query.key !== process.env.HUB_APIKEY) {
        response.status(403);
        response.json({ status: 'error', error: 'Unauthorized request' })
        return
    }
    var database = editJsonFile('database.json', {autosave: true})
    var NotFound = false
    let robloxUser = await rbx.getPlayerInfo(request.params.robloxid)
        .catch(err => {if (err) {NotFound = true}})
    if (robloxUser && NotFound == false) {
        let users = database.get('users')
        if (users) {
            let entries = Object.entries(users)
            let set = entries.find(u => u[1].robloxId == request.params.robloxid)
            if (set) {
                let index = set[0]
                let value = set[1]
                if (database.get('users.'+index+'.robloxUsername') !== robloxUser.username) database.set('users.'+index+'.robloxUsername', robloxUser.username)
                response.status(200);
                response.json({ status: 'ok', index: index, value: value })
                return
            }
        } 
        function randomString(length, chars) {
            var mask = '';
            if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
            if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (chars.indexOf('#') > -1) mask += '0123456789';
            if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
            var result = '';
            for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
            var links = database.get('users')
            if (links) if (Object.values(links).find(k => {if (k.verify.status == 'link') {return k.verify.value == result} else {return false}})) return randomString(length, chars)
            return result;
        }
        let linkCode = randomString(6, 'a#');
        let index = v5(request.params.robloxid, process.env.UUID_NAMESPACE);
        let value = {
            robloxId: request.params.robloxid,
            robloxUsername: robloxUser.username,
            verify: {
                status: 'link',
                value: linkCode
            },
            products: []
        }
        database.set('users.'+index, value)
        response.status(200);
        response.json({ status: 'ok', index: index, value: value })
    } else {
        response.status(404);
        response.json({ status: 'error', error: 'Not found' })
    }
});
app.get('/game/', async (request, response) => {
    if (!request.headers["roblox-id"]) {
        response.status(400);
        response.json({ status: "error", error: "Not a ROBLOX Server.", message: "Stop snooping around this endpoint. >:(" });
        let ip = requestIp.getClientIp(request)
        if (ip) console.log("WEB | User attempt to  GET /game/ denied. (Not a ROBLOX server.) IP: " + requestIp.getClientIp(request))
        else console.log("WEB | User attempt to  GET /game/ denied. (Not a ROBLOX server.) IP not found! ")
        return;
    }
    if (!request.query.job) {
        response.status(400);
        response.json({
            status: "error",
            error: "Products do not work in Studio."
        });
        return;
    }
    let PlaceInfo = (await request.get(
        "https://api.roblox.com/marketplace/productinfo?assetId=" + request.headers["roblox-id"]
    )).data;
    var CreatorId = PlaceInfo.Creator.CreatorTargetId;
    if (PlaceInfo.Creator.CreatorType == "Group") {
        let GroupInfo = (await request.get(
            "https://groups.roblox.com/v1/groups/" + request.headers["roblox-id"]
        )).data;
        CreatorId = GroupInfo.owner.userId;
    }
    var database = editJsonFile('database.json', {autosave: true})
    let users = database.get('users')
    if (users) {
        let entries = Object.entries(users)
        let set = entries.find(u => u[1].robloxId == CreatorId)
        if (set) {
            let index = set[0]
            let value = set[1]
            if (database.get('users.'+index+'.robloxUsername') !== robloxUser.username) database.set('users.'+index+'.robloxUsername', robloxUser.username)
            response.status(200);
            response.json({ 
                status: "ok",
                place: {
                    CreatorType: PlaceInfo.Creator.CreatorType,
                    CreatorId: PlaceInfo.Creator.CreatorTargetId,
                    WhitelistOwner: CreatorId
                },
                products: value.products
            })
        }
    }
    response.status(404);
    response.json({ status: 'error', error: 'Not found' })
});
app.get('/products/', async (request, response) => {
    if (!request.query.key || request.query.key !== process.env.HUB_APIKEY) {
        response.status(403);
        response.json({ status: 'error', error: 'Unauthorized request' });
        return
    }
    var database = editJsonFile('database.json', {autosave: true})
    database.get('products')
    response.status(200);
    response.json({ status: 'ok', products: database.get('products') })
});
app.get('/products/give/:productid/:robloxid/', async (request, response) => {
    if (!request.query.key || request.query.key !== process.env.HUB_APIKEY) {
        response.status(403);
        response.json({ status: 'error', error: 'Unauthorized request' });
        return
    }
    var database = editJsonFile('database.json', {autosave: true})
    if (!database.get('products.'+request.params.productid)) {
        response.status(404);
        response.json({ status: 'error', error: 'Product not found' });
        return
    }
    let users = database.get('users')
    if (users) {
        let formatted = Object.entries(users)
        let me = formatted.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == request.params.robloxid} else {return false}})
        if (!me) {
            response.status(404);
            response.json({ status: 'error', error: 'User not found' });
            return
        }
        let user = me[1]
        if (user.products.find(r => r == request.params.productid)) {
            response.status(404);
            response.json({ status: 'error', error: 'Already owned' });
            return
        }
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        let sent = await bot.functions.giveProduct(guild.members.cache.find(m => m.user.id == user.verify.value), request.params.productid)
        response.status(200);
        response.json({ status: 'ok', success: true, dm: sent })
    }
});
app.get('/products/revoke/:productid/:robloxid/', async (request, response) => {
    if (!request.query.key || request.query.key !== process.env.HUB_APIKEY) {
        response.status(403);
        response.json({ status: 'error', error: 'Unauthorized request' });
        return
    }
    var database = editJsonFile('database.json', {autosave: true})
    if (!database.get('products.'+request.params.productid)) {
        response.status(404);
        response.json({ status: 'error', error: 'Product not found' });
        return
    }
    let users = database.get('users')
    if (users) {
        let formatted = Object.entries(users)
        let me = formatted.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == request.params.robloxid} else {return false}})
        if (!me) {
            response.status(404);
            response.json({ status: 'error', error: 'User not found' });
            return
        }
        let user = me[1]
        if (!user.products.find(r => r == request.params.productid)) {
            response.status(404);
            response.json({ status: 'error', error: 'Does not own product' });
            return
        }
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        bot.functions.revokeProduct(guild.members.cache.find(m => m.user.id == user.verify.value), request.params.productid)
        response.status(200);
        response.json({ status: 'ok', success: true })
    }
});
app.use(async (request, response, next) => {
    response.status(404)
    response.json({ status: 'error', error: 'Path not found'})
});

// PROCESS EXIT HANDLING
process.stdin.resume();
function exitHandler(options, exitCode) {
    if (bot.user) {
        bot.httpServer.close();
        bot.destroy();
    }
    process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// FULL SYSTEM LOGIN
bot.on('ready', async () => {
    let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD);
    let verifiedRole = guild.roles.cache.get(process.env.BOT_VERIFIEDROLEID);
    if (!guild) {
        console.log('DISCORD | Not in Primary Guild! Crashing...')
        process.exit()
    }
    if (!verifiedRole) {
        console.log('DISCORD | Verified Role not found! Crashing...')
        process.exit()
    }
    if (process.argv[2] !== '--restarted') console.info('DISCORD | Online!');
    
    // PROCESS RESTARTED HANDLING
    if (process.argv[2] == '--restarted') {
        fs.readFile('restart.json', 'utf8', async function (err, data) {
            if (err) console.log('PROCESS | Restarted, but no Restart Information was found!')
            else {
                let information = JSON.parse(data);
                let channel = await bot.channels.fetch(information.messageChannel)
                let msg = await channel.messages.fetch(information.message)
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(information.author.username, information.author.displayAvatarURL)
                    .setTitle('**Restart Information**')
                    .addField('Restart Status', ':white_check_mark: **Complete!**', true)
                    .addField('Restart Time', (Date.now() - information.initialized) / 1000 + ' seconds', true)
                    .setThumbnail(information.author.guildIcon)
                await msg.edit(ThisEmbed)
                console.log('PROCESS | Restarted!')
                fs.unlinkSync('restart.json') 
            } 
        });
    }
    else {
        console.info('PROCESS | Started!')
        fs.readFile('restart.json', 'utf8', async function (err, data) {
            if (err) return
            else {
                let information = JSON.parse(data);
                let channel = await bot.channels.fetch(information.messageChannel)
                let msg = await channel.messages.fetch(information.message)
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(information.author.username, information.author.displayAvatarURL)
                    .setTitle('**Restart Information**')
                    .addField('Restart Status', ':white_check_mark: **Manual restart complete!**', true)
                    .addField('Error Response Time', require('ms')(Date.now() - information.initialized), true)
                    .setThumbnail(information.author.guildIcon)
                await msg.edit(ThisEmbed)
                console.log('PROCESS | Corrected restart information!')
                fs.unlinkSync('restart.json') 
            } 
        });
    }
});
bot.login(process.env.BOT_TOKEN);
bot.httpServer = http.createServer(app).listen(process.env.PORT || process.env.HUB_ACCESSPORT || 8080)
if (process.argv[2] !== '--restarted') console.info('WEB | Online!');
