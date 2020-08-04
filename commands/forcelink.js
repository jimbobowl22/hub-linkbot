const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
const { v5: uuid } = require('uuid');
const rbx = require('noblox.js');
module.exports = {
	name: 'forcelink',
	description: 'Forcefully links a selected Discord Account to your Registered User.',
	arguments: [
        {
            label: 'Discord User'
        },
        {
            label: 'ROBLOX ID'
        }
    ],
    guildOnly: false,
    userPermissions: [
        'MANAGE_ROLES'
    ],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 2,
	run: async (bot, message, args) => {
        var database = editJsonFile('database.json', {autosave: true})
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        async function getMember(message, info, guild) {
            await guild.members.fetch()
            if (!info) return 
            var target;
            target = guild.members.cache.get(info);
            if (target) return target;
            target = guild.members.cache.find(u => {if (message.mentions.users.first()) return u.user.id == message.mentions.users.first().id; else return false});
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
        var NotFound = false
        let robloxUser = await rbx.getPlayerInfo(args[1])
            .catch(err => {if (err) {NotFound = true}})
        if (robloxUser && NotFound == false && member) {
            let users = database.get('users')
            if (users) {
                let entries = Object.entries(users)
                let set = entries.find(u => u[1].robloxId == args[1])
                if (set) {
                    let index = set[0]
                    let value = set[1]
                    if (database.get('users.'+index+'.robloxUsername') !== robloxUser.username) database.set('users.'+index+'.robloxUsername', robloxUser.username)
                    if (value.verify.status == 'link') {
                        value.verify.value = member.user.id
                        value.verify.status = 'complete'
                        let ThisEmbed = new Discord.MessageEmbed()
                            .setColor(Number(process.env.BOT_EMBEDCOLOR))
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setTitle('**Force Link Information**')
                            .addField('Status', ':white_check_mark: **Complete!**', true)
                            .addField('User Linked', value.robloxUsername, true)
                            .setThumbnail(guild.iconURL())
                        await message.channel.send(ThisEmbed)
                    } else {
                        let ThisEmbed = new Discord.MessageEmbed()
                            .setColor(Number(process.env.BOT_EMBEDCOLOR))
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setTitle('**Force Link Information**')
                            .addField('Status', ':x: **Incomplete!**', true)
                            .addField('Error', 'User already linked.', true)
                            .setThumbnail(guild.iconURL())
                        return await message.channel.send(ThisEmbed)
                    }
                    database.set('users.'+index, value)
                    return
                }
            } 
            let index = uuid(args[1], process.env.UUID_NAMESPACE);
            let value = {
                robloxId: args[1],
                robloxUsername: robloxUser.username,
                verify: {
                    status: 'complete',
                    value: member.user.id
                },
                products: []
            }
            database.set('users.'+index, value)
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Force Link Information**')
                .addField('Status', ':white_check_mark: **Complete!**', true)
                .addField('User Linked', value.robloxUsername, true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
        } else {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Force Link Information**')
                .addField('Status', ':x: **Incomplete!**', true)
                .addField('Error', 'User not found.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
        }
	}
};