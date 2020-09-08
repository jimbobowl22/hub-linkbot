const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
module.exports = {
	name: 'forceunlink',
	description: 'Forcefully unlinks a selected Discord Account to your Registered User.',
	arguments: [
        {
            label: 'User'
        }
    ],
    guildOnly: false,
    userPermissions: [
        'MANAGE_ROLES'
    ],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 10,
	run: async (bot, message, args) => {
        var database = editJsonFile('database.json', {autosave: true})
        let users = database.get('users')
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
        let member = await getMember(message, args.join(' '), guild)
        if (users) {
            let entries = Object.entries(users)
            var set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[0] == args.join(' ')} else {return false}})
            if (!set) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == args.join(' ')} else {return false}})
            if (!set && member) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == member.user.id} else {return false}})
            if (set) {
                let index = set[0]
                let value = set[1]
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
                database.set('users.'+index+'.verify', {status:'link',value:linkCode})
                await bot.functions.updateMember(guild.members.cache.find(m => m.user.id == member.user.id))
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Force Unlink Information**')
                    .addField('Status', ':white_check_mark: **Complete!**', true)
                    .addField('User Unlinked', value.robloxUsername, true)
                    .setThumbnail(guild.iconURL())
                await message.channel.send(ThisEmbed)
                return
            } else {
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Force Unlink Information**')
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
            .setTitle('**Force Unlink Information**')
            .addField('Status', ':x: **Incomplete!**', true)
            .addField('Error', 'User not found.', true)
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};
