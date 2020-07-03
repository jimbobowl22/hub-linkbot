const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
module.exports = {
	name: 'whitelist',
	description: 'Gives a user access to a product.',
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
            target = guild.members.cache.find(u => u.user.id == message.mentions.users.first().id);
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
                let sent = await bot.functions.giveProduct(guild.members.cache.find(m => m.user.id == member.user.id), args[1])
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Whitelist Information**')
                    .addField('Status', ':white_check_mark: **Complete!**', true)
                    .addField('Gave Product', args[1], true)
                    .addField('To User', set[1].robloxUsername, true)
                    .addField('DM Success', sent, true)
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