const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
module.exports = {
	name: 'revoke',
	description: 'Revokes a user access to a product.',
	arguments: [
        {
            label: 'User'
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
        if (args.length !== 2) {
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
        if (!database.get('products.'+args[1])) {
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
        let member = await getMember(message, args[0], guild)
        if (users) {
            let entries = Object.entries(users)
            var set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[0] == args[0]} else {return false}})
            if (!set) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == args[0]} else {return false}})
            if (!set && member) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == member.user.id} else {return false}})
            if (set) {
                await bot.functions.revokeProduct(guild.members.cache.find(m => m.user.id == member.user.id), args[1])
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Revoke Information**')
                    .addField('Status', ':white_check_mark: **Complete!**', true)
                    .addField('Revoked Product', args[1], true)
                    .addField('From User', set[1].robloxUsername, true)
                    .setThumbnail(guild.iconURL())
                await message.channel.send(ThisEmbed)
                return
            } else {
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Whitelist Information**')
                    .addField('Status', ':x: **Incomplete!**', true)
                    .addField('Error', 'User not found.', true)
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
            .addField('Error', 'User not found.', true)
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};