const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
module.exports = {
	name: 'profile',
	description: 'Displays all information stored about a user.',
	arguments: [
        {
            label: 'User'
        }
    ],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 5,
	run: async (bot, message, args) => {
        var database = editJsonFile('database.json', {autosave: true})
        let users = database.get('users')
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        async function getMember(message, info, guild) {
            await guild.members.fetch()
            if (!info) return guild.members.cache.find(u => u.user.id == message.author.id);
            var target;
            target = guild.members.cache.get(info);
            if (target) return target;
            target = guild.members.cache.find(u => u.user.id == info);
            if (target) return target;
            target = guild.members.cache.find(u => u.user.tag.includes(info));
            if (target) return target;
            target = guild.members.cache.find(u => u.displayName.includes(info));
            if (target) return target;
            return guild.members.cache.find(u => u.user.id == message.author.id);
        }
        let member = await getMember(message, args.join(' '), guild)
        if (users) {
            let entries = Object.entries(users)
            var set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[0] == args.join(' ')} else {return false}})
            if (!set) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].robloxId == args.join(' ')} else {return false}})
            if (!set) set = entries.find(u => {if (u[1].verify.status == 'complete') {return u[1].verify.value == member.user.id} else {return false}})
            if (set) {
                let index = set[0]
                let value = set[1]
                let finalProduct = [];
                value.products.forEach((v)=>{let { name }=database.get('products.'+v);if(name)finalProduct.push(`**${name}** \`${v}\``)})
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Profile Information**')
                    .addField('ROBLOX', `Username: \`${value.robloxUsername}\`\nID: \`${value.robloxId}\``, true)
                    .addField('Discord', `ID: \`${value.verify.value}\``, true)
                    .setThumbnail(guild.iconURL())
                if (finalProduct.length > 0) ThisEmbed.addField('Products',  finalProduct.join('\n'), true)
                await message.channel.send(ThisEmbed)
                return
            }
        } 
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Profile Information**')
            .addField('Error', ':x: **Not found!**')
            .setThumbnail(message.guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};