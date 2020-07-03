const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
module.exports = {
	name: 'transfer',
	description: 'Transfers product access from one user to another.',
	arguments: [
        {
            label: 'From User'
        },
        {
            label: 'To User'
        },
        {
            label: 'Product ID'
        }
    ],
    guildOnly: false,
    userPermissions: [
        'MANAGE_ROLES'
    ],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 20,
	run: async (bot, message, args) => {
        var database = editJsonFile('database.json', {autosave: true})
        let users = database.get('users')
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        if (args.length !== 3) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Whitelist Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Incorrect arguments.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        if (!database.get('products.'+args[2])) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Whitelist Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Product ID not found.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        async function getMember(message, info, guild) {
            await guild.members.fetch()
            if (!info) return 
            var target;
            target = guild.members.cache.get(info);
            if (target) return target;
            target = guild.members.cache.find(u => u.user.id == info);
            if (target) return target;
            target = guild.members.cache.find(u => u.user.tag.includes(info));
            if (target) return target;
            target = guild.members.cache.find(u => u.displayName.includes(info));
            if (target) return target;
            return
        }
        let frommember = await getMember(message, args[0], guild)
        let tomember = await getMember(message, args[1], guild)
        if (users) {
            let entries = Object.entries(users)
            var set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[0] == args[0]} else {return false}})
            if (!set) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == args[0]} else {return false}})
            if (!set && frommember) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == frommember.user.id} else {return false}})
            var toset = entries.find(u => {if (u[1].verify.status == 'complete') {return u[0] == args[1]} else {return false}})
            if (!toset) toset = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == args[1]} else {return false}})
            if (!toset && tomember) toset = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == tomember.user.id} else {return false}})
            if (set && toset) {
                await bot.functions.revokeProduct(guild.members.cache.find(m => m.user.id == frommember.user.id), args[2])
                let sent = await bot.functions.giveProduct(guild.members.cache.find(m => m.user.id == tomember.user.id), args[2])
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Whitelist Information**')
                    .addField('Status', ':white_check_mark: **Complete!**', true)
                    .addField('Gave Product', args[2], true)
                    .addField('From User', set[1].robloxUsername, true)
                    .addField('To User', toset[1].robloxUsername, true)
                    .addField('DM Success', sent, true)
                    .setThumbnail(guild.iconURL())
                await message.channel.send(ThisEmbed)
                return
            } else if (!toset) {
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Whitelist Information**')
                    .addField('Status', ':x: **Incomplete!**', true)
                    .addField('Error', 'To User not found.', true)
                    .setThumbnail(guild.iconURL())
                await message.channel.send(ThisEmbed)
                return
            } else if (!fromset) {
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Whitelist Information**')
                    .addField('Status', ':x: **Incomplete!**', true)
                    .addField('Error', 'From User not found.', true)
                    .setThumbnail(guild.iconURL())
                await message.channel.send(ThisEmbed)
                return
            }
        } 
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Whitelist Information**')
            .addField('Status', ':x: **Incomplete!**', true)
            .addField('Error', 'Both users not found.', true)
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};