const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
module.exports = {
	name: 'link',
	description: 'Links your Discord Account to your Registered User with a code generated from the Hub.',
	arguments: [
        {
            label: 'Link Code'
        }
    ],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 10,
	run: async (bot, message, args) => {
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        var database = editJsonFile('database.json', {autosave: true})
        let users = database.get('users')
        if (users) {
            let entries = Object.entries(users)
            let set = entries.find(u => {if (u[1].verify.status == 'link') {return u[1].verify.value == args.join(' ')} else {return false}})
            if (set) {
                let index = set[0]
                let value = set[1]
                database.set('users.'+index+'.verify', {status:'complete',value:message.author.id})
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Link Information**')
                    .addField('Status', ':white_check_mark: **Complete!**', true)
                    .addField('Linked to', value.robloxUsername, true)
                    .setThumbnail(guild.iconURL())
                await message.channel.send(ThisEmbed)
                return
            }
        } 
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Link Information**')
            .addField('Status', ':x: **Incomplete!**', true)
            .addField('Error', 'Not a Link Code.', true)
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};